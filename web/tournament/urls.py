from django.urls import path

from . import views

app_name = "tournament"
urlpatterns = [
    path("", views.TournamentView.as_view(), name="tournament"),
]
