# Register your models here.
from django.contrib import admin
from .models import SessionBooking

@admin.register(SessionBooking)
class SessionBookingAdmin(admin.ModelAdmin):
    list_display = ('learner', 'skill', 'session_date', 'session_time', 'is_confirmed', 'created_at')
    list_filter = ('is_confirmed', 'session_date')
    search_fields = ('learner__username', 'skill__name', 'skill__mentor__username')
