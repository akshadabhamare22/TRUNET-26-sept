// import React, { useEffect, useState } from "react";
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   Info,
//   RotateCcw,
//   Search,
//   X,
// } from "lucide-react";

// import axiosInstance from "../../axiosInstance";import Pagination from "../../utils/Pagination";
// import { showError } from "../../utils/sweetAlerts";
// import ResellerQtySearch from "./ResellerQtySearch";

// const ResellerStock = () => {
//   const [data, setData] = useState([]);
//   const [flattenedData, setFlattenedData] = useState([]);
//   const [resellers, setResellers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchModalVisible, setSearchModalVisible] = useState(false);

//   const [activeSearch, setActiveSearch] = useState({
//     reseller: "",
//     product: "",
//     center: "",
//     startDate: "",
//     endDate: "",
//     status: "Completed",
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [centers, setCenters] = useState([]);

//   const [stats, setStats] = useState({
//     totalResellers: 0,
//     totalForwardedQty: 0,
//   });

//   // --------------------------------------------------
//   // Fetch Data
//   // --------------------------------------------------
//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();

//       if (searchParams.reseller) {
//         params.append("resellerId", searchParams.reseller);
//       }

//       if (searchParams.center) {
//         params.append("center", searchParams.center);
//       }

//       if (searchParams.product) {
//         params.append("product", searchParams.product);
//       }

//       if (searchParams.startDate) {
//         params.append("startDate", searchParams.startDate);
//       }

//       if (searchParams.endDate) {
//         params.append("endDate", searchParams.endDate);
//       }

//       if (searchParams.status) {
//         params.append("status", searchParams.status);
//       }

//       params.append("page", page);

//       const url = params.toString()
//         ? `/resellerStock/reseller-forwarded-qty?${params.toString()}`
//         : "/resellerStock/reseller-forwarded-qty";

//       console.log("Fetching from URL:", url);

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         let apiData = [];

//         if (Array.isArray(response.data.data)) {
//           apiData = response.data.data;
//         } else if (
//           response.data.data &&
//           typeof response.data.data === "object"
//         ) {
//           apiData = [response.data.data];
//         }

//         setData(apiData);

//         // Flatten data for table
//         const flattened = [];

//         apiData.forEach((reseller) => {
//           if (
//             reseller.products &&
//             reseller.products.length > 0
//           ) {
//             reseller.products.forEach((product) => {
//               const centersList = Object.values(
//                 product.centers || {}
//               )
//                 .map(
//                   (center) =>
//                     `${center.centerName} (${center.forwardedQty})`
//                 )
//                 .join(", ");

//               const centersCount = Object.keys(
//                 product.centers || {}
//               ).length;

//               flattened.push({
//                 _id: `${reseller.resellerId}_${product.productId}`,
//                 resellerId: reseller.resellerId,
//                 resellerName: reseller.resellerName,
//                 resellerEmail: reseller.resellerEmail,
//                 resellerMobile: reseller.resellerMobile,
//                 productId: product.productId,
//                 productName: product.productName,
//                 productCode: product.productCode,
//                 availableQuantity:
//                   product.totalForwardedQty,
//                 displayQuantity:
//                   product.totalForwardedQty,
//                 orderCount: product.orderCount,
//                 centers: product.centers || {},
//                 centersCount,
//                 centersList,
//               });
//             });
//           }
//         });

//         setFlattenedData(flattened);

//         if (response.data.pagination) {
//           setCurrentPage(
//             response.data.pagination.currentPage
//           );
//           setTotalPages(
//             response.data.pagination.totalPages
//           );
//         }

//         setStats(response.data.stats || {});
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
//         console.error(
//           "Error response:",
//           err.response.data
//         );
//       } else if (err.request) {
//         setError(
//           "No response received from server. Please check your network connection."
//         );
//         console.error("Error request:", err.request);
//       } else {
//         setError(
//           err.message ||
//             "An error occurred while fetching data"
//         );
//         console.error("Error message:", err.message);
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
//       const response = await axiosInstance.get("/resellers");

//       if (response.data.success) {
//         setResellers(response.data.data || []);
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
//       const response = await axiosInstance.get(
//         "/products/all"
//       );

//       if (response.data.success) {
//         setProducts(response.data.data || []);
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

//     const sortedData = [...flattenedData].sort(
//       (a, b) => {
//         let aValue = a[key] || 0;
//         let bValue = b[key] || 0;

//         if (typeof aValue === "string") {
//           aValue = aValue.toLowerCase();
//         }

//         if (typeof bValue === "string") {
//           bValue = bValue.toLowerCase();
//         }

//         if (aValue < bValue) {
//           return direction === "ascending" ? -1 : 1;
//         }

//         if (aValue > bValue) {
//           return direction === "ascending" ? 1 : -1;
//         }

//         return 0;
//       }
//     );

//     setFlattenedData(sortedData);
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null;
//     }

//     return sortConfig.direction === "ascending" ? (
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
//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData);
//     fetchData(searchData, 1);
//   };

//   // --------------------------------------------------
//   // Reset Search
//   // --------------------------------------------------
//   const handleResetSearch = () => {
//     const resetData = {
//       reseller: "",
//       product: "",
//       center: "",
//       startDate: "",
//       endDate: "",
//       status: "Completed",
//     };

//     setActiveSearch(resetData);
//     setSearchTerm("");

//     fetchData({}, 1);
//   };

//   // --------------------------------------------------
//   // Client-side Search
//   // --------------------------------------------------
//   const filteredData = flattenedData.filter(
//     (item) => {
//       if (searchTerm) {
//         const searchLower =
//           searchTerm.toLowerCase();

//         return (
//           (item.resellerName &&
//             item.resellerName
//               .toLowerCase()
//               .includes(searchLower)) ||
//           (item.productName &&
//             item.productName
//               .toLowerCase()
//               .includes(searchLower)) ||
//           (item.productCode &&
//             item.productCode
//               .toLowerCase()
//               .includes(searchLower))
//         );
//       }

//       return true;
//     }
//   );

//   // --------------------------------------------------
//   // Export
//   // --------------------------------------------------
//   const generateExport = async () => {
//     try {
//       setLoading(true);

//       const params = new URLSearchParams();

//       if (activeSearch.reseller) {
//         params.append(
//           "resellerId",
//           activeSearch.reseller
//         );
//       }

//       if (activeSearch.center) {
//         params.append(
//           "center",
//           activeSearch.center
//         );
//       }

//       if (activeSearch.product) {
//         params.append(
//           "product",
//           activeSearch.product
//         );
//       }

//       if (activeSearch.startDate) {
//         params.append(
//           "startDate",
//           activeSearch.startDate
//         );
//       }

//       if (activeSearch.endDate) {
//         params.append(
//           "endDate",
//           activeSearch.endDate
//         );
//       }

//       if (activeSearch.status) {
//         params.append(
//           "status",
//           activeSearch.status
//         );
//       }

//       params.append("export", "true");

//       const apiUrl = params.toString()
//         ? `/resellerStock/reseller-forwarded-qty?${params.toString()}`
//         : "/resellerStock/reseller-forwarded-qty";

//       const response =
//         await axiosInstance.get(apiUrl);

//       if (!response.data.success) {
//         throw new Error(
//           "API returned unsuccessful response"
//         );
//       }

//       let exportData = [];

//       if (Array.isArray(response.data.data)) {
//         exportData = response.data.data;
//       } else if (
//         response.data.data &&
//         typeof response.data.data === "object"
//       ) {
//         exportData = [response.data.data];
//       }

//       const flattenedExport = [];

//       exportData.forEach((reseller) => {
//         if (
//           reseller.products &&
//           reseller.products.length > 0
//         ) {
//           reseller.products.forEach((product) => {
//             const centersFormatted = Object.values(
//               product.centers || {}
//             )
//               .map(
//                 (center) =>
//                   `${center.centerName} (${center.forwardedQty})`
//               )
//               .join("; ");

//             flattenedExport.push({
//               resellerName:
//                 reseller.resellerName,
//               resellerEmail:
//                 reseller.resellerEmail,
//               productName:
//                 product.productName,
//               productCode:
//                 product.productCode,
//               quantity:
//                 product.totalForwardedQty,
//               orderCount:
//                 product.orderCount,
//               centers:
//                 centersFormatted,
//               centersCount:
//                 Object.keys(
//                   product.centers || {}
//                 ).length,
//             });
//           });
//         }
//       });

//       if (flattenedExport.length === 0) {
//         showError(
//           "No data available for export"
//         );
//         return;
//       }

//       const headers = [
//         "Reseller Name",
//         "Product Name",
//         "Forwarded Quantity",
//         "Order Count",
//         "Centers Count",
//         "Centers (with quantity)",
//       ];

//       const csvData = flattenedExport.map(
//         (item) => [
//           item.resellerName || "",
//           item.productName || "",
//           item.quantity || 0,
//           item.orderCount || 0,
//           item.centersCount || 0,
//           item.centers || "",
//         ]
//       );

