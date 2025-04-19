from rest_framework.routers import DefaultRouter
from .views import SkillViewSet, AvailabilityViewSet

router = DefaultRouter()
router.register(r'', SkillViewSet, basename='skill')
router.register(r'availabilities', AvailabilityViewSet, basename='availability')

urlpatterns = router.urls