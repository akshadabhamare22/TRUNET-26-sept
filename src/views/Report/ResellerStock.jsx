// import React, { useEffect, useRef, useState } from "react";
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   FileSpreadsheet,
//   RotateCcw,
//   Search,
//   X,
// } from "lucide-react";

// import axiosInstance from "../../axiosInstance";import Pagination from "../../utils/Pagination";
// import { showError, showSuccess } from "../../utils/sweetAlerts";
// import ResellerStockSearch from "./ResellerStockSearch";

// const ResellerStock = () => {
//   const [data, setData] = useState([]);
//   const [resellers, setResellers] = useState([]);
//   const [products, setProducts] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchModalVisible, setSearchModalVisible] =
//     useState(false);

//   const [exportModalVisible, setExportModalVisible] =
//     useState(false);

//   const [exportStartDate, setExportStartDate] =
//     useState("");
//   const [exportEndDate, setExportEndDate] =
//     useState("");

//   const [activeSearch, setActiveSearch] = useState({
//     product: "",
//     reseller: "",
//     center: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [centers, setCenters] = useState([]);

//   const dropdownRefs = useRef({});

//   // --------------------------------------------------
//   // Fetch Reseller Stock
//   // --------------------------------------------------
//   const fetchData = async (
//     searchParams = {},
//     page = 1
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();

//       if (searchParams.product) {
//         params.append(
//           "product",
//           searchParams.product
//         );
//       }

//       if (searchParams.reseller) {
//         params.append(
//           "reseller",
//           searchParams.reseller
//         );
//       }

//       if (searchParams.center) {
//         params.append(
//           "sourceCenter",
//           searchParams.center
//         );
//       }

//       if (searchParams.fromCenter) {
//         params.append(
//           "fromCenter",
//           searchParams.fromCenter
//         );
//       }

//       if (searchParams.startDate) {
//         params.append(
//           "startDate",
//           searchParams.startDate
//         );
//       }

//       if (searchParams.endDate) {
//         params.append(
//           "endDate",
//           searchParams.endDate
//         );
//       }

//       params.append("page", page);

//       const url = params.toString()
//         ? `/availablestock/reseller?${params.toString()}`
//         : "/availableStock/reseller";

//       const response =
//         await axiosInstance.get(url);

//       if (response.data.success) {
//         const stock =
//           response.data.data.stock || [];

//         setData(stock);

//         setCurrentPage(
//           response.data.data.pagination
//             ?.currentPage || 1
//         );

//         setTotalPages(
//           response.data.data.pagination
//             ?.totalPages || 1
//         );

//         if (response.data.data.center) {
//           setCenters([
//             response.data.data.center,
//           ]);
//         } else if (
//           response.data.data.sourceCenter
//         ) {
//           setCenters([
//             response.data.data.sourceCenter,
//           ]);
//         } else {
//           setCenters([]);
//         }
//       } else {
//         const errorMessage =
//           response.data.message ||
//           "API returned unsuccessful response";

//         setError(errorMessage);

//         console.error(
//           "Backend error:",
//           response.data
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
//           err.response.data
//         );
//       } else if (err.request) {
//         setError(
//           "No response received from server. Please check your network connection."
//         );

//         console.error(
//           "Error request:",
//           err.request
//         );
//       } else {
//         setError(
//           err.message ||
//             "An error occurred while fetching data"
//         );

//         console.error(
//           "Error message:",
//           err.message
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Fetch Resellers
//   // --------------------------------------------------
//   const fetchResellers = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           "/resellers"
//         );

//       if (response.data.success) {
//         setResellers(
//           response.data.data || []
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching resellers:",
//         error
//       );
//     }
//   };

//   // --------------------------------------------------
//   // Fetch Products
//   // --------------------------------------------------
//   const fetchProducts = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           "/products/all"
//         );

//       if (response.data.success) {
//         setProducts(
//           response.data.data || []
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching products:",
//         error
//       );
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchResellers();
//     fetchProducts();
//   }, []);

//   // --------------------------------------------------
//   // Pagination
//   // --------------------------------------------------
//   const handlePageChange = (page) => {
//     if (
//       page < 1 ||
//       page > totalPages
//     ) {
//       return;
//     }

//     fetchData(activeSearch, page);
//   };

//   // --------------------------------------------------
//   // Sorting
//   // --------------------------------------------------
//   const getNestedValue = (
//     object,
//     path
//   ) => {
//     return path
//       .split(".")
//       .reduce(
//         (current, key) =>
//           current?.[key],
//         object
//       );
//   };

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
//         let aValue = getNestedValue(
//           a,
//           key
//         );
//         let bValue = getNestedValue(
//           b,
//           key
//         );

//         if (
//           typeof aValue === "string"
//         ) {
//           aValue =
//             aValue.toLowerCase();
//         }

//         if (
//           typeof bValue === "string"
//         ) {
//           bValue =
//             bValue.toLowerCase();
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
//       }
//     );

//     setData(sortedData);
//   };

//   const getSortIcon = (key) => {
//     if (
//       sortConfig.key !== key
//     ) {
//       return null;
//     }

//     return sortConfig.direction ===
//       "ascending" ? (
//       <ArrowUp
//         size={14}
//         className="ml-1 inline-block"
//       />
//     ) : (
//       <ArrowDown
//         size={14}
//         className="ml-1 inline-block"
//       />
//     );
//   };

//   // --------------------------------------------------
//   // Search
//   // --------------------------------------------------
//   const handleSearch = (
//     searchData
//   ) => {
//     setActiveSearch(searchData);
//     fetchData(searchData, 1);
//   };

//   // --------------------------------------------------
//   // Reset Search
//   // --------------------------------------------------
//   const handleResetSearch = () => {
//     const resetData = {
//       product: "",
//       reseller: "",
//       center: "",
//       startDate: "",
//       endDate: "",
//     };

//     setActiveSearch(resetData);
//     setSearchTerm("");
//     setCenters([]);

//     fetchData({}, 1);
//   };

//   // --------------------------------------------------
//   // Export Modal
//   // --------------------------------------------------
//   const openExportModal = () => {
//     setExportStartDate(
//       activeSearch.startDate || ""
//     );

//     setExportEndDate(
//       activeSearch.endDate || ""
//     );

//     setExportModalVisible(true);
//   };

//   // --------------------------------------------------
//   // Generate Export
//   // --------------------------------------------------
//   const generateDetailExport =
//     async () => {
//       try {
//         setLoading(true);

//         // Validate date range
//         if (
//           exportStartDate &&
//           exportEndDate &&
//           exportStartDate >
//             exportEndDate
//         ) {
//           showError(
//             "Start date cannot be greater than end date"
//           );

//           setLoading(false);
//           return;
//         }

//         const params =
//           new URLSearchParams();

//         // Active filters
//         if (
//           activeSearch.product
//         ) {
//           params.append(
//             "product",
//             activeSearch.product
//           );
//         }

//         if (
//           activeSearch.reseller
//         ) {
//           params.append(
//             "reseller",
//             activeSearch.reseller
//           );
//         }

//         if (activeSearch.center) {
//           params.append(
//             "sourceCenter",
//             activeSearch.center
//           );
//         }

//         // Export modal date range
//         if (exportStartDate) {
//           params.append(
//             "startDate",
//             exportStartDate
//           );
//         }

