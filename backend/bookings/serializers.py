from rest_framework import serializers
from .models import SessionBooking, Review
from profiles.models import CustomUser, UserProfile
from skills.models import Skill

class SessionBookingSerializer(serializers.ModelSerializer):
    learner_username = serializers.CharField(source='learner.username', read_only=True)
    mentor_username = serializers.CharField(source='mentor.user.username', read_only=True)
    skill_title = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = SessionBooking
        fields = [
            'id', 'learner', 'mentor', 'skill', 'session_date', 
            'session_time', 'created_at', 'status',
            # ⭐ NEW FIELDS ⭐
            'duration', 'skill_level', 'message',
            'learner_username', 'mentor_username', 'skill_title'
        ]
        read_only_fields = [
            'learner', 'mentor', 'created_at',
            'learner_username', 'mentor_username', 'skill_title'
        ]

    def validate(self, data):
        print(f"Validating data: {data}")
        return data

    def create(self, validated_data):
        print(f"Creating SessionBooking with data: {validated_data}")
        
        # Get the skill to determine the mentor
        skill = validated_data.get('skill')
        if not skill:
            raise serializers.ValidationError("Skill is required")
        
        # Set the mentor from the skill's profile
        validated_data['mentor'] = skill.profile
        print(f"Mentor set to: {skill.profile}")
        
        try:
            return super().create(validated_data)
        except Exception as e:
            print(f"Error creating SessionBooking: {e}")
            raise serializers.ValidationError(f"Failed to create booking: {str(e)}")

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