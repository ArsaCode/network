from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError

from .models import User
from .serializers import UserSerializer

# Create your views here.

@api_view(['GET'])
def checkoutLogged(request):

    if not request.user.is_authenticated:
        return Response({'isLogged': False}, status=404)
    else:
        user = User.objects.get(id=request.user.id)
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data, status=200)

@api_view(['POST'])
def login_view(request):

    if request.user.is_authenticated:
        return Response({'error': 'You are already logged in'}, status=403)

    try:
        username = request.data["username"]
        password = request.data["password"]
    except KeyError:
        return Response({'error': 'All fields are required'}, status=403)

    user = authenticate(request, username=username, password=password)

    # Check if authentication successful
    if user is not None:
        login(request, user)
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data, status=200)
    else:
        return Response({'error': 'Invalid username and/or password'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': f'User successfully logged out'}, status=200)

@api_view(['POST'])
def register(request):

    if request.user.is_authenticated:
        return Response({'error': 'You are already logged in'}, status=403)

    try:
        username = request.data["username"]
        email = request.data["email"]
        password = request.data["password"]
        confirmation = request.data["confirmation"]
    except KeyError:
        return Response({'error': 'All fields are required'}, status=403)

    if password != confirmation:
        return JsonResponse({"error": "Passwords must match"}, status=400)

    # Attempt to create new user
    try:
        user = User.objects.create_user(username, email, password)
        user.save()
    except IntegrityError:
        return Response({"error": "Username already exists"}, status=400)

    login(request, user)
    user = User.objects.get(id=request.user.id)
    serializer = UserSerializer(user, context={'request': request})
    return Response(serializer.data, status=201)