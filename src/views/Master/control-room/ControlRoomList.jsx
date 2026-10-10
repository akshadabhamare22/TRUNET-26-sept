// import React, { useEffect, useRef, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   ArrowDown,
//   ArrowUp,
//   ChevronDown,
//   Pencil,
//   Plus,
//   Search,
//   Settings,
//   Trash2,
//   RotateCcw,
// } from 'lucide-react';

// import axiosInstance from '../../../axiosInstance';
// import { confirmDelete, showSuccess } from '../../../utils/sweetAlerts';
// import SearchControlModel from './SearchControlModel';
// import Pagination from '../../../utils/Pagination';
// import usePermission from '../../../utils/usePermission';

// const ControlRoomList = () => {
//   const [controlRooms, setControlRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   });

//   const [searchTerm, setSearchTerm] = useState('');
//   const [centers, setCenters] = useState([]);
//   const [searchModalVisible, setSearchModalVisible] =
//     useState(false);

//   const [activeSearch, setActiveSearch] = useState({
//     keyword: '',
//     center: '',
//   });

//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const dropdownRefs = useRef({});

//   const navigate = useNavigate();

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const { hasAnyPermission } = usePermission();

//   // --------------------------------------------------
//   // Fetch Control Rooms
//   // --------------------------------------------------
//   const fetchData = async (
//     searchParams = {},
//     page = 1
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();

//       if (searchParams.keyword) {
//         params.append('search', searchParams.keyword);
//       }

//       if (searchParams.center) {
//         params.append('center', searchParams.center);
//       }

//       params.append('page', page);

//       const url = params.toString()
//         ? `/controlRooms?${params.toString()}`
//         : '/controlRooms';

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         setControlRooms(response.data.data || []);

//         setCurrentPage(
//           response.data.pagination?.currentPage || 1
//         );

