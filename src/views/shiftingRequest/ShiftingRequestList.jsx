// import React, { useEffect, useRef, useState } from "react";
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   MoreVertical,
//   Pencil,
//   Plus,
//   RotateCcw,
//   Search,
//   Settings,
//   Trash2,
//   X,
//   Check,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";

// import axiosInstance from "../../axiosInstance";import SearchShiftingModel from "./SearchShiftingModel";
// import { formatDate, formatDateTime } from "../../utils/FormatDateTime";
// import { confirmDelete, showSuccess, showError } from "../../utils/sweetAlerts";
// import Pagination from "../../utils/Pagination";
// import usePermission from "../../utils/usePermission";

// const ShiftinRequestList = () => {
//   const [buildings, setBuildings] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [alert, setAlert] = useState({
//     visible: false,
//     type: "",
//     message: "",
//   });

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchModalVisible, setSearchModalVisible] = useState(false);

//   const [activeSearch, setActiveSearch] = useState({
//     keyword: "",
//     center: "",
//   });

//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const dropdownRefs = useRef({});

//   const navigate = useNavigate();

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};

//   const userCenter =
//     loggedInUser.center?._id ||
//     loggedInUser.center ||
//     loggedInUser.centerId ||
//     loggedInUser.centerID ||
//     null;

//   const { hasAnyPermission } = usePermission();

//   // --------------------------------------------------
//   // Fetch Shifting Requests
//   // --------------------------------------------------
//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();

//       if (searchParams.keyword) {
//         params.append("search", searchParams.keyword);
//       }

//       if (searchParams.center) {
//         params.append("center", searchParams.center);
//       }

//       params.append("page", page);

//       const url = params.toString()
//         ? `/shiftingRequest?${params.toString()}`
//         : "/shiftingRequest";

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         setBuildings(response.data.data);
//         setCurrentPage(response.data.pagination.currentPage);
//         setTotalPages(response.data.pagination.totalPages);
//       } else {
//         const errorMessage =
//           response.data.message ||
//           "API returned unsuccessful response";

//         setError(errorMessage);
//         console.error("Backend error:", response.data);
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage =
//           err.response.data?.message ||
//           err.response.data?.error ||
//           `Error ${err.response.status}: ${err.response.statusText}`;

//         setError(errorMessage);
//         console.error("Error response:", err.response.data);
//       } else if (err.request) {
//         setError(
//           "No response received from server. Please check your network connection."
//         );
//         console.error("Error request:", err.request);
//       } else {
//         setError(
//           err.message || "An error occurred while fetching data"
//         );
//         console.error("Error message:", err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Fetch Data For Export
//   // --------------------------------------------------
//   const fetchDataForExport = async () => {
//     try {
//       setLoading(true);

//       const params = new URLSearchParams();

//       if (activeSearch.keyword) {
//         params.append("search", activeSearch.keyword);
//       }

//       if (activeSearch.center) {
//         params.append("center", activeSearch.center);
//       }

//       const url = params.toString()
//         ? `/shiftingRequest?${params.toString()}`
//         : "/shiftingRequest";

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         return response.data.data;
//       }

//       throw new Error("API returned unsuccessful response");
//     } catch (err) {
//       console.error("Error fetching data for export:", err);
//       showError("Error fetching data for export");
//       return [];
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
//         "/centers?centerType=Center"
//       );

//       if (response.data.success) {
//         setCenters(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching centers:", error);
//     }
//   };

//   // --------------------------------------------------
//   // Initial Load
//   // --------------------------------------------------
//   useEffect(() => {
//     fetchCenters();
//     fetchData();
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
//     let direction = "ascending";

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction === "ascending"
//     ) {
//       direction = "descending";
//     }

//     setSortConfig({
//       key,
//       direction,
//     });

//     const sortedBuildings = [...buildings].sort((a, b) => {
//       let aValue = a;
//       let bValue = b;

//       if (key.includes(".")) {
//         const keys = key.split(".");

//         aValue = keys.reduce(
//           (obj, k) => obj && obj[k],
//           a
//         );

//         bValue = keys.reduce(
//           (obj, k) => obj && obj[k],
//           b
//         );
//       } else {
//         aValue = a[key];
//         bValue = b[key];
//       }

//       if (aValue < bValue) {
//         return direction === "ascending" ? -1 : 1;
//       }

//       if (aValue > bValue) {
//         return direction === "ascending" ? 1 : -1;
//       }

//       return 0;
//     });

//     setBuildings(sortedBuildings);
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return null;

//     return sortConfig.direction === "ascending" ? (
//       <ArrowUp size={14} className="ml-1 inline-block" />
//     ) : (
//       <ArrowDown size={14} className="ml-1 inline-block" />
//     );
//   };

//   // --------------------------------------------------
//   // Search
//   // --------------------------------------------------
//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData);
//     setSearchTerm("");
//     fetchData(searchData, 1);
//   };

//   const handleResetSearch = () => {
//     const resetData = {
//       keyword: "",
//       center: "",
//     };

//     setActiveSearch(resetData);
//     setSearchTerm("");

//     fetchData({}, 1);
//   };

//   // --------------------------------------------------
//   // Frontend Search
//   // --------------------------------------------------
//   const filteredBuildings = buildings.filter((building) =>
//     Object.values(building).some((value) => {
//       if (typeof value === "object" && value !== null) {
//         return Object.values(value).some(
//           (nestedValue) =>
//             nestedValue &&
//             nestedValue
//               .toString()
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase())
//         );
//       }

//       return (
//         value &&
//         value
//           .toString()
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     })
//   );

//   // --------------------------------------------------
//   // Dropdown
//   // --------------------------------------------------
//   const toggleDropdown = (id) => {
//     setDropdownOpen((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const newDropdownState = {};
//       let shouldUpdate = false;

//       Object.keys(dropdownRefs.current).forEach((key) => {
//         const dropdownElement = dropdownRefs.current[key];

//         if (
//           dropdownElement &&
//           !dropdownElement.contains(event.target)
//         ) {
//           newDropdownState[key] = false;
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
//       handleClickOutside
//     );

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside
//       );
//     };
//   }, []);

//   // --------------------------------------------------
//   // Approve / Reject
//   // --------------------------------------------------
//   const handleStatusChange = async (id, status) => {
//     try {
//       const response = await axiosInstance.put(
//         `/shiftingRequest/${id}/status`,
//         { status }
//       );

//       if (response.data.success) {
//         setAlert({
//           visible: true,
//           type: "success",
//           message: `Request ${
//             status === "Approve" ? "approved" : "rejected"
//           } successfully.`,
//         });

//         fetchData(activeSearch, currentPage);
//       } else {
//         throw new Error(
//           response.data.message ||
//             "Failed to update status"
//         );
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);

