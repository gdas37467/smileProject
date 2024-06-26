# Generated by Django 4.1.13 on 2024-05-18 10:29

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FirstDonationDetails',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('donBlood', models.CharField(default='', max_length=30, null=True)),
                ('bloodBankName', models.CharField(default='', max_length=30, null=True)),
                ('donorName', models.CharField(default='', max_length=30, null=True)),
                ('donationDate', models.DateField(default=django.utils.timezone.now, null=True)),
                ('donationReceipt', models.ImageField(null=True, upload_to='receipts/')),
            ],
        ),
        migrations.CreateModel(
            name='Recipient',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('firstName', models.CharField(default='', max_length=30)),
                ('lastName', models.CharField(default='', max_length=30)),
                ('dob', models.DateField(default=django.utils.timezone.now)),
                ('bloodGroup', models.CharField(default='', max_length=30)),
                ('phoneNumber', models.CharField(default='', max_length=10)),
                ('email', models.CharField(default='', max_length=30)),
                ('gender', models.CharField(default='', max_length=300)),
                ('address', models.TextField(default='', max_length=500)),
                ('hospitalName', models.CharField(default='', max_length=40)),
                ('isThalassemia', models.BooleanField(default=False)),
                ('hasCancer', models.BooleanField(default=False)),
                ('firstDonCheck', models.BooleanField(default=False)),
                ('requestDate', models.DateField(null=True)),
                ('status', models.CharField(default='Pending', max_length=10)),
                ('registeredByAdmin', models.BooleanField(default=False, null=True)),
                ('firstDonation', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='recipient.firstdonationdetails')),
            ],
        ),
    ]
