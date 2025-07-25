from rest_framework import serializers
from .models import Skill, Availability

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'profile', 'name', 'price', 'description', 'level', 'created_at']
        read_only_fields = ['id', 'profile', 'created_at']

        # Override create to ensure skill is linked to the current user's profile
    def create(self, validated_data):
        request = self.context.get('request', None)
        if request and hasattr(request, 'user'):
            user_profile = request.user.profile
            if user_profile.role != 'mentor':
                raise serializers.ValidationError("Only mentors can add skills.")
            return Skill.objects.create(profile=user_profile, **validated_data)
        return super().create(validated_data) # Fallback if no user in context

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'mentor', 'day_of_week', 'start_time', 'end_time', 'is_available']
        read_only_fields = ['id', 'mentor']