//       setAlert({
//         visible: true,
//         type: "danger",
//         message:
//           err.response?.data?.message ||
//           "Error updating status",
//       });
//     } finally {
//       setTimeout(() => {
//         setAlert({
//           visible: false,
//           type: "",
//           message: "",
//         });
//       }, 3000);
//     }
//   };

//   // --------------------------------------------------
//   // CSV Export
//   // --------------------------------------------------
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);

//       const allData = await fetchDataForExport();

//       if (!allData || allData.length === 0) {
//         showError("No data available for export");
//         return;
//       }

//       const headers = [
//         "User",
//         "From Center",
//         "To Center",
//         "Remark",
//         "Status",
//         "Status Detail",
//         "Date",
//         "Created At",
//       ];

//       const csvData = allData.map((building) => [
//         building.customer?.name || "N/A",
//         building.fromCenter?.centerName || "N/A",
//         building.toCenter?.centerName || "N/A",
//         building.remark || "",
//         building.status || "N/A",
//         building.status === "Approve" &&
//         building.approvedBy
//           ? `Approve At ${formatDate(
//               building.approvedAt
//             )} by ${building.approvedBy.fullName}`
//           : building.status === "Reject" &&
//             building.rejectedBy
//           ? `Rejecte At ${formatDate(
//               building.rejectedAt
//             )} by ${building.rejectedBy.fullName}`
//           : "Pending",
//         formatDate(building.date),
//         formatDateTime(building.createdAt),
//       ]);

//       const csvContent = [
//         headers.join(","),
//         ...csvData.map((row) =>
//           row
//             .map((field) => {
//               const stringField = String(field || "");

//               return `"${stringField.replace(
//                 /"/g,
//                 '""'
//               )}"`;
//             })
//             .join(",")
//         ),
//       ].join("\n");

//       const blob = new Blob(
//         ["\uFEFF" + csvContent],
//         {
//           type: "text/csv;charset=utf-8;",
//         }
//       );

//       const link = document.createElement("a");
//       const url = URL.createObjectURL(blob);

//       link.setAttribute("href", url);

//       let filename = `shifting_requests_${
//         new Date().toISOString().split("T")[0]
//       }`;

//       if (activeSearch.keyword) {
//         filename += `_search_${activeSearch.keyword}`;
//       }

//       if (activeSearch.center) {
//         const centerName =
//           centers.find(
//             (c) => c._id === activeSearch.center
//           )?.centerName || "center";

//         filename += `_${centerName}`;
//       }

//       filename += ".csv";

//       link.setAttribute("download", filename);
//       link.style.visibility = "hidden";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       URL.revokeObjectURL(url);

//       showSuccess("CSV export completed successfully!");
//     } catch (error) {
//       console.error(
//         "Error generating export:",
//         error
//       );

//       showError("Error generating export file");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Permissions
//   // --------------------------------------------------
//   const canEditDelete = (building) => {
//     const fromCenterId =
//       building.fromCenter?._id ||
//       building.fromCenter ||
//       null;

//     return (
//       userCenter &&
//       String(fromCenterId) === String(userCenter)
//     );
//   };

//   const canApproveReject = (building) => {
//     const toCenterId =
//       building.toCenter?._id ||
//       building.toCenter ||
//       null;

//     return (
//       userCenter &&
//       String(toCenterId) === String(userCenter)
//     );
//   };

//   const shouldShowActions = (building) => {
//     return (
//       building.status === "Pending" &&
//       (canEditDelete(building) ||
//         canApproveReject(building))
//     );
//   };

//   // --------------------------------------------------
//   // Delete
//   // --------------------------------------------------
//   const handleDelete = async (itemId) => {
//     const result = await confirmDelete();

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(
//           `/shiftingRequest/${itemId}`
//         );

//         setBuildings((prev) =>
//           prev.filter((item) => item._id !== itemId)
//         );

//         showSuccess("Data deleted successfully!");
//       } catch (error) {
//         console.error(
//           "Error deleting data:",
//           error
//         );
//       }
//     }
//   };

//   // --------------------------------------------------
//   // Edit
//   // --------------------------------------------------
//   const handleEdit = (itemId) => {
//     navigate(`/edit-shiftingRequest/${itemId}`);
//   };

//   const hasActiveFilters =
//     activeSearch.keyword ||
//     activeSearch.center;

//   // --------------------------------------------------
//   // Loading
//   // --------------------------------------------------
//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // Error
//   // --------------------------------------------------
//   if (error) {
//     return (
//       <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         <p>{error}</p>

//         <p className="mt-1 text-xs text-red-600">
//           Please check your permissions or contact
//           administrator.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {/* Page Title */}
//       <div className="mb-4">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           Shifting Request List
//         </h1>
//       </div>

//       {/* Alert */}
//       {alert.visible && (
//         <div
//           className={`mb-4 flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
//             alert.type === "success"
//               ? "border-green-200 bg-green-50 text-green-700"
//               : "border-red-200 bg-red-50 text-red-700"
//           }`}
//         >
//           <span>{alert.message}</span>

//           <button
//             type="button"
//             onClick={() =>
//               setAlert({
//                 visible: false,
//                 type: "",
//                 message: "",
//               })
//             }
//             className="ml-4 rounded p-1 hover:bg-black/5"
//           >
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* Search Modal */}
//       <SearchShiftingModel
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         centers={centers}
//       />

//       {/* Main Card */}
//       <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             {hasAnyPermission("Shifting", [
//               "manage_shifting_all_center",
//               "manage_shifting_own_center",
//             ]) && (
//               <Link to="/add-shiftingRequest">
//                 <button
//                   type="button"
//                   className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                 >
//                   <Plus size={16} />
//                   Add
//                 </button>
//               </Link>
//             )}

//             <button
//               type="button"
//               onClick={() =>
//                 setSearchModalVisible(true)
//               }
//               className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//             >
//               <Search size={16} />
//               Search
//             </button>

//             {hasActiveFilters && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//               >
//                 <RotateCcw size={16} />
//                 Reset Search
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={generateDetailExport}
//               disabled={loading}
//               className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Download size={16} />
//               Detail Export
//             </button>
//           </div>

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>

//         {/* Card Body */}
//         <div className="p-4">
//           {/* Local Search */}
//           <div className="mb-4 flex justify-end">
//             <div className="flex w-full items-center gap-2 sm:w-auto">
//               <label
//                 htmlFor="shifting-search"
//                 className="whitespace-nowrap text-sm font-medium text-gray-700"
//               >
//                 Search:
//               </label>

//               <div className="relative w-full sm:w-[350px]">
//                 <Search
//                   size={16}
//                   className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />

