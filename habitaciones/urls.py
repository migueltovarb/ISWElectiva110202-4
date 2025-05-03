from django.urls import path
from .views import HabitacionViewSet

urlpatterns = [
    path('', HabitacionViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('<int:pk>/', HabitacionViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),
    path('disponibles/', HabitacionViewSet.as_view({
        'get': 'disponibles'
    })),
] 