from rest_framework import serializers
from .models import Profile, FollowRequest
from django.contrib.auth.models import User


# for creating users
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username', 
            'first_name',
            'last_name', 
            'email',
        ]



class UserSerializer(serializers.ModelSerializer):
    # used for moments when privacy is not a concern
    class Meta:
        model = User
        fields = ['id', 
                  'username', 
                  # 'email', privacy duh!
                  'first_name', 
                  'last_name']
        

class CurrentUserSerializer(serializers.ModelSerializer):
    # used for moments when privacy is not a concern
    class Meta:
        model = User
        fields = ['id', 
                  'username', 
                  'email', 
                  'first_name', 
                  'last_name']

# used when the user is actually logged on
class LoggedOnUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 
                  'username', 
                  'email', # notice that we include email this time
                  'first_name', 
                  'last_name']
        

class SimpleProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'image',
            'by_line',
            'is_online',
        ]


# for the views of retrieving the list of users who liked, shared, or saved a post
class ProfileUserSerializer(serializers.ModelSerializer):

    profile = SimpleProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name', 
            'last_name',
            'profile',
        ]



class ProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'user',
            'is_private',
            'is_online',
            # 'following',
            # 'followers',
            'bio',
            'by_line',
            'date_of_birth',
            'industry',
            'check_in_cycle_length',
            'visible_to_search',
            'interests_description',
            'skills_description',
            'hide_connection_list',
            'hide_followers_list',
            'location',
            'updated',
            'created',
            'image',
            'followers_count',
            'following_count',
        ]

    def get_followers_count(self, obj):
        return obj.get_followers_no()

    def get_following_count(self, obj):
        return obj.get_following_no()


class LoggedOnProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    user = LoggedOnUserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'user',
            'is_private',
            'is_online',
            # 'following',
            # 'followers',
            'bio',
            'by_line',
            'date_of_birth',
            'updated',
            'created',
            'image',
            'followers_count',
            'following_count',
        ]

    def get_followers_count(self, obj):
        return obj.get_followers_no()

    def get_following_count(self, obj):
        return obj.get_following_no()


class FollowRequestSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()
    receiver = serializers.StringRelatedField()

    class Meta:
        model = FollowRequest
        fields = [
            'sender',
            'receiver',
            'is_accepted',
            'timestamp',
        ]
