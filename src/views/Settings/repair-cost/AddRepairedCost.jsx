// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import Select from "react-select";
// import { X } from "lucide-react";

// import axiosInstance from "../../../axiosInstance";
// const AddRepairedCost = ({
//   visible,
//   onClose,
//   onRepairCostAdded,
//   repairCost,
// }) => {
//   const [products, setProducts] = useState([]);

//   const [formData, setFormData] = useState({
//     product: "",
//     repairCost: "",
//   });

//   const [errors, setErrors] = useState({});

//   const [alert, setAlert] = useState({
//     type: "",
//     message: "",
//   });

//   // --------------------------------------------------
//   // Fetch Products
//   // --------------------------------------------------
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response =
//           await axiosInstance.get(
//             "/products",
//           );

//         if (response.data.success) {
//           setProducts(
//             response.data.data || [],
//           );
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching products:",
//           error,
//         );
//       }
//     };

//     if (visible) {
//       fetchProducts();
//     }
//   }, [visible]);

//   // --------------------------------------------------
//   // Initialize Form
//   // --------------------------------------------------
//   useEffect(() => {
//     if (repairCost) {
//       setFormData({
//         product:
//           repairCost.product?._id || "",
//         repairCost:
//           repairCost.repairCost || "",
//       });
//     } else {
//       setFormData({
//         product: "",
//         repairCost: "",
//       });
//     }

//     setErrors({});

//     setAlert({
//       type: "",
//       message: "",
//     });
//   }, [repairCost, visible]);

//   // --------------------------------------------------
//   // Input Change
//   // --------------------------------------------------
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       [name]: "",
//     }));

//     setAlert({
//       type: "",
//       message: "",
//     });
//   };

//   // --------------------------------------------------
//   // Product Change
//   // --------------------------------------------------
//   const handleProductChange = (
//     selected,
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       product: selected
//         ? selected.value
//         : "",
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       product: "",
//     }));

//     setAlert({
//       type: "",
//       message: "",
//     });
//   };

//   // --------------------------------------------------
//   // Submit
//   // --------------------------------------------------
//   const handleSubmit = async () => {
//     const newErrors = {};

//     if (!formData.product) {
//       newErrors.product =
//         "Product is required";
//     }

//     if (
//       !formData.repairCost ||
//       formData.repairCost < 0
//     ) {
//       newErrors.repairCost =
//         "Valid repair cost (≥ 0) is required";
//     }

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       const payload = {
//         product: formData.product,
//         repairCost: parseFloat(
//           formData.repairCost,
//         ),
//       };

//       let response;

//       if (repairCost) {
//         response =
//           await axiosInstance.put(
//             `/repaired-cost/${repairCost._id}`,
//             payload,
//           );

//         if (response.data.success) {
//           setAlert({
//             type: "success",
//             message:
//               "Repair cost updated successfully!",
//           });

//           onRepairCostAdded(
//             response.data.data,
//             true,
//           );
//         }
//       } else {
//         response =
//           await axiosInstance.post(
//             "/repaired-cost",
//             payload,
//           );

//         if (response.data.success) {
//           setAlert({
//             type: "success",
//             message:
//               "Repair cost added successfully!",
//           });

//           onRepairCostAdded(
//             response.data.data,
//             false,
//           );
//         }
//       }

//       // Reset form
//       setFormData({
//         product: "",
//         repairCost: "",
//       });

//       setErrors({});

//       setTimeout(() => {
//         setAlert({
//           type: "",
//           message: "",
//         });

//         onClose();
//       }, 1500);
//     } catch (error) {
//       console.error(
//         "Error saving repair cost:",
//         error,
//       );

//       let errorMessage =
//         "Failed to save repair cost";

//       if (error.response?.data?.message) {
//         errorMessage =
//           error.response.data.message;
//       }

//       setAlert({
//         type: "danger",
//         message: errorMessage,
//       });
//     }
//   };

//   // --------------------------------------------------
//   // Selected Product Name
//   // --------------------------------------------------
//   const getSelectedProductName = () => {
//     if (!formData.product) {
//       return "";
//     }

//     const selected = products.find(
//       (product) =>
//         product._id === formData.product,
//     );

//     return selected
//       ? `${selected.productTitle} (${selected.productCode})`
//       : "";
//   };

//   // --------------------------------------------------
//   // Product Options
//   // --------------------------------------------------
//   const productOptions = products.map(
//     (product) => ({
//       value: product._id,
//       label: product.productTitle,
//     }),
//   );

//   const selectedProduct =
//     formData.product
//       ? {
//           value: formData.product,
//           label: getSelectedProductName(),
//         }
//       : null;

//   if (!visible) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
//       <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
//         {/* ---------------------------------------- */}
//         {/* Header */}
//         {/* ---------------------------------------- */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             {repairCost
//               ? "Edit Repair Cost"
//               : "Add Repair Cost"}
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* ---------------------------------------- */}
//         {/* Body */}
//         {/* ---------------------------------------- */}
//         <div className="p-5">
//           {/* Alert */}
//           {alert.message && (
//             <div
//               className={`mb-5 flex items-start justify-between rounded-md border px-4 py-3 text-sm ${
//                 alert.type === "success"
//                   ? "border-green-200 bg-green-50 text-green-700"
//                   : "border-red-200 bg-red-50 text-red-700"
//               }`}
//             >
//               <span>
//                 {alert.message}
//               </span>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setAlert({
//                     type: "",
//                     message: "",
//                   })
//                 }
//                 className="ml-4 text-lg font-semibold leading-none opacity-70 hover:opacity-100"
//               >
//                 ×
//               </button>
//             </div>
//           )}

