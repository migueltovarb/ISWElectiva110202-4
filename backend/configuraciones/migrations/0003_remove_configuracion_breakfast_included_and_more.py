# Generated by Django 5.2 on 2025-04-30 22:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuraciones', '0002_initial_config'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='configuracion',
            name='breakfast_included',
        ),
        migrations.RemoveField(
            model_name='configuracion',
            name='breakfast_price',
        ),
        migrations.RemoveField(
            model_name='configuracion',
            name='cancellation_policy_hours',
        ),
        migrations.RemoveField(
            model_name='configuracion',
            name='late_check_out_fee',
        ),
        migrations.RemoveField(
            model_name='configuracion',
            name='max_advance_booking_days',
        ),
        migrations.RemoveField(
            model_name='configuracion',
            name='min_advance_booking_hours',
        ),
        migrations.RemoveField(
            model_name='configuracion',
            name='require_credit_card',
        ),
        migrations.RemoveField(
            model_name='configuracion',
            name='require_id',
        ),
        migrations.RemoveField(
            model_name='configuracion',
            name='tax_rate',
        ),
    ]
