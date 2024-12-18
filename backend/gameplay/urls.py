from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameSettingViewSet
from . import views

app_name = "gameplay"

router = DefaultRouter()
router.register(r'gamesetting', GameSettingViewSet)

urlpatterns = [
	path("", views.playpage, name="gameplay"),
    path('api/', include(router.urls)),
]