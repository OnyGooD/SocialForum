from django.urls import path
from .views import CommentDeleteView

urlpatterns = [
    path('<int:pk>/', CommentDeleteView.as_view(), name='comment-delete'),
]
