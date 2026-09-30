import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { RotateCcw, Search, X } from 'lucide-react'
import Select from 'react-select'

const SearchBuildingModel = ({
  visible,
  onClose,
  onSearch,
  centers,
}) => {
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

  if (!visible) return null

  const selectedCenter =
    centers.find((center) => center._id === searchData.center) || null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Search
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="keyword"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Keyword
              </label>

              <input
                type="text"
                id="keyword"
                name="keyword"
                value={searchData.keyword}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/20"
              />
            </div>

            <div>
              <label
                htmlFor="center"
                className="mb-1.5 block text-sm font-medium text-gray-700"
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
                classNamePrefix="building-search-select"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f4b8c]"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>
    </div>
  )
}

SearchBuildingModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
}

export default SearchBuildingModel