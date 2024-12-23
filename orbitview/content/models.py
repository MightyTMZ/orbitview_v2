from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.urls import reverse
from django.core.exceptions import ValidationError
from ckeditor.fields import RichTextField
from django.core.validators import FileExtensionValidator
from bs4 import BeautifulSoup



# OrbitView will just support these for now, will support more in the future

class Post(models.Model):
    title = models.CharField(max_length=150)
    content = RichTextField(blank=True, null=True)
    date_posted = models.DateTimeField(default=timezone.now)
    date_updated = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, related_name="liked_posts", blank=True)
    saves = models.ManyToManyField(User, related_name="saved_posts", blank=True)
    shares = models.ManyToManyField(User, related_name="shared_posts", blank=True)

    def total_likes(self):
        return self.likes.count()

    def total_saves(self):
        return self.saves.count()
    
    def total_shares(self):
        return self.shares.count()

    def __str__(self):
        return f"{self.id}: {self.title}"

    def get_absolute_url(self):
        return reverse('post-detail', kwargs={"pk":self.pk})


'''
class PostAttachment(models.Model): # PDFs, files, images or any attachments people want to send
    file = models.FileField(upload_to=dynamic route that sorts the file attachments people put on)
    post = models.ForeignKey(Post)
'''

class Article(models.Model):

    # def validate_article
        # ensure the content in the rich text field is safe (no malicious scripts)
        # ensure there is no graphic or inappropriate content
        # ensure that the article's contents is not that long
    
    def validate_article(content):
        soup = BeautifulSoup(content, 'html.parser')

        for script_tag in soup.find_all('script'):
            raise ValidationError("Content contains malicious scripts, which are not allowed.")
        
    # make sure you scan for all dangerous content that people may put in this
        if len(content) > 20000:
            raise ValidationError("Article content is too long")
        

    title = models.CharField(max_length=255)
    content = RichTextField() #validators=validate_article)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    created_at = models.DateTimeField(auto_now_add=True)
    archived = models.BooleanField(default=False)
    unlisted = models.BooleanField(default=False)


    @property
    def public(self):
        return not self.archived and not self.unlisted

    def __str__(self):
        return self.title


class Comment(models.Model):
    # Generic relation to allow commenting on any model
    content_type = models.ForeignKey(
        ContentType, 
        on_delete=models.CASCADE, 
        limit_choices_to={'model__in': ('post', 'video', 'article')}  # Restrict to certain models, optional
    )
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    body = models.TextField(max_length=500)
    date_added = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name="liked_comments", blank=True)
    parent = models.ForeignKey(
        'self', 
        null=True, 
        blank=True, 
        related_name="children", 
        on_delete=models.CASCADE
    )  # Allow nested comments

    class Meta:
        ordering = ['-date_added']  # Newest comments first

    def total_likes(self):
        """Returns the total number of likes for this comment."""
        return self.likes.count()

    def is_parent(self):
        """Checks if this comment is a parent comment (not a reply)."""
        return self.parent is None

    def __str__(self):
        return f"Comment by {self.user.username} on {self.content_object} (ID: {self.id})"

    def get_absolute_url(self):
        """Returns the URL to the content this comment is associated with."""
        return reverse('content-detail', kwargs={"pk": self.object_id})


class Attachment(models.Model):
    # Generic relation to associate with any model

    # People can upload videos, spreadsheets, word documents, 
    # audio files, PDFs, images, etc. 

    ALLOWED_FILE_EXTENSIONS = [
        'jpg', 
        'png', 
        'pdf', 
        'webp',
        'docx', 
        'xlsx', 
        'xls', 
        'mp4', 
        'mp3'
    ]

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        limit_choices_to={
            'model__in': ('post', 'article', 'comment', 'video')  # Restrict to certain models (optional)
        }
    )
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    file = models.FileField(
        upload_to="attachments/%Y/%m/%d/",
        validators=[FileExtensionValidator(allowed_extensions=ALLOWED_FILE_EXTENSIONS)])
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['-uploaded_at']  # Newest attachments first

    def __str__(self):
        return f"Attachment for {self.content_object} (ID: {self.id})"

    def get_file_type(self):
        """Returns the type of file based on its extension."""
        extension = self.file.name.split('.')[-1].lower()
        return extension