from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.PostListCreate.as_view(), name='post-list-create'),
    path('posts/<str:user_name>/', views.UserPostList.as_view(), name='user-post-list'),
    path('posts/<int:pk>/', views.PostDetail.as_view(), name='post-detail'),
    path('<str:content_type>/<int:object_id>/comments/', views.CommentListCreate.as_view(), name='comment-list-create'),
    path('posts/<int:pk>/like/', views.LikePost.as_view(), name='like-post'),
    path('posts/<int:pk>/save/', views.SavePost.as_view(), name='save-post'),
    path('comments/<int:pk>/like/', views.LikeComment.as_view(), name='like-comment'),
    path('posts/<int:pk>/likes/', views.PostLikesList.as_view(), name="list-of-users-likes"),
    path('posts/<int:pk>/shared/', views.PostSharesList.as_view(), name="list-of-users-shares"),
    path('posts/<int:pk>/saved/', views.PostSavesList.as_view(), name="list-of-users-saves"),
]
