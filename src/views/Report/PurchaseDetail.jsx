// import React, { useEffect, useState } from "react";
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
// import { formatDate, formatDateTime } from "../../utils/FormatDateTime";
// import PurchaseSearch from "./CommonSearch";

// const PurchaseDetail = () => {
//   const [data, setData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchModalVisible, setSearchModalVisible] = useState(false);

//   const [exportModalVisible, setExportModalVisible] = useState(false);
//   const [exportStartDate, setExportStartDate] = useState("");
//   const [exportEndDate, setExportEndDate] = useState("");

//   const [activeSearch, setActiveSearch] = useState({
//     keyword: "",
//     outlet: "",
//     center: "",
//     product: "",
//     startDate: "",
//     endDate: "",
//     date: "",
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [products, setProducts] = useState([]);

//   // --------------------------------------------------
//   // Fetch Purchase Data
//   // --------------------------------------------------
//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();

//       if (searchParams.center) {
//         params.append("center", searchParams.center);
//       }

//       if (searchParams.product) {
//         params.append("product", searchParams.product);
//       }

//       // Handle current CommonSearch date format
//       if (searchParams.startDate && searchParams.endDate) {
//         params.append("startDate", searchParams.startDate);
//         params.append("endDate", searchParams.endDate);
//       } else if (
//         searchParams.date &&
//         searchParams.date.includes(" to ")
//       ) {
//         // Fallback for old date format
//         const [startDateStr, endDateStr] =
//           searchParams.date.split(" to ");

//         const convertDateFormat = (dateStr) => {
//           const [day, month, year] = dateStr.split("-");
//           return `${year}-${month}-${day}`;
//         };

//         params.append("startDate", convertDateFormat(startDateStr));
//         params.append("endDate", convertDateFormat(endDateStr));
//       }

//       params.append("page", page);

//       const url = params.toString()
//         ? `/reports/purchased?${params.toString()}`
//         : "/reports/purchased";

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         setData(response.data.data);
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
//         setError(err.message || "An error occurred while fetching data");
//         console.error("Error message:", err.message);
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
//       const response = await axiosInstance.get("/centers");

//       if (response.data.success) {
//         setCenters(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching centers:", error);
//     }
//   };

//   // --------------------------------------------------
//   // Fetch Products
//   // --------------------------------------------------
//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get("/products/all");

//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
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
//   // Flatten Purchase Data
//   // --------------------------------------------------
//   const getFlattenedData = () => {
//     const flattened = [];

//     data.forEach((purchase) => {
//       if (purchase.products && purchase.products.length > 0) {
//         purchase.products.forEach((product) => {
//           flattened.push({
//             ...purchase,
//             productDetail: product,
//             uniqueKey: `${purchase._id}_${product._id}`,
//           });
//         });
//       } else {
//         flattened.push({
//           ...purchase,
//           productDetail: null,
//           uniqueKey: `${purchase._id}_no_product`,
//         });
//       }
//     });

//     return flattened;
//   };

//   // --------------------------------------------------
//   // Calculate Totals
//   // --------------------------------------------------
//   const calculateTotals = () => {
//     const totals = {
//       totalQty: 0,
//       totalAmount: 0,
//     };

//     getFlattenedData().forEach((item) => {
//       if (item.productDetail) {
//         totals.totalQty += parseFloat(
//           item.productDetail.purchasedQuantity || 0
//         );

//         totals.totalAmount += parseFloat(
//           item.productDetail.price *
//             item.productDetail.purchasedQuantity || 0
//         );
//       }
//     });

//     return totals;
//   };

//   // --------------------------------------------------
//   // Sorting
//   // --------------------------------------------------
//   const getNestedValue = (object, path) => {
//     return path.split(".").reduce(
//       (current, key) => current?.[key],
//       object
//     );
//   };

//   const handleSort = (key) => {
//     let direction = "ascending";

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction === "ascending"
//     ) {
//       direction = "descending";
//     }

//     setSortConfig({ key, direction });

//     const sortedData = [...data].sort((a, b) => {
//       const aValue = getNestedValue(a, key);
//       const bValue = getNestedValue(b, key);

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
//       <ArrowUp size={14} className="inline-block ml-1" />
//     ) : (
//       <ArrowDown size={14} className="inline-block ml-1" />
//     );
//   };

