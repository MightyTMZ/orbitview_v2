from rest_framework import serializers
from .models import (
    Annoucement, 
    Blog, 
    Author, 
    Article,
)


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annoucement
        fields = [
            'title', 
            'cover_img', 
            'description',
            'created_at', 
            'updated_at',
        ]


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = [
            'title',
            'hidden',
        ]


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = [
            'first_name',
            'last_name',
            'user'
        ]



class ArticleSerializer(serializers.ModelSerializer):
    
    authors = AuthorSerializer(many=True, read_only=True)
    blog = BlogSerializer(read_only=True)

    class Meta:
        model = Article
        fields = [
            'created_at_date',
            'title',
            'subtitle',
            'slug', 
            'content',
            'preview_content',
            'authors',
            'created_at', 
            'updated_at',
            'is_published', 
            'featured_image',
            'label',
            'blog',
        ]