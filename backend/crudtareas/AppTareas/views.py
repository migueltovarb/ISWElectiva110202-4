import json
from rest_framework import viewsets
from .models import Tarea
from .serializer import TareaSerializer

class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all()
    serializer_class = TareaSerializer
