// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import Select from "react-select";
// import { RotateCcw, Search, X } from "lucide-react";
// import axiosInstance from "../../axiosInstance";
// const SearchIndentSummary = ({
//   visible,
//   onClose,
//   onSearch,
//   centers,
//   products,
// }) => {
//   const [searchData, setSearchData] = useState({
//     product: "",
//     center: "",
//     usageType: "",
//     reseller: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [resellers, setResellers] = useState([]);
//   const [loadingResellers, setLoadingResellers] = useState(false);

//   const [resellerCenters, setResellerCenters] = useState([]);
//   const [loadingCenters, setLoadingCenters] = useState(false);

//   // Fetch all resellers
//   useEffect(() => {
//     const fetchResellers = async () => {
//       setLoadingResellers(true);

//       try {
//         const response = await axiosInstance.get("/resellers");

//         if (response.data.success) {
//           setResellers(response.data.data || []);
//         } else {
//           setResellers([]);
//         }
//       } catch (error) {
//         console.error("Error fetching resellers:", error);
//         setResellers([]);
//       } finally {
//         setLoadingResellers(false);
//       }
//     };

//     fetchResellers();
//   }, []);

//   // Fetch centers based on selected reseller
//   useEffect(() => {
//     const fetchCentersByReseller = async () => {
//       if (searchData.reseller) {
//         setLoadingCenters(true);

//         try {
//           const response = await axiosInstance.get(
//             `/centers/reseller/${searchData.reseller}`
//           );

//           if (response.data.success) {
//             setResellerCenters(response.data.data);
//           } else {
//             setResellerCenters([]);
//           }
//         } catch (error) {
//           console.error(
//             "Error fetching centers for reseller:",
//             error
//           );
//           setResellerCenters([]);
//         } finally {
//           setLoadingCenters(false);
//         }
//       } else {
//         setResellerCenters([]);

//         // Clear center when reseller is cleared
//         setSearchData((prev) => ({
//           ...prev,
//           center: "",
//         }));
//       }
//     };

//     fetchCentersByReseller();
//   }, [searchData.reseller]);

//   // Reset when modal closes
//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         product: "",
//         center: "",
//         usageType: "",
//         reseller: "",
//         startDate: "",
//         endDate: "",
//       });

//       setResellerCenters([]);
//     }
//   }, [visible]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setSearchData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const formatDateToDDMMYYYY = (dateString) => {
//     if (!dateString) return "";

//     if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
//       const [year, month, day] = dateString.split("-");

//       return `${day}-${month}-${year}`;
//     }

//     return dateString;
//   };

//   const handleSearch = () => {
//     const apiSearchData = {
//       product: searchData.product,
//       center: searchData.center,
//       usageType: searchData.usageType,
//       reseller: searchData.reseller,
//       startDate: formatDateToDDMMYYYY(searchData.startDate),
//       endDate: formatDateToDDMMYYYY(searchData.endDate),
//     };

//     onSearch(apiSearchData);
//     onClose();
//   };

//   const handleReset = () => {
//     const resetData = {
//       product: "",
//       center: "",
//       usageType: "",
//       reseller: "",
//       startDate: "",
//       endDate: "",
//     };

//     setSearchData(resetData);
//     setResellerCenters([]);

//     onSearch(resetData);
//     onClose();
//   };

//   if (!visible) return null;

//   const resellerOptions = resellers.map((reseller) => ({
//     value: reseller._id,
//     label: reseller.businessName,
//   }));

//   const centerOptions = resellerCenters.map((center) => ({
//     value: center._id,
//     label: center.centerName,
//   }));

//   const productOptions = products.map((product) => ({
//     value: product._id,
//     label: product.productTitle,
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

//     menu: (base) => ({
//       ...base,
//       zIndex: 9999,
//     }),
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
//       <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Search
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close"
//             className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
//           {/* Reseller + Branch */}
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Reseller */}
//             <div>
//               <label
//                 htmlFor="reseller"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Reseller
//               </label>

