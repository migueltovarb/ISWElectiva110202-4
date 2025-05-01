from rest_framework import serializers
from .models import Configuracion

class ConfiguracionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuracion
        fields = ['id', 'check_in_time', 'check_out_time'] 