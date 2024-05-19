# Generated by Django 4.2.7 on 2024-05-18 11:29

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LeaderBoard',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('p1', models.ImageField(null=True, upload_to='leaderBoard/')),
                ('p2', models.ImageField(null=True, upload_to='leaderBoard/')),
                ('p3', models.ImageField(null=True, upload_to='leaderBoard/')),
                ('p4', models.ImageField(null=True, upload_to='leaderBoard/')),
                ('p5', models.ImageField(null=True, upload_to='leaderBoard/')),
            ],
        ),
    ]
