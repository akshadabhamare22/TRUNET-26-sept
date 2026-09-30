import React from 'react'
import PropTypes from 'prop-types'

const ProBadge = (props) => {
  const { children, ...attributes } = props

  return (
    <a
      href="https://coreui.io/pro/react/"
      target="_blank"
      rel="noreferrer noopener"
      {...attributes}
      className={`
        inline-flex items-center rounded-full
        bg-gradient-to-r from-red-500 to-red-700
        px-2.5 py-1
        text-xs font-semibold
        text-white
        shadow-sm
        transition-opacity
        hover:opacity-90
        ${attributes.className || ''}
      `}
    >
      {children || 'CoreUI PRO Plugin'}
    </a>
  )
}

ProBadge.propTypes = {
  children: PropTypes.node,
}

export default React.memo(ProBadge)