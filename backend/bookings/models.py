from django.db import models
from accounts.models import User
from skills.models import Skill

# Create your models here.
class SessionBooking(models.Model):
    learner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='sessions')
    session_date = models.DateField()
    session_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.learner.username} booked {self.skill.name} with {self.skill.mentor.username}"
