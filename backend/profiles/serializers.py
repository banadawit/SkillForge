# profiles/serializers.py
from rest_framework import serializers
from .models import CustomUser, UserProfile
# No need to import Skill or Review here if they are in separate apps
# from skills.serializers import SkillSerializer # This would be if you wanted nested, but usually you won't in this setup
# from reviews.serializers import ReviewSerializer

class UserProfileSerializer(serializers.ModelSerializer):
    # No 'skills' or 'reviews' fields here for direct nesting.
    # They will be fetched via their own API endpoints.
    class Meta:
        model = UserProfile
        fields = ['role', 'bio', 'availability'] # Only profile-specific fields

class CurrentUserAndProfileSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer() # Nested profile data - read-only by default for OneToOneField
    full_name = serializers.CharField(source='username', read_only=True)
    email = serializers.EmailField(read_only=True)

    # Add fields for related data (like skills and reviews) if you want to include their URLs/IDs
    # This example keeps them separate for simplicity but you could use HyperlinkedRelatedField
    # skills_url = serializers.HyperlinkedIdentityField(view_name='skill-list', lookup_url_kwarg='profile_pk', read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'full_name', 'email', 'profile']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        # Update CustomUser fields if any are allowed
        # instance.username = validated_data.get('username', instance.username)
        instance.save()

        # Update UserProfile fields
        profile_instance = instance.profile
        profile_instance.bio = profile_data.get('bio', profile_instance.bio)
        profile_instance.availability = profile_data.get('availability', profile_instance.availability)
        profile_instance.save()

        return instance

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    role = serializers.ChoiceField(choices=UserProfile.USER_ROLE_CHOICES, default='learner', write_only=True)


    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2', 'role')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        password2 = validated_data.pop('password2') # Pop this as it's not a model field
        role = validated_data.pop('role', 'learner') # Pop the role for UserProfile
        bio = validated_data.pop('bio', '')

        user = CustomUser.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        # Create UserProfile with the specified role
        # UserProfile.objects.create(user=user, role=role)
        if hasattr(user, 'profile'): # Check if profile already exists (it should due to signal)
            user.profile.role = role
            user.profile.bio = bio
            user.profile.save()
        else:
            # Fallback, though the signal should ensure this path is rarely hit if ever.
            UserProfile.objects.create(user=user, role=role, bio=bio)


        return user