//       const csvContent = [
//         headers.join(","),
//         ...csvData.map((row) =>
//           row
//             .map(
//               (field) =>
//                 `"${String(field || "").replace(
//                   /"/g,
//                   '""'
//                 )}"`
//             )
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
//       const downloadUrl =
//         URL.createObjectURL(blob);

//       const filterText = [];

//       if (activeSearch.reseller) {
//         const reseller = resellers.find(
//           (r) =>
//             r._id === activeSearch.reseller
//         );

//         if (reseller) {
//           filterText.push(
//             reseller.businessName
//           );
//         }
//       }

//       const filename = `reseller_forwarded_qty_${
//         filterText.length > 0
//           ? filterText.join("_") + "_"
//           : ""
//       }${new Date()
//         .toISOString()
//         .split("T")[0]}.csv`;

//       link.setAttribute(
//         "href",
//         downloadUrl
//       );
//       link.setAttribute(
//         "download",
//         filename
//       );
//       link.style.visibility = "hidden";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       URL.revokeObjectURL(downloadUrl);
//     } catch (error) {
//       console.error(
//         "Error generating export:",
//         error
//       );

//       showError(
//         "Error generating export file"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Center Details
//   // --------------------------------------------------
//   const renderCenterDetails = (centerData) => {
//     if (
//       !centerData ||
//       Object.keys(centerData).length === 0
//     ) {
//       return (
//         <span className="text-gray-400">
//           No centers
//         </span>
//       );
//     }

//     return (
//       <div className="group relative inline-block">
//         <button
//           type="button"
//           className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
//         >
//           <Info size={16} />
//           {Object.keys(centerData).length} centers
//         </button>

//         <div className="invisible absolute bottom-full right-0 z-30 mb-2 w-80 rounded-lg border border-gray-200 bg-white p-3 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
//           <div className="mb-2 text-sm font-semibold text-gray-700">
//             Center Details
//           </div>

//           <div className="max-h-60 space-y-2 overflow-y-auto">
//             {Object.values(centerData).map(
//               (center, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between gap-3 rounded-md bg-gray-50 px-3 py-2"
//                 >
//                   <span className="text-sm text-gray-700">
//                     {center.centerName} (
//                     {center.centerCode})
//                   </span>

//                   <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
//                     {center.forwardedQty}
//                   </span>
//                 </div>
//               )
//             )}
//           </div>

//           <div className="absolute right-5 top-full h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
//         </div>
//       </div>
//     );
//   };

//   // --------------------------------------------------
//   // Initial Loading
//   // --------------------------------------------------
//   if (
//     loading &&
//     flattenedData.length === 0
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
//           Reseller Forwarded Quantity Report
//         </h1>
//       </div>

//       {/* Search Modal */}
//       <ResellerQtySearch
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         resellers={resellers}
//         products={products}
//       />

//       {/* Main Card */}
//       <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-5 py-4">
//           <div className="flex flex-wrap items-center gap-2">
//             {/* Search */}
//             <button
//               type="button"
//               onClick={() =>
//                 setSearchModalVisible(true)
//               }
//               className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//             >
//               <Search size={16} />
//               Search
//             </button>

//             {/* Reset */}
//             {(activeSearch.reseller ||
//               activeSearch.startDate) && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex items-center gap-2 rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
//               >
//                 <RotateCcw size={16} />
//                 Reset Search
//               </button>
//             )}

//             {/* Export */}
//             <button
//               type="button"
//               onClick={generateExport}
//               disabled={
//                 flattenedData.length === 0
//               }
//               className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Download size={16} />
//               Export
//             </button>
//           </div>

//           {/* Pagination */}
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
//             <div className="flex items-center gap-2">
//               <label
//                 htmlFor="resellerSearch"
//                 className="text-sm font-medium text-gray-600"
//               >
//                 Search:
//               </label>

//               <input
//                 id="resellerSearch"
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) =>
//                   setSearchTerm(e.target.value)
//                 }
//                 className="h-8 w-full max-w-[350px] rounded-none border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="w-full overflow-x-auto">
//             <table className="min-w-[900px] w-full border-collapse text-sm">
//               <thead>
//                 <tr className="bg-gray-100 text-left">
//                   <th
//                     onClick={() =>
//                       handleSort("resellerName")
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Reseller{" "}
//                     {getSortIcon("resellerName")}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort("productName")
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Product{" "}
//                     {getSortIcon("productName")}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort("productCode")
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Product Code{" "}
//                     {getSortIcon("productCode")}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "availableQuantity"
//                       )
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Forwarded Quantity{" "}
//                     {getSortIcon(
//                       "availableQuantity"
//                     )}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort("orderCount")
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Orders{" "}
//                     {getSortIcon("orderCount")}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort("centersCount")
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Centers{" "}
//                     {getSortIcon("centersCount")}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length > 0 ? (
//                   filteredData.map((item) => (
//                     <tr
//                       key={item._id}
//                       className="hover:bg-gray-50"
//                     >
//                       <td className="border border-gray-200 px-4 py-3">
//                         {item.resellerName || ""}
//                       </td>

//                       <td className="border border-gray-200 px-4 py-3">
//                         {item.productName || ""}
//                       </td>

//                       <td className="border border-gray-200 px-4 py-3">
//                         {item.productCode || ""}
//                       </td>

//                       <td className="border border-gray-200 px-4 py-3">
//                         {item.displayQuantity || 0}
//                       </td>

//                       <td className="border border-gray-200 px-4 py-3">
//                         {item.orderCount || 0}
//                       </td>

//                       <td className="border border-gray-200 px-4 py-3">
//                         {renderCenterDetails(
//                           item.centers
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={6}
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
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResellerStock;









// import React, { useEffect, useState } from 'react'
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   Info,
//   RotateCcw,
//   Search,
// } from 'lucide-react'

// import axiosInstance from '../../axiosInstance'
// import Pagination from '../../utils/Pagination'
// import { showError } from '../../utils/sweetAlerts'
// import ResellerQtySearch from './ResellerQtySearch'

// const ResellerStock = () => {
//   const [data, setData] = useState([])
//   const [flattenedData, setFlattenedData] = useState([])
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

//   const [activeSearch, setActiveSearch] = useState({
//     reseller: '',
//     product: '',
//     center: '',
//     startDate: '',
//     endDate: '',
//     status: 'Completed',
//   })

//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const [stats, setStats] = useState({
//     totalResellers: 0,
//     totalForwardedQty: 0,
//   })

//   // ============================================================
//   // FETCH DATA
//   // ============================================================
//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true)
//       setError(null)

//       const params = new URLSearchParams()

//       if (searchParams.reseller) {
//         params.append('resellerId', searchParams.reseller)
//       }

//       if (searchParams.center) {
//         params.append('center', searchParams.center)
//       }

//       if (searchParams.product) {
//         params.append('product', searchParams.product)
//       }

//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate)
//       }

//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate)
//       }

//       if (searchParams.status) {
//         params.append('status', searchParams.status)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/resellerStock/reseller-forwarded-qty?${params.toString()}`
//         : '/resellerStock/reseller-forwarded-qty'

//       console.log('Fetching from URL:', url)

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         let apiData = []

//         if (Array.isArray(response.data.data)) {
//           apiData = response.data.data
//         } else if (
//           response.data.data &&
//           typeof response.data.data === 'object'
//         ) {
//           apiData = [response.data.data]
//         }

//         setData(apiData)

//         const flattened = []

//         apiData.forEach((reseller) => {
//           if (
//             reseller.products &&
//             reseller.products.length > 0
//           ) {
//             reseller.products.forEach((product) => {
//               const centersList = Object.values(
//                 product.centers || {},
//               )
//                 .map(
//                   (center) =>
//                     `${center.centerName} (${center.forwardedQty})`,
//                 )
//                 .join(', ')

//               const centersCount = Object.keys(
//                 product.centers || {},
//               ).length

//               flattened.push({
//                 _id: `${reseller.resellerId}_${product.productId}`,
//                 resellerId: reseller.resellerId,
//                 resellerName: reseller.resellerName,
//                 resellerEmail: reseller.resellerEmail,
//                 resellerMobile: reseller.resellerMobile,
//                 productId: product.productId,
//                 productName: product.productName,
//                 productCode: product.productCode,
//                 availableQuantity:
//                   product.totalForwardedQty,
//                 displayQuantity:
//                   product.totalForwardedQty,
//                 orderCount: product.orderCount,
//                 centers: product.centers || {},
//                 centersCount,
//                 centersList,
//               })
//             })
//           }
//         })

//         setFlattenedData(flattened)

//         if (response.data.pagination) {
//           setCurrentPage(
//             response.data.pagination.currentPage,
//           )

//           setTotalPages(
//             response.data.pagination.totalPages,
//           )
//         }

//         setStats(response.data.stats || {})
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

//         console.error(
//           'Error message:',
//           err.message,
//         )
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ============================================================
//   // FETCH RESELLERS
//   // ============================================================
//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers')

