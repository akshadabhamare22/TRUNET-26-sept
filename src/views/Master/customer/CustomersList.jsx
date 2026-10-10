// import React, { useEffect, useRef, useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import {
//   ArrowDown,
//   ArrowUp,
//   Search,
//   Plus,
//   Settings,
//   Pencil,
//   Trash2,
//   RotateCcw,
//   ChevronDown,
// } from 'lucide-react'

// import axiosInstance from '../../../axiosInstance'
// import {
//   confirmDelete,
//   showSuccess,
// } from '../../../utils/sweetAlerts'
// import SearchCustomerModel from './SearchCustomerModel'
// import Pagination from '../../../utils/Pagination'
// import usePermission from '../../../utils/usePermission'

// const CustomersList = () => {
//   const [customers, setCustomers] = useState([])
//   const [centers, setCenters] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   })

//   const [searchTerm, setSearchTerm] = useState('')
//   const [searchModalVisible, setSearchModalVisible] =
//     useState(false)

//   const [activeSearch, setActiveSearch] = useState({
//     keyword: '',
//     center: '',
//   })

//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const dropdownRefs = useRef({})
//   const navigate = useNavigate()
//   const { hasAnyPermission } = usePermission()

//   const fetchCustomers = async (
//     searchParams = {},
//     page = 1
//   ) => {
//     try {
//       setLoading(true)
//       setError(null)

//       const params = new URLSearchParams()

//       if (searchParams.keyword) {
//         params.append('search', searchParams.keyword)
//       }

//       if (searchParams.center) {
//         params.append('center', searchParams.center)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/customers?${params.toString()}`
//         : '/customers'

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         setCustomers(response.data.data)
//         setCurrentPage(
//           response.data.pagination.currentPage
//         )
//         setTotalPages(
//           response.data.pagination.totalPages
//         )
//       } else {
//         const errorMessage =
//           response.data.message ||
//           'API returned unsuccessful response'

//         setError(errorMessage)
//         console.error(
//           'Backend error:',
//           response.data
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
//           err.response.data
//         )
//       } else if (err.request) {
//         setError(
//           'No response received from server. Please check your network connection.'
//         )
//         console.error('Error request:', err.request)
//       } else {
//         setError(
//           err.message ||
//             'An error occurred while fetching data'
//         )
//         console.error(
//           'Error message:',
//           err.message
//         )
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get(
//         '/centers?centerType=Center'
//       )

//       if (response.data.success) {
//         setCenters(response.data.data)
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching centers:',
//         error
//       )
//     }
//   }

//   useEffect(() => {
//     fetchCustomers()
//     fetchCenters()
//   }, [])

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return

//     fetchCustomers(activeSearch, page)
//   }

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

//     const sortedCustomers = [...customers].sort(
//       (a, b) => {
//         let aValue = a
//         let bValue = b

//         if (key.includes('.')) {
//           const keys = key.split('.')

//           aValue = keys.reduce(
//             (obj, k) => obj && obj[k],
//             a
//           )

//           bValue = keys.reduce(
//             (obj, k) => obj && obj[k],
//             b
//           )
//         } else {
//           aValue = a[key]
//           bValue = b[key]
//         }

//         if (aValue < bValue) {
//           return direction === 'ascending' ? -1 : 1
//         }

//         if (aValue > bValue) {
//           return direction === 'ascending' ? 1 : -1
//         }

//         return 0
//       }
//     )

//     setCustomers(sortedCustomers)
//   }

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null
//     }

//     return sortConfig.direction === 'ascending' ? (
//       <ArrowUp size={15} />
//     ) : (
//       <ArrowDown size={15} />
//     )
//   }

//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData)
//     fetchCustomers(searchData, 1)
//   }

//   const handleResetSearch = () => {
//     setActiveSearch({
//       keyword: '',
//       center: '',
//     })

//     setSearchTerm('')
//     fetchCustomers({}, 1)
//   }

//   const handleUsernameClick = (customerId) => {
//     navigate(`/customer-profile/${customerId}`)
//   }

//   const filteredCustomers = customers.filter(
//     (customer) => {
//       if (
//         activeSearch.keyword ||
//         activeSearch.center
//       ) {
//         return true
//       }

//       return Object.values(customer).some(
//         (value) => {
//           if (
//             typeof value === 'object' &&
//             value !== null
//           ) {
//             return Object.values(value).some(
//               (nestedValue) =>
//                 nestedValue &&
//                 nestedValue
//                   .toString()
//                   .toLowerCase()
//                   .includes(
//                     searchTerm.toLowerCase()
//                   )
//             )
//           }

//           return (
//             value &&
//             value
//               .toString()
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase())
//           )
//         }
//       )
//     }
//   )

