// // import React, { useState, useRef, useEffect } from 'react'
// // import {
// //   ArrowUp,
// //   ArrowDown,
// //   Search,
// //   RotateCcw,
// //   FileSpreadsheet,
// //   List,
// //   X,
// // } from 'lucide-react'

// // import axiosInstance from '../../axiosInstance'
// // import Pagination from '../../utils/Pagination'
// // import { showError } from '../../utils/sweetAlerts'
// // import SearchCenterStock from './SearchCenterStock'
// // import { formatDate } from '../../utils/FormatDateTime'

// // const FilledStock = () => {
// //   const [data, setData] = useState([])
// //   const [centers, setCenters] = useState([])
// //   const [products, setProducts] = useState([])
// //   const [resellers, setResellers] = useState([])

// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState(null)

// //   const [sortConfig, setSortConfig] = useState({
// //     key: null,
// //     direction: 'ascending',
// //   })

// //   const [searchTerm, setSearchTerm] = useState('')
// //   const [searchModalVisible, setSearchModalVisible] = useState(false)

// //   const [activeSearch, setActiveSearch] = useState({
// //     product: '',
// //     center: '',
// //   })

// //   const [dropdownOpen, setDropdownOpen] = useState({})
// //   const [currentPage, setCurrentPage] = useState(1)
// //   const [totalPages, setTotalPages] = useState(1)

// //   const [serialModalVisible, setSerialModalVisible] =
// //     useState(false)

// //   const [selectedItemSerials, setSelectedItemSerials] =
// //     useState([])

// //   const [selectedItemInfo, setSelectedItemInfo] =
// //     useState(null)

// //   const dropdownRefs = useRef({})

// //   // =========================
// //   // Fetch Filled Stock
// //   // =========================
// //   const fetchData = async (
// //     searchParams = {},
// //     page = 1,
// //   ) => {
// //     try {
// //       setLoading(true)
// //       setError(null)

// //       const params = new URLSearchParams()

// //       if (searchParams.product) {
// //         params.append('product', searchParams.product)
// //       }

// //       if (searchParams.center) {
// //         params.append('center', searchParams.center)
// //       }

// //       params.append('page', page)

// //       const url = params.toString()
// //         ? `/reports/filledstock-report?${params.toString()}`
// //         : '/reports/filledstock-report'

// //       const response = await axiosInstance.get(url)

// //       if (response.data.success) {
// //         setData(response.data.data)
// //         setCurrentPage(
// //           response.data.pagination.currentPage,
// //         )
// //         setTotalPages(
// //           response.data.pagination.totalPages,
// //         )
// //       } else {
// //         const errorMessage =
// //           response.data.message ||
// //           'API returned unsuccessful response'

// //         setError(errorMessage)

// //         console.error(
// //           'Backend error:',
// //           response.data,
// //         )
// //       }
// //     } catch (err) {
// //       if (err.response) {
// //         const errorMessage =
// //           err.response.data?.message ||
// //           err.response.data?.error ||
// //           `Error ${err.response.status}: ${err.response.statusText}`

// //         setError(errorMessage)

// //         console.error(
// //           'Error response:',
// //           err.response.data,
// //         )
// //       } else if (err.request) {
// //         setError(
// //           'No response received from server. Please check your network connection.',
// //         )

// //         console.error(
// //           'Error request:',
// //           err.request,
// //         )
// //       } else {
// //         setError(
// //           err.message ||
// //             'An error occurred while fetching data',
// //         )

// //         console.error(
// //           'Error message:',
// //           err.message,
// //         )
// //       }
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // =========================
// //   // Fetch Centers
// //   // =========================
// //   const fetchCenters = async () => {
// //     try {
// //       const response =
// //         await axiosInstance.get('/centers')

// //       if (response.data.success) {
// //         setCenters(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error(
// //         'Error fetching data:',
// //         error,
// //       )
// //     }
// //   }

// //   // =========================
// //   // Fetch Products
// //   // =========================
// //   const fetchProducts = async () => {
// //     try {
// //       const response =
// //         await axiosInstance.get('/products/all')

// //       if (response.data.success) {
// //         setProducts(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error(
// //         'Error fetching data:',
// //         error,
// //       )
// //     }
// //   }

// //   // =========================
// //   // Fetch Resellers
// //   // =========================
// //   const fetchResellers = async () => {
// //     try {
// //       const response =
// //         await axiosInstance.get('/resellers')

// //       if (response.data.success) {
// //         setResellers(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error(
// //         'Error fetching resellers:',
// //         error,
// //       )
// //     }
// //   }

// //   // =========================
// //   // Initial Load
// //   // =========================
// //   useEffect(() => {
// //     fetchData()
// //     fetchCenters()
// //     fetchProducts()
// //     fetchResellers()
// //   }, [])

// //   // =========================
// //   // Pagination
// //   // =========================
// //   const handlePageChange = (page) => {
// //     if (page < 1 || page > totalPages) return

// //     fetchData(activeSearch, page)
// //   }

// //   // =========================
// //   // Sorting
// //   // =========================
// //   const handleSort = (key) => {
// //     let direction = 'ascending'

// //     if (
// //       sortConfig.key === key &&
// //       sortConfig.direction === 'ascending'
// //     ) {
// //       direction = 'descending'
// //     }

// //     setSortConfig({
// //       key,
// //       direction,
// //     })

// //     const sortedData = [...data].sort((a, b) => {
// //       let aValue = a
// //       let bValue = b

// //       if (key.includes('.')) {
// //         const keys = key.split('.')

// //         aValue = keys.reduce(
// //           (obj, k) => obj && obj[k],
// //           a,
// //         )

// //         bValue = keys.reduce(
// //           (obj, k) => obj && obj[k],
// //           b,
// //         )
// //       } else {
// //         aValue = a[key]
// //         bValue = b[key]
// //       }

// //       if (aValue < bValue) {
// //         return direction === 'ascending'
// //           ? -1
// //           : 1
// //       }

// //       if (aValue > bValue) {
// //         return direction === 'ascending'
// //           ? 1
// //           : -1
// //       }

// //       return 0
// //     })

// //     setData(sortedData)
// //   }

// //   // =========================
// //   // Sort Icon
// //   // =========================
// //   const getSortIcon = (key) => {
// //     if (sortConfig.key !== key) {
// //       return null
// //     }

// //     return sortConfig.direction === 'ascending' ? (
// //       <ArrowUp className="ml-1 inline-block h-4 w-4" />
// //     ) : (
// //       <ArrowDown className="ml-1 inline-block h-4 w-4" />
// //     )
// //   }

// //   // =========================
// //   // Search
// //   // =========================
// //   const handleSearch = (searchData) => {
// //     setActiveSearch(searchData)
// //     fetchData(searchData, 1)
// //   }

// //   // =========================
// //   // Reset Search
// //   // =========================
// //   const handleResetSearch = () => {
// //     setActiveSearch({
// //       product: '',
// //       center: '',
// //     })