//                 <input
//                   id="shifting-search"
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) =>
//                     setSearchTerm(e.target.value)
//                   }
//                   disabled={Boolean(hasActiveFilters)}
//                   className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto rounded-lg border border-gray-200">
//             <table className="min-w-[1100px] w-full border-collapse text-sm">
//               <thead>
//                 <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
//                   <th className="border-b border-gray-200 px-4 py-3">
//                     User
//                   </th>

//                   <th
//                     className="cursor-pointer border-b border-gray-200 px-4 py-3 hover:bg-gray-100"
//                     onClick={() =>
//                       handleSort("fromCenter.centerName")
//                     }
//                   >
//                     From Branch
//                     {getSortIcon(
//                       "fromCenter.centerName"
//                     )}
//                   </th>

//                   <th
//                     className="cursor-pointer border-b border-gray-200 px-4 py-3 hover:bg-gray-100"
//                     onClick={() =>
//                       handleSort("toCenter.centerName")
//                     }
//                   >
//                     To Branch
//                     {getSortIcon(
//                       "toCenter.centerName"
//                     )}
//                   </th>

//                   <th className="border-b border-gray-200 px-4 py-3">
//                     Remark
//                   </th>

//                   <th className="border-b border-gray-200 px-4 py-3">
//                     Status
//                   </th>

//                   <th className="border-b border-gray-200 px-4 py-3">
//                     Status Detail
//                   </th>

//                   <th
//                     className="cursor-pointer border-b border-gray-200 px-4 py-3 hover:bg-gray-100"
//                     onClick={() =>
//                       handleSort("date")
//                     }
//                   >
//                     Date
//                     {getSortIcon("date")}
//                   </th>

//                   <th className="border-b border-gray-200 px-4 py-3">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredBuildings.length > 0 ? (
//                   filteredBuildings.map((building) => (
//                     <tr
//                       key={building._id}
//                       className={`transition hover:bg-gray-50 ${
//                         building.status === "Pending"
//                           ? "bg-yellow-50/50"
//                           : ""
//                       }`}
//                     >
//                       {/* User */}
//                       <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
//                         {building.customer?.name || "N/A"}
//                       </td>

//                       {/* From Branch */}
//                       <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
//                         {building.fromCenter
//                           ?.centerName || "N/A"}
//                       </td>

//                       {/* To Branch */}
//                       <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
//                         {building.toCenter
//                           ?.centerName || "N/A"}
//                       </td>

//                       {/* Remark */}
//                       <td className="max-w-[250px] border-b border-gray-100 px-4 py-3 text-gray-700">
//                         <span
//                           className="block truncate"
//                           title={building.remark || ""}
//                         >
//                           {building.remark || "-"}
//                         </span>
//                       </td>

//                       {/* Status */}
//                       <td className="border-b border-gray-100 px-4 py-3">
//                         {building.status && (
//                           <span
//                             className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                               building.status ===
//                               "Pending"
//                                 ? "bg-yellow-100 text-yellow-700"
//                                 : building.status ===
//                                   "Approve"
//                                 ? "bg-green-100 text-green-700"
//                                 : building.status ===
//                                   "Reject"
//                                 ? "bg-red-100 text-red-700"
//                                 : "bg-gray-100 text-gray-700"
//                             }`}
//                           >
//                             {building.status}
//                           </span>
//                         )}
//                       </td>

//                       {/* Status Detail */}
//                       <td className="max-w-[280px] border-b border-gray-100 px-4 py-3 text-gray-600">
//                         {building.status ===
//                           "Approve" &&
//                         building.approvedBy
//                           ? `Approve At ${formatDate(
//                               building.approvedAt
//                             )} by ${
//                               building.approvedBy
//                                 .fullName
//                             }`
//                           : building.status ===
//                               "Reject" &&
//                             building.rejectedBy
//                           ? `Rejecte At ${formatDate(
//                               building.rejectedAt
//                             )} by ${
//                               building.rejectedBy
//                                 .fullName
//                             }`
//                           : "-"}
//                       </td>

//                       {/* Date */}
//                       <td className="border-b border-gray-100 px-4 py-3 whitespace-nowrap text-gray-700">
//                         {formatDate(building.date)}
//                       </td>

//                       {/* Actions */}
//                       <td className="border-b border-gray-100 px-4 py-3">
//                         {shouldShowActions(building) && (
//                           <div
//                             className="relative"
//                             ref={(el) => {
//                               dropdownRefs.current[
//                                 building._id
//                               ] = el;
//                             }}
//                           >
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 toggleDropdown(
//                                   building._id
//                                 )
//                               }
//                               className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
//                             >
//                               <Settings size={14} />
//                               Options
//                               <MoreVertical
//                                 size={13}
//                               />
//                             </button>

//                             {dropdownOpen[
//                               building._id
//                             ] && (
//                               <div className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
//                                 {canEditDelete(
//                                   building
//                                 ) && (
//                                   <>
//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         handleEdit(
//                                           building._id
//                                         )
//                                       }
//                                       className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
//                                     >
//                                       <Pencil
//                                         size={15}
//                                       />
//                                       Edit
//                                     </button>

//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         handleDelete(
//                                           building._id
//                                         )
//                                       }
//                                       className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
//                                     >
//                                       <Trash2
//                                         size={15}
//                                       />
//                                       Delete
//                                     </button>
//                                   </>
//                                 )}

//                                 {canApproveReject(
//                                   building
//                                 ) && (
//                                   <>
//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         handleStatusChange(
//                                           building._id,
//                                           "Approve"
//                                         )
//                                       }
//                                       className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50"
//                                     >
//                                       <Check
//                                         size={15}
//                                       />
//                                       Approve
//                                     </button>

//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         handleStatusChange(
//                                           building._id,
//                                           "Reject"
//                                         )
//                                       }
//                                       className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
//                                     >
//                                       <X size={15} />
//                                       Reject
//                                     </button>
//                                   </>
//                                 )}
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
//                       No shifting requests found
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

// export default ShiftinRequestList;

// import React, { useEffect, useRef, useState } from "react";
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   MoreVertical,
//   Pencil,
//   Plus,
//   RotateCcw,
//   Search,
//   Settings,
//   Trash2,
//   X,
//   Check,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";

// import axiosInstance from "../../axiosInstance";import SearchShiftingModel from "./SearchShiftingModel";
// import { formatDate, formatDateTime } from "../../utils/FormatDateTime";
// import { confirmDelete, showSuccess, showError } from "../../utils/sweetAlerts";
// import Pagination from "../../utils/Pagination";
// import usePermission from "../../utils/usePermission";

// const ShiftinRequestList = () => {
//   const [buildings, setBuildings] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [alert, setAlert] = useState({
//     visible: false,
//     type: "",
//     message: "",
//   });

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchModalVisible, setSearchModalVisible] = useState(false);

