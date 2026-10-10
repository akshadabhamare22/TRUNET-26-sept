// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import {
//   ArrowDown,
//   ArrowUp,
//   Pencil,
//   Plus,
//   RotateCcw,
//   Search,
//   Settings,
//   Trash2,
// } from "lucide-react";
// import {
//   Link,
//   useNavigate,
// } from "react-router-dom";

// import axiosInstance from "../../../axiosInstance";
// import {
//   confirmDelete,
//   showSuccess,
// } from '../../../utils/sweetAlerts'
// import SearchUserModel from "./SearchUserModel";
// import Pagination from "../../../utils/Pagination";

// const UserList = () => {
//   const [data, setData] =
//     useState([]);

//   const [centers, setCenters] =
//     useState([]);

//   const [roles, setRoles] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState(null);

//   const [sortConfig, setSortConfig] =
//     useState({
//       key: null,
//       direction: "ascending",
//     });

//   const [searchTerm, setSearchTerm] =
//     useState("");

//   const [
//     searchModalVisible,
//     setSearchModalVisible,
//   ] = useState(false);

//   const [activeSearch, setActiveSearch] =
//     useState({
//       keyword: "",
//       center: "",
//     });

//   const [dropdownOpen, setDropdownOpen] =
//     useState({});

//   const [currentPage, setCurrentPage] =
//     useState(1);

//   const [totalPages, setTotalPages] =
//     useState(1);

//   const dropdownRefs =
//     useRef({});

//   const navigate = useNavigate();

//   // --------------------------------------------------
//   // Fetch Users
//   // --------------------------------------------------
//   const fetchData = async (
//     searchParams = {},
//     page = 1,
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params =
//         new URLSearchParams();

//       if (searchParams.keyword) {
//         params.append(
//           "search",
//           searchParams.keyword,
//         );
//       }

//       if (searchParams.center) {
//         params.append(
//           "center",
//           searchParams.center,
//         );
//       }

//       params.append("page", page);

//       const url = params.toString()
//         ? `/auth?${params.toString()}`
//         : "/auth";

//       const response =
//         await axiosInstance.get(url);

//       if (response.data.success) {
//         setData(
//           response.data.data.users ||
//             [],
//         );

//         setCurrentPage(
//           response.data.data
//             .pagination.currentPage,
//         );

//         setTotalPages(
//           response.data.data
//             .pagination.totalPages,
//         );
//       } else {
//         const errorMessage =
//           response.data.message ||
//           "API returned unsuccessful response";

//         setError(errorMessage);

//         console.error(
//           "Backend error:",
//           response.data,
//         );
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage =
//           err.response.data?.message ||
//           err.response.data?.error ||
//           `Error ${err.response.status}: ${err.response.statusText}`;

//         setError(errorMessage);

//         console.error(
//           "Error response:",
//           err.response.data,
//         );
//       } else if (err.request) {
//         setError(
//           "No response received from server. Please check your network connection.",
//         );

//         console.error(
//           "Error request:",
//           err.request,
//         );
//       } else {
//         setError(
//           err.message ||
//             "An error occurred while fetching data",
//         );

//         console.error(
//           "Error message:",
//           err.message,
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Fetch Centers
//   // --------------------------------------------------
//   const fetchCenters = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           "/centers",
//         );

//       if (response.data.success) {
//         setCenters(
//           response.data.data || [],
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching centers:",
//         error,
//       );
//     }
//   };

//   // --------------------------------------------------
//   // Fetch Roles
//   // --------------------------------------------------
//   const fetchRoles = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           "/role",
//         );

//       if (response.data.success) {
//         setRoles(
//           response.data.data || [],
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching roles:",
//         error,
//       );
//     }
//   };

//   // --------------------------------------------------
//   // Initial Load
//   // --------------------------------------------------
//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//     fetchRoles();
//   }, []);

//   // --------------------------------------------------
//   // Pagination
//   // --------------------------------------------------
//   const handlePageChange = (
//     page,
//   ) => {
//     if (
//       page < 1 ||
//       page > totalPages
//     ) {
//       return;
//     }

//     fetchData(
//       activeSearch,
//       page,
//     );
//   };

//   // --------------------------------------------------
//   // Sorting
//   // --------------------------------------------------
//   const handleSort = (key) => {
//     let direction = "ascending";

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction ===
//         "ascending"
//     ) {
//       direction = "descending";
//     }

//     setSortConfig({
//       key,
//       direction,
//     });

//     const sortedData = [...data].sort(
//       (a, b) => {
//         let aValue = a;
//         let bValue = b;

//         if (key.includes(".")) {
//           const keys = key.split(".");

//           aValue = keys.reduce(
//             (obj, currentKey) =>
//               obj &&
//               obj[currentKey],
//             a,
//           );

