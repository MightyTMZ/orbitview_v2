from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta
from .serializers import ProfileSerializer, FollowRequestSerializer
from .models import Profile, FollowRequest


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
    
    '''
    PATCH --> if request.user == self
    '''


class FollowUserAPIView(APIView):
    """
    Follow a user (handle private and public profiles).
    """

    def post(self, request, username):
        target_user = get_object_or_404(User, username=username)
        profile = get_object_or_404(Profile, user=target_user)
        sender_profile = get_object_or_404(Profile, user=request.user)

        # If the account is private, create a follow request
        if profile.is_private:
            if FollowRequest.objects.filter(sender=request.user, receiver=target_user).exists():
                return Response({"message": "Follow request already sent."}, status=status.HTTP_400_BAD_REQUEST)
            FollowRequest.objects.create(sender=request.user, receiver=target_user)
            return Response({"message": f"Follow request sent to {username}."}, status=status.HTTP_200_OK)

        # If the account is public, follow directly
        sender_profile.following.add(target_user)
        profile.followers.add(request.user)
        return Response({"message": f"You are now following {username}."}, status=status.HTTP_200_OK)


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
            serializer = ProfileSerializer(profile)
            
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
                'user': serializer.data,
                
            }, status=status.HTTP_200_OK)

            '''print({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': serializer.data,
                
            }) # testing purposes'''

            return final_response
        
        print("Login FAILED!")
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)