//   const [activeSearch, setActiveSearch] = useState({
//     keyword: "",
//     center: "",
//   });

//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const dropdownRefs = useRef({});

//   const navigate = useNavigate();

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};

//   const userCenter =
//     loggedInUser.center?._id ||
//     loggedInUser.center ||
//     loggedInUser.centerId ||
//     loggedInUser.centerID ||
//     null;

//   const { hasAnyPermission } = usePermission();

//   // --------------------------------------------------
//   // Fetch Shifting Requests
//   // --------------------------------------------------
//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();

//       if (searchParams.keyword) {
//         params.append("search", searchParams.keyword);
//       }

//       if (searchParams.center) {
//         params.append("center", searchParams.center);
//       }

//       params.append("page", page);

//       const url = params.toString()
//         ? `/shiftingRequest?${params.toString()}`
//         : "/shiftingRequest";

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         setBuildings(response.data.data);
//         setCurrentPage(response.data.pagination.currentPage);
//         setTotalPages(response.data.pagination.totalPages);
//       } else {
//         const errorMessage =
//           response.data.message ||
//           "API returned unsuccessful response";

//         setError(errorMessage);
//         console.error("Backend error:", response.data);
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage =
//           err.response.data?.message ||
//           err.response.data?.error ||
//           `Error ${err.response.status}: ${err.response.statusText}`;

//         setError(errorMessage);
//         console.error("Error response:", err.response.data);
//       } else if (err.request) {
//         setError(
//           "No response received from server. Please check your network connection."
//         );
//         console.error("Error request:", err.request);
//       } else {
//         setError(
//           err.message || "An error occurred while fetching data"
//         );
//         console.error("Error message:", err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Fetch Data For Export
//   // --------------------------------------------------
//   const fetchDataForExport = async () => {
//     try {
//       setLoading(true);

//       const params = new URLSearchParams();

//       if (activeSearch.keyword) {
//         params.append("search", activeSearch.keyword);
//       }

//       if (activeSearch.center) {
//         params.append("center", activeSearch.center);
//       }

//       const url = params.toString()
//         ? `/shiftingRequest?${params.toString()}`
//         : "/shiftingRequest";

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         return response.data.data;
//       }

//       throw new Error("API returned unsuccessful response");
//     } catch (err) {
//       console.error("Error fetching data for export:", err);
//       showError("Error fetching data for export");
//       return [];
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
//         "/centers?centerType=Center"
//       );

//       if (response.data.success) {
//         setCenters(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching centers:", error);
//     }
//   };

//   // --------------------------------------------------
//   // Initial Load
//   // --------------------------------------------------
//   useEffect(() => {
//     fetchCenters();
//     fetchData();
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
//     let direction = "ascending";

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction === "ascending"
//     ) {
//       direction = "descending";
//     }

//     setSortConfig({
//       key,
//       direction,
//     });

//     const sortedBuildings = [...buildings].sort((a, b) => {
//       let aValue = a;
//       let bValue = b;

//       if (key.includes(".")) {
//         const keys = key.split(".");

//         aValue = keys.reduce(
//           (obj, k) => obj && obj[k],
//           a
//         );

//         bValue = keys.reduce(
//           (obj, k) => obj && obj[k],
//           b
//         );
//       } else {
//         aValue = a[key];
//         bValue = b[key];
//       }

//       if (aValue < bValue) {
//         return direction === "ascending" ? -1 : 1;
//       }

//       if (aValue > bValue) {
//         return direction === "ascending" ? 1 : -1;
//       }

//       return 0;
//     });

//     setBuildings(sortedBuildings);
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return null;

//     return sortConfig.direction === "ascending" ? (
//       <ArrowUp size={14} className="ml-1 inline-block" />
//     ) : (
//       <ArrowDown size={14} className="ml-1 inline-block" />
//     );
//   };

//   // --------------------------------------------------
//   // Search
//   // --------------------------------------------------
//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData);
//     setSearchTerm("");
//     fetchData(searchData, 1);
//   };

//   const handleResetSearch = () => {
//     const resetData = {
//       keyword: "",
//       center: "",
//     };

//     setActiveSearch(resetData);
//     setSearchTerm("");

//     fetchData({}, 1);
//   };

//   // --------------------------------------------------
//   // Frontend Search
//   // --------------------------------------------------
//   const filteredBuildings = buildings.filter((building) =>
//     Object.values(building).some((value) => {
//       if (typeof value === "object" && value !== null) {
//         return Object.values(value).some(
//           (nestedValue) =>
//             nestedValue &&
//             nestedValue
//               .toString()
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase())
//         );
//       }

//       return (
//         value &&
//         value
//           .toString()
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     })
//   );

//   // --------------------------------------------------
//   // Dropdown
//   // --------------------------------------------------
//   const toggleDropdown = (id) => {
//     setDropdownOpen((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const newDropdownState = {};
//       let shouldUpdate = false;

//       Object.keys(dropdownRefs.current).forEach((key) => {
//         const dropdownElement = dropdownRefs.current[key];

//         if (
//           dropdownElement &&
//           !dropdownElement.contains(event.target)
//         ) {
//           newDropdownState[key] = false;
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
//       handleClickOutside
//     );

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside
//       );
//     };
//   }, []);

//   // --------------------------------------------------
//   // Approve / Reject
//   // --------------------------------------------------
//   const handleStatusChange = async (id, status) => {
//     try {
//       const response = await axiosInstance.put(
//         `/shiftingRequest/${id}/status`,
//         { status }
//       );

//       if (response.data.success) {
//         setAlert({
//           visible: true,
//           type: "success",
//           message: `Request ${
//             status === "Approve" ? "approved" : "rejected"
//           } successfully.`,
//         });

//         fetchData(activeSearch, currentPage);
//       } else {
//         throw new Error(
//           response.data.message ||
//             "Failed to update status"
//         );
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);

//       setAlert({
//         visible: true,
//         type: "danger",
//         message:
//           err.response?.data?.message ||
//           "Error updating status",
//       });
//     } finally {
//       setTimeout(() => {
//         setAlert({
//           visible: false,
//           type: "",
//           message: "",
//         });
//       }, 3000);
//     }
//   };

//   // --------------------------------------------------
//   // CSV Export
//   // --------------------------------------------------
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);

//       const allData = await fetchDataForExport();

//       if (!allData || allData.length === 0) {
//         showError("No data available for export");
//         return;
//       }

//       const headers = [
//         "User",
//         "From Center",
//         "To Center",
//         "Remark",
//         "Status",
//         "Status Detail",
//         "Date",
//         "Created At",
//       ];

