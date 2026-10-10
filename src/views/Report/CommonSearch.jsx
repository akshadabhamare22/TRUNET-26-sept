// import React, { useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
// import Select from 'react-select'
// import { X, RotateCcw, Search } from 'lucide-react'

// import axiosInstance from '../../axiosInstance'

// const CommonSearch = ({
//   visible,
//   onClose,
//   onSearch,
//   centers,
//   products,
// }) => {
//   const [searchData, setSearchData] = useState({
//     product: '',
//     center: '',
//     reseller: '',
//     startDate: '',
//     endDate: '',
//   })

//   const [resellers, setResellers] = useState([])
//   const [loadingResellers, setLoadingResellers] = useState(false)

//   const [resellerCenters, setResellerCenters] = useState([])
//   const [loadingCenters, setLoadingCenters] = useState(false)

//   // =========================
//   // Fetch Resellers
//   // =========================
//   useEffect(() => {
//     const fetchResellers = async () => {
//       setLoadingResellers(true)

//       try {
//         const response = await axiosInstance.get('/resellers')

//         if (response.data.success) {
//           setResellers(response.data.data || [])
//         }
//       } catch (error) {
//         console.error(
//           'Error fetching resellers:',
//           error,
//         )

//         setResellers([])
//       } finally {
//         setLoadingResellers(false)
//       }
//     }

//     fetchResellers()
//   }, [])

//   // =========================
//   // Fetch Centers By Reseller
//   // =========================
//   useEffect(() => {
//     const fetchCentersByReseller = async () => {
//       if (searchData.reseller) {
//         setLoadingCenters(true)

//         try {
//           const response = await axiosInstance.get(
//             `/centers/reseller/${searchData.reseller}`,
//           )

//           if (response.data.success) {
//             setResellerCenters(
//               response.data.data,
//             )
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

//         // Clear center when reseller is cleared
//         setSearchData((prev) => ({
//           ...prev,
//           center: '',
//         }))
//       }
//     }

//     fetchCentersByReseller()
//   }, [searchData.reseller])

//   // =========================
//   // Reset When Modal Closes
//   // =========================
//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         product: '',
//         center: '',
//         reseller: '',
//         startDate: '',
//         endDate: '',
//       })

//       setResellerCenters([])
//     }
//   }, [visible])

//   // =========================
//   // Input Change
//   // =========================
//   const handleChange = (e) => {
//     const { name, value } = e.target

//     setSearchData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   // =========================
//   // Search
//   // =========================
//   const handleSearch = () => {
//     let formattedStartDate =
//       searchData.startDate

//     let formattedEndDate =
//       searchData.endDate

//     // Convert DD-MM-YYYY to YYYY-MM-DD
//     if (
//       formattedStartDate &&
//       formattedStartDate.includes('-')
//     ) {
//       const parts = formattedStartDate.split('-')

//       if (parts[0].length === 4) {
//         formattedStartDate = formattedStartDate
//       } else if (parts[2].length === 4) {
//         formattedStartDate = `${parts[2]}-${parts[1]}-${parts[0]}`
//       }
//     }

//     if (
//       formattedEndDate &&
//       formattedEndDate.includes('-')
//     ) {
//       const parts = formattedEndDate.split('-')

//       if (parts[0].length === 4) {
//         formattedEndDate = formattedEndDate
//       } else if (parts[2].length === 4) {
//         formattedEndDate = `${parts[2]}-${parts[1]}-${parts[0]}`
//       }
//     }

//     const formattedSearchData = {
//       ...searchData,
//       startDate: formattedStartDate,
//       endDate: formattedEndDate,
//       date:
//         searchData.startDate &&
//         searchData.endDate
//           ? `${formattedStartDate} to ${formattedEndDate}`
//           : '',
//     }

//     onSearch(formattedSearchData)
//     onClose()
//   }

//   // =========================
//   // Reset
//   // =========================
//   const handleReset = () => {
//     setSearchData({
//       product: '',
//       center: '',
//       reseller: '',
//       startDate: '',
//       endDate: '',
//     })

//     setResellerCenters([])

//     onSearch({
//       product: '',
//       center: '',
//       reseller: '',
//       startDate: '',
//       endDate: '',
//     })
//   }

//   if (!visible) {
//     return null
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
//       <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Search
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//             aria-label="Close"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="overflow-y-auto px-5 py-5">
//           {/* Reseller + Branch */}
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             {/* Reseller */}
//             <div>
//               <label
//                 htmlFor="reseller"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Reseller
//               </label>

