from django.urls import path, include
from .views import HabitacionViewSet, ReservaViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'habitaciones', HabitacionViewSet)
router.register(r'reservas', ReservaViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 