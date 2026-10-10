// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import {
//   Download,
//   FileUp,
//   MoreVertical,
//   Pencil,
//   Plus,
//   RotateCcw,
//   Search,
//   Settings,
//   Trash2,
//   Upload,
//   X,
//   ArrowUp,
//   ArrowDown,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import axiosInstance from "../../../axiosInstance";
// import {
//   confirmDelete,
//   showError,
//   showSuccess,
// } from "../../../utils/sweetAlerts";

// import SearchProductModel from "./SearchProductModel";
// import Pagination from "../../../utils/Pagination";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });

//   const [searchTerm, setSearchTerm] = useState("");

//   const [searchModalVisible, setSearchModalVisible] =
//     useState(false);

//   const [activeSearch, setActiveSearch] = useState({
//     keyword: "",
//     category: "",
//     status: "",
//   });

//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [importModalVisible, setImportModalVisible] =
//     useState(false);

//   const [importFile, setImportFile] = useState(null);
//   const [importLoading, setImportLoading] =
//     useState(false);
//   const [importResult, setImportResult] =
//     useState(null);

//   const dropdownRefs = useRef({});
//   const fileInputRef = useRef(null);

//   const navigate = useNavigate();

//   // --------------------------------------------------
//   // Fetch Products
//   // --------------------------------------------------
//   const fetchProducts = async (
//     searchParams = {},
//     page = 1,
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();

//       if (searchParams.keyword) {
//         params.append(
//           "search",
//           searchParams.keyword,
//         );
//       }

//       if (searchParams.category) {
//         params.append(
//           "category",
//           searchParams.category,
//         );
//       }

//       if (searchParams.status) {
//         params.append(
//           "status",
//           searchParams.status,
//         );
//       }

//       params.append("page", page);

//       const url = params.toString()
//         ? `/products?${params.toString()}`
//         : "/products";

//       const response =
//         await axiosInstance.get(url);

//       if (response.data?.success) {
//         setProducts(
//           response.data.data || [],
//         );

//         setCurrentPage(
//           response.data.pagination?.currentPage ||
//             1,
//         );

//         setTotalPages(
//           response.data.pagination?.totalPages ||
//             1,
//         );
//       } else {
//         const errorMessage =
//           response.data?.message ||
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
//   // Fetch Categories
//   // --------------------------------------------------
//   const fetchCategories = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           "/product-category",
//         );

//       if (response.data?.success) {
//         setCategories(
//           response.data.data || [],
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching product category:",
//         error,
//       );
//     }
//   };

//   // --------------------------------------------------
//   // Initial Load
//   // --------------------------------------------------
//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
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

//     fetchProducts(
//       activeSearch,
//       page,
//     );
//   };

//   // --------------------------------------------------
//   // Download CSV Template
//   // --------------------------------------------------
//   const downloadCSVTemplate = async () => {
//     try {
//       const response =
//         await axiosInstance.get(
//           "/products/download-template",
//           {
//             responseType: "blob",
//           },
//         );

//       const url =
//         window.URL.createObjectURL(
//           new Blob([response.data]),
//         );

//       const link =
//         document.createElement("a");

//       link.href = url;
//       link.setAttribute(
//         "download",
//         "product_import_template.csv",
//       );

//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error(
//         "Error downloading template:",
//         error,
//       );

//       showError(
//         "Failed to download template",
//       );
//     }
//   };

//   // --------------------------------------------------
//   // CSV File Select
//   // --------------------------------------------------
//   const handleFileSelect = (event) => {
//     const file =
//       event.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     if (
//       file.type === "text/csv" ||
//       file.name
//         .toLowerCase()
//         .endsWith(".csv")
//     ) {
//       setImportFile(file);
//       setImportResult(null);
//     } else {
//       showError(
//         "Please select a valid CSV file",
//       );

//       event.target.value = "";
//     }
//   };

//   // --------------------------------------------------
//   // Import CSV
//   // --------------------------------------------------
//   const handleImportCSV = async () => {
//     if (!importFile) {
//       showError(
//         "Please select a CSV file to import",
//       );
//       return;
//     }

//     setImportLoading(true);

//     const formData = new FormData();

//     formData.append(
//       "csvFile",
//       importFile,
//     );

//     try {
//       const response =
//         await axiosInstance.post(
//           "/products/bulk-import",
//           formData,
//           {
//             headers: {
//               "Content-Type":
//                 "multipart/form-data",
//             },
//           },
//         );

//       setImportResult(
//         response.data,
//       );

//       if (response.data?.success) {
//         const results =
//           response.data.results;

//         if (results?.failed === 0) {
//           showSuccess(
//             `Import completed successfully! ${results.successful} products imported.`,
//           );
//         } else {
//           showSuccess(
//             `Import completed with ${results?.failed || 0} failures. ${results?.successful || 0} products imported successfully.`,
//           );
//         }

//         setImportModalVisible(false);
//         setImportFile(null);

//         fetchProducts();

//         if (fileInputRef.current) {
//           fileInputRef.current.value =
//             "";
//         }
//       } else {
//         showError(
//           "Import failed. Please check the file and try again.",
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Import error:",
//         error,
//       );

//       const errorMessage =
//         error.response?.data?.message ||
//         "Import failed due to network error";

//       setImportResult({
//         success: false,
//         message: errorMessage,
//       });

