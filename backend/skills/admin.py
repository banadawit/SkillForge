from django.contrib import admin
from .models import Skill
from .models import Availability

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('title', 'mentor', 'price_per_session')
    search_fields = ('title', 'mentor__username')
    list_filter = ('mentor',)

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('mentor', 'day_of_week', 'start_time', 'end_time')
    search_fields = ('mentor__username', 'day_of_week')
    list_filter = ('day_of_week',)
    ordering = ('mentor', 'day_of_week')
