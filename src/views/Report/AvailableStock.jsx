// import React, { useState, useRef, useEffect } from 'react'
// import {
//   ArrowUp,
//   ArrowDown,
//   Search,
//   RotateCcw,
//   FileSpreadsheet,
//   Printer,
//   X,
//   Info,
// } from 'lucide-react'

// import axiosInstance from '../../axiosInstance'
// import Pagination from '../../utils/Pagination'
// import { showError, showSuccess } from '../../utils/sweetAlerts'
// import SearchCenterStock from './SearchCenterStock'

// const AvailableStock = () => {
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

//   const [exportModalVisible, setExportModalVisible] = useState(false)
//   const [exportStartDate, setExportStartDate] = useState('')
//   const [exportEndDate, setExportEndDate] = useState('')

//   const [activeSearch, setActiveSearch] = useState({
//     product: '',
//     center: '',
//     resellerId: '',
//     startDate: '',
//     endDate: '',
//   })

//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const dropdownRefs = useRef({})

//   // =========================
//   // Fetch Available Stock
//   // =========================
//   const fetchData = async (searchParams = {}, page = 1) => {
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

//       if (searchParams.resellerId) {
//         params.append('resellerId', searchParams.resellerId)
//       }

//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate)
//       }

//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/availableStock/availableStock?${params.toString()}`
//         : '/availableStock/availableStock'

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         setData(response.data.data.stock)
//         setCurrentPage(response.data.data.pagination.currentPage)
//         setTotalPages(response.data.data.pagination.totalPages)
//       } else {
//         const errorMessage =
//           response.data.message || 'API returned unsuccessful response'

//         setError(errorMessage)
//         console.error('Backend error:', response.data)
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage =
//           err.response.data?.message ||
//           err.response.data?.error ||
//           `Error ${err.response.status}: ${err.response.statusText}`

//         setError(errorMessage)
//         console.error('Error response:', err.response.data)
//       } else if (err.request) {
//         setError(
//           'No response received from server. Please check your network connection.',
//         )
//         console.error('Error request:', err.request)
//       } else {
//         setError(err.message || 'An error occurred while fetching data')
//         console.error('Error message:', err.message)
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
//       const response = await axiosInstance.get('/centers')

//       if (response.data.success) {
//         setCenters(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error)
//     }
//   }

//   // =========================
//   // Fetch Products
//   // =========================
//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all')

//       if (response.data.success) {
//         setProducts(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error)
//     }
//   }

//   // =========================
//   // Fetch Resellers
//   // =========================
//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers')

//       if (response.data.success) {
//         setResellers(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching resellers:', error)
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
//         return direction === 'ascending' ? -1 : 1
//       }

//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1
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
//       resellerId: '',
//       startDate: '',
//       endDate: '',
//     })

//     setSearchTerm('')

//     fetchData({}, 1)
//   }

//   // =========================
//   // Export Modal
//   // =========================
//   const openExportModal = () => {
//     setExportStartDate(activeSearch.startDate || '')
//     setExportEndDate(activeSearch.endDate || '')
//     setExportModalVisible(true)
//   }

//   // =========================
//   // Generate Export
//   // =========================
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true)

//       // Validate dates
//       if (
//         exportStartDate &&
//         exportEndDate &&
//         exportStartDate > exportEndDate
//       ) {
//         showError('Start date cannot be greater than end date')
//         setLoading(false)
//         return
//       }

//       const params = new URLSearchParams()

//       // Only date filters are used for export
//       if (exportStartDate) {
//         params.append('startDate', exportStartDate)
//       }

//       if (exportEndDate) {
//         params.append('endDate', exportEndDate)
//       }

//       params.append('export', 'true')

//       const apiUrl = `/availableStock/availableStock?${params.toString()}`

//       console.log('Export API URL:', apiUrl)

//       const response = await axiosInstance.get(apiUrl, {
//         responseType: 'blob',
//       })

//       if (response.data instanceof Blob) {
//         let filename = 'available_stock_export'

//         if (exportStartDate && exportEndDate) {
//           filename += `_${exportStartDate}_to_${exportEndDate}`
//         } else if (exportStartDate) {
//           filename += `_from_${exportStartDate}`
//         } else if (exportEndDate) {
//           filename += `_until_${exportEndDate}`
//         } else {
//           filename += `_${new Date().toISOString().split('T')[0]}`
//         }

//         const contentType = response.headers['content-type']

//         if (
//           contentType ===
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         ) {
//           filename += '.xlsx'
//         } else if (contentType === 'application/vnd.ms-excel') {
//           filename += '.xls'
//         } else {
//           filename += '.xlsx'
//         }

//         const blob = new Blob([response.data], {
//           type: contentType,
//         })

//         const link = document.createElement('a')
//         const downloadUrl = URL.createObjectURL(blob)

//         link.setAttribute('href', downloadUrl)
//         link.setAttribute('download', filename)
//         link.style.visibility = 'hidden'

//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)

//         URL.revokeObjectURL(downloadUrl)

//         showSuccess('Export completed successfully!')

//         setExportModalVisible(false)
//         setExportStartDate('')
//         setExportEndDate('')
//       } else {
//         throw new Error('Unexpected response format from server')
//       }
//     } catch (error) {
//       console.error('Error generating export:', error)

//       let errorMessage = 'Error generating export file'

//       if (
//         error.response &&
//         error.response.data instanceof Blob
//       ) {
//         try {
//           const text = await error.response.data.text()
//           const parsed = JSON.parse(text)

//           errorMessage =
//             parsed.message ||
//             parsed.error ||
//             errorMessage
//         } catch (e) {
//           errorMessage =
//             error.response.statusText || errorMessage
//         }
//       } else if (error.message) {
//         errorMessage = error.message
//       }

//       showError(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================
//   // Local Search
//   // =========================
//   const filteredData = data.filter((item) => {
//     if (
//       activeSearch.product ||
//       activeSearch.center ||
//       activeSearch.resellerId ||
//       activeSearch.startDate ||
//       activeSearch.endDate
//     ) {
//       return true
//     }

//     return Object.values(item).some((value) => {
//       if (typeof value === 'object' && value !== null) {
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

//       Object.keys(dropdownRefs.current).forEach((key) => {
//         if (
//           dropdownRefs.current[key] &&
//           !dropdownRefs.current[key].contains(event.target)
//         ) {
//           newDropdownState[key] = false
//           shouldUpdate = true
//         }
//       })

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
//       <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   return (
//     <div className="w-full">
//       {/* Page Title */}
//       <div className="mb-4 text-2xl font-semibold text-gray-800">
//         Available Stock
//       </div>

//       {/* Search Modal */}
//       <SearchCenterStock
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//         resellers={resellers}
//       />

//       {/* Export Modal */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//           <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Export Stock Data
//               </h3>

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="space-y-4 px-5 py-5">
//               <div>
//                 <label
//                   htmlFor="exportStartDate"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Start Date (Optional)
//                 </label>

//                 <input
//                   type="date"
//                   id="exportStartDate"
//                   value={exportStartDate}
//                   onChange={(e) =>
//                     setExportStartDate(e.target.value)
//                   }
//                   placeholder="Select start date"
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Leave empty to include all records from
//                   beginning
//                 </p>
//               </div>

//               <div>
//                 <label
//                   htmlFor="exportEndDate"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   End Date (Optional)
//                 </label>

//                 <input
//                   type="date"
//                   id="exportEndDate"
//                   value={exportEndDate}
//                   onChange={(e) =>
//                     setExportEndDate(e.target.value)
//                   }
//                   placeholder="Select end date"
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Leave empty to include all records until
//                   today
//                 </p>
//               </div>

//               <div className="flex gap-2 rounded-md bg-blue-50 p-3 text-xs text-blue-700">
//                 <Info className="mt-0.5 h-4 w-4 shrink-0" />

//                 <span>
//                   Export will include all centers, products,
//                   and resellers within the selected date
//                   range.
//                 </span>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setExportModalVisible(false)
//                 }
//                 className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={generateDetailExport}
//                 className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//               >
//                 <FileSpreadsheet className="h-4 w-4" />
//                 Export
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Card */}
//       <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             {/* Search */}
//             <button
//               type="button"
//               onClick={() => setSearchModalVisible(true)}
//               className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
//             >
//               <Search className="h-4 w-4" />
//               Search
//             </button>

//             {/* Reset */}
//             {(activeSearch.product ||
//               activeSearch.center ||
//               activeSearch.resellerId ||
//               activeSearch.startDate ||
//               activeSearch.endDate) && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex items-center gap-1.5 rounded-md bg-gray-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-700"
//               >
//                 <RotateCcw className="h-4 w-4" />
//                 Reset Search
//               </button>
//             )}

//             {/* Export */}
//             <button
//               type="button"
//               onClick={openExportModal}
//               className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700"
//             >
//               <FileSpreadsheet className="h-4 w-4" />
//               Export
//             </button>

//             {/* Print */}
//             <button
//               type="button"
//               className="inline-flex items-center gap-1.5 rounded-md bg-gray-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800"
//             >
//               <Printer className="h-4 w-4" />
//               Print
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

//         {/* Card Body */}
//         <div className="p-4">
//           <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//             <div>
//               {(activeSearch.resellerId ||
//                 activeSearch.startDate ||
//                 activeSearch.endDate) && (
//                 <div className="text-sm text-gray-500">
//                   {activeSearch.resellerId &&
//                     `Reseller: ${
//                       resellers.find(
//                         (r) =>
//                           r._id === activeSearch.resellerId,
//                       )?.businessName ||
//                       activeSearch.resellerId
//                     } | `}

//                   {activeSearch.startDate &&
//                     `From: ${activeSearch.startDate} | `}

//                   {activeSearch.endDate &&
//                     `To: ${activeSearch.endDate}`}
//                 </div>
//               )}
//             </div>

//             {/* Local Search */}
//             <div className="flex items-center gap-2">
//               <label
//                 htmlFor="available-stock-search"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 Search:
//               </label>

//               <input
//                 id="available-stock-search"
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) =>
//                   setSearchTerm(e.target.value)
//                 }
//                 className="h-8 w-full max-w-[350px] border border-gray-300 px-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="w-full overflow-x-auto">
//             <table className="min-w-full border-collapse border border-gray-200 text-sm">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th
//                     scope="col"
//                     onClick={() => handleSort('outlet')}
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
//                   >
//                     Branch
//                     {getSortIcon('outlet')}
//                   </th>

//                   <th
//                     scope="col"
//                     onClick={() => handleSort('date')}
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
//                   >
//                     Product
//                     {getSortIcon('date')}
//                   </th>

//                   <th
//                     scope="col"
//                     onClick={() => handleSort('invoiceNo')}
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
//                   >
//                     Category
//                     {getSortIcon('invoiceNo')}
//                   </th>

//                   <th
//                     scope="col"
//                     onClick={() =>
//                       handleSort('vendor.businessName')
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
//                   >
//                     Stock
//                     {getSortIcon('vendor.businessName')}
//                   </th>

//                   <th
//                     scope="col"
//                     onClick={() =>
//                       handleSort('damagedQuantity')
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
//                   >
//                     Damage
//                     {getSortIcon('damagedQuantity')}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length > 0 ? (
//                   filteredData.map((item) => (
//                     <tr
//                       key={item._id}
//                       className="transition hover:bg-gray-50"
//                     >
//                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
//                         {item.centerName || ''}
//                       </td>

//                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
//                         {item.productName}
//                       </td>

//                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
//                         {item.productCategory?.name || ''}
//                       </td>

//                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
//                         {item.availableQuantity || 0}
//                       </td>

//                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
//                         {item.damagedQuantity || 0}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="border border-gray-200 px-4 py-8 text-center text-sm text-gray-500"
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

// export default AvailableStock





// import React, { useState, useRef, useEffect } from 'react'
// import {
//   ArrowUp,
//   ArrowDown,
//   Search,
//   RotateCcw,
//   FileSpreadsheet,
//   Printer,
//   X,
//   Info,
// } from 'lucide-react'

// import axiosInstance from '../../axiosInstance'
// import Pagination from '../../utils/Pagination'
// import { showError, showSuccess } from '../../utils/sweetAlerts'
// import SearchCenterStock from './SearchCenterStock'

// const AvailableStock = () => {
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

//   const [exportModalVisible, setExportModalVisible] = useState(false)
//   const [exportStartDate, setExportStartDate] = useState('')
//   const [exportEndDate, setExportEndDate] = useState('')

//   const [activeSearch, setActiveSearch] = useState({
//     product: '',
//     center: '',
//     resellerId: '',
//     startDate: '',
//     endDate: '',
//   })

//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const dropdownRefs = useRef({})

//   // =========================
//   // Fetch Available Stock
//   // =========================
//   const fetchData = async (searchParams = {}, page = 1) => {
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

//       if (searchParams.resellerId) {
//         params.append('resellerId', searchParams.resellerId)
//       }

//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate)
//       }

//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/availableStock/availableStock?${params.toString()}`
//         : '/availableStock/availableStock'

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         setData(response.data.data.stock)
//         setCurrentPage(response.data.data.pagination.currentPage)
//         setTotalPages(response.data.data.pagination.totalPages)
//       } else {
//         const errorMessage =
//           response.data.message || 'API returned unsuccessful response'

//         setError(errorMessage)
//         console.error('Backend error:', response.data)
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage =
//           err.response.data?.message ||
//           err.response.data?.error ||
//           `Error ${err.response.status}: ${err.response.statusText}`

//         setError(errorMessage)
//         console.error('Error response:', err.response.data)
//       } else if (err.request) {
//         setError(
//           'No response received from server. Please check your network connection.',
//         )
//         console.error('Error request:', err.request)
//       } else {
//         setError(err.message || 'An error occurred while fetching data')
//         console.error('Error message:', err.message)
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
//       const response = await axiosInstance.get('/centers')

//       if (response.data.success) {
//         setCenters(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error)
//     }
//   }

//   // =========================
//   // Fetch Products
//   // =========================
//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all')

//       if (response.data.success) {
//         setProducts(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error)
//     }
//   }

//   // =========================
//   // Fetch Resellers
//   // =========================
//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers')

//       if (response.data.success) {
//         setResellers(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching resellers:', error)
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
//         return direction === 'ascending' ? -1 : 1
//       }

//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1
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
//       resellerId: '',
//       startDate: '',
//       endDate: '',
//     })

//     setSearchTerm('')

//     fetchData({}, 1)
//   }

//   // =========================
//   // Export Modal
//   // =========================
//   const openExportModal = () => {
//     setExportStartDate(activeSearch.startDate || '')
//     setExportEndDate(activeSearch.endDate || '')
//     setExportModalVisible(true)
//   }

//   // =========================
//   // Generate Export
//   // =========================
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true)

//       // Validate dates
//       if (
//         exportStartDate &&
//         exportEndDate &&
//         exportStartDate > exportEndDate
//       ) {
//         showError('Start date cannot be greater than end date')
//         setLoading(false)
//         return
//       }

//       const params = new URLSearchParams()

//       // Only date filters are used for export
//       if (exportStartDate) {
//         params.append('startDate', exportStartDate)
//       }

//       if (exportEndDate) {
//         params.append('endDate', exportEndDate)
//       }

//       params.append('export', 'true')

//       const apiUrl = `/availableStock/availableStock?${params.toString()}`

//       console.log('Export API URL:', apiUrl)

//       const response = await axiosInstance.get(apiUrl, {
//         responseType: 'blob',
//       })

//       if (response.data instanceof Blob) {
//         let filename = 'available_stock_export'

//         if (exportStartDate && exportEndDate) {
//           filename += `_${exportStartDate}_to_${exportEndDate}`
//         } else if (exportStartDate) {
//           filename += `_from_${exportStartDate}`
//         } else if (exportEndDate) {
//           filename += `_until_${exportEndDate}`
//         } else {
//           filename += `_${new Date().toISOString().split('T')[0]}`
//         }

//         const contentType = response.headers['content-type']

//         if (
//           contentType ===
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         ) {
//           filename += '.xlsx'
//         } else if (contentType === 'application/vnd.ms-excel') {
//           filename += '.xls'
//         } else {
//           filename += '.xlsx'
//         }

//         const blob = new Blob([response.data], {
//           type: contentType,
//         })

//         const link = document.createElement('a')
//         const downloadUrl = URL.createObjectURL(blob)

//         link.setAttribute('href', downloadUrl)
//         link.setAttribute('download', filename)
//         link.style.visibility = 'hidden'

//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)

//         URL.revokeObjectURL(downloadUrl)

//         showSuccess('Export completed successfully!')

//         setExportModalVisible(false)
//         setExportStartDate('')
//         setExportEndDate('')
//       } else {
//         throw new Error('Unexpected response format from server')
//       }
//     } catch (error) {
//       console.error('Error generating export:', error)

//       let errorMessage = 'Error generating export file'

//       if (
//         error.response &&
//         error.response.data instanceof Blob
//       ) {
//         try {
//           const text = await error.response.data.text()
//           const parsed = JSON.parse(text)

//           errorMessage =
//             parsed.message ||
//             parsed.error ||
//             errorMessage
//         } catch (e) {
//           errorMessage =
//             error.response.statusText || errorMessage
//         }
//       } else if (error.message) {
//         errorMessage = error.message
//       }

//       showError(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================
//   // Local Search
//   // =========================
//   const filteredData = data.filter((item) => {
//     if (
//       activeSearch.product ||
//       activeSearch.center ||
//       activeSearch.resellerId ||
//       activeSearch.startDate ||
//       activeSearch.endDate
//     ) {
//       return true
//     }

//     return Object.values(item).some((value) => {
//       if (typeof value === 'object' && value !== null) {
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

//       Object.keys(dropdownRefs.current).forEach((key) => {
//         if (
//           dropdownRefs.current[key] &&
//           !dropdownRefs.current[key].contains(event.target)
//         ) {
//           newDropdownState[key] = false
//           shouldUpdate = true
//         }
//       })

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
//       <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
//       {/* Page Title - old frontend style */}
//       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//         Available Stock
//       </div>

//       {/* Search Modal */}
//       <SearchCenterStock
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//         resellers={resellers}
//       />

//       {/* Export Modal */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//           <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Export Stock Data
//               </h3>

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="space-y-4 px-5 py-5">
//               <div>
//                 <label
//                   htmlFor="exportStartDate"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Start Date (Optional)
//                 </label>

//                 <input
//                   type="date"
//                   id="exportStartDate"
//                   value={exportStartDate}
//                   onChange={(e) =>
//                     setExportStartDate(e.target.value)
//                   }
//                   placeholder="Select start date"
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Leave empty to include all records from
//                   beginning
//                 </p>
//               </div>

//               <div>
//                 <label
//                   htmlFor="exportEndDate"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   End Date (Optional)
//                 </label>

//                 <input
//                   type="date"
//                   id="exportEndDate"
//                   value={exportEndDate}
//                   onChange={(e) =>
//                     setExportEndDate(e.target.value)
//                   }
//                   placeholder="Select end date"
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Leave empty to include all records until
//                   today
//                 </p>
//               </div>

//               <div className="flex gap-2 rounded-md bg-blue-50 p-3 text-xs text-blue-700">
//                 <Info className="mt-0.5 h-4 w-4 shrink-0" />

//                 <span>
//                   Export will include all centers, products,
//                   and resellers within the selected date
//                   range.
//                 </span>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setExportModalVisible(false)
//                 }
//                 className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={generateDetailExport}
//                 className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//               >
//                 <FileSpreadsheet className="h-4 w-4" />
//                 Export
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Card - styled to match the old Available Stock UI */}
//       <div className="mt-0 overflow-hidden border border-[#e1e5ea] border-t-[4px] border-t-[#2f5fa7] bg-white">
//         {/* Action Toolbar */}
//         <div className="flex min-h-[51px] flex-wrap items-center gap-1 border-b border-[#d9dde3] px-3 py-2">
//           {/* Search */}
//           <button
//             type="button"
//             onClick={() => setSearchModalVisible(true)}
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <Search className="h-[16px] w-[16px]" />
//             Search
//           </button>

//           {/* Reset */}
//           {(activeSearch.product ||
//             activeSearch.center ||
//             activeSearch.resellerId ||
//             activeSearch.startDate ||
//             activeSearch.endDate) && (
//             <button
//               type="button"
//               onClick={handleResetSearch}
//               className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//             >
//               <RotateCcw className="h-[15px] w-[15px]" />
//               Reset Search
//             </button>
//           )}

//           {/* Export */}
//           <button
//             type="button"
//             onClick={openExportModal}
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <FileSpreadsheet className="h-[15px] w-[15px]" />
//             Export
//           </button>

//           {/* Print */}
//           <button
//             type="button"
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <Printer className="h-[15px] w-[15px]" />
//             Print
//           </button>
//         </div>

//         {/* Search / active-filter row */}
//         <div className="flex min-h-[62px] items-center justify-between px-4 py-3">
//           <div className="min-w-0 text-[13px] text-[#666]">
//             {(activeSearch.resellerId ||
//               activeSearch.startDate ||
//               activeSearch.endDate) && (
//               <div>
//                 {activeSearch.resellerId &&
//                   `Reseller: ${
//                     resellers.find(
//                       (r) => r._id === activeSearch.resellerId,
//                     )?.businessName || activeSearch.resellerId
//                   } | `}

//                 {activeSearch.startDate &&
//                   `From: ${activeSearch.startDate} | `}

//                 {activeSearch.endDate &&
//                   `To: ${activeSearch.endDate}`}
//               </div>
//             )}
//           </div>

//           {/* Local Search */}
//           <div className="ml-auto flex shrink-0 items-center gap-1.5">
//             <label
//               htmlFor="available-stock-search"
//               className="text-[14px] font-bold text-[#202020]"
//             >
//               Search:
//             </label>

//             <input
//               id="available-stock-search"
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="h-[30px] w-[220px] border border-[#d5dbe3] bg-white px-2 text-[13px] text-[#222] outline-none focus:border-[#2f5fa7]"
//             />
//           </div>
//         </div>

//         {/* Table - inset from the card edges to match the reference UI */}
//         <div className="px-4">
//           <div className="w-full overflow-hidden border border-[#eeeeee]">
//             <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">
//             <table className="w-full table-fixed border-collapse">
//               <colgroup>
//                 <col style={{ width: '17%' }} />
//                 <col style={{ width: '36%' }} />
//                 <col style={{ width: '30%' }} />
//                 <col style={{ width: '7%' }} />
//                 <col style={{ width: '10%' }} />
//               </colgroup>

