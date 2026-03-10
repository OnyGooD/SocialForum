from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Comment
from .serializers import CommentSerializer


class CommentDeleteView(generics.DestroyAPIView):
    """DELETE /api/comments/{id}/  – csak a saját kommentet lehet törölni"""
    queryset           = Comment.objects.all()
    serializer_class   = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise PermissionDenied('Csak a saját kommentedet törölheted.')
        instance.delete()
