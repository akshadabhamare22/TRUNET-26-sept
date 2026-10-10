// import React, { useEffect, useState } from "react";
// import {
//   ArrowDown,
//   ArrowUp,
//   RotateCcw,
//   Search,
//   X,
//   List,
// } from "lucide-react";
// import { useLocation } from "react-router-dom";

// import axiosInstance from "../../axiosInstance";import Pagination from "../../utils/Pagination";
// import TransactionSearch from "./TransactionSearch";

// const TransactionReport = () => {
//   const [data, setData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [customers, setCustomers] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchModalVisible, setSearchModalVisible] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [activeSearch, setActiveSearch] = useState({
//     product: "",
//     center: "",
//     usageType: "",
//     status: "",
//     createdBy: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [serialModalVisible, setSerialModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedSerials, setSelectedSerials] = useState([]);

//   const location = useLocation();

//   const getUrlParams = () => {
//     const searchParams = new URLSearchParams(location.search);

//     return {
//       product: searchParams.get("product"),
//       center: searchParams.get("center"),
//       usageType: searchParams.get("usageType"),
//       productName: searchParams.get("productName"),
//       centerName: searchParams.get("centerName"),
//       month: searchParams.get("month"),
//     };
//   };

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setLoading(true);

//         const urlParams = getUrlParams();

//         await Promise.all([
//           fetchCenters(),
//           fetchProducts(),
//           fetchCustomers(),
//         ]);

//         let searchParams = {};

//         if (
//           urlParams.product ||
//           urlParams.center ||
//           urlParams.usageType
//         ) {
//           searchParams = {
//             product: urlParams.product || "",
//             center: urlParams.center || "",
//             usageType: urlParams.usageType || "",
//             startDate: "",
//             endDate: "",
//             status: "",
//             createdBy: "",
//           };

//           setActiveSearch(searchParams);

//           if (
//             urlParams.productName &&
//             urlParams.centerName &&
//             urlParams.usageType
//           ) {
//             document.title = `Transaction Report - ${decodeURIComponent(
//               urlParams.productName
//             )} at ${decodeURIComponent(
//               urlParams.centerName
//             )} (${urlParams.usageType})`;
//           }
//         }

//         await fetchData(searchParams, 1);
//       } catch (error) {
//         console.error("Error initializing data:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeData();
//   }, [location.search]);

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();
//       const urlParams = getUrlParams();

//       const productId =
//         urlParams.product || searchParams.product;

//       const centerId =
//         urlParams.center || searchParams.center;

//       const usageType =
//         urlParams.usageType || searchParams.usageType;

//       if (productId) {
//         params.append("product", productId);
//       }

//       if (centerId) {
//         params.append("center", centerId);
//       }

//       if (usageType) {
//         params.append("usageType", usageType);
//       }

//       if (searchParams.status) {
//         params.append("status", searchParams.status);
//       }

//       if (searchParams.createdBy) {
//         params.append("createdBy", searchParams.createdBy);
//       }

//       if (searchParams.startDate) {
//         params.append("startDate", searchParams.startDate);
//       }

//       if (searchParams.endDate) {
//         params.append("endDate", searchParams.endDate);
//       }

//       if (urlParams.month) {
//         const [year, month] = urlParams.month.split("-");

//         const monthStart = `${year}-${month.padStart(2, "0")}-01`;

//         const lastDay = new Date(
//           parseInt(year),
//           parseInt(month),
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
//         ? `/availableStock/transactions?${params.toString()}`
//         : "/availableStock/transactions";

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

//   const fetchCustomers = async () => {
//     try {
//       const response = await axiosInstance.get("/customers");

//       if (response.data.success) {
//         setCustomers(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     }
//   };

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;

//     fetchData(activeSearch, page);
//   };

//   const getNestedValue = (object, key) => {
//     if (!key.includes(".")) {
//       return object?.[key];
//     }

//     return key
//       .split(".")
//       .reduce((value, property) => value?.[property], object);
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
//       <ArrowUp size={14} className="inline-block" />
//     ) : (
//       <ArrowDown size={14} className="inline-block" />
//     );
//   };

//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData);
//     fetchData(searchData, 1);
//   };

//   const handleResetSearch = () => {
//     const resetSearch = {
//       product: "",
//       center: "",
//       usageType: "",
//       status: "",
//       createdBy: "",
//       startDate: "",
//       endDate: "",
//     };

