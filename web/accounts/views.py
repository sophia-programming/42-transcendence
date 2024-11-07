from django.contrib.auth.views import LoginView
from django.shortcuts import render


class CustomLoginView(LoginView):
    template_name = "accounts/login.html"
