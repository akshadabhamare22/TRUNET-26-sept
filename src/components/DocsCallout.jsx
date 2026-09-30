import React from 'react'
import PropTypes from 'prop-types'

const DocsCallout = ({ children, href, name }) => {
  const plural = name?.slice(-1) === 's'

  const _href = `https://coreui.io/react/docs/${href}`

  return (
    <div className="rounded-lg border-l-4 border-cyan-500 bg-white p-4 text-sm text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200">
      <div>
        {children
          ? children
          : `A React ${name} component ${
              plural ? 'have' : 'has'
            } been created as a native React.js version
        of Bootstrap ${name}. ${name} ${
              plural ? 'are' : 'is'
            } delivered with some new features,
        variants, and unique design that matches CoreUI Design System requirements.`}
      </div>

      <div className="mt-4">
        For more information please visit our official{' '}
        <a
          href={_href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          documentation of CoreUI Components Library for React.js
        </a>
        .
      </div>
    </div>
  )
}

DocsCallout.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  name: PropTypes.string,
}

export default React.memo(DocsCallout)