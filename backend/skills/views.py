# skills/views.py
from rest_framework import viewsets, status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Skill, Availability
from .serializers import SkillSerializer, AvailabilitySerializer
from django.shortcuts import get_object_or_404

class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Mentors can only see and manage their own skills
        return Skill.objects.filter(profile__user=self.request.user)

    def perform_create(self, serializer):
        # The serializer's create method already handles linking to current user's profile
        # and checking for mentor role based on the context.
        try:
            serializer.save()
        except serializers.ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        # Ensure only the owner can delete their skill
        if instance.profile.user == self.request.user:
            instance.delete()
        else:
            return Response({'detail': 'You do not have permission to delete this skill.'}, status=status.HTTP_403_FORBIDDEN)

class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(mentor=self.request.user)