from recipient.views import Calender
def updateUnits():
    calender = Calender.objects.first()
    calender.quantity = 15
    calender.save()
    print("Hi")