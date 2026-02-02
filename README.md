# HRMS Lite - Backend API

## Project Overview
HRMS Lite is a Human Resource Management System backend built with Django and MongoDB. It provides RESTful APIs for managing employees and tracking attendance records.

## Tech Stack
- **Framework**: Django 4.2.7
- **Database**: MongoDB (via djongo)
- **API**: Django REST Framework 3.14.0
- **CORS**: django-cors-headers 4.3.1
- **Python Version**: 3.8+

## Features
- ✅ Employee Management (Create, Read, Delete)
- ✅ Attendance Tracking (Mark attendance, View records)
- ✅ Input Validation (Email format, required fields, unique constraints)
- ✅ Error Handling (Comprehensive error responses)
- ✅ CORS Support (Frontend integration ready)
- ✅ RESTful API Design
- ✅ MongoDB Integration

## Prerequisites
Before running this project, ensure you have:
- Python 3.8 or higher
- MongoDB 4.0 or higher (installed and running)
- pip (Python package manager)

## Installation Steps

### 1. Clone the Repository
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure MongoDB Connection
By default, the application connects to MongoDB at `mongodb://localhost:27017/hrms_lite_db`.

To use a different MongoDB URI, set the environment variable:
```bash
# On Windows
set MONGODB_URI=mongodb://localhost:27017/hrms_lite_db

# On macOS/Linux
export MONGODB_URI=mongodb://localhost:27017/hrms_lite_db
```

Or create a `.env` file in the backend directory (optional):
```
MONGODB_URI=mongodb://localhost:27017/hrms_lite_db
```

### 5. Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser (Optional - for Django admin)
```bash
python manage.py createsuperuser
```

### 7. Start Development Server
```bash
python manage.py runserver
```

The server will start at `http://localhost:8000`

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Employee Endpoints

#### 1. Get All Employees
```
GET /api/employees/
```
**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "employee_id": "EMP001",
      "full_name": "John Doe",
      "email": "john@example.com",
      "department": "Engineering",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### 2. Create Employee
```
POST /api/employees/
Content-Type: application/json
```
**Request Body:**
```json
{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Employee created successfully.",
  "data": {
    "id": 1,
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "department": "Engineering",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```
**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "errors": {
    "employee_id": ["Employee with this Employee ID already exists."],
    "email": ["Enter a valid email address."]
  }
}
```

#### 3. Get Single Employee
```
GET /api/employees/<id>/
```

#### 4. Delete Employee
```
DELETE /api/employees/<id>/
```
**Response (204 No Content)**

### Attendance Endpoints

#### 1. Get All Attendance Records
```
GET /api/attendance/
```
**Optional Query Parameters:**
- `employee_id`: Filter by employee ID

**Example:**
```
GET /api/attendance/?employee_id=1
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "employee_id": "EMP001",
      "employee_name": "John Doe",
      "department": "Engineering",
      "date": "2024-01-15",
      "status": "Present",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### 2. Mark Attendance
```
POST /api/attendance/
Content-Type: application/json
```
**Request Body:**
```json
{
  "employee_id": 1,
  "date": "2024-01-15",
  "status": "Present"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Attendance marked successfully.",
  "data": {
    "id": 1,
    "employee_id": "EMP001",
    "employee_name": "John Doe",
    "department": "Engineering",
    "date": "2024-01-15",
    "status": "Present",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### 3. Get Single Attendance Record
```
GET /api/attendance/<id>/
```

#### 4. Delete Attendance Record
```
DELETE /api/attendance/<id>/
```
**Response (204 No Content)**

## Project Structure
```
backend/
├── hrms/                    # Main project directory
│   ├── __init__.py
│   ├── settings.py         # Django settings (MongoDB, CORS, REST config)
│   ├── urls.py             # Main URL routing
│   ├── wsgi.py             # WSGI configuration
│   └── asgi.py             # ASGI configuration
├── employees/              # Employee app
│   ├── __init__.py
│   ├── models.py           # Employee model
│   ├── serializers.py      # Employee serializers with validation
│   ├── views.py            # Employee API views
│   ├── urls.py             # Employee URL routing
│   ├── admin.py            # Django admin configuration
│   └── apps.py
├── attendance/             # Attendance app
│   ├── __init__.py
│   ├── models.py           # Attendance model
│   ├── serializers.py      # Attendance serializers with validation
│   ├── views.py            # Attendance API views
│   ├── urls.py             # Attendance URL routing
│   ├── admin.py            # Django admin configuration
│   └── apps.py
├── manage.py               # Django management script
├── requirements.txt        # Python dependencies
├── .gitignore             # Git ignore file
└── README.md              # This file
```

## Validation Rules

### Employee
- **employee_id**: Required, unique, non-empty
- **full_name**: Required, non-empty
- **email**: Required, valid email format
- **department**: Required, non-empty

### Attendance
- **employee_id**: Required, must reference existing employee
- **date**: Required, valid date format
- **status**: Required, must be "Present" or "Absent"
- **Unique Constraint**: One attendance record per employee per date

## Error Handling
The API returns consistent error responses:

**400 Bad Request** - Validation errors
```json
{
  "success": false,
  "errors": {
    "field_name": ["Error message"]
  }
}
```

**404 Not Found** - Resource not found
```json
{
  "success": false,
  "error": "Resource not found."
}
```

**500 Internal Server Error** - Server errors
```json
{
  "success": false,
  "error": "Error message"
}
```

## CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

## Admin Panel
Access Django admin at: `http://localhost:8000/admin`

Use the superuser credentials created during setup.

## Assumptions & Limitations

### Assumptions
- Single admin user (no authentication required for APIs)
- MongoDB is running locally on default port (27017)
- Employee IDs are manually assigned (no auto-generation)
- Attendance can be marked for any date (no future/past restrictions)

### Limitations
- No user authentication/authorization
- No role-based access control
- No leave management features
- No payroll processing
- No file upload (profile pictures, documents)
- No email notifications
- No audit logs

### Out of Scope
- Multi-tenant support
- Advanced reporting/analytics
- Mobile app integration
- Real-time notifications
- Performance management
- Training management
- Recruitment module

## Development Notes

### MongoDB Connection
The project uses `djongo` to connect Django ORM with MongoDB. Note:
- djongo requires pymongo version 3.12.3 (not the latest)
- ENFORCE_SCHEMA is set to False for flexibility

### Testing APIs
Use tools like:
- **Postman**: Import endpoints and test
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension
- **httpie**: User-friendly CLI tool

### Common Issues

**Issue**: MongoDB connection error
```
Solution: Ensure MongoDB is running
- Windows: net start MongoDB
- macOS: brew services start mongodb-community
- Linux: sudo systemctl start mongod
```

**Issue**: Port 8000 already in use
```
Solution: Run on different port
python manage.py runserver 8001
```

**Issue**: CORS errors in frontend
```
Solution: Check CORS_ALLOWED_ORIGINS in settings.py
Add your frontend URL if different
```

## Contributing
This is a lite version for educational/demonstration purposes. For production use, consider:
- Adding authentication (JWT tokens)
- Implementing proper logging
- Adding comprehensive test coverage
- Using environment variables for all configs
- Implementing rate limiting
- Adding API documentation (Swagger/OpenAPI)

## License
This project is for educational purposes.

## Support
For issues or questions, please check:
1. MongoDB connection is active
2. All dependencies are installed
3. Migrations are applied
4. CORS settings match frontend URL

---
**Version**: 1.0.0  
**Last Updated**: February 2026
