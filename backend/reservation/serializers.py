from rest_framework import serializers
from .models import SeatAvailability, Reservation

class SeatAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = SeatAvailability
        fields = ['id', 'date', 'time', 'total_seats', 'remaining_seats']

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'name', 'phone', 'guests', 'date', 'time', 'message']