//               <Select
//                 inputId="reseller"
//                 name="reseller"
//                 placeholder={
//                   loadingResellers
//                     ? "Loading resellers..."
//                     : "Select Reseller..."
//                 }
//                 value={selectedReseller}
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     reseller: selected
//                       ? selected.value
//                       : "",
//                     center: "",
//                   }))
//                 }
//                 options={resellerOptions}
//                 isClearable
//                 isLoading={loadingResellers}
//                 classNamePrefix="react-select"
//                 styles={selectStyles}
//               />
//             </div>

//             {/* Branch */}
//             <div>
//               <label
//                 htmlFor="center"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Branch
//               </label>

//               <Select
//                 inputId="center"
//                 name="center"
//                 placeholder={
//                   loadingCenters
//                     ? "Loading branches..."
//                     : searchData.reseller
//                       ? "Select Branch..."
//                       : "Select a reseller first"
//                 }
//                 value={selectedCenter}
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     center: selected
//                       ? selected.value
//                       : "",
//                   }))
//                 }
//                 options={centerOptions}
//                 isClearable
//                 isDisabled={
//                   !searchData.reseller ||
//                   loadingCenters
//                 }
//                 isLoading={loadingCenters}
//                 classNamePrefix="react-select"
//                 styles={selectStyles}
//               />

//               {searchData.reseller &&
//                 !loadingCenters &&
//                 resellerCenters.length === 0 && (
//                   <p className="mt-1.5 text-xs text-gray-500">
//                     No branches found for this reseller
//                   </p>
//                 )}
//             </div>
//           </div>

//           {/* Usage Type + Product */}
//           <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Usage Type */}
//             <div>
//               <label
//                 htmlFor="usageType"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Usage Type
//               </label>

//               <select
//                 id="usageType"
//                 name="usageType"
//                 value={searchData.usageType}
//                 onChange={handleChange}
//                 className="block h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">-SELECT-</option>
//                 <option value="Customer">Customer</option>
//                 <option value="Building">Building</option>
//                 <option value="Building to Building">
//                   Building to Building
//                 </option>
//                 <option value="Control Room">
//                   Control Room
//                 </option>
//                 <option value="Damage">Damage</option>
//                 <option value="Stolen from Center">
//                   Stolen from Center
//                 </option>
//                 <option value="Stolen from Field">
//                   Stolen from Field
//                 </option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {/* Product */}
//             <div>
//               <label
//                 htmlFor="product"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
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
//               />
//             </div>
//           </div>

//           {/* Date Range */}
//           <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Start Date */}
//             <div>
//               <label
//                 htmlFor="startDate"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Start Date
//               </label>

//               <input
//                 type="date"
//                 id="startDate"
//                 name="startDate"
//                 value={searchData.startDate}
//                 onChange={handleChange}
//                 className="block h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />

//               <p className="mt-1 text-xs text-gray-500">
//                 Optional (Format: DD-MM-YYYY)
//               </p>
//             </div>

//             {/* End Date */}
//             <div>
//               <label
//                 htmlFor="endDate"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 End Date
//               </label>

//               <input
//                 type="date"
//                 id="endDate"
//                 name="endDate"
//                 value={searchData.endDate}
//                 onChange={handleChange}
//                 className="block h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />

//               <p className="mt-1 text-xs text-gray-500">
//                 Optional (Format: DD-MM-YYYY)
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//           >
//             <RotateCcw size={16} />
//             Reset
//           </button>

//           <button
//             type="button"
//             onClick={handleSearch}
//             className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//           >
//             <Search size={16} />
//             Search
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// SearchIndentSummary.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
//   products: PropTypes.array.isRequired,
// };

// export default SearchIndentSummary;






// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import Select from "react-select";
// import { X } from "lucide-react";
// import axiosInstance from "../../axiosInstance";

// const SearchIndentSummary = ({
//   visible,
//   onClose,
//   onSearch,
//   centers,
//   products,
// }) => {
//   const [searchData, setSearchData] = useState({
//     product: "",
//     center: "",
//     usageType: "",
//     reseller: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [resellers, setResellers] = useState([]);
//   const [loadingResellers, setLoadingResellers] = useState(false);

//   const [resellerCenters, setResellerCenters] = useState([]);
//   const [loadingCenters, setLoadingCenters] = useState(false);

//   // Fetch all resellers
//   useEffect(() => {
//     const fetchResellers = async () => {
//       setLoadingResellers(true);

