from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import User
from network.models import FollowList

class UserSerializer(serializers.ModelSerializer):
    followings = serializers.SerializerMethodField(read_only=True)
    followers = serializers.SerializerMethodField(read_only=True)
    isFollowing = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['username', 'followings', 'followers', 'isFollowing']

    def get_followings(self, user):
        return user.followings.count()

    def get_followers(self, user):
        return user.followers.count()

    def get_isFollowing(self, user):
        request = self.context.get('request')
        try:
            FollowList.objects.get(source=request.user, target=user)
            return True
        except FollowList.DoesNotExist:
            return False