//           bValue = keys.reduce(
//             (obj, currentKey) =>
//               obj &&
//               obj[currentKey],
//             b,
//           );
//         } else {
//           aValue = a[key];
//           bValue = b[key];
//         }

//         if (aValue < bValue) {
//           return direction ===
//             "ascending"
//             ? -1
//             : 1;
//         }

//         if (aValue > bValue) {
//           return direction ===
//             "ascending"
//             ? 1
//             : -1;
//         }

//         return 0;
//       },
//     );

//     setData(sortedData);
//   };

//   // --------------------------------------------------
//   // Sort Icon
//   // --------------------------------------------------
//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null;
//     }

//     return sortConfig.direction ===
//       "ascending" ? (
//       <ArrowUp size={14} />
//     ) : (
//       <ArrowDown size={14} />
//     );
//   };

//   // --------------------------------------------------
//   // Advanced Search
//   // --------------------------------------------------
//   const handleSearch = (
//     searchData,
//   ) => {
//     setActiveSearch(searchData);
//     fetchData(searchData, 1);
//   };

//   // --------------------------------------------------
//   // Reset Search
//   // --------------------------------------------------
//   const handleResetSearch = () => {
//     setActiveSearch({
//       keyword: "",
//       center: "",
//     });

//     setSearchTerm("");

//     fetchData({}, 1);
//   };

//   // --------------------------------------------------
//   // Local Search
//   // --------------------------------------------------
//   const filteredData = data.filter(
//     (item) => {
//       if (
//         activeSearch.keyword ||
//         activeSearch.center
//       ) {
//         return true;
//       }

//       return Object.values(
//         item,
//       ).some((value) => {
//         if (
//           typeof value ===
//             "object" &&
//           value !== null
//         ) {
//           return Object.values(
//             value,
//           ).some(
//             (nestedValue) =>
//               nestedValue &&
//               nestedValue
//                 .toString()
//                 .toLowerCase()
//                 .includes(
//                   searchTerm.toLowerCase(),
//                 ),
//           );
//         }

//         return (
//           value &&
//           value
//             .toString()
//             .toLowerCase()
//             .includes(
//               searchTerm.toLowerCase(),
//             )
//         );
//       });
//     },
//   );

//   // --------------------------------------------------
//   // Delete User
//   // --------------------------------------------------
//   const handleDeleteUser =
//     async (itemId) => {
//       const result =
//         await confirmDelete();

//       if (!result.isConfirmed) {
//         return;
//       }

//       try {
//         await axiosInstance.delete(
//           `/auth/user/${itemId}`,
//         );

//         setData((prev) =>
//           prev.filter(
//             (user) =>
//               user._id !== itemId,
//           ),
//         );

//         showSuccess(
//           "Data deleted successfully!",
//         );
//       } catch (error) {
//         console.error(
//           "Error deleting user:",
//           error,
//         );
//       }
//     };

//   // --------------------------------------------------
//   // Edit User
//   // --------------------------------------------------
//   const handleEditData = (
//     itemId,
//   ) => {
//     navigate(
//       `/edit-user/${itemId}`,
//     );

//     setDropdownOpen({});
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
//   // Outside Click
//   // --------------------------------------------------
//   useEffect(() => {
//     const handleClickOutside = (
//       event,
//     ) => {
//       const newDropdownState = {};
//       let shouldUpdate = false;

//       Object.keys(
//         dropdownRefs.current,
//       ).forEach((key) => {
//         const dropdown =
//           dropdownRefs.current[key];

//         if (
//           dropdown &&
//           !dropdown.contains(
//             event.target,
//           )
//         ) {
//           newDropdownState[key] =
//             false;

//           shouldUpdate = true;
//         }
//       });

//       if (shouldUpdate) {
//         setDropdownOpen((prev) => ({
//           ...prev,
//           ...newDropdownState,
//         }));
//       }
//     };

//     document.addEventListener(
//       "mousedown",
//       handleClickOutside,
//     );

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside,
//       );
//     };
//   }, []);

//   // --------------------------------------------------
//   // Loading
//   // --------------------------------------------------
//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // Error
//   // --------------------------------------------------
//   if (error) {
//     return (
//       <div
//         className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
//         role="alert"
//       >
//         {error}
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // UI
//   // --------------------------------------------------
//   return (
//     <div className="w-full">
//       {/* Page Title */}
//       <div className="mb-4 text-xl font-semibold text-gray-800">
//         User List
//       </div>

//       {/* Search Modal */}
//       <SearchUserModel
//         visible={
//           searchModalVisible
//         }
//         onClose={() =>
//           setSearchModalVisible(
//             false,
//           )
//         }
//         onSearch={handleSearch}
//         centers={centers}
//         roles={roles}
//         status={[]}
//       />

