from django.db import models
from accounts.models import User

class Skill(models.Model):
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    description = models.TextField()
    price_per_session = models.DecimalField(max_digits=6, decimal_places=2)  # optional

    def __str__(self):
        return f"{self.name} - {self.mentor.username}"