//               <thead className="sticky top-0 z-20">
//                 <tr>
//                   <th
//                     scope="col"
//                     onClick={() => handleSort('outlet')}
//                     className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                   >
//                     <div className="flex items-center gap-1">
//                       <span>Branch</span>
//                       {getSortIcon('outlet')}
//                     </div>
//                   </th>

//                   <th
//                     scope="col"
//                     onClick={() => handleSort('date')}
//                     className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                   >
//                     <div className="flex items-center gap-1">
//                       <span>Product</span>
//                       {getSortIcon('date')}
//                     </div>
//                   </th>

//                   <th
//                     scope="col"
//                     onClick={() => handleSort('invoiceNo')}
//                     className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                   >
//                     <div className="flex items-center gap-1">
//                       <span>Category</span>
//                       {getSortIcon('invoiceNo')}
//                     </div>
//                   </th>

//                   <th
//                     scope="col"
//                     onClick={() => handleSort('vendor.businessName')}
//                     className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                   >
//                     <div className="flex items-center gap-1">
//                       <span>Stock</span>
//                       {getSortIcon('vendor.businessName')}
//                     </div>
//                   </th>

//                   <th
//                     scope="col"
//                     onClick={() => handleSort('damagedQuantity')}
//                     className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                   >
//                     <div className="flex items-center gap-1">
//                       <span>Damage</span>
//                       {getSortIcon('damagedQuantity')}
//                     </div>
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length > 0 ? (
//                   filteredData.map((item, index) => (
//                     <tr
//                       key={item._id}
//                       className={`transition ${
//                         index % 2 === 0
//                           ? 'bg-[#f1f1f1]'
//                           : 'bg-white'
//                       }`}
//                     >
//                       <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                         <div className="break-words">
//                           {item.centerName || ''}
//                         </div>
//                       </td>

//                       <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                         <div className="break-words">
//                           {item.productName}
//                         </div>
//                       </td>

//                       <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                         <div className="break-words">
//                           {item.productCategory?.name || ''}
//                         </div>
//                       </td>

//                       <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                         {item.availableQuantity || 0}
//                       </td>

//                       <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                         {item.damagedQuantity || 0}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="px-4 py-10 text-center text-sm text-gray-500"
//                     >
//                       No data found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             </div>
//           </div>
//         </div>

//         {/* Pagination - kept functional, moved to the bottom to match the old table layout */}
//         <div className="flex justify-end border-t border-[#e1e5ea] px-4 py-3">
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AvailableStock



// import React, { useState, useRef, useEffect } from 'react'
// import {
//   ArrowUp,
//   ArrowDown,
//   Search,
//   RotateCcw,
//   FileSpreadsheet,
//   Printer,
//   X,
//   Info,
// } from 'lucide-react'

// import axiosInstance from '../../axiosInstance'
// import Pagination from '../../utils/Pagination'
// import { showError, showSuccess } from '../../utils/sweetAlerts'
// import SearchCenterStock from './SearchCenterStock'

// const AvailableStock = () => {
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

//   const [exportModalVisible, setExportModalVisible] = useState(false)
//   const [exportStartDate, setExportStartDate] = useState('')
//   const [exportEndDate, setExportEndDate] = useState('')

//   const [activeSearch, setActiveSearch] = useState({
//     product: '',
//     center: '',
//     resellerId: '',
//     startDate: '',
//     endDate: '',
//   })

//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const dropdownRefs = useRef({})

//   // =========================
//   // Fetch Available Stock
//   // =========================
//   const fetchData = async (searchParams = {}, page = 1) => {
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

//       if (searchParams.resellerId) {
//         params.append('resellerId', searchParams.resellerId)
//       }

//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate)
//       }

//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/availableStock/availableStock?${params.toString()}`
//         : '/availableStock/availableStock'

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         setData(response.data.data.stock)
//         setCurrentPage(response.data.data.pagination.currentPage)
//         setTotalPages(response.data.data.pagination.totalPages)
//       } else {
//         const errorMessage =
//           response.data.message || 'API returned unsuccessful response'

//         setError(errorMessage)
//         console.error('Backend error:', response.data)
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage =
//           err.response.data?.message ||
//           err.response.data?.error ||
//           `Error ${err.response.status}: ${err.response.statusText}`

//         setError(errorMessage)
//         console.error('Error response:', err.response.data)
//       } else if (err.request) {
//         setError(
//           'No response received from server. Please check your network connection.',
//         )
//         console.error('Error request:', err.request)
//       } else {
//         setError(err.message || 'An error occurred while fetching data')
//         console.error('Error message:', err.message)
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
//       const response = await axiosInstance.get('/centers')

//       if (response.data.success) {
//         setCenters(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error)
//     }
//   }

//   // =========================
//   // Fetch Products
//   // =========================
//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all')

//       if (response.data.success) {
//         setProducts(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error)
//     }
//   }

//   // =========================
//   // Fetch Resellers
//   // =========================
//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers')

//       if (response.data.success) {
//         setResellers(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching resellers:', error)
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
//         return direction === 'ascending' ? -1 : 1
//       }

//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1
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
//       resellerId: '',
//       startDate: '',
//       endDate: '',
//     })

//     setSearchTerm('')

//     fetchData({}, 1)
//   }

//   // =========================
//   // Export Modal
//   // =========================
//   const openExportModal = () => {
//     setExportStartDate(activeSearch.startDate || '')
//     setExportEndDate(activeSearch.endDate || '')
//     setExportModalVisible(true)
//   }

//   // =========================
//   // Generate Export
//   // =========================
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true)

//       if (
//         exportStartDate &&
//         exportEndDate &&
//         exportStartDate > exportEndDate
//       ) {
//         showError('Start date cannot be greater than end date')
//         setLoading(false)
//         return
//       }

//       const params = new URLSearchParams()

//       if (exportStartDate) {
//         params.append('startDate', exportStartDate)
//       }

//       if (exportEndDate) {
//         params.append('endDate', exportEndDate)
//       }

//       params.append('export', 'true')

//       const apiUrl = `/availableStock/availableStock?${params.toString()}`

//       console.log('Export API URL:', apiUrl)

//       const response = await axiosInstance.get(apiUrl, {
//         responseType: 'blob',
//       })

//       if (response.data instanceof Blob) {
//         let filename = 'available_stock_export'

//         if (exportStartDate && exportEndDate) {
//           filename += `_${exportStartDate}_to_${exportEndDate}`
//         } else if (exportStartDate) {
//           filename += `_from_${exportStartDate}`
//         } else if (exportEndDate) {
//           filename += `_until_${exportEndDate}`
//         } else {
//           filename += `_${new Date().toISOString().split('T')[0]}`
//         }

//         const contentType = response.headers['content-type']

//         if (
//           contentType ===
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         ) {
//           filename += '.xlsx'
//         } else if (contentType === 'application/vnd.ms-excel') {
//           filename += '.xls'
//         } else {
//           filename += '.xlsx'
//         }

//         const blob = new Blob([response.data], {
//           type: contentType,
//         })

//         const link = document.createElement('a')
//         const downloadUrl = URL.createObjectURL(blob)

//         link.setAttribute('href', downloadUrl)
//         link.setAttribute('download', filename)
//         link.style.visibility = 'hidden'

//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)

//         URL.revokeObjectURL(downloadUrl)

//         showSuccess('Export completed successfully!')

//         setExportModalVisible(false)
//         setExportStartDate('')
//         setExportEndDate('')
//       } else {
//         throw new Error('Unexpected response format from server')
//       }
//     } catch (error) {
//       console.error('Error generating export:', error)

//       let errorMessage = 'Error generating export file'

//       if (
//         error.response &&
//         error.response.data instanceof Blob
//       ) {
//         try {
//           const text = await error.response.data.text()
//           const parsed = JSON.parse(text)

//           errorMessage =
//             parsed.message ||
//             parsed.error ||
//             errorMessage
//         } catch (e) {
//           errorMessage =
//             error.response.statusText || errorMessage
//         }
//       } else if (error.message) {
//         errorMessage = error.message
//       }

//       showError(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================
//   // Local Search
//   // =========================
//   const filteredData = data.filter((item) => {
//     if (
//       activeSearch.product ||
//       activeSearch.center ||
//       activeSearch.resellerId ||
//       activeSearch.startDate ||
//       activeSearch.endDate
//     ) {
//       return true
//     }

//     return Object.values(item).some((value) => {
//       if (typeof value === 'object' && value !== null) {
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

//       Object.keys(dropdownRefs.current).forEach((key) => {
//         if (
//           dropdownRefs.current[key] &&
//           !dropdownRefs.current[key].contains(event.target)
//         ) {
//           newDropdownState[key] = false
//           shouldUpdate = true
//         }
//       })

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
//       <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

//       {/* Export dropdown animation */}
//       <style>
//         {`
//           @keyframes exportStockDropDown {
//             from {
//               opacity: 0;
//               transform: translateY(-70px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           .export-stock-dropdown {
//             animation: exportStockDropDown 0.3s ease-out;
//           }
//         `}
//       </style>

//       {/* Page Title */}
//       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//         Available Stock
//       </div>

//       {/* Search Modal */}
//       <SearchCenterStock
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//         resellers={resellers}
//       />

//       {/* =====================================================
//           EXPORT STOCK DATA MODAL
//           ONLY OPENING FUNCTIONALITY CHANGED
//           ===================================================== */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-8">

//           <div className="export-stock-dropdown w-full max-w-[500px] overflow-hidden rounded-[7px] bg-white shadow-2xl">

//             {/* Modal Header */}
//             <div className="flex h-[63px] items-center justify-between border-b border-[#dee2e6] px-4">

//               <h3 className="text-[22px] font-normal text-[#343a40]">
//                 Export Stock Data
//               </h3>

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="flex h-8 w-8 items-center justify-center text-[#888] transition hover:text-[#555]"
//               >
//                 <X
//                   className="h-[25px] w-[25px]"
//                   strokeWidth={2}
//                 />
//               </button>

//             </div>

//             {/* Modal Body */}
//             <div className="px-4 py-4">

//               {/* Start Date */}
//               <div className="mb-4">

//                 <label
//                   htmlFor="exportStartDate"
//                   className="mb-2 block text-[14px] font-bold text-[#343a40]"
//                 >
//                   Start Date (Optional)
//                 </label>

//                 <input
//                   type="date"
//                   id="exportStartDate"
//                   value={exportStartDate}
//                   onChange={(e) =>
//                     setExportStartDate(e.target.value)
//                   }
//                   className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
//                 />

//                 <p className="mt-1 text-[13px] text-[#6c757d]">
//                   Leave empty to include all records from beginning
//                 </p>

//               </div>

//               {/* End Date */}
//               <div className="mb-4">

//                 <label
//                   htmlFor="exportEndDate"
//                   className="mb-2 block text-[14px] font-bold text-[#343a40]"
//                 >
//                   End Date (Optional)
//                 </label>

//                 <input
//                   type="date"
//                   id="exportEndDate"
//                   value={exportEndDate}
//                   onChange={(e) =>
//                     setExportEndDate(e.target.value)
//                   }
//                   className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
//                 />

//                 <p className="mt-1 text-[13px] text-[#6c757d]">
//                   Leave empty to include all records until today
//                 </p>

//               </div>

//               {/* Information Box */}
//               <div className="flex gap-2 rounded-[5px] bg-[#e7f3ff] px-2 py-3 text-[13px] leading-5 text-[#007bff]">

//                 <Info className="mt-[2px] h-[15px] w-[15px] shrink-0" />

//                 <span>
//                   <span className="font-medium">Note:</span>{' '}
//                   Export will include all centers, products,
//                   and resellers within the selected date range.
//                 </span>

//               </div>

//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-2 border-t border-[#dee2e6] px-4 py-3">

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="h-[38px] rounded-[5px] bg-[#6c757d] px-4 text-[14px] font-medium text-white transition hover:bg-[#5a6268]"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={generateDetailExport}
//                 className="h-[38px] rounded-[5px] bg-[#5b55d9] px-4 text-[14px] font-medium text-white transition hover:bg-[#4d47c7]"
//               >
//                 Export
//               </button>

//             </div>

//           </div>
//         </div>
//       )}

//       {/* Main Card */}
//       <div className="mt-0 overflow-hidden border border-[#e1e5ea] border-t-[4px] border-t-[#2f5fa7] bg-white">

//         {/* Action Toolbar */}
//         <div className="flex min-h-[51px] flex-wrap items-center gap-1 border-b border-[#d9dde3] px-3 py-2">

//           {/* Search */}
//           <button
//             type="button"
//             onClick={() => setSearchModalVisible(true)}
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <Search className="h-[16px] w-[16px]" />
//             Search
//           </button>

//           {/* Reset */}
//           {(activeSearch.product ||
//             activeSearch.center ||
//             activeSearch.resellerId ||
//             activeSearch.startDate ||
//             activeSearch.endDate) && (
//             <button
//               type="button"
//               onClick={handleResetSearch}
//               className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//             >
//               <RotateCcw className="h-[15px] w-[15px]" />
//               Reset Search
//             </button>
//           )}

//           {/* Export */}
//           <button
//             type="button"
//             onClick={openExportModal}
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <FileSpreadsheet className="h-[15px] w-[15px]" />
//             Export
//           </button>

//           {/* Print */}
//           <button
//             type="button"
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <Printer className="h-[15px] w-[15px]" />
//             Print
//           </button>

//         </div>

//         {/* Search / active-filter row */}
//         <div className="flex min-h-[62px] items-center justify-between px-4 py-3">

//           <div className="min-w-0 text-[13px] text-[#666]">

//             {(activeSearch.resellerId ||
//               activeSearch.startDate ||
//               activeSearch.endDate) && (
//               <div>

//                 {activeSearch.resellerId &&
//                   `Reseller: ${
//                     resellers.find(
//                       (r) => r._id === activeSearch.resellerId,
//                     )?.businessName || activeSearch.resellerId
//                   } | `}

//                 {activeSearch.startDate &&
//                   `From: ${activeSearch.startDate} | `}

//                 {activeSearch.endDate &&
//                   `To: ${activeSearch.endDate}`}

//               </div>
//             )}

//           </div>

//           {/* Local Search */}
//           <div className="ml-auto flex shrink-0 items-center gap-1.5">

//             <label
//               htmlFor="available-stock-search"
//               className="text-[14px] font-bold text-[#202020]"
//             >
//               Search:
//             </label>

//             <input
//               id="available-stock-search"
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="h-[30px] w-[220px] border border-[#d5dbe3] bg-white px-2 text-[13px] text-[#222] outline-none focus:border-[#2f5fa7]"
//             />

//           </div>

//         </div>

//         {/* Table */}
//         <div className="px-4">

//           <div className="w-full overflow-hidden border border-[#eeeeee]">

//             <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">

//               <table className="w-full table-fixed border-collapse">

//                 <colgroup>
//                   <col style={{ width: '17%' }} />
//                   <col style={{ width: '36%' }} />
//                   <col style={{ width: '30%' }} />
//                   <col style={{ width: '7%' }} />
//                   <col style={{ width: '10%' }} />
//                 </colgroup>

//                 <thead className="sticky top-0 z-20">

//                   <tr>

//                     <th
//                       scope="col"
//                       onClick={() => handleSort('outlet')}
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Branch</span>
//                         {getSortIcon('outlet')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() => handleSort('date')}
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Product</span>
//                         {getSortIcon('date')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() => handleSort('invoiceNo')}
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Category</span>
//                         {getSortIcon('invoiceNo')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort('vendor.businessName')
//                       }
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Stock</span>
//                         {getSortIcon('vendor.businessName')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort('damagedQuantity')
//                       }
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Damage</span>
//                         {getSortIcon('damagedQuantity')}
//                       </div>
//                     </th>

//                   </tr>

//                 </thead>

//                 <tbody>

//                   {filteredData.length > 0 ? (
//                     filteredData.map((item, index) => (
//                       <tr
//                         key={item._id}
//                         className={`transition ${
//                           index % 2 === 0
//                             ? 'bg-[#f1f1f1]'
//                             : 'bg-white'
//                         }`}
//                       >

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.centerName || ''}
//                           </div>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.productName}
//                           </div>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.productCategory?.name || ''}
//                           </div>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           {item.availableQuantity || 0}
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           {item.damagedQuantity || 0}
//                         </td>

//                       </tr>
//                     ))
//                   ) : (
//                     <tr>

//                       <td
//                         colSpan={5}
//                         className="px-4 py-10 text-center text-sm text-gray-500"
//                       >
//                         No data found
//                       </td>

//                     </tr>
//                   )}

//                 </tbody>

//               </table>

//             </div>
//           </div>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-end border-t border-[#e1e5ea] px-4 py-3">

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />

//         </div>

//       </div>
//     </div>
//   )
// }

// export default AvailableStock



// import React, { useState, useRef, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   ArrowUp,
//   ArrowDown,
//   Search,
//   RotateCcw,
//   FileSpreadsheet,
//   Printer,
//   X,
//   Info,
// } from 'lucide-react'

// import axiosInstance from '../../axiosInstance'
// import Pagination from '../../utils/Pagination'
// import { showError, showSuccess } from '../../utils/sweetAlerts'
// import SearchCenterStock from './SearchCenterStock'

// const AvailableStock = () => {
//   const navigate = useNavigate()

//   // Open the transfer history for this exact product and center.
//   // Keep the legacy frontend's report-filter contract: these report pages
//   // filter by product/center names, not the stock row's MongoDB IDs.
//   const handleStockClick = (item) => {
//     if (!(Number(item.availableQuantity) > 0)) return

//     const productName = item.productName || item.product?.productTitle || ''
//     const centerName = item.centerName || item.center?.centerName || ''

//     if (!productName || !centerName) {
//       showError('Unable to open transfer history: product or center name is missing.')
//       return
//     }

//     const params = new URLSearchParams({
//       product: productName,
//       center: centerName,
//       productName,
//       centerName,
//       transferType: 'given',
//     })

//     navigate(`/transfer-detail?${params.toString()}`)
//   }

//   // Use the same destination and name-based filters as the legacy frontend.
//   const handleDamageClick = (item) => {
//     if (!(Number(item.damagedQuantity) > 0)) return

//     const productName = item.productName || item.product?.productTitle || ''
//     const centerName = item.centerName || item.center?.centerName || ''

//     if (!productName || !centerName) {
//       showError('Unable to open damage history: product or center name is missing.')
//       return
//     }

//     const params = new URLSearchParams({
//       product: productName,
//       center: centerName,
//       usageType: 'Damage',
//       productName,
//       centerName,
//     })

//     navigate(`/transaction-report?${params.toString()}`)
//   }

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

//   const [exportModalVisible, setExportModalVisible] = useState(false)
//   const [exportStartDate, setExportStartDate] = useState('')
//   const [exportEndDate, setExportEndDate] = useState('')

//   const [activeSearch, setActiveSearch] = useState({
//     product: '',
//     center: '',
//     resellerId: '',
//     startDate: '',
//     endDate: '',
//   })

//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const dropdownRefs = useRef({})

//   // =========================
//   // Fetch Available Stock
//   // =========================
//   const fetchData = async (searchParams = {}, page = 1) => {
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

//       if (searchParams.resellerId) {
//         params.append('resellerId', searchParams.resellerId)
//       }

//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate)
//       }

//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/availableStock/availableStock?${params.toString()}`
//         : '/availableStock/availableStock'

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         setData(response.data.data.stock)
//         setCurrentPage(response.data.data.pagination.currentPage)
//         setTotalPages(response.data.data.pagination.totalPages)
//       } else {
//         const errorMessage =
//           response.data.message || 'API returned unsuccessful response'

//         setError(errorMessage)
//         console.error('Backend error:', response.data)
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage =
//           err.response.data?.message ||
//           err.response.data?.error ||
//           `Error ${err.response.status}: ${err.response.statusText}`

//         setError(errorMessage)
//         console.error('Error response:', err.response.data)
//       } else if (err.request) {
//         setError(
//           'No response received from server. Please check your network connection.',
//         )
//         console.error('Error request:', err.request)
//       } else {
//         setError(err.message || 'An error occurred while fetching data')
//         console.error('Error message:', err.message)
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
//       const response = await axiosInstance.get('/centers')

//       if (response.data.success) {
//         setCenters(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error)
//     }
//   }

//   // =========================
//   // Fetch Products
//   // =========================
//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all')

//       if (response.data.success) {
//         setProducts(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error)
//     }
//   }

//   // =========================
//   // Fetch Resellers
//   // =========================
//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers')

//       if (response.data.success) {
//         setResellers(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching resellers:', error)
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
//         return direction === 'ascending' ? -1 : 1
//       }

//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1
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
//       resellerId: '',
//       startDate: '',
//       endDate: '',
//     })

//     setSearchTerm('')

//     fetchData({}, 1)
//   }

//   // =========================
//   // Export Modal
//   // =========================
//   const openExportModal = () => {
//     setExportStartDate(activeSearch.startDate || '')
//     setExportEndDate(activeSearch.endDate || '')
//     setExportModalVisible(true)
//   }

//   // =========================
//   // Generate Export
//   // =========================
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true)

//       if (
//         exportStartDate &&
//         exportEndDate &&
//         exportStartDate > exportEndDate
//       ) {
//         showError('Start date cannot be greater than end date')
//         setLoading(false)
//         return
//       }

//       const params = new URLSearchParams()

//       if (exportStartDate) {
//         params.append('startDate', exportStartDate)
//       }

//       if (exportEndDate) {
//         params.append('endDate', exportEndDate)
//       }

//       params.append('export', 'true')

//       const apiUrl = `/availableStock/availableStock?${params.toString()}`

//       console.log('Export API URL:', apiUrl)

//       const response = await axiosInstance.get(apiUrl, {
//         responseType: 'blob',
//       })

//       if (response.data instanceof Blob) {
//         let filename = 'available_stock_export'

