import React from 'react'
import PropTypes from 'prop-types'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null
  }

  // Number of page numbers to show at a time
  const pageNeighbors = 1
  const maxPagesToShow = 3

  // Calculate range of pages to display
  const calculatePageRange = () => {
    let startPage
    let endPage

    if (totalPages <= maxPagesToShow) {
      startPage = 1
      endPage = totalPages
    } else {
      const halfMaxPages = Math.floor(
        maxPagesToShow / 2,
      )

      if (currentPage <= halfMaxPages) {
        // Near the beginning
        startPage = 1
        endPage = maxPagesToShow
      } else if (
        currentPage + halfMaxPages >=
        totalPages
      ) {
        // Near the end
        startPage =
          totalPages -
          maxPagesToShow +
          1

        endPage = totalPages
      } else {
        // In the middle
        startPage =
          currentPage - halfMaxPages

        endPage =
          currentPage + halfMaxPages
      }
    }

    return {
      startPage,
      endPage,
    }
  }

  const {
    startPage,
    endPage,
  } = calculatePageRange()

  // Create array of page numbers to display
  const pageRange = []

  for (
    let i = startPage;
    i <= endPage;
    i += 1
  ) {
    pageRange.push(i)
  }

  const baseButtonClass = `
    inline-flex
    h-8
    min-w-8
    items-center
    justify-center
    border
    border-gray-300
    bg-white
    px-2
    text-xs
    font-medium
    text-gray-700
    transition-colors
    hover:bg-gray-100
    focus:z-10
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    disabled:cursor-not-allowed
    disabled:opacity-50
  `

  const pageButtonClass = (active) => `
    ${baseButtonClass}
    ${
      active
        ? 'border-[#2759A2] bg-[#2759A2] text-white hover:bg-[#1f4a89]'
        : ''
    }
  `

  return (
    <nav
      className="flex items-center justify-center"
      aria-label="Page navigation"
    >
      <div className="inline-flex items-center">

        {/* First page button */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
          className={`${baseButtonClass} rounded-l-md`}
        >
          First
        </button>

        {/* Previous page button */}
        <button
          type="button"
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={baseButtonClass}
        >
          &lt;
        </button>

        {/* Show ellipsis before page numbers */}
        {startPage > 1 && (
          <button
            type="button"
            disabled
            className={baseButtonClass}
            aria-hidden="true"
          >
            ...
          </button>
        )}

        {/* Page number buttons */}
        {pageRange.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={pageButtonClass(
              page === currentPage,
            )}
            aria-label={`Page ${page}`}
            aria-current={
              page === currentPage
                ? 'page'
                : undefined
            }
          >
            {page}
          </button>
        ))}

        {/* Show ellipsis after page numbers */}
        {endPage < totalPages && (
          <button
            type="button"
            disabled
            className={baseButtonClass}
            aria-hidden="true"
          >
            ...
          </button>
        )}

        {/* Next page button */}
        <button
          type="button"
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          disabled={
            currentPage === totalPages
          }
          aria-label="Next page"
          className={baseButtonClass}
        >
          &gt;
        </button>

        {/* Last page button */}
        <button
          type="button"
          onClick={() =>
            onPageChange(totalPages)
          }
          disabled={
            currentPage === totalPages
          }
          aria-label="Last page"
          className={`${baseButtonClass} rounded-r-md`}
        >
          Last
        </button>

      </div>
    </nav>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default Pagination