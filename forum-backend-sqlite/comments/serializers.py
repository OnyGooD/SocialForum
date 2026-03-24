from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'content', 'author_name', 'created_at')
        read_only_fields = ('id', 'author_name', 'created_at')
