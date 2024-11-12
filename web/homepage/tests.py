from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from django.utils.html import escape


class HomepageViewTests(TestCase):
    def test_homepage_view(self):
        response = self.client.get(reverse("homepage"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "homepage/homepage.html")
        # ボタンが存在し、正しいURLにリンクしているかどうか
        self.assertIn(
            f'onclick="window.location.href=\'{escape(reverse("gameplay:gameplay"))}\'"',
            response.content.decode(),
            "1vs1ボタンが正しいURLにリンクしていません"
        )
        self.assertIn(
            f'onclick="window.location.href=\'{escape(reverse("tournament:tournament"))}\'"',
            response.content.decode(),
            "1vs1ボタンが正しいURLにリンクしていません"
        )