//       const csvData = allData.map((building) => [
//         building.customer?.name || "N/A",
//         building.fromCenter?.centerName || "N/A",
//         building.toCenter?.centerName || "N/A",
//         building.remark || "",
//         building.status || "N/A",
//         building.status === "Approve" &&
//         building.approvedBy
//           ? `Approve At ${formatDate(
//               building.approvedAt
//             )} by ${building.approvedBy.fullName}`
//           : building.status === "Reject" &&
//             building.rejectedBy
//           ? `Rejecte At ${formatDate(
//               building.rejectedAt
//             )} by ${building.rejectedBy.fullName}`
//           : "Pending",
//         formatDate(building.date),
//         formatDateTime(building.createdAt),
//       ]);

//       const csvContent = [
//         headers.join(","),
//         ...csvData.map((row) =>
//           row
//             .map((field) => {
//               const stringField = String(field || "");

//               return `"${stringField.replace(
//                 /"/g,
//                 '""'
//               )}"`;
//             })
//             .join(",")
//         ),
//       ].join("\n");

//       const blob = new Blob(
//         ["\uFEFF" + csvContent],
//         {
//           type: "text/csv;charset=utf-8;",
//         }
//       );

//       const link = document.createElement("a");
//       const url = URL.createObjectURL(blob);

//       link.setAttribute("href", url);

//       let filename = `shifting_requests_${
//         new Date().toISOString().split("T")[0]
//       }`;

//       if (activeSearch.keyword) {
//         filename += `_search_${activeSearch.keyword}`;
//       }

//       if (activeSearch.center) {
//         const centerName =
//           centers.find(
//             (c) => c._id === activeSearch.center
//           )?.centerName || "center";

//         filename += `_${centerName}`;
//       }

//       filename += ".csv";

//       link.setAttribute("download", filename);
//       link.style.visibility = "hidden";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       URL.revokeObjectURL(url);

//       showSuccess("CSV export completed successfully!");
//     } catch (error) {
//       console.error(
//         "Error generating export:",
//         error
//       );

//       showError("Error generating export file");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Permissions
//   // --------------------------------------------------
//   const canEditDelete = (building) => {
//     const fromCenterId =
//       building.fromCenter?._id ||
//       building.fromCenter ||
//       null;

//     return (
//       userCenter &&
//       String(fromCenterId) === String(userCenter)
//     );
//   };

//   const canApproveReject = (building) => {
//     const toCenterId =
//       building.toCenter?._id ||
//       building.toCenter ||
//       null;

//     return (
//       userCenter &&
//       String(toCenterId) === String(userCenter)
//     );
//   };

//   const shouldShowActions = (building) => {
//     return (
//       building.status === "Pending" &&
//       (canEditDelete(building) ||
//         canApproveReject(building))
//     );
//   };

//   // --------------------------------------------------
//   // Delete
//   // --------------------------------------------------
//   const handleDelete = async (itemId) => {
//     const result = await confirmDelete();

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(
//           `/shiftingRequest/${itemId}`
//         );

//         setBuildings((prev) =>
//           prev.filter((item) => item._id !== itemId)
//         );

//         showSuccess("Data deleted successfully!");
//       } catch (error) {
//         console.error(
//           "Error deleting data:",
//           error
//         );
//       }
//     }
//   };

//   // --------------------------------------------------
//   // Edit
//   // --------------------------------------------------
//   const handleEdit = (itemId) => {
//     navigate(`/edit-shiftingRequest/${itemId}`);
//   };

//   const hasActiveFilters =
//     activeSearch.keyword ||
//     activeSearch.center;

//   // --------------------------------------------------
//   // Loading
//   // --------------------------------------------------
//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // Error
//   // --------------------------------------------------
//   if (error) {
//     return (
//       <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         <p>{error}</p>

//         <p className="mt-1 text-xs text-red-600">
//           Please check your permissions or contact
//           administrator.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
//       {/* Page Title */}
//       <div className="mb-4">
//         <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//           Shifting Request List
//         </h1>
//       </div>

//       {/* Alert */}
//       {alert.visible && (
//         <div
//           className={`mb-4 flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
//             alert.type === "success"
//               ? "border-green-200 bg-green-50 text-green-700"
//               : "border-red-200 bg-red-50 text-red-700"
//           }`}
//         >
//           <span>{alert.message}</span>

//           <button
//             type="button"
//             onClick={() =>
//               setAlert({
//                 visible: false,
//                 type: "",
//                 message: "",
//               })
//             }
//             className="ml-4 rounded p-1 hover:bg-black/5"
//           >
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* Search Modal */}
//       <SearchShiftingModel
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         centers={centers}
//       />

//       {/* Main Card */}
//       <div className="mt-4 overflow-hidden rounded-sm border-t-4 border-t-[#2759A2] border-x border-b border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-2 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             {hasAnyPermission("Shifting", [
//               "manage_shifting_all_center",
//               "manage_shifting_own_center",
//             ]) && (
//               <Link to="/add-shiftingRequest">
//                 <button
//                   type="button"
//                   className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a89]"
//                 >
//                   <Plus size={16} />
//                   Add
//                 </button>
//               </Link>
//             )}

//             <button
//               type="button"
//               onClick={() =>
//                 setSearchModalVisible(true)
//               }
//               className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a89]"
//             >
//               <Search size={16} />
//               Search
//             </button>

//             {hasActiveFilters && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//               >
//                 <RotateCcw size={16} />
//                 Reset Search
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={generateDetailExport}
//               disabled={loading}
//               className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a89] disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Download size={16} />
//               Detail Export
//             </button>
//           </div>

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>

//         {/* Card Body */}
//         <div className="p-4">
//           {/* Local Search */}
//           <div className="mb-4 flex justify-end">
//             <div className="flex w-full items-center gap-2 sm:w-auto">
//               <label
//                 htmlFor="shifting-search"
//                 className="whitespace-nowrap text-sm font-medium text-gray-700"
//               >
//                 Search:
//               </label>

//               <div className="relative w-full sm:w-[350px]">
//                 <Search
//                   size={16}
//                   className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />

//                 <input
//                   id="shifting-search"
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) =>
//                     setSearchTerm(e.target.value)
//                   }
//                   disabled={Boolean(hasActiveFilters)}
//                   className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="w-full overflow-hidden border border-gray-200">
//             <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">
//             <table className="min-w-[1100px] w-full border-collapse text-sm">
//               <thead className="sticky top-0 z-20 bg-white">
//                 <tr className="bg-white text-left text-sm font-bold text-black">
//                   <th className="border border-gray-100 px-2 py-3">
//                     User
//                   </th>

//                   <th
//                     className="cursor-pointer border border-gray-100 px-2 py-3 hover:bg-gray-100"
//                     onClick={() =>
//                       handleSort("fromCenter.centerName")
//                     }
//                   >
//                     From Branch
//                     {getSortIcon(
//                       "fromCenter.centerName"
//                     )}
//                   </th>

