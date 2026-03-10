from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    author_name   = serializers.CharField(source='author.username', read_only=True)
    comment_count = serializers.IntegerField(read_only=True)

    class Meta:
        model  = Post
        fields = ('id', 'title', 'content', 'author_name', 'comment_count', 'created_at')
        read_only_fields = ('id', 'author_name', 'comment_count', 'created_at')
