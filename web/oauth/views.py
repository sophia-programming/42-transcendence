import os

import requests
from django.http import JsonResponse
from django.shortcuts import redirect


def oauth_view(request):
    return redirect(
        f"https://api.intra.42.fr/oauth/authorize?client_id={os.environ.get('UID')}&redirect_uri=http://localhost:8000/oauth/callback/&response_type=code"
    )


def oauth_callback_view(request):
    code = request.GET.get("code")
    error = request.GET.get("error")
    if error:
        return JsonResponse(
            {"error": error, "error_description": request.GET.get("error_description")}
        )

    if code:
        requests.post(
            "https://api.intra.42.fr/oauth/token",
            data={
                "grant_type": "authorization_code",
                "client_id": os.environ.get("UID"),
                "client_secret": os.environ.get("SECRET"),
                "code": code,
                "redirect_uri": "http://localhost:8000/oauth/callback/",
            },
        )
        return redirect("accounts:login")
    return JsonResponse({"error": "No code provided"})
