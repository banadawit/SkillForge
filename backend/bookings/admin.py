# Register your models here.
from django.contrib import admin
from .models import SessionBooking
from .models import Review

@admin.register(SessionBooking)
class SessionBookingAdmin(admin.ModelAdmin):
    list_display = ('learner', 'skill', 'session_date', 'session_time', 'status', 'created_at')
    list_filter = ('status', 'session_date')
    search_fields = ('learner__username', 'skill__name', 'skill__profile__user__username')
    readonly_fields = ('created_at',)
    fields = ('mentor', 'learner', 'skill', 'session_date', 'session_time', 'status', 'duration', 'skill_level', 'message', 'created_at')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('get_mentor_username', 'get_student_username', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('comment', 'mentor_profile__user__username', 'student__username')
    readonly_fields = ('created_at',) # Ensure creation date isn't editable
    # Add fields to manage in the admin form
    fields = ('mentor_profile', 'student', 'rating', 'comment', 'created_at')

    def get_mentor_username(self, obj):
        return obj.mentor_profile.user.username if obj.mentor_profile and obj.mentor_profile.user else 'N/A'
    get_mentor_username.short_description = 'Mentor'

    def get_student_username(self, obj):
        return obj.student.username if obj.student else 'N/A'
    get_student_username.short_description = 'Student'
