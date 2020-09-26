from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import csrf_exempt

from restauth.models import User
from .models import Post, FollowList
from .serializers import PostSerializer
from restauth.serializers import UserSerializer

@api_view(['GET', 'POST'])
def handleposts(request):
    if request.method == "GET":
        print(request.user)
        posts = Post.objects.all()
        serializer = PostSerializer(posts, context={'request': request}, many=True)
        return Response(serializer.data, status=200)

    elif request.method == "POST":
        if not request.user.is_authenticated:
            return Response({"Error": "You are not logged in"}, status=403)
        serializer = PostSerializer(data=request.data or None, context={'request': request})
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def handlepost(request, post_id):
    if request.method == "GET":
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=404)
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data, status=200)

    elif request.method == "PUT":
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=404)
        if post.author.id != request.user.id:
            return Response({"error": "You did not create this post"}, status=403)
        serializer = PostSerializer(post, data=request.data or None, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    elif request.method == "DELETE":
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=404)
        if post.author.id != request.user.id:
            return Response({"error": "You did not create this post"}, status=403)
        post.delete()
        return Response({"message": "Post removed successfully"})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def handlelike(request, post_id):
    user = request.user
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    try:
        tounlike = Post.objects.get(id=post_id, likes__id=request.user.id)
        tounlike.likes.remove(user)
        tounlike.save()
        serializer = PostSerializer(tounlike, context={'request': request})
        return Response(serializer.data, status=200)
    except Post.DoesNotExist:
        post.likes.add(user)
        post.save()
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data, status=200)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def handleprofile(request, user_name):
    if request.method == "GET":
        try:
            user = User.objects.get(username=user_name)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        serializer = UserSerializer(user, context={'request':request})
        return Response(serializer.data, status=200)
    elif request.method == "PUT":
        user = User.objects.get(id=request.user.id)
        try:
            user2 = User.objects.get(username=user_name)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        if user == user2:
            return Response({"error": "You can't follow yourself"}, status=400)
        try:
            tounfollow = FollowList.objects.get(source=user, target=user2)
            tounfollow.delete()
            serializer = UserSerializer(user2, context={'request':request})
            return Response(serializer.data, status=200)
        except FollowList.DoesNotExist:
            tofollow = FollowList.objects.create(source=user, target=user2)
            tofollow.save()
            serializer = UserSerializer(user2, context={'request':request})
            return Response(serializer.data, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def handleprofileposts(request, user_name):
    try:
        user = User.objects.get(username=user_name)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    posts = Post.objects.filter(author_id=user.id)
    serializer = PostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def handlefollowings(request, user_name):
    try:
        user = User.objects.get(username=user_name)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    followings = FollowList.objects.filter(source=user)
    ids = []
    for item in followings:
        ids.append(item.target_id)
    posts = Post.objects.filter(author_id__in=ids)
    serializer = PostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data, status=200)