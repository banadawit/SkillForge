from django.contrib import admin
from .models import Skill

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'mentor', 'price_per_session')
    search_fields = ('name', 'mentor__username')
    list_filter = ('mentor',)