//   const handleDeleteCustomer = async (
//     customerId
//   ) => {
//     const result = await confirmDelete()

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(
//           `/customers/${customerId}`
//         )

//         setCustomers((prev) =>
//           prev.filter(
//             (customer) =>
//               customer._id !== customerId
//           )
//         )

//         showSuccess(
//           'Customer deleted successfully!'
//         )
//       } catch (error) {
//         console.error(
//           'Error deleting customer:',
//           error
//         )
//       }
//     }
//   }

//   const handleEditCustomer = (customerId) => {
//     navigate(`/edit-customer/${customerId}`)
//   }

//   const toggleDropdown = (id) => {
//     setDropdownOpen((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }))
//   }

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const newDropdownState = {}
//       let shouldUpdate = false

//       Object.keys(dropdownRefs.current).forEach(
//         (key) => {
//           if (
//             dropdownRefs.current[key] &&
//             !dropdownRefs.current[key].contains(
//               event.target
//             )
//           ) {
//             newDropdownState[key] = false
//             shouldUpdate = true
//           }
//         }
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
//       handleClickOutside
//     )

//     return () => {
//       document.removeEventListener(
//         'mousedown',
//         handleClickOutside
//       )
//     }
//   }, [])

//   if (error) {
//     return (
//       <div className="m-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   const SortableHeader = ({
//     label,
//     sortKey,
//   }) => (
//     <th
//       scope="col"
//       onClick={() => handleSort(sortKey)}
//       className="cursor-pointer whitespace-nowrap border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 transition hover:bg-gray-100"
//     >
//       <div className="flex items-center justify-between gap-2">
//         <span>{label}</span>
//         {getSortIcon(sortKey)}
//       </div>
//     </th>
//   )

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="mx-auto max-w-[1600px]">
//         {/* Title */}
//         <div className="mb-5">
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Customer List
//           </h1>
//         </div>

//         {/* Search Modal */}
//         <SearchCustomerModel
//           visible={searchModalVisible}
//           onClose={() =>
//             setSearchModalVisible(false)
//           }
//           onSearch={handleSearch}
//           centers={centers}
//         />

//         {/* Main Card */}
//         <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//           {/* Card Header */}
//           <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex flex-wrap items-center gap-2">
//               {hasAnyPermission('Customer', [
//                 'manage_customer_all_center',
//                 'manage_customer_own_center',
//               ]) && (
//                 <Link to="/add-customer">
//                   <button
//                     type="button"
//                     className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   >
//                     <Plus size={16} />
//                     Add
//                   </button>
//                 </Link>
//               )}

//               <button
//                 type="button"
//                 onClick={() =>
//                   setSearchModalVisible(true)
//                 }
//                 className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//               >
//                 <Search size={16} />
//                 Search
//               </button>

//               {(activeSearch.keyword ||
//                 activeSearch.center) && (
//                 <button
//                   type="button"
//                   onClick={handleResetSearch}
//                   className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//                 >
//                   <RotateCcw size={16} />
//                   Reset Search
//                 </button>
//               )}
//             </div>

//             <div>
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={handlePageChange}
//               />
//             </div>
//           </div>

//           {/* Card Body */}
//           <div className="p-5">
//             {/* Local Search */}
//             <div className="mb-4 flex justify-end">
//               <div className="flex items-center gap-2">
//                 <label
//                   htmlFor="customerSearch"
//                   className="text-sm font-medium text-gray-600"
//                 >
//                   Search:
//                 </label>

//                 <input
//                   id="customerSearch"
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) =>
//                     setSearchTerm(e.target.value)
//                   }
//                   className="w-56 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto rounded-md border border-gray-200">
//               <table className="min-w-[1200px] w-full border-collapse text-sm">
//                 <thead>
//                   <tr>
//                     <SortableHeader
//                       label="User Name"
//                       sortKey="username"
//                     />

//                     <SortableHeader
//                       label="Name"
//                       sortKey="name"
//                     />

//                     <SortableHeader
//                       label="Branch"
//                       sortKey="center.centerName"
//                     />

//                     <SortableHeader
//                       label="Reseller"
//                       sortKey="center.reseller.businessName"
//                     />

//                     <SortableHeader
//                       label="Area"
//                       sortKey="center.area.areaName"
//                     />

//                     <SortableHeader
//                       label="Mobile"
//                       sortKey="mobile"
//                     />

//                     <SortableHeader
//                       label="Email"
//                       sortKey="email"
//                     />

//                     <SortableHeader
//                       label="City"
//                       sortKey="city"
//                     />

