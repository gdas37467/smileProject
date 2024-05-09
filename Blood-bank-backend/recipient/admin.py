from django.contrib import admin
from recipient.models import Recipient,FirstDonationDetails,RecipientUser
# Register your models here.
admin.site.register(Recipient)
admin.site.register(FirstDonationDetails)
admin.site.register(RecipientUser)

