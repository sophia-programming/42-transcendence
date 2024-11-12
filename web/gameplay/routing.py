from django.urls import path

from . import consumers

# websocket_urlpatterns = [
#     path("ws/websocket/", consumers.WebsocketConsumer.as_asgi()),
# ]

websocket_urlpatterns = [
    path("ws/gameplay/", consumers.WebsocketConsumer.as_asgi()),  # gameplay用WebSocketルート
]
