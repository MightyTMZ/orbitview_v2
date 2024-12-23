from django.contrib import admin
from .models import (
    Post, 
    Comment
)


'''class CommentInline(admin.StackedInline):
    model = Comment
    extra = 3'''



@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    inlines = []