//     setActiveSearch(resetSearch);
//     setSearchTerm("");
//     fetchData({}, 1);
//   };

//   const isSearchActive = () => {
//     return Object.values(activeSearch).some(
//       (value) => value !== ""
//     );
//   };

//   const filteredData = data.filter((item) => {
//     if (isSearchActive()) {
//       return true;
//     }

//     if (!searchTerm) {
//       return true;
//     }

//     return Object.values(item).some((value) => {
//       if (
//         typeof value === "object" &&
//         value !== null
//       ) {
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
//     });
//   });

//   const calculateTotals = () => {
//     const totals = {
//       total: 0,
//     };

//     filteredData.forEach((item) => {
//       totals.total += parseFloat(item.Qty || 0);
//     });

//     return totals;
//   };

//   const handleShowSerialNumbers = (item) => {
//     if (
//       item.TrackSerialNumber === "Yes" &&
//       item.SerialNumbers &&
//       item.SerialNumbers.length > 0
//     ) {
//       setSelectedItem(item);
//       setSelectedSerials(item.SerialNumbers);
//       setSerialModalVisible(true);
//     }
//   };

//   const totals = calculateTotals();

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
//       </div>
//     );
//   }

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

//   return (
//     <div className="w-full">
//       {/* Title */}
//       <div className="mb-4">
//         <h1 className="text-xl font-semibold text-gray-800">
//           Transaction Report
//         </h1>
//       </div>

//       {/* Search Modal */}
//       <TransactionSearch
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//         customers={customers}
//       />

//       {/* Serial Number Modal */}
//       {serialModalVisible && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
//           <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Serial Numbers - {selectedItem?.Product}
//               </h2>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setSerialModalVisible(false)
//                 }
//                 className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//                 aria-label="Close"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
//               {selectedItem && (
//                 <div className="overflow-x-auto rounded-md border border-gray-200">
//                   <table className="w-full border-collapse text-sm">
//                     <thead>
//                       <tr className="bg-gray-100">
//                         <th className="w-[15%] border-b border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                           SR No.
//                         </th>

