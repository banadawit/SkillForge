# profiles/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserProfile
# Import models from other apps to use as inlines
from skills.models import Skill
from bookings.models import Review

# Custom User Admin
class GivenReviewInline(admin.TabularInline):
    model = Review
    fk_name = 'student' # Reviews given by this student user
    extra = 0
    readonly_fields = ('mentor_profile', 'comment', 'rating', 'created_at')
    verbose_name = "Review Given"
    verbose_name_plural = "Reviews Given"

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'is_staff', 'profile_role']
    # fieldsets = UserAdmin.fieldsets + (
    #     (None, {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}), # Example additional fields
    # )
    #  Ensure profile_role is defined if you use it in list_display
    def profile_role(self, obj):
        return obj.profile.role if hasattr(obj, 'profile') else 'N/A'
    profile_role.short_description = 'Role'

    inlines = [GivenReviewInline]

# Inline for Skills (to show skills under a UserProfile if it's a mentor)
class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1 # Number of empty forms to display
    fk_name = 'profile' # The ForeignKey field in Skill that points to UserProfile

# Inline for Reviews (to show reviews under a UserProfile)
# Note: A UserProfile can be a mentor (received reviews) or a learner (given reviews).
# You might want separate inlines or careful filtering.
class ReceivedReviewInline(admin.TabularInline):
    model = Review
    fk_name = 'mentor_profile' # Reviews received by this mentor_profile
    extra = 0 # No empty forms by default
    readonly_fields = ('student', 'comment', 'rating', 'created_at') # Reviews are usually read-only in mentor's profile view
    verbose_name = "Review Received"
    verbose_name_plural = "Reviews Received"



@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'bio', 'availability')
    list_filter = ('role',)
    search_fields = ('user__username', 'bio')
    # Use the inlines:
    inlines = [SkillInline, ReceivedReviewInline]


admin.site.register(CustomUser, CustomUserAdmin)