from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.db.models.signals import post_save
from django.dispatch import receiver

class CustomUser(AbstractUser):
    # Add any additional fields directly to the User model if needed
    # For now, we'll keep profile specific fields in UserProfile
    pass

class UserProfile(models.Model):
    USER_ROLE_CHOICES = (
        ('mentor', 'Mentor'),
        ('learner', 'Learner'),
    )
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=USER_ROLE_CHOICES, default='learner')
    bio = models.TextField(blank=True, null=True)
    availability = models.CharField(max_length=255, blank=True, null=True)
    # session_count for learners can be calculated from sessions related to them
    # skills_learned for learners can be calculated from sessions
    # top_skills for learners can be derived from skills_learned or a separate tracking

    def __str__(self):
        return f"{self.user.username}'s Profile ({self.role})"
    
# Signal to create a UserProfile automatically when a new CustomUser is created

@receiver(post_save, sender=CustomUser)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    instance.profile.save() # Ensure profile exists and save it (important for updates)