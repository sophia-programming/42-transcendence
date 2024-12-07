from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameStatusViewSet

router = DefaultRouter()
router.register('status', GameStatusViewSet)

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('api/', include(router.urls)),
]
