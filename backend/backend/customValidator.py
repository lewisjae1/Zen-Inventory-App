from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class CustomValidator:
    def __init__(self, required_length = 4):
        self.required_length = required_length

    def validate(self, password, user=None):
        if len(password) != self.required_length or not password.isdigit():
            raise ValidationError(
                _("This password must contain %(required_length)d numbers."),
                code="password_not_right_format",
                params={"required_length": self.required_length},
            )

    def get_help_text(self):
        return _(
            "Your password must contain %(required_length)d numbers."
            % {"required_length": self.required_length}
        )