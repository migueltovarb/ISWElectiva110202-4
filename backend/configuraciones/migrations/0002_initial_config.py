from django.db import migrations

def create_initial_config(apps, schema_editor):
    Configuracion = apps.get_model('configuraciones', 'Configuracion')
    if not Configuracion.objects.exists():
        Configuracion.objects.create()

class Migration(migrations.Migration):
    dependencies = [
        ('configuraciones', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_initial_config),
    ] 