//         if (exportEndDate) {
//           params.append(
//             "endDate",
//             exportEndDate
//           );
//         }

//         params.append(
//           "exportData",
//           "true"
//         );

//         const apiUrl =
//           params.toString()
//             ? `/availableStock/reseller?${params.toString()}`
//             : "/availableStock/reseller";

//         const response =
//           await axiosInstance.get(
//             apiUrl
//           );

//         if (
//           !response.data.success
//         ) {
//           throw new Error(
//             "API returned unsuccessful response"
//           );
//         }

//         const exportData =
//           response.data.data
//             .stock || [];

//         if (
//           exportData.length === 0
//         ) {
//           showError(
//             "No data available for export"
//           );
//           return;
//         }

//         const headers = [
//           "Reseller",
//           "Product",
//           "Category",
//           "Available Quantity",
//           "Consumed Quantity",
//         ];

//         const csvData =
//           exportData.map(
//             (item) => {
//               const displayQty =
//                 item.displayQuantity !==
//                   undefined &&
//                 item.displayQuantity !==
//                   null
//                   ? item.displayQuantity
//                   : 0;

//               const displayConsumed =
//                 item.displayConsumed !==
//                   undefined &&
//                 item.displayConsumed !==
//                   null
//                   ? item.displayConsumed
//                   : 0;

//               return [
//                 item.resellerName ||
//                   "",
//                 item.productName ||
//                   "",
//                 item.productCategory
//                   ?.name || "",
//                 displayQty,
//                 displayConsumed,
//               ];
//             }
//           );

//         const csvContent = [
//           headers.join(","),
//           ...csvData.map(
//             (row) =>
//               row
//                 .map((field) => {
//                   let stringField;

//                   if (
//                     field ===
//                       undefined ||
//                     field === null
//                   ) {
//                     stringField = "0";
//                   } else if (
//                     typeof field ===
//                     "number"
//                   ) {
//                     stringField =
//                       String(field);
//                   } else {
//                     stringField =
//                       String(
//                         field || ""
//                       );
//                   }

//                   return `"${stringField.replace(
//                     /"/g,
//                     '""'
//                   )}"`;
//                 })
//                 .join(",")
//           ),
//         ].join("\n");

//         // Filename
//         let filename =
//           "reseller_stock_export";

//         if (
//           exportStartDate &&
//           exportEndDate
//         ) {
//           filename += `_${exportStartDate}_to_${exportEndDate}`;
//         } else if (
//           exportStartDate
//         ) {
//           filename += `_from_${exportStartDate}`;
//         } else if (
//           exportEndDate
//         ) {
//           filename += `_until_${exportEndDate}`;
//         } else {
//           filename += `_${new Date()
//             .toISOString()
//             .split("T")[0]}`;
//         }

//         filename += ".csv";

//         const blob = new Blob(
//           ["\uFEFF" + csvContent],
//           {
//             type: "text/csv;charset=utf-8;",
//           }
//         );

//         const link =
//           document.createElement(
//             "a"
//           );

//         const downloadUrl =
//           URL.createObjectURL(
//             blob
//           );

//         link.setAttribute(
//           "href",
//           downloadUrl
//         );

//         link.setAttribute(
//           "download",
//           filename
//         );

//         link.style.visibility =
//           "hidden";

//         document.body.appendChild(
//           link
//         );

//         link.click();

//         document.body.removeChild(
//           link
//         );

//         URL.revokeObjectURL(
//           downloadUrl
//         );

//         showSuccess(
//           "Export completed successfully!"
//         );

//         setExportModalVisible(
//           false
//         );

//         setExportStartDate("");
//         setExportEndDate("");
//       } catch (error) {
//         console.error(
//           "Error generating export:",
//           error
//         );

//         showError(
//           "Error generating export file"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//   // --------------------------------------------------
//   // Frontend Search
//   // --------------------------------------------------
//   const filteredData = data.filter(
//     (item) => {
//       if (
//         activeSearch.product ||
//         activeSearch.reseller ||
//         activeSearch.center ||
//         activeSearch.startDate ||
//         activeSearch.endDate
//       ) {
//         return true;
//       }

//       return Object.values(item).some(
//         (value) => {
//           if (
//             typeof value ===
//               "object" &&
//             value !== null
//           ) {
//             return Object.values(
//               value
//             ).some(
//               (nestedValue) =>
//                 nestedValue &&
//                 nestedValue
//                   .toString()
//                   .toLowerCase()
//                   .includes(
//                     searchTerm.toLowerCase()
//                   )
//             );
//           }

//           return (
//             value &&
//             value
//               .toString()
//               .toLowerCase()
//               .includes(
//                 searchTerm.toLowerCase()
//               )
//           );
//         }
//       );
//     }
//   );

//   // --------------------------------------------------
//   // Loading
//   // --------------------------------------------------
//   if (
//     loading &&
//     data.length === 0
//   ) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // Error
//   // --------------------------------------------------
//   if (error) {
//     return (
//       <div
//         className="mx-4 mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
//         role="alert"
//       >
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {/* Page Title */}
//       <div className="mb-5">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           Reseller Stock
//         </h1>
//       </div>

//       {/* Search Modal */}
//       <ResellerStockSearch
//         visible={
//           searchModalVisible
//         }
//         onClose={() =>
//           setSearchModalVisible(
//             false
//           )
//         }
//         onSearch={handleSearch}
//         resellers={resellers}
//         products={products}
//       />

//       {/* Export Modal */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between border-b px-6 py-4">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Export Reseller Stock Data
//               </h2>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setExportModalVisible(
//                     false
//                   )
//                 }
//                 className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//                 aria-label="Close"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="space-y-5 px-6 py-5">
//               {/* Start Date */}
//               <div>
//                 <label
//                   htmlFor="exportStartDate"
//                   className="mb-2 block text-sm font-medium text-gray-700"
//                 >
//                   Start Date{" "}
//                   <span className="font-normal text-gray-400">
//                     (Optional)
//                   </span>
//                 </label>

//                 <input
//                   type="date"
//                   id="exportStartDate"
//                   value={
//                     exportStartDate
//                   }
//                   onChange={(e) =>
//                     setExportStartDate(
//                       e.target.value
//                     )
//                   }
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Leave empty to include
//                   all records from
//                   beginning
//                 </p>
//               </div>

//               {/* End Date */}
//               <div>
//                 <label
//                   htmlFor="exportEndDate"
//                   className="mb-2 block text-sm font-medium text-gray-700"
//                 >
//                   End Date{" "}
//                   <span className="font-normal text-gray-400">
//                     (Optional)
//                   </span>
//                 </label>

//                 <input
//                   type="date"
//                   id="exportEndDate"
//                   value={
//                     exportEndDate
//                   }
//                   onChange={(e) =>
//                     setExportEndDate(
//                       e.target.value
//                     )
//                   }
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Leave empty to include
//                   all records until
//                   today
//                 </p>
//               </div>

//               {/* Current Filters */}
//               {(activeSearch.product ||
//                 activeSearch.reseller ||
//                 activeSearch.center) && (
//                 <div className="rounded-lg bg-gray-50 p-4">
//                   <p className="mb-2 text-sm font-semibold text-gray-700">
//                     Current Filters:
//                   </p>

