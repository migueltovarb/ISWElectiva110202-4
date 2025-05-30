from django.db import models

class Configuracion(models.Model):
    check_in_time = models.TimeField(default='14:00')
    check_out_time = models.TimeField(default='12:00')

    class Meta:
        verbose_name = 'Configuración'
        verbose_name_plural = 'Configuraciones'

    def __str__(self):
        return f"Configuración de horarios (Check-in: {self.check_in_time}, Check-out: {self.check_out_time})"

    @classmethod
    def get_settings(cls):
        config = cls.objects.first()
        if not config:
            config = cls.objects.create()
        return config 