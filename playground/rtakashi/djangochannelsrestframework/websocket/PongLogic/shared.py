import math
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer

class SharedState(AsyncWebsocketConsumer):
    lock = asyncio.Lock()
    class game_window():
            width = 1000
            height = 600

    class ball():
        radius = 10
        x = 500
        y = 300
        angle = 0
        velocity = 5
        direction = {
            "facing_up": False,
            "facing_down": False,
            "facing_right": False,
            "facing_left": False,
        }
        bound_angle = {
            "left_top": math.pi * 7 / 4,
            "left_bottom": math.pi / 4,
            "right_top": math.pi * 5 / 4,
            "right_bottom": math.pi * 3 / 4,
        }

    class paddle():
        width = 15
        height = 120
        left_y = 240
        right_y = 240

    class score():
        right = 0
        left = 0

    async def send_pos(self):
        response_message = {
            "left_paddle_y": self.paddle.left_y,
            "right_paddle_y": self.paddle.right_y,
            "ball_x": self.ball.x,
            "ball_y": self.ball.y,
            "left_score": self.score.left,
            "right_score": self.score.right,
        }
        await self.channel_layer.group_send(
            "sendmessage",
            {
                "type": "send_message",
                "content": response_message,
            },
        )

    async def send_message(self, event):
        # contentの中にある辞書を取り出し
        message = event["content"]
        # 辞書をjson型にする
        await self.send(text_data=json.dumps(message))

    async def handle_other_message(self, message):
        # その他のメッセージに対応する処理
        print(f"Other message received: {message}")
        response_message = {"message": f"Received: {message}"}
        await self.channel_layer.group_send(
            "sendmessage",
            {
                "type": "send_message",
                "content": response_message,
            },
        )