//                         <th className="w-[85%] border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                           Serial Number
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {selectedSerials.length > 0 ? (
//                         selectedSerials.map(
//                           (serial, index) => (
//                             <tr
//                               key={`${serial}-${index}`}
//                               className="hover:bg-gray-50"
//                             >
//                               <td className="border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                                 {index + 1}
//                               </td>

//                               <td className="border-b border-gray-200 px-4 py-3">
//                                 <div className="rounded-md border border-gray-200 bg-gray-50 p-2 font-medium text-gray-700">
//                                   {serial}
//                                 </div>
//                               </td>
//                             </tr>
//                           )
//                         )
//                       ) : (
//                         <tr>
//                           <td
//                             colSpan={2}
//                             className="px-4 py-8 text-center text-gray-500"
//                           >
//                             No serial numbers available
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setSerialModalVisible(false)
//                 }
//                 className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Card */}
//       <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-wrap gap-2">
//             <button
//               type="button"
//               onClick={() =>
//                 setSearchModalVisible(true)
//               }
//               className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
//             >
//               <Search size={15} />
//               Search
//             </button>

//             {isSearchActive() && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//               >
//                 <RotateCcw size={15} />
//                 Reset Search
//               </button>
//             )}
//           </div>

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
//           {/* Search Input */}
//           <div className="mb-4 flex justify-end">
//             <div className="flex w-full items-center gap-2 sm:w-auto">
//               <label
//                 htmlFor="transaction-search"
//                 className="whitespace-nowrap text-sm font-medium text-gray-700"
//               >
//                 Search:
//               </label>

//               <input
//                 id="transaction-search"
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) =>
//                   setSearchTerm(e.target.value)
//                 }
//                 className="h-8 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-[350px]"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="w-full overflow-x-auto rounded-md border border-gray-200">
//             <table className="min-w-[900px] w-full border-collapse text-sm">
//               <thead>
//                 <tr className="bg-gray-100 text-left">
//                   <th
//                     onClick={() => handleSort("Date")}
//                     className="cursor-pointer whitespace-nowrap border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Date {getSortIcon("Date")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("Type")}
//                     className="cursor-pointer whitespace-nowrap border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Type {getSortIcon("Type")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("Center")}
//                     className="cursor-pointer whitespace-nowrap border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Branch {getSortIcon("Center")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("Center")}
//                     className="cursor-pointer whitespace-nowrap border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Parent Branch {getSortIcon("Center")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("Product")}
//                     className="cursor-pointer whitespace-nowrap border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Product {getSortIcon("Product")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("Qty")}
//                     className="cursor-pointer whitespace-nowrap border-b border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
//                   >
//                     Qty {getSortIcon("Qty")}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length > 0 ? (
//                   <>
//                     {filteredData.map((item) => (
//                       <tr
//                         key={item._id}
//                         className="transition hover:bg-gray-50"
//                       >
//                         <td className="border-b border-r border-gray-200 px-4 py-3 text-gray-700">
//                           {item.Date || ""}
//                         </td>

//                         <td className="border-b border-r border-gray-200 px-4 py-3 text-gray-700">
//                           {item.Type}
//                         </td>

//                         <td className="border-b border-r border-gray-200 px-4 py-3 text-gray-700">
//                           {item.Center}
//                         </td>

//                         <td className="border-b border-r border-gray-200 px-4 py-3 text-gray-700">
//                           {""}
//                         </td>

//                         <td className="border-b border-r border-gray-200 px-4 py-3 text-gray-700">
//                           {item.Product || 0}
//                         </td>

//                         <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
//                           <div className="flex items-center justify-between gap-3">
//                             <span>{item.Qty}</span>

//                             {item.TrackSerialNumber ===
//                               "Yes" &&
//                               item.SerialNumberCount > 0 && (
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleShowSerialNumbers(
//                                       item
//                                     )
//                                   }
//                                   title={`Click to view ${item.SerialNumberCount} serial number(s)`}
//                                   className="rounded p-1 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
//                                 >
//                                   <List size={18} />
//                                 </button>
//                               )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}

//                     {/* Total Row */}
//                     <tr className="bg-gray-50 font-semibold">
//                       <td
//                         colSpan={5}
//                         className="border-b border-r border-gray-200 px-4 py-3 text-gray-700"
//                       >
//                         Total Counts
//                       </td>

//                       <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
//                         {totals.total.toFixed(2)}
//                       </td>
//                     </tr>
//                   </>
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={6}
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

// export default TransactionReport;







import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  RotateCcw,
  Search,
  X,
  List,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import axiosInstance from "../../axiosInstance";
import Pagination from "../../utils/Pagination";
import TransactionSearch from "./TransactionSearch";

const TransactionReport = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activeSearch, setActiveSearch] = useState({
    product: "",
    center: "",
    usageType: "",
    status: "",
    createdBy: "",
    startDate: "",
    endDate: "",
  });

  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSerials, setSelectedSerials] = useState([]);

  const location = useLocation();

  const getUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);

    return {
      product: searchParams.get("product"),
      center: searchParams.get("center"),
      usageType: searchParams.get("usageType"),
      productName: searchParams.get("productName"),
      centerName: searchParams.get("centerName"),
      month: searchParams.get("month"),
    };
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);

        const urlParams = getUrlParams();

        await Promise.all([
          fetchCenters(),
          fetchProducts(),
          fetchCustomers(),
        ]);

        let searchParams = {};

        if (
          urlParams.product ||
          urlParams.center ||
          urlParams.usageType
        ) {
          searchParams = {
            product: urlParams.product || "",
            center: urlParams.center || "",
            usageType: urlParams.usageType || "",
            startDate: "",
            endDate: "",
            status: "",
            createdBy: "",
          };

          setActiveSearch(searchParams);

          if (
            urlParams.productName &&
            urlParams.centerName &&
            urlParams.usageType
          ) {
            document.title = `Transaction Report - ${decodeURIComponent(
              urlParams.productName
            )} at ${decodeURIComponent(
              urlParams.centerName
            )} (${urlParams.usageType})`;
          }
        }

        await fetchData(searchParams, 1);
      } catch (error) {
        console.error("Error initializing data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [location.search]);

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      const urlParams = getUrlParams();

      const productId =
        urlParams.product || searchParams.product;

      const centerId =
        urlParams.center || searchParams.center;

      const usageType =
        urlParams.usageType || searchParams.usageType;

      if (productId) {
        params.append("product", productId);
      }

      if (centerId) {
        params.append("center", centerId);
      }

      if (usageType) {
        params.append("usageType", usageType);
      }

      if (searchParams.status) {
        params.append("status", searchParams.status);
      }

      if (searchParams.createdBy) {
        params.append("createdBy", searchParams.createdBy);
      }

      if (searchParams.startDate) {
        params.append("startDate", searchParams.startDate);
      }

      if (searchParams.endDate) {
        params.append("endDate", searchParams.endDate);
      }

      if (urlParams.month) {
        const [year, month] = urlParams.month.split("-");

        const monthStart = `${year}-${month.padStart(2, "0")}-01`;

        const lastDay = new Date(
          parseInt(year),
          parseInt(month),
          0
        ).getDate();

        const monthEnd = `${year}-${month.padStart(
          2,
          "0"
        )}-${lastDay}`;

        params.append("startDate", monthStart);
        params.append("endDate", monthEnd);
      }

      params.append("page", page);

      // Avoid reusing a cached 304 response when transaction data has changed.
      // The API endpoint and all existing filter parameters remain unchanged.
      params.append("_ts", Date.now().toString());

      const url = `/availableStock/transactions?${params.toString()}`;

      const response = await axiosInstance.get(url, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      const responseBody = response.data || {};
      const responsePayload = responseBody.data;

      // Accept the existing API response and common wrapped-array response shapes.
      const rows = Array.isArray(responsePayload)
        ? responsePayload
        : Array.isArray(responsePayload?.transactions)
          ? responsePayload.transactions
          : Array.isArray(responseBody.transactions)
            ? responseBody.transactions
            : null;

      if (responseBody.success !== false && rows !== null) {
        setData(rows);
        setCurrentPage(
          responseBody.pagination?.currentPage ??
          responseBody.pagination?.page ??
          responsePayload?.pagination?.currentPage ??
          responsePayload?.pagination?.page ??
          page
        );
        setTotalPages(
          responseBody.pagination?.totalPages ??
          responsePayload?.pagination?.totalPages ??
          1
        );
      } else {
        const errorMessage =
          responseBody.message ||
          responseBody.error ||
          "The transaction API did not return a data array. Check the API response in the browser Network tab.";

        setData([]);
        setError(errorMessage);
        console.error("Unexpected transaction API response:", responseBody);
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

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get("/customers");

      if (response.data.success) {
        setCustomers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    fetchData(activeSearch, page);
  };

  const getNestedValue = (object, key) => {
    if (!key.includes(".")) {
      return object?.[key];
    }

    return key
      .split(".")
      .reduce((value, property) => value?.[property], object);
  };

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
      <ArrowUp size={14} className="inline-block" />
    ) : (
      <ArrowDown size={14} className="inline-block" />
    );
  };

  const handleSearch = (searchData) => {
    setActiveSearch(searchData);
    fetchData(searchData, 1);
  };

  const handleResetSearch = () => {
    const resetSearch = {
      product: "",
      center: "",
      usageType: "",
      status: "",
      createdBy: "",
      startDate: "",
      endDate: "",
    };

    setActiveSearch(resetSearch);
    setSearchTerm("");
    fetchData({}, 1);
  };

  const isSearchActive = () => {
    return Object.values(activeSearch).some(
      (value) => value !== ""
    );
  };

  const filteredData = data.filter((item) => {
    if (isSearchActive()) {
      return true;
    }

    if (!searchTerm) {
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
  });

  const calculateTotals = () => {
    const totals = {
      total: 0,
    };

    filteredData.forEach((item) => {
      totals.total += parseFloat(item.Qty || 0);
    });

    return totals;
  };

  const handleShowSerialNumbers = (item) => {
    if (
      item.TrackSerialNumber === "Yes" &&
      item.SerialNumbers &&
      item.SerialNumbers.length > 0
    ) {
      setSelectedItem(item);
      setSelectedSerials(item.SerialNumbers);
      setSerialModalVisible(true);
    }
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

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

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* Title */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        <h1 className="text-[26px] font-normal leading-8 text-[#263746]">
          Transaction Report
        </h1>
      </div>

      {/* Search Modal */}
      <TransactionSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        customers={customers}
      />

      {/* Serial Number Modal */}
      {serialModalVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Serial Numbers - {selectedItem?.Product}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSerialModalVisible(false)
                }
                className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
              {selectedItem && (
                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gray-100">
                        <th className="w-[15%] border-b border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                          SR No.
                        </th>

                        <th className="w-[85%] border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                          Serial Number
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedSerials.length > 0 ? (
                        selectedSerials.map(
                          (serial, index) => (
                            <tr
                              key={`${serial}-${index}`}
                              className="hover:bg-gray-50"
                            >
                              <td className="border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-700">
                                {index + 1}
                              </td>

                              <td className="border-b border-gray-200 px-4 py-3">
                                <div className="rounded-md border border-gray-200 bg-gray-50 p-2 font-medium text-gray-700">
                                  {serial}
                                </div>
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan={2}
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No serial numbers available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setSerialModalVisible(false)
                }
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="mt-4 overflow-hidden border border-gray-200 border-t-4 border-t-[#2857a4] bg-white">
        {/* Card Header */}
        <div className="flex flex-col gap-2 border-b border-gray-200 bg-white px-4 py-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(true)
              }
              className="inline-flex items-center gap-1.5 rounded-[3px] border border-[#2857a4] bg-[#2857a4] px-2 py-[7px] text-sm font-medium leading-[18px] text-white transition hover:bg-[#214a8d]"
            >
              <Search size={15} />
              Search
            </button>

            {isSearchActive() && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-1.5 rounded-[3px] border border-gray-300 bg-white px-2 py-[7px] text-sm font-medium leading-[18px] text-gray-700 transition hover:bg-gray-100"
              >
                <RotateCcw size={15} />
                Reset Search
              </button>
            )}
          </div>

          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Search Input */}
          <div className="mb-4 flex justify-end">
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <label
                htmlFor="transaction-search"
                className="whitespace-nowrap text-sm font-semibold text-gray-800"
              >
                Search:
              </label>

              <input
                id="transaction-search"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="h-[30px] w-full border border-[#d5dbe3] bg-white px-2 text-sm outline-none focus:border-[#2857a4] focus:ring-1 focus:ring-[#2857a4] sm:w-[220px]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="max-h-[370px] w-full overflow-auto border border-[#e5e7eb]">
            <table className="min-w-[900px] w-full border-collapse text-[16px] text-[#111827]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-white text-left">
                  <th
                    onClick={() => handleSort("Date")}
                    className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black hover:bg-gray-50"
                  >
                    Date {getSortIcon("Date")}
                  </th>

                  <th
                    onClick={() => handleSort("Type")}
                    className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black hover:bg-gray-50"
                  >
                    Type {getSortIcon("Type")}
                  </th>

                  <th
                    onClick={() => handleSort("Center")}
                    className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black hover:bg-gray-50"
                  >
                    Branch {getSortIcon("Center")}
                  </th>

                  <th
                    onClick={() => handleSort("Center")}
                    className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black hover:bg-gray-50"
                  >
                    Parent Branch {getSortIcon("Center")}
                  </th>

                  <th
                    onClick={() => handleSort("Product")}
                    className="cursor-pointer whitespace-nowrap border border-[#e5e7eb] bg-white px-2 py-[9px] text-left font-semibold text-black hover:bg-gray-50"
                  >
                    Product {getSortIcon("Product")}
                  </th>

                  <th
                    onClick={() => handleSort("Qty")}
                    className="cursor-pointer whitespace-nowrap border-b border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Qty {getSortIcon("Qty")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((item) => (
                      <tr
                        key={item._id}
                        className="transition odd:bg-[#f1f1f1] even:bg-white hover:bg-gray-100"
                      >
                        <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                          {item.Date || ""}
                        </td>

                        <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                          {item.Type}
                        </td>

                        <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                          {item.Center}
                        </td>

                        <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                          {""}
                        </td>

                        <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                          {item.Product || 0}
                        </td>

                        <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                          <div className="flex items-center justify-between gap-3">
                            <span>{item.Qty}</span>

                            {item.TrackSerialNumber ===
                              "Yes" &&
                              item.SerialNumberCount > 0 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleShowSerialNumbers(
                                      item
                                    )
                                  }
                                  title={`Click to view ${item.SerialNumberCount} serial number(s)`}
                                  className="rounded p-1 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
                                >
                                  <List size={18} />
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Total Row */}
                    <tr className="bg-white font-semibold">
                      <td
                        colSpan={5}
                        className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]"
                      >
                        Total Counts
                      </td>

                      <td className="whitespace-nowrap border border-[#e5e7eb] px-2 py-[9px] text-[#111827]">
                        {totals.total.toFixed(2)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="border border-[#e5e7eb] bg-[#f1f1f1] px-4 py-3 text-center text-sm text-gray-600"
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

export default TransactionReport;