from django.urls import path
from .views import MeView, PublicProfileView

urlpatterns = [
    path('me/', MeView.as_view(), name='me'),
    path('<str:username>/', PublicProfileView.as_view(), name='public-profile'),
]