//                   <ul className="space-y-1 text-sm text-gray-600">
//                     {activeSearch.reseller && (
//                       <li>
//                         <span className="font-medium">
//                           Reseller:
//                         </span>{" "}
//                         {
//                           resellers.find(
//                             (r) =>
//                               r._id ===
//                               activeSearch.reseller
//                           )
//                             ?.businessName
//                         }
//                       </li>
//                     )}

//                     {activeSearch.center && (
//                       <li>
//                         <span className="font-medium">
//                           Center:
//                         </span>{" "}
//                         {
//                           centers.find(
//                             (c) =>
//                               c._id ===
//                               activeSearch.center
//                           )
//                             ?.centerName
//                         }
//                       </li>
//                     )}

//                     {activeSearch.product && (
//                       <li>
//                         <span className="font-medium">
//                           Product:
//                         </span>{" "}
//                         {
//                           products.find(
//                             (p) =>
//                               p._id ===
//                               activeSearch.product
//                           )
//                             ?.productTitle
//                         }
//                       </li>
//                     )}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setExportModalVisible(
//                     false
//                   )
//                 }
//                 className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={
//                   generateDetailExport
//                 }
//                 className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
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

//       {/* Main Card */}
//       <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-5 py-4">
//           <div className="flex flex-wrap items-center gap-2">
//             {/* Search */}
//             <button
//               type="button"
//               onClick={() =>
//                 setSearchModalVisible(
//                   true
//                 )
//               }
//               className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//             >
//               <Search size={16} />
//               Search
//             </button>

//             {/* Reset */}
//             {(activeSearch.product ||
//               activeSearch.reseller ||
//               activeSearch.center ||
//               activeSearch.startDate ||
//               activeSearch.endDate) && (
//               <button
//                 type="button"
//                 onClick={
//                   handleResetSearch
//                 }
//                 className="inline-flex items-center gap-2 rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
//               >
//                 <RotateCcw
//                   size={16}
//                 />
//                 Reset Search
//               </button>
//             )}

//             {/* Export */}
//             <button
//               type="button"
//               onClick={
//                 openExportModal
//               }
//               disabled={
//                 data.length === 0
//               }
//               className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Download size={16} />
//               Export
//             </button>
//           </div>

//           {/* Top Pagination */}
//           <Pagination
//             currentPage={
//               currentPage
//             }
//             totalPages={
//               totalPages
//             }
//             onPageChange={
//               handlePageChange
//             }
//           />
//         </div>

//         {/* Card Body */}
//         <div className="p-5">
//           {/* Date + Search */}
//           <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
//             <div>
//               {(activeSearch.startDate ||
//                 activeSearch.endDate) && (
//                 <div className="text-sm text-gray-500">
//                   {activeSearch.startDate &&
//                     `From: ${activeSearch.startDate} `}
//                   {activeSearch.endDate &&
//                     `To: ${activeSearch.endDate}`}
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               <label
//                 htmlFor="resellerStockSearch"
//                 className="text-sm font-medium text-gray-600"
//               >
//                 Search:
//               </label>

