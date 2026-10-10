// // import React, { useEffect, useState } from "react";
// // import PropTypes from "prop-types";
// // import Select from "react-select";
// // import { RotateCcw, Search, X } from "lucide-react";
// // import axiosInstance from "../../axiosInstance";
// // const ResellerStockSearch = ({
// //   visible,
// //   onClose,
// //   onSearch,
// //   resellers,
// //   products,
// // }) => {
// //   const [searchData, setSearchData] = useState({
// //     product: "",
// //     reseller: "",
// //     center: "",
// //     startDate: "",
// //     endDate: "",
// //   });

// //   const [centers, setCenters] = useState([]);
// //   const [loadingCenters, setLoadingCenters] = useState(false);

// //   useEffect(() => {
// //     if (!visible) {
// //       setSearchData({
// //         product: "",
// //         reseller: "",
// //         center: "",
// //         startDate: "",
// //         endDate: "",
// //       });
// //       setCenters([]);
// //     }
// //   }, [visible]);

// //   useEffect(() => {
// //     const fetchCenters = async () => {
// //       if (searchData.reseller) {
// //         setLoadingCenters(true);

// //         try {
// //           const response = await axiosInstance.get(
// //             `/centers/reseller/${searchData.reseller}`
// //           );

// //           if (response.data.success) {
// //             setCenters(response.data.data);
// //           } else {
// //             setCenters([]);
// //           }
// //         } catch (error) {
// //           console.error("Error fetching centers:", error);
// //           setCenters([]);
// //         } finally {
// //           setLoadingCenters(false);
// //         }
// //       } else {
// //         setCenters([]);
// //         setSearchData((prev) => ({
// //           ...prev,
// //           center: "",
// //         }));
// //       }
// //     };

// //     fetchCenters();
// //   }, [searchData.reseller]);

// //   const handleSearch = () => {
// //     onSearch(searchData);
// //     onClose();
// //   };

// //   const handleReset = () => {
// //     const resetData = {
// //       product: "",
// //       reseller: "",
// //       center: "",
// //       startDate: "",
// //       endDate: "",
// //     };

// //     setSearchData(resetData);
// //     setCenters([]);
// //     onSearch(resetData);
// //     onClose();
// //   };

// //   if (!visible) return null;

// //   const resellerOptions = resellers.map((reseller) => ({
// //     value: reseller._id,
// //     label: reseller.businessName,
// //   }));

// //   const centerOptions = centers.map((center) => ({
// //     value: center._id,
// //     label: `${center.centerName} (${center.centerCode || "N/A"})`,
// //   }));

// //   const productOptions = products.map((product) => ({
// //     value: product._id,
// //     label: `${product.productTitle} (${product.productCode || "N/A"})`,
// //   }));

// //   const selectedReseller =
// //     resellerOptions.find(
// //       (option) => option.value === searchData.reseller
// //     ) || null;

// //   const selectedCenter =
// //     centerOptions.find((option) => option.value === searchData.center) || null;

// //   const selectedProduct =
// //     productOptions.find((option) => option.value === searchData.product) ||
// //     null;

// //   const selectStyles = {
// //     control: (base, state) => ({
// //       ...base,
// //       minHeight: "40px",
// //       borderRadius: "6px",
// //       borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
// //       boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
// //       "&:hover": {
// //         borderColor: "#9ca3af",
// //       },
// //     }),
// //     menu: (base) => ({
// //       ...base,
// //       zIndex: 9999,
// //     }),
// //   };

// //   return (
// //     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
// //       <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
// //         {/* Header */}
// //         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
// //           <h2 className="text-lg font-semibold text-gray-800">
// //             Search Reseller Stock
// //           </h2>

// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
// //             aria-label="Close"
// //           >
// //             <X size={20} />
// //           </button>
// //         </div>

// //         {/* Body */}
// //         <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
// //           {/* Reseller + Center */}
// //           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
// //             {/* Reseller */}
// //             <div>
// //               <label
// //                 htmlFor="reseller"
// //                 className="mb-1.5 block text-sm font-medium text-gray-700"
// //               >
// //                 Reseller <span className="text-red-500">*</span>
// //               </label>

// //               <Select
// //                 inputId="reseller"
// //                 name="reseller"
// //                 placeholder="Select Reseller..."
// //                 value={selectedReseller}
// //                 onChange={(selected) =>
// //                   setSearchData((prev) => ({
// //                     ...prev,
// //                     reseller: selected ? selected.value : "",
// //                     center: "",
// //                   }))
// //                 }
// //                 options={resellerOptions}
// //                 isClearable
// //                 classNamePrefix="react-select"
// //                 styles={selectStyles}
// //               />
// //             </div>

