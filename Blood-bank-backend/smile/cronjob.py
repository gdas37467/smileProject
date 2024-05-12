from recipient.views import Calender
def updateUnits():
    print('Hello')
    calender = Calender.objects.first()
    calender.quantity = 15
    calender.save()
    print("Hi")