//               <input
//                 id="resellerStockSearch"
//                 type="text"
//                 value={
//                   searchTerm
//                 }
//                 onChange={(e) =>
//                   setSearchTerm(
//                     e.target.value
//                   )
//                 }
//                 className="h-8 w-full max-w-[350px] rounded-none border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="w-full overflow-x-auto">
//             <table className="min-w-[850px] w-full border-collapse text-sm">
//               <thead>
//                 <tr className="bg-gray-100 text-left">
//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "resellerName"
//                       )
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Reseller{" "}
//                     {getSortIcon(
//                       "resellerName"
//                     )}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "productName"
//                       )
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Product{" "}
//                     {getSortIcon(
//                       "productName"
//                     )}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "productCategory.name"
//                       )
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Category{" "}
//                     {getSortIcon(
//                       "productCategory.name"
//                     )}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "availableQuantity"
//                       )
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Available{" "}
//                     {getSortIcon(
//                       "availableQuantity"
//                     )}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "consumedQuantity"
//                       )
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Consumed{" "}
//                     {getSortIcon(
//                       "consumedQuantity"
//                     )}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length >
//                 0 ? (
//                   filteredData.map(
//                     (item) => (
//                       <tr
//                         key={item._id}
//                         className="hover:bg-gray-50"
//                       >
//                         <td className="border border-gray-200 px-4 py-3">
//                           {
//                             item.resellerName
//                           }
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {
//                             item.productName
//                           }
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {
//                             item
//                               .productCategory
//                               ?.name || ""
//                           }
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {
//                             item.displayQuantity ||
//                             0
//                           }
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {
//                             item.displayConsumed ||
//                             0
//                           }
//                         </td>
//                       </tr>
//                     )
//                   )
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="border border-gray-200 px-4 py-8 text-center text-gray-500"
//                     >
//                       {loading ? (
//                         <div className="flex justify-center">
//                           <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
//                         </div>
//                       ) : (
//                         "No data found. Try adjusting your search filters."
//                       )}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Bottom Summary + Pagination */}
//           {data.length > 0 && (
//             <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
//               <div>
//                 <p className="text-sm text-gray-500">
//                   Showing{" "}
//                   {filteredData.length}{" "}
//                   of {data.length} items
//                   {totalPages > 1 &&
//                     ` | Page ${currentPage} of ${totalPages}`}
//                 </p>
//               </div>

//               {totalPages > 1 && (
//                 <Pagination
//                   currentPage={
//                     currentPage
//                   }
//                   totalPages={
//                     totalPages
//                   }
//                   onPageChange={
//                     handlePageChange
//                   }
//                 />
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResellerStock;





// import React, { useEffect, useRef, useState } from 'react'
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   FileSpreadsheet,
//   RotateCcw,
//   Search,
//   X,
// } from 'lucide-react'

// import axiosInstance from '../../axiosInstance'
// import Pagination from '../../utils/Pagination'
// import { showError, showSuccess } from '../../utils/sweetAlerts'
// import ResellerStockSearch from './ResellerStockSearch'

// const ResellerStock = () => {
//   const [data, setData] = useState([])
//   const [resellers, setResellers] = useState([])
//   const [products, setProducts] = useState([])

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
//     reseller: '',
//     center: '',
//     startDate: '',
//     endDate: '',
//   })

//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const [centers, setCenters] = useState([])

//   const dropdownRefs = useRef({})

//   // --------------------------------------------------
//   // Fetch Reseller Stock
//   // --------------------------------------------------
//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true)
//       setError(null)

//       const params = new URLSearchParams()

//       if (searchParams.product) {
//         params.append('product', searchParams.product)
//       }

//       if (searchParams.reseller) {
//         params.append('reseller', searchParams.reseller)
//       }

//       if (searchParams.center) {
//         params.append('sourceCenter', searchParams.center)
//       }

//       if (searchParams.fromCenter) {
//         params.append('fromCenter', searchParams.fromCenter)
//       }

//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate)
//       }

//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/availablestock/reseller?${params.toString()}`
//         : '/availableStock/reseller'

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         const stock = response.data.data.stock || []

//         setData(stock)

//         setCurrentPage(
//           response.data.data.pagination?.currentPage || 1,
//         )

//         setTotalPages(
//           response.data.data.pagination?.totalPages || 1,
//         )

//         if (response.data.data.center) {
//           setCenters([response.data.data.center])
//         } else if (response.data.data.sourceCenter) {
//           setCenters([response.data.data.sourceCenter])
//         } else {
//           setCenters([])
//         }
//       } else {
//         const errorMessage =
//           response.data.message ||
//           'API returned unsuccessful response'

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

//         console.error(
//           'Error response:',
//           err.response.data,
//         )
//       } else if (err.request) {
//         setError(
//           'No response received from server. Please check your network connection.',
//         )

//         console.error('Error request:', err.request)
//       } else {
//         setError(
//           err.message ||
//             'An error occurred while fetching data',
//         )

//         console.error('Error message:', err.message)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // --------------------------------------------------
//   // Fetch Resellers
//   // --------------------------------------------------
//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers')

//       if (response.data.success) {
//         setResellers(response.data.data || [])
//       }
//     } catch (error) {
//       console.error('Error fetching resellers:', error)
//     }
//   }

//   // --------------------------------------------------
//   // Fetch Products
//   // --------------------------------------------------
//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all')

//       if (response.data.success) {
//         setProducts(response.data.data || [])
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error)
//     }
//   }

//   useEffect(() => {
//     fetchData()
//     fetchResellers()
//     fetchProducts()
//   }, [])

//   // --------------------------------------------------
//   // Pagination
//   // --------------------------------------------------
//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) {
//       return
//     }

//     fetchData(activeSearch, page)
//   }

//   // --------------------------------------------------
//   // Sorting
//   // --------------------------------------------------
//   const getNestedValue = (object, path) => {
//     return path
//       .split('.')
//       .reduce(
//         (current, key) => current?.[key],
//         object,
//       )
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

//     const sortedData = [...data].sort((a, b) => {
//       let aValue = getNestedValue(a, key)
//       let bValue = getNestedValue(b, key)

//       if (typeof aValue === 'string') {
//         aValue = aValue.toLowerCase()
//       }

//       if (typeof bValue === 'string') {
//         bValue = bValue.toLowerCase()
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

//   // --------------------------------------------------
//   // Search
//   // --------------------------------------------------
//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData)
//     fetchData(searchData, 1)
//   }

//   // --------------------------------------------------
//   // Reset Search
//   // --------------------------------------------------
//   const handleResetSearch = () => {
//     const resetData = {
//       product: '',
//       reseller: '',
//       center: '',
//       startDate: '',
//       endDate: '',
//     }

//     setActiveSearch(resetData)
//     setSearchTerm('')
//     setCenters([])

//     fetchData({}, 1)
//   }

//   // --------------------------------------------------
//   // Export Modal
//   // --------------------------------------------------
//   const openExportModal = () => {
//     setExportStartDate(activeSearch.startDate || '')
//     setExportEndDate(activeSearch.endDate || '')

//     setExportModalVisible(true)
//   }

//   // --------------------------------------------------
//   // Generate Export
//   // --------------------------------------------------
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

//       const params = new URLSearchParams()

//       if (activeSearch.product) {
//         params.append(
//           'product',
//           activeSearch.product,
//         )
//       }

//       if (activeSearch.reseller) {
//         params.append(
//           'reseller',
//           activeSearch.reseller,
//         )
//       }

//       if (activeSearch.center) {
//         params.append(
//           'sourceCenter',
//           activeSearch.center,
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

//       params.append('exportData', 'true')

//       const apiUrl = params.toString()
//         ? `/availableStock/reseller?${params.toString()}`
//         : '/availableStock/reseller'

//       const response = await axiosInstance.get(apiUrl)

//       if (!response.data.success) {
//         throw new Error(
//           'API returned unsuccessful response',
//         )
//       }

//       const exportData =
//         response.data.data.stock || []

//       if (exportData.length === 0) {
//         showError('No data available for export')
//         return
//       }

//       const headers = [
//         'Reseller',
//         'Product',
//         'Category',
//         'Available Quantity',
//         'Consumed Quantity',
//       ]

//       const csvData = exportData.map((item) => {
//         const displayQty =
//           item.displayQuantity !== undefined &&
//           item.displayQuantity !== null
//             ? item.displayQuantity
//             : 0

//         const displayConsumed =
//           item.displayConsumed !== undefined &&
//           item.displayConsumed !== null
//             ? item.displayConsumed
//             : 0

//         return [
//           item.resellerName || '',
//           item.productName || '',
//           item.productCategory?.name || '',
//           displayQty,
//           displayConsumed,
//         ]
//       })

//       const csvContent = [
//         headers.join(','),
//         ...csvData.map((row) =>
//           row
//             .map((field) => {
//               let stringField

//               if (
//                 field === undefined ||
//                 field === null
//               ) {
//                 stringField = '0'
//               } else if (
//                 typeof field === 'number'
//               ) {
//                 stringField = String(field)
//               } else {
//                 stringField = String(field || '')
//               }

//               return `"${stringField.replace(
//                 /"/g,
//                 '""',
//               )}"`
//             })
//             .join(','),
//         ),
//       ].join('\n')

//       let filename = 'reseller_stock_export'

//       if (
//         exportStartDate &&
//         exportEndDate
//       ) {
//         filename += `_${exportStartDate}_to_${exportEndDate}`
//       } else if (exportStartDate) {
//         filename += `_from_${exportStartDate}`
//       } else if (exportEndDate) {
//         filename += `_until_${exportEndDate}`
//       } else {
//         filename += `_${new Date()
//           .toISOString()
//           .split('T')[0]}`
//       }

//       filename += '.csv'

//       const blob = new Blob(
//         ['\uFEFF' + csvContent],
//         {
//           type: 'text/csv;charset=utf-8;',
//         },
//       )

//       const link = document.createElement('a')

//       const downloadUrl =
//         URL.createObjectURL(blob)

//       link.setAttribute('href', downloadUrl)
//       link.setAttribute('download', filename)
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

//   // --------------------------------------------------
//   // Frontend Search
//   // --------------------------------------------------
//   const filteredData = data.filter((item) => {
//     if (
//       activeSearch.product ||
//       activeSearch.reseller ||
//       activeSearch.center ||
//       activeSearch.startDate ||
//       activeSearch.endDate
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
//               .includes(
//                 searchTerm.toLowerCase(),
//               ),
//         )
//       }

//       return (
//         value &&
//         value
//           .toString()
//           .toLowerCase()
//           .includes(
//             searchTerm.toLowerCase(),
//           )
//       )
//     })
//   })

//   // --------------------------------------------------
//   // Loading
//   // --------------------------------------------------
//   if (loading && data.length === 0) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
//       </div>
//     )
//   }

//   // --------------------------------------------------
//   // Error
//   // --------------------------------------------------
//   if (error) {
//     return (
//       <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

//       {/* =====================================================
//           ONLY EXPORT MODAL OPEN ANIMATION ADDED
//           ===================================================== */}
//       {exportModalVisible && (
//         <>
//           <style>
//             {`
//               @keyframes resellerStockExportSlideDown {
//                 from {
//                   transform: translateY(-100%);
//                   opacity: 0;
//                 }

//                 to {
//                   transform: translateY(0);
//                   opacity: 1;
//                 }
//               }
//             `}
//           </style>

//           <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6 sm:py-8">

//             <div
//               className="flex w-full max-w-[500px] flex-col overflow-hidden rounded-[7px] bg-white shadow-2xl"
//               style={{
//                 animation:
//                   'resellerStockExportSlideDown 0.35s ease-out',
//               }}
//             >

//               {/* Modal Header */}
//               <div className="flex min-h-[63px] shrink-0 items-center justify-between border-b border-[#dee2e6] px-4">

//                 <h3 className="text-[22px] font-normal text-[#343a40]">
//                   Export Reseller Stock Data
//                 </h3>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setExportModalVisible(false)
//                   }
//                   className="flex h-8 w-8 items-center justify-center text-[#888] transition hover:text-[#555]"
//                 >
//                   <X
//                     className="h-[25px] w-[25px]"
//                     strokeWidth={2}
//                   />
//                 </button>

//               </div>

//               {/* Modal Body */}
//               <div className="px-4 py-5">

//                 {/* Start Date */}
//                 <div className="mb-5">

//                   <label
//                     htmlFor="exportStartDate"
//                     className="mb-2 block text-[14px] font-bold text-[#343a40]"
//                   >
//                     Start Date (Optional)
//                   </label>

//                   <input
//                     type="date"
//                     id="exportStartDate"
//                     value={exportStartDate}
//                     onChange={(e) =>
//                       setExportStartDate(
//                         e.target.value,
//                       )
//                     }
//                     className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
//                   />

//                   <p className="mt-1 text-[13px] text-[#6c757d]">
//                     Leave empty to include all records from beginning
//                   </p>

//                 </div>

//                 {/* End Date */}
//                 <div className="mb-5">

//                   <label
//                     htmlFor="exportEndDate"
//                     className="mb-2 block text-[14px] font-bold text-[#343a40]"
//                   >
//                     End Date (Optional)
//                   </label>

//                   <input
//                     type="date"
//                     id="exportEndDate"
//                     value={exportEndDate}
//                     onChange={(e) =>
//                       setExportEndDate(
//                         e.target.value,
//                       )
//                     }
//                     className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
//                   />

//                   <p className="mt-1 text-[13px] text-[#6c757d]">
//                     Leave empty to include all records until today
//                   </p>

//                 </div>

//                 {/* Current Filters */}
//                 {(activeSearch.product ||
//                   activeSearch.reseller ||
//                   activeSearch.center) && (
//                   <div className="rounded-[5px] bg-[#f1f3f5] px-3 py-3 text-[13px] text-[#495057]">

//                     <p className="mb-2 font-bold text-[#343a40]">
//                       Current Filters:
//                     </p>

//                     <ul className="space-y-1">

//                       {activeSearch.reseller && (
//                         <li>
//                           <span className="font-medium">
//                             Reseller:
//                           </span>{' '}
//                           {resellers.find(
//                             (r) =>
//                               r._id ===
//                               activeSearch.reseller,
//                           )?.businessName ||
//                             activeSearch.reseller}
//                         </li>
//                       )}

//                       {activeSearch.center && (
//                         <li>
//                           <span className="font-medium">
//                             Center:
//                           </span>{' '}
//                           {centers.find(
//                             (c) =>
//                               c._id ===
//                               activeSearch.center,
//                           )?.centerName ||
//                             activeSearch.center}
//                         </li>
//                       )}

//                       {activeSearch.product && (
//                         <li>
//                           <span className="font-medium">
//                             Product:
//                           </span>{' '}
//                           {products.find(
//                             (p) =>
//                               p._id ===
//                               activeSearch.product,
//                           )?.productTitle ||
//                             activeSearch.product}
//                         </li>
//                       )}

//                     </ul>

//                   </div>
//                 )}

//               </div>

//               {/* Modal Footer */}
//               <div className="flex shrink-0 justify-end gap-2 border-t border-[#dee2e6] px-4 py-3">

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setExportModalVisible(false)
//                   }
//                   className="h-[38px] rounded-[5px] bg-[#6c757d] px-4 text-[14px] font-medium text-white transition hover:bg-[#5a6268]"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="button"
//                   onClick={generateDetailExport}
//                   className="inline-flex h-[38px] items-center gap-1.5 rounded-[5px] bg-[#5b55d9] px-4 text-[14px] font-medium text-white transition hover:bg-[#4d47c7]"
//                 >
//                   <FileSpreadsheet className="h-[15px] w-[15px]" />
//                   Export
//                 </button>

//               </div>

//             </div>

//           </div>
//         </>
//       )}

//       {/* Page Title */}
//       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//         Reseller Stock
//       </div>

//       {/* Search Modal */}
//       <ResellerStockSearch
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         resellers={resellers}
//         products={products}
//       />

//       {/* Main Card */}
//       <div className="mt-0 overflow-hidden border border-[#e1e5ea] border-t-[4px] border-t-[#2f5fa7] bg-white">

//         {/* Action Toolbar */}
//         <div className="flex min-h-[51px] flex-wrap items-center gap-1 border-b border-[#d9dde3] px-3 py-2">

//           {/* Search */}
//           <button
//             type="button"
//             onClick={() =>
//               setSearchModalVisible(true)
//             }
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
//           >
//             <Search className="h-[16px] w-[16px]" />
//             Search
//           </button>

//           {/* Reset */}
//           {(activeSearch.product ||
//             activeSearch.reseller ||
//             activeSearch.center ||
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
//             disabled={data.length === 0}
//             className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d] disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <FileSpreadsheet className="h-[15px] w-[15px]" />
//             Export
//           </button>

//         </div>

//         {/* Search / Date Row */}
//         <div className="flex min-h-[62px] items-center justify-between px-4 py-3">

//           <div className="min-w-0 text-[13px] text-[#666]">

//             {(activeSearch.startDate ||
//               activeSearch.endDate) && (
//               <div>
//                 {activeSearch.startDate &&
//                   `From: ${activeSearch.startDate} `}

//                 {activeSearch.endDate &&
//                   `To: ${activeSearch.endDate}`}
//               </div>
//             )}

//           </div>

//           <div className="ml-auto flex shrink-0 items-center gap-1.5">

//             <label
//               htmlFor="resellerStockSearch"
//               className="text-[14px] font-bold text-[#202020]"
//             >
//               Search:
//             </label>

//             <input
//               id="resellerStockSearch"
//               type="text"
//               value={searchTerm}
//               onChange={(e) =>
//                 setSearchTerm(e.target.value)
//               }
//               className="h-[30px] w-[220px] border border-[#d5dbe3] bg-white px-2 text-[13px] text-[#222] outline-none focus:border-[#2f5fa7]"
//             />

//           </div>

//         </div>

//         {/* TABLE */}
//         <div className="px-4">

//           <div className="w-full overflow-hidden border border-[#eeeeee]">

//             <div className="max-h-[500px] overflow-x-auto overflow-y-scroll">

//               <table className="w-full min-w-[900px] table-fixed border-collapse">

//                 <colgroup>
//                   <col style={{ width: '19%' }} />
//                   <col style={{ width: '34%' }} />
//                   <col style={{ width: '27%' }} />
//                   <col style={{ width: '9%' }} />
//                   <col style={{ width: '11%' }} />
//                 </colgroup>

//                 <thead className="sticky top-0 z-20">

//                   <tr>

//                     {/* Reseller */}
//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort(
//                           'resellerName',
//                         )
//                       }
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Reseller</span>

//                         {getSortIcon(
//                           'resellerName',
//                         )}
//                       </div>
//                     </th>

//                     {/* Product */}
//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort(
//                           'productName',
//                         )
//                       }
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Product</span>

//                         {getSortIcon(
//                           'productName',
//                         )}
//                       </div>
//                     </th>

//                     {/* Category */}
//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort(
//                           'productCategory.name',
//                         )
//                       }
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Category</span>

//                         {getSortIcon(
//                           'productCategory.name',
//                         )}
//                       </div>
//                     </th>

//                     {/* Available */}
//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort(
//                           'availableQuantity',
//                         )
//                       }
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>Available</span>

//                         {getSortIcon(
//                           'availableQuantity',
//                         )}
//                       </div>
//                     </th>

//                     {/* Consumed */}
//                     <th
//                       scope="col"
//                       onClick={() =>
//                         handleSort(
//                           'consumedQuantity',
//                         )
//                       }
//                       className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//                     >
//                       <div className="flex min-w-max items-center gap-1">
//                         <span>Consumed</span>

//                         {getSortIcon(
//                           'consumedQuantity',
//                         )}
//                       </div>
//                     </th>

//                   </tr>

//                 </thead>

//                 <tbody>

//                   {filteredData.length > 0 ? (

//                     filteredData.map(
//                       (item, index) => (
//                         <tr
//                           key={item._id}
//                           className={`transition ${
//                             index % 2 === 0
//                               ? 'bg-[#f1f1f1]'
//                               : 'bg-white'
//                           }`}
//                         >

//                           <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                             <div className="break-words">
//                               {item.resellerName || ''}
//                             </div>
//                           </td>

//                           <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                             <div className="break-words">
//                               {item.productName || ''}
//                             </div>
//                           </td>

//                           <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                             <div className="break-words">
//                               {item.productCategory?.name || ''}
//                             </div>
//                           </td>

//                           <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                             {item.displayQuantity || 0}
//                           </td>

//                           <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                             {item.displayConsumed || 0}
//                           </td>

//                         </tr>
//                       ),
//                     )

//                   ) : (

//                     <tr>

//                       <td
//                         colSpan={5}
//                         className="px-4 py-10 text-center text-sm text-gray-500"
//                       >
//                         {loading ? (
//                           <div className="flex justify-center">
//                             <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
//                           </div>
//                         ) : (
//                           'No data found. Try adjusting your search filters.'
//                         )}
//                       </td>

//                     </tr>

//                   )}

//                 </tbody>

//               </table>

//             </div>

//           </div>

//         </div>

//         {/* Bottom Pagination / Summary */}
//         <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e1e5ea] px-4 py-3">

//           <div>

//             {data.length > 0 && (
//               <p className="text-[13px] text-[#666]">
//                 Showing {filteredData.length} of{' '}
//                 {data.length} items
//                 {totalPages > 1 &&
//                   ` | Page ${currentPage} of ${totalPages}`}
//               </p>
//             )}

//           </div>

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

// export default ResellerStock






import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import Pagination from '../../utils/Pagination'
import { showError, showSuccess } from '../../utils/sweetAlerts'
import ResellerStockSearch from './ResellerStockSearch'

const ResellerStock = () => {
  const [data, setData] = useState([])
  const [resellers, setResellers] = useState([])
  const [products, setProducts] = useState([])

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
    reseller: '',
    center: '',
    startDate: '',
    endDate: '',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [centers, setCenters] = useState([])

  const dropdownRefs = useRef({})

  // --------------------------------------------------
  // Fetch Reseller Stock
  // --------------------------------------------------
  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (searchParams.product) {
        params.append('product', searchParams.product)
      }

      if (searchParams.reseller) {
        params.append('reseller', searchParams.reseller)
      }

      if (searchParams.center) {
        params.append('sourceCenter', searchParams.center)
      }

      if (searchParams.fromCenter) {
        params.append('fromCenter', searchParams.fromCenter)
      }

      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate)
      }

      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate)
      }

      params.append('page', page)

      const url = params.toString()
        ? `/availableStock/reseller?${params.toString()}`
        : '/availableStock/reseller'

      const response = await axiosInstance.get(url)

      if (response.data.success) {
        const stock = Array.isArray(response.data?.data?.stock)
          ? response.data.data.stock
          : Array.isArray(response.data?.data)
            ? response.data.data
            : []

        setData(stock)

        setCurrentPage(
          response.data.data.pagination?.currentPage || 1,
        )

        setTotalPages(
          response.data.data.pagination?.totalPages || 1,
        )

        if (response.data.data.center) {
          setCenters([response.data.data.center])
        } else if (response.data.data.sourceCenter) {
          setCenters([response.data.data.sourceCenter])
        } else {
          setCenters([])
        }
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

        console.error(
          'Error response:',
          err.response.data,
        )
      } else if (err.request) {
        setError(
          'No response received from server. Please check your network connection.',
        )

        console.error('Error request:', err.request)
      } else {
        setError(
          err.message ||
            'An error occurred while fetching data',
        )

        console.error('Error message:', err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // --------------------------------------------------
  // Fetch Resellers
  // --------------------------------------------------
  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers')

      if (response.data.success) {
        setResellers(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching resellers:', error)
    }
  }

  // --------------------------------------------------
  // Fetch Products
  // --------------------------------------------------
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

  useEffect(() => {
    fetchData()
    fetchResellers()
    fetchProducts()
  }, [])

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return
    }

    fetchData(activeSearch, page)
  }

  // --------------------------------------------------
  // Category helpers
  // --------------------------------------------------
  // The reseller-stock API returns product.productCategory as an ID.
  // /products/all may return that category as a populated object, so
  // resolve the category name through the matching product when possible.
  const getCategoryName = (item) => {
    const readCategoryName = (category) => {
      if (!category) return ''

      if (typeof category === 'string' || typeof category === 'number') {
        return ''
      }

      return (
        category.name ||
        category.categoryName ||
        category.productCategoryName ||
        category.title ||
        ''
      )
    }

    const directCategory =
      item?.productCategory ?? item?.product?.productCategory

    const directName = readCategoryName(directCategory)
    if (directName) return directName

    const productId =
      item?.product?._id ?? item?.productId ?? item?.product?._id

    const matchedProduct = products.find(
      (product) => String(product?._id) === String(productId),
    )

    const matchedCategory =
      matchedProduct?.productCategory ?? matchedProduct?.category

    const matchedName = readCategoryName(matchedCategory)
    if (matchedName) return matchedName

    // Some APIs return the category only as an ID. Show that ID rather
    // than an empty cell; a human-readable name requires a populated
    // category from the backend or a categories lookup endpoint.
    if (typeof directCategory === 'string' || typeof directCategory === 'number') {
      const categoryId = String(directCategory)
      const categoryFromProducts = products.find((product) => {
        const category = product?.productCategory ?? product?.category
        return (
          category &&
          typeof category === 'object' &&
          String(category._id ?? category.id) === categoryId
        )
      })
      const categoryName = readCategoryName(
        categoryFromProducts?.productCategory ?? categoryFromProducts?.category,
      )
      return categoryName || categoryId
    }

    const matchedCategoryId =
      typeof matchedCategory === 'string' || typeof matchedCategory === 'number'
        ? String(matchedCategory)
        : ''

    return matchedCategoryId || 'N/A'
  }

  const getNestedValue = (object, path) => {
    if (path === 'productCategory.name' || path === 'productCategory') {
      return getCategoryName(object)
    }

    return path
      .split('.')
      .reduce(
        (current, key) => current?.[key],
        object,
      )
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

    const sortedData = [...data].sort((a, b) => {
      let aValue = getNestedValue(a, key)
      let bValue = getNestedValue(b, key)

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
      }

      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase()
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
    if (sortConfig.key !== key) {
      return null
    }

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp className="ml-1 inline-block h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 inline-block h-4 w-4" />
    )
  }

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const handleSearch = (searchData) => {
    setActiveSearch(searchData)
    fetchData(searchData, 1)
  }

  // --------------------------------------------------
  // Reset Search
  // --------------------------------------------------
  const handleResetSearch = () => {
    const resetData = {
      product: '',
      reseller: '',
      center: '',
      startDate: '',
      endDate: '',
    }

    setActiveSearch(resetData)
    setSearchTerm('')
    setCenters([])

    fetchData({}, 1)
  }

  // --------------------------------------------------
  // Export Modal
  // --------------------------------------------------
  const openExportModal = () => {
    setExportStartDate(activeSearch.startDate || '')
    setExportEndDate(activeSearch.endDate || '')

    setExportModalVisible(true)
  }

  // --------------------------------------------------
  // Generate Export
  // --------------------------------------------------
  const generateDetailExport = async () => {
    try {
      setLoading(true)

      if (
        exportStartDate &&
        exportEndDate &&
        exportStartDate > exportEndDate
      ) {
        showError(
          'Start date cannot be greater than end date',
        )

        setLoading(false)
        return
      }

      const params = new URLSearchParams()

      if (activeSearch.product) {
        params.append(
          'product',
          activeSearch.product,
        )
      }

      if (activeSearch.reseller) {
        params.append(
          'reseller',
          activeSearch.reseller,
        )
      }

      if (activeSearch.center) {
        params.append(
          'sourceCenter',
          activeSearch.center,
        )
      }

      if (exportStartDate) {
        params.append(
          'startDate',
          exportStartDate,
        )
      }

      if (exportEndDate) {
        params.append(
          'endDate',
          exportEndDate,
        )
      }

      params.append('exportData', 'true')

      const apiUrl = params.toString()
        ? `/availableStock/reseller?${params.toString()}`
        : '/availableStock/reseller'

      const response = await axiosInstance.get(apiUrl)

      if (!response.data.success) {
        throw new Error(
          'API returned unsuccessful response',
        )
      }

      const exportData =
        response.data.data.stock || []

      if (exportData.length === 0) {
        showError('No data available for export')
        return
      }

      const headers = [
        'Reseller',
        'Product',
        'Category',
        'Available Quantity',
        'Consumed Quantity',
      ]

      const csvData = exportData.map((item) => {
        const displayQty =
          item.displayQuantity !== undefined &&
          item.displayQuantity !== null
            ? item.displayQuantity
            : 0

        const displayConsumed =
          item.displayConsumed !== undefined &&
          item.displayConsumed !== null
            ? item.displayConsumed
            : 0

        return [
          item.resellerName || '',
          item.productName || '',
          getCategoryName(item),
          displayQty,
          displayConsumed,
        ]
      })

      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          row
            .map((field) => {
              let stringField

              if (
                field === undefined ||
                field === null
              ) {
                stringField = '0'
              } else if (
                typeof field === 'number'
              ) {
                stringField = String(field)
              } else {
                stringField = String(field || '')
              }

              return `"${stringField.replace(
                /"/g,
                '""',
              )}"`
            })
            .join(','),
        ),
      ].join('\n')

      let filename = 'reseller_stock_export'

      if (
        exportStartDate &&
        exportEndDate
      ) {
        filename += `_${exportStartDate}_to_${exportEndDate}`
      } else if (exportStartDate) {
        filename += `_from_${exportStartDate}`
      } else if (exportEndDate) {
        filename += `_until_${exportEndDate}`
      } else {
        filename += `_${new Date()
          .toISOString()
          .split('T')[0]}`
      }

      filename += '.csv'

      const blob = new Blob(
        ['\uFEFF' + csvContent],
        {
          type: 'text/csv;charset=utf-8;',
        },
      )

      const link = document.createElement('a')

      const downloadUrl =
        URL.createObjectURL(blob)

      link.setAttribute('href', downloadUrl)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)

      URL.revokeObjectURL(downloadUrl)

      showSuccess(
        'Export completed successfully!',
      )

      setExportModalVisible(false)

      setExportStartDate('')
      setExportEndDate('')
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

  // --------------------------------------------------
  // Frontend Search
  // --------------------------------------------------
  const filteredData = data.filter((item) => {
    if (
      activeSearch.product ||
      activeSearch.reseller ||
      activeSearch.center ||
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
              .includes(
                searchTerm.toLowerCase(),
              ),
        )
      }

      return (
        value &&
        value
          .toString()
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase(),
          )
      )
    })
  })

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading && data.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

      {/* =====================================================
          ONLY EXPORT MODAL OPEN ANIMATION ADDED
          ===================================================== */}
      {exportModalVisible && (
        <>
          <style>
            {`
              @keyframes resellerStockExportSlideDown {
                from {
                  transform: translateY(-100%);
                  opacity: 0;
                }

                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
            `}
          </style>

          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6 sm:py-8">

            <div
              className="flex w-full max-w-[500px] flex-col overflow-hidden rounded-[7px] bg-white shadow-2xl"
              style={{
                animation:
                  'resellerStockExportSlideDown 0.35s ease-out',
              }}
            >

              {/* Modal Header */}
              <div className="flex min-h-[63px] shrink-0 items-center justify-between border-b border-[#dee2e6] px-4">

                <h3 className="text-[22px] font-normal text-[#343a40]">
                  Export Reseller Stock Data
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setExportModalVisible(false)
                  }
                  className="flex h-8 w-8 items-center justify-center text-[#888] transition hover:text-[#555]"
                >
                  <X
                    className="h-[25px] w-[25px]"
                    strokeWidth={2}
                  />
                </button>

              </div>

              {/* Modal Body */}
              <div className="px-4 py-5">

                {/* Start Date */}
                <div className="mb-5">

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
                      setExportStartDate(
                        e.target.value,
                      )
                    }
                    className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                  />

                  <p className="mt-1 text-[13px] text-[#6c757d]">
                    Leave empty to include all records from beginning
                  </p>

                </div>

                {/* End Date */}
                <div className="mb-5">

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
                      setExportEndDate(
                        e.target.value,
                      )
                    }
                    className="h-[38px] w-full rounded-[5px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                  />

                  <p className="mt-1 text-[13px] text-[#6c757d]">
                    Leave empty to include all records until today
                  </p>

                </div>

                {/* Current Filters */}
                {(activeSearch.product ||
                  activeSearch.reseller ||
                  activeSearch.center) && (
                  <div className="rounded-[5px] bg-[#f1f3f5] px-3 py-3 text-[13px] text-[#495057]">

                    <p className="mb-2 font-bold text-[#343a40]">
                      Current Filters:
                    </p>

                    <ul className="space-y-1">

                      {activeSearch.reseller && (
                        <li>
                          <span className="font-medium">
                            Reseller:
                          </span>{' '}
                          {resellers.find(
                            (r) =>
                              r._id ===
                              activeSearch.reseller,
                          )?.businessName ||
                            activeSearch.reseller}
                        </li>
                      )}

                      {activeSearch.center && (
                        <li>
                          <span className="font-medium">
                            Center:
                          </span>{' '}
                          {centers.find(
                            (c) =>
                              c._id ===
                              activeSearch.center,
                          )?.centerName ||
                            activeSearch.center}
                        </li>
                      )}

                      {activeSearch.product && (
                        <li>
                          <span className="font-medium">
                            Product:
                          </span>{' '}
                          {products.find(
                            (p) =>
                              p._id ===
                              activeSearch.product,
                          )?.productTitle ||
                            activeSearch.product}
                        </li>
                      )}

                    </ul>

                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="flex shrink-0 justify-end gap-2 border-t border-[#dee2e6] px-4 py-3">

                <button
                  type="button"
                  onClick={() =>
                    setExportModalVisible(false)
                  }
                  className="h-[38px] rounded-[5px] bg-[#6c757d] px-4 text-[14px] font-medium text-white transition hover:bg-[#5a6268]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={generateDetailExport}
                  className="inline-flex h-[38px] items-center gap-1.5 rounded-[5px] bg-[#5b55d9] px-4 text-[14px] font-medium text-white transition hover:bg-[#4d47c7]"
                >
                  <FileSpreadsheet className="h-[15px] w-[15px]" />
                  Export
                </button>

              </div>

            </div>

          </div>
        </>
      )}

      {/* Page Title */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Reseller Stock
      </div>

      {/* Search Modal */}
      <ResellerStockSearch
        visible={searchModalVisible}
        onClose={() =>
          setSearchModalVisible(false)
        }
        onSearch={handleSearch}
        resellers={resellers}
        products={products}
      />

      {/* Main Card */}
      <div className="mt-0 overflow-hidden border border-[#e1e5ea] border-t-[4px] border-t-[#2f5fa7] bg-white">

        {/* Action Toolbar */}
        <div className="flex min-h-[51px] flex-wrap items-center gap-1 border-b border-[#d9dde3] px-3 py-2">

          {/* Search */}
          <button
            type="button"
            onClick={() =>
              setSearchModalVisible(true)
            }
            className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d]"
          >
            <Search className="h-[16px] w-[16px]" />
            Search
          </button>

          {/* Reset */}
          {(activeSearch.product ||
            activeSearch.reseller ||
            activeSearch.center ||
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
            disabled={data.length === 0}
            className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[13px] font-bold text-white transition hover:bg-[#264f8d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet className="h-[15px] w-[15px]" />
            Export
          </button>

        </div>

        {/* Search / Date Row */}
        <div className="flex min-h-[62px] items-center justify-between px-4 py-3">

          <div className="min-w-0 text-[13px] text-[#666]">

            {(activeSearch.startDate ||
              activeSearch.endDate) && (
              <div>
                {activeSearch.startDate &&
                  `From: ${activeSearch.startDate} `}

                {activeSearch.endDate &&
                  `To: ${activeSearch.endDate}`}
              </div>
            )}

          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5">

            <label
              htmlFor="resellerStockSearch"
              className="text-[14px] font-bold text-[#202020]"
            >
              Search:
            </label>

            <input
              id="resellerStockSearch"
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="h-[30px] w-[220px] border border-[#d5dbe3] bg-white px-2 text-[13px] text-[#222] outline-none focus:border-[#2f5fa7]"
            />

          </div>

        </div>

        {/* TABLE */}
        <div className="px-4">

          <div className="w-full overflow-hidden border border-[#eeeeee]">

            <div className="max-h-[500px] overflow-x-auto overflow-y-scroll">

              <table className="w-full min-w-[900px] table-fixed border-collapse">

                <colgroup>
                  <col style={{ width: '19%' }} />
                  <col style={{ width: '34%' }} />
                  <col style={{ width: '27%' }} />
                  <col style={{ width: '9%' }} />
                  <col style={{ width: '11%' }} />
                </colgroup>

                <thead className="sticky top-0 z-20">

                  <tr>

                    {/* Reseller */}
                    <th
                      scope="col"
                      onClick={() =>
                        handleSort(
                          'resellerName',
                        )
                      }
                      className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
                    >
                      <div className="flex items-center gap-1">
                        <span>Reseller</span>

                        {getSortIcon(
                          'resellerName',
                        )}
                      </div>
                    </th>

                    {/* Product */}
                    <th
                      scope="col"
                      onClick={() =>
                        handleSort(
                          'productName',
                        )
                      }
                      className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
                    >
                      <div className="flex items-center gap-1">
                        <span>Product</span>

                        {getSortIcon(
                          'productName',
                        )}
                      </div>
                    </th>

                    {/* Category */}
                    <th
                      scope="col"
                      onClick={() =>
                        handleSort(
                          'productCategory.name',
                        )
                      }
                      className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
                    >
                      <div className="flex items-center gap-1">
                        <span>Category</span>

                        {getSortIcon(
                          'productCategory.name',
                        )}
                      </div>
                    </th>

                    {/* Available */}
                    <th
                      scope="col"
                      onClick={() =>
                        handleSort(
                          'availableQuantity',
                        )
                      }
                      className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
                    >
                      <div className="flex items-center gap-1">
                        <span>Available</span>

                        {getSortIcon(
                          'availableQuantity',
                        )}
                      </div>
                    </th>

                    {/* Consumed */}
                    <th
                      scope="col"
                      onClick={() =>
                        handleSort(
                          'consumedQuantity',
                        )
                      }
                      className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
                    >
                      <div className="flex min-w-max items-center gap-1">
                        <span>Consumed</span>

                        {getSortIcon(
                          'consumedQuantity',
                        )}
                      </div>
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredData.length > 0 ? (

                    filteredData.map(
                      (item, index) => (
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
                              {item.resellerName || item.reseller?.businessName || ''}
                            </div>
                          </td>

                          <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                            <div className="break-words">
                              {item.productName || item.product?.productTitle || ''}
                            </div>
                          </td>

                          <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                            <div className="break-words">
                              {getCategoryName(item)}
                            </div>
                          </td>

                          <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                            {item.displayQuantity ?? item.availableQuantity ?? 0}
                          </td>

                          <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                            {item.displayConsumed ?? item.consumedQuantity ?? 0}
                          </td>

                        </tr>
                      ),
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-sm text-gray-500"
                      >
                        {loading ? (
                          <div className="flex justify-center">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                          </div>
                        ) : (
                          'No data found. Try adjusting your search filters.'
                        )}
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {/* Bottom Pagination / Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e1e5ea] px-4 py-3">

          <div>

            {data.length > 0 && (
              <p className="text-[13px] text-[#666]">
                Showing {filteredData.length} of{' '}
                {data.length} items
                {totalPages > 1 &&
                  ` | Page ${currentPage} of ${totalPages}`}
              </p>
            )}

          </div>

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

export default ResellerStock