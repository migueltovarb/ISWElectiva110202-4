from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/registro/', include('registro.urls')),
    path('api/', include('habitaciones.urls')),
    path('api/configuraciones/', include('configuraciones.urls')),
    path('api/reservas/', include('reservas.urls')),
]

# Servir archivos media tanto en desarrollo como en producción (Azure)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

'''
Usamos modelviewset para hace todos los metodos de un CRUD
Como usar los metodos de un CRUD
GET (LISTAR) http://localhost:8000/api/habitaciones/ 
POST (CREAR) http://localhost:8000/api/habitaciones/ (Colocamos formato en JSON)
PUT (ACTUALIZAR) http://localhost:8000/api/habitaciones/id/ (Al final colocamos el ID de la habitacion y el formato en JSON)
DELETE (ELIMINAR) http://localhost:8000/api/habitaciones/id/ (Al final colocamos el ID de la habitacion)
'''
