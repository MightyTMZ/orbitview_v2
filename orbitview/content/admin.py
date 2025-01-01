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
    fields = ['title', 'content', 'archived', 'unlisted']


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    fields = ['title', 'subtitle', 'content', 'featured_image', 'archived', 'unlisted']
