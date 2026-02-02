"""
Serializers for Attendance model.
"""
from rest_framework import serializers
from .models import Attendance
from employees.models import Employee
from employees.serializers import EmployeeSerializer
from datetime import date


class AttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer for Attendance model with comprehensive validation.
    Includes nested employee details in response.
    """
    
    # Read-only field to include employee details in response
    employee_details = EmployeeSerializer(source='employee', read_only=True)
    
    # Write-only field to accept employee ID in request
    employee_id = serializers.CharField(write_only=True)
    
    def to_representation(self, instance):
        """Convert MongoDB ObjectId to string in response"""
        data = super().to_representation(instance)
        # Convert ObjectId to string
        if instance.pk:
            data['id'] = str(instance.pk)
        return data
    
    class Meta:
        model = Attendance
        fields = [
            'id', 
            'employee_id',  # For writing
            'employee_details',  # For reading
            'date', 
            'status', 
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'employee_details']
        # Disable automatic validators - we handle validation in MongoDB directly
        extra_kwargs = {
            'employee_id': {
                'validators': [],  # Remove auto-generated validators
            }
        }
    
    def validate_employee_id(self, value):
        """
        Validate that employee exists. Accept MongoDB ObjectId string OR business employee_id (e.g. Emp-1).
        Uses shared MongoDB connection for performance.
        """
        if not value:
            raise serializers.ValidationError("Employee is required.")
        try:
            from bson import ObjectId
            from hrms.mongodb_client import get_collection
            
            employees_collection = get_collection('employees')
            
            # Try to find employee by ObjectId or business employee_id
            emp_doc = None
            if isinstance(value, str) and len(value) == 24 and all(c in '0123456789abcdefABCDEF' for c in value):
                # Try as ObjectId first
                emp_doc = employees_collection.find_one({'_id': ObjectId(value)})
                if not emp_doc:
                    # Fallback to business employee_id
                    emp_doc = employees_collection.find_one({'employee_id': value})
            else:
                # Look up by business employee_id (e.g. Emp-1)
                emp_doc = employees_collection.find_one({'employee_id': value})
            
            if not emp_doc:
                raise serializers.ValidationError("Employee not found. Please select a valid employee.")
        except serializers.ValidationError:
            raise
        except Exception as e:
            raise serializers.ValidationError("Employee not found. Please select a valid employee.")
        return value
    
    def validate_date(self, value):
        """
        Validate date is not empty and is a valid date.
        """
        if not value:
            raise serializers.ValidationError("Date is required.")
        
        # Optionally, you can validate that date is not in future
        # if value > date.today():
        #     raise serializers.ValidationError("Cannot mark attendance for future dates.")
        
        return value
    
    def validate_status(self, value):
        """
        Validate status is either Present or Absent.
        """
        if not value:
            raise serializers.ValidationError("Status is required.")
        
        valid_statuses = ['Present', 'Absent']
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Status must be one of: {', '.join(valid_statuses)}")
        
        return value
    
    def validate(self, data):
        """
        Object-level validation.
        Note: Duplicate check is done in create() method using MongoDB directly.
        """
        return data
    
    def create(self, validated_data):
        """
        Create attendance record using raw MongoDB insert to bypass djongo FK issues.
        """
        from bson import ObjectId
        from datetime import datetime, date
        from hrms.mongodb_client import get_collection
        
        employee_id_val = validated_data.pop('employee_id')
        
        # Use shared MongoDB connection for faster lookup
        employees_collection = get_collection('employees')
        
        # Resolve employee and get ObjectId
        emp_doc = None
        emp_object_id = None
        
        if isinstance(employee_id_val, str) and len(employee_id_val) == 24 and all(c in '0123456789abcdefABCDEF' for c in employee_id_val):
            emp_object_id = ObjectId(employee_id_val)
            emp_doc = employees_collection.find_one({'_id': emp_object_id})
            if not emp_doc:
                emp_doc = employees_collection.find_one({'employee_id': employee_id_val})
                if emp_doc:
                    emp_object_id = emp_doc['_id']
        else:
            emp_doc = employees_collection.find_one({'employee_id': employee_id_val})
            if emp_doc:
                emp_object_id = emp_doc['_id']
        
        if not emp_doc or not emp_object_id:
            raise serializers.ValidationError("Employee not found.")
        
        # Create simple employee object
        class EmployeeMock:
            def __init__(self, doc):
                self.employee_id = doc.get('employee_id')
                self.full_name = doc.get('full_name')
        
        employee = EmployeeMock(emp_doc)
        
        # Use shared MongoDB connection
        attendance_collection = get_collection('attendance')
        
        # Convert date to datetime for MongoDB (pymongo can't encode date objects)
        attendance_date = validated_data['date']
        if isinstance(attendance_date, date) and not isinstance(attendance_date, datetime):
            attendance_date = datetime.combine(attendance_date, datetime.min.time())
        
        # Check for duplicate attendance
        existing = attendance_collection.find_one({
            'employee_id': emp_object_id,
            'date': attendance_date
        })
        if existing:
            raise serializers.ValidationError({
                'non_field_errors': [f"Attendance already marked for {employee.full_name} on {validated_data['date']}. Cannot mark attendance twice for the same date."]
            })
        
        # Insert attendance record
        attendance_doc = {
            'employee_id': emp_object_id,
            'date': attendance_date,
            'status': validated_data['status'],
            'created_at': datetime.utcnow()
        }
        
        result = attendance_collection.insert_one(attendance_doc)
        
        # Don't use Django ORM to fetch - just create a mock object for serializer
        # Create a simple object with the data we just inserted
        class AttendanceMock:
            def __init__(self, data):
                self.id = str(data['_id'])
                self.employee_id = data.get('employee_id')
                self.date = data.get('date')
                self.status = data.get('status')
                self.created_at = data.get('created_at')
                self.employee = employee
        
        # Prepare response data
        inserted_doc = attendance_collection.find_one({'_id': result.inserted_id})
        return AttendanceMock(inserted_doc)


class AttendanceListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing attendance records.
    """
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    department = serializers.CharField(source='employee.department', read_only=True)
    
    class Meta:
        model = Attendance
        fields = [
            'id',
            'employee_id',
            'employee_name',
            'department',
            'date',
            'status',
            'created_at'
        ]
    
    def to_representation(self, instance):
        """Convert MongoDB ObjectId to string in response"""
        data = super().to_representation(instance)
        # Convert ObjectId to string
        if instance.pk:
            data['id'] = str(instance.pk)
        return data