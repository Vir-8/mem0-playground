from django.urls import path
from .views import handle_message

urlpatterns = [
    path('generate-response/', handle_message),
]
