from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from users.serializers import ProfileUserSerializer
from rest_framework.permissions import IsAdminUser
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from .models import Post, Comment, Article
from .serializers import PostSerializer, CommentSerializer, ArticleSerializer
from rest_framework.generics import ListCreateAPIView, ListAPIView
from .pagination import CustomPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import SearchFilter
from .filters import PostFilter, ArticleFilter
import random


class PostListCreateView(ListCreateAPIView):
    queryset = Post.objects.all().order_by('-date_posted')
    serializer_class = PostSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['author__profile__industry']
    filterset_class = PostFilter
    search_fields = ['title', 'content', 'author__username', "author__first_name", 'author__last_name']  # Add fields to search
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Post.objects.filter(
                Q(author__profile__is_private=False) | 
                Q(author__user__in=self.request.user.following.all())
            ).order_by('-date_posted')
        else:
            return Post.objects.filter(author__profile__is_private=False).order_by('-date_posted')

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'message': "Please sign in to create a post."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class ArticleListCreateView(ListCreateAPIView):
    queryset = Article.objects.all().order_by('-created_at')
    serializer_class = ArticleSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['author__profile__industry', 'author__profile__location']  # Add custom filterable fields
    filterset_class = ArticleFilter
    search_fields = ['title', 'content', 'author__username', 'author__first_name', 'author__last_name']  # Fields for searching
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Article.objects.filter(
                Q(author__profile__is_private=False) | 
                Q(author__user__in=self.request.user.following.all())
            ).order_by('-created_at')
        else:
            return Article.objects.filter(author__profile__is_private=False).order_by('-created_at')

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'message': "Please sign in to create an article."}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class PostDetail(APIView):

    permission_classes = []


    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        post = get_object_or_404(Post, pk=pk, author=request.user)
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk, author=request.user)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