//       if (response.data.success) {
//         setResellers(response.data.data || [])
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching resellers:',
//         error,
//       )
//     }
//   }

//   // ============================================================
//   // FETCH PRODUCTS
//   // ============================================================
//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all')

//       if (response.data.success) {
//         setProducts(response.data.data || [])
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching products:',
//         error,
//       )
//     }
//   }

//   useEffect(() => {
//     fetchData()
//     fetchResellers()
//     fetchProducts()
//   }, [])

//   // ============================================================
//   // PAGINATION
//   // ============================================================
//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return

//     fetchData(activeSearch, page)
//   }

//   // ============================================================
//   // SORTING
//   // ============================================================
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

//     const sortedData = [...flattenedData].sort((a, b) => {
//       let aValue = a[key]
//       let bValue = b[key]

//       if (aValue == null) aValue = ''
//       if (bValue == null) bValue = ''

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

//     setFlattenedData(sortedData)
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

//   // ============================================================
//   // SEARCH
//   // ============================================================
//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData)
//     setCurrentPage(1)
//     fetchData(searchData, 1)
//   }

//   // ============================================================
//   // RESET SEARCH
//   // ============================================================
//   const handleResetSearch = () => {
//     const resetData = {
//       reseller: '',
//       product: '',
//       center: '',
//       startDate: '',
//       endDate: '',
//       status: 'Completed',
//     }

//     setActiveSearch(resetData)
//     setSearchTerm('')
//     setCurrentPage(1)

//     fetchData({}, 1)
//   }

//   // ============================================================
//   // CLIENT SIDE SEARCH
//   // ============================================================
//   const filteredData = flattenedData.filter((item) => {
//     if (!searchTerm) {
//       return true
//     }

//     const searchLower = searchTerm.toLowerCase()

//     return (
//       (item.resellerName &&
//         item.resellerName
//           .toLowerCase()
//           .includes(searchLower)) ||
//       (item.productName &&
//         item.productName
//           .toLowerCase()
//           .includes(searchLower)) ||
//       (item.productCode &&
//         item.productCode
//           .toLowerCase()
//           .includes(searchLower))
//     )
//   })

//   // ============================================================
//   // EXPORT
//   // ============================================================
//   const generateExport = async () => {
//     try {
//       setLoading(true)

//       const params = new URLSearchParams()

//       if (activeSearch.reseller) {
//         params.append(
//           'resellerId',
//           activeSearch.reseller,
//         )
//       }

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

//       if (activeSearch.startDate) {
//         params.append(
//           'startDate',
//           activeSearch.startDate,
//         )
//       }

//       if (activeSearch.endDate) {
//         params.append(
//           'endDate',
//           activeSearch.endDate,
//         )
//       }

//       if (activeSearch.status) {
//         params.append(
//           'status',
//           activeSearch.status,
//         )
//       }

//       params.append('export', 'true')

//       const apiUrl = params.toString()
//         ? `/resellerStock/reseller-forwarded-qty?${params.toString()}`
//         : '/resellerStock/reseller-forwarded-qty'

//       const response =
//         await axiosInstance.get(apiUrl)

//       if (!response.data.success) {
//         throw new Error(
//           'API returned unsuccessful response',
//         )
//       }

//       let exportData = []

//       if (Array.isArray(response.data.data)) {
//         exportData = response.data.data
//       } else if (
//         response.data.data &&
//         typeof response.data.data === 'object'
//       ) {
//         exportData = [response.data.data]
//       }

//       const flattenedExport = []

//       exportData.forEach((reseller) => {
//         if (
//           reseller.products &&
//           reseller.products.length > 0
//         ) {
//           reseller.products.forEach((product) => {
//             const centersFormatted =
//               Object.values(product.centers || {})
//                 .map(
//                   (center) =>
//                     `${center.centerName} (${center.forwardedQty})`,
//                 )
//                 .join('; ')

//             flattenedExport.push({
//               resellerName:
//                 reseller.resellerName,
//               resellerEmail:
//                 reseller.resellerEmail,
//               productName:
//                 product.productName,
//               productCode:
//                 product.productCode,
//               quantity:
//                 product.totalForwardedQty,
//               orderCount:
//                 product.orderCount,
//               centers:
//                 centersFormatted,
//               centersCount:
//                 Object.keys(
//                   product.centers || {},
//                 ).length,
//             })
//           })
//         }
//       })

//       if (flattenedExport.length === 0) {
//         showError('No data available for export')
//         return
//       }

//       const headers = [
//         'Reseller Name',
//         'Product Name',
//         'Forwarded Quantity',
//         'Order Count',
//         'Centers Count',
//         'Centers (with quantity)',
//       ]

//       const csvData = flattenedExport.map(
//         (item) => [
//           item.resellerName || '',
//           item.productName || '',
//           item.quantity || 0,
//           item.orderCount || 0,
//           item.centersCount || 0,
//           item.centers || '',
//         ],
//       )

//       const csvContent = [
//         headers.join(','),
//         ...csvData.map((row) =>
//           row
//             .map(
//               (field) =>
//                 `"${String(field || '').replace(
//                   /"/g,
//                   '""',
//                 )}"`,
//             )
//             .join(','),
//         ),
//       ].join('\n')

//       const blob = new Blob(
//         ['\uFEFF' + csvContent],
//         {
//           type: 'text/csv;charset=utf-8;',
//         },
//       )

//       const link = document.createElement('a')

//       const downloadUrl =
//         URL.createObjectURL(blob)

//       const filterText = []

//       if (activeSearch.reseller) {
//         const reseller = resellers.find(
//           (r) =>
//             r._id === activeSearch.reseller,
//         )

//         if (reseller) {
//           filterText.push(
//             reseller.businessName,
//           )
//         }
//       }

//       const filename = `reseller_forwarded_qty_${
//         filterText.length > 0
//           ? filterText.join('_') + '_'
//           : ''
//       }${new Date()
//         .toISOString()
//         .split('T')[0]}.csv`

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

//   // ============================================================
//   // CENTER DETAILS
//   // ============================================================
//   const renderCenterDetails = (centerData) => {
//     if (
//       !centerData ||
//       Object.keys(centerData).length === 0
//     ) {
//       return (
//         <span className="text-gray-400">
//           No centers
//         </span>
//       )
//     }

//     return (
//       <div className="group relative inline-block">
//         <button
//           type="button"
//           className="inline-flex items-center gap-1 text-[16px] font-normal text-[#2864ad] hover:text-[#1f4f8d]"
//         >
//           <Info size={15} />

//           <span className="underline">
//             {Object.keys(centerData).length} centers
//           </span>
//         </button>

//         <div className="invisible absolute bottom-full right-0 z-30 mb-2 w-80 border border-gray-200 bg-white p-3 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
//           <div className="mb-2 text-sm font-semibold text-gray-700">
//             Center Details
//           </div>

//           <div className="max-h-60 space-y-2 overflow-y-auto">
//             {Object.values(centerData).map(
//               (center, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between gap-3 bg-gray-50 px-3 py-2"
//                 >
//                   <span className="text-sm text-gray-700">
//                     {center.centerName} (
//                     {center.centerCode})
//                   </span>

//                   <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
//                     {center.forwardedQty}
//                   </span>
//                 </div>
//               ),
//             )}
//           </div>

//           <div className="absolute right-5 top-full h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
//         </div>
//       </div>
//     )
//   }

//   // ============================================================
//   // SORTABLE HEADER
//   // ============================================================
//   const SortableHeader = ({ label, sortKey }) => {
//     const icon = getSortIcon(sortKey)

//     return (
//       <th
//         scope="col"
//         onClick={() => handleSort(sortKey)}
//         className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//       >
//         <div className="flex items-center gap-1">
//           <span>{label}</span>

//           {icon}
//         </div>
//       </th>
//     )
//   }

//   // ============================================================
//   // INITIAL LOADING
//   // ============================================================
//   if (
//     loading &&
//     flattenedData.length === 0
//   ) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2f5fa7]" />

//           <span className="text-sm text-gray-500">
//             Loading reseller stock...
//           </span>
//         </div>
//       </div>
//     )
//   }

//   // ============================================================
//   // ERROR
//   // ============================================================
//   if (error) {
//     return (
//       <div className="mx-4 mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   // ============================================================
//   // UI
//   // ============================================================
//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

//       {/* Page Title */}
//       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//         Reseller Forwarded Quantity Report
//       </div>

//       {/* Search Modal */}
//       <ResellerQtySearch
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         resellers={resellers}
//         products={products}
//       />

//       {/* Main Card */}
//       <div className="overflow-hidden border-0 bg-white shadow-[0_1px_5px_rgba(0,0,0,0.12)]">

//         {/* Card Header */}
//         <div className="border-t-[4px] border-t-[#2f5fa7] border-b border-[#dedede] bg-white px-4 py-2">

//           <div className="flex items-center justify-between">

//             {/* Left Buttons */}
//             <div className="flex items-center gap-1.5">

