/**
 * Employee Form Component
 * Handles employee creation with validation
 */
import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateEmployeeForm } from '../../utils/validators';
import './EmployeeForm.css';

const EmployeeForm = ({ onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
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
    const validation = validateEmployeeForm(formData);

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
      full_name: '',
      email: '',
      department: '',
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <Input
        label="Employee ID"
        name="employee_id"
        value={formData.employee_id}
        onChange={handleChange}
        placeholder="e.g., EMP001"
        error={errors.employee_id}
        required
        disabled={loading}
      />

      <Input
        label="Full Name"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="e.g., John Doe"
        error={errors.full_name}
        required
        disabled={loading}
      />

      <Input
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="e.g., john@example.com"
        error={errors.email}
        required
        disabled={loading}
      />

      <Input
        label="Department"
        name="department"
        value={formData.department}
        onChange={handleChange}
        placeholder="e.g., Engineering, HR, Sales"
        error={errors.department}
        required
        disabled={loading}
      />

      <div className="form-actions">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Adding Employee...' : 'Add Employee'}
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

export default EmployeeForm;
