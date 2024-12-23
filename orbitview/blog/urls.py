from django.urls import path
from . import views


urlpatterns = [
    path('announcements/', views.AnnouncementList.as_view(), name="announcements-list"),
    path('announcements/<int:id>/', views.AnnouncementDetail.as_view(), name="announcements-detail"),
    path('blogs/', views.BlogList.as_view(), name="blog-list"),
    path('authors/', views.AuthorList.as_view(), name="authors-list"),
    path('authors/<int:id>/', views.AuthorDetail.as_view(), name="authors-detail"),
    path('articles/', views.ArticleList.as_view(), name="articles-list"),
    path('articles/<int:id>/', views.ArticleDetail.as_view(), name="article-detail"),
]