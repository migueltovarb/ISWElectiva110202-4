from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class AuthenticationTests(APITestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'email': 'test@test.com',
            'password': 'testpass123',
            'confirm_password': 'testpass123',
            'full_name': 'Test User'
        }
        self.user = User.objects.create_user(
            username='existinguser',
            email='existing@test.com',
            password='existingpass123'
        )

    def test_register_user_success(self):
        """Prueba el registro exitoso de un usuario"""
        response = self.client.post('/api/registro/register/', self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'success')
        self.assertIn('message', response.data)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_register_user_invalid_data(self):
        """Prueba el registro con datos inválidos"""
        invalid_data = {
            'username': 'testuser',
            'email': 'invalid-email',
            'password': 'pass',
            'confirm_password': 'different',
            'full_name': 'Test User'
        }
        response = self.client.post('/api/registro/register/', invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
        self.assertIn('errors', response.data)

    def test_login_success(self):
        """Prueba el login exitoso"""
        login_data = {
            'username': 'existinguser',
            'password': 'existingpass123'
        }
        response = self.client.post('/api/registro/login/', login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('is_admin', response.data)

    def test_login_admin_user(self):
        """Prueba login con usuario admin"""
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='adminpass123',
            is_staff=True,
            is_superuser=True
        )
        login_data = {
            'username': 'admin',
            'password': 'adminpass123'
        }
        response = self.client.post('/api/registro/login/', login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_admin'])
        self.assertTrue(response.data['is_superuser'])

    def test_get_user_info_authenticated(self):
        """Prueba obtener información del usuario autenticado"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/registro/user-info/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'existinguser')
        self.assertIn('is_admin', response.data)

    def test_get_user_info_unauthenticated(self):
        """Prueba obtener información sin autenticación"""
        response = self.client.get('/api/registro/user-info/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_profile_success(self):
        """Prueba actualización exitosa del perfil"""
        self.client.force_authenticate(user=self.user)
        update_data = {
            'username': 'newusername',
            'email': 'newemail@test.com'
        }
        response = self.client.put('/api/registro/update-profile/', update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'newusername')
        self.assertEqual(self.user.email, 'newemail@test.com')

    def test_update_profile_duplicate_username(self):
        """Prueba actualización con username duplicado"""
        other_user = User.objects.create_user(
            username='otherusername',
            email='other@test.com',
            password='otherpass123'
        )
        self.client.force_authenticate(user=self.user)
        update_data = {'username': 'otherusername'}
        response = self.client.put('/api/registro/update-profile/', update_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('nombre de usuario ya está en uso', response.data['detail'])

    def test_update_profile_duplicate_email(self):
        """Prueba actualización con email duplicado"""
        other_user = User.objects.create_user(
            username='otherusername',
            email='other@test.com',
            password='otherpass123'
        )
        self.client.force_authenticate(user=self.user)
        update_data = {'email': 'other@test.com'}
        response = self.client.put('/api/registro/update-profile/', update_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('correo electrónico ya está en uso', response.data['detail'])

    def test_update_password_success(self):
        """Prueba cambio exitoso de contraseña"""
        self.client.force_authenticate(user=self.user)
        update_data = {
            'current_password': 'existingpass123',
            'new_password': 'newpassword123'
        }
        response = self.client.put('/api/registro/update-profile/', update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword123'))

    def test_update_password_wrong_current(self):
        """Prueba cambio de contraseña con contraseña actual incorrecta"""
        self.client.force_authenticate(user=self.user)
        update_data = {
            'current_password': 'wrongpassword',
            'new_password': 'newpassword123'
        }
        response = self.client.put('/api/registro/update-profile/', update_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Contraseña actual incorrecta', response.data['detail'])

    def test_update_password_missing_current(self):
        """Prueba cambio de contraseña sin proporcionar la actual"""
        self.client.force_authenticate(user=self.user)
        update_data = {'new_password': 'newpassword123'}
        response = self.client.put('/api/registro/update-profile/', update_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Se requiere la contraseña actual', response.data['detail'])

    def test_update_profile_unauthenticated(self):
        """Prueba actualización de perfil sin autenticación"""
        update_data = {'username': 'newusername'}
        response = self.client.put('/api/registro/update-profile/', update_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
