from django.test import TestCase
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient

from .models import Post, FollowList
# Create your tests here.

User = get_user_model()

class UserTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='abc', password='testpass')

    def testUserCreated(self):
        self.assertEqual(self.user.username, 'abc')

class PostTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='abc', password='testpass')
        User.objects.create_user(username='def', password='testpass')
        Post.objects.create(author=self.user, content='testpost1')
        Post.objects.create(author=self.user, content='testpost2')
        Post.objects.create(author=self.user, content='testpost3')
        Post.objects.create(author=self.user, content='testpost4')
        Post.objects.create(author=self.user, content='testpost5')

    def testPostCreated(self):
        post = Post.objects.get(content='testpost3')
        self.assertEqual(post.id, 3)
        self.assertEqual(post.author, self.user)

    def getApiClient(self):
        client = APIClient()
        client.login(username=self.user.username, password='testpass')
        return client
    
    def getApiClient2(self):
        client = APIClient()
        user = User.objects.get(id=2)
        client.login(username=user.username, password='testpass')
        return client

    def testPostsGet(self):
        client = self.getApiClient()
        response = client.get("/restapi/posts")
        self.assertEqual(len(response.json()), 5)
        self.assertEqual(response.status_code, 200)

    def testPostsPost(self):
        client = self.getApiClient()
        response = client.post("/restapi/posts", {"author": self.user, "content": 'testpost6'})
        post = Post.objects.get(content='testpost6')
        self.assertEqual(post.id, 6)
        self.assertEqual(response.status_code, 201)

    def testPostGet(self):
        client = self.getApiClient()
        response = client.get("/restapi/post/2")
        self.assertEqual(response.json().get('content'), 'testpost2')
        self.assertEqual(response.status_code, 200)

    def testPostPut(self):
        client = self.getApiClient()
        response = client.put("/restapi/post/1", {"content": "testedit"})
        post = Post.objects.get(content='testedit')
        self.assertEqual(post.id, 1)
        self.assertEqual(post.content, 'testedit')
        self.assertEqual(response.status_code, 200)

    def testPostPutForbidden(self):
        client = self.getApiClient2()
        response = client.put("/restapi/post/1", {"content": "testedit"})
        self.assertEqual(response.status_code, 403)

    def testPostDelete(self):
        client = self.getApiClient()
        response = client.delete("/restapi/post/3")
        self.assertEqual(response.status_code, 200)
        response = client.get("/restapi/post/3")
        self.assertEqual(response.status_code, 404)

    def testPostDeleteForbidden(self):
        client = self.getApiClient2()
        response = client.delete("/restapi/post/3")
        self.assertEqual(response.status_code, 403)

    def testLikePut(self):
        client = self.getApiClient()
        response = client.put("/restapi/post/2/like")
        self.assertEqual(response.status_code, 200)
        likedpost = Post.objects.get(id=2, likes__id=self.user.id)
        self.assertEqual(likedpost.id, 2)

    def testProfileGet(self):
        client = self.getApiClient()
        response = client.get("/restapi/user/2")
        self.assertEqual(response.json().get('username'), 'def')
        self.assertEqual(response.status_code, 200)

        response = client.get("/restapi/user/1337")
        self.assertEqual(response.status_code, 404)