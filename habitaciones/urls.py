from django.urls import path, include
from .views import HabitacionViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'habitaciones', HabitacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 