// //     setSearchTerm('')

// //     fetchData({}, 1)
// //   }

// //   // =========================
// //   // Group Data
// //   // =========================
// //   const groupedData = data.map((item) => ({
// //     ...item,
// //     uniqueKey: item._id,
// //   }))

// //   // =========================
// //   // Local Search
// //   // =========================
// //   const filteredData = groupedData.filter((item) => {
// //     if (
// //       activeSearch.product ||
// //       activeSearch.center
// //     ) {
// //       return true
// //     }

// //     return Object.values(item).some((value) => {
// //       if (
// //         typeof value === 'object' &&
// //         value !== null
// //       ) {
// //         return Object.values(value).some(
// //           (nestedValue) =>
// //             nestedValue &&
// //             nestedValue
// //               .toString()
// //               .toLowerCase()
// //               .includes(searchTerm.toLowerCase()),
// //         )
// //       }

// //       return (
// //         value &&
// //         value
// //           .toString()
// //           .toLowerCase()
// //           .includes(searchTerm.toLowerCase())
// //       )
// //     })
// //   })

// //   // =========================
// //   // Close Dropdowns
// //   // =========================
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       const newDropdownState = {}
// //       let shouldUpdate = false

// //       Object.keys(dropdownRefs.current).forEach(
// //         (key) => {
// //           if (
// //             dropdownRefs.current[key] &&
// //             !dropdownRefs.current[key].contains(
// //               event.target,
// //             )
// //           ) {
// //             newDropdownState[key] = false
// //             shouldUpdate = true
// //           }
// //         },
// //       )

// //       if (shouldUpdate) {
// //         setDropdownOpen((prev) => ({
// //           ...prev,
// //           ...newDropdownState,
// //         }))
// //       }
// //     }

// //     document.addEventListener(
// //       'mousedown',
// //       handleClickOutside,
// //     )

// //     return () => {
// //       document.removeEventListener(
// //         'mousedown',
// //         handleClickOutside,
// //       )
// //     }
// //   }, [])

// //   // =========================
// //   // Show Serial Numbers
// //   // =========================
// //   const showSerialNumbers = (item) => {
// //     setSelectedItemInfo({
// //       productName: item.ProductName,
// //       customerName: item.CustomerName,
// //       centerName: item.CenterName,
// //       date: formatDate(item.CreatedAt),
// //     })

// //     setSelectedItemSerials(
// //       item.SerialNumbers || [],
// //     )

// //     setSerialModalVisible(true)
// //   }

// //   // =========================
// //   // Quantity + Serial Icon
// //   // =========================
// //   const renderQtyWithSerialInfo = (item) => {
// //     const hasSerialNumbers =
// //       item.TrackSerialNumber === 'Yes' &&
// //       item.SerialNumbers &&
// //       item.SerialNumbers.length > 0

// //     return (
// //       <div className="flex items-center gap-2">
// //         <span>{item.Quantity}</span>

// //         {hasSerialNumbers && (
// //           <button
// //             type="button"
// //             onClick={(e) => {
// //               e.stopPropagation()
// //               showSerialNumbers(item)
// //             }}
// //             className="inline-flex items-center justify-center rounded-md p-1 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
// //             title="View Serial Numbers"
// //           >
// //             <List className="h-4 w-4" />
// //           </button>
// //         )}
// //       </div>
// //     )
// //   }

// //   // =========================
// //   // Export
// //   // =========================
// //   const generateDetailExport = async () => {
// //     try {
// //       setLoading(true)

// //       const params = new URLSearchParams()

// //       if (activeSearch.product) {
// //         params.append(
// //           'product',
// //           activeSearch.product,
// //         )
// //       }

// //       if (activeSearch.center) {
// //         params.append(
// //           'center',
// //           activeSearch.center,
// //         )
// //       }

// //       params.append('export', 'true')

// //       const apiUrl = params.toString()
// //         ? `/reports/filledstock-report?${params.toString()}`
// //         : '/reports/filledstock-report'

// //       const response =
// //         await axiosInstance.get(apiUrl)

// //       if (!response.data.success) {
// //         throw new Error(
// //           'API returned unsuccessful response',
// //         )
// //       }

// //       const exportData = response.data.data

// //       if (
// //         !exportData ||
// //         exportData.length === 0
// //       ) {
// //         showError(
// //           'No data available for export',
// //         )
// //         return
// //       }

// //       // Flatten serial numbers for export
// //       const flattenedExportData =
// //         exportData.flatMap((item) => {
// //           if (
// //             item.SerialNumbers &&
// //             item.SerialNumbers.length > 0
// //           ) {
// //             return item.SerialNumbers.map(
// //               (serial) => ({
// //                 ...item,
// //                 serialNumber:
// //                   serial.serialNumber,
// //                 serialStatus: serial.status,
// //               }),
// //             )
// //           }

// //           return [
// //             {
// //               ...item,
// //               serialNumber: 'N/A',
// //               serialStatus: 'N/A',
// //             },
// //           ]
// //         })

// //       const headers = [
// //         'Date',
// //         'Center Name',
// //         'Customer Name',
// //         'Product Name',
// //         'Quantity',
// //         'Serial Number',
// //         'Shifting Date',
// //       ]

// //       const csvData =
// //         flattenedExportData.map((item) => [
// //           formatDate(item.CreatedAt),
// //           item.CenterName || '',
// //           item.CustomerName || '',
// //           item.ProductName || '',
// //           item.Quantity || '',
// //           item.serialNumber || '',
// //           formatDate(item.ShiftingDate),
// //         ])

// //       const csvContent = [
// //         headers.join(','),
// //         ...csvData.map((row) =>
// //           row
// //             .map((field) => {
// //               const stringField =
// //                 String(field || '')

// //               return `"${stringField.replace(
// //                 /"/g,
// //                 '""',
// //               )}"`
// //             })
// //             .join(','),
// //         ),
// //       ].join('\n')

// //       const blob = new Blob(
// //         ['\uFEFF' + csvContent],
// //         {
// //           type: 'text/csv;charset=utf-8;',
// //         },
// //       )

// //       const link = document.createElement('a')
// //       const downloadUrl =
// //         URL.createObjectURL(blob)

// //       link.setAttribute(
// //         'href',
// //         downloadUrl,
// //       )

// //       link.setAttribute(
// //         'download',
// //         `filled_stock_${new Date()
// //           .toISOString()
// //           .split('T')[0]}.csv`,
// //       )

// //       link.style.visibility = 'hidden'

// //       document.body.appendChild(link)
// //       link.click()
// //       document.body.removeChild(link)

// //       URL.revokeObjectURL(downloadUrl)
// //     } catch (error) {
// //       console.error(
// //         'Error generating export:',
// //         error,
// //       )

