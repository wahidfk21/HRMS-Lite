# HRMS Lite - Frontend Application

## Project Overview
HRMS Lite is a modern, responsive Human Resource Management System frontend built with React. It provides an intuitive interface for managing employees and tracking attendance records.

## Tech Stack
- **Framework**: React 18.2.0
- **Routing**: React Router DOM 6.20.1
- **HTTP Client**: Axios 1.6.2
- **Styling**: Custom CSS (no framework dependency)
- **Build Tool**: Create React App 5.0.1
- **JavaScript**: ES6+

## Features
- ✅ Employee Management (Add, View, Delete)
- ✅ Attendance Tracking (Mark attendance, View records)
- ✅ Real-time Form Validation
- ✅ Filter Attendance by Employee
- ✅ Responsive Design (Mobile-friendly)
- ✅ Loading States & Error Handling
- ✅ Success/Error Notifications
- ✅ Confirmation Modals
- ✅ Professional UI/UX
- ✅ Empty State Messages
- ✅ Reusable Components

## Prerequisites
Before running this project, ensure you have:
- Node.js 14.0 or higher
- npm 6.0 or higher (comes with Node.js)
- Backend API running (see backend README)

## Installation Steps

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages:
- react
- react-dom
- react-router-dom
- axios
- react-scripts

### 3. Configure API URL
The frontend connects to the backend API. By default, it uses `http://localhost:8000/api`.

If your backend is running on a different URL, update the `.env` file:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

**Important**: Make sure the backend server is running before starting the frontend.

### 4. Start Development Server
```bash
npm start
```

The application will open automatically at `http://localhost:3000`

## Available Scripts

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### `npm run build`
Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for best performance.

The build is minified and the filenames include hashes.

### `npm test`
Launches the test runner in interactive watch mode.

## Project Structure
```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── common/             # Reusable UI components
│   │   │   ├── Button.js       # Button component
│   │   │   ├── Button.css
│   │   │   ├── Input.js        # Input field component
│   │   │   ├── Input.css
│   │   │   ├── Select.js       # Select dropdown component
│   │   │   ├── Select.css
│   │   │   ├── Table.js        # Table component
│   │   │   ├── Table.css
│   │   │   ├── Modal.js        # Modal dialog component
│   │   │   ├── Modal.css
│   │   │   ├── Spinner.js      # Loading spinner component
│   │   │   ├── Spinner.css
│   │   │   ├── Navbar.js       # Navigation bar
│   │   │   └── Navbar.css
│   │   ├── employees/          # Employee components
│   │   │   ├── EmployeeForm.js # Add employee form
│   │   │   ├── EmployeeForm.css
│   │   │   ├── EmployeeList.js # Employee list table
│   │   │   └── EmployeeList.css
│   │   └── attendance/         # Attendance components
│   │       ├── AttendanceForm.js   # Mark attendance form
│   │       ├── AttendanceForm.css
│   │       ├── AttendanceList.js   # Attendance records table
│   │       └── AttendanceList.css
│   ├── pages/
│   │   ├── EmployeePage.js     # Employee management page
│   │   ├── EmployeePage.css
│   │   ├── AttendancePage.js   # Attendance management page
│   │   └── AttendancePage.css
│   ├── services/
│   │   ├── api.js              # Axios configuration
│   │   ├── employeeService.js  # Employee API calls
│   │   └── attendanceService.js # Attendance API calls
│   ├── utils/
│   │   └── validators.js       # Form validation utilities
│   ├── App.js                  # Main app component with routing
│   ├── App.css                 # Global app styles
│   ├── index.js                # React entry point
│   └── index.css               # Global CSS reset & base styles
├── .env                        # Environment variables (API URL)
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies & scripts
└── README.md                   # This file
```

## Features in Detail

### 1. Employee Management
- **Add Employee**: Form with fields for Employee ID, Full Name, Email, and Department
- **View Employees**: Table displaying all employees with their details
- **Delete Employee**: Delete button with confirmation modal
- **Validation**: Real-time validation for required fields and email format
- **Error Handling**: Display API errors to users

### 2. Attendance Management
- **Mark Attendance**: Form with employee selector, date picker, and status radio buttons
- **View Records**: Table showing all attendance records with employee details
- **Filter by Employee**: Dropdown to filter attendance records by specific employee
- **Statistics**: Display total records, present count, and absent count
- **Color-coded Status**: Visual distinction between Present (green) and Absent (red)

### 3. Reusable Components

#### Button
Props: `children`, `onClick`, `type`, `variant`, `disabled`, `fullWidth`, `size`

Variants: `primary`, `secondary`, `danger`, `success`, `outline`

```jsx
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

#### Input
Props: `label`, `name`, `type`, `value`, `onChange`, `placeholder`, `error`, `required`, `disabled`

```jsx
<Input
  label="Email"
  name="email"
  type="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  required
/>
```

#### Select
Props: `label`, `name`, `value`, `onChange`, `options`, `placeholder`, `error`, `required`, `disabled`

```jsx
<Select
  label="Department"
  name="department"
  value={department}
  onChange={handleChange}
  options={departmentOptions}
/>
```

#### Table
Props: `columns`, `data`, `emptyMessage`

```jsx
<Table
  columns={[
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' }
  ]}
  data={employees}
/>
```

#### Modal
Props: `isOpen`, `onClose`, `title`, `children`, `footer`, `size`

```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Delete"
>
  <p>Are you sure?</p>
