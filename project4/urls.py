from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("", include("frontend.urls")),
    path("admin/", admin.site.urls),
    path("restapi/", include("network.urls")),
    path("restauth/", include("restauth.urls"))
]
