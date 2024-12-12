from django.urls import path
from matches import views as matches_views  # matches/views.pyからインポート
from . import views  # tournament/views.pyからインポート
from django.urls import path
from .views import RecordMatchView

app_name = "tournament"
urlpatterns = [
    path("", views.TournamentView.as_view(), name="tournament"),
    path(
        "matches/", matches_views.matches_view, name="matches"
    ),  # matchesのビューを参照
]

urlpatterns = [
    path("record_match/", RecordMatchView.as_view(), name="record_match")
]