//               {/* Search */}
//               <button
//                 type="button"
//                 onClick={() =>
//                   setSearchModalVisible(true)
//                 }
//                 className="inline-flex h-[35px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-3 text-[16px] font-medium text-white transition hover:bg-[#244c88]"
//               >
//                 <Search size={16} />
//                 Search
//               </button>

//               {/* Reset Search */}
//               {(activeSearch.reseller ||
//                 activeSearch.product ||
//                 activeSearch.center ||
//                 activeSearch.startDate ||
//                 activeSearch.endDate) && (
//                 <button
//                   type="button"
//                   onClick={handleResetSearch}
//                   className="inline-flex h-[35px] items-center gap-1.5 rounded-[4px] bg-[#6c757d] px-3 text-[15px] font-medium text-white transition hover:bg-[#5c636a]"
//                 >
//                   <RotateCcw size={15} />
//                   Reset Search
//                 </button>
//               )}

//               {/* Export */}
//               <button
//                 type="button"
//                 onClick={generateExport}
//                 disabled={
//                   flattenedData.length === 0
//                 }
//                 className="inline-flex h-[35px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-3 text-[16px] font-medium text-white transition hover:bg-[#244c88] disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <Download size={15} />
//                 Export
//               </button>
//             </div>

//             {/* Top Pagination */}
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />

//           </div>
//         </div>

//         {/* Card Body */}
//         <div className="px-[18px] py-[17px]">

//           {/* Search */}
//           <div className="mb-4 flex justify-end">

//             <div className="flex w-full items-center gap-2 sm:w-auto">

//               <label
//                 htmlFor="reseller-search"
//                 className="whitespace-nowrap text-[16px] font-semibold text-[#111]"
//               >
//                 Search:
//               </label>

//               <input
//                 id="reseller-search"
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) =>
//                   setSearchTerm(e.target.value)
//                 }
//                 className="h-[34px] w-full rounded-[2px] border border-[#d9d9d9] bg-white px-2 text-[15px] outline-none transition focus:border-[#2f5fa7] sm:w-[220px]"
//               />

//             </div>

//           </div>

//           {/* ==================================================
//               TABLE
//               Same UI structure as CenterList.jsx
//               ================================================== */}
//           <div className="w-full overflow-hidden border border-[#eeeeee]">

//             {/* Vertical Scroll Area */}
//             <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">

//               <table className="w-full table-fixed border-collapse">

//                 {/* Column Widths */}
//                 <colgroup>
//                   <col style={{ width: '25%' }} />
//                   <col style={{ width: '31%' }} />
//                   <col style={{ width: '11%' }} />
//                   <col style={{ width: '15%' }} />
//                   <col style={{ width: '8%' }} />
//                   <col style={{ width: '10%' }} />
//                 </colgroup>

//                 {/* Table Header */}
//                 <thead className="sticky top-0 z-20">

//                   <tr>

//                     <SortableHeader
//                       label="Reseller"
//                       sortKey="resellerName"
//                     />

//                     <SortableHeader
//                       label="Product"
//                       sortKey="productName"
//                     />

//                     <SortableHeader
//                       label={
//                         <>
//                           Product
//                           <br />
//                           Code
//                         </>
//                       }
//                       sortKey="productCode"
//                     />

//                     <SortableHeader
//                       label={
//                         <>
//                           Forwarded
//                           <br />
//                           Quantity
//                         </>
//                       }
//                       sortKey="availableQuantity"
//                     />

//                     <SortableHeader
//                       label="Orders"
//                       sortKey="orderCount"
//                     />

//                     <SortableHeader
//                       label="Centers"
//                       sortKey="centersCount"
//                     />

//                   </tr>

//                 </thead>

//                 {/* Table Body */}
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

//                         {/* Reseller */}
//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.resellerName || ''}
//                           </div>
//                         </td>

//                         {/* Product */}
//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.productName || ''}
//                           </div>
//                         </td>

//                         {/* Product Code */}
//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.productCode || ''}
//                           </div>
//                         </td>

//                         {/* Forwarded Quantity */}
//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           {item.displayQuantity || 0}
//                         </td>

//                         {/* Orders */}
//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           {item.orderCount || 0}
//                         </td>

//                         {/* Centers */}
//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           {renderCenterDetails(item.centers)}
//                         </td>

//                       </tr>

//                     ))
//                   ) : (

//                     <tr>
//                       <td
//                         colSpan={6}
//                         className="px-4 py-10 text-center text-sm text-gray-500"
//                       >
//                         {loading
//                           ? 'Loading...'
//                           : 'No data found. Try adjusting your search filters.'}
//                       </td>
//                     </tr>

//                   )}

//                 </tbody>

//               </table>

//             </div>
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

// export default ResellerStock







// import React, { useEffect, useRef, useState } from 'react'
// import { createPortal } from 'react-dom'
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   Info,
//   RotateCcw,
//   Search,
// } from 'lucide-react'

// import axiosInstance from '../../axiosInstance'
// import Pagination from '../../utils/Pagination'
// import { showError } from '../../utils/sweetAlerts'
// import ResellerQtySearch from './ResellerQtySearch'

// const ResellerStock = () => {
//   const [data, setData] = useState([])
//   const [flattenedData, setFlattenedData] = useState([])
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
//   const [openCenterKey, setOpenCenterKey] = useState(null)
//   const [centerPopover, setCenterPopover] = useState(null)
//   const centerAnchorRef = useRef(null)

//   const [activeSearch, setActiveSearch] = useState({
//     reseller: '',
//     product: '',
//     center: '',
//     startDate: '',
//     endDate: '',
//     status: 'Completed',
//   })

//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const [stats, setStats] = useState({
//     totalResellers: 0,
//     totalForwardedQty: 0,
//   })

//   // ============================================================
//   // FETCH DATA
//   // ============================================================
//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true)
//       setError(null)

//       const params = new URLSearchParams()

//       if (searchParams.reseller) {
//         params.append('resellerId', searchParams.reseller)
//       }

//       if (searchParams.center) {
//         params.append('center', searchParams.center)
//       }

//       if (searchParams.product) {
//         params.append('product', searchParams.product)
//       }

//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate)
//       }

//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate)
//       }

//       if (searchParams.status) {
//         params.append('status', searchParams.status)
//       }

//       params.append('page', page)

//       const url = params.toString()
//         ? `/resellerStock/reseller-forwarded-qty?${params.toString()}`
//         : '/resellerStock/reseller-forwarded-qty'

//       console.log('Fetching from URL:', url)

//       const response = await axiosInstance.get(url)

//       if (response.data.success) {
//         let apiData = []

//         if (Array.isArray(response.data.data)) {
//           apiData = response.data.data
//         } else if (
//           response.data.data &&
//           typeof response.data.data === 'object'
//         ) {
//           apiData = [response.data.data]
//         }

//         setData(apiData)

//         const flattened = []

//         apiData.forEach((reseller) => {
//           if (
//             reseller.products &&
//             reseller.products.length > 0
//           ) {
//             reseller.products.forEach((product) => {
//               const centersList = Object.values(
//                 product.centers || {},
//               )
//                 .map(
//                   (center) =>
//                     `${center.centerName} (${center.forwardedQty})`,
//                 )
//                 .join(', ')

//               const centersCount = Object.keys(
//                 product.centers || {},
//               ).length

//               flattened.push({
//                 _id: `${reseller.resellerId}_${product.productId}`,
//                 resellerId: reseller.resellerId,
//                 resellerName: reseller.resellerName,
//                 resellerEmail: reseller.resellerEmail,
//                 resellerMobile: reseller.resellerMobile,
//                 productId: product.productId,
//                 productName: product.productName,
//                 productCode: product.productCode,
//                 availableQuantity:
//                   product.totalForwardedQty,
//                 displayQuantity:
//                   product.totalForwardedQty,
//                 orderCount: product.orderCount,
//                 centers: product.centers || {},
//                 centersCount,
//                 centersList,
//               })
//             })
//           }
//         })

//         setFlattenedData(flattened)

//         if (response.data.pagination) {
//           setCurrentPage(
//             response.data.pagination.currentPage,
//           )

//           setTotalPages(
//             response.data.pagination.totalPages,
//           )
//         }

//         setStats(response.data.stats || {})
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

//         console.error(
//           'Error message:',
//           err.message,
//         )
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ============================================================
//   // FETCH RESELLERS
//   // ============================================================
//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers')

//       if (response.data.success) {
//         setResellers(response.data.data || [])
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching resellers:',
//         error,
//       )
//     }
//   }

//   // ============================================================
//   // FETCH PRODUCTS
//   // ============================================================
//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all')

//       if (response.data.success) {
//         setProducts(response.data.data || [])
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching products:',
//         error,
//       )
//     }
//   }

//   useEffect(() => {
//     fetchData()
//     fetchResellers()
//     fetchProducts()
//   }, [])

//   // ============================================================
//   // PAGINATION
//   // ============================================================
//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return

//     fetchData(activeSearch, page)
//   }

//   // ============================================================
//   // SORTING
//   // ============================================================
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

