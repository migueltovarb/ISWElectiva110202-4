from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Habitacion, Reserva
from .serializers import HabitacionSerializer, ReservaSerializer

class HabitacionViewSet(viewsets.ModelViewSet):
    queryset = Habitacion.objects.all()
    serializer_class = HabitacionSerializer
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        # Obtener parámetros de fecha
        fecha_inicio = request.query_params.get('fecha_inicio', None)
        fecha_fin = request.query_params.get('fecha_fin', None)
        
        # Filtrar habitaciones activas
        habitaciones = Habitacion.objects.filter(estado=True)
        
        # Si se proporcionan fechas, verificar disponibilidad
        if fecha_inicio and fecha_fin:
            # Encontrar habitaciones que NO tienen reservas que se superpongan con las fechas solicitadas
            reservas_conflictivas = Reserva.objects.filter(
                Q(estado__in=['pendiente', 'pagada', 'checkin_aceptado']) &
                (
                    Q(fecha_inicio__lte=fecha_fin) & Q(fecha_fin__gte=fecha_inicio)
                )
            ).values_list('habitacion_id', flat=True)
            
            # Excluir habitaciones con reservas conflictivas
            habitaciones = habitaciones.exclude(id__in=reservas_conflictivas)
        
        serializer = self.get_serializer(habitaciones, many=True)
        return Response(serializer.data)

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer

    def perform_create(self, serializer):
        # Verificar si ya existe una reserva para esta habitación en las fechas solicitadas
        habitacion = serializer.validated_data['habitacion']
        fecha_inicio = serializer.validated_data['fecha_inicio']
        fecha_fin = serializer.validated_data['fecha_fin']
        
        reservas_conflictivas = Reserva.objects.filter(
            habitacion=habitacion,
            estado__in=['pendiente', 'pagada', 'checkin_aceptado']
        ).filter(
            Q(fecha_inicio__lte=fecha_fin) & Q(fecha_fin__gte=fecha_inicio)
        )
        
        if reservas_conflictivas.exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError('Esta habitación ya está reservada para las fechas seleccionadas.')
        
        serializer.save(usuario=self.request.user)

