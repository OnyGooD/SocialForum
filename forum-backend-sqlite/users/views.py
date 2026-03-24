from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    PublicProfileSerializer,
    ProfileUpdateSerializer,
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data['refresh'])
            token.blacklist()
            return Response({'detail': 'Sikeresen kijelentkeztél.'})
        except Exception:
            return Response({'detail': 'Érvénytelen token.'}, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        return Response(UserSerializer(request.user, context={'request': request}).data)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(
            request.user.profile,
            data=request.data,
            partial=True,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user, context={'request': request}).data)


class PublicProfileView(generics.RetrieveAPIView):
    queryset = User.objects.select_related('profile').all()
    serializer_class = PublicProfileSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'username'
