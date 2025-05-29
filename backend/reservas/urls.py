from rest_framework.routers import DefaultRouter
from habitaciones.views import ReservaViewSet

router = DefaultRouter()
router.register(r'', ReservaViewSet)

urlpatterns = router.urls 