from rest_framework import serializers
from .models import Skill, Availability

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'mentor', 'title', 'description', 'level', 'created_at']
        read_only_fields = ['id', 'mentor', 'created_at']

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'mentor', 'day_of_week', 'start_time', 'end_time', 'is_available']
        read_only_fields = ['id', 'mentor']
