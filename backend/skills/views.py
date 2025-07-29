# skills/views.py
from rest_framework import viewsets, status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Skill, Availability
from .serializers import SkillSerializer, AvailabilitySerializer
from profiles.models import UserProfile
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError as DRFValidationError # For consistent error responses
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['user_id'] = user.id
        # ⭐ This line is critical! Make sure it's exactly like this. ⭐
        # It checks if the user has a profile and if their role is 'mentor'.
        token['is_mentor'] = user.profile.role == 'mentor' if hasattr(user, 'profile') else False
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # ⭐ Updated: Robust check for authentication and profile existence
        if not self.request.user.is_authenticated or not hasattr(self.request.user, 'profile'):
            return Skill.objects.none() # Return empty if user is not authenticated or has no profile

        # Mentors can only see and manage their own skills
        if self.request.user.profile.role == 'mentor':
            return Skill.objects.filter(profile__user=self.request.user)
        # Learners should not see skills through this endpoint directly;
        # they'd use a separate public 'browse skills' endpoint if you have one.
        # For now, return none if not a mentor trying to access their skills.
        return Skill.objects.none()

    def perform_create(self, serializer):
        request_user = self.request.user
        # ⭐ Updated: Explicit check for mentor role and profile existence
        if not hasattr(request_user, 'profile') or request_user.profile.role != 'mentor':
            raise DRFValidationError("Only mentors can add skills.")
        
        # The serializer's create method (in skills/serializers.py) handles linking to current user's profile
        try:
            serializer.save()
        except Exception as e:
            # Catch all exceptions for serializer.save() for better error messages
            raise DRFValidationError({'detail': str(e)}) # Raise DRF ValidationError for consistent API error response

    # ⭐ NEW/UPDATED: perform_update method to handle PATCH requests (like 'active' toggle)
    def perform_update(self, serializer):
        request_user = self.request.user
        # ⭐ Updated: Explicit checks for mentor role and skill ownership for updates
        if not hasattr(request_user, 'profile') or request_user.profile.role != 'mentor':
            raise DRFValidationError("Only mentors can update their skills.")

        # Ensure the skill belongs to the current mentor
        # 'serializer.instance' refers to the model instance being updated
        if serializer.instance.profile.user != request_user:
            raise DRFValidationError("You do not have permission to update this skill.")

        try:
            serializer.save() # Saves the updated data (e.g., active status)
        except Exception as e:
            raise DRFValidationError({'detail': str(e)}) # Raise DRF ValidationError

    def perform_destroy(self, instance):
        request_user = self.request.user
        # ⭐ Updated: Explicit checks for mentor role and skill ownership for deletion
        if not hasattr(request_user, 'profile') or request_user.profile.role != 'mentor':
            raise DRFValidationError("Only mentors can delete their skills.")

        if instance.profile.user != request_user:
            raise DRFValidationError("You do not have permission to delete this skill.")

        instance.delete()


class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(mentor=self.request.user)