// //       showError(
// //         'Error generating export file',
// //       )
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // =========================
// //   // Loading
// //   // =========================
// //   if (loading) {
// //     return (
// //       <div className="flex min-h-[50vh] items-center justify-center">
// //         <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
// //       </div>
// //     )
// //   }

// //   // =========================
// //   // Error
// //   // =========================
// //   if (error) {
// //     return (
// //       <div
// //         className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
// //         role="alert"
// //       >
// //         {error}
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="w-full">
// //       {/* Page Title */}
// //       <div className="mb-4 text-2xl font-semibold text-gray-800">
// //         Field Stock
// //       </div>

// //       {/* Search Modal */}
// //       <SearchCenterStock
// //         visible={searchModalVisible}
// //         onClose={() =>
// //           setSearchModalVisible(false)
// //         }
// //         onSearch={handleSearch}
// //         centers={centers}
// //         products={products}
// //         resellers={resellers}
// //       />

// //       {/* Serial Numbers Modal */}
// //       {serialModalVisible && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
// //           <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
// //             {/* Modal Header */}
// //             <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
// //               <h2 className="text-lg font-semibold text-gray-800">
// //                 Serial Numbers:{' '}
// //                 {selectedItemInfo?.productName ||
// //                   'Product'}
// //               </h2>

// //               <button
// //                 type="button"
// //                 onClick={() =>
// //                   setSerialModalVisible(false)
// //                 }
// //                 className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
// //                 aria-label="Close"
// //               >
// //                 <X className="h-5 w-5" />
// //               </button>
// //             </div>

// //             {/* Modal Body */}
// //             <div className="overflow-y-auto p-5">
// //               {selectedItemSerials.length > 0 ? (
// //                 <div className="overflow-x-auto">
// //                   <table className="min-w-full border-collapse border border-gray-200 text-sm">
// //                     <thead>
// //                       <tr className="bg-gray-50">
// //                         <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
// //                           #
// //                         </th>

// //                         <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
// //                           Serial Number
// //                         </th>

// //                         <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
// //                           Assigned Date
// //                         </th>
// //                       </tr>
// //                     </thead>

// //                     <tbody>
// //                       {selectedItemSerials.map(
// //                         (serial, index) => (
// //                           <tr
// //                             key={index}
// //                             className="hover:bg-gray-50"
// //                           >
// //                             <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                               {index + 1}
// //                             </td>

// //                             <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                               {
// //                                 serial.serialNumber
// //                               }
// //                             </td>

// //                             <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                               {formatDate(
// //                                 serial.assignedDate,
// //                               )}
// //                             </td>
// //                           </tr>
// //                         ),
// //                       )}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               ) : (
// //                 <p className="py-6 text-center text-sm text-gray-500">
// //                   No serial numbers available
// //                 </p>
// //               )}
// //             </div>

// //             {/* Modal Footer */}
// //             <div className="flex justify-end border-t border-gray-200 px-5 py-4">
// //               <button
// //                 type="button"
// //                 onClick={() =>
// //                   setSerialModalVisible(false)
// //                 }
// //                 className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Main Card */}
// //       <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
// //         {/* Header */}
// //         <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
// //           <div className="flex flex-wrap items-center gap-2">
// //             {/* Search */}
// //             <button
// //               type="button"
// //               onClick={() =>
// //                 setSearchModalVisible(true)
// //               }
// //               className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
// //             >
// //               <Search className="h-4 w-4" />
// //               Search
// //             </button>

// //             {/* Reset */}
// //             {(activeSearch.product ||
// //               activeSearch.center) && (
// //               <button
// //                 type="button"
// //                 onClick={handleResetSearch}
// //                 className="inline-flex items-center gap-1.5 rounded-md bg-gray-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-700"
// //               >
// //                 <RotateCcw className="h-4 w-4" />
// //                 Reset Search
// //               </button>
// //             )}

// //             {/* Export */}
// //             <button
// //               type="button"
// //               onClick={generateDetailExport}
// //               className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700"
// //             >
// //               <FileSpreadsheet className="h-4 w-4" />
// //               Export
// //             </button>
// //           </div>

// //           {/* Pagination */}
// //           <div>
// //             <Pagination
// //               currentPage={currentPage}
// //               totalPages={totalPages}
// //               onPageChange={handlePageChange}
// //             />
// //           </div>
// //         </div>

// //         {/* Body */}
// //         <div className="p-4">
// //           {/* Search Input */}
// //           <div className="mb-4 flex justify-end">
// //             <div className="flex items-center gap-2">
// //               <label
// //                 htmlFor="filled-stock-search"
// //                 className="text-sm font-medium text-gray-700"
// //               >
// //                 Search:
// //               </label>

// //               <input
// //                 id="filled-stock-search"
// //                 type="text"
// //                 value={searchTerm}
// //                 onChange={(e) =>
// //                   setSearchTerm(e.target.value)
// //                 }
// //                 className="h-8 w-full max-w-[350px] border border-gray-300 px-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
// //               />
// //             </div>
// //           </div>

// //           {/* Table */}
// //           <div className="w-full overflow-x-auto">
// //             <table className="min-w-full border-collapse border border-gray-200 text-sm">
// //               <thead>
// //                 <tr className="bg-gray-50">
// //                   <th
// //                     scope="col"
// //                     onClick={() =>
// //                       handleSort('CreatedAt')
// //                     }
// //                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
// //                   >
// //                     Date
// //                     {getSortIcon('CreatedAt')}
// //                   </th>

// //                   <th
// //                     scope="col"
// //                     onClick={() =>
// //                       handleSort('CenterName')
// //                     }
// //                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
// //                   >
// //                     Branch
// //                     {getSortIcon('CenterName')}
// //                   </th>

// //                   <th
// //                     scope="col"
// //                     onClick={() =>
// //                       handleSort('CustomerName')
// //                     }
// //                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
// //                   >
// //                     Customer
// //                     {getSortIcon('CustomerName')}
// //                   </th>

// //                   <th
// //                     scope="col"
// //                     onClick={() =>
// //                       handleSort('ProductName')
// //                     }
// //                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
// //                   >
// //                     Product
// //                     {getSortIcon('ProductName')}
// //                   </th>

// //                   <th
// //                     scope="col"
// //                     onClick={() =>
// //                       handleSort('Quantity')
// //                     }
// //                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
// //                   >
// //                     Qty
// //                     {getSortIcon('Quantity')}
// //                   </th>

// //                   <th
// //                     scope="col"
// //                     onClick={() =>
// //                       handleSort('ShiftingDate')
// //                     }
// //                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
// //                   >
// //                     Shifting Date
// //                     {getSortIcon(
// //                       'ShiftingDate',
// //                     )}
// //                   </th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {filteredData.length > 0 ? (
// //                   filteredData.map((item) => (
// //                     <tr
// //                       key={item.uniqueKey}
// //                       className="transition hover:bg-gray-50"
// //                     >
// //                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                         {formatDate(
// //                           item.CreatedAt,
// //                         )}
// //                       </td>

