from rest_framework import serializers
from .models import Habitacion, Reserva

class HabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habitacion
        fields = '__all__'

class ReservaSerializer(serializers.ModelSerializer):
    habitacion = HabitacionSerializer(read_only=True)
    habitacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Habitacion.objects.all(), source='habitacion', write_only=True
    )
    class Meta:
        model = Reserva
        fields = '__all__'
        read_only_fields = ('usuario',)