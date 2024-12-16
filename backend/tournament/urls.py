from django.urls import path

from . import views

# from matches import views as matches_views  # matches/views.pyからインポート


app_name = "tournament"
urlpatterns = [
    path(
        "api/register/",
        views.TournamentRegisterView.as_view(),
        name="tournament_register",
    ),
    # path(
    #     "matches/", matches_views.matches_view, name="matches"
    # ),  # matchesのビューを参照
]
