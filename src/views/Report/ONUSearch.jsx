// import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
// import Select from 'react-select'
// import { X, RotateCcw, Search } from 'lucide-react'

// const ONUSearch = ({ visible, onClose, onSearch, products, resellers, centers }) => {
//   const [searchData, setSearchData] = useState({
//     product: '',
//     status: '',
//     keyword: '',
//     reseller: '',
//     usageType: '',
//     customer: '',
//   })

//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         product: '',
//         status: '',
//         keyword: '',
//         reseller: '',
//         usageType: '',
//         customer: '',
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
//     const resetData = {
//       product: '',
//       status: '',
//       keyword: '',
//       reseller: '',
//       usageType: '',
//       customer: '',
//     }

//     setSearchData(resetData)
//     onSearch(resetData)
//     onClose()
//   }

//   if (!visible) return null

//   const selectedProduct = products.find(
//     (product) => product._id === searchData.product,
//   )

//   const selectedReseller = resellers.find(
//     (reseller) => reseller._id === searchData.reseller,
//   )

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
//       <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">Search</h2>

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
//         <div className="space-y-5 px-6 py-6">
//           {/* Product + Status */}
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             <div>
//               <label
//                 htmlFor="product"
//                 className="mb-2 block text-sm font-medium text-gray-700"
//               >
//                 Product
//               </label>

//               <Select
//                 inputId="product"
//                 name="product"
//                 placeholder="Search Product..."
//                 value={
//                   selectedProduct
//                     ? {
//                         value: selectedProduct._id,
//                         label: selectedProduct.productTitle,
//                       }
//                     : null
//                 }
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     product: selected ? selected.value : '',
//                   }))
//                 }
//                 options={products.map((product) => ({
//                   value: product._id,
//                   label: product.productTitle,
//                 }))}
//                 isClearable
//                 className="w-full"
//                 classNamePrefix="react-select"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="status"
//                 className="mb-2 block text-sm font-medium text-gray-700"
//               >
//                 Status
//               </label>

//               <select
//                 id="status"
//                 name="status"
//                 value={searchData.status}
//                 onChange={handleChange}
//                 className="h-[38px] w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">SELECT</option>
//                 <option value="all">All</option>
//                 <option value="consumed">In Use</option>
//                 <option value="Not in Use">Not in Use</option>
//                 <option value="damaged">Damage</option>
//                 <option value="Own Product">Own Product</option>
//               </select>
//             </div>
//           </div>

//           {/* Reseller + Keyword */}
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             <div>
//               <label
//                 htmlFor="reseller"
//                 className="mb-2 block text-sm font-medium text-gray-700"
//               >
//                 Reseller Name
//               </label>

//               <Select
//                 inputId="reseller"
//                 name="reseller"
//                 placeholder="Select Reseller..."
//                 value={
//                   selectedReseller
//                     ? {
//                         value: selectedReseller._id,
//                         label: selectedReseller.businessName,
//                       }
//                     : null
//                 }
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     reseller: selected ? selected.value : '',
//                   }))
//                 }
//                 options={resellers.map((reseller) => ({
//                   value: reseller._id,
//                   label: reseller.businessName,
//                 }))}
//                 isClearable
//                 className="w-full"
//                 classNamePrefix="react-select"
//               />
//             </div>

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
//                 className="h-[38px] w-full rounded-md border border-gray-300 px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
//             Reset
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

// ONUSearch.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   products: PropTypes.array.isRequired,
//   resellers: PropTypes.array.isRequired,
//   centers: PropTypes.array,
// }

// export default ONUSearch




import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { X } from 'lucide-react'

