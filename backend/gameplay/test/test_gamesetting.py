# from django.test import TestCase
# from django.urls import reverse
# from rest_framework import status
# from rest_framework.test import APIClient, APIRequestFactory
# from ..models import GameSetting

# class GameSettingAPITest(TestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.game_setting = self.create_game_setting()
#         self.url = reverse('gameplay:gamesetting-detail', kwargs={'pk': self.game_setting.id})

#     # Using the standard RequestFactory API to create a form POST request
#     def create_game_setting(self):
#         factory = APIRequestFactory()
#         request = factory.post('/api/gamesetting/', {'ball_velocity': 'fast', 'ball_size': 'big', 'map': 'c'}, content_type='application/json')
#         response = self.client.post('/api/gamesetting/', {'ball_velocity': 'fast', 'ball_size': 'big', 'map': 'c'}, format='json', follow=True)
#         if response.status_code == 301:
#             response = self.client.post('/api/gamesetting/', {'ball_velocity': 'fast', 'ball_size': 'big', 'map': 'c'}, format='json', follow=True)
#         return GameSetting.objects.get(id=response.data['id'])

#     def test_update_game_setting(self):
#         data = {
#             'ball_velocity': 'fast',
#             'ball_size': 'big',
#             'map': 'c'
#         }
#         response = self.client.put(self.url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.game_setting.refresh_from_db()
#         self.assertEqual(self.game_setting.ball_velocity, data['ball_velocity'])
#         self.assertEqual(self.game_setting.ball_size, data['ball_size'])
#         self.assertEqual(self.game_setting.map, data['map'])