// //                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                         {item.CenterName || ''}
// //                       </td>

// //                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                         {item.CustomerName}
// //                       </td>

// //                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                         {item.ProductName}
// //                       </td>

// //                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                         {renderQtyWithSerialInfo(
// //                           item,
// //                         )}
// //                       </td>

// //                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                         {formatDate(
// //                           item.ShiftingDate,
// //                         )}
// //                       </td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr>
// //                     <td
// //                       colSpan={6}
// //                       className="border border-gray-200 px-4 py-8 text-center text-sm text-gray-500"
// //                     >
// //                       No data found
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default FilledStock









// import React, { useState, useRef, useEffect } from 'react'
// import {
//   ArrowUp,
//   ArrowDown,
//   Search,
//   RotateCcw,
//   FileSpreadsheet,
//   List,
//   X,
// } from 'lucide-react'

// import axiosInstance from '../../axiosInstance'
// import Pagination from '../../utils/Pagination'
// import { showError } from '../../utils/sweetAlerts'
// import SearchCenterStock from './SearchCenterStock'
// import { formatDate } from '../../utils/FormatDateTime'

// const FilledStock = () => {
//   const [data, setData] = useState([])
//   const [centers, setCenters] = useState([])
//   const [products, setProducts] = useState([])
//   const [resellers, setResellers] = useState([])

//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   })

//   const [searchTerm, setSearchTerm] = useState('')
//   const [searchModalVisible, setSearchModalVisible] = useState(false)

//   const [activeSearch, setActiveSearch] = useState({
//     product: '',
//     center: '',
//   })

//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const [serialModalVisible, setSerialModalVisible] =
//     useState(false)

//   const [selectedItemSerials, setSelectedItemSerials] =
//     useState([])

//   const [selectedItemInfo, setSelectedItemInfo] =
//     useState(null)

//   const dropdownRefs = useRef({})

//   // =========================
//   // Fetch Filled Stock
//   // =========================
//   const fetchData = async (
//     searchParams = {},
//     page = 1,
//   ) => {
//     try {
//       setLoading(true)
//       setError(null)

//       const params = new URLSearchParams()

//       if (searchParams.product) {
//         params.append('product', searchParams.product)
//       }

//       if (searchParams.center) {
//         params.append('center', searchParams.center)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/reports/filledstock-report?${params.toString()}`
//         : '/reports/filledstock-report'

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         setData(response.data.data)
//         setCurrentPage(
//           response.data.pagination.currentPage,
//         )
//         setTotalPages(
//           response.data.pagination.totalPages,
//         )
//       } else {
//         const errorMessage =
//           response.data.message ||
//           'API returned unsuccessful response'

//         setError(errorMessage)

//         console.error(
//           'Backend error:',
//           response.data,
//         )
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage =
//           err.response.data?.message ||
//           err.response.data?.error ||
//           `Error ${err.response.status}: ${err.response.statusText}`

//         setError(errorMessage)

//         console.error(
//           'Error response:',
//           err.response.data,
//         )
//       } else if (err.request) {
//         setError(
//           'No response received from server. Please check your network connection.',
//         )

//         console.error(
//           'Error request:',
//           err.request,
//         )
//       } else {
//         setError(
//           err.message ||
//             'An error occurred while fetching data',
//         )

//         console.error(
//           'Error message:',
//           err.message,
//         )
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================
//   // Fetch Centers
//   // =========================
//   const fetchCenters = async () => {
//     try {
//       const response =
//         await axiosInstance.get('/centers')

//       if (response.data.success) {
//         setCenters(response.data.data)
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching data:',
//         error,
//       )
//     }
//   }

//   // =========================
//   // Fetch Products
//   // =========================
//   const fetchProducts = async () => {
//     try {
//       const response =
//         await axiosInstance.get('/products/all')

//       if (response.data.success) {
//         setProducts(response.data.data)
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching data:',
//         error,
//       )
//     }
//   }

//   // =========================
//   // Fetch Resellers
//   // =========================
//   const fetchResellers = async () => {
//     try {
//       const response =
//         await axiosInstance.get('/resellers')

//       if (response.data.success) {
//         setResellers(response.data.data)
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching resellers:',
//         error,
//       )
//     }
//   }

//   // =========================
//   // Initial Load
//   // =========================
//   useEffect(() => {
//     fetchData()
//     fetchCenters()
//     fetchProducts()
//     fetchResellers()
//   }, [])

//   // =========================
//   // Pagination
//   // =========================
//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return

//     fetchData(activeSearch, page)
//   }

//   // =========================
//   // Sorting
//   // =========================
//   const handleSort = (key) => {
//     let direction = 'ascending'

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction === 'ascending'
//     ) {
//       direction = 'descending'
//     }

//     setSortConfig({
//       key,
//       direction,
//     })

//     const sortedData = [...data].sort((a, b) => {
//       let aValue = a
//       let bValue = b

//       if (key.includes('.')) {
//         const keys = key.split('.')

//         aValue = keys.reduce(
//           (obj, k) => obj && obj[k],
//           a,
//         )

//         bValue = keys.reduce(
//           (obj, k) => obj && obj[k],
//           b,
//         )
//       } else {
//         aValue = a[key]
//         bValue = b[key]
//       }

//       if (aValue < bValue) {
//         return direction === 'ascending'
//           ? -1
//           : 1
//       }

//       if (aValue > bValue) {
//         return direction === 'ascending'
//           ? 1
//           : -1
//       }

//       return 0
//     })

//     setData(sortedData)
//   }

//   // =========================
//   // Sort Icon
//   // =========================
//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null
//     }

//     return sortConfig.direction === 'ascending' ? (
//       <ArrowUp className="ml-1 inline-block h-4 w-4" />
//     ) : (
//       <ArrowDown className="ml-1 inline-block h-4 w-4" />
//     )
//   }

//   // =========================
//   // Search
//   // =========================
//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData)
//     fetchData(searchData, 1)
//   }

//   // =========================
//   // Reset Search
//   // =========================
//   const handleResetSearch = () => {
//     setActiveSearch({
//       product: '',
//       center: '',
//     })

//     setSearchTerm('')

//     fetchData({}, 1)
//   }

//   // =========================
//   // Group Data
//   // =========================
//   const groupedData = data.map((item) => ({
//     ...item,
//     uniqueKey: item._id,
//   }))

//   // =========================
//   // Local Search
//   // =========================
//   const filteredData = groupedData.filter((item) => {
//     if (
//       activeSearch.product ||
//       activeSearch.center
//     ) {
//       return true
//     }

//     return Object.values(item).some((value) => {
//       if (
//         typeof value === 'object' &&
//         value !== null
//       ) {
//         return Object.values(value).some(
//           (nestedValue) =>
//             nestedValue &&
//             nestedValue
//               .toString()
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase()),
//         )
//       }

