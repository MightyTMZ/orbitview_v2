from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.urls import reverse
from ckeditor.fields import RichTextField


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




class Comment(models.Model):
    post = models.ForeignKey(Post, related_name="comments" , on_delete=models.CASCADE)
    name = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name="blogcomment", blank=True)
    reply = models.ForeignKey('self', null=True, related_name="replies", on_delete=models.CASCADE)

    def total_clikes(self):
        return self.likes.count()

    def __str__(self):
        return '%s - %s - %s' %(self.post.title, self.name, self.id)

    def get_absolute_url(self):
        return reverse('post-detail', kwargs={"pk":self.pk})