//         setTotalPages(
//           response.data.pagination?.totalPages || 1
//         );
//       } else {
//         throw new Error(
//           'API returned unsuccessful response'
//         );
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error(
//         'Error fetching control rooms:',
//         err
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Fetch Centers
//   // --------------------------------------------------
//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get(
//         '/centers?centerType=Center'
//       );

//       if (response.data.success) {
//         setCenters(response.data.data || []);
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching centers:',
//         error
//       );
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//   }, []);

//   // --------------------------------------------------
//   // Pagination
//   // --------------------------------------------------
//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;

//     fetchData(activeSearch, page);
//   };

//   // --------------------------------------------------
//   // Sorting
//   // --------------------------------------------------
//   const handleSort = (key) => {
//     let direction = 'ascending';

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction === 'ascending'
//     ) {
//       direction = 'descending';
//     }

//     setSortConfig({
//       key,
//       direction,
//     });

//     const sortedControlRooms = [...controlRooms].sort(
//       (a, b) => {
//         let aValue = a;
//         let bValue = b;

//         if (key.includes('.')) {
//           const keys = key.split('.');

//           aValue = keys.reduce(
//             (obj, k) => obj?.[k],
//             a
//           );

//           bValue = keys.reduce(
//             (obj, k) => obj?.[k],
//             b
//           );
//         } else {
//           aValue = a?.[key];
//           bValue = b?.[key];
//         }

//         if (
//           aValue === null ||
//           aValue === undefined
//         ) {
//           aValue = '';
//         }

//         if (
//           bValue === null ||
//           bValue === undefined
//         ) {
//           bValue = '';
//         }

//         if (typeof aValue === 'string') {
//           aValue = aValue.toLowerCase();
//         }

//         if (typeof bValue === 'string') {
//           bValue = bValue.toLowerCase();
//         }

//         if (aValue < bValue) {
//           return direction === 'ascending' ? -1 : 1;
//         }

//         if (aValue > bValue) {
//           return direction === 'ascending' ? 1 : -1;
//         }

//         return 0;
//       }
//     );

//     setControlRooms(sortedControlRooms);
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null;
//     }

//     return sortConfig.direction === 'ascending' ? (
//       <ArrowUp size={14} className="ml-1" />
//     ) : (
//       <ArrowDown size={14} className="ml-1" />
//     );
//   };

//   // --------------------------------------------------
//   // Local Search
//   // --------------------------------------------------
//   const filteredControlRooms = controlRooms.filter(
//     (controlRoom) => {
//       if (!searchTerm.trim()) {
//         return true;
//       }

//       const search = searchTerm.toLowerCase();

//       return Object.values(controlRoom).some(
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
//                   .includes(search)
//             );
//           }

//           return (
//             value &&
//             value
//               .toString()
//               .toLowerCase()
//               .includes(search)
//           );
//         }
//       );
//     }
//   );

//   // --------------------------------------------------
//   // Delete Control Room
//   // --------------------------------------------------
//   const handleDeleteBuilding = async (buildingId) => {
//     const result = await confirmDelete();

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(
//           `/controlRooms/${buildingId}`
//         );

//         setControlRooms((prev) =>
//           prev.filter(
//             (controlRoom) =>
//               controlRoom._id !== buildingId
//           )
//         );

//         showSuccess(
//           'control room deleted successfully!'
//         );
//       } catch (error) {
//         console.error(
//           'Error deleting control room:',
//           error
//         );
//       }
//     }
//   };

//   // --------------------------------------------------
//   // Edit Control Room
//   // --------------------------------------------------
//   const handleEditBuilding = (buildingId) => {
//     navigate(`/edit-controlRoom/${buildingId}`);
//   };

//   // --------------------------------------------------
//   // Dropdown
//   // --------------------------------------------------
//   const toggleDropdown = (id) => {
//     setDropdownOpen((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   // --------------------------------------------------
//   // Close Dropdown On Outside Click
//   // --------------------------------------------------
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const newDropdownState = {};
//       let shouldUpdate = false;

//       Object.keys(dropdownRefs.current).forEach(
//         (key) => {
//           const element = dropdownRefs.current[key];

//           if (
//             element &&
//             !element.contains(event.target)
//           ) {
//             newDropdownState[key] = false;
//             shouldUpdate = true;
//           }
//         }
//       );

//       if (shouldUpdate) {
//         setDropdownOpen((prev) => ({
//           ...prev,
//           ...newDropdownState,
//         }));
//       }
//     };

//     document.addEventListener(
//       'mousedown',
//       handleClickOutside
//     );

//     return () => {
//       document.removeEventListener(
//         'mousedown',
//         handleClickOutside
//       );
//     };
//   }, []);

//   // --------------------------------------------------
//   // Search Modal
//   // --------------------------------------------------
//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData);
//     fetchData(searchData, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch({
//       keyword: '',
//       center: '',
//     });

//     setSearchTerm('');

//     fetchData({}, 1);
//   };

//   // --------------------------------------------------
//   // Profile
//   // --------------------------------------------------
//   const handleClick = (controlRoomId) => {
//     navigate(
//       `/controlRoom-profile/${controlRoomId}`
//     );
//   };

//   // --------------------------------------------------
//   // Loading
//   // --------------------------------------------------
//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // Error
//   // --------------------------------------------------
//   if (error) {
//     return (
//       <div
//         className="mx-4 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
//         role="alert"
//       >
//         Error loading controlRooms: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {/* Page Title */}
//       <div className="mb-4 text-xl font-semibold text-gray-800">
//         Control Room List
//       </div>

//       {/* Search Modal */}
//       <SearchControlModel
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         centers={centers}
//       />

//       {/* Main Card */}
//       <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Header */}
//         <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
//           {/* Actions */}
//           <div className="flex flex-wrap items-center gap-2">
//             {hasAnyPermission('Settings', [
//               'manage_control_room_own_center',
//               'manage_control_room_all_center',
//             ]) && (
//               <Link to="/add-controlRoom">
//                 <button
//                   type="button"
//                   className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
//                 >
//                   <Plus size={16} />
//                   Add
//                 </button>
//               </Link>
//             )}

//             {/* Search */}
//             <button
//               type="button"
//               onClick={() =>
//                 setSearchModalVisible(true)
//               }
//               className="inline-flex items-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <Search size={16} />
//               Search
//             </button>

//             {/* Reset Search */}
//             {(activeSearch.keyword ||
//               activeSearch.center) && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex items-center gap-2 rounded-md border border-gray-400 bg-gray-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
//               >
//                 <RotateCcw size={16} />
//                 Reset Search
//               </button>
//             )}
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
//         <div className="p-5">
//           {/* Search Input */}
//           <div className="mb-4 flex items-center justify-end gap-2">
//             <label
//               htmlFor="control-room-search"
//               className="text-sm font-medium text-gray-700"
//             >
//               Search:
//             </label>

//             <input
//               id="control-room-search"
//               type="text"
//               value={searchTerm}
//               onChange={(e) =>
//                 setSearchTerm(e.target.value)
//               }
//               className="h-8 w-full max-w-[350px] border border-gray-300 bg-white px-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//             />
//           </div>

//           {/* Table */}
//           <div className="w-full overflow-x-auto">
//             <table className="min-w-[800px] w-full border-collapse border border-gray-200 text-sm">
//               <thead>
//                 <tr className="bg-gray-50">
//                   {/* Building */}
//                   <th
//                     onClick={() =>
//                       handleSort('buildingName')
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
//                   >
//                     <div className="flex items-center">
//                       Building
//                       {getSortIcon(
//                         'buildingName'
//                       )}
//                     </div>
//                   </th>

//                   {/* Address */}
//                   <th
//                     onClick={() =>
//                       handleSort('address1')
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
//                   >
//                     <div className="flex items-center">
//                       Address
//                       {getSortIcon('address1')}
//                     </div>
//                   </th>

//                   {/* Branch */}
//                   <th
//                     onClick={() =>
//                       handleSort(
//                         'center.centerName'
//                       )
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
//                   >
//                     <div className="flex items-center">
//                       Branch
//                       {getSortIcon(
//                         'center.centerName'
//                       )}
//                     </div>
//                   </th>

//                   {/* Action */}
//                   <th className="whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredControlRooms.length > 0 ? (
//                   filteredControlRooms.map(
//                     (building) => (
//                       <tr
//                         key={building._id}
//                         className="transition hover:bg-gray-50"
//                       >
//                         {/* Building */}
//                         <td className="border border-gray-200 px-4 py-3">
//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleClick(
//                                 building._id
//                               )
//                             }
//                             className="cursor-pointer border-none bg-transparent p-0 text-left text-blue-600 hover:text-blue-800 hover:underline"
//                           >
//                             {building.buildingName}
//                           </button>
//                         </td>

//                         {/* Address */}
//                         <td className="border border-gray-200 px-4 py-3 text-gray-700">
//                           {building.address1}
//                         </td>

//                         {/* Branch */}
//                         <td className="border border-gray-200 px-4 py-3 text-gray-700">
//                           {building.center
//                             ?.centerName || ''}
//                         </td>

//                         {/* Action */}
//                         <td className="border border-gray-200 px-4 py-3">
//                           {hasAnyPermission(
//                             'Settings',
//                             [
//                               'manage_control_room_own_center',
//                               'manage_control_room_all_center',
//                             ]
//                           ) && (
//                             <div
//                               className="relative inline-block"
//                               ref={(element) => {
//                                 dropdownRefs.current[
//                                   building._id
//                                 ] = element;
//                               }}
//                             >
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   toggleDropdown(
//                                     building._id
//                                   )
//                                 }
//                                 className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               >
//                                 <Settings size={15} />
//                                 Options
//                                 <ChevronDown
//                                   size={14}
//                                 />
//                               </button>

//                               {dropdownOpen[
//                                 building._id
//                               ] && (
//                                 <div className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
//                                   {/* Edit */}
//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       handleEditBuilding(
//                                         building._id
//                                       )
//                                     }
//                                     className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
//                                   >
//                                     <Pencil
//                                       size={15}
//                                     />
//                                     Edit
//                                   </button>

//                                   {/* Delete */}
//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       handleDeleteBuilding(
//                                         building._id
//                                       )
//                                     }
//                                     className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
//                                   >
//                                     <Trash2
//                                       size={15}
//                                     />
//                                     Delete
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     )
//                   )
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={4}
//                       className="border border-gray-200 px-4 py-8 text-center text-sm text-gray-500"
//                     >
//                       No control room found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ControlRoomList;

import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  RotateCcw,
} from 'lucide-react';

import axiosInstance from '../../../axiosInstance';
import { confirmDelete, showSuccess } from '../../../utils/sweetAlerts';
import SearchControlModel from './SearchControlModel';
import Pagination from '../../../utils/Pagination';
import usePermission from '../../../utils/usePermission';

const ControlRoomList = () => {
  const [controlRooms, setControlRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [centers, setCenters] = useState([]);
  const [searchModalVisible, setSearchModalVisible] =
    useState(false);

  const [activeSearch, setActiveSearch] = useState({
    keyword: '',
    center: '',
  });

  const [dropdownOpen, setDropdownOpen] = useState({});
  const dropdownRefs = useRef({});

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { hasAnyPermission } = usePermission();

  // --------------------------------------------------
  // Fetch Control Rooms
  // --------------------------------------------------
  const fetchData = async (
    searchParams = {},
    page = 1
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchParams.keyword) {
        params.append('search', searchParams.keyword);
      }

      if (searchParams.center) {
        params.append('center', searchParams.center);
      }

      params.append('page', page);

      const url = params.toString()
        ? `/controlRooms?${params.toString()}`
        : '/controlRooms';

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setControlRooms(response.data.data || []);

        setCurrentPage(
          response.data.pagination?.currentPage || 1
        );

        setTotalPages(
          response.data.pagination?.totalPages || 1
        );
      } else {
        throw new Error(
          'API returned unsuccessful response'
        );
      }
    } catch (err) {
      setError(err.message);
      console.error(
        'Error fetching control rooms:',
        err
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Fetch Centers
  // --------------------------------------------------
  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get(
        '/centers?centerType=Center'
      );

      if (response.data.success) {
        setCenters(response.data.data || []);
      }
    } catch (error) {
      console.error(
        'Error fetching centers:',
        error
      );
    }
  };

  useEffect(() => {
    fetchData();
    fetchCenters();
  }, []);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    fetchData(activeSearch, page);
  };

  // --------------------------------------------------
  // Sorting
  // --------------------------------------------------
  const handleSort = (key) => {
    let direction = 'ascending';

    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }

    setSortConfig({
      key,
      direction,
    });

    const sortedControlRooms = [...controlRooms].sort(
      (a, b) => {
        let aValue = a;
        let bValue = b;

        if (key.includes('.')) {
          const keys = key.split('.');

          aValue = keys.reduce(
            (obj, k) => obj?.[k],
            a
          );

          bValue = keys.reduce(
            (obj, k) => obj?.[k],
            b
          );
        } else {
          aValue = a?.[key];
          bValue = b?.[key];
        }

        if (
          aValue === null ||
          aValue === undefined
        ) {
          aValue = '';
        }

        if (
          bValue === null ||
          bValue === undefined
        ) {
          bValue = '';
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
        }

        if (typeof bValue === 'string') {
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return direction === 'ascending' ? -1 : 1;
        }

        if (aValue > bValue) {
          return direction === 'ascending' ? 1 : -1;
        }

        return 0;
      }
    );

    setControlRooms(sortedControlRooms);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp size={14} className="ml-1" />
    ) : (
      <ArrowDown size={14} className="ml-1" />
    );
  };

  // --------------------------------------------------
  // Local Search
  // --------------------------------------------------
  const filteredControlRooms = controlRooms.filter(
    (controlRoom) => {
      if (!searchTerm.trim()) {
        return true;
      }

      const search = searchTerm.toLowerCase();

      return Object.values(controlRoom).some(
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
                  .includes(search)
            );
          }

          return (
            value &&
            value
              .toString()
              .toLowerCase()
              .includes(search)
          );
        }
      );
    }
  );

  // --------------------------------------------------
  // Delete Control Room
  // --------------------------------------------------
  const handleDeleteBuilding = async (buildingId) => {
    const result = await confirmDelete();

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(
          `/controlRooms/${buildingId}`
        );

        setControlRooms((prev) =>
          prev.filter(
            (controlRoom) =>
              controlRoom._id !== buildingId
          )
        );

        showSuccess(
          'control room deleted successfully!'
        );
      } catch (error) {
        console.error(
          'Error deleting control room:',
          error
        );
      }
    }
  };

  // --------------------------------------------------
  // Edit Control Room
  // --------------------------------------------------
  const handleEditBuilding = (buildingId) => {
    navigate(`/edit-controlRoom/${buildingId}`);
  };

  // --------------------------------------------------
  // Dropdown
  // --------------------------------------------------
  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // --------------------------------------------------
  // Close Dropdown On Outside Click
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {};
      let shouldUpdate = false;

      Object.keys(dropdownRefs.current).forEach(
        (key) => {
          const element = dropdownRefs.current[key];

          if (
            element &&
            !element.contains(event.target)
          ) {
            newDropdownState[key] = false;
            shouldUpdate = true;
          }
        }
      );

      if (shouldUpdate) {
        setDropdownOpen((prev) => ({
          ...prev,
          ...newDropdownState,
        }));
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // --------------------------------------------------
  // Search Modal
  // --------------------------------------------------
  const handleSearch = (searchData) => {
    setActiveSearch(searchData);
    fetchData(searchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({
      keyword: '',
      center: '',
    });

    setSearchTerm('');

    fetchData({}, 1);
  };

  // --------------------------------------------------
  // Profile
  // --------------------------------------------------
  const handleClick = (controlRoomId) => {
    navigate(
      `/controlRoom-profile/${controlRoomId}`
    );
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div
        className="mx-4 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        Error loading controlRooms: {error}
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-[#f4f5f7] px-4 py-4 md:px-5">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mb-4">
          <h1 className="text-[24px] font-[450] leading-tight text-[#212529]">
            Control Room List
          </h1>
        </div>

        <SearchControlModel
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
          onSearch={handleSearch}
          centers={centers}
        />

        <div className="overflow-hidden rounded-[2px] border border-[#dfe3e8] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <div className="h-[4px] w-full bg-[#2759A2]" />

          <div className="flex flex-col gap-3 border-b border-[#e1e4e8] px-[17px] py-[10px] lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-1">
              {hasAnyPermission('Settings', [
                'manage_control_room_own_center',
                'manage_control_room_all_center',
              ]) && (
                <Link to="/add-controlRoom">
                  <button
                    type="button"
                    className="inline-flex h-[36px] items-center gap-1 rounded-[4px] bg-[#2759A2] px-3 text-[14px] font-medium text-white transition hover:bg-[#214d8d] focus:outline-none"
                  >
                    <Plus size={17} strokeWidth={2} />
                    Add
                  </button>
                </Link>
              )}

              <button
                type="button"
                onClick={() => setSearchModalVisible(true)}
                className="inline-flex h-[36px] items-center gap-1 rounded-[4px] bg-[#2759A2] px-3 text-[14px] font-medium text-white transition hover:bg-[#214d8d] focus:outline-none"
              >
                <Search size={17} strokeWidth={2} />
                Search
              </button>

              {(activeSearch.keyword || activeSearch.center) && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="inline-flex h-[36px] items-center gap-1 rounded-[4px] bg-[#6c757d] px-3 text-[14px] font-medium text-white transition hover:bg-[#5c636a] focus:outline-none"
                >
                  <RotateCcw size={16} />
                  Reset Search
                </button>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          <div className="px-[17px] pb-[18px] pt-[17px]">
            <div className="mb-4 flex items-center justify-end gap-2">
              <label
                htmlFor="control-room-search"
                className="text-[14px] font-bold text-[#343a40]"
              >
                Search:
              </label>

              <input
                id="control-room-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-[34px] w-full max-w-[240px] rounded-[2px] border border-[#d5dae0] bg-white px-2.5 text-[14px] text-[#212529] outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
              />
            </div>

            <div className="overflow-hidden rounded-[2px] border border-[#e1e4e8]">
              <div className="max-h-[560px] overflow-y-auto overflow-x-hidden">
                <table className="w-full min-w-[900px] table-fixed border-collapse text-[14px]">
                  <colgroup>
                    <col className="w-[22%]" />
                    <col className="w-[48%]" />
                    <col className="w-[16%]" />
                    <col className="w-[14%]" />
                  </colgroup>

                  <thead className="sticky top-0 z-20">
                    <tr>
                      <th
                        onClick={() => handleSort('buildingName')}
                        className="cursor-pointer whitespace-nowrap border-b border-r border-[#e1e4e8] bg-[#f8f9fa] px-2.5 py-3 text-left text-[14px] font-bold tracking-wide text-[#151515] transition hover:bg-[#eef3f9] select-none"
                      >
                        <div className="flex items-center">
                          Building
                          {getSortIcon('buildingName')}
                        </div>
                      </th>

                      <th
                        onClick={() => handleSort('address1')}
                        className="cursor-pointer whitespace-nowrap border-b border-r border-[#e1e4e8] bg-[#f8f9fa] px-2.5 py-3 text-left text-[14px] font-bold tracking-wide text-[#151515] transition hover:bg-[#eef3f9] select-none"
                      >
                        <div className="flex items-center">
                          Address
                          {getSortIcon('address1')}
                        </div>
                      </th>

                      <th
                        onClick={() => handleSort('center.centerName')}
                        className="cursor-pointer whitespace-nowrap border-b border-r border-[#e1e4e8] bg-[#f8f9fa] px-2.5 py-3 text-left text-[14px] font-bold tracking-wide text-[#151515] transition hover:bg-[#eef3f9] select-none"
                      >
                        <div className="flex items-center">
                          Branch
                          {getSortIcon('center.centerName')}
                        </div>
                      </th>

                      <th className="whitespace-nowrap border-b border-[#e1e4e8] bg-[#f8f9fa] px-2.5 py-3 text-left text-[14px] font-bold tracking-wide text-[#151515]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredControlRooms.length > 0 ? (
                      filteredControlRooms.map((building, index) => (
                        <tr
                          key={building._id}
                          className={`border-b border-[#e5e7eb] transition-colors ${
                            index % 2 === 0 ? 'bg-[#f1f1f1]' : 'bg-white'
                          } hover:bg-[#eaf1f8]`}
                        >
                          <td className="border-r border-[#e5e7eb] px-2.5 py-[9px] align-middle text-[14px] leading-[20px] text-[#151515]">
                            <button
                              type="button"
                              onClick={() => handleClick(building._id)}
                              className="cursor-pointer border-none bg-transparent p-0 text-left text-[#2878c8] transition hover:text-[#2759A2] hover:underline"
                            >
                              {building.buildingName}
                            </button>
                          </td>

                          <td className="border-r border-[#e5e7eb] px-2.5 py-[9px] align-middle text-[14px] leading-[20px] text-[#151515]">
                            {building.address1}
                          </td>

                          <td className="border-r border-[#e5e7eb] px-2.5 py-[9px] align-middle text-[14px] leading-[20px] text-[#151515]">
                            {building.center?.centerName || ''}
                          </td>

                          <td className="px-2.5 py-[9px] align-middle">
                            {hasAnyPermission('Settings', [
                              'manage_control_room_own_center',
                              'manage_control_room_all_center',
                            ]) && (
                              <div
                                className="relative inline-block"
                                ref={(element) => {
                                  dropdownRefs.current[building._id] = element;
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleDropdown(building._id)}
                                  className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] border border-[#c8cdd3] bg-white px-2.5 text-[14px] font-medium text-[#3f4650] transition hover:bg-[#f4f5f6] focus:outline-none focus:ring-1 focus:ring-[#2759A2]"
                                >
                                  <Settings size={15} strokeWidth={1.8} />
                                  Options
                                  <ChevronDown size={14} />
                                </button>

                                {dropdownOpen[building._id] && (
                                  <div className="absolute right-0 z-50 mt-1 w-[145px] overflow-hidden rounded-[4px] border border-[#dfe3e8] bg-white py-1 shadow-[0_5px_16px_rgba(0,0,0,0.15)]">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEditBuilding(building._id)
                                      }
                                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[14px] text-[#343a40] transition hover:bg-[#f1f5f9]"
                                    >
                                      <Pencil size={15} />
                                      Edit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteBuilding(building._id)
                                      }
                                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[14px] text-[#dc3545] transition hover:bg-[#fff1f2]"
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
                          className="px-4 py-10 text-center text-[14px] text-[#6b7280]"
                        >
                          No control room found
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
  );
};

export default ControlRoomList;