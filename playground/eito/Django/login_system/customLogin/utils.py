import base64
from io import BytesIO

import onetimepass
import qrcode


def get_secret(user):
    return base64.b32encode((user.email + str(user.date_joined)).encode()).decode()


def get_auth_url(email, secret, issuer="login_system"):
    url_template = "otpauth://totp/{isr}:{uid}?secret={secret}&issuer={isr}"
    return url_template.format(isr=issuer, uid=email, secret=secret)


def get_image_b64(url):
    img = qrcode.make(url)
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode()


def get_token(user):
    return str(onetimepass.get_totp(get_secret(user)))
