# My recommended profiles/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    CustomTokenObtainPairView, # Renamed from MyTokenObtainPairView
    CurrentUserProfileView,    # Renamed from UserProfileView
    BecomeMentorView,          # New endpoint
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), # Path changed to login/, name changed
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Path changed to token/refresh/
    path('profile/', CurrentUserProfileView.as_view(), name='current-user-profile'), # Name changed
    path('become-mentor/', BecomeMentorView.as_view(), name='become-mentor'), # New endpoint
]