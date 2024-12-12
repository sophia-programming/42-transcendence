import os

import requests
from accounts.models import CustomUser
from django.contrib.auth import login
from django.shortcuts import redirect, render
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def oauth_view(request):
    return redirect(
        f"https://api.intra.42.fr/oauth/authorize?client_id={os.environ.get('UID')}&redirect_uri=http://localhost:8000/oauth/callback/&response_type=code"
    )


@api_view(["GET"])
def oauth_callback_view(request):
    code = request.GET.get("code")
    error = request.GET.get("error")
    if error:
        return Response(
            {
                "error": error,
                "error_description": request.GET.get("error_description"),
            },
            status=400,
        )

    if code:
        response = requests.post(
            "https://api.intra.42.fr/oauth/token",
            data={
                "grant_type": "authorization_code",
                "client_id": os.environ.get("UID"),
                "client_secret": os.environ.get("SECRET"),
                "code": code,
                "redirect_uri": "http://localhost:8000/oauth/callback/",
            },
        )
        token_data = response.json()
        access_token = token_data.get("access_token")

        if access_token:
            user_info_response = requests.get(
                "https://api.intra.42.fr/v2/me",
                headers={"Authorization": f"Bearer {access_token}"},
            )

            user_info = user_info_response.json()
            username = user_info.get("login")

            user, created = CustomUser.objects.get_or_create(username=username)
            if created:
                user.set_unusable_password()
                user.save()

            login(request, user)
            return redirect("http://localhost:3000/#/")
    return Response(
        {
            "error": "No code provided",
            "error_description": "認証コードが提供されていません。",
        },
        status=400,
    )