//                   <th
//                     className="cursor-pointer border border-gray-100 px-2 py-3 hover:bg-gray-100"
//                     onClick={() =>
//                       handleSort("toCenter.centerName")
//                     }
//                   >
//                     To Branch
//                     {getSortIcon(
//                       "toCenter.centerName"
//                     )}
//                   </th>

//                   <th className="border border-gray-100 px-2 py-3">
//                     Remark
//                   </th>

//                   <th className="border border-gray-100 px-2 py-3">
//                     Status
//                   </th>

//                   <th className="border border-gray-100 px-2 py-3">
//                     Status Detail
//                   </th>

//                   <th
//                     className="cursor-pointer border border-gray-100 px-2 py-3 hover:bg-gray-100"
//                     onClick={() =>
//                       handleSort("date")
//                     }
//                   >
//                     Date
//                     {getSortIcon("date")}
//                   </th>

//                   <th className="border border-gray-100 px-2 py-3">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredBuildings.length > 0 ? (
//                   filteredBuildings.map((building, index) => (
//                     <tr
//                       key={building._id}
//                       className={`transition hover:bg-gray-50 ${
//                         building.status === "Pending"
//                           ? "bg-[#DFF0D8]"
//                           : ""
//                       }`}
//                     >
//                       {/* User */}
//                       <td className="border border-gray-100 px-2 py-3 text-black">
//                         {building.customer?.name || "N/A"}
//                       </td>

//                       {/* From Branch */}
//                       <td className="border border-gray-100 px-2 py-3 text-black">
//                         {building.fromCenter
//                           ?.centerName || "N/A"}
//                       </td>

//                       {/* To Branch */}
//                       <td className="border border-gray-100 px-2 py-3 text-black">
//                         {building.toCenter
//                           ?.centerName || "N/A"}
//                       </td>

//                       {/* Remark */}
//                       <td className="max-w-[250px] border border-gray-100 px-2 py-3 text-black">
//                         <span
//                           className="block truncate"
//                           title={building.remark || ""}
//                         >
//                           {building.remark || "-"}
//                         </span>
//                       </td>

//                       {/* Status */}
//                       <td className="border border-gray-100 px-2 py-3">
//                         {building.status && (
//                           <span
//                             className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                               building.status ===
//                               "Pending"
//                                 ? "bg-yellow-100 text-yellow-700"
//                                 : building.status ===
//                                   "Approve"
//                                 ? "bg-green-100 text-green-700"
//                                 : building.status ===
//                                   "Reject"
//                                 ? "bg-red-100 text-red-700"
//                                 : "bg-gray-100 text-gray-700"
//                             }`}
//                           >
//                             {building.status}
//                           </span>
//                         )}
//                       </td>

//                       {/* Status Detail */}
//                       <td className="max-w-[280px] border border-gray-100 px-2 py-3 text-black">
//                         {building.status ===
//                           "Approve" &&
//                         building.approvedBy
//                           ? `Approve At ${formatDate(
//                               building.approvedAt
//                             )} by ${
//                               building.approvedBy
//                                 .fullName
//                             }`
//                           : building.status ===
//                               "Reject" &&
//                             building.rejectedBy
//                           ? `Rejecte At ${formatDate(
//                               building.rejectedAt
//                             )} by ${
//                               building.rejectedBy
//                                 .fullName
//                             }`
//                           : "-"}
//                       </td>

//                       {/* Date */}
//                       <td className="whitespace-nowrap border border-gray-100 px-2 py-3 text-black">
//                         {formatDate(building.date)}
//                       </td>

