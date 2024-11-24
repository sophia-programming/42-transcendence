import time
import json
import asyncio
from channels.testing import WebsocketCommunicator
from gameplay.PongLogic.consumers import PongLogic  # PongLogic をインポート
from django.test import TestCase


class PongLogicTests(TestCase):
    # DキーとKキーを30秒押し続けた場合 下方向
    async def test_press_d_and_k_key_while_hold(self):
        consumer = PongLogic()
        self.assertIsInstance(consumer, PongLogic)
        communicator = WebsocketCommunicator(PongLogic.as_asgi(), "/ws/gameplay/")

        connected = await communicator.connect()
        self.assertTrue(connected)

        start_time = time.time()
        duration = 30
        pre_left = 240
        pre_right = 240
        while time.time() - start_time < duration:
            await communicator.send_to(
                text_data=json.dumps(
                    {"key": "D", "action": "pressed", "paddle": "left"}
                )
            )
            await asyncio.sleep(0.1)
            await communicator.send_to(
                text_data=json.dumps(
                    {"key": "K", "action": "pressed", "paddle": "right"}
                )
            )
            # await asyncio.sleep(0.1)

            response = await communicator.receive_from()
            response_data = json.loads(response)
            self.assertIn("left_paddle_y", response_data)
            self.assertIn("right_paddle_y", response_data)
            print(response_data)
            self.assertGreater(response_data["left_paddle_y"], pre_left - 1)
            self.assertGreater(response_data["right_paddle_y"], pre_right - 1)
            self.assertLess(
                response_data["left_paddle_y"],
                consumer.game_window.height - consumer.paddle.height - 1,
            )
            self.assertLess(
                response_data["right_paddle_y"],
                consumer.game_window.height - consumer.paddle.height - 1,
            )
            pre_left = response_data["left_paddle_y"]
            pre_right = response_data["right_paddle_y"]
        await communicator.disconnect()

    # EキーとIキーを30秒押し続けた場合 上方向
    async def test_press_e_and_i_key_while_hold(self):
        consumer = PongLogic()
        self.assertIsInstance(consumer, PongLogic)
        communicator = WebsocketCommunicator(PongLogic.as_asgi(), "/ws/gameplay/")

        connected = await communicator.connect()
        self.assertTrue(connected)

        start_time = time.time()
        duration = 30
        pre_left = 240
        pre_right = 240
        while time.time() - start_time < duration:
            await communicator.send_to(
                text_data=json.dumps(
                    {"key": "E", "action": "pressed", "paddle": "left"}
                )
            )
            await asyncio.sleep(0.1)
            await communicator.send_to(
                text_data=json.dumps(
                    {"key": "I", "action": "pressed", "paddle": "right"}
                )
            )
            # await asyncio.sleep(0.1)

            response = await communicator.receive_from()
            response_data = json.loads(response)
            self.assertIn("left_paddle_y", response_data)
            self.assertIn("right_paddle_y", response_data)
            print(response_data)
            self.assertLess(response_data["left_paddle_y"], pre_left + 1)
            self.assertLess(response_data["right_paddle_y"], pre_right + 1)
            self.assertGreater(response_data["left_paddle_y"], -1)
            self.assertGreater(response_data["right_paddle_y"], -1)
            pre_left = response_data["left_paddle_y"]
            pre_right = response_data["right_paddle_y"]
        await communicator.disconnect()
