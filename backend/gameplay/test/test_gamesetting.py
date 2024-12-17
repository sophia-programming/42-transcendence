from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import GameSetting

class GameSettingAPITest(TestCase):
    # テスト用のデータを作成
    def setUp(self):
        self.client = APIClient()
        self.game_setting = GameSetting.objects.create(
            id=1,
            ball_velocity='normal',
            ball_size='normal',
            map='default'
        )
        self.url = reverse('gamesetting-detail', kwargs={'pk': self.game_setting.id})

	# RESTAPIのGETメソッドをテスト
    def test_get_game_setting(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.game_setting.id)
        self.assertEqual(response.data['ball_velocity'], self.game_setting.ball_velocity)
        self.assertEqual(response.data['ball_size'], self.game_setting.ball_size)
        self.assertEqual(response.data['map'], self.game_setting.map)

	# RESTAPIのPUTメソッドをテスト
    def test_update_game_setting(self):
        data = {
            'ball_velocity': 'fast',
            'ball_size': 'big',
            'map': 'new_map'
        }
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.game_setting.refresh_from_db()
        self.assertEqual(self.game_setting.ball_velocity, data['ball_velocity'])
        self.assertEqual(self.game_setting.ball_size, data['ball_size'])
        self.assertEqual(self.game_setting.map, data['map'])