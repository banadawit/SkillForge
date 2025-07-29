from django.contrib import admin
from .models import Skill
from .models import Availability

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'level', 'active', 'sessions_completed', 'avg_rating', 'get_mentor_username')
    list_filter = ('category', 'level', 'active')
    search_fields = ('name', 'description', 'tags', 'profile__user__username')
    # Add new fields to the admin form for editing
    fields = (
        'profile', 'name', 'price',
        'category', 'level', 'description', 'tags', 'active',
        'sessions_completed', 'avg_rating'
    )
    raw_id_fields = ('profile',) # Use a raw ID input for ForeignKey for better UX with many profiles

    def get_mentor_username(self, obj):
        return obj.profile.user.username if obj.profile and hasattr(obj.profile, 'user') else 'N/A'
    get_mentor_username.short_description = 'Mentor'

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('mentor', 'day_of_week', 'start_time', 'end_time')
    search_fields = ('mentor__username', 'day_of_week')
    list_filter = ('day_of_week',)
    ordering = ('mentor', 'day_of_week')