//       return (
//         value &&
//         value
//           .toString()
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       )
//     })
//   })

//   // =========================
//   // Close Dropdowns
//   // =========================
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const newDropdownState = {}
//       let shouldUpdate = false

//       Object.keys(dropdownRefs.current).forEach(
//         (key) => {
//           if (
//             dropdownRefs.current[key] &&
//             !dropdownRefs.current[key].contains(
//               event.target,
//             )
//           ) {
//             newDropdownState[key] = false
//             shouldUpdate = true
//           }
//         },
//       )

//       if (shouldUpdate) {
//         setDropdownOpen((prev) => ({
//           ...prev,
//           ...newDropdownState,
//         }))
//       }
//     }

//     document.addEventListener(
//       'mousedown',
//       handleClickOutside,
//     )

//     return () => {
//       document.removeEventListener(
//         'mousedown',
//         handleClickOutside,
//       )
//     }
//   }, [])

//   // =========================
//   // Show Serial Numbers
//   // =========================
//   const showSerialNumbers = (item) => {
//     setSelectedItemInfo({
//       productName: item.ProductName,
//       customerName: item.CustomerName,
//       centerName: item.CenterName,
//       date: formatDate(item.CreatedAt),
//     })

//     setSelectedItemSerials(
//       item.SerialNumbers || [],
//     )

//     setSerialModalVisible(true)
//   }

//   // =========================
//   // Quantity + Serial Icon
//   // =========================
//   const renderQtyWithSerialInfo = (item) => {
//     const hasSerialNumbers =
//       item.TrackSerialNumber === 'Yes' &&
//       item.SerialNumbers &&
//       item.SerialNumbers.length > 0

//     return (
//       <div className="flex items-center gap-2">
//         <span>{item.Quantity}</span>

//         {hasSerialNumbers && (
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation()
//               showSerialNumbers(item)
//             }}
//             className="inline-flex items-center justify-center rounded-md p-1 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
//             title="View Serial Numbers"
//           >
//             <List className="h-4 w-4" />
//           </button>
//         )}
//       </div>
//     )
//   }

//   // =========================
//   // Export
//   // =========================
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true)

//       const params = new URLSearchParams()

//       if (activeSearch.product) {
//         params.append(
//           'product',
//           activeSearch.product,
//         )
//       }

//       if (activeSearch.center) {
//         params.append(
//           'center',
//           activeSearch.center,
//         )
//       }

//       params.append('export', 'true')

//       const apiUrl = params.toString()
//         ? `/reports/filledstock-report?${params.toString()}`
//         : '/reports/filledstock-report'

//       const response =
//         await axiosInstance.get(apiUrl)

//       if (!response.data.success) {
//         throw new Error(
//           'API returned unsuccessful response',
//         )
//       }

//       const exportData = response.data.data

//       if (
//         !exportData ||
//         exportData.length === 0
//       ) {
//         showError(
//           'No data available for export',
//         )
//         return
//       }

//       // Flatten serial numbers for export
//       const flattenedExportData =
//         exportData.flatMap((item) => {
//           if (
//             item.SerialNumbers &&
//             item.SerialNumbers.length > 0
//           ) {
//             return item.SerialNumbers.map(
//               (serial) => ({
//                 ...item,
//                 serialNumber:
//                   serial.serialNumber,
//                 serialStatus: serial.status,
//               }),
//             )
//           }

//           return [
//             {
//               ...item,
//               serialNumber: 'N/A',
//               serialStatus: 'N/A',
//             },
//           ]
//         })

//       const headers = [
//         'Date',
//         'Center Name',
//         'Customer Name',
//         'Product Name',
//         'Quantity',
//         'Serial Number',
//         'Shifting Date',
//       ]

//       const csvData =
//         flattenedExportData.map((item) => [
//           formatDate(item.CreatedAt),
//           item.CenterName || '',
//           item.CustomerName || '',
//           item.ProductName || '',
//           item.Quantity || '',
//           item.serialNumber || '',
//           formatDate(item.ShiftingDate),
//         ])

//       const csvContent = [
//         headers.join(','),
//         ...csvData.map((row) =>
//           row
//             .map((field) => {
//               const stringField =
//                 String(field || '')

//               return `"${stringField.replace(
//                 /"/g,
//                 '""',
//               )}"`
//             })
//             .join(','),
//         ),
//       ].join('\n')

//       const blob = new Blob(
//         ['\uFEFF' + csvContent],
//         {
//           type: 'text/csv;charset=utf-8;',
//         },
//       )

//       const link = document.createElement('a')
//       const downloadUrl =
//         URL.createObjectURL(blob)

//       link.setAttribute(
//         'href',
//         downloadUrl,
//       )

//       link.setAttribute(
//         'download',
//         `filled_stock_${new Date()
//           .toISOString()
//           .split('T')[0]}.csv`,
//       )

//       link.style.visibility = 'hidden'

//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)

//       URL.revokeObjectURL(downloadUrl)
//     } catch (error) {
//       console.error(
//         'Error generating export:',
//         error,
//       )

//       showError(
//         'Error generating export file',
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================
//   // Loading
//   // =========================
//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
//       </div>
//     )
//   }

//   // =========================
//   // Error
//   // =========================
//   if (error) {
//     return (
//       <div
//         className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
//         role="alert"
//       >
//         {error}
//       </div>
//     )
//   }

//   return (
//     <div className="w-full">
//       {/* Page Title */}
//       <div className="mb-6 text-[26px] font-normal leading-8 text-[#263746]">
//         Field Stock
//       </div>

//       {/* Search Modal */}
//       <SearchCenterStock
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//         resellers={resellers}
//       />

//       {/* Serial Numbers Modal */}
//       {serialModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
//           <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border border-gray-300 bg-white shadow-xl">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Serial Numbers:{' '}
//                 {selectedItemInfo?.productName ||
//                   'Product'}
//               </h2>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setSerialModalVisible(false)
//                 }
//                 className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//                 aria-label="Close"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="overflow-y-auto p-5">
//               {selectedItemSerials.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full border-collapse border border-[#e5e7eb] text-[16px] text-[#111827]">
//                     <thead className="sticky top-0 z-10">
//                       <tr className="bg-white">
//                         <th className="border border-[#e5e7eb] bg-white px-2 py-2 text-left font-semibold text-black">
//                           #
//                         </th>

//                         <th className="border border-[#e5e7eb] bg-white px-2 py-2 text-left font-semibold text-black">
//                           Serial Number
//                         </th>