//       try {
//         const response = await axiosInstance.get("/resellers");

//         if (response.data.success) {
//           setResellers(response.data.data || []);
//         } else {
//           setResellers([]);
//         }
//       } catch (error) {
//         console.error("Error fetching resellers:", error);
//         setResellers([]);
//       } finally {
//         setLoadingResellers(false);
//       }
//     };

//     fetchResellers();
//   }, []);

//   // Fetch branches based on selected reseller
//   useEffect(() => {
//     const fetchCentersByReseller = async () => {
//       if (searchData.reseller) {
//         setLoadingCenters(true);

//         try {
//           const response = await axiosInstance.get(
//             `/centers/reseller/${searchData.reseller}`
//           );

//           if (response.data.success) {
//             setResellerCenters(response.data.data || []);
//           } else {
//             setResellerCenters([]);
//           }
//         } catch (error) {
//           console.error(
//             "Error fetching centers for reseller:",
//             error
//           );
//           setResellerCenters([]);
//         } finally {
//           setLoadingCenters(false);
//         }
//       } else {
//         setResellerCenters([]);

//         setSearchData((prev) => ({
//           ...prev,
//           center: "",
//         }));
//       }
//     };

//     fetchCentersByReseller();
//   }, [searchData.reseller]);

//   // Reset fields when modal closes
//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         product: "",
//         center: "",
//         usageType: "",
//         reseller: "",
//         startDate: "",
//         endDate: "",
//       });

//       setResellerCenters([]);
//     }
//   }, [visible]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setSearchData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const formatDateToDDMMYYYY = (dateString) => {
//     if (!dateString) return "";

//     if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
//       const [year, month, day] = dateString.split("-");

//       return `${day}-${month}-${year}`;
//     }

//     return dateString;
//   };

//   // Apply search filters
//   const handleSearch = () => {
//     const apiSearchData = {
//       product: searchData.product,
//       center: searchData.center,
//       usageType: searchData.usageType,
//       reseller: searchData.reseller,
//       startDate: formatDateToDDMMYYYY(searchData.startDate),
//       endDate: formatDateToDDMMYYYY(searchData.endDate),
//     };

//     onSearch(apiSearchData);
//     onClose();
//   };

//   // Reset filters
//   const handleReset = () => {
//     const resetData = {
//       product: "",
//       center: "",
//       usageType: "",
//       reseller: "",
//       startDate: "",
//       endDate: "",
//     };

//     setSearchData(resetData);
//     setResellerCenters([]);

//     onSearch(resetData);
//     onClose();
//   };

//   if (!visible) return null;

//   const resellerOptions = resellers.map((reseller) => ({
//     value: reseller._id,
//     label: reseller.businessName,
//   }));

//   const centerOptions = resellerCenters.map((center) => ({
//     value: center._id,
//     label: center.centerName,
//   }));

//   const productOptions = products.map((product) => ({
//     value: product._id,
//     label: product.productTitle,
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

//   // React Select styling
//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: "38px",
//       height: "38px",
//       borderRadius: "4px",
//       borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
//       boxShadow: state.isFocused
//         ? "0 0 0 1px #2563eb"
//         : "none",
//       "&:hover": {
//         borderColor: "#9ca3af",
//       },
//     }),

//     valueContainer: (base) => ({
//       ...base,
//       padding: "0 10px",
//     }),

//     indicatorsContainer: (base) => ({
//       ...base,
//       height: "36px",
//     }),

//     menu: (base) => ({
//       ...base,
//       zIndex: 10001,
//     }),

//     menuPortal: (base) => ({
//       ...base,
//       zIndex: 10001,
//     }),
//   };

//   return (
//     <div className="search-indent-overlay fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6">
//       {/* Top-down animation */}
//       <style>{`
//         @keyframes searchIndentDropDown {
//           0% {
//             opacity: 0;
//             transform: translateY(-55px);
//           }

//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes searchIndentFadeIn {
//           0% {
//             opacity: 0;
//           }

//           100% {
//             opacity: 1;
//           }
//         }

//         .search-indent-overlay {
//           animation: searchIndentFadeIn 180ms ease-out both;
//         }

