from django.test import TestCase
from django.urls import reverse


class GamePlayViewTests(TestCase):
    def test_play_game_view(self):
        response = self.client.get(reverse("gameplay:gameplay"))  # ここを修正
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "gameplay/playpage.html")
