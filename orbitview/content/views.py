from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Post, Comment
from .serializers import PostSerializer, CommmentSerializer
from django.contrib.auth.models import User
from users.serializers import ProfileUserSerializer
from rest_framework.permissions import IsAdminUser


class PostListCreate(APIView):
    def get(self, request):
        posts = Post.objects.all().order_by('-date_posted')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class PostDetail(APIView):
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


class UserPostList(APIView):
    def get(self, request, user_name):
        queryset = Post.objects.filter(author__username=user_name)
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CommentListCreate(APIView):
    def get(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        comments = post.comments.all().order_by('-date_added')
        serializer = CommmentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        serializer = CommmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(post=post, name=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LikePost(APIView):
    """
    Handles liking and unliking a post.
    """

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        if request.user in post.likes.all():
            post.likes.remove(request.user)
            return Response({"message": "Post unliked."}, status=status.HTTP_200_OK)
        else:
            post.likes.add(request.user)
            return Response({"message": "Post liked."}, status=status.HTTP_200_OK)


class SavePost(APIView):
    """
    Handles saving and unsaving a post.
    """

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        if request.user in post.saves.all():
            post.saves.remove(request.user)
            return Response({"message": "Post unsaved."}, status=status.HTTP_200_OK)
        else:
            post.saves.add(request.user)
            return Response({"message": "Post saved."}, status=status.HTTP_200_OK)


class LikeComment(APIView):
    """
    Handles liking and unliking a comment.
    """

    def post(self, request, pk):
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
    