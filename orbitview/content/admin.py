from django.contrib import admin
from .models import (
    Post, 
    Comment,
    Article,
)


'''class CommentInline(admin.StackedInline):
    model = Comment
    extra = 3'''



@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'author',
        'date_posted',
        'date_updated',
        'likes_count',
        'saves_count',
        'shares_count',
        'archived',
        'unlisted',
    )


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'author',
        'created_at',
        'updated_at',
        'archived',
        'unlisted',
        'likes_count',
        'saves_count',
        'shares_count',
    )