//   // --------------------------------------------------
//   // Search
//   // --------------------------------------------------
//   const handleSearch = (searchData) => {
//     const formattedSearchData = {
//       center: searchData.center,
//       product: searchData.product,
//       startDate: searchData.startDate,
//       endDate: searchData.endDate,
//       date:
//         searchData.startDate && searchData.endDate
//           ? `${searchData.startDate} to ${searchData.endDate}`
//           : "",
//     };

//     setActiveSearch(formattedSearchData);
//     fetchData(formattedSearchData, 1);
//   };

//   const handleResetSearch = () => {
//     const resetData = {
//       center: "",
//       product: "",
//       startDate: "",
//       endDate: "",
//       date: "",
//     };

//     setActiveSearch(resetData);
//     setSearchTerm("");

//     fetchData({}, 1);
//   };

//   // --------------------------------------------------
//   // Export Modal
//   // --------------------------------------------------
//   const openExportModal = () => {
//     setExportStartDate(activeSearch.startDate || "");
//     setExportEndDate(activeSearch.endDate || "");
//     setExportModalVisible(true);
//   };

//   // --------------------------------------------------
//   // Generate CSV Export
//   // --------------------------------------------------
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);

//       if (
//         exportStartDate &&
//         exportEndDate &&
//         exportStartDate > exportEndDate
//       ) {
//         showError("Start date cannot be greater than end date");
//         setLoading(false);
//         return;
//       }

//       const params = new URLSearchParams();

//       if (activeSearch.center) {
//         params.append("center", activeSearch.center);
//       }

//       if (activeSearch.product) {
//         params.append("product", activeSearch.product);
//       }

//       // Export modal dates override active search dates
//       if (exportStartDate) {
//         params.append("startDate", exportStartDate);
//       }

//       if (exportEndDate) {
//         params.append("endDate", exportEndDate);
//       }

//       params.append("export", "true");

//       const apiUrl = params.toString()
//         ? `/reports/purchased?${params.toString()}`
//         : "/reports/purchased";

//       const response = await axiosInstance.get(apiUrl);

//       if (!response.data.success) {
//         throw new Error("API returned unsuccessful response");
//       }

//       const exportData = response.data.data;

//       if (!exportData || exportData.length === 0) {
//         showError("No data available for export");
//         return;
//       }

//       const headers = [
//         "Invoice No",
//         "Vendor",
//         "Transport Amount",
//         "Created At",
//         "Center Title",
//         "Product Title",
//         "Purchase Date",
//         "Note",
//         "Quantity",
//         "Price",
//         "Total Amount",
//         "Type",
//         "Status",
//       ];

//       const csvData = exportData.flatMap((purchase) => {
//         if (
//           purchase.products &&
//           purchase.products.length > 0
//         ) {
//           return purchase.products.map((product) => [
//             purchase.invoiceNo,
//             purchase.vendor?.businessName || "N/A",
//             purchase.transportAmount || 0,
//             formatDateTime(purchase.createdAt),
//             purchase.outlet?.centerName || "N/A",
//             product.product?.productTitle || "N/A",
//             formatDate(purchase.date),
//             purchase.remark || "",
//             product.purchasedQuantity || 0,
//             product.price || 0,
//             purchase.totalAmount || 0,
//             purchase.type || "N/A",
//             purchase.status || "N/A",
//           ]);
//         }

//         return [
//           [
//             purchase.invoiceNo,
//             purchase.vendor?.businessName || "N/A",
//             purchase.transportAmount || 0,
//             formatDateTime(purchase.createdAt),
//             purchase.outlet?.centerName || "N/A",
//             "No Product",
//             formatDate(purchase.date),
//             purchase.remark || "",
//             0,
//             0,
//             purchase.totalAmount || 0,
//             purchase.type || "N/A",
//             purchase.status || "N/A",
//           ],
//         ];
//       });

//       // Filename
//       let filename = "purchase_detail_export";

//       if (exportStartDate && exportEndDate) {
//         filename += `_${exportStartDate}_to_${exportEndDate}`;
//       } else if (exportStartDate) {
//         filename += `_from_${exportStartDate}`;
//       } else if (exportEndDate) {
//         filename += `_until_${exportEndDate}`;
//       } else {
//         filename += `_${new Date()
//           .toISOString()
//           .split("T")[0]}`;
//       }

//       filename += ".csv";

//       const csvContent = [
//         headers.join(","),
//         ...csvData.map((row) =>
//           row
//             .map((field) => {
//               const stringField = String(field || "");

//               return `"${stringField.replace(/"/g, '""')}"`;
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
//       const downloadUrl = URL.createObjectURL(blob);

