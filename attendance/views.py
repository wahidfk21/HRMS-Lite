"""
API views for Attendance management.
"""
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import AttendanceSerializer
from hrms.mongodb_client import get_collection


@api_view(['GET', 'POST'])
def attendance_list_create(request):
    """
    GET: Retrieve all attendance records (with optional filtering by employee_id)
    POST: Create a new attendance record
    """
    
    if request.method == 'GET':
        try:
            from bson import ObjectId
            
            # Use shared MongoDB connections
            attendance_collection = get_collection('attendance')
            employees_collection = get_collection('employees')
            
            # Get query parameter for filtering by employee_id
            employee_id = request.query_params.get('employee_id', None)
            
            if employee_id:
                # Find employee's ObjectId
                emp_object_id = None
                if len(employee_id) == 24 and all(c in '0123456789abcdefABCDEF' for c in employee_id):
                    emp_object_id = ObjectId(employee_id)
                else:
                    # Look up by business employee_id
                    emp_doc = employees_collection.find_one({'employee_id': employee_id})
                    if emp_doc:
                        emp_object_id = emp_doc['_id']
                
                if not emp_object_id:
                    return Response({
                        'success': False,
                        'error': 'Employee not found.'
                    }, status=status.HTTP_404_NOT_FOUND)
                
                attendance_docs = list(attendance_collection.find({'employee_id': emp_object_id}))
            else:
                # Get all attendance records
                attendance_docs = list(attendance_collection.find())
            
            # Convert to response format
            response_data = []
            for doc in attendance_docs:
                # Get employee details
                emp_doc = employees_collection.find_one({'_id': doc['employee_id']})
                response_data.append({
                    'id': str(doc['_id']),
                    'employee_id': emp_doc.get('employee_id') if emp_doc else None,
                    'employee_name': emp_doc.get('full_name') if emp_doc else None,
                    'department': emp_doc.get('department') if emp_doc else None,
                    'date': doc['date'].strftime('%Y-%m-%d') if hasattr(doc['date'], 'strftime') else str(doc['date']),
                    'status': doc['status'],
                    'created_at': doc['created_at'].isoformat() if hasattr(doc['created_at'], 'isoformat') else str(doc['created_at'])
                })
            
            return Response({
                'success': True,
                'count': len(response_data),
                'data': response_data
            }, status=status.HTTP_200_OK)
            
        except Exception:
            return Response({
                'success': False,
                'error': 'Failed to fetch attendance records. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        try:
            from rest_framework import serializers as drf_serializers
            
            serializer = AttendanceSerializer(data=request.data)
            
            if serializer.is_valid():
                try:
                    attendance_mock = serializer.save()
                    
                    # Get employee details from shared connection
                    employees_collection = get_collection('employees')
                    
                    emp_doc = employees_collection.find_one({'employee_id': attendance_mock.employee.employee_id})
                    
                    # Build response manually
                    response_data = {
                        'id': attendance_mock.id,
                        'employee_id': emp_doc.get('employee_id') if emp_doc else None,
                        'employee_name': emp_doc.get('full_name') if emp_doc else None,
                        'department': emp_doc.get('department') if emp_doc else None,
                        'date': attendance_mock.date.strftime('%Y-%m-%d') if hasattr(attendance_mock.date, 'strftime') else str(attendance_mock.date),
                        'status': attendance_mock.status,
                        'created_at': attendance_mock.created_at.isoformat() if hasattr(attendance_mock.created_at, 'isoformat') else str(attendance_mock.created_at)
                    }
                    
                    return Response({
                        'success': True,
                        'message': 'Attendance marked successfully.',
                        'data': response_data
                    }, status=status.HTTP_201_CREATED)
                except drf_serializers.ValidationError as ve:
                    # Handle duplicate attendance error
                    error_detail = ve.detail
                    if isinstance(error_detail, dict) and 'non_field_errors' in error_detail:
                        error_msg = error_detail['non_field_errors'][0]
                    else:
                        error_msg = str(error_detail)
                    return Response({
                        'success': False,
                        'error': error_msg
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception:
            return Response({
                'success': False,
                'error': 'Failed to mark attendance. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'DELETE'])
def attendance_detail(request, pk):
    """
    GET: Retrieve a specific attendance record
    DELETE: Delete a specific attendance record
    """
    
    try:
        from bson import ObjectId
        # Convert string ID to ObjectId for MongoDB
        if pk and pk != 'null' and pk != 'undefined':
            attendance = Attendance.objects.get(pk=ObjectId(pk))
        else:
            return Response({
                'success': False,
                'error': 'Invalid attendance ID.'
            }, status=status.HTTP_400_BAD_REQUEST)
    except Attendance.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Attendance record not found.'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception:
        return Response({
            'success': False,
            'error': 'Invalid attendance ID format.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'GET':
        try:
            serializer = AttendanceListSerializer(attendance)
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception:
            return Response({
                'success': False,
                'error': 'Failed to fetch attendance record.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'DELETE':
        try:
            attendance.delete()
            return Response({
                'success': True,
                'message': 'Attendance record deleted successfully.'
            }, status=status.HTTP_204_NO_CONTENT)
        except Exception:
            return Response({
                'success': False,
                'error': 'Failed to delete attendance record. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
