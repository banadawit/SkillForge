from rest_framework import serializers
from .models import Skill, Availability

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = [
            'id', 'name', 'price',
            # --- NEW FIELDS TO INCLUDE ---
            'category', 'level', 'description', 'tags', 'active',
            'sessions_completed', 'avg_rating'
        ]
        read_only_fields = ['profile', 'sessions_completed', 'avg_rating'] # profile is set by view, sessions/rating often calculated

    def create(self, validated_data):
        request = self.context.get('request', None)
        if request and hasattr(request, 'user') and hasattr(request.user, 'profile'):
            user_profile = request.user.profile
            if user_profile.role != 'mentor':
                raise serializers.ValidationError("Only mentors can add skills.")
            return Skill.objects.create(profile=user_profile, **validated_data)
        raise serializers.ValidationError("User not authenticated or profile not found.")

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'mentor', 'day_of_week', 'start_time', 'end_time', 'is_available']
        read_only_fields = ['id', 'mentor']
