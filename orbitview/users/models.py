from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from transformers import pipeline
from django.dispatch import receiver
from datetime import date


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
    image = models.ImageField(default='default.jpg', upload_to='profile_pics', blank=True, null=True)
    visible_to_search = models.BooleanField(default=False)
    # do they want to appear in natural language queries or not
    embedding = models.JSONField(null=True, blank=True) # store the embeddings
    

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

        self.followers.remove(follower_user)

    def add_following(self, user):
        if user == self.user:
            raise ValidationError("You cannot follow yourself.")
        self.following.add(user)

    def add_follower(self, user):
        if user == self.user:
            raise ValidationError("You cannot add yourself as a follower.")
        self.followers.add(user)

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