// //             {/* Center */}
// //             <div>
// //               <label
// //                 htmlFor="center"
// //                 className="mb-1.5 block text-sm font-medium text-gray-700"
// //               >
// //                 Center
// //               </label>

// //               <Select
// //                 inputId="center"
// //                 name="center"
// //                 placeholder={
// //                   loadingCenters
// //                     ? "Loading centers..."
// //                     : searchData.reseller
// //                       ? "Select Center..."
// //                       : "Select a reseller first"
// //                 }
// //                 value={selectedCenter}
// //                 onChange={(selected) =>
// //                   setSearchData((prev) => ({
// //                     ...prev,
// //                     center: selected ? selected.value : "",
// //                   }))
// //                 }
// //                 options={centerOptions}
// //                 isClearable
// //                 isDisabled={!searchData.reseller || loadingCenters}
// //                 isLoading={loadingCenters}
// //                 classNamePrefix="react-select"
// //                 styles={selectStyles}
// //               />

// //               {searchData.reseller &&
// //                 !loadingCenters &&
// //                 centers.length === 0 && (
// //                   <p className="mt-1.5 text-xs text-gray-500">
// //                     No centers found for this reseller
// //                   </p>
// //                 )}
// //             </div>
// //           </div>

// //           {/* Product */}
// //           <div className="mt-5">
// //             <label
// //               htmlFor="product"
// //               className="mb-1.5 block text-sm font-medium text-gray-700"
// //             >
// //               Product
// //             </label>

// //             <Select
// //               inputId="product"
// //               name="product"
// //               placeholder="Search Product..."
// //               value={selectedProduct}
// //               onChange={(selected) =>
// //                 setSearchData((prev) => ({
// //                   ...prev,
// //                   product: selected ? selected.value : "",
// //                 }))
// //               }
// //               options={productOptions}
// //               isClearable
// //               classNamePrefix="react-select"
// //               styles={selectStyles}
// //             />
// //           </div>

// //           {/* Date Range */}
// //           <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
// //             {/* Start Date */}
// //             <div>
// //               <label
// //                 htmlFor="startDate"
// //                 className="mb-1.5 block text-sm font-medium text-gray-700"
// //               >
// //                 Start Date
// //               </label>

// //               <input
// //                 type="date"
// //                 id="startDate"
// //                 value={searchData.startDate}
// //                 onChange={(e) =>
// //                   setSearchData((prev) => ({
// //                     ...prev,
// //                     startDate: e.target.value,
// //                   }))
// //                 }
// //                 className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
// //               />

// //               <p className="mt-1 text-xs text-gray-500">Optional</p>
// //             </div>

// //             {/* End Date */}
// //             <div>
// //               <label
// //                 htmlFor="endDate"
// //                 className="mb-1.5 block text-sm font-medium text-gray-700"
// //               >
// //                 End Date
// //               </label>

// //               <input
// //                 type="date"
// //                 id="endDate"
// //                 value={searchData.endDate}
// //                 onChange={(e) =>
// //                   setSearchData((prev) => ({
// //                     ...prev,
// //                     endDate: e.target.value,
// //                   }))
// //                 }
// //                 className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
// //               />

// //               <p className="mt-1 text-xs text-gray-500">Optional</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Footer */}
// //         <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
// //           <button
// //             type="button"
// //             onClick={handleReset}
// //             className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
// //           >
// //             <RotateCcw size={16} />
// //             Reset
// //           </button>

// //           <button
// //             type="button"
// //             onClick={handleSearch}
// //             className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
// //           >
// //             <Search size={16} />
// //             Search
// //           </button>

// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
// //           >
// //             <X size={16} />
// //             Close
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // ResellerStockSearch.propTypes = {
// //   visible: PropTypes.bool.isRequired,
// //   onClose: PropTypes.func.isRequired,
// //   onSearch: PropTypes.func.isRequired,
// //   resellers: PropTypes.array.isRequired,
// //   products: PropTypes.array.isRequired,
// // };

// // export default ResellerStockSearch;



// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import Select from "react-select";
// import { Search, X } from "lucide-react";
// import axiosInstance from "../../axiosInstance";

