"""
API views for Employee management.
"""
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import EmployeeSerializer
from hrms.mongodb_client import get_collection


@api_view(['GET', 'POST'])
def employee_list_create(request):
    """
    GET: Retrieve all employees
    POST: Create a new employee
    """
    
    if request.method == 'GET':
        try:
            # Use MongoDB directly for faster performance
            employees_collection = get_collection('employees')
            employees = list(employees_collection.find())
            
            # Convert to response format
            data = [{
                'id': str(emp['_id']),
                'employee_id': emp.get('employee_id'),
                'full_name': emp.get('full_name'),
                'email': emp.get('email'),
                'department': emp.get('department'),
                'created_at': emp.get('created_at').isoformat() if emp.get('created_at') else None
            } for emp in employees]
            
            return Response({
                'success': True,
                'count': len(data),
                'data': data
            }, status=status.HTTP_200_OK)
        except Exception:
            return Response({
                'success': False,
                'error': 'Failed to fetch employees. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        try:
            from datetime import datetime
            
            # Use serializer for validation only
            serializer = EmployeeSerializer(data=request.data)
            
            if serializer.is_valid():
                validated_data = serializer.validated_data
                
                # Check for duplicate employee_id in MongoDB
                employees_collection = get_collection('employees')
                existing = employees_collection.find_one({'employee_id': validated_data['employee_id']})
                if existing:
                    return Response({
                        'success': False,
                        'errors': {'employee_id': ['Employee with this Employee ID already exists.']}
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Insert into MongoDB directly
                employee_doc = {
                    'employee_id': validated_data['employee_id'],
                    'full_name': validated_data['full_name'],
                    'email': validated_data['email'],
                    'department': validated_data['department'],
                    'created_at': datetime.utcnow()
                }
                result = employees_collection.insert_one(employee_doc)
                
                # Prepare clean response data (remove MongoDB _id, use string id)
                response_data = {
                    'id': str(result.inserted_id),
                    'employee_id': validated_data['employee_id'],
                    'full_name': validated_data['full_name'],
                    'email': validated_data['email'],
                    'department': validated_data['department'],
                    'created_at': employee_doc['created_at'].isoformat() + 'Z'
                }
                
                return Response({
                    'success': True,
                    'message': 'Employee created successfully.',
                    'data': response_data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception:
            return Response({
                'success': False,
                'error': 'Failed to create employee. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'DELETE'])
def employee_detail(request, pk):
    """
    GET: Retrieve a specific employee
    DELETE: Delete a specific employee
    """
    try:
        from bson import ObjectId
        
        if not pk or pk in ('null', 'undefined'):
            return Response({
                'success': False,
                'error': 'Invalid employee ID.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Use shared MongoDB connection
        employees_collection = get_collection('employees')
        
        # Try to find by ObjectId or business employee_id
        if len(pk) == 24 and all(c in '0123456789abcdefABCDEF' for c in pk):
            emp_doc = employees_collection.find_one({'_id': ObjectId(pk)})
            if not emp_doc:
                emp_doc = employees_collection.find_one({'employee_id': pk})
        else:
            emp_doc = employees_collection.find_one({'employee_id': pk})
        
        if not emp_doc:
            return Response({
                'success': False,
                'error': 'Employee not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Create a simple employee object for the view
        class EmployeeMock:
            def __init__(self, doc):
                self._id = doc['_id']
                self.employee_id = doc.get('employee_id')
                self.full_name = doc.get('full_name')
        
        employee = EmployeeMock(emp_doc)
        
    except Exception:
        return Response({
            'success': False,
            'error': 'Invalid employee ID format.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'GET':
        try:
            serializer = EmployeeSerializer(employee)
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception:
            return Response({
                'success': False,
                'error': 'Failed to fetch employee details.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'DELETE':
        try:
            employee_id_display = employee.employee_id
            
            # Use shared MongoDB connections
            employees_collection = get_collection('employees')
            attendance_collection = get_collection('attendance')
            
            # First, delete all attendance records for this employee
            attendance_result = attendance_collection.delete_many({'employee_id': employee._id})
            
            # Then delete the employee
            result = employees_collection.delete_one({'_id': employee._id})
            
            if result.deleted_count > 0:
                message = f'Employee {employee_id_display} deleted successfully.'
                if attendance_result.deleted_count > 0:
                    message += f' Also removed {attendance_result.deleted_count} attendance record(s).'
                return Response({
                    'success': True,
                    'message': message
                }, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({
                    'success': False,
                    'error': 'Failed to delete employee.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception:
            return Response({
                'success': False,
                'error': 'Failed to delete employee. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)