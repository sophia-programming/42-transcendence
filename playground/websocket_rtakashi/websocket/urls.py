# from django.urls import path

# from . import views

# urlpatterns = [
#     path("", views.index, name="index"),
# ]

# 以下を追加
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameStatusViewSet

router = DefaultRouter()
router.register('status', GameStatusViewSet)

urlpatterns = [
    path('', include(router.urls)),
]