"""
Employee model for HRMS Lite application.
"""
from django.db import models
from django.core.validators import EmailValidator
from django.utils import timezone


class Employee(models.Model):
    """
    Employee model representing an employee in the organization.
    
    Fields:
        employee_id: Unique identifier for the employee
        full_name: Full name of the employee
        email: Email address (validated)
        department: Department name
        created_at: Timestamp when record was created
    """
    employee_id = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text="Unique employee identifier"
    )
    full_name = models.CharField(
        max_length=200,
        help_text="Full name of the employee"
    )
    email = models.EmailField(
        max_length=254,
        validators=[EmailValidator()],
        help_text="Employee email address"
    )
    department = models.CharField(
        max_length=100,
        help_text="Department name"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Record creation timestamp"
    )

    class Meta:
        db_table = 'employees'
        ordering = ['-created_at']
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'

    def __str__(self):
        return f"{self.employee_id} - {self.full_name}"
