from django.urls import path

# from websocket.PongLogic import consumers
from websocket.PongLogic import consumers

websocket_urlpatterns = [
    path("ws/websocket/", consumers.PongLogic.as_asgi()),
]
