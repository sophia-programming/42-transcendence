import json

from channels.generic.websocket import AsyncWebsocketConsumer


class WebsocketConsumer(AsyncWebsocketConsumer):
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

        # 辞書を作成
        messages = {
            "message": data.get("message"),
        }

        await self.channel_layer.group_send(
            "sendmessage",
            {
                "type": "send_message",  # websocket通信を受け取ったら下のsend_messageを呼び出す
                "content": messages,
            },
        )

    async def send_message(self, event):
        # contentの中にある辞書を取り出し
        message = event["content"]
        # 辞書をjson型にする
        await self.send(text_data=json.dumps(message))
