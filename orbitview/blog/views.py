from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import (
    Annoucement, 
    Blog, 
    Author, 
    Article)
from .serializers import (
    AnnouncementSerializer, 
    BlogSerializer, 
    AuthorSerializer, 
    ArticleSerializer    
)


# All the announcements OrbitView releases
class AnnouncementList(APIView):
    def get(self, request):
        announcements = Annoucement.objects.all()
        serializer = AnnouncementSerializer(announcements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

# Detailed view of an announcement
class AnnouncementDetail(APIView):
    def get(self, request, id):
        announcement = Annoucement.objects.get(id=id)
        serializer = AnnouncementSerializer(announcement)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class BlogList(APIView):
    def get(self, request):
        blogs = Blog.objects.all()
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AuthorList(APIView):
    def get(self, request):
        authors = Author.objects.all()
        serializer = AuthorSerializer(authors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class AuthorDetail(APIView):
    def get(self, request, id):
        author = Author.objects.get(id=id)
        serializer = AuthorSerializer(author)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ArticleList(APIView):
    def get(self, request):
        articles = Article.objects.filter(is_published=True)  # Only return published articles
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ArticleDetail(APIView):
    def get(self, request, id):
        articles = Article.objects.get(id=id)  # Only return published articles
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
