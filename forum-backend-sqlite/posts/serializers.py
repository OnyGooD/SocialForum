from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    author_avatar = serializers.ImageField(source='author.profile.avatar', read_only=True)
    comment_count = serializers.IntegerField(read_only=True)
    like_count = serializers.IntegerField(read_only=True)
    liked_by_me = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'author_name', 'author_avatar', 'comment_count', 'like_count', 'liked_by_me', 'created_at')
        read_only_fields = ('id', 'author_name', 'author_avatar', 'comment_count', 'like_count', 'liked_by_me', 'created_at')

    def get_liked_by_me(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.likes.filter(user=request.user).exists()
