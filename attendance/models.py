"""
Attendance model for HRMS Lite application.
"""
from django.db import models
from django.utils import timezone
from employees.models import Employee


class Attendance(models.Model):
    """
    Attendance model for tracking employee attendance.
    
    Fields:
        employee: Foreign key reference to Employee
        date: Date of attendance
        status: Present or Absent
        created_at: Timestamp when record was created
    """
    
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
    ]
    
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='attendance_records',
        help_text="Reference to Employee"
    )
    date = models.DateField(
        help_text="Attendance date"
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        help_text="Attendance status (Present/Absent)"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Record creation timestamp"
    )

    class Meta:
        db_table = 'attendance'
        ordering = ['-date', '-created_at']
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendance Records'
        # Unique constraint to prevent duplicate attendance for same employee on same date
        unique_together = [['employee', 'date']]

    def __str__(self):
        return f"{self.employee.employee_id} - {self.date} - {self.status}"
