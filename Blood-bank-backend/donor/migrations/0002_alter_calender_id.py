# Generated by Django 4.2.7 on 2024-05-18 11:21

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('donor', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='calender',
            name='id',
            field=models.UUIDField(auto_created=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]