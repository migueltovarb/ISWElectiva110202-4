from django.db import models

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