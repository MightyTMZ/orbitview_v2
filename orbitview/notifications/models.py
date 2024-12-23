from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Notification(models.Model):
    # Types of notifications
    NOTIFICATION_TYPES = [
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('follow', 'Follow'),
        ('mention', 'Mention'),
        ('system', 'System Alert'),
        ('message', 'Direct Message'),
        ('reminder', 'Reminder'),
    ]
    
    # Who will receive the notification
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    # Polymorphic relationship (can be any model)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    
    # The ID of the object that triggered the notification (post, comment, user, etc.)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    message = models.CharField(max_length=255)
    '''
    This field can be populated such as "Tom Zhang liked your post"
    '''
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # if you want to link the associated content object
    link = models.URLField(null=True, blank=True)
    
    # Whether this is a system-generated notification
    is_system = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - {self.notification_type} - {self.is_read}"

    def mark_as_read(self):
        self.is_read = True
        self.save()
        
    def mark_as_unread(self):
        self.is_read = False
        self.save()