//         if (exportStartDate && exportEndDate) {
//           filename += `_${exportStartDate}_to_${exportEndDate}`
//         } else if (exportStartDate) {
//           filename += `_from_${exportStartDate}`
//         } else if (exportEndDate) {
//           filename += `_until_${exportEndDate}`
//         } else {
//           filename += `_${new Date().toISOString().split('T')[0]}`
//         }

//         const contentType = response.headers['content-type']

//         if (
//           contentType ===
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         ) {
//           filename += '.xlsx'
//         } else if (contentType === 'application/vnd.ms-excel') {
//           filename += '.xls'
//         } else {
//           filename += '.xlsx'
//         }

//         const blob = new Blob([response.data], {
//           type: contentType,
//         })

//         const link = document.createElement('a')
//         const downloadUrl = URL.createObjectURL(blob)

//         link.setAttribute('href', downloadUrl)
//         link.setAttribute('download', filename)
//         link.style.visibility = 'hidden'

//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)

//         URL.revokeObjectURL(downloadUrl)

//         showSuccess('Export completed successfully!')

//         setExportModalVisible(false)
//         setExportStartDate('')
//         setExportEndDate('')
//       } else {
//         throw new Error('Unexpected response format from server')
//       }
//     } catch (error) {
//       console.error('Error generating export:', error)

//       let errorMessage = 'Error generating export file'

//       if (
//         error.response &&
//         error.response.data instanceof Blob
//       ) {
//         try {
//           const text = await error.response.data.text()
//           const parsed = JSON.parse(text)

//           errorMessage =
//             parsed.message ||
//             parsed.error ||
//             errorMessage
//         } catch (e) {
//           errorMessage =
//             error.response.statusText || errorMessage
//         }
//       } else if (error.message) {
//         errorMessage = error.message
//       }

//       showError(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================
//   // Local Search
//   // =========================
//   const filteredData = data.filter((item) => {
//     if (
//       activeSearch.product ||
//       activeSearch.center ||
//       activeSearch.resellerId ||
//       activeSearch.startDate ||
//       activeSearch.endDate
//     ) {
//       return true
//     }

//     return Object.values(item).some((value) => {
//       if (typeof value === 'object' && value !== null) {
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

//       Object.keys(dropdownRefs.current).forEach((key) => {
//         if (
//           dropdownRefs.current[key] &&
//           !dropdownRefs.current[key].contains(event.target)
//         ) {
//           newDropdownState[key] = false
//           shouldUpdate = true
//         }
//       })

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
//       <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

//       {/* Export dropdown animation */}
//       <style>
//         {`
//           @keyframes exportStockDropDown {
//             from {
//               opacity: 0;
//               transform: translateY(-70px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           .export-stock-dropdown {
//             animation: exportStockDropDown 0.3s ease-out;
//           }
//         `}
//       </style>

//       {/* Page Title */}
//       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//         Available Stock
//       </div>

//       {/* Search Modal */}
//       <SearchCenterStock
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//         resellers={resellers}
//       />

//       {/* =====================================================
//           EXPORT STOCK DATA MODAL
//           ONLY OPENING FUNCTIONALITY CHANGED
//           ===================================================== */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-8">

//           <div className="export-stock-dropdown w-full max-w-[500px] overflow-hidden rounded-[7px] bg-white shadow-2xl">

//             {/* Modal Header */}
//             <div className="flex h-[63px] items-center justify-between border-b border-[#dee2e6] px-4">

//               <h3 className="text-[22px] font-normal text-[#343a40]">
//                 Export Stock Data
//               </h3>

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="flex h-8 w-8 items-center justify-center text-[#888] transition hover:text-[#555]"
//               >
//                 <X
//                   className="h-[25px] w-[25px]"
//                   strokeWidth={2}
//                 />
//               </button>

//             </div>

//             {/* Modal Body */}
//             <div className="px-4 py-4">

//               {/* Start Date */}
//               <div className="mb-4">

//                 <label
//                   htmlFor="exportStartDate"
//                   className="mb-2 block text-[14px] font-bold text-[#343a40]"
//                 >
//                   Start Date (Optional)
//                 </label>

//                 <input
//                   type="date"
//                   id="exportStartDate"
//                   value={exportStartDate}
//                   onChange={(e) =>
//                     setExportStartDate(e.target.value)
//                   }
//                   className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
//                 />

//                 <p className="mt-1 text-[13px] text-[#6c757d]">
//                   Leave empty to include all records from beginning
//                 </p>

//               </div>

//               {/* End Date */}
//               <div className="mb-4">

//                 <label
//                   htmlFor="exportEndDate"
//                   className="mb-2 block text-[14px] font-bold text-[#343a40]"
//                 >
//                   End Date (Optional)
//                 </label>

//                 <input
//                   type="date"
//                   id="exportEndDate"
//                   value={exportEndDate}
//                   onChange={(e) =>
//                     setExportEndDate(e.target.value)
//                   }
//                   className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
//                 />

//                 <p className="mt-1 text-[13px] text-[#6c757d]">
//                   Leave empty to include all records until today
//                 </p>

//               </div>

//               {/* Information Box */}
//               <div className="flex gap-2 rounded-[5px] bg-[#e7f3ff] px-2 py-3 text-[13px] leading-5 text-[#007bff]">

//                 <Info className="mt-[2px] h-[15px] w-[15px] shrink-0" />

//                 <span>
//                   <span className="font-medium">Note:</span>{' '}
//                   Export will include all centers, products,
//                   and resellers within the selected date range.
//                 </span>

//               </div>

//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-2 border-t border-[#dee2e6] px-4 py-3">

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="h-[38px] rounded-[5px] bg-[#6c757d] px-4 text-[14px] font-medium text-white transition hover:bg-[#5a6268]"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={generateDetailExport}
//                 className="h-[38px] rounded-[5px] bg-[#5b55d9] px-4 text-[14px] font-medium text-white transition hover:bg-[#4d47c7]"
//               >
//                 Export
//               </button>

//             </div>

//           </div>
//         </div>
//       )}

//       {/* Main Card */}
//       <div className="mt-0 overflow-hidden border border-[#e1e5ea] border-t-[4px] border-t-[#2f5fa7] bg-white">

//         {/* Action Toolbar */}
//         <div className="flex min-h-[51px] flex-wrap items-center gap-1 border-b border-[#d9dde3] px-3 py-2">

//           {/* Search */}
//           <button
//             type="button"
//             onClick={() => setSearchModalVisible(true)}
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <Search className="h-[16px] w-[16px]" />
//             Search
//           </button>

//           {/* Reset */}
//           {(activeSearch.product ||
//             activeSearch.center ||
//             activeSearch.resellerId ||
//             activeSearch.startDate ||
//             activeSearch.endDate) && (
//             <button
//               type="button"
//               onClick={handleResetSearch}
//               className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//             >
//               <RotateCcw className="h-[15px] w-[15px]" />
//               Reset Search
//             </button>
//           )}

//           {/* Export */}
//           <button
//             type="button"
//             onClick={openExportModal}
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <FileSpreadsheet className="h-[15px] w-[15px]" />
//             Export
//           </button>

//           {/* Print */}
//           <button
//             type="button"
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <Printer className="h-[15px] w-[15px]" />
//             Print
//           </button>

//         </div>

//         {/* Search / active-filter row */}
//         <div className="flex min-h-[62px] items-center justify-between px-4 py-3">

//           <div className="min-w-0 text-[13px] text-[#666]">

//             {(activeSearch.resellerId ||
//               activeSearch.startDate ||
//               activeSearch.endDate) && (
//               <div>

//                 {activeSearch.resellerId &&
//                   `Reseller: ${
//                     resellers.find(
//                       (r) => r._id === activeSearch.resellerId,
//                     )?.businessName || activeSearch.resellerId
//                   } | `}

//                 {activeSearch.startDate &&
//                   `From: ${activeSearch.startDate} | `}

//                 {activeSearch.endDate &&
//                   `To: ${activeSearch.endDate}`}

//               </div>
//             )}

//           </div>

//           {/* Local Search */}
//           <div className="ml-auto flex shrink-0 items-center gap-1.5">

//             <label
//               htmlFor="available-stock-search"
//               className="text-[14px] font-bold text-[#202020]"
//             >
//               Search:
//             </label>

//             <input
//               id="available-stock-search"
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="h-[30px] w-[220px] border border-[#d5dbe3] bg-white px-2 text-[13px] text-[#222] outline-none focus:border-[#2f5fa7]"
//             />

//           </div>

//         </div>

//         {/* Table */}
//         <div className="px-4">

//           <div className="w-full overflow-hidden border border-[#eeeeee]">

//             <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">

//               <table className="w-full table-fixed border-collapse">

//                 <colgroup>
//                   <col style={{ width: '17%' }} />
//                   <col style={{ width: '36%' }} />
//                   <col style={{ width: '30%' }} />
//                   <col style={{ width: '7%' }} />
//                   <col style={{ width: '10%' }} />
//                 </colgroup>

//                 <thead className="sticky top-0 z-20">

//                   <tr>

//                     <th
//                       scope="col"
//                       onClick={() => handleSort('outlet')}
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Branch</span>
//                         {getSortIcon('outlet')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() => handleSort('date')}
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Product</span>
//                         {getSortIcon('date')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() => handleSort('invoiceNo')}
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Category</span>
//                         {getSortIcon('invoiceNo')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort('vendor.businessName')
//                       }
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Stock</span>
//                         {getSortIcon('vendor.businessName')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort('damagedQuantity')
//                       }
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Damage</span>
//                         {getSortIcon('damagedQuantity')}
//                       </div>
//                     </th>

//                   </tr>

//                 </thead>

//                 <tbody>

//                   {filteredData.length > 0 ? (
//                     filteredData.map((item, index) => (
//                       <tr
//                         key={item._id}
//                         className={`transition ${
//                           index % 2 === 0
//                             ? 'bg-[#f1f1f1]'
//                             : 'bg-white'
//                         }`}
//                       >

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.centerName || ''}
//                           </div>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.productName}
//                           </div>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.productCategory?.name || ''}
//                           </div>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <button
//                             type="button"
//                             onClick={() => handleStockClick(item)}
//                             title="View stock transfer history"
//                             className="cursor-pointer rounded text-blue-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           >
//                             {item.availableQuantity || 0}
//                           </button>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <button
//                             type="button"
//                             onClick={() => handleDamageClick(item)}
//                             title="View damage history"
//                             className="cursor-pointer rounded text-blue-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           >
//                             {item.damagedQuantity || 0}
//                           </button>
//                         </td>

//                       </tr>
//                     ))
//                   ) : (
//                     <tr>

//                       <td
//                         colSpan={5}
//                         className="px-4 py-10 text-center text-sm text-gray-500"
//                       >
//                         No data found
//                       </td>

//                     </tr>
//                   )}

//                 </tbody>

//               </table>

//             </div>
//           </div>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-end border-t border-[#e1e5ea] px-4 py-3">

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />

//         </div>

//       </div>
//     </div>
//   )
// }

// export default AvailableStock



// import React, { useState, useRef, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   ArrowUp,
//   ArrowDown,
//   Search,
//   RotateCcw,
//   FileSpreadsheet,
//   Printer,
//   X,
//   Info,
// } from 'lucide-react'

// import axiosInstance from '../../axiosInstance'
// import Pagination from '../../utils/Pagination'
// import { showError, showSuccess } from '../../utils/sweetAlerts'
// import SearchCenterStock from './SearchCenterStock'

// const AvailableStock = () => {
//   const navigate = useNavigate()

//   // Resolve MongoDB IDs from the stock row or the loaded lookup lists.
//   const getId = (value) => {
//     if (!value) return "";
//     if (typeof value === "string") return value;
//     if (typeof value === "object") return String(value._id || value.id || "");
//     return "";
//   };

//   const getRowDetails = (item) => {
//     const centerIdFromRow = getId(item.center?._id || item.center || item.centerId);
//     const productIdFromRow = getId(item.product?._id || item.product || item.productId);

//     const centerObj =
//       centers.find((center) => String(center._id) === centerIdFromRow) ||
//       centers.find((center) => center.centerName === item.centerName);

//     const productObj =
//       products.find((product) => String(product._id) === productIdFromRow) ||
//       products.find((product) => product.productTitle === item.productName);

//     return {
//       centerId: centerIdFromRow || getId(centerObj?._id),
//       productId: productIdFromRow || getId(productObj?._id),
//       centerName: item.centerName || centerObj?.centerName || "",
//       productName: item.productName || productObj?.productTitle || "",
//       centerType: item.centerType || item.center?.centerType || centerObj?.centerType || "",
//     };
//   };

//   // Stock Qty: outlet/warehouse stock opens transfer history.
//   // Branch stock opens usage history, with a broad date range.
//   const handleStockClick = (item) => {
//     if (!(Number(item.availableQuantity) > 0)) return;

//     const details = getRowDetails(item);
//     const { centerId, productId, centerName, productName, centerType } = details;

//     if (!centerId || !productId) {
//       console.error("Missing center/product ID for Available Stock row:", item, details);
//       showError("Unable to open details: center or product ID is missing.");
//       return;
//     }

//     const isWarehouse = String(centerType).toLowerCase() === "outlet";

//     if (isWarehouse) {
//       const params = new URLSearchParams({
//         product: productId,
//         center: centerId,
//         productName,
//         centerName,
//         transferType: "given",
//       });
//       navigate(`/transfer-detail?${params.toString()}`);
//       return;
//     }

//     const today = new Date();
//     const pad = (number) => String(number).padStart(2, "0");
//     const endDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

//     const params = new URLSearchParams({
//       productId,
//       centerId,
//       productName,
//       centerName,
//       startDate: "2020-01-01",
//       endDate,
//     });
//     navigate(`/usage-detail?${params.toString()}`);
//   };

//   // Damage Qty opens Usage Details filtered to Damage records.
//   const handleDamageClick = (item) => {
//     if (!(Number(item.damagedQuantity) > 0)) return;

//     const { centerId, productId, centerName, productName } = getRowDetails(item);

//     if (!centerId || !productId) {
//       console.error("Missing center/product ID for damage history:", item);
//       showError("Unable to open damage history: center or product ID is missing.");
//       return;
//     }

//     const today = new Date();
//     const pad = (number) => String(number).padStart(2, "0");
//     const endDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

//     const params = new URLSearchParams({
//       productId,
//       centerId,
//       productName,
//       centerName,
//       usageType: "Damage",
//       startDate: "2020-01-01",
//       endDate,
//     });
//     navigate(`/usage-detail?${params.toString()}`);
//   };

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

//   const [exportModalVisible, setExportModalVisible] = useState(false)
//   const [exportStartDate, setExportStartDate] = useState('')
//   const [exportEndDate, setExportEndDate] = useState('')

//   const [activeSearch, setActiveSearch] = useState({
//     product: '',
//     center: '',
//     resellerId: '',
//     startDate: '',
//     endDate: '',
//   })

//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const dropdownRefs = useRef({})

//   // =========================
//   // Fetch Available Stock
//   // =========================
//   const fetchData = async (searchParams = {}, page = 1) => {
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

//       if (searchParams.resellerId) {
//         params.append('resellerId', searchParams.resellerId)
//       }

//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate)
//       }

//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/availableStock/availableStock?${params.toString()}`
//         : '/availableStock/availableStock'

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         setData(response.data.data.stock)
//         setCurrentPage(response.data.data.pagination.currentPage)
//         setTotalPages(response.data.data.pagination.totalPages)
//       } else {
//         const errorMessage =
//           response.data.message || 'API returned unsuccessful response'

//         setError(errorMessage)
//         console.error('Backend error:', response.data)
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage =
//           err.response.data?.message ||
//           err.response.data?.error ||
//           `Error ${err.response.status}: ${err.response.statusText}`

//         setError(errorMessage)
//         console.error('Error response:', err.response.data)
//       } else if (err.request) {
//         setError(
//           'No response received from server. Please check your network connection.',
//         )
//         console.error('Error request:', err.request)
//       } else {
//         setError(err.message || 'An error occurred while fetching data')
//         console.error('Error message:', err.message)
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
//       const response = await axiosInstance.get('/centers')

//       if (response.data.success) {
//         setCenters(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error)
//     }
//   }

//   // =========================
//   // Fetch Products
//   // =========================
//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all')

//       if (response.data.success) {
//         setProducts(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error)
//     }
//   }

//   // =========================
//   // Fetch Resellers
//   // =========================
//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers')

//       if (response.data.success) {
//         setResellers(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching resellers:', error)
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
//         return direction === 'ascending' ? -1 : 1
//       }

//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1
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
//       resellerId: '',
//       startDate: '',
//       endDate: '',
//     })

//     setSearchTerm('')

//     fetchData({}, 1)
//   }

//   // =========================
//   // Export Modal
//   // =========================
//   const openExportModal = () => {
//     setExportStartDate(activeSearch.startDate || '')
//     setExportEndDate(activeSearch.endDate || '')
//     setExportModalVisible(true)
//   }

//   // =========================
//   // Generate Export
//   // =========================
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true)

//       if (
//         exportStartDate &&
//         exportEndDate &&
//         exportStartDate > exportEndDate
//       ) {
//         showError('Start date cannot be greater than end date')
//         setLoading(false)
//         return
//       }

//       const params = new URLSearchParams()

//       if (exportStartDate) {
//         params.append('startDate', exportStartDate)
//       }

//       if (exportEndDate) {
//         params.append('endDate', exportEndDate)
//       }

//       params.append('export', 'true')

//       const apiUrl = `/availableStock/availableStock?${params.toString()}`

//       console.log('Export API URL:', apiUrl)

//       const response = await axiosInstance.get(apiUrl, {
//         responseType: 'blob',
//       })

//       if (response.data instanceof Blob) {
//         let filename = 'available_stock_export'

//         if (exportStartDate && exportEndDate) {
//           filename += `_${exportStartDate}_to_${exportEndDate}`
//         } else if (exportStartDate) {
//           filename += `_from_${exportStartDate}`
//         } else if (exportEndDate) {
//           filename += `_until_${exportEndDate}`
//         } else {
//           filename += `_${new Date().toISOString().split('T')[0]}`
//         }

//         const contentType = response.headers['content-type']

