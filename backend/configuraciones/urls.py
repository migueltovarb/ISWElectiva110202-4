from django.urls import path
from .views import ConfiguracionViewSet

urlpatterns = [
    path('', ConfiguracionViewSet.as_view({
        'get': 'list',
        'put': 'update',
    })),
] 