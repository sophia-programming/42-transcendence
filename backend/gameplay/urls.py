from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameSettingViewSet

app_name = "gameplay"

router = DefaultRouter()
router.register(r'gamesetting', GameSettingViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]