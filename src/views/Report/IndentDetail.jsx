// import React, { useEffect, useState } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
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
// import { formatDate } from '../../utils/FormatDateTime'
// import { showError, showSuccess } from '../../utils/sweetAlerts'
// import CommonSearch from './CommonSearch'

// const IndentDetail = () => {
//   const [data, setData] = useState([])
//   const [centers, setCenters] = useState([])
//   const [products, setProducts] = useState([])

//   const [loading, setLoading] = useState(true)
//   const [exportLoading, setExportLoading] = useState(false)
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
//     center: '',
//     product: '',
//     startDate: '',
//     endDate: '',
//     date: '',
//   })

//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const location = useLocation()
//   const navigate = useNavigate()

//   // ------------------------------------------------------------
//   // URL PARAMETERS
//   // ------------------------------------------------------------

//   const getUrlParams = () => {
//     const searchParams = new URLSearchParams(location.search)

//     return {
//       product: searchParams.get('product'),
//       center: searchParams.get('center'),
//       productId: searchParams.get('productId'),
//       centerId: searchParams.get('centerId'),
//       productName: searchParams.get('productName'),
//       centerName: searchParams.get('centerName'),
//       month: searchParams.get('month'),
//     }
//   }

//   // Mongo ObjectId validation
//   const isValidObjectId = (value) =>
//     /^[0-9a-fA-F]{24}$/.test(value || '')

//   // Resolve ID or display name to Mongo ObjectId
//   const resolveIdFromNameOrId = (
//     value,
//     list,
//     idField,
//     nameField,
//   ) => {
//     if (!value) return ''

//     if (isValidObjectId(value)) {
//       return value
//     }

//     const decoded = decodeURIComponent(value)
//       .trim()
//       .toLowerCase()

//     const match = list.find(
//       (item) =>
//         (item[nameField] || '').trim().toLowerCase() === decoded,
//     )

//     return match ? match[idField] : ''
//   }

//   // ------------------------------------------------------------
//   // INITIAL DATA
//   // ------------------------------------------------------------

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setLoading(true)

//         const urlParams = getUrlParams()

//         console.log(
//           '🔍 Indent Detail URL Parameters:',
//           urlParams,
//         )

//         const [fetchedCenters, fetchedProducts] =
//           await Promise.all([
//             fetchCenters(),
//             fetchProducts(),
//           ])

//         const hasUrlFilters =
//           urlParams.product ||
//           urlParams.center ||
//           urlParams.productId ||
//           urlParams.centerId

//         let searchParams = {}

//         if (hasUrlFilters) {
//           const resolvedCenter =
//             (urlParams.centerId &&
//               isValidObjectId(urlParams.centerId) &&
//               urlParams.centerId) ||
//             resolveIdFromNameOrId(
//               urlParams.center,
//               fetchedCenters || [],
//               '_id',
//               'centerName',
//             )

//           const resolvedProduct =
//             (urlParams.productId &&
//               isValidObjectId(urlParams.productId) &&
//               urlParams.productId) ||
//             resolveIdFromNameOrId(
//               urlParams.product,
//               fetchedProducts || [],
//               '_id',
//               'productTitle',
//             )

//           if (urlParams.center && !resolvedCenter) {
//             console.warn(
//               `⚠️ Could not resolve center "${urlParams.center}" to an id; ignoring center filter.`,
//             )
//           }

//           if (urlParams.product && !resolvedProduct) {
//             console.warn(
//               `⚠️ Could not resolve product "${urlParams.product}" to an id; ignoring product filter.`,
//             )
//           }

//           searchParams = {
//             product: resolvedProduct || '',
//             center: resolvedCenter || '',
//             startDate: '',
//             endDate: '',
//             date: '',
//           }

//           if (urlParams.month) {
//             const [year, month] = urlParams.month.split('-')

//             const normalizedMonth = month.padStart(2, '0')

//             const monthStart = `${year}-${normalizedMonth}-01`

//             const lastDay = new Date(
//               parseInt(year, 10),
//               parseInt(month, 10),
//               0,
//             ).getDate()

//             const monthEnd =
//               `${year}-${normalizedMonth}-${lastDay}`

//             searchParams.startDate = monthStart
//             searchParams.endDate = monthEnd

//             searchParams.date =
//               `01-${normalizedMonth}-${year} to ` +
//               `${lastDay}-${normalizedMonth}-${year}`
//           }

//           console.log(
//             '✅ Using filtered search from URL:',
//             searchParams,
//           )
//         } else {
//           console.log(
//             'ℹ️ No URL filters, showing all data',
//           )
//         }

//         setActiveSearch((prev) => ({
//           ...prev,
//           ...searchParams,
//         }))

//         await fetchData(searchParams, 1)

//         if (
//           urlParams.productName &&
//           urlParams.centerName
//         ) {
//           const title =
//             `Indent Details - ${decodeURIComponent(
//               urlParams.productName,
//             )} at ${decodeURIComponent(
//               urlParams.centerName,
//             )}`

//           document.title = title

//           console.log(
//             '📝 Document title set:',
//             title,
//           )
//         }
//       } catch (error) {
//         console.error(
//           '❌ Error initializing data:',
//           error,
//         )

//         setError(error.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     initializeData()
//   }, [location.search])

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

//       console.log(
//         '📤 Fetching data with params:',
//         searchParams,
//       )

//       if (searchParams.center) {
//         params.append(
//           'centerId',
//           searchParams.center,
//         )
//       }

//       if (searchParams.product) {
//         params.append(
//           'productId',
//           searchParams.product,
//         )
//       }

//       if (
//         searchParams.startDate &&
//         searchParams.endDate
//       ) {
//         params.append(
//           'startDate',
//           searchParams.startDate,
//         )

