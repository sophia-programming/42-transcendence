from django.urls import path

from . import views

app_name = "accounts"
urlpatterns = [
    path("login/", views.TwoFactorLoginView.as_view(), name="login"),
    path("otp/", views.OTPView.as_view(), name="otp"),
    path("setup/", views.SetupView.as_view(), name="setup"),
    # path("signup/", views.SignUp.as_view(), name="signup"),
]
