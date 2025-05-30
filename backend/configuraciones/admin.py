from django.contrib import admin
from .models import Configuracion

@admin.register(Configuracion)
class ConfiguracionAdmin(admin.ModelAdmin):
    list_display = ('id', 'check_in_time', 'check_out_time')
    list_display_links = ('id',)
    search_fields = ('check_in_time', 'check_out_time')
    
    def has_add_permission(self, request):
        # Solo permitir una instancia de configuración
        return not Configuracion.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # No permitir eliminar la configuración
        return False 