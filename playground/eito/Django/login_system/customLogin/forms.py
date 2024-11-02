from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

from . import utils

User = get_user_model()


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ("email",)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for fieldname in self.fields.values():
            fieldname.widget.attrs["class"] = "form-control"
            fieldname.widget.attrs["placeholder"] = fieldname.label


class CustomLoginForm(AuthenticationForm):
    token = forms.CharField(max_length=254, label="Google Authenticator OTP")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs["class"] = "form-control"
            field.widget.attrs["placeholder"] = field.label

    def confirm_login_allowed(self, user):
        if utils.get_token(user) != self.cleaned_data.get("token"):
            raise forms.ValidationError("'Google Authenticator OTP' is invalid.")
        super().confirm_login_allowed(user)
