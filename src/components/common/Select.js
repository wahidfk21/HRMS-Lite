/**
 * Reusable Select Component
 */
import React from 'react';
import './Select.css';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error = '',
  required = false,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`select-group ${className}`}>
      {label && (
        <label htmlFor={name} className="select-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`select-field ${error ? 'select-error' : ''}`}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Select;
