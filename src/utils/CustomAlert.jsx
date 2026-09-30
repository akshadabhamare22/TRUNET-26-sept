import React from 'react'
import PropTypes from 'prop-types'
import { X } from 'lucide-react'

const CustomAlert = ({ type, message, onClose }) => {
  if (!message) return null

  const alertStyles = {
    success: {
      container:
        'border-green-200 bg-green-50 text-green-800',
      button:
        'text-green-700 hover:bg-green-100',
    },
    danger: {
      container:
        'border-red-200 bg-red-50 text-red-800',
      button:
        'text-red-700 hover:bg-red-100',
    },
    warning: {
      container:
        'border-yellow-200 bg-yellow-50 text-yellow-800',
      button:
        'text-yellow-700 hover:bg-yellow-100',
    },
    info: {
      container:
        'border-blue-200 bg-blue-50 text-blue-800',
      button:
        'text-blue-700 hover:bg-blue-100',
    },
  }

  const styles =
    alertStyles[type] || alertStyles.info

  return (
    <div
      role="alert"
      className={`
        flex items-center justify-between
        rounded-md border
        px-4 py-3
        text-sm
        ${styles.container}
      `}
    >
      <span>{message}</span>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`
            ml-4 inline-flex h-7 w-7
            shrink-0 items-center justify-center
            rounded
            transition-colors
            ${styles.button}
          `}
          aria-label="Close alert"
        >
          <X size={17} />
        </button>
      )}
    </div>
  )
}

CustomAlert.propTypes = {
  type: PropTypes.oneOf([
    'success',
    'danger',
    'warning',
    'info',
  ]),
  message: PropTypes.string,
  onClose: PropTypes.func,
}

export default CustomAlert