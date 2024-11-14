from django import forms

from .models import CustomUser


class OTPForm(forms.Form):
    otp_token = forms.CharField(label="Enter OTP Token", max_length=6)


class SignUpForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ["username", "password", "email"]
        widgets = {
            "username": forms.TextInput(
                attrs={"class": "form-control", "id": "InputUsername"}
            ),
            "password": forms.PasswordInput(
                attrs={"class": "form-control", "id": "InputPassword"}
            ),
            "email": forms.EmailInput(
                attrs={
                    "class": "form-control",
                    "id": "InputEmail",
                    "aria-describedby": "emailHelp",
                }
            ),
        }

    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            field.widget.attrs.update(
                {
                    "class": field.widget.attrs.get("class", "")
                    + (" is-invalid" if self.errors.get(field_name) else "")
                }
            )
