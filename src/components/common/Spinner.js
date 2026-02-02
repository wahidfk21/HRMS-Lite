/**
 * Reusable Loading Spinner Component
 */
import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 'medium', color = 'primary', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        <div className={`spinner spinner-${size} spinner-${color}`}>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`spinner spinner-${size} spinner-${color}`}>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
    </div>
  );
};

export default Spinner;
