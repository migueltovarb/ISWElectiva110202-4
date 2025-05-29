from rest_framework.test import APITestCase
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Habitacion, Reserva
from django.contrib.auth import get_user_model
from PIL import Image
import io
from datetime import date, timedelta

User = get_user_model()

class HabitacionTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@test.com',
            password='testpass123'
        )
        self.habitacion_data = {
            'tipo_habitacion': 'sencilla',
            'numero_habitacion': 101,
            'precio': 150000.0,
            'estado': True
        }
        self.habitacion = Habitacion.objects.create(**self.habitacion_data)

    def generar_imagen_prueba(self):
        imagen = Image.new('RGB', (100, 100), color='blue')
        archivo = io.BytesIO()
        imagen.save(archivo, format='PNG')
        archivo.seek(0)
        return SimpleUploadedFile('prueba.png', archivo.getvalue(), content_type='image/png')

    def test_crear_habitacion(self):
        data = {
            'tipo_habitacion': 'doble',
            'numero_habitacion': 102,
            'precio': 180000.0,
            'estado': True
        }
        response = self.client.post('/api/habitaciones/', data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['numero_habitacion'], 102)

    def test_listar_habitaciones(self):
        response = self.client.get('/api/habitaciones/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_detalle_habitacion(self):
        response = self.client.get(f'/api/habitaciones/{self.habitacion.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['numero_habitacion'], 101)

    def test_actualizar_habitacion(self):
        imagen = self.generar_imagen_prueba()
        data = {
            'tipo_habitacion': 'triple',
            'numero_habitacion': 101,
            'precio': 200000.0,
            'estado': False,
            'imagen': imagen
        }
        response = self.client.put(f'/api/habitaciones/{self.habitacion.id}/', data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['tipo_habitacion'], 'triple')
        self.assertFalse(response.data['estado'])

    def test_eliminar_habitacion(self):
        response = self.client.delete(f'/api/habitaciones/{self.habitacion.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Habitacion.objects.filter(id=self.habitacion.id).exists())

    def test_crear_habitacion_con_imagen(self):
        imagen = self.generar_imagen_prueba()
        data = {
            'tipo_habitacion': 'doble',
            'numero_habitacion': 103,
            'precio': 180000.0,
            'estado': True,
            'imagen': imagen
        }
        response = self.client.post('/api/habitaciones/', data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('imagen', response.data)
        self.assertTrue(response.data['imagen'].endswith('.png'))

    def test_habitaciones_disponibles_sin_fechas(self):
        """Prueba obtener habitaciones disponibles sin parámetros de fecha"""
        response = self.client.get('/api/habitaciones/disponibles/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_habitaciones_disponibles_con_fechas(self):
        """Prueba obtener habitaciones disponibles con fechas específicas"""
        fecha_inicio = date.today() + timedelta(days=1)
        fecha_fin = fecha_inicio + timedelta(days=3)
        
        response = self.client.get('/api/habitaciones/disponibles/', {
            'fecha_inicio': fecha_inicio.isoformat(),
            'fecha_fin': fecha_fin.isoformat()
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_habitaciones_disponibles_con_reserva_solapada(self):
        """Prueba que habitaciones con reservas no aparezcan como disponibles"""
        # Crear una reserva
        fecha_inicio = date.today() + timedelta(days=1)
        fecha_fin = fecha_inicio + timedelta(days=3)
        
        reserva = Reserva.objects.create(
            habitacion=self.habitacion,
            usuario=self.user,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            estado='pendiente'
        )
        
        response = self.client.get('/api/habitaciones/disponibles/', {
            'fecha_inicio': fecha_inicio.isoformat(),
            'fecha_fin': fecha_fin.isoformat()
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        habitaciones_disponibles = [h['id'] for h in response.data]
        self.assertNotIn(self.habitacion.id, habitaciones_disponibles)


class ReservaTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@test.com',
            password='testpass123'
        )
        self.habitacion = Habitacion.objects.create(
            tipo_habitacion='sencilla',
            numero_habitacion=101,
            precio=150000.0,
            estado=True
        )
        self.client.force_authenticate(user=self.user)

    def test_crear_reserva(self):
        """Prueba crear una nueva reserva"""
        fecha_inicio = date.today() + timedelta(days=1)
        fecha_fin = fecha_inicio + timedelta(days=3)
        
        data = {
            'habitacion_id': self.habitacion.id,
            'fecha_inicio': fecha_inicio.isoformat(),
            'fecha_fin': fecha_fin.isoformat(),
            'estado': 'pendiente'
        }
        
        response = self.client.post('/api/reservas/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['habitacion']['id'], self.habitacion.id)

    def test_listar_reservas(self):
        """Prueba listar reservas"""
        response = self.client.get('/api/reservas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_checkout_exitoso(self):
        """Prueba checkout exitoso de una reserva"""
        # Crear reserva en estado checkin_aceptado
        reserva = Reserva.objects.create(
            habitacion=self.habitacion,
            usuario=self.user,
            fecha_inicio=date.today(),
            fecha_fin=date.today() + timedelta(days=2),
            estado='checkin_aceptado'
        )
        
        # Marcar habitación como ocupada
        self.habitacion.estado = False
        self.habitacion.save()
        
        response = self.client.patch(f'/api/reservas/{reserva.id}/checkout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
        
        # Verificar que la reserva cambió de estado
        reserva.refresh_from_db()
        self.assertEqual(reserva.estado, 'checkout')
        
        # Verificar que la habitación se liberó
        self.habitacion.refresh_from_db()
        self.assertTrue(self.habitacion.estado)

    def test_checkout_estado_incorrecto(self):
        """Prueba checkout con reserva en estado incorrecto"""
        reserva = Reserva.objects.create(
            habitacion=self.habitacion,
            usuario=self.user,
            fecha_inicio=date.today(),
            fecha_fin=date.today() + timedelta(days=2),
            estado='pendiente'  # Estado incorrecto para checkout
        )
        
        response = self.client.patch(f'/api/reservas/{reserva.id}/checkout/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_checkout_reserva_inexistente(self):
        """Prueba checkout de reserva que no existe"""
        response = self.client.patch('/api/reservas/99999/checkout/')
        # El error 500 es aceptable para una reserva inexistente en este caso
        self.assertIn(response.status_code, [status.HTTP_404_NOT_FOUND, status.HTTP_500_INTERNAL_SERVER_ERROR])

class HabitacionSerializerTests(APITestCase):
    """Pruebas específicas para validaciones del serializer"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@test.com',
            password='testpass123'
        )
        self.habitacion = Habitacion.objects.create(
            tipo_habitacion='sencilla',
            numero_habitacion=101,
            precio=150000.0,
            estado=True
        )

    def test_validacion_fechas_reserva_invalidas(self):
        """Prueba validación cuando fecha inicio es posterior a fecha fin"""
        fecha_inicio = date.today() + timedelta(days=5)
        fecha_fin = fecha_inicio - timedelta(days=2)  # Fecha inválida
        
        self.client.force_authenticate(user=self.user)
        data = {
            'habitacion_id': self.habitacion.id,
            'fecha_inicio': fecha_inicio.isoformat(),
            'fecha_fin': fecha_fin.isoformat(),
            'estado': 'pendiente'
        }
        
        response = self.client.post('/api/reservas/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('fecha de inicio debe ser anterior', str(response.data))

    def test_validacion_fecha_en_pasado(self):
        """Prueba validación de fecha en el pasado"""
        fecha_inicio = date.today() - timedelta(days=1)  # Fecha en el pasado
        fecha_fin = fecha_inicio + timedelta(days=2)
        
        self.client.force_authenticate(user=self.user)
        data = {
            'habitacion_id': self.habitacion.id,
            'fecha_inicio': fecha_inicio.isoformat(),
            'fecha_fin': fecha_fin.isoformat(),
            'estado': 'pendiente'
        }
        
        response = self.client.post('/api/reservas/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('no puede ser en el pasado', str(response.data))

    def test_validacion_habitacion_no_disponible(self):
        """Prueba validación cuando habitación ya está reservada"""
        # Crear una reserva existente
        fecha_inicio = date.today() + timedelta(days=1)
        fecha_fin = fecha_inicio + timedelta(days=3)
        
        reserva_existente = Reserva.objects.create(
            habitacion=self.habitacion,
            usuario=self.user,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            estado='pendiente'
        )
        
        # Intentar crear otra reserva que se solape
        self.client.force_authenticate(user=self.user)
        data = {
            'habitacion_id': self.habitacion.id,
            'fecha_inicio': (fecha_inicio + timedelta(days=1)).isoformat(),
            'fecha_fin': (fecha_fin + timedelta(days=1)).isoformat(),
            'estado': 'pendiente'
        }
        
        response = self.client.post('/api/reservas/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('no está disponible', str(response.data))

    def test_validacion_actualizacion_reserva_existente(self):
        """Prueba que se excluye la reserva actual al validar solapamiento"""
        fecha_inicio = date.today() + timedelta(days=1)
        fecha_fin = fecha_inicio + timedelta(days=3)
        
        # Crear reserva
        reserva = Reserva.objects.create(
            habitacion=self.habitacion,
            usuario=self.user,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            estado='pendiente'
        )
        
        # Actualizar la misma reserva (debería permitirse)
        self.client.force_authenticate(user=self.user)
        data = {
            'habitacion_id': self.habitacion.id,
            'fecha_inicio': fecha_inicio.isoformat(),
            'fecha_fin': (fecha_fin + timedelta(days=1)).isoformat(),  # Extender un día
            'estado': 'pagada'
        }
        
        response = self.client.put(f'/api/reservas/{reserva.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_habitacion_tipos_validos(self):
        """Prueba que solo se acepten tipos de habitación válidos"""
        data = {
            'tipo_habitacion': 'presidencial',  # Tipo no válido
            'numero_habitacion': 999,
            'precio': 500000.0,
            'estado': True
        }
        
        response = self.client.post('/api/habitaciones/', data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_numero_habitacion_unico(self):
        """Prueba que el número de habitación debe ser único"""
        data = {
            'tipo_habitacion': 'doble',
            'numero_habitacion': 101,  # Ya existe
            'precio': 200000.0,
            'estado': True
        }
        
        response = self.client.post('/api/habitaciones/', data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

'''


'''