//         params.append(
//           'endDate',
//           searchParams.endDate,
//         )
//       } else if (
//         searchParams.date &&
//         searchParams.date.includes(' to ')
//       ) {
//         const [
//           startDateStr,
//           endDateStr,
//         ] = searchParams.date.split(' to ')

//         const convertDateFormat = (dateStr) => {
//           const [day, month, year] =
//             dateStr.split('-')

//           return `${year}-${month}-${day}`
//         }

//         params.append(
//           'startDate',
//           convertDateFormat(startDateStr),
//         )

//         params.append(
//           'endDate',
//           convertDateFormat(endDateStr),
//         )
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/reports/requests?${params.toString()}`
//         : '/reports/requests'

//       console.log('🌐 API URL:', url)

//       const response =
//         await axiosInstance.get(url)

//       console.log(
//         '📥 API Response:',
//         response.data,
//       )

//       if (response.data.success) {
//         setData(response.data.data || [])

//         setCurrentPage(
//           response.data.pagination
//             ?.currentPage || 1,
//         )

//         setTotalPages(
//           response.data.pagination
//             ?.totalPages || 1,
//         )

//         console.log(
//           `✅ Loaded ${
//             response.data.data?.length || 0
//           } records`,
//         )

//         if (
//           searchParams.center ||
//           searchParams.product
//         ) {
//           console.log(
//             `🔍 Filtered results: ${
//               response.data.data?.length || 0
//             } records`,
//           )
//         }
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
//         setCenters(response.data.data)

//         return response.data.data
//       }

//       return []
//     } catch (error) {
//       console.error(
//         'Error fetching centers:',
//         error,
//       )

//       return []
//     }
//   }

//   // ------------------------------------------------------------
//   // FETCH PRODUCTS
//   // ------------------------------------------------------------

//   const fetchProducts = async () => {
//     try {
//       const response =
//         await axiosInstance.get('/products/all')

//       if (response.data.success) {
//         setProducts(response.data.data)

//         return response.data.data
//       }

//       return []
//     } catch (error) {
//       console.error(
//         'Error fetching products:',
//         error,
//       )

//       return []
//     }
//   }

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
//   // PROFILE
//   // ------------------------------------------------------------

//   const handleClick = (itemId) => {
//     navigate(
//       `/IndentDetail-profile/${itemId}`,
//     )
//   }

//   // ------------------------------------------------------------
//   // FLATTEN PRODUCTS
//   // ------------------------------------------------------------

//   const getFlattenedData = () => {
//     const flattened = []

//     data.forEach((request) => {
//       if (
//         request.products &&
//         request.products.length > 0
//       ) {
//         request.products.forEach((product) => {
//           flattened.push({
//             ...request,
//             productDetail: product,
//             uniqueKey:
//               `${request._id}_${product._id}`,
//           })
//         })
//       } else {
//         flattened.push({
//           ...request,
//           productDetail: null,
//           uniqueKey:
//             `${request._id}_no_product`,
//         })
//       }
//     })

//     return flattened
//   }

//   // ------------------------------------------------------------
//   // TOTALS
//   // ------------------------------------------------------------

//   const calculateTotals = () => {
//     const totals = {
//       totalRequestedQty: 0,
//       totalApprovedQty: 0,
//       totalReceivedQty: 0,
//     }

//     getFlattenedData().forEach((item) => {
//       if (item.productDetail) {
//         totals.totalRequestedQty +=
//           parseFloat(
//             item.productDetail.quantity || 0,
//           )

//         totals.totalApprovedQty +=
//           parseFloat(
//             item.productDetail
//               .approvedQuantity || 0,
//           )

//         totals.totalReceivedQty +=
//           parseFloat(
//             item.productDetail
//               .receivedQuantity || 0,
//           )
//       }
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
//       sortConfig.direction === 'ascending'
//     ) {
//       direction = 'descending'
//     }

//     setSortConfig({
//       key,
//       direction,
//     })

//     const sortedData = [...data].sort(
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

//     setData(sortedData)
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
//   // SEARCH
//   // ------------------------------------------------------------

//   const handleSearch = (searchData) => {
//     const mergedSearch = {
//       ...activeSearch,
//       ...searchData,
//     }

//     setActiveSearch(mergedSearch)

//     fetchData(mergedSearch, 1)
//   }

//   const handleResetSearch = () => {
//     const resetSearch = {
//       center: '',
//       product: '',
//       startDate: '',
//       endDate: '',
//       date: '',
//     }

//     setActiveSearch(resetSearch)
//     setSearchTerm('')

//     fetchData({}, 1)
//   }

//   // ------------------------------------------------------------
//   // EXPORT MODAL
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

//   // ------------------------------------------------------------
//   // CSV EXPORT
//   // ------------------------------------------------------------

//   const generateExport = async () => {
//     try {
//       setExportLoading(true)

//       if (
//         exportStartDate &&
//         exportEndDate &&
//         exportStartDate > exportEndDate
//       ) {
//         showError(
//           'Start date cannot be greater than end date',
//         )

//         setExportLoading(false)
//         return
//       }

//       const params = new URLSearchParams()

//       if (activeSearch.center) {
//         params.append(
//           'centerId',
//           activeSearch.center,
//         )
//       }

//       if (activeSearch.product) {
//         params.append(
//           'productId',
//           activeSearch.product,
//         )
//       }

//       if (exportStartDate) {
//         params.append(
//           'startDate',
//           exportStartDate,
//         )
//       }

//       if (exportEndDate) {
//         params.append(
//           'endDate',
//           exportEndDate,
//         )
//       }

//       params.append('export', 'true')

//       const apiUrl =
//         `/reports/requests?${params.toString()}`

//       const response =
//         await axiosInstance.get(apiUrl)

//       if (!response.data.success) {
//         throw new Error(
//           'API returned unsuccessful response',
//         )
//       }

//       const exportData =
//         response.data.data || []

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
//         'Indent No',
//         'Date',
//         'Branch',
//         'Parent Branch',
//         'Product',
//         'Requested Qty',
//         'Center Stock',
//         'Parent Stock',
//         'Approved Qty',
//         'Received Qty',
//       ]

//       const csvData = []

//       let totalRequestedQty = 0
//       let totalApprovedQty = 0
//       let totalReceivedQty = 0

//       exportData.forEach((request) => {
//         if (
//           request.products &&
//           request.products.length > 0
//         ) {
//           request.products.forEach(
//             (product) => {
//               const requestedQty =
//                 parseFloat(
//                   product.quantity || 0,
//                 )

//               const approvedQty =
//                 parseFloat(
//                   product.approvedQuantity ||
//                     0,
//                 )

//               const receivedQty =
//                 parseFloat(
//                   product.receivedQuantity ||
//                     0,
//                 )

//               totalRequestedQty +=
//                 requestedQty

//               totalApprovedQty +=
//                 approvedQty

//               totalReceivedQty +=
//                 receivedQty

//               csvData.push([
//                 request.orderNumber || '',
//                 formatDate(
//                   request.date || '',
//                 ),
//                 request.center
//                   ?.centerName || '',
//                 request.warehouse
//                   ?.centerName || '',
//                 product.product
//                   ?.productTitle ||
//                   'No Product',
//                 requestedQty,
//                 product.centerStock
//                   ?.availableQuantity || 0,
//                 product.outletStock
//                   ?.availableQuantity || 0,
//                 approvedQty,
//                 receivedQty,
//               ])
//             },
//           )
//         } else {
//           csvData.push([
//             request.orderNumber || '',
//             formatDate(
//               request.date || '',
//             ),
//             request.center
//               ?.centerName || '',
//             request.warehouse
//               ?.centerName || '',
//             'No Product',
//             0,
//             0,
//             0,
//             0,
//             0,
//           ])
//         }
//       })

//       csvData.push([])

//       csvData.push([
//         'Total',
//         '',
//         '',
//         '',
//         '',
//         totalRequestedQty,
//         '',
//         '',
//         totalApprovedQty,
//         totalReceivedQty,
//       ])

//       const csvContent = [
//         headers.join(','),
//         ...csvData.map((row) =>
//           row
//             .map((field) => {
//               const stringField = String(
//                 field !== undefined &&
//                   field !== null
//                   ? field
//                   : '',
//               )

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

//       let fileName = 'Indent_Report'

//       if (
//         exportStartDate &&
//         exportEndDate
//       ) {
//         fileName +=
//           `_${exportStartDate}_to_${exportEndDate}`
//       } else if (exportStartDate) {
//         fileName +=
//           `_from_${exportStartDate}`
//       } else if (exportEndDate) {
//         fileName +=
//           `_until_${exportEndDate}`
//       } else {
//         fileName +=
//           `_${new Date()
//             .toISOString()
//             .split('T')[0]}`
//       }

//       if (
//         activeSearch.center ||
//         activeSearch.product
//       ) {
//         const centerName =
//           activeSearch.center
//             ? `_Center_${activeSearch.center}`
//             : ''

//         const productName =
//           activeSearch.product
//             ? `_Product_${activeSearch.product}`
//             : ''

//         fileName +=
//           `${centerName}${productName}`
//       }

//       link.setAttribute(
//         'download',
//         `${fileName}.csv`,
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
//       setExportLoading(false)
//     }
//   }

//   // ------------------------------------------------------------
//   // LOCAL SEARCH
//   // ------------------------------------------------------------

//   const filteredFlattenedData =
//     getFlattenedData().filter((item) => {
//       if (
//         activeSearch.center ||
//         activeSearch.product ||
//         activeSearch.startDate ||
//         activeSearch.endDate
//       ) {
//         return true
//       }

//       return Object.values(item).some(
//         (value) => {
//           if (
//             typeof value === 'object' &&
//             value !== null
//           ) {
//             return Object.values(
//               value,
//             ).some(
//               (nestedValue) =>
//                 nestedValue &&
//                 nestedValue
//                   .toString()
//                   .toLowerCase()
//                   .includes(
//                     searchTerm.toLowerCase(),
//                   ),
//             )
//           }

//           return (
//             value &&
//             value
//               .toString()
//               .toLowerCase()
//               .includes(
//                 searchTerm.toLowerCase(),
//               )
//           )
//         },
//       )
//     })

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

//   const hasActiveFilters =
//     activeSearch.center ||
//     activeSearch.product

//   return (
//     <div className="w-full p-4 md:p-5">
//       {/* PAGE TITLE */}
//       <div className="mb-5">
//         <h1 className="text-xl font-semibold text-slate-800">
//           Indent Detail Report
//         </h1>
//       </div>

//       {/* SEARCH MODAL */}
//       <CommonSearch
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//         initialValues={activeSearch}
//       />

//       {/* EXPORT MODAL */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
//           <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
//             {/* Header */}
//             <div className="flex items-center justify-between border-b px-5 py-4">
//               <h2 className="text-lg font-semibold text-slate-800">
//                 Export Indent Detail Report
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
//                 activeSearch.product) && (
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
//                 onClick={generateExport}
//                 disabled={exportLoading}
//                 className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {exportLoading ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Exporting...
//                   </>
//                 ) : (
//                   <>
//                     <FileSpreadsheet size={16} />
//                     Export
//                   </>
//                 )}
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

//             {(activeSearch.center ||
//               activeSearch.product ||
//               activeSearch.startDate ||
//               activeSearch.endDate) && (
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
//               disabled={
//                 exportLoading ||
//                 data.length === 0
//               }
//               className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <FileSpreadsheet size={16} />
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
//           {/* Search + export dates */}
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
//                 onChange={(e) =>
//                   setSearchTerm(
//                     e.target.value,
//                   )
//                 }
//                 placeholder="Search in table..."
//                 className="h-9 w-full max-w-[350px] rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//             </div>
//           </div>

//           {/* TABLE */}
//           <div className="overflow-x-auto rounded-lg border border-slate-200">
//             <table className="min-w-[1200px] w-full border-collapse text-sm">
//               <thead>
//                 <tr className="bg-slate-50">
//                   {[
//                     ['orderNumber', 'Indent No'],
//                     ['date', 'Date'],
//                     ['center.centerName', 'Branch'],
//                     [
//                       'warehouse.centerName',
//                       'Parent Branch',
//                     ],
//                     [
//                       'productDetail.product.productTitle',
//                       'Product',
//                     ],
//                     [
//                       'productDetail.quantity',
//                       'Requested Qty',
//                     ],
//                     [
//                       'productDetail.centerStock.availableQuantity',
//                       'Center Stock',
//                     ],
//                     [
//                       'productDetail.outletStock.availableQuantity',
//                       'Parent Stock',
//                     ],
//                     [
//                       'productDetail.approvedQuantity',
//                       'Approved Qty',
//                     ],
//                     [
//                       'productDetail.receivedQuantity',
//                       'Received Qty',
//                     ],
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
//                 {filteredFlattenedData.length >
//                 0 ? (
//                   <>
//                     {filteredFlattenedData.map(
//                       (item) => (
//                         <tr
//                           key={item.uniqueKey}
//                           className="border-b border-slate-100 transition hover:bg-slate-50"
//                         >
//                           <td className="whitespace-nowrap px-4 py-3">
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleClick(
//                                   item._id,
//                                 )
//                               }
//                               className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
//                             >
//                               {item.orderNumber ||
//                                 ''}
//                             </button>
//                           </td>

//                           <td className="whitespace-nowrap px-4 py-3 text-slate-600">
//                             {formatDate(
//                               item.date || '',
//                             )}
//                           </td>

//                           <td className="px-4 py-3 text-slate-600">
//                             {item.center
//                               ?.centerName || ''}
//                           </td>

//                           <td className="px-4 py-3 text-slate-600">
//                             {item.warehouse
//                               ?.centerName || ''}
//                           </td>

//                           <td className="px-4 py-3 text-slate-700">
//                             {item
//                               .productDetail
//                               ?.product
//                               ?.productTitle ||
//                               'No Product'}
//                           </td>

//                           <td className="px-4 py-3 text-slate-700">
//                             {item
//                               .productDetail
//                               ?.quantity || 0}
//                           </td>

//                           <td className="px-4 py-3 text-slate-700">
//                             {item
//                               .productDetail
//                               ?.centerStock
//                               ?.availableQuantity ||
//                               0}
//                           </td>

//                           <td className="px-4 py-3 text-slate-700">
//                             {item
//                               .productDetail
//                               ?.outletStock
//                               ?.availableQuantity ||
//                               0}
//                           </td>

//                           <td className="px-4 py-3 text-slate-700">
//                             {item
//                               .productDetail
//                               ?.approvedQuantity ||
//                               0}
//                           </td>

//                           <td className="px-4 py-3 text-slate-700">
//                             {item
//                               .productDetail
//                               ?.receivedQuantity ||
//                               0}
//                           </td>
//                         </tr>
//                       ),
//                     )}

//                     {/* TOTAL ROW */}
//                     <tr className="bg-slate-50 font-semibold">
//                       <td
//                         colSpan={5}
//                         className="px-4 py-3 text-right text-slate-800"
//                       >
//                         Total
//                       </td>

//                       <td className="px-4 py-3 text-slate-800">
//                         {
//                           totals.totalRequestedQty
//                         }
//                       </td>

//                       <td className="px-4 py-3" />

//                       <td className="px-4 py-3" />

//                       <td className="px-4 py-3 text-slate-800">
//                         {
//                           totals.totalApprovedQty
//                         }
//                       </td>

//                       <td className="px-4 py-3 text-slate-800">
//                         {
//                           totals.totalReceivedQty
//                         }
//                       </td>
//                     </tr>
//                   </>
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={10}
//                       className="px-4 py-10 text-center text-sm text-slate-500"
//                     >
//                       No data found
//                       {hasActiveFilters &&
//                         ' with the current filters'}
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

// export default IndentDetail





import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  FileSpreadsheet,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import { formatDate } from '../../utils/FormatDateTime'
import { showError, showSuccess } from '../../utils/sweetAlerts'
import CommonSearch from './CommonSearch'

// ------------------------------------------------------------
// PAGINATION UI
// ------------------------------------------------------------

const ReportPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const page = Number(currentPage) || 1
  const pages = Math.max(Number(totalPages) || 1, 1)

  const buttonBase =
    'inline-flex h-[31px] min-w-[28px] items-center justify-center border border-[#d8dee8] px-[9px] text-[13px] leading-none transition-colors'

  const normalButton =
    `${buttonBase} bg-white text-[#3f51b5] hover:bg-[#eef0ff]`

  const disabledButton =
    `${buttonBase} cursor-not-allowed bg-[#e9ecef] text-[#87909d]`

  const activeButton =
    `${buttonBase} border-[#5146d8] bg-[#5146d8] text-white`

  const getVisiblePages = () => {
    if (pages <= 4) {
      return Array.from({ length: pages }, (_, index) => index + 1)
    }

    if (page <= 2) {
      return [1, 2, 3]
    }

    if (page >= pages - 1) {
      return [pages - 2, pages - 1, pages]
    }

    return [page - 1, page, page + 1]
  }

  const visiblePages = getVisiblePages()
  const showEllipsis =
    pages > 4 && visiblePages[visiblePages.length - 1] < pages

  return (
    <nav
      aria-label="Pagination"
      className="flex max-w-full items-center justify-end overflow-x-auto"
    >
      <div className="inline-flex shrink-0 items-center">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className={`${page <= 1 ? disabledButton : normalButton} rounded-l-[4px]`}
        >
          First
        </button>

        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={page <= 1 ? disabledButton : normalButton}
        >
          &lt;
        </button>

        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            aria-label={`Page ${pageNumber}`}
            aria-current={pageNumber === page ? 'page' : undefined}
            className={
              pageNumber === page ? activeButton : normalButton
            }
          >
            {pageNumber}
          </button>
        ))}

        {showEllipsis && (
          <span
            aria-hidden="true"
            className={`${buttonBase} cursor-default bg-[#e9ecef] text-[#687385]`}
          >
            ...
          </span>
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          aria-label="Next page"
          className={page >= pages ? disabledButton : normalButton}
        >
          &gt;
        </button>

        <button
          type="button"
          onClick={() => onPageChange(pages)}
          disabled={page >= pages}
          className={`${page >= pages ? disabledButton : normalButton} rounded-r-[4px]`}
        >
          Last
        </button>
      </div>
    </nav>
  )
}

