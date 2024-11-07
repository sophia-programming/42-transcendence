from django.contrib import admin
from django.urls import path
from homepage.views import homepage
from play1vs1.views import play1vs1

urlpatterns = [
    path("admin/", admin.site.urls),
	path("homepage/", homepage),
	path("play1vs1/", play1vs1),
]
