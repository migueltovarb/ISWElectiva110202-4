from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(username=request.data['username'])
            response.data['is_admin'] = user.is_staff
            response.data['is_superuser'] = user.is_superuser
        return response

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'status': 'error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        return Response({
            'status': 'success',
            'message': 'Usuario registrado exitosamente'
        }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    """
    Obtiene la información del usuario actual
    """
    user = request.user
    serializer = UserSerializer(user)
    data = serializer.data
    data['is_admin'] = user.is_staff
    data['is_superuser'] = user.is_superuser
    return Response(data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Actualiza el perfil del usuario
    """
    user = request.user
    data = request.data

    # Verificar la contraseña actual si se está intentando cambiar la contraseña
    if data.get('new_password'):
        if not data.get('current_password'):
            return Response(
                {'detail': 'Se requiere la contraseña actual'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not check_password(data['current_password'], user.password):
            return Response(
                {'detail': 'Contraseña actual incorrecta'},
                status=status.HTTP_400_BAD_REQUEST
            )

    # Actualizar campos
    if 'username' in data and data['username'] != user.username:
        if User.objects.filter(username=data['username']).exclude(id=user.id).exists():
            return Response(
                {'detail': 'Este nombre de usuario ya está en uso'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.username = data['username']

    if 'email' in data and data['email'] != user.email:
        if User.objects.filter(email=data['email']).exclude(id=user.id).exists():
            return Response(
                {'detail': 'Este correo electrónico ya está en uso'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.email = data['email']

    if data.get('new_password'):
        user.set_password(data['new_password'])

    user.save()
    return Response({'detail': 'Perfil actualizado exitosamente'})
