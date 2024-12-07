from django.shortcuts import render


def index(request):
    return render(request, "websocket/index.html")

from rest_framework import permissions, viewsets

from .models import GameStatus
from .serializers import GameStatusSerializer


class GameStatusViewSet(viewsets.ModelViewSet):

    queryset = GameStatus.objects.all()
    serializer_class = GameStatusSerializer
