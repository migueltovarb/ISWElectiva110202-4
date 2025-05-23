from django.db import models

class Tarea(models.Model):
    nombre = models.CharField(max_length=200)
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('hecha', 'Hecha'),
    ]
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='pendiente')

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = 'Tarea'
        verbose_name_plural = 'Tareas'
