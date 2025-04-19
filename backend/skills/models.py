from django.db import models
from accounts.models import User

class Skill(models.Model):
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')
    title = models.CharField(max_length=100)
    description = models.TextField()
    level = models.CharField(max_length=50)
    price_per_session = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.title} - {self.mentor.username}"

class Availability(models.Model):
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='availabilities')
    day_of_week = models.CharField(max_length=20)  # e.g., "Monday", "Tuesday", etc.
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.mentor.username} - {self.day_of_week} {self.start_time} - {self.end_time}"