//         if (
//           contentType ===
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         ) {
//           filename += '.xlsx'
//         } else if (contentType === 'application/vnd.ms-excel') {
//           filename += '.xls'
//         } else {
//           filename += '.xlsx'
//         }

//         const blob = new Blob([response.data], {
//           type: contentType,
//         })

//         const link = document.createElement('a')
//         const downloadUrl = URL.createObjectURL(blob)

//         link.setAttribute('href', downloadUrl)
//         link.setAttribute('download', filename)
//         link.style.visibility = 'hidden'

//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)

//         URL.revokeObjectURL(downloadUrl)

//         showSuccess('Export completed successfully!')

//         setExportModalVisible(false)
//         setExportStartDate('')
//         setExportEndDate('')
//       } else {
//         throw new Error('Unexpected response format from server')
//       }
//     } catch (error) {
//       console.error('Error generating export:', error)

//       let errorMessage = 'Error generating export file'

//       if (
//         error.response &&
//         error.response.data instanceof Blob
//       ) {
//         try {
//           const text = await error.response.data.text()
//           const parsed = JSON.parse(text)

//           errorMessage =
//             parsed.message ||
//             parsed.error ||
//             errorMessage
//         } catch (e) {
//           errorMessage =
//             error.response.statusText || errorMessage
//         }
//       } else if (error.message) {
//         errorMessage = error.message
//       }

//       showError(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================
//   // Local Search
//   // =========================
//   const filteredData = data.filter((item) => {
//     if (
//       activeSearch.product ||
//       activeSearch.center ||
//       activeSearch.resellerId ||
//       activeSearch.startDate ||
//       activeSearch.endDate
//     ) {
//       return true
//     }

//     return Object.values(item).some((value) => {
//       if (typeof value === 'object' && value !== null) {
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

//       Object.keys(dropdownRefs.current).forEach((key) => {
//         if (
//           dropdownRefs.current[key] &&
//           !dropdownRefs.current[key].contains(event.target)
//         ) {
//           newDropdownState[key] = false
//           shouldUpdate = true
//         }
//       })

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
//       <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

//       {/* Export dropdown animation */}
//       <style>
//         {`
//           @keyframes exportStockDropDown {
//             from {
//               opacity: 0;
//               transform: translateY(-70px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           .export-stock-dropdown {
//             animation: exportStockDropDown 0.3s ease-out;
//           }
//         `}
//       </style>

//       {/* Page Title */}
//       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//         Available Stock
//       </div>

//       {/* Search Modal */}
//       <SearchCenterStock
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//         resellers={resellers}
//       />

//       {/* =====================================================
//           EXPORT STOCK DATA MODAL
//           ONLY OPENING FUNCTIONALITY CHANGED
//           ===================================================== */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-8">

//           <div className="export-stock-dropdown w-full max-w-[500px] overflow-hidden rounded-[7px] bg-white shadow-2xl">

//             {/* Modal Header */}
//             <div className="flex h-[63px] items-center justify-between border-b border-[#dee2e6] px-4">

//               <h3 className="text-[22px] font-normal text-[#343a40]">
//                 Export Stock Data
//               </h3>

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="flex h-8 w-8 items-center justify-center text-[#888] transition hover:text-[#555]"
//               >
//                 <X
//                   className="h-[25px] w-[25px]"
//                   strokeWidth={2}
//                 />
//               </button>

//             </div>

//             {/* Modal Body */}
//             <div className="px-4 py-4">

//               {/* Start Date */}
//               <div className="mb-4">

//                 <label
//                   htmlFor="exportStartDate"
//                   className="mb-2 block text-[14px] font-bold text-[#343a40]"
//                 >
//                   Start Date (Optional)
//                 </label>

//                 <input
//                   type="date"
//                   id="exportStartDate"
//                   value={exportStartDate}
//                   onChange={(e) =>
//                     setExportStartDate(e.target.value)
//                   }
//                   className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
//                 />

//                 <p className="mt-1 text-[13px] text-[#6c757d]">
//                   Leave empty to include all records from beginning
//                 </p>

//               </div>

//               {/* End Date */}
//               <div className="mb-4">

//                 <label
//                   htmlFor="exportEndDate"
//                   className="mb-2 block text-[14px] font-bold text-[#343a40]"
//                 >
//                   End Date (Optional)
//                 </label>

//                 <input
//                   type="date"
//                   id="exportEndDate"
//                   value={exportEndDate}
//                   onChange={(e) =>
//                     setExportEndDate(e.target.value)
//                   }
//                   className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
//                 />

//                 <p className="mt-1 text-[13px] text-[#6c757d]">
//                   Leave empty to include all records until today
//                 </p>

//               </div>

//               {/* Information Box */}
//               <div className="flex gap-2 rounded-[5px] bg-[#e7f3ff] px-2 py-3 text-[13px] leading-5 text-[#007bff]">

//                 <Info className="mt-[2px] h-[15px] w-[15px] shrink-0" />

//                 <span>
//                   <span className="font-medium">Note:</span>{' '}
//                   Export will include all centers, products,
//                   and resellers within the selected date range.
//                 </span>

//               </div>

//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-2 border-t border-[#dee2e6] px-4 py-3">

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="h-[38px] rounded-[5px] bg-[#6c757d] px-4 text-[14px] font-medium text-white transition hover:bg-[#5a6268]"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={generateDetailExport}
//                 className="h-[38px] rounded-[5px] bg-[#5b55d9] px-4 text-[14px] font-medium text-white transition hover:bg-[#4d47c7]"
//               >
//                 Export
//               </button>

//             </div>

//           </div>
//         </div>
//       )}

//       {/* Main Card */}
//       <div className="mt-0 overflow-hidden border border-[#e1e5ea] border-t-[4px] border-t-[#2f5fa7] bg-white">

//         {/* Action Toolbar */}
//         <div className="flex min-h-[51px] flex-wrap items-center gap-1 border-b border-[#d9dde3] px-3 py-2">

//           {/* Search */}
//           <button
//             type="button"
//             onClick={() => setSearchModalVisible(true)}
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <Search className="h-[16px] w-[16px]" />
//             Search
//           </button>

//           {/* Reset */}
//           {(activeSearch.product ||
//             activeSearch.center ||
//             activeSearch.resellerId ||
//             activeSearch.startDate ||
//             activeSearch.endDate) && (
//             <button
//               type="button"
//               onClick={handleResetSearch}
//               className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//             >
//               <RotateCcw className="h-[15px] w-[15px]" />
//               Reset Search
//             </button>
//           )}

//           {/* Export */}
//           <button
//             type="button"
//             onClick={openExportModal}
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <FileSpreadsheet className="h-[15px] w-[15px]" />
//             Export
//           </button>

//           {/* Print */}
//           <button
//             type="button"
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <Printer className="h-[15px] w-[15px]" />
//             Print
//           </button>

//         </div>

//         {/* Search / active-filter row */}
//         <div className="flex min-h-[62px] items-center justify-between px-4 py-3">

//           <div className="min-w-0 text-[13px] text-[#666]">

//             {(activeSearch.resellerId ||
//               activeSearch.startDate ||
//               activeSearch.endDate) && (
//               <div>

//                 {activeSearch.resellerId &&
//                   `Reseller: ${
//                     resellers.find(
//                       (r) => r._id === activeSearch.resellerId,
//                     )?.businessName || activeSearch.resellerId
//                   } | `}

//                 {activeSearch.startDate &&
//                   `From: ${activeSearch.startDate} | `}

//                 {activeSearch.endDate &&
//                   `To: ${activeSearch.endDate}`}

//               </div>
//             )}

//           </div>

//           {/* Local Search */}
//           <div className="ml-auto flex shrink-0 items-center gap-1.5">

//             <label
//               htmlFor="available-stock-search"
//               className="text-[14px] font-bold text-[#202020]"
//             >
//               Search:
//             </label>

//             <input
//               id="available-stock-search"
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="h-[30px] w-[220px] border border-[#d5dbe3] bg-white px-2 text-[13px] text-[#222] outline-none focus:border-[#2f5fa7]"
//             />

//           </div>

//         </div>

//         {/* Table */}
//         <div className="px-4">

//           <div className="w-full overflow-hidden border border-[#eeeeee]">

//             <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">

//               <table className="w-full table-fixed border-collapse">

//                 <colgroup>
//                   <col style={{ width: '17%' }} />
//                   <col style={{ width: '36%' }} />
//                   <col style={{ width: '30%' }} />
//                   <col style={{ width: '7%' }} />
//                   <col style={{ width: '10%' }} />
//                 </colgroup>

//                 <thead className="sticky top-0 z-20">

//                   <tr>

//                     <th
//                       scope="col"
//                       onClick={() => handleSort('outlet')}
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Branch</span>
//                         {getSortIcon('outlet')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() => handleSort('date')}
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Product</span>
//                         {getSortIcon('date')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() => handleSort('invoiceNo')}
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Category</span>
//                         {getSortIcon('invoiceNo')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort('vendor.businessName')
//                       }
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Stock</span>
//                         {getSortIcon('vendor.businessName')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort('damagedQuantity')
//                       }
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Damage</span>
//                         {getSortIcon('damagedQuantity')}
//                       </div>
//                     </th>

//                   </tr>

//                 </thead>

//                 <tbody>

//                   {filteredData.length > 0 ? (
//                     filteredData.map((item, index) => (
//                       <tr
//                         key={item._id}
//                         className={`transition ${
//                           index % 2 === 0
//                             ? 'bg-[#f1f1f1]'
//                             : 'bg-white'
//                         }`}
//                       >

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.centerName || ''}
//                           </div>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.productName}
//                           </div>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.productCategory?.name || ''}
//                           </div>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <button
//                             type="button"
//                             onClick={() => handleStockClick(item)}
//                             title="View stock transfer history"
//                             className="cursor-pointer rounded text-blue-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           >
//                             {item.availableQuantity || 0}
//                           </button>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <button
//                             type="button"
//                             onClick={() => handleDamageClick(item)}
//                             title="View damage history"
//                             className="cursor-pointer rounded text-blue-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           >
//                             {item.damagedQuantity || 0}
//                           </button>
//                         </td>

//                       </tr>
//                     ))
//                   ) : (
//                     <tr>

//                       <td
//                         colSpan={5}
//                         className="px-4 py-10 text-center text-sm text-gray-500"
//                       >
//                         No data found
//                       </td>

//                     </tr>
//                   )}

//                 </tbody>

//               </table>

//             </div>
//           </div>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-end border-t border-[#e1e5ea] px-4 py-3">

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />

//         </div>

//       </div>
//     </div>
//   )
// }

// export default AvailableStock


// // import React, { useState, useRef, useEffect } from 'react'
// // import {
// //   ArrowUp,
// //   ArrowDown,
// //   Search,
// //   RotateCcw,
// //   FileSpreadsheet,
// //   Printer,
// //   X,
// //   Info,
// // } from 'lucide-react'

// // import axiosInstance from '../../axiosInstance'
// // import Pagination from '../../utils/Pagination'
// // import { showError, showSuccess } from '../../utils/sweetAlerts'
// // import SearchCenterStock from './SearchCenterStock'

// // const AvailableStock = () => {
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

// //   const [exportModalVisible, setExportModalVisible] = useState(false)
// //   const [exportStartDate, setExportStartDate] = useState('')
// //   const [exportEndDate, setExportEndDate] = useState('')

// //   const [activeSearch, setActiveSearch] = useState({
// //     product: '',
// //     center: '',
// //     resellerId: '',
// //     startDate: '',
// //     endDate: '',
// //   })

// //   const [dropdownOpen, setDropdownOpen] = useState({})
// //   const [currentPage, setCurrentPage] = useState(1)
// //   const [totalPages, setTotalPages] = useState(1)

// //   const dropdownRefs = useRef({})

// //   // =========================
// //   // Fetch Available Stock
// //   // =========================
// //   const fetchData = async (searchParams = {}, page = 1) => {
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

// //       if (searchParams.resellerId) {
// //         params.append('resellerId', searchParams.resellerId)
// //       }

// //       if (searchParams.startDate) {
// //         params.append('startDate', searchParams.startDate)
// //       }

// //       if (searchParams.endDate) {
// //         params.append('endDate', searchParams.endDate)
// //       }

// //       params.append('page', page)

// //       const url = params.toString()
// //         ? `/availableStock/availableStock?${params.toString()}`
// //         : '/availableStock/availableStock'

// //       const response = await axiosInstance.get(url)

// //       if (response.data.success) {
// //         setData(response.data.data.stock)
// //         setCurrentPage(response.data.data.pagination.currentPage)
// //         setTotalPages(response.data.data.pagination.totalPages)
// //       } else {
// //         const errorMessage =
// //           response.data.message || 'API returned unsuccessful response'

// //         setError(errorMessage)
// //         console.error('Backend error:', response.data)
// //       }
// //     } catch (err) {
// //       if (err.response) {
// //         const errorMessage =
// //           err.response.data?.message ||
// //           err.response.data?.error ||
// //           `Error ${err.response.status}: ${err.response.statusText}`

// //         setError(errorMessage)
// //         console.error('Error response:', err.response.data)
// //       } else if (err.request) {
// //         setError(
// //           'No response received from server. Please check your network connection.',
// //         )
// //         console.error('Error request:', err.request)
// //       } else {
// //         setError(err.message || 'An error occurred while fetching data')
// //         console.error('Error message:', err.message)
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
// //       const response = await axiosInstance.get('/centers')

// //       if (response.data.success) {
// //         setCenters(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error('Error fetching centers:', error)
// //     }
// //   }

// //   // =========================
// //   // Fetch Products
// //   // =========================
// //   const fetchProducts = async () => {
// //     try {
// //       const response = await axiosInstance.get('/products/all')

// //       if (response.data.success) {
// //         setProducts(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error('Error fetching products:', error)
// //     }
// //   }

// //   // =========================
// //   // Fetch Resellers
// //   // =========================
// //   const fetchResellers = async () => {
// //     try {
// //       const response = await axiosInstance.get('/resellers')

// //       if (response.data.success) {
// //         setResellers(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error('Error fetching resellers:', error)
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
// //         return direction === 'ascending' ? -1 : 1
// //       }

// //       if (aValue > bValue) {
// //         return direction === 'ascending' ? 1 : -1
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
// //       resellerId: '',
// //       startDate: '',
// //       endDate: '',
// //     })

// //     setSearchTerm('')

// //     fetchData({}, 1)
// //   }

// //   // =========================
// //   // Export Modal
// //   // =========================
// //   const openExportModal = () => {
// //     setExportStartDate(activeSearch.startDate || '')
// //     setExportEndDate(activeSearch.endDate || '')
// //     setExportModalVisible(true)
// //   }

// //   // =========================
// //   // Generate Export
// //   // =========================
// //   const generateDetailExport = async () => {
// //     try {
// //       setLoading(true)

// //       // Validate dates
// //       if (
// //         exportStartDate &&
// //         exportEndDate &&
// //         exportStartDate > exportEndDate
// //       ) {
// //         showError('Start date cannot be greater than end date')
// //         setLoading(false)
// //         return
// //       }

// //       const params = new URLSearchParams()

// //       // Only date filters are used for export
// //       if (exportStartDate) {
// //         params.append('startDate', exportStartDate)
// //       }

// //       if (exportEndDate) {
// //         params.append('endDate', exportEndDate)
// //       }

// //       params.append('export', 'true')

// //       const apiUrl = `/availableStock/availableStock?${params.toString()}`

// //       console.log('Export API URL:', apiUrl)

// //       const response = await axiosInstance.get(apiUrl, {
// //         responseType: 'blob',
// //       })

// //       if (response.data instanceof Blob) {
// //         let filename = 'available_stock_export'

// //         if (exportStartDate && exportEndDate) {
// //           filename += `_${exportStartDate}_to_${exportEndDate}`
// //         } else if (exportStartDate) {
// //           filename += `_from_${exportStartDate}`
// //         } else if (exportEndDate) {
// //           filename += `_until_${exportEndDate}`
// //         } else {
// //           filename += `_${new Date().toISOString().split('T')[0]}`
// //         }

// //         const contentType = response.headers['content-type']

// //         if (
// //           contentType ===
// //           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// //         ) {
// //           filename += '.xlsx'
// //         } else if (contentType === 'application/vnd.ms-excel') {
// //           filename += '.xls'
// //         } else {
// //           filename += '.xlsx'
// //         }

// //         const blob = new Blob([response.data], {
// //           type: contentType,
// //         })

// //         const link = document.createElement('a')
// //         const downloadUrl = URL.createObjectURL(blob)

// //         link.setAttribute('href', downloadUrl)
// //         link.setAttribute('download', filename)
// //         link.style.visibility = 'hidden'

// //         document.body.appendChild(link)
// //         link.click()
// //         document.body.removeChild(link)

// //         URL.revokeObjectURL(downloadUrl)

// //         showSuccess('Export completed successfully!')

// //         setExportModalVisible(false)
// //         setExportStartDate('')
// //         setExportEndDate('')
// //       } else {
// //         throw new Error('Unexpected response format from server')
// //       }
// //     } catch (error) {
// //       console.error('Error generating export:', error)

// //       let errorMessage = 'Error generating export file'

// //       if (
// //         error.response &&
// //         error.response.data instanceof Blob
// //       ) {
// //         try {
// //           const text = await error.response.data.text()
// //           const parsed = JSON.parse(text)

// //           errorMessage =
// //             parsed.message ||
// //             parsed.error ||
// //             errorMessage
// //         } catch (e) {
// //           errorMessage =
// //             error.response.statusText || errorMessage
// //         }
// //       } else if (error.message) {
// //         errorMessage = error.message
// //       }

// //       showError(errorMessage)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // =========================
// //   // Local Search
// //   // =========================
// //   const filteredData = data.filter((item) => {
// //     if (
// //       activeSearch.product ||
// //       activeSearch.center ||
// //       activeSearch.resellerId ||
// //       activeSearch.startDate ||
// //       activeSearch.endDate
// //     ) {
// //       return true
// //     }

// //     return Object.values(item).some((value) => {
// //       if (typeof value === 'object' && value !== null) {
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

// //       Object.keys(dropdownRefs.current).forEach((key) => {
// //         if (
// //           dropdownRefs.current[key] &&
// //           !dropdownRefs.current[key].contains(event.target)
// //         ) {
// //           newDropdownState[key] = false
// //           shouldUpdate = true
// //         }
// //       })

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
// //       <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// //         {error}
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="w-full">
// //       {/* Page Title */}
// //       <div className="mb-4 text-2xl font-semibold text-gray-800">
// //         Available Stock
// //       </div>

// //       {/* Search Modal */}
// //       <SearchCenterStock
// //         visible={searchModalVisible}
// //         onClose={() => setSearchModalVisible(false)}
// //         onSearch={handleSearch}
// //         centers={centers}
// //         products={products}
// //         resellers={resellers}
// //       />

// //       {/* Export Modal */}
// //       {exportModalVisible && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
// //           <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
// //             {/* Modal Header */}
// //             <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
// //               <h3 className="text-lg font-semibold text-gray-800">
// //                 Export Stock Data
// //               </h3>

// //               <button
// //                 type="button"
// //                 onClick={() => setExportModalVisible(false)}
// //                 className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
// //               >
// //                 <X className="h-5 w-5" />
// //               </button>
// //             </div>

// //             {/* Modal Body */}
// //             <div className="space-y-4 px-5 py-5">
// //               <div>
// //                 <label
// //                   htmlFor="exportStartDate"
// //                   className="mb-1.5 block text-sm font-medium text-gray-700"
// //                 >
// //                   Start Date (Optional)
// //                 </label>

// //                 <input
// //                   type="date"
// //                   id="exportStartDate"
// //                   value={exportStartDate}
// //                   onChange={(e) =>
// //                     setExportStartDate(e.target.value)
// //                   }
// //                   placeholder="Select start date"
// //                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
// //                 />

// //                 <p className="mt-1 text-xs text-gray-500">
// //                   Leave empty to include all records from
// //                   beginning
// //                 </p>
// //               </div>

// //               <div>
// //                 <label
// //                   htmlFor="exportEndDate"
// //                   className="mb-1.5 block text-sm font-medium text-gray-700"
// //                 >
// //                   End Date (Optional)
// //                 </label>

// //                 <input
// //                   type="date"
// //                   id="exportEndDate"
// //                   value={exportEndDate}
// //                   onChange={(e) =>
// //                     setExportEndDate(e.target.value)
// //                   }
// //                   placeholder="Select end date"
// //                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
// //                 />

// //                 <p className="mt-1 text-xs text-gray-500">
// //                   Leave empty to include all records until
// //                   today
// //                 </p>
// //               </div>

// //               <div className="flex gap-2 rounded-md bg-blue-50 p-3 text-xs text-blue-700">
// //                 <Info className="mt-0.5 h-4 w-4 shrink-0" />

// //                 <span>
// //                   Export will include all centers, products,
// //                   and resellers within the selected date
// //                   range.
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Modal Footer */}
// //             <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
// //               <button
// //                 type="button"
// //                 onClick={() =>
// //                   setExportModalVisible(false)
// //                 }
// //                 className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
// //               >
// //                 Cancel
// //               </button>

// //               <button
// //                 type="button"
// //                 onClick={generateDetailExport}
// //                 className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
// //               >
// //                 <FileSpreadsheet className="h-4 w-4" />
// //                 Export
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Main Card */}
// //       <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
// //         {/* Card Header */}
// //         <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
// //           <div className="flex flex-wrap items-center gap-2">
// //             {/* Search */}
// //             <button
// //               type="button"
// //               onClick={() => setSearchModalVisible(true)}
// //               className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
// //             >
// //               <Search className="h-4 w-4" />
// //               Search
// //             </button>

// //             {/* Reset */}
// //             {(activeSearch.product ||
// //               activeSearch.center ||
// //               activeSearch.resellerId ||
// //               activeSearch.startDate ||
// //               activeSearch.endDate) && (
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
// //               onClick={openExportModal}
// //               className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700"
// //             >
// //               <FileSpreadsheet className="h-4 w-4" />
// //               Export
// //             </button>

// //             {/* Print */}
// //             <button
// //               type="button"
// //               className="inline-flex items-center gap-1.5 rounded-md bg-gray-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800"
// //             >
// //               <Printer className="h-4 w-4" />
// //               Print
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

// //         {/* Card Body */}
// //         <div className="p-4">
// //           <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
// //             <div>
// //               {(activeSearch.resellerId ||
// //                 activeSearch.startDate ||
// //                 activeSearch.endDate) && (
// //                 <div className="text-sm text-gray-500">
// //                   {activeSearch.resellerId &&
// //                     `Reseller: ${
// //                       resellers.find(
// //                         (r) =>
// //                           r._id === activeSearch.resellerId,
// //                       )?.businessName ||
// //                       activeSearch.resellerId
// //                     } | `}

// //                   {activeSearch.startDate &&
// //                     `From: ${activeSearch.startDate} | `}

// //                   {activeSearch.endDate &&
// //                     `To: ${activeSearch.endDate}`}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Local Search */}
// //             <div className="flex items-center gap-2">
// //               <label
// //                 htmlFor="available-stock-search"
// //                 className="text-sm font-medium text-gray-700"
// //               >
// //                 Search:
// //               </label>

// //               <input
// //                 id="available-stock-search"
// //                 type="text"
// //                 value={searchTerm}
// //                 onChange={(e) =>
// //                   setSearchTerm(e.target.value)
// //                 }
// //                 className="h-8 w-full max-w-[350px] border border-gray-300 px-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
// //                     onClick={() => handleSort('outlet')}
// //                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
// //                   >
// //                     Branch
// //                     {getSortIcon('outlet')}
// //                   </th>

// //                   <th
// //                     scope="col"
// //                     onClick={() => handleSort('date')}
// //                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
// //                   >
// //                     Product
// //                     {getSortIcon('date')}
// //                   </th>

// //                   <th
// //                     scope="col"
// //                     onClick={() => handleSort('invoiceNo')}
// //                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
// //                   >
// //                     Category
// //                     {getSortIcon('invoiceNo')}
// //                   </th>

// //                   <th
// //                     scope="col"
// //                     onClick={() =>
// //                       handleSort('vendor.businessName')
// //                     }
// //                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
// //                   >
// //                     Stock
// //                     {getSortIcon('vendor.businessName')}
// //                   </th>

// //                   <th
// //                     scope="col"
// //                     onClick={() =>
// //                       handleSort('damagedQuantity')
// //                     }
// //                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
// //                   >
// //                     Damage
// //                     {getSortIcon('damagedQuantity')}
// //                   </th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {filteredData.length > 0 ? (
// //                   filteredData.map((item) => (
// //                     <tr
// //                       key={item._id}
// //                       className="transition hover:bg-gray-50"
// //                     >
// //                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                         {item.centerName || ''}
// //                       </td>

// //                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                         {item.productName}
// //                       </td>

// //                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                         {item.productCategory?.name || ''}
// //                       </td>

// //                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                         {item.availableQuantity || 0}
// //                       </td>

// //                       <td className="border border-gray-200 px-4 py-3 text-gray-700">
// //                         {item.damagedQuantity || 0}
// //                       </td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr>
// //                     <td
// //                       colSpan={5}
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

// // export default AvailableStock





// // import React, { useState, useRef, useEffect } from 'react'
// // import {
// //   ArrowUp,
// //   ArrowDown,
// //   Search,
// //   RotateCcw,
// //   FileSpreadsheet,
// //   Printer,
// //   X,
// //   Info,
// // } from 'lucide-react'

// // import axiosInstance from '../../axiosInstance'
// // import Pagination from '../../utils/Pagination'
// // import { showError, showSuccess } from '../../utils/sweetAlerts'
// // import SearchCenterStock from './SearchCenterStock'

// // const AvailableStock = () => {
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

// //   const [exportModalVisible, setExportModalVisible] = useState(false)
// //   const [exportStartDate, setExportStartDate] = useState('')
// //   const [exportEndDate, setExportEndDate] = useState('')

// //   const [activeSearch, setActiveSearch] = useState({
// //     product: '',
// //     center: '',
// //     resellerId: '',
// //     startDate: '',
// //     endDate: '',
// //   })

// //   const [dropdownOpen, setDropdownOpen] = useState({})
// //   const [currentPage, setCurrentPage] = useState(1)
// //   const [totalPages, setTotalPages] = useState(1)

// //   const dropdownRefs = useRef({})

// //   // =========================
// //   // Fetch Available Stock
// //   // =========================
// //   const fetchData = async (searchParams = {}, page = 1) => {
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