//               <Select
//                 id="reseller"
//                 name="reseller"
//                 placeholder={
//                   loadingResellers
//                     ? 'Loading resellers...'
//                     : 'Select Reseller...'
//                 }
//                 value={
//                   searchData.reseller
//                     ? {
//                         value:
//                           searchData.reseller,
//                         label:
//                           resellers.find(
//                             (r) =>
//                               r._id ===
//                               searchData.reseller,
//                           )
//                             ?.businessName || '',
//                       }
//                     : null
//                 }
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     reseller: selected
//                       ? selected.value
//                       : '',
//                     center: '',
//                   }))
//                 }
//                 options={resellers.map(
//                   (reseller) => ({
//                     value: reseller._id,
//                     label:
//                       reseller.businessName,
//                   }),
//                 )}
//                 isClearable
//                 isLoading={loadingResellers}
//                 className="w-full"
//                 classNamePrefix="react-select"
//               />
//             </div>

//             {/* Branch */}
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
//                 placeholder={
//                   loadingCenters
//                     ? 'Loading branches...'
//                     : searchData.reseller
//                       ? 'Select Branch...'
//                       : 'Select a reseller first'
//                 }
//                 value={
//                   searchData.center
//                     ? {
//                         value:
//                           searchData.center,
//                         label:
//                           resellerCenters.find(
//                             (c) =>
//                               c._id ===
//                               searchData.center,
//                           )
//                             ? `${
//                                 resellerCenters.find(
//                                   (c) =>
//                                     c._id ===
//                                     searchData.center,
//                                 ).centerName
//                               } (${
//                                 resellerCenters.find(
//                                   (c) =>
//                                     c._id ===
//                                     searchData.center,
//                                 ).centerCode ||
//                                 'N/A'
//                               })`
//                             : '',
//                       }
//                     : null
//                 }
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     center: selected
//                       ? selected.value
//                       : '',
//                   }))
//                 }
//                 options={resellerCenters.map(
//                   (center) => ({
//                     value: center._id,
//                     label: `${center.centerName}`,
//                   }),
//                 )}
//                 isClearable
//                 isDisabled={
//                   !searchData.reseller ||
//                   loadingCenters
//                 }
//                 isLoading={loadingCenters}
//                 className="w-full"
//                 classNamePrefix="react-select"
//               />

//               {searchData.reseller &&
//                 !loadingCenters &&
//                 resellerCenters.length === 0 && (
//                   <small className="mt-1 block text-xs text-gray-500">
//                     No branches found for this
//                     reseller
//                   </small>
//                 )}
//             </div>
//           </div>

//           {/* Product */}
//           <div className="mt-4">
//             <label
//               htmlFor="product"
//               className="mb-1.5 block text-sm font-medium text-gray-700"
//             >
//               Product
//             </label>

//             <Select
//               id="product"
//               name="product"
//               placeholder="Search Product..."
//               value={
//                 searchData.product
//                   ? {
//                       value:
//                         searchData.product,
//                       label:
//                         products.find(
//                           (p) =>
//                             p._id ===
//                             searchData.product,
//                         )?.productTitle || '',
//                     }
//                   : null
//               }
//               onChange={(selected) =>
//                 setSearchData((prev) => ({
//                   ...prev,
//                   product: selected
//                     ? selected.value
//                     : '',
//                 }))
//               }
//               options={products.map(
//                 (product) => ({
//                   value: product._id,
//                   label:
//                     product.productTitle,
//                 }),
//               )}
//               isClearable
//               className="w-full"
//               classNamePrefix="react-select"
//             />
//           </div>

//           {/* Date Range */}
//           <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
//             {/* Start Date */}
//             <div>
//               <label
//                 htmlFor="startDate"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Start Date
//               </label>

//               <input
//                 type="date"
//                 id="startDate"
//                 name="startDate"
//                 value={searchData.startDate}
//                 onChange={handleChange}
//                 placeholder="Select start date"
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />

//               <span className="mt-1 block text-xs text-gray-500">
//                 Optional
//               </span>
//             </div>

//             {/* End Date */}
//             <div>
//               <label
//                 htmlFor="endDate"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 End Date
//               </label>

//               <input
//                 type="date"
//                 id="endDate"
//                 name="endDate"
//                 value={searchData.endDate}
//                 onChange={handleChange}
//                 placeholder="Select end date"
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />

//               <span className="mt-1 block text-xs text-gray-500">
//                 Optional
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//           >
//             <RotateCcw className="h-4 w-4" />
//             Reset
//           </button>

//           <button
//             type="button"
//             onClick={handleSearch}
//             className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//           >
//             <Search className="h-4 w-4" />
//             Search
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// CommonSearch.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
//   products: PropTypes.array.isRequired,
// }

// export default CommonSearch






import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { X } from 'lucide-react'

import axiosInstance from '../../axiosInstance'

const CommonSearch = ({
  visible,
  onClose,
  onSearch,
  centers,
  products,
}) => {
  const [searchData, setSearchData] = useState({
    product: '',
    center: '',
    reseller: '',
    startDate: '',
    endDate: '',
  })

  const [resellers, setResellers] = useState([])
  const [loadingResellers, setLoadingResellers] = useState(false)

  const [resellerCenters, setResellerCenters] = useState([])
  const [loadingCenters, setLoadingCenters] = useState(false)

  // =========================
  // Fetch Resellers
  // =========================
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

  // =========================
  // Fetch Centers By Reseller
  // =========================
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

        setSearchData((prev) => ({
          ...prev,
          center: '',
        }))
      }
    }

    fetchCentersByReseller()
  }, [searchData.reseller])

  // =========================
  // Reset When Modal Closes
  // =========================
  useEffect(() => {
    if (!visible) {
      setSearchData({
        product: '',
        center: '',
        reseller: '',
        startDate: '',
        endDate: '',
      })

      setResellerCenters([])
    }
  }, [visible])

  // =========================
  // Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // =========================
  // Search
  // =========================
  const handleSearch = () => {
    let formattedStartDate = searchData.startDate
    let formattedEndDate = searchData.endDate

    if (
      formattedStartDate &&
      formattedStartDate.includes('-')
    ) {
      const parts = formattedStartDate.split('-')

      if (parts[0].length === 4) {
        formattedStartDate = formattedStartDate
      } else if (parts[2].length === 4) {
        formattedStartDate =
          `${parts[2]}-${parts[1]}-${parts[0]}`
      }
    }

    if (
      formattedEndDate &&
      formattedEndDate.includes('-')
    ) {
      const parts = formattedEndDate.split('-')

      if (parts[0].length === 4) {
        formattedEndDate = formattedEndDate
      } else if (parts[2].length === 4) {
        formattedEndDate =
          `${parts[2]}-${parts[1]}-${parts[0]}`
      }
    }

    const formattedSearchData = {
      ...searchData,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      date:
        searchData.startDate && searchData.endDate
          ? `${formattedStartDate} to ${formattedEndDate}`
          : '',
    }

    onSearch(formattedSearchData)
    onClose()
  }

  // =========================
  // Reset
  // =========================
  const handleReset = () => {
    setSearchData({
      product: '',
      center: '',
      reseller: '',
      startDate: '',
      endDate: '',
    })

    setResellerCenters([])

    onSearch({
      product: '',
      center: '',
      reseller: '',
      startDate: '',
      endDate: '',
    })
  }

  // =========================
  // Dropdown UI Styles
  // =========================
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '40px',
      height: '40px',
      borderRadius: '6px',
      borderColor: state.isFocused
        ? '#2458a6'
        : '#d1d5db',
      boxShadow: state.isFocused
        ? '0 0 0 1px #2458a6'
        : 'none',
      '&:hover': {
        borderColor: '#2458a6',
      },
      fontSize: '14px',
    }),

    valueContainer: (base) => ({
      ...base,
      padding: '0 10px',
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: '40px',
    }),

    // Dropdown container
    menu: (base) => ({
      ...base,
      marginTop: '5px',
      zIndex: 10001,
      borderRadius: '5px',
      overflow: 'hidden',
    }),

    // Main dropdown height and scrollbar
    menuList: (base) => ({
      ...base,
      maxHeight: '300px',
      overflowY: 'auto',
      paddingTop: '4px',
      paddingBottom: '4px',
      scrollbarWidth: 'thin',
    }),

    // Dropdown appears above the modal layout
    menuPortal: (base) => ({
      ...base,
      zIndex: 10001,
    }),

    option: (base, state) => ({
      ...base,
      minHeight: '40px',
      padding: '10px 12px',
      fontSize: '14px',
      backgroundColor: state.isSelected
        ? '#dbeafe'
        : state.isFocused
          ? '#eff6ff'
          : '#ffffff',
      color: '#374151',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#dbeafe',
      },
    }),
  }

  if (!visible) {
    return null
  }

  return (
    <>
      <style>
        {`
          @keyframes commonSearchFadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes commonSearchSlideDown {
            from {
              opacity: 0;
              transform: translateY(-24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .common-search-overlay {
            animation: commonSearchFadeIn 0.2s ease-out;
          }

          .common-search-modal {
            animation: commonSearchSlideDown 0.3s ease-out;
          }

          @media (prefers-reduced-motion: reduce) {
            .common-search-overlay,
            .common-search-modal {
              animation: none;
            }
          }
        `}
      </style>

      {/* Modal Overlay */}
      <div
        className="common-search-overlay fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6 sm:pt-10"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="common-search-modal mt-2 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-visible rounded-md border border-gray-200 bg-white shadow-xl sm:mt-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-md border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Search
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-5 py-5">
            {/* Reseller + Branch */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Reseller */}
              <div>
                <label
                  htmlFor="reseller"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Reseller
                </label>

                <Select
                  id="reseller"
                  name="reseller"
                  placeholder={
                    loadingResellers
                      ? 'Loading resellers...'
                      : 'Select Reseller...'
                  }
                  value={
                    searchData.reseller
                      ? {
                          value: searchData.reseller,
                          label:
                            resellers.find(
                              (r) =>
                                r._id === searchData.reseller,
                            )?.businessName || '',
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
                  options={resellers.map((reseller) => ({
                    value: reseller._id,
                    label: reseller.businessName,
                  }))}
                  isClearable
                  isLoading={loadingResellers}
                  className="w-full"
                  classNamePrefix="react-select"
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  menuPlacement="bottom"
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
                  id="center"
                  name="center"
                  placeholder={
                    loadingCenters
                      ? 'Loading branches...'
                      : searchData.reseller
                        ? 'Select Branch...'
                        : 'Select a reseller first'
                  }
                  value={
                    searchData.center
                      ? {
                          value: searchData.center,
                          label:
                            resellerCenters.find(
                              (c) =>
                                c._id === searchData.center,
                            )
                              ? `${
                                  resellerCenters.find(
                                    (c) =>
                                      c._id === searchData.center,
                                  ).centerName
                                } (${
                                  resellerCenters.find(
                                    (c) =>
                                      c._id === searchData.center,
                                  ).centerCode || 'N/A'
                                })`
                              : '',
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
                  options={resellerCenters.map((center) => ({
                    value: center._id,
                    label: `${center.centerName}`,
                  }))}
                  isClearable
                  isDisabled={
                    !searchData.reseller || loadingCenters
                  }
                  isLoading={loadingCenters}
                  className="w-full"
                  classNamePrefix="react-select"
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  menuPlacement="bottom"
                />

                {searchData.reseller &&
                  !loadingCenters &&
                  resellerCenters.length === 0 && (
                    <small className="mt-1 block text-xs text-gray-500">
                      No branches found for this reseller
                    </small>
                  )}
              </div>
            </div>

            {/* Product */}
            <div className="mt-5">
              <label
                htmlFor="product"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Product
              </label>

              <Select
                id="product"
                name="product"
                placeholder="Search Product..."
                value={
                  searchData.product
                    ? {
                        value: searchData.product,
                        label:
                          products.find(
                            (p) =>
                              p._id === searchData.product,
                          )?.productTitle || '',
                      }
                    : null
                }
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    product: selected
                      ? selected.value
                      : '',
                  }))
                }
                options={products.map((product) => ({
                  value: product._id,
                  label: product.productTitle,
                }))}
                isClearable
                className="w-full"
                classNamePrefix="react-select"
                styles={selectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuPlacement="bottom"
              />
            </div>

            {/* Date Range */}
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  placeholder="Select start date"
                  className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#2458a6] focus:ring-2 focus:ring-blue-100"
                />

                <span className="mt-1 block text-xs text-gray-500">
                  Optional
                </span>
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
                  placeholder="Select end date"
                  className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#2458a6] focus:ring-2 focus:ring-blue-100"
                />

                <span className="mt-1 block text-xs text-gray-500">
                  Optional
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 rounded-b-md border-t border-gray-200 bg-gray-50 px-5 py-4">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md bg-gray-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="rounded-md bg-[#2458a6] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#1e4b91] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

CommonSearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
}

export default CommonSearch