//       {/* Main Card */}
//       <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
//           {/* Actions */}
//           <div className="flex flex-wrap items-center gap-2">
//             {/* Add */}
//             <Link to="/add-user">
//               <button
//                 type="button"
//                 className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
//               >
//                 <Plus size={15} />
//                 Add
//               </button>
//             </Link>

//             {/* Search */}
//             <button
//               type="button"
//               onClick={() =>
//                 setSearchModalVisible(
//                   true,
//                 )
//               }
//               className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
//             >
//               <Search size={15} />
//               Search
//             </button>

//             {/* Reset */}
//             {(activeSearch.keyword ||
//               activeSearch.center) && (
//               <button
//                 type="button"
//                 onClick={
//                   handleResetSearch
//                 }
//                 className="inline-flex items-center gap-1.5 rounded-md bg-gray-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-700"
//               >
//                 <RotateCcw
//                   size={15}
//                 />
//                 Reset Search
//               </button>
//             )}
//           </div>

//           {/* Pagination */}
//           <div>
//             <Pagination
//               currentPage={
//                 currentPage
//               }
//               totalPages={
//                 totalPages
//               }
//               onPageChange={
//                 handlePageChange
//               }
//             />
//           </div>
//         </div>

//         {/* Card Body */}
//         <div className="p-4">
//           {/* Local Search */}
//           <div className="mb-4 flex justify-end">
//             <div className="flex w-full max-w-sm items-center gap-2">
//               <label
//                 htmlFor="user-search"
//                 className="whitespace-nowrap text-sm font-medium text-gray-700"
//               >
//                 Search:
//               </label>

//               <div className="relative flex-1">
//                 <Search
//                   size={15}
//                   className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
//                 />

//                 <input
//                   id="user-search"
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) =>
//                     setSearchTerm(
//                       e.target.value,
//                     )
//                   }
//                   className="h-[30px] w-full border border-gray-300 bg-white pl-8 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Responsive Table */}
//           <div className="w-full overflow-x-auto">
//             <table className="min-w-[1000px] w-full border-collapse border border-gray-200 text-sm">
//               <thead>
//                 <tr className="bg-gray-50">
//                   {/* Name */}
//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "fullName",
//                       )
//                     }
//                     className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
//                   >
//                     <div className="flex items-center justify-between gap-2">
//                       <span>Name</span>
//                       {getSortIcon(
//                         "fullName",
//                       )}
//                     </div>
//                   </th>

//                   {/* Role */}
//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "role.roleTitle",
//                       )
//                     }
//                     className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
//                   >
//                     <div className="flex items-center justify-between gap-2">
//                       <span>Role</span>
//                       {getSortIcon(
//                         "role.roleTitle",
//                       )}
//                     </div>
//                   </th>

//                   {/* Branch */}
//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "center.centerName",
//                       )
//                     }
//                     className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
//                   >
//                     <div className="flex items-center justify-between gap-2">
//                       <span>
//                         Branch
//                       </span>
//                       {getSortIcon(
//                         "center.centerName",
//                       )}
//                     </div>
//                   </th>

//                   {/* Username */}
//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "username",
//                       )
//                     }
//                     className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
//                   >
//                     <div className="flex items-center justify-between gap-2">
//                       <span>
//                         Username
//                       </span>
//                       {getSortIcon(
//                         "username",
//                       )}
//                     </div>
//                   </th>

//                   {/* Email */}
//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "email",
//                       )
//                     }
//                     className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
//                   >
//                     <div className="flex items-center justify-between gap-2">
//                       <span>
//                         Email
//                       </span>
//                       {getSortIcon(
//                         "email",
//                       )}
//                     </div>
//                   </th>

//                   {/* Mobile */}
//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "mobile",
//                       )
//                     }
//                     className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
//                   >
//                     <div className="flex items-center justify-between gap-2">
//                       <span>
//                         Mobile
//                       </span>
//                       {getSortIcon(
//                         "mobile",
//                       )}
//                     </div>
//                   </th>

//                   {/* Action */}
//                   <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length >
//                 0 ? (
//                   filteredData.map(
//                     (item) => (
//                       <tr
//                         key={
//                           item._id
//                         }
//                         className="align-top hover:bg-gray-50"
//                       >
//                         {/* Name */}
//                         <td className="border border-gray-200 px-3 py-2 text-gray-700">
//                           {
//                             item.fullName
//                           }
//                         </td>

//                         {/* Role */}
//                         <td className="border border-gray-200 px-3 py-2 text-gray-700">
//                           {
//                             item.role
//                               ?.roleTitle ||
//                             ""
//                           }
//                         </td>

//                         {/* Branch */}
//                         <td className="border border-gray-200 px-3 py-2 text-gray-700">
//                           {item.accessibleCenters &&
//                           item
//                             .accessibleCenters
//                             .length >
//                             0 ? (
//                             <div className="space-y-1">
//                               {item.accessibleCenters.map(
//                                 (
//                                   center,
//                                   index,
//                                 ) => (
//                                   <span
//                                     key={
//                                       center._id
//                                     }
//                                   >
//                                     {
//                                       center.centerName
//                                     }