// //       if (searchParams.resellerId) {
// //         params.append('resellerId', searchParams.resellerId)
// //       }

// //       if (searchParams.startDate) {
// //         params.append('startDate', searchParams.startDate)
// //       }

// //       if (searchParams.endDate) {
// //         params.append('endDate', searchParams.endDate)
// //       }

// //       params.append('page', page)

// //       const url = params.toString()
// //         ? `/availableStock/availableStock?${params.toString()}`
// //         : '/availableStock/availableStock'

// //       const response = await axiosInstance.get(url)

// //       if (response.data.success) {
// //         setData(response.data.data.stock)
// //         setCurrentPage(response.data.data.pagination.currentPage)
// //         setTotalPages(response.data.data.pagination.totalPages)
// //       } else {
// //         const errorMessage =
// //           response.data.message || 'API returned unsuccessful response'

// //         setError(errorMessage)
// //         console.error('Backend error:', response.data)
// //       }
// //     } catch (err) {
// //       if (err.response) {
// //         const errorMessage =
// //           err.response.data?.message ||
// //           err.response.data?.error ||
// //           `Error ${err.response.status}: ${err.response.statusText}`

// //         setError(errorMessage)
// //         console.error('Error response:', err.response.data)
// //       } else if (err.request) {
// //         setError(
// //           'No response received from server. Please check your network connection.',
// //         )
// //         console.error('Error request:', err.request)
// //       } else {
// //         setError(err.message || 'An error occurred while fetching data')
// //         console.error('Error message:', err.message)
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
// //       const response = await axiosInstance.get('/centers')

// //       if (response.data.success) {
// //         setCenters(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error('Error fetching centers:', error)
// //     }
// //   }

// //   // =========================
// //   // Fetch Products
// //   // =========================
// //   const fetchProducts = async () => {
// //     try {
// //       const response = await axiosInstance.get('/products/all')

// //       if (response.data.success) {
// //         setProducts(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error('Error fetching products:', error)
// //     }
// //   }

// //   // =========================
// //   // Fetch Resellers
// //   // =========================
// //   const fetchResellers = async () => {
// //     try {
// //       const response = await axiosInstance.get('/resellers')

// //       if (response.data.success) {
// //         setResellers(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error('Error fetching resellers:', error)
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
// //         return direction === 'ascending' ? -1 : 1
// //       }

// //       if (aValue > bValue) {
// //         return direction === 'ascending' ? 1 : -1
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
// //       resellerId: '',
// //       startDate: '',
// //       endDate: '',
// //     })

// //     setSearchTerm('')

// //     fetchData({}, 1)
// //   }

// //   // =========================
// //   // Export Modal
// //   // =========================
// //   const openExportModal = () => {
// //     setExportStartDate(activeSearch.startDate || '')
// //     setExportEndDate(activeSearch.endDate || '')
// //     setExportModalVisible(true)
// //   }

// //   // =========================
// //   // Generate Export
// //   // =========================
// //   const generateDetailExport = async () => {
// //     try {
// //       setLoading(true)

// //       // Validate dates
// //       if (
// //         exportStartDate &&
// //         exportEndDate &&
// //         exportStartDate > exportEndDate
// //       ) {
// //         showError('Start date cannot be greater than end date')
// //         setLoading(false)
// //         return
// //       }

// //       const params = new URLSearchParams()

// //       // Only date filters are used for export
// //       if (exportStartDate) {
// //         params.append('startDate', exportStartDate)
// //       }

// //       if (exportEndDate) {
// //         params.append('endDate', exportEndDate)
// //       }

// //       params.append('export', 'true')

// //       const apiUrl = `/availableStock/availableStock?${params.toString()}`

// //       console.log('Export API URL:', apiUrl)

// //       const response = await axiosInstance.get(apiUrl, {
// //         responseType: 'blob',
// //       })

// //       if (response.data instanceof Blob) {
// //         let filename = 'available_stock_export'

// //         if (exportStartDate && exportEndDate) {
// //           filename += `_${exportStartDate}_to_${exportEndDate}`
// //         } else if (exportStartDate) {
// //           filename += `_from_${exportStartDate}`
// //         } else if (exportEndDate) {
// //           filename += `_until_${exportEndDate}`
// //         } else {
// //           filename += `_${new Date().toISOString().split('T')[0]}`
// //         }

// //         const contentType = response.headers['content-type']

// //         if (
// //           contentType ===
// //           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// //         ) {
// //           filename += '.xlsx'
// //         } else if (contentType === 'application/vnd.ms-excel') {
// //           filename += '.xls'
// //         } else {
// //           filename += '.xlsx'
// //         }

// //         const blob = new Blob([response.data], {
// //           type: contentType,
// //         })

// //         const link = document.createElement('a')
// //         const downloadUrl = URL.createObjectURL(blob)

// //         link.setAttribute('href', downloadUrl)
// //         link.setAttribute('download', filename)
// //         link.style.visibility = 'hidden'

// //         document.body.appendChild(link)
// //         link.click()
// //         document.body.removeChild(link)

// //         URL.revokeObjectURL(downloadUrl)

// //         showSuccess('Export completed successfully!')

// //         setExportModalVisible(false)
// //         setExportStartDate('')
// //         setExportEndDate('')
// //       } else {
// //         throw new Error('Unexpected response format from server')
// //       }
// //     } catch (error) {
// //       console.error('Error generating export:', error)

// //       let errorMessage = 'Error generating export file'

// //       if (
// //         error.response &&
// //         error.response.data instanceof Blob
// //       ) {
// //         try {
// //           const text = await error.response.data.text()
// //           const parsed = JSON.parse(text)

// //           errorMessage =
// //             parsed.message ||
// //             parsed.error ||
// //             errorMessage
// //         } catch (e) {
// //           errorMessage =
// //             error.response.statusText || errorMessage
// //         }
// //       } else if (error.message) {
// //         errorMessage = error.message
// //       }

// //       showError(errorMessage)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // =========================
// //   // Local Search
// //   // =========================
// //   const filteredData = data.filter((item) => {
// //     if (
// //       activeSearch.product ||
// //       activeSearch.center ||
// //       activeSearch.resellerId ||
// //       activeSearch.startDate ||
// //       activeSearch.endDate
// //     ) {
// //       return true
// //     }

// //     return Object.values(item).some((value) => {
// //       if (typeof value === 'object' && value !== null) {
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

// //       Object.keys(dropdownRefs.current).forEach((key) => {
// //         if (
// //           dropdownRefs.current[key] &&
// //           !dropdownRefs.current[key].contains(event.target)
// //         ) {
// //           newDropdownState[key] = false
// //           shouldUpdate = true
// //         }
// //       })

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
// //       <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// //         {error}
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
// //       {/* Page Title - old frontend style */}
// //       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
// //         Available Stock
// //       </div>

// //       {/* Search Modal */}
// //       <SearchCenterStock
// //         visible={searchModalVisible}
// //         onClose={() => setSearchModalVisible(false)}
// //         onSearch={handleSearch}
// //         centers={centers}
// //         products={products}
// //         resellers={resellers}
// //       />

// //       {/* Export Modal */}
// //       {exportModalVisible && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
// //           <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
// //             {/* Modal Header */}
// //             <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
// //               <h3 className="text-lg font-semibold text-gray-800">
// //                 Export Stock Data
// //               </h3>

// //               <button
// //                 type="button"
// //                 onClick={() => setExportModalVisible(false)}
// //                 className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
// //               >
// //                 <X className="h-5 w-5" />
// //               </button>
// //             </div>

// //             {/* Modal Body */}
// //             <div className="space-y-4 px-5 py-5">
// //               <div>
// //                 <label
// //                   htmlFor="exportStartDate"
// //                   className="mb-1.5 block text-sm font-medium text-gray-700"
// //                 >
// //                   Start Date (Optional)
// //                 </label>

// //                 <input
// //                   type="date"
// //                   id="exportStartDate"
// //                   value={exportStartDate}
// //                   onChange={(e) =>
// //                     setExportStartDate(e.target.value)
// //                   }
// //                   placeholder="Select start date"
// //                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
// //                 />

// //                 <p className="mt-1 text-xs text-gray-500">
// //                   Leave empty to include all records from
// //                   beginning
// //                 </p>
// //               </div>

// //               <div>
// //                 <label
// //                   htmlFor="exportEndDate"
// //                   className="mb-1.5 block text-sm font-medium text-gray-700"
// //                 >
// //                   End Date (Optional)
// //                 </label>

// //                 <input
// //                   type="date"
// //                   id="exportEndDate"
// //                   value={exportEndDate}
// //                   onChange={(e) =>
// //                     setExportEndDate(e.target.value)
// //                   }
// //                   placeholder="Select end date"
// //                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
// //                 />

// //                 <p className="mt-1 text-xs text-gray-500">
// //                   Leave empty to include all records until
// //                   today
// //                 </p>
// //               </div>

// //               <div className="flex gap-2 rounded-md bg-blue-50 p-3 text-xs text-blue-700">
// //                 <Info className="mt-0.5 h-4 w-4 shrink-0" />

// //                 <span>
// //                   Export will include all centers, products,
// //                   and resellers within the selected date
// //                   range.
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Modal Footer */}
// //             <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
// //               <button
// //                 type="button"
// //                 onClick={() =>
// //                   setExportModalVisible(false)
// //                 }
// //                 className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
// //               >
// //                 Cancel
// //               </button>

// //               <button
// //                 type="button"
// //                 onClick={generateDetailExport}
// //                 className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
// //               >
// //                 <FileSpreadsheet className="h-4 w-4" />
// //                 Export
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Main Card - styled to match the old Available Stock UI */}
// //       <div className="mt-0 overflow-hidden border border-[#e1e5ea] border-t-[4px] border-t-[#2f5fa7] bg-white">
// //         {/* Action Toolbar */}
// //         <div className="flex min-h-[51px] flex-wrap items-center gap-1 border-b border-[#d9dde3] px-3 py-2">
// //           {/* Search */}
// //           <button
// //             type="button"
// //             onClick={() => setSearchModalVisible(true)}
// //             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
// //           >
// //             <Search className="h-[16px] w-[16px]" />
// //             Search
// //           </button>

// //           {/* Reset */}
// //           {(activeSearch.product ||
// //             activeSearch.center ||
// //             activeSearch.resellerId ||
// //             activeSearch.startDate ||
// //             activeSearch.endDate) && (
// //             <button
// //               type="button"
// //               onClick={handleResetSearch}
// //               className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
// //             >
// //               <RotateCcw className="h-[15px] w-[15px]" />
// //               Reset Search
// //             </button>
// //           )}

// //           {/* Export */}
// //           <button
// //             type="button"
// //             onClick={openExportModal}
// //             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
// //           >
// //             <FileSpreadsheet className="h-[15px] w-[15px]" />
// //             Export
// //           </button>

// //           {/* Print */}
// //           <button
// //             type="button"
// //             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
// //           >
// //             <Printer className="h-[15px] w-[15px]" />
// //             Print
// //           </button>
// //         </div>

// //         {/* Search / active-filter row */}
// //         <div className="flex min-h-[62px] items-center justify-between px-4 py-3">
// //           <div className="min-w-0 text-[13px] text-[#666]">
// //             {(activeSearch.resellerId ||
// //               activeSearch.startDate ||
// //               activeSearch.endDate) && (
// //               <div>
// //                 {activeSearch.resellerId &&
// //                   `Reseller: ${
// //                     resellers.find(
// //                       (r) => r._id === activeSearch.resellerId,
// //                     )?.businessName || activeSearch.resellerId
// //                   } | `}

// //                 {activeSearch.startDate &&
// //                   `From: ${activeSearch.startDate} | `}

// //                 {activeSearch.endDate &&
// //                   `To: ${activeSearch.endDate}`}
// //               </div>
// //             )}
// //           </div>

// //           {/* Local Search */}
// //           <div className="ml-auto flex shrink-0 items-center gap-1.5">
// //             <label
// //               htmlFor="available-stock-search"
// //               className="text-[14px] font-bold text-[#202020]"
// //             >
// //               Search:
// //             </label>

// //             <input
// //               id="available-stock-search"
// //               type="text"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="h-[30px] w-[220px] border border-[#d5dbe3] bg-white px-2 text-[13px] text-[#222] outline-none focus:border-[#2f5fa7]"
// //             />
// //           </div>
// //         </div>

// //         {/* Table - inset from the card edges to match the reference UI */}
// //         <div className="px-4">
// //           <div className="w-full overflow-hidden border border-[#eeeeee]">
// //             <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">
// //             <table className="w-full table-fixed border-collapse">
// //               <colgroup>
// //                 <col style={{ width: '17%' }} />
// //                 <col style={{ width: '36%' }} />
// //                 <col style={{ width: '30%' }} />
// //                 <col style={{ width: '7%' }} />
// //                 <col style={{ width: '10%' }} />
// //               </colgroup>

// //               <thead className="sticky top-0 z-20">
// //                 <tr>
// //                   <th
// //                     scope="col"
// //                     onClick={() => handleSort('outlet')}
// //                     className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                   >
// //                     <div className="flex items-center gap-1">
// //                       <span>Branch</span>
// //                       {getSortIcon('outlet')}
// //                     </div>
// //                   </th>

// //                   <th
// //                     scope="col"
// //                     onClick={() => handleSort('date')}
// //                     className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                   >
// //                     <div className="flex items-center gap-1">
// //                       <span>Product</span>
// //                       {getSortIcon('date')}
// //                     </div>
// //                   </th>

// //                   <th
// //                     scope="col"
// //                     onClick={() => handleSort('invoiceNo')}
// //                     className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                   >
// //                     <div className="flex items-center gap-1">
// //                       <span>Category</span>
// //                       {getSortIcon('invoiceNo')}
// //                     </div>
// //                   </th>

// //                   <th
// //                     scope="col"
// //                     onClick={() => handleSort('vendor.businessName')}
// //                     className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                   >
// //                     <div className="flex items-center gap-1">
// //                       <span>Stock</span>
// //                       {getSortIcon('vendor.businessName')}
// //                     </div>
// //                   </th>

// //                   <th
// //                     scope="col"
// //                     onClick={() => handleSort('damagedQuantity')}
// //                     className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                   >
// //                     <div className="flex items-center gap-1">
// //                       <span>Damage</span>
// //                       {getSortIcon('damagedQuantity')}
// //                     </div>
// //                   </th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {filteredData.length > 0 ? (
// //                   filteredData.map((item, index) => (
// //                     <tr
// //                       key={item._id}
// //                       className={`transition ${
// //                         index % 2 === 0
// //                           ? 'bg-[#f1f1f1]'
// //                           : 'bg-white'
// //                       }`}
// //                     >
// //                       <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                         <div className="break-words">
// //                           {item.centerName || ''}
// //                         </div>
// //                       </td>

// //                       <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                         <div className="break-words">
// //                           {item.productName}
// //                         </div>
// //                       </td>

// //                       <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                         <div className="break-words">
// //                           {item.productCategory?.name || ''}
// //                         </div>
// //                       </td>

// //                       <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                         {item.availableQuantity || 0}
// //                       </td>

// //                       <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                         {item.damagedQuantity || 0}
// //                       </td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr>
// //                     <td
// //                       colSpan={5}
// //                       className="px-4 py-10 text-center text-sm text-gray-500"
// //                     >
// //                       No data found
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Pagination - kept functional, moved to the bottom to match the old table layout */}
// //         <div className="flex justify-end border-t border-[#e1e5ea] px-4 py-3">
// //           <Pagination
// //             currentPage={currentPage}
// //             totalPages={totalPages}
// //             onPageChange={handlePageChange}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default AvailableStock



// // import React, { useState, useRef, useEffect } from 'react'
// // import {
// //   ArrowUp,
// //   ArrowDown,
// //   Search,
// //   RotateCcw,
// //   FileSpreadsheet,
// //   Printer,
// //   X,
// //   Info,
// // } from 'lucide-react'

// // import axiosInstance from '../../axiosInstance'
// // import Pagination from '../../utils/Pagination'
// // import { showError, showSuccess } from '../../utils/sweetAlerts'
// // import SearchCenterStock from './SearchCenterStock'

// // const AvailableStock = () => {
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

// //   const [exportModalVisible, setExportModalVisible] = useState(false)
// //   const [exportStartDate, setExportStartDate] = useState('')
// //   const [exportEndDate, setExportEndDate] = useState('')

// //   const [activeSearch, setActiveSearch] = useState({
// //     product: '',
// //     center: '',
// //     resellerId: '',
// //     startDate: '',
// //     endDate: '',
// //   })

// //   const [dropdownOpen, setDropdownOpen] = useState({})
// //   const [currentPage, setCurrentPage] = useState(1)
// //   const [totalPages, setTotalPages] = useState(1)

// //   const dropdownRefs = useRef({})

// //   // =========================
// //   // Fetch Available Stock
// //   // =========================
// //   const fetchData = async (searchParams = {}, page = 1) => {
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

// //       if (searchParams.resellerId) {
// //         params.append('resellerId', searchParams.resellerId)
// //       }

// //       if (searchParams.startDate) {
// //         params.append('startDate', searchParams.startDate)
// //       }

// //       if (searchParams.endDate) {
// //         params.append('endDate', searchParams.endDate)
// //       }

// //       params.append('page', page)

// //       const url = params.toString()
// //         ? `/availableStock/availableStock?${params.toString()}`
// //         : '/availableStock/availableStock'

// //       const response = await axiosInstance.get(url)

// //       if (response.data.success) {
// //         setData(response.data.data.stock)
// //         setCurrentPage(response.data.data.pagination.currentPage)
// //         setTotalPages(response.data.data.pagination.totalPages)
// //       } else {
// //         const errorMessage =
// //           response.data.message || 'API returned unsuccessful response'

// //         setError(errorMessage)
// //         console.error('Backend error:', response.data)
// //       }
// //     } catch (err) {
// //       if (err.response) {
// //         const errorMessage =
// //           err.response.data?.message ||
// //           err.response.data?.error ||
// //           `Error ${err.response.status}: ${err.response.statusText}`

// //         setError(errorMessage)
// //         console.error('Error response:', err.response.data)
// //       } else if (err.request) {
// //         setError(
// //           'No response received from server. Please check your network connection.',
// //         )
// //         console.error('Error request:', err.request)
// //       } else {
// //         setError(err.message || 'An error occurred while fetching data')
// //         console.error('Error message:', err.message)
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
// //       const response = await axiosInstance.get('/centers')

// //       if (response.data.success) {
// //         setCenters(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error('Error fetching centers:', error)
// //     }
// //   }

// //   // =========================
// //   // Fetch Products
// //   // =========================
// //   const fetchProducts = async () => {
// //     try {
// //       const response = await axiosInstance.get('/products/all')

// //       if (response.data.success) {
// //         setProducts(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error('Error fetching products:', error)
// //     }
// //   }

// //   // =========================
// //   // Fetch Resellers
// //   // =========================
// //   const fetchResellers = async () => {
// //     try {
// //       const response = await axiosInstance.get('/resellers')

// //       if (response.data.success) {
// //         setResellers(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error('Error fetching resellers:', error)
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
// //         return direction === 'ascending' ? -1 : 1
// //       }

// //       if (aValue > bValue) {
// //         return direction === 'ascending' ? 1 : -1
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
// //       resellerId: '',
// //       startDate: '',
// //       endDate: '',
// //     })

// //     setSearchTerm('')

// //     fetchData({}, 1)
// //   }

// //   // =========================
// //   // Export Modal
// //   // =========================
// //   const openExportModal = () => {
// //     setExportStartDate(activeSearch.startDate || '')
// //     setExportEndDate(activeSearch.endDate || '')
// //     setExportModalVisible(true)
// //   }

// //   // =========================
// //   // Generate Export
// //   // =========================
// //   const generateDetailExport = async () => {
// //     try {
// //       setLoading(true)

// //       if (
// //         exportStartDate &&
// //         exportEndDate &&
// //         exportStartDate > exportEndDate
// //       ) {
// //         showError('Start date cannot be greater than end date')
// //         setLoading(false)
// //         return
// //       }

// //       const params = new URLSearchParams()

// //       if (exportStartDate) {
// //         params.append('startDate', exportStartDate)
// //       }

// //       if (exportEndDate) {
// //         params.append('endDate', exportEndDate)
// //       }

// //       params.append('export', 'true')

// //       const apiUrl = `/availableStock/availableStock?${params.toString()}`

// //       console.log('Export API URL:', apiUrl)

// //       const response = await axiosInstance.get(apiUrl, {
// //         responseType: 'blob',
// //       })

// //       if (response.data instanceof Blob) {
// //         let filename = 'available_stock_export'

// //         if (exportStartDate && exportEndDate) {
// //           filename += `_${exportStartDate}_to_${exportEndDate}`
// //         } else if (exportStartDate) {
// //           filename += `_from_${exportStartDate}`
// //         } else if (exportEndDate) {
// //           filename += `_until_${exportEndDate}`
// //         } else {
// //           filename += `_${new Date().toISOString().split('T')[0]}`
// //         }

// //         const contentType = response.headers['content-type']

// //         if (
// //           contentType ===
// //           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// //         ) {
// //           filename += '.xlsx'
// //         } else if (contentType === 'application/vnd.ms-excel') {
// //           filename += '.xls'
// //         } else {
// //           filename += '.xlsx'
// //         }

// //         const blob = new Blob([response.data], {
// //           type: contentType,
// //         })

// //         const link = document.createElement('a')
// //         const downloadUrl = URL.createObjectURL(blob)

// //         link.setAttribute('href', downloadUrl)
// //         link.setAttribute('download', filename)
// //         link.style.visibility = 'hidden'

// //         document.body.appendChild(link)
// //         link.click()
// //         document.body.removeChild(link)

// //         URL.revokeObjectURL(downloadUrl)

// //         showSuccess('Export completed successfully!')

// //         setExportModalVisible(false)
// //         setExportStartDate('')
// //         setExportEndDate('')
// //       } else {
// //         throw new Error('Unexpected response format from server')
// //       }
// //     } catch (error) {
// //       console.error('Error generating export:', error)

// //       let errorMessage = 'Error generating export file'

// //       if (
// //         error.response &&
// //         error.response.data instanceof Blob
// //       ) {
// //         try {
// //           const text = await error.response.data.text()
// //           const parsed = JSON.parse(text)

