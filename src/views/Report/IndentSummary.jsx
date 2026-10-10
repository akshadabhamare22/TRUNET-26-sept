// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   ArrowDown,
//   ArrowUp,
//   FileSpreadsheet,
//   RotateCcw,
//   Search,
//   X,
// } from 'lucide-react'

// import axiosInstance from '../../axiosInstance'
// import Pagination from '../../utils/Pagination'
// import { showError, showSuccess } from '../../utils/sweetAlerts'
// import SearchIndentSummary from './SearchIndentSummary'
// import { formatDisplayDate } from '../../utils/FormatDateTime'

// const IndentSummary = () => {
//   const navigate = useNavigate()

//   const [data, setData] = useState([])
//   const [centers, setCenters] = useState([])
//   const [products, setProducts] = useState([])

//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   })

//   const [searchTerm, setSearchTerm] = useState('')
//   const [filteredData, setFilteredData] = useState([])

//   const [searchModalVisible, setSearchModalVisible] =
//     useState(false)

//   const [exportModalVisible, setExportModalVisible] =
//     useState(false)

//   const [exportStartDate, setExportStartDate] =
//     useState('')

//   const [exportEndDate, setExportEndDate] =
//     useState('')

//   const [activeSearch, setActiveSearch] = useState({
//     center: '',
//     product: '',
//     startDate: '',
//     endDate: '',
//     usageType: '',
//     keyword: '',
//     outlet: '',
//   })

//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   // ------------------------------------------------------------
//   // FETCH DATA
//   // ------------------------------------------------------------

//   const fetchData = async (
//     searchParams = {},
//     page = 1,
//   ) => {
//     try {
//       setLoading(true)
//       setError(null)

//       const params = new URLSearchParams()

//       if (searchParams.center) {
//         params.append(
//           'center',
//           searchParams.center,
//         )
//       }

//       if (searchParams.product) {
//         params.append(
//           'product',
//           searchParams.product,
//         )
//       }

//       if (searchParams.usageType) {
//         params.append(
//           'usageType',
//           searchParams.usageType,
//         )
//       }

//       if (
//         searchParams.startDate &&
//         searchParams.endDate
//       ) {
//         const convertDateFormat = (dateStr) => {
//           const [day, month, year] =
//             dateStr.split('-')

//           return `${year}-${month}-${day}`
//         }

//         params.append(
//           'startDate',
//           convertDateFormat(
//             searchParams.startDate,
//           ),
//         )

//         params.append(
//           'endDate',
//           convertDateFormat(
//             searchParams.endDate,
//           ),
//         )
//       }

//       if (
//         searchParams.keyword &&
//         searchParams.keyword.trim()
//       ) {
//         console.log(
//           '✅ Adding search parameter:',
//           searchParams.keyword,
//         )

//         params.append(
//           'search',
//           searchParams.keyword.trim(),
//         )
//       } else {
//         console.log(
//           '❌ No keyword to search',
//         )
//       }

