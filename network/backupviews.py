from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils.http import is_safe_url
from django.conf import settings

import random

from .forms import PostForm
from .models import User, Post

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

def index(request):
    return render(request, "network/index.html", status=200)

def createpost(request):
    form = PostForm(request.POST or None)
    next_url = request.POST.get("next") or None
    if form.is_valid():
        obj = form.save(commit=False)
        user = User.objects.get(id=request.user.id)
        obj.author = user
        obj.save()
        return JsonResponse(obj.serialize(), status=201)
    else:
        return JsonResponse({"error": "Post too long (250 characters max"}, status=400)

def viewpost(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)
    return JsonResponse(post.serialize(), status=200)

def loadview(request, viewname):
    if viewname == "allposts":
        qs = Post.objects.all()
        postslist = [post.serialize() for post in qs]
        data = {
            "response": postslist
        }
        return JsonResponse(data, status=200)

    else:
        return JsonResponse({"message": "fu"}, status=404)

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            ## return JsonResponse({request.user}, status=200)
            return JsonResponse({"message": "User logged in successfully"}, status=200)
        else:
            return JsonResponse({"error": "Invalid username and/or password"}, status=400)
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")