//                     <th className="whitespace-nowrap border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td
//                         colSpan="9"
//                         className="px-4 py-10 text-center text-gray-500"
//                       >
//                         <div className="flex items-center justify-center gap-2">
//                           <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
//                           Loading customers...
//                         </div>
//                       </td>
//                     </tr>
//                   ) : filteredCustomers.length > 0 ? (
//                     filteredCustomers.map(
//                       (customer) => (
//                         <tr
//                           key={customer._id}
//                           className="border-b border-gray-100 transition hover:bg-gray-50"
//                         >
//                           {/* Username */}
//                           <td className="px-4 py-3">
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleUsernameClick(
//                                   customer._id
//                                 )
//                               }
//                               className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
//                             >
//                               {customer.username}
//                             </button>
//                           </td>

//                           {/* Name */}
//                           <td className="px-4 py-3 text-gray-700">
//                             {customer.name}
//                           </td>

//                           {/* Branch */}
//                           <td className="px-4 py-3 text-gray-700">
//                             {customer.center
//                               ?.centerName || ''}
//                           </td>

//                           {/* Reseller */}
//                           <td className="px-4 py-3 text-gray-700">
//                             {customer.center
//                               ?.reseller
//                               ?.businessName || ''}
//                           </td>

//                           {/* Area */}
//                           <td className="px-4 py-3 text-gray-700">
//                             {customer.center?.area
//                               ?.areaName || ''}
//                           </td>

//                           {/* Mobile */}
//                           <td className="px-4 py-3 text-gray-700">
//                             {customer.mobile}
//                           </td>

//                           {/* Email */}
//                           <td className="px-4 py-3 text-gray-700">
//                             {customer.email}
//                           </td>

//                           {/* City */}
//                           <td className="px-4 py-3 text-gray-700">
//                             {customer.city}
//                           </td>

//                           {/* Action */}
//                           <td className="px-4 py-3">
//                             {hasAnyPermission(
//                               'Customer',
//                               [
//                                 'manage_customer_all_center',
//                                 'manage_customer_own_center',
//                               ]
//                             ) && (
//                               <div
//                                 className="relative"
//                                 ref={(el) => {
//                                   dropdownRefs.current[
//                                     customer._id
//                                   ] = el
//                                 }}
//                               >
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     toggleDropdown(
//                                       customer._id
//                                     )
//                                   }
//                                   className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
//                                 >
//                                   <Settings
//                                     size={14}
//                                   />
//                                   Options
//                                   <ChevronDown
//                                     size={13}
//                                   />
//                                 </button>

//                                 {dropdownOpen[
//                                   customer._id
//                                 ] && (
//                                   <div className="absolute right-0 z-30 mt-1 w-36 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         handleEditCustomer(
//                                           customer._id
//                                         )
//                                       }
//                                       className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
//                                     >
//                                       <Pencil
//                                         size={15}
//                                       />
//                                       Edit
//                                     </button>

//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         handleDeleteCustomer(
//                                           customer._id
//                                         )
//                                       }
//                                       className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
//                                     >
//                                       <Trash2
//                                         size={15}
//                                       />
//                                       Delete
//                                     </button>
//                                   </div>
//                                 )}
//                               </div>
//                             )}
//                           </td>
//                         </tr>
//                       )
//                     )
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="9"
//                         className="px-4 py-10 text-center text-gray-500"
//                       >
//                         No customers found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CustomersList


// import React, { useEffect, useRef, useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import {
//   ArrowDown,
//   ArrowUp,
//   Search,
//   Plus,
//   Settings,
//   Pencil,
//   Trash2,
//   RotateCcw,
//   ChevronDown,
// } from 'lucide-react'

// import axiosInstance from '../../../axiosInstance'
// import {
//   confirmDelete,
//   showSuccess,
// } from '../../../utils/sweetAlerts'
// import SearchCustomerModel from './SearchCustomerModel'
// import Pagination from '../../../utils/Pagination'
// import usePermission from '../../../utils/usePermission'

// const CustomersList = () => {
//   const [customers, setCustomers] = useState([])
//   const [centers, setCenters] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   })

//   const [searchTerm, setSearchTerm] = useState('')
//   const [searchModalVisible, setSearchModalVisible] =
//     useState(false)

//   const [activeSearch, setActiveSearch] = useState({
//     keyword: '',
//     center: '',
//   })

//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const dropdownRefs = useRef({})
//   const navigate = useNavigate()
//   const { hasAnyPermission } = usePermission()

//   const fetchCustomers = async (
//     searchParams = {},
//     page = 1
//   ) => {
//     try {
//       setLoading(true)
//       setError(null)

//       const params = new URLSearchParams()

//       if (searchParams.keyword) {
//         params.append('search', searchParams.keyword)
//       }

//       if (searchParams.center) {
//         params.append('center', searchParams.center)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/customers?${params.toString()}`
//         : '/customers'

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         setCustomers(response.data.data)
//         setCurrentPage(
//           response.data.pagination.currentPage
//         )
//         setTotalPages(
//           response.data.pagination.totalPages
//         )
//       } else {
//         const errorMessage =
//           response.data.message ||
//           'API returned unsuccessful response'

//         setError(errorMessage)
//         console.error(
//           'Backend error:',
//           response.data
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
//           err.response.data
//         )
//       } else if (err.request) {
//         setError(
//           'No response received from server. Please check your network connection.'
//         )
//         console.error('Error request:', err.request)
//       } else {
//         setError(
//           err.message ||
//             'An error occurred while fetching data'
//         )
//         console.error(
//           'Error message:',
//           err.message
//         )
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get(
//         '/centers?centerType=Center'
//       )

//       if (response.data.success) {
//         setCenters(response.data.data)
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching centers:',
//         error
//       )
//     }
//   }

//   useEffect(() => {
//     fetchCustomers()
//     fetchCenters()
//   }, [])

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return

//     fetchCustomers(activeSearch, page)
//   }

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

//     const sortedCustomers = [...customers].sort(
//       (a, b) => {
//         let aValue = a
//         let bValue = b

//         if (key.includes('.')) {
//           const keys = key.split('.')

//           aValue = keys.reduce(
//             (obj, k) => obj && obj[k],
//             a
//           )

//           bValue = keys.reduce(
//             (obj, k) => obj && obj[k],
//             b
//           )
//         } else {
//           aValue = a[key]
//           bValue = b[key]
//         }

//         if (aValue < bValue) {
//           return direction === 'ascending' ? -1 : 1
//         }

//         if (aValue > bValue) {
//           return direction === 'ascending' ? 1 : -1
//         }

//         return 0
//       }
//     )

//     setCustomers(sortedCustomers)
//   }

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null
//     }

//     return sortConfig.direction === 'ascending' ? (
//       <ArrowUp size={15} />
//     ) : (
//       <ArrowDown size={15} />
//     )
//   }

//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData)
//     fetchCustomers(searchData, 1)
//   }

//   const handleResetSearch = () => {
//     setActiveSearch({
//       keyword: '',
//       center: '',
//     })

//     setSearchTerm('')
//     fetchCustomers({}, 1)
//   }

//   const handleUsernameClick = (customerId) => {
//     navigate(`/customer-profile/${customerId}`)
//   }

//   const filteredCustomers = customers.filter(
//     (customer) => {
//       if (
//         activeSearch.keyword ||
//         activeSearch.center
//       ) {
//         return true
//       }

//       return Object.values(customer).some(
//         (value) => {
//           if (
//             typeof value === 'object' &&
//             value !== null
//           ) {
//             return Object.values(value).some(
//               (nestedValue) =>
//                 nestedValue &&
//                 nestedValue
//                   .toString()
//                   .toLowerCase()
//                   .includes(
//                     searchTerm.toLowerCase()
//                   )
//             )
//           }

//           return (
//             value &&
//             value
//               .toString()
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase())
//           )
//         }
//       )
//     }
//   )

//   const handleDeleteCustomer = async (
//     customerId
//   ) => {
//     const result = await confirmDelete()

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(
//           `/customers/${customerId}`
//         )

//         setCustomers((prev) =>
//           prev.filter(
//             (customer) =>
//               customer._id !== customerId
//           )
//         )

//         showSuccess(
//           'Customer deleted successfully!'
//         )
//       } catch (error) {
//         console.error(
//           'Error deleting customer:',
//           error
//         )
//       }
//     }
//   }

//   const handleEditCustomer = (customerId) => {
//     navigate(`/edit-customer/${customerId}`)
//   }

//   const toggleDropdown = (id) => {
//     setDropdownOpen((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }))
//   }

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const newDropdownState = {}
//       let shouldUpdate = false

//       Object.keys(dropdownRefs.current).forEach(
//         (key) => {
//           if (
//             dropdownRefs.current[key] &&
//             !dropdownRefs.current[key].contains(
//               event.target
//             )
//           ) {
//             newDropdownState[key] = false
//             shouldUpdate = true
//           }
//         }
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
//       handleClickOutside
//     )

//     return () => {
//       document.removeEventListener(
//         'mousedown',
//         handleClickOutside
//       )
//     }
//   }, [])

//   if (error) {
//     return (
//       <div className="m-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   const SortableHeader = ({
//     label,
//     sortKey,
//   }) => (
//     <th
//       scope="col"
//       onClick={() => handleSort(sortKey)}
// className="
//   cursor-pointer
//   whitespace-nowrap
//   border-b
//   border-gray-200
//   bg-[#f8f9fa]
//   px-4
//   py-3
//   text-left
//   text-[14px]
//   font-bold
//   tracking-wide
//   text-[#151515]
//   transition
//   hover:bg-gray-100
// "    >
//       <div className="flex items-center justify-between gap-2">
//         <span>{label}</span>
//         {getSortIcon(sortKey)}
//       </div>
//     </th>
//   )

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
//       <div className="mx-auto w-full max-w-[1600px]">
//         {/* Title */}
//         <div className="mb-[18px]">
          
//           <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//             Customer List
//           </h1>
//         </div>

//         {/* Search Modal */}
//         <SearchCustomerModel
//           visible={searchModalVisible}
//           onClose={() =>
//             setSearchModalVisible(false)
//           }
//           onSearch={handleSearch}
//           centers={centers}
//         />

//         {/* Main Card */}
//         <div className="overflow-hidden rounded-[2px] border border-[#e1e4e8] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
//           {/* Blue top border */}
//           <div className="h-[4px] w-full bg-[#2f64ad]" />

//           {/* Toolbar */}
//           <div className="flex min-h-[68px] items-center justify-between border-b border-[#e1e4e8] px-[17px] py-[10px]">
//             <div className="flex flex-wrap items-center gap-[5px]">
//               {hasAnyPermission('Customer', [
//                 'manage_customer_all_center',
//                 'manage_customer_own_center',
//               ]) && (
//                 <Link to="/add-customer">
//                   <button
//                     type="button"
//                     className="
//                       inline-flex
//                       h-[36px]
//                       items-center
//                       gap-[4px]
//                       rounded-[4px]
//                       bg-[#2f64ad]
//                       px-[10px]
//                       text-[15px]
//                       font-medium
//                       text-white
//                       transition
//                       hover:bg-[#255696]
//                       focus:outline-none
//                     "
//                   >
//                     <Plus size={17} strokeWidth={2} />
//                     Add
//                   </button>
//                 </Link>
//               )}

//               <button
//                 type="button"
//                 onClick={() =>
//                   setSearchModalVisible(true)
//                 }
//                 className="
//                   inline-flex
//                   h-[36px]
//                   items-center
//                   gap-[4px]
//                   rounded-[4px]
//                   bg-[#2f64ad]
//                   px-[10px]
//                   text-[15px]
//                   font-medium
//                   text-white
//                   transition
//                   hover:bg-[#255696]
//                   focus:outline-none
//                 "
//               >
//                 <Search size={17} strokeWidth={2} />
//                 Search
//               </button>

//               {(activeSearch.keyword ||
//                 activeSearch.center) && (
//                 <button
//                   type="button"
//                   onClick={handleResetSearch}
//                   className="
//                     inline-flex
//                     h-[36px]
//                     items-center
//                     gap-[5px]
//                     rounded-[4px]
//                     border
//                     border-[#cfd3d8]
//                     bg-white
//                     px-[10px]
//                     text-[14px]
//                     font-medium
//                     text-[#3f4650]
//                     transition
//                     hover:bg-[#f4f5f6]
//                     focus:outline-none
//                   "
//                 >
//                   <RotateCcw size={15} />
//                   Reset Search
//                 </button>
//               )}
//             </div>

//             <div className="ml-auto">
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={handlePageChange}
//               />
//             </div>
//           </div>

//           {/* Card Body */}
//           <div className="px-[17px] pb-[28px] pt-[17px]">
//             {/* Local Search */}
//             <div className="mb-[16px] flex justify-end">
//               <div className="flex items-center gap-[5px]">
//                 <label
//                   htmlFor="customerSearch"
//                   className="text-[16px] font-semibold text-[#151515]"
//                 >
//                   Search:
//                 </label>

//                 <input
//                   id="customerSearch"
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) =>
//                     setSearchTerm(e.target.value)
//                   }
//                   className="
//                     h-[34px]
//                     w-[238px]
//                     rounded-[2px]
//                     border
//                     border-[#d8dde3]
//                     bg-white
//                     px-[10px]
//                     text-[14px]
//                     text-[#222]
//                     outline-none
//                     transition
//                     focus:border-[#2f64ad]
//                   "
//                 />
//               </div>
//             </div>

//             {/* Table */}
// <div className="overflow-hidden rounded-[2px] border border-[#e1e4e8]">
//   <div className="max-h-[560px] overflow-y-auto overflow-x-hidden">
//     <table className="w-full min-w-[1050px] table-fixed border-collapse text-[15px]">
//       <thead className="sticky top-0 z-20 bg-white">
//                     <tr>
//                       <SortableHeader
//                         label="User Name"
//                         sortKey="username"
//                       />

//                       <SortableHeader
//                         label="Name"
//                         sortKey="name"
//                       />

//                       <SortableHeader
//                         label="Branch"
//                         sortKey="center.centerName"
//                       />

//                       <SortableHeader
//                         label="Reseller"
//                         sortKey="center.reseller.businessName"
//                       />

//                       <SortableHeader
//                         label="Area"
//                         sortKey="center.area.areaName"
//                       />

//                       <SortableHeader
//                         label="Mobile"
//                         sortKey="mobile"
//                       />

//                       <SortableHeader
//                         label="Email"
//                         sortKey="email"
//                       />

//                       <SortableHeader
//                         label="City"
//                         sortKey="city"
//                       />

//                       <th
//                         className="
//                           w-[120px]
//                           whitespace-nowrap
//                           border-b
//                           border-[#e0e3e6]
//                           bg-[#f8f9fa]
//                           px-[9px]
//                           py-[11px]
//                           text-left
//                           text-[16px]
//                           font-bold
//                           text-[#151515]
//                         "
//                       >
//                         Action
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {loading ? (
//                       <tr>
//                         <td
//                           colSpan="9"
//                           className="px-4 py-10 text-center text-[#6b7280]"
//                         >
//                           <div className="flex items-center justify-center gap-2">
//                             <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#d1d5db] border-t-[#2f64ad]" />
//                             Loading customers...
//                           </div>
//                         </td>
//                       </tr>
//                     ) : filteredCustomers.length > 0 ? (
//                       filteredCustomers.map(
//                         (customer) => (
//                           <tr
//                             key={customer._id}
//                             className="
//                               border-b
//                               border-[#e4e6e8]
//                               bg-white
//                               transition-colors
//                               hover:bg-[#f7f9fc]
//                             "
//                           >
//                             {/* Username */}
//                             <td className="w-[13%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top">
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   handleUsernameClick(
//                                     customer._id
//                                   )
//                                 }
//                                 className="break-words text-left text-[15px] font-normal text-[#2877c7] hover:text-[#155a9c] hover:underline"
//                               >
//                                 {customer.username}
//                               </button>
//                             </td>

//                             {/* Name */}
//                             <td className="w-[10%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
//                               {customer.name}
//                             </td>

//                             {/* Branch */}
//                             <td className="w-[8%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
//                               {customer.center
//                                 ?.centerName || ''}
//                             </td>

//                             {/* Reseller */}
//                             <td className="w-[11%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
//                               {customer.center
//                                 ?.reseller
//                                 ?.businessName || ''}
//                             </td>

//                             {/* Area */}
//                             <td className="w-[9%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
//                               {customer.center?.area
//                                 ?.areaName || ''}
//                             </td>

//                             {/* Mobile */}
//                             <td className="w-[8%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
//                               {customer.mobile}
//                             </td>

//                             {/* Email */}
//                             <td className="w-[20%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
//                               {customer.email}
//                             </td>

//                             {/* City */}
//                             <td className="w-[8%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
//                               {customer.city}
//                             </td>

//                             {/* Action */}
//                             <td className="w-[120px] px-[8px] py-[11px] align-top">
//                               {hasAnyPermission(
//                                 'Customer',
//                                 [
//                                   'manage_customer_all_center',
//                                   'manage_customer_own_center',
//                                 ]
//                               ) && (
//                                 <div
//                                   className="relative"
//                                   ref={(el) => {
//                                     dropdownRefs.current[
//                                       customer._id
//                                     ] = el
//                                   }}
//                                 >
//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       toggleDropdown(
//                                         customer._id
//                                       )
//                                     }
//                                     className="
//                                       inline-flex
//                                       h-[34px]
//                                       items-center
//                                       gap-[5px]
//                                       whitespace-nowrap
//                                       rounded-[5px]
//                                       border
//                                       border-[#bfc4ca]
//                                       bg-[#fafafa]
//                                       px-[9px]
//                                       text-[14px]
//                                       font-normal
//                                       text-[#3d4650]
//                                       transition
//                                       hover:bg-[#f0f1f2]
//                                       focus:outline-none
//                                     "
//                                   >
//                                     <Settings
//                                       size={15}
//                                       strokeWidth={1.8}
//                                     />
//                                     Options
//                                     <ChevronDown
//                                       size={13}
//                                     />
//                                   </button>

//                                   {dropdownOpen[
//                                     customer._id
//                                   ] && (
//                                     <div className="absolute right-0 z-30 mt-[3px] w-[135px] overflow-hidden rounded-[4px] border border-[#d9dde2] bg-white py-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           handleEditCustomer(
//                                             customer._id
//                                           )
//                                         }
//                                         className="flex w-full items-center gap-[8px] px-[11px] py-[8px] text-left text-[14px] text-[#343a40] transition hover:bg-[#f1f5f9]"
//                                       >
//                                         <Pencil
//                                           size={15}
//                                         />
//                                         Edit
//                                       </button>

//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           handleDeleteCustomer(
//                                             customer._id
//                                           )
//                                         }
//                                         className="flex w-full items-center gap-[8px] px-[11px] py-[8px] text-left text-[14px] text-[#c62828] transition hover:bg-[#fff1f1]"
//                                       >
//                                         <Trash2
//                                           size={15}
//                                         />
//                                         Delete
//                                       </button>
//                                     </div>
//                                   )}
//                                 </div>
//                               )}
//                             </td>
//                           </tr>
//                         )
//                       )
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan="9"
//                           className="px-4 py-10 text-center text-[#6b7280]"
//                         >
//                           No customers found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


// export default CustomersList



import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  Search,
  Plus,
  Settings,
  Pencil,
  Trash2,
  RotateCcw,
  ChevronDown,
} from 'lucide-react'

import axiosInstance from '../../../axiosInstance'
import {
  confirmDelete,
  showSuccess,
} from '../../../utils/sweetAlerts'
import SearchCustomerModel from './SearchCustomerModel'
import Pagination from '../../../utils/Pagination'
import usePermission from '../../../utils/usePermission'

const CustomersList = () => {
  const [customers, setCustomers] = useState([])
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [searchModalVisible, setSearchModalVisible] =
    useState(false)

  const [activeSearch, setActiveSearch] = useState({
    keyword: '',
    center: '',
  })

  const [dropdownOpen, setDropdownOpen] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const dropdownRefs = useRef({})
  const navigate = useNavigate()
  const { hasAnyPermission } = usePermission()

  const fetchCustomers = async (
    searchParams = {},
    page = 1
  ) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (searchParams.keyword) {
        params.append('search', searchParams.keyword)
      }

      if (searchParams.center) {
        params.append('center', searchParams.center)
      }

      params.append('page', page)

      const url = params.toString()
        ? `/customers?${params.toString()}`
        : '/customers'

      const response = await axiosInstance.get(url)

      if (response.data.success) {
        setCustomers(response.data.data)
        setCurrentPage(
          response.data.pagination.currentPage
        )
        setTotalPages(
          response.data.pagination.totalPages
        )
      } else {
        const errorMessage =
          response.data.message ||
          'API returned unsuccessful response'

        setError(errorMessage)
        console.error(
          'Backend error:',
          response.data
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
          err.response.data
        )
      } else if (err.request) {
        setError(
          'No response received from server. Please check your network connection.'
        )
        console.error('Error request:', err.request)
      } else {
        setError(
          err.message ||
            'An error occurred while fetching data'
        )
        console.error(
          'Error message:',
          err.message
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get(
        '/centers?centerType=Center'
      )

      if (response.data.success) {
        setCenters(response.data.data)
      }
    } catch (error) {
      console.error(
        'Error fetching centers:',
        error
      )
    }
  }

  useEffect(() => {
    fetchCustomers()
    fetchCenters()
  }, [])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return

    fetchCustomers(activeSearch, page)
  }

  const getNestedValue = (obj, path) =>
    path.split('.').reduce(
      (value, part) =>
        value !== null && value !== undefined
          ? value[part]
          : undefined,
      obj,
    )

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

    const sortedCustomers = [...customers].sort((a, b) => {
      const aValue = getNestedValue(a, key)
      const bValue = getNestedValue(b, key)

      if (
        aValue === null ||
        aValue === undefined ||
        aValue === ''
      ) {
        return 1
      }

      if (
        bValue === null ||
        bValue === undefined ||
        bValue === ''
      ) {
        return -1
      }

      const aNumber =
        typeof aValue === 'number'
          ? aValue
          : Number(aValue)
      const bNumber =
        typeof bValue === 'number'
          ? bValue
          : Number(bValue)

      let comparison = 0

      if (
        !Number.isNaN(aNumber) &&
        !Number.isNaN(bNumber)
      ) {
        comparison = aNumber - bNumber
      } else {
        comparison = String(aValue)
          .localeCompare(String(bValue), undefined, {
            numeric: true,
            sensitivity: 'base',
          })
      }

      return direction === 'ascending'
        ? comparison
        : -comparison
    })

    setCustomers(sortedCustomers)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null
    }

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp
        size={15}
        strokeWidth={2.2}
        className="shrink-0 text-[#2759a2]"
      />
    ) : (
      <ArrowDown
        size={15}
        strokeWidth={2.2}
        className="shrink-0 text-[#2759a2]"
      />
    )
  }

  const handleSearch = (searchData) => {
    setActiveSearch(searchData)
    fetchCustomers(searchData, 1)
  }

  const handleResetSearch = () => {
    setActiveSearch({
      keyword: '',
      center: '',
    })

    setSearchTerm('')
    fetchCustomers({}, 1)
  }

  const handleUsernameClick = (customerId) => {
    navigate(`/customer-profile/${customerId}`)
  }

  const filteredCustomers = customers.filter(
    (customer) => {
      if (
        activeSearch.keyword ||
        activeSearch.center
      ) {
        return true
      }

      return Object.values(customer).some(
        (value) => {
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
                  .includes(
                    searchTerm.toLowerCase()
                  )
            )
          }

          return (
            value &&
            value
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
        }
      )
    }
  )

  const handleDeleteCustomer = async (
    customerId
  ) => {
    const result = await confirmDelete()

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(
          `/customers/${customerId}`
        )

        setCustomers((prev) =>
          prev.filter(
            (customer) =>
              customer._id !== customerId
          )
        )

        showSuccess(
          'Customer deleted successfully!'
        )
      } catch (error) {
        console.error(
          'Error deleting customer:',
          error
        )
      }
    }
  }

  const handleEditCustomer = (customerId) => {
    navigate(`/edit-customer/${customerId}`)
  }

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {}
      let shouldUpdate = false

      Object.keys(dropdownRefs.current).forEach(
        (key) => {
          if (
            dropdownRefs.current[key] &&
            !dropdownRefs.current[key].contains(
              event.target
            )
          ) {
            newDropdownState[key] = false
            shouldUpdate = true
          }
        }
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
      handleClickOutside
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [])

  if (error) {
    return (
      <div className="m-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  const SortableHeader = ({
    label,
    sortKey,
  }) => (
    <th
      scope="col"
      onClick={() => handleSort(sortKey)}
className="
  cursor-pointer
  whitespace-nowrap
  border-b
  border-gray-200
  bg-[#f8f9fa]
  px-4
  py-3
  text-left
  text-[14px]
  font-bold
  tracking-wide
  text-[#151515]
  transition
  hover:bg-gray-100
"    >
      <div className="flex items-center justify-between gap-2">
        <span>{label}</span>
        {getSortIcon(sortKey)}
      </div>
    </th>
  )

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Title */}
        <div className="mb-[18px]">
          
          <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
            Customer List
          </h1>
        </div>

        {/* Search Modal */}
        <SearchCustomerModel
          visible={searchModalVisible}
          onClose={() =>
            setSearchModalVisible(false)
          }
          onSearch={handleSearch}
          centers={centers}
        />

        {/* Main Card */}
        <div className="overflow-hidden rounded-[2px] border border-[#e1e4e8] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          {/* Blue top border */}
          <div className="h-[4px] w-full bg-[#2759a2]" />

          {/* Toolbar */}
          <div className="flex min-h-[68px] items-center justify-between border-b border-[#e1e4e8] px-[17px] py-[10px]">
            <div className="flex flex-wrap items-center gap-[5px]">
              {hasAnyPermission('Customer', [
                'manage_customer_all_center',
                'manage_customer_own_center',
              ]) && (
                <Link to="/add-customer">
                  <button
                    type="button"
                    className="
                      inline-flex
                      h-[36px]
                      items-center
                      gap-[4px]
                      rounded-[4px]
                      bg-[#2759a2]
                      px-[10px]
                      text-[15px]
                      font-medium
                      text-white
                      transition
                      hover:bg-[#214a87]
                      focus:outline-none
                    "
                  >
                    <Plus size={17} strokeWidth={2} />
                    Add
                  </button>
                </Link>
              )}

              <button
                type="button"
                onClick={() =>
                  setSearchModalVisible(true)
                }
                className="
                  inline-flex
                  h-[36px]
                  items-center
                  gap-[4px]
                  rounded-[4px]
                  bg-[#2759a2]
                  px-[10px]
                  text-[15px]
                  font-medium
                  text-white
                  transition
                  hover:bg-[#214a87]
                  focus:outline-none
                "
              >
                <Search size={17} strokeWidth={2} />
                Search
              </button>

              {(activeSearch.keyword ||
                activeSearch.center) && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="
                    inline-flex
                    h-[36px]
                    items-center
                    gap-[5px]
                    rounded-[4px]
                    border
                    border-[#cfd3d8]
                    bg-white
                    px-[10px]
                    text-[14px]
                    font-medium
                    text-[#3f4650]
                    transition
                    hover:bg-[#f4f5f6]
                    focus:outline-none
                  "
                >
                  <RotateCcw size={15} />
                  Reset Search
                </button>
              )}
            </div>

            <div className="ml-auto">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>

          {/* Card Body */}
          <div className="px-[17px] pb-[28px] pt-[17px]">
            {/* Local Search */}
            <div className="mb-[16px] flex justify-end">
              <div className="flex items-center gap-[5px]">
                <label
                  htmlFor="customerSearch"
                  className="text-[16px] font-semibold text-[#151515]"
                >
                  Search:
                </label>

                <input
                  id="customerSearch"
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="
                    h-[34px]
                    w-[238px]
                    rounded-[2px]
                    border
                    border-[#d8dde3]
                    bg-white
                    px-[10px]
                    text-[14px]
                    text-[#222]
                    outline-none
                    transition
                    focus:border-[#2759a2]
                  "
                />
              </div>
            </div>

            {/* Table */}
<div className="overflow-hidden rounded-[2px] border border-[#e1e4e8]">
  <div className="max-h-[560px] overflow-y-auto overflow-x-hidden">
    <table className="w-full table-fixed border-collapse text-[15px]">
      <thead className="sticky top-0 z-20 bg-white">
                    <tr>
                      <SortableHeader
                        label="User Name"
                        sortKey="username"
                      />

                      <SortableHeader
                        label="Name"
                        sortKey="name"
                      />

                      <SortableHeader
                        label="Branch"
                        sortKey="center.centerName"
                      />

                      <SortableHeader
                        label="Reseller"
                        sortKey="center.reseller.businessName"
                      />

                      <SortableHeader
                        label="Area"
                        sortKey="center.area.areaName"
                      />

                      <SortableHeader
                        label="Mobile"
                        sortKey="mobile"
                      />

                      <SortableHeader
                        label="Email"
                        sortKey="email"
                      />

                      <SortableHeader
                        label="City"
                        sortKey="city"
                      />

                      <th
                        className="
                          w-[120px]
                          whitespace-nowrap
                          border-b
                          border-[#e0e3e6]
                          bg-[#f8f9fa]
                          px-[9px]
                          py-[11px]
                          text-left
                          text-[16px]
                          font-bold
                          text-[#151515]
                        "
                      >
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="9"
                          className="px-4 py-10 text-center text-[#6b7280]"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#d1d5db] border-t-[#2759a2]" />
                            Loading customers...
                          </div>
                        </td>
                      </tr>
                    ) : filteredCustomers.length > 0 ? (
                      filteredCustomers.map(
                        (customer) => (
                          <tr
                            key={customer._id}
                            className="
                              border-b
                              border-[#e4e6e8]
                              bg-white
                              transition-colors
                              hover:bg-[#f7f9fc]
                            "
                          >
                            {/* Username */}
                            <td className="w-[12%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUsernameClick(
                                    customer._id
                                  )
                                }
                                className="break-words text-left text-[15px] font-normal text-[#2877c7] hover:text-[#155a9c] hover:underline"
                              >
                                {customer.username}
                              </button>
                            </td>

                            {/* Name */}
                            <td className="w-[10%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
                              {customer.name}
                            </td>

                            {/* Branch */}
                            <td className="w-[9%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
                              {customer.center
                                ?.centerName || ''}
                            </td>

                            {/* Reseller */}
                            <td className="w-[12%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
                              {customer.center
                                ?.reseller
                                ?.businessName || ''}
                            </td>

                            {/* Area */}
                            <td className="w-[9%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
                              {customer.center?.area
                                ?.areaName || ''}
                            </td>

                            {/* Mobile */}
                            <td className="w-[9%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
                              {customer.mobile}
                            </td>

                            {/* Email */}
                            <td className="w-[20%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
                              {customer.email}
                            </td>

                            {/* City */}
                            <td className="w-[9%] border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[15px] leading-[21px] text-[#111] break-words">
                              {customer.city}
                            </td>

                            {/* Action */}
                            <td className="w-[10%] px-[8px] py-[11px] align-top">
                              {hasAnyPermission(
                                'Customer',
                                [
                                  'manage_customer_all_center',
                                  'manage_customer_own_center',
                                ]
                              ) && (
                                <div
                                  className="relative"
                                  ref={(el) => {
                                    dropdownRefs.current[
                                      customer._id
                                    ] = el
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleDropdown(
                                        customer._id
                                      )
                                    }
                                    className="
                                      inline-flex
                                      h-[34px]
                                      items-center
                                      gap-[5px]
                                      whitespace-nowrap
                                      rounded-[5px]
                                      border
                                      border-[#bfc4ca]
                                      bg-[#fafafa]
                                      px-[9px]
                                      text-[14px]
                                      font-normal
                                      text-[#3d4650]
                                      transition
                                      hover:bg-[#f0f1f2]
                                      focus:outline-none
                                    "
                                  >
                                    <Settings
                                      size={15}
                                      strokeWidth={1.8}
                                    />
                                    Options
                                    <ChevronDown
                                      size={13}
                                    />
                                  </button>

                                  {dropdownOpen[
                                    customer._id
                                  ] && (
                                    <div className="absolute right-0 z-30 mt-[3px] w-[135px] overflow-hidden rounded-[4px] border border-[#d9dde2] bg-white py-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleEditCustomer(
                                            customer._id
                                          )
                                        }
                                        className="flex w-full items-center gap-[8px] px-[11px] py-[8px] text-left text-[14px] text-[#343a40] transition hover:bg-[#f1f5f9]"
                                      >
                                        <Pencil
                                          size={15}
                                        />
                                        Edit
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteCustomer(
                                            customer._id
                                          )
                                        }
                                        className="flex w-full items-center gap-[8px] px-[11px] py-[8px] text-left text-[14px] text-[#c62828] transition hover:bg-[#fff1f1]"
                                      >
                                        <Trash2
                                          size={15}
                                        />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="px-4 py-10 text-center text-[#6b7280]"
                        >
                          No customers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default CustomersList