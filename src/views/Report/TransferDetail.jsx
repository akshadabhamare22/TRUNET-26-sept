// import React, { useEffect, useState } from "react";
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   RotateCcw,
//   Search,
//   X,
// } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";

// import axiosInstance from "../../axiosInstance";import Pagination from "../../utils/Pagination";
// import { showError } from "../../utils/sweetAlerts";
// import { formatDate } from "../../utils/FormatDateTime";
// import CommonSearch from "./CommonSearch";

// const TransferDetail = () => {
//   const [data, setData] = useState([]);
//   const [centers, setCenters] = useState([]);
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
//     center: "",
//     product: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const location = useLocation();
//   const navigate = useNavigate();

//   // ---------------------------------------------------------
//   // Convert DD-MM-YYYY to YYYY-MM-DD
//   // ---------------------------------------------------------
//   const convertToYYYYMMDD = (dateStr) => {
//     if (!dateStr) return "";

//     if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
//       return dateStr;
//     }

//     const parts = dateStr.split("-");

//     if (parts.length === 3) {
//       const [day, month, year] = parts;
//       return `${year}-${month}-${day}`;
//     }

//     return dateStr;
//   };

//   // ---------------------------------------------------------
//   // URL Parameters
//   // ---------------------------------------------------------
//   const getUrlParams = () => {
//     const searchParams = new URLSearchParams(location.search);

//     return {
//       product: searchParams.get("product"),
//       center: searchParams.get("center"),
//       productName: searchParams.get("productName"),
//       centerName: searchParams.get("centerName"),
//       month: searchParams.get("month"),
//       transferType: searchParams.get("transferType"),
//     };
//   };

//   // ---------------------------------------------------------
//   // Product click
//   // ---------------------------------------------------------
//   const handleProductClick = (productId, productName) => {
//     console.log("🔍 Clicking product:", {
//       productId,
//       productName,
//     });

//     if (!productId) {
//       console.warn("No product ID provided for navigation");
//       return;
//     }

//     navigate("/stock-request", {
//       state: {
//         productFilter: productId,
//         productName: productName || "Product",
//         fromTransferReport: true,
//       },
//     });
//   };

//   // ---------------------------------------------------------
//   // Fetch Centers
//   // ---------------------------------------------------------
//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get("/centers");

//       if (response.data.success) {
//         setCenters(response.data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching centers:", error);
//     }
//   };

//   // ---------------------------------------------------------
//   // Fetch Products
//   // ---------------------------------------------------------
//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get("/products/all");

//       if (response.data.success) {
//         setProducts(response.data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   // ---------------------------------------------------------
//   // Fetch Transfer Data
//   // ---------------------------------------------------------
//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();
//       const urlParams = getUrlParams();

//       const centerId = urlParams.center || searchParams.center;
//       const productId = urlParams.product || searchParams.product;
//       const transferType = urlParams.transferType;

//       // Center filter
//       if (centerId) {
//         if (transferType === "receive") {
//           params.append("toCenter", centerId);
//         } else if (transferType === "given") {
//           params.append("fromCenter", centerId);
//         } else {
//           params.append("center", centerId);
//         }
//       }

//       // Product filter
//       if (productId) {
//         params.append("product", productId);
//       }

//       // Date filters
//       if (searchParams.startDate && searchParams.endDate) {
//         const convertedStartDate = convertToYYYYMMDD(
//           searchParams.startDate
//         );

//         const convertedEndDate = convertToYYYYMMDD(
//           searchParams.endDate
//         );

//         params.append("startDate", convertedStartDate);
//         params.append("endDate", convertedEndDate);
//       }

//       // Month filter from URL
//       if (urlParams.month) {
//         const [year, month] = urlParams.month.split("-");

//         const monthStart = `${year}-${month.padStart(2, "0")}-01`;

//         const lastDay = new Date(
//           parseInt(year, 10),
//           parseInt(month, 10),
//           0
//         ).getDate();

//         const monthEnd = `${year}-${month.padStart(
//           2,
//           "0"
//         )}-${lastDay}`;

//         params.append("startDate", monthStart);
//         params.append("endDate", monthEnd);
//       }

//       params.append("page", page);

//       const url = params.toString()
//         ? `/reports/transfers?${params.toString()}`
//         : "/reports/transfers";

//       console.log("Fetching URL:", url);

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         setData(response.data.data || []);

//         setCurrentPage(
//           response.data.pagination?.currentPage || 1
//         );

//         setTotalPages(
//           response.data.pagination?.totalPages || 1
//         );
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

//         console.error(
//           "Error message:",
//           err.message
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------------------------------------------------
//   // Initial Data
//   // ---------------------------------------------------------
//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setLoading(true);

//         const urlParams = getUrlParams();

//         console.log(
//           "Transfer Detail URL Parameters:",
//           urlParams
//         );

//         await Promise.all([
//           fetchCenters(),
//           fetchProducts(),
//         ]);

//         let searchParams = {};

//         if (urlParams.product && urlParams.center) {
//           searchParams = {
//             product: urlParams.product,
//             center: urlParams.center,
//             startDate: "",
//             endDate: "",
//           };

//           if (urlParams.month) {
//             const [year, month] =
//               urlParams.month.split("-");

//             const monthStart = `${year}-${month.padStart(
//               2,
//               "0"
//             )}-01`;

//             const lastDay = new Date(
//               parseInt(year, 10),
//               parseInt(month, 10),
//               0
//             ).getDate();

//             const monthEnd = `${year}-${month.padStart(
//               2,
//               "0"
//             )}-${lastDay}`;

//             searchParams.startDate = monthStart;
//             searchParams.endDate = monthEnd;
//           }

//           console.log(
//             "Using filtered search from URL:",
//             searchParams
//           );

//           setActiveSearch(searchParams);

//           if (
//             urlParams.productName &&
//             urlParams.centerName
//           ) {
//             const transferTypeText =
//               urlParams.transferType === "receive"
//                 ? "Received"
//                 : "Given";

//             document.title = `Transfer Details (${transferTypeText}) - ${decodeURIComponent(
//               urlParams.productName
//             )} at ${decodeURIComponent(
//               urlParams.centerName
//             )}`;
//           }
//         } else {
//           console.log(
//             "No URL parameters, fetching all data"
//           );

//           searchParams = {};
//         }

//         await fetchData(searchParams, 1);
//       } catch (error) {
//         console.error(
//           "Error initializing data:",
//           error
//         );

//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     initializeData();
//   }, [location.search]);

//   // ---------------------------------------------------------
//   // Pagination
//   // ---------------------------------------------------------
//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;

//     fetchData(activeSearch, page);
//   };

