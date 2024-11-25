from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("api/auth/", include("djoser.urls")),
    path("api/auth/", include("djoser.urls.jwt")),
    path("api/", include("accounts.urls")),
    path("admin/", admin.site.urls),
]