//         .search-indent-panel {
//           animation: searchIndentDropDown 320ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
//           transform-origin: top center;
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .search-indent-overlay,
//           .search-indent-panel {
//             animation: none;
//           }
//         }
//       `}</style>

//       <div
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="search-indent-title"
//         className="search-indent-panel flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl"
//       >
//         {/* Header */}
//         <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-4">
//           <h2
//             id="search-indent-title"
//             className="text-xl font-normal text-gray-700"
//           >
//             Search
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close search"
//             className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//           >
//             <X size={22} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="min-h-0 overflow-y-auto px-4 py-4">
//           {/* Reseller + Branch */}
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Reseller */}
//             <div>
//               <label
//                 htmlFor="reseller"
//                 className="mb-1.5 block text-sm font-semibold text-gray-700"
//               >
//                 Reseller
//               </label>

//               <Select
//                 inputId="reseller"
//                 name="reseller"
//                 placeholder={
//                   loadingResellers
//                     ? "Loading resellers..."
//                     : "Select Reseller..."
//                 }
//                 value={selectedReseller}
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     reseller: selected ? selected.value : "",
//                     center: "",
//                   }))
//                 }
//                 options={resellerOptions}
//                 isClearable
//                 isLoading={loadingResellers}
//                 classNamePrefix="react-select"
//                 styles={selectStyles}
//                 menuPortalTarget={
//                   typeof document !== "undefined"
//                     ? document.body
//                     : undefined
//                 }
//               />
//             </div>

//             {/* Branch */}
//             <div>
//               <label
//                 htmlFor="center"
//                 className="mb-1.5 block text-sm font-semibold text-gray-700"
//               >
//                 Branch
//               </label>

//               <Select
//                 inputId="center"
//                 name="center"
//                 placeholder={
//                   loadingCenters
//                     ? "Loading branches..."
//                     : searchData.reseller
//                       ? "Select Branch..."
//                       : "Select a reseller first"
//                 }
//                 value={selectedCenter}
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     center: selected ? selected.value : "",
//                   }))
//                 }
//                 options={centerOptions}
//                 isClearable
//                 isDisabled={
//                   !searchData.reseller || loadingCenters
//                 }
//                 isLoading={loadingCenters}
//                 classNamePrefix="react-select"
//                 styles={selectStyles}
//                 menuPortalTarget={
//                   typeof document !== "undefined"
//                     ? document.body
//                     : undefined
//                 }
//               />

//               {searchData.reseller &&
//                 !loadingCenters &&
//                 resellerCenters.length === 0 && (
//                   <p className="mt-1 text-xs text-gray-500">
//                     No branches found for this reseller
//                   </p>
//                 )}
//             </div>
//           </div>

//           {/* Usage Type + Product */}
//           <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Usage Type */}
//             <div>
//               <label
//                 htmlFor="usageType"
//                 className="mb-1.5 block text-sm font-semibold text-gray-700"
//               >
//                 Usage Type
//               </label>

//               <select
//                 id="usageType"
//                 name="usageType"
//                 value={searchData.usageType}
//                 onChange={handleChange}
//                 className="block h-[38px] w-full rounded-sm border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">-SELECT-</option>
//                 <option value="Customer">Customer</option>
//                 <option value="Building">Building</option>
//                 <option value="Building to Building">
//                   Building to Building
//                 </option>
//                 <option value="Control Room">Control Room</option>
//                 <option value="Damage">Damage</option>
//                 <option value="Stolen from Center">
//                   Stolen from Center
//                 </option>
//                 <option value="Stolen from Field">
//                   Stolen from Field
//                 </option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {/* Product */}
//             <div>
//               <label
//                 htmlFor="product"
//                 className="mb-1.5 block text-sm font-semibold text-gray-700"
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
//                     product: selected ? selected.value : "",
//                   }))
//                 }
//                 options={productOptions}
//                 isClearable
//                 classNamePrefix="react-select"
//                 styles={selectStyles}
//                 menuPortalTarget={
//                   typeof document !== "undefined"
//                     ? document.body
//                     : undefined
//                 }
//               />
//             </div>
//           </div>

