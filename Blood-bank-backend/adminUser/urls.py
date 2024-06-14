from . import views
from django.urls import include, path

urlpatterns = [
   
    path('confirm_donor/<str:donor_id>',views.confirm_donor),
    path('get_donor_list/',views.get_donor_list),
    path('get_recipient_list/',views.get_recipient_list),
    path('confirm_recipient_donation/<str:recipient_id>',views.confirmRecipientDonation),
    path('reject_request/<str:recipient_id>',views.reject_request),
    path('admin_login/',views.admin_login),
    path('admin_logout/',views.admin_logout),
    path('send_requirement/<str:donor_id>',views.requirement_msg),
    path('loan_msg/<str:donor_id>',views.loan_msg),
    path('confirm_loan/<str:donor_id>',views.confirm_loan),
    path('addPhotos/',views.addPhotos),
    path('getLeaderboardImages/',views.getLeaderboardImage),
    path('getFirstDon/<str:recipient_id>', views.getFirstDon),
    path('admin_booking/', views.admin_request_blood),
    path('admin_donor_registration/' ,views.admin_registerDonor),
    path('update_email/' ,views.updateEmail),
    path('remove_donor/<str:donor_id>',views.remove_donor),
    path('get_total_cquantity/',views.get_total_quantity),
    path('get_top_donors',views.get_top_donors),
    path('get_csrf_token/', views.get_csrf_token, name='get_csrf_token'),

 
]