from django.db import models
from skills.models import Skill
from skills.models import Availability
from profiles.models import CustomUser, UserProfile
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

class SessionBooking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('rescheduled', 'Rescheduled'),
    )

    mentor = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='mentored_sessions',
        limit_choices_to={'role': 'mentor'}
    )
    learner = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='booked_sessions'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='sessions_booked'
    )
    session_date = models.DateField()
    session_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    # ⭐ NEW FIELDS FROM THE FORM ⭐
    duration = models.PositiveIntegerField(default=60) # In minutes
    skill_level = models.CharField(max_length=50, blank=True, null=True)
    message = models.TextField(blank=True, null=True)

    def clean(self):
        super().clean()
        # Temporarily disable validation to debug the issue
        return
        # if self.learner.profile.role != 'learner':
        #     raise ValidationError("Only users with 'learner' role can book sessions.")
        # if self.skill.profile != self.mentor:
        #     raise ValidationError("The selected mentor does not offer this skill.")
        
        # try:
        #     mentor_profile_for_availability = self.mentor
        #     day_of_week = self.session_date.strftime('%A').lower()
        #     availability = Availability.objects.filter(
        #         mentor=mentor_profile_for_availability,
        #         day_of_week__iexact=day_of_week,
        #         start_time__lte=self.session_time,
        #         end_time__gte=self.session_time
        #     ).exists()
        #     if not availability:
        #         raise ValidationError(f"The mentor is not available on {self.session_date.strftime('%A')} at {self.session_time}.")
        #     if self.status == 'accepted':
        #         conflicting_bookings = SessionBooking.objects.filter(
        #             mentor=self.mentor,
        #             session_date=self.session_date,
        #             session_time=self.session_time,
        #             status='accepted'
        #         ).exclude(pk=self.pk).exists()
        #         if conflicting_bookings:
        #         raise ValidationError(f"This mentor is already booked on {self.session_date} at {self.session_time}.")
        # except AttributeError as e:
        #     raise ValidationError(f"Configuration error: Missing mentor profile linked to skill or booking. Detail: {e}")
        # except Exception as e:
        #     raise ValidationError(f"An unexpected error occurred during availability check: {e}")
    
    def __str__(self):
        mentor_username = self.mentor.user.username if self.mentor and hasattr(self.mentor, 'user') else 'N/A Mentor'
        learner_username = self.learner.username if self.learner else 'N/A Learner'
        skill_name = self.skill.name if self.skill else 'N/A Skill'
        return f"{learner_username} booked {skill_name} with {mentor_username}"

class Review(models.Model):
    mentor_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_reviews', limit_choices_to={'role': 'mentor'}, null=True,
    blank=True )
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='given_reviews')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)], help_text="Rating out of 5 stars")
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        # Temporarily commenting out unique_together here if it causes issues with null=True
        # Will need to re-add it or adjust if null reviews are allowed for the same mentor/student
        unique_together = ('mentor_profile', 'student')

    def __str__(self):
        mentor_username = self.mentor_profile.user.username if self.mentor_profile and hasattr(self.mentor_profile, 'user') else "N/A Mentor"
        student_username = self.student.username if self.student else "N/A Student"
        return f"Review for {mentor_username} by {student_username} ({self.rating} stars)"