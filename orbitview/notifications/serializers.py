from rest_framework import serializers
from .models import Notification
from django.contrib.auth.models import User

class NotificationSerializer(serializers.ModelSerializer):
    content_type = serializers.StringRelatedField()
    content_object = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'user', 'notification_type', 'content_type', 'content_object', 'message', 'is_read', 'created_at', 'link', 'is_system']
    
    def get_content_object(self, obj):
        # Return the object that triggered the notification, like a post or comment
        return str(obj.content_object)