// //           errorMessage =
// //             parsed.message ||
// //             parsed.error ||
// //             errorMessage
// //         } catch (e) {
// //           errorMessage =
// //             error.response.statusText || errorMessage
// //         }
// //       } else if (error.message) {
// //         errorMessage = error.message
// //       }

// //       showError(errorMessage)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // =========================
// //   // Local Search
// //   // =========================
// //   const filteredData = data.filter((item) => {
// //     if (
// //       activeSearch.product ||
// //       activeSearch.center ||
// //       activeSearch.resellerId ||
// //       activeSearch.startDate ||
// //       activeSearch.endDate
// //     ) {
// //       return true
// //     }

// //     return Object.values(item).some((value) => {
// //       if (typeof value === 'object' && value !== null) {
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

// //       Object.keys(dropdownRefs.current).forEach((key) => {
// //         if (
// //           dropdownRefs.current[key] &&
// //           !dropdownRefs.current[key].contains(event.target)
// //         ) {
// //           newDropdownState[key] = false
// //           shouldUpdate = true
// //         }
// //       })

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
// //       <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// //         {error}
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

// //       {/* Export dropdown animation */}
// //       <style>
// //         {`
// //           @keyframes exportStockDropDown {
// //             from {
// //               opacity: 0;
// //               transform: translateY(-70px);
// //             }
// //             to {
// //               opacity: 1;
// //               transform: translateY(0);
// //             }
// //           }

// //           .export-stock-dropdown {
// //             animation: exportStockDropDown 0.3s ease-out;
// //           }
// //         `}
// //       </style>

// //       {/* Page Title */}
// //       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
// //         Available Stock
// //       </div>

// //       {/* Search Modal */}
// //       <SearchCenterStock
// //         visible={searchModalVisible}
// //         onClose={() => setSearchModalVisible(false)}
// //         onSearch={handleSearch}
// //         centers={centers}
// //         products={products}
// //         resellers={resellers}
// //       />

// //       {/* =====================================================
// //           EXPORT STOCK DATA MODAL
// //           ONLY OPENING FUNCTIONALITY CHANGED
// //           ===================================================== */}
// //       {exportModalVisible && (
// //         <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-8">

// //           <div className="export-stock-dropdown w-full max-w-[500px] overflow-hidden rounded-[7px] bg-white shadow-2xl">

// //             {/* Modal Header */}
// //             <div className="flex h-[63px] items-center justify-between border-b border-[#dee2e6] px-4">

// //               <h3 className="text-[22px] font-normal text-[#343a40]">
// //                 Export Stock Data
// //               </h3>

// //               <button
// //                 type="button"
// //                 onClick={() => setExportModalVisible(false)}
// //                 className="flex h-8 w-8 items-center justify-center text-[#888] transition hover:text-[#555]"
// //               >
// //                 <X
// //                   className="h-[25px] w-[25px]"
// //                   strokeWidth={2}
// //                 />
// //               </button>

// //             </div>

// //             {/* Modal Body */}
// //             <div className="px-4 py-4">

// //               {/* Start Date */}
// //               <div className="mb-4">

// //                 <label
// //                   htmlFor="exportStartDate"
// //                   className="mb-2 block text-[14px] font-bold text-[#343a40]"
// //                 >
// //                   Start Date (Optional)
// //                 </label>

// //                 <input
// //                   type="date"
// //                   id="exportStartDate"
// //                   value={exportStartDate}
// //                   onChange={(e) =>
// //                     setExportStartDate(e.target.value)
// //                   }
// //                   className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
// //                 />

// //                 <p className="mt-1 text-[13px] text-[#6c757d]">
// //                   Leave empty to include all records from beginning
// //                 </p>

// //               </div>

// //               {/* End Date */}
// //               <div className="mb-4">

// //                 <label
// //                   htmlFor="exportEndDate"
// //                   className="mb-2 block text-[14px] font-bold text-[#343a40]"
// //                 >
// //                   End Date (Optional)
// //                 </label>

// //                 <input
// //                   type="date"
// //                   id="exportEndDate"
// //                   value={exportEndDate}
// //                   onChange={(e) =>
// //                     setExportEndDate(e.target.value)
// //                   }
// //                   className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
// //                 />

// //                 <p className="mt-1 text-[13px] text-[#6c757d]">
// //                   Leave empty to include all records until today
// //                 </p>

// //               </div>

// //               {/* Information Box */}
// //               <div className="flex gap-2 rounded-[5px] bg-[#e7f3ff] px-2 py-3 text-[13px] leading-5 text-[#007bff]">

// //                 <Info className="mt-[2px] h-[15px] w-[15px] shrink-0" />

// //                 <span>
// //                   <span className="font-medium">Note:</span>{' '}
// //                   Export will include all centers, products,
// //                   and resellers within the selected date range.
// //                 </span>

// //               </div>

// //             </div>

// //             {/* Modal Footer */}
// //             <div className="flex justify-end gap-2 border-t border-[#dee2e6] px-4 py-3">

// //               <button
// //                 type="button"
// //                 onClick={() => setExportModalVisible(false)}
// //                 className="h-[38px] rounded-[5px] bg-[#6c757d] px-4 text-[14px] font-medium text-white transition hover:bg-[#5a6268]"
// //               >
// //                 Cancel
// //               </button>

// //               <button
// //                 type="button"
// //                 onClick={generateDetailExport}
// //                 className="h-[38px] rounded-[5px] bg-[#5b55d9] px-4 text-[14px] font-medium text-white transition hover:bg-[#4d47c7]"
// //               >
// //                 Export
// //               </button>

// //             </div>

// //           </div>
// //         </div>
// //       )}

// //       {/* Main Card */}
// //       <div className="mt-0 overflow-hidden border border-[#e1e5ea] border-t-[4px] border-t-[#2f5fa7] bg-white">

// //         {/* Action Toolbar */}
// //         <div className="flex min-h-[51px] flex-wrap items-center gap-1 border-b border-[#d9dde3] px-3 py-2">

// //           {/* Search */}
// //           <button
// //             type="button"
// //             onClick={() => setSearchModalVisible(true)}
// //             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
// //           >
// //             <Search className="h-[16px] w-[16px]" />
// //             Search
// //           </button>

// //           {/* Reset */}
// //           {(activeSearch.product ||
// //             activeSearch.center ||
// //             activeSearch.resellerId ||
// //             activeSearch.startDate ||
// //             activeSearch.endDate) && (
// //             <button
// //               type="button"
// //               onClick={handleResetSearch}
// //               className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
// //             >
// //               <RotateCcw className="h-[15px] w-[15px]" />
// //               Reset Search
// //             </button>
// //           )}

// //           {/* Export */}
// //           <button
// //             type="button"
// //             onClick={openExportModal}
// //             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
// //           >
// //             <FileSpreadsheet className="h-[15px] w-[15px]" />
// //             Export
// //           </button>

// //           {/* Print */}
// //           <button
// //             type="button"
// //             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
// //           >
// //             <Printer className="h-[15px] w-[15px]" />
// //             Print
// //           </button>

// //         </div>

// //         {/* Search / active-filter row */}
// //         <div className="flex min-h-[62px] items-center justify-between px-4 py-3">

// //           <div className="min-w-0 text-[13px] text-[#666]">

// //             {(activeSearch.resellerId ||
// //               activeSearch.startDate ||
// //               activeSearch.endDate) && (
// //               <div>

// //                 {activeSearch.resellerId &&
// //                   `Reseller: ${
// //                     resellers.find(
// //                       (r) => r._id === activeSearch.resellerId,
// //                     )?.businessName || activeSearch.resellerId
// //                   } | `}

// //                 {activeSearch.startDate &&
// //                   `From: ${activeSearch.startDate} | `}

// //                 {activeSearch.endDate &&
// //                   `To: ${activeSearch.endDate}`}

// //               </div>
// //             )}

// //           </div>

// //           {/* Local Search */}
// //           <div className="ml-auto flex shrink-0 items-center gap-1.5">

// //             <label
// //               htmlFor="available-stock-search"
// //               className="text-[14px] font-bold text-[#202020]"
// //             >
// //               Search:
// //             </label>

// //             <input
// //               id="available-stock-search"
// //               type="text"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="h-[30px] w-[220px] border border-[#d5dbe3] bg-white px-2 text-[13px] text-[#222] outline-none focus:border-[#2f5fa7]"
// //             />

// //           </div>

// //         </div>

// //         {/* Table */}
// //         <div className="px-4">

// //           <div className="w-full overflow-hidden border border-[#eeeeee]">

// //             <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">

// //               <table className="w-full table-fixed border-collapse">

// //                 <colgroup>
// //                   <col style={{ width: '17%' }} />
// //                   <col style={{ width: '36%' }} />
// //                   <col style={{ width: '30%' }} />
// //                   <col style={{ width: '7%' }} />
// //                   <col style={{ width: '10%' }} />
// //                 </colgroup>

// //                 <thead className="sticky top-0 z-20">

// //                   <tr>

// //                     <th
// //                       scope="col"
// //                       onClick={() => handleSort('outlet')}
// //                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                     >
// //                       <div className="flex items-center gap-1">
// //                         <span>Branch</span>
// //                         {getSortIcon('outlet')}
// //                       </div>
// //                     </th>

// //                     <th
// //                       scope="col"
// //                       onClick={() => handleSort('date')}
// //                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                     >
// //                       <div className="flex items-center gap-1">
// //                         <span>Product</span>
// //                         {getSortIcon('date')}
// //                       </div>
// //                     </th>

// //                     <th
// //                       scope="col"
// //                       onClick={() => handleSort('invoiceNo')}
// //                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                     >
// //                       <div className="flex items-center gap-1">
// //                         <span>Category</span>
// //                         {getSortIcon('invoiceNo')}
// //                       </div>
// //                     </th>

// //                     <th
// //                       scope="col"
// //                       onClick={() =>
// //                         handleSort('vendor.businessName')
// //                       }
// //                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                     >
// //                       <div className="flex items-center gap-1">
// //                         <span>Stock</span>
// //                         {getSortIcon('vendor.businessName')}
// //                       </div>
// //                     </th>

// //                     <th
// //                       scope="col"
// //                       onClick={() =>
// //                         handleSort('damagedQuantity')
// //                       }
// //                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                     >
// //                       <div className="flex items-center gap-1">
// //                         <span>Damage</span>
// //                         {getSortIcon('damagedQuantity')}
// //                       </div>
// //                     </th>

// //                   </tr>

// //                 </thead>

// //                 <tbody>

// //                   {filteredData.length > 0 ? (
// //                     filteredData.map((item, index) => (
// //                       <tr
// //                         key={item._id}
// //                         className={`transition ${
// //                           index % 2 === 0
// //                             ? 'bg-[#f1f1f1]'
// //                             : 'bg-white'
// //                         }`}
// //                       >

// //                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                           <div className="break-words">
// //                             {item.centerName || ''}
// //                           </div>
// //                         </td>

// //                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                           <div className="break-words">
// //                             {item.productName}
// //                           </div>
// //                         </td>

// //                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                           <div className="break-words">
// //                             {item.productCategory?.name || ''}
// //                           </div>
// //                         </td>

// //                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                           {item.availableQuantity || 0}
// //                         </td>

// //                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                           {item.damagedQuantity || 0}
// //                         </td>

// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr>

// //                       <td
// //                         colSpan={5}
// //                         className="px-4 py-10 text-center text-sm text-gray-500"
// //                       >
// //                         No data found
// //                       </td>

// //                     </tr>
// //                   )}

// //                 </tbody>

// //               </table>

// //             </div>
// //           </div>
// //         </div>

// //         {/* Pagination */}
// //         <div className="flex justify-end border-t border-[#e1e5ea] px-4 py-3">

// //           <Pagination
// //             currentPage={currentPage}
// //             totalPages={totalPages}
// //             onPageChange={handlePageChange}
// //           />

// //         </div>

// //       </div>
// //     </div>
// //   )
// // }

// // export default AvailableStock



// // import React, { useState, useRef, useEffect } from 'react'
// // import { useNavigate } from 'react-router-dom'
// // import {
// //   ArrowUp,
// //   ArrowDown,
// //   Search,
// //   RotateCcw,
// //   FileSpreadsheet,
// //   Printer,
// //   X,
// //   Info,
// // } from 'lucide-react'

// // import axiosInstance from '../../axiosInstance'
// // import Pagination from '../../utils/Pagination'
// // import { showError, showSuccess } from '../../utils/sweetAlerts'
// // import SearchCenterStock from './SearchCenterStock'

// // const AvailableStock = () => {
// //   const navigate = useNavigate()

// //   // Open the transfer history for this exact product and center.
// //   // Keep the legacy frontend's report-filter contract: these report pages
// //   // filter by product/center names, not the stock row's MongoDB IDs.
// //   const handleStockClick = (item) => {
// //     if (!(Number(item.availableQuantity) > 0)) return

// //     const productName = item.productName || item.product?.productTitle || ''
// //     const centerName = item.centerName || item.center?.centerName || ''

// //     if (!productName || !centerName) {
// //       showError('Unable to open transfer history: product or center name is missing.')
// //       return
// //     }

// //     const params = new URLSearchParams({
// //       product: productName,
// //       center: centerName,
// //       productName,
// //       centerName,
// //       transferType: 'given',
// //     })

// //     navigate(`/transfer-detail?${params.toString()}`)
// //   }

// //   // Use the same destination and name-based filters as the legacy frontend.
// //   const handleDamageClick = (item) => {
// //     if (!(Number(item.damagedQuantity) > 0)) return

// //     const productName = item.productName || item.product?.productTitle || ''
// //     const centerName = item.centerName || item.center?.centerName || ''

// //     if (!productName || !centerName) {
// //       showError('Unable to open damage history: product or center name is missing.')
// //       return
// //     }

// //     const params = new URLSearchParams({
// //       product: productName,
// //       center: centerName,
// //       usageType: 'Damage',
// //       productName,
// //       centerName,
// //     })

// //     navigate(`/transaction-report?${params.toString()}`)
// //   }

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

// //   const [exportModalVisible, setExportModalVisible] = useState(false)
// //   const [exportStartDate, setExportStartDate] = useState('')
// //   const [exportEndDate, setExportEndDate] = useState('')

// //   const [activeSearch, setActiveSearch] = useState({
// //     product: '',
// //     center: '',
// //     resellerId: '',
// //     startDate: '',
// //     endDate: '',
// //   })

// //   const [dropdownOpen, setDropdownOpen] = useState({})
// //   const [currentPage, setCurrentPage] = useState(1)
// //   const [totalPages, setTotalPages] = useState(1)

// //   const dropdownRefs = useRef({})

// //   // =========================
// //   // Fetch Available Stock
// //   // =========================
// //   const fetchData = async (searchParams = {}, page = 1) => {
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

// //       if (searchParams.resellerId) {
// //         params.append('resellerId', searchParams.resellerId)
// //       }

// //       if (searchParams.startDate) {
// //         params.append('startDate', searchParams.startDate)
// //       }

// //       if (searchParams.endDate) {
// //         params.append('endDate', searchParams.endDate)
// //       }

// //       params.append('page', page)

// //       const url = params.toString()
// //         ? `/availableStock/availableStock?${params.toString()}`
// //         : '/availableStock/availableStock'

// //       const response = await axiosInstance.get(url)

// //       if (response.data.success) {
// //         setData(response.data.data.stock)
// //         setCurrentPage(response.data.data.pagination.currentPage)
// //         setTotalPages(response.data.data.pagination.totalPages)
// //       } else {
// //         const errorMessage =
// //           response.data.message || 'API returned unsuccessful response'

// //         setError(errorMessage)
// //         console.error('Backend error:', response.data)
// //       }
// //     } catch (err) {
// //       if (err.response) {
// //         const errorMessage =
// //           err.response.data?.message ||
// //           err.response.data?.error ||
// //           `Error ${err.response.status}: ${err.response.statusText}`

// //         setError(errorMessage)
// //         console.error('Error response:', err.response.data)
// //       } else if (err.request) {
// //         setError(
// //           'No response received from server. Please check your network connection.',
// //         )
// //         console.error('Error request:', err.request)
// //       } else {
// //         setError(err.message || 'An error occurred while fetching data')
// //         console.error('Error message:', err.message)
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
// //       const response = await axiosInstance.get('/centers')

// //       if (response.data.success) {
// //         setCenters(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error('Error fetching centers:', error)
// //     }
// //   }

// //   // =========================
// //   // Fetch Products
// //   // =========================
// //   const fetchProducts = async () => {
// //     try {
// //       const response = await axiosInstance.get('/products/all')

// //       if (response.data.success) {
// //         setProducts(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error('Error fetching products:', error)
// //     }
// //   }

// //   // =========================
// //   // Fetch Resellers
// //   // =========================
// //   const fetchResellers = async () => {
// //     try {
// //       const response = await axiosInstance.get('/resellers')

// //       if (response.data.success) {
// //         setResellers(response.data.data)
// //       }
// //     } catch (error) {
// //       console.error('Error fetching resellers:', error)
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
// //         return direction === 'ascending' ? -1 : 1
// //       }

// //       if (aValue > bValue) {
// //         return direction === 'ascending' ? 1 : -1
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
// //       resellerId: '',
// //       startDate: '',
// //       endDate: '',
// //     })

// //     setSearchTerm('')

// //     fetchData({}, 1)
// //   }

// //   // =========================
// //   // Export Modal
// //   // =========================
// //   const openExportModal = () => {
// //     setExportStartDate(activeSearch.startDate || '')
// //     setExportEndDate(activeSearch.endDate || '')
// //     setExportModalVisible(true)
// //   }

// //   // =========================
// //   // Generate Export
// //   // =========================
// //   const generateDetailExport = async () => {
// //     try {
// //       setLoading(true)

// //       if (
// //         exportStartDate &&
// //         exportEndDate &&
// //         exportStartDate > exportEndDate
// //       ) {
// //         showError('Start date cannot be greater than end date')
// //         setLoading(false)
// //         return
// //       }

// //       const params = new URLSearchParams()

// //       if (exportStartDate) {
// //         params.append('startDate', exportStartDate)
// //       }

// //       if (exportEndDate) {
// //         params.append('endDate', exportEndDate)
// //       }

// //       params.append('export', 'true')

// //       const apiUrl = `/availableStock/availableStock?${params.toString()}`

// //       console.log('Export API URL:', apiUrl)

// //       const response = await axiosInstance.get(apiUrl, {
// //         responseType: 'blob',
// //       })

// //       if (response.data instanceof Blob) {
// //         let filename = 'available_stock_export'

// //         if (exportStartDate && exportEndDate) {
// //           filename += `_${exportStartDate}_to_${exportEndDate}`
// //         } else if (exportStartDate) {
// //           filename += `_from_${exportStartDate}`
// //         } else if (exportEndDate) {
// //           filename += `_until_${exportEndDate}`
// //         } else {
// //           filename += `_${new Date().toISOString().split('T')[0]}`
// //         }

// //         const contentType = response.headers['content-type']

// //         if (
// //           contentType ===
// //           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// //         ) {
// //           filename += '.xlsx'
// //         } else if (contentType === 'application/vnd.ms-excel') {
// //           filename += '.xls'
// //         } else {
// //           filename += '.xlsx'
// //         }

// //         const blob = new Blob([response.data], {
// //           type: contentType,
// //         })

// //         const link = document.createElement('a')
// //         const downloadUrl = URL.createObjectURL(blob)

// //         link.setAttribute('href', downloadUrl)
// //         link.setAttribute('download', filename)
// //         link.style.visibility = 'hidden'

// //         document.body.appendChild(link)
// //         link.click()
// //         document.body.removeChild(link)

// //         URL.revokeObjectURL(downloadUrl)

// //         showSuccess('Export completed successfully!')

// //         setExportModalVisible(false)
// //         setExportStartDate('')
// //         setExportEndDate('')
// //       } else {
// //         throw new Error('Unexpected response format from server')
// //       }
// //     } catch (error) {
// //       console.error('Error generating export:', error)

// //       let errorMessage = 'Error generating export file'

// //       if (
// //         error.response &&
// //         error.response.data instanceof Blob
// //       ) {
// //         try {
// //           const text = await error.response.data.text()
// //           const parsed = JSON.parse(text)

// //           errorMessage =
// //             parsed.message ||
// //             parsed.error ||
// //             errorMessage
// //         } catch (e) {
// //           errorMessage =
// //             error.response.statusText || errorMessage
// //         }
// //       } else if (error.message) {
// //         errorMessage = error.message
// //       }

// //       showError(errorMessage)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // =========================
// //   // Local Search
// //   // =========================
// //   const filteredData = data.filter((item) => {
// //     if (
// //       activeSearch.product ||
// //       activeSearch.center ||
// //       activeSearch.resellerId ||
// //       activeSearch.startDate ||
// //       activeSearch.endDate
// //     ) {
// //       return true
// //     }

// //     return Object.values(item).some((value) => {
// //       if (typeof value === 'object' && value !== null) {
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

// //       Object.keys(dropdownRefs.current).forEach((key) => {
// //         if (
// //           dropdownRefs.current[key] &&
// //           !dropdownRefs.current[key].contains(event.target)
// //         ) {
// //           newDropdownState[key] = false
// //           shouldUpdate = true
// //         }
// //       })

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
// //       <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// //         {error}
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

// //       {/* Export dropdown animation */}
// //       <style>
// //         {`
// //           @keyframes exportStockDropDown {
// //             from {
// //               opacity: 0;
// //               transform: translateY(-70px);
// //             }
// //             to {
// //               opacity: 1;
// //               transform: translateY(0);
// //             }
// //           }

// //           .export-stock-dropdown {
// //             animation: exportStockDropDown 0.3s ease-out;
// //           }
// //         `}
// //       </style>

// //       {/* Page Title */}
// //       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
// //         Available Stock
// //       </div>

// //       {/* Search Modal */}
// //       <SearchCenterStock
// //         visible={searchModalVisible}
// //         onClose={() => setSearchModalVisible(false)}
// //         onSearch={handleSearch}
// //         centers={centers}
// //         products={products}
// //         resellers={resellers}
// //       />

