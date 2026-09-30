import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { X, RotateCcw, Search } from 'lucide-react'

const SearchCustomerModel = ({ visible, onClose, onSearch, centers }) => {
  const [searchData, setSearchData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target

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

  const selectedCenter = searchData.center
    ? centers.find((center) => center._id === searchData.center)
    : null

  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Search
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Keyword */}
            <div>
              <label
                htmlFor="keyword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Keyword
              </label>

              <input
                type="text"
                id="keyword"
                name="keyword"
                value={searchData.keyword}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Branch */}
            <div>
              <label
                htmlFor="center"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Branch
              </label>

              <Select
                id="center"
                name="center"
                placeholder="Select Branch..."
                value={
                  selectedCenter
                    ? {
                        value: selectedCenter._id,
                        label: selectedCenter.centerName,
                      }
                    : null
                }
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    center: selected ? selected.value : '',
                  }))
                }
                options={centers.map((center) => ({
                  value: center._id,
                  label: center.centerName,
                }))}
                isClearable
                classNamePrefix="react-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: '42px',
                    borderRadius: '6px',
                    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
                    boxShadow: state.isFocused
                      ? '0 0 0 2px rgba(59, 130, 246, 0.1)'
                      : 'none',
                    '&:hover': {
                      borderColor: '#9ca3af',
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 60,
                  }),
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw size={16} />
            Close
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>
    </div>
  )
}

SearchCustomerModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
}

export default SearchCustomerModel