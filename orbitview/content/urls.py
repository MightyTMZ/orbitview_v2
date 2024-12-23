from django.urls import path
from .views import (
    PostListCreate,
    PostDetail,
    CommentListCreate,
    LikePost,
    SavePost,
    LikeComment,
)

urlpatterns = [
    path('posts/', PostListCreate.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetail.as_view(), name='post-detail'),
    path('posts/<int:post_id>/comments/', CommentListCreate.as_view(), name='comment-list-create'),
    path('posts/<int:pk>/like/', LikePost.as_view(), name='like-post'),
    path('posts/<int:pk>/save/', SavePost.as_view(), name='save-post'),
    path('comments/<int:pk>/like/', LikeComment.as_view(), name='like-comment'),
]