//       link.setAttribute("href", downloadUrl);
//       link.setAttribute("download", filename);
//       link.style.visibility = "hidden";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       URL.revokeObjectURL(downloadUrl);

//       showSuccess("Export completed successfully!");

//       setExportModalVisible(false);
//       setExportStartDate("");
//       setExportEndDate("");
//     } catch (error) {
//       console.error("Error generating export:", error);
//       showError("Error generating export file");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Frontend Search
//   // --------------------------------------------------
//   const filteredFlattenedData = getFlattenedData().filter(
//     (item) => {
//       if (
//         activeSearch.product ||
//         activeSearch.center ||
//         activeSearch.startDate ||
//         activeSearch.endDate
//       ) {
//         return true;
//       }

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
//                 .includes(searchTerm.toLowerCase())
//           );
//         }

//         return (
//           value &&
//           value
//             .toString()
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())
//         );
//       });
//     }
//   );

//   const totals = calculateTotals();

//   // --------------------------------------------------
//   // Loading
//   // --------------------------------------------------
//   if (loading) {
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
//         Error loading data: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {/* Page Title */}
//       <div className="mb-5">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           Purchase Detail Report
//         </h1>
//       </div>

//       {/* Search Modal */}
//       <PurchaseSearch
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//       />

//       {/* Export Modal */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between border-b px-6 py-4">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Export Purchase Detail Report
//               </h2>

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="space-y-5 px-6 py-5">
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
//                   value={exportStartDate}
//                   onChange={(e) =>
//                     setExportStartDate(e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Leave empty to include all records from beginning
//                 </p>
//               </div>

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
//                   value={exportEndDate}
//                   onChange={(e) =>
//                     setExportEndDate(e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Leave empty to include all records until today
//                 </p>
//               </div>

//               {/* Current Filters */}
//               {(activeSearch.center || activeSearch.product) && (
//                 <div className="rounded-lg bg-gray-50 p-4">
//                   <p className="mb-2 text-sm font-semibold text-gray-700">
//                     Current Filters:
//                   </p>

//                   <ul className="space-y-1 text-sm text-gray-600">
//                     {activeSearch.center && (
//                       <li>
//                         <span className="font-medium">
//                           Center:
//                         </span>{" "}
//                         {
//                           centers.find(
//                             (c) =>
//                               c._id === activeSearch.center
//                           )?.centerName
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
//                               p._id === activeSearch.product
//                           )?.productTitle
//                         }
//                       </li>
//                     )}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-3 border-t px-6 py-4">
//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={generateDetailExport}
//                 className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//               >
//                 <FileSpreadsheet size={16} />
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
//             <button
//               type="button"
//               onClick={() => setSearchModalVisible(true)}
//               className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
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
//                 className="inline-flex items-center gap-2 rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
//               >
//                 <RotateCcw size={16} />
//                 Reset Search
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={openExportModal}
//               disabled={data.length === 0}
//               className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Download size={16} />
//               Export
//             </button>
//           </div>

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>

//         {/* Card Body */}
//         <div className="p-5">
//           {/* Date Filter + Search */}
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
//                 htmlFor="purchaseSearch"
//                 className="text-sm font-medium text-gray-600"
//               >
//                 Search:
//               </label>

