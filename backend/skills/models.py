from django.db import models
from profiles.models import CustomUser, UserProfile
from django.core.validators import MinValueValidator

class Skill(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='offered_skills', limit_choices_to={'role': 'mentor'})
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])

    # --- NEW FIELDS TO ADD ---
    category = models.CharField(max_length=100, blank=True, null=True) # e.g., "Frontend Development"
    level = models.CharField(max_length=50, blank=True, null=True)     # e.g., "Expert", "Intermediate"
    description = models.TextField(blank=True, null=True)              # e.g., "State management, performance..."
    # For tags, JSONField is often convenient for a simple list, or ManyToManyField for reusable tags
    tags = models.JSONField(default=list, blank=True)                  # e.g., ["Hooks", "Context API"]
    active = models.BooleanField(default=True)                         # e.g., true/false
    # sessions_completed and avg_rating are often calculated, but can be stored if you need to manually set them
    sessions_completed = models.PositiveIntegerField(default=0)        # Total sessions mentored for this skill
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True) # Average rating for this skill

    class Meta:
        unique_together = ('profile', 'name')

    def __str__(self):
        mentor_username = self.profile.user.username if self.profile and hasattr(self.profile, 'user') else 'N/A'
        return f"{self.name} (${self.price}/hr) for {mentor_username}"

class Availability(models.Model):
    mentor = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='availabilities')
    day_of_week = models.CharField(max_length=20)  # e.g., "Monday", "Tuesday", etc.
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.mentor.username} - {self.day_of_week} {self.start_time} - {self.end_time}"