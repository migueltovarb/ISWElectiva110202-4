from django.urls import path

from .views import TareaListCreateView, TareaRetrieveUpdateDestroyView

urlpatterns = [
    path('tareas/', TareaListCreateView.as_view(), name='tarea-list-create'),
    path('tareas/<int:pk>/', TareaRetrieveUpdateDestroyView.as_view(), name='tarea-detail'),
] 

'''
urlpatterns = [
    path('crear', VehiculoApiView.as_view()),
    path('obtener-todos', VehiculoApiView.as_view()),
    path('actualizar/<int:pkid>', VehiculoApiView.as_view(), name='actualizar-vehiculo'),
    path('eliminar/<int:pkid>', VehiculoApiView.as_view(), name='eliminar-vehiculo'),
]
'''