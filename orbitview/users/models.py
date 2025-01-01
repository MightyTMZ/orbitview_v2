from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from transformers import pipeline
from django.dispatch import receiver
from datetime import date
from .industry_choices import INDUSTRIES



def validate_age(value):
    today = date.today()
    age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
    if age < 13:
        raise ValidationError('Users must be at least 13 years old to register.')

class Profile(models.Model):

    CHECK_IN_CYCLE_LENGTH_OPTIONS = [
        ("12h", '12 hours'),
        ("1D", '1 day (24 hours)'),
        ("2D", '2 days (48 hours)'),
        ("3D", '3 days (72 hours)'),
        ("5D", '5 days'),
        ("1W", '1 week (7 days)'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    is_private = models.BooleanField(default=False)  # Private account setting
    is_online = models.BooleanField(default=False)
    following = models.ManyToManyField(User, related_name="following", blank=True)
    followers = models.ManyToManyField(User, related_name='my_followers', blank=True)
    blocked = models.ManyToManyField(User, related_name="blocked_users", blank=True, symmetrical=False)
    restricted = models.ManyToManyField(User, related_name="restricted_users", blank=True, symmetrical=False)

    # "Do not show content from this producer"
    do_not_show = models.ManyToManyField(User, related_name="do_not_show_users", blank=True, symmetrical=False)

    hide_connection_list = models.BooleanField(default=False)
    hide_followers_list = models.BooleanField(default=False)

    location = models.CharField(max_length=100, null=True, blank=True)
    skills_description = models.TextField(max_length=2500, null=True, blank=True)
    interests_description = models.TextField(max_length=2500, null=True, blank=True)
    currently_working_on = models.TextField(max_length=2500, null=True, blank=True)
    check_in_cycle_length = models.CharField(max_length=255, choices=CHECK_IN_CYCLE_LENGTH_OPTIONS, default="2D")
    bio = models.CharField(default="", blank=True, null=True, max_length=350)
    by_line = models.CharField(max_length=60, default="-")
    date_of_birth = models.DateField(validators=[validate_age])
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    industry = models.CharField(max_length=50, choices=INDUSTRIES, blank=True, null=True)
    image = models.ImageField(default='default_pfp.jpg', upload_to='media/profile_pics', blank=True, null=True)
    visible_to_search = models.BooleanField(default=False)
    # do they want to appear in natural language queries or not
    embedding = models.JSONField(null=True, blank=True) # store the embeddings
    is_beta_user = models.BooleanField(default=True)

    class Meta:
        permissions = [
            ("can_edit_own_profile", "Can edit their own profile"),
        ]


    @property
    def public(self):
        return not self.is_private

    def profile_posts(self):
        return self.user.post_set.all()

    def get_followers(self):
        return self.followers.all()

    def get_followers_no(self):
        return self.followers.count()

    def get_following_no(self):
        return self.following.count()
    
    def remove_follower(self, follower_user):
        if follower_user == self.user:
            raise ValidationError("Something went wrong. Could not perform operation")

        elif not self.followers.filter(id=follower_user.id).exists():
            raise ValidationError(f"Unable to remove {follower_user.username}. They do not appear on your followers list.");

        self.followers.remove(follower_user)

    def add_following(self, user):
        if user == self.user:
            raise ValidationError("You cannot follow yourself.")

        elif self.following.filter(id=user.id).exists():
            raise ValidationError(f"You are already following {user.username}")
        
        self.following.add(user)

    def add_follower(self, user):
        if user == self.user:
            raise ValidationError("You cannot add yourself as a follower.")
        self.followers.add(user)

    def block_user(self, blocked_user):
        if blocked_user == self.user:
            raise ValidationError("You cannot block yourself")
        elif self.blocked.filter(id=blocked_user.id).exists():
            raise ValidationError(f"{blocked_user.username} is already blocked.")
        self.blocked.add(blocked_user)

    def unblock_user(self, blocked_user):
        if blocked_user == self.user:
            raise ValidationError("You cannot unblock yourself") #LMAO :)
        elif not self.blocked.filter(id=blocked_user.id).exists():
            raise ValidationError(f"{blocked_user.username} could not be unblocked as they are not on your blocked list.")
        self.blocked.remove(blocked_user)


    def restrict_user(self, restricted_user):
        if restricted_user == self.user:
            raise ValidationError("You cannot restrict yourself")
        elif self.restricted.filter(id=restricted_user.id).exists():
            raise ValidationError(f"{restricted_user.username} is already restricted.")
        self.restricted.add(restricted_user)

    def unrestrict_user(self, restricted_user):
        if restricted_user == self.user:
            raise ValidationError("You cannot unrestrict yourself") #LMAO :)
        elif not self.restricted.filter(id=restricted_user.id).exists():
            raise ValidationError(f"{restricted_user.username} could not be unrestricted as they are not on your restricted list.")
        self.restricted.remove(restricted_user)
            

    def __str__(self):
        return f'{self.user.username} Profile'
    
    def save(self, *args, **kwargs):
        if not self.embedding:
            embedder = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")
            text = f"{self.bio} {self.skills_description} {self.location} {self.currently_working_on}"
            self.embedding = embedder(text)[0]
        return super().save(*args, **kwargs)



class FollowRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_requests")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_requests")
    is_accepted = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username}"


    def accept(self):
        receiver_profile = self.receiver.profile
        sender_profile = self.sender.profile

        receiver_profile.add_follower(self.sender)
        sender_profile.add_following(self.receiver)

        self.is_accepted = True
        self.save()
