from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Post
from .serializers import PostSerializer
from .permissions import IsOwnerOrReadOnly
from comments.serializers import CommentSerializer


class PostViewSet(viewsets.ModelViewSet):
    serializer_class   = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        qs = Post.objects.all()
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(Q(title__icontains=search))
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['get', 'post'], url_path='comments')
    def comments(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)

        if request.method == 'GET':
            serializer = CommentSerializer(post.comments.all(), many=True)
            return Response(serializer.data)

        if not request.user.is_authenticated:
            return Response({'detail': 'Bejelentkezés szükséges.'}, status=401)

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, post=post)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
