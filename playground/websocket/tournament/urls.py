from django.urls import path
from matches import views as matches_views  # matches/views.pyからインポート

from . import views  # tournament/views.pyからインポート

app_name = "tournament"
urlpatterns = [
    path("", views.TournamentView.as_view(), name="tournament"),
    path(
        "matches/", matches_views.matches_view, name="matches"
    ),  # matchesのビューを参照
]
