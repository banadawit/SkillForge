from rest_framework import viewsets, permissions
from .models import SessionBooking, Review
from .serializers import SessionBookingSerializer, ReviewSerializer
from django.core.exceptions import ValidationError

class SessionBookingViewSet(viewsets.ModelViewSet):
    queryset = SessionBooking.objects.all()
    serializer_class = SessionBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Check mentor availability
        session = serializer.save(learner=self.request.user)

        try:
            session.clean()  # This calls the clean method to validate availability
            session.save()  # Save only if availability is confirmed
        except ValidationError as e:
            raise ValidationError(str(e))
        
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)