class ArticleDetail(APIView):

    permission_classes = []

    def get(self, request, id, slug):
        article = get_object_or_404(Article, pk=id, slug=slug)
        # print(article)
        serializer = ArticleSerializer(article)
        # print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        article = get_object_or_404(Article, pk=id, author=request.user)
        serializer = ArticleSerializer(article, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        article = get_object_or_404(Article, pk=id, author=request.user)
        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


# the user's own list of posts that they can edit
# @method_decorator(cache_page(30), name='dispatch')  # Cache for 15 minutes
class UserPostList(ListAPIView):
    serializer_class = PostSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = PostFilter
    search_fields = ['title', 'content', 'author__username', "author__first_name", 'author__last_name']  # Add fields to search

    def get_queryset(self):
        user_name = self.kwargs['user_name']
        user = get_object_or_404(User, username=user_name)

        if user.profile.public:
            return Post.objects.filter(author__username=user_name).order_by('-date_posted')
        return Post.objects.none()  # Return empty queryset if private accounts are handled in the future

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class UserArticleList(ListAPIView):
    serializer_class = ArticleSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = ArticleFilter
    search_fields = ['title', 'content', 'author__username', 'author__first_name', 'author__last_name']  # Fields for searching

    def get_queryset(self):
        user_name = self.kwargs['user_name']
        return Article.objects.filter(author__username=user_name).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CommentListCreate(APIView):
    def get(self, request, content_type, object_id):
        # Retrieve the ContentType dynamically
        content_type_model = get_object_or_404(ContentType, model=content_type.lower())
        # Retrieve the comments for the specific object
        comments = Comment.objects.filter(
            content_type=content_type_model,
            object_id=object_id
        ).order_by('-date_added')

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, content_type, object_id):
        # Retrieve the ContentType dynamically
        content_type_model = get_object_or_404(ContentType, model=content_type.lower())

        # Pass data to the serializer
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            # Save the comment with generic relations
            serializer.save(
                content_type=content_type_model,
                object_id=object_id,
                name=request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LikePost(APIView):
    """
    Handles liking and unliking a post.
    """

    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        
        if request.user in post.likes.all():
            return Response({"liked": "liked"}, status=status.HTTP_200_OK)
        else:
            return Response({"liked": "not liked"}, status=status.HTTP_200_OK)


    def post(self, request, pk):
        if not request.user.is_authenticated:
            return Response({"error": "Please sign in to like. You must have an OrbitView account to like articles."}, status=status.HTTP_401_UNAUTHORIZED)
        
        post = get_object_or_404(Post, pk=pk)
        if request.user in post.likes.all():
            post.likes.remove(request.user)
            return Response({"message": "Post unliked.", "likes_count": post.likes_count}, status=status.HTTP_200_OK)
        else:
            post.likes.add(request.user)
            return Response({"message": "Post liked.", "likes_count": post.likes_count}, status=status.HTTP_200_OK)


class SavePost(APIView):
    """
    Handles saving and unsaving a post.
    """

    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        
        if request.user in post.saves.all():
            return Response({"saved": "saved"}, status=status.HTTP_200_OK)
        else:
            return Response({"saved": "not saved"}, status=status.HTTP_200_OK)
        
        # DO NOT show saves_count in this view


    def post(self, request, pk):
        if not request.user.is_authenticated:
            return Response({"error": "Please sign in to save. You must have an OrbitView account to save posts."}, status=status.HTTP_401_UNAUTHORIZED)
        
        post = get_object_or_404(Post, pk=pk)
        
        if request.user in post.saves.all():
            post.saves.remove(request.user)
            return Response({"message": "Post unsaved."}, status=status.HTTP_200_OK)
        else:
            post.saves.add(request.user)
            return Response({"message": "Post saved."}, status=status.HTTP_200_OK)


class LikeArticle(APIView):
    """
    Handles liking and unliking a post.
    """

    def get(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        
        if request.user in article.likes.all():
            return Response({"liked": "liked"}, status=status.HTTP_200_OK)
        else:
            return Response({"liked": "not liked"}, status=status.HTTP_200_OK)

    def post(self, request, pk):
        # check if the user is authenticated
        if not request.user.is_authenticated:
            return Response({"error": "Please sign in to like. You must have an OrbitView account to like articles."}, status=status.HTTP_401_UNAUTHORIZED)
        
        article = get_object_or_404(Article, pk=pk)
        
        if request.user in article.likes.all():
            article.likes.remove(request.user)
            return Response({"message": "Article unliked."}, status=status.HTTP_200_OK)
        else:
            article.likes.add(request.user)
            return Response({"message": "Article liked."}, status=status.HTTP_200_OK)


class SaveArticle(APIView):
    """
    Handles saving and unsaving a post.
    """
    def get(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        
        if request.user in article.likes.all():
            return Response({"saved": "saved"}, status=status.HTTP_200_OK)
        else:
            return Response({"saved": "not saved"}, status=status.HTTP_200_OK)

    def post(self, request, pk):
        if not request.user.is_authenticated:
            return Response({"error": "Please sign in to save. You must have an OrbitView account to save articles."}, status=status.HTTP_401_UNAUTHORIZED)
       
        article = get_object_or_404(Post, pk=pk)
        if request.user in article.saves.all():
            article.saves.remove(request.user)
            return Response({"message": "Post unsaved."}, status=status.HTTP_200_OK)
        else:
            article.saves.add(request.user)
            return Response({"message": "Post saved."}, status=status.HTTP_200_OK)


class LikeComment(APIView):
    """
    Handles liking and unliking a comment.
    """

    def post(self, request, pk):
        if not request.user.is_authenticated:
            return Response({"error": "Please sign in to like. You must have an OrbitView account to like comments."}, status=status.HTTP_401_UNAUTHORIZED)
        
        comment = get_object_or_404(Comment, pk=pk)

        if request.user in comment.likes.all():
            comment.likes.remove(request.user)
            return Response({"message": "Comment unliked."}, status=status.HTTP_200_OK)
        else:
            comment.likes.add(request.user)
            return Response({"message": "Comment liked."}, status=status.HTTP_200_OK)


# For fetching more information about posts (e.g. specific people who liked it)

class PostLikesList(APIView):

    # add pagination and as they scroll through the list, the frontend will fetch the api even further

    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        queryset = post.likes
        serializer = ProfileUserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class PostSharesList(APIView):

    # add pagination and as they scroll through the list, the frontend will fetch the api even further

    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        queryset = post.shares
        serializer = ProfileUserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class PostSavesList(APIView):

    # we don't want to share this information with others
    # the reels we save on instagram tend to be vulnerable information
    # only the OV recommendation system can get access to this

    permission_classes = [IsAdminUser]
    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        queryset = post.saves
        serializer = ProfileUserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class ArticleLikesList(APIView):

    # add pagination and as they scroll through the list, the frontend will fetch the api even further

    def get(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        queryset = article.likes
        serializer = ProfileUserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ArticleSharesList(APIView):

    # add pagination and as they scroll through the list, the frontend will fetch the api even further

    def get(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        queryset = article.shares
        serializer = ProfileUserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class ArticleSavesList(APIView):

    # we don't want to share this information with others
    # the reels we save on instagram tend to be vulnerable information
    # only the OV recommendation system can get access to this

    permission_classes = [IsAdminUser]
    def get(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        queryset = article.saves
        serializer = ProfileUserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

# /content/recommendations/posts/

class RecommendationFeedPosts(ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer
    pagination_class = CustomPagination

    def get(self, request, content_type):
        user = request.user
        possible_accounts = user.profile.following.all()
        posts = Post.objects.filter(author__profile__in=possible_accounts)

        # Shuffle the posts
        shuffled_posts = list(posts)
        random.shuffle(shuffled_posts)

        # Paginate the response
        page = self.paginate_queryset(shuffled_posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(shuffled_posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# /content/recommendations/articles/

class RecommendationFeedArticles(ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = ArticleSerializer
    pagination_class = CustomPagination

    def get(self, request, content_type):
        user = request.user
        possible_accounts = user.profile.following.all()
        
        articles = Article.objects.filter(author__profile__in=possible_accounts)
        # Shuffle the articles
        shuffled_articles = list(articles)
        random.shuffle(shuffled_articles)

        # Paginate the response
        page = self.paginate_queryset(shuffled_articles)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(shuffled_articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

