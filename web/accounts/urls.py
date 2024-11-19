from django.urls import path

from . import views

app_name = "accounts"
urlpatterns = [
    path("login/", views.CustomLoginView.as_view(), name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("signup/", views.SignUpView.as_view(), name="signup"),
    path("setup-otp/", views.SetupOTPView.as_view(), name="setup_otp"),
    path("verify-otp/", views.VerifyOTPView.as_view(), name="verify_otp"),
    path("", views.HomeView.as_view(), name="home"),
]