// const ResellerStockSearch = ({
//   visible,
//   onClose,
//   onSearch,
//   resellers,
//   products,
// }) => {
//   const [searchData, setSearchData] = useState({
//     product: "",
//     reseller: "",
//     center: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [centers, setCenters] = useState([]);
//   const [loadingCenters, setLoadingCenters] = useState(false);

//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         product: "",
//         reseller: "",
//         center: "",
//         startDate: "",
//         endDate: "",
//       });
//       setCenters([]);
//     }
//   }, [visible]);

//   useEffect(() => {
//     const fetchCenters = async () => {
//       if (searchData.reseller) {
//         setLoadingCenters(true);

//         try {
//           const response = await axiosInstance.get(
//             `/centers/reseller/${searchData.reseller}`
//           );

//           if (response.data.success) {
//             setCenters(response.data.data);
//           } else {
//             setCenters([]);
//           }
//         } catch (error) {
//           console.error("Error fetching centers:", error);
//           setCenters([]);
//         } finally {
//           setLoadingCenters(false);
//         }
//       } else {
//         setCenters([]);
//         setSearchData((prev) => ({
//           ...prev,
//           center: "",
//         }));
//       }
//     };

//     fetchCenters();
//   }, [searchData.reseller]);

//   const handleSearch = () => {
//     onSearch(searchData);
//     onClose();
//   };

//   const handleReset = () => {
//     const resetData = {
//       product: "",
//       reseller: "",
//       center: "",
//       startDate: "",
//       endDate: "",
//     };

//     setSearchData(resetData);
//     setCenters([]);
//     onSearch(resetData);
//     onClose();
//   };

//   if (!visible) return null;

//   const resellerOptions = resellers.map((reseller) => ({
//     value: reseller._id,
//     label: reseller.businessName,
//   }));

//   const centerOptions = centers.map((center) => ({
//     value: center._id,
//     label: `${center.centerName} (${center.centerCode || "N/A"})`,
//   }));

//   const productOptions = products.map((product) => ({
//     value: product._id,
//     label: `${product.productTitle} (${product.productCode || "N/A"})`,
//   }));

//   const selectedReseller =
//     resellerOptions.find(
//       (option) => option.value === searchData.reseller
//     ) || null;

//   const selectedCenter =
//     centerOptions.find(
//       (option) => option.value === searchData.center
//     ) || null;

//   const selectedProduct =
//     productOptions.find(
//       (option) => option.value === searchData.product
//     ) || null;

//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: "40px",
//       borderRadius: "6px",
//       borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
//       boxShadow: state.isFocused
//         ? "0 0 0 1px #2563eb"
//         : "none",
//       "&:hover": {
//         borderColor: "#9ca3af",
//       },
//     }),

//     /*
//      * Keeps dropdown above the modal.
//      */
//     menuPortal: (base) => ({
//       ...base,
//       zIndex: 99999,
//     }),

//     menu: (base) => ({
//       ...base,
//       zIndex: 99999,
//     }),

//     /*
//      * Dropdown gets its OWN scrollbar.
//      * Form/modal scrollbar is not affected.
//      */
//     menuList: (base) => ({
//       ...base,
//       maxHeight: "300px",
//       overflowY: "auto",
//       overflowX: "hidden",
//     }),
//   };

//   return (
//     <>
//       {/* Top-to-bottom animation */}
//       <style>
//         {`
//           @keyframes resellerStockSearchSlideDown {
//             from {
//               opacity: 0;
//               transform: translateY(-80px);
//             }

//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           .reseller-stock-search-modal {
//             animation: resellerStockSearchSlideDown 0.35s ease-out;
//           }

//           /* Dropdown scrollbar */
//           .react-select__menu-list::-webkit-scrollbar {
//             width: 7px;
//           }

//           .react-select__menu-list::-webkit-scrollbar-track {
//             background: #f1f1f1;
//             border-radius: 4px;
//           }

//           .react-select__menu-list::-webkit-scrollbar-thumb {
//             background: #9ca3af;
//             border-radius: 4px;
//           }

//           .react-select__menu-list::-webkit-scrollbar-thumb:hover {
//             background: #6b7280;
//           }
//         `}
//       </style>

//       {/* Overlay */}
//       <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/50 px-4 py-6 sm:py-8">

//         {/* Modal */}
//         <div
//           className="
//             reseller-stock-search-modal
//             mx-auto
//             w-full
//             max-w-3xl
//             overflow-hidden
//             rounded-lg
//             bg-white
//             shadow-xl
//           "
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//             <h2 className="text-lg font-bold text-gray-800">
//               Search Reseller Stock
//             </h2>