//       showError(errorMessage);
//     } finally {
//       setImportLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Reset Import
//   // --------------------------------------------------
//   const resetImport = () => {
//     setImportFile(null);
//     setImportResult(null);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
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

//     const sortedProducts = [
//       ...products,
//     ].sort((a, b) => {
//       let aValue = a;
//       let bValue = b;

//       if (key.includes(".")) {
//         const keys = key.split(".");

//         aValue = keys.reduce(
//           (obj, currentKey) =>
//             obj && obj[currentKey],
//           a,
//         );

//         bValue = keys.reduce(
//           (obj, currentKey) =>
//             obj && obj[currentKey],
//           b,
//         );
//       } else {
//         aValue = a[key];
//         bValue = b[key];
//       }

//       if (
//         aValue === null ||
//         aValue === undefined
//       ) {
//         aValue = "";
//       }

//       if (
//         bValue === null ||
//         bValue === undefined
//       ) {
//         bValue = "";
//       }

//       if (aValue < bValue) {
//         return direction ===
//           "ascending"
//           ? -1
//           : 1;
//       }

//       if (aValue > bValue) {
//         return direction ===
//           "ascending"
//           ? 1
//           : -1;
//       }

//       return 0;
//     });

//     setProducts(sortedProducts);
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null;
//     }

//     return sortConfig.direction ===
//       "ascending" ? (
//       <ArrowUp
//         size={14}
//         className="inline-block ml-1"
//       />
//     ) : (
//       <ArrowDown
//         size={14}
//         className="inline-block ml-1"
//       />
//     );
//   };

//   // --------------------------------------------------
//   // Advanced Search
//   // --------------------------------------------------
//   const handleSearch = (
//     searchData,
//   ) => {
//     setActiveSearch(searchData);
//     fetchProducts(
//       searchData,
//       1,
//     );
//   };

//   // --------------------------------------------------
//   // Reset Search
//   // --------------------------------------------------
//   const handleResetSearch = () => {
//     const resetData = {
//       keyword: "",
//       category: "",
//       status: "",
//     };

//     setActiveSearch(resetData);
//     setSearchTerm("");

//     fetchProducts(
//       resetData,
//       1,
//     );
//   };

//   // --------------------------------------------------
//   // Local Search
//   // --------------------------------------------------
//   const filteredProducts =
//     products.filter((product) =>
//       Object.values(product).some(
//         (value) => {
//           if (
//             typeof value === "object" &&
//             value !== null
//           ) {
//             return Object.values(
//               value,
//             ).some(
//               (nestedValue) =>
//                 nestedValue &&
//                 nestedValue
//                   .toString()
//                   .toLowerCase()
//                   .includes(
//                     searchTerm
//                       .toLowerCase(),
//                   ),
//             );
//           }

//           return (
//             value &&
//             value
//               .toString()
//               .toLowerCase()
//               .includes(
//                 searchTerm.toLowerCase(),
//               )
//           );
//         },
//       ),
//     );

//   // --------------------------------------------------
//   // Delete Product
//   // --------------------------------------------------
//   const handleDeleteData = async (
//     itemId,
//   ) => {
//     const result =
//       await confirmDelete();

//     if (!result.isConfirmed) {
//       return;
//     }

//     try {
//       await axiosInstance.delete(
//         `/products/${itemId}`,
//       );

//       setProducts((prev) =>
//         prev.filter(
//           (product) =>
//             product._id !== itemId,
//         ),
//       );

//       showSuccess(
//         "Product deleted successfully!",
//       );
//     } catch (error) {
//       console.error(
//         "Error deleting product:",
//         error,
//       );
//     }
//   };

//   // --------------------------------------------------
//   // Edit Product
//   // --------------------------------------------------
//   const handleEditData = (
//     itemId,
//   ) => {
//     navigate(
//       `/edit-product/${itemId}`,
//     );
//   };

//   // --------------------------------------------------
//   // Dropdown
//   // --------------------------------------------------
//   const toggleDropdown = (id) => {
//     setDropdownOpen(
//       (prev) => ({
//         ...prev,
//         [id]: !prev[id],
//       }),
//     );
//   };

//   // --------------------------------------------------
//   // Close Dropdown On Outside Click
//   // --------------------------------------------------
//   useEffect(() => {
//     const handleClickOutside = (
//       event,
//     ) => {
//       const newDropdownState =
//         {};
//       let shouldUpdate = false;

//       Object.keys(
//         dropdownRefs.current,
//       ).forEach((key) => {
//         const element =
//           dropdownRefs.current[key];

//         if (
//           element &&
//           !element.contains(
//             event.target,
//           )
//         ) {
//           newDropdownState[key] =
//             false;

//           shouldUpdate = true;
//         }
//       });

//       if (shouldUpdate) {
//         setDropdownOpen(
//           (prev) => ({
//             ...prev,
//             ...newDropdownState,
//           }),
//         );
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
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // Error
//   // --------------------------------------------------
//   if (error) {
//     return (
//       <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {/* ------------------------------------------------ */}
//       {/* Page Title */}
//       {/* ------------------------------------------------ */}
//       <div className="mb-4 text-2xl font-semibold text-gray-800">
//         Product List
//       </div>

