from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.PostListCreateView.as_view(), name='post-list-create'),    
    path('posts/<int:pk>/', views.PostDetail.as_view(), name='post-detail'),
    path('posts/<str:user_name>/', views.UserPostList.as_view(), name='user-post-list'),

    path('articles/', views.ArticleListCreateView.as_view(), name='article-list-create'),
    path('articles/<int:id>/', views.ArticleDetail.as_view(), name='article-detail'),
    path('articles/<str:user_name>/', views.UserArticleList.as_view(), name='user-article-list'),
    
    path('<str:content_type>/<int:object_id>/comments/', views.CommentListCreate.as_view(), name='comment-list-create'),
    
    # Reacting to posts (liking, saving, sharing (coming soon))
    path('posts/<int:pk>/like/', views.LikePost.as_view(), name='like-post'),
    path('posts/<int:pk>/save/', views.SavePost.as_view(), name='save-post'),
    
    # Reacting to articles (liking, saving, sharing (coming soon))
    path('articles/<int:pk>/like/', views.LikeArticle.as_view(), name='like-article'),
    path('articles/<int:pk>/save/', views.SaveArticle.as_view(), name='save-article'),

    # Seeing the people who reacted posts
    path('posts/<int:pk>/likes/', views.PostLikesList.as_view(), name="post-list-of-users-likes"),
    path('posts/<int:pk>/shared/', views.PostSharesList.as_view(), name="post-list-of-users-shares"),
    path('posts/<int:pk>/saved/', views.PostSavesList.as_view(), name="post-list-of-users-saves"),
    
    # Seeing the people who reacted articles
    path('article/<int:pk>/likes/', views.ArticleLikesList.as_view(), name="post-list-of-users-likes"),
    path('article/<int:pk>/shared/', views.ArticleSharesList.as_view(), name="post-list-of-users-shares"),
    path('article/<int:pk>/saved/', views.ArticleSavesList.as_view(), name="post-list-of-users-saves"),
    
    # Liking comments
    path('comments/<int:pk>/like/', views.LikeComment.as_view(), name='like-comment'),
]