//                         <th className="border border-[#e5e7eb] bg-white px-2 py-2 text-left font-semibold text-black">
//                           Assigned Date
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {selectedItemSerials.map(
//                         (serial, index) => (
//                           <tr
//                             key={index}
//                             className="even:bg-white odd:bg-[#f1f1f1] hover:bg-gray-100"
//                           >
//                             <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
//                               {index + 1}
//                             </td>

//                             <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
//                               {
//                                 serial.serialNumber
//                               }
//                             </td>

//                             <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
//                               {formatDate(
//                                 serial.assignedDate,
//                               )}
//                             </td>
//                           </tr>
//                         ),
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <p className="py-6 text-center text-sm text-gray-500">
//                   No serial numbers available
//                 </p>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end border-t border-gray-200 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setSerialModalVisible(false)
//                 }
//                 className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Card */}
//       <div className="mt-4 overflow-hidden border border-gray-200 border-t-4 border-t-[#2857a4] bg-white">
//         {/* Header */}
//         <div className="flex flex-col gap-2 border-b border-gray-200 px-4 py-2 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             {/* Search */}
//             <button
//               type="button"
//               onClick={() =>
//                 setSearchModalVisible(true)
//               }
//               className="inline-flex items-center gap-1.5 rounded-[3px] border border-[#2857a4] bg-[#2857a4] px-2 py-[7px] text-sm font-medium leading-[18px] text-white transition hover:bg-[#214a8d]"
//             >
//               <Search className="h-4 w-4" />
//               Search
//             </button>

//             {/* Reset */}
//             {(activeSearch.product ||
//               activeSearch.center) && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex items-center gap-1.5 rounded-[3px] border border-gray-600 bg-gray-600 px-2 py-[7px] text-sm font-medium leading-[18px] text-white transition hover:bg-gray-700"
//               >
//                 <RotateCcw className="h-4 w-4" />
//                 Reset Search
//               </button>
//             )}

//             {/* Export */}
//             <button
//               type="button"
//               onClick={generateDetailExport}
//               className="inline-flex items-center gap-1.5 rounded-[3px] border border-[#2857a4] bg-[#2857a4] px-2 py-[7px] text-sm font-medium leading-[18px] text-white transition hover:bg-[#214a8d]"
//             >
//               <FileSpreadsheet className="h-4 w-4" />
//               Export
//             </button>
//           </div>

//           {/* Pagination */}
//           <div>
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </div>

//         {/* Body */}
//         <div className="p-4">
//           {/* Search Input */}
//           <div className="mb-4 flex justify-end">
//             <div className="flex items-center gap-2">
//               <label
//                 htmlFor="filled-stock-search"
//                 className="text-sm font-semibold text-gray-800"
//               >
//                 Search:
//               </label>

//               <input
//                 id="filled-stock-search"
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) =>
//                   setSearchTerm(e.target.value)
//                 }
//                 className="h-[30px] w-full max-w-[350px] border border-[#d5dbe3] bg-white px-2 text-sm outline-none transition focus:border-[#2857a4] focus:ring-1 focus:ring-[#2857a4]"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="max-h-[370px] w-full overflow-auto">
//             <table className="min-w-full border-collapse border border-[#e5e7eb] text-[16px] text-[#111827]">
//               <thead>
//                 <tr className="bg-white">
//                   <th
//                     scope="col"
//                     onClick={() =>
//                       handleSort('CreatedAt')
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black transition hover:bg-gray-50"
//                   >
//                     Date
//                     {getSortIcon('CreatedAt')}
//                   </th>

//                   <th
//                     scope="col"
//                     onClick={() =>
//                       handleSort('CenterName')
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black transition hover:bg-gray-50"
//                   >
//                     Branch
//                     {getSortIcon('CenterName')}
//                   </th>

//                   <th
//                     scope="col"
//                     onClick={() =>
//                       handleSort('CustomerName')
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black transition hover:bg-gray-50"
//                   >
//                     Customer
//                     {getSortIcon('CustomerName')}
//                   </th>

//                   <th
//                     scope="col"
//                     onClick={() =>
//                       handleSort('ProductName')
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black transition hover:bg-gray-50"
//                   >
//                     Product
//                     {getSortIcon('ProductName')}
//                   </th>

//                   <th
//                     scope="col"
//                     onClick={() =>
//                       handleSort('Quantity')
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black transition hover:bg-gray-50"
//                   >
//                     Qty
//                     {getSortIcon('Quantity')}
//                   </th>

//                   <th
//                     scope="col"
//                     onClick={() =>
//                       handleSort('ShiftingDate')
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black transition hover:bg-gray-50"
//                   >
//                     Shifting Date
//                     {getSortIcon(
//                       'ShiftingDate',
//                     )}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length > 0 ? (
//                   filteredData.map((item) => (
//                     <tr
//                       key={item.uniqueKey}
//                       className="transition even:bg-white odd:bg-[#f1f1f1] hover:bg-gray-100"
//                     >
//                       <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
//                         {formatDate(
//                           item.CreatedAt,
//                         )}
//                       </td>

//                       <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
//                         {item.CenterName || ''}
//                       </td>

//                       <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
//                         {item.CustomerName}
//                       </td>

//                       <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
//                         {item.ProductName}
//                       </td>

//                       <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
//                         {renderQtyWithSerialInfo(
//                           item,
//                         )}
//                       </td>

//                       <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
//                         {formatDate(
//                           item.ShiftingDate,
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={6}
//                       className="border border-[#e5e7eb] px-2 py-8 text-center text-sm text-gray-500"
//                     >
//                       No data found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default FilledStock










import React, { useState, useRef, useEffect } from 'react'
import {
  ArrowUp,
  ArrowDown,
  Search,
  RotateCcw,
  FileSpreadsheet,
  List,
  X,
} from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import Pagination from '../../utils/Pagination'
import { showError } from '../../utils/sweetAlerts'
import SearchCenterStock from './SearchCenterStock'
import { formatDate } from '../../utils/FormatDateTime'

const FilledStock = () => {
  const [data, setData] = useState([])
  const [centers, setCenters] = useState([])
  const [products, setProducts] = useState([])
  const [resellers, setResellers] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [searchModalVisible, setSearchModalVisible] = useState(false)

  const [activeSearch, setActiveSearch] = useState({
    product: '',
    center: '',
    resellerId: '',
    startDate: '',
    endDate: '',
  })

  const [dropdownOpen, setDropdownOpen] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [serialModalVisible, setSerialModalVisible] =
    useState(false)

  const [selectedItemSerials, setSelectedItemSerials] =
    useState([])

  const [selectedItemInfo, setSelectedItemInfo] =
    useState(null)

  const dropdownRefs = useRef({})

  // =========================
  // Fetch Filled Stock
  // =========================
  const fetchData = async (
    searchParams = {},
    page = 1,
  ) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (searchParams.product) {
        params.append('product', searchParams.product)
      }

      if (searchParams.center) {
        params.append('center', searchParams.center)
      }

      if (searchParams.resellerId) {
        params.append('resellerId', searchParams.resellerId)
      }

      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate)
      }

      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate)
      }

      params.append('page', page)

      const url = params.toString()
        ? `/reports/filledstock-report?${params.toString()}`
        : '/reports/filledstock-report'

      const response = await axiosInstance.get(url)

      if (response.data.success) {
        setData(response.data.data)
        setCurrentPage(
          response.data.pagination.currentPage,
        )
        setTotalPages(
          response.data.pagination.totalPages,
        )
      } else {
        const errorMessage =
          response.data.message ||
          'API returned unsuccessful response'

        setError(errorMessage)

        console.error(
          'Backend error:',
          response.data,
        )
      }
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Error ${err.response.status}: ${err.response.statusText}`

        setError(errorMessage)

        console.error(
          'Error response:',
          err.response.data,
        )
      } else if (err.request) {
        setError(
          'No response received from server. Please check your network connection.',
        )

        console.error(
          'Error request:',
          err.request,
        )
      } else {
        setError(
          err.message ||
            'An error occurred while fetching data',
        )

        console.error(
          'Error message:',
          err.message,
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // Fetch Centers
  // =========================
  const fetchCenters = async () => {
    try {
      const response =
        await axiosInstance.get('/centers')

      if (response.data.success) {
        setCenters(response.data.data)
      }
    } catch (error) {
      console.error(
        'Error fetching data:',
        error,
      )
    }
  }

  // =========================
  // Fetch Products
  // =========================
  const fetchProducts = async () => {
    try {
      const response =
        await axiosInstance.get('/products/all')

      if (response.data.success) {
        setProducts(response.data.data)
      }
    } catch (error) {
      console.error(
        'Error fetching data:',
        error,
      )
    }
  }

  // =========================
  // Fetch Resellers
  // =========================
  const fetchResellers = async () => {
    try {
      const response =
        await axiosInstance.get('/resellers')

      if (response.data.success) {
        setResellers(response.data.data)
      }
    } catch (error) {
      console.error(
        'Error fetching resellers:',
        error,
      )
    }
  }

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    fetchData()
    fetchCenters()
    fetchProducts()
    fetchResellers()
  }, [])

  // =========================
  // Pagination
  // =========================
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return

    fetchData(activeSearch, page)
  }

  // =========================
  // Sorting
  // =========================
  const handleSort = (key) => {
    let direction = 'ascending'

    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }

    setSortConfig({
      key,
      direction,
    })

    const sortedData = [...data].sort((a, b) => {
      let aValue = a
      let bValue = b

      if (key.includes('.')) {
        const keys = key.split('.')

        aValue = keys.reduce(
          (obj, k) => obj && obj[k],
          a,
        )

        bValue = keys.reduce(
          (obj, k) => obj && obj[k],
          b,
        )
      } else {
        aValue = a[key]
        bValue = b[key]
      }

      if (aValue < bValue) {
        return direction === 'ascending'
          ? -1
          : 1
      }

      if (aValue > bValue) {
        return direction === 'ascending'
          ? 1
          : -1
      }

      return 0
    })

    setData(sortedData)
  }

  // =========================
  // Sort Icon
  // =========================
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null
    }

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp className="ml-1 inline-block h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 inline-block h-4 w-4" />
    )
  }

  // =========================
  // Search
  // =========================
  const handleSearch = (searchData) => {
    setActiveSearch(searchData)
    fetchData(searchData, 1)
  }

  // =========================
  // Reset Search
  // =========================
  const handleResetSearch = () => {
    setActiveSearch({
      product: '',
      center: '',
      resellerId: '',
      startDate: '',
      endDate: '',
    })

    setSearchTerm('')

    fetchData({}, 1)
  }

  // =========================
  // Group Data
  // =========================
  const groupedData = data.map((item) => ({
    ...item,
    uniqueKey: item._id,
  }))

  // =========================
  // Local Search
  // =========================
  const filteredData = groupedData.filter((item) => {
    if (
      activeSearch.product ||
      activeSearch.center ||
      activeSearch.resellerId ||
      activeSearch.startDate ||
      activeSearch.endDate
    ) {
      return true
    }

    return Object.values(item).some((value) => {
      if (
        typeof value === 'object' &&
        value !== null
      ) {
        return Object.values(value).some(
          (nestedValue) =>
            nestedValue &&
            nestedValue
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        )
      }

      return (
        value &&
        value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    })
  })

  // =========================
  // Close Dropdowns
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {}
      let shouldUpdate = false

      Object.keys(dropdownRefs.current).forEach(
        (key) => {
          if (
            dropdownRefs.current[key] &&
            !dropdownRefs.current[key].contains(
              event.target,
            )
          ) {
            newDropdownState[key] = false
            shouldUpdate = true
          }
        },
      )

      if (shouldUpdate) {
        setDropdownOpen((prev) => ({
          ...prev,
          ...newDropdownState,
        }))
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  // =========================
  // Show Serial Numbers
  // =========================
  const showSerialNumbers = (item) => {
    setSelectedItemInfo({
      productName: item.ProductName,
      customerName: item.CustomerName,
      centerName: item.CenterName,
      date: formatDate(item.CreatedAt),
    })

    setSelectedItemSerials(
      item.SerialNumbers || [],
    )

    setSerialModalVisible(true)
  }

  // =========================
  // Quantity + Serial Icon
  // =========================
  const renderQtyWithSerialInfo = (item) => {
    const hasSerialNumbers =
      item.TrackSerialNumber === 'Yes' &&
      item.SerialNumbers &&
      item.SerialNumbers.length > 0

    return (
      <div className="flex items-center gap-2">
        <span>{item.Quantity}</span>

        {hasSerialNumbers && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              showSerialNumbers(item)
            }}
            className="inline-flex items-center justify-center rounded-md p-1 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
            title="View Serial Numbers"
          >
            <List className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }

  // =========================
  // Export
  // =========================
  const generateDetailExport = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()

      if (activeSearch.product) {
        params.append(
          'product',
          activeSearch.product,
        )
      }

      if (activeSearch.center) {
        params.append(
          'center',
          activeSearch.center,
        )
      }

      if (activeSearch.resellerId) {
        params.append('resellerId', activeSearch.resellerId)
      }

      if (activeSearch.startDate) {
        params.append('startDate', activeSearch.startDate)
      }

      if (activeSearch.endDate) {
        params.append('endDate', activeSearch.endDate)
      }

      params.append('export', 'true')

      const apiUrl = params.toString()
        ? `/reports/filledstock-report?${params.toString()}`
        : '/reports/filledstock-report'

      const response =
        await axiosInstance.get(apiUrl)

      if (!response.data.success) {
        throw new Error(
          'API returned unsuccessful response',
        )
      }

      const exportData = response.data.data

      if (
        !exportData ||
        exportData.length === 0
      ) {
        showError(
          'No data available for export',
        )
        return
      }

      // Flatten serial numbers for export
      const flattenedExportData =
        exportData.flatMap((item) => {
          if (
            item.SerialNumbers &&
            item.SerialNumbers.length > 0
          ) {
            return item.SerialNumbers.map(
              (serial) => ({
                ...item,
                serialNumber:
                  serial.serialNumber,
                serialStatus: serial.status,
              }),
            )
          }

          return [
            {
              ...item,
              serialNumber: 'N/A',
              serialStatus: 'N/A',
            },
          ]
        })

      const headers = [
        'Date',
        'Center Name',
        'Customer Name',
        'Product Name',
        'Quantity',
        'Serial Number',
        'Shifting Date',
      ]

      const csvData =
        flattenedExportData.map((item) => [
          formatDate(item.CreatedAt),
          item.CenterName || '',
          item.CustomerName || '',
          item.ProductName || '',
          item.Quantity || '',
          item.serialNumber || '',
          formatDate(item.ShiftingDate),
        ])

      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const stringField =
                String(field || '')

              return `"${stringField.replace(
                /"/g,
                '""',
              )}"`
            })
            .join(','),
        ),
      ].join('\n')

      const blob = new Blob(
        ['\uFEFF' + csvContent],
        {
          type: 'text/csv;charset=utf-8;',
        },
      )

      const link = document.createElement('a')
      const downloadUrl =
        URL.createObjectURL(blob)

      link.setAttribute(
        'href',
        downloadUrl,
      )

      link.setAttribute(
        'download',
        `filled_stock_${new Date()
          .toISOString()
          .split('T')[0]}.csv`,
      )

      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error(
        'Error generating export:',
        error,
      )

      showError(
        'Error generating export file',
      )
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <div
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {error}
      </div>
    )
  }

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* Page Title */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Field Stock
      </div>

      {/* Search Modal */}
      <SearchCenterStock
        visible={searchModalVisible}
        onClose={() =>
          setSearchModalVisible(false)
        }
        onSearch={handleSearch}
        centers={centers}
        products={products}
        resellers={resellers}
      />

      {/* Serial Numbers Modal */}
      {serialModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border border-gray-300 bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Serial Numbers:{' '}
                {selectedItemInfo?.productName ||
                  'Product'}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSerialModalVisible(false)
                }
                className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-5">
              {selectedItemSerials.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-[#e5e7eb] text-[16px] text-[#111827]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-white">
                        <th className="border border-[#e5e7eb] bg-white px-2 py-2 text-left font-semibold text-black">
                          #
                        </th>

                        <th className="border border-[#e5e7eb] bg-white px-2 py-2 text-left font-semibold text-black">
                          Serial Number
                        </th>

                        <th className="border border-[#e5e7eb] bg-white px-2 py-2 text-left font-semibold text-black">
                          Assigned Date
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedItemSerials.map(
                        (serial, index) => (
                          <tr
                            key={index}
                            className="even:bg-white odd:bg-[#f1f1f1] hover:bg-gray-100"
                          >
                            <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                              {index + 1}
                            </td>

                            <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                              {
                                serial.serialNumber
                              }
                            </td>

                            <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                              {formatDate(
                                serial.assignedDate,
                              )}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-gray-500">
                  No serial numbers available
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() =>
                  setSerialModalVisible(false)
                }
                className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="mt-4 overflow-hidden border border-gray-200 border-t-4 border-t-[#2857a4] bg-white">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-gray-200 px-4 py-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(true)
              }
              className="inline-flex items-center gap-1.5 rounded-[3px] border border-[#2857a4] bg-[#2857a4] px-2 py-[7px] text-sm font-medium leading-[18px] text-white transition hover:bg-[#214a8d]"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            {/* Reset */}
            {(activeSearch.product ||
              activeSearch.center ||
              activeSearch.resellerId ||
              activeSearch.startDate ||
              activeSearch.endDate) && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-1.5 rounded-[3px] border border-gray-600 bg-gray-600 px-2 py-[7px] text-sm font-medium leading-[18px] text-white transition hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Search
              </button>
            )}

            {/* Export */}
            <button
              type="button"
              onClick={generateDetailExport}
              className="inline-flex items-center gap-1.5 rounded-[3px] border border-[#2857a4] bg-[#2857a4] px-2 py-[7px] text-sm font-medium leading-[18px] text-white transition hover:bg-[#214a8d]"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export
            </button>
          </div>

          {/* Pagination */}
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Search Input */}
          <div className="mb-4 flex justify-end">
            <div className="flex items-center gap-2">
              <label
                htmlFor="filled-stock-search"
                className="text-sm font-semibold text-gray-800"
              >
                Search:
              </label>

              <input
                id="filled-stock-search"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="h-[30px] w-full max-w-[350px] border border-[#d5dbe3] bg-white px-2 text-sm outline-none transition focus:border-[#2857a4] focus:ring-1 focus:ring-[#2857a4]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="max-h-[370px] w-full overflow-auto">
            <table className="min-w-full border-collapse border border-[#e5e7eb] text-[16px] text-[#111827]">
              <thead>
                <tr className="bg-white">
                  <th
                    scope="col"
                    onClick={() =>
                      handleSort('CreatedAt')
                    }
                    className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black transition hover:bg-gray-50"
                  >
                    Date
                    {getSortIcon('CreatedAt')}
                  </th>

                  <th
                    scope="col"
                    onClick={() =>
                      handleSort('CenterName')
                    }
                    className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black transition hover:bg-gray-50"
                  >
                    Branch
                    {getSortIcon('CenterName')}
                  </th>

                  <th
                    scope="col"
                    onClick={() =>
                      handleSort('CustomerName')
                    }
                    className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black transition hover:bg-gray-50"
                  >
                    Customer
                    {getSortIcon('CustomerName')}
                  </th>

                  <th
                    scope="col"
                    onClick={() =>
                      handleSort('ProductName')
                    }
                    className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black transition hover:bg-gray-50"
                  >
                    Product
                    {getSortIcon('ProductName')}
                  </th>

                  <th
                    scope="col"
                    onClick={() =>
                      handleSort('Quantity')
                    }
                    className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black transition hover:bg-gray-50"
                  >
                    Qty
                    {getSortIcon('Quantity')}
                  </th>

                  <th
                    scope="col"
                    onClick={() =>
                      handleSort('ShiftingDate')
                    }
                    className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black transition hover:bg-gray-50"
                  >
                    Shifting Date
                    {getSortIcon(
                      'ShiftingDate',
                    )}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item.uniqueKey}
                      className="transition even:bg-white odd:bg-[#f1f1f1] hover:bg-gray-100"
                    >
                      <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                        {formatDate(
                          item.CreatedAt,
                        )}
                      </td>

                      <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                        {item.CenterName || ''}
                      </td>

                      <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                        {item.CustomerName}
                      </td>

                      <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                        {item.ProductName}
                      </td>

                      <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                        {renderQtyWithSerialInfo(
                          item,
                        )}
                      </td>

                      <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                        {formatDate(
                          item.ShiftingDate,
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="border border-[#e5e7eb] px-2 py-8 text-center text-sm text-gray-500"
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilledStock