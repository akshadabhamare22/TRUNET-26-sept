// import React, { useEffect, useRef, useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import {
//   ArrowDown,
//   ArrowUp,
//   ChevronDown,
//   Pencil,
//   Plus,
//   Settings,
//   Trash2,
// } from 'lucide-react'

// import axiosInstance from '../../../axiosInstance'
// import { confirmDelete, showSuccess } from '../../../utils/sweetAlerts'

// import Pagination from '../../../utils/Pagination'
// import usePermission from '../../../utils/usePermission'

// const CenterList = () => {
//   const [customers, setCustomers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   })

//   const [searchTerm, setSearchTerm] = useState('')
//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const dropdownRefs = useRef({})
//   const { hasAnyPermission } = usePermission()
//   const navigate = useNavigate()

//   const fetchData = async () => {
//     try {
//       setLoading(true)
//       setError(null)

//       const response = await axiosInstance.get(
//         '/centers?centerType=Center',
//       )

//       if (response.data.success) {
//         setCustomers(response.data.data || [])
//         setCurrentPage(response.data.pagination?.currentPage || 1)
//         setTotalPages(response.data.pagination?.totalPages || 1)
//       } else {
//         throw new Error('API returned unsuccessful response')
//       }
//     } catch (err) {
//       setError(err.message)
//       console.error('Error fetching centers:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchData(1)
//   }, [])

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return
//     fetchData(page)
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

//     const sortedCustomers = [...customers].sort((a, b) => {
//       let aValue = a
//       let bValue = b

//       if (key.includes('.')) {
//         const keys = key.split('.')

//         aValue = keys.reduce(
//           (obj, currentKey) => obj && obj[currentKey],
//           a,
//         )

//         bValue = keys.reduce(
//           (obj, currentKey) => obj && obj[currentKey],
//           b,
//         )
//       } else {
//         aValue = a[key]
//         bValue = b[key]
//       }

//       if (aValue == null) aValue = ''
//       if (bValue == null) bValue = ''

//       if (aValue < bValue) {
//         return direction === 'ascending' ? -1 : 1
//       }

//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1
//       }

//       return 0
//     })

//     setCustomers(sortedCustomers)
//   }

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null
//     }

//     return sortConfig.direction === 'ascending' ? (
//       <ArrowUp size={14} />
//     ) : (
//       <ArrowDown size={14} />
//     )
//   }

//   const filteredCustomers = customers.filter((customer) =>
//     Object.values(customer).some((value) => {
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
//     }),
//   )

