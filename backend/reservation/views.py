from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import SeatAvailability, Reservation
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from datetime import datetime
from .serializers import SeatAvailabilitySerializer,ReservationSerializer


class SeatAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = SeatAvailability.objects.all()
    serializer_class = SeatAvailabilitySerializer
    print('queryset')
    def check_availability(self, request):
        date_str = request.query_params.get('date')
        time = request.query_params.get('time')
        print(f"Received date: {date_str}, time: {time}")

        if not date_str or not time:
            return Response({"error": "Date and time are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError as e:
            print(f"Invalid date format: {e}")
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        time_slots = [
            '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
            '01:00 PM', '02:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
            '08:00 PM', '09:00 PM', '10:00 PM'
        ]
        if time not in time_slots:
            return Response({"error": f"Invalid time slot. Valid options are: {', '.join(time_slots)}"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            availability = SeatAvailability.objects.get(date=date, time=time)
            response_data = {
                'date': date.isoformat(),
                'time': time,
                'total_seats': availability.total_seats,
                'remaining_seats': availability.remaining_seats
            }
        except SeatAvailability.DoesNotExist:
            response_data = {
                'date': date.isoformat(),
                'time': time,
                'total_seats': 80,
                'remaining_seats': 80
            }

        print(f"Sending response: {response_data}")
        return Response(response_data, status=status.HTTP_200_OK)

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        date = serializer.validated_data['date']
        time = serializer.validated_data['time']
        guests = serializer.validated_data['guests']

        try:
            availability = SeatAvailability.objects.get(date=date, time=time)
        except SeatAvailability.DoesNotExist:
            availability = SeatAvailability.objects.create(date=date, time=time)
        
        if availability.remaining_seats < guests:
            return Response({"error": "Not enough seats available"}, status=status.HTTP_400_BAD_REQUEST)
        
        availability.remaining_seats -= guests
        availability.save()
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        print("Created Reservation Response Data:", serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    def list(self, request, *args, **kwargs):
        reservations = self.get_queryset()
        serializer = self.get_serializer(reservations, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        reservation = self.get_object()
        date = reservation.date
        time = reservation.time
        guests = reservation.guests

        try:
            availability = SeatAvailability.objects.get(date=date, time=time)
            availability.remaining_seats += guests
            availability.save()
        except SeatAvailability.DoesNotExist:
            pass

        return super().destroy(request, *args, **kwargs)
