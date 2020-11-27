from django.urls import path, include

from . import views

app_name = 'restauth'

urlpatterns = [
    # API Auth routes
    path("", views.checkoutLogged, name="checkout"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]