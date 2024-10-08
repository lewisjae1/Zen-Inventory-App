from django.apps import AppConfig
import firebase_admin
from firebase_admin import credentials
from django.conf import settings
import os
import json

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": "zen-inventory-app",
            "private_key_id": os.environ['PRIVATE_KEY_ID'],
            "private_key": os.environ['PRIVATE_KEY'].replace(r'\n', '\n'),
            "client_email": "firebase-adminsdk-t6kx7@zen-inventory-app.iam.gserviceaccount.com",
            "client_id": os.environ['CLIENT_ID'],
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-t6kx7%40zen-inventory-app.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
        })
        firebase_admin.initialize_app(cred)