//   // ---------------------------------------------------------
//   // Flatten transfer products
//   // ---------------------------------------------------------
//   const getFlattenedData = () => {
//     const flattened = [];

//     data.forEach((transfer) => {
//       if (
//         transfer.products &&
//         transfer.products.length > 0
//       ) {
//         transfer.products.forEach((product, index) => {
//           const productId =
//             product?.product?._id ||
//             product?.product ||
//             "no_product";

//           const uniqueKey = `${transfer._id}_${productId}_${index}`;

//           flattened.push({
//             ...transfer,
//             productDetail: product,
//             uniqueKey,
//           });
//         });
//       } else {
//         flattened.push({
//           ...transfer,
//           productDetail: null,
//           uniqueKey: `${transfer._id}_no_product`,
//         });
//       }
//     });

//     return flattened;
//   };

//   // ---------------------------------------------------------
//   // Totals
//   // ---------------------------------------------------------
//   const calculateTotals = () => {
//     const totals = {
//       totalRequestedQty: 0,
//       totalApprovedQty: 0,
//       totalReceivedQty: 0,
//     };

//     getFlattenedData().forEach((item) => {
//       if (item.productDetail) {
//         totals.totalRequestedQty += parseFloat(
//           item.productDetail.quantity || 0
//         );

//         totals.totalApprovedQty += parseFloat(
//           item.productDetail.approvedQuantity || 0
//         );

//         totals.totalReceivedQty += parseFloat(
//           item.productDetail.receivedQuantity || 0
//         );
//       }
//     });

//     return totals;
//   };

//   // ---------------------------------------------------------
//   // Sort
//   // ---------------------------------------------------------
//   const getNestedValue = (object, path) => {
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
//       sortConfig.direction === "ascending"
//     ) {
//       direction = "descending";
//     }

//     setSortConfig({
//       key,
//       direction,
//     });

//     const sortedData = [...data].sort((a, b) => {
//       const aValue = getNestedValue(a, key);
//       const bValue = getNestedValue(b, key);

//       if (aValue == null && bValue == null) return 0;
//       if (aValue == null) return 1;
//       if (bValue == null) return -1;

//       if (aValue < bValue) {
//         return direction === "ascending" ? -1 : 1;
//       }

//       if (aValue > bValue) {
//         return direction === "ascending" ? 1 : -1;
//       }

//       return 0;
//     });

//     setData(sortedData);
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null;
//     }

//     return sortConfig.direction === "ascending" ? (
//       <ArrowUp size={14} />
//     ) : (
//       <ArrowDown size={14} />
//     );
//   };

//   // ---------------------------------------------------------
//   // Search
//   // ---------------------------------------------------------
//   const handleSearch = (searchData) => {
//     const mergedSearchData = {
//       ...activeSearch,
//       ...searchData,
//     };

//     setActiveSearch(mergedSearchData);
//     setSearchTerm("");

//     fetchData(mergedSearchData, 1);
//   };

//   // ---------------------------------------------------------
//   // Reset Search
//   // ---------------------------------------------------------
//   const handleResetSearch = () => {
//     const resetData = {
//       center: "",
//       product: "",
//       startDate: "",
//       endDate: "",
//     };

//     setActiveSearch(resetData);
//     setSearchTerm("");

//     fetchData({}, 1);
//   };

//   // ---------------------------------------------------------
//   // Check if advanced search active
//   // ---------------------------------------------------------
//   const isSearchActive = () => {
//     return (
//       activeSearch.center ||
//       activeSearch.product ||
//       activeSearch.startDate ||
//       activeSearch.endDate
//     );
//   };

//   // ---------------------------------------------------------
//   // Frontend Search
//   // ---------------------------------------------------------
//   const filteredFlattenedData =
//     getFlattenedData().filter((item) => {
//       if (isSearchActive()) {
//         return true;
//       }

//       if (!searchTerm.trim()) {
//         return true;
//       }

//       const searchValue =
//         searchTerm.toLowerCase();

//       return Object.values(item).some((value) => {
//         if (
//           typeof value === "object" &&
//           value !== null
//         ) {
//           return Object.values(value).some(
//             (nestedValue) =>
//               nestedValue &&
//               nestedValue
//                 .toString()
//                 .toLowerCase()
//                 .includes(searchValue)
//           );
//         }

//         return (
//           value &&
//           value
//             .toString()
//             .toLowerCase()
//             .includes(searchValue)
//         );
//       });
//     });

//   // ---------------------------------------------------------
//   // Export
//   // ---------------------------------------------------------
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);

//       const params = new URLSearchParams();

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

//       if (
//         activeSearch.startDate &&
//         activeSearch.endDate
//       ) {
//         const convertedStartDate =
//           convertToYYYYMMDD(
//             activeSearch.startDate
//           );

//         const convertedEndDate =
//           convertToYYYYMMDD(
//             activeSearch.endDate
//           );

//         params.append(
//           "startDate",
//           convertedStartDate
//         );

//         params.append(
//           "endDate",
//           convertedEndDate
//         );
//       }

//       if (
//         activeSearch.date &&
//         activeSearch.date.includes(" to ")
//       ) {
//         const [
//           startDateStr,
//           endDateStr,
//         ] = activeSearch.date.split(" to ");

//         const convertDateFormat = (dateStr) => {
//           const [
//             day,
//             month,
//             year,
//           ] = dateStr.split("-");

//           return `${year}-${month}-${day}`;
//         };

//         params.append(
//           "startDate",
//           convertDateFormat(startDateStr)
//         );

//         params.append(
//           "endDate",
//           convertDateFormat(endDateStr)
//         );
//       }

//       params.append("export", "true");

//       const apiUrl = params.toString()
//         ? `/reports/transfers?${params.toString()}`
//         : "/reports/transfers";

//       const response =
//         await axiosInstance.get(apiUrl);

//       if (!response.data.success) {
//         throw new Error(
//           "API returned unsuccessful response"
//         );
//       }

//       const exportData =
//         response.data.data;

//       if (
//         !exportData ||
//         exportData.length === 0
//       ) {
//         showError(
//           "No data available for export"
//         );
//         return;
//       }

//       const headers = [
//         "Invoice No.",
//         "Date",
//         "Center",
//         "Parent Center",
//         "Product",
//         "Quantity",
//         "Center Stock",
//         "Parent Stock",
//         "Product Remark",
//         "Approved Quantity",
//         "Approved Remark",
//         "Received Qty.",
//         "Received Remark",
//       ];

//       const csvData = exportData.flatMap(
//         (transfer) => {
//           if (
//             transfer.products &&
//             transfer.products.length > 0
//           ) {
//             return transfer.products.map(
//               (product) => [
//                 transfer.transferNumber ||
//                   "N/A",

