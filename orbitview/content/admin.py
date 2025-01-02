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

    def save_model(self, request, obj, form, change):
        # Automatically set the author to the current logged-in user
        obj.author = request.user
        obj.save()

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_superuser:
            return queryset  # Superusers can see all
        elif request.user.is_authenticated:
            return queryset.filter(author=request.user)  # Beta users can only see their own posts
        return queryset.none()  # Non-beta users see nothing

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True  # Superusers can edit anything
        if obj is not None and obj.author == request.user:
            return True  # Users can edit their own posts
        return False

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True  # Superusers can delete anything
        if obj is not None and obj.author == request.user:
            return True  # Users can delete their own posts
        return False


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    fields = ['title', 'subtitle', 'content', 'featured_image', 'archived', 'unlisted']

    def save_model(self, request, obj, form, change):
        obj.author = request.user
        obj.save()


    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_superuser:
            return queryset  # Superusers can see all
        elif request.user.is_authenticated:
            return queryset.filter(author=request.user)  # Beta users can only see their own posts
        return queryset.none()  # Non-beta users see nothing

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True  # Superusers can edit anything
        if obj is not None and obj.author == request.user:
            return True  # Users can edit their own posts
        return False

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True  # Superusers can delete anything
        if obj is not None and obj.author == request.user:
            return True  # Users can delete their own posts
        return False
