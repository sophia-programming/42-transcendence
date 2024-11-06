from django.urls import path

from . import views

app_name = "customLogin"
urlpatterns = [
    path("create_user/", views.UserCreate.as_view(), name="user_create"),
    path("create_user_done/", views.UserCreateDone.as_view(), name="user_create_done"),
    path(
        "create_user_complete/<token>/",
        views.UserCreateComplete.as_view(),
        name="user_create_complete",
    ),
    path("", views.CustomLoginView.as_view(), name="login"),
]
