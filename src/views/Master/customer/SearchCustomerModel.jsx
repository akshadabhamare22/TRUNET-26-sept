// import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
// import Select from 'react-select'
// import { X, RotateCcw, Search } from 'lucide-react'

// const SearchCustomerModel = ({ visible, onClose, onSearch, centers }) => {
//   const [searchData, setSearchData] = useState({
//     keyword: '',
//     center: '',
//   })

//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         keyword: '',
//         center: '',
//       })
//     }
//   }, [visible])

//   const handleChange = (e) => {
//     const { name, value } = e.target

//     setSearchData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleSearch = () => {
//     onSearch(searchData)
//     onClose()
//   }

//   const handleReset = () => {
//     setSearchData({
//       keyword: '',
//       center: '',
//     })

//     onSearch({
//       keyword: '',
//       center: '',
//     })
//   }

//   const selectedCenter = searchData.center
//     ? centers.find((center) => center._id === searchData.center)
//     : null

//   if (!visible) {
//     return null
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//       <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Search
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5">
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Keyword */}
//             <div>
//               <label
//                 htmlFor="keyword"
//                 className="mb-2 block text-sm font-medium text-gray-700"
//               >
//                 Keyword
//               </label>

//               <input
//                 type="text"
//                 id="keyword"
//                 name="keyword"
//                 value={searchData.keyword}
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//             </div>

//             {/* Branch */}
//             <div>
//               <label
//                 htmlFor="center"
//                 className="mb-2 block text-sm font-medium text-gray-700"
//               >
//                 Branch
//               </label>

//               <Select
//                 id="center"
//                 name="center"
//                 placeholder="Select Branch..."
//                 value={
//                   selectedCenter
//                     ? {
//                         value: selectedCenter._id,
//                         label: selectedCenter.centerName,
//                       }
//                     : null
//                 }
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     center: selected ? selected.value : '',
//                   }))
//                 }
//                 options={centers.map((center) => ({
//                   value: center._id,
//                   label: center.centerName,
//                 }))}
//                 isClearable
//                 classNamePrefix="react-select"
//                 styles={{
//                   control: (base, state) => ({
//                     ...base,
//                     minHeight: '42px',
//                     borderRadius: '6px',
//                     borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
//                     boxShadow: state.isFocused
//                       ? '0 0 0 2px rgba(59, 130, 246, 0.1)'
//                       : 'none',
//                     '&:hover': {
//                       borderColor: '#9ca3af',
//                     },
//                   }),
//                   menu: (base) => ({
//                     ...base,
//                     zIndex: 60,
//                   }),
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//           >
//             <RotateCcw size={16} />
//             Close
//           </button>

//           <button
//             type="button"
//             onClick={handleSearch}
//             className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//           >
//             <Search size={16} />
//             Search
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// SearchCustomerModel.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
// }

// export default SearchCustomerModel

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { X, RotateCcw, Search } from 'lucide-react'

