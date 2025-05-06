from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Habitacion(models.Model):
    TIPO_CHOICES = [
        ('sencilla', 'Sencilla'),
        ('doble', 'Doble'),
        ('triple', 'Triple'),
    ]
    
    tipo_habitacion = models.CharField(max_length=20, choices=TIPO_CHOICES)
    numero_habitacion = models.IntegerField(unique=True)
    precio = models.FloatField()
    estado = models.BooleanField(default=True)
    imagen = models.ImageField(upload_to='habitaciones/', null=True, blank=True)
    descripcion = models.TextField(blank=True, null= True)

    def __str__(self):
        return f"Habitación {self.numero_habitacion} - {self.tipo_habitacion}"

class Reserva(models.Model):
    habitacion = models.ForeignKey(Habitacion, on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.CharField(max_length=20, default='pendiente')  # pendiente, pagada, cancelada
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reserva de {self.habitacion} por {self.usuario} del {self.fecha_inicio} al {self.fecha_fin}"