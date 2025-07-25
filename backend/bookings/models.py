from django.db import models
from skills.models import Skill
from skills.models import Availability # Assuming Availability is in skills.models
from profiles.models import CustomUser, UserProfile # Import CustomUser, UserProfile
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

class SessionBooking(models.Model):
    # The 'mentor' for the session should be directly on the SessionBooking model
    # It links to a UserProfile (who is a mentor)
    mentor = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='mentored_sessions',
        limit_choices_to={'role': 'mentor'} # Ensure it's a mentor's profile
    )
    # The 'learner' for the session should be a CustomUser
    learner = models.ForeignKey(
        CustomUser, # Should be CustomUser, not UserProfile, as it's the actual user
        on_delete=models.CASCADE,
        related_name='booked_sessions'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='sessions_booked' # Changed related_name for clarity
    )
    session_date = models.DateField()
    session_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_confirmed = models.BooleanField(default=False)

    def clean(self):
        super().clean() # Call the parent clean method first

        # Ensure the learner is actually a 'learner' role (optional but good validation)
        if self.learner.profile.role != 'learner':
            raise ValidationError("Only users with 'learner' role can book sessions.")

        # Ensure the mentor associated with the skill matches the selected mentor for the session
        if self.skill.profile != self.mentor:
            raise ValidationError("The selected mentor does not offer this skill.")

        # Ensure the session time is within the mentor's availability for that day
        # Note: skill.mentor needs to be skill.profile if Skill model's mentor is UserProfile
        # Assuming Skill model has a ForeignKey to UserProfile named 'profile'
        # Or if Skill directly has 'mentor' field
        # The previous traceback showed 'skill.mentor' does not exist for Skill model, it has 'skill.profile'
        try:
            mentor_profile_for_availability = self.mentor # Directly use the mentor field on booking
            day_of_week = self.session_date.strftime('%A').lower() # 'Monday', 'Tuesday', etc. (lowercase for consistency)

            availability = Availability.objects.filter(
                mentor=mentor_profile_for_availability, # Filter by the mentor (UserProfile)
                day_of_week__iexact=day_of_week,  # Case-insensitive day of week match
                start_time__lte=self.session_time,
                end_time__gte=self.session_time
            ).exists() # Use .exists() for efficiency

            if not availability:
                raise ValidationError(f"The mentor is not available on {self.session_date.strftime('%A')} at {self.session_time}.")

            # Prevent double booking for the specific mentor at the exact time
            # Only if is_confirmed is True
            if self.is_confirmed: # Only check for confirmed bookings
                conflicting_bookings = SessionBooking.objects.filter(
                    mentor=self.mentor,
                    session_date=self.session_date,
                    session_time=self.session_time,
                    is_confirmed=True # Only confirmed bookings
                ).exclude(pk=self.pk).exists() # Exclude current instance for updates

                if conflicting_bookings:
                    raise ValidationError(f"This mentor is already booked on {self.session_date} at {self.session_time}.")

        except AttributeError as e:
            # Handle cases where self.skill.mentor or self.skill.profile might not be correctly linked
            raise ValidationError(f"Configuration error: Missing mentor profile linked to skill or booking. Detail: {e}")
        except Exception as e:
            raise ValidationError(f"An unexpected error occurred during availability check: {e}")

    def __str__(self):
        # Access mentor and learner usernames through their respective related models
        mentor_username = self.mentor.user.username if self.mentor and hasattr(self.mentor, 'user') else 'N/A Mentor'
        learner_username = self.learner.username if self.learner else 'N/A Learner'
        skill_name = self.skill.name if self.skill else 'N/A Skill' # Assuming Skill has a 'name' field
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