// //       {/* =====================================================
// //           EXPORT STOCK DATA MODAL
// //           ONLY OPENING FUNCTIONALITY CHANGED
// //           ===================================================== */}
// //       {exportModalVisible && (
// //         <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-8">

// //           <div className="export-stock-dropdown w-full max-w-[500px] overflow-hidden rounded-[7px] bg-white shadow-2xl">

// //             {/* Modal Header */}
// //             <div className="flex h-[63px] items-center justify-between border-b border-[#dee2e6] px-4">

// //               <h3 className="text-[22px] font-normal text-[#343a40]">
// //                 Export Stock Data
// //               </h3>

// //               <button
// //                 type="button"
// //                 onClick={() => setExportModalVisible(false)}
// //                 className="flex h-8 w-8 items-center justify-center text-[#888] transition hover:text-[#555]"
// //               >
// //                 <X
// //                   className="h-[25px] w-[25px]"
// //                   strokeWidth={2}
// //                 />
// //               </button>

// //             </div>

// //             {/* Modal Body */}
// //             <div className="px-4 py-4">

// //               {/* Start Date */}
// //               <div className="mb-4">

// //                 <label
// //                   htmlFor="exportStartDate"
// //                   className="mb-2 block text-[14px] font-bold text-[#343a40]"
// //                 >
// //                   Start Date (Optional)
// //                 </label>

// //                 <input
// //                   type="date"
// //                   id="exportStartDate"
// //                   value={exportStartDate}
// //                   onChange={(e) =>
// //                     setExportStartDate(e.target.value)
// //                   }
// //                   className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
// //                 />

// //                 <p className="mt-1 text-[13px] text-[#6c757d]">
// //                   Leave empty to include all records from beginning
// //                 </p>

// //               </div>

// //               {/* End Date */}
// //               <div className="mb-4">

// //                 <label
// //                   htmlFor="exportEndDate"
// //                   className="mb-2 block text-[14px] font-bold text-[#343a40]"
// //                 >
// //                   End Date (Optional)
// //                 </label>

// //                 <input
// //                   type="date"
// //                   id="exportEndDate"
// //                   value={exportEndDate}
// //                   onChange={(e) =>
// //                     setExportEndDate(e.target.value)
// //                   }
// //                   className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
// //                 />

// //                 <p className="mt-1 text-[13px] text-[#6c757d]">
// //                   Leave empty to include all records until today
// //                 </p>

// //               </div>

// //               {/* Information Box */}
// //               <div className="flex gap-2 rounded-[5px] bg-[#e7f3ff] px-2 py-3 text-[13px] leading-5 text-[#007bff]">

// //                 <Info className="mt-[2px] h-[15px] w-[15px] shrink-0" />

// //                 <span>
// //                   <span className="font-medium">Note:</span>{' '}
// //                   Export will include all centers, products,
// //                   and resellers within the selected date range.
// //                 </span>

// //               </div>

// //             </div>

// //             {/* Modal Footer */}
// //             <div className="flex justify-end gap-2 border-t border-[#dee2e6] px-4 py-3">

// //               <button
// //                 type="button"
// //                 onClick={() => setExportModalVisible(false)}
// //                 className="h-[38px] rounded-[5px] bg-[#6c757d] px-4 text-[14px] font-medium text-white transition hover:bg-[#5a6268]"
// //               >
// //                 Cancel
// //               </button>

// //               <button
// //                 type="button"
// //                 onClick={generateDetailExport}
// //                 className="h-[38px] rounded-[5px] bg-[#5b55d9] px-4 text-[14px] font-medium text-white transition hover:bg-[#4d47c7]"
// //               >
// //                 Export
// //               </button>

// //             </div>

// //           </div>
// //         </div>
// //       )}

// //       {/* Main Card */}
// //       <div className="mt-0 overflow-hidden border border-[#e1e5ea] border-t-[4px] border-t-[#2f5fa7] bg-white">

// //         {/* Action Toolbar */}
// //         <div className="flex min-h-[51px] flex-wrap items-center gap-1 border-b border-[#d9dde3] px-3 py-2">

// //           {/* Search */}
// //           <button
// //             type="button"
// //             onClick={() => setSearchModalVisible(true)}
// //             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
// //           >
// //             <Search className="h-[16px] w-[16px]" />
// //             Search
// //           </button>

// //           {/* Reset */}
// //           {(activeSearch.product ||
// //             activeSearch.center ||
// //             activeSearch.resellerId ||
// //             activeSearch.startDate ||
// //             activeSearch.endDate) && (
// //             <button
// //               type="button"
// //               onClick={handleResetSearch}
// //               className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
// //             >
// //               <RotateCcw className="h-[15px] w-[15px]" />
// //               Reset Search
// //             </button>
// //           )}

// //           {/* Export */}
// //           <button
// //             type="button"
// //             onClick={openExportModal}
// //             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
// //           >
// //             <FileSpreadsheet className="h-[15px] w-[15px]" />
// //             Export
// //           </button>

// //           {/* Print */}
// //           <button
// //             type="button"
// //             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
// //           >
// //             <Printer className="h-[15px] w-[15px]" />
// //             Print
// //           </button>

// //         </div>

// //         {/* Search / active-filter row */}
// //         <div className="flex min-h-[62px] items-center justify-between px-4 py-3">

// //           <div className="min-w-0 text-[13px] text-[#666]">

// //             {(activeSearch.resellerId ||
// //               activeSearch.startDate ||
// //               activeSearch.endDate) && (
// //               <div>

// //                 {activeSearch.resellerId &&
// //                   `Reseller: ${
// //                     resellers.find(
// //                       (r) => r._id === activeSearch.resellerId,
// //                     )?.businessName || activeSearch.resellerId
// //                   } | `}

// //                 {activeSearch.startDate &&
// //                   `From: ${activeSearch.startDate} | `}

// //                 {activeSearch.endDate &&
// //                   `To: ${activeSearch.endDate}`}

// //               </div>
// //             )}

// //           </div>

// //           {/* Local Search */}
// //           <div className="ml-auto flex shrink-0 items-center gap-1.5">

// //             <label
// //               htmlFor="available-stock-search"
// //               className="text-[14px] font-bold text-[#202020]"
// //             >
// //               Search:
// //             </label>

// //             <input
// //               id="available-stock-search"
// //               type="text"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="h-[30px] w-[220px] border border-[#d5dbe3] bg-white px-2 text-[13px] text-[#222] outline-none focus:border-[#2f5fa7]"
// //             />

// //           </div>

// //         </div>

// //         {/* Table */}
// //         <div className="px-4">

// //           <div className="w-full overflow-hidden border border-[#eeeeee]">

// //             <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">

// //               <table className="w-full table-fixed border-collapse">

// //                 <colgroup>
// //                   <col style={{ width: '17%' }} />
// //                   <col style={{ width: '36%' }} />
// //                   <col style={{ width: '30%' }} />
// //                   <col style={{ width: '7%' }} />
// //                   <col style={{ width: '10%' }} />
// //                 </colgroup>

// //                 <thead className="sticky top-0 z-20">

// //                   <tr>

// //                     <th
// //                       scope="col"
// //                       onClick={() => handleSort('outlet')}
// //                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                     >
// //                       <div className="flex items-center gap-1">
// //                         <span>Branch</span>
// //                         {getSortIcon('outlet')}
// //                       </div>
// //                     </th>

// //                     <th
// //                       scope="col"
// //                       onClick={() => handleSort('date')}
// //                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                     >
// //                       <div className="flex items-center gap-1">
// //                         <span>Product</span>
// //                         {getSortIcon('date')}
// //                       </div>
// //                     </th>

// //                     <th
// //                       scope="col"
// //                       onClick={() => handleSort('invoiceNo')}
// //                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                     >
// //                       <div className="flex items-center gap-1">
// //                         <span>Category</span>
// //                         {getSortIcon('invoiceNo')}
// //                       </div>
// //                     </th>

// //                     <th
// //                       scope="col"
// //                       onClick={() =>
// //                         handleSort('vendor.businessName')
// //                       }
// //                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                     >
// //                       <div className="flex items-center gap-1">
// //                         <span>Stock</span>
// //                         {getSortIcon('vendor.businessName')}
// //                       </div>
// //                     </th>

// //                     <th
// //                       scope="col"
// //                       onClick={() =>
// //                         handleSort('damagedQuantity')
// //                       }
// //                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
// //                     >
// //                       <div className="flex items-center gap-1">
// //                         <span>Damage</span>
// //                         {getSortIcon('damagedQuantity')}
// //                       </div>
// //                     </th>

// //                   </tr>

// //                 </thead>

// //                 <tbody>

// //                   {filteredData.length > 0 ? (
// //                     filteredData.map((item, index) => (
// //                       <tr
// //                         key={item._id}
// //                         className={`transition ${
// //                           index % 2 === 0
// //                             ? 'bg-[#f1f1f1]'
// //                             : 'bg-white'
// //                         }`}
// //                       >

// //                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                           <div className="break-words">
// //                             {item.centerName || ''}
// //                           </div>
// //                         </td>

// //                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                           <div className="break-words">
// //                             {item.productName}
// //                           </div>
// //                         </td>

// //                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                           <div className="break-words">
// //                             {item.productCategory?.name || ''}
// //                           </div>
// //                         </td>

// //                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                           <button
// //                             type="button"
// //                             onClick={() => handleStockClick(item)}
// //                             title="View stock transfer history"
// //                             className="cursor-pointer rounded text-blue-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                           >
// //                             {item.availableQuantity || 0}
// //                           </button>
// //                         </td>

// //                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
// //                           <button
// //                             type="button"
// //                             onClick={() => handleDamageClick(item)}
// //                             title="View damage history"
// //                             className="cursor-pointer rounded text-blue-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                           >
// //                             {item.damagedQuantity || 0}
// //                           </button>
// //                         </td>

// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr>

// //                       <td
// //                         colSpan={5}
// //                         className="px-4 py-10 text-center text-sm text-gray-500"
// //                       >
// //                         No data found
// //                       </td>

// //                     </tr>
// //                   )}

// //                 </tbody>

// //               </table>

// //             </div>
// //           </div>
// //         </div>

// //         {/* Pagination */}
// //         <div className="flex justify-end border-t border-[#e1e5ea] px-4 py-3">

// //           <Pagination
// //             currentPage={currentPage}
// //             totalPages={totalPages}
// //             onPageChange={handlePageChange}
// //           />

// //         </div>

// //       </div>
// //     </div>
// //   )
// // }

// // export default AvailableStock



// import React, { useState, useRef, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   ArrowUp,
//   ArrowDown,
//   Search,
//   RotateCcw,
//   FileSpreadsheet,
//   Printer,
//   X,
//   Info,
// } from 'lucide-react'

// import axiosInstance from '../../axiosInstance'
// import Pagination from '../../utils/Pagination'
// import { showError, showSuccess } from '../../utils/sweetAlerts'
// import SearchCenterStock from './SearchCenterStock'

// const AvailableStock = () => {
//   const navigate = useNavigate()

//   // Resolve MongoDB IDs from the stock row or the loaded lookup lists.
//   const getId = (value) => {
//     if (!value) return "";
//     if (typeof value === "string") return value;
//     if (typeof value === "object") return String(value._id || value.id || "");
//     return "";
//   };

//   const getRowDetails = (item) => {
//     const centerIdFromRow = getId(item.center?._id || item.center || item.centerId);
//     const productIdFromRow = getId(item.product?._id || item.product || item.productId);

//     const centerObj =
//       centers.find((center) => String(center._id) === centerIdFromRow) ||
//       centers.find((center) => center.centerName === item.centerName);

//     const productObj =
//       products.find((product) => String(product._id) === productIdFromRow) ||
//       products.find((product) => product.productTitle === item.productName);

//     return {
//       centerId: centerIdFromRow || getId(centerObj?._id),
//       productId: productIdFromRow || getId(productObj?._id),
//       centerName: item.centerName || centerObj?.centerName || "",
//       productName: item.productName || productObj?.productTitle || "",
//       centerType: item.centerType || item.center?.centerType || centerObj?.centerType || "",
//     };
//   };

//   // Stock Qty: outlet/warehouse stock opens transfer history.
//   // Branch stock opens usage history, with a broad date range.
//   const handleStockClick = (item) => {
//     if (!(Number(item.availableQuantity) > 0)) return;

//     const details = getRowDetails(item);
//     const { centerId, productId, centerName, productName, centerType } = details;

//     if (!centerId || !productId) {
//       console.error("Missing center/product ID for Available Stock row:", item, details);
//       showError("Unable to open details: center or product ID is missing.");
//       return;
//     }

//     const isWarehouse = String(centerType).toLowerCase() === "outlet";

//     if (isWarehouse) {
//       const params = new URLSearchParams({
//         product: productId,
//         center: centerId,
//         productName,
//         centerName,
//         transferType: "given",
//       });
//       navigate(`/transfer-detail?${params.toString()}`);
//       return;
//     }

//     const today = new Date();
//     const pad = (number) => String(number).padStart(2, "0");
//     const endDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

//     const params = new URLSearchParams({
//       productId,
//       centerId,
//       productName,
//       centerName,
//       startDate: "2020-01-01",
//       endDate,
//     });
//     navigate(`/usage-detail?${params.toString()}`);
//   };

//   // Damage Qty opens Usage Details filtered to Damage records.
//   const handleDamageClick = (item) => {
//     if (!(Number(item.damagedQuantity) > 0)) return;

//     const { centerId, productId, centerName, productName } = getRowDetails(item);

//     if (!centerId || !productId) {
//       console.error("Missing center/product ID for damage history:", item);
//       showError("Unable to open damage history: center or product ID is missing.");
//       return;
//     }

//     const today = new Date();
//     const pad = (number) => String(number).padStart(2, "0");
//     const endDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

//     const params = new URLSearchParams({
//       productId,
//       centerId,
//       productName,
//       centerName,
//       usageType: "Damage",
//       startDate: "2020-01-01",
//       endDate,
//     });
//     navigate(`/usage-detail?${params.toString()}`);
//   };

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

//   const [exportModalVisible, setExportModalVisible] = useState(false)
//   const [exportStartDate, setExportStartDate] = useState('')
//   const [exportEndDate, setExportEndDate] = useState('')

//   const [activeSearch, setActiveSearch] = useState({
//     product: '',
//     center: '',
//     resellerId: '',
//     startDate: '',
//     endDate: '',
//   })

//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const dropdownRefs = useRef({})

//   // =========================
//   // Fetch Available Stock
//   // =========================
//   const fetchData = async (searchParams = {}, page = 1) => {
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

//       if (searchParams.resellerId) {
//         params.append('resellerId', searchParams.resellerId)
//       }

//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate)
//       }

//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/availableStock/availableStock?${params.toString()}`
//         : '/availableStock/availableStock'

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         setData(response.data.data.stock)
//         setCurrentPage(response.data.data.pagination.currentPage)
//         setTotalPages(response.data.data.pagination.totalPages)
//       } else {
//         const errorMessage =
//           response.data.message || 'API returned unsuccessful response'

//         setError(errorMessage)
//         console.error('Backend error:', response.data)
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage =
//           err.response.data?.message ||
//           err.response.data?.error ||
//           `Error ${err.response.status}: ${err.response.statusText}`

//         setError(errorMessage)
//         console.error('Error response:', err.response.data)
//       } else if (err.request) {
//         setError(
//           'No response received from server. Please check your network connection.',
//         )
//         console.error('Error request:', err.request)
//       } else {
//         setError(err.message || 'An error occurred while fetching data')
//         console.error('Error message:', err.message)
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
//       const response = await axiosInstance.get('/centers')

//       if (response.data.success) {
//         setCenters(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error)
//     }
//   }

//   // =========================
//   // Fetch Products
//   // =========================
//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all')

//       if (response.data.success) {
//         setProducts(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error)
//     }
//   }

//   // =========================
//   // Fetch Resellers
//   // =========================
//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers')

//       if (response.data.success) {
//         setResellers(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching resellers:', error)
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
//         return direction === 'ascending' ? -1 : 1
//       }

//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1
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
//       resellerId: '',
//       startDate: '',
//       endDate: '',
//     })

//     setSearchTerm('')

//     fetchData({}, 1)
//   }

//   // =========================
//   // Export Modal
//   // =========================
//   const openExportModal = () => {
//     setExportStartDate(activeSearch.startDate || '')
//     setExportEndDate(activeSearch.endDate || '')
//     setExportModalVisible(true)
//   }

//   // =========================
//   // Generate Export
//   // =========================
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true)

//       if (
//         exportStartDate &&
//         exportEndDate &&
//         exportStartDate > exportEndDate
//       ) {
//         showError('Start date cannot be greater than end date')
//         setLoading(false)
//         return
//       }

//       const params = new URLSearchParams()

//       if (exportStartDate) {
//         params.append('startDate', exportStartDate)
//       }

//       if (exportEndDate) {
//         params.append('endDate', exportEndDate)
//       }

//       params.append('export', 'true')

//       const apiUrl = `/availableStock/availableStock?${params.toString()}`

//       console.log('Export API URL:', apiUrl)

//       const response = await axiosInstance.get(apiUrl, {
//         responseType: 'blob',
//       })

//       if (response.data instanceof Blob) {
//         let filename = 'available_stock_export'

//         if (exportStartDate && exportEndDate) {
//           filename += `_${exportStartDate}_to_${exportEndDate}`
//         } else if (exportStartDate) {
//           filename += `_from_${exportStartDate}`
//         } else if (exportEndDate) {
//           filename += `_until_${exportEndDate}`
//         } else {
//           filename += `_${new Date().toISOString().split('T')[0]}`
//         }

//         const contentType = response.headers['content-type']