</Modal>
```

#### Spinner
Props: `size`, `color`, `fullScreen`

```jsx
<Spinner size="large" color="primary" />
```

## API Integration

### Service Layer Architecture
The app uses a service layer pattern for API calls:

- `api.js`: Axios instance with base configuration and interceptors
- `employeeService.js`: Employee-related API functions
- `attendanceService.js`: Attendance-related API functions

### API Endpoints Used

**Employees:**
- `GET /api/employees/` - Fetch all employees
- `POST /api/employees/` - Create new employee
- `DELETE /api/employees/:id/` - Delete employee

**Attendance:**
- `GET /api/attendance/` - Fetch all attendance records
- `GET /api/attendance/?employee_id=:id` - Filter by employee
- `POST /api/attendance/` - Mark attendance

### Error Handling
- Network errors: Display user-friendly messages
- Validation errors: Show inline field errors
- API errors: Extract and display error messages from backend
- Loading states: Show spinners during API calls

## Form Validation

### Client-side Validation
- **Employee Form**:
  - Employee ID: Required, non-empty
  - Full Name: Required, non-empty
  - Email: Required, valid email format
  - Department: Required, non-empty

- **Attendance Form**:
  - Employee: Required selection
  - Date: Required, valid date
  - Status: Required (Present/Absent)

### Validation Utilities
Located in `src/utils/validators.js`:
- `isValidEmail()`: Email format validation
- `isRequired()`: Check non-empty values
- `validateEmployeeForm()`: Validate employee data
- `validateAttendanceForm()`: Validate attendance data
- `formatDate()`: Date formatting utility
- `getTodayDate()`: Get current date in YYYY-MM-DD format

## UI/UX Features

### Responsive Design
- Desktop: Full layout with sidebar navigation
- Tablet: Optimized for medium screens
- Mobile: Hamburger menu, stacked layout, touch-friendly buttons

### Loading States
- Full-screen spinner for initial page loads
- Inline spinners for form submissions
- Loading text for user feedback

### Empty States
- "No employees found" with call-to-action
- "No attendance records" with helpful message
- Empty state when filtering returns no results

### Notifications
- Success: Green notification for successful actions
- Error: Red notification for errors
- Auto-dismiss after 5 seconds
- Manual close button

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states for interactive elements

## Styling Approach

### Custom CSS (No Framework)
- **Why**: Full control, no bloat, optimized bundle size
- **Methodology**: Component-scoped CSS files
- **Variables**: CSS custom properties for colors
- **Responsive**: Mobile-first approach with media queries

### Color Palette
- Primary: `#3b82f6` (Blue)
- Secondary: `#6b7280` (Gray)
- Success: `#10b981` (Green)
- Danger: `#ef4444` (Red)
- Background: `#f5f7fa` (Light Gray)

### Typography
- Font Family: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, etc.)
- Base Size: 14px
- Headings: 600-700 font weight

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations
- Code splitting with React Router
- Lazy loading for routes (can be implemented)
- Optimized images (if any)
- Minified production build
- Tree shaking for unused code

## Assumptions & Limitations

### Assumptions
- Backend API is running and accessible
- MongoDB is properly configured in backend
- No authentication required (single admin user)
- Attendance can be marked for any date
- One attendance record per employee per date

### Limitations
- No authentication/authorization
- No role-based access control
- No profile pictures or file uploads
- No advanced filtering (date ranges)
- No data export functionality
- No print functionality
- No advanced analytics/charts
- No real-time updates (WebSocket)

### Out of Scope
- User login/registration
- Password management
- Multi-language support
- Dark mode
- Advanced reporting
- Email notifications
- Calendar view for attendance
- Leave management
- Payroll features

## Troubleshooting

### Issue: "Network Error" or API calls fail
**Solution**: 
1. Ensure backend server is running on `http://localhost:8000`
2. Check CORS is enabled in backend settings
3. Verify `.env` file has correct API URL
4. Check browser console for detailed errors

### Issue: Port 3000 already in use
**Solution**:
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or run on different port
set PORT=3001 && npm start
```

### Issue: "Module not found" errors
**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: Changes not reflecting
**Solution**:
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Restart development server

## Development Tips

### Adding New Features
1. Create component in appropriate folder
2. Add service function if API call needed
3. Add validation in validators.js if form validation needed
4. Update routing in App.js if new page
5. Test thoroughly with backend

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and focused
- Extract reusable logic into utilities

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature
```

## Future Enhancements (If Extending)
- [ ] Add authentication with JWT
- [ ] Implement role-based access control
- [ ] Add data export (CSV, PDF)
- [ ] Integrate charts for analytics
- [ ] Add calendar view for attendance
- [ ] Implement real-time notifications
- [ ] Add profile picture upload
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced filtering and search
- [ ] Pagination for large datasets
- [ ] Unit and integration tests

## Contributing
This is an educational/demonstration project. For production use:
1. Add comprehensive tests (Jest, React Testing Library)
2. Implement proper error boundaries
3. Add logging and monitoring
4. Use environment-specific configs
5. Add CI/CD pipeline
6. Implement security best practices

## License
This project is for educational purposes.

## Support
For issues or questions:
1. Ensure backend API is running
2. Check browser console for errors
3. Verify `.env` configuration
4. Check network tab in dev tools for API responses

## Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Analyze bundle size
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

---
**Version**: 1.0.0  
**Last Updated**: February 2026  
**Developed with**: React 18.2.0
