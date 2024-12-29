from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.views import APIView
from django.middleware.csrf import get_token
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta
from .serializers import ProfileSerializer, FollowRequestSerializer, LoggedOnProfileSerializer
from .models import Profile, FollowRequest
from content.models import Post, Article
from django.db import transaction
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt




@method_decorator(cache_page(90), name='dispatch') # cache it for 90 seconds
class ProfileDetailAPIView(APIView):
    """
    Retrieve or update a user's profile.
    """

    permission_classes = []

    def get(self, request, username):
        profile = get_object_or_404(Profile, user__username=username)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def put(self, request, username):
        """
        Update the profile completely.
        """
        profile = get_object_or_404(Profile, user__username=username)
        
        # Ensure the user is updating their own profile
        if request.user != profile.user:
            return Response({"error": "You do not have permission to update this profile."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, username):
        """
        Partially update the profile.
        """
        profile = get_object_or_404(Profile, user__username=username)
        
        # Ensure the user is updating their own profile
        if request.user != profile.user:
            return Response({"error": "You do not have permission to update this profile."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    '''
    PATCH --> if request.user == self
    '''


class FollowUserAPIView(APIView):
    """
    Follow a user (handle private and public profiles).
    """
    def get(self, request, username):
        target_user = get_object_or_404(User, username=username)
        if target_user in request.user.profile.following.all():
            return Response({"following": "following"}, status=status.HTTP_200_OK)
        return Response({"following": "not following"}, status=status.HTTP_200_OK)


    def post(self, request, username):
        target_user = get_object_or_404(User, username=username)
        profile = get_object_or_404(Profile, user=target_user)
        sender_profile = get_object_or_404(Profile, user=request.user)

        # Check if already following
        if target_user in sender_profile.following.all():
            # Unfollow logic
            sender_profile.following.remove(target_user)
            profile.followers.remove(request.user)
            return Response(
                {"message": f"You have unfollowed {username}."},
                status=status.HTTP_200_OK,
            )

        # Handle private accounts (Follow Request)
        if profile.is_private:
            if FollowRequest.objects.filter(sender=request.user, receiver=target_user).exists():
                return Response(
                    {"message": "Follow request already sent."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            FollowRequest.objects.create(sender=request.user, receiver=target_user)
            return Response(
                {"message": f"Follow request sent to {username}."},
                status=status.HTTP_200_OK,
            )

        # Handle public accounts (Direct Follow)
        sender_profile.following.add(target_user)
        profile.followers.add(request.user)
        return Response(
            {"message": f"You are now following {username}."},
            status=status.HTTP_200_OK,
        )




class FollowRequestManageAPIView(APIView):
    """
    Accept or decline a follow request.
    """

    def post(self, request, request_id, action):
        follow_request = get_object_or_404(FollowRequest, id=request_id)
        if follow_request.receiver != request.user:
            return Response({"error": "Unauthorized action."}, status=status.HTTP_403_FORBIDDEN)

        if action == "accept":
            follow_request.is_accepted = True
            follow_request.save()

            # Update followers and following lists
            receiver_profile = get_object_or_404(Profile, user=request.user)
            sender_profile = get_object_or_404(Profile, user=follow_request.sender)

            receiver_profile.followers.add(follow_request.sender)
            sender_profile.following.add(request.user)

            return Response({"message": "Follow request accepted."}, status=status.HTTP_200_OK)

        elif action == "decline":
            follow_request.delete()
            return Response({"message": "Follow request declined."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)



class CustomLoginAPIView(APIView):

    permission_classes = []

    def post(self, request):
        username_or_email = request.data.get("username_or_email")
        password = request.data.get("password")
        save_info = request.data.get("save_info") # save login information? or not?

        # Check if the provided "username_or_email" is a username or an email
        user = None
        if '@' in username_or_email:  # It's an email
            user = User.objects.filter(email=username_or_email).first()
        else:  # It's a username
            user = User.objects.filter(username=username_or_email).first()

        if user is not None and user.check_password(password):
            # Create JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # fetch the user who just logged in
            profile = get_object_or_404(Profile, user__username=user.username)
            serializer = LoggedOnProfileSerializer(profile)
            
            response = JsonResponse({
                'message': "Login successful",
                'user_info': serializer.data,
            })

            print(response) # for testing purposes
            
            
            if save_info:
                print("Upon user request: Information is being saved")
                response.set_cookie(
                    'access_token',
                    refresh.access_token,
                    httponly=True,
                    secure=True,
                    samesite="Lax",
                    max_age=timedelta(days=1)
                )

                response.set_cookie(
                    'refresh_token',
                    str(refresh),
                    httponly=True,
                    secure=True,
                    samesite="Lax",
                    max_age=timedelta(days=7)
                )


            final_response = Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'logged_in_user': serializer.data,
                
            }, status=status.HTTP_200_OK)

            print({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'logged_in_user': serializer.data,
                
            }) # testing purposes ONLY'''

            return final_response
        
        print("Login FAILED!")
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
    


@csrf_exempt  # testing with client-side requests, you can exempt CSRF check
def search(request):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid HTTP method. Use GET."}, status=405)
    
    query = request.GET.get('query', None)

    if not query:
        return JsonResponse({"error": "Search query is required"}, status=400)

    # Search for users, posts, and articles using case-insensitive match
    profiles = Profile.objects.filter(
        Q(user__username__icontains=query) | Q(user__first_name__icontains=query) | Q(user__last_name__icontains=query)
    )[:5]  # Limit to 5 users for performance

    posts = Post.objects.filter(
        Q(title__icontains=query) | Q(content__icontains=query)
    )[:5]  # Limit to 5 posts for performance

    articles = Article.objects.filter(
        Q(title__icontains=query) | Q(content__icontains=query)
    )[:5]  # Limit to 5 articles for performance

    # Prepare data for response
    users_data = [{"username": profile.user.username, "first_name": profile.user.first_name, "last_name": profile.user.last_name} for profile in profiles]
    posts_data = [{"title": post.title, "content": post.content} for post in posts]
    articles_data = [{"title": article.title, "content": article.content} for article in articles]

    # Return search results as JSON
    return JsonResponse({
        "users": users_data,
        "posts": posts_data,
        "articles": articles_data,
    })



def csrf_token_view(request):
    return JsonResponse({'csrfToken': get_token(request)})