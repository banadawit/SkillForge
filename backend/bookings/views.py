from rest_framework import viewsets, permissions
from .models import SessionBooking, Review
from .serializers import SessionBookingSerializer, ReviewSerializer
import django
from django.core.exceptions import ValidationError
from django.core.exceptions import ValidationError as DjangoValidationError  # Alias Django's version


class SessionBookingViewSet(viewsets.ModelViewSet):
    serializer_class = SessionBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Learners see only their own bookings
        return SessionBooking.objects.filter(learner=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'mentor':
            raise ValidationError("Mentors cannot book sessions.")

        # Temporarily save to validate
        session = serializer.save(learner=user)

        try:
            session.clean()  # Optional: if you’ve implemented availability validation in model
            session.save()
        except DjangoValidationError  as e:
            raise ValidationError(e.messages)
        
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)