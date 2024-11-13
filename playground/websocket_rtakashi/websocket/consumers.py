import json

from channels.generic.websocket import AsyncWebsocketConsumer


class WebsocketConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.counter = 0

    async def connect(self):
        # グループ定義しないと動かなかったです
        # 現在のwebsocketをsendmessageというグループに追加します
        await self.channel_layer.group_add("sendmessage", self.channel_name)
        print("Websocket connected")
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("sendmessage", self.channel_name)
        print("Websocket disconnected")

    async def receive(self, text_data=None):
        print("Received websocket message", text_data)

        # 受けったデータに内容がなかったら終了
        if not text_data.strip():
            return
        try:
            # jsonをparseする
            data = json.loads(text_data)
        except json.JSONDecodeError as e:
            print(e)
            return
        
        message = data.get("message")

        if message == "E pressed!":
            await self.handle_e_pressed()
        elif message == "D pressed!":
            await self.handle_d_pressed()
        else:
            self.handle_other_message(message)

    async def handle_e_pressed(self):
        # "E pressed!" に対応する処理
        print("E key pressed action triggered!")
        self.counter -= 1
        await self.send_counter()

    async def handle_d_pressed(self):
        # "D pressed!" に対応する処理
        print("D key pressed action triggered!")
        self.counter += 1
        await self.send_counter()

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

    async def send_counter(self):
        response_message = {"message": f"Counter: {self.counter}"}
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
