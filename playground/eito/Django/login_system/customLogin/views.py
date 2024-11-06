from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.views import LoginView
from django.contrib.sites.shortcuts import get_current_site
from django.core.signing import BadSignature, SignatureExpired, dumps, loads
from django.http import HttpResponseBadRequest
from django.shortcuts import redirect
from django.template.loader import get_template
from django.views import generic

from . import utils
from .forms import CustomLoginForm, CustomUserCreationForm

User = get_user_model()


class UserCreate(generic.CreateView):
    model = User
    template_name = "customLogin/user_create.html"
    form_class = CustomUserCreationForm

    def get(self, request, **kwargs):
        if request.user.is_authenticated:
            return redirect("/")
        return super().get(request, **kwargs)

    def form_valid(self, form):
        user = form.save(commit=False)
        user.is_active = False
        user.save()

        current_site = get_current_site(self.request)
        context = {
            "protocol": "https" if self.request.is_secure() else "http",
            "domain": current_site.domain,
            "token": dumps(user.pk),
            "user": user,
        }
        subject = get_template("customLogin/mail_template/subject.txt").render(context)
        message = get_template("customLogin/mail_template/message.txt").render(context)
        user.email_user(subject, message)
        return redirect("customLogin:user_create_done")


class UserCreateDone(generic.TemplateView):
    template_name = "customLogin/user_create_done.html"

    def get(self, request, **kwargs):
        if request.user.is_authenticated:
            return redirect("/")
        return super().get(request, **kwargs)


class UserCreateComplete(generic.TemplateView):
    template_name = "customLogin/user_create_complete.html"
    timeout_seconds = getattr(settings, "ACTIVATION_TIMEOUT_SECONDS", 60 * 60 * 24)

    def get(self, request, **kwargs):
        if request.user.is_authenticated:
            return redirect("/")

        token = kwargs.get("token")
        try:
            user_pk = loads(token, max_age=self.timeout_seconds)
        except SignatureExpired:
            return HttpResponseBadRequest("Activation link has expired.")
        except BadSignature:
            return HttpResponseBadRequest("Invalid activation link.")

        try:
            user = User.objects.get(pk=user_pk)
        except User.DoesNotExist:
            return HttpResponseBadRequest("Invalid activation link.")

        if not user.is_active:
            user.is_active = True
            user.is_staff = True
            user.is_superuser = True
            user.save()
            request.session["img"] = utils.get_image_b64(
                utils.get_auth_url(user.email, utils.get_secret(user))
            )
            return super().get(request, **kwargs)

        return HttpResponseBadRequest("Invalid activation link.")


class CustomLoginView(LoginView):
    template_name = "customLogin/login.html"
    form_class = CustomLoginForm

    def get(self, request, **kwargs):
        if request.user.is_authenticated:
            return redirect("/")
        return super().get(request, **kwargs)
