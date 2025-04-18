# Register your models here.
from django.contrib import admin
from .models import SessionBooking
from .models import Review

@admin.register(SessionBooking)
class SessionBookingAdmin(admin.ModelAdmin):
    list_display = ('learner', 'skill', 'session_date', 'session_time', 'is_confirmed', 'created_at')
    list_filter = ('is_confirmed', 'session_date')
    search_fields = ('learner__username', 'skill__name', 'skill__mentor__username')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('session', 'rating', 'created_at')
    search_fields = ('session__learner__username', 'session__skill__mentor__username')
    list_filter = ('rating', 'created_at')
