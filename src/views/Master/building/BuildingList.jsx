// import React, { useEffect, useRef, useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import {
//   ArrowDown,
//   ArrowUp,
//   ChevronDown,
//   Edit,
//   Plus,
//   Search,
//   Settings,
//   Trash2,
//   X,
// } from 'lucide-react'
// import axiosInstance from '../../../axiosInstance';
// import { confirmDelete, showSuccess } from '../../../utils/sweetAlerts'
// import SearchBuildingModel from './SearchBuildingModel'
// import Pagination from '../../../utils/Pagination';
// import usePermission from '../../../utils/usePermission'

// const BuildingList = () => {
//   const [buildings, setBuildings] = useState([])
//   const [centers, setCenters] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   })

//   const [searchTerm, setSearchTerm] = useState('')
//   const [searchModalVisible, setSearchModalVisible] = useState(false)

//   const [activeSearch, setActiveSearch] = useState({
//     keyword: '',
//     center: '',
//   })

//   const [dropdownOpen, setDropdownOpen] = useState({})
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const { hasAnyPermission } = usePermission()

//   const dropdownRefs = useRef({})
//   const navigate = useNavigate()

//   const fetchBuildings = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true)

//       const params = new URLSearchParams()

//       if (searchParams.keyword) {
//         params.append('search', searchParams.keyword)
//       }

//       if (searchParams.center) {
//         params.append('center', searchParams.center)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/buildings?${params.toString()}`
//         : '/buildings'

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         setBuildings(response.data.data)
//         setCurrentPage(response.data.pagination.currentPage)
//         setTotalPages(response.data.pagination.totalPages)
//       } else {
//         throw new Error('API returned unsuccessful response')
//       }
//     } catch (err) {
//       setError(err.message)
//       console.error('Error fetching buildings:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get(
//         '/centers?centerType=Center',
//       )

//       if (response.data.success) {
//         setCenters(response.data.data)
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error)
//     }
//   }

//   useEffect(() => {
//     fetchCenters()
//     fetchBuildings()
//   }, [])

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return

//     fetchBuildings(activeSearch, page)
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

//     const sortedBuildings = [...buildings].sort((a, b) => {
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

//     setBuildings(sortedBuildings)
//   }

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null
//     }

//     return sortConfig.direction === 'ascending' ? (
//       <ArrowUp size={15} className="inline-block" />
//     ) : (
//       <ArrowDown size={15} className="inline-block" />
//     )
//   }

//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData)
//     fetchBuildings(searchData, 1)
//   }

//   const handleResetSearch = () => {
//     setActiveSearch({
//       keyword: '',
//       center: '',
//     })

//     setSearchTerm('')
//     fetchBuildings({}, 1)
//   }

//   const filteredBuildings = buildings.filter((building) =>
//     Object.values(building).some((value) => {
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

