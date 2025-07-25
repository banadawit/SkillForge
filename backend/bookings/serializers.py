from rest_framework import serializers
from .models import SessionBooking, Review

class SessionBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionBooking
        fields = ['id', 'learner', 'skill', 'session_date', 'session_time', 'created_at', 'is_confirmed']
        read_only_fields = ['id', 'learner', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    mentor_username = serializers.CharField(source='mentor_profile.user.username', read_only=True) # To identify the mentor

    class Meta:
        model = Review
        fields = ['id', 'mentor_profile', 'student_name', 'mentor_username', 'rating', 'comment', 'created_at']
        read_only_fields = ['student_name', 'mentor_username', 'created_at']

    # Override create for reviews to ensure student and mentor are set correctly
    def create(self, validated_data):
        request = self.context.get('request', None)
        if request and hasattr(request, 'user'):
            student = request.user
            mentor_profile = validated_data.get('mentor_profile')

            # Prevent self-reviewing
            if student == mentor_profile.user:
                raise serializers.ValidationError("You cannot review your own profile.")

            # Prevent duplicate reviews by the same student for the same mentor
            if Review.objects.filter(mentor_profile=mentor_profile, student=student).exists():
                raise serializers.ValidationError("You have already reviewed this mentor.")

            return Review.objects.create(student=student, **validated_data)
        return super().create(validated_data)