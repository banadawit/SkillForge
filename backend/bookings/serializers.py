from rest_framework import serializers
from .models import SessionBooking, Review

class SessionBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionBooking
        fields = ['id', 'learner', 'skill', 'session_date', 'session_time', 'created_at', 'is_confirmed']
        read_only_fields = ['id', 'learner', 'created_at']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'reviewer', 'skill', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'reviewer', 'created_at']