//           {/* Date Range */}
//           <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Start Date */}
//             <div>
//               <label
//                 htmlFor="startDate"
//                 className="mb-1.5 block text-sm font-semibold text-gray-700"
//               >
//                 Start Date
//               </label>

//               <input
//                 type="date"
//                 id="startDate"
//                 name="startDate"
//                 value={searchData.startDate}
//                 onChange={handleChange}
//                 className="block h-[38px] w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />

//               <p className="mt-1 text-sm text-gray-500">
//                 Optional (Format: DD-MM-YYYY)
//               </p>
//             </div>

//             {/* End Date */}
//             <div>
//               <label
//                 htmlFor="endDate"
//                 className="mb-1.5 block text-sm font-semibold text-gray-700"
//               >
//                 End Date
//               </label>

//               <input
//                 type="date"
//                 id="endDate"
//                 name="endDate"
//                 value={searchData.endDate}
//                 onChange={handleChange}
//                 className="block h-[38px] w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />

//               <p className="mt-1 text-sm text-gray-500">
//                 Optional (Format: DD-MM-YYYY)
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-200 bg-white px-4 py-4 sm:flex-row sm:justify-end">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center justify-center rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
//           >
//             Reset
//           </button>

//           <button
//             type="button"
//             onClick={handleSearch}
//             className="inline-flex items-center justify-center rounded-md bg-[#2458a6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1e4b91] focus:outline-none focus:ring-2 focus:ring-blue-300"
//           >
//             Search
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// SearchIndentSummary.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
//   products: PropTypes.array.isRequired,
// };

// export default SearchIndentSummary;

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { X } from "lucide-react";
import axiosInstance from "../../axiosInstance";

// Normalize product, reseller, and center arrays from common API response shapes.
const toArray = (value, preferredKeys = ["products", "centers", "items", "results", "data"]) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  for (const key of preferredKeys) {
    if (Array.isArray(value[key])) return value[key];
  }

  // Support nested wrappers such as data.data.products.
  for (const key of ["data", "result", "payload"]) {
    if (value[key] && typeof value[key] === "object") {
      const nested = toArray(value[key], preferredKeys);
      if (nested.length > 0) return nested;
    }
  }

  return [];
};

