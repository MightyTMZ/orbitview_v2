from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from users.serializers import ProfileSerializer, ProfileUserSerializer
from .models import (
    Post, 
    Comment,
    Article
)



class PostSerializer(serializers.ModelSerializer):
    author = ProfileSerializer(source='author.profile', read_only=True)  # Use ProfileSerializer for the author field

    likes_count = serializers.SerializerMethodField()
    shares_count = serializers.SerializerMethodField()
    saves_count = serializers.SerializerMethodField()
    # we serialize this field because we want to give the 
    # content creator themselves an idea of how many people save their content
    # gives them extra motivation

    class Meta:
        model = Post
        fields = [
            'id',
            'title', 
            'content',
            'date_posted',
            'date_updated',
            'author',
            'public',
            'archived',
            'unlisted',
            # 'likes', too big to serialize
            'likes_count',
            'shares_count',
            'saves_count',
        ]
        

    def get_likes_count(self, obj):
        return obj.total_likes()
    
    def get_shares_count(self, obj):
        return obj.total_shares()
    
    def get_saves_count(self, obj):
        return obj.total_saves()



class CommentSerializer(serializers.ModelSerializer):
    content_type = serializers.SlugRelatedField(
        queryset=ContentType.objects.all(),
        slug_field='model'
    )
    object_id = serializers.IntegerField()
    content_object = serializers.SerializerMethodField()

    name = serializers.StringRelatedField()  # Show the user's string representation

    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'content_type',  # Model name (e.g., "post", "article")
            'object_id',     # ID of the content
            'content_object',  # Dynamic related content object
            'name',          # User who created the comment
            'body',          # Comment text
            'date_added',    # When the comment was added
            # 'likes',         # Wont show full list of users for now. but in the future this will be the Users who liked the comment
            'likes_count',
            'reply',         # If the comment is a reply
        ]
        read_only_fields = ['content_object', 'date_added', 'likes']

    def get_content_object(self, obj):
        """
        Fetch the related content object dynamically.
        """
        return str(obj.content_object)
    

    def get_likes_count(self, obj):
        return obj.total_likes()



class ArticleSerializer(serializers.ModelSerializer):

    author = ProfileUserSerializer(read_only=True)

    likes_count = serializers.SerializerMethodField()
    saves_count = serializers.SerializerMethodField()
    shares_count = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id',
            'title',
            'slug',
            'content',
            'slug',
            'author',
            'created_at',
            'updated_at',
            'featured_image',
            'public',
            'archived',
            'unlisted',
            'likes_count',
            'shares_count',
            'saves_count',
            'hide_likes_counts', # my spelling is so garbage LMAO
            'hide_shares_counts'
        ]

    def get_likes_count(self, obj):
        return obj.total_likes()
    
    def get_shares_count(self, obj):
        return obj.total_shares()
    
    def get_saves_count(self, obj):
        return obj.total_saves()