//     const sortedData = [...flattenedData].sort((a, b) => {
//       let aValue = a[key]
//       let bValue = b[key]

//       if (aValue == null) aValue = ''
//       if (bValue == null) bValue = ''

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

//     setFlattenedData(sortedData)
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

//   // ============================================================
//   // SEARCH
//   // ============================================================
//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData)
//     setCurrentPage(1)
//     fetchData(searchData, 1)
//   }

//   // ============================================================
//   // RESET SEARCH
//   // ============================================================
//   const handleResetSearch = () => {
//     const resetData = {
//       reseller: '',
//       product: '',
//       center: '',
//       startDate: '',
//       endDate: '',
//       status: 'Completed',
//     }

//     setActiveSearch(resetData)
//     setSearchTerm('')
//     setCurrentPage(1)

//     fetchData({}, 1)
//   }

//   // ============================================================
//   // CLIENT SIDE SEARCH
//   // ============================================================
//   const filteredData = flattenedData.filter((item) => {
//     if (!searchTerm) {
//       return true
//     }

//     const searchLower = searchTerm.toLowerCase()

//     return (
//       (item.resellerName &&
//         item.resellerName
//           .toLowerCase()
//           .includes(searchLower)) ||
//       (item.productName &&
//         item.productName
//           .toLowerCase()
//           .includes(searchLower)) ||
//       (item.productCode &&
//         item.productCode
//           .toLowerCase()
//           .includes(searchLower))
//     )
//   })

//   // ============================================================
//   // EXPORT
//   // ============================================================
//   const generateExport = async () => {
//     try {
//       setLoading(true)

//       const params = new URLSearchParams()

//       if (activeSearch.reseller) {
//         params.append(
//           'resellerId',
//           activeSearch.reseller,
//         )
//       }

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

//       if (activeSearch.startDate) {
//         params.append(
//           'startDate',
//           activeSearch.startDate,
//         )
//       }

//       if (activeSearch.endDate) {
//         params.append(
//           'endDate',
//           activeSearch.endDate,
//         )
//       }

//       if (activeSearch.status) {
//         params.append(
//           'status',
//           activeSearch.status,
//         )
//       }

//       params.append('export', 'true')

//       const apiUrl = params.toString()
//         ? `/resellerStock/reseller-forwarded-qty?${params.toString()}`
//         : '/resellerStock/reseller-forwarded-qty'

//       const response =
//         await axiosInstance.get(apiUrl)

//       if (!response.data.success) {
//         throw new Error(
//           'API returned unsuccessful response',
//         )
//       }

//       let exportData = []

//       if (Array.isArray(response.data.data)) {
//         exportData = response.data.data
//       } else if (
//         response.data.data &&
//         typeof response.data.data === 'object'
//       ) {
//         exportData = [response.data.data]
//       }

//       const flattenedExport = []

//       exportData.forEach((reseller) => {
//         if (
//           reseller.products &&
//           reseller.products.length > 0
//         ) {
//           reseller.products.forEach((product) => {
//             const centersFormatted =
//               Object.values(product.centers || {})
//                 .map(
//                   (center) =>
//                     `${center.centerName} (${center.forwardedQty})`,
//                 )
//                 .join('; ')

//             flattenedExport.push({
//               resellerName:
//                 reseller.resellerName,
//               resellerEmail:
//                 reseller.resellerEmail,
//               productName:
//                 product.productName,
//               productCode:
//                 product.productCode,
//               quantity:
//                 product.totalForwardedQty,
//               orderCount:
//                 product.orderCount,
//               centers:
//                 centersFormatted,
//               centersCount:
//                 Object.keys(
//                   product.centers || {},
//                 ).length,
//             })
//           })
//         }
//       })

//       if (flattenedExport.length === 0) {
//         showError('No data available for export')
//         return
//       }

//       const headers = [
//         'Reseller Name',
//         'Product Name',
//         'Forwarded Quantity',
//         'Order Count',
//         'Centers Count',
//         'Centers (with quantity)',
//       ]

//       const csvData = flattenedExport.map(
//         (item) => [
//           item.resellerName || '',
//           item.productName || '',
//           item.quantity || 0,
//           item.orderCount || 0,
//           item.centersCount || 0,
//           item.centers || '',
//         ],
//       )

//       const csvContent = [
//         headers.join(','),
//         ...csvData.map((row) =>
//           row
//             .map(
//               (field) =>
//                 `"${String(field || '').replace(
//                   /"/g,
//                   '""',
//                 )}"`,
//             )
//             .join(','),
//         ),
//       ].join('\n')

//       const blob = new Blob(
//         ['\uFEFF' + csvContent],
//         {
//           type: 'text/csv;charset=utf-8;',
//         },
//       )

//       const link = document.createElement('a')

//       const downloadUrl =
//         URL.createObjectURL(blob)

//       const filterText = []

//       if (activeSearch.reseller) {
//         const reseller = resellers.find(
//           (r) =>
//             r._id === activeSearch.reseller,
//         )

//         if (reseller) {
//           filterText.push(
//             reseller.businessName,
//           )
//         }
//       }

//       const filename = `reseller_forwarded_qty_${
//         filterText.length > 0
//           ? filterText.join('_') + '_'
//           : ''
//       }${new Date()
//         .toISOString()
//         .split('T')[0]}.csv`

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

//   // ============================================================
//   // CENTER DETAILS
//   // ============================================================
//   const getCenterPopoverPosition = () => {
//     const anchor = centerAnchorRef.current
//     if (!anchor) return null

//     const rect = anchor.getBoundingClientRect()
//     const popoverWidth = 264
//     const gap = 8
//     const viewportPadding = 8

//     // The popup is rendered in a portal so it can escape the table's
//     // overflow area, but its position is recalculated from the actual
//     // clicked cell whenever the page/table is scrolled.
//     let left = rect.left - popoverWidth - gap

//     // If there is not enough room on the left, keep it inside the viewport.
//     left = Math.max(
//       viewportPadding,
//       Math.min(
//         left,
//         window.innerWidth - popoverWidth - viewportPadding,
//       ),
//     )

//     const centerCount = centerAnchorRef.current?.dataset?.centerCount
//       ? Number(centerAnchorRef.current.dataset.centerCount)
//       : Object.keys(centerPopover?.centerData || {}).length

//     const estimatedHeight = Math.min(
//       Math.max(centerCount * 38 + 16, 70),
//       590,
//     )

//     // Keep the popup vertically attached to the clicked cell.
//     let top = rect.top - 10

//     if (top + estimatedHeight > window.innerHeight - viewportPadding) {
//       top = window.innerHeight - estimatedHeight - viewportPadding
//     }

//     top = Math.max(viewportPadding, top)

//     // Arrow follows the exact vertical center of the clicked cell.
//     const arrowTop = Math.max(
//       10,
//       Math.min(
//         rect.top + rect.height / 2 - top - 9,
//         estimatedHeight - 27,
//       ),
//     )

//     return {
//       top,
//       left,
//       arrowTop,
//     }
//   }

//   useEffect(() => {
//     if (!openCenterKey || !centerPopover) return

//     const updatePosition = () => {
//       const position = getCenterPopoverPosition()
//       if (!position) return

//       setCenterPopover((previous) => {
//         if (!previous) return previous

//         return {
//           ...previous,
//           ...position,
//         }
//       })
//     }

//     // IMPORTANT: capture scroll events so the popup follows the cell even
//     // when the table itself (not the browser window) is being scrolled.
//     window.addEventListener('scroll', updatePosition, true)
//     window.addEventListener('resize', updatePosition)

//     updatePosition()

//     return () => {
//       window.removeEventListener('scroll', updatePosition, true)
//       window.removeEventListener('resize', updatePosition)
//     }
//   }, [openCenterKey, centerPopover?.centerData])

//   const closeCenterPopover = () => {
//     setOpenCenterKey(null)
//     setCenterPopover(null)
//     centerAnchorRef.current = null
//   }

//   const renderCenterDetails = (centerData, centerKey) => {
//     if (!centerData || Object.keys(centerData).length === 0) {
//       return <span className="text-gray-400">No centers</span>
//     }

//     const isOpen = openCenterKey === centerKey

//     const handleCenterClick = (event) => {
//       event.stopPropagation()

//       if (isOpen) {
//         closeCenterPopover()
//         return
//       }

//       // Keep the exact clicked Centers link as the anchor. The popup's
//       // fixed position is recalculated from this element on every scroll,
//       // which makes the arrow move together with the table cell.
//       centerAnchorRef.current = event.currentTarget

//       setOpenCenterKey(centerKey)
//       setCenterPopover({
//         centerData,
//         top: 0,
//         left: 0,
//         arrowTop: 0,
//       })
//     }

//     return (
//       <>
//         <button
//           type="button"
//           onClick={handleCenterClick}
//           data-center-count={Object.keys(centerData).length}
//           className="inline-flex items-center gap-1 border-0 bg-transparent p-0 text-[16px] font-normal text-[#2864ad] hover:text-[#1f4f8d]"
//         >
//           <Info size={15} />
//           <span className="underline">
//             {Object.keys(centerData).length} centers
//           </span>
//         </button>

