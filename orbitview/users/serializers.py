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
    class Meta:
        model = User
        fields = ['id', 
                  'username', 
                  # 'email', privacy duh!
                  'first_name', 
                  'last_name']


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
            'following',
            'followers',
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
