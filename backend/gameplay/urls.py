from django.contrib import admin
from django.urls import path
from rest_framework import routers
from .views import GameSettingViewSet

from . import views

app_name = "gameplay"

router = routers.DefaultRouter()
router.register(r"gamesetting", GameSettingViewSet)

urlpatterns = router.urls