const ONUSearch = ({
  visible,
  onClose,
  onSearch,
  products,
  resellers,
  centers,
}) => {
  const [searchData, setSearchData] = useState({
    product: '',
    status: '',
    keyword: '',
    reseller: '',
    usageType: '',
    customer: '',
  })

  useEffect(() => {
    if (!visible) {
      setSearchData({
        product: '',
        status: '',
        keyword: '',
        reseller: '',
        usageType: '',
        customer: '',
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
    const resetData = {
      product: '',
      status: '',
      keyword: '',
      reseller: '',
      usageType: '',
      customer: '',
    }

    setSearchData(resetData)
    onSearch(resetData)
    onClose()
  }

  if (!visible) return null

  const selectedProduct = products.find(
    (product) => product._id === searchData.product,
  )

  const selectedReseller = resellers.find(
    (reseller) => reseller._id === searchData.reseller,
  )

  return (
    <>
      <style>
        {`
          @keyframes onuSearchModalDrop {
            0% {
              opacity: 0;
              transform: translateY(-70px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes onuSearchOverlayFade {
            0% {
              opacity: 0;
            }

            100% {
              opacity: 1;
            }
          }
        `}
      </style>

      <div
        className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 px-4 pt-[28px]"
        style={{
          animation:
            'onuSearchOverlayFade 0.18s ease-out forwards',
        }}
      >
        <div
          className="w-full max-w-[800px] overflow-hidden rounded-[7px] bg-white shadow-2xl"
          style={{
            animation:
              'onuSearchModalDrop 0.28s ease-out forwards',
          }}
        >
          {/* Header */}
          <div className="flex h-[63px] items-center justify-between border-b border-[#dee2e6] px-4">
            <h2 className="text-[20px] font-normal text-[#343a40]">
              Search
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded text-[#777] transition hover:bg-[#f1f1f1] hover:text-[#444]"
              aria-label="Close"
            >
              <X size={25} strokeWidth={1.7} />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-[17px]">
            {/* Product + Status */}
            <div className="grid grid-cols-1 gap-x-5 gap-y-[20px] md:grid-cols-2">
              {/* Product */}
              <div>
                <label
                  htmlFor="product"
                  className="mb-[7px] block text-[14px] font-semibold text-[#343a40]"
                >
                  Product
                </label>

                <Select
                  inputId="product"
                  name="product"
                  placeholder="Search Product..."
                  value={
                    selectedProduct
                      ? {
                          value: selectedProduct._id,
                          label: selectedProduct.productTitle,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setSearchData((prev) => ({
                      ...prev,
                      product: selected ? selected.value : '',
                    }))
                  }
                  options={products.map((product) => ({
                    value: product._id,
                    label: product.productTitle,
                  }))}
                  isClearable
                  className="w-full"
                  classNamePrefix="react-select"

                  /*
                   * Dropdown is rendered outside the modal so the
                   * larger menu is not clipped by overflow-hidden.
                   */
                  menuPortalTarget={
                    typeof document !== 'undefined'
                      ? document.body
                      : undefined
                  }

                  styles={{
                    control: (base, state) => ({
                      ...base,
                      minHeight: '38px',
                      height: '38px',
                      borderRadius: '4px',
                      borderColor: state.isFocused
                        ? '#80bdff'
                        : '#ced4da',
                      boxShadow: state.isFocused
                        ? '0 0 0 1px #80bdff'
                        : 'none',
                      backgroundColor: '#fff',
                      '&:hover': {
                        borderColor: state.isFocused
                          ? '#80bdff'
                          : '#ced4da',
                      },
                    }),

                    valueContainer: (base) => ({
                      ...base,
                      height: '38px',
                      padding: '0 10px',
                    }),

                    input: (base) => ({
                      ...base,
                      margin: 0,
                      padding: 0,
                      fontSize: '14px',
                    }),

                    placeholder: (base) => ({
                      ...base,
                      color: '#777',
                      fontSize: '14px',
                    }),

                    singleValue: (base) => ({
                      ...base,
                      color: '#495057',
                      fontSize: '14px',
                    }),

                    indicatorsContainer: (base) => ({
                      ...base,
                      height: '38px',
                    }),

                    dropdownIndicator: (base) => ({
                      ...base,
                      color: '#adb5bd',
                      padding: '8px',
                      '&:hover': {
                        color: '#6c757d',
                      },
                    }),

                    clearIndicator: (base) => ({
                      ...base,
                      padding: '6px',
                    }),

                    indicatorSeparator: (base) => ({
                      ...base,
                      backgroundColor: '#ced4da',
                      marginTop: '7px',
                      marginBottom: '7px',
                    }),

                    menu: (base) => ({
                      ...base,
                      zIndex: 10001,
                      marginTop: '4px',
                      width: '100%',
                    }),

                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 10001,
                    }),

                    menuList: (base) => ({
                      ...base,
                      maxHeight: '320px',
                      paddingTop: '0',
                      paddingBottom: '0',
                      overflowY: 'auto',
                    }),

                    option: (base, state) => ({
                      ...base,
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '9px 12px',
                      fontSize: '15px',
                      lineHeight: '20px',
                      backgroundColor: state.isSelected
                        ? '#5850d8'
                        : state.isFocused
                          ? '#dce9fb'
                          : '#fff',
                      color: state.isSelected
                        ? '#fff'
                        : '#343a40',
                      cursor: 'pointer',
                    }),
                  }}
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-[7px] block text-[14px] font-semibold text-[#343a40]"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={searchData.status}
                  onChange={handleChange}
                  className="box-border h-[38px] w-full rounded-[4px] border border-[#ced4da] bg-white px-3 text-[14px] font-normal text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                >
                  <option value="">SELECT</option>
                  <option value="all">All</option>
                  <option value="consumed">In Use</option>
                  <option value="Not in Use">Not in Use</option>
                  <option value="damaged">Damage</option>
                  <option value="Own Product">Own Product</option>
                </select>
              </div>

              {/* Reseller */}
              <div>
                <label
                  htmlFor="reseller"
                  className="mb-[7px] block text-[14px] font-semibold text-[#343a40]"
                >
                  Reseller Name
                </label>

                <Select
                  inputId="reseller"
                  name="reseller"
                  placeholder="Select Reseller..."
                  value={
                    selectedReseller
                      ? {
                          value: selectedReseller._id,
                          label: selectedReseller.businessName,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setSearchData((prev) => ({
                      ...prev,
                      reseller: selected ? selected.value : '',
                    }))
                  }
                  options={resellers.map((reseller) => ({
                    value: reseller._id,
                    label: reseller.businessName,
                  }))}
                  isClearable
                  className="w-full"
                  classNamePrefix="react-select"

                  /*
                   * Same larger dropdown configuration as Product.
                   */
                  menuPortalTarget={
                    typeof document !== 'undefined'
                      ? document.body
                      : undefined
                  }

                  styles={{
                    control: (base, state) => ({
                      ...base,
                      minHeight: '38px',
                      height: '38px',
                      borderRadius: '4px',
                      borderColor: state.isFocused
                        ? '#80bdff'
                        : '#ced4da',
                      boxShadow: state.isFocused
                        ? '0 0 0 1px #80bdff'
                        : 'none',
                      backgroundColor: '#fff',
                      '&:hover': {
                        borderColor: state.isFocused
                          ? '#80bdff'
                          : '#ced4da',
                      },
                    }),

                    valueContainer: (base) => ({
                      ...base,
                      height: '38px',
                      padding: '0 10px',
                    }),

                    input: (base) => ({
                      ...base,
                      margin: 0,
                      padding: 0,
                      fontSize: '14px',
                    }),

                    placeholder: (base) => ({
                      ...base,
                      color: '#777',
                      fontSize: '14px',
                    }),

                    singleValue: (base) => ({
                      ...base,
                      color: '#495057',
                      fontSize: '14px',
                    }),

                    indicatorsContainer: (base) => ({
                      ...base,
                      height: '38px',
                    }),

                    dropdownIndicator: (base) => ({
                      ...base,
                      color: '#adb5bd',
                      padding: '8px',
                      '&:hover': {
                        color: '#6c757d',
                      },
                    }),

                    clearIndicator: (base) => ({
                      ...base,
                      padding: '6px',
                    }),

                    indicatorSeparator: (base) => ({
                      ...base,
                      backgroundColor: '#ced4da',
                      marginTop: '7px',
                      marginBottom: '7px',
                    }),

                    menu: (base) => ({
                      ...base,
                      zIndex: 10001,
                      marginTop: '4px',
                      width: '100%',
                    }),

                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 10001,
                    }),

                    menuList: (base) => ({
                      ...base,
                      maxHeight: '320px',
                      paddingTop: '0',
                      paddingBottom: '0',
                      overflowY: 'auto',
                    }),

                    option: (base, state) => ({
                      ...base,
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '9px 12px',
                      fontSize: '15px',
                      lineHeight: '20px',
                      backgroundColor: state.isSelected
                        ? '#5850d8'
                        : state.isFocused
                          ? '#dce9fb'
                          : '#fff',
                      color: state.isSelected
                        ? '#fff'
                        : '#343a40',
                      cursor: 'pointer',
                    }),
                  }}
                />
              </div>

              {/* Keyword */}
              <div>
                <label
                  htmlFor="keyword"
                  className="mb-[7px] block text-[14px] font-semibold text-[#343a40]"
                >
                  Keyword
                </label>

                <input
                  type="text"
                  id="keyword"
                  name="keyword"
                  value={searchData.keyword}
                  onChange={handleChange}
                  className="box-border h-[38px] w-full rounded-[4px] border border-[#ced4da] px-3 text-[14px] font-normal text-[#495057] outline-none transition placeholder:text-[#777] focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex h-[70px] items-center justify-end gap-2 border-t border-[#dee2e6] bg-white px-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-[38px] items-center justify-center rounded-[5px] bg-[#6c757d] px-[14px] text-[16px] font-normal text-white transition hover:bg-[#5a6268]"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex h-[38px] items-center justify-center rounded-[5px] bg-[#2f5fa8] px-[14px] text-[16px] font-normal text-white transition hover:bg-[#28538f]"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

ONUSearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  resellers: PropTypes.array.isRequired,
  centers: PropTypes.array,
}

export default ONUSearch