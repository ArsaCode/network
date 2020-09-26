
from django.urls import path

from . import views

urlpatterns = [
    # API Routes
    path("posts", views.handleposts, name="posts"),
    path("post/<int:post_id>", views.handlepost, name="post"),
    path("post/<int:post_id>/like", views.handlelike, name="like"),
    path("user/<str:user_name>", views.handleprofile, name="user"),
    path("user/<str:user_name>/posts", views.handleprofileposts, name="userposts"),
    path("user/<str:user_name>/followings", views.handlefollowings, name="followings")
]
