// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   ArrowDown,
//   ArrowUp,
//   MoreVertical,
//   Pencil,
//   Plus,
//   Settings,
//   Trash2,
// } from "lucide-react";

// import axiosInstance from "../../../axiosInstance";
// import {
//   confirmDelete,
//   showSuccess,
// } from '../../../utils/sweetAlerts'

// import AddProductCategory from "./AddProductCategory";

// const ProductCategoryList = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [editingCategory, setEditingCategory] =
//     useState(null);

//   const dropdownRefs = useRef({});

//   // --------------------------------------------------
//   // Fetch Product Categories
//   // --------------------------------------------------
//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response =
//           await axiosInstance.get(
//             "/product-category",
//           );

//         if (response.data.success) {
//           setCategories(response.data.data);
//         } else {
//           const errorMessage =
//             response.data.message ||
//             "API returned unsuccessful response";

//           setError(errorMessage);

//           console.error(
//             "Backend error:",
//             response.data,
//           );
//         }
//       } catch (err) {
//         if (err.response) {
//           const errorMessage =
//             err.response.data?.message ||
//             err.response.data?.error ||
//             `Error ${err.response.status}: ${err.response.statusText}`;

//           setError(errorMessage);

//           console.error(
//             "Error response:",
//             err.response.data,
//           );
//         } else if (err.request) {
//           setError(
//             "No response received from server. Please check your network connection.",
//           );

//           console.error(
//             "Error request:",
//             err.request,
//           );
//         } else {
//           setError(
//             err.message ||
//               "An error occurred while fetching data",
//           );

//           console.error(
//             "Error message:",
//             err.message,
//           );
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategory();
//   }, []);

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

//     const sortedCategories = [...categories].sort(
//       (a, b) => {
//         let aValue = a;
//         let bValue = b;

//         if (key.includes(".")) {
//           const keys = key.split(".");

//           aValue = keys.reduce(
//             (obj, k) => obj && obj[k],
//             a,
//           );

//           bValue = keys.reduce(
//             (obj, k) => obj && obj[k],
//             b,
//           );
//         } else {
//           aValue = a[key];
//           bValue = b[key];
//         }

//         if (aValue < bValue) {
//           return direction === "ascending"
//             ? -1
//             : 1;
//         }

//         if (aValue > bValue) {
//           return direction === "ascending"
//             ? 1
//             : -1;
//         }

//         return 0;
//       },
//     );

//     setCategories(sortedCategories);
//   };

//   // --------------------------------------------------
//   // Sort Icon
//   // --------------------------------------------------
//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null;
//     }

//     return sortConfig.direction === "ascending" ? (
//       <ArrowUp
//         size={15}
//         className="ml-1 inline-block"
//       />
//     ) : (
//       <ArrowDown
//         size={15}
//         className="ml-1 inline-block"
//       />
//     );
//   };

//   // --------------------------------------------------
//   // Search
//   // --------------------------------------------------
//   const filteredCategories = categories.filter(
//     (category) =>
//       Object.values(category).some((value) => {
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
//       }),
//   );

//   // --------------------------------------------------
//   // Delete
//   // --------------------------------------------------
//   const handleDeleteCategory = async (
//     categoryId,
//   ) => {
//     const result = await confirmDelete();

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(
//           `/product-category/${categoryId}`,
//         );

//         setCategories((prev) =>
//           prev.filter(
//             (category) =>
//               category._id !== categoryId,
//           ),
//         );

//         showSuccess(
//           "Product Category deleted successfully!",
//         );
//       } catch (error) {
//         console.error(
//           "Error deleting product Category:",
//           error,
//         );
//       }
//     }
//   };

//   // --------------------------------------------------
//   // Add / Edit Callback
//   // --------------------------------------------------
//   const handleCategoryAdded = (
//     category,
//     isEdit,
//   ) => {
//     if (isEdit) {
//       setCategories((prev) =>
//         prev.map((item) =>
//           item._id === category._id
//             ? category
//             : item,
//         ),
//       );
//     } else {
//       setCategories((prev) => [
//         ...prev,
//         category,
//       ]);
//     }
//   };

//   // --------------------------------------------------
//   // Edit
//   // --------------------------------------------------
//   const handleEditCategory = (category) => {
//     setEditingCategory(category);
//     setShowModal(true);
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
//   // Close dropdown outside
//   // --------------------------------------------------
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const newDropdownState = {};
//       let shouldUpdate = false;

//       Object.keys(dropdownRefs.current).forEach(
//         (key) => {
//           const dropdown =
//             dropdownRefs.current[key];

//           if (
//             dropdown &&
//             !dropdown.contains(event.target)
//           ) {
//             newDropdownState[key] = false;
//             shouldUpdate = true;
//           }
//         },
//       );

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
//       <div className="flex h-[50vh] items-center justify-center">
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
//         className="m-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
//         role="alert"
//       >
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {/* Page Title */}
//       <div className="mb-4 text-xl font-semibold text-gray-800">
//         Product Category List
//       </div>

//       {/* Main Card */}
//       <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
//           {/* Add Button */}
//           <button
//             type="button"
//             onClick={() => {
//               setEditingCategory(null);
//               setShowModal(true);
//             }}
//             className="inline-flex w-fit items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//           >
//             <Plus size={16} />
//             Add
//           </button>

//           {/* Static Pagination - preserved from original */}
//           <div className="flex items-center gap-1">
//             <button
//               type="button"
//               className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
//             >
//               First
//             </button>

//             <button
//               type="button"
//               className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
//             >
//               &lt;
//             </button>

//             <button
//               type="button"
//               className="rounded border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs text-white"
//             >
//               1
//             </button>

//             <button
//               type="button"
//               className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
//             >
//               &gt;
//             </button>

//             <button
//               type="button"
//               className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
//             >
//               Last
//             </button>
//           </div>
//         </div>

//         {/* Card Body */}
//         <div className="p-5">
//           {/* Search */}
//           <div className="mb-4 flex justify-end">
//             <div className="flex w-full items-center gap-2 sm:w-auto">
//               <label
//                 htmlFor="product-category-search"
//                 className="whitespace-nowrap text-sm text-gray-700"
//               >
//                 Search:
//               </label>

//               <input
//                 id="product-category-search"
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) =>
//                   setSearchTerm(e.target.value)
//                 }
//                 className="h-[30px] w-full rounded-none border border-gray-300 px-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-[350px]"
//               />
//             </div>
//           </div>

//           {/* Responsive Table */}
//           <div className="w-full overflow-x-auto">
//             <table className="min-w-full border-collapse border border-gray-200 text-sm">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th
//                     onClick={() =>
//                       handleSort("partnerName")
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
//                   >
//                     Product Category{" "}
//                     {getSortIcon("partnerName")}
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort("centerName")
//                     }
//                     className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
//                   >
//                     Product Category Remark{" "}
//                     {getSortIcon("centerName")}
//                   </th>

//                   <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredCategories.length > 0 ? (
//                   filteredCategories.map(
//                     (category) => (
//                       <tr
//                         key={category._id}
//                         className="transition hover:bg-gray-50"
//                       >
//                         <td className="border border-gray-200 px-4 py-3 text-gray-700">
//                           {category.productCategory ||
//                             "-"}
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3 text-gray-700">
//                           {category.remark || "-"}
//                         </td>

//                         <td className="border border-gray-200 px-4 py-3">
//                           <div
//                             className="relative inline-block"
//                             ref={(el) => {
//                               dropdownRefs.current[
//                                 category._id
//                               ] = el;
//                             }}
//                           >
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 toggleDropdown(
//                                   category._id,
//                                 )
//                               }
//                               className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
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
//                               category._id
//                             ] && (
//                               <div className="absolute right-0 z-50 mt-1 w-36 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     handleEditCategory(
//                                       category,
//                                     );

//                                     setDropdownOpen(
//                                       (prev) => ({
//                                         ...prev,
//                                         [category._id]:
//                                           false,
//                                       }),
//                                     );
//                                   }}
//                                   className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
//                                 >
//                                   <Pencil
//                                     size={15}
//                                   />
//                                   Edit
//                                 </button>

//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     handleDeleteCategory(
//                                       category._id,
//                                     );

//                                     setDropdownOpen(
//                                       (prev) => ({
//                                         ...prev,
//                                         [category._id]:
//                                           false,
//                                       }),
//                                     );
//                                   }}
//                                   className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
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
//                       colSpan={3}
//                       className="border border-gray-200 px-4 py-8 text-center text-gray-500"
//                     >
//                       No product category found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Add / Edit Modal */}
//       <AddProductCategory
//         visible={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setEditingCategory(null);
//         }}
//         onCategoryAdded={handleCategoryAdded}
//         category={editingCategory}
//       />
//     </div>
//   );
// };

// export default ProductCategoryList;






// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   ArrowDown,
//   ArrowUp,
//   MoreVertical,
//   Pencil,
//   Plus,
//   Settings,
//   Trash2,
// } from "lucide-react";

// import axiosInstance from "../../../axiosInstance";
// import {
//   confirmDelete,
//   showSuccess,
// } from "../../../utils/sweetAlerts";

// import AddProductCategory from "./AddProductCategory";

// const ProductCategoryList = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [editingCategory, setEditingCategory] =
//     useState(null);

//   const dropdownRefs = useRef({});

//   // --------------------------------------------------
//   // Fetch Product Categories
//   // --------------------------------------------------
//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response =
//           await axiosInstance.get(
//             "/product-category",
//           );

//         if (response.data.success) {
//           setCategories(response.data.data);
//         } else {
//           const errorMessage =
//             response.data.message ||
//             "API returned unsuccessful response";

//           setError(errorMessage);

//           console.error(
//             "Backend error:",
//             response.data,
//           );
//         }
//       } catch (err) {
//         if (err.response) {
//           const errorMessage =
//             err.response.data?.message ||
//             err.response.data?.error ||
//             `Error ${err.response.status}: ${err.response.statusText}`;

//           setError(errorMessage);

//           console.error(
//             "Error response:",
//             err.response.data,
//           );
//         } else if (err.request) {
//           setError(
//             "No response received from server. Please check your network connection.",
//           );

//           console.error(
//             "Error request:",
//             err.request,
//           );
//         } else {
//           setError(
//             err.message ||
//               "An error occurred while fetching data",
//           );

//           console.error(
//             "Error message:",
//             err.message,
//           );
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategory();
//   }, []);

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

//     const sortedCategories = [...categories].sort(
//       (a, b) => {
//         let aValue = a;
//         let bValue = b;

//         if (key.includes(".")) {
//           const keys = key.split(".");

//           aValue = keys.reduce(
//             (obj, k) => obj && obj[k],
//             a,
//           );

//           bValue = keys.reduce(
//             (obj, k) => obj && obj[k],
//             b,
//           );
//         } else {
//           aValue = a[key];
//           bValue = b[key];
//         }

//         if (aValue < bValue) {
//           return direction === "ascending"
//             ? -1
//             : 1;
//         }

//         if (aValue > bValue) {
//           return direction === "ascending"
//             ? 1
//             : -1;
//         }

//         return 0;
//       },
//     );

//     setCategories(sortedCategories);
//   };

//   // --------------------------------------------------
//   // Sort Icon
//   // --------------------------------------------------
//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null;
//     }

//     return sortConfig.direction === "ascending" ? (
//       <ArrowUp
//         size={15}
//         className="ml-1 inline-block align-middle"
//       />
//     ) : (
//       <ArrowDown
//         size={15}
//         className="ml-1 inline-block align-middle"
//       />
//     );
//   };

//   // --------------------------------------------------
//   // Search
//   // --------------------------------------------------
//   const filteredCategories = categories.filter(
//     (category) =>
//       Object.values(category).some((value) => {
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
//       }),
//   );

//   // --------------------------------------------------
//   // Delete
//   // --------------------------------------------------
//   const handleDeleteCategory = async (
//     categoryId,
//   ) => {
//     const result = await confirmDelete();

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(
//           `/product-category/${categoryId}`,
//         );

//         setCategories((prev) =>
//           prev.filter(
//             (category) =>
//               category._id !== categoryId,
//           ),
//         );

//         showSuccess(
//           "Product Category deleted successfully!",
//         );
//       } catch (error) {
//         console.error(
//           "Error deleting product Category:",
//           error,
//         );
//       }
//     }
//   };

//   // --------------------------------------------------
//   // Add / Edit Callback
//   // --------------------------------------------------
//   const handleCategoryAdded = (
//     category,
//     isEdit,
//   ) => {
//     if (isEdit) {
//       setCategories((prev) =>
//         prev.map((item) =>
//           item._id === category._id
//             ? category
//             : item,
//         ),
//       );
//     } else {
//       setCategories((prev) => [
//         ...prev,
//         category,
//       ]);
//     }
//   };

//   // --------------------------------------------------
//   // Edit
//   // --------------------------------------------------
//   const handleEditCategory = (category) => {
//     setEditingCategory(category);
//     setShowModal(true);
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
//   // Close dropdown outside
//   // --------------------------------------------------
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const newDropdownState = {};
//       let shouldUpdate = false;

//       Object.keys(dropdownRefs.current).forEach(
//         (key) => {
//           const dropdown =
//             dropdownRefs.current[key];

//           if (
//             dropdown &&
//             !dropdown.contains(event.target)
//           ) {
//             newDropdownState[key] = false;
//             shouldUpdate = true;
//           }
//         },
//       );

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
//       <div className="flex h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2f5fa7]" />
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // Error
//   // --------------------------------------------------
//   if (error) {
//     return (
//       <div
//         className="m-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
//         role="alert"
//       >
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

//       {/* ================= PAGE TITLE ================= */}
//       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//         Product Category List
//       </div>

//       {/* ================= MAIN CARD ================= */}
//       <div className="overflow-hidden border-0 bg-white shadow-[0_1px_5px_rgba(0,0,0,0.12)]">

//         {/* ================= CARD HEADER ================= */}
//         <div
//           className="
//             flex
//             min-h-[70px]
//             flex-col
//             gap-3
//             border-t-[4px]
//             border-t-[#2f5fa7]
//             border-b
//             border-[#dedede]
//             bg-white
//             px-[18px]
//             py-[10px]
//             sm:flex-row
//             sm:items-center
//             sm:justify-between
//           "
//         >
//           {/* Add Button */}
//           <button
//             type="button"
//             onClick={() => {
//               setEditingCategory(null);
//               setShowModal(true);
//             }}
//             className="
//               inline-flex
//               h-[36px]
//               w-fit
//               items-center
//               gap-[5px]
//               rounded-[4px]
//               bg-[#2f5fa7]
//               px-[11px]
//               text-[15px]
//               font-medium
//               text-white
//               transition
//               hover:bg-[#244c88]
//             "
//           >
//             <Plus size={17} />
//             Add
//           </button>

//           {/* ================= PAGINATION ================= */}
//           <div className="flex items-center justify-end">

//             <button
//               type="button"
//               className="
//                 h-[35px]
//                 rounded-l-[4px]
//                 border
//                 border-[#d9d9d9]
//                 bg-white
//                 px-[10px]
//                 text-[14px]
//                 text-[#303f9f]
//                 hover:bg-[#f5f5f5]
//               "
//             >
//               First
//             </button>

//             <button
//               type="button"
//               className="
//                 h-[35px]
//                 border-y
//                 border-r
//                 border-[#d9d9d9]
//                 bg-white
//                 px-[11px]
//                 text-[14px]
//                 text-[#303f9f]
//                 hover:bg-[#f5f5f5]
//               "
//             >
//               &lt;
//             </button>

//             <button
//               type="button"
//               className="
//                 h-[35px]
//                 border-y
//                 border-r
//                 border-[#d9d9d9]
//                 bg-white
//                 px-[12px]
//                 text-[14px]
//                 text-[#303f9f]
//                 hover:bg-[#f5f5f5]
//               "
//             >
//               1
//             </button>

//             <button
//               type="button"
//               className="
//                 h-[35px]
//                 border-y
//                 border-r
//                 border-[#d9d9d9]
//                 bg-white
//                 px-[11px]
//                 text-[14px]
//                 text-[#303f9f]
//                 hover:bg-[#f5f5f5]
//               "
//             >
//               &gt;
//             </button>

//             <button
//               type="button"
//               className="
//                 h-[35px]
//                 rounded-r-[4px]
//                 border-y
//                 border-r
//                 border-[#d9d9d9]
//                 bg-white
//                 px-[10px]
//                 text-[14px]
//                 text-[#303f9f]
//                 hover:bg-[#f5f5f5]
//               "
//             >
//               Last
//             </button>
//           </div>
//         </div>

//         {/* ================= CARD BODY ================= */}
//         <div className="px-[18px] py-[17px]">

//           {/* ================= SEARCH ================= */}
//           <div className="mb-[18px] flex justify-end">
//             <div className="flex items-center gap-[7px]">
//               <label
//                 htmlFor="product-category-search"
//                 className="
//                   whitespace-nowrap
//                   text-[16px]
//                   font-semibold
//                   text-[#111]
//                 "
//               >
//                 Search:
//               </label>

//               <input
//                 id="product-category-search"
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) =>
//                   setSearchTerm(e.target.value)
//                 }
//                 className="
//                   h-[32px]
//                   w-[238px]
//                   rounded-[2px]
//                   border
//                   border-[#d9d9d9]
//                   bg-white
//                   px-[9px]
//                   text-[15px]
//                   text-[#333]
//                   outline-none
//                   focus:border-[#2f5fa7]
//                 "
//               />
//             </div>
//           </div>

//           {/* ================= TABLE ================= */}
//           <div
//             className="
//               w-full
//               overflow-hidden
//               border
//               border-[#eeeeee]
//             "
//           >
//             {/* Vertical scroll ONLY */}
//             <div
//               className="
//                 max-h-[500px]
//                 overflow-y-auto
//                 overflow-x-hidden
//                 scrollbar-thin
//               "
//             >
//               <table
//                 className="
//                   w-full
//                   table-fixed
//                   border-collapse
//                 "
//               >
//                 <colgroup>
//                   <col style={{ width: "40%" }} />
//                   <col style={{ width: "40%" }} />
//                   <col style={{ width: "20%" }} />
//                 </colgroup>

//                 {/* ================= TABLE HEADER ================= */}
//                 <thead className="sticky top-0 z-10 bg-white">
//                   <tr>
//                     <th
//                       onClick={() =>
//                         handleSort("partnerName")
//                       }
//                       className="
//                         cursor-pointer
//                         whitespace-nowrap
//                         border-b
//                         border-r
//                         border-[#e6e6e6]
//                         bg-white
//                         px-[9px]
//                         py-[11px]
//                         text-left
//                         text-[16px]
//                         font-semibold
//                         text-[#111]
//                         hover:bg-[#f7f7f7]
//                       "
//                     >
//                       Product Category
//                       {getSortIcon("partnerName")}
//                     </th>

//                     <th
//                       onClick={() =>
//                         handleSort("centerName")
//                       }
//                       className="
//                         cursor-pointer
//                         whitespace-nowrap
//                         border-b
//                         border-r
//                         border-[#e6e6e6]
//                         bg-white
//                         px-[9px]
//                         py-[11px]
//                         text-left
//                         text-[16px]
//                         font-semibold
//                         text-[#111]
//                         hover:bg-[#f7f7f7]
//                       "
//                     >
//                       Product Category Remark
//                       {getSortIcon("centerName")}
//                     </th>

//                     <th
//                       className="
//                         whitespace-nowrap
//                         border-b
//                         border-[#e6e6e6]
//                         bg-white
//                         px-[9px]
//                         py-[11px]
//                         text-left
//                         text-[16px]
//                         font-semibold
//                         text-[#111]
//                       "
//                     >
//                       Action
//                     </th>
//                   </tr>
//                 </thead>

//                 {/* ================= TABLE BODY ================= */}
//                 <tbody className="bg-white">
//                   {filteredCategories.length > 0 ? (
//                     filteredCategories.map(
//                       (category) => (
//                         <tr
//                           key={category._id}
//                           className="
//                             transition
//                             even:bg-[#f1f1f1]
//                             hover:bg-[#eaf2fb]
//                           "
//                         >
//                           <td
//                             className="
//                               border-b
//                               border-r
//                               border-[#e9e9e9]
//                               px-[9px]
//                               py-[10px]
//                               align-middle
//                               text-[16px]
//                               leading-6
//                               text-[#111]
//                             "
//                           >
//                             {category.productCategory ||
//                               "-"}
//                           </td>

//                           <td
//                             className="
//                               border-b
//                               border-r
//                               border-[#e9e9e9]
//                               px-[9px]
//                               py-[10px]
//                               align-middle
//                               text-[16px]
//                               leading-6
//                               text-[#111]
//                             "
//                           >
//                             {category.remark || "-"}
//                           </td>

//                           <td
//                             className="
//                               relative
//                               border-b
//                               border-[#e9e9e9]
//                               px-[9px]
//                               py-[10px]
//                               align-middle
//                             "
//                           >
//                             <div
//                               className="relative inline-block"
//                               ref={(el) => {
//                                 dropdownRefs.current[
//                                   category._id
//                                 ] = el;
//                               }}
//                             >
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   toggleDropdown(
//                                     category._id,
//                                   )
//                                 }
//                                 className="
//                                   inline-flex
//                                   h-[35px]
//                                   items-center
//                                   gap-[5px]
//                                   rounded-[5px]
//                                   border
//                                   border-[#c9c9c9]
//                                   bg-white
//                                   px-[10px]
//                                   text-[15px]
//                                   font-normal
//                                   text-[#333]
//                                   hover:bg-[#f7f7f7]
//                                 "
//                               >
//                                 <Settings size={15} />
//                                 Options
//                                 <MoreVertical size={14} />
//                               </button>

//                               {dropdownOpen[
//                                 category._id
//                               ] && (
//                                 <div
//                                   className="
//                                     absolute
//                                     right-0
//                                     z-50
//                                     mt-1
//                                     w-[145px]
//                                     overflow-hidden
//                                     rounded-[3px]
//                                     border
//                                     border-[#ddd]
//                                     bg-white
//                                     py-1
//                                     shadow-lg
//                                   "
//                                 >
//                                   <button
//                                     type="button"
//                                     onClick={() => {
//                                       handleEditCategory(
//                                         category,
//                                       );

//                                       setDropdownOpen(
//                                         (prev) => ({
//                                           ...prev,
//                                           [category._id]:
//                                             false,
//                                         }),
//                                       );
//                                     }}
//                                     className="
//                                       flex
//                                       w-full
//                                       items-center
//                                       gap-2
//                                       px-3
//                                       py-2
//                                       text-left
//                                       text-[14px]
//                                       text-gray-700
//                                       hover:bg-[#eef4fb]
//                                       hover:text-[#2f5fa7]
//                                     "
//                                   >
//                                     <Pencil size={15} />
//                                     Edit
//                                   </button>

//                                   <button
//                                     type="button"
//                                     onClick={() => {
//                                       handleDeleteCategory(
//                                         category._id,
//                                       );

//                                       setDropdownOpen(
//                                         (prev) => ({
//                                           ...prev,
//                                           [category._id]:
//                                             false,
//                                         }),
//                                       );
//                                     }}
//                                     className="
//                                       flex
//                                       w-full
//                                       items-center
//                                       gap-2
//                                       px-3
//                                       py-2
//                                       text-left
//                                       text-[14px]
//                                       text-red-600
//                                       hover:bg-red-50
//                                     "
//                                   >
//                                     <Trash2 size={15} />
//                                     Delete
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       ),
//                     )
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={3}
//                         className="
//                           px-4
//                           py-10
//                           text-center
//                           text-sm
//                           text-gray-500
//                         "
//                       >
//                         No product category found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ================= ADD / EDIT MODAL ================= */}
//       <AddProductCategory
//         visible={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setEditingCategory(null);
//         }}
//         onCategoryAdded={handleCategoryAdded}
//         category={editingCategory}
//       />
//     </div>
//   );
// };

// export default ProductCategoryList;





import React, {
  useEffect,
  useRef,
  useState,
} from "react";
 
import {
  ArrowDown,
  ArrowUp,
  MoreVertical,
  Pencil,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
 
import axiosInstance from "../../../axiosInstance";
import {
  confirmDelete,
  showSuccess,
} from "../../../utils/sweetAlerts";
 
import AddProductCategory from "./AddProductCategory";
 
const ProductCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
 
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState(null);
 
  const dropdownRefs = useRef({});
 
  // --------------------------------------------------
  // Fetch Product Categories
  // --------------------------------------------------
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
 
        const response =
          await axiosInstance.get(
            "/product-category",
          );
 
        if (response.data.success) {
          // API shape: { data: { categories: [...], pagination: {...} } }
          const payload = response.data.data;
          setCategories(
            Array.isArray(payload)
              ? payload
              : Array.isArray(payload?.categories)
                ? payload.categories
                : [],
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
 
    fetchCategory();
  }, []);
 
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
 
    const sortedCategories = [...categories].sort(
      (a, b) => {
        let aValue = a;
        let bValue = b;
 
        if (key.includes(".")) {
          const keys = key.split(".");
 
          aValue = keys.reduce(
            (obj, k) => obj && obj[k],
            a,
          );
 
          bValue = keys.reduce(
            (obj, k) => obj && obj[k],
            b,
          );
        } else {
          aValue = a[key];
          bValue = b[key];
        }
 
        if (aValue < bValue) {
          return direction === "ascending"
            ? -1
            : 1;
        }
 
        if (aValue > bValue) {
          return direction === "ascending"
            ? 1
            : -1;
        }
 
        return 0;
      },
    );
 
    setCategories(sortedCategories);
  };
 
  // --------------------------------------------------
  // Sort Icon
  // --------------------------------------------------
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
 
    return sortConfig.direction === "ascending" ? (
      <ArrowUp
        size={15}
        className="ml-1 inline-block align-middle"
      />
    ) : (
      <ArrowDown
        size={15}
        className="ml-1 inline-block align-middle"
      />
    );
  };
 
  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const filteredCategories = categories.filter(
    (category) =>
      Object.values(category).some((value) => {
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
      }),
  );
 
  // --------------------------------------------------
  // Delete
  // --------------------------------------------------
  const handleDeleteCategory = async (
    categoryId,
  ) => {
    const result = await confirmDelete();
 
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(
          `/product-category/${categoryId}`,
        );
 
        setCategories((prev) =>
          prev.filter(
            (category) =>
              category._id !== categoryId,
          ),
        );
 
        showSuccess(
          "Product Category deleted successfully!",
        );
      } catch (error) {
        console.error(
          "Error deleting product Category:",
          error,
        );
      }
    }
  };
 
  // --------------------------------------------------
  // Add / Edit Callback
  // --------------------------------------------------
  const handleCategoryAdded = (
    category,
    isEdit,
  ) => {
    if (isEdit) {
      setCategories((prev) =>
        prev.map((item) =>
          item._id === category._id
            ? category
            : item,
        ),
      );
    } else {
      setCategories((prev) => [
        ...prev,
        category,
      ]);
    }
  };
 
  // --------------------------------------------------
  // Edit
  // --------------------------------------------------
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowModal(true);
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
  // Close dropdown outside
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {};
      let shouldUpdate = false;
 
      Object.keys(dropdownRefs.current).forEach(
        (key) => {
          const dropdown =
            dropdownRefs.current[key];
 
          if (
            dropdown &&
            !dropdown.contains(event.target)
          ) {
            newDropdownState[key] = false;
            shouldUpdate = true;
          }
        },
      );
 
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
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2f5fa7]" />
      </div>
    );
  }
 
  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div
        className="m-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {error}
      </div>
    );
  }
 
  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
 
      {/* ================= PAGE TITLE ================= */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Product Category List
      </div>
 
      {/* ================= MAIN CARD ================= */}
      <div className="overflow-hidden border-0 bg-white shadow-[0_1px_5px_rgba(0,0,0,0.12)]">
 
        {/* ================= CARD HEADER ================= */}
        <div
          className="
            flex
            min-h-[70px]
            flex-col
            gap-3
            border-t-[4px]
            border-t-[#2f5fa7]
            border-b
            border-[#dedede]
            bg-white
            px-[18px]
            py-[10px]
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Add Button */}
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setShowModal(true);
            }}
            className="
              inline-flex
              h-[34px]
              w-fit
              items-center
              gap-[5px]
              rounded-[4px]
              bg-[#2f5fa7]
              px-[10px]
              text-[14px]
              font-bold
              text-white
              transition
              hover:bg-[#244c88]
            "
          >
            <Plus size={17} />
            Add
          </button>
 
          {/* ================= PAGINATION ================= */}
          <div className="flex items-center justify-end">
 
            <button
              type="button"
              className="
                h-[31px]
                rounded-l-[4px]
                border
                border-[#d9d9d9]
                bg-white
                px-[10px]
                text-[14px]
                text-[#303f9f]
                hover:bg-[#f5f5f5]
              "
            >
              First
            </button>
 
            <button
              type="button"
              className="
                h-[31px]
                border-y
                border-r
                border-[#d9d9d9]
                bg-white
                px-[11px]
                text-[14px]
                text-[#303f9f]
                hover:bg-[#f5f5f5]
              "
            >
              &lt;
            </button>
 
            <button
              type="button"
              className="
                h-[31px]
                border-y
                border-r
                border-[#d9d9d9]
                bg-white
                px-[12px]
                text-[14px]
                text-[#303f9f]
                hover:bg-[#f5f5f5]
              "
            >
              1
            </button>
 
            <button
              type="button"
              className="
                h-[31px]
                border-y
                border-r
                border-[#d9d9d9]
                bg-white
                px-[11px]
                text-[14px]
                text-[#303f9f]
                hover:bg-[#f5f5f5]
              "
            >
              &gt;
            </button>
 
            <button
              type="button"
              className="
                h-[31px]
                rounded-r-[4px]
                border-y
                border-r
                border-[#d9d9d9]
                bg-white
                px-[10px]
                text-[14px]
                text-[#303f9f]
                hover:bg-[#f5f5f5]
              "
            >
              Last
            </button>
          </div>
        </div>
 
        {/* ================= CARD BODY ================= */}
        <div className="px-[18px] py-[17px]">
 
          {/* ================= SEARCH ================= */}
          <div className="mb-[18px] flex justify-end">
            <div className="flex items-center gap-[7px]">
              <label
                htmlFor="product-category-search"
                className="
                  whitespace-nowrap
                  text-[16px]
                  font-semibold
                  text-[#111]
                "
              >
                Search:
              </label>
 
              <input
                id="product-category-search"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="
                  h-[32px]
                  w-[238px]
                  rounded-[2px]
                  border
                  border-[#d9d9d9]
                  bg-white
                  px-[9px]
                  text-[15px]
                  text-[#333]
                  outline-none
                  focus:border-[#2f5fa7]
                "
              />
            </div>
          </div>
 
          {/* ================= TABLE ================= */}
          <div
            className="
              w-full
              overflow-hidden
              border
              border-[#eeeeee]
            "
          >
            {/* Vertical scroll ONLY */}
            <div
              className="
                max-h-[500px]
                overflow-y-auto
                overflow-x-hidden
                scrollbar-thin
              "
            >
              <table
                className="
                  w-full
                  table-fixed
                  border-collapse
                "
              >
                <colgroup>
                  <col style={{ width: "46%" }} />
                  <col style={{ width: "37%" }} />
                  <col style={{ width: "17%" }} />
                </colgroup>
 
                {/* ================= TABLE HEADER ================= */}
                <thead className="sticky top-0 z-10 bg-white">
                  <tr>
                    <th
                      onClick={() =>
                        handleSort("productCategory")
                      }
                      className="
                        cursor-pointer
                        whitespace-nowrap
                        border-b
                        border-r
                        border-[#e6e6e6]
                        bg-white
                        px-[9px]
                        py-[11px]
                        text-left
                        text-[16px]
                        font-semibold
                        text-[#111]
                        hover:bg-[#f7f7f7]
                      "
                    >
                      Product Category
                      {getSortIcon("productCategory")}
                    </th>
 
                    <th
                      onClick={() =>
                        handleSort("remark")
                      }
                      className="
                        cursor-pointer
                        whitespace-nowrap
                        border-b
                        border-r
                        border-[#e6e6e6]
                        bg-white
                        px-[9px]
                        py-[11px]
                        text-left
                        text-[16px]
                        font-semibold
                        text-[#111]
                        hover:bg-[#f7f7f7]
                      "
                    >
                      Product Category Remark
                      {getSortIcon("remark")}
                    </th>
 
                    <th
                      className="
                        whitespace-nowrap
                        border-b
                        border-[#e6e6e6]
                        bg-white
                        px-[9px]
                        py-[11px]
                        text-left
                        text-[16px]
                        font-semibold
                        text-[#111]
                      "
                    >
                      Action
                    </th>
                  </tr>
                </thead>
 
                {/* ================= TABLE BODY ================= */}
                <tbody className="bg-white">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map(
                      (category) => (
                        <tr
                          key={category._id}
                          className="
                            transition
                            odd:bg-[#f1f1f1]
                            hover:bg-[#eaf2fb]
                          "
                        >
                          <td
                            className="
                              break-words
                              border-b
                              border-[#e9e9e9]
                              px-[9px]
                              py-[8px]
                              align-middle
                              text-[16px]
                              leading-6
                              text-[#111]
                            "
                          >
                            {category.productCategory ||
                              "-"}
                          </td>
 
                          <td
                            className="
                              break-words
                              border-b
                              border-[#e9e9e9]
                              px-[9px]
                              py-[8px]
                              align-middle
                              text-[16px]
                              leading-6
                              text-[#111]
                            "
                          >
                            {category.remark || "-"}
                          </td>
 
                          <td
                            className="
                              relative
                              border-b
                              border-[#e9e9e9]
                              px-[9px]
                              py-[8px]
                              align-middle
                            "
                          >
                            <div
                              className="relative inline-block"
                              ref={(el) => {
                                dropdownRefs.current[
                                  category._id
                                ] = el;
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  toggleDropdown(
                                    category._id,
                                  )
                                }
                                className="
                                  inline-flex
                                  h-[31px]
                                  items-center
                                  gap-[5px]
                                  rounded-[4px]
                                  border
                                  border-[#c9c9c9]
                                  bg-[#f8f9fa]
                                  px-[9px]
                                  text-[14px]
                                  font-normal
                                  text-[#333]
                                  hover:bg-[#e9ecef]
                                "
                              >
                                <Settings size={15} />
                                Options
                                <MoreVertical size={14} />
                              </button>
 
                              {dropdownOpen[
                                category._id
                              ] && (
                                <div
                                  className="
                                    absolute
                                    right-0
                                    z-50
                                    mt-1
                                    w-[145px]
                                    overflow-hidden
                                    rounded-[3px]
                                    border
                                    border-[#ddd]
                                    bg-white
                                    py-1
                                    shadow-lg
                                  "
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleEditCategory(
                                        category,
                                      );
 
                                      setDropdownOpen(
                                        (prev) => ({
                                          ...prev,
                                          [category._id]:
                                            false,
                                        }),
                                      );
                                    }}
                                    className="
                                      flex
                                      w-full
                                      items-center
                                      gap-2
                                      px-3
                                      py-2
                                      text-left
                                      text-[14px]
                                      text-gray-700
                                      hover:bg-[#eef4fb]
                                      hover:text-[#2f5fa7]
                                    "
                                  >
                                    <Pencil size={15} />
                                    Edit
                                  </button>
 
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleDeleteCategory(
                                        category._id,
                                      );
 
                                      setDropdownOpen(
                                        (prev) => ({
                                          ...prev,
                                          [category._id]:
                                            false,
                                        }),
                                      );
                                    }}
                                    className="
                                      flex
                                      w-full
                                      items-center
                                      gap-2
                                      px-3
                                      py-2
                                      text-left
                                      text-[14px]
                                      text-red-600
                                      hover:bg-red-50
                                    "
                                  >
                                    <Trash2 size={15} />
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
                        colSpan={3}
                        className="
                          px-4
                          py-10
                          text-center
                          text-sm
                          text-gray-500
                        "
                      >
                        No product category found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
 
      {/* ================= ADD / EDIT MODAL ================= */}
      <AddProductCategory
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCategory(null);
        }}
        onCategoryAdded={handleCategoryAdded}
        category={editingCategory}
      />
    </div>
  );
};
 
export default ProductCategoryList;