//                 formatDate(
//                   transfer.date
//                 ),

//                 transfer.fromCenter
//                   ?.centerName || "N/A",

//                 transfer.toCenter
//                   ?.centerName || "N/A",

//                 product.product
//                   ?.productTitle || "N/A",

//                 product.quantity || 0,

//                 product.fromCenterStock
//                   ?.availableQuantity || 0,

//                 product.toCenterStock
//                   ?.availableQuantity || 0,

//                 product.productRemark ||
//                   "",

//                 product.approvedQuantity ||
//                   0,

//                 product.approvedRemark ||
//                   "",

//                 product.receivedQuantity ||
//                   0,

//                 product.receivedRemark ||
//                   "",
//               ]
//             );
//           }

//           return [
//             [
//               transfer.transferNumber ||
//                 "N/A",

//               formatDate(
//                 transfer.date
//               ),

//               transfer.fromCenter
//                 ?.centerName || "N/A",

//               transfer.toCenter
//                 ?.centerName || "N/A",

//               "No Product",

//               0,
//               0,
//               0,
//               "",
//               0,
//               "",
//               0,
//               "",
//             ],
//           ];
//         }
//       );

//       const csvContent = [
//         headers.join(","),
//         ...csvData.map((row) =>
//           row
//             .map((field) => {
//               const stringField =
//                 String(field || "");

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

//       const link =
//         document.createElement("a");

//       const downloadUrl =
//         URL.createObjectURL(blob);

//       link.setAttribute(
//         "href",
//         downloadUrl
//       );

//       link.setAttribute(
//         "download",
//         `transfer_detail_report_${new Date()
//           .toISOString()
//           .split("T")[0]}.csv`
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

//   // ---------------------------------------------------------
//   // Loading
//   // ---------------------------------------------------------
//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   // ---------------------------------------------------------
//   // Error
//   // ---------------------------------------------------------
//   if (error) {
//     return (
//       <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
//         <h5 className="mb-1 text-sm font-semibold">
//           Error Loading Data
//         </h5>

//         <p className="mb-3 text-sm">
//           {error}
//         </p>

//         <button
//           type="button"
//           onClick={() =>
//             window.location.reload()
//           }
//           className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   const totals = calculateTotals();

//   return (
//     <div className="w-full">
//       {/* Page Title */}
//       <div className="mb-4">
//         <h1 className="text-xl font-semibold text-gray-800">
//           Transfer Detail Report
//         </h1>
//       </div>

//       {/* Search Modal */}
//       <CommonSearch
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//       />

//       {/* Main Card */}
//       <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             {/* Search */}
//             <button
//               type="button"
//               onClick={() =>
//                 setSearchModalVisible(true)
//               }
//               className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//             >
//               <Search size={15} />
//               Search
//             </button>

//             {/* Reset */}
//             {isSearchActive() && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex items-center gap-1.5 rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
//               >
//                 <RotateCcw size={15} />
//                 Reset Search
//               </button>
//             )}

//             {/* Export */}
//             <button
//               type="button"
//               onClick={generateDetailExport}
//               className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
//             >
//               <Download size={15} />
//               Export
//             </button>
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

//         {/* Card Body */}
//         <div className="p-4">
//           {/* Filters + Search */}
//           <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
//             {/* Filter Chips */}
//             <div className="flex flex-wrap gap-2">
//               {/* Product */}
//               {activeSearch.product && (
//                 <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700">
//                   <span>
//                     Product:{" "}
//                     {products.find(
//                       (p) =>
//                         p._id ===
//                         activeSearch.product
//                     )?.productTitle ||
//                       activeSearch.product.substring(
//                         0,
//                         8
//                       )}
//                   </span>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       const updatedSearch = {
//                         ...activeSearch,
//                         product: "",
//                       };

//                       setActiveSearch(
//                         updatedSearch
//                       );

//                       fetchData(
//                         updatedSearch,
//                         1
//                       );
//                     }}
//                     className="rounded-full p-0.5 text-red-500 hover:bg-red-100"
//                     aria-label="Remove product filter"
//                   >
//                     <X size={13} />
//                   </button>
//                 </span>
//               )}

//               {/* Center */}
//               {activeSearch.center && (
//                 <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700">
//                   <span>
//                     Center:{" "}
//                     {centers.find(
//                       (c) =>
//                         c._id ===
//                         activeSearch.center
//                     )?.centerName ||
//                       activeSearch.center.substring(
//                         0,
//                         8
//                       )}
//                   </span>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       const updatedSearch = {
//                         ...activeSearch,
//                         center: "",
//                       };

//                       setActiveSearch(
//                         updatedSearch
//                       );

//                       fetchData(
//                         updatedSearch,
//                         1
//                       );
//                     }}
//                     className="rounded-full p-0.5 text-red-500 hover:bg-red-100"
//                     aria-label="Remove center filter"
//                   >
//                     <X size={13} />
//                   </button>
//                 </span>
//               )}

//               {/* Date */}
//               {activeSearch.startDate &&
//                 activeSearch.endDate && (
//                   <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700">
//                     <span>
//                       Date:{" "}
//                       {activeSearch.startDate}{" "}
//                       to{" "}
//                       {activeSearch.endDate}
//                     </span>

//                     <button
//                       type="button"
//                       onClick={() => {
//                         const updatedSearch = {
//                           ...activeSearch,
//                           startDate: "",
//                           endDate: "",
//                         };

//                         setActiveSearch(
//                           updatedSearch
//                         );

//                         fetchData(
//                           updatedSearch,
//                           1
//                         );
//                       }}
//                       className="rounded-full p-0.5 text-red-500 hover:bg-red-100"
//                       aria-label="Remove date filter"
//                     >
//                       <X size={13} />
//                     </button>
//                   </span>
//                 )}
//             </div>

//             {/* Search Input */}
//             <div className="flex w-full items-center gap-2 lg:w-auto">
//               <label
//                 htmlFor="transfer-search"
//                 className="whitespace-nowrap text-sm font-medium text-gray-700"
//               >
//                 Search:
//               </label>

//               <input
//                 id="transfer-search"
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) =>
//                   setSearchTerm(
//                     e.target.value
//                   )
//                 }
//                 disabled={isSearchActive()}
//                 placeholder={
//                   isSearchActive()
//                     ? "Disabled during advanced search"
//                     : "Search..."
//                 }
//                 className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 lg:w-[350px]"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="w-full overflow-x-auto rounded-md border border-gray-200">
//             <table className="min-w-[1100px] w-full border-collapse text-sm">
//               <thead>
//                 <tr className="bg-gray-50 text-left">
//                   <SortableHeader
//                     label="Indent No"
//                     sortKey="transferNumber"
//                     onSort={handleSort}
//                     sortIcon={getSortIcon(
//                       "transferNumber"
//                     )}
//                   />