//                       {/* Actions */}
//                       <td className="border border-gray-100 px-2 py-3">
//                         {shouldShowActions(building) && (
//                           <div
//                             className="relative"
//                             ref={(el) => {
//                               dropdownRefs.current[
//                                 building._id
//                               ] = el;
//                             }}
//                           >
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 toggleDropdown(
//                                   building._id
//                                 )
//                               }
//                               className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
//                             >
//                               <Settings size={14} />
//                               Options
//                               <MoreVertical
//                                 size={13}
//                               />
//                             </button>

//                             {dropdownOpen[
//                               building._id
//                             ] && (
//                               <div className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
//                                 {canEditDelete(
//                                   building
//                                 ) && (
//                                   <>
//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         handleEdit(
//                                           building._id
//                                         )
//                                       }
//                                       className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
//                                     >
//                                       <Pencil
//                                         size={15}
//                                       />
//                                       Edit
//                                     </button>

//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         handleDelete(
//                                           building._id
//                                         )
//                                       }
//                                       className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
//                                     >
//                                       <Trash2
//                                         size={15}
//                                       />
//                                       Delete
//                                     </button>
//                                   </>
//                                 )}

//                                 {canApproveReject(
//                                   building
//                                 ) && (
//                                   <>
//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         handleStatusChange(
//                                           building._id,
//                                           "Approve"
//                                         )
//                                       }
//                                       className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50"
//                                     >
//                                       <Check
//                                         size={15}
//                                       />
//                                       Approve
//                                     </button>

//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         handleStatusChange(
//                                           building._id,
//                                           "Reject"
//                                         )
//                                       }
//                                       className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
//                                     >
//                                       <X size={15} />
//                                       Reject
//                                     </button>
//                                   </>
//                                 )}
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
//                       No shifting requests found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShiftinRequestList;


import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../../axiosInstance";import SearchShiftingModel from "./SearchShiftingModel";
import { formatDate, formatDateTime } from "../../utils/FormatDateTime";
import { confirmDelete, showSuccess, showError } from "../../utils/sweetAlerts";
import Pagination from "../../utils/Pagination";
import usePermission from "../../utils/usePermission";

const ShiftinRequestList = () => {
  const [buildings, setBuildings] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const [activeSearch, setActiveSearch] = useState({
    keyword: "",
    center: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState({});
  const dropdownRefs = useRef({});

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};

  const userCenter =
    loggedInUser.center?._id ||
    loggedInUser.center ||
    loggedInUser.centerId ||
    loggedInUser.centerID ||
    null;

  const { hasAnyPermission } = usePermission();

  // --------------------------------------------------
  // Fetch Shifting Requests
  // --------------------------------------------------
  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchParams.keyword) {
        params.append("search", searchParams.keyword);
      }

      if (searchParams.center) {
        params.append("center", searchParams.center);
      }

      params.append("page", page);

      const url = params.toString()
        ? `/shiftingRequest?${params.toString()}`
        : "/shiftingRequest";

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setBuildings(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        const errorMessage =
          response.data.message ||
          "API returned unsuccessful response";

        setError(errorMessage);
        console.error("Backend error:", response.data);
      }
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Error ${err.response.status}: ${err.response.statusText}`;

        setError(errorMessage);
        console.error("Error response:", err.response.data);
      } else if (err.request) {
        setError(
          "No response received from server. Please check your network connection."
        );
        console.error("Error request:", err.request);
      } else {
        setError(
          err.message || "An error occurred while fetching data"
        );
        console.error("Error message:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Fetch Data For Export
  // --------------------------------------------------
  const fetchDataForExport = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (activeSearch.keyword) {
        params.append("search", activeSearch.keyword);
      }

      if (activeSearch.center) {
        params.append("center", activeSearch.center);
      }

      const url = params.toString()
        ? `/shiftingRequest?${params.toString()}`
        : "/shiftingRequest";

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error("API returned unsuccessful response");
    } catch (err) {
      console.error("Error fetching data for export:", err);
      showError("Error fetching data for export");
      return [];
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
        "/centers?centerType=Center"
      );

      if (response.data.success) {
        setCenters(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
    }
  };

  // --------------------------------------------------
  // Initial Load
  // --------------------------------------------------
  useEffect(() => {
    fetchCenters();
    fetchData();
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
    let direction = "ascending";

    if (
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({
      key,
      direction,
    });

    const sortedBuildings = [...buildings].sort((a, b) => {
      let aValue = a;
      let bValue = b;

      if (key.includes(".")) {
        const keys = key.split(".");

        aValue = keys.reduce(
          (obj, k) => obj && obj[k],
          a
        );

        bValue = keys.reduce(
          (obj, k) => obj && obj[k],
          b
        );
      } else {
        aValue = a[key];
        bValue = b[key];
      }

      if (aValue < bValue) {
        return direction === "ascending" ? -1 : 1;
      }

      if (aValue > bValue) {
        return direction === "ascending" ? 1 : -1;
      }

      return 0;
    });

    setBuildings(sortedBuildings);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;

    return sortConfig.direction === "ascending" ? (
      <ArrowUp size={14} className="ml-1 inline-block" />
    ) : (
      <ArrowDown size={14} className="ml-1 inline-block" />
    );
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const handleSearch = (searchData) => {
    setActiveSearch(searchData);
    setSearchTerm("");
    fetchData(searchData, 1);
  };

  const handleResetSearch = () => {
    const resetData = {
      keyword: "",
      center: "",
    };

    setActiveSearch(resetData);
    setSearchTerm("");

    fetchData({}, 1);
  };

  // --------------------------------------------------
  // Frontend Search
  // --------------------------------------------------
  const filteredBuildings = buildings.filter((building) =>
    Object.values(building).some((value) => {
      if (typeof value === "object" && value !== null) {
        return Object.values(value).some(
          (nestedValue) =>
            nestedValue &&
            nestedValue
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
      }

      return (
        value &&
        value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    })
  );

  // --------------------------------------------------
  // Dropdown
  // --------------------------------------------------
  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {};
      let shouldUpdate = false;

      Object.keys(dropdownRefs.current).forEach((key) => {
        const dropdownElement = dropdownRefs.current[key];

        if (
          dropdownElement &&
          !dropdownElement.contains(event.target)
        ) {
          newDropdownState[key] = false;
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
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // --------------------------------------------------
  // Approve / Reject
  // --------------------------------------------------
  const handleStatusChange = async (id, status) => {
    try {
      const response = await axiosInstance.put(
        `/shiftingRequest/${id}/status`,
        { status }
      );

      if (response.data.success) {
        setAlert({
          visible: true,
          type: "success",
          message: `Request ${
            status === "Approve" ? "approved" : "rejected"
          } successfully.`,
        });

        fetchData(activeSearch, currentPage);
      } else {
        throw new Error(
          response.data.message ||
            "Failed to update status"
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);

      setAlert({
        visible: true,
        type: "danger",
        message:
          err.response?.data?.message ||
          "Error updating status",
      });
    } finally {
      setTimeout(() => {
        setAlert({
          visible: false,
          type: "",
          message: "",
        });
      }, 3000);
    }
  };

  // --------------------------------------------------
  // CSV Export
  // --------------------------------------------------
  const generateDetailExport = async () => {
    try {
      setLoading(true);

      const allData = await fetchDataForExport();

      if (!allData || allData.length === 0) {
        showError("No data available for export");
        return;
      }

      const headers = [
        "User",
        "From Center",
        "To Center",
        "Remark",
        "Status",
        "Status Detail",
        "Date",
        "Created At",
      ];

      const csvData = allData.map((building) => [
        building.customer?.name || "N/A",
        building.fromCenter?.centerName || "N/A",
        building.toCenter?.centerName || "N/A",
        building.remark || "",
        building.status || "N/A",
        building.status === "Approve" &&
        building.approvedBy
          ? `Approve At ${formatDate(
              building.approvedAt
            )} by ${building.approvedBy.fullName}`
          : building.status === "Reject" &&
            building.rejectedBy
          ? `Rejecte At ${formatDate(
              building.rejectedAt
            )} by ${building.rejectedBy.fullName}`
          : "Pending",
        formatDate(building.date),
        formatDateTime(building.createdAt),
      ]);

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const stringField = String(field || "");

              return `"${stringField.replace(
                /"/g,
                '""'
              )}"`;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob(
        ["\uFEFF" + csvContent],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);

      let filename = `shifting_requests_${
        new Date().toISOString().split("T")[0]
      }`;

      if (activeSearch.keyword) {
        filename += `_search_${activeSearch.keyword}`;
      }

      if (activeSearch.center) {
        const centerName =
          centers.find(
            (c) => c._id === activeSearch.center
          )?.centerName || "center";

        filename += `_${centerName}`;
      }

      filename += ".csv";

      link.setAttribute("download", filename);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      showSuccess("CSV export completed successfully!");
    } catch (error) {
      console.error(
        "Error generating export:",
        error
      );

      showError("Error generating export file");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Permissions
  // --------------------------------------------------
  const canEditDelete = (building) => {
    const fromCenterId =
      building.fromCenter?._id ||
      building.fromCenter ||
      null;

    return (
      userCenter &&
      String(fromCenterId) === String(userCenter)
    );
  };

  const canApproveReject = (building) => {
    const toCenterId =
      building.toCenter?._id ||
      building.toCenter ||
      null;

    return (
      userCenter &&
      String(toCenterId) === String(userCenter)
    );
  };

  // Show the Options button for every Pending request.
  // Individual menu actions remain protected by the existing permission checks.
  const shouldShowActions = (building) => {
    return building.status === "Pending";
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------
  const handleDelete = async (itemId) => {
    const result = await confirmDelete();

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(
          `/shiftingRequest/${itemId}`
        );

        setBuildings((prev) =>
          prev.filter((item) => item._id !== itemId)
        );

        showSuccess("Data deleted successfully!");
      } catch (error) {
        console.error(
          "Error deleting data:",
          error
        );
      }
    }
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------
  const handleEdit = (itemId) => {
    navigate(`/edit-shiftingRequest/${itemId}`);
  };

  const hasActiveFilters =
    activeSearch.keyword ||
    activeSearch.center;

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <p>{error}</p>

        <p className="mt-1 text-xs text-red-600">
          Please check your permissions or contact
          administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
          Shifting Request List
        </h1>
      </div>

      {/* Alert */}
      {alert.visible && (
        <div
          className={`mb-4 flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
            alert.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <span>{alert.message}</span>

          <button
            type="button"
            onClick={() =>
              setAlert({
                visible: false,
                type: "",
                message: "",
              })
            }
            className="ml-4 rounded p-1 hover:bg-black/5"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search Modal */}
      <SearchShiftingModel
        visible={searchModalVisible}
        onClose={() =>
          setSearchModalVisible(false)
        }
        onSearch={handleSearch}
        centers={centers}
      />

      {/* Main Card */}
      <div className="mt-4 overflow-hidden rounded-sm border-t-4 border-t-[#2759A2] border-x border-b border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {hasAnyPermission("Shifting", [
              "manage_shifting_all_center",
              "manage_shifting_own_center",
            ]) && (
              <Link to="/add-shiftingRequest">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a89]"
                >
                  <Plus size={16} />
                  Add
                </button>
              </Link>
            )}

            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(true)
              }
              className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a89]"
            >
              <Search size={16} />
              Search
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <RotateCcw size={16} />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={generateDetailExport}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a89] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Detail Export
            </button>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Local Search */}
          <div className="mb-4 flex justify-end">
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <label
                htmlFor="shifting-search"
                className="whitespace-nowrap text-sm font-medium text-gray-700"
              >
                Search:
              </label>

              <div className="relative w-full sm:w-[350px]">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="shifting-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  disabled={Boolean(hasActiveFilters)}
                  className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-hidden border border-gray-200">
            <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">
            <table className="min-w-[1100px] w-full border-collapse text-sm">
              <thead className="sticky top-0 z-20 bg-white">
                <tr className="bg-white text-left text-sm font-bold text-black">
                  <th className="border border-gray-100 px-2 py-3">
                    User
                  </th>

                  <th
                    className="cursor-pointer border border-gray-100 px-2 py-3 hover:bg-gray-100"
                    onClick={() =>
                      handleSort("fromCenter.centerName")
                    }
                  >
                    From Branch
                    {getSortIcon(
                      "fromCenter.centerName"
                    )}
                  </th>

                  <th
                    className="cursor-pointer border border-gray-100 px-2 py-3 hover:bg-gray-100"
                    onClick={() =>
                      handleSort("toCenter.centerName")
                    }
                  >
                    To Branch
                    {getSortIcon(
                      "toCenter.centerName"
                    )}
                  </th>

                  <th className="border border-gray-100 px-2 py-3">
                    Remark
                  </th>

                  <th className="border border-gray-100 px-2 py-3">
                    Status
                  </th>

                  <th className="border border-gray-100 px-2 py-3">
                    Status Detail
                  </th>

                  <th
                    className="cursor-pointer border border-gray-100 px-2 py-3 hover:bg-gray-100"
                    onClick={() =>
                      handleSort("date")
                    }
                  >
                    Date
                    {getSortIcon("date")}
                  </th>

                  <th className="border border-gray-100 px-2 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredBuildings.length > 0 ? (
                  filteredBuildings.map((building, index) => (
                    <tr
                      key={building._id}
                      className={`transition hover:bg-gray-50 ${
                        building.status === "Pending"
                          ? "bg-[#DFF0D8]"
                          : ""
                      }`}
                    >
                      {/* User */}
                      <td className="border border-gray-100 px-2 py-3 text-black">
                        {building.customer?.name || "N/A"}
                      </td>

                      {/* From Branch */}
                      <td className="border border-gray-100 px-2 py-3 text-black">
                        {building.fromCenter
                          ?.centerName || "N/A"}
                      </td>

                      {/* To Branch */}
                      <td className="border border-gray-100 px-2 py-3 text-black">
                        {building.toCenter
                          ?.centerName || "N/A"}
                      </td>

                      {/* Remark */}
                      <td className="max-w-[250px] border border-gray-100 px-2 py-3 text-black">
                        <span
                          className="block truncate"
                          title={building.remark || ""}
                        >
                          {building.remark || "-"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="border border-gray-100 px-2 py-3">
                        {building.status && (
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              building.status ===
                              "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : building.status ===
                                  "Approve"
                                ? "bg-green-100 text-green-700"
                                : building.status ===
                                  "Reject"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {building.status}
                          </span>
                        )}
                      </td>

                      {/* Status Detail */}
                      <td className="max-w-[280px] border border-gray-100 px-2 py-3 text-black">
                        {building.status ===
                          "Approve" &&
                        building.approvedBy
                          ? `Approve At ${formatDate(
                              building.approvedAt
                            )} by ${
                              building.approvedBy
                                .fullName
                            }`
                          : building.status ===
                              "Reject" &&
                            building.rejectedBy
                          ? `Rejecte At ${formatDate(
                              building.rejectedAt
                            )} by ${
                              building.rejectedBy
                                .fullName
                            }`
                          : "-"}
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap border border-gray-100 px-2 py-3 text-black">
                        {formatDate(building.date)}
                      </td>

                      {/* Actions */}
                      <td className="border border-gray-100 px-2 py-3">
                        {shouldShowActions(building) && (
                          <div
                            className="relative"
                            ref={(el) => {
                              dropdownRefs.current[
                                building._id
                              ] = el;
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleDropdown(
                                  building._id
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                            >
                              <Settings size={14} />
                              Options
                              <MoreVertical
                                size={13}
                              />
                            </button>

                            {dropdownOpen[
                              building._id
                            ] && (
                              <div className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                                {canEditDelete(
                                  building
                                ) && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEdit(
                                          building._id
                                        )
                                      }
                                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                      <Pencil
                                        size={15}
                                      />
                                      Edit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDelete(
                                          building._id
                                        )
                                      }
                                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2
                                        size={15}
                                      />
                                      Delete
                                    </button>
                                  </>
                                )}

                                {canApproveReject(
                                  building
                                ) && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleStatusChange(
                                          building._id,
                                          "Approve"
                                        )
                                      }
                                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50"
                                    >
                                      <Check
                                        size={15}
                                      />
                                      Approve
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleStatusChange(
                                          building._id,
                                          "Reject"
                                        )
                                      }
                                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                    >
                                      <X size={15} />
                                      Reject
                                    </button>
                                  </>
                                )}
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
                      No shifting requests found
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
  );
};

export default ShiftinRequestList;