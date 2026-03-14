from django.db.models import Count, Exists, OuterRef, Q
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from comments.serializers import CommentSerializer
from .models import Post, PostLike
from .permissions import IsOwnerOrReadOnly
from .serializers import PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        qs = Post.objects.select_related('author').annotate(
            like_count=Count('likes', distinct=True),
            comment_count=Count('comments', distinct=True),
        )
        if self.request.user.is_authenticated:
            liked_subquery = PostLike.objects.filter(post=OuterRef('pk'), user=self.request.user)
            qs = qs.annotate(liked_by_me=Exists(liked_subquery))
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(content__icontains=search) | Q(author__username__icontains=search))
        return qs.order_by('-created_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['get', 'post'], url_path='comments')
    def comments(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)

        if request.method == 'GET':
            serializer = CommentSerializer(post.comments.select_related('author').all(), many=True, context={'request': request})
            return Response(serializer.data)

        if not request.user.is_authenticated:
            return Response({'detail': 'Bejelentkezés szükséges.'}, status=401)

        serializer = CommentSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user, post=post)
        return Response(serializer.data, status=201)

    @action(detail=True, methods=['post'], url_path='toggle-like', permission_classes=[permissions.IsAuthenticated])
    def toggle_like(self, request, pk=None):
        post = self.get_object()
        like, created = PostLike.objects.get_or_create(post=post, user=request.user)
        if not created:
            like.delete()
        refreshed = self.get_queryset().get(pk=post.pk)
        return Response({
            'liked': created,
            'like_count': refreshed.like_count,
            'post': self.get_serializer(refreshed).data,
        }, status=status.HTTP_200_OK)
