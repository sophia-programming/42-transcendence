from django.shortcuts import render


def index(request):
    return render(request, "websocket/index.html")
