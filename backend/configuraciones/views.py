from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Configuracion
from .serializers import ConfiguracionSerializer

class ConfiguracionViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def list(self, request):
        config = Configuracion.get_settings()
        serializer = ConfiguracionSerializer(config)
        return Response(serializer.data)
    
    def update(self, request):
        config = Configuracion.get_settings()
        serializer = ConfiguracionSerializer(config, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 