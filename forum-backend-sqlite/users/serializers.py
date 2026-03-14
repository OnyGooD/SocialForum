from django.contrib.auth.models import User
from django.db.models import Count
from rest_framework import serializers

from posts.models import Post
from comments.models import Comment
from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Ez a felhasználónév már foglalt.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Ez az email már használatban van.')
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(source='profile.bio', read_only=True)
    avatar = serializers.ImageField(source='profile.avatar', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'date_joined', 'bio', 'avatar')


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('bio', 'avatar')


class ProfilePostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    like_count = serializers.IntegerField(read_only=True)
    comment_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'author_name', 'like_count', 'comment_count', 'created_at')


class ProfileCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    post_id = serializers.IntegerField(source='post.id', read_only=True)
    post_title = serializers.CharField(source='post.title', read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'content', 'author_name', 'created_at', 'post_id', 'post_title')


class PublicProfileSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(source='profile.bio', read_only=True)
    avatar = serializers.ImageField(source='profile.avatar', read_only=True)
    posts = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'date_joined', 'bio', 'avatar', 'posts', 'comments')

    def get_posts(self, obj):
        posts = obj.posts.annotate(
            like_count=Count('likes', distinct=True),
            comment_count=Count('comments', distinct=True),
        ).order_by('-created_at')
        return ProfilePostSerializer(posts, many=True, context=self.context).data

    def get_comments(self, obj):
        comments = obj.comments.select_related('post').order_by('-created_at')
        return ProfileCommentSerializer(comments, many=True, context=self.context).data