//               <input
//                 id="purchaseSearch"
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
//             <table className="min-w-[1000px] w-full border-collapse text-sm">
//               <thead>
//                 <tr className="bg-gray-100 text-left">
//                   <th
//                     onClick={() => handleSort("date")}
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Date {getSortIcon("date")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("outlet")}
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Branch {getSortIcon("outlet")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("invoiceNo")}
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Invoice No. {getSortIcon("invoiceNo")}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort("vendor.businessName")
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Vendor{" "}
//                     {getSortIcon("vendor.businessName")}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "productDetail.product.productTitle"
//                       )
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Product{" "}
//                     {getSortIcon(
//                       "productDetail.product.productTitle"
//                     )}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort(
//                         "productDetail.purchasedQuantity"
//                       )
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Qty{" "}
//                     {getSortIcon(
//                       "productDetail.purchasedQuantity"
//                     )}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort("productDetail.price")
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Price{" "}
//                     {getSortIcon("productDetail.price")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("remark")}
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Remark {getSortIcon("remark")}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredFlattenedData.length > 0 ? (
//                   <>
//                     {filteredFlattenedData.map((item) => (
//                       <tr
//                         key={item.uniqueKey}
//                         className="hover:bg-gray-50"
//                       >
//                         <td className="border border-gray-200 px-4 py-3">
//                           {formatDate(item.date || "")}
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {item.outlet?.centerName || ""}
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {item.invoiceNo}
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {item.vendor?.businessName || ""}
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {item.productDetail?.product
//                             ?.productTitle || "No Product"}
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {item.productDetail
//                             ?.purchasedQuantity || 0}
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {item.productDetail?.price || 0}
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           {item.remark || ""}
//                         </td>
//                       </tr>
//                     ))}

//                     {/* Total Row */}
//                     <tr className="bg-gray-100 font-semibold">
//                       <td
//                         colSpan={5}
//                         className="border border-gray-200 px-4 py-3 text-right"
//                       >
//                         Total
//                       </td>

//                       <td className="border border-gray-200 px-4 py-3">
//                         {totals.totalQty.toFixed(2)}
//                       </td>

//                       <td className="border border-gray-200 px-4 py-3">
//                         {totals.totalAmount.toFixed(2)}
//                       </td>

//                       <td className="border border-gray-200 px-4 py-3" />
//                     </tr>
//                   </>
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={8}
//                       className="border border-gray-200 px-4 py-8 text-center text-gray-500"
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

// export default PurchaseDetail;









import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import axiosInstance from "../../axiosInstance";
import { showError, showSuccess } from "../../utils/sweetAlerts";
import {
  formatDate,
  formatDateTime,
} from "../../utils/FormatDateTime";
import PurchaseSearch from "./CommonSearch";

// --------------------------------------------------
// Pagination UI matching the reference screenshot
// --------------------------------------------------
const ReportPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const total = Math.max(1, Number(totalPages) || 1);
  const current = Math.min(
    Math.max(1, Number(currentPage) || 1),
    total
  );

  const getVisiblePages = () => {
    if (total <= 3) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 2) {
      return [1, 2, 3];
    }

    if (current >= total - 1) {
      return [total - 2, total - 1, total];
    }

    return [current - 1, current, current + 1];
  };

  const pages = getVisiblePages();

  const buttonBase =
    "inline-flex h-[31px] min-w-[27px] items-center justify-center " +
    "border border-[#dee2e6] px-[9px] text-[13px] font-normal " +
    "leading-none transition-colors";

  const normalButton =
    `${buttonBase} bg-white text-[#0d6efd] hover:bg-[#e9ecef]`;

  const disabledButton =
    `${buttonBase} cursor-default bg-[#e9ecef] text-[#6c757d]`;

  const activeButton =
    `${buttonBase} cursor-default border-[#5148d8] bg-[#5148d8] text-white`;

  const goTo = (page) => {
    if (page < 1 || page > total || page === current) return;
    onPageChange(page);
  };

  return (
    <nav
      aria-label="Purchase report pagination"
      className="ml-auto flex shrink-0 items-center justify-end"
    >
      <button
        type="button"
        onClick={() => goTo(1)}
        disabled={current === 1}
        className={`${current === 1 ? disabledButton : normalButton} rounded-l-[4px]`}
      >
        First
      </button>

      <button
        type="button"
        aria-label="Previous page"
        onClick={() => goTo(current - 1)}
        disabled={current === 1}
        className={
          current === 1 ? disabledButton : normalButton
        }
      >
        &lt;
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`Page ${page}`}
          aria-current={current === page ? "page" : undefined}
          onClick={() => goTo(page)}
          disabled={current === page}
          className={
            current === page ? activeButton : normalButton
          }
        >
          {page}
        </button>
      ))}

      {total > 3 && current < total - 1 && (
        <span
          aria-hidden="true"
          className={`${buttonBase} cursor-default bg-[#e9ecef] text-[#6c757d]`}
        >
          ...
        </span>
      )}

      <button
        type="button"
        aria-label="Next page"
        onClick={() => goTo(current + 1)}
        disabled={current === total}
        className={
          current === total ? disabledButton : normalButton
        }
      >
        &gt;
      </button>

      <button
        type="button"
        onClick={() => goTo(total)}
        disabled={current === total}
        className={`${
          current === total ? disabledButton : normalButton
        } rounded-r-[4px]`}
      >
        Last
      </button>
    </nav>
  );
};