//                   <SortableHeader
//                     label="Date"
//                     sortKey="date"
//                     onSort={handleSort}
//                     sortIcon={getSortIcon("date")}
//                   />

//                   <SortableHeader
//                     label="Branch"
//                     sortKey="fromCenter.centerName"
//                     onSort={handleSort}
//                     sortIcon={getSortIcon(
//                       "fromCenter.centerName"
//                     )}
//                   />

//                   <SortableHeader
//                     label="Parent Branch"
//                     sortKey="toCenter.centerName"
//                     onSort={handleSort}
//                     sortIcon={getSortIcon(
//                       "toCenter.centerName"
//                     )}
//                   />

//                   <SortableHeader
//                     label="Product"
//                     sortKey="productDetail.product.productTitle"
//                     onSort={handleSort}
//                     sortIcon={getSortIcon(
//                       "productDetail.product.productTitle"
//                     )}
//                   />

//                   <SortableHeader
//                     label="Requested Qty"
//                     sortKey="productDetail.quantity"
//                     onSort={handleSort}
//                     sortIcon={getSortIcon(
//                       "productDetail.quantity"
//                     )}
//                   />

//                   <SortableHeader
//                     label="Center Stock"
//                     sortKey="productDetail.toCenterStock.availableQuantity"
//                     onSort={handleSort}
//                     sortIcon={getSortIcon(
//                       "productDetail.toCenterStock.availableQuantity"
//                     )}
//                   />

//                   <SortableHeader
//                     label="Parent Stock"
//                     sortKey="productDetail.fromCenterStock.availableQuantity"
//                     onSort={handleSort}
//                     sortIcon={getSortIcon(
//                       "productDetail.fromCenterStock.availableQuantity"
//                     )}
//                   />

//                   <SortableHeader
//                     label="Approved Qty"
//                     sortKey="productDetail.approvedQuantity"
//                     onSort={handleSort}
//                     sortIcon={getSortIcon(
//                       "productDetail.approvedQuantity"
//                     )}
//                   />

//                   <SortableHeader
//                     label="Received Qty"
//                     sortKey="productDetail.receivedQuantity"
//                     onSort={handleSort}
//                     sortIcon={getSortIcon(
//                       "productDetail.receivedQuantity"
//                     )}
//                   />
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredFlattenedData.length >
//                 0 ? (
//                   <>
//                     {filteredFlattenedData.map(
//                       (item) => {
//                         const productId =
//                           item.productDetail
//                             ?.product?._id;

//                         const productName =
//                           item.productDetail
//                             ?.product
//                             ?.productTitle;

//                         const centerId =
//                           item.fromCenter?._id ||
//                           item.toCenter?._id;

//                         const centerName =
//                           item.fromCenter
//                             ?.centerName ||
//                           item.toCenter
//                             ?.centerName;

//                         return (
//                           <tr
//                             key={item.uniqueKey}
//                             className="border-t border-gray-200 transition hover:bg-gray-50"
//                           >
//                             {/* Indent No */}
//                             <td className="px-3 py-3 text-gray-700">
//                               {item.transferNumber ||
//                                 ""}
//                             </td>

//                             {/* Date */}
//                             <td className="px-3 py-3 text-gray-700">
//                               {formatDate(
//                                 item.date || ""
//                               )}
//                             </td>

//                             {/* Branch */}
//                             <td className="px-3 py-3 text-gray-700">
//                               {item.toCenter
//                                 ?.centerName ||
//                                 ""}
//                             </td>

//                             {/* Parent Branch */}
//                             <td className="px-3 py-3 text-gray-700">
//                               {item.fromCenter
//                                 ?.centerName ||
//                                 ""}
//                             </td>

//                             {/* Product */}
//                             <td className="px-3 py-3">
//                               {item.productDetail
//                                 ?.product
//                                 ?.productTitle ? (
//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     console.log(
//                                       "🖱️ Product clicked:",
//                                       {
//                                         productId,
//                                         productName,
//                                         centerId,
//                                         centerName,
//                                       }
//                                     );

//                                     handleProductClick(
//                                       productId,
//                                       productName
//                                     );
//                                   }}
//                                   title="Click to view all stock requests for this product"
//                                   className="font-medium text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-800"
//                                 >
//                                   {
//                                     item
//                                       .productDetail
//                                       .product
//                                       .productTitle
//                                   }
//                                 </button>
//                               ) : (
//                                 <span className="text-gray-500">
//                                   No Product
//                                 </span>
//                               )}
//                             </td>

//                             {/* Requested Qty */}
//                             <td className="px-3 py-3">
//                               {item.productDetail
//                                 ?.quantity ? (
//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     console.log(
//                                       "🖱️ Quantity clicked:",
//                                       {
//                                         productId,
//                                         productName,
//                                         centerId,
//                                         centerName,
//                                         quantity:
//                                           item
//                                             .productDetail
//                                             .quantity,
//                                       }
//                                     );

//                                     handleProductClick(
//                                       productId,
//                                       productName
//                                     );
//                                   }}
//                                   title="Click to view all stock requests for this product"
//                                   className="font-medium text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-800"
//                                 >
//                                   {item
//                                     .productDetail
//                                     .quantity ||
//                                     0}
//                                 </button>
//                               ) : (
//                                 0
//                               )}
//                             </td>

//                             {/* Center Stock */}
//                             <td className="px-3 py-3 text-gray-700">
//                               {item.productDetail
//                                 ?.toCenterStock
//                                 ?.availableQuantity ||
//                                 0}
//                             </td>

//                             {/* Parent Stock */}
//                             <td className="px-3 py-3 text-gray-700">
//                               {item.productDetail
//                                 ?.fromCenterStock
//                                 ?.availableQuantity ||
//                                 0}
//                             </td>

//                             {/* Approved Qty */}
//                             <td className="px-3 py-3 text-gray-700">
//                               {item.productDetail
//                                 ?.approvedQuantity ||
//                                 0}
//                             </td>

//                             {/* Received Qty */}
//                             <td className="px-3 py-3 text-gray-700">
//                               {item.productDetail
//                                 ?.receivedQuantity ||
//                                 0}
//                             </td>
//                           </tr>
//                         );
//                       }
//                     )}

//                     {/* Total */}
//                     <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold text-gray-800">
//                       <td
//                         colSpan={5}
//                         className="px-3 py-3"
//                       >
//                         Total
//                       </td>

//                       <td className="px-3 py-3">
//                         {
//                           totals.totalRequestedQty
//                         }
//                       </td>

//                       <td className="px-3 py-3">
//                         -
//                       </td>

