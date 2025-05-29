from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Habitacion, Reserva
from .serializers import HabitacionSerializer, ReservaSerializer
from rest_framework import serializers

class HabitacionViewSet(viewsets.ModelViewSet):
    queryset = Habitacion.objects.all()
    serializer_class = HabitacionSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        

        habitaciones = Habitacion.objects.filter(estado=True)
        

        if fecha_inicio and fecha_fin:

            reservas_solapadas = Reserva.objects.filter(
                fecha_inicio__lt=fecha_fin,
                fecha_fin__gt=fecha_inicio,
                estado__in=['pendiente', 'pagada', 'checkin_aceptado']
            ).values_list('habitacion_id', flat=True)
            

            habitaciones = habitaciones.exclude(id__in=reservas_solapadas)
        
        serializer = self.get_serializer(habitaciones, many=True)
        return Response(serializer.data)

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=True, methods=['patch'])
    def checkout(self, request, pk=None):
        try:
            reserva = self.get_object()
            if reserva.estado != 'checkin_aceptado':
                return Response({'error': 'La reserva no está en estado de check-in aceptado.'}, status=400)

            reserva.estado = 'checkout'
            reserva.save()

            # Liberar la habitación
            habitacion = reserva.habitacion
            habitacion.estado = True
            habitacion.save()

            return Response({'success': 'Check-out realizado y habitación liberada.'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)