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


class PostListCreate(APIView):

    permission_classes = []

    # add pagination
    def get(self, request):
        if request.user.is_authenticated:
            posts = Post.objects.filter(
                Q(author__profile__is_private=False) | 
                Q(author__user__in=request.user.following.all())
            ).order_by('-date_posted')
            
        else:
            posts = Post.objects.filter(author__profile__is_private=False).order_by('-date_posted')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'message': "Please sign in to create a post."})

        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# must be authenticated 
class ArticleListCreate(APIView):

    permission_classes = []

    # add pagination 
    def get(self, request):
        if request.user.is_authenticated:
            posts = Article.objects.filter(
                Q(author__profile__is_private=False) | 
                Q(author__user__in=request.user.following.all())
            ).order_by('-created_at')
            
        else:
            posts = Article.objects.filter(author__profile__is_private=False).order_by('-created_at')
        serializer = ArticleSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'message': "Please sign in to create a post."})
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

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

    def get(self, request, id):
        article = get_object_or_404(Article, pk=id)
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
class UserPostList(APIView):
    # get the cookies here
    
    permission_classes = []

    def get(self, request, user_name):
        user = get_object_or_404(User, username=user_name)

        if user.profile.is_private and not request.user.is_authenticated:
            return Response({'message': "This account is private. Follow to see posts and articles."}, 
                            status=status.HTTP_403_FORBIDDEN)
        
        elif user.profile.public: 
            queryset = Post.objects.filter(author__username=user_name).order_by('-date_posted')
            serializer = PostSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        elif user.profile.is_private and user in request.user.profile.following.all():
            queryset = Post.objects.filter(author__username=user_name).order_by('-date_posted')
        
            serializer = PostSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({'message': "This account is private. Follow to see posts and articles."}, 
                            status=status.HTTP_403_FORBIDDEN)

class UserArticleList(APIView):

    permission_classes = []

    def get(self, request, user_name):
        queryset = Article.objects.filter(author__username=user_name).order_by('-created_at')
        serializer = ArticleSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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

    def post(self, request, pk):
        # check if the user is authenticated
        if not request.user.is_authenticated:
            return Response({"error": "Please sign in to like. You must have an OrbitView account to like articles."}, status=status.HTTP_401_UNAUTHORIZED)
        
        article = get_object_or_404(Article, pk=pk)
        
        if request.user in article.likes.all():
            article.likes.remove(request.user)
            return Response({"message": "Post unliked."}, status=status.HTTP_200_OK)
        else:
            article.likes.add(request.user)
            return Response({"message": "Post liked."}, status=status.HTTP_200_OK)


class SaveArticle(APIView):
    """
    Handles saving and unsaving a post.
    """

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
    