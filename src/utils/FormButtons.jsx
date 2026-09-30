import React from 'react';
import PropTypes from 'prop-types';
import '../css/form.css';

const FormButtons = ({ onSave, onCancel, isSubmitting = false }) => {
  return (
    <div className="button-row">
      <button
        type="submit"
        className="simple-button primary-button"
        disabled={isSubmitting}
        onClick={onSave}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
      <button
        type="button"
        className="simple-button secondary-button"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
};

FormButtons.propTypes = {
  onSave: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default FormButtons;
