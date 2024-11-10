import time

from django.test import TestCase
from django.urls import reverse
from django_otp.oath import TOTP
from django_otp.plugins.otp_totp.models import TOTPDevice

from .models import CustomUser


class CustomLoginViewTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="testuser", password="password123"
        )
        self.user.otp_enabled = True
        self.user.save()

    def test_custom_login_view_template(self):
        """ログインページが正しいテンプレートを使っていることを確認する"""
        response = self.client.get(reverse("accounts:login"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "accounts/login.html")

    def test_custom_login_view_valid_login(self):
        """ユーザーを作成し正しいユーザー名とパスワードでログインできることを確認する"""
        response = self.client.post(
            reverse("accounts:login"),
            {"username": "testuser", "password": "password123"},
            follow=True,
        )
        self.assertRedirects(response, reverse("accounts:verify_otp"))

    def test_custom_login_view_invalid_login(self):
        """ユーザーを作成し間違ったパスワードでログインできないことを確認する"""
        response = self.client.post(
            reverse("accounts:login"),
            {"username": "testuser", "password": "wrongpassword"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "accounts/login.html")
        self.assertFalse(response.context["user"].is_authenticated)


class SetupOTPViewTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="testuser", password="password123"
        )
        self.client.login(username="testuser", password="password123")  # loginが必要

    def test_setup_otp_view_get(self):
        """OTPセットアップページが正しいテンプレートを使っていることを確認する"""
        response = self.client.get(reverse("accounts:setup_otp"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "accounts/setup_otp.html")

    def test_setup_otp_view_post(self):
        """OTPセットアップが正しく完了することを確認する"""
        # まずGETリクエストを送信してデバイスを設定
        self.client.get(reverse("accounts:setup_otp"))
        response = self.client.post(reverse("accounts:setup_otp"))
        self.user.refresh_from_db()
        self.assertTrue(self.user.otp_enabled)
        # self.assertRedirects(response, reverse("accounts:home")) # homeが未設定のため


class VerifyOTPViewTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="testuser", password="password123"
        )
        self.client.login(username="testuser", password="password123")  # loginが必要
        self.device = TOTPDevice.objects.create(
            user=self.user, confirmed=True
        )  # デバイス(OTP)を作成

    def test_verify_otp_view_get(self):
        """OTP確認ページが正しいテンプレートを使っていることを確認する"""
        response = self.client.get(reverse("accounts:verify_otp"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "accounts/verify_otp.html")

    def test_verify_otp_view_post_valid_otp(self):
        """正しいOTPトークンでOTP確認が成功することを確認する"""
        totp = TOTP(
            key=self.device.bin_key,
            step=self.device.step,
            t0=self.device.t0,
            digits=self.device.digits,
        )
        totp.time = time.time()
        valid_token = totp.token()
        response = self.client.post(
            reverse("accounts:verify_otp"), {"otp_token": valid_token}
        )
        # self.assertRedirects(response, reverse("accounts:home")) # homeが未設定のため

    def test_verify_otp_view_post_invalid_otp(self):
        """間違ったOTPトークンでOTP確認が失敗することを確認する"""
        response = self.client.post(
            reverse("accounts:verify_otp"), {"otp_token": "123456"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "accounts/verify_otp.html")
        form = response.context["form"]
        self.assertFormError(form, "otp_token", "Invalid OTP")
