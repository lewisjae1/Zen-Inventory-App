# Generated by Django 5.0.7 on 2024-07-17 04:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_order_additionalmessage'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='isCompleted',
            field=models.BooleanField(default=False),
        ),
    ]