//       if (searchParams.outlet) {
//         params.append(
//           'outlet',
//           searchParams.outlet,
//         )
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/reports/requests/summary?${params.toString()}`
//         : '/reports/requests/summary'

//       console.log(
//         '🚀 Fetching URL:',
//         url,
//       )

//       console.log(
//         '📦 Full search params:',
//         searchParams,
//       )

//       console.log(
//         '🔑 Keyword being sent:',
//         searchParams.keyword || 'none',
//       )

//       const response =
//         await axiosInstance.get(url)

//       if (response.data.success) {
//         setData(response.data.data || [])

//         setFilteredData(
//           response.data.data || [],
//         )

//         setCurrentPage(
//           response.data.pagination
//             ?.currentPage || 1,
//         )

//         setTotalPages(
//           response.data.pagination
//             ?.totalPages || 1,
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

//   // ------------------------------------------------------------
//   // FETCH CENTERS
//   // ------------------------------------------------------------

//   const fetchCenters = async () => {
//     try {
//       const response =
//         await axiosInstance.get('/centers')

//       if (response.data.success) {
//         setCenters(
//           response.data.data || [],
//         )
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching centers:',
//         error,
//       )
//     }
//   }

//   // ------------------------------------------------------------
//   // FETCH PRODUCTS
//   // ------------------------------------------------------------

//   const fetchProducts = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           '/products/all',
//         )

//       if (response.data.success) {
//         setProducts(
//           response.data.data || [],
//         )
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching products:',
//         error,
//       )
//     }
//   }

//   // ------------------------------------------------------------
//   // INITIAL LOAD
//   // ------------------------------------------------------------

//   useEffect(() => {
//     fetchData()
//     fetchCenters()
//     fetchProducts()
//   }, [])

//   // ------------------------------------------------------------
//   // PAGINATION
//   // ------------------------------------------------------------

//   const handlePageChange = (page) => {
//     if (
//       page < 1 ||
//       page > totalPages
//     ) {
//       return
//     }

//     fetchData(activeSearch, page)
//   }

//   // ------------------------------------------------------------
//   // TOTALS
//   // ------------------------------------------------------------

//   const calculateTotals = () => {
//     const displayData =
//       filteredData.length > 0
//         ? filteredData
//         : data

//     const totals = {
//       totalQty: 0,
//     }

//     displayData.forEach((item) => {
//       totals.totalQty += parseFloat(
//         item.totalQty || 0,
//       )
//     })

//     return totals
//   }

//   // ------------------------------------------------------------
//   // SORT
//   // ------------------------------------------------------------

//   const handleSort = (key) => {
//     let direction = 'ascending'

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction ===
//         'ascending'
//     ) {
//       direction = 'descending'
//     }

//     setSortConfig({
//       key,
//       direction,
//     })

//     const displayData =
//       filteredData.length > 0
//         ? filteredData
//         : data

//     const sortedData = [...displayData].sort(
//       (a, b) => {
//         let aValue = a
//         let bValue = b

//         if (key.includes('.')) {
//           const keys = key.split('.')

//           aValue = keys.reduce(
//             (obj, k) =>
//               obj && obj[k],
//             a,
//           )

//           bValue = keys.reduce(
//             (obj, k) =>
//               obj && obj[k],
//             b,
//           )
//         } else {
//           aValue = a[key]
//           bValue = b[key]
//         }

//         if (aValue < bValue) {
//           return direction === 'ascending'
//             ? -1
//             : 1
//         }

//         if (aValue > bValue) {
//           return direction === 'ascending'
//             ? 1
//             : -1
//         }

//         return 0
//       },
//     )

//     setFilteredData(sortedData)
//   }

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null
//     }

//     return sortConfig.direction ===
//       'ascending' ? (
//       <ArrowUp size={14} />
//     ) : (
//       <ArrowDown size={14} />
//     )
//   }

//   // ------------------------------------------------------------
//   // SEARCH MODAL
//   // ------------------------------------------------------------

//   const handleSearch = (searchData) => {
//     const mergedSearchData = {
//       ...activeSearch,
//       ...searchData,
//     }

//     setActiveSearch(
//       mergedSearchData,
//     )

//     fetchData(
//       mergedSearchData,
//       1,
//     )
//   }

//   // ------------------------------------------------------------
//   // FRONTEND SEARCH
//   // ------------------------------------------------------------

//   const handleFrontendSearch = (
//     value = searchTerm,
//   ) => {
//     const trimmedSearch =
//       value.trim().toLowerCase()

//     if (!trimmedSearch) {
//       setFilteredData(data)
//       return
//     }

//     const filtered = data.filter(
//       (item) => {
//         if (
//           item.product &&
//           item.product
//             .toLowerCase()
//             .includes(trimmedSearch)
//         ) {
//           return true
//         }

//         if (
//           item.center &&
//           item.center
//             .toLowerCase()
//             .includes(trimmedSearch)
//         ) {
//           return true
//         }

//         if (
//           item.parentCenter &&
//           item.parentCenter
//             .toLowerCase()
//             .includes(trimmedSearch)
//         ) {
//           return true
//         }

//         if (
//           item.productCode &&
//           item.productCode
//             .toLowerCase()
//             .includes(trimmedSearch)
//         ) {
//           return true
//         }

//         if (
//           item.orderNumbers &&
//           item.orderNumbers.some(
//             (order) =>
//               order
//                 .toLowerCase()
//                 .includes(
//                   trimmedSearch,
//                 ),
//           )
//         ) {
//           return true
//         }

//         return false
//       },
//     )

//     console.log(
//       `🔍 Frontend search: found ${filtered.length} results for "${trimmedSearch}"`,
//     )

//     setFilteredData(filtered)
//   }

//   // ------------------------------------------------------------
//   // TOTAL QTY DRILL DOWN
//   // ------------------------------------------------------------

//   const handleTotalQtyClick = (item) => {
//     if (
//       !item.totalQty ||
//       !item.centerId ||
//       !item.productId
//     ) {
//       return
//     }

//     const params =
//       new URLSearchParams()

//     params.append(
//       'centerId',
//       item.centerId,
//     )

//     params.append(
//       'productId',
//       item.productId,
//     )

//     if (item.center) {
//       params.append(
//         'centerName',
//         encodeURIComponent(
//           item.center,
//         ),
//       )
//     }

//     if (item.product) {
//       params.append(
//         'productName',
//         encodeURIComponent(
//           item.product,
//         ),
//       )
//     }

//     // Carry same period to detail page
//     if (
//       activeSearch.startDate &&
//       activeSearch.endDate
//     ) {
//       const [
//         day,
//         month,
//         year,
//       ] =
//         activeSearch.startDate.split(
//           '-',
//         )

//       params.append(
//         'month',
//         `${year}-${month}`,
//       )
//     } else {
//       const now = new Date()

//       params.append(
//         'month',
//         `${now.getFullYear()}-${String(
//           now.getMonth() + 1,
//         ).padStart(2, '0')}`,
//       )
//     }

//     navigate(
//       `/indent-detail?${params.toString()}`,
//     )
//   }

//   // ------------------------------------------------------------
//   // CLEAR FRONTEND SEARCH
//   // ------------------------------------------------------------

//   const clearFrontendSearch = () => {
//     setSearchTerm('')
//     setFilteredData(data)
//   }

//   // ------------------------------------------------------------
//   // RESET SEARCH
//   // ------------------------------------------------------------

//   const handleResetSearch = () => {
//     setActiveSearch({
//       center: '',
//       product: '',
//       startDate: '',
//       endDate: '',
//       usageType: '',
//       keyword: '',
//       outlet: '',
//     })

//     setSearchTerm('')
//     setFilteredData(data)

//     fetchData({}, 1)
//   }

//   const isSearchActive = () => {
//     return (
//       activeSearch.center ||
//       activeSearch.product ||
//       activeSearch.startDate ||
//       activeSearch.endDate ||
//       activeSearch.usageType ||
//       activeSearch.keyword ||
//       activeSearch.outlet
//     )
//   }

//   // ------------------------------------------------------------
//   // EXPORT
//   // ------------------------------------------------------------

//   const openExportModal = () => {
//     setExportStartDate(
//       activeSearch.startDate || '',
//     )

//     setExportEndDate(
//       activeSearch.endDate || '',
//     )

//     setExportModalVisible(true)
//   }

//   const generateDetailExport = async () => {
//     try {
//       setLoading(true)

//       if (
//         exportStartDate &&
//         exportEndDate &&
//         exportStartDate > exportEndDate
//       ) {
//         showError(
//           'Start date cannot be greater than end date',
//         )

//         setLoading(false)
//         return
//       }

//       const params =
//         new URLSearchParams()

//       if (activeSearch.center) {
//         params.append(
//           'center',
//           activeSearch.center,
//         )
//       }

//       if (activeSearch.product) {
//         params.append(
//           'product',
//           activeSearch.product,
//         )
//       }

//       if (activeSearch.usageType) {
//         params.append(
//           'usageType',
//           activeSearch.usageType,
//         )
//       }

//       if (exportStartDate) {
//         const convertDateFormat = (
//           dateStr,
//         ) => {
//           if (dateStr.includes('-')) {
//             const parts =
//               dateStr.split('-')

//             if (
//               parts[0].length === 2 &&
//               parts[1].length === 2 &&
//               parts[2].length === 4
//             ) {
//               const [
//                 day,
//                 month,
//                 year,
//               ] = parts

//               return `${year}-${month}-${day}`
//             }
//           }

//           return dateStr
//         }

//         params.append(
//           'startDate',
//           convertDateFormat(
//             exportStartDate,
//           ),
//         )
//       }

//       if (exportEndDate) {
//         const convertDateFormat = (
//           dateStr,
//         ) => {
//           if (dateStr.includes('-')) {
//             const parts =
//               dateStr.split('-')

//             if (
//               parts[0].length === 2 &&
//               parts[1].length === 2 &&
//               parts[2].length === 4
//             ) {
//               const [
//                 day,
//                 month,
//                 year,
//               ] = parts

//               return `${year}-${month}-${day}`
//             }
//           }

//           return dateStr
//         }

//         params.append(
//           'endDate',
//           convertDateFormat(
//             exportEndDate,
//           ),
//         )
//       }

//       if (activeSearch.keyword) {
//         params.append(
//           'search',
//           activeSearch.keyword,
//         )
//       }

//       if (activeSearch.outlet) {
//         params.append(
//           'outlet',
//           activeSearch.outlet,
//         )
//       }

//       const apiUrl =
//         params.toString()
//           ? `/reports/requests/summary?${params.toString()}`
//           : '/reports/requests/summary'

//       const response =
//         await axiosInstance.get(
//           apiUrl,
//         )

//       if (!response.data.success) {
//         throw new Error(
//           'API returned unsuccessful response',
//         )
//       }

//       const exportData =
//         response.data.data

//       if (
//         !exportData ||
//         exportData.length === 0
//       ) {
//         showError(
//           'No data available for export',
//         )

//         return
//       }

//       const headers = [
//         'Center',
//         'Parent Center',
//         'Product',
//         'Total Qty',
//       ]

//       const csvData =
//         exportData.map((item) => [
//           item.center || '',
//           item.parentCenter || '',
//           item.product || '',
//           item.totalQty || 0,
//         ])

//       let filename =
//         'indent_summary_report'

//       if (
//         exportStartDate &&
//         exportEndDate
//       ) {
//         filename +=
//           `_${exportStartDate}_to_${exportEndDate}`
//       } else if (exportStartDate) {
//         filename +=
//           `_from_${exportStartDate}`
//       } else if (exportEndDate) {
//         filename +=
//           `_until_${exportEndDate}`
//       } else {
//         filename +=
//           `_${new Date()
//             .toISOString()
//             .split('T')[0]}`
//       }

//       filename += '.csv'

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
//           type:
//             'text/csv;charset=utf-8;',
//         },
//       )

//       const link =
//         document.createElement('a')

//       const downloadUrl =
//         URL.createObjectURL(blob)

//       link.setAttribute(
//         'href',
//         downloadUrl,
//       )

//       link.setAttribute(
//         'download',
//         filename,
//       )

//       link.style.visibility = 'hidden'

//       document.body.appendChild(link)

//       link.click()

//       document.body.removeChild(link)

//       URL.revokeObjectURL(downloadUrl)

//       showSuccess(
//         'Export completed successfully!',
//       )

//       setExportModalVisible(false)
//       setExportStartDate('')
//       setExportEndDate('')
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

//   // ------------------------------------------------------------
//   // LOADING
//   // ------------------------------------------------------------

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
//       </div>
//     )
//   }

//   // ------------------------------------------------------------
//   // ERROR
//   // ------------------------------------------------------------

//   if (error) {
//     return (
//       <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   const totals = calculateTotals()

//   const displayData =
//     filteredData.length > 0
//       ? filteredData
//       : data

//   return (
//     <div className="w-full p-4 md:p-5">
//       {/* PAGE TITLE */}
//       <div className="mb-5">
//         <h1 className="text-xl font-semibold text-slate-800">
//           Indent Summary Report
//         </h1>
//       </div>

//       {/* SEARCH MODAL */}
//       <SearchIndentSummary
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//       />

//       {/* EXPORT MODAL */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
//           <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
//             {/* Header */}
//             <div className="flex items-center justify-between border-b px-5 py-4">
//               <h2 className="text-lg font-semibold text-slate-800">
//                 Export Indent Summary Report
//               </h2>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setExportModalVisible(false)
//                 }
//                 className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Body */}
//             <div className="space-y-5 p-5">
//               <div>
//                 <label
//                   htmlFor="exportStartDate"
//                   className="mb-1.5 block text-sm font-medium text-slate-700"
//                 >
//                   Start Date (Optional)
//                 </label>

//                 <input
//                   id="exportStartDate"
//                   type="date"
//                   value={exportStartDate}
//                   onChange={(e) =>
//                     setExportStartDate(
//                       e.target.value,
//                     )
//                   }
//                   className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <p className="mt-1 text-xs text-slate-500">
//                   Leave empty to include all
//                   records from beginning
//                 </p>
//               </div>

//               <div>
//                 <label
//                   htmlFor="exportEndDate"
//                   className="mb-1.5 block text-sm font-medium text-slate-700"
//                 >
//                   End Date (Optional)
//                 </label>

//                 <input
//                   id="exportEndDate"
//                   type="date"
//                   value={exportEndDate}
//                   onChange={(e) =>
//                     setExportEndDate(
//                       e.target.value,
//                     )
//                   }
//                   className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <p className="mt-1 text-xs text-slate-500">
//                   Leave empty to include all
//                   records until today
//                 </p>
//               </div>

//               {/* Current Filters */}
//               {(activeSearch.center ||
//                 activeSearch.product ||
//                 activeSearch.usageType ||
//                 activeSearch.outlet ||
//                 activeSearch.keyword) && (
//                 <div className="rounded-lg bg-slate-50 p-3">
//                   <p className="mb-2 text-sm font-semibold text-slate-700">
//                     Current Filters:
//                   </p>

//                   <ul className="space-y-1 text-sm text-slate-600">
//                     {activeSearch.center && (
//                       <li>
//                         Center:{' '}
//                         {centers.find(
//                           (c) =>
//                             c._id ===
//                             activeSearch.center,
//                         )?.centerName ||
//                           ''}
//                       </li>
//                     )}

//                     {activeSearch.product && (
//                       <li>
//                         Product:{' '}
//                         {products.find(
//                           (p) =>
//                             p._id ===
//                             activeSearch.product,
//                         )?.productTitle ||
//                           ''}
//                       </li>
//                     )}

//                     {activeSearch.usageType && (
//                       <li>
//                         Usage Type:{' '}
//                         {activeSearch.usageType}
//                       </li>
//                     )}

//                     {activeSearch.outlet && (
//                       <li>
//                         Outlet:{' '}
//                         {activeSearch.outlet}
//                       </li>
//                     )}

//                     {activeSearch.keyword && (
//                       <li>
//                         Keyword:{' '}
//                         {activeSearch.keyword}
//                       </li>
//                     )}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="flex justify-end gap-2 border-t px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setExportModalVisible(false)
//                 }
//                 className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={
//                   generateDetailExport
//                 }
//                 className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
//               >
//                 <FileSpreadsheet
//                   size={16}
//                 />
//                 Export
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MAIN CARD */}
//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         {/* CARD HEADER */}
//         <div className="flex flex-col gap-3 border-b bg-white px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             <button
//               type="button"
//               onClick={() =>
//                 setSearchModalVisible(true)
//               }
//               className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//             >
//               <Search size={16} />
//               Search
//             </button>

//             {isSearchActive() && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
//               >
//                 <RotateCcw size={16} />
//                 Reset Search
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={openExportModal}
//               disabled={data.length === 0}
//               className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <FileSpreadsheet
//                 size={16}
//               />
//               Export
//             </button>
//           </div>

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>

//         {/* CARD BODY */}
//         <div className="p-4">
//           {/* SUMMARY */}
//           <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
//             <h4 className="mb-2 text-base font-semibold text-slate-800">
//               Showing Result
//             </h4>

//             <ul className="space-y-1 text-sm text-slate-600">
//               <li className="font-semibold text-slate-700">
//                 {formatDisplayDate(
//                   activeSearch.startDate,
//                   activeSearch.endDate,
//                 )}
//               </li>

//               {searchTerm && (
//                 <li className="font-semibold text-slate-700">
//                   Search: "{searchTerm}" -{' '}
//                   {displayData.length}{' '}
//                   results
//                 </li>
//               )}
//             </ul>
//           </div>

//           {/* TABLE SEARCH */}
//           <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//             <div>
//               {(exportStartDate ||
//                 exportEndDate) && (
//                 <div className="text-xs text-slate-500">
//                   {exportStartDate &&
//                     `Export From: ${exportStartDate} `}

//                   {exportEndDate &&
//                     `To: ${exportEndDate}`}
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium text-slate-600">
//                 Search:
//               </label>

//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   const value =
//                     e.target.value

//                   setSearchTerm(value)

//                   if (value.trim()) {
//                     handleFrontendSearch(
//                       value,
//                     )
//                   } else {
//                     setFilteredData(data)
//                   }
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     e.preventDefault()
//                     e.stopPropagation()

//                     console.log(
//                       '⏎ Enter key pressed, searching for:',
//                       searchTerm,
//                     )

//                     handleFrontendSearch()
//                   }
//                 }}
//                 placeholder="Type to search products, centers, orders..."
//                 className="h-9 w-full max-w-[350px] rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />

//               <button
//                 type="button"
//                 onClick={() => {
//                   console.log(
//                     '🔍 Search button clicked with:',
//                     searchTerm,
//                   )

//                   handleFrontendSearch()
//                 }}
//                 className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-3 text-white transition hover:bg-blue-700"
//               >
//                 <Search size={16} />
//               </button>

//               {searchTerm && (
//                 <button
//                   type="button"
//                   onClick={
//                     clearFrontendSearch
//                   }
//                   title="Clear search"
//                   className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-slate-600 transition hover:bg-slate-50"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* TABLE */}
//           <div className="overflow-x-auto rounded-lg border border-slate-200">
//             <table className="min-w-[700px] w-full border-collapse text-sm">
//               <thead>
//                 <tr className="bg-slate-50">
//                   {[
//                     ['center', 'Branch'],
//                     [
//                       'parentCenter',
//                       'Branch Center',
//                     ],
//                     ['product', 'Product'],
//                     ['totalQty', 'Total Qty'],
//                   ].map(([key, label]) => (
//                     <th
//                       key={key}
//                       scope="col"
//                       onClick={() =>
//                         handleSort(key)
//                       }
//                       className="cursor-pointer whitespace-nowrap border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-700 transition hover:bg-slate-100"
//                     >
//                       <div className="flex items-center gap-1">
//                         {label}
//                         {getSortIcon(key)}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {displayData.length > 0 ? (
//                   <>
//                     {displayData.map(
//                       (item, index) => (
//                         <tr
//                           key={
//                             item._id ||
//                             `${item.center}-${item.product}-${index}`
//                           }
//                           className="border-b border-slate-100 transition hover:bg-slate-50"
//                         >
//                           <td className="px-4 py-3 text-slate-700">
//                             {item.center || ''}
//                           </td>

//                           <td className="px-4 py-3 text-slate-600">
//                             {item.parentCenter ||
//                               'N/A'}
//                           </td>

//                           <td className="px-4 py-3 text-slate-700">
//                             {item.product ||
//                               'No Product'}
//                           </td>

//                           <td className="px-4 py-3">
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleTotalQtyClick(
//                                   item,
//                                 )
//                               }
//                               disabled={
//                                 !item.totalQty
//                               }
//                               title={
//                                 item.totalQty >
//                                 0
//                                   ? 'Click to view detail requests'
//                                   : ''
//                               }
//                               className={`font-semibold ${
//                                 item.totalQty >
//                                 0
//                                   ? 'cursor-pointer text-blue-600 hover:text-blue-800 hover:underline'
//                                   : 'cursor-default text-slate-700'
//                               }`}
//                             >
//                               {item.totalQty ||
//                                 0}
//                             </button>
//                           </td>
//                         </tr>
//                       ),
//                     )}

//                     {/* TOTAL ROW */}
//                     <tr className="bg-slate-50 font-semibold">
//                       <td
//                         colSpan={3}
//                         className="px-4 py-3 text-right text-slate-800"
//                       >
//                         Total
//                       </td>

//                       <td className="px-4 py-3 text-slate-800">
//                         {totals.totalQty.toFixed(
//                           2,
//                         )}
//                       </td>
//                     </tr>
//                   </>
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={4}
//                       className="px-4 py-10 text-center text-sm text-slate-500"
//                     >
//                       {searchTerm
//                         ? `No results found for "${searchTerm}"`
//                         : 'No data found'}
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

// export default IndentSummary








import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  FileSpreadsheet,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import Pagination from '../../utils/Pagination'
import { showError, showSuccess } from '../../utils/sweetAlerts'
import SearchIndentSummary from './SearchIndentSummary'
import { formatDisplayDate } from '../../utils/FormatDateTime'

const IndentSummary = () => {
  const navigate = useNavigate()

  const [data, setData] = useState([])
  const [centers, setCenters] = useState([])
  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [exportModalVisible, setExportModalVisible] = useState(false)

  const [exportStartDate, setExportStartDate] = useState('')
  const [exportEndDate, setExportEndDate] = useState('')

  const [activeSearch, setActiveSearch] = useState({
    center: '',
    product: '',
    startDate: '',
    endDate: '',
    usageType: '',
    keyword: '',
    outlet: '',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // ------------------------------------------------------------
  // FETCH DATA
  // ------------------------------------------------------------

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (searchParams.center) {
        params.append('center', searchParams.center)
      }

      if (searchParams.product) {
        params.append('product', searchParams.product)
      }

      if (searchParams.usageType) {
        params.append('usageType', searchParams.usageType)
      }

      if (searchParams.startDate && searchParams.endDate) {
        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-')
          return `${year}-${month}-${day}`
        }

        params.append(
          'startDate',
          convertDateFormat(searchParams.startDate),
        )

        params.append(
          'endDate',
          convertDateFormat(searchParams.endDate),
        )
      }

      if (searchParams.keyword && searchParams.keyword.trim()) {
        params.append('search', searchParams.keyword.trim())
      }

      if (searchParams.outlet) {
        params.append('outlet', searchParams.outlet)
      }

      params.append('page', page)

      const url = params.toString()
        ? `/reports/requests/summary?${params.toString()}`
        : '/reports/requests/summary'

      const response = await axiosInstance.get(url)

      if (response.data.success) {
        setData(response.data.data || [])
        setFilteredData(response.data.data || [])

        setCurrentPage(response.data.pagination?.currentPage || 1)
        setTotalPages(response.data.pagination?.totalPages || 1)
      } else {
        const errorMessage =
          response.data.message ||
          'API returned unsuccessful response'

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
        setError(
          err.message || 'An error occurred while fetching data',
        )
        console.error('Error message:', err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // ------------------------------------------------------------
  // FETCH CENTERS
  // ------------------------------------------------------------

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers')

      if (response.data.success) {
        setCenters(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching centers:', error)
    }
  }

  // ------------------------------------------------------------
  // FETCH PRODUCTS
  // ------------------------------------------------------------

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all')

      if (response.data.success) {
        setProducts(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // ------------------------------------------------------------
  // INITIAL LOAD
  // ------------------------------------------------------------

  useEffect(() => {
    fetchData()
    fetchCenters()
    fetchProducts()
  }, [])

  // ------------------------------------------------------------
  // PAGINATION
  // ------------------------------------------------------------

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return
    }

    fetchData(activeSearch, page)
  }

  // ------------------------------------------------------------
  // TOTALS
  // ------------------------------------------------------------

  const calculateTotals = () => {
    const displayData =
      filteredData.length > 0 ? filteredData : data

    const totals = {
      totalQty: 0,
    }

    displayData.forEach((item) => {
      totals.totalQty += parseFloat(item.totalQty || 0)
    })

    return totals
  }

  // ------------------------------------------------------------
  // SORT
  // ------------------------------------------------------------

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

    const displayData =
      filteredData.length > 0 ? filteredData : data

    const sortedData = [...displayData].sort((a, b) => {
      let aValue
      let bValue

      if (key.includes('.')) {
        const keys = key.split('.')

        aValue = keys.reduce((obj, k) => obj && obj[k], a)
        bValue = keys.reduce((obj, k) => obj && obj[k], b)
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

    setFilteredData(sortedData)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null
    }

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    )
  }

  // ------------------------------------------------------------
  // SEARCH MODAL
  // ------------------------------------------------------------

  const handleSearch = (searchData) => {
    const mergedSearchData = {
      ...activeSearch,
      ...searchData,
    }

    setActiveSearch(mergedSearchData)
    fetchData(mergedSearchData, 1)
  }

  // ------------------------------------------------------------
  // FRONTEND SEARCH
  // ------------------------------------------------------------

  const handleFrontendSearch = (value = searchTerm) => {
    const trimmedSearch = value.trim().toLowerCase()

    if (!trimmedSearch) {
      setFilteredData(data)
      return
    }

    const filtered = data.filter((item) => {
      if (
        item.product &&
        item.product.toLowerCase().includes(trimmedSearch)
      ) {
        return true
      }

      if (
        item.center &&
        item.center.toLowerCase().includes(trimmedSearch)
      ) {
        return true
      }

      if (
        item.parentCenter &&
        item.parentCenter.toLowerCase().includes(trimmedSearch)
      ) {
        return true
      }

      if (
        item.productCode &&
        item.productCode.toLowerCase().includes(trimmedSearch)
      ) {
        return true
      }

      if (
        item.orderNumbers &&
        item.orderNumbers.some((order) =>
          order.toLowerCase().includes(trimmedSearch),
        )
      ) {
        return true
      }

      return false
    })

    setFilteredData(filtered)
  }

  // ------------------------------------------------------------
  // TOTAL QTY DRILL DOWN
  // ------------------------------------------------------------

  const handleTotalQtyClick = (item) => {
    if (!item.totalQty || !item.centerId || !item.productId) {
      return
    }

    const params = new URLSearchParams()

    params.append('centerId', item.centerId)
    params.append('productId', item.productId)

    if (item.center) {
      params.append(
        'centerName',
        encodeURIComponent(item.center),
      )
    }

    if (item.product) {
      params.append(
        'productName',
        encodeURIComponent(item.product),
      )
    }

    if (activeSearch.startDate && activeSearch.endDate) {
      const [day, month, year] =
        activeSearch.startDate.split('-')

      params.append('month', `${year}-${month}`)
    } else {
      const now = new Date()

      params.append(
        'month',
        `${now.getFullYear()}-${String(
          now.getMonth() + 1,
        ).padStart(2, '0')}`,
      )
    }

    navigate(`/indent-detail?${params.toString()}`)
  }

  // ------------------------------------------------------------
  // CLEAR FRONTEND SEARCH
  // ------------------------------------------------------------

  const clearFrontendSearch = () => {
    setSearchTerm('')
    setFilteredData(data)
  }

  // ------------------------------------------------------------
  // RESET SEARCH
  // ------------------------------------------------------------

  const handleResetSearch = () => {
    setActiveSearch({
      center: '',
      product: '',
      startDate: '',
      endDate: '',
      usageType: '',
      keyword: '',
      outlet: '',
    })

    setSearchTerm('')
    setFilteredData(data)

    fetchData({}, 1)
  }

  const isSearchActive = () => {
    return (
      activeSearch.center ||
      activeSearch.product ||
      activeSearch.startDate ||
      activeSearch.endDate ||
      activeSearch.usageType ||
      activeSearch.keyword ||
      activeSearch.outlet
    )
  }

  // ------------------------------------------------------------
  // EXPORT
  // ------------------------------------------------------------

  const openExportModal = () => {
    setExportStartDate(activeSearch.startDate || '')
    setExportEndDate(activeSearch.endDate || '')
    setExportModalVisible(true)
  }

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

      if (activeSearch.center) {
        params.append('center', activeSearch.center)
      }

      if (activeSearch.product) {
        params.append('product', activeSearch.product)
      }

      if (activeSearch.usageType) {
        params.append('usageType', activeSearch.usageType)
      }

      const convertDateFormat = (dateStr) => {
        if (dateStr.includes('-')) {
          const parts = dateStr.split('-')

          if (
            parts[0].length === 2 &&
            parts[1].length === 2 &&
            parts[2].length === 4
          ) {
            const [day, month, year] = parts
            return `${year}-${month}-${day}`
          }
        }

        return dateStr
      }

      if (exportStartDate) {
        params.append(
          'startDate',
          convertDateFormat(exportStartDate),
        )
      }

      if (exportEndDate) {
        params.append(
          'endDate',
          convertDateFormat(exportEndDate),
        )
      }

      if (activeSearch.keyword) {
        params.append('search', activeSearch.keyword)
      }

      if (activeSearch.outlet) {
        params.append('outlet', activeSearch.outlet)
      }

      const apiUrl = params.toString()
        ? `/reports/requests/summary?${params.toString()}`
        : '/reports/requests/summary'

      const response = await axiosInstance.get(apiUrl)

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response')
      }

      const exportData = response.data.data

      if (!exportData || exportData.length === 0) {
        showError('No data available for export')
        return
      }

      const headers = [
        'Center',
        'Parent Center',
        'Product',
        'Total Qty',
      ]

      const csvData = exportData.map((item) => [
        item.center || '',
        item.parentCenter || '',
        item.product || '',
        item.totalQty || 0,
      ])

      let filename = 'indent_summary_report'

      if (exportStartDate && exportEndDate) {
        filename += `_${exportStartDate}_to_${exportEndDate}`
      } else if (exportStartDate) {
        filename += `_from_${exportStartDate}`
      } else if (exportEndDate) {
        filename += `_until_${exportEndDate}`
      } else {
        filename += `_${new Date().toISOString().split('T')[0]}`
      }

      filename += '.csv'

      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const stringField = String(field || '')

              return `"${stringField.replace(/"/g, '""')}"`
            })
            .join(','),
        ),
      ].join('\n')

      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;',
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
    } catch (error) {
      console.error('Error generating export:', error)
      showError('Error generating export file')
    } finally {
      setLoading(false)
    }
  }

  // ------------------------------------------------------------
  // LOADING
  // ------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    )
  }

  // ------------------------------------------------------------
  // ERROR
  // ------------------------------------------------------------

  if (error) {
    return (
      <div className="m-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  const totals = calculateTotals()

  const displayData =
    filteredData.length > 0 ? filteredData : data

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* PAGE TITLE */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        <h1 className="text-[25px] font-normal leading-8 text-[#263746]">
          Indent Summary Report
        </h1>
      </div>

      {/* SEARCH MODAL */}
      <SearchIndentSummary
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
      />

      {/* EXPORT MODAL WITH TOP-DOWN ANIMATION */}
      {exportModalVisible && (
        <>
          <style>
            {`
              @keyframes exportModalDrop {
                from {
                  opacity: 0;
                  transform: translateY(-70px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              @keyframes exportOverlayFade {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }

              .export-modal-overlay {
                animation: exportOverlayFade 200ms ease-out both;
              }

              .export-modal-panel {
                animation: exportModalDrop 350ms cubic-bezier(0.16, 1, 0.3, 1) both;
                will-change: transform, opacity;
              }

              @media (prefers-reduced-motion: reduce) {
                .export-modal-overlay,
                .export-modal-panel {
                  animation: none;
                }
              }
            `}
          </style>

          {/* OVERLAY */}
          <div className="export-modal-overlay fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            {/* MODAL PANEL */}
            <div className="export-modal-panel my-auto w-full max-w-md overflow-hidden rounded-md bg-white shadow-2xl">
              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Export Indent Summary Report
                </h2>

                <button
                  type="button"
                  onClick={() => setExportModalVisible(false)}
                  aria-label="Close export modal"
                  className="rounded p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* BODY */}
              <div className="space-y-5 p-5">
                {/* START DATE */}
                <div>
                  <label
                    htmlFor="exportStartDate"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Start Date (Optional)
                  </label>

                  <input
                    id="exportStartDate"
                    type="date"
                    value={exportStartDate}
                    onChange={(e) =>
                      setExportStartDate(e.target.value)
                    }
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty to include all records from beginning
                  </p>
                </div>

                {/* END DATE */}
                <div>
                  <label
                    htmlFor="exportEndDate"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    End Date (Optional)
                  </label>

                  <input
                    id="exportEndDate"
                    type="date"
                    value={exportEndDate}
                    onChange={(e) =>
                      setExportEndDate(e.target.value)
                    }
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty to include all records until today
                  </p>
                </div>

                {/* CURRENT FILTERS */}
                {(activeSearch.center ||
                  activeSearch.product ||
                  activeSearch.usageType ||
                  activeSearch.outlet ||
                  activeSearch.keyword) && (
                  <div className="rounded-md bg-slate-50 p-3">
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Current Filters:
                    </p>

                    <ul className="space-y-1 text-sm text-slate-600">
                      {activeSearch.center && (
                        <li>
                          Center:{' '}
                          {centers.find(
                            (c) => c._id === activeSearch.center,
                          )?.centerName || ''}
                        </li>
                      )}

                      {activeSearch.product && (
                        <li>
                          Product:{' '}
                          {products.find(
                            (p) => p._id === activeSearch.product,
                          )?.productTitle || ''}
                        </li>
                      )}

                      {activeSearch.usageType && (
                        <li>
                          Usage Type: {activeSearch.usageType}
                        </li>
                      )}

                      {activeSearch.outlet && (
                        <li>
                          Outlet: {activeSearch.outlet}
                        </li>
                      )}

                      {activeSearch.keyword && (
                        <li>
                          Keyword: {activeSearch.keyword}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setExportModalVisible(false)}
                  className="rounded-md bg-slate-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={generateDetailExport}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  <FileSpreadsheet size={16} />
                  Export
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MAIN CARD */}
      <div className="overflow-hidden rounded-[3px] border-t-4 border-t-[#285ca8] bg-white shadow-sm">
        {/* CARD HEADER */}
        <div className="flex flex-col gap-3 border-b border-[#d8dde5] bg-white px-4 py-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex items-center gap-1 rounded-[3px] bg-[#285ca8] px-2 py-2 text-[13px] font-medium text-white transition hover:bg-[#204b8c]"
            >
              <Search size={15} />
              Search
            </button>

            {isSearchActive() && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-1 rounded-[3px] border border-slate-300 bg-white px-2 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <RotateCcw size={14} />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={openExportModal}
              disabled={data.length === 0}
              className="inline-flex items-center gap-1 rounded-[3px] bg-[#285ca8] px-2 py-2 text-[13px] font-medium text-white transition hover:bg-[#204b8c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileSpreadsheet size={15} />
              Export
            </button>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* CARD BODY */}
        <div className="p-4">
          {/* SUMMARY */}
          <div className="mb-5 rounded-[5px] border border-[#00b5d4] bg-[#08b8d6] px-5 py-3 text-white">
            <h4 className="mb-1 text-[18px] font-semibold">
              Showing Result
            </h4>

            <ul className="space-y-1 text-[15px]">
              <li className="font-semibold">
                {formatDisplayDate(
                  activeSearch.startDate,
                  activeSearch.endDate,
                )}
              </li>

              {searchTerm && (
                <li className="font-semibold">
                  Search: "{searchTerm}" - {displayData.length} results
                </li>
              )}
            </ul>
          </div>

          {/* TABLE SEARCH */}
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              {(exportStartDate || exportEndDate) && (
                <div className="text-xs text-slate-500">
                  {exportStartDate &&
                    `Export From: ${exportStartDate} `}

                  {exportEndDate && `To: ${exportEndDate}`}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <label className="whitespace-nowrap text-sm font-medium text-[#263746]">
                Search:
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value

                  setSearchTerm(value)

                  if (value.trim()) {
                    handleFrontendSearch(value)
                  } else {
                    setFilteredData(data)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    e.stopPropagation()
                    handleFrontendSearch()
                  }
                }}
                placeholder="Type to search products, centers, orders..."
                className="h-[31px] w-full max-w-[350px] rounded-[2px] border border-[#d5dbe3] bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#285ca8]"
              />

              <button
                type="button"
                onClick={() => handleFrontendSearch()}
                className="inline-flex h-[31px] shrink-0 items-center justify-center rounded-[3px] bg-[#285ca8] px-2 text-white transition hover:bg-[#204b8c]"
                aria-label="Search table"
              >
                <Search size={15} />
              </button>

              {searchTerm && (
                <button
                  type="button"
                  onClick={clearFrontendSearch}
                  title="Clear search"
                  className="inline-flex h-[31px] shrink-0 items-center justify-center rounded-[3px] border border-slate-300 bg-white px-2 text-slate-600 transition hover:bg-slate-50"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto border border-[#e4e7eb]">
            <table className="w-full min-w-[700px] border-collapse text-[14px]">
              <thead>
                <tr className="bg-white">
                  {[
                    ['center', 'Branch'],
                    ['parentCenter', 'Branch Center'],
                    ['product', 'Product'],
                    ['totalQty', 'Total Qty'],
                  ].map(([key, label]) => (
                    <th
                      key={key}
                      scope="col"
                      onClick={() => handleSort(key)}
                      className="cursor-pointer whitespace-nowrap border border-[#e7e7e7] px-2 py-2.5 text-left text-[15px] font-semibold text-[#151515] transition hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        {getSortIcon(key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {displayData.length > 0 ? (
                  <>
                    {displayData.map((item, index) => (
                      <tr
                        key={
                          item._id ||
                          `${item.center}-${item.product}-${index}`
                        }
                        className="bg-[#f0f2f3] transition hover:bg-[#e9edef]"
                      >
                        <td className="border-b border-white px-2 py-2.5 text-[#151515]">
                          {item.center || ''}
                        </td>

                        <td className="border-b border-white px-2 py-2.5 text-[#151515]">
                          {item.parentCenter || 'N/A'}
                        </td>

                        <td className="border-b border-white px-2 py-2.5 text-[#151515]">
                          {item.product || 'No Product'}
                        </td>

                        <td className="border-b border-white px-2 py-2.5 text-[#285ca8]">
                          <button
                            type="button"
                            onClick={() => handleTotalQtyClick(item)}
                            disabled={!item.totalQty}
                            title={
                              item.totalQty > 0
                                ? 'Click to view detail requests'
                                : ''
                            }
                            className={`${
                              item.totalQty > 0
                                ? 'cursor-pointer text-[#285ca8] hover:underline'
                                : 'cursor-default text-[#151515]'
                            }`}
                          >
                            {item.totalQty || 0}
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* TOTAL ROW */}
                    <tr className="bg-[#dff0d8]">
                      <td
                        colSpan={3}
                        className="border-t border-white px-2 py-2.5 text-left font-medium text-[#151515]"
                      >
                        Total
                      </td>

                      <td className="border-t border-white px-2 py-2.5 font-medium text-[#151515]">
                        {totals.totalQty.toFixed(2)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      {searchTerm
                        ? `No results found for "${searchTerm}"`
                        : 'No data found'}
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

export default IndentSummary