from django.contrib.auth import login
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponseRedirect
from django.shortcuts import resolve_url
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters
from django.views.generic import FormView
from django_otp.forms import OTPAuthenticationForm


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

    def form_valid(self, form):
        user = form.get_user()
        login(self.request, user)
        return super().form_valid(form)

    def get_success_url(self):
        return resolve_url("accounts:home")
