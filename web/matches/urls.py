from django.urls import path

from . import views

app_name = "matches"
urlpatterns = [
    path("", views.matches_view, name="matches"),
]