//       {/* ------------------------------------------------ */}
//       {/* Search Modal */}
//       {/* ------------------------------------------------ */}
//       <SearchProductModel
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(
//             false,
//           )
//         }
//         onSearch={handleSearch}
//         categories={categories}
//       />

//       {/* ------------------------------------------------ */}
//       {/* Import Modal */}
//       {/* ------------------------------------------------ */}
//       {importModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//           <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between border-b px-6 py-4">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Import Products from CSV
//               </h2>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setImportModalVisible(
//                     false,
//                   );
//                   resetImport();
//                 }}
//                 className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
//               {/* Import Result */}
//               {importResult && (
//                 <div
//                   className={`mb-4 rounded-md border px-4 py-3 ${
//                     importResult.success
//                       ? "border-green-200 bg-green-50 text-green-800"
//                       : "border-red-200 bg-red-50 text-red-800"
//                   }`}
//                 >
//                   <div className="font-semibold">
//                     {importResult.success
//                       ? "Success!"
//                       : "Error!"}
//                   </div>

//                   {importResult.message && (
//                     <div className="mt-1">
//                       {importResult.message}
//                     </div>
//                   )}

//                   {importResult.summary && (
//                     <div className="mt-3">
//                       <div className="font-semibold">
//                         Summary:
//                       </div>

//                       <ul className="mt-1 list-disc pl-5 text-sm">
//                         <li>
//                           Total Processed:{" "}
//                           {
//                             importResult
//                               .summary
//                               .totalProcessed
//                           }
//                         </li>

//                         <li>
//                           Successful:{" "}
//                           {
//                             importResult
//                               .summary
//                               .successful
//                           }
//                         </li>

//                         <li>
//                           Failed:{" "}
//                           {
//                             importResult
//                               .summary
//                               .failed
//                           }
//                         </li>

//                         <li>
//                           Categories Processed:{" "}
//                           {
//                             importResult
//                               .summary
//                               .categoriesProcessed
//                           }
//                         </li>
//                       </ul>
//                     </div>
//                   )}

//                   {importResult.errors
//                     ?.length > 0 && (
//                     <div className="mt-3">
//                       <div className="font-semibold">
//                         Errors:
//                       </div>

//                       <ul className="mt-1 list-disc pl-5 text-sm">
//                         {importResult.errors
//                           .slice(0, 5)
//                           .map(
//                             (
//                               importError,
//                               index,
//                             ) => (
//                               <li
//                                 key={
//                                   `${importError.row}-${index}`
//                                 }
//                               >
//                                 Row{" "}
//                                 {
//                                   importError.row
//                                 }
//                                 :{" "}
//                                 {
//                                   importError.productTitle
//                                 }{" "}
//                                 -{" "}
//                                 {
//                                   importError.error
//                                 }
//                               </li>
//                             ),
//                           )}

//                         {importResult.errors
//                           .length > 5 && (
//                           <li>
//                             ... and{" "}
//                             {
//                               importResult
//                                 .errors
//                                 .length -
//                                 5
//                             }{" "}
//                             more errors
//                           </li>
//                         )}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* File Upload */}
//               <div>
//                 <p className="mb-3 text-sm text-gray-600">
//                   Upload a CSV file to
//                   import multiple products
//                   at once.
//                 </p>

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept=".csv"
//                   onChange={
//                     handleFileSelect
//                   }
//                   className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
//                 />

//                 <p className="mt-2 text-xs text-gray-500">
//                   Download the template
//                   first to ensure proper
//                   formatting.
//                 </p>
//               </div>

//               {/* Selected File */}
//               {importFile && (
//                 <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
//                   <span className="font-semibold">
//                     Selected file:
//                   </span>{" "}
//                   {importFile.name}
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-2 border-t bg-gray-50 px-6 py-4">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setImportModalVisible(
//                     false,
//                   );
//                   resetImport();
//                 }}
//                 className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={handleImportCSV}
//                 disabled={
//                   !importFile ||
//                   importLoading
//                 }
//                 className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {importLoading ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Importing...
//                   </>
//                 ) : (
//                   <>
//                     <Upload size={16} />
//                     Import Products
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ------------------------------------------------ */}
//       {/* Main Card */}
//       {/* ------------------------------------------------ */}
//       <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex flex-col gap-3 border-b bg-gray-50 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
//           {/* Actions */}
//           <div className="flex flex-wrap gap-2">
//             <button
//               type="button"
//               onClick={() =>
//                 navigate("/add-product")
//               }
//               className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
//             >
//               <Plus size={16} />
//               Add
//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 setSearchModalVisible(
//                   true,
//                 )
//               }
//               className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
//             >
//               <Search size={16} />
//               Search
//             </button>

//             {(
//               activeSearch.keyword ||
//               activeSearch.category ||
//               activeSearch.status
//             ) && (
//               <button
//                 type="button"
//                 onClick={
//                   handleResetSearch
//                 }
//                 className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
//               >
//                 <RotateCcw
//                   size={16}
//                 />
//                 Reset Search
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={
//                 downloadCSVTemplate
//               }
//               className="inline-flex items-center gap-1.5 rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
//             >
//               <Download size={16} />
//               Download Template
//             </button>

//             <button
//               type="button"
//               onClick={() => {
//                 setImportResult(null);
//                 setImportModalVisible(
//                   true,
//                 );
//               }}
//               className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
//             >
//               <FileUp size={16} />
//               Import CSV
//             </button>
//           </div>

//           {/* Pagination */}
//           <div>
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
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
//             <div className="flex items-center gap-2">
//               <label
//                 htmlFor="product-local-search"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 Search:
//               </label>

//               <input
//                 id="product-local-search"
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) =>
//                   setSearchTerm(
//                     e.target.value,
//                   )
//                 }
//                 className="h-8 w-full max-w-[350px] border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto rounded-md border border-gray-200">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <SortableHeader
//                     label="Product Name"
//                     sortKey="productTitle"
//                     onSort={handleSort}
//                     getSortIcon={getSortIcon}
//                   />

//                   <SortableHeader
//                     label="Product Category"
//                     sortKey="productCategory.productCategory"
//                     onSort={handleSort}
//                     getSortIcon={getSortIcon}
//                   />

//                   <SortableHeader
//                     label="Product Code"
//                     sortKey="productCode"
//                     onSort={handleSort}
//                     getSortIcon={getSortIcon}
//                   />

//                   <SortableHeader
//                     label="Product Price"
//                     sortKey="productPrice"
//                     onSort={handleSort}
//                     getSortIcon={getSortIcon}
//                   />

//                   <SortableHeader
//                     label="Sale Price"
//                     sortKey="salePrice"
//                     onSort={handleSort}
//                     getSortIcon={getSortIcon}
//                   />

//                   <SortableHeader
//                     label="Product Description"
//                     sortKey="description"
//                     onSort={handleSort}
//                     getSortIcon={getSortIcon}
//                   />

//                   <SortableHeader
//                     label="Status"
//                     sortKey="status"
//                     onSort={handleSort}
//                     getSortIcon={getSortIcon}
//                   />

//                   <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {filteredProducts.length >
//                 0 ? (
//                   filteredProducts.map(
//                     (product) => (
//                       <tr
//                         key={
//                           product._id
//                         }
//                         className="hover:bg-gray-50"
//                       >
//                         <td className="px-4 py-3 text-sm text-gray-700">
//                           {
//                             product.productTitle
//                           }
//                         </td>

//                         <td className="px-4 py-3 text-sm text-gray-700">
//                           {
//                             product
//                               .productCategory
//                               ?.productCategory
//                           }
//                         </td>

//                         <td className="px-4 py-3 text-sm text-gray-700">
//                           {
//                             product.productCode
//                           }
//                         </td>

//                         <td className="px-4 py-3 text-sm text-gray-700">
//                           {
//                             product.productPrice
//                           }
//                         </td>

//                         <td className="px-4 py-3 text-sm text-gray-700">
//                           {
//                             product.salePrice
//                           }
//                         </td>

//                         <td className="max-w-xs px-4 py-3 text-sm text-gray-700">
//                           <div className="truncate">
//                             {
//                               product.description
//                             }
//                           </div>
//                         </td>

//                         <td className="px-4 py-3">
//                           <span
//                             className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                               product.status ===
//                               "Enable"
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-red-100 text-red-700"
//                             }`}
//                           >
//                             {
//                               product.status
//                             }
//                           </span>
//                         </td>

//                         <td className="relative px-4 py-3">
//                           <div
//                             className="relative"
//                             ref={(element) => {
//                               dropdownRefs.current[
//                                 product._id
//                               ] =
//                                 element;
//                             }}
//                           >
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 toggleDropdown(
//                                   product._id,
//                                 )
//                               }
//                               className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
//                             >
//                               <Settings
//                                 size={15}
//                               />
//                               Options
//                               <MoreVertical
//                                 size={14}
//                               />
//                             </button>

//                             {dropdownOpen[
//                               product._id
//                             ] && (
//                               <div className="absolute right-0 z-20 mt-1 w-32 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleEditData(
//                                       product._id,
//                                     )
//                                   }
//                                   className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
//                                 >
//                                   <Pencil
//                                     size={15}
//                                   />
//                                   Edit
//                                 </button>

//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleDeleteData(
//                                       product._id,
//                                     )
//                                   }
//                                   className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
//                                 >
//                                   <Trash2
//                                     size={15}
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
//                       colSpan={8}
//                       className="px-4 py-10 text-center text-sm text-gray-500"
//                     >
//                       No products found
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

// // --------------------------------------------------
// // Sortable Header
// // --------------------------------------------------
// const SortableHeader = ({
//   label,
//   sortKey,
//   onSort,
//   getSortIcon,
// }) => {
//   return (
//     <th
//       scope="col"
//       onClick={() =>
//         onSort(sortKey)
//       }
//       className="cursor-pointer whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 hover:bg-gray-100"
//     >
//       {label}
//       {getSortIcon(sortKey)}
//     </th>
//   );
// };

// export default ProductList;



import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Download,
  FileUp,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Trash2,
  Upload,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../../axiosInstance";
import {
  confirmDelete,
  showError,
  showSuccess,
} from "../../../utils/sweetAlerts";

import SearchProductModel from "./SearchProductModel";
import Pagination from "../../../utils/Pagination";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [searchModalVisible, setSearchModalVisible] =
    useState(false);

  const [activeSearch, setActiveSearch] = useState({
    keyword: "",
    category: "",
    status: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [importModalVisible, setImportModalVisible] =
    useState(false);

  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] =
    useState(false);
  const [importResult, setImportResult] =
    useState(null);

  const dropdownRefs = useRef({});
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  // --------------------------------------------------
  // Fetch Products
  // --------------------------------------------------
  const fetchProducts = async (
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

      if (searchParams.category) {
        params.append(
          "category",
          searchParams.category,
        );
      }

      if (searchParams.status) {
        params.append(
          "status",
          searchParams.status,
        );
      }

      params.append("page", page);

      const url = params.toString()
        ? `/products?${params.toString()}`
        : "/products";

      const response =
        await axiosInstance.get(url);

      if (response.data?.success) {
        setProducts(
          response.data.data || [],
        );

        setCurrentPage(
          response.data.pagination?.currentPage ||
            1,
        );

        setTotalPages(
          response.data.pagination?.totalPages ||
            1,
        );
      } else {
        const errorMessage =
          response.data?.message ||
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
  // Fetch Categories
  // --------------------------------------------------
  const fetchCategories = async () => {
    try {
      const response =
        await axiosInstance.get(
          "/product-category",
        );

      if (response.data?.success) {
        setCategories(
          response.data.data || [],
        );
      }
    } catch (error) {
      console.error(
        "Error fetching product category:",
        error,
      );
    }
  };

  // --------------------------------------------------
  // Initial Load
  // --------------------------------------------------
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------
  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    fetchProducts(
      activeSearch,
      page,
    );
  };

  // --------------------------------------------------
  // Download CSV Template
  // --------------------------------------------------
  const downloadCSVTemplate = async () => {
    try {
      const response =
        await axiosInstance.get(
          "/products/download-template",
          {
            responseType: "blob",
          },
        );

      const url =
        window.URL.createObjectURL(
          new Blob([response.data]),
        );

      const link =
        document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        "product_import_template.csv",
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Error downloading template:",
        error,
      );

      showError(
        "Failed to download template",
      );
    }
  };

  // --------------------------------------------------
  // CSV File Select
  // --------------------------------------------------
  const handleFileSelect = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type === "text/csv" ||
      file.name
        .toLowerCase()
        .endsWith(".csv")
    ) {
      setImportFile(file);
      setImportResult(null);
    } else {
      showError(
        "Please select a valid CSV file",
      );

      event.target.value = "";
    }
  };

  // --------------------------------------------------
  // Import CSV
  // --------------------------------------------------
  const handleImportCSV = async () => {
    if (!importFile) {
      showError(
        "Please select a CSV file to import",
      );
      return;
    }

    setImportLoading(true);

    const formData = new FormData();

    formData.append(
      "csvFile",
      importFile,
    );

    try {
      const response =
        await axiosInstance.post(
          "/products/bulk-import",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          },
        );

      setImportResult(
        response.data,
      );

      if (response.data?.success) {
        const results =
          response.data.results;

        if (results?.failed === 0) {
          showSuccess(
            `Import completed successfully! ${results.successful} products imported.`,
          );
        } else {
          showSuccess(
            `Import completed with ${results?.failed || 0} failures. ${results?.successful || 0} products imported successfully.`,
          );
        }

        setImportModalVisible(false);
        setImportFile(null);

        fetchProducts();

        if (fileInputRef.current) {
          fileInputRef.current.value =
            "";
        }
      } else {
        showError(
          "Import failed. Please check the file and try again.",
        );
      }
    } catch (error) {
      console.error(
        "Import error:",
        error,
      );

      const errorMessage =
        error.response?.data?.message ||
        "Import failed due to network error";

      setImportResult({
        success: false,
        message: errorMessage,
      });

      showError(errorMessage);
    } finally {
      setImportLoading(false);
    }
  };

  // --------------------------------------------------
  // Reset Import
  // --------------------------------------------------
  const resetImport = () => {
    setImportFile(null);
    setImportResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

    const sortedProducts = [
      ...products,
    ].sort((a, b) => {
      let aValue = a;
      let bValue = b;

      if (key.includes(".")) {
        const keys = key.split(".");

        aValue = keys.reduce(
          (obj, currentKey) =>
            obj && obj[currentKey],
          a,
        );

        bValue = keys.reduce(
          (obj, currentKey) =>
            obj && obj[currentKey],
          b,
        );
      } else {
        aValue = a[key];
        bValue = b[key];
      }

      if (
        aValue === null ||
        aValue === undefined
      ) {
        aValue = "";
      }

      if (
        bValue === null ||
        bValue === undefined
      ) {
        bValue = "";
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
    });

    setProducts(sortedProducts);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return (
        <span className="ml-1 inline-flex items-center align-middle text-[#777]">
          <ArrowUp size={11} />
          <ArrowDown size={11} />
        </span>
      );
    }

    return sortConfig.direction ===
      "ascending" ? (
      <ArrowUp
        size={14}
        className="ml-1 inline-block align-middle"
      />
    ) : (
      <ArrowDown
        size={14}
        className="ml-1 inline-block align-middle"
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
    fetchProducts(
      searchData,
      1,
    );
  };

  // --------------------------------------------------
  // Reset Search
  // --------------------------------------------------
  const handleResetSearch = () => {
    const resetData = {
      keyword: "",
      category: "",
      status: "",
    };

    setActiveSearch(resetData);
    setSearchTerm("");

    fetchProducts(
      resetData,
      1,
    );
  };

  // --------------------------------------------------
  // Local Search
  // --------------------------------------------------
  const filteredProducts =
    products.filter((product) =>
      Object.values(product).some(
        (value) => {
          if (
            typeof value === "object" &&
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
                    searchTerm
                      .toLowerCase(),
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
        },
      ),
    );

  // --------------------------------------------------
  // Delete Product
  // --------------------------------------------------
  const handleDeleteData = async (
    itemId,
  ) => {
    const result =
      await confirmDelete();

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axiosInstance.delete(
        `/products/${itemId}`,
      );

      setProducts((prev) =>
        prev.filter(
          (product) =>
            product._id !== itemId,
        ),
      );

      showSuccess(
        "Product deleted successfully!",
      );
    } catch (error) {
      console.error(
        "Error deleting product:",
        error,
      );
    }
  };

  // --------------------------------------------------
  // Edit Product
  // --------------------------------------------------
  const handleEditData = (
    itemId,
  ) => {
    navigate(
      `/edit-product/${itemId}`,
    );
  };

  // --------------------------------------------------
  // Dropdown
  // --------------------------------------------------
  const toggleDropdown = (id) => {
    setDropdownOpen(
      (prev) => ({
        ...prev,
        [id]: !prev[id],
      }),
    );
  };

  // --------------------------------------------------
  // Close Dropdown On Outside Click
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (
      event,
    ) => {
      const newDropdownState =
        {};
      let shouldUpdate = false;

      Object.keys(
        dropdownRefs.current,
      ).forEach((key) => {
        const element =
          dropdownRefs.current[key];

        if (
          element &&
          !element.contains(
            event.target,
          )
        ) {
          newDropdownState[key] =
            false;

          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        setDropdownOpen(
          (prev) => ({
            ...prev,
            ...newDropdownState,
          }),
        );
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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* ------------------------------------------------ */}
      {/* Page Title */}
      {/* ------------------------------------------------ */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Product List
      </div>

      {/* ------------------------------------------------ */}
      {/* Search Modal */}
      {/* ------------------------------------------------ */}
      <SearchProductModel
        visible={searchModalVisible}
        onClose={() =>
          setSearchModalVisible(
            false,
          )
        }
        onSearch={handleSearch}
        categories={categories}
      />

{/* ------------------------------------------------ */}
{/* Import Modal */}
{/* ------------------------------------------------ */}
{importModalVisible && (
  <>
    {/* ================= OVERLAY ================= */}
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 px-4">

      {/* ================= MODAL ================= */}
      <div
        className="
          mt-[80px]
          w-full
          max-w-[800px]
          overflow-hidden
          rounded-[7px]
          bg-white
          shadow-[0_8px_30px_rgba(0,0,0,0.25)]
          animate-[importCurtain_0.4s_ease-out]
        "
      >

        {/* ================= HEADER ================= */}
        <div
          className="
            flex
            h-[68px]
            items-center
            justify-between
            border-b
            border-[#dee2e6]
            bg-white
            px-[17px]
          "
        >
          <h2
            className="
              m-0
              text-[23px]
              font-normal
              leading-none
              text-[#343a40]
            "
          >
            Import Products from CSV
          </h2>

          <button
            type="button"
            onClick={() => {
              setImportModalVisible(false);
              resetImport();
            }}
            aria-label="Close"
            className="
              flex
              h-[38px]
              w-[38px]
              items-center
              justify-center
              rounded
              text-[#777]
              transition-all
              duration-200
              hover:bg-[#f1f1f1]
              hover:text-[#333]
            "
          >
            <X size={25} strokeWidth={1.8} />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="px-[17px] pb-[30px] pt-[18px]">

          {/* ================= IMPORT RESULT ================= */}
          {importResult && (
            <div
              className={`
                mb-[20px]
                rounded-[4px]
                border
                px-[15px]
                py-[13px]
                text-[14px]
                ${
                  importResult.success
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }
              `}
            >
              <div className="font-semibold">
                {importResult.success
                  ? "Success!"
                  : "Error!"}
              </div>

              {importResult.message && (
                <div className="mt-1">
                  {importResult.message}
                </div>
              )}

              {importResult.summary && (
                <div className="mt-3">

                  <div className="font-semibold">
                    Summary:
                  </div>

                  <ul className="mt-1 list-disc pl-5 text-sm">
                    <li>
                      Total Processed:{" "}
                      {importResult.summary.totalProcessed}
                    </li>

                    <li>
                      Successful:{" "}
                      {importResult.summary.successful}
                    </li>

                    <li>
                      Failed:{" "}
                      {importResult.summary.failed}
                    </li>

                    <li>
                      Categories Processed:{" "}
                      {importResult.summary.categoriesProcessed}
                    </li>
                  </ul>
                </div>
              )}

              {/* ================= ERRORS ================= */}
              {importResult.errors?.length > 0 && (
                <div className="mt-3">

                  <div className="font-semibold">
                    Errors:
                  </div>

                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {importResult.errors
                      .slice(0, 5)
                      .map((importError, index) => (
                        <li
                          key={`${importError.row}-${index}`}
                        >
                          Row{" "}
                          {importError.row}:{" "}
                          {importError.productTitle} -{" "}
                          {importError.error}
                        </li>
                      ))}

                    {importResult.errors.length > 5 && (
                      <li>
                        ... and{" "}
                        {importResult.errors.length - 5}{" "}
                        more errors
                      </li>
                    )}
                  </ul>

                </div>
              )}
            </div>
          )}

          {/* ================= FILE UPLOAD ================= */}
          <div>

            <p className="mb-[9px] text-[16px] font-semibold text-[#343a40]">
              Upload CSV File
            </p>

            <p className="mb-[12px] text-[14px] text-[#6c757d]">
              Upload a CSV file to import multiple
              products at once.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="
                block
                h-[43px]
                w-full
                rounded-[2px]
                border
                border-[#d9d9d9]
                bg-white
                px-[10px]
                py-[5px]
                text-[14px]
                text-[#343a40]
                file:mr-4
                file:rounded-[4px]
                file:border-0
                file:bg-[#eaf1fb]
                file:px-[13px]
                file:py-[7px]
                file:text-[14px]
                file:font-medium
                file:text-[#2f5fa7]
                hover:file:bg-[#dce9f8]
              "
            />

            <p className="mt-[9px] text-[13px] text-[#6c757d]">
              Download the template first to ensure
              proper formatting.
            </p>

          </div>

          {/* ================= SELECTED FILE ================= */}
          {importFile && (
            <div
              className="
                mt-[18px]
                rounded-[4px]
                border
                border-[#b8d8f8]
                bg-[#eef6ff]
                px-[15px]
                py-[12px]
                text-[14px]
                text-[#245b91]
              "
            >
              <span className="font-semibold">
                Selected file:
              </span>{" "}
              {importFile.name}
            </div>
          )}

        </div>

        {/* ================= FOOTER ================= */}
        <div
          className="
            flex
            items-center
            justify-end
            gap-[12px]
            border-t
            border-[#dee2e6]
            bg-white
            px-[17px]
            py-[18px]
          "
        >

          {/* Cancel */}
          <button
            type="button"
            onClick={() => {
              setImportModalVisible(false);
              resetImport();
            }}
            className="
              h-[41px]
              rounded-[6px]
              bg-[#6c757d]
              px-[15px]
              text-[16px]
              font-medium
              text-white
              transition-all
              duration-200
              hover:bg-[#5c636a]
              active:scale-[0.98]
            "
          >
            Cancel
          </button>

          {/* Import */}
          <button
            type="button"
            onClick={handleImportCSV}
            disabled={!importFile || importLoading}
            className="
              inline-flex
              h-[41px]
              items-center
              justify-center
              gap-[7px]
              rounded-[6px]
              bg-[#2f5fa7]
              px-[17px]
              text-[16px]
              font-medium
              text-white
              transition-all
              duration-200
              hover:bg-[#244c88]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {importLoading ? (
              <>
                <span
                  className="
                    h-[16px]
                    w-[16px]
                    animate-spin
                    rounded-full
                    border-2
                    border-white/40
                    border-t-white
                  "
                />

                Importing...
              </>
            ) : (
              <>
                <Upload size={16} />
                Import Products
              </>
            )}
          </button>

        </div>

      </div>
    </div>

    {/* ================= CURTAIN ANIMATION ================= */}
    <style>
      {`
        @keyframes importCurtain {
          0% {
            opacity: 0;
            transform: translateY(-60px) scaleY(0.82);
            transform-origin: top center;
          }

          45% {
            opacity: 1;
            transform: translateY(8px) scaleY(1.03);
            transform-origin: top center;
          }

          70% {
            transform: translateY(-3px) scaleY(0.99);
            transform-origin: top center;
          }

          100% {
            opacity: 1;
            transform: translateY(0) scaleY(1);
            transform-origin: top center;
          }
        }
      `}
    </style>
  </>
)}

      {/* ------------------------------------------------ */}
      {/* Main Card */}
      {/* ------------------------------------------------ */}
      <div className="mt-4 overflow-hidden border-0 bg-white shadow-[0_1px_5px_rgba(0,0,0,0.12)]">
        {/* Card Header */}
        <div className="flex flex-col gap-3 border-t-[4px] border-t-[#2f5fa7] border-b border-[#dedede] bg-white px-4 py-2.5 lg:flex-row lg:items-center lg:justify-between">
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() =>
                navigate("/add-product")
              }
              className="inline-flex h-[36px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[15px] font-medium text-white hover:bg-[#244c88]"
            >
              <Plus size={16} />
              Add
            </button>

            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(
                  true,
                )
              }
              className="inline-flex h-[36px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[15px] font-medium text-white hover:bg-[#244c88]"
            >
              <Search size={16} />
              Search
            </button>

            {(
              activeSearch.keyword ||
              activeSearch.category ||
              activeSearch.status
            ) && (
              <button
                type="button"
                onClick={
                  handleResetSearch
                }
                className="inline-flex h-[36px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[15px] font-medium text-white hover:bg-[#244c88]"
              >
                <RotateCcw
                  size={16}
                />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={
                downloadCSVTemplate
              }
              className="inline-flex h-[36px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[15px] font-medium text-white hover:bg-[#244c88]"
            >
              <Download size={16} />
              Download Template
            </button>

            <button
              type="button"
              onClick={() => {
                setImportResult(null);
                setImportModalVisible(
                  true,
                );
              }}
              className="inline-flex h-[36px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-[15px] font-medium text-white hover:bg-[#244c88]"
            >
              <FileUp size={16} />
              Import CSV
            </button>
          </div>

          {/* Pagination */}
  <div className="flex items-center justify-end border-t border-[#eeeeee] bg-white px-4 py-3">
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  </div>
</div>

        {/* Card Body */}
        <div className="px-[18px] py-[17px]">
          {/* Local Search */}
          <div className="mb-4 flex justify-end">
            <div className="flex items-center gap-2">
              <label
                htmlFor="product-local-search"
                className="text-[16px] font-semibold text-[#111]"
              >
                Search:
              </label>

              <input
                id="product-local-search"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value,
                  )
                }
                className="h-[34px] w-full max-w-[238px] rounded-[2px] border border-[#d9d9d9] px-2 text-[15px] outline-none focus:border-[#2f5fa7]"
              />
            </div>
          </div>

          {/* Table */}
<div className="w-full max-h-[500px] overflow-y-auto overflow-x-hidden border border-[#eeeeee]">            
<table className="w-full table-fixed border-collapse">              
  <colgroup>
                <col style={{ width: "20%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "9%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "15%" }} />
              </colgroup>
              <thead className="bg-white">
                <tr>
                  <SortableHeader
                    label="Product Name"
                    sortKey="productTitle"
                    onSort={handleSort}
                    getSortIcon={getSortIcon}
                  />

                  <SortableHeader
                    label="Product Category"
                    sortKey="productCategory.productCategory"
                    onSort={handleSort}
                    getSortIcon={getSortIcon}
                  />

                  <SortableHeader
                    label="Product Code"
                    sortKey="productCode"
                    onSort={handleSort}
                    getSortIcon={getSortIcon}
                  />

                  <SortableHeader
                    label="Product Price"
                    sortKey="productPrice"
                    onSort={handleSort}
                    getSortIcon={getSortIcon}
                  />

                  <SortableHeader
                    label="Sale Price"
                    sortKey="salePrice"
                    onSort={handleSort}
                    getSortIcon={getSortIcon}
                  />

                  <SortableHeader
                    label="Product Description"
                    sortKey="description"
                    onSort={handleSort}
                    getSortIcon={getSortIcon}
                  />

                  <SortableHeader
                    label="Status"
                    sortKey="status"
                    onSort={handleSort}
                    getSortIcon={getSortIcon}
                  />

                  <th className="whitespace-nowrap border-b border-[#e6e6e6] bg-white px-2 py-3 text-left text-[15px] font-semibold text-[#111]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {filteredProducts.length >
                0 ? (
                  filteredProducts.map(
                    (product) => (
                      <tr
                        key={
                          product._id
                        }
                        className="transition even:bg-[#f1f1f1] hover:bg-[#eaf2fb]"
                      >
                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[15px] leading-6 text-[#111]">
                          {
                            product.productTitle
                          }
                        </td>

                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[15px] leading-6 text-[#111]">
                          {
                            product
                              .productCategory
                              ?.productCategory
                          }
                        </td>

                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[15px] leading-6 text-[#111]">
                          {
                            product.productCode
                          }
                        </td>

                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[15px] leading-6 text-[#111]">
                          {
                            product.productPrice
                          }
                        </td>

                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top text-[15px] leading-6 text-[#111]">
                          {
                            product.salePrice
                          }
                        </td>

                        <td className="max-w-xs border-b border-[#e9e9e9] px-2 py-3 align-top text-[15px] leading-6 text-[#111]">
                          <div className="truncate">
                            {
                              product.description
                            }
                          </div>
                        </td>

                        <td className="border-b border-[#e9e9e9] px-2 py-3 align-top">
                          <span
                            className={`inline-flex rounded-[4px] px-2.5 py-1 text-[13px] font-semibold ${
                              product.status ===
                              "Enable"
                                ? "bg-[#19a84a] text-white"
                                : "bg-[#dc3545] text-white"
                            }`}
                          >
                            {
                              product.status
                            }
                          </span>
                        </td>

                        <td className="relative border-b border-[#e9e9e9] px-2 py-3 align-top">
                          <div
                            className="relative"
                            ref={(element) => {
                              dropdownRefs.current[
                                product._id
                              ] =
                                element;
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleDropdown(
                                  product._id,
                                )
                              }
                              className="inline-flex h-[35px] items-center gap-1.5 rounded-[5px] border border-[#c9c9c9] bg-white px-2.5 text-[15px] font-normal text-[#333] hover:bg-[#f7f7f7]"
                            >
                              <Settings
                                size={15}
                              />
                              Options
                              <MoreVertical
                                size={14}
                              />
                            </button>

                            {dropdownOpen[
                              product._id
                            ] && (
                              <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-[3px] border border-[#ddd] bg-white py-1 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditData(
                                      product._id,
                                    )
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[14px] text-gray-700 hover:bg-[#eef4fb] hover:text-[#2f5fa7]"
                                >
                                  <Pencil
                                    size={15}
                                  />
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteData(
                                      product._id,
                                    )
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[14px] text-red-600 hover:bg-red-50"
                                >
                                  <Trash2
                                    size={15}
                                  />
                                  Delete
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
                      colSpan={8}
                      className="px-4 py-10 text-center text-sm text-gray-500"
                    >
                      No products found
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

// --------------------------------------------------
// Sortable Header
// --------------------------------------------------
const SortableHeader = ({
  label,
  sortKey,
  onSort,
  getSortIcon,
}) => {
  return (
    <th
      scope="col"
      onClick={() =>
        onSort(sortKey)
      }
      className="cursor-pointer whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 hover:bg-gray-100"
    >
      <span className="inline-flex min-h-[38px] items-center gap-1 leading-5">
        <span className="min-w-0 whitespace-normal">{label}</span>
        <span className="shrink-0">{getSortIcon(sortKey)}</span>
      </span>
    </th>
  );
};

export default ProductList;