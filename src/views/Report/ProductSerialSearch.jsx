// import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
// import Select from 'react-select'
// import { X, RotateCcw, Search } from 'lucide-react'
// import axiosInstance from '../../axiosInstance'

// const ProductSerialSearch = ({
//   visible,
//   onClose,
//   onSearch,
//   products,
// }) => {
//   const [searchData, setSearchData] = useState({
//     productId: '',
//     status: '',
//     keyword: '',
//     reseller: '',
//     center: '',
//     startDate: '',
//     endDate: '',
//   })

//   const [resellers, setResellers] = useState([])
//   const [loadingResellers, setLoadingResellers] = useState(false)

//   const [resellerCenters, setResellerCenters] = useState([])
//   const [loadingCenters, setLoadingCenters] = useState(false)

//   // Fetch all resellers on component mount
//   useEffect(() => {
//     const fetchResellers = async () => {
//       setLoadingResellers(true)

//       try {
//         const response = await axiosInstance.get('/resellers')

//         if (response.data.success) {
//           setResellers(response.data.data || [])
//         }
//       } catch (error) {
//         console.error('Error fetching resellers:', error)
//         setResellers([])
//       } finally {
//         setLoadingResellers(false)
//       }
//     }

//     fetchResellers()
//   }, [])

//   // Fetch centers based on selected reseller
//   useEffect(() => {
//     const fetchCentersByReseller = async () => {
//       if (searchData.reseller) {
//         setLoadingCenters(true)

//         try {
//           const response = await axiosInstance.get(
//             `/centers/reseller/${searchData.reseller}`,
//           )

//           if (response.data.success) {
//             setResellerCenters(response.data.data)
//           } else {
//             setResellerCenters([])
//           }
//         } catch (error) {
//           console.error(
//             'Error fetching centers for reseller:',
//             error,
//           )
//           setResellerCenters([])
//         } finally {
//           setLoadingCenters(false)
//         }
//       } else {
//         setResellerCenters([])

//         // Clear center selection when reseller is cleared
//         setSearchData((prev) => ({
//           ...prev,
//           center: '',
//         }))
//       }
//     }

//     fetchCentersByReseller()
//   }, [searchData.reseller])

//   // Reset form when modal closes
//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         productId: '',
//         status: '',
//         keyword: '',
//         reseller: '',
//         center: '',
//         startDate: '',
//         endDate: '',
//       })

//       setResellerCenters([])
//     }
//   }, [visible])

//   const handleChange = (e) => {
//     const { name, value } = e.target

//     setSearchData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   // Format YYYY-MM-DD to DD-MM-YYYY for API
//   const formatDateToDDMMYYYY = (dateString) => {
//     if (!dateString) return ''

//     if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
//       const [year, month, day] = dateString.split('-')

//       return `${day}-${month}-${year}`
//     }

//     return dateString
//   }

//   const handleSearch = () => {
//     const apiSearchData = {
//       productId: searchData.productId,
//       status: searchData.status,
//       keyword: searchData.keyword,
//       reseller: searchData.reseller,
//       center: searchData.center,
//       startDate: formatDateToDDMMYYYY(searchData.startDate),
//       endDate: formatDateToDDMMYYYY(searchData.endDate),
//     }

//     onSearch(apiSearchData)
//     onClose()
//   }

//   const handleReset = () => {
//     const resetData = {
//       productId: '',
//       status: '',
//       keyword: '',
//       reseller: '',
//       center: '',
//       startDate: '',
//       endDate: '',
//     }

//     setSearchData(resetData)
//     setResellerCenters([])

//     onSearch(resetData)
//     onClose()
//   }

//   if (!visible) return null

//   const selectedReseller = resellers.find(
//     (reseller) => reseller._id === searchData.reseller,
//   )

//   const selectedCenter = resellerCenters.find(
//     (center) => center._id === searchData.center,
//   )

//   const selectedProduct = products.find(
//     (product) => product._id === searchData.productId,
//   )

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
//       <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Search Product Serial Report
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
//         <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
//           <div className="space-y-5">
//             {/* Reseller + Branch */}
//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//               {/* Reseller */}
//               <div>
//                 <label
//                   htmlFor="reseller"
//                   className="mb-2 block text-sm font-medium text-gray-700"
//                 >
//                   Reseller
//                 </label>