//           {/* Form */}
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Product */}
//             <div>
//               <label
//                 htmlFor="product"
//                 className={`mb-1.5 block text-sm font-medium ${
//                   errors.product
//                     ? "text-red-600"
//                     : formData.product
//                       ? "text-green-600"
//                       : "text-gray-700"
//                 }`}
//               >
//                 Product{" "}
//                 <span className="text-red-500">
//                   *
//                 </span>
//               </label>

//               <Select
//                 inputId="product"
//                 name="product"
//                 placeholder="Select Product..."
//                 value={selectedProduct}
//                 onChange={
//                   handleProductChange
//                 }
//                 options={productOptions}
//                 isDisabled={!!repairCost}
//                 isClearable={!repairCost}
//                 className="text-sm"
//                 styles={{
//                   control: (
//                     base,
//                     state,
//                   ) => ({
//                     ...base,
//                     minHeight: "40px",
//                     borderRadius: "6px",
//                     borderColor:
//                       errors.product
//                         ? "#ef4444"
//                         : formData.product
//                           ? "#22c55e"
//                           : state.isFocused
//                             ? "#3b82f6"
//                             : "#d1d5db",
//                     boxShadow:
//                       state.isFocused
//                         ? "0 0 0 1px #3b82f6"
//                         : "none",
//                   }),
//                 }}
//               />

//               {errors.product && (
//                 <span className="mt-1 block text-xs text-red-600">
//                   {errors.product}
//                 </span>
//               )}

//               {repairCost && (
//                 <small className="mt-1 block text-xs text-red-600">
//                   Product cannot be
//                   changed when editing
//                 </small>
//               )}
//             </div>

//             {/* Repair Cost */}
//             <div>
//               <label
//                 htmlFor="repairCost"
//                 className={`mb-1.5 block text-sm font-medium ${
//                   errors.repairCost
//                     ? "text-red-600"
//                     : formData.repairCost
//                       ? "text-green-600"
//                       : "text-gray-700"
//                 }`}
//               >
//                 Repair Cost (₹){" "}
//                 <span className="text-red-500">
//                   *
//                 </span>
//               </label>

//               <input
//                 type="number"
//                 id="repairCost"
//                 name="repairCost"
//                 placeholder="Enter repair cost"
//                 value={
//                   formData.repairCost
//                 }
//                 onChange={handleChange}
//                 min="0"
//                 step="0.01"
//                 className={`w-full rounded-md border px-3 py-2 text-sm text-gray-700 outline-none transition ${
//                   errors.repairCost
//                     ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
//                     : formData.repairCost
//                       ? "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-100"
//                       : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 }`}
//               />

//               {errors.repairCost && (
//                 <span className="mt-1 block text-xs text-red-600">
//                   {errors.repairCost}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ---------------------------------------- */}
//         {/* Footer */}
//         {/* ---------------------------------------- */}
//         <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-md border border-gray-300 bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={handleSubmit}
//             className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//           >
//             {repairCost
//               ? "Update"
//               : "Submit"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// AddRepairedCost.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onRepairCostAdded:
//     PropTypes.func.isRequired,
//   repairCost: PropTypes.object,
// };

// export default AddRepairedCost;

// import React, {
//   useEffect,
//   useState,
// } from "react";

// import PropTypes from "prop-types";

// import Select from "react-select";

// import { X } from "lucide-react";

// import axiosInstance from "../../../axiosInstance";

// const AddRepairedCost = ({
//   visible,
//   onClose,
//   onRepairCostAdded,
//   repairCost,
// }) => {
//   const [products, setProducts] =
//     useState([]);

//   const [formData, setFormData] = useState({
//     product: "",
//     repairCost: "",
//   });

//   const [errors, setErrors] = useState({});

//   const [alert, setAlert] = useState({
//     type: "",
//     message: "",
//   });

//   // --------------------------------------------------
//   // Fetch Products
//   // --------------------------------------------------
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response =
//           await axiosInstance.get(
//             "/products",
//           );

//         if (response.data.success) {
//           setProducts(
//             response.data.data || [],
//           );
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching products:",
//           error,
//         );
//       }
//     };

