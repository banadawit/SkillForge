from django.db import models
from accounts.models import User
from skills.models import Skill
from skills.models import Availability 
from django.core.exceptions import ValidationError

class SessionBooking(models.Model):
    learner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='sessions')
    session_date = models.DateField()
    session_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_confirmed = models.BooleanField(default=False)

    def clean(self):
        # Ensure the session time is within the mentor's availability
        availability = Availability.objects.filter(
            mentor=self.skill.mentor,
            day_of_week=self.session_date.strftime('%A'),  # Get the day of the week
            start_time__lte=self.session_time,
            end_time__gte=self.session_time
        )

        if not availability.exists():
            raise ValidationError(f"The mentor is not available on {self.session_date} at {self.session_time}.")

    def __str__(self):
        return f"{self.learner.username} booked {self.skill.title} with {self.skill.mentor.username}"

        

class Review(models.Model):
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    session = models.OneToOneField(SessionBooking, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.session.learner.username} for {self.session.skill.mentor.username}"
