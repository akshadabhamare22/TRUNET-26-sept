// import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
// import Select from 'react-select'
// import { X, Search, RotateCcw } from 'lucide-react'

// const SearchControlModel = ({
//   visible,
//   onClose,
//   onSearch,
//   centers,
// }) => {
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
//             className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
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
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
//                 inputId="center"
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
//                     borderColor: state.isFocused
//                       ? '#3b82f6'
//                       : '#d1d5db',
//                     boxShadow: state.isFocused
//                       ? '0 0 0 1px #3b82f6'
//                       : 'none',
//                     '&:hover': {
//                       borderColor: '#9ca3af',
//                     },
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

// SearchControlModel.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
// }

// export default SearchControlModel

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { X, Search, RotateCcw } from 'lucide-react'

const SearchControlModel = ({
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
    <>
      <style>
        {`
          @keyframes controlRoomSearchDrop {
            0% {
              opacity: 0;
              transform: translateY(-80px) scale(0.98);
            }
            55% {
              opacity: 1;
              transform: translateY(7px) scale(1);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes controlRoomSearchOverlay {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .control-room-search-overlay {
            animation: controlRoomSearchOverlay 180ms ease-out;
          }

          .control-room-search-modal {
            animation: controlRoomSearchDrop 420ms cubic-bezier(0.22, 1, 0.36, 1);
          }
        `}
      </style>

      <div
        className="control-room-search-overlay fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 px-4 pb-8 pt-8 sm:pt-12"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <div
          className="control-room-search-modal w-full max-w-[680px] overflow-hidden rounded-[4px] border border-[#dfe3e8] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.22)]"
          onMouseDown={(e) => e.stopPropagation()}
        >
     

          {/* Header */}
          <div className="flex min-h-[58px] items-center justify-between border-b border-[#e1e4e8] bg-white px-5">
            <div>
              <h2 className="text-[18px] font-semibold text-[#212529]">
                Search Control Room
              </h2>
              <p className="mt-[2px] text-[12px] text-[#7a828b]">
                Search control rooms by keyword or branch
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-[4px] text-[#6b7280] transition hover:bg-[#f1f3f5] hover:text-[#212529] focus:outline-none"
              aria-label="Close"
            >
              <X size={19} strokeWidth={2} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Keyword */}
              <div>
                <label
                  htmlFor="keyword"
                  className="mb-2 block text-[14px] font-semibold text-[#343a40]"
                >
                  Keyword
                </label>

                <input
                  type="text"
                  id="keyword"
                  name="keyword"
                  value={searchData.keyword}
                  onChange={handleChange}
                  placeholder="Enter keyword..."
                  className="h-[38px] w-full rounded-[3px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#212529] outline-none transition placeholder:text-[#9aa1a9] focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
                />
              </div>

              {/* Branch */}
              <div>
                <label
                  htmlFor="center"
                  className="mb-2 block text-[14px] font-semibold text-[#343a40]"
                >
                  Branch
                </label>

                <Select
                  inputId="center"
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
                      minHeight: '38px',
                      height: '38px',
                      borderRadius: '3px',
                      borderColor: state.isFocused ? '#2759A2' : '#ced4da',
                      boxShadow: state.isFocused
                        ? '0 0 0 1px #2759A2'
                        : 'none',
                      '&:hover': {
                        borderColor: '#2759A2',
                      },
                      fontSize: '14px',
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: '0 10px',
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: '36px',
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 120,
                      fontSize: '14px',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? '#2759A2'
                        : state.isFocused
                          ? '#eef3f9'
                          : '#ffffff',
                      color: state.isSelected ? '#ffffff' : '#212529',
                    }),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-[#e1e4e8] bg-[#f8f9fa] px-5 py-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-[36px] items-center gap-1.5 rounded-[4px] border border-[#c8cdd3] bg-white px-4 text-[14px] font-medium text-[#3f4650] transition hover:bg-[#f1f3f5] focus:outline-none"
            >
              <RotateCcw size={15} />
              Close
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex h-[36px] items-center gap-1.5 rounded-[4px] bg-[#2759A2] px-4 text-[14px] font-medium text-white transition hover:bg-[#214d8d] focus:outline-none focus:ring-2 focus:ring-[#2759A2]/30"
            >
              <Search size={15} />
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

SearchControlModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
}

export default SearchControlModel