//     if (visible) {
//       fetchProducts();
//     }
//   }, [visible]);

//   // --------------------------------------------------
//   // Initialize Form
//   // --------------------------------------------------
//   useEffect(() => {
//     if (repairCost) {
//       setFormData({
//         product:
//           repairCost.product?._id || "",
//         repairCost:
//           repairCost.repairCost || "",
//       });
//     } else {
//       setFormData({
//         product: "",
//         repairCost: "",
//       });
//     }

//     setErrors({});

//     setAlert({
//       type: "",
//       message: "",
//     });
//   }, [repairCost, visible]);

//   // --------------------------------------------------
//   // Input Change
//   // --------------------------------------------------
//   const handleChange = (e) => {
//     const { name, value } =
//       e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       [name]: "",
//     }));

//     setAlert({
//       type: "",
//       message: "",
//     });
//   };

//   // --------------------------------------------------
//   // Product Change
//   // --------------------------------------------------
//   const handleProductChange = (
//     selected,
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       product: selected
//         ? selected.value
//         : "",
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       product: "",
//     }));

//     setAlert({
//       type: "",
//       message: "",
//     });
//   };

//   // --------------------------------------------------
//   // Submit
//   // --------------------------------------------------
//   const handleSubmit = async () => {
//     const newErrors = {};

//     if (!formData.product) {
//       newErrors.product =
//         "Product is required";
//     }