//                       <td className="px-3 py-3">
//                         -
//                       </td>

//                       <td className="px-3 py-3">
//                         {
//                           totals.totalApprovedQty
//                         }
//                       </td>

//                       <td className="px-3 py-3">
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
//                       className="px-4 py-10 text-center text-sm text-gray-500"
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

// // ---------------------------------------------------------
// // Sortable Header Component
// // ---------------------------------------------------------
// const SortableHeader = ({
//   label,
//   sortKey,
//   onSort,
//   sortIcon,
// }) => {
//   return (
//     <th
//       scope="col"
//       onClick={() => onSort(sortKey)}
//       className="cursor-pointer select-none whitespace-nowrap border-b border-gray-200 px-3 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
//     >
//       <div className="flex items-center gap-1">
//         <span>{label}</span>

//         {sortIcon || (
//           <span className="text-gray-400">
//             <ArrowDown size={13} />
//           </span>
//         )}
//       </div>
//     </th>
//   );
// };

// export default TransferDetail;







import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import axiosInstance from "../../axiosInstance";
import { showError } from "../../utils/sweetAlerts";
import { formatDate } from "../../utils/FormatDateTime";
import CommonSearch from "./CommonSearch";

const TransferDetail = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const [activeSearch, setActiveSearch] = useState({
    center: "",
    product: "",
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // Convert DD-MM-YYYY to YYYY-MM-DD
  // ---------------------------------------------------------
  const convertToYYYYMMDD = (dateStr) => {
    if (!dateStr) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    const parts = dateStr.split("-");

    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    }

    return dateStr;
  };

  // ---------------------------------------------------------
  // URL Parameters
  // ---------------------------------------------------------
  const getUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);

    return {
      product: searchParams.get("product"),
      center: searchParams.get("center"),
      productName: searchParams.get("productName"),
      centerName: searchParams.get("centerName"),
      month: searchParams.get("month"),
      transferType: searchParams.get("transferType"),
    };
  };

  // ---------------------------------------------------------
  // Product click
  // ---------------------------------------------------------
  const handleProductClick = (productId, productName) => {
    if (!productId) {
      console.warn("No product ID provided for navigation");
      return;
    }

    navigate("/stock-request", {
      state: {
        productFilter: productId,
        productName: productName || "Product",
        fromTransferReport: true,
      },
    });
  };

  // ---------------------------------------------------------
  // Fetch Centers
  // ---------------------------------------------------------
  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get("/centers");

      if (response.data.success) {
        setCenters(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
    }
  };

  // ---------------------------------------------------------
  // Fetch Products
  // ---------------------------------------------------------
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products/all");

      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ---------------------------------------------------------
  // Fetch Transfer Data
  // ---------------------------------------------------------
  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      const urlParams = getUrlParams();

      const centerId = urlParams.center || searchParams.center;
      const productId = urlParams.product || searchParams.product;
      const transferType = urlParams.transferType;

      if (centerId) {
        if (transferType === "receive") {
          params.append("toCenter", centerId);
        } else if (transferType === "given") {
          params.append("fromCenter", centerId);
        } else {
          params.append("center", centerId);
        }
      }

      if (productId) {
        params.append("product", productId);
      }

      if (searchParams.startDate && searchParams.endDate) {
        params.append(
          "startDate",
          convertToYYYYMMDD(searchParams.startDate)
        );

        params.append(
          "endDate",
          convertToYYYYMMDD(searchParams.endDate)
        );
      }

      if (urlParams.month) {
        const [year, month] = urlParams.month.split("-");
        const paddedMonth = month.padStart(2, "0");

        const monthStart = `${year}-${paddedMonth}-01`;

        const lastDay = new Date(
          parseInt(year, 10),
          parseInt(month, 10),
          0
        ).getDate();

        const monthEnd = `${year}-${paddedMonth}-${lastDay}`;

        params.append("startDate", monthStart);
        params.append("endDate", monthEnd);
      }

      params.append("page", page);

      const url = params.toString()
        ? `/reports/transfers?${params.toString()}`
        : "/reports/transfers";

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setData(response.data.data || []);

        setCurrentPage(response.data.pagination?.currentPage || page);
        setTotalPages(
          Math.max(1, response.data.pagination?.totalPages || 1)
        );
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

  // ---------------------------------------------------------
  // Initial Data
  // ---------------------------------------------------------
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);

        const urlParams = getUrlParams();

        await Promise.all([fetchCenters(), fetchProducts()]);

        let searchParams = {};

        if (urlParams.product && urlParams.center) {
          searchParams = {
            product: urlParams.product,
            center: urlParams.center,
            startDate: "",
            endDate: "",
          };

          if (urlParams.month) {
            const [year, month] = urlParams.month.split("-");
            const paddedMonth = month.padStart(2, "0");

            const monthStart = `${year}-${paddedMonth}-01`;

            const lastDay = new Date(
              parseInt(year, 10),
              parseInt(month, 10),
              0
            ).getDate();

            const monthEnd = `${year}-${paddedMonth}-${lastDay}`;

            searchParams.startDate = monthStart;
            searchParams.endDate = monthEnd;
          }

          setActiveSearch(searchParams);

          if (urlParams.productName && urlParams.centerName) {
            const transferTypeText =
              urlParams.transferType === "receive"
                ? "Received"
                : "Given";

            document.title = `Transfer Details (${transferTypeText}) - ${decodeURIComponent(
              urlParams.productName
            )} at ${decodeURIComponent(urlParams.centerName)}`;
          }
        }

        await fetchData(searchParams, 1);
      } catch (error) {
        console.error("Error initializing data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    initializeData();
    // URL changes should refresh the report.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // ---------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    fetchData(activeSearch, page);
  };

  // ---------------------------------------------------------
  // Flatten transfer products
  // ---------------------------------------------------------
  const getFlattenedData = () => {
    const flattened = [];

    data.forEach((transfer) => {
      if (transfer.products && transfer.products.length > 0) {
        transfer.products.forEach((product, index) => {
          const productId =
            product?.product?._id || product?.product || "no_product";

          flattened.push({
            ...transfer,
            productDetail: product,
            uniqueKey: `${transfer._id}_${productId}_${index}`,
          });
        });
      } else {
        flattened.push({
          ...transfer,
          productDetail: null,
          uniqueKey: `${transfer._id}_no_product`,
        });
      }
    });

    return flattened;
  };

  // ---------------------------------------------------------
  // Totals
  // ---------------------------------------------------------
  const calculateTotals = () => {
    const totals = {
      totalRequestedQty: 0,
      totalApprovedQty: 0,
      totalReceivedQty: 0,
    };

    getFlattenedData().forEach((item) => {
      if (item.productDetail) {
        totals.totalRequestedQty += parseFloat(
          item.productDetail.quantity || 0
        );

        totals.totalApprovedQty += parseFloat(
          item.productDetail.approvedQuantity || 0
        );

        totals.totalReceivedQty += parseFloat(
          item.productDetail.receivedQuantity || 0
        );
      }
    });

    return totals;
  };

  // ---------------------------------------------------------
  // Nested values for sorting
  // ---------------------------------------------------------
  const getNestedValue = (object, path) => {
    return path.split(".").reduce((current, key) => current?.[key], object);
  };

  // ---------------------------------------------------------
  // Sort
  // ---------------------------------------------------------
  const handleSort = (key) => {
    let direction = "ascending";

    if (
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      const aValue = getNestedValue(a, key);
      const bValue = getNestedValue(b, key);

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue < bValue) {
        return direction === "ascending" ? -1 : 1;
      }

      if (aValue > bValue) {
        return direction === "ascending" ? 1 : -1;
      }

      return 0;
    });

    setData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;

    return sortConfig.direction === "ascending" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  // ---------------------------------------------------------
  // Search
  // ---------------------------------------------------------
  const handleSearch = (searchData) => {
    const mergedSearchData = {
      ...activeSearch,
      ...searchData,
    };

    setActiveSearch(mergedSearchData);
    setSearchTerm("");
    fetchData(mergedSearchData, 1);
  };

  // ---------------------------------------------------------
  // Reset Search
  // ---------------------------------------------------------
  const handleResetSearch = () => {
    const resetData = {
      center: "",
      product: "",
      startDate: "",
      endDate: "",
    };

    setActiveSearch(resetData);
    setSearchTerm("");
    fetchData({}, 1);
  };

  // ---------------------------------------------------------
  // Check if advanced search active
  // ---------------------------------------------------------
  const isSearchActive = () => {
    return Boolean(
      activeSearch.center ||
        activeSearch.product ||
        activeSearch.startDate ||
        activeSearch.endDate
    );
  };

  // ---------------------------------------------------------
  // Frontend Search
  // ---------------------------------------------------------
  const filteredFlattenedData = getFlattenedData().filter((item) => {
    if (isSearchActive()) return true;
    if (!searchTerm.trim()) return true;

    const searchValue = searchTerm.toLowerCase();

    return Object.values(item).some((value) => {
      if (typeof value === "object" && value !== null) {
        return Object.values(value).some(
          (nestedValue) =>
            nestedValue &&
            nestedValue.toString().toLowerCase().includes(searchValue)
        );
      }

      return (
        value &&
        value.toString().toLowerCase().includes(searchValue)
      );
    });
  });

  // ---------------------------------------------------------
  // Export CSV
  // ---------------------------------------------------------
  const generateDetailExport = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (activeSearch.center) {
        params.append("center", activeSearch.center);
      }

      if (activeSearch.product) {
        params.append("product", activeSearch.product);
      }

      if (activeSearch.startDate && activeSearch.endDate) {
        params.append(
          "startDate",
          convertToYYYYMMDD(activeSearch.startDate)
        );

        params.append(
          "endDate",
          convertToYYYYMMDD(activeSearch.endDate)
        );
      }

      if (activeSearch.date && activeSearch.date.includes(" to ")) {
        const [startDateStr, endDateStr] = activeSearch.date.split(" to ");

        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split("-");
          return `${year}-${month}-${day}`;
        };

        params.append("startDate", convertDateFormat(startDateStr));
        params.append("endDate", convertDateFormat(endDateStr));
      }

      params.append("export", "true");

      const apiUrl = params.toString()
        ? `/reports/transfers?${params.toString()}`
        : "/reports/transfers";

      const response = await axiosInstance.get(apiUrl);

      if (!response.data.success) {
        throw new Error("API returned unsuccessful response");
      }

      const exportData = response.data.data;

      if (!exportData || exportData.length === 0) {
        showError("No data available for export");
        return;
      }

      const headers = [
        "Invoice No.",
        "Date",
        "Center",
        "Parent Center",
        "Product",
        "Quantity",
        "Center Stock",
        "Parent Stock",
        "Product Remark",
        "Approved Quantity",
        "Approved Remark",
        "Received Qty.",
        "Received Remark",
      ];

      const csvData = exportData.flatMap((transfer) => {
        if (transfer.products && transfer.products.length > 0) {
          return transfer.products.map((product) => [
            transfer.transferNumber || "N/A",
            formatDate(transfer.date),
            transfer.fromCenter?.centerName || "N/A",
            transfer.toCenter?.centerName || "N/A",
            product.product?.productTitle || "N/A",
            product.quantity || 0,
            product.fromCenterStock?.availableQuantity || 0,
            product.toCenterStock?.availableQuantity || 0,
            product.productRemark || "",
            product.approvedQuantity || 0,
            product.approvedRemark || "",
            product.receivedQuantity || 0,
            product.receivedRemark || "",
          ]);
        }

        return [
          [
            transfer.transferNumber || "N/A",
            formatDate(transfer.date),
            transfer.fromCenter?.centerName || "N/A",
            transfer.toCenter?.centerName || "N/A",
            "No Product",
            0,
            0,
            0,
            "",
            0,
            "",
            0,
            "",
          ],
        ];
      });

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const stringField = String(field ?? "");
              return `"${stringField.replace(/"/g, '""')}"`;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const link = document.createElement("a");
      const downloadUrl = URL.createObjectURL(blob);

      link.setAttribute("href", downloadUrl);
      link.setAttribute(
        "download",
        `transfer_detail_report_${new Date()
          .toISOString()
          .split("T")[0]}.csv`
      );

      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error generating export:", error);
      showError("Error generating export file");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  // ---------------------------------------------------------
  // Error
  // ---------------------------------------------------------
  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <h5 className="mb-1 text-sm font-semibold">
          Error Loading Data
        </h5>

        <p className="mb-3 text-sm">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-[#2f5fa7] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#244d89]"
        >
          Retry
        </button>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-full w-full bg-[#f4f5f7] p-4">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-[24px] font-normal leading-8 text-[#212529]">
          Transfer Detail Report
        </h1>
      </div>

      {/* Search modal */}
      <CommonSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
      />

      {/* Main report card */}
      <div className="w-full overflow-hidden border-0 border-t-[4px] border-t-[#2f5fa7] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
        {/* Toolbar and pagination */}
        <div className="flex min-h-[64px] flex-col gap-3 border-b border-[#dee2e6] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex h-[33px] items-center gap-1 rounded-[4px] border border-[#2f5fa7] bg-[#2f5fa7] px-2.5 text-[14px] font-semibold text-white transition hover:bg-[#244d89]"
            >
              <Search size={15} />
              Search
            </button>

            {isSearchActive() && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex h-[33px] items-center gap-1 rounded-[4px] border border-[#2f5fa7] bg-[#2f5fa7] px-2.5 text-[14px] font-semibold text-white transition hover:bg-[#244d89]"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={generateDetailExport}
              className="inline-flex h-[33px] items-center gap-1 rounded-[4px] border border-[#2f5fa7] bg-[#2f5fa7] px-2.5 text-[14px] font-semibold text-white transition hover:bg-[#244d89]"
            >
              <Download size={14} />
              Export
            </button>
          </div>

          {/* Screenshot-style pagination */}
          <TransferPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Table content */}
        <div className="px-4 pb-4 pt-4">
          {/* Filters and table search */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Active filter chips */}
            <div className="flex flex-wrap gap-2">
              {activeSearch.product && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f2f3] px-3 py-1.5 text-xs text-[#495057]">
                  <span>
                    Product:{" "}
                    {products.find(
                      (p) => p._id === activeSearch.product
                    )?.productTitle ||
                      activeSearch.product.substring(0, 8)}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const updatedSearch = {
                        ...activeSearch,
                        product: "",
                      };

                      setActiveSearch(updatedSearch);
                      fetchData(updatedSearch, 1);
                    }}
                    className="rounded-full p-0.5 text-red-500 hover:bg-red-100"
                    aria-label="Remove product filter"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {activeSearch.center && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f2f3] px-3 py-1.5 text-xs text-[#495057]">
                  <span>
                    Center:{" "}
                    {centers.find(
                      (c) => c._id === activeSearch.center
                    )?.centerName ||
                      activeSearch.center.substring(0, 8)}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const updatedSearch = {
                        ...activeSearch,
                        center: "",
                      };

                      setActiveSearch(updatedSearch);
                      fetchData(updatedSearch, 1);
                    }}
                    className="rounded-full p-0.5 text-red-500 hover:bg-red-100"
                    aria-label="Remove center filter"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {activeSearch.startDate && activeSearch.endDate && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f2f3] px-3 py-1.5 text-xs text-[#495057]">
                  <span>
                    Date: {activeSearch.startDate} to{" "}
                    {activeSearch.endDate}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const updatedSearch = {
                        ...activeSearch,
                        startDate: "",
                        endDate: "",
                      };

                      setActiveSearch(updatedSearch);
                      fetchData(updatedSearch, 1);
                    }}
                    className="rounded-full p-0.5 text-red-500 hover:bg-red-100"
                    aria-label="Remove date filter"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}
            </div>

            {/* Quick search */}
            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
              <label
                htmlFor="transfer-search"
                className="whitespace-nowrap text-[14px] font-semibold text-[#212529]"
              >
                Search:
              </label>

              <input
                id="transfer-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isSearchActive()}
                placeholder={
                  isSearchActive()
                    ? "Disabled during advanced search"
                    : ""
                }
                className="h-[31px] w-full rounded-none border border-[#ced4da] bg-white px-2 text-[14px] text-[#212529] outline-none focus:border-[#80bdff] focus:ring-2 focus:ring-[#007bff]/20 disabled:cursor-not-allowed disabled:bg-[#e9ecef] sm:w-[220px]"
              />
            </div>
          </div>

          {/* Table scroll area:
              max height creates the vertical scrollbar.
              Horizontal overflow supports wide tables.
          */}
          <div className="h-auto max-h-[365px] w-full overflow-auto border border-[#eeeeee]">
            <table className="w-full min-w-[1100px] table-fixed border-collapse text-left text-[16px] text-[#111111]">
              <colgroup>
                <col style={{ width: "25%" }} />
                <col style={{ width: "5%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "19%" }} />
                <col style={{ width: "9%" }} />
                <col style={{ width: "7%" }} />
                <col style={{ width: "7%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
              </colgroup>

              <thead className="sticky top-0 z-10 bg-white">
                <tr className="bg-white">
                  <SortableHeader
                    label="Indent No"
                    sortKey="transferNumber"
                    onSort={handleSort}
                    sortIcon={getSortIcon("transferNumber")}
                  />

                  <SortableHeader
                    label="Date"
                    sortKey="date"
                    onSort={handleSort}
                    sortIcon={getSortIcon("date")}
                  />

                  <SortableHeader
                    label="Branch"
                    sortKey="fromCenter.centerName"
                    onSort={handleSort}
                    sortIcon={getSortIcon("fromCenter.centerName")}
                  />

                  <SortableHeader
                    label="Parent Branch"
                    sortKey="toCenter.centerName"
                    onSort={handleSort}
                    sortIcon={getSortIcon("toCenter.centerName")}
                  />

                  <SortableHeader
                    label="Product"
                    sortKey="productDetail.product.productTitle"
                    onSort={handleSort}
                    sortIcon={getSortIcon(
                      "productDetail.product.productTitle"
                    )}
                  />

                  <SortableHeader
                    label="Requested Qty"
                    sortKey="productDetail.quantity"
                    onSort={handleSort}
                    sortIcon={getSortIcon("productDetail.quantity")}
                  />

                  <SortableHeader
                    label="Center Stock"
                    sortKey="productDetail.toCenterStock.availableQuantity"
                    onSort={handleSort}
                    sortIcon={getSortIcon(
                      "productDetail.toCenterStock.availableQuantity"
                    )}
                  />

                  <SortableHeader
                    label="Parent Stock"
                    sortKey="productDetail.fromCenterStock.availableQuantity"
                    onSort={handleSort}
                    sortIcon={getSortIcon(
                      "productDetail.fromCenterStock.availableQuantity"
                    )}
                  />

                  <SortableHeader
                    label="Approved Qty"
                    sortKey="productDetail.approvedQuantity"
                    onSort={handleSort}
                    sortIcon={getSortIcon(
                      "productDetail.approvedQuantity"
                    )}
                  />

                  <SortableHeader
                    label="Received Qty"
                    sortKey="productDetail.receivedQuantity"
                    onSort={handleSort}
                    sortIcon={getSortIcon(
                      "productDetail.receivedQuantity"
                    )}
                  />
                </tr>
              </thead>

              <tbody>
                {filteredFlattenedData.length > 0 ? (
                  <>
                    {filteredFlattenedData.map((item, index) => {
                      const productId =
                        item.productDetail?.product?._id;

                      const productName =
                        item.productDetail?.product?.productTitle;

                      const centerId =
                        item.fromCenter?._id || item.toCenter?._id;

                      const centerName =
                        item.fromCenter?.centerName ||
                        item.toCenter?.centerName;

                      return (
                        <tr
                          key={item.uniqueKey}
                          className={`border-t border-[#eeeeee] ${
                            index % 2 === 0
                              ? "bg-[#f1f2f2]"
                              : "bg-white"
                          } hover:bg-[#e9ecef]`}
                        >
                          <td className="break-words border-r border-[#eeeeee] px-2 py-2.5 align-top">
                            {item.transferNumber || ""}
                          </td>

                          <td className="border-r border-[#eeeeee] px-2 py-2.5 align-top">
                            {formatDate(item.date || "")}
                          </td>

                          <td className="break-words border-r border-[#eeeeee] px-2 py-2.5 align-top">
                            {item.toCenter?.centerName || ""}
                          </td>

                          <td className="break-words border-r border-[#eeeeee] px-2 py-2.5 align-top">
                            {item.fromCenter?.centerName || ""}
                          </td>

                          <td className="break-words border-r border-[#eeeeee] px-2 py-2.5 align-top">
                            {item.productDetail?.product?.productTitle ? (
                              <button
                                type="button"
                                onClick={() => {
                                  console.log("Product clicked:", {
                                    productId,
                                    productName,
                                    centerId,
                                    centerName,
                                  });

                                  handleProductClick(
                                    productId,
                                    productName
                                  );
                                }}
                                title="Click to view all stock requests for this product"
                                className="cursor-pointer text-left text-[#007bff] underline hover:text-[#0056b3]"
                              >
                                {item.productDetail.product.productTitle}
                              </button>
                            ) : (
                              <span className="text-gray-500">
                                No Product
                              </span>
                            )}
                          </td>

                          <td className="border-r border-[#eeeeee] px-2 py-2.5 align-top">
                            {item.productDetail?.quantity ? (
                              <button
                                type="button"
                                onClick={() => {
                                  console.log("Quantity clicked:", {
                                    productId,
                                    productName,
                                    centerId,
                                    centerName,
                                    quantity:
                                      item.productDetail.quantity,
                                  });

                                  handleProductClick(
                                    productId,
                                    productName
                                  );
                                }}
                                title="Click to view all stock requests for this product"
                                className="text-[#007bff] underline hover:text-[#0056b3]"
                              >
                                {item.productDetail.quantity || 0}
                              </button>
                            ) : (
                              0
                            )}
                          </td>

                          <td className="border-r border-[#eeeeee] px-2 py-2.5 align-top">
                            {item.productDetail?.toCenterStock
                              ?.availableQuantity || 0}
                          </td>

                          <td className="border-r border-[#eeeeee] px-2 py-2.5 align-top">
                            {item.productDetail?.fromCenterStock
                              ?.availableQuantity || 0}
                          </td>

                          <td className="border-r border-[#eeeeee] px-2 py-2.5 align-top">
                            {item.productDetail?.approvedQuantity || 0}
                          </td>

                          <td className="px-2 py-2.5 align-top">
                            {item.productDetail?.receivedQuantity || 0}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Totals row */}
                    <tr className="sticky bottom-0 z-[5] border-t-2 border-[#dee2e6] bg-[#f8f9fa] font-semibold text-[#212529]">
                      <td
                        colSpan={5}
                        className="border-r border-[#eeeeee] px-2 py-2.5"
                      >
                        Total
                      </td>

                      <td className="border-r border-[#eeeeee] px-2 py-2.5">
                        {totals.totalRequestedQty}
                      </td>

                      <td className="border-r border-[#eeeeee] px-2 py-2.5">
                        -
                      </td>

                      <td className="border-r border-[#eeeeee] px-2 py-2.5">
                        -
                      </td>

                      <td className="border-r border-[#eeeeee] px-2 py-2.5">
                        {totals.totalApprovedQty}
                      </td>

                      <td className="px-2 py-2.5">
                        {totals.totalReceivedQty}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-[14px] text-[#6c757d]"
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

// ---------------------------------------------------------
// Screenshot-style Pagination
// ---------------------------------------------------------
const TransferPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const safeTotalPages = Math.max(1, totalPages || 1);

  const getVisiblePages = () => {
    const pageCount = Math.min(5, safeTotalPages);
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(safeTotalPages, startPage + pageCount - 1);

    if (endPage - startPage + 1 < pageCount) {
      startPage = Math.max(1, endPage - pageCount + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  };

  const baseButtonClass =
    "inline-flex h-[31px] min-w-[28px] items-center justify-center border border-[#dee2e6] px-2 text-[13px] transition";

  const disabledClass =
    "cursor-not-allowed bg-[#e9ecef] text-[#6c757d]";

  const normalClass =
    "bg-white text-[#007bff] hover:bg-[#e9ecef]";

  return (
    <nav
      aria-label="Transfer report pagination"
      className="flex flex-wrap items-center justify-end"
    >
      <button
        type="button"
        onClick={() => onPageChange(1)}
        disabled={currentPage <= 1}
        className={`${baseButtonClass} rounded-l-[4px] ${
          currentPage <= 1 ? disabledClass : normalClass
        }`}
      >
        First
      </button>

      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className={`${baseButtonClass} border-l-0 ${
          currentPage <= 1 ? disabledClass : normalClass
        }`}
      >
        &lt;
      </button>

      {getVisiblePages().map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={`${baseButtonClass} border-l-0 ${
            currentPage === page
              ? "z-[1] border-[#5850d8] bg-[#5850d8] text-white"
              : normalClass
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= safeTotalPages}
        aria-label="Next page"
        className={`${baseButtonClass} border-l-0 ${
          currentPage >= safeTotalPages
            ? disabledClass
            : normalClass
        }`}
      >
        &gt;
      </button>

      <button
        type="button"
        onClick={() => onPageChange(safeTotalPages)}
        disabled={currentPage >= safeTotalPages}
        className={`${baseButtonClass} rounded-r-[4px] border-l-0 ${
          currentPage >= safeTotalPages
            ? disabledClass
            : normalClass
        }`}
      >
        Last
      </button>
    </nav>
  );
};

// ---------------------------------------------------------
// Sortable Header
// ---------------------------------------------------------
const SortableHeader = ({
  label,
  sortKey,
  onSort,
  sortIcon,
}) => {
  return (
    <th
      scope="col"
      onClick={() => onSort(sortKey)}
      className="sticky top-0 cursor-pointer select-none border-b border-r border-[#eeeeee] bg-white px-2 py-2.5 text-[16px] font-semibold text-[#111111] transition hover:bg-[#f8f9fa]"
    >
      <div className="flex items-center justify-between gap-1">
        <span className="break-words">{label}</span>

        {sortIcon && (
          <span className="shrink-0 text-[#6c757d]">
            {sortIcon}
          </span>
        )}
      </div>
    </th>
  );
};

export default TransferDetail;