// import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
// import { RotateCcw, Search, X } from 'lucide-react'
// import Select from 'react-select'

// const SearchBuildingModel = ({
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

//   if (!visible) return null

//   const selectedCenter =
//     centers.find((center) => center._id === searchData.center) || null

//   return (
//     <div
//       className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget) {
//           onClose()
//         }
//       }}
//     >
//       <div
//         className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl"
//         onMouseDown={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Search
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-5">
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             <div>
//               <label
//                 htmlFor="keyword"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Keyword
//               </label>

//               <input
//                 type="text"
//                 id="keyword"
//                 name="keyword"
//                 value={searchData.keyword}
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/20"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="center"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
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
//                 classNamePrefix="building-search-select"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
//           >
//             <RotateCcw size={16} />
//             Reset
//           </button>

//           <button
//             type="button"
//             onClick={handleSearch}
//             className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f4b8c]"
//           >
//             <Search size={16} />
//             Search
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// SearchBuildingModel.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
// }

// export default SearchBuildingModel

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
    <>
      <style>
        {`
          @keyframes buildingSearchDrop {
            0% {
              opacity: 0;
              transform: translateY(-70px) scale(0.98);
            }
            60% {
              opacity: 1;
              transform: translateY(8px) scale(1);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes buildingSearchOverlay {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .building-search-overlay {
            animation: buildingSearchOverlay 180ms ease-out;
          }

          .building-search-modal {
            animation: buildingSearchDrop 420ms cubic-bezier(0.22, 1, 0.36, 1);
          }
        `}
      </style>

      <div
        className="building-search-overlay fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 px-4 pb-8 pt-8 sm:pt-12"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <div
          className="building-search-modal w-full max-w-[680px] overflow-hidden rounded-[4px] border border-[#dfe3e8] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.22)]"
          onMouseDown={(e) => e.stopPropagation()}
        >


          {/* Header */}
          <div className="flex min-h-[58px] items-center justify-between border-b border-[#e1e4e8] bg-white px-5">
            <div>
              <h2 className="text-[18px] font-semibold text-[#212529]">
                Search Building
              </h2>
              <p className="mt-[2px] text-[12px] text-[#7a828b]">
                Search buildings by keyword or branch
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

          {/* Form */}
          <div className="px-5 py-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                  placeholder="Enter building name..."
                  className="h-[38px] w-full rounded-[3px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#212529] outline-none transition placeholder:text-[#9aa1a9] focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
                />
              </div>

              <div>
                <label
                  htmlFor="center"
                  className="mb-2 block text-[14px] font-semibold text-[#343a40]"
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
                          : '#fff',
                      color: state.isSelected ? '#fff' : '#212529',
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
              Reset
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

SearchBuildingModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
}

export default SearchBuildingModel
