from rest_framework import serializers
from .models import Skill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'mentor', 'title', 'description', 'level', 'created_at']
        read_only_fields = ['id', 'mentor', 'created_at']