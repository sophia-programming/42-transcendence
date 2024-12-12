from unittest.mock import patch

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import CustomUser


class OAuthViewTests(APITestCase):
    def test_oauth_view_redirect(self):
        """OAuth認証ページにリダイレクトされることを確認する"""
        response = self.client.get(reverse("oauth:oauth"))
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertIn("https://api.intra.42.fr/oauth/authorize", response.url)


class OAuthCallbackViewTests(APITestCase):
    @patch("requests.post")
    @patch("requests.get")
    def test_oauth_callback_view_success(self, mock_get, mock_post):
        """OAuthコールバックが成功し、ユーザーが作成されログインされることを確認する"""
        mock_post.return_value.json.return_value = {"access_token": "test_token"}
        mock_get.return_value.json.return_value = {"login": "testuser"}

        response = self.client.get(reverse("oauth:callback"), {"code": "test_code"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"redirect": "homepage"})

        user = CustomUser.objects.get(username="testuser")
        self.assertIsNotNone(user)
        self.assertTrue(user.is_authenticated)

    def test_oauth_callback_view_error(self):
        """エラーが発生した場合、エラーメッセージが返されることを確認する"""
        response = self.client.get(
            reverse("oauth:callback"),
            {"error": "access_denied", "error_description": "アクセスが拒否されました"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data,
            {
                "error": "access_denied",
                "error_description": "アクセスが拒否されました",
            },
        )

    def test_oauth_callback_view_no_code(self):
        """コードが提供されていない場合、エラーメッセージが返されることを確認する"""
        response = self.client.get(reverse("oauth:callback"))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data,
            {
                "error": "No code provided",
                "error_description": "認証コードが提供されていません。",
            },
        )
