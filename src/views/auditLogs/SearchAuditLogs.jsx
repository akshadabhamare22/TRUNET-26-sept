import React, {
  useEffect,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { X } from 'lucide-react'

const SearchAuditLogs = ({
  visible,
  onClose,
  onSearch,
  centers,
}) => {
  const [searchData, setSearchData] =
    useState({
      keyword: '',
      center: '',
    })

  useEffect(() => {
    if (!visible) {
      setSearchData({
        keyword: '',
        center: '',
      })
    }
  }, [visible])

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = () => {
    onSearch(searchData)
    onClose()
  }

  const handleReset = () => {
    setSearchData({
      keyword: '',
      center: '',
    })

    onSearch({
      keyword: '',
      center: '',
    })
  }

  if (!visible) {
    return null
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/50
        px-4
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-audit-logs-title"
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-2xl
          overflow-hidden
          rounded-lg
          bg-white
          shadow-xl
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-200
            px-5
            py-4
          "
        >
          <h2
            id="search-audit-logs-title"
            className="
              m-0
              text-lg
              font-semibold
              text-gray-800
            "
          >
            Search Audit Logs
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              inline-flex
              h-8
              w-8
              items-center
              justify-center
              rounded
              text-gray-500
              transition-colors
              hover:bg-gray-100
              hover:text-gray-800
            "
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="keyword"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Keyword
              </label>

              <input
                type="text"
                id="keyword"
                name="keyword"
                value={searchData.keyword}
                onChange={handleChange}
                className="
                  h-9
                  w-full
                  rounded-none
                  border
                  border-gray-300
                  bg-white
                  px-3
                  text-sm
                  text-gray-800
                  outline-none
                  transition
                  focus:border-[#2759A2]
                  focus:ring-1
                  focus:ring-[#2759A2]
                "
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            flex
            items-center
            justify-end
            gap-2
            border-t
            border-gray-200
            bg-gray-50
            px-5
            py-3
          "
        >
          <button
            type="button"
            onClick={handleReset}
            className="
              inline-flex
              items-center
              rounded
              bg-gray-500
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition-colors
              hover:bg-gray-600
            "
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="
              inline-flex
              items-center
              rounded
              bg-[#2759A2]
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition-colors
              hover:bg-[#1f4a89]
            "
          >
            Search
          </button>
        </div>
      </div>
    </div>
  )
}

SearchAuditLogs.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
}

export default SearchAuditLogs