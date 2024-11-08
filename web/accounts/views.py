from base64 import b32encode
from binascii import unhexlify

from django import forms
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpResponseRedirect
from django.shortcuts import resolve_url
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters
from django.views.generic import FormView, TemplateView
from django_otp.forms import OTPAuthenticationForm
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.util import random_hex


class OTPAuthenticationForm(forms.Form):
    otp_token = forms.IntegerField(label=_("OTP Token"), min_value=0, max_value=999999)

    def __init__(self, user, **kwargs):
        super().__init__(**kwargs)
        self.user = user

    def clean_otp_token(self):
        token = self.cleaned_data.get("otp_token")
        device = TOTPDevice.objects.filter(user=self.user, confirmed=True).first()
        if not device:
            raise forms.ValidationError(
                _("No confirmed TOTP device found for this user.")
            )
        if not device.verify_token(token):
            raise forms.ValidationError(_("Invalid OTP Token"))
        return token


@method_decorator(
    [sensitive_post_parameters(), csrf_protect, never_cache], name="dispatch"
)
class TwoFactorLoginView(FormView):
    template_name = "accounts/login.html"
    form_class = AuthenticationForm
    redirect_authenticated_user = False

    def dispatch(self, request, *args, **kwargs):
        if self.redirect_authenticated_user and self.request.user.is_authenticated:
            return HttpResponseRedirect(self.get_success_url())
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        self.request.session["user_id"] = form.get_user().pk
        return HttpResponseRedirect(self.get_otp_url())

    def get_otp_url(self):
        return resolve_url("accounts:otp")

    def get_success_url(self):
        return resolve_url("accounts:home")


@method_decorator(
    [sensitive_post_parameters(), csrf_protect, never_cache], name="dispatch"
)
class OTPView(FormView):
    template_name = "accounts/otp.html"
    form_class = OTPAuthenticationForm

    def dispatch(self, request, *args, **kwargs):
        if not self.request.session.get("user_id"):
            return HttpResponseRedirect(resolve_url("accounts:login"))
        return super().dispatch(request, *args, **kwargs)

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        user_id = self.request.session.get("user_id")
        kwargs["user"] = TOTPDevice.objects.get(pk=user_id).user
        return kwargs

    def form_valid(self, form):
        user = form.user
        login(self.request, user)
        return super().form_valid(form)

    def get_success_url(self):
        return resolve_url("accounts:home")


@method_decorator([login_required, csrf_protect], name="dispatch")
class SetupView(FormView):
    template_name = "accounts/setup.html"
    form_class = OTPAuthenticationForm

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs["user"] = self.request.user
        return kwargs

    def form_valid(self, form):
        user = self.request.user
        device = form.save(commit=False)
        device.user = user
        device.name = "default"
        device.save()
        return HttpResponseRedirect(resolve_url("accounts:setup_complete"))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        key = random_hex(20)
        rawkey = unhexlify(key.encode("ascii"))
        b32key = b32encode(rawkey).decode("utf-8")
        issuer = get_current_site(self.request).name
        username = self.request.user.get_username()
        otpauth_url = (
            f"otpauth://totp/{issuer}:{username}?secret={b32key}&issuer={issuer}"
        )
        context.update(
            {
                "otpauth_url": otpauth_url,
                "secret_key": b32key,
            }
        )
        return context


@method_decorator([login_required], name="dispatch")
class SetupCompleteView(TemplateView):
    template_name = "accounts/setup_complete.html"
