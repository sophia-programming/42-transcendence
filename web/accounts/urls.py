from django.urls import path

from . import views

app_name = "accounts"
urlpatterns = [
    path("login/", views.CustomLoginView.as_view(), name="login"),
    # path("signup/", views.SignUp.as_view(), name="signup"),
]