//   const handleDeleteBuilding = async (buildingId) => {
//     const result = await confirmDelete()

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/buildings/${buildingId}`)

//         setBuildings((prev) =>
//           prev.filter((building) => building._id !== buildingId),
//         )

//         showSuccess('building deleted successfully!')
//       } catch (error) {
//         console.error('Error deleting building:', error)
//       }
//     }
//   }

//   const handleEditBuilding = (buildingId) => {
//     navigate(`/edit-building/${buildingId}`)
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

//     document.addEventListener('mousedown', handleClickOutside)

//     return () => {
//       document.removeEventListener(
//         'mousedown',
//         handleClickOutside,
//       )
//     }
//   }, [])

//   const handleClick = (buildingId) => {
//     navigate(`/building-profile/${buildingId}`)
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2759A2]" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   return (
//     <div className="w-full">
//       <div className="mb-5">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           Building List
//         </h1>
//       </div>

//       <SearchBuildingModel
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//       />

//       <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 md:flex-row md:items-center md:justify-between">
//           <div className="flex flex-wrap gap-2">
//             {hasAnyPermission('Settings', [
//               'manage_building_all_center',
//               'manage_building_own_center',
//             ]) && (
//               <Link
//                 to="/add-building"
//                 className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#1f4b8c]"
//               >
//                 <Plus size={16} />
//                 Add
//               </Link>
//             )}

//             <button
//               type="button"
//               onClick={() => setSearchModalVisible(true)}
//               className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               <Search size={16} />
//               Search
//             </button>

//             {(activeSearch.keyword || activeSearch.center) && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 <X size={16} />
//                 Reset Search
//               </button>
//             )}
//           </div>

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>

//         <div className="p-4">
//           <div className="mb-4 flex justify-end items-center gap-2">
//             <label
//               htmlFor="building-search"
//               className="text-sm font-medium text-gray-600"
//             >
//               Search:
//             </label>

//             <input
//               id="building-search"
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="h-8 w-full max-w-[350px] rounded-none border border-gray-300 px-2 text-sm outline-none focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
//             />
//           </div>

//           <div className="overflow-x-auto rounded-md border border-gray-200">
//             <table className="min-w-full border-collapse text-sm">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th
//                     onClick={() => handleSort('buildingName')}
//                     className="cursor-pointer border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
//                   >
//                     <span className="inline-flex items-center gap-1">
//                       Building
//                       {getSortIcon('buildingName')}
//                     </span>
//                   </th>

//                   <th
//                     onClick={() => handleSort('address1')}
//                     className="cursor-pointer border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
//                   >
//                     <span className="inline-flex items-center gap-1">
//                       Address
//                       {getSortIcon('address1')}
//                     </span>
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort('center.centerName')
//                     }
//                     className="cursor-pointer border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
//                   >
//                     <span className="inline-flex items-center gap-1">
//                       Branch
//                       {getSortIcon('center.centerName')}
//                     </span>
//                   </th>

//                   <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredBuildings.length > 0 ? (
//                   filteredBuildings.map((building) => (
//                     <tr
//                       key={building._id}
//                       className="border-b border-gray-100 hover:bg-gray-50"
//                     >
//                       <td className="px-4 py-3">
//                         <button
//                           type="button"
//                           onClick={() =>
//                             handleClick(building._id)
//                           }
//                           className="text-left font-medium text-[#337ab7] hover:underline"
//                         >
//                           {building.buildingName}
//                         </button>
//                       </td>

//                       <td className="px-4 py-3 text-gray-700">
//                         {building.address1}
//                       </td>

//                       <td className="px-4 py-3 text-gray-700">
//                         {building.center?.centerName || ''}
//                       </td>

//                       <td className="px-4 py-3">
//                         {hasAnyPermission('Settings', [
//                           'manage_building_all_center',
//                           'manage_building_own_center',
//                         ]) && (
//                           <div
//                             className="relative inline-block"
//                             ref={(el) => {
//                               dropdownRefs.current[building._id] =
//                                 el
//                             }}
//                           >
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 toggleDropdown(building._id)
//                               }
//                               className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
//                             >
//                               <Settings size={15} />
//                               Options
//                               <ChevronDown size={14} />
//                             </button>

//                             {dropdownOpen[building._id] && (
//                               <div className="absolute right-0 z-20 mt-1 w-32 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleEditBuilding(
//                                       building._id,
//                                     )
//                                   }
//                                   className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
//                                 >
//                                   <Edit size={15} />
//                                   Edit
//                                 </button>

//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleDeleteBuilding(
//                                       building._id,
//                                     )
//                                   }
//                                   className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
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
//                       colSpan={4}
//                       className="px-4 py-8 text-center text-gray-500"
//                     >
//                       No buildings found
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

// export default BuildingList

import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Edit,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
} from 'lucide-react'
import axiosInstance from '../../../axiosInstance';
import { confirmDelete, showSuccess } from '../../../utils/sweetAlerts'
import SearchBuildingModel from './SearchBuildingModel'
import Pagination from '../../../utils/Pagination';
import usePermission from '../../../utils/usePermission'

const BuildingList = () => {
  const [buildings, setBuildings] = useState([])
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [searchModalVisible, setSearchModalVisible] = useState(false)

  const [activeSearch, setActiveSearch] = useState({
    keyword: '',
    center: '',
  })

  const [dropdownOpen, setDropdownOpen] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const { hasAnyPermission } = usePermission()

  const dropdownRefs = useRef({})
  const navigate = useNavigate()

  const fetchBuildings = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true)

      const params = new URLSearchParams()

      if (searchParams.keyword) {
        params.append('search', searchParams.keyword)
      }

      if (searchParams.center) {
        params.append('center', searchParams.center)
      }

      params.append('page', page)

      const url = params.toString()
        ? `/buildings?${params.toString()}`
        : '/buildings'

      const response = await axiosInstance.get(url)

      if (response.data.success) {
        setBuildings(response.data.data)
        setCurrentPage(response.data.pagination.currentPage)
        setTotalPages(response.data.pagination.totalPages)
      } else {
        throw new Error('API returned unsuccessful response')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching buildings:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get(
        '/centers?centerType=Center',
      )

      if (response.data.success) {
        setCenters(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching centers:', error)
    }
  }

  useEffect(() => {
    fetchCenters()
    fetchBuildings()
  }, [])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return

    fetchBuildings(activeSearch, page)
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

    const sortedBuildings = [...buildings].sort((a, b) => {
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

    setBuildings(sortedBuildings)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null
    }

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp size={15} className="inline-block" />
    ) : (
      <ArrowDown size={15} className="inline-block" />
    )
  }

  const handleSearch = (searchData) => {
    setActiveSearch(searchData)
    fetchBuildings(searchData, 1)
  }

  const handleResetSearch = () => {
    setActiveSearch({
      keyword: '',
      center: '',
    })

    setSearchTerm('')
    fetchBuildings({}, 1)
  }

  const filteredBuildings = buildings.filter((building) =>
    Object.values(building).some((value) => {
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

  const handleDeleteBuilding = async (buildingId) => {
    const result = await confirmDelete()

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/buildings/${buildingId}`)

        setBuildings((prev) =>
          prev.filter((building) => building._id !== buildingId),
        )

        showSuccess('building deleted successfully!')
      } catch (error) {
        console.error('Error deleting building:', error)
      }
    }
  }

  const handleEditBuilding = (buildingId) => {
    navigate(`/edit-building/${buildingId}`)
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

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  const handleClick = (buildingId) => {
    navigate(`/building-profile/${buildingId}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2759A2]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#f4f5f7] px-3 py-3 md:px-4">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Page Title */}
        <div className="mb-[18px]">
          <h1 className="text-[24px] font-normal leading-tight text-[#212529]">
            Building List
          </h1>
        </div>

        {/* Search Modal */}
        <SearchBuildingModel
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
          onSearch={handleSearch}
          centers={centers}
        />

        {/* Main Card */}
        <div className="overflow-hidden rounded-[2px] border border-[#dfe3e8] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          {/* Blue top border */}
          <div className="h-[4px] w-full bg-[#2759A2]" />

          {/* Toolbar */}
          <div className="flex min-h-[67px] items-center justify-between border-b border-[#e1e4e8] px-[17px] py-[10px]">
            <div className="flex flex-wrap items-center gap-[5px]">
              {hasAnyPermission('Settings', [
                'manage_building_all_center',
                'manage_building_own_center',
              ]) && (
                <Link
                  to="/add-building"
                  className="inline-flex h-[36px] items-center gap-[4px] rounded-[4px] bg-[#2759A2] px-[10px] text-[15px] font-medium text-white transition hover:bg-[#214d8d] focus:outline-none"
                >
                  <Plus size={17} strokeWidth={2} />
                  Add
                </Link>
              )}

              <button
                type="button"
                onClick={() => setSearchModalVisible(true)}
                className="inline-flex h-[36px] items-center gap-[4px] rounded-[4px] bg-[#2759A2] px-[10px] text-[15px] font-medium text-white transition hover:bg-[#214d8d] focus:outline-none"
              >
                <Search size={17} strokeWidth={2} />
                Search
              </button>

              {(activeSearch.keyword || activeSearch.center) && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="inline-flex h-[36px] items-center gap-[5px] rounded-[4px] border border-[#cfd3d8] bg-white px-[10px] text-[14px] font-medium text-[#3f4650] transition hover:bg-[#f4f5f6] focus:outline-none"
                >
                  <X size={15} />
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
            <div className="mb-[16px] flex items-center justify-end gap-[5px]">
              <label
                htmlFor="building-search"
                className="text-[16px] font-semibold text-[#151515]"
              >
                Search:
              </label>

              <input
                id="building-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-[34px] w-[238px] rounded-[2px] border border-[#d8dde3] bg-white px-[10px] text-[14px] text-[#222] outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
              />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-[2px] border border-[#e1e4e8]">
              <div className="max-h-[560px] overflow-y-auto overflow-x-hidden">
                <table className="w-full table-fixed border-collapse text-[16px]">
                  <colgroup>
                    <col className="w-[25%]" />
                    <col className="w-[45%]" />
                    <col className="w-[17%]" />
                    <col className="w-[13%]" />
                  </colgroup>

                  <thead className="sticky top-0 z-20 bg-white">
                    <tr>
                      <th
                        onClick={() => handleSort('buildingName')}
                        className="cursor-pointer whitespace-nowrap border-b border-[#e0e3e6] bg-[#f8f9fa] px-[9px] py-[11px] text-left text-[16px] font-bold text-[#151515] select-none transition hover:bg-[#eef3f9]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>Building</span>
                          <span className="flex min-w-[15px] items-center text-[#2759A2]">
                            {getSortIcon('buildingName')}
                          </span>
                        </div>
                      </th>

                      <th
                        onClick={() => handleSort('address1')}
                        className="cursor-pointer whitespace-nowrap border-b border-[#e0e3e6] bg-[#f8f9fa] px-[9px] py-[11px] text-left text-[16px] font-bold text-[#151515] select-none transition hover:bg-[#eef3f9]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>Address</span>
                          <span className="flex min-w-[15px] items-center text-[#2759A2]">
                            {getSortIcon('address1')}
                          </span>
                        </div>
                      </th>

                      <th
                        onClick={() => handleSort('center.centerName')}
                        className="cursor-pointer whitespace-nowrap border-b border-[#e0e3e6] bg-[#f8f9fa] px-[9px] py-[11px] text-left text-[16px] font-bold text-[#151515] select-none transition hover:bg-[#eef3f9]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>Branch</span>
                          <span className="flex min-w-[15px] items-center text-[#2759A2]">
                            {getSortIcon('center.centerName')}
                          </span>
                        </div>
                      </th>

                      <th className="whitespace-nowrap border-b border-[#e0e3e6] bg-[#f8f9fa] px-[9px] py-[11px] text-left text-[16px] font-bold text-[#151515]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBuildings.length > 0 ? (
                      filteredBuildings.map((building) => (
                        <tr
                          key={building._id}
                          className="border-b border-[#e4e6e8] bg-white transition-colors odd:bg-[#f3f3f3] hover:bg-[#f7f9fc]"
                        >
                          <td className="border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[16px] leading-[22px]">
                            <button
                              type="button"
                              onClick={() => handleClick(building._id)}
                              className="break-words text-left font-normal text-[#2877c7] hover:text-[#155a9c] hover:underline"
                            >
                              {building.buildingName}
                            </button>
                          </td>

                          <td className="border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[16px] leading-[22px] text-[#111] break-words">
                            {building.address1}
                          </td>

                          <td className="border-r border-[#edf0f2] px-[9px] py-[11px] align-top text-[16px] leading-[22px] text-[#111] break-words">
                            {building.center?.centerName || ''}
                          </td>

                          <td className="px-[8px] py-[9px] align-top">
                            {hasAnyPermission('Settings', [
                              'manage_building_all_center',
                              'manage_building_own_center',
                            ]) && (
                              <div
                                className="relative inline-block"
                                ref={(el) => {
                                  dropdownRefs.current[building._id] = el
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleDropdown(building._id)
                                  }
                                  className="inline-flex h-[34px] items-center gap-[5px] whitespace-nowrap rounded-[5px] border border-[#bfc4ca] bg-[#fafafa] px-[9px] text-[14px] font-normal text-[#3d4650] transition hover:bg-[#f0f1f2] focus:outline-none"
                                >
                                  <Settings
                                    size={15}
                                    strokeWidth={1.8}
                                  />
                                  Options
                                  <ChevronDown size={13} />
                                </button>

                                {dropdownOpen[building._id] && (
                                  <div className="absolute right-0 z-30 mt-[3px] w-[135px] overflow-hidden rounded-[4px] border border-[#d9dde2] bg-white py-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEditBuilding(
                                          building._id,
                                        )
                                      }
                                      className="flex w-full items-center gap-[8px] px-[11px] py-[8px] text-left text-[14px] text-[#343a40] transition hover:bg-[#f1f5f9]"
                                    >
                                      <Edit size={15} />
                                      Edit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteBuilding(
                                          building._id,
                                        )
                                      }
                                      className="flex w-full items-center gap-[8px] px-[11px] py-[8px] text-left text-[14px] text-[#c62828] transition hover:bg-[#fff1f1]"
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
                          colSpan={4}
                          className="px-4 py-10 text-center text-[#6b7280]"
                        >
                          No buildings found
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

export default BuildingList
