import React from 'react'
import PropTypes from 'prop-types'
import { Play, Code2 } from 'lucide-react'

const DocsExample = ({
  children,
  href,
  tabContentClassName,
}) => {
  const _href = `https://coreui.io/react/docs/${href}`

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="
            inline-flex items-center gap-2
            border-b-2 border-blue-600
            px-4 py-2.5
            text-sm font-medium
            text-blue-600
            dark:border-blue-400
            dark:text-blue-400
          "
        >
          <Play size={16} />
          Preview
        </button>

        <a
          href={_href}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center gap-2
            border-b-2 border-transparent
            px-4 py-2.5
            text-sm font-medium
            text-gray-600
            transition-colors
            hover:border-gray-300
            hover:text-gray-900
            dark:text-gray-400
            dark:hover:border-gray-600
            dark:hover:text-white
          "
        >
          <Code2 size={16} />
          Code
        </a>
      </div>

      {/* Preview Content */}
      <div
        className={`
          rounded-b-lg
          p-4
          ${tabContentClassName || ''}
        `}
      >
        {children}
      </div>
    </div>
  )
}

DocsExample.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  tabContentClassName: PropTypes.string,
}

export default React.memo(DocsExample)