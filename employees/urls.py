"""
URL routing for Employee API endpoints.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.employee_list_create, name='employee-list-create'),
    path('<str:pk>/', views.employee_detail, name='employee-detail'),  # Changed to str to accept both ObjectId and employee_id
]
