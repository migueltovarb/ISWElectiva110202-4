from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Habitacion
from .serializers import HabitacionSerializer

class HabitacionViewSet(viewsets.ModelViewSet):
    queryset = Habitacion.objects.all()
    serializer_class = HabitacionSerializer
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        habitaciones = Habitacion.objects.filter(estado=True)
        serializer = self.get_serializer(habitaciones, many=True)
        return Response(serializer.data)

