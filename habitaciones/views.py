from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Habitacion
from .serializers import HabitacionSerializer

class HabitacionViewSet(viewsets.ModelViewSet):
    queryset = Habitacion.objects.all()
    serializer_class = HabitacionSerializer
    parser_classes = [MultiPartParser, FormParser]

