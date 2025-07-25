from rest_framework.routers import DefaultRouter
from .views import SessionBookingViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'', SessionBookingViewSet, basename='booking')
router.register(r'reviews', ReviewViewSet, basename='review')   

urlpatterns = router.urls

