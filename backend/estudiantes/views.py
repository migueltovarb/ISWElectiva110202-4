from django.shortcuts import render
from rest_framework import viewsets
from .models import Estudiante
from .serializers import EstudianteSerializer

# Create your views here.

class EstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer
