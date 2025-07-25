# profiles/views.py
from rest_framework import generics, status, permissions # Import permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import CustomUser, UserProfile
from .serializers import CurrentUserAndProfileSerializer, RegisterSerializer # Import RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# Add this RegisterView class
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny] # Allow unauthenticated users to register
    serializer_class = RegisterSerializer


# Custom Token Serializer (remains the same)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['user_id'] = user.id
        token['is_mentor'] = user.profile.role == 'mentor'
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CurrentUserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CurrentUserAndProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        return CustomUser.objects.select_related('profile').get(id=user.id)

    def perform_update(self, serializer):
        serializer.save()

class BecomeMentorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_profile = get_object_or_404(UserProfile, user=request.user)
        if user_profile.role == 'mentor':
            return Response({'detail': 'You are already a mentor.'}, status=status.HTTP_400_BAD_REQUEST)

        user_profile.role = 'mentor'
        user_profile.save()
        return Response({'detail': 'Congratulations! You are now a mentor.'}, status=status.HTTP_200_OK)