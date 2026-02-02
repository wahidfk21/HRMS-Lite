"""
URL routing for Attendance API endpoints.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.attendance_list_create, name='attendance-list-create'),
    path('<str:pk>/', views.attendance_detail, name='attendance-detail'),  # Changed to str to accept both ObjectId and string IDs
]
