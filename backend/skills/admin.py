from django.contrib import admin
from .models import Skill
from .models import Availability

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'get_mentor_username')
    list_filter = ('price',)
    search_fields = ('name', 'profile__user__username')
    # Add fields to manage in the admin form
    fields = ('profile', 'name', 'price')

    def get_mentor_username(self, obj):
        return obj.profile.user.username if obj.profile and obj.profile.user else 'N/A'
    get_mentor_username.short_description = 'Mentor' # Column header in list_display

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('mentor', 'day_of_week', 'start_time', 'end_time')
    search_fields = ('mentor__username', 'day_of_week')
    list_filter = ('day_of_week',)
    ordering = ('mentor', 'day_of_week')
