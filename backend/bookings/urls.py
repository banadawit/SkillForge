from rest_framework.routers import DefaultRouter
from .views import SessionBookingViewSet

router = DefaultRouter()
router.register(r'', SessionBookingViewSet, basename='booking')

urlpatterns = router.urls