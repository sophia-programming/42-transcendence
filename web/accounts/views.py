from django import forms
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.shortcuts import redirect, render
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters
from django_otp.plugins.otp_totp.models import TOTPDevice

from .forms import OTPForm, SignUpForm
from .models import CustomUser


@method_decorator(
    [sensitive_post_parameters(), csrf_protect, never_cache], name="dispatch"
)
class CustomLoginView(LoginView):
    template_name = "accounts/login.html"

    def form_valid(self, form):
        user = form.get_user()
        login(self.request, user)
        if user.otp_enabled:
            return redirect("accounts:verify_otp")
        return redirect("accounts:home")


@method_decorator(
    [sensitive_post_parameters(), csrf_protect, never_cache], name="dispatch"
)
class SignUpView(View):
    def get(self, request):
        form = SignUpForm()
        return render(request, "accounts/signup.html", {"form": form})

    def post(self, request):
        form = SignUpForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            email = form.cleaned_data["email"]
            user = CustomUser.objects.create_user(
                username=username, password=password, email=email
            )
            return redirect("accounts:login")
        return render(
            request,
            "accounts/signup.html",
            {
                "form": form,
            },
        )


@method_decorator([never_cache, login_required], name="dispatch")
class SetupOTPView(View):
    def get(self, request):
        user = request.user
        if not TOTPDevice.objects.filter(user=user, confirmed=True).exists():
            device = TOTPDevice.objects.create(user=user, confirmed=False)
            uri = device.config_url
            secret_key = device.bin_key.hex()

            return render(
                request,
                "accounts/setup_otp.html",
                {"otpauth_url": uri, "secret_key": secret_key},
            )
        return render(request, "accounts/already_setup_otp.html")

    def post(self, request):
        user = request.user
        device = TOTPDevice.objects.filter(user=user).first()
        device.confirmed = True
        user.otp_enabled = True
        device.save()
        user.save()
        return redirect("accounts:home")


@method_decorator([login_required], name="dispatch")
class HomeView(View):
    def get(self, request):
        return render(request, "accounts/home.html")


@method_decorator(
    [sensitive_post_parameters(), csrf_protect, login_required], name="dispatch"
)
class VerifyOTPView(View):
    def get(self, request):
        form = OTPForm()
        return render(request, "accounts/verify_otp.html", {"form": form})

    def post(self, request):
        form = OTPForm(request.POST)
        if form.is_valid():
            otp = form.cleaned_data["otp_token"]
            device = TOTPDevice.objects.filter(user=request.user).first()
            if device and device.verify_token(otp):
                return redirect("accounts:home")
            else:
                form.add_error("otp_token", "Invalid OTP")
        return render(request, "accounts/verify_otp.html", {"form": form})