const IndentDetail = () => {
  const [data, setData] = useState([])
  const [centers, setCenters] = useState([])
  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
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
    center: '',
    product: '',
    startDate: '',
    endDate: '',
    date: '',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const location = useLocation()
  const navigate = useNavigate()

  // ------------------------------------------------------------
  // URL PARAMETERS
  // ------------------------------------------------------------

  const getUrlParams = () => {
    const searchParams = new URLSearchParams(location.search)

    return {
      product: searchParams.get('product'),
      center: searchParams.get('center'),
      productId: searchParams.get('productId'),
      centerId: searchParams.get('centerId'),
      productName: searchParams.get('productName'),
      centerName: searchParams.get('centerName'),
      month: searchParams.get('month'),
    }
  }

  const isValidObjectId = (value) =>
    /^[0-9a-fA-F]{24}$/.test(value || '')

  const resolveIdFromNameOrId = (
    value,
    list,
    idField,
    nameField,
  ) => {
    if (!value) return ''

    if (isValidObjectId(value)) return value

    const decoded = decodeURIComponent(value).trim().toLowerCase()

    const match = list.find(
      (item) =>
        (item[nameField] || '').trim().toLowerCase() === decoded,
    )

    return match ? match[idField] : ''
  }

  // ------------------------------------------------------------
  // INITIAL DATA
  // ------------------------------------------------------------

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)

        const urlParams = getUrlParams()

        const [fetchedCenters, fetchedProducts] = await Promise.all([
          fetchCenters(),
          fetchProducts(),
        ])

        const hasUrlFilters =
          urlParams.product ||
          urlParams.center ||
          urlParams.productId ||
          urlParams.centerId

        let searchParams = {}

        if (hasUrlFilters) {
          const resolvedCenter =
            (urlParams.centerId &&
              isValidObjectId(urlParams.centerId) &&
              urlParams.centerId) ||
            resolveIdFromNameOrId(
              urlParams.center,
              fetchedCenters || [],
              '_id',
              'centerName',
            )

          const resolvedProduct =
            (urlParams.productId &&
              isValidObjectId(urlParams.productId) &&
              urlParams.productId) ||
            resolveIdFromNameOrId(
              urlParams.product,
              fetchedProducts || [],
              '_id',
              'productTitle',
            )

          if (urlParams.center && !resolvedCenter) {
            console.warn(
              `Could not resolve center "${urlParams.center}" to an id; ignoring center filter.`,
            )
          }

          if (urlParams.product && !resolvedProduct) {
            console.warn(
              `Could not resolve product "${urlParams.product}" to an id; ignoring product filter.`,
            )
          }

          searchParams = {
            product: resolvedProduct || '',
            center: resolvedCenter || '',
            startDate: '',
            endDate: '',
            date: '',
          }

          if (urlParams.month) {
            const [year, month] = urlParams.month.split('-')
            const normalizedMonth = month.padStart(2, '0')
            const monthStart = `${year}-${normalizedMonth}-01`

            const lastDay = new Date(
              parseInt(year, 10),
              parseInt(month, 10),
              0,
            ).getDate()

            const monthEnd = `${year}-${normalizedMonth}-${lastDay}`

            searchParams.startDate = monthStart
            searchParams.endDate = monthEnd
            searchParams.date =
              `01-${normalizedMonth}-${year} to ` +
              `${lastDay}-${normalizedMonth}-${year}`
          }
        }

        setActiveSearch((prev) => ({
          ...prev,
          ...searchParams,
        }))

        await fetchData(searchParams, 1)

        if (urlParams.productName && urlParams.centerName) {
          document.title =
            `Indent Details - ${decodeURIComponent(
              urlParams.productName,
            )} at ${decodeURIComponent(urlParams.centerName)}`
        }
      } catch (error) {
        console.error('Error initializing data:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [location.search])

  // ------------------------------------------------------------
  // FETCH DATA
  // ------------------------------------------------------------

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (searchParams.center) {
        params.append('centerId', searchParams.center)
      }

      if (searchParams.product) {
        params.append('productId', searchParams.product)
      }

      if (searchParams.startDate && searchParams.endDate) {
        params.append('startDate', searchParams.startDate)
        params.append('endDate', searchParams.endDate)
      } else if (
        searchParams.date &&
        searchParams.date.includes(' to ')
      ) {
        const [startDateStr, endDateStr] =
          searchParams.date.split(' to ')

        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-')
          return `${year}-${month}-${day}`
        }

        params.append('startDate', convertDateFormat(startDateStr))
        params.append('endDate', convertDateFormat(endDateStr))
      }

      params.append('page', page)

      const url = params.toString()
        ? `/reports/requests?${params.toString()}`
        : '/reports/requests'

      const response = await axiosInstance.get(url)

      if (response.data.success) {
        setData(response.data.data || [])
        setCurrentPage(response.data.pagination?.currentPage || 1)
        setTotalPages(response.data.pagination?.totalPages || 1)
      } else {
        setError(
          response.data.message ||
            'API returned unsuccessful response',
        )
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data?.message ||
            err.response.data?.error ||
            `Error ${err.response.status}: ${err.response.statusText}`,
        )
      } else if (err.request) {
        setError(
          'No response received from server. Please check your network connection.',
        )
      } else {
        setError(err.message || 'An error occurred while fetching data')
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
        setCenters(response.data.data)
        return response.data.data
      }

      return []
    } catch (error) {
      console.error('Error fetching centers:', error)
      return []
    }
  }

  // ------------------------------------------------------------
  // FETCH PRODUCTS
  // ------------------------------------------------------------

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all')

      if (response.data.success) {
        setProducts(response.data.data)
        return response.data.data
      }

      return []
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  }

  // ------------------------------------------------------------
  // PAGINATION HANDLER
  // ------------------------------------------------------------

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return

    fetchData(activeSearch, page)
  }

  // ------------------------------------------------------------
  // PROFILE
  // ------------------------------------------------------------

  const handleClick = (itemId) => {
    navigate(`/IndentDetail-profile/${itemId}`)
  }

  // ------------------------------------------------------------
  // FLATTEN PRODUCTS
  // ------------------------------------------------------------

  const getFlattenedData = () => {
    const flattened = []

    data.forEach((request) => {
      if (request.products && request.products.length > 0) {
        request.products.forEach((product) => {
          flattened.push({
            ...request,
            productDetail: product,
            uniqueKey: `${request._id}_${product._id}`,
          })
        })
      } else {
        flattened.push({
          ...request,
          productDetail: null,
          uniqueKey: `${request._id}_no_product`,
        })
      }
    })

    return flattened
  }

  // ------------------------------------------------------------
  // TOTALS
  // ------------------------------------------------------------

  const calculateTotals = () => {
    const totals = {
      totalRequestedQty: 0,
      totalApprovedQty: 0,
      totalReceivedQty: 0,
    }

    getFlattenedData().forEach((item) => {
      if (item.productDetail) {
        totals.totalRequestedQty += parseFloat(
          item.productDetail.quantity || 0,
        )

        totals.totalApprovedQty += parseFloat(
          item.productDetail.approvedQuantity || 0,
        )

        totals.totalReceivedQty += parseFloat(
          item.productDetail.receivedQuantity || 0,
        )
      }
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

    setSortConfig({ key, direction })

    const sortedData = [...data].sort((a, b) => {
      let aValue = a
      let bValue = b

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

    setData(sortedData)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    )
  }

  // ------------------------------------------------------------
  // SEARCH
  // ------------------------------------------------------------

  const handleSearch = (searchData) => {
    const mergedSearch = {
      ...activeSearch,
      ...searchData,
    }

    setActiveSearch(mergedSearch)
    fetchData(mergedSearch, 1)
  }

  const handleResetSearch = () => {
    const resetSearch = {
      center: '',
      product: '',
      startDate: '',
      endDate: '',
      date: '',
    }

    setActiveSearch(resetSearch)
    setSearchTerm('')
    fetchData({}, 1)
  }

  // ------------------------------------------------------------
  // EXPORT MODAL
  // ------------------------------------------------------------

  const openExportModal = () => {
    setExportStartDate(activeSearch.startDate || '')
    setExportEndDate(activeSearch.endDate || '')
    setExportModalVisible(true)
  }

  // ------------------------------------------------------------
  // CSV EXPORT
  // ------------------------------------------------------------

  const generateExport = async () => {
    try {
      setExportLoading(true)

      if (
        exportStartDate &&
        exportEndDate &&
        exportStartDate > exportEndDate
      ) {
        showError('Start date cannot be greater than end date')
        setExportLoading(false)
        return
      }

      const params = new URLSearchParams()

      if (activeSearch.center) {
        params.append('centerId', activeSearch.center)
      }

      if (activeSearch.product) {
        params.append('productId', activeSearch.product)
      }

      if (exportStartDate) {
        params.append('startDate', exportStartDate)
      }

      if (exportEndDate) {
        params.append('endDate', exportEndDate)
      }

      params.append('export', 'true')

      const apiUrl = `/reports/requests?${params.toString()}`
      const response = await axiosInstance.get(apiUrl)

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response')
      }

      const exportData = response.data.data || []

      if (exportData.length === 0) {
        showError('No data available for export')
        return
      }

      const headers = [
        'Indent No',
        'Date',
        'Branch',
        'Parent Branch',
        'Product',
        'Requested Qty',
        'Center Stock',
        'Parent Stock',
        'Approved Qty',
        'Received Qty',
      ]

      const csvData = []

      let totalRequestedQty = 0
      let totalApprovedQty = 0
      let totalReceivedQty = 0

      exportData.forEach((request) => {
        if (request.products && request.products.length > 0) {
          request.products.forEach((product) => {
            const requestedQty = parseFloat(product.quantity || 0)
            const approvedQty = parseFloat(
              product.approvedQuantity || 0,
            )
            const receivedQty = parseFloat(
              product.receivedQuantity || 0,
            )

            totalRequestedQty += requestedQty
            totalApprovedQty += approvedQty
            totalReceivedQty += receivedQty

            csvData.push([
              request.orderNumber || '',
              formatDate(request.date || ''),
              request.center?.centerName || '',
              request.warehouse?.centerName || '',
              product.product?.productTitle || 'No Product',
              requestedQty,
              product.centerStock?.availableQuantity || 0,
              product.outletStock?.availableQuantity || 0,
              approvedQty,
              receivedQty,
            ])
          })
        } else {
          csvData.push([
            request.orderNumber || '',
            formatDate(request.date || ''),
            request.center?.centerName || '',
            request.warehouse?.centerName || '',
            'No Product',
            0,
            0,
            0,
            0,
            0,
          ])
        }
      })

      csvData.push([])

      csvData.push([
        'Total',
        '',
        '',
        '',
        '',
        totalRequestedQty,
        '',
        '',
        totalApprovedQty,
        totalReceivedQty,
      ])

      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const stringField = String(
                field !== undefined && field !== null ? field : '',
              )

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

      let fileName = 'Indent_Report'

      if (exportStartDate && exportEndDate) {
        fileName += `_${exportStartDate}_to_${exportEndDate}`
      } else if (exportStartDate) {
        fileName += `_from_${exportStartDate}`
      } else if (exportEndDate) {
        fileName += `_until_${exportEndDate}`
      } else {
        fileName += `_${new Date().toISOString().split('T')[0]}`
      }

      if (activeSearch.center || activeSearch.product) {
        const centerName = activeSearch.center
          ? `_Center_${activeSearch.center}`
          : ''

        const productName = activeSearch.product
          ? `_Product_${activeSearch.product}`
          : ''

        fileName += `${centerName}${productName}`
      }

      link.setAttribute('download', `${fileName}.csv`)
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
      setExportLoading(false)
    }
  }

  // ------------------------------------------------------------
  // LOCAL SEARCH
  // ------------------------------------------------------------

  const filteredFlattenedData = getFlattenedData().filter((item) => {
    if (
      activeSearch.center ||
      activeSearch.product ||
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

  const hasActiveFilters =
    activeSearch.center || activeSearch.product

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* PAGE TITLE */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        <h1 className="text-2xl font-normal text-[#263746]">
          Indent Detail Report
        </h1>
      </div>

      {/* SEARCH MODAL */}
      <CommonSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        initialValues={activeSearch}
      />

      {/* EXPORT MODAL — UI MATCHED TO REFERENCE IMAGE */}
      {exportModalVisible && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-[35px]">
          <style>
            {`
              @keyframes exportFormDrop {
                from {
                  opacity: 0;
                  transform: translateY(-35px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
            className="w-full max-w-[500px] overflow-hidden rounded-[8px] border border-[#d9dce2] bg-white shadow-xl"
            style={{
              animation: 'exportFormDrop 0.3s ease-out both',
            }}
          >
            {/* MODAL HEADER */}
            <div className="flex min-h-[62px] items-center justify-between border-b border-[#d9dce2] px-[16px] py-[14px]">
              <h2
                id="export-modal-title"
                className="text-[20px] font-normal leading-[28px] text-[#343a40]"
              >
                Export Indent Detail Report
              </h2>

              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                className="ml-3 inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded text-[#85898d] transition hover:bg-gray-100 hover:text-[#343a40]"
                aria-label="Close export form"
              >
                <X size={23} strokeWidth={1.8} />
              </button>
            </div>

            {/* MODAL FORM BODY */}
            <div className="space-y-[17px] px-[16px] py-[17px]">
              {/* START DATE */}
              <div>
                <label
                  htmlFor="exportStartDate"
                  className="mb-[7px] block text-[14px] font-semibold leading-[19px] text-[#343a40]"
                >
                  Start Date (Optional)
                </label>

                <input
                  id="exportStartDate"
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="h-[38px] w-full rounded-[5px] border border-[#d5dce5] bg-white px-[11px] text-[14px] text-[#343a40] outline-none transition focus:border-[#86b7fe] focus:ring-[3px] focus:ring-[#0d6efd]/15"
                />

                <p className="mt-[3px] text-[14px] leading-[18px] text-[#6c757d]">
                  Leave empty to include all records from beginning
                </p>
              </div>

              {/* END DATE */}
              <div>
                <label
                  htmlFor="exportEndDate"
                  className="mb-[7px] block text-[14px] font-semibold leading-[19px] text-[#343a40]"
                >
                  End Date (Optional)
                </label>

                <input
                  id="exportEndDate"
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  className="h-[38px] w-full rounded-[5px] border border-[#d5dce5] bg-white px-[11px] text-[14px] text-[#343a40] outline-none transition focus:border-[#86b7fe] focus:ring-[3px] focus:ring-[#0d6efd]/15"
                />

                <p className="mt-[3px] text-[14px] leading-[18px] text-[#6c757d]">
                  Leave empty to include all records until today
                </p>
              </div>

              {/* CURRENT FILTERS */}
              {(activeSearch.center || activeSearch.product) && (
                <div className="rounded-[4px] border border-[#dee2e6] bg-[#f8f9fa] p-3">
                  <p className="mb-2 text-sm font-semibold text-[#343a40]">
                    Current Filters:
                  </p>

                  <ul className="space-y-1 text-sm text-[#6c757d]">
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
                  </ul>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="flex min-h-[69px] items-center justify-end gap-[8px] border-t border-[#d9dce2] px-[16px] py-[14px]">
              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                className="inline-flex h-[39px] items-center justify-center rounded-[6px] bg-[#6c7a89] px-[14px] text-[14px] font-medium text-white transition hover:bg-[#5b6774] focus:outline-none focus:ring-2 focus:ring-[#6c7a89]/30"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={generateExport}
                disabled={exportLoading}
                className="inline-flex h-[39px] items-center justify-center gap-[7px] rounded-[6px] bg-[#5146dc] px-[14px] text-[14px] font-medium text-white transition hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#5146dc]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exportLoading ? (
                  <>
                    <span className="h-[15px] w-[15px] animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={16} />
                    Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CARD */}
      <div className="overflow-hidden border-t-[4px] border-t-[#2458a6] bg-white">
        {/* CARD HEADER */}
        <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex items-center gap-1 rounded-[4px] bg-[#2458a6] px-2 py-2 text-sm font-medium text-white transition hover:bg-[#1e4b91]"
            >
              <Search size={16} />
              Search
            </button>

            {(activeSearch.center ||
              activeSearch.product ||
              activeSearch.startDate ||
              activeSearch.endDate) && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-1 rounded-[4px] bg-[#2458a6] px-2 py-2 text-sm font-medium text-white transition hover:bg-[#1e4b91]"
              >
                <RotateCcw size={16} />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={openExportModal}
              disabled={exportLoading || data.length === 0}
              className="inline-flex items-center gap-1 rounded-[4px] bg-[#2458a6] px-2 py-2 text-sm font-medium text-white transition hover:bg-[#1e4b91] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileSpreadsheet size={16} />
              Export
            </button>
          </div>

          {/* TOP PAGINATION */}
          <div className="flex min-w-0 items-center justify-end">
            <ReportPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* CARD BODY */}
        <div className="p-4">
          {/* SEARCH + EXPORT DATES */}
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              {(exportStartDate || exportEndDate) && (
                <div className="text-xs text-gray-500">
                  {exportStartDate &&
                    `Export From: ${exportStartDate} `}
                  {exportEndDate && `To: ${exportEndDate}`}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <label className="whitespace-nowrap text-sm font-semibold text-gray-800">
                Search:
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in table..."
                className="h-[31px] w-full max-w-[350px] rounded-none border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-blue-600"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="max-h-[65vh] overflow-auto border border-gray-200">
            <table className="w-full min-w-[1200px] border-collapse text-sm text-gray-900">
              <thead className="sticky top-0 z-10 bg-white">
                <tr>
                  {[
                    ['orderNumber', 'Indent No'],
                    ['date', 'Date'],
                    ['center.centerName', 'Branch'],
                    ['warehouse.centerName', 'Parent Branch'],
                    ['productDetail.product.productTitle', 'Product'],
                    ['productDetail.quantity', 'Requested Qty'],
                    [
                      'productDetail.centerStock.availableQuantity',
                      'Center Stock',
                    ],
                    [
                      'productDetail.outletStock.availableQuantity',
                      'Parent Stock',
                    ],
                    ['productDetail.approvedQuantity', 'Approved Qty'],
                    ['productDetail.receivedQuantity', 'Received Qty'],
                  ].map(([key, label]) => (
                    <th
                      key={key}
                      scope="col"
                      onClick={() => handleSort(key)}
                      className="cursor-pointer border border-gray-200 bg-white px-2 py-2.5 text-left text-[15px] font-semibold text-gray-900 transition hover:bg-gray-50"
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
                {filteredFlattenedData.length > 0 ? (
                  <>
                    {filteredFlattenedData.map((item, index) => (
                      <tr
                        key={item.uniqueKey}
                        className={`border-b border-gray-200 transition hover:bg-blue-50 ${
                          index % 2 === 0 ? 'bg-[#f1f2f2]' : 'bg-white'
                        }`}
                      >
                        <td className="border-x border-gray-200 px-2 py-2.5 align-top">
                          <button
                            type="button"
                            onClick={() => handleClick(item._id)}
                            className="font-normal text-[#2874bd] hover:underline"
                          >
                            {item.orderNumber || ''}
                          </button>
                        </td>

                        <td className="border-x border-gray-200 px-2 py-2.5 align-top">
                          {formatDate(item.date || '')}
                        </td>

                        <td className="border-x border-gray-200 px-2 py-2.5 align-top">
                          {item.center?.centerName || ''}
                        </td>

                        <td className="border-x border-gray-200 px-2 py-2.5 align-top">
                          {item.warehouse?.centerName || ''}
                        </td>

                        <td className="border-x border-gray-200 px-2 py-2.5 align-top">
                          {item.productDetail?.product?.productTitle ||
                            'No Product'}
                        </td>

                        <td className="border-x border-gray-200 px-2 py-2.5 align-top">
                          {item.productDetail?.quantity || 0}
                        </td>

                        <td className="border-x border-gray-200 px-2 py-2.5 align-top">
                          {item.productDetail?.centerStock
                            ?.availableQuantity || 0}
                        </td>

                        <td className="border-x border-gray-200 px-2 py-2.5 align-top">
                          {item.productDetail?.outletStock
                            ?.availableQuantity || 0}
                        </td>

                        <td className="border-x border-gray-200 px-2 py-2.5 align-top">
                          {item.productDetail?.approvedQuantity || 0}
                        </td>

                        <td className="border-x border-gray-200 px-2 py-2.5 align-top">
                          {item.productDetail?.receivedQuantity || 0}
                        </td>
                      </tr>
                    ))}

                    {/* TOTAL ROW */}
                    <tr className="border border-gray-200 bg-white font-semibold">
                      <td
                        colSpan={5}
                        className="border border-gray-200 px-2 py-3 text-right text-gray-900"
                      >
                        Total
                      </td>

                      <td className="border border-gray-200 px-2 py-3">
                        {totals.totalRequestedQty}
                      </td>

                      <td className="border border-gray-200 px-2 py-3" />

                      <td className="border border-gray-200 px-2 py-3" />

                      <td className="border border-gray-200 px-2 py-3">
                        {totals.totalApprovedQty}
                      </td>

                      <td className="border border-gray-200 px-2 py-3">
                        {totals.totalReceivedQty}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={10}
                      className="border border-gray-200 px-4 py-10 text-center text-sm text-gray-500"
                    >
                      No data found
                      {hasActiveFilters &&
                        ' with the current filters'}
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

export default IndentDetail