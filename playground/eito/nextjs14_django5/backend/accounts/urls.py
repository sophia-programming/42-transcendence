from accounts import views
from django.urls import path

urlpatterns = [
    path("users/<uid>/", views.UserDetailView.as_view()),
]
