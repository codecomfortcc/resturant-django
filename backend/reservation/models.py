from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class SeatAvailability(models.Model):
    date = models.DateField()
    time = models.CharField(max_length=10)
    total_seats = models.IntegerField(default=80)
    remaining_seats = models.IntegerField(default=80)

    class Meta:
        unique_together = ('date', 'time')
    

class Reservation(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    guests = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(7)])
    date = models.DateField()
    time = models.CharField(max_length=10)
    message = models.TextField(blank=True)
