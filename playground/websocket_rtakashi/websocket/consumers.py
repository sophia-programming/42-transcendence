import json

from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio

class WebsocketConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.left_paddle_y = 0
        self.right_paddle_y = 0
        self.ball_x = 0
        self.ball_y = 0

    async def connect(self):
        # グループ定義しないと動かなかったです
        # 現在のwebsocketをsendmessageというグループに追加します
        await self.channel_layer.group_add("sendmessage", self.channel_name)
        print("Websocket connected")
        await self.accept()
        asyncio.create_task(self.game_loop())

    async def game_loop(self):
        while True:
            self.ball_x += 1
            self.ball_y += 1
            await self.send_pos()
            await asyncio.sleep(1)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("sendmessage", self.channel_name)
        print("Websocket disconnected")

    async def receive(self, text_data=None):
        data = json.loads(text_data)
        key = data.get("key")
        action = data.get("action")

        if key and action:
            print(f"Key: {key}, Action: {action}")
        if key == "D" and action == "pressed":
            self.left_paddle_y += 1
        elif key == "E" and action == "pressed":
            self.left_paddle_y -= 1
        elif key == "K" and action == "pressed":
            self.right_paddle_y += 1
        elif key == "I" and action == "pressed":
            self.right_paddle_y -= 1

        await self.send_pos()

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

    async def send_pos(self):
        response_message = {"left_paddle_y": self.left_paddle_y, "right_paddle_y": self.right_paddle_y, \
                            "ball_x": self.ball_x, "ball_y": self.ball_y}
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