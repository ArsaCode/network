from rest_framework import serializers
from .models import Post, FollowList
from restauth.models import User

class PostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField(read_only=True)
    timestamp = serializers.SerializerMethodField(read_only=True)
    isAuthor = serializers.SerializerMethodField(read_only=True)
    isLiking = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'likes', 'timestamp', 'isAuthor', 'isLiking']
        extra_kwargs = {
            'author': {'required': False}
        }
    
    def get_author(self, post):
        return post.author.username
    
    def get_timestamp(self, post):
        return post.timestamp.strftime("%b %-d %Y, %-I:%M %p")

    def get_isAuthor(self, post):
        request = self.context.get('request')
        if request.user.id != post.author_id:
            return False
        return True     

    def get_isLiking(self, post):
        request = self.context.get('request')
        try:
            Post.objects.get(id=post.id, likes__id=request.user.id)
            return True
        except Post.DoesNotExist:
            return False