//         {isOpen && centerPopover &&
//           createPortal(
//             <>
//               <div
//                 className="fixed inset-0 z-[9998] bg-transparent"
//                 onClick={closeCenterPopover}
//               />

//               <div
//                 className="fixed z-[9999] w-[264px] overflow-visible rounded-[6px] border border-[#d6dbe1] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.20)]"
//                 style={{
//                   top: `${centerPopover.top}px`,
//                   left: `${centerPopover.left}px`,
//                 }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="max-h-[590px] overflow-y-auto px-3 py-2">
//                   {Object.values(centerPopover.centerData).map(
//                     (center, index) => (
//                       <div
//                         key={index}
//                         className="flex min-h-[38px] items-center justify-between gap-3 border-b border-[#d9dfe7] py-[7px] last:border-b-0"
//                       >
//                         <span className="min-w-0 flex-1 truncate text-[14px] font-normal text-[#202124]">
//                           {center.centerName} ({center.centerCode})
//                         </span>

//                         <span className="shrink-0 rounded-[6px] bg-[#3399ff] px-2 py-[4px] text-[12px] font-semibold leading-none text-white">
//                           {center.forwardedQty}
//                         </span>
//                       </div>
//                     ),
//                   )}
//                 </div>

//                 {/* Exact old-style arrow: it stays attached to the clicked
//                     Centers cell because arrowTop is recalculated on scroll. */}
//                 <div
//                   className="pointer-events-none absolute -right-[9px] h-0 w-0 border-b-[9px] border-l-[9px] border-t-[9px] border-b-transparent border-l-[#d6dbe1] border-t-transparent"
//                   style={{ top: `${centerPopover.arrowTop}px` }}
//                 />
//                 <div
//                   className="pointer-events-none absolute -right-[8px] h-0 w-0 border-b-[8px] border-l-[8px] border-t-[8px] border-b-transparent border-l-white border-t-transparent"
//                   style={{ top: `${centerPopover.arrowTop + 1}px` }}
//                 />
//               </div>
//             </>,
//             document.body,
//           )}
//       </>
//     )
//   }

//   // ============================================================
//   // SORTABLE HEADER
//   // ============================================================
//   const SortableHeader = ({ label, sortKey }) => {
//     const icon = getSortIcon(sortKey)

//     return (
//       <th
//         scope="col"
//         onClick={() => handleSort(sortKey)}
//         className="cursor-pointer select-none whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[16px] font-semibold text-[#111] transition hover:bg-[#f7f7f7]"
//       >
//         <div className="flex items-center gap-1">
//           <span>{label}</span>

//           {icon}
//         </div>
//       </th>
//     )
//   }

//   // ============================================================
//   // INITIAL LOADING
//   // ============================================================
//   if (
//     loading &&
//     flattenedData.length === 0
//   ) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2f5fa7]" />

//           <span className="text-sm text-gray-500">
//             Loading reseller stock...
//           </span>
//         </div>
//       </div>
//     )
//   }

//   // ============================================================
//   // ERROR
//   // ============================================================
//   if (error) {
//     return (
//       <div className="mx-4 mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     )
//   }

//   // ============================================================
//   // UI
//   // ============================================================
//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

//       {/* Page Title */}
//       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//         Reseller Forwarded Quantity Report
//       </div>

//       {/* Search Modal */}
//       <ResellerQtySearch
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         resellers={resellers}
//         products={products}
//       />

//       {/* Main Card */}
//       <div className="overflow-hidden border-0 bg-white shadow-[0_1px_5px_rgba(0,0,0,0.12)]">

//         {/* Card Header */}
//         <div className="border-t-[4px] border-t-[#2f5fa7] border-b border-[#dedede] bg-white px-4 py-2">

//           <div className="flex items-center justify-between">

//             {/* Left Buttons */}
//             <div className="flex items-center gap-1.5">

//               {/* Search */}
//               <button
//                 type="button"
//                 onClick={() =>
//                   setSearchModalVisible(true)
//                 }
//                 className="inline-flex h-[35px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-3 text-[16px] font-medium text-white transition hover:bg-[#244c88]"
//               >
//                 <Search size={16} />
//                 Search
//               </button>

//               {/* Reset Search */}
//               {(activeSearch.reseller ||
//                 activeSearch.product ||
//                 activeSearch.center ||
//                 activeSearch.startDate ||
//                 activeSearch.endDate) && (
//                 <button
//                   type="button"
//                   onClick={handleResetSearch}
//                   className="inline-flex h-[35px] items-center gap-1.5 rounded-[4px] bg-[#6c757d] px-3 text-[15px] font-medium text-white transition hover:bg-[#5c636a]"
//                 >
//                   <RotateCcw size={15} />
//                   Reset Search
//                 </button>
//               )}

//               {/* Export */}
//               <button
//                 type="button"
//                 onClick={generateExport}
//                 disabled={
//                   flattenedData.length === 0
//                 }
//                 className="inline-flex h-[35px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-3 text-[16px] font-medium text-white transition hover:bg-[#244c88] disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <Download size={15} />
//                 Export
//               </button>
//             </div>

//             {/* Top Pagination */}
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />

//           </div>
//         </div>

//         {/* Card Body */}
//         <div className="px-[18px] py-[17px]">

//           {/* Search */}
//           <div className="mb-4 flex justify-end">

//             <div className="flex w-full items-center gap-2 sm:w-auto">

//               <label
//                 htmlFor="reseller-search"
//                 className="whitespace-nowrap text-[16px] font-semibold text-[#111]"
//               >
//                 Search:
//               </label>

//               <input
//                 id="reseller-search"
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) =>
//                   setSearchTerm(e.target.value)
//                 }
//                 className="h-[34px] w-full rounded-[2px] border border-[#d9d9d9] bg-white px-2 text-[15px] outline-none transition focus:border-[#2f5fa7] sm:w-[220px]"
//               />

//             </div>

//           </div>

//           {/* ==================================================
//               TABLE
//               Same UI structure as CenterList.jsx
//               ================================================== */}
//           <div className="w-full overflow-hidden border border-[#eeeeee]">

//             {/* Vertical Scroll Area */}
//             <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">

//               <table className="w-full table-fixed border-collapse">

//                 {/* Column Widths */}
//                 <colgroup>
//                   <col style={{ width: '25%' }} />
//                   <col style={{ width: '31%' }} />
//                   <col style={{ width: '11%' }} />
//                   <col style={{ width: '15%' }} />
//                   <col style={{ width: '8%' }} />
//                   <col style={{ width: '10%' }} />
//                 </colgroup>

//                 {/* Table Header */}
//                 <thead className="sticky top-0 z-20">

//                   <tr>

//                     <SortableHeader
//                       label="Reseller"
//                       sortKey="resellerName"
//                     />

//                     <SortableHeader
//                       label="Product"
//                       sortKey="productName"
//                     />

//                     <SortableHeader
//                       label={
//                         <>
//                           Product
//                           <br />
//                           Code
//                         </>
//                       }
//                       sortKey="productCode"
//                     />

//                     <SortableHeader
//                       label={
//                         <>
//                           Forwarded
//                           <br />
//                           Quantity
//                         </>
//                       }
//                       sortKey="availableQuantity"
//                     />

//                     <SortableHeader
//                       label="Orders"
//                       sortKey="orderCount"
//                     />

//                     <SortableHeader
//                       label="Centers"
//                       sortKey="centersCount"
//                     />

//                   </tr>

//                 </thead>

//                 {/* Table Body */}
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

//                         {/* Reseller */}
//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.resellerName || ''}
//                           </div>
//                         </td>

//                         {/* Product */}
//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.productName || ''}
//                           </div>
//                         </td>

//                         {/* Product Code */}
//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           <div className="break-words">
//                             {item.productCode || ''}
//                           </div>
//                         </td>

//                         {/* Forwarded Quantity */}
//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           {item.displayQuantity || 0}
//                         </td>

//                         {/* Orders */}
//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           {item.orderCount || 0}
//                         </td>

//                         {/* Centers */}
//                         <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
//                           {renderCenterDetails(item.centers, item._id)}
//                         </td>

//                       </tr>

//                     ))
//                   ) : (

//                     <tr>
//                       <td
//                         colSpan={6}
//                         className="px-4 py-10 text-center text-sm text-gray-500"
//                       >
//                         {loading
//                           ? 'Loading...'
//                           : 'No data found. Try adjusting your search filters.'}
//                       </td>
//                     </tr>

//                   )}

//                 </tbody>

//               </table>

//             </div>
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

// export default ResellerStock






import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowDown,
  ArrowUp,
  Download,
  Info,
  RotateCcw,
  Search,
} from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import Pagination from '../../utils/Pagination'
import { showError } from '../../utils/sweetAlerts'
import ResellerQtySearch from './ResellerQtySearch'

