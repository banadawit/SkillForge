from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
# Import all models used in this file
from .models import SessionBooking, Review
# Import models from other apps
from profiles.models import UserProfile, CustomUser
# Import all serializers used in this file
from .serializers import ReviewSerializer, SessionBookingSerializer
from django.shortcuts import get_object_or_404
# Import Django's ValidationError and DRF's ValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError # Use DRF's ValidationError for API responses


class SessionBookingViewSet(viewsets.ModelViewSet):
    serializer_class = SessionBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure the user has a profile before attempting to filter by role
        if not hasattr(self.request.user, 'profile'):
            return SessionBooking.objects.none()

        # If the user is a mentor, they see sessions where they are the mentor
        if self.request.user.profile.role == 'mentor':
            # Assuming SessionBooking has a 'mentor' ForeignKey to UserProfile
            return SessionBooking.objects.filter(mentor=self.request.user.profile)
        # If the user is a learner, they see sessions where they are the learner
        elif self.request.user.profile.role == 'learner':
            # Assuming SessionBooking has a 'learner' ForeignKey to CustomUser
            return SessionBooking.objects.filter(learner=self.request.user)
        # For any other role or if no role is defined, return an empty queryset
        return SessionBooking.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        # Ensure user has a profile before checking role
        if not hasattr(user, 'profile'):
            raise DRFValidationError("User profile not found.")

        # Mentors cannot book sessions (they are the ones being booked)
        if user.profile.role == 'mentor':
            raise DRFValidationError("Mentors cannot book sessions.")

        # Ensure the learner field is set to the current user
        # The serializer might also receive 'mentor' from the request body
        session = serializer.save(learner=user)

        try:
            # Optional: if you’ve implemented availability validation in model's clean method
            # This should be called before saving, but serializer.save() usually does it.
            # If you have custom validation that needs to run after initial save:
            # session.clean()
            # session.save() # Save again if clean() modified it
            pass # Remove this if you add session.clean() and session.save()
        except DjangoValidationError as e:
            # Convert Django's ValidationError to DRF's ValidationError for proper API response
            raise DRFValidationError(e.messages)
        except Exception as e:
            # Catch any other unexpected errors during creation
            raise DRFValidationError(f"Error creating session: {str(e)}")


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete'] # Limit allowed methods

    def get_queryset(self):
        # Ensure user has a profile before attempting to filter by role
        if not hasattr(self.request.user, 'profile'):
            return Review.objects.none()

        # If current user is a mentor, show reviews received by them
        if self.request.user.profile.role == 'mentor':
            return Review.objects.filter(mentor_profile__user=self.request.user)
        # If current user is a learner, show reviews they have given
        elif self.request.user.profile.role == 'learner':
            return Review.objects.filter(student=self.request.user)
        return Review.objects.none() # Default for other roles or no profile

    def perform_create(self, serializer):
        # The serializer's create method handles linking student and mentor
        # and checking for duplicates, as well as self-reviewing.
        try:
            # Explicitly pass the student as the current request user
            serializer.save(student=self.request.user)
        except DRFValidationError as e: # Catch DRF's ValidationError from serializer
            return Response({'detail': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e: # Catch any other unexpected errors
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        # Only the student who wrote the review or the mentor being reviewed can delete it
        if instance.student == self.request.user or instance.mentor_profile.user == self.request.user:
            instance.delete()
        else:
            return Response({'detail': 'You do not have permission to delete this review.'}, status=status.HTTP_403_FORBIDDEN)