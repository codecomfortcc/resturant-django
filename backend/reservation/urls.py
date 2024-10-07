from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SeatAvailabilityViewSet, ReservationViewSet

router = DefaultRouter()
router.register(r'seat-availability/check-availability', SeatAvailabilityViewSet)
router.register(r'reservations', ReservationViewSet)

urlpatterns = [
    path('', include(router.urls)),

]