//     if (
//       !formData.repairCost ||
//       formData.repairCost < 0
//     ) {
//       newErrors.repairCost =
//         "Valid repair cost (≥ 0) is required";
//     }

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       const payload = {
//         product: formData.product,
//         repairCost: parseFloat(
//           formData.repairCost,
//         ),
//       };

//       let response;

//       // --------------------------------------------------
//       // Edit
//       // --------------------------------------------------
//       if (repairCost) {
//         response =
//           await axiosInstance.put(
//             `/repaired-cost/${repairCost._id}`,
//             payload,
//           );

//         if (response.data.success) {
//           setAlert({
//             type: "success",
//             message:
//               "Repair cost updated successfully!",
//           });

//           onRepairCostAdded(
//             response.data.data,
//             true,
//           );
//         }
//       }

//       // --------------------------------------------------
//       // Add
//       // --------------------------------------------------
//       else {
//         response =
//           await axiosInstance.post(
//             "/repaired-cost",
//             payload,
//           );

//         if (response.data.success) {
//           setAlert({
//             type: "success",
//             message:
//               "Repair cost added successfully!",
//           });

//           onRepairCostAdded(
//             response.data.data,
//             false,
//           );
//         }
//       }

//       // Reset form
//       setFormData({
//         product: "",
//         repairCost: "",
//       });

//       setErrors({});

//       setTimeout(() => {
//         setAlert({
//           type: "",
//           message: "",
//         });

//         onClose();
//       }, 1500);
//     } catch (error) {
//       console.error(
//         "Error saving repair cost:",
//         error,
//       );

//       let errorMessage =
//         "Failed to save repair cost";

//       if (error.response?.data?.message) {
//         errorMessage =
//           error.response.data.message;
//       }

//       setAlert({
//         type: "danger",
//         message: errorMessage,
//       });
//     }
//   };

//   // --------------------------------------------------
//   // Selected Product Name
//   // --------------------------------------------------
//   const getSelectedProductName = () => {
//     if (!formData.product) {
//       return "";
//     }

//     const selected = products.find(
//       (product) =>
//         product._id ===
//         formData.product,
//     );

//     return selected
//       ? `${selected.productTitle} (${selected.productCode})`
//       : "";
//   };

//   // --------------------------------------------------
//   // Product Options
//   // --------------------------------------------------
//   const productOptions = products.map(
//     (product) => ({
//       value: product._id,
//       label: product.productTitle,
//     }),
//   );

//   const selectedProduct =
//     formData.product
//       ? {
//           value: formData.product,
//           label: getSelectedProductName(),
//         }
//       : null;

//   // --------------------------------------------------
//   // Hide Modal
//   // --------------------------------------------------
//   if (!visible) {
//     return null;
//   }

//   return (
//     <>
//       {/* ==================================================
//           MODAL ANIMATION
//       ================================================== */}
//       <style>
//         {`
//           @keyframes repairedCostBackdropFade {
//             from {
//               opacity: 0;
//             }

//             to {
//               opacity: 1;
//             }
//           }

//           @keyframes repairedCostModalDrop {
//             0% {
//               opacity: 0;
//               transform: translateY(-45px) scale(0.985);
//             }

//             60% {
//               opacity: 1;
//               transform: translateY(5px) scale(1);
//             }

//             100% {
//               opacity: 1;
//               transform: translateY(0) scale(1);
//             }
//           }

//           .repaired-cost-backdrop {
//             animation:
//               repairedCostBackdropFade
//               0.22s
//               ease-out
//               forwards;
//           }

//           .repaired-cost-modal {
//             animation:
//               repairedCostModalDrop
//               0.32s
//               cubic-bezier(0.22, 1, 0.36, 1)
//               forwards;
//           }

//           .repaired-cost-select
//             .react-select__control {
//             min-height: 41px;
//           }
//         `}
//       </style>

//       {/* ==================================================
//           BACKDROP
//       ================================================== */}
//       <div
//         className="
//           repaired-cost-backdrop
//           fixed
//           inset-0
//           z-[9999]
//           flex
//           items-start
//           justify-center
//           overflow-y-auto
//           bg-black/50
//           px-4
//           pb-8
//           pt-[76px]
//         "
//       >
//         {/* ==================================================
//             MODAL
//         ================================================== */}
//         <div
//           className="
//             repaired-cost-modal
//             w-full
//             max-w-[800px]
//             overflow-hidden
//             rounded-[7px]
//             bg-white
//             shadow-[0_10px_35px_rgba(0,0,0,0.28)]
//           "
//         >
//           {/* ==================================================
//               HEADER
//           ================================================== */}
//           <div
//             className="
//               flex
//               h-[68px]
//               items-center
//               justify-between
//               border-b
//               border-[#dee2e6]
//               bg-white
//               px-[17px]
//             "
//           >
//             <h2
//               className="
//                 m-0
//                 text-[23px]
//                 font-normal
//                 leading-none
//                 text-[#343a40]
//               "
//             >
//               {repairCost
//                 ? "Edit Repair Cost"
//                 : "Add Repair Cost"}
//             </h2>

//             <button
//               type="button"
//               onClick={onClose}
//               className="
//                 flex
//                 h-[38px]
//                 w-[38px]
//                 items-center
//                 justify-center
//                 rounded
//                 text-[#777]
//                 transition-all
//                 duration-200
//                 hover:bg-[#f1f1f1]
//                 hover:text-[#333]
//                 active:scale-95
//               "
//               aria-label="Close"
//             >
//               <X
//                 size={25}
//                 strokeWidth={1.8}
//               />
//             </button>
//           </div>

//           {/* ==================================================
//               BODY
//           ================================================== */}
//           <div
//             className="
//               px-[17px]
//               pb-[30px]
//               pt-[18px]
//             "
//           >
//             {/* ==================================================
//                 ALERT
//             ================================================== */}
//             {alert.message && (
//               <div
//                 className={`
//                   mb-[18px]
//                   flex
//                   items-center
//                   justify-between
//                   rounded-[4px]
//                   border
//                   px-[13px]
//                   py-[10px]
//                   text-[14px]
//                   ${
//                     alert.type ===
//                     "success"
//                       ? "border-green-200 bg-green-50 text-green-700"
//                       : "border-red-200 bg-red-50 text-red-700"
//                   }
//                 `}
//               >
//                 <span>
//                   {alert.message}
//                 </span>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setAlert({
//                       type: "",
//                       message: "",
//                     })
//                   }
//                   className="
//                     ml-4
//                     text-[18px]
//                     font-semibold
//                     leading-none
//                     opacity-70
//                     transition
//                     hover:opacity-100
//                   "
//                   aria-label="Close alert"
//                 >
//                   ×
//                 </button>
//               </div>
//             )}

//             {/* ==================================================
//                 FORM
//             ================================================== */}
//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 gap-x-[21px]
//                 gap-y-[22px]
//                 md:grid-cols-2
//               "
//             >
//               {/* ==================================================
//                   PRODUCT
//               ================================================== */}
//               <div>
//                 <label
//                   htmlFor="product"
//                   className={`
//                     mb-[8px]
//                     block
//                     text-[16px]
//                     font-semibold
//                     leading-[20px]
//                     ${
//                       errors.product
//                         ? "text-red-600"
//                         : formData.product
//                           ? "text-green-600"
//                           : "text-[#343a40]"
//                     }
//                   `}
//                 >
//                   Product{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <div
//                   className={
//                     errors.product
//                       ? "rounded-[2px] border border-red-500"
//                       : ""
//                   }
//                 >
//                   <Select
//                     inputId="product"
//                     name="product"
//                     placeholder="Select Product..."
//                     value={
//                       selectedProduct
//                     }
//                     onChange={
//                       handleProductChange
//                     }
//                     options={
//                       productOptions
//                     }
//                     isDisabled={
//                       !!repairCost
//                     }
//                     isClearable={
//                       !repairCost
//                     }
//                     className="
//                       repaired-cost-select
//                       text-[16px]
//                     "
//                     classNamePrefix="react-select"
//                     styles={{
//                       control: (
//                         base,
//                         state,
//                       ) => ({
//                         ...base,

//                         minHeight:
//                           "41px",

//                         height:
//                           "41px",

//                         borderRadius:
//                           "2px",

//                         borderColor:
//                           errors.product
//                             ? "#ef4444"
//                             : formData.product
//                               ? "#22c55e"
//                               : state.isFocused
//                                 ? "#2f5fa7"
//                                 : "#d9d9d9",

//                         boxShadow:
//                           state.isFocused
//                             ? "0 0 0 1px rgba(47,95,167,0.18)"
//                             : "none",

//                         "&:hover": {
//                           borderColor:
//                             errors.product
//                               ? "#ef4444"
//                               : "#2f5fa7",
//                         },

//                         fontSize:
//                           "16px",

//                         backgroundColor:
//                           "#ffffff",
//                       }),

//                       valueContainer: (
//                         base,
//                       ) => ({
//                         ...base,
//                         padding:
//                           "0 12px",
//                       }),

//                       input: (
//                         base,
//                       ) => ({
//                         ...base,
//                         margin:
//                           "0",
//                         padding:
//                           "0",
//                       }),

//                       placeholder: (
//                         base,
//                       ) => ({
//                         ...base,
//                         color:
//                           "#6c757d",
//                       }),

//                       singleValue: (
//                         base,
//                       ) => ({
//                         ...base,
//                         color:
//                           "#343a40",
//                       }),

//                       menu: (
//                         base,
//                       ) => ({
//                         ...base,
//                         zIndex:
//                           10000,
//                         borderRadius:
//                           "2px",
//                         marginTop:
//                           "3px",
//                         boxShadow:
//                           "0 5px 18px rgba(0,0,0,0.16)",
//                       }),

//                       option: (
//                         base,
//                         state,
//                       ) => ({
//                         ...base,
//                         padding:
//                           "9px 12px",
//                         fontSize:
//                           "15px",
//                         backgroundColor:
//                           state.isSelected
//                             ? "#2f5fa7"
//                             : state.isFocused
//                               ? "#eef4fb"
//                               : "#ffffff",
//                         color:
//                           state.isSelected
//                             ? "#ffffff"
//                             : "#343a40",
//                         cursor:
//                           "pointer",
//                       }),

//                       indicatorSeparator:
//                         () => ({
//                           display:
//                             "none",
//                         }),
//                     }}
//                   />
//                 </div>

//                 {errors.product && (
//                   <span
//                     className="
//                       mt-[5px]
//                       block
//                       text-[13px]
//                       text-red-600
//                     "
//                   >
//                     {errors.product}
//                   </span>
//                 )}

//                 {repairCost && (
//                   <small
//                     className="
//                       mt-[5px]
//                       block
//                       text-[13px]
//                       text-red-600
//                     "
//                   >
//                     Product cannot be
//                     changed when editing
//                   </small>
//                 )}
//               </div>

//               {/* ==================================================
//                   REPAIR COST
//               ================================================== */}
//               <div>
//                 <label
//                   htmlFor="repairCost"
//                   className={`
//                     mb-[8px]
//                     block
//                     text-[16px]
//                     font-semibold
//                     leading-[20px]
//                     ${
//                       errors.repairCost
//                         ? "text-red-600"
//                         : formData.repairCost
//                           ? "text-green-600"
//                           : "text-[#343a40]"
//                     }
//                   `}
//                 >
//                   Repair Cost (₹){" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   type="number"
//                   id="repairCost"
//                   name="repairCost"
//                   placeholder="Enter repair cost"
//                   value={
//                     formData.repairCost
//                   }
//                   onChange={
//                     handleChange
//                   }
//                   min="0"
//                   step="0.01"
//                   className={`
//                     h-[41px]
//                     w-full
//                     rounded-[2px]
//                     border
//                     bg-white
//                     px-[12px]
//                     text-[16px]
//                     text-[#343a40]
//                     outline-none
//                     transition
//                     ${
//                       errors.repairCost
//                         ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200"
//                         : formData.repairCost
//                           ? "border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-200"
//                           : "border-[#d9d9d9] focus:border-[#2f5fa7] focus:ring-1 focus:ring-[#2f5fa7]/20"
//                     }
//                   `}
//                 />

//                 {errors.repairCost && (
//                   <span
//                     className="
//                       mt-[5px]
//                       block
//                       text-[13px]
//                       text-red-600
//                     "
//                   >
//                     {
//                       errors.repairCost
//                     }
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* ==================================================
//               FOOTER
//           ================================================== */}
//           <div
//             className="
//               flex
//               items-center
//               justify-end
//               gap-[12px]
//               border-t
//               border-[#dee2e6]
//               bg-white
//               px-[17px]
//               py-[18px]
//             "
//           >
//             {/* Cancel */}
//             <button
//               type="button"
//               onClick={onClose}
//               className="
//                 h-[41px]
//                 rounded-[6px]
//                 bg-[#6c757d]
//                 px-[15px]
//                 text-[16px]
//                 font-medium
//                 text-white
//                 transition-all
//                 duration-200
//                 hover:bg-[#5c636a]
//                 active:scale-[0.98]
//                 focus:outline-none
//               "
//             >
//               Cancel
//             </button>

//             {/* Submit / Update */}
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="
//                 h-[41px]
//                 rounded-[6px]
//                 bg-[#2f5fa7]
//                 px-[17px]
//                 text-[16px]
//                 font-medium
//                 text-white
//                 transition-all
//                 duration-200
//                 hover:bg-[#244c88]
//                 active:scale-[0.98]
//                 focus:outline-none
//               "
//             >
//               {repairCost
//                 ? "Update"
//                 : "Submit"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// AddRepairedCost.propTypes = {
//   visible:
//     PropTypes.bool.isRequired,

//   onClose:
//     PropTypes.func.isRequired,

//   onRepairCostAdded:
//     PropTypes.func.isRequired,

//   repairCost:
//     PropTypes.object,
// };

// export default AddRepairedCost;



import React, {
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import Select from "react-select";

import { X } from "lucide-react";

import axiosInstance from "../../../axiosInstance";

const AddRepairedCost = ({
  visible,
  onClose,
  onRepairCostAdded,
  repairCost,
}) => {
  const [products, setProducts] =
    useState([]);

  const [formData, setFormData] = useState({
    product: "",
    repairCost: "",
  });

  const [errors, setErrors] = useState({});

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  // --------------------------------------------------
  // Fetch Products
  // --------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response =
          await axiosInstance.get(
            "/products",
          );

        if (response.data?.success) {
          // APIs may return the product array directly or nested inside
          // data/products/items. Never store an object in products state.
          const responseData = response.data?.data;
          const productList = Array.isArray(responseData)
            ? responseData
            : Array.isArray(responseData?.products)
              ? responseData.products
              : Array.isArray(responseData?.data)
                ? responseData.data
                : Array.isArray(responseData?.items)
                  ? responseData.items
                  : Array.isArray(response.data?.products)
                    ? response.data.products
                    : Array.isArray(response.data?.items)
                      ? response.data.items
                      : [];

          setProducts(productList);
        } else {
          setProducts([]);
          console.error(
            "Products API returned an unsuccessful response:",
            response.data,
          );
        }
      } catch (error) {
        console.error(
          "Error fetching products:",
          error,
        );
      }
    };

    if (visible) {
      fetchProducts();
    }
  }, [visible]);

  // --------------------------------------------------
  // Initialize Form
  // --------------------------------------------------
  useEffect(() => {
    if (repairCost) {
      setFormData({
        product:
          repairCost.product?._id || "",
        repairCost:
          repairCost.repairCost || "",
      });
    } else {
      setFormData({
        product: "",
        repairCost: "",
      });
    }

    setErrors({});

    setAlert({
      type: "",
      message: "",
    });
  }, [repairCost, visible]);

  // --------------------------------------------------
  // Input Change
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setAlert({
      type: "",
      message: "",
    });
  };

  // --------------------------------------------------
  // Product Change
  // --------------------------------------------------
  const handleProductChange = (
    selected,
  ) => {
    setFormData((prev) => ({
      ...prev,
      product: selected
        ? selected.value
        : "",
    }));

    setErrors((prev) => ({
      ...prev,
      product: "",
    }));

    setAlert({
      type: "",
      message: "",
    });
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async () => {
    const newErrors = {};

    if (!formData.product) {
      newErrors.product =
        "Product is required";
    }

    if (
      !formData.repairCost ||
      formData.repairCost < 0
    ) {
      newErrors.repairCost =
        "Valid repair cost (≥ 0) is required";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        product: formData.product,
        repairCost: parseFloat(
          formData.repairCost,
        ),
      };

      let response;

      // --------------------------------------------------
      // Edit
      // --------------------------------------------------
      if (repairCost) {
        response =
          await axiosInstance.put(
            `/repaired-cost/${repairCost._id}`,
            payload,
          );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Repair cost updated successfully!",
          });

          onRepairCostAdded(
            response.data.data,
            true,
          );
        }
      }

      // --------------------------------------------------
      // Add
      // --------------------------------------------------
      else {
        response =
          await axiosInstance.post(
            "/repaired-cost",
            payload,
          );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Repair cost added successfully!",
          });

          onRepairCostAdded(
            response.data.data,
            false,
          );
        }
      }

      // Reset form
      setFormData({
        product: "",
        repairCost: "",
      });

      setErrors({});

      setTimeout(() => {
        setAlert({
          type: "",
          message: "",
        });

        onClose();
      }, 1500);
    } catch (error) {
      console.error(
        "Error saving repair cost:",
        error,
      );

      let errorMessage =
        "Failed to save repair cost";

      if (error.response?.data?.message) {
        errorMessage =
          error.response.data.message;
      }

      setAlert({
        type: "danger",
        message: errorMessage,
      });
    }
  };

  // --------------------------------------------------
  // Selected Product Name
  // --------------------------------------------------
  const getSelectedProductName = () => {
    if (!formData.product) {
      return "";
    }

    const selected = safeProducts.find(
      (product) =>
        String(product?._id || product?.id || "") ===
        String(formData.product),
    );

    if (!selected) return "";

    const title =
      selected.productTitle ||
      selected.productName ||
      selected.name ||
      "Unnamed Product";
    return selected.productCode
      ? `${title} (${selected.productCode})`
      : title;
  };

  // --------------------------------------------------
  // Product Options
  // --------------------------------------------------
  // Defensive guard: state must always be an array before mapping.
  const safeProducts = Array.isArray(products) ? products : [];

  const productOptions = safeProducts
    .filter((product) => product && (product._id || product.id))
    .map((product) => {
      const productId = product._id || product.id;
      const productTitle =
        product.productTitle ||
        product.productName ||
        product.name ||
        "Unnamed Product";
      const productCode = product.productCode
        ? ` (${product.productCode})`
        : "";

      return {
        value: String(productId),
        label: `${productTitle}${productCode}`,
      };
    });

  const selectedProduct =
    formData.product
      ? {
          value: formData.product,
          label: getSelectedProductName(),
        }
      : null;

  // --------------------------------------------------
  // Hide Modal
  // --------------------------------------------------
  if (!visible) {
    return null;
  }

  return (
    <>
      {/* ==================================================
          MODAL ANIMATION
      ================================================== */}
      <style>
        {`
          @keyframes repairedCostBackdropFade {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes repairedCostModalDrop {
            0% {
              opacity: 0;
              transform: translateY(-45px) scale(0.985);
            }

            60% {
              opacity: 1;
              transform: translateY(5px) scale(1);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .repaired-cost-backdrop {
            animation:
              repairedCostBackdropFade
              0.22s
              ease-out
              forwards;
          }

          .repaired-cost-modal {
            animation:
              repairedCostModalDrop
              0.32s
              cubic-bezier(0.22, 1, 0.36, 1)
              forwards;
          }

          .repaired-cost-select
            .react-select__control {
            min-height: 41px;
          }
        `}
      </style>

      {/* ==================================================
          BACKDROP
      ================================================== */}
      <div
        className="
          repaired-cost-backdrop
          fixed
          inset-0
          z-[9999]
          flex
          items-start
          justify-center
          overflow-y-auto
          bg-black/50
          px-4
          pb-8
          pt-[76px]
        "
      >
        {/* ==================================================
            MODAL
        ================================================== */}
        <div
          className="
            repaired-cost-modal
            w-full
            max-w-[800px]
            overflow-hidden
            rounded-[7px]
            bg-white
            shadow-[0_10px_35px_rgba(0,0,0,0.28)]
          "
        >
          {/* ==================================================
              HEADER
          ================================================== */}
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
              {repairCost
                ? "Edit Repair Cost"
                : "Add Repair Cost"}
            </h2>

            <button
              type="button"
              onClick={onClose}
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
                active:scale-95
              "
              aria-label="Close"
            >
              <X
                size={25}
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* ==================================================
              BODY
          ================================================== */}
          <div
            className="
              px-[17px]
              pb-[30px]
              pt-[18px]
            "
          >
            {/* ==================================================
                ALERT
            ================================================== */}
            {alert.message && (
              <div
                className={`
                  mb-[18px]
                  flex
                  items-center
                  justify-between
                  rounded-[4px]
                  border
                  px-[13px]
                  py-[10px]
                  text-[14px]
                  ${
                    alert.type ===
                    "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }
                `}
              >
                <span>
                  {alert.message}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setAlert({
                      type: "",
                      message: "",
                    })
                  }
                  className="
                    ml-4
                    text-[18px]
                    font-semibold
                    leading-none
                    opacity-70
                    transition
                    hover:opacity-100
                  "
                  aria-label="Close alert"
                >
                  ×
                </button>
              </div>
            )}

            {/* ==================================================
                FORM
            ================================================== */}
            <div
              className="
                grid
                grid-cols-1
                gap-x-[21px]
                gap-y-[22px]
                md:grid-cols-2
              "
            >
              {/* ==================================================
                  PRODUCT
              ================================================== */}
              <div>
                <label
                  htmlFor="product"
                  className={`
                    mb-[8px]
                    block
                    text-[16px]
                    font-semibold
                    leading-[20px]
                    ${
                      errors.product
                        ? "text-red-600"
                        : formData.product
                          ? "text-green-600"
                          : "text-[#343a40]"
                    }
                  `}
                >
                  Product{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div
                  className={
                    errors.product
                      ? "rounded-[2px] border border-red-500"
                      : ""
                  }
                >
                  <Select
                    inputId="product"
                    name="product"
                    placeholder="Select Product..."
                    value={
                      selectedProduct
                    }
                    onChange={
                      handleProductChange
                    }
                    options={
                      productOptions
                    }
                    isDisabled={
                      !!repairCost
                    }
                    isClearable={
                      !repairCost
                    }
                    className="
                      repaired-cost-select
                      text-[16px]
                    "
                    classNamePrefix="react-select"
                    styles={{
                      control: (
                        base,
                        state,
                      ) => ({
                        ...base,

                        minHeight:
                          "41px",

                        height:
                          "41px",

                        borderRadius:
                          "2px",

                        borderColor:
                          errors.product
                            ? "#ef4444"
                            : formData.product
                              ? "#22c55e"
                              : state.isFocused
                                ? "#2f5fa7"
                                : "#d9d9d9",

                        boxShadow:
                          state.isFocused
                            ? "0 0 0 1px rgba(47,95,167,0.18)"
                            : "none",

                        "&:hover": {
                          borderColor:
                            errors.product
                              ? "#ef4444"
                              : "#2f5fa7",
                        },

                        fontSize:
                          "16px",

                        backgroundColor:
                          "#ffffff",
                      }),

                      valueContainer: (
                        base,
                      ) => ({
                        ...base,
                        padding:
                          "0 12px",
                      }),

                      input: (
                        base,
                      ) => ({
                        ...base,
                        margin:
                          "0",
                        padding:
                          "0",
                      }),

                      placeholder: (
                        base,
                      ) => ({
                        ...base,
                        color:
                          "#6c757d",
                      }),

                      singleValue: (
                        base,
                      ) => ({
                        ...base,
                        color:
                          "#343a40",
                      }),

                      menu: (
                        base,
                      ) => ({
                        ...base,
                        zIndex:
                          10000,
                        borderRadius:
                          "2px",
                        marginTop:
                          "3px",
                        boxShadow:
                          "0 5px 18px rgba(0,0,0,0.16)",
                      }),

                      option: (
                        base,
                        state,
                      ) => ({
                        ...base,
                        padding:
                          "9px 12px",
                        fontSize:
                          "15px",
                        backgroundColor:
                          state.isSelected
                            ? "#2f5fa7"
                            : state.isFocused
                              ? "#eef4fb"
                              : "#ffffff",
                        color:
                          state.isSelected
                            ? "#ffffff"
                            : "#343a40",
                        cursor:
                          "pointer",
                      }),

                      indicatorSeparator:
                        () => ({
                          display:
                            "none",
                        }),
                    }}
                  />
                </div>

                {errors.product && (
                  <span
                    className="
                      mt-[5px]
                      block
                      text-[13px]
                      text-red-600
                    "
                  >
                    {errors.product}
                  </span>
                )}

                {repairCost && (
                  <small
                    className="
                      mt-[5px]
                      block
                      text-[13px]
                      text-red-600
                    "
                  >
                    Product cannot be
                    changed when editing
                  </small>
                )}
              </div>

              {/* ==================================================
                  REPAIR COST
              ================================================== */}
              <div>
                <label
                  htmlFor="repairCost"
                  className={`
                    mb-[8px]
                    block
                    text-[16px]
                    font-semibold
                    leading-[20px]
                    ${
                      errors.repairCost
                        ? "text-red-600"
                        : formData.repairCost
                          ? "text-green-600"
                          : "text-[#343a40]"
                    }
                  `}
                >
                  Repair Cost (₹){" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="number"
                  id="repairCost"
                  name="repairCost"
                  placeholder="Enter repair cost"
                  value={
                    formData.repairCost
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  step="0.01"
                  className={`
                    h-[41px]
                    w-full
                    rounded-[2px]
                    border
                    bg-white
                    px-[12px]
                    text-[16px]
                    text-[#343a40]
                    outline-none
                    transition
                    ${
                      errors.repairCost
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                        : formData.repairCost
                          ? "border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-200"
                          : "border-[#d9d9d9] focus:border-[#2f5fa7] focus:ring-1 focus:ring-[#2f5fa7]/20"
                    }
                  `}
                />

                {errors.repairCost && (
                  <span
                    className="
                      mt-[5px]
                      block
                      text-[13px]
                      text-red-600
                    "
                  >
                    {
                      errors.repairCost
                    }
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}
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
              onClick={onClose}
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
                focus:outline-none
              "
            >
              Cancel
            </button>

            {/* Submit / Update */}
            <button
              type="button"
              onClick={handleSubmit}
              className="
                h-[41px]
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
                focus:outline-none
              "
            >
              {repairCost
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

AddRepairedCost.propTypes = {
  visible:
    PropTypes.bool.isRequired,

  onClose:
    PropTypes.func.isRequired,

  onRepairCostAdded:
    PropTypes.func.isRequired,

  repairCost:
    PropTypes.object,
};

export default AddRepairedCost;
