from django.db import models
from restauth.models import User

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField (max_length=250)
    likes = models.ManyToManyField(User ,blank=True, related_name="postlikes")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-id"]
        
    def __str__(self):
        return f"{self.author.username}'s post - {self.content} - {self.likes.count()} likes"

class FollowList(models.Model):
    source = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followings")
    target = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")

    def __str__(self):
        return f"{self.source.username} followed {self.target.username}"