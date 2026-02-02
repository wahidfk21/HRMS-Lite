"""
Serializers for Employee model.
"""
from rest_framework import serializers
from .models import Employee
import re


class EmployeeSerializer(serializers.ModelSerializer):
    """
    Serializer for Employee model with comprehensive validation.
    """
    # Explicit id so DRF never tries int() on ObjectId
    id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'full_name', 'email', 'department', 'created_at']
        read_only_fields = ['id', 'created_at']
        # Disable automatic unique validators - we check uniqueness in MongoDB directly
        extra_kwargs = {
            'employee_id': {
                'validators': [],  # Remove auto-generated UniqueValidator
            }
        }

    def _get_pk_string(self, obj):
        """Get MongoDB _id/pk as string (djongo may expose as _id, pk, or in __dict__)."""
        if obj is None:
            return None
        pk = (
            getattr(obj, '_id', None)
            or getattr(obj, 'pk', None)
            or getattr(obj, 'id', None)
            or (getattr(obj, '__dict__', {}).get('_id'))
            or (getattr(obj, '__dict__', {}).get('id'))
        )
        if pk is not None:
            return str(pk)
        return None

    def get_id(self, obj):
        """Return pk as string; never pass ObjectId to default serialization."""
        return self._get_pk_string(obj)

    def to_representation(self, instance):
        """Convert MongoDB ObjectId to string in response"""
        data = super().to_representation(instance)
        pk_str = self._get_pk_string(instance)
        if pk_str:
            data['id'] = pk_str
        return data
    
    def validate_employee_id(self, value):
        """
        Validate employee_id is not empty.
        Note: Uniqueness is checked in the view using MongoDB directly.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Employee ID is required and cannot be empty.")
        
        return value.strip()
    
    def validate_full_name(self, value):
        """
        Validate full_name is not empty.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Full name is required and cannot be empty.")
        return value.strip()
    
    def validate_email(self, value):
        """
        Validate email format.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Email is required and cannot be empty.")
        
        # Additional email format validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value):
            raise serializers.ValidationError("Enter a valid email address.")
        
        return value.strip().lower()
    
    def validate_department(self, value):
        """
        Validate department is not empty.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Department is required and cannot be empty.")
        return value.strip()
    
    def validate(self, data):
        """
        Object-level validation.
        """
        # Ensure all required fields are present
        if not self.instance:  # Only on creation
            required_fields = ['employee_id', 'full_name', 'email', 'department']
            for field in required_fields:
                if field not in data or not data[field]:
                    raise serializers.ValidationError({
                        field: f"{field.replace('_', ' ').title()} is required."
                    })
        
        return data