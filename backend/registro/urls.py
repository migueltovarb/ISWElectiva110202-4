from django.urls import path
from .views import RegisterView, get_user_info, update_profile, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-info/', get_user_info, name='user_info'),
    path('update-profile/', update_profile, name='update_profile'),
]