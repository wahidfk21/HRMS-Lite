/**
 * Attendance Form Component
 * Handles marking attendance with validation
 */
import React, { useState } from 'react';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateAttendanceForm, getTodayDate } from '../../utils/validators';
import './AttendanceForm.css';

const AttendanceForm = ({ employees, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    date: getTodayDate(),
    status: 'Present',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateAttendanceForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Submit form with reset callback
    onSubmit(formData, handleReset);
  };

  const handleReset = () => {
    setFormData({
      employee_id: '',
      date: getTodayDate(),
      status: 'Present',
    });
    setErrors({});
  };

  // Prepare employee options: use id if present, else employee_id (backend accepts both)
  const employeeOptions = (employees || [])
    .filter((emp) => emp && (emp.employee_id != null || emp.id != null))
    .map((emp) => ({
      value: emp.id != null ? String(emp.id) : String(emp.employee_id),
      label: `${emp.full_name || 'Unknown'} (${emp.employee_id || '-'})`,
    }));

  return (
    <form onSubmit={handleSubmit} className="attendance-form">
      <Select
        label="Select Employee"
        name="employee_id"
        value={formData.employee_id}
        onChange={handleChange}
        options={employeeOptions}
        placeholder="Choose an employee..."
        error={errors.employee_id}
        required
        disabled={loading}
      />

      <Input
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
        required
        disabled={loading}
      />

      <div className="radio-group">
        <label className="radio-group-label">
          Status<span className="required-asterisk">*</span>
        </label>
        <div className="radio-options">
          <label className="radio-option">
            <input
              type="radio"
              name="status"
              value="Present"
              checked={formData.status === 'Present'}
              onChange={handleChange}
              disabled={loading}
            />
            <span className="radio-label">Present</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="status"
              value="Absent"
              checked={formData.status === 'Absent'}
              onChange={handleChange}
              disabled={loading}
            />
            <span className="radio-label">Absent</span>
          </label>
        </div>
        {errors.status && <span className="error-message">{errors.status}</span>}
      </div>

      <div className="form-actions">
        <Button type="submit" variant="success" disabled={loading}>
          {loading ? 'Marking Attendance...' : 'Mark Attendance'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          disabled={loading}
        >
          Clear Form
        </Button>
      </div>
    </form>
  );
};

export default AttendanceForm;