const SearchIndentSummary = ({
  visible,
  onClose,
  onSearch,
  centers,
  products,
}) => {
  const [searchData, setSearchData] = useState({
    product: "",
    center: "",
    usageType: "",
    reseller: "",
    startDate: "",
    endDate: "",
  });

  const [resellers, setResellers] = useState([]);
  const [loadingResellers, setLoadingResellers] = useState(false);

  const [resellerCenters, setResellerCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch products. Some backend routes return data: [] while others return
  // data: { products: [] }, so normalize both formats before setting state.
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoadingProducts(true);

      try {
        let productList = [];

        // Try the all-products route first.
        try {
          const response = await axiosInstance.get("/products/all");
          productList = toArray(response?.data);
        } catch (error) {
          console.warn("GET /products/all failed; trying GET /products.", error);
        }

        // Fallback for deployments where the product list is exposed at /products.
        if (productList.length === 0) {
          try {
            const response = await axiosInstance.get("/products");
            productList = toArray(response?.data);
          } catch (error) {
            console.error("Unable to fetch products from /products/all or /products:", error);
          }
        }

        if (isMounted) {
          setFetchedProducts(productList);
          if (productList.length === 0) {
            console.warn("Product API returned no usable product array.");
          }
        }
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch all resellers
  useEffect(() => {
    const fetchResellers = async () => {
      setLoadingResellers(true);

      try {
        const response = await axiosInstance.get("/resellers");

        if (response.data?.success) {
          setResellers(toArray(response.data.data));
        } else {
          setResellers([]);
        }
      } catch (error) {
        console.error("Error fetching resellers:", error);
        setResellers([]);
      } finally {
        setLoadingResellers(false);
      }
    };

    fetchResellers();
  }, []);

  // Fetch branches based on selected reseller
  useEffect(() => {
    const fetchCentersByReseller = async () => {
      if (searchData.reseller) {
        setLoadingCenters(true);

        try {
          const response = await axiosInstance.get(
            `/centers/reseller/${searchData.reseller}`
          );

          if (response.data?.success) {
            setResellerCenters(toArray(response.data.data));
          } else {
            setResellerCenters([]);
          }
        } catch (error) {
          console.error(
            "Error fetching centers for reseller:",
            error
          );
          setResellerCenters([]);
        } finally {
          setLoadingCenters(false);
        }
      } else {
        setResellerCenters([]);

        setSearchData((prev) => ({
          ...prev,
          center: "",
        }));
      }
    };

    fetchCentersByReseller();
  }, [searchData.reseller]);

  // Reset fields when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchData({
        product: "",
        center: "",
        usageType: "",
        reseller: "",
        startDate: "",
        endDate: "",
      });

      setResellerCenters([]);
    }
  }, [visible]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");

      return `${day}-${month}-${year}`;
    }

    return dateString;
  };

  // Apply search filters
  const handleSearch = () => {
    const apiSearchData = {
      product: searchData.product,
      center: searchData.center,
      usageType: searchData.usageType,
      reseller: searchData.reseller,
      startDate: formatDateToDDMMYYYY(searchData.startDate),
      endDate: formatDateToDDMMYYYY(searchData.endDate),
    };

    onSearch(apiSearchData);
    onClose();
  };

  // Reset filters
  const handleReset = () => {
    const resetData = {
      product: "",
      center: "",
      usageType: "",
      reseller: "",
      startDate: "",
      endDate: "",
    };

    setSearchData(resetData);
    setResellerCenters([]);

    onSearch(resetData);
    onClose();
  };

  if (!visible) return null;

  const safeResellers = toArray(resellers);
  const safeResellerCenters = toArray(resellerCenters);
  const safeCenters = toArray(centers);
  const propProducts = toArray(products);
  const safeProducts = fetchedProducts.length > 0 ? fetchedProducts : propProducts;

  const resellerOptions = safeResellers.map((reseller) => ({
    value: reseller._id,
    label: reseller.businessName || reseller.name || "Unnamed Reseller",
  }));

  // Use reseller-specific branches when a reseller is selected.
  const centerOptions = (
    searchData.reseller ? safeResellerCenters : safeCenters
  ).map((center) => ({
    value: center._id,
    label: center.centerName || center.name || "Unnamed Center",
  }));

  const getProductLabel = (product) => {
    const candidates = [
      product.productTitle,
      product.productName,
      product.ProductTitle,
      product.ProductName,
      product.product_name,
      product.product_title,
      product.name,
      product.Name,
      product.title,
      product.Title,
      product.product,
      product.Product,
      product.itemName,
      product.item_name,
      product.description,
      product.Description,
      product.modelName,
      product.model,
      product.skuName,
    ];

    const label = candidates.find(
      (candidate) =>
        candidate !== null &&
        candidate !== undefined &&
        String(candidate).trim() !== ""
    );

    return label ? String(label).trim() : "";
  };

  const productOptions = safeProducts
    .map((product) => {
      const productId =
        product._id ??
        product.id ??
        product.productId ??
        product.ProductId ??
        product.product_id;

      return {
        value: productId == null ? "" : String(productId),
        label: getProductLabel(product),
        raw: product,
      };
    })
    .filter((option) => option.value && option.label);

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
      (option) => String(option.value) === String(searchData.product)
    ) || null;

  // React Select styling
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "38px",
      height: "38px",
      borderRadius: "4px",
      borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
      boxShadow: state.isFocused
        ? "0 0 0 1px #2563eb"
        : "none",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "0 10px",
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: "36px",
    }),

    menu: (base) => ({
      ...base,
      zIndex: 10001,
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 10001,
    }),
  };

  return (
    <div className="search-indent-overlay fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6">
      {/* Top-down animation */}
      <style>{`
        @keyframes searchIndentDropDown {
          0% {
            opacity: 0;
            transform: translateY(-55px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes searchIndentFadeIn {
          0% {
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }

        .search-indent-overlay {
          animation: searchIndentFadeIn 180ms ease-out both;
        }

        .search-indent-panel {
          animation: searchIndentDropDown 320ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
          transform-origin: top center;
        }

        @media (prefers-reduced-motion: reduce) {
          .search-indent-overlay,
          .search-indent-panel {
            animation: none;
          }
        }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-indent-title"
        className="search-indent-panel flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-4">
          <h2
            id="search-indent-title"
            className="text-xl font-normal text-gray-700"
          >
            Search
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 overflow-y-auto px-4 py-4">
          {/* Reseller + Branch */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Reseller */}
            <div>
              <label
                htmlFor="reseller"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Reseller
              </label>

              <Select
                inputId="reseller"
                name="reseller"
                placeholder={
                  loadingResellers
                    ? "Loading resellers..."
                    : "Select Reseller..."
                }
                value={selectedReseller}
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    reseller: selected ? selected.value : "",
                    center: "",
                  }))
                }
                options={resellerOptions}
                isClearable
                isLoading={loadingResellers}
                classNamePrefix="react-select"
                styles={selectStyles}
                menuPortalTarget={
                  typeof document !== "undefined"
                    ? document.body
                    : undefined
                }
              />
            </div>

            {/* Branch */}
            <div>
              <label
                htmlFor="center"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Branch
              </label>

              <Select
                inputId="center"
                name="center"
                placeholder={
                  loadingCenters
                    ? "Loading branches..."
                    : searchData.reseller
                      ? "Select Branch..."
                      : "Select a reseller first"
                }
                value={selectedCenter}
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    center: selected ? selected.value : "",
                  }))
                }
                options={centerOptions}
                isClearable
                isDisabled={
                  !searchData.reseller || loadingCenters
                }
                isLoading={loadingCenters}
                classNamePrefix="react-select"
                styles={selectStyles}
                menuPortalTarget={
                  typeof document !== "undefined"
                    ? document.body
                    : undefined
                }
              />

              {searchData.reseller &&
                !loadingCenters &&
                safeResellerCenters.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    No branches found for this reseller
                  </p>
                )}
            </div>
          </div>

          {/* Usage Type + Product */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Usage Type */}
            <div>
              <label
                htmlFor="usageType"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Usage Type
              </label>

              <select
                id="usageType"
                name="usageType"
                value={searchData.usageType}
                onChange={handleChange}
                className="block h-[38px] w-full rounded-sm border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-SELECT-</option>
                <option value="Customer">Customer</option>
                <option value="Building">Building</option>
                <option value="Building to Building">
                  Building to Building
                </option>
                <option value="Control Room">Control Room</option>
                <option value="Damage">Damage</option>
                <option value="Stolen from Center">
                  Stolen from Center
                </option>
                <option value="Stolen from Field">
                  Stolen from Field
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Product */}
            <div>
              <label
                htmlFor="product"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
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
                    product: selected ? selected.value : "",
                  }))
                }
                options={productOptions}
                // Show the complete product list even if API labels use a different naming format.
               filterOption={(option, inputValue) =>
  option.label
    .toLowerCase()
    .includes(inputValue.trim().toLowerCase())
}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => String(option.value)}
                isClearable
                isLoading={loadingProducts}
                loadingMessage={() => "Loading products..."}
                noOptionsMessage={({ inputValue }) =>
                  inputValue
                    ? `No products match "${inputValue}"`
                    : "No products available"
                }
                // Keep the selected product visible in the menu as well.
                hideSelectedOptions={false}
                classNamePrefix="react-select"
                styles={selectStyles}
                menuPortalTarget={
                  typeof document !== "undefined"
                    ? document.body
                    : undefined
                }
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Start Date
              </label>

              <input
                type="date"
                id="startDate"
                name="startDate"
                value={searchData.startDate}
                onChange={handleChange}
                className="block h-[38px] w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <p className="mt-1 text-sm text-gray-500">
                Optional (Format: DD-MM-YYYY)
              </p>
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                End Date
              </label>

              <input
                type="date"
                id="endDate"
                name="endDate"
                value={searchData.endDate}
                onChange={handleChange}
                className="block h-[38px] w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <p className="mt-1 text-sm text-gray-500">
                Optional (Format: DD-MM-YYYY)
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-200 bg-white px-4 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center justify-center rounded-md bg-[#2458a6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1e4b91] focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

SearchIndentSummary.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  products: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};

export default SearchIndentSummary;