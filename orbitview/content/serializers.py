from rest_framework import serializers
from users.serializers import ProfileSerializer
from .models import (
    Post, 
    Comment
)



class PostSerializer(serializers.ModelSerializer):
    author = ProfileSerializer(source='author.profile', read_only=True)  # Use ProfileSerializer for the author field

    class Meta:
        model = Post
        fields = [
            'id',
            'title', 
            'content',
            'date_posted',
            'date_updated',
            'author',
            'likes',
            'saves',
        ]



class CommmentSerializer(serializers.ModelSerializer):
    
    post = PostSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = [
            'id',
            'post', 
            'name',
            'body',
            'date_added',
            'likes',
            'reply',
        ]