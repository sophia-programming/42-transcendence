import json

from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import random
import math
from .utils import Utils
from .shared import game_window, ball, paddle

from channels.db import database_sync_to_async
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
from djangochannelsrestframework.observer.generics import (
    ObserverModelInstanceMixin,
    action,
)
from websocket.serializers import GameStateSerializer

TASK = {}

class Singleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls, *args, **kwargs)
        return cls._instance

class SharedGameState:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls, *args, **kwargs)
            cls._instance.game_window = game_window()
            cls._instance.ball = ball()
            cls._instance.paddle = paddle()
            # cls._instance.c = PongLogic()
        return cls._instance

# ObserverModelInstanceMixinはなくても良いかも？
class GameStateConsumer(GenericAsyncAPIConsumer, ObserverModelInstanceMixin, Singleton):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.shared_state = SharedGameState()

    from websocket.models import GameState

    queryset = GameState.objects.all()
    serializer_class = GameStateSerializer

    # lookup_field = "pk"

    # {
    #     "action":"move_up",
    #     "player":"right"
    # }

    async def receive_json(self, content, **kwargs):
        action = content.get("action")
        async with self.shared_state.c.lock:
            if action == "move_up":
                player = content.get("player")
                if player == "right":
                    self.shared_state.c.paddle.right_y += 3
        asyncio.create_task(self.shared_state.c.send_pos()) 
        # await self.shared_state.c.send_pos()


class PongLogic(AsyncWebsocketConsumer,Singleton):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.left_score = 0
        self.right_score = 0
        self.state = "stop"
        self.lock = asyncio.Lock()
        self.game_window = game_window()
        self.ball = ball()
        self.paddle = paddle()
        self.tasks = {}

    # PongLogic
    # async def game_start(self):
    #     self.left_score = 0
    #     self.right_score = 0
    #     await self.game_loop()

    async def game_loop(self):
        turn_count = 0
        while self.left_score < 15 and self.right_score < 15:
            if self.state == "stop":
                self.ball.x = self.game_window.width / 2
                self.ball.y = self.game_window.height / 2
                self.ball.angle = random.uniform(
                    self.ball.bound_angle["right_bottom"],
                    self.ball.bound_angle["right_top"],
                )
                if turn_count % 2 == 0:
                    self.ball.angle += math.pi
                self.ball.angle = Utils.normalize_angle(self.ball.angle)
                turn_count += 1
                Utils.set_direction(self.ball)
                # print("angle: ", self.ball.angle)
                # print("direction: ", self.ball.direction["facing_up"], self.ball.direction["facing_down"], self.ball.direction["facing_right"], self.ball.direction["facing_left"])
            await self.rendering()
            await self.update_pos()
            await self.check_game_state()
        await self.send_pos()

    async def rendering(self):
        await self.send_pos()
        await asyncio.sleep(0.005)
        if self.state == "stop":
            await asyncio.sleep(2)
            self.state = "running"
        else:
            await asyncio.sleep(0.005)

    async def update_pos(self):
        async with self.lock:
            # self.ball.angle = math.pi / 3 #test用
            x_velocity = self.ball.velocity * math.cos(self.ball.angle)
            y_velocity = self.ball.velocity * math.sin(self.ball.angle)

            # 上下の壁衝突判定
            if Utils.has_collided_with_wall(self.ball, self.game_window) == True:
                y_velocity *= -1
                self.ball.angle = 2 * math.pi - self.ball.angle
                self.ball.angle = Utils.normalize_angle(self.ball.angle)
                Utils.set_direction(self.ball)

            # 左パドル衝突判定
            if Utils.has_collided_with_paddle_left(self.ball, self.paddle) == True:
                is_left = True
                # 左パドル上部の衝突判定
                if (
                    Utils.has_collided_with_paddle_top(self.ball, self.paddle, is_left)
                    == True
                ):
                    is_top = True
                else:
                    is_top = False
                Utils.update_ball_angle(self.ball, self.paddle, is_left, is_top)
                x_velocity, y_velocity = Utils.update_ball_velocity(
                    is_top, x_velocity, y_velocity
                )
            # 右パドル衝突判定
            elif (
                Utils.has_collided_with_paddle_right(
                    self.ball, self.paddle, self.game_window
                )
                == True
            ):
                is_left = False
                # 右パドル上部衝突判定
                if (
                    Utils.has_collided_with_paddle_top(self.ball, self.paddle, is_left)
                    == True
                ):
                    is_top = True
                else:
                    is_top = False
                Utils.update_ball_angle(self.ball, self.paddle, is_left, is_top)
                x_velocity, y_velocity = Utils.update_ball_velocity(
                    is_top, x_velocity, y_velocity
                )
            self.ball.angle = Utils.normalize_angle(self.ball.angle)
            Utils.set_direction(self.ball)
            Utils.adjust_ball_position(
                self.ball,
                self.paddle,
                x_velocity,
                y_velocity,
                self.game_window,
            )

    async def check_game_state(self):
        if self.ball.x - self.ball.radius > self.game_window.width:
            self.left_score += 1
            self.state = "stop"
        elif self.ball.x + self.ball.radius < 0:
            self.right_score += 1
            self.state = "stop"

    # async def connect(self):
    #     if "game_loop" in TASK:
    #         TASK["game_loop"].cancel()
    #     await self.channel_layer.group_add("sendmessage", self.channel_name)
    #     print("Websocket connected")
    #     await self.accept()
    #     TASK["game_loop"] = asyncio.create_task(self.game_loop())
        # await TASK["game_loop"]

    async def connect(self):

        if "game_loop" not in TASK:
            TASK["game_loop"] = asyncio.create_task(self.game_loop())
        await self.channel_layer.group_add("sendmessage", self.channel_name)
        print("Websocket connected")
        await self.accept()

    async def disconnect(self, close_code):
        if "game_loop" in self.tasks:
            self.tasks["game_loop"].cancel()
        await self.channel_layer.group_discard("sendmessage", self.channel_name)
        print("Websocket disconnected")

    async def receive(self, text_data=None):
        data = json.loads(text_data)
        key = data.get("key")
        action = data.get("action")

        async with self.lock:
            if key == "D" and action == "pressed":
                if (
                    self.paddle.left_y + 3
                    <= self.game_window.height - self.paddle.height
                ):
                    self.paddle.left_y += 3
            elif key == "E" and action == "pressed":
                if self.paddle.left_y - 3 >= 0:
                    self.paddle.left_y -= 3
            elif key == "K" and action == "pressed":
                if (
                    self.paddle.right_y + 3
                    <= self.game_window.height - self.paddle.height
                ):
                    self.paddle.right_y += 3
            elif key == "I" and action == "pressed":
                if self.paddle.right_y - 3 >= 0:
                    self.paddle.right_y -= 3

        if self.state == "stop":
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
        response_message = {
            "left_paddle_y": self.paddle.left_y,
            "right_paddle_y": self.paddle.right_y,
            "ball_x": self.ball.x,
            "ball_y": self.ball.y,
            "left_score": self.left_score,
            "right_score": self.right_score,
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

def main():
   c = GameState()


if __name__ == "__main__":
    main()