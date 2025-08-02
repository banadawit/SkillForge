from rest_framework import serializers
from .models import Skill, Availability # Ensure both Skill and Availability are imported
from profiles.models import UserProfile, CustomUser # Ensure CustomUser and UserProfile are imported

# --- Serializer for Mentor's Own Skill Management (used by MySkills.jsx) ---
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = [
            'id', 'name', 'price',
            'category', 'level', 'description', 'tags', 'active',
            'sessions_completed', 'avg_rating'
        ]
        # 'profile' is set by the view's perform_create/update
        # 'sessions_completed' and 'avg_rating' are typically calculated/aggregated, not directly set by mentor
        read_only_fields = ['profile', 'sessions_completed', 'avg_rating']

    def create(self, validated_data):
        request = self.context.get('request', None)
        if request and hasattr(request, 'user') and hasattr(request.user, 'profile'):
            user_profile = request.user.profile
            if user_profile.role != 'mentor':
                raise serializers.ValidationError("Only mentors can add skills.")
            return Skill.objects.create(profile=user_profile, **validated_data)
        raise serializers.ValidationError("User not authenticated or profile not found.")

# --- NEW/UPDATED Serializer for Public Skill List (used by SkillList.jsx) ---
class PublicSkillSerializer(serializers.ModelSerializer):
    # Mapping backend 'name' to frontend 'title'
    title = serializers.CharField(source='name', read_only=True)
    # Mapping backend 'sessions_completed' to frontend 'sessions'
    sessions = serializers.IntegerField(source='sessions_completed', read_only=True)
    # Mapping backend 'avg_rating' to frontend 'rating'
    rating = serializers.DecimalField(source='avg_rating', max_digits=3, decimal_places=2, read_only=True, allow_null=True)
    
    # Getting mentor's username and ID by traversing relationships
    mentor = serializers.CharField(source='profile.user.username', read_only=True)
    mentorId = serializers.IntegerField(source='profile.user.id', read_only=True)

    class Meta:
        model = Skill
        # Include all fields needed for the public skill card
        fields = [
            'id', 'title', 'price', 'description', 'category',
            'level', 'rating', 'sessions', 'mentor', 'mentorId', 'tags' # Include tags here too
        ]

# --- Serializer for Mentor's Availability Management ---
class AvailabilitySerializer(serializers.ModelSerializer):
    # mentor_username = serializers.CharField(source='mentor.user.username', read_only=True) # Optional: if you want to display mentor username

    class Meta:
        model = Availability
        fields = ['id', 'mentor', 'day_of_week', 'start_time', 'end_time', 'is_available']
        # 'mentor' is set by the view's perform_create/update
        read_only_fields = ['id', 'mentor']

    def create(self, validated_data):
        request = self.context.get('request', None)
        if request and hasattr(request, 'user') and hasattr(request.user, 'profile'):
            user_profile = request.user.profile
            if user_profile.role != 'mentor':
                raise serializers.ValidationError("Only mentors can add availability.")
            # Ensure the availability is linked to the current mentor's profile
            return Availability.objects.create(mentor=user_profile, **validated_data)
        raise serializers.ValidationError("User not authenticated or profile not found.")

    def update(self, instance, validated_data):
        request = self.context.get('request', None)
        if request and hasattr(request, 'user') and hasattr(request.user, 'profile'):
            # Ensure the mentor trying to update owns this availability
            if instance.mentor.user != request.user:
                raise serializers.ValidationError("You do not have permission to update this availability.")
            return super().update(instance, validated_data)
        raise serializers.ValidationError("User not authenticated or profile not found.")