//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//               aria-label="Close"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {/* Body */}
//           <div className="max-h-[75vh] overflow-y-auto px-6 py-5">

//             {/* Reseller + Center */}
//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

//               {/* Reseller */}
//               <div>
//                 <label
//                   htmlFor="reseller"
//                   className="mb-1.5 block text-sm font-bold text-gray-700"
//                 >
//                   Reseller <span className="text-red-500">*</span>
//                 </label>

//                 <Select
//                   inputId="reseller"
//                   name="reseller"
//                   placeholder="Select Reseller..."
//                   value={selectedReseller}
//                   onChange={(selected) =>
//                     setSearchData((prev) => ({
//                       ...prev,
//                       reseller: selected
//                         ? selected.value
//                         : "",
//                       center: "",
//                     }))
//                   }
//                   options={resellerOptions}
//                   isClearable
//                   classNamePrefix="react-select"
//                   styles={selectStyles}
//                   menuPortalTarget={document.body}
//                 />
//               </div>

//               {/* Center */}
//               <div>
//                 <label
//                   htmlFor="center"
//                   className="mb-1.5 block text-sm font-bold text-gray-700"
//                 >
//                   Center
//                 </label>

//                 <Select
//                   inputId="center"
//                   name="center"
//                   placeholder={
//                     loadingCenters
//                       ? "Loading centers..."
//                       : searchData.reseller
//                         ? "Select Center..."
//                         : "Select a reseller first"
//                   }
//                   value={selectedCenter}
//                   onChange={(selected) =>
//                     setSearchData((prev) => ({
//                       ...prev,
//                       center: selected
//                         ? selected.value
//                         : "",
//                     }))
//                   }
//                   options={centerOptions}
//                   isClearable
//                   isDisabled={
//                     !searchData.reseller ||
//                     loadingCenters
//                   }
//                   isLoading={loadingCenters}
//                   classNamePrefix="react-select"
//                   styles={selectStyles}
//                   menuPortalTarget={document.body}
//                 />

//                 {searchData.reseller &&
//                   !loadingCenters &&
//                   centers.length === 0 && (
//                     <p className="mt-1.5 text-xs text-gray-500">
//                       No centers found for this reseller
//                     </p>
//                   )}
//               </div>
//             </div>

//             {/* Product */}
//             <div className="mt-5">
//               <label
//                 htmlFor="product"
//                 className="mb-1.5 block text-sm font-bold text-gray-700"
//               >
//                 Product
//               </label>

//               <Select
//                 inputId="product"
//                 name="product"
//                 placeholder="Search Product..."
//                 value={selectedProduct}
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     product: selected
//                       ? selected.value
//                       : "",
//                   }))
//                 }
//                 options={productOptions}
//                 isClearable
//                 classNamePrefix="react-select"
//                 styles={selectStyles}
//                 menuPortalTarget={document.body}
//               />
//             </div>

//             {/* Date Range */}
//             <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

//               {/* Start Date */}
//               <div>
//                 <label
//                   htmlFor="startDate"
//                   className="mb-1.5 block text-sm font-bold text-gray-700"
//                 >
//                   Start Date
//                 </label>

//                 <input
//                   type="date"
//                   id="startDate"
//                   value={searchData.startDate}
//                   onChange={(e) =>
//                     setSearchData((prev) => ({
//                       ...prev,
//                       startDate: e.target.value,
//                     }))
//                   }
//                   className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Optional
//                 </p>
//               </div>

//               {/* End Date */}
//               <div>
//                 <label
//                   htmlFor="endDate"
//                   className="mb-1.5 block text-sm font-bold text-gray-700"
//                 >
//                   End Date
//                 </label>

//                 <input
//                   type="date"
//                   id="endDate"
//                   value={searchData.endDate}
//                   onChange={(e) =>
//                     setSearchData((prev) => ({
//                       ...prev,
//                       endDate: e.target.value,
//                     }))
//                   }
//                   className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Optional
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">

//             {/* Reset */}
//             <button
//               type="button"
//               onClick={handleReset}
//               className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
//             >
//               Reset
//             </button>

//             {/* Search */}
//             <button
//               type="button"
//               onClick={handleSearch}
//               className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//             >
//               <Search size={16} />
//               Search
//             </button>

//             {/* Close */}
//             <button
//               type="button"
//               onClick={onClose}
//               className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
//             >
//               Close
//             </button>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// ResellerStockSearch.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   resellers: PropTypes.array.isRequired,
//   products: PropTypes.array.isRequired,
// };