const SearchCustomerModel = ({
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

  const selectedCenter = searchData.center
    ? centers.find((center) => center._id === searchData.center)
    : null

  if (!visible) {
    return null
  }

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-start justify-center
        bg-black/50
        px-4
        pt-8
        sm:pt-12
        md:pt-16
        overflow-y-auto
      "
    >
      {/* Modal */}
      <div
        className="
          w-full max-w-2xl
          overflow-hidden
          rounded-md
          border border-gray-200
          border-t-[3px] border-t-[#2759a2]
          bg-white
          shadow-2xl
          animate-[modalDropDown_0.3s_ease-out]
        "
      >
        {/* ============================= */}
        {/* Header */}
        {/* ============================= */}
        <div
          className="
            flex items-center justify-between
            border-b border-gray-200
            bg-white
            px-6 py-4
          "
        >
          <h2 className="text-[20px] font-semibold text-gray-800">
            Search Customer
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-md
              text-gray-400
              transition-all duration-200
              hover:bg-gray-100
              hover:text-gray-700
              focus:outline-none
            "
            aria-label="Close"
          >
            <X size={19} strokeWidth={1.8} />
          </button>
        </div>

        {/* ============================= */}
        {/* Body */}
        {/* ============================= */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Keyword */}
            <div>
              <label
                htmlFor="keyword"
                className="
                  mb-2 block
                  text-[14px]
                  font-semibold
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
                placeholder="Enter keyword"
                className="
                  h-[42px]
                  w-full
                  rounded-[5px]
                  border border-gray-300
                  bg-white
                  px-3
                  text-[14px]
                  text-gray-800
                  placeholder:text-gray-400
                  outline-none
                  transition-all duration-200
                  focus:border-[#2759a2]
                  focus:ring-2
                  focus:ring-[#2759a2]/10
                "
              />
            </div>

            {/* Branch */}
            <div>
              <label
                htmlFor="center"
                className="
                  mb-2 block
                  text-[14px]
                  font-semibold
                  text-gray-700
                "
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
                classNamePrefix="customer-search-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: '42px',
                    height: '42px',
                    borderRadius: '5px',
                    borderColor: state.isFocused
                      ? '#2759a2'
                      : '#d1d5db',
                    boxShadow: state.isFocused
                      ? '0 0 0 2px rgba(39, 89, 162, 0.10)'
                      : 'none',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: state.isFocused
                        ? '#2759a2'
                        : '#9ca3af',
                    },
                  }),

                  valueContainer: (base) => ({
                    ...base,
                    padding: '0 12px',
                  }),

                  input: (base) => ({
                    ...base,
                    margin: 0,
                    padding: 0,
                    fontSize: '14px',
                  }),

                  singleValue: (base) => ({
                    ...base,
                    fontSize: '14px',
                    color: '#374151',
                  }),

                  placeholder: (base) => ({
                    ...base,
                    fontSize: '14px',
                    color: '#9ca3af',
                  }),

                  indicatorSeparator: (base) => ({
                    ...base,
                    backgroundColor: '#e5e7eb',
                  }),

                  dropdownIndicator: (base) => ({
                    ...base,
                    color: '#6b7280',
                    '&:hover': {
                      color: '#2759a2',
                    },
                  }),

                  clearIndicator: (base) => ({
                    ...base,
                    color: '#9ca3af',
                    '&:hover': {
                      color: '#ef4444',
                    },
                  }),

                  menu: (base) => ({
                    ...base,
                    zIndex: 10000,
                    borderRadius: '5px',
                    marginTop: '4px',
                    overflow: 'hidden',
                    boxShadow:
                      '0 10px 25px rgba(0, 0, 0, 0.12)',
                    border: '1px solid #e5e7eb',
                  }),

                  option: (
                    base,
                    state,
                  ) => ({
                    ...base,
                    fontSize: '14px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    backgroundColor:
                      state.isSelected
                        ? '#2759a2'
                        : state.isFocused
                          ? '#f1f5f9'
                          : '#ffffff',
                    color:
                      state.isSelected
                        ? '#ffffff'
                        : '#374151',
                    '&:active': {
                      backgroundColor: '#2759a2',
                      color: '#ffffff',
                    },
                  }),
                }}
              />
            </div>
          </div>
        </div>

        {/* ============================= */}
        {/* Footer */}
        {/* ============================= */}
        <div
          className="
            flex items-center justify-end
            gap-3
            border-t border-gray-200
            bg-gray-50
            px-6 py-4
          "
        >
          {/* Reset */}
          <button
            type="button"
            onClick={handleReset}
            className="
              inline-flex
              h-[40px]
              items-center
              gap-2
              rounded-[5px]
              border border-gray-300
              bg-white
              px-4
              text-[14px]
              font-medium
              text-gray-700
              transition-all duration-200
              hover:bg-gray-100
              hover:border-gray-400
              focus:outline-none
              focus:ring-2
              focus:ring-gray-200
            "
          >
            <RotateCcw size={16} strokeWidth={1.8} />
            Close
          </button>

          {/* Search */}
          <button
            type="button"
            onClick={handleSearch}
            className="
              inline-flex
              h-[40px]
              items-center
              gap-2
              rounded-[5px]
              bg-[#2759a2]
              px-5
              text-[14px]
              font-semibold
              text-white
              shadow-sm
              transition-all duration-200
              hover:bg-[#214d8c]
              hover:shadow-md
              focus:outline-none
              focus:ring-2
              focus:ring-[#2759a2]/30
            "
          >
            <Search size={16} strokeWidth={2} />
            Search
          </button>
        </div>
      </div>

      {/* Top-down animation */}
      <style>
        {`
          @keyframes modalDropDown {
            0% {
              opacity: 0;
              transform: translateY(-70px);
            }

            60% {
              opacity: 1;
              transform: translateY(8px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
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