//                 <Select
//                   inputId="reseller"
//                   name="reseller"
//                   placeholder={
//                     loadingResellers
//                       ? 'Loading resellers...'
//                       : 'Select Reseller...'
//                   }
//                   value={
//                     selectedReseller
//                       ? {
//                           value: selectedReseller._id,
//                           label: selectedReseller.businessName,
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     setSearchData((prev) => ({
//                       ...prev,
//                       reseller: selected
//                         ? selected.value
//                         : '',
//                       center: '',
//                     }))
//                   }
//                   options={resellers.map((reseller) => ({
//                     value: reseller._id,
//                     label: reseller.businessName,
//                   }))}
//                   isClearable
//                   isLoading={loadingResellers}
//                   className="w-full"
//                   classNamePrefix="react-select"
//                 />
//               </div>

//               {/* Branch */}
//               <div>
//                 <label
//                   htmlFor="center"
//                   className="mb-2 block text-sm font-medium text-gray-700"
//                 >
//                   Branch
//                 </label>

//                 <Select
//                   inputId="center"
//                   name="center"
//                   placeholder={
//                     loadingCenters
//                       ? 'Loading branches...'
//                       : searchData.reseller
//                         ? 'Select Branch...'
//                         : 'Select a reseller first'
//                   }
//                   value={
//                     selectedCenter
//                       ? {
//                           value: selectedCenter._id,
//                           label: `${selectedCenter.centerName} (${
//                             selectedCenter.centerCode || 'N/A'
//                           })`,
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     setSearchData((prev) => ({
//                       ...prev,
//                       center: selected
//                         ? selected.value
//                         : '',
//                     }))
//                   }
//                   options={resellerCenters.map((center) => ({
//                     value: center._id,
//                     label: center.centerName,
//                   }))}
//                   isClearable
//                   isDisabled={
//                     !searchData.reseller || loadingCenters
//                   }
//                   isLoading={loadingCenters}
//                   className="w-full"
//                   classNamePrefix="react-select"
//                 />

//                 {searchData.reseller &&
//                   !loadingCenters &&
//                   resellerCenters.length === 0 && (
//                     <p className="mt-1 text-xs text-gray-500">
//                       No branches found for this reseller
//                     </p>
//                   )}
//               </div>
//             </div>

//             {/* Product + Status */}
//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//               {/* Product */}
//               <div>
//                 <label
//                   htmlFor="product"
//                   className="mb-2 block text-sm font-medium text-gray-700"
//                 >
//                   Product
//                 </label>

//                 <Select
//                   inputId="product"
//                   name="productId"
//                   placeholder="Search Product..."
//                   value={
//                     selectedProduct
//                       ? {
//                           value: selectedProduct._id,
//                           label: selectedProduct.productTitle,
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     setSearchData((prev) => ({
//                       ...prev,
//                       productId: selected
//                         ? selected.value
//                         : '',
//                     }))
//                   }
//                   options={products.map((product) => ({
//                     value: product._id,
//                     label: product.productTitle,
//                   }))}
//                   isClearable
//                   className="w-full"
//                   classNamePrefix="react-select"
//                 />
//               </div>

//               {/* Status */}
//               <div>
//                 <label
//                   htmlFor="status"
//                   className="mb-2 block text-sm font-medium text-gray-700"
//                 >
//                   Status
//                 </label>

//                 <select
//                   id="status"
//                   name="status"
//                   value={searchData.status}
//                   onChange={handleChange}
//                   className="h-[38px] w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                 >
//                   <option value="">All Status</option>
//                   <option value="all">All</option>
//                   <option value="consumed">In Use</option>
//                   <option value="Not in Use">Not in Use</option>
//                   <option value="damaged">Damage</option>
//                   <option value="Own Product">
//                     Own Product
//                   </option>
//                 </select>
//               </div>
//             </div>

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
//                 placeholder="Search by serial number, IMEI, etc."
//                 className="h-[38px] w-full rounded-md border border-gray-300 px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>

//             {/* Date Range */}
//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//               {/* Start Date */}
//               <div>
//                 <label
//                   htmlFor="startDate"
//                   className="mb-2 block text-sm font-medium text-gray-700"
//                 >
//                   Start Date
//                 </label>

//                 <input
//                   type="date"
//                   id="startDate"
//                   name="startDate"
//                   value={searchData.startDate}
//                   onChange={handleChange}
//                   className="h-[38px] w-full rounded-md border border-gray-300 px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Optional
//                 </p>
//               </div>

//               {/* End Date */}
//               <div>
//                 <label
//                   htmlFor="endDate"
//                   className="mb-2 block text-sm font-medium text-gray-700"
//                 >
//                   End Date
//                 </label>

//                 <input
//                   type="date"
//                   id="endDate"
//                   name="endDate"
//                   value={searchData.endDate}
//                   onChange={handleChange}
//                   className="h-[38px] w-full rounded-md border border-gray-300 px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Optional
//                 </p>
//               </div>
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

// ProductSerialSearch.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   products: PropTypes.array.isRequired,
// }

// export default ProductSerialSearch








import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { X } from 'lucide-react'
import axiosInstance from '../../axiosInstance'

const ProductSerialSearch = ({
  visible,
  onClose,
  onSearch,
  products,
}) => {
  const [searchData, setSearchData] = useState({
    productId: '',
    status: '',
    keyword: '',
    reseller: '',
    center: '',
    startDate: '',
    endDate: '',
  })

  const [resellers, setResellers] = useState([])
  const [loadingResellers, setLoadingResellers] = useState(false)

  const [resellerCenters, setResellerCenters] = useState([])
  const [loadingCenters, setLoadingCenters] = useState(false)

  // --------------------------------------------------
  // Fetch all resellers on component mount
  // --------------------------------------------------
  useEffect(() => {
    const fetchResellers = async () => {
      setLoadingResellers(true)

      try {
        const response = await axiosInstance.get('/resellers')

        if (response.data.success) {
          setResellers(response.data.data || [])
        }
      } catch (error) {
        console.error('Error fetching resellers:', error)
        setResellers([])
      } finally {
        setLoadingResellers(false)
      }
    }

    fetchResellers()
  }, [])

  // --------------------------------------------------
  // Fetch centers based on selected reseller
  // --------------------------------------------------
  useEffect(() => {
    const fetchCentersByReseller = async () => {
      if (searchData.reseller) {
        setLoadingCenters(true)

        try {
          const response = await axiosInstance.get(
            `/centers/reseller/${searchData.reseller}`,
          )

          if (response.data.success) {
            setResellerCenters(response.data.data)
          } else {
            setResellerCenters([])
          }
        } catch (error) {
          console.error(
            'Error fetching centers for reseller:',
            error,
          )

          setResellerCenters([])
        } finally {
          setLoadingCenters(false)
        }
      } else {
        setResellerCenters([])

        // Clear center selection when reseller is cleared
        setSearchData((prev) => ({
          ...prev,
          center: '',
        }))
      }
    }

    fetchCentersByReseller()
  }, [searchData.reseller])

  // --------------------------------------------------
  // Reset form when modal closes
  // --------------------------------------------------
  useEffect(() => {
    if (!visible) {
      setSearchData({
        productId: '',
        status: '',
        keyword: '',
        reseller: '',
        center: '',
        startDate: '',
        endDate: '',
      })

      setResellerCenters([])
    }
  }, [visible])

  // --------------------------------------------------
  // Input Change
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // --------------------------------------------------
  // Format YYYY-MM-DD to DD-MM-YYYY for API
  // --------------------------------------------------
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return ''

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-')

      return `${day}-${month}-${year}`
    }

    return dateString
  }

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const handleSearch = () => {
    const apiSearchData = {
      productId: searchData.productId,
      status: searchData.status,
      keyword: searchData.keyword,
      reseller: searchData.reseller,
      center: searchData.center,
      startDate: formatDateToDDMMYYYY(
        searchData.startDate,
      ),
      endDate: formatDateToDDMMYYYY(
        searchData.endDate,
      ),
    }

    onSearch(apiSearchData)
    onClose()
  }

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  const handleReset = () => {
    const resetData = {
      productId: '',
      status: '',
      keyword: '',
      reseller: '',
      center: '',
      startDate: '',
      endDate: '',
    }

    setSearchData(resetData)
    setResellerCenters([])

    onSearch(resetData)
    onClose()
  }

  // --------------------------------------------------
  // React Select Styles
  // UI only
  // --------------------------------------------------
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '38px',
      height: '38px',
      borderRadius: '4px',
      borderColor: state.isFocused
        ? '#3b82f6'
        : '#d1d5db',
      boxShadow: state.isFocused
        ? '0 0 0 1px #3b82f6'
        : 'none',
      '&:hover': {
        borderColor: '#9ca3af',
      },
      fontSize: '14px',
    }),

    valueContainer: (base) => ({
      ...base,
      height: '38px',
      padding: '0 10px',
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: '38px',
    }),

    indicatorSeparator: (base) => ({
      ...base,
      marginTop: '8px',
      marginBottom: '8px',
    }),

    dropdownIndicator: (base) => ({
      ...base,
      padding: '8px',
    }),

    clearIndicator: (base) => ({
      ...base,
      padding: '6px',
    }),

    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),

    placeholder: (base) => ({
      ...base,
      color: '#9ca3af',
    }),

    singleValue: (base) => ({
      ...base,
      color: '#374151',
    }),

    menu: (base) => ({
      ...base,
      zIndex: 10000,
      fontSize: '14px',
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#2563eb'
        : state.isFocused
          ? '#eff6ff'
          : '#ffffff',
      color: state.isSelected
        ? '#ffffff'
        : '#374151',
      cursor: 'pointer',
    }),
  }

  if (!visible) return null

  const selectedReseller = resellers.find(
    (reseller) =>
      reseller._id === searchData.reseller,
  )

  const selectedCenter = resellerCenters.find(
    (center) =>
      center._id === searchData.center,
  )

  const selectedProduct = products.find(
    (product) =>
      product._id === searchData.productId,
  )

  return (
    <>
      {/* --------------------------------------------------
          Top-to-Bottom Modal Animation
          UI only
      -------------------------------------------------- */}
      <style>
        {`
          @keyframes productSerialSearchDrop {
            0% {
              opacity: 0;
              transform: translateY(-45px) scaleY(0.96);
              transform-origin: top center;
            }

            100% {
              opacity: 1;
              transform: translateY(0) scaleY(1);
              transform-origin: top center;
            }
          }

          .product-serial-search-modal {
            animation: productSerialSearchDrop 0.25s ease-out;
          }
        `}
      </style>

      {/* Overlay */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
        {/* Modal */}
        <div className="product-serial-search-modal w-full max-w-[800px] overflow-hidden rounded-lg bg-white shadow-2xl">
          {/* --------------------------------------------------
              Header
          -------------------------------------------------- */}
          <div className="flex h-[63px] items-center justify-between border-b border-gray-200 px-4">
            <h2 className="text-[20px] font-normal text-gray-700">
              Search Product Serial Report
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={24} strokeWidth={1.8} />
            </button>
          </div>

          {/* --------------------------------------------------
              Body
          -------------------------------------------------- */}
          <div className="px-4 py-4">
            <div className="space-y-5">
              {/* --------------------------------------------------
                  Reseller + Branch
              -------------------------------------------------- */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Reseller */}
                <div>
                  <label
                    htmlFor="reseller"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Reseller
                  </label>

                  <Select
                    inputId="reseller"
                    name="reseller"
                    placeholder={
                      loadingResellers
                        ? 'Loading resellers...'
                        : 'Select Reseller...'
                    }
                    value={
                      selectedReseller
                        ? {
                            value:
                              selectedReseller._id,
                            label:
                              selectedReseller.businessName,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setSearchData((prev) => ({
                        ...prev,
                        reseller: selected
                          ? selected.value
                          : '',
                        center: '',
                      }))
                    }
                    options={resellers.map(
                      (reseller) => ({
                        value: reseller._id,
                        label:
                          reseller.businessName,
                      }),
                    )}
                    isClearable
                    isLoading={loadingResellers}
                    className="w-full"
                    classNamePrefix="react-select"
                    styles={selectStyles}
                  />
                </div>

                {/* Branch */}
                <div>
                  <label
                    htmlFor="center"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Branch
                  </label>

                  <Select
                    inputId="center"
                    name="center"
                    placeholder={
                      loadingCenters
                        ? 'Loading branches...'
                        : searchData.reseller
                          ? 'Select Branch...'
                          : 'Select a reseller first'
                    }
                    value={
                      selectedCenter
                        ? {
                            value:
                              selectedCenter._id,
                            label: `${selectedCenter.centerName} (${
                              selectedCenter.centerCode ||
                              'N/A'
                            })`,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setSearchData((prev) => ({
                        ...prev,
                        center: selected
                          ? selected.value
                          : '',
                      }))
                    }
                    options={resellerCenters.map(
                      (center) => ({
                        value: center._id,
                        label: center.centerName,
                      }),
                    )}
                    isClearable
                    isDisabled={
                      !searchData.reseller ||
                      loadingCenters
                    }
                    isLoading={loadingCenters}
                    className="w-full"
                    classNamePrefix="react-select"
                    styles={selectStyles}
                  />

                  {searchData.reseller &&
                    !loadingCenters &&
                    resellerCenters.length ===
                      0 && (
                      <p className="mt-1 text-xs text-gray-500">
                        No branches found for this
                        reseller
                      </p>
                    )}
                </div>
              </div>

              {/* --------------------------------------------------
                  Product + Status
              -------------------------------------------------- */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Product */}
                <div>
                  <label
                    htmlFor="product"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Product
                  </label>

                  <Select
                    inputId="product"
                    name="productId"
                    placeholder="Search Product..."
                    value={
                      selectedProduct
                        ? {
                            value:
                              selectedProduct._id,
                            label:
                              selectedProduct.productTitle,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setSearchData((prev) => ({
                        ...prev,
                        productId: selected
                          ? selected.value
                          : '',
                      }))
                    }
                    options={products.map(
                      (product) => ({
                        value: product._id,
                        label:
                          product.productTitle,
                      }),
                    )}
                    isClearable
                    className="w-full"
                    classNamePrefix="react-select"
                    styles={selectStyles}
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={searchData.status}
                    onChange={handleChange}
                    className="h-[38px] w-full rounded-[4px] border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">
                      All Status
                    </option>

                    <option value="all">
                      All
                    </option>

                    <option value="consumed">
                      In Use
                    </option>

                    <option value="Not in Use">
                      Not in Use
                    </option>

                    <option value="damaged">
                      Damage
                    </option>

                    <option value="Own Product">
                      Own Product
                    </option>
                  </select>
                </div>
              </div>

              {/* --------------------------------------------------
                  Keyword
                  Kept only on left side like screenshot
              -------------------------------------------------- */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="keyword"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Keyword
                  </label>

                  <input
                    type="text"
                    id="keyword"
                    name="keyword"
                    value={searchData.keyword}
                    onChange={handleChange}
                    placeholder="Search by serial number, IMEI, etc."
                    className="h-[38px] w-full rounded-[4px] border border-gray-300 px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* --------------------------------------------------
                  Start Date + End Date
              -------------------------------------------------- */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Start Date */}
                <div>
                  <label
                    htmlFor="startDate"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Start Date
                  </label>

                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={searchData.startDate}
                    onChange={handleChange}
                    className="h-[38px] w-full rounded-[4px] border border-gray-300 px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Optional
                  </p>
                </div>

                {/* End Date */}
                <div>
                  <label
                    htmlFor="endDate"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    End Date
                  </label>

                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={searchData.endDate}
                    onChange={handleChange}
                    className="h-[38px] w-full rounded-[4px] border border-gray-300 px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Optional
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------
              Footer
          -------------------------------------------------- */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-4 py-4">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

ProductSerialSearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
}

export default ProductSerialSearch