const PurchaseDetail = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchModalVisible, setSearchModalVisible] =
    useState(false);

  const [exportModalVisible, setExportModalVisible] =
    useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  const [activeSearch, setActiveSearch] = useState({
    keyword: "",
    outlet: "",
    center: "",
    product: "",
    startDate: "",
    endDate: "",
    date: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [products, setProducts] = useState([]);

  // --------------------------------------------------
  // Fetch Purchase Data
  // --------------------------------------------------
  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchParams.center) {
        params.append("center", searchParams.center);
      }

      if (searchParams.product) {
        params.append("product", searchParams.product);
      }

      if (searchParams.startDate && searchParams.endDate) {
        params.append("startDate", searchParams.startDate);
        params.append("endDate", searchParams.endDate);
      } else if (
        searchParams.date &&
        searchParams.date.includes(" to ")
      ) {
        const [startDateStr, endDateStr] =
          searchParams.date.split(" to ");

        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split("-");
          return `${year}-${month}-${day}`;
        };

        params.append(
          "startDate",
          convertDateFormat(startDateStr)
        );
        params.append(
          "endDate",
          convertDateFormat(endDateStr)
        );
      }

      params.append("page", page);

      const url = params.toString()
        ? `/reports/purchased?${params.toString()}`
        : "/reports/purchased";

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setData(response.data.data);
        setCurrentPage(
          response.data.pagination.currentPage
        );
        setTotalPages(
          response.data.pagination.totalPages
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
          err.message ||
            "An error occurred while fetching data"
        );
        console.error("Error message:", err.message);
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
      const response = await axiosInstance.get("/centers");

      if (response.data.success) {
        setCenters(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
    }
  };

  // --------------------------------------------------
  // Fetch Products
  // --------------------------------------------------
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products/all");

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchProducts();
  }, []);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    fetchData(activeSearch, page);
  };

  // --------------------------------------------------
  // Flatten Purchase Data
  // --------------------------------------------------
  const getFlattenedData = () => {
    const flattened = [];

    data.forEach((purchase) => {
      if (
        purchase.products &&
        purchase.products.length > 0
      ) {
        purchase.products.forEach((product) => {
          flattened.push({
            ...purchase,
            productDetail: product,
            uniqueKey: `${purchase._id}_${product._id}`,
          });
        });
      } else {
        flattened.push({
          ...purchase,
          productDetail: null,
          uniqueKey: `${purchase._id}_no_product`,
        });
      }
    });

    return flattened;
  };

  // --------------------------------------------------
  // Calculate Totals
  // --------------------------------------------------
  const calculateTotals = () => {
    const totals = {
      totalQty: 0,
      totalAmount: 0,
    };

    getFlattenedData().forEach((item) => {
      if (item.productDetail) {
        totals.totalQty += parseFloat(
          item.productDetail.purchasedQuantity || 0
        );

        totals.totalAmount += parseFloat(
          item.productDetail.price *
            item.productDetail.purchasedQuantity || 0
        );
      }
    });

    return totals;
  };

  // --------------------------------------------------
  // Sorting
  // --------------------------------------------------
  const getNestedValue = (object, path) => {
    return path
      .split(".")
      .reduce((current, key) => current?.[key], object);
  };

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
    if (sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction === "ascending" ? (
      <ArrowUp
        size={14}
        className="ml-1 inline-block"
      />
    ) : (
      <ArrowDown
        size={14}
        className="ml-1 inline-block"
      />
    );
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const handleSearch = (searchData) => {
    const formattedSearchData = {
      center: searchData.center,
      product: searchData.product,
      startDate: searchData.startDate,
      endDate: searchData.endDate,
      date:
        searchData.startDate && searchData.endDate
          ? `${searchData.startDate} to ${searchData.endDate}`
          : "",
    };

    setActiveSearch(formattedSearchData);
    fetchData(formattedSearchData, 1);
  };

  const handleResetSearch = () => {
    const resetData = {
      center: "",
      product: "",
      startDate: "",
      endDate: "",
      date: "",
    };

    setActiveSearch(resetData);
    setSearchTerm("");

    fetchData({}, 1);
  };

  // --------------------------------------------------
  // Export Modal
  // --------------------------------------------------
  const openExportModal = () => {
    setExportStartDate(activeSearch.startDate || "");
    setExportEndDate(activeSearch.endDate || "");
    setExportModalVisible(true);
  };

  // --------------------------------------------------
  // Generate CSV Export
  // --------------------------------------------------
  const generateDetailExport = async () => {
    try {
      setLoading(true);

      if (
        exportStartDate &&
        exportEndDate &&
        exportStartDate > exportEndDate
      ) {
        showError(
          "Start date cannot be greater than end date"
        );
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();

      if (activeSearch.center) {
        params.append("center", activeSearch.center);
      }

      if (activeSearch.product) {
        params.append("product", activeSearch.product);
      }

      if (exportStartDate) {
        params.append("startDate", exportStartDate);
      }

      if (exportEndDate) {
        params.append("endDate", exportEndDate);
      }

      params.append("export", "true");

      const apiUrl = params.toString()
        ? `/reports/purchased?${params.toString()}`
        : "/reports/purchased";

      const response = await axiosInstance.get(apiUrl);

      if (!response.data.success) {
        throw new Error(
          "API returned unsuccessful response"
        );
      }

      const exportData = response.data.data;

      if (!exportData || exportData.length === 0) {
        showError("No data available for export");
        return;
      }

      const headers = [
        "Invoice No",
        "Vendor",
        "Transport Amount",
        "Created At",
        "Center Title",
        "Product Title",
        "Purchase Date",
        "Note",
        "Quantity",
        "Price",
        "Total Amount",
        "Type",
        "Status",
      ];

      const csvData = exportData.flatMap((purchase) => {
        if (
          purchase.products &&
          purchase.products.length > 0
        ) {
          return purchase.products.map((product) => [
            purchase.invoiceNo,
            purchase.vendor?.businessName || "N/A",
            purchase.transportAmount || 0,
            formatDateTime(purchase.createdAt),
            purchase.outlet?.centerName || "N/A",
            product.product?.productTitle || "N/A",
            formatDate(purchase.date),
            purchase.remark || "",
            product.purchasedQuantity || 0,
            product.price || 0,
            purchase.totalAmount || 0,
            purchase.type || "N/A",
            purchase.status || "N/A",
          ]);
        }

        return [
          [
            purchase.invoiceNo,
            purchase.vendor?.businessName || "N/A",
            purchase.transportAmount || 0,
            formatDateTime(purchase.createdAt),
            purchase.outlet?.centerName || "N/A",
            "No Product",
            formatDate(purchase.date),
            purchase.remark || "",
            0,
            0,
            purchase.totalAmount || 0,
            purchase.type || "N/A",
            purchase.status || "N/A",
          ],
        ];
      });

      let filename = "purchase_detail_export";

      if (exportStartDate && exportEndDate) {
        filename += `_${exportStartDate}_to_${exportEndDate}`;
      } else if (exportStartDate) {
        filename += `_from_${exportStartDate}`;
      } else if (exportEndDate) {
        filename += `_until_${exportEndDate}`;
      } else {
        filename += `_${new Date()
          .toISOString()
          .split("T")[0]}`;
      }

      filename += ".csv";

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const stringField = String(field || "");
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
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);

      showSuccess("Export completed successfully!");

      setExportModalVisible(false);
      setExportStartDate("");
      setExportEndDate("");
    } catch (error) {
      console.error("Error generating export:", error);
      showError("Error generating export file");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Frontend Search
  // --------------------------------------------------
  const filteredFlattenedData = getFlattenedData().filter(
    (item) => {
      if (
        activeSearch.product ||
        activeSearch.center ||
        activeSearch.startDate ||
        activeSearch.endDate
      ) {
        return true;
      }

      return Object.values(item).some((value) => {
        if (
          typeof value === "object" &&
          value !== null
        ) {
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
      });
    }
  );

  const totals = calculateTotals();

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#f3f4f6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div
        className="mx-4 mt-6 border border-red-300 bg-white px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* Page Title */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        <h1 className="text-[26px] font-normal leading-9 text-[#343a40]">
          Purchase Detail Report
        </h1>
      </div>

      {/* Search Modal */}
      <PurchaseSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
      />

      {/* Export Modal */}
      {exportModalVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-[800px] overflow-hidden rounded-[6px] border border-gray-300 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#dee2e6] px-5 py-4">
              <h2 className="text-xl font-normal text-[#343a40]">
                Export Purchase Detail Report
              </h2>

              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                aria-label="Close export modal"
                className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5">
              <div>
                <label
                  htmlFor="exportStartDate"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Start Date{" "}
                  <span className="font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  type="date"
                  id="exportStartDate"
                  value={exportStartDate}
                  onChange={(e) =>
                    setExportStartDate(e.target.value)
                  }
                  className="h-[38px] w-full rounded-[4px] border border-[#ced4da] bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to include all records from beginning
                </p>
              </div>

              <div>
                <label
                  htmlFor="exportEndDate"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  End Date{" "}
                  <span className="font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  type="date"
                  id="exportEndDate"
                  value={exportEndDate}
                  onChange={(e) =>
                    setExportEndDate(e.target.value)
                  }
                  className="h-[38px] w-full rounded-[4px] border border-[#ced4da] bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to include all records until today
                </p>
              </div>

              {(activeSearch.center || activeSearch.product) && (
                <div className="border border-gray-200 bg-[#f8f9fa] p-4">
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Current Filters:
                  </p>

                  <ul className="space-y-1 text-sm text-gray-600">
                    {activeSearch.center && (
                      <li>
                        <span className="font-medium">Center:</span>{" "}
                        {
                          centers.find(
                            (c) => c._id === activeSearch.center
                          )?.centerName
                        }
                      </li>
                    )}

                    {activeSearch.product && (
                      <li>
                        <span className="font-medium">Product:</span>{" "}
                        {
                          products.find(
                            (p) => p._id === activeSearch.product
                          )?.productTitle
                        }
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-[#dee2e6] bg-white px-5 py-4">
              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                className="h-[38px] rounded-[4px] border border-[#6c757d] bg-[#6c757d] px-4 text-sm font-normal text-white hover:bg-[#5c636a]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={generateDetailExport}
                className="inline-flex h-[38px] items-center gap-2 rounded-[4px] border border-[#2858a6] bg-[#2858a6] px-4 text-sm font-normal text-white hover:bg-[#204b90]"
              >
                <FileSpreadsheet size={16} />
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Report Card */}
      <div className="w-full overflow-hidden border border-[#dee2e6] border-t-[5px] border-t-[#2858a6] bg-white">
        {/* Toolbar: Buttons left, pagination right */}
        <div className="flex min-h-[63px] w-full flex-wrap items-center justify-between gap-3 border-b border-[#dee2e6] bg-white px-4 py-3">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex h-[34px] items-center gap-1 rounded-[4px] border border-[#2858a6] bg-[#2858a6] px-2 text-sm font-medium text-white transition hover:bg-[#204b90]"
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
                className="inline-flex h-[34px] items-center gap-1 rounded-[4px] border border-[#6c757d] bg-[#6c757d] px-2 text-sm font-medium text-white transition hover:bg-[#5c636a]"
              >
                <RotateCcw size={15} />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={openExportModal}
              disabled={data.length === 0}
              className="inline-flex h-[34px] items-center gap-1 rounded-[4px] border border-[#2858a6] bg-[#2858a6] px-2 text-sm font-medium text-white transition hover:bg-[#204b90] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileSpreadsheet size={15} />
              Export
            </button>
          </div>

          {/* Pagination */}
          <div className="ml-auto flex shrink-0 items-center justify-end">
            <ReportPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white p-4">
          <div className="mb-4 flex min-h-[30px] flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-gray-600">
              {(activeSearch.startDate ||
                activeSearch.endDate) && (
                <span>
                  {activeSearch.startDate &&
                    `From: ${activeSearch.startDate} `}
                  {activeSearch.endDate &&
                    `To: ${activeSearch.endDate}`}
                </span>
              )}
            </div>

            <div className="ml-auto flex items-center gap-1">
              <label
                htmlFor="purchaseSearch"
                className="whitespace-nowrap text-sm font-semibold text-[#343a40]"
              >
                Search:
              </label>

              <input
                id="purchaseSearch"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-[30px] w-[220px] max-w-full rounded-none border border-[#ced4da] bg-white px-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Table with vertical and horizontal scrollbars */}
          <div className="max-h-[500px] w-full overflow-x-auto overflow-y-auto">
            <table className="w-full min-w-[1000px] table-fixed border-collapse text-left text-base text-[#111827]">
              <colgroup>
                <col className="w-[65px]" />
                <col className="w-[115px]" />
                <col className="w-[112px]" />
                <col className="w-[180px]" />
                <col />
                <col className="w-[92px]" />
                <col className="w-[102px]" />
                <col className="w-[90px]" />
              </colgroup>

              <thead>
                <tr className="bg-white">
                  <th
                    onClick={() => handleSort("date")}
                    className="cursor-pointer whitespace-nowrap border border-[#dee2e6] px-2 py-[9px] font-semibold hover:bg-gray-100"
                  >
                    Date {getSortIcon("date")}
                  </th>

                  <th
                    onClick={() => handleSort("outlet")}
                    className="cursor-pointer whitespace-nowrap border border-[#dee2e6] px-2 py-[9px] font-semibold hover:bg-gray-100"
                  >
                    Branch {getSortIcon("outlet")}
                  </th>

                  <th
                    onClick={() => handleSort("invoiceNo")}
                    className="cursor-pointer whitespace-nowrap border border-[#dee2e6] px-2 py-[9px] font-semibold hover:bg-gray-100"
                  >
                    Invoice No. {getSortIcon("invoiceNo")}
                  </th>

                  <th
                    onClick={() => handleSort("vendor.businessName")}
                    className="cursor-pointer whitespace-nowrap border border-[#dee2e6] px-2 py-[9px] font-semibold hover:bg-gray-100"
                  >
                    Vendor {getSortIcon("vendor.businessName")}
                  </th>

                  <th
                    onClick={() =>
                      handleSort("productDetail.product.productTitle")
                    }
                    className="cursor-pointer whitespace-nowrap border border-[#dee2e6] px-2 py-[9px] font-semibold hover:bg-gray-100"
                  >
                    Product{" "}
                    {getSortIcon("productDetail.product.productTitle")}
                  </th>

                  <th
                    onClick={() =>
                      handleSort("productDetail.purchasedQuantity")
                    }
                    className="cursor-pointer whitespace-nowrap border border-[#dee2e6] px-2 py-[9px] font-semibold hover:bg-gray-100"
                  >
                    Qty {getSortIcon("productDetail.purchasedQuantity")}
                  </th>

                  <th
                    onClick={() => handleSort("productDetail.price")}
                    className="cursor-pointer whitespace-nowrap border border-[#dee2e6] px-2 py-[9px] font-semibold hover:bg-gray-100"
                  >
                    Price {getSortIcon("productDetail.price")}
                  </th>

                  <th
                    onClick={() => handleSort("remark")}
                    className="cursor-pointer whitespace-nowrap border border-[#dee2e6] px-2 py-[9px] font-semibold hover:bg-gray-100"
                  >
                    Remark {getSortIcon("remark")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredFlattenedData.length > 0 ? (
                  <>
                    {filteredFlattenedData.map((item, index) => (
                      <tr
                        key={item.uniqueKey}
                        className={
                          index % 2 === 0
                            ? "bg-[#f1f3f5] transition-colors hover:bg-[#e9ecef]"
                            : "bg-white transition-colors hover:bg-[#f8f9fa]"
                        }
                      >
                        <td className="break-words border border-[#dee2e6] px-2 py-[9px] align-top">
                          {formatDate(item.date || "")}
                        </td>

                        <td className="break-words border border-[#dee2e6] px-2 py-[9px] align-top">
                          {item.outlet?.centerName || ""}
                        </td>

                        <td className="break-words border border-[#dee2e6] px-2 py-[9px] align-top">
                          {item.invoiceNo}
                        </td>

                        <td className="break-words border border-[#dee2e6] px-2 py-[9px] align-top">
                          {item.vendor?.businessName || ""}
                        </td>

                        <td className="break-words border border-[#dee2e6] px-2 py-[9px] align-top">
                          {item.productDetail?.product?.productTitle ||
                            "No Product"}
                        </td>

                        <td className="break-words border border-[#dee2e6] px-2 py-[9px] align-top">
                          {item.productDetail?.purchasedQuantity || 0}
                        </td>

                        <td className="break-words border border-[#dee2e6] px-2 py-[9px] align-top">
                          {item.productDetail?.price || 0}
                        </td>

                        <td className="break-words border border-[#dee2e6] px-2 py-[9px] align-top">
                          {item.remark || ""}
                        </td>
                      </tr>
                    ))}

                    {/* Total Row */}
                    <tr className="bg-[#e9ecef] font-semibold">
                      <td
                        colSpan={5}
                        className="border border-[#dee2e6] px-2 py-[9px] text-right"
                      >
                        Total
                      </td>

                      <td className="border border-[#dee2e6] px-2 py-[9px]">
                        {totals.totalQty.toFixed(2)}
                      </td>

                      <td className="border border-[#dee2e6] px-2 py-[9px]">
                        {totals.totalAmount.toFixed(2)}
                      </td>

                      <td className="border border-[#dee2e6] px-2 py-[9px]" />
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="border border-[#dee2e6] bg-white px-4 py-8 text-center text-sm text-gray-500"
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

export default PurchaseDetail;