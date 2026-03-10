from rest_framework import viewsets, permissions
from .models import Post
from .serializers import PostSerializer
from .permissions import IsOwnerOrReadOnly
from comments.serializers import CommentSerializer
from rest_framework.decorators import action
from rest_framework.response import Response


class PostViewSet(viewsets.ModelViewSet):
    queryset           = Post.objects.all()
    serializer_class   = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['get', 'post'], url_path='comments')
    def comments(self, request, pk=None):
        from django.shortcuts import get_object_or_404
        from .models import Post as PostModel
        post = get_object_or_404(PostModel, pk=pk)

        if request.method == 'GET':
            qs = post.comments.all()
            serializer = CommentSerializer(qs, many=True)
            return Response(serializer.data)

        if not request.user.is_authenticated:
            return Response({'detail': 'Bejelentkezés szükséges.'}, status=401)

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, post=post)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