//   const handleDeleteCenter = async (customerId) => {
//     const result = await confirmDelete()

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/centers/${customerId}`)

//         setCustomers((prev) =>
//           prev.filter((customer) => customer._id !== customerId),
//         )

//         showSuccess('Center deleted successfully!')
//       } catch (error) {
//         console.error('Error deleting center:', error)
//       }
//     }
//   }

//   const handleEditCustomer = (customerId) => {
//     navigate(`/edit-center/${customerId}`)
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

//       Object.keys(dropdownRefs.current).forEach((key) => {
//         const dropdownElement = dropdownRefs.current[key]

//         if (
//           dropdownElement &&
//           !dropdownElement.contains(event.target)
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

//     document.addEventListener('mousedown', handleClickOutside)

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [])

//   const SortableHeader = ({ label, sortKey }) => {
//     const icon = getSortIcon(sortKey)

//     return (
//       <th
//         scope="col"
//         onClick={() => handleSort(sortKey)}
//         className="cursor-pointer select-none whitespace-nowrap border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:bg-gray-100"
//       >
//         <div className="flex items-center gap-1">
//           <span>{label}</span>

//           {icon || (
//             <span className="text-gray-400">
//               <ArrowUp size={13} />
//             </span>
//           )}
//         </div>
//       </th>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2759A2]" />
//           <span className="text-sm text-gray-500">
//             Loading centers...
//           </span>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="mx-4 mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   return (
//     <div className="w-full px-4 py-5 md:px-6">
//       {/* Page Title */}
//       <div className="mb-5 text-2xl font-semibold text-gray-800">
//         Branch List
//       </div>

//       {/* Main Card */}
//       <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             {hasAnyPermission('Center', [
//               'manage_own_center',
//               'manage_all_center',
//             ]) && (
//               <Link to="/add-center">
//                 <button
//                   type="button"
//                   className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2759A2] px-3 text-sm font-medium text-white transition hover:bg-[#1f4782]"
//                 >
//                   <Plus size={16} />
//                   Add
//                 </button>
//               </Link>
//             )}
//           </div>

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>

//         {/* Card Body */}
//         <div className="p-5">
//           {/* Search */}
//           <div className="mb-4 flex justify-end">
//             <div className="flex w-full items-center gap-2 sm:w-auto">
//               <label
//                 htmlFor="center-search"
//                 className="whitespace-nowrap text-sm font-medium text-gray-700"
//               >
//                 Search:
//               </label>

//               <input
//                 id="center-search"
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none transition focus:border-[#2759A2] focus:ring-2 focus:ring-blue-100 sm:w-[300px]"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="w-full overflow-x-auto rounded-md border border-gray-200">
//             <table className="min-w-[1000px] w-full border-collapse">
//               <thead>
//                 <tr>
//                   <SortableHeader
//                     label="Branch Title"
//                     sortKey="centerName"
//                   />

//                   <SortableHeader
//                     label="Reseller"
//                     sortKey="reseller.businessName"
//                   />

//                   <SortableHeader
//                     label="Branch Code"
//                     sortKey="centerCode"
//                   />

//                   <SortableHeader
//                     label="Branch Type"
//                     sortKey="center.centerType"
//                   />

//                   <SortableHeader
//                     label="Email"
//                     sortKey="email"
//                   />

//                   <SortableHeader
//                     label="Mobile"
//                     sortKey="mobile"
//                   />

//                   <SortableHeader
//                     label="Address"
//                     sortKey="city"
//                   />

//                   <th
//                     scope="col"
//                     className="whitespace-nowrap border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700"
//                   >
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredCustomers.length > 0 ? (
//                   filteredCustomers.map((customer, index) => (
//                     <tr
//                       key={customer._id}
//                       className={`transition hover:bg-blue-50 ${
//                         index % 2 === 0
//                           ? 'bg-white'
//                           : 'bg-gray-50/50'
//                       }`}
//                     >
//                       <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
//                         {customer.centerName || ''}
//                       </td>

//                       <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
//                         {customer.reseller?.businessName || ''}
//                       </td>

//                       <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
//                         {customer.centerCode || ''}
//                       </td>

//                       <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
//                         {customer.centerType || ''}
//                       </td>

//                       <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
//                         {customer.email || ''}
//                       </td>

//                       <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
//                         {customer.mobile || ''}
//                       </td>

//                       <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
//                         {customer.addressLine1 || ''}
//                       </td>

//                       <td className="relative border-b border-gray-100 px-4 py-3">
//                         {hasAnyPermission('Center', [
//                           'manage_own_center',
//                           'manage_all_center',
//                         ]) && (
//                           <div
//                             className="relative"
//                             ref={(el) => {
//                               dropdownRefs.current[customer._id] = el
//                             }}
//                           >
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 toggleDropdown(customer._id)
//                               }
//                               className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-xs font-medium text-gray-700 transition hover:border-[#2759A2] hover:bg-gray-50"
//                             >
//                               <Settings size={14} />
//                               Options
//                               <ChevronDown
//                                 size={13}
//                                 className={`transition-transform ${
//                                   dropdownOpen[customer._id]
//                                     ? 'rotate-180'
//                                     : ''
//                                 }`}
//                               />
//                             </button>

//                             {dropdownOpen[customer._id] && (
//                               <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleEditCustomer(
//                                       customer._id,
//                                     )
//                                   }
//                                   className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-blue-50 hover:text-[#2759A2]"
//                                 >
//                                   <Pencil size={15} />
//                                   Edit
//                                 </button>

//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleDeleteCenter(
//                                       customer._id,
//                                     )
//                                   }
//                                   className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
//                                 >
//                                   <Trash2 size={15} />
//                                   Delete
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={8}
//                       className="px-4 py-10 text-center text-sm text-gray-500"
//                     >
//                       No branch found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Bottom Pagination */}
//           <div className="mt-4 flex justify-end">
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CenterList


import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Pencil,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react'

import axiosInstance from '../../../axiosInstance'
import { confirmDelete, showSuccess } from '../../../utils/sweetAlerts'

import Pagination from '../../../utils/Pagination'
import usePermission from '../../../utils/usePermission'

const CenterList = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const dropdownRefs = useRef({})
  const { hasAnyPermission } = usePermission()
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axiosInstance.get(
        '/centers?centerType=Center',
      )

      if (response.data.success) {
        setCustomers(response.data.data || [])
        setCurrentPage(response.data.pagination?.currentPage || 1)
        setTotalPages(response.data.pagination?.totalPages || 1)
      } else {
        throw new Error('API returned unsuccessful response')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching centers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(1)
  }, [])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    fetchData(page)
  }

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
      let aValue = a
      let bValue = b

      if (key.includes('.')) {
        const keys = key.split('.')

        aValue = keys.reduce(
          (obj, currentKey) => obj && obj[currentKey],
          a,
        )

        bValue = keys.reduce(
          (obj, currentKey) => obj && obj[currentKey],
          b,
        )
      } else {
        aValue = a[key]
        bValue = b[key]
      }

      if (aValue == null) aValue = ''
      if (bValue == null) bValue = ''

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1
      }

      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1
      }

      return 0
    })

    setCustomers(sortedCustomers)
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

  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer).some((value) => {
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
    }),
  )

  const handleDeleteCenter = async (customerId) => {
    const result = await confirmDelete()

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/centers/${customerId}`)

        setCustomers((prev) =>
          prev.filter((customer) => customer._id !== customerId),
        )

        showSuccess('Center deleted successfully!')
      } catch (error) {
        console.error('Error deleting center:', error)
      }
    }
  }

  const handleEditCustomer = (customerId) => {
    navigate(`/edit-center/${customerId}`)
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

      Object.keys(dropdownRefs.current).forEach((key) => {
        const dropdownElement = dropdownRefs.current[key]

        if (
          dropdownElement &&
          !dropdownElement.contains(event.target)
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

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const SortableHeader = ({ label, sortKey }) => {
    const icon = getSortIcon(sortKey)

    return (
      <th
        scope="col"
        onClick={() => handleSort(sortKey)}
        className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
      >
        <div className="flex items-center gap-1">
          <span>{label}</span>
          {icon}
        </div>
      </th>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2f5fa7]" />
          <span className="text-sm text-gray-500">
            Loading centers...
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-4 mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

      {/* Page Title */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Branch List
      </div>

      {/* Main Card */}
      <div className="overflow-hidden border-0 bg-white shadow-[0_1px_5px_rgba(0,0,0,0.12)]">

        {/* Card Header */}
        <div className="border-t-[4px] border-t-[#2f5fa7] border-b border-[#dedede] bg-white px-4 py-2">
          <div>
            {hasAnyPermission('Center', [
              'manage_own_center',
              'manage_all_center',
            ]) && (
              <Link to="/add-center">
                <button
                  type="button"
                  className="inline-flex h-[35px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-3 text-[16px] font-medium text-white transition hover:bg-[#244c88]"
                >
                  <Plus size={16} />
                  Add
                </button>
              </Link>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Card Body */}
        <div className="px-[18px] py-[17px]">

          {/* Search */}
          <div className="mb-4 flex justify-end">
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <label
                htmlFor="center-search"
                className="whitespace-nowrap text-[16px] font-semibold text-[#111]"
              >
                Search:
              </label>

              <input
                id="center-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-[34px] w-full rounded-[2px] border border-[#d9d9d9] bg-white px-2 text-[15px] outline-none transition focus:border-[#2f5fa7] sm:w-[238px]"
              />
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div className="w-full overflow-hidden border border-[#eeeeee]">

            {/* Vertical Scroll Area */}
            <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">

              <table className="w-full table-fixed border-collapse">

                {/* Exact column spacing */}
                <colgroup>
                  <col style={{ width: '13%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '9%' }} />
                  <col style={{ width: '9%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '11%' }} />
                </colgroup>

                {/* Table Header */}
                <thead className="sticky top-0 z-20">

                  <tr>

                    <SortableHeader
                      label="Branch Title"
                      sortKey="centerName"
                    />

                    <SortableHeader
                      label="Reseller"
                      sortKey="reseller.businessName"
                    />

                    <SortableHeader
                      label="Branch Code"
                      sortKey="centerCode"
                    />

                    <SortableHeader
                      label="Branch Type"
                      sortKey="center.centerType"
                    />

                    <SortableHeader
                      label="Email"
                      sortKey="email"
                    />

                    <SortableHeader
                      label="Mobile"
                      sortKey="mobile"
                    />

                    <SortableHeader
                      label="Address"
                      sortKey="city"
                    />

                    <th
                      scope="col"
                      className="whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111]"
                    >
                      Action
                    </th>

                  </tr>

                </thead>

                {/* Table Body */}
                <tbody>

                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer, index) => (

                      <tr
                        key={customer._id}
                        className={`transition ${
                          index % 2 === 0
                            ? 'bg-[#f1f1f1]'
                            : 'bg-white'
                        }`}
                      >

                        {/* Branch Title */}
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          <div className="break-words">
                            {customer.centerName || ''}
                          </div>
                        </td>

                        {/* Reseller */}
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          <div className="break-words">
                            {customer.reseller?.businessName || ''}
                          </div>
                        </td>

                        {/* Branch Code */}
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          {customer.centerCode || ''}
                        </td>

                        {/* Branch Type */}
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          {customer.centerType || ''}
                        </td>

                        {/* Email */}
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          <div className="break-words">
                            {customer.email || ''}
                          </div>
                        </td>

                        {/* Mobile */}
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          {customer.mobile || ''}
                        </td>

                        {/* Address */}
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          <div className="break-words">
                            {customer.addressLine1 || ''}
                          </div>
                        </td>

                        {/* Action */}
                        <td className="relative border-b border-[#e9e9e9] px-2 py-3 align-top">

                          {hasAnyPermission('Center', [
                            'manage_own_center',
                            'manage_all_center',
                          ]) && (

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
                                  toggleDropdown(customer._id)
                                }
                                className="inline-flex h-[35px] min-w-[105px] shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-[5px] border border-[#c9c9c9] bg-white px-2 text-[15px] font-normal text-[#333] transition hover:border-[#2f5fa7] hover:bg-[#f7f7f7]"
                              >
                                <Settings size={14} />

                                Options

                                <ChevronDown
                                  size={13}
                                  className={`transition-transform ${
                                    dropdownOpen[
                                      customer._id
                                    ]
                                      ? 'rotate-180'
                                      : ''
                                  }`}
                                />
                              </button>

                              {/* Dropdown */}
                              {dropdownOpen[customer._id] && (
                                <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-[3px] border border-[#ddd] bg-white py-1 shadow-lg">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditCustomer(
                                        customer._id,
                                      )
                                    }
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-blue-50 hover:text-[#2759A2]"
                                  >
                                    <Pencil size={15} />
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteCenter(
                                        customer._id,
                                      )
                                    }
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                                  >
                                    <Trash2 size={15} />
                                    Delete
                                  </button>

                                </div>
                              )}

                            </div>

                          )}

                        </td>

                      </tr>

                    ))
                  ) : (

                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-10 text-center text-sm text-gray-500"
                      >
                        No branch found
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>
          </div>

          {/* Bottom Pagination */}
          <div className="mt-4 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default CenterList