const ResellerStock = () => {
  const [data, setData] = useState([])
  const [flattenedData, setFlattenedData] = useState([])
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
  const [openCenterKey, setOpenCenterKey] = useState(null)
  const [centerPopover, setCenterPopover] = useState(null)
  const centerAnchorRef = useRef(null)

  const [activeSearch, setActiveSearch] = useState({
    reseller: '',
    product: '',
    center: '',
    startDate: '',
    endDate: '',
    status: 'Completed',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [stats, setStats] = useState({
    totalResellers: 0,
    totalForwardedQty: 0,
  })

  // ============================================================
  // FETCH DATA
  // ============================================================
  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (searchParams.reseller) {
        params.append('resellerId', searchParams.reseller)
      }

      if (searchParams.center) {
        params.append('center', searchParams.center)
      }

      if (searchParams.product) {
        params.append('product', searchParams.product)
      }

      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate)
      }

      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate)
      }

      if (searchParams.status) {
        params.append('status', searchParams.status)
      }

      params.append('page', page)

      const url = params.toString()
        ? `/resellerStock/reseller-forwarded-qty?${params.toString()}`
        : '/resellerStock/reseller-forwarded-qty'

      console.log('Fetching from URL:', url)

      const response = await axiosInstance.get(url)

      if (response.data.success) {
        let apiData = []

        if (Array.isArray(response.data.data)) {
          apiData = response.data.data
        } else if (
          response.data.data &&
          typeof response.data.data === 'object'
        ) {
          apiData = [response.data.data]
        }

        setData(apiData)

        const flattened = []

        apiData.forEach((reseller) => {
          if (
            reseller.products &&
            reseller.products.length > 0
          ) {
            reseller.products.forEach((product) => {
              const centersList = Object.values(
                product.centers || {},
              )
                .map(
                  (center) =>
                    `${center.centerName} (${center.forwardedQty})`,
                )
                .join(', ')

              const centersCount = Object.keys(
                product.centers || {},
              ).length

              flattened.push({
                _id: `${reseller.resellerId}_${product.productId}`,
                resellerId: reseller.resellerId,
                resellerName: reseller.resellerName,
                resellerEmail: reseller.resellerEmail,
                resellerMobile: reseller.resellerMobile,
                productId: product.productId,
                productName: product.productName,
                productCode: product.productCode,
                availableQuantity:
                  product.totalForwardedQty,
                displayQuantity:
                  product.totalForwardedQty,
                orderCount: product.orderCount,
                centers: product.centers || {},
                centersCount,
                centersList,
              })
            })
          }
        })

        setFlattenedData(flattened)

        if (response.data.pagination) {
          setCurrentPage(
            response.data.pagination.currentPage,
          )

          setTotalPages(
            response.data.pagination.totalPages,
          )
        }

        setStats(response.data.stats || {})
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

        console.error(
          'Error message:',
          err.message,
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // FETCH RESELLERS
  // ============================================================
  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers')

      if (response.data.success) {
        setResellers(response.data.data || [])
      }
    } catch (error) {
      console.error(
        'Error fetching resellers:',
        error,
      )
    }
  }

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all')

      if (response.data.success) {
        setProducts(response.data.data || [])
      }
    } catch (error) {
      console.error(
        'Error fetching products:',
        error,
      )
    }
  }

  useEffect(() => {
    fetchData()
    fetchResellers()
    fetchProducts()
  }, [])

  // ============================================================
  // PAGINATION
  // ============================================================
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return

    fetchData(activeSearch, page)
  }

  // ============================================================
  // SORTING
  // ============================================================
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

    const sortedData = [...flattenedData].sort((a, b) => {
      let aValue = a[key]
      let bValue = b[key]

      if (aValue == null) aValue = ''
      if (bValue == null) bValue = ''

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

    setFlattenedData(sortedData)
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

  // ============================================================
  // SEARCH
  // ============================================================
  // const handleSearch = (searchData) => {
  //   setActiveSearch(searchData)
  //   setCurrentPage(1)
  //   fetchData(searchData, 1)
  // }


  const handleSearch = (searchData) => {
  console.log("Search filters selected:", searchData);

  setActiveSearch({
    reseller: searchData.reseller || "",
    product: searchData.product || "",
    center: searchData.center || "",
    startDate: searchData.startDate || "",
    endDate: searchData.endDate || "",
    status: "Completed",
  });

  setCurrentPage(1);
  setSearchModalVisible(false);

  fetchData(
    {
      ...searchData,
      status: "Completed",
    },
    1
  );
};

  // ============================================================
  // RESET SEARCH
  // ============================================================
  const handleResetSearch = () => {
    const resetData = {
      reseller: '',
      product: '',
      center: '',
      startDate: '',
      endDate: '',
      status: 'Completed',
    }

    setActiveSearch(resetData)
    setSearchTerm('')
    setCurrentPage(1)

    fetchData({}, 1)
  }

  // ============================================================
  // CLIENT SIDE SEARCH
  // ============================================================
  const filteredData = flattenedData.filter((item) => {
    if (!searchTerm) {
      return true
    }

    const searchLower = searchTerm.toLowerCase()

    return (
      (item.resellerName &&
        item.resellerName
          .toLowerCase()
          .includes(searchLower)) ||
      (item.productName &&
        item.productName
          .toLowerCase()
          .includes(searchLower)) ||
      (item.productCode &&
        item.productCode
          .toLowerCase()
          .includes(searchLower))
    )
  })

  // ============================================================
  // EXPORT
  // ============================================================
  const generateExport = async () => {
    try {
      if (!activeSearch.startDate && !activeSearch.endDate) {
        showError(
          'Please select a Start Date or End Date before exporting.',
        )
        return
      }

      setLoading(true)

      const params = new URLSearchParams()

      if (activeSearch.reseller) {
        params.append(
          'resellerId',
          activeSearch.reseller,
        )
      }

      if (activeSearch.center) {
        params.append(
          'center',
          activeSearch.center,
        )
      }

      if (activeSearch.product) {
        params.append(
          'product',
          activeSearch.product,
        )
      }

      if (activeSearch.startDate) {
        params.append(
          'startDate',
          activeSearch.startDate,
        )
      }

      if (activeSearch.endDate) {
        params.append(
          'endDate',
          activeSearch.endDate,
        )
      }

      if (activeSearch.status) {
        params.append(
          'status',
          activeSearch.status,
        )
      }

      params.append('export', 'true')

      const apiUrl =
        `/resellerStock/reseller-forwarded-qty?${params.toString()}`

      const response = await axiosInstance.get(apiUrl, {
        responseType: 'blob',
      })

      // The export API returns an Excel (.xlsx) file, not JSON.
      // If the backend returns an error, it may still be a JSON blob.
      const contentType =
        response.headers?.['content-type'] || ''

      if (contentType.includes('application/json')) {
        const errorText = await response.data.text()
        let errorMessage = 'Error generating export file'

        try {
          const errorData = JSON.parse(errorText)

          errorMessage =
            errorData.message ||
            errorData.error ||
            errorMessage
        } catch (parseError) {
          console.error(
            'Error parsing export error response:',
            parseError,
          )
        }

        throw new Error(errorMessage)
      }

      const blob = new Blob([response.data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')

      let filename = `forwarded_quantity_report_${new Date()
        .toISOString()
        .split('T')[0]}.xlsx`

      const contentDisposition =
        response.headers?.['content-disposition'] || ''

      const filenameMatch = contentDisposition.match(
        /filename\*?=(?:UTF-8''|["']?)([^;"']+)/i,
      )

      if (filenameMatch?.[1]) {
        filename = decodeURIComponent(
          filenameMatch[1].replace(/["']/g, ''),
        )
      }

      link.href = downloadUrl
      link.download = filename
      link.style.display = 'none'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error(
        'Error generating export:',
        error,
      )

      showError(
        error.message || 'Error generating export file',
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // CENTER DETAILS
  // ============================================================
  const getCenterPopoverPosition = () => {
    const anchor = centerAnchorRef.current
    if (!anchor) return null

    const rect = anchor.getBoundingClientRect()
    const popoverWidth = 264
    const gap = 8
    const viewportPadding = 8

    // The popup is rendered in a portal so it can escape the table's
    // overflow area, but its position is recalculated from the actual
    // clicked cell whenever the page/table is scrolled.
    let left = rect.left - popoverWidth - gap

    // If there is not enough room on the left, keep it inside the viewport.
    left = Math.max(
      viewportPadding,
      Math.min(
        left,
        window.innerWidth - popoverWidth - viewportPadding,
      ),
    )

    const centerCount = centerAnchorRef.current?.dataset?.centerCount
      ? Number(centerAnchorRef.current.dataset.centerCount)
      : Object.keys(centerPopover?.centerData || {}).length

    const estimatedHeight = Math.min(
      Math.max(centerCount * 38 + 16, 70),
      590,
    )

    // Keep the popup vertically attached to the clicked cell.
    let top = rect.top - 10

    if (top + estimatedHeight > window.innerHeight - viewportPadding) {
      top = window.innerHeight - estimatedHeight - viewportPadding
    }

    top = Math.max(viewportPadding, top)

    // Arrow follows the exact vertical center of the clicked cell.
    const arrowTop = Math.max(
      10,
      Math.min(
        rect.top + rect.height / 2 - top - 9,
        estimatedHeight - 27,
      ),
    )

    return {
      top,
      left,
      arrowTop,
    }
  }

  useEffect(() => {
    if (!openCenterKey || !centerPopover) return

    const updatePosition = () => {
      const position = getCenterPopoverPosition()
      if (!position) return

      setCenterPopover((previous) => {
        if (!previous) return previous

        return {
          ...previous,
          ...position,
        }
      })
    }

    // IMPORTANT: capture scroll events so the popup follows the cell even
    // when the table itself (not the browser window) is being scrolled.
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    updatePosition()

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [openCenterKey, centerPopover?.centerData])

  const closeCenterPopover = () => {
    setOpenCenterKey(null)
    setCenterPopover(null)
    centerAnchorRef.current = null
  }

  const renderCenterDetails = (centerData, centerKey) => {
    if (!centerData || Object.keys(centerData).length === 0) {
      return <span className="text-gray-400">No centers</span>
    }

    const isOpen = openCenterKey === centerKey

    const handleCenterClick = (event) => {
      event.stopPropagation()

      if (isOpen) {
        closeCenterPopover()
        return
      }

      // Keep the exact clicked Centers link as the anchor. The popup's
      // fixed position is recalculated from this element on every scroll,
      // which makes the arrow move together with the table cell.
      centerAnchorRef.current = event.currentTarget

      setOpenCenterKey(centerKey)
      setCenterPopover({
        centerData,
        top: 0,
        left: 0,
        arrowTop: 0,
      })
    }

    return (
      <>
        <button
          type="button"
          onClick={handleCenterClick}
          data-center-count={Object.keys(centerData).length}
          className="inline-flex items-center gap-1 border-0 bg-transparent p-0 text-[16px] font-normal text-[#2864ad] hover:text-[#1f4f8d]"
        >
          <Info size={15} />
          <span className="underline">
            {Object.keys(centerData).length} centers
          </span>
        </button>

        {isOpen &&
          centerPopover &&
          createPortal(
            <>
              <div
                className="fixed inset-0 z-[9998] bg-transparent"
                onClick={closeCenterPopover}
              />

              <div
                className="fixed z-[9999] w-[264px] overflow-visible rounded-[6px] border border-[#d6dbe1] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.20)]"
                style={{
                  top: `${centerPopover.top}px`,
                  left: `${centerPopover.left}px`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="max-h-[590px] overflow-y-auto px-3 py-2">
                  {Object.values(centerPopover.centerData).map(
                    (center, index) => (
                      <div
                        key={index}
                        className="flex min-h-[38px] items-center justify-between gap-3 border-b border-[#d9dfe7] py-[7px] last:border-b-0"
                      >
                        <span className="min-w-0 flex-1 truncate text-[14px] font-normal text-[#202124]">
                          {center.centerName} ({center.centerCode})
                        </span>

                        <span className="shrink-0 rounded-[6px] bg-[#3399ff] px-2 py-[4px] text-[12px] font-semibold leading-none text-white">
                          {center.forwardedQty}
                        </span>
                      </div>
                    ),
                  )}
                </div>

                {/* Exact old-style arrow: it stays attached to the clicked
                    Centers cell because arrowTop is recalculated on scroll. */}
                <div
                  className="pointer-events-none absolute -right-[9px] h-0 w-0 border-b-[9px] border-l-[9px] border-t-[9px] border-b-transparent border-l-[#d6dbe1] border-t-transparent"
                  style={{ top: `${centerPopover.arrowTop}px` }}
                />

                <div
                  className="pointer-events-none absolute -right-[8px] h-0 w-0 border-b-[8px] border-l-[8px] border-t-[8px] border-b-transparent border-l-white border-t-transparent"
                  style={{ top: `${centerPopover.arrowTop + 1}px` }}
                />
              </div>
            </>,
            document.body,
          )}
      </>
    )
  }

  // ============================================================
  // SORTABLE HEADER
  // ============================================================
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

  // ============================================================
  // INITIAL LOADING
  // ============================================================
  if (
    loading &&
    flattenedData.length === 0
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2f5fa7]" />

          <span className="text-sm text-gray-500">
            Loading reseller stock...
          </span>
        </div>
      </div>
    )
  }

  // ============================================================
  // ERROR
  // ============================================================
  if (error) {
    return (
      <div className="mx-4 mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  // ============================================================
  // UI
  // ============================================================
  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

      {/* Page Title */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Reseller Forwarded Quantity Report
      </div>

      {/* Search Modal */}
      <ResellerQtySearch
        visible={searchModalVisible}
        onClose={() =>
          setSearchModalVisible(false)
        }
        onSearch={handleSearch}
        resellers={resellers}
        products={products}
      />

      {/* Main Card */}
      <div className="overflow-hidden border-0 bg-white shadow-[0_1px_5px_rgba(0,0,0,0.12)]">

        {/* Card Header */}
        <div className="border-t-[4px] border-t-[#2f5fa7] border-b border-[#dedede] bg-white px-4 py-2">

          <div className="flex items-center justify-between">

            {/* Left Buttons */}
            <div className="flex items-center gap-1.5">

              {/* Search */}
              <button
                type="button"
                onClick={() =>
                  setSearchModalVisible(true)
                }
                className="inline-flex h-[35px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-3 text-[16px] font-medium text-white transition hover:bg-[#244c88]"
              >
                <Search size={16} />
                Search
              </button>

              {/* Reset Search */}
              {(activeSearch.reseller ||
                activeSearch.product ||
                activeSearch.center ||
                activeSearch.startDate ||
                activeSearch.endDate) && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="inline-flex h-[35px] items-center gap-1.5 rounded-[4px] bg-[#6c757d] px-3 text-[15px] font-medium text-white transition hover:bg-[#5c636a]"
                >
                  <RotateCcw size={15} />
                  Reset Search
                </button>
              )}

              {/* Export */}
              <button
                type="button"
                onClick={generateExport}
                disabled={
                  flattenedData.length === 0
                }
                className="inline-flex h-[35px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-3 text-[16px] font-medium text-white transition hover:bg-[#244c88] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={15} />
                Export
              </button>
            </div>

            {/* Top Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

          </div>
        </div>

        {/* Card Body */}
        <div className="px-[18px] py-[17px]">

          {/* Search */}
          <div className="mb-4 flex justify-end">

            <div className="flex w-full items-center gap-2 sm:w-auto">

              <label
                htmlFor="reseller-search"
                className="whitespace-nowrap text-[16px] font-semibold text-[#111]"
              >
                Search:
              </label>

              <input
                id="reseller-search"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="h-[34px] w-full rounded-[2px] border border-[#d9d9d9] bg-white px-2 text-[15px] outline-none transition focus:border-[#2f5fa7] sm:w-[220px]"
              />

            </div>

          </div>

          {/* ==================================================
              TABLE
              Same UI structure as CenterList.jsx
              ================================================== */}
          <div className="w-full overflow-hidden border border-[#eeeeee]">

            {/* Vertical Scroll Area */}
            <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">

              <table className="w-full table-fixed border-collapse">

                {/* Column Widths */}
                <colgroup>
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '31%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '10%' }} />
                </colgroup>

                {/* Table Header */}
                <thead className="sticky top-0 z-20">

                  <tr>

                    <SortableHeader
                      label="Reseller"
                      sortKey="resellerName"
                    />

                    <SortableHeader
                      label="Product"
                      sortKey="productName"
                    />

                    <SortableHeader
                      label={
                        <>
                          Product
                          <br />
                          Code
                        </>
                      }
                      sortKey="productCode"
                    />

                    <SortableHeader
                      label={
                        <>
                          Forwarded
                          <br />
                          Quantity
                        </>
                      }
                      sortKey="availableQuantity"
                    />

                    <SortableHeader
                      label="Orders"
                      sortKey="orderCount"
                    />

                    <SortableHeader
                      label="Centers"
                      sortKey="centersCount"
                    />

                  </tr>

                </thead>

                {/* Table Body */}
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

                        {/* Reseller */}
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          <div className="break-words">
                            {item.resellerName || ''}
                          </div>
                        </td>

                        {/* Product */}
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          <div className="break-words">
                            {item.productName || ''}
                          </div>
                        </td>

                        {/* Product Code */}
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          <div className="break-words">
                            {item.productCode || ''}
                          </div>
                        </td>

                        {/* Forwarded Quantity */}
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          {item.displayQuantity || 0}
                        </td>

                        {/* Orders */}
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          {item.orderCount || 0}
                        </td>

                        {/* Centers */}
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[16px] leading-6 text-[#111]">
                          {renderCenterDetails(item.centers, item._id)}
                        </td>

                      </tr>

                    ))
                  ) : (

                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-sm text-gray-500"
                      >
                        {loading
                          ? 'Loading...'
                          : 'No data found. Try adjusting your search filters.'}
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

export default ResellerStock