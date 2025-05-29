from rest_framework import serializers
from .models import Habitacion, Reserva
from datetime import date

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
    
    def validate(self, data):
        fecha_inicio = data.get('fecha_inicio')
        fecha_fin = data.get('fecha_fin')
        habitacion = data.get('habitacion')
        

        if fecha_inicio and fecha_fin and fecha_inicio >= fecha_fin:
            raise serializers.ValidationError("La fecha de inicio debe ser anterior a la fecha de fin.")
        

        if fecha_inicio and fecha_inicio < date.today():
            raise serializers.ValidationError("La fecha de inicio no puede ser en el pasado.")
        

        if habitacion and fecha_inicio and fecha_fin:
            reservas_existentes = Reserva.objects.filter(
                habitacion=habitacion,
                fecha_inicio__lt=fecha_fin,
                fecha_fin__gt=fecha_inicio,
                estado__in=['pendiente', 'pagada', 'checkin_aceptado']
            )

            if self.instance:
                reservas_existentes = reservas_existentes.exclude(id=self.instance.id)
            
            if reservas_existentes.exists():
                raise serializers.ValidationError("La habitación no está disponible en las fechas seleccionadas.")
        
        return data