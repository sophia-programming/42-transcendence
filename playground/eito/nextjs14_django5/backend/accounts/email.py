from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from djoser import utils
from templated_mail.mail import BaseEmailMessage


class EmailManager(BaseEmailMessage):
    def send(self, to, *args, **kwags):
        self.render()
        self.to = to
        self.cc = kwags.pop("cc", [])
        self.bcc = kwags.pop("bcc", [])
        self.reply_to = kwags.pop("reply_to", [])
        self.from_email = kwags.pop(
            "from_email", settings.SITE_NAME + " <" + settings.DEFAULT_FROM_EMAIL + ">"
        )
        super(BaseEmailMessage, self).send(*args, **kwags)


class ActivationEmail(EmailManager):
    template_name = "accounts/activation.html"

    def get_context_data(self):
        context = super().get_context_data()
        user = context.get("user")
        context["name"] = user.name
        context["uid"] = utils.encode_uid(user.pk)
        context["token"] = default_token_generator.make_token(user)
        context["url"] = settings.DJOSER["ACTIVATION_URL"].format(**context)
        context["domain"] = settings.SITE_DOMAIN
        context["site_name"] = settings.SITE_NAME
        return context


class ConfirmationEmail(EmailManager):
    template_name = "accounts/confirmation.html"

    def get_context_data(self):
        context = super().get_context_data()
        user = context.get("user")
        context["name"] = user.name
        context["site_name"] = settings.SITE_NAME
        return context


class ForgotPasswordEmail(BaseEmailMessage):
    template_name = "accounts/forgot_password.html"

    def get_context_data(self):
        context = super().get_context_data()
        user = context.get("user")
        context["name"] = user.name
        context["uid"] = utils.encode_uid(user.pk)
        context["token"] = default_token_generator.make_token(user)
        context["url"] = settings.DJOSER["PASSWORD_RESET_CONFIRM_URL"].format(**context)
        context["domain"] = settings.SITE_DOMAIN
        context["site_name"] = settings.SITE_NAME
        return context


class ResetPasswordEmail(BaseEmailMessage):
    template_name = "accounts/reset_password.html"

    def get_context_data(self):
        context = super().get_context_data()
        user = context.get("user")
        context["name"] = user.name
        context["site_name"] = settings.SITE_NAME
        return context
