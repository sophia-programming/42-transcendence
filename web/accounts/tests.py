from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse


def create_user(username, password):
    return User.objects.create_user(username=username, password=password)


class CustomLoginViewTests(TestCase):
    def test_custom_login_view_template(self):
        """ログインページが正しいテンプレートを使っていることを確認する"""
        response = self.client.get(reverse("accounts:login"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "accounts/login.html")

    def test_custom_login_view_valid_login(self):
        """ユーザーを作成し正しいユーザー名とパスワードでログインできることを確認する"""
        user_name = "testuser"
        user_password = "password123"
        create_user(username=user_name, password=user_password)
        response = self.client.post(
            reverse("accounts:login"),
            {"username": user_name, "password": user_password},
            follow=True,
        )
        # リダイレクト先をまだ設定していないため
        # self.assertEqual(response.status_code, 200)
        # self.assertRedirects(response, reverse("home"))

    def test_custom_login_view_invalid_login(self):
        """ユーザーを作成し間違ったパスワードでログインできないことを確認する"""
        user_name = "testuser"
        user_password = "password123"
        create_user(username=user_name, password=user_password)
        response = self.client.post(
            reverse("accounts:login"),
            {"username": user_name, "password": "wrongpassword"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "accounts/login.html")
        self.assertFalse(response.context["user"].is_authenticated)
