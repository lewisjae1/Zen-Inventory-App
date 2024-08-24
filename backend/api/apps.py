from django.apps import AppConfig
import firebase_admin
from firebase_admin import credentials
from django.conf import settings

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        cred = credentials.Certificate(settings.FIREBASE_ADMIN_CREDENTIALS)
        firebase_admin.initialize_app(cred)
