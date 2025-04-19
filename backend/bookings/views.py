from rest_framework import viewsets, permissions
from .models import SessionBooking
from .serializers import SessionBookingSerializer

class SessionBookingViewSet(viewsets.ModelViewSet):
    queryset = SessionBooking.objects.all()
    serializer_class = SessionBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(mentee=self.request.user)