//                                     {index <
//                                       item
//                                         .accessibleCenters
//                                         .length -
//                                         1 &&
//                                       ", "}
//                                   </span>
//                                 ),
//                               )}
//                             </div>
//                           ) : (
//                             item.center
//                               ?.centerName ||
//                             ""
//                           )}
//                         </td>

//                         {/* Username */}
//                         <td className="border border-gray-200 px-3 py-2 text-gray-700">
//                           {
//                             item.username ||
//                             ""
//                           }
//                         </td>

//                         {/* Email */}
//                         <td className="border border-gray-200 px-3 py-2">
//                           {item.email ? (
//                             <a
//                               href={`mailto:${item.email}`}
//                               className="text-blue-600 hover:underline"
//                             >
//                               {
//                                 item.email
//                               }
//                             </a>
//                           ) : (
//                             ""
//                           )}
//                         </td>

//                         {/* Mobile */}
//                         <td className="border border-gray-200 px-3 py-2">
//                           {item.mobile ? (
//                             <a
//                               href={`tel:${item.mobile}`}
//                               className="text-blue-600 hover:underline"
//                             >
//                               {
//                                 item.mobile
//                               }
//                             </a>
//                           ) : (
//                             ""
//                           )}
//                         </td>

//                         {/* Action */}
//                         <td className="border border-gray-200 px-3 py-2">
//                           <div
//                             className="relative inline-block"
//                             ref={(el) => {
//                               dropdownRefs.current[
//                                 item._id
//                               ] = el;
//                             }}
//                           >
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 toggleDropdown(
//                                   item._id,
//                                 )
//                               }
//                               className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
//                             >
//                               <Settings
//                                 size={
//                                   14
//                                 }
//                               />
//                               Options
//                             </button>

//                             {dropdownOpen[
//                               item._id
//                             ] && (
//                               <div className="absolute right-0 z-30 mt-1 min-w-[140px] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
//                                 {/* Edit */}
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleEditData(
//                                       item._id,
//                                     )
//                                   }
//                                   className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
//                                 >
//                                   <Pencil
//                                     size={
//                                       14
//                                     }
//                                   />
//                                   Edit
//                                 </button>

//                                 {/* Delete */}
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleDeleteUser(
//                                       item._id,
//                                     )
//                                   }
//                                   className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
//                                 >
//                                   <Trash2
//                                     size={
//                                       14
//                                     }
//                                   />
//                                   Delete
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ),
//                   )
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={7}
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
//   );
// };

// export default UserList;

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowDown,
  ArrowUp,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Trash2,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axiosInstance from "../../../axiosInstance";

import {
  confirmDelete,
  showSuccess,
} from "../../../utils/sweetAlerts";

import SearchUserModel from "./SearchUserModel";
import Pagination from "../../../utils/Pagination";

const UserList = () => {
  const [data, setData] = useState([]);

  const [centers, setCenters] = useState([]);

  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [
    searchModalVisible,
    setSearchModalVisible,
  ] = useState(false);

  const [activeSearch, setActiveSearch] = useState({
    keyword: "",
    center: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState({});

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const dropdownRefs = useRef({});

  const navigate = useNavigate();

  // --------------------------------------------------
  // Fetch Users
  // --------------------------------------------------
  const fetchData = async (
    searchParams = {},
    page = 1,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchParams.keyword) {
        params.append(
          "search",
          searchParams.keyword,
        );
      }

      if (searchParams.center) {
        params.append(
          "center",
          searchParams.center,
        );
      }

      params.append("page", page);

      const url = params.toString()
        ? `/auth?${params.toString()}`
        : "/auth";

      const response =
        await axiosInstance.get(url);

      if (response.data.success) {
        setData(
          response.data.data.users || [],
        );

        setCurrentPage(
          response.data.data.pagination.currentPage,
        );

        setTotalPages(
          response.data.data.pagination.totalPages,
        );
      } else {
        const errorMessage =
          response.data.message ||
          "API returned unsuccessful response";

        setError(errorMessage);

        console.error(
          "Backend error:",
          response.data,
        );
      }
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Error ${err.response.status}: ${err.response.statusText}`;

        setError(errorMessage);

        console.error(
          "Error response:",
          err.response.data,
        );
      } else if (err.request) {
        setError(
          "No response received from server. Please check your network connection.",
        );

        console.error(
          "Error request:",
          err.request,
        );
      } else {
        setError(
          err.message ||
            "An error occurred while fetching data",
        );

        console.error(
          "Error message:",
          err.message,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Fetch Centers
  // --------------------------------------------------
  const fetchCenters = async () => {
    try {
      const response =
        await axiosInstance.get(
          "/centers",
        );

      if (response.data.success) {
        setCenters(
          response.data.data || [],
        );
      }
    } catch (error) {
      console.error(
        "Error fetching centers:",
        error,
      );
    }
  };

  // --------------------------------------------------
  // Fetch Roles
  // --------------------------------------------------
  const fetchRoles = async () => {
    try {
      const response =
        await axiosInstance.get(
          "/role",
        );

      if (response.data.success) {
        setRoles(
          response.data.data || [],
        );
      }
    } catch (error) {
      console.error(
        "Error fetching roles:",
        error,
      );
    }
  };

  // --------------------------------------------------
  // Initial Load
  // --------------------------------------------------
  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchRoles();
  }, []);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------
  const handlePageChange = (
    page,
  ) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    fetchData(
      activeSearch,
      page,
    );
  };

  // --------------------------------------------------
  // Sorting
  // --------------------------------------------------
  const handleSort = (key) => {
    let direction = "ascending";

    if (
      sortConfig.key === key &&
      sortConfig.direction ===
        "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({
      key,
      direction,
    });

    const sortedData = [...data].sort(
      (a, b) => {
        let aValue = a;
        let bValue = b;

        if (key.includes(".")) {
          const keys = key.split(".");

          aValue = keys.reduce(
            (obj, currentKey) =>
              obj &&
              obj[currentKey],
            a,
          );

          bValue = keys.reduce(
            (obj, currentKey) =>
              obj &&
              obj[currentKey],
            b,
          );
        } else {
          aValue = a[key];
          bValue = b[key];
        }

        if (aValue < bValue) {
          return direction ===
            "ascending"
            ? -1
            : 1;
        }

        if (aValue > bValue) {
          return direction ===
            "ascending"
            ? 1
            : -1;
        }

        return 0;
      },
    );

    setData(sortedData);
  };

  // --------------------------------------------------
  // Sort Icon
  // --------------------------------------------------
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction ===
      "ascending" ? (
      <ArrowUp
        size={14}
        strokeWidth={2}
      />
    ) : (
      <ArrowDown
        size={14}
        strokeWidth={2}
      />
    );
  };

  // --------------------------------------------------
  // Advanced Search
  // --------------------------------------------------
  const handleSearch = (
    searchData,
  ) => {
    setActiveSearch(searchData);
    fetchData(searchData, 1);
  };

  // --------------------------------------------------
  // Reset Search
  // --------------------------------------------------
  const handleResetSearch = () => {
    setActiveSearch({
      keyword: "",
      center: "",
    });

    setSearchTerm("");

    fetchData({}, 1);
  };

  // --------------------------------------------------
  // Local Search
  // --------------------------------------------------
  const filteredData = data.filter(
    (item) => {
      if (
        activeSearch.keyword ||
        activeSearch.center
      ) {
        return true;
      }

      return Object.values(
        item,
      ).some((value) => {
        if (
          typeof value ===
            "object" &&
          value !== null
        ) {
          return Object.values(
            value,
          ).some(
            (nestedValue) =>
              nestedValue &&
              nestedValue
                .toString()
                .toLowerCase()
                .includes(
                  searchTerm.toLowerCase(),
                ),
          );
        }

        return (
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase(),
            )
        );
      });
    },
  );

  // --------------------------------------------------
  // Delete User
  // --------------------------------------------------
  const handleDeleteUser =
    async (itemId) => {
      const result =
        await confirmDelete();

      if (!result.isConfirmed) {
        return;
      }

      try {
        await axiosInstance.delete(
          `/auth/user/${itemId}`,
        );

        setData((prev) =>
          prev.filter(
            (user) =>
              user._id !== itemId,
          ),
        );

        showSuccess(
          "Data deleted successfully!",
        );
      } catch (error) {
        console.error(
          "Error deleting user:",
          error,
        );
      }
    };

  // --------------------------------------------------
  // Edit User
  // --------------------------------------------------
  const handleEditData = (
    itemId,
  ) => {
    navigate(
      `/edit-user/${itemId}`,
    );

    setDropdownOpen({});
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
  // Outside Click
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (
      event,
    ) => {
      const newDropdownState = {};
      let shouldUpdate = false;

      Object.keys(
        dropdownRefs.current,
      ).forEach((key) => {
        const dropdown =
          dropdownRefs.current[key];

        if (
          dropdown &&
          !dropdown.contains(
            event.target,
          )
        ) {
          newDropdownState[key] =
            false;

          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        setDropdownOpen((prev) => ({
          ...prev,
          ...newDropdownState,
        }));
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div
        className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {error}
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

      {/* ==================================================
          PAGE TITLE
      ================================================== */}
      <div className="mb-18px]">
        <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
          User List
        </h1>
      </div>

      {/* ==================================================
          SEARCH MODAL
      ================================================== */}
      <SearchUserModel
        visible={
          searchModalVisible
        }
        onClose={() =>
          setSearchModalVisible(
            false,
          )
        }
        onSearch={handleSearch}
        centers={centers}
        roles={roles}
        status={[]}
      />

      {/* ==================================================
          MAIN CARD
      ================================================== */}
      <div
        className="
          w-full
          overflow-hidden
          border
          border-[#e5e7eb]
          bg-white
          shadow-[0_1px_4px_rgba(0,0,0,0.08)]
        "
      >

        {/* ==================================================
            BLUE TOP BORDER
        ================================================== */}
        <div className="h-[4px] w-full bg-[#2f64ad]" />

        {/* ==================================================
            CARD HEADER
        ================================================== */}
        <div
          className="
            flex
            min-h-[68px]
            flex-col
            justify-between
            gap-3
            border-b
            border-[#e1e5e9]
            bg-white
            px-[17px]
            py-[10px]
            lg:flex-row
            lg:items-center
          "
        >

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-[5px]">

            {/* ADD */}
            <Link to="/add-user">
              <button
                type="button"
                className="
                  inline-flex
                  h-[36px]
                  items-center
                  gap-[4px]
                  rounded-[4px]
                  bg-[#2f64ad]
                  px-[10px]
                  text-[15px]
                  font-semibold
                  text-white
                  shadow-none
                  transition
                  duration-150
                  hover:bg-[#245494]
                  focus:outline-none
                "
              >
                <Plus
                  size={17}
                  strokeWidth={2}
                />

                <span>
                  Add
                </span>
              </button>
            </Link>

            {/* SEARCH */}
            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(
                  true,
                )
              }
              className="
                inline-flex
                h-[36px]
                items-center
                gap-[4px]
                rounded-[4px]
                bg-[#2f64ad]
                px-[10px]
                text-[15px]
                font-semibold
                text-white
                shadow-none
                transition
                duration-150
                hover:bg-[#245494]
                focus:outline-none
              "
            >
              <Search
                size={16}
                strokeWidth={2}
              />

              <span>
                Search
              </span>
            </button>

            {/* RESET */}
            {(activeSearch.keyword ||
              activeSearch.center) && (
              <button
                type="button"
                onClick={
                  handleResetSearch
                }
                className="
                  inline-flex
                  h-[36px]
                  items-center
                  gap-[5px]
                  rounded-[4px]
                  bg-[#6c757d]
                  px-[10px]
                  text-[14px]
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#5c636a]
                  focus:outline-none
                "
              >
                <RotateCcw
                  size={15}
                />

                <span>
                  Reset Search
                </span>
              </button>
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex items-center">
            <Pagination
              currentPage={
                currentPage
              }
              totalPages={
                totalPages
              }
              onPageChange={
                handlePageChange
              }
            />
          </div>
        </div>

        {/* ==================================================
            CARD BODY
        ================================================== */}
        <div className="bg-white px-[17px] pb-[17px] pt-[16px]">

          {/* ==================================================
              LOCAL SEARCH
          ================================================== */}
          <div className="mb-[17px] flex justify-end">
            <div className="flex items-center gap-[5px]">

              <label
                htmlFor="user-search"
                className="
                  whitespace-nowrap
                  text-[14px]
                  font-semibold
                  text-[#111827]
                "
              >
                Search:
              </label>

              <div className="relative">
                <Search
                  size={14}
                  strokeWidth={1.8}
                  className="
                    pointer-events-none
                    absolute
                    left-[9px]
                    top-1/2
                    -translate-y-1/2
                    text-[#9ca3af]
                  "
                />

                <input
                  id="user-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value,
                    )
                  }
                  className="
                    h-[33px]
                    w-[237px]
                    border
                    border-[#d9dee3]
                    bg-white
                    pl-[29px]
                    pr-[9px]
                    text-[14px]
                    text-[#212529]
                    outline-none
                    transition
                    focus:border-[#2f64ad]
                    focus:ring-1
                    focus:ring-[#2f64ad]/20
                  "
                />
              </div>
            </div>
          </div>

          {/* ==================================================
              TABLE
              ONLY VERTICAL SCROLL
          ================================================== */}
          <div
            className="
              w-full
              overflow-x-hidden
              overflow-y-auto
              border
              border-[#e5e7eb]
            "
            style={{
              maxHeight: "500px",
              scrollbarWidth: "thin",
            }}
          >
            <table
              className="
                w-full
                table-fixed
                border-collapse
                text-[16px]
              "
            >
              {/* ==================================================
                  TABLE HEADER
              ================================================== */}
              <thead>
                <tr className="bg-[#ffffff]">

                  {/* NAME */}
                  <th
                    onClick={() =>
                      handleSort(
                        "fullName",
                      )
                    }
                    className="
                      sticky
                      top-0
                      z-20
                      w-[14%]
                      cursor-pointer
                      border
                      border-[#e5e7eb]
                      bg-white
                      px-[9px]
                      py-[10px]
                      text-left
                      text-[16px]
                      font-bold
                      leading-[20px]
                      text-[#111111]
                      hover:bg-[#f8f9fa]
                    "
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        Name
                      </span>

                      {getSortIcon(
                        "fullName",
                      )}
                    </div>
                  </th>

                  {/* ROLE */}
                  <th
                    onClick={() =>
                      handleSort(
                        "role.roleTitle",
                      )
                    }
                    className="
                      sticky
                      top-0
                      z-20
                      w-[8%]
                      cursor-pointer
                      border
                      border-[#e5e7eb]
                      bg-white
                      px-[9px]
                      py-[10px]
                      text-left
                      text-[16px]
                      font-bold
                      leading-[20px]
                      text-[#111111]
                      hover:bg-[#f8f9fa]
                    "
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        Role
                      </span>

                      {getSortIcon(
                        "role.roleTitle",
                      )}
                    </div>
                  </th>

                  {/* BRANCH */}
                  <th
                    onClick={() =>
                      handleSort(
                        "center.centerName",
                      )
                    }
                    className="
                      sticky
                      top-0
                      z-20
                      w-[21%]
                      cursor-pointer
                      border
                      border-[#e5e7eb]
                      bg-white
                      px-[9px]
                      py-[10px]
                      text-left
                      text-[16px]
                      font-bold
                      leading-[20px]
                      text-[#111111]
                      hover:bg-[#f8f9fa]
                    "
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        Branch
                      </span>

                      {getSortIcon(
                        "center.centerName",
                      )}
                    </div>
                  </th>

                  {/* USERNAME */}
                  <th
                    onClick={() =>
                      handleSort(
                        "username",
                      )
                    }
                    className="
                      sticky
                      top-0
                      z-20
                      w-[11%]
                      cursor-pointer
                      border
                      border-[#e5e7eb]
                      bg-white
                      px-[9px]
                      py-[10px]
                      text-left
                      text-[16px]
                      font-bold
                      leading-[20px]
                      text-[#111111]
                      hover:bg-[#f8f9fa]
                    "
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        Username
                      </span>

                      {getSortIcon(
                        "username",
                      )}
                    </div>
                  </th>

                  {/* EMAIL */}
                  <th
                    onClick={() =>
                      handleSort(
                        "email",
                      )
                    }
                    className="
                      sticky
                      top-0
                      z-20
                      w-[18%]
                      cursor-pointer
                      border
                      border-[#e5e7eb]
                      bg-white
                      px-[9px]
                      py-[10px]
                      text-left
                      text-[16px]
                      font-bold
                      leading-[20px]
                      text-[#111111]
                      hover:bg-[#f8f9fa]
                    "
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        Email
                      </span>

                      {getSortIcon(
                        "email",
                      )}
                    </div>
                  </th>

                  {/* MOBILE */}
                  <th
                    onClick={() =>
                      handleSort(
                        "mobile",
                      )
                    }
                    className="
                      sticky
                      top-0
                      z-20
                      w-[12%]
                      cursor-pointer
                      border
                      border-[#e5e7eb]
                      bg-white
                      px-[9px]
                      py-[10px]
                      text-left
                      text-[16px]
                      font-bold
                      leading-[20px]
                      text-[#111111]
                      hover:bg-[#f8f9fa]
                    "
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        Mobile
                      </span>

                      {getSortIcon(
                        "mobile",
                      )}
                    </div>
                  </th>

                  {/* ACTION */}
                  <th
                    className="
                      sticky
                      top-0
                      z-20
                      w-[11%]
                      border
                      border-[#e5e7eb]
                      bg-white
                      px-[9px]
                      py-[10px]
                      text-left
                      text-[16px]
                      font-bold
                      leading-[20px]
                      text-[#111111]
                    "
                  >
                    Action
                  </th>
                </tr>
              </thead>

              {/* ==================================================
                  TABLE BODY
              ================================================== */}
              <tbody>
                {filteredData.length >
                0 ? (
                  filteredData.map(
                    (
                      item,
                      index,
                    ) => (
                      <tr
                        key={
                          item._id
                        }
                        className={`
                          align-top
                          transition-colors
                          ${
                            index %
                              2 ===
                            0
                              ? "bg-[#f1f1f1]"
                              : "bg-white"
                          }
                          hover:bg-[#e9edf2]
                        `}
                      >

                        {/* NAME */}
                        <td
                          className="
                            border
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            text-[16px]
                            leading-[22px]
                            text-[#111111]
                            break-words
                          "
                        >
                          {item.fullName}
                        </td>

                        {/* ROLE */}
                        <td
                          className="
                            border
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            text-[16px]
                            leading-[22px]
                            text-[#111111]
                            break-words
                          "
                        >
                          {
                            item.role
                              ?.roleTitle ||
                            ""
                          }
                        </td>

                        {/* BRANCH */}
                        <td
                          className="
                            border
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            text-[16px]
                            leading-[22px]
                            text-[#111111]
                            break-words
                          "
                        >
                          {item.accessibleCenters &&
                          item
                            .accessibleCenters
                            .length >
                            0 ? (
                            <div className="break-words">
                              {item.accessibleCenters.map(
                                (
                                  center,
                                  centerIndex,
                                ) => (
                                  <span
                                    key={
                                      center._id
                                    }
                                  >
                                    {
                                      center.centerName
                                    }

                                    {centerIndex <
                                      item
                                        .accessibleCenters
                                        .length -
                                        1 &&
                                      ", "}
                                  </span>
                                ),
                              )}
                            </div>
                          ) : (
                            item.center
                              ?.centerName ||
                            ""
                          )}
                        </td>

                        {/* USERNAME */}
                        <td
                          className="
                            border
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            text-[16px]
                            leading-[22px]
                            text-[#111111]
                            break-words
                          "
                        >
                          {item.username ||
                            ""}
                        </td>

                        {/* EMAIL */}
                        <td
                          className="
                            border
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            text-[16px]
                            leading-[22px]
                            break-words
                          "
                        >
                          {item.email ? (
                            <a
                              href={`mailto:${item.email}`}
                              className="
                                break-words
                                text-[#2877c7]
                                no-underline
                                hover:underline
                              "
                            >
                              {
                                item.email
                              }
                            </a>
                          ) : (
                            ""
                          )}
                        </td>

                        {/* MOBILE */}
                        <td
                          className="
                            border
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            text-[16px]
                            leading-[22px]
                            break-words
                          "
                        >
                          {item.mobile ? (
                            <a
                              href={`tel:${item.mobile}`}
                              className="
                                text-[#2877c7]
                                no-underline
                                hover:underline
                              "
                            >
                              {
                                item.mobile
                              }
                            </a>
                          ) : (
                            ""
                          )}
                        </td>

                        {/* ACTION */}
                        <td
                          className="
                            border
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                          "
                        >
                          <div
                            className="relative inline-block"
                            ref={(el) => {
                              dropdownRefs.current[
                                item._id
                              ] = el;
                            }}
                          >

                            {/* OPTIONS BUTTON */}
                            <button
                              type="button"
                              onClick={() =>
                                toggleDropdown(
                                  item._id,
                                )
                              }
                              className="
                                inline-flex
                                h-[35px]
                                items-center
                                gap-[5px]
                                whitespace-nowrap
                                rounded-[5px]
                                border
                                border-[#bfc4c9]
                                bg-[#ffffff]
                                px-[9px]
                                text-[14px]
                                font-normal
                                text-[#374151]
                                shadow-none
                                transition
                                hover:bg-[#f4f5f6]
                                focus:outline-none
                              "
                            >
                              <Settings
                                size={15}
                                strokeWidth={1.8}
                              />

                              <span>
                                Options
                              </span>
                            </button>

                            {/* DROPDOWN */}
                            {dropdownOpen[
                              item._id
                            ] && (
                              <div
                                className="
                                  absolute
                                  right-0
                                  z-50
                                  mt-[4px]
                                  min-w-[145px]
                                  overflow-hidden
                                  rounded-[5px]
                                  border
                                  border-[#d9dde1]
                                  bg-white
                                  py-[4px]
                                  shadow-[0_5px_15px_rgba(0,0,0,0.15)]
                                "
                              >

                                {/* EDIT */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditData(
                                      item._id,
                                    )
                                  }
                                  className="
                                    flex
                                    w-full
                                    items-center
                                    gap-[8px]
                                    px-[12px]
                                    py-[8px]
                                    text-left
                                    text-[14px]
                                    text-[#374151]
                                    transition
                                    hover:bg-[#f3f4f6]
                                  "
                                >
                                  <Pencil
                                    size={14}
                                  />

                                  <span>
                                    Edit
                                  </span>
                                </button>

                                {/* DELETE */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteUser(
                                      item._id,
                                    )
                                  }
                                  className="
                                    flex
                                    w-full
                                    items-center
                                    gap-[8px]
                                    px-[12px]
                                    py-[8px]
                                    text-left
                                    text-[14px]
                                    text-red-600
                                    transition
                                    hover:bg-red-50
                                  "
                                >
                                  <Trash2
                                    size={14}
                                  />

                                  <span>
                                    Delete
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="
                        border
                        border-[#e5e7eb]
                        bg-[#f3f3f3]
                        px-4
                        py-[25px]
                        text-center
                        text-[16px]
                        text-[#333]
                      "
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
  );
};

export default UserList;