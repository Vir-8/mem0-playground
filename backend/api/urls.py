from django.urls import path
from .views import *

urlpatterns = [
    path('generate-response/', handle_message),
    path('fetch-memories/', fetch_memories),
    path('delete-memories/', delete_memories)
]