//         if (
//           contentType ===
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         ) {
//           filename += '.xlsx'
//         } else if (contentType === 'application/vnd.ms-excel') {
//           filename += '.xls'
//         } else {
//           filename += '.xlsx'
//         }

//         const blob = new Blob([response.data], {
//           type: contentType,
//         })

//         const link = document.createElement('a')
//         const downloadUrl = URL.createObjectURL(blob)

//         link.setAttribute('href', downloadUrl)
//         link.setAttribute('download', filename)
//         link.style.visibility = 'hidden'

//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)

//         URL.revokeObjectURL(downloadUrl)

//         showSuccess('Export completed successfully!')

//         setExportModalVisible(false)
//         setExportStartDate('')
//         setExportEndDate('')
//       } else {
//         throw new Error('Unexpected response format from server')
//       }
//     } catch (error) {
//       console.error('Error generating export:', error)

//       let errorMessage = 'Error generating export file'

//       if (
//         error.response &&
//         error.response.data instanceof Blob
//       ) {
//         try {
//           const text = await error.response.data.text()
//           const parsed = JSON.parse(text)

//           errorMessage =
//             parsed.message ||
//             parsed.error ||
//             errorMessage
//         } catch (e) {
//           errorMessage =
//             error.response.statusText || errorMessage
//         }
//       } else if (error.message) {
//         errorMessage = error.message
//       }

//       showError(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // =========================
//   // Local Search
//   // =========================
//   const filteredData = data.filter((item) => {
//     if (
//       activeSearch.product ||
//       activeSearch.center ||
//       activeSearch.resellerId ||
//       activeSearch.startDate ||
//       activeSearch.endDate
//     ) {
//       return true
//     }

//     return Object.values(item).some((value) => {
//       if (typeof value === 'object' && value !== null) {
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

//       Object.keys(dropdownRefs.current).forEach((key) => {
//         if (
//           dropdownRefs.current[key] &&
//           !dropdownRefs.current[key].contains(event.target)
//         ) {
//           newDropdownState[key] = false
//           shouldUpdate = true
//         }
//       })

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
//       <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

//       {/* Export dropdown animation */}
//       <style>
//         {`
//           @keyframes exportStockDropDown {
//             from {
//               opacity: 0;
//               transform: translateY(-70px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           .export-stock-dropdown {
//             animation: exportStockDropDown 0.3s ease-out;
//           }
//         `}
//       </style>

//       {/* Page Title */}
//       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//         Available Stock
//       </div>

//       {/* Search Modal */}
//       <SearchCenterStock
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//         resellers={resellers}
//       />

//       {/* =====================================================
//           EXPORT STOCK DATA MODAL
//           ONLY OPENING FUNCTIONALITY CHANGED
//           ===================================================== */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-8">

//           <div className="export-stock-dropdown w-full max-w-[500px] overflow-hidden rounded-[7px] bg-white shadow-2xl">

//             {/* Modal Header */}
//             <div className="flex h-[63px] items-center justify-between border-b border-[#dee2e6] px-4">

//               <h3 className="text-[22px] font-normal text-[#343a40]">
//                 Export Stock Data
//               </h3>

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="flex h-8 w-8 items-center justify-center text-[#888] transition hover:text-[#555]"
//               >
//                 <X
//                   className="h-[25px] w-[25px]"
//                   strokeWidth={2}
//                 />
//               </button>

//             </div>

//             {/* Modal Body */}
//             <div className="px-4 py-4">

//               {/* Start Date */}
//               <div className="mb-4">

//                 <label
//                   htmlFor="exportStartDate"
//                   className="mb-2 block text-[14px] font-bold text-[#343a40]"
//                 >
//                   Start Date (Optional)
//                 </label>

//                 <input
//                   type="date"
//                   id="exportStartDate"
//                   value={exportStartDate}
//                   onChange={(e) =>
//                     setExportStartDate(e.target.value)
//                   }
//                   className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
//                 />

//                 <p className="mt-1 text-[13px] text-[#6c757d]">
//                   Leave empty to include all records from beginning
//                 </p>

//               </div>

//               {/* End Date */}
//               <div className="mb-4">

//                 <label
//                   htmlFor="exportEndDate"
//                   className="mb-2 block text-[14px] font-bold text-[#343a40]"
//                 >
//                   End Date (Optional)
//                 </label>

//                 <input
//                   type="date"
//                   id="exportEndDate"
//                   value={exportEndDate}
//                   onChange={(e) =>
//                     setExportEndDate(e.target.value)
//                   }
//                   className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
//                 />

//                 <p className="mt-1 text-[13px] text-[#6c757d]">
//                   Leave empty to include all records until today
//                 </p>

//               </div>

//               {/* Information Box */}
//               <div className="flex gap-2 rounded-[5px] bg-[#e7f3ff] px-2 py-3 text-[13px] leading-5 text-[#007bff]">

//                 <Info className="mt-[2px] h-[15px] w-[15px] shrink-0" />

//                 <span>
//                   <span className="font-medium">Note:</span>{' '}
//                   Export will include all centers, products,
//                   and resellers within the selected date range.
//                 </span>

//               </div>

//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-2 border-t border-[#dee2e6] px-4 py-3">

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="h-[38px] rounded-[5px] bg-[#6c757d] px-4 text-[14px] font-medium text-white transition hover:bg-[#5a6268]"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={generateDetailExport}
//                 className="h-[38px] rounded-[5px] bg-[#5b55d9] px-4 text-[14px] font-medium text-white transition hover:bg-[#4d47c7]"
//               >
//                 Export
//               </button>

//             </div>

//           </div>
//         </div>
//       )}

//       {/* Main Card */}
//       <div className="mt-0 overflow-hidden border border-[#e1e5ea] border-t-[4px] border-t-[#2f5fa7] bg-white">

//         {/* Action Toolbar */}
//         <div className="flex min-h-[51px] flex-wrap items-center gap-1 border-b border-[#d9dde3] px-3 py-2">

//           {/* Search */}
//           <button
//             type="button"
//             onClick={() => setSearchModalVisible(true)}
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <Search className="h-[16px] w-[16px]" />
//             Search
//           </button>

//           {/* Reset */}
//           {(activeSearch.product ||
//             activeSearch.center ||
//             activeSearch.resellerId ||
//             activeSearch.startDate ||
//             activeSearch.endDate) && (
//             <button
//               type="button"
//               onClick={handleResetSearch}
//               className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//             >
//               <RotateCcw className="h-[15px] w-[15px]" />
//               Reset Search
//             </button>
//           )}

//           {/* Export */}
//           <button
//             type="button"
//             onClick={openExportModal}
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <FileSpreadsheet className="h-[15px] w-[15px]" />
//             Export
//           </button>

//           {/* Print */}
//           <button
//             type="button"
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <Printer className="h-[15px] w-[15px]" />
//             Print
//           </button>

//         </div>

//         {/* Search / active-filter row */}
//         <div className="flex min-h-[62px] items-center justify-between px-4 py-3">

//           <div className="min-w-0 text-[13px] text-[#666]">

//             {(activeSearch.resellerId ||
//               activeSearch.startDate ||
//               activeSearch.endDate) && (
//               <div>

//                 {activeSearch.resellerId &&
//                   `Reseller: ${
//                     resellers.find(
//                       (r) => r._id === activeSearch.resellerId,
//                     )?.businessName || activeSearch.resellerId
//                   } | `}

//                 {activeSearch.startDate &&
//                   `From: ${activeSearch.startDate} | `}

//                 {activeSearch.endDate &&
//                   `To: ${activeSearch.endDate}`}

//               </div>
//             )}

//           </div>

//           {/* Local Search */}
//           <div className="ml-auto flex shrink-0 items-center gap-1.5">

//             <label
//               htmlFor="available-stock-search"
//               className="text-[14px] font-bold text-[#202020]"
//             >
//               Search:
//             </label>

//             <input
//               id="available-stock-search"
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="h-[30px] w-[220px] border border-[#d5dbe3] bg-white px-2 text-[13px] text-[#222] outline-none focus:border-[#2f5fa7]"
//             />

//           </div>

//         </div>

//         {/* Table */}
//         <div className="px-4">

//           <div className="w-full overflow-hidden border border-[#eeeeee]">

//             <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">

//               <table className="w-full table-fixed border-collapse">

//                 <colgroup>
//                   <col style={{ width: '17%' }} />
//                   <col style={{ width: '36%' }} />
//                   <col style={{ width: '30%' }} />
//                   <col style={{ width: '7%' }} />
//                   <col style={{ width: '10%' }} />
//                 </colgroup>

//                 <thead className="sticky top-0 z-20">

//                   <tr>

//                     <th
//                       scope="col"
//                       onClick={() => handleSort('outlet')}
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Branch</span>
//                         {getSortIcon('outlet')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() => handleSort('date')}
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Product</span>
//                         {getSortIcon('date')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() => handleSort('invoiceNo')}
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Category</span>
//                         {getSortIcon('invoiceNo')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort('vendor.businessName')
//                       }
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Stock</span>
//                         {getSortIcon('vendor.businessName')}
//                       </div>
//                     </th>

//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort('damagedQuantity')
//                       }
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Damage</span>
//                         {getSortIcon('damagedQuantity')}
//                       </div>
//                     </th>

//                   </tr>

//                 </thead>

//                 <tbody>

//                   {filteredData.length > 0 ? (
//                     filteredData.map((item, index) => (
//                       <tr
//                         key={item._id}
//                         className={`transition ${
//                           index % 2 === 0
//                             ? 'bg-[#f1f1f1]'
//                             : 'bg-white'
//                         }`}
//                       >

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.centerName || ''}
//                           </div>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.productName}
//                           </div>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.productCategory?.name || ''}
//                           </div>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <button
//                             type="button"
//                             onClick={() => handleStockClick(item)}
//                             title="View stock transfer history"
//                             className="cursor-pointer rounded text-blue-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           >
//                             {item.availableQuantity || 0}
//                           </button>
//                         </td>

//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <button
//                             type="button"
//                             onClick={() => handleDamageClick(item)}
//                             title="View damage history"
//                             className="cursor-pointer rounded text-blue-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           >
//                             {item.damagedQuantity || 0}
//                           </button>
//                         </td>

//                       </tr>
//                     ))
//                   ) : (
//                     <tr>

//                       <td
//                         colSpan={5}
//                         className="px-4 py-10 text-center text-sm text-gray-500"
//                       >
//                         No data found
//                       </td>

//                     </tr>
//                   )}

//                 </tbody>

//               </table>

//             </div>
//           </div>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-end border-t border-[#e1e5ea] px-4 py-3">

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />

//         </div>

//       </div>
//     </div>
//   )
// }

// export default AvailableStock






import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowUp,
  ArrowDown,
  Search,
  RotateCcw,
  FileSpreadsheet,
  Printer,
  X,
  Info,
} from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import Pagination from '../../utils/Pagination'
import { showError, showSuccess } from '../../utils/sweetAlerts'
import SearchCenterStock from './SearchCenterStock'

const AvailableStock = () => {
  const navigate = useNavigate()

  // Resolve MongoDB IDs from the stock row or the loaded lookup lists.
  const getId = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") return String(value._id || value.id || "");
    return "";
  };

  const getRowDetails = (item) => {
    const centerIdFromRow = getId(item.center?._id || item.center || item.centerId);
    const productIdFromRow = getId(item.product?._id || item.product || item.productId);

    const centerObj =
      centers.find((center) => String(center._id) === centerIdFromRow) ||
      centers.find((center) => center.centerName === item.centerName);

    const productObj =
      products.find((product) => String(product._id) === productIdFromRow) ||
      products.find((product) => product.productTitle === item.productName);

    return {
      centerId: centerIdFromRow || getId(centerObj?._id),
      productId: productIdFromRow || getId(productObj?._id),
      centerName: item.centerName || centerObj?.centerName || "",
      productName: item.productName || productObj?.productTitle || "",
      centerType: item.centerType || item.center?.centerType || centerObj?.centerType || "",
    };
  };

  // Stock Qty: outlet/warehouse stock opens transfer history.
  // Branch stock opens usage history, with a broad date range.
  const handleStockClick = async (item) => {
    if (!(Number(item.availableQuantity) > 0)) return;

    const details = getRowDetails(item);
    const { centerId, productId, centerName, productName, centerType } = details;

    if (!centerId || !productId) {
      console.error("Missing center/product ID for Available Stock row:", item, details);
      showError("Unable to open details: center or product ID is missing.");
      return;
    }

    const isWarehouse = String(centerType).toLowerCase() === "outlet";

    if (isWarehouse) {
      const baseParams = {
        product: productId,
        center: centerId,
        productName,
        centerName,
      };

      // Find out WHERE this stock came from, then open that page.
      // 1) Stock transferred INTO this center  -> /transfer-detail
      // 2) Otherwise it came from a purchase   -> /indent-detail
      try {
        const checkParams = new URLSearchParams({
          toCenter: centerId,
          product: productId,
          page: 1,
        });

        const response = await axiosInstance.get(
          `/reports/transfers?${checkParams.toString()}`,
        );

        const hasReceivedTransfers =
          response.data?.success &&
          Array.isArray(response.data.data) &&
          response.data.data.length > 0;

        if (hasReceivedTransfers) {
          const params = new URLSearchParams({
            ...baseParams,
            transferType: "receive",
          });
          navigate(`/transfer-detail?${params.toString()}`);
          return;
        }
      } catch (err) {
        console.error("Error checking received transfers:", err);
      }

      // No received transfers found -> stock came from purchase
      const purchaseParams = new URLSearchParams(baseParams);
      navigate(`/indent-detail?${purchaseParams.toString()}`);
      return;
    }

    const today = new Date();
    const pad = (number) => String(number).padStart(2, "0");
    const endDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

    const params = new URLSearchParams({
      productId,
      centerId,
      productName,
      centerName,
      startDate: "2020-01-01",
      endDate,
    });
    navigate(`/usage-detail?${params.toString()}`);
  };

  // Damage Qty opens Usage Details filtered to Damage records.
  const handleDamageClick = (item) => {
    if (!(Number(item.damagedQuantity) > 0)) return;

    const { centerId, productId, centerName, productName } = getRowDetails(item);

    if (!centerId || !productId) {
      console.error("Missing center/product ID for damage history:", item);
      showError("Unable to open damage history: center or product ID is missing.");
      return;
    }

    const today = new Date();
    const pad = (number) => String(number).padStart(2, "0");
    const endDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

    const params = new URLSearchParams({
      productId,
      centerId,
      productName,
      centerName,
      usageType: "Damage",
      startDate: "2020-01-01",
      endDate,
    });
    navigate(`/usage-detail?${params.toString()}`);
  };

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

  const [exportModalVisible, setExportModalVisible] = useState(false)
  const [exportStartDate, setExportStartDate] = useState('')
  const [exportEndDate, setExportEndDate] = useState('')

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

  const dropdownRefs = useRef({})

  // =========================
  // Fetch Available Stock
  // =========================
  const fetchData = async (searchParams = {}, page = 1) => {
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
        ? `/availableStock/availableStock?${params.toString()}`
        : '/availableStock/availableStock'

      const response = await axiosInstance.get(url)

      if (response.data.success) {
        setData(response.data.data.stock)
        setCurrentPage(response.data.data.pagination.currentPage)
        setTotalPages(response.data.data.pagination.totalPages)
      } else {
        const errorMessage =
          response.data.message || 'API returned unsuccessful response'

        setError(errorMessage)
        console.error('Backend error:', response.data)
      }
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Error ${err.response.status}: ${err.response.statusText}`

        setError(errorMessage)
        console.error('Error response:', err.response.data)
      } else if (err.request) {
        setError(
          'No response received from server. Please check your network connection.',
        )
        console.error('Error request:', err.request)
      } else {
        setError(err.message || 'An error occurred while fetching data')
        console.error('Error message:', err.message)
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
      const response = await axiosInstance.get('/centers')

      if (response.data.success) {
        setCenters(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching centers:', error)
    }
  }

  // =========================
  // Fetch Products
  // =========================
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all')

      if (response.data.success) {
        setProducts(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // =========================
  // Fetch Resellers
  // =========================
  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers')

      if (response.data.success) {
        setResellers(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching resellers:', error)
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
        return direction === 'ascending' ? -1 : 1
      }

      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1
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
  // Export Modal
  // =========================
  const openExportModal = () => {
    setExportStartDate(activeSearch.startDate || '')
    setExportEndDate(activeSearch.endDate || '')
    setExportModalVisible(true)
  }

  // =========================
  // Generate Export
  // =========================
  const generateDetailExport = async () => {
    try {
      setLoading(true)

      if (
        exportStartDate &&
        exportEndDate &&
        exportStartDate > exportEndDate
      ) {
        showError('Start date cannot be greater than end date')
        setLoading(false)
        return
      }

      const params = new URLSearchParams()

      if (exportStartDate) {
        params.append('startDate', exportStartDate)
      }

      if (exportEndDate) {
        params.append('endDate', exportEndDate)
      }

      params.append('export', 'true')

      const apiUrl = `/availableStock/availableStock?${params.toString()}`

      console.log('Export API URL:', apiUrl)

      const response = await axiosInstance.get(apiUrl, {
        responseType: 'blob',
      })

      if (response.data instanceof Blob) {
        let filename = 'available_stock_export'

        if (exportStartDate && exportEndDate) {
          filename += `_${exportStartDate}_to_${exportEndDate}`
        } else if (exportStartDate) {
          filename += `_from_${exportStartDate}`
        } else if (exportEndDate) {
          filename += `_until_${exportEndDate}`
        } else {
          filename += `_${new Date().toISOString().split('T')[0]}`
        }

        const contentType = response.headers['content-type']

        if (
          contentType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          filename += '.xlsx'
        } else if (contentType === 'application/vnd.ms-excel') {
          filename += '.xls'
        } else {
          filename += '.xlsx'
        }

        const blob = new Blob([response.data], {
          type: contentType,
        })

        const link = document.createElement('a')
        const downloadUrl = URL.createObjectURL(blob)

        link.setAttribute('href', downloadUrl)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        URL.revokeObjectURL(downloadUrl)

        showSuccess('Export completed successfully!')

        setExportModalVisible(false)
        setExportStartDate('')
        setExportEndDate('')
      } else {
        throw new Error('Unexpected response format from server')
      }
    } catch (error) {
      console.error('Error generating export:', error)

      let errorMessage = 'Error generating export file'

      if (
        error.response &&
        error.response.data instanceof Blob
      ) {
        try {
          const text = await error.response.data.text()
          const parsed = JSON.parse(text)

          errorMessage =
            parsed.message ||
            parsed.error ||
            errorMessage
        } catch (e) {
          errorMessage =
            error.response.statusText || errorMessage
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // Local Search
  // =========================
  const filteredData = data.filter((item) => {
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
      if (typeof value === 'object' && value !== null) {
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

      Object.keys(dropdownRefs.current).forEach((key) => {
        if (
          dropdownRefs.current[key] &&
          !dropdownRefs.current[key].contains(event.target)
        ) {
          newDropdownState[key] = false
          shouldUpdate = true
        }
      })

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
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

      {/* Export dropdown animation */}
      <style>
        {`
          @keyframes exportStockDropDown {
            from {
              opacity: 0;
              transform: translateY(-70px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .export-stock-dropdown {
            animation: exportStockDropDown 0.3s ease-out;
          }
        `}
      </style>

      {/* Page Title */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Available Stock
      </div>

      {/* Search Modal */}
      <SearchCenterStock
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        resellers={resellers}
      />

      {/* =====================================================
          EXPORT STOCK DATA MODAL
          ONLY OPENING FUNCTIONALITY CHANGED
          ===================================================== */}
      {exportModalVisible && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-8">

          <div className="export-stock-dropdown w-full max-w-[500px] overflow-hidden rounded-[7px] bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex h-[63px] items-center justify-between border-b border-[#dee2e6] px-4">

              <h3 className="text-[22px] font-normal text-[#343a40]">
                Export Stock Data
              </h3>

              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                className="flex h-8 w-8 items-center justify-center text-[#888] transition hover:text-[#555]"
              >
                <X
                  className="h-[25px] w-[25px]"
                  strokeWidth={2}
                />
              </button>

            </div>

            {/* Modal Body */}
            <div className="px-4 py-4">

              {/* Start Date */}
              <div className="mb-4">

                <label
                  htmlFor="exportStartDate"
                  className="mb-2 block text-[14px] font-bold text-[#343a40]"
                >
                  Start Date (Optional)
                </label>

                <input
                  type="date"
                  id="exportStartDate"
                  value={exportStartDate}
                  onChange={(e) =>
                    setExportStartDate(e.target.value)
                  }
                  className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                />

                <p className="mt-1 text-[13px] text-[#6c757d]">
                  Leave empty to include all records from beginning
                </p>

              </div>

              {/* End Date */}
              <div className="mb-4">

                <label
                  htmlFor="exportEndDate"
                  className="mb-2 block text-[14px] font-bold text-[#343a40]"
                >
                  End Date (Optional)
                </label>

                <input
                  type="date"
                  id="exportEndDate"
                  value={exportEndDate}
                  onChange={(e) =>
                    setExportEndDate(e.target.value)
                  }
                  className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                />

                <p className="mt-1 text-[13px] text-[#6c757d]">
                  Leave empty to include all records until today
                </p>

              </div>

              {/* Information Box */}
              <div className="flex gap-2 rounded-[5px] bg-[#e7f3ff] px-2 py-3 text-[13px] leading-5 text-[#007bff]">

                <Info className="mt-[2px] h-[15px] w-[15px] shrink-0" />

                <span>
                  <span className="font-medium">Note:</span>{' '}
                  Export will include all centers, products,
                  and resellers within the selected date range.
                </span>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t border-[#dee2e6] px-4 py-3">

              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                className="h-[38px] rounded-[5px] bg-[#6c757d] px-4 text-[14px] font-medium text-white transition hover:bg-[#5a6268]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={generateDetailExport}
                className="h-[38px] rounded-[5px] bg-[#5b55d9] px-4 text-[14px] font-medium text-white transition hover:bg-[#4d47c7]"
              >
                Export
              </button>

            </div>

          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="mt-0 overflow-hidden border border-[#e1e5ea] border-t-[4px] border-t-[#2f5fa7] bg-white">

        {/* Action Toolbar */}
        <div className="flex min-h-[51px] flex-wrap items-center gap-1 border-b border-[#d9dde3] px-3 py-2">

          {/* Search */}
          <button
            type="button"
            onClick={() => setSearchModalVisible(true)}
            className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
          >
            <Search className="h-[16px] w-[16px]" />
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
              className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
            >
              <RotateCcw className="h-[15px] w-[15px]" />
              Reset Search
            </button>
          )}

          {/* Export */}
          <button
            type="button"
            onClick={openExportModal}
            className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
          >
            <FileSpreadsheet className="h-[15px] w-[15px]" />
            Export
          </button>

          {/* Print */}
          <button
            type="button"
            className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
          >
            <Printer className="h-[15px] w-[15px]" />
            Print
          </button>

        </div>

        {/* Search / active-filter row */}
        <div className="flex min-h-[62px] items-center justify-between px-4 py-3">

          <div className="min-w-0 text-[13px] text-[#666]">

            {(activeSearch.resellerId ||
              activeSearch.startDate ||
              activeSearch.endDate) && (
              <div>

                {activeSearch.resellerId &&
                  `Reseller: ${
                    resellers.find(
                      (r) => r._id === activeSearch.resellerId,
                    )?.businessName || activeSearch.resellerId
                  } | `}

                {activeSearch.startDate &&
                  `From: ${activeSearch.startDate} | `}

                {activeSearch.endDate &&
                  `To: ${activeSearch.endDate}`}

              </div>
            )}

          </div>

          {/* Local Search */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5">

            <label
              htmlFor="available-stock-search"
              className="text-[14px] font-bold text-[#202020]"
            >
              Search:
            </label>

            <input
              id="available-stock-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-[30px] w-[220px] border border-[#d5dbe3] bg-white px-2 text-[13px] text-[#222] outline-none focus:border-[#2f5fa7]"
            />

          </div>

        </div>

        {/* Table */}
        <div className="px-4">

          <div className="w-full overflow-hidden border border-[#eeeeee]">

            <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">

              <table className="w-full table-fixed border-collapse">

                <colgroup>
                  <col style={{ width: '17%' }} />
                  <col style={{ width: '36%' }} />
                  <col style={{ width: '30%' }} />
                  <col style={{ width: '7%' }} />
                  <col style={{ width: '10%' }} />
                </colgroup>

                <thead className="sticky top-0 z-20">

                  <tr>

                    <th
                      scope="col"
                      onClick={() => handleSort('outlet')}
                      className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
                    >
                      <div className="flex items-center gap-1">
                        <span>Branch</span>
                        {getSortIcon('outlet')}
                      </div>
                    </th>

                    <th
                      scope="col"
                      onClick={() => handleSort('date')}
                      className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
                    >
                      <div className="flex items-center gap-1">
                        <span>Product</span>
                        {getSortIcon('date')}
                      </div>
                    </th>

                    <th
                      scope="col"
                      onClick={() => handleSort('invoiceNo')}
                      className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
                    >
                      <div className="flex items-center gap-1">
                        <span>Category</span>
                        {getSortIcon('invoiceNo')}
                      </div>
                    </th>

                    <th
                      scope="col"
                      onClick={() =>
                        handleSort('vendor.businessName')
                      }
                      className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
                    >
                      <div className="flex items-center gap-1">
                        <span>Stock</span>
                        {getSortIcon('vendor.businessName')}
                      </div>
                    </th>

                    <th
                      scope="col"
                      onClick={() =>
                        handleSort('damagedQuantity')
                      }
                      className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
                    >
                      <div className="flex items-center gap-1">
                        <span>Damage</span>
                        {getSortIcon('damagedQuantity')}
                      </div>
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item._id}
                        className={`transition ${
                          index % 2 === 0
                            ? 'bg-[#f1f1f1]'
                            : 'bg-white'
                        }`}
                      >

                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          <div className="break-words">
                            {item.centerName || ''}
                          </div>
                        </td>

                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          <div className="break-words">
                            {item.productName}
                          </div>
                        </td>

                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          <div className="break-words">
                            {item.productCategory?.name || ''}
                          </div>
                        </td>

                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          <button
                            type="button"
                            onClick={() => handleStockClick(item)}
                            title="View stock transfer history"
                            className="cursor-pointer rounded text-blue-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {item.availableQuantity || 0}
                          </button>
                        </td>

                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          <button
                            type="button"
                            onClick={() => handleDamageClick(item)}
                            title="View damage history"
                            className="cursor-pointer rounded text-blue-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {item.damagedQuantity || 0}
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>

                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-sm text-gray-500"
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

        {/* Pagination */}
        <div className="flex justify-end border-t border-[#e1e5ea] px-4 py-3">

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

        </div>

      </div>
    </div>
  )
}

export default AvailableStock