// export default ResellerStockSearch;





import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Search, X } from "lucide-react";
import axiosInstance from "../../axiosInstance";

const ResellerStockSearch = ({
  visible,
  onClose,
  onSearch,
  resellers,
  products,
}) => {
  const [searchData, setSearchData] = useState({
    product: "",
    reseller: "",
    center: "",
    startDate: "",
    endDate: "",
  });

  const [centers, setCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSearchData({
        product: "",
        reseller: "",
        center: "",
        startDate: "",
        endDate: "",
      });

      setCenters([]);
    }
  }, [visible]);

  // --------------------------------------------------
  // Fetch Centers when Reseller changes
  // --------------------------------------------------
  useEffect(() => {
    const fetchCenters = async () => {
      if (searchData.reseller) {
        setLoadingCenters(true);

        try {
          const response = await axiosInstance.get(
            `/centers/reseller/${searchData.reseller}`
          );

          if (response.data.success) {
            setCenters(response.data.data || []);
          } else {
            setCenters([]);
          }
        } catch (error) {
          console.error("Error fetching centers:", error);
          setCenters([]);
        } finally {
          setLoadingCenters(false);
        }
      } else {
        setCenters([]);

        setSearchData((prev) => ({
          ...prev,
          center: "",
        }));
      }
    };

    fetchCenters();
  }, [searchData.reseller]);

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const handleSearch = () => {
    // HTML date input already gives:
    // YYYY-MM-DD
    //
    // Example:
    // 01 September 2026 -> 2026-09-01
    // 30 September 2026 -> 2026-09-30

    const cleanedData = {
      product: searchData.product || "",
      reseller: searchData.reseller || "",
      center: searchData.center || "",
      startDate: searchData.startDate || "",
      endDate: searchData.endDate || "",
    };

    // Validate date range
    if (
      cleanedData.startDate &&
      cleanedData.endDate &&
      cleanedData.startDate > cleanedData.endDate
    ) {
      alert("Start date cannot be greater than end date");
      return;
    }

    console.log("Search filters:", cleanedData);

    onSearch(cleanedData);
    onClose();
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  const handleReset = () => {
    const resetData = {
      product: "",
      reseller: "",
      center: "",
      startDate: "",
      endDate: "",
    };

    setSearchData(resetData);
    setCenters([]);

    onSearch(resetData);
    onClose();
  };

  if (!visible) return null;

  // --------------------------------------------------
  // Reseller Options
  // --------------------------------------------------
  const resellerOptions = resellers.map((reseller) => ({
    value: reseller._id,
    label: reseller.businessName,
  }));

  // --------------------------------------------------
  // Center Options
  // --------------------------------------------------
  const centerOptions = centers.map((center) => ({
    value: center._id,
    label: `${center.centerName} (${center.centerCode || "N/A"})`,
  }));

  // --------------------------------------------------
  // Product Options
  // --------------------------------------------------
  const productOptions = products.map((product) => ({
    value: product._id,
    label: `${product.productTitle} (${product.productCode || "N/A"})`,
  }));

  const selectedReseller =
    resellerOptions.find(
      (option) => option.value === searchData.reseller
    ) || null;

  const selectedCenter =
    centerOptions.find(
      (option) => option.value === searchData.center
    ) || null;

  const selectedProduct =
    productOptions.find(
      (option) => option.value === searchData.product
    ) || null;

  // --------------------------------------------------
  // React Select Styles
  // --------------------------------------------------
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "6px",
      borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
      boxShadow: state.isFocused
        ? "0 0 0 1px #2563eb"
        : "none",

      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 99999,
    }),

    menu: (base) => ({
      ...base,
      zIndex: 99999,
    }),

    // Only dropdown has scrollbar
    menuList: (base) => ({
      ...base,
      maxHeight: "300px",
      overflowY: "auto",
      overflowX: "hidden",
    }),
  };

  return (
    <>
      {/* --------------------------------------------------
          Animation + Dropdown Scrollbar
          -------------------------------------------------- */}
      <style>
        {`
          @keyframes resellerStockSearchSlideDown {
            from {
              opacity: 0;
              transform: translateY(-80px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .reseller-stock-search-modal {
            animation: resellerStockSearchSlideDown 0.35s ease-out;
          }

          .react-select__menu-list::-webkit-scrollbar {
            width: 7px;
          }

          .react-select__menu-list::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }

          .react-select__menu-list::-webkit-scrollbar-thumb {
            background: #9ca3af;
            border-radius: 4px;
          }

          .react-select__menu-list::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
        `}
      </style>

      {/* --------------------------------------------------
          Overlay
          -------------------------------------------------- */}
      <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/50 px-4 py-6 sm:py-8">

        {/* --------------------------------------------------
            Modal
            -------------------------------------------------- */}
        <div
          className="
            reseller-stock-search-modal
            mx-auto
            w-full
            max-w-3xl
            overflow-hidden
            rounded-lg
            bg-white
            shadow-xl
          "
        >

          {/* --------------------------------------------------
              Header
              -------------------------------------------------- */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

            <h2 className="text-lg font-bold text-gray-800">
              Search Reseller Stock
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={20} />
            </button>

          </div>

          {/* --------------------------------------------------
              Body
              -------------------------------------------------- */}
          <div className="max-h-[75vh] overflow-y-auto px-6 py-5">

            {/* Reseller + Center */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Reseller */}
              <div>
                <label
                  htmlFor="reseller"
                  className="mb-1.5 block text-sm font-bold text-gray-700"
                >
                  Reseller{" "}
                  <span className="text-red-500">*</span>
                </label>

                <Select
                  inputId="reseller"
                  name="reseller"
                  placeholder="Select Reseller..."
                  value={selectedReseller}
                  onChange={(selected) =>
                    setSearchData((prev) => ({
                      ...prev,
                      reseller: selected
                        ? selected.value
                        : "",
                      center: "",
                    }))
                  }
                  options={resellerOptions}
                  isClearable
                  classNamePrefix="react-select"
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
              </div>

              {/* Center */}
              <div>
                <label
                  htmlFor="center"
                  className="mb-1.5 block text-sm font-bold text-gray-700"
                >
                  Center
                </label>

                <Select
                  inputId="center"
                  name="center"
                  placeholder={
                    loadingCenters
                      ? "Loading centers..."
                      : searchData.reseller
                      ? "Select Center..."
                      : "Select a reseller first"
                  }
                  value={selectedCenter}
                  onChange={(selected) =>
                    setSearchData((prev) => ({
                      ...prev,
                      center: selected
                        ? selected.value
                        : "",
                    }))
                  }
                  options={centerOptions}
                  isClearable
                  isDisabled={
                    !searchData.reseller ||
                    loadingCenters
                  }
                  isLoading={loadingCenters}
                  classNamePrefix="react-select"
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />

                {searchData.reseller &&
                  !loadingCenters &&
                  centers.length === 0 && (
                    <p className="mt-1.5 text-xs text-gray-500">
                      No centers found for this reseller
                    </p>
                  )}
              </div>

            </div>

            {/* Product */}
            <div className="mt-5">

              <label
                htmlFor="product"
                className="mb-1.5 block text-sm font-bold text-gray-700"
              >
                Product
              </label>

              <Select
                inputId="product"
                name="product"
                placeholder="Search Product..."
                value={selectedProduct}
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    product: selected
                      ? selected.value
                      : "",
                  }))
                }
                options={productOptions}
                isClearable
                classNamePrefix="react-select"
                styles={selectStyles}
                menuPortalTarget={document.body}
              />

            </div>

            {/* Date Range */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Start Date */}
              <div>

                <label
                  htmlFor="startDate"
                  className="mb-1.5 block text-sm font-bold text-gray-700"
                >
                  Start Date
                </label>

                <input
                  type="date"
                  id="startDate"
                  value={searchData.startDate}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,

                      // Keep YYYY-MM-DD exactly
                      // as returned by HTML date input
                      startDate: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Optional
                </p>

              </div>

              {/* End Date */}
              <div>

                <label
                  htmlFor="endDate"
                  className="mb-1.5 block text-sm font-bold text-gray-700"
                >
                  End Date
                </label>

                <input
                  type="date"
                  id="endDate"
                  value={searchData.endDate}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,

                      // Keep YYYY-MM-DD exactly
                      // as returned by HTML date input
                      endDate: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Optional
                </p>

              </div>

            </div>

          </div>

          {/* --------------------------------------------------
              Footer
              -------------------------------------------------- */}
          <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
            >
              Reset
            </button>

            {/* Search */}
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Search size={16} />
              Search
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
            >
              Close
            </button>

          </div>

        </div>
      </div>
    </>
  );
};

ResellerStockSearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  resellers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
};

export default ResellerStockSearch;