// import React, { useEffect, useRef, useState } from "react";
// import {
//   ArrowLeft,
//   Plus,
//   RotateCcw,
//   Search,
//   X,
//   Save,
//   Hash,
// } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import Select from "react-select";

// import axiosInstance from "../../axiosInstance";import VendorModal from "./VendorModel";
// import SerialNumberModal from "./SerialNumberModel";

// const AddStockPurchase = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     type: "",
//     date: new Date().toISOString().split("T")[0],
//     invoiceNo: "",
//     vendor: "",
//     vendor_id: "",
//     transportAmount: "",
//     remark: "",
//     cgst: "",
//     sgst: "",
//     igst: "",
//   });

//   const [vendors, setVendors] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedRows, setSelectedRows] = useState({});
//   const [productSearchTerm, setProductSearchTerm] = useState("");
//   const [errors, setErrors] = useState({});

//   const [showVendorModal, setShowVendorModal] =
//     useState(false);

//   const [showSerialModal, setShowSerialModal] =
//     useState(false);

//   const [selectedProductForSerial, setSelectedProductForSerial] =
//     useState(null);

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const [alert, setAlert] = useState({
//     visible: false,
//     type: "success",
//     message: "",
//   });

//   const [selectionOrder, setSelectionOrder] = useState([]);
//   const selectionCounter = useRef(0);

//   // --------------------------------------------------
//   // Alert
//   // --------------------------------------------------
//   const showAlert = (type, message) => {
//     setAlert({
//       visible: true,
//       type,
//       message,
//     });

//     setTimeout(() => {
//       setAlert((prev) => ({
//         ...prev,
//         visible: false,
//       }));
//     }, 5000);
//   };

//   // --------------------------------------------------
//   // Fetch Vendors
//   // --------------------------------------------------
//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const res = await axiosInstance.get("/vendor");

//         setVendors(res.data.data || []);
//       } catch (error) {
//         console.log("error fetching vendors", error);
//         showAlert(
//           "danger",
//           "Failed to fetch vendors"
//         );
//       }
//     };

//     fetchVendors();
//   }, []);

//   // --------------------------------------------------
//   // Fetch Products
//   // --------------------------------------------------
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axiosInstance.get(
//           "/stockpurchase/products/with-stock"
//         );

//         if (res.data.success) {
//           setProducts(res.data.data);
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching products:",
//           error
//         );

//         showAlert(
//           "danger",
//           "Failed to fetch products"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // --------------------------------------------------
//   // Fetch Stock Purchase For Edit
//   // --------------------------------------------------
//   useEffect(() => {
//     const fetchStockPurchase = async () => {
//       if (!id) return;

//       try {
//         const res = await axiosInstance.get(
//           `/stockpurchase/${id}`
//         );

//         if (res.data.success) {
//           const data = res.data.data;

//           setFormData({
//             type: data.type,
//             date: data.date.split("T")[0],
//             invoiceNo: data.invoiceNo,
//             vendor: data.vendor.businessName,
//             vendor_id:
//               data.vendor._id || data.vendor.id,
//             transportAmount: data.transportAmount,
//             remark: data.remark,
//             cgst: data.cgst,
//             sgst: data.sgst,
//             igst: data.igst,
//           });

//           const selected = {};
//           const order = [];

//           data.products.forEach((prod, index) => {
//             let serialNumbers = [];

//             if (
//               prod.serialNumbers &&
//               prod.serialNumbers.length > 0
//             ) {
//               serialNumbers =
//                 prod.serialNumbers.map((sn) =>
//                   typeof sn === "string"
//                     ? sn
//                     : sn.serialNumber || sn
//                 );
//             }

//             selected[prod.product._id] = {
//               quantity:
//                 prod.purchasedQuantity.toString(),
//               price: prod.price.toString(),
//               productRemark:
//                 prod.productRemark || "",
//               productInStock:
//                 prod.product.stock?.currentStock || 0,
//               trackSerialNumber:
//                 prod.product.trackSerialNumber,
//               serialNumbers,
//             };

//             order.push({
//               productId: prod.product._id,
//               order: index,
//             });
//           });

//           setSelectedRows(selected);
//           setSelectionOrder(order);
//           selectionCounter.current =
//             data.products.length;
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching stock purchase for edit:",
//           error
//         );

//         showAlert(
//           "danger",
//           "Failed to fetch stock purchase data"
//         );
//       }
//     };

//     fetchStockPurchase();
//   }, [id]);

//   // --------------------------------------------------
//   // Form Change
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
//   };

//   // --------------------------------------------------
//   // Vendor Select
//   // --------------------------------------------------
//   const handleVendorSelect = (selectedOption) => {
//     if (selectedOption) {
//       setFormData((prev) => ({
//         ...prev,
//         vendor_id: selectedOption.value,
//         vendor: selectedOption.label,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         vendor_id: "",
//         vendor: "",
//       }));
//     }

//     setErrors((prev) => ({
//       ...prev,
//       vendor: "",
//     }));
//   };

//   // --------------------------------------------------
//   // Product Select
//   // --------------------------------------------------
//   const handleRowSelect = (
//     productId,
//     productPrice,
//     productStock,
//     trackSerialNumber
//   ) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };

//       if (updated[productId]) {
//         setSelectionOrder((prevOrder) =>
//           prevOrder.filter(
//             (item) => item.productId !== productId
//           )
//         );

//         delete updated[productId];

//         setErrors((prevErrors) => {
//           const newErrors = {
//             ...prevErrors,
//           };

//           delete newErrors[
//             `quantity_${productId}`
//           ];

//           delete newErrors[
//             `serial_${productId}`
//           ];

//           return newErrors;
//         });
//       } else {
//         const newOrder = selectionCounter.current++;

//         setSelectionOrder((prevOrder) => [
//           ...prevOrder,
//           {
//             productId,
//             order: newOrder,
//           },
//         ]);

//         updated[productId] = {
//           quantity: "1",
//           productRemark: "",
//           price: (
//             productPrice || 0
//           ).toString(),
//           productInStock:
//             productStock || 0,
//           trackSerialNumber,
//           serialNumbers: [],
//         };
//       }

//       return updated;
//     });

//     setErrors((prev) => ({
//       ...prev,
//       products: "",
//     }));
//   };

//   // --------------------------------------------------
//   // Product Row Input
//   // --------------------------------------------------
//   const handleRowInputChange = (
//     productId,
//     field,
//     value
//   ) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         [field]: value,
//       },
//     }));

//     if (field === "quantity") {
//       setErrors((prev) => ({
//         ...prev,
//         [`quantity_${productId}`]: "",
//       }));
//     }
//   };

//   // --------------------------------------------------
//   // Vendor Modal
//   // --------------------------------------------------
//   const handleAddVendor = () => {
//     setShowVendorModal(true);
//   };

//   const handleVendorAdded = (newVendor) => {
//     setVendors((prev) => [
//       ...prev,
//       newVendor,
//     ]);

//     setFormData((prev) => ({
//       ...prev,
//       vendor: newVendor.businessName,
//       vendor_id:
//         newVendor._id || newVendor.id,
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       vendor: "",
//     }));

//     showAlert(
//       "success",
//       "Vendor added successfully!"
//     );
//   };

//   // --------------------------------------------------
//   // Serial Modal
//   // --------------------------------------------------
//   const handleOpenSerialModal = (product) => {
//     setSelectedProductForSerial(product);
//     setShowSerialModal(true);
//   };

//   const handleSerialNumbersSave = (
//     productId,
//     serialNumbers
//   ) => {
//     const serialsArray = serialNumbers
//       .split("\n")
//       .map((sn) => sn.trim())
//       .filter((sn) => sn.length > 0);

//     setSelectedRows((prev) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         serialNumbers: serialsArray,
//       },
//     }));

//     setShowSerialModal(false);
//     setSelectedProductForSerial(null);

//     setErrors((prev) => ({
//       ...prev,
//       [`serial_${productId}`]: "",
//     }));

//     showAlert(
//       "success",
//       "Serial numbers saved successfully!"
//     );
//   };

//   // --------------------------------------------------
//   // Validation
//   // --------------------------------------------------
//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.type.trim()) {
//       newErrors.type = "Type is required";
//     }

//     if (!formData.date) {
//       newErrors.date = "Date is required";
//     }

//     if (!formData.invoiceNo.trim()) {
//       newErrors.invoiceNo =
//         "Invoice No is required";
//     }

//     if (!formData.vendor_id) {
//       newErrors.vendor = "Vendor is required";
//     }

//     const selectedProducts =
//       Object.keys(selectedRows);

//     if (selectedProducts.length === 0) {
//       newErrors.products =
//         "At least one product must be selected";
//     } else {
//       let hasValidProduct = false;

//       selectedProducts.forEach((productId) => {
//         const row = selectedRows[productId];

//         const quantity = parseInt(
//           row.quantity,
//           10
//         );

//         if (!quantity || quantity <= 0) {
//           newErrors[
//             `quantity_${productId}`
//           ] =
//             "Quantity must be greater than 0";
//         } else {
//           hasValidProduct = true;
//         }

//         if (
//           row.trackSerialNumber === "Yes"
//         ) {
//           const serialCount = row.serialNumbers
//             ? row.serialNumbers.length
//             : 0;

//           if (serialCount !== quantity) {
//             newErrors[
//               `serial_${productId}`
//             ] =
//               `Serial numbers (${serialCount}) must match quantity (${quantity})`;
//           }
//         }
//       });

//       if (!hasValidProduct) {
//         newErrors.products =
//           "All selected products must have valid quantity";
//       }
//     }

//     return newErrors;
//   };

//   // --------------------------------------------------
//   // Prepare Submit Data
//   // --------------------------------------------------
//   const prepareSubmitData = () => {
//     const productsData = Object.keys(
//       selectedRows
//     )
//       .filter(
//         (productId) =>
//           selectedRows[productId] &&
//           parseInt(
//             selectedRows[productId].quantity,
//             10
//           ) > 0
//       )
//       .map((productId) => {
//         const row =
//           selectedRows[productId];

//         const productData = {
//           product: productId,
//           price:
//             parseFloat(row.price) || 0,
//           purchasedQuantity:
//             parseInt(row.quantity, 10) || 0,
//         };

//         if (
//           row.serialNumbers !== undefined
//         ) {
//           productData.serialNumbers =
//             row.serialNumbers;
//         }

//         if (row.productRemark) {
//           productData.productRemark =
//             row.productRemark;
//         }

//         return productData;
//       });

//     return {
//       type: formData.type,
//       date: new Date(
//         formData.date
//       ).toISOString(),
//       invoiceNo:
//         formData.invoiceNo.trim(),
//       vendor: formData.vendor_id,
//       transportAmount:
//         parseFloat(
//           formData.transportAmount
//         ) || 0,
//       remark: formData.remark,
//       cgst:
//         parseFloat(formData.cgst) || 0,
//       sgst:
//         parseFloat(formData.sgst) || 0,
//       igst:
//         parseFloat(formData.igst) || 0,
//       products: productsData,
//     };
//   };

//   // --------------------------------------------------
//   // Reset
//   // --------------------------------------------------
//   const handleReset = () => {
//     setFormData({
//       type: "",
//       date: new Date()
//         .toISOString()
//         .split("T")[0],
//       invoiceNo: "",
//       vendor: "",
//       vendor_id: "",
//       transportAmount: "",
//       remark: "",
//       cgst: "",
//       sgst: "",
//       igst: "",
//     });

//     setSelectedRows({});
//     setProductSearchTerm("");
//     setErrors({});
//     setSelectionOrder([]);
//     selectionCounter.current = 0;

//     showAlert(
//       "info",
//       "Form has been reset"
//     );
//   };

//   // --------------------------------------------------
//   // Submit
//   // --------------------------------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setSubmitting(true);
//     setErrors({});

//     const newErrors = validateForm();

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setSubmitting(false);

//       const firstErrorKey =
//         Object.keys(newErrors)[0];

//       if (firstErrorKey) {
//         const elementId =
//           firstErrorKey.includes(
//             "quantity_"
//           ) ||
//           firstErrorKey.includes("serial_")
//             ? "products-section"
//             : firstErrorKey;

//         const element =
//           document.getElementById(
//             elementId
//           ) ||
//           document.querySelector(
//             `[name="${firstErrorKey}"]`
//           );

//         if (element) {
//           element.scrollIntoView({
//             behavior: "smooth",
//             block: "center",
//           });

//           element.focus();
//         }
//       }

//       showAlert(
//         "warning",
//         "Please fix the form errors before submitting"
//       );

//       return;
//     }

//     try {
//       const submitData =
//         prepareSubmitData();

//       let response;

//       if (id) {
//         response = await axiosInstance.put(
//           `/stockpurchase/${id}`,
//           submitData
//         );
//       } else {
//         response =
//           await axiosInstance.post(
//             "/stockpurchase",
//             submitData
//           );
//       }

//       if (response.data.success) {
//         showAlert(
//           "success",
//           `Stock purchase ${
//             id ? "updated" : "created"
//           } successfully!`
//         );

//         setTimeout(() => {
//           navigate("/stock-purchase");
//         }, 1500);
//       } else {
//         showAlert(
//           "danger",
//           response.data.message ||
//             "Failed to save stock purchase"
//         );

//         setSubmitting(false);
//       }
//     } catch (error) {
//       console.error(
//         "Error saving stock purchase:",
//         error
//       );

//       let errorMessage =
//         "Failed to save stock purchase";

//       if (error.response?.data) {
//         const err =
//           error.response.data;

//         if (
//           err.errors &&
//           Array.isArray(err.errors)
//         ) {
//           const backendErrors = {};

//           err.errors.forEach((item) => {
//             if (item.field) {
//               backendErrors[item.field] =
//                 item.message;
//             }
//           });

//           if (
//             Object.keys(
//               backendErrors
//             ).length > 0
//           ) {
//             setErrors(backendErrors);

//             showAlert(
//               "danger",
//               "Please check the form for errors"
//             );

//             setSubmitting(false);
//             return;
//           }
//         } else if (err.message) {
//           errorMessage = err.message;
//         }
//       }

//       showAlert(
//         "danger",
//         errorMessage
//       );

//       setSubmitting(false);
//     }
//   };

//   // --------------------------------------------------
//   // Filter Products
//   // --------------------------------------------------
//   const filteredProducts = products
//     .filter((product) =>
//       product.productTitle
//         ?.toLowerCase()
//         .includes(
//           productSearchTerm.toLowerCase()
//         )
//     )
//     .sort((a, b) => {
//       const aSelected =
//         !!selectedRows[a._id];

//       const bSelected =
//         !!selectedRows[b._id];

//       if (aSelected && bSelected) {
//         const aOrder =
//           selectionOrder.find(
//             (item) =>
//               item.productId === a._id
//           )?.order || 0;

//         const bOrder =
//           selectionOrder.find(
//             (item) =>
//               item.productId === b._id
//           )?.order || 0;

//         return aOrder - bOrder;
//       }

//       if (aSelected && !bSelected)
//         return -1;

//       if (!aSelected && bSelected)
//         return 1;

//       return 0;
//     });

//   // --------------------------------------------------
//   // Back
//   // --------------------------------------------------
//   const handleBack = () => {
//     navigate("/stock-purchase");
//   };

//   // --------------------------------------------------
//   // Select Styles
//   // --------------------------------------------------
//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: "40px",
//       borderRadius: "6px",
//       borderColor: state.isFocused
//         ? "#2563eb"
//         : "#d1d5db",
//       boxShadow: state.isFocused
//         ? "0 0 0 1px #2563eb"
//         : "none",
//       "&:hover": {
//         borderColor: "#2563eb",
//       },
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 9999,
//     }),
//   };

//   const inputClass = (hasError = false) =>
//     `h-10 w-full rounded-md border bg-white px-3 text-sm text-gray-700 outline-none transition ${
//       hasError
//         ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
//         : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//     }`;

//   const labelClass = (hasError = false) =>
//     `mb-1.5 block text-sm font-medium ${
//       hasError
//         ? "text-red-600"
//         : "text-gray-700"
//     }`;

//   // --------------------------------------------------
//   // Render
//   // --------------------------------------------------
//   return (
//     <div className="w-full">
//       {/* Page Header */}
//       <div className="mb-4 flex items-center">
//         <button
//           type="button"
//           onClick={handleBack}
//           className="mr-3 inline-flex items-center gap-2 rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>

//         <h1 className="text-2xl font-semibold text-gray-800">
//           {id ? "Edit" : "Add"} Stock Purchase
//         </h1>
//       </div>

//       {/* Main Card */}
//       <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex justify-end border-b border-gray-200 px-5 py-3">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//           >
//             <RotateCcw size={16} />
//             Reset
//           </button>
//         </div>

//         {/* Card Body */}
//         <div className="p-5">
//           {/* Alert */}
//           {alert.visible && (
//             <div
//               className={`mb-5 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
//                 alert.type === "success"
//                   ? "border-green-200 bg-green-50 text-green-700"
//                   : alert.type === "warning"
//                   ? "border-yellow-200 bg-yellow-50 text-yellow-700"
//                   : alert.type === "info"
//                   ? "border-blue-200 bg-blue-50 text-blue-700"
//                   : "border-red-200 bg-red-50 text-red-700"
//               }`}
//             >
//               <span>{alert.message}</span>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setAlert((prev) => ({
//                     ...prev,
//                     visible: false,
//                   }))
//                 }
//                 className="rounded p-1 hover:bg-black/5"
//               >
//                 <X size={17} />
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* Basic Details */}
//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
//               {/* Type */}
//               <div>
//                 <label
//                   htmlFor="type"
//                   className={labelClass(
//                     !!errors.type
//                   )}
//                 >
//                   Type{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <select
//                   id="type"
//                   name="type"
//                   value={formData.type}
//                   onChange={handleChange}
//                   className={inputClass(
//                     !!errors.type
//                   )}
//                 >
//                   <option value="">
//                     Select Type
//                   </option>
//                   <option value="new">
//                     New
//                   </option>
//                   <option value="refurbish">
//                     Refurbish
//                   </option>
//                 </select>

//                 {errors.type && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.type}
//                   </p>
//                 )}
//               </div>

//               {/* Date */}
//               <div>
//                 <label
//                   htmlFor="date"
//                   className={labelClass(
//                     !!errors.date
//                   )}
//                 >
//                   Date{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   className={inputClass(
//                     !!errors.date
//                   )}
//                 />

//                 {errors.date && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.date}
//                   </p>
//                 )}
//               </div>

//               {/* Invoice */}
//               <div>
//                 <label
//                   htmlFor="invoiceNo"
//                   className={labelClass(
//                     !!errors.invoiceNo
//                   )}
//                 >
//                   Invoice No{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   type="text"
//                   id="invoiceNo"
//                   name="invoiceNo"
//                   placeholder="Invoice No."
//                   value={formData.invoiceNo}
//                   onChange={handleChange}
//                   className={inputClass(
//                     !!errors.invoiceNo
//                   )}
//                 />

//                 {errors.invoiceNo && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.invoiceNo}
//                   </p>
//                 )}
//               </div>

//               {/* Vendor */}
//               <div>
//                 <label
//                   className={labelClass(
//                     !!errors.vendor
//                   )}
//                 >
//                   Vendor{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <div className="flex gap-2">
//                   <div className="min-w-0 flex-1">
//                     <Select
//                       inputId="vendor"
//                       name="vendor"
//                       placeholder="Search Vendor..."
//                       value={
//                         formData.vendor_id
//                           ? {
//                               value:
//                                 formData.vendor_id,
//                               label:
//                                 formData.vendor,
//                             }
//                           : null
//                       }
//                       onChange={
//                         handleVendorSelect
//                       }
//                       options={vendors.map(
//                         (vendor) => ({
//                           value:
//                             vendor._id ||
//                             vendor.id,
//                           label:
//                             vendor.businessName,
//                         })
//                       )}
//                       isClearable
//                       styles={selectStyles}
//                     />
//                   </div>

//                   <button
//                     type="button"
//                     onClick={handleAddVendor}
//                     className="inline-flex h-10 shrink-0 items-center gap-1 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700"
//                   >
//                     <Plus size={15} />
//                     ADD
//                   </button>
//                 </div>

//                 {errors.vendor && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.vendor}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Transport / Remark */}
//             <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
//               <div>
//                 <label
//                   htmlFor="transportAmount"
//                   className={labelClass()}
//                 >
//                   Transport Amount
//                 </label>

//                 <input
//                   type="number"
//                   id="transportAmount"
//                   name="transportAmount"
//                   value={
//                     formData.transportAmount
//                   }
//                   onChange={handleChange}
//                   placeholder="Transport Amount"
//                   min="0"
//                   step="0.01"
//                   className={inputClass()}
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="remark"
//                   className={labelClass()}
//                 >
//                   Remark
//                 </label>

//                 <textarea
//                   id="remark"
//                   name="remark"
//                   value={formData.remark}
//                   onChange={handleChange}
//                   placeholder="Remark"
//                   rows={3}
//                   className="min-h-[40px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Taxes */}
//             <div className="mt-7">
//               <h2 className="mb-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-800">
//                 Invoice Taxes
//               </h2>

//               <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
//                 <div>
//                   <label
//                     htmlFor="cgst"
//                     className={labelClass()}
//                   >
//                     CGST
//                   </label>

//                   <input
//                     type="number"
//                     id="cgst"
//                     name="cgst"
//                     value={formData.cgst}
//                     onChange={handleChange}
//                     placeholder="CGST"
//                     min="0"
//                     step="0.01"
//                     className={inputClass()}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="sgst"
//                     className={labelClass()}
//                   >
//                     SGST
//                   </label>

//                   <input
//                     type="number"
//                     id="sgst"
//                     name="sgst"
//                     value={formData.sgst}
//                     onChange={handleChange}
//                     placeholder="SGST"
//                     min="0"
//                     step="0.01"
//                     className={inputClass()}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="igst"
//                     className={labelClass()}
//                   >
//                     IGST
//                   </label>

//                   <input
//                     type="number"
//                     id="igst"
//                     name="igst"
//                     value={formData.igst}
//                     onChange={handleChange}
//                     placeholder="IGST"
//                     min="0"
//                     step="0.01"
//                     className={inputClass()}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Products */}
//             <div
//               className="mt-7"
//               id="products-section"
//             >
//               <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <h2 className="text-base font-semibold text-gray-800">
//                     Products

//                     {errors.products && (
//                       <span className="ml-2 text-sm font-normal text-red-600">
//                         ({errors.products})
//                       </span>
//                     )}
//                   </h2>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <label
//                     htmlFor="productSearch"
//                     className="whitespace-nowrap text-sm font-medium text-gray-700"
//                   >
//                     Search:
//                   </label>

//                   <div className="relative w-full sm:w-[250px]">
//                     <Search
//                       size={16}
//                       className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     />

//                     <input
//                       id="productSearch"
//                       type="text"
//                       value={productSearchTerm}
//                       onChange={(e) =>
//                         setProductSearchTerm(
//                           e.target.value
//                         )
//                       }
//                       placeholder="Search products..."
//                       className="h-9 w-full rounded-md border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Products Loading */}
//               {loading ? (
//                 <div className="flex justify-center py-8">
//                   <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto rounded-lg border border-gray-200">
//                   <table className="min-w-[850px] w-full border-collapse text-sm">
//                     <thead>
//                       <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
//                         <th className="border-b border-gray-200 px-4 py-3">
//                           Select
//                         </th>

//                         <th className="border-b border-gray-200 px-4 py-3">
//                           Product Name
//                         </th>

//                         <th className="border-b border-gray-200 px-4 py-3">
//                           Price
//                         </th>

//                         <th className="border-b border-gray-200 px-4 py-3">
//                           Available Qty
//                         </th>

//                         <th className="border-b border-gray-200 px-4 py-3">
//                           Purchase Qty
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {filteredProducts.length >
//                       0 ? (
//                         filteredProducts.map(
//                           (product) => {
//                             const selected =
//                               selectedRows[
//                                 product._id
//                               ];

//                             return (
//                               <tr
//                                 key={product._id}
//                                 className={`transition ${
//                                   selected
//                                     ? "bg-blue-50"
//                                     : "hover:bg-gray-50"
//                                 }`}
//                               >
//                                 {/* Checkbox */}
//                                 <td className="border-b border-gray-100 px-4 py-3">
//                                   <input
//                                     type="checkbox"
//                                     checked={
//                                       !!selected
//                                     }
//                                     onChange={() =>
//                                       handleRowSelect(
//                                         product._id,
//                                         product.productPrice,
//                                         product.stock
//                                           ?.currentStock,
//                                         product.trackSerialNumber
//                                       )
//                                     }
//                                     className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                   />
//                                 </td>

//                                 {/* Product */}
//                                 <td className="border-b border-gray-100 px-4 py-3 font-medium text-gray-700">
//                                   {
//                                     product.productTitle
//                                   }
//                                 </td>

//                                 {/* Price */}
//                                 <td className="border-b border-gray-100 px-4 py-3">
//                                   {selected ? (
//                                     <input
//                                       type="number"
//                                       value={
//                                         selected.price
//                                       }
//                                       onChange={(e) =>
//                                         handleRowInputChange(
//                                           product._id,
//                                           "price",
//                                           e.target.value
//                                         )
//                                       }
//                                       min="0"
//                                       step="0.01"
//                                       className="h-8 w-[100px] rounded-md border border-gray-300 px-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                     />
//                                   ) : (
//                                     <span className="text-gray-500">
//                                       -
//                                     </span>
//                                   )}
//                                 </td>

//                                 {/* Available */}
//                                 <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
//                                   {product.stock
//                                     ?.currentStock ||
//                                     0}
//                                 </td>

//                                 {/* Purchase Qty */}
//                                 <td className="border-b border-gray-100 px-4 py-3">
//                                   {selected ? (
//                                     <div className="flex items-start gap-2">
//                                       <div>
//                                         <input
//                                           type="number"
//                                           value={
//                                             selected.quantity
//                                           }
//                                           onChange={(
//                                             e
//                                           ) =>
//                                             handleRowInputChange(
//                                               product._id,
//                                               "quantity",
//                                               e.target
//                                                 .value
//                                             )
//                                           }
//                                           min="1"
//                                           className={`h-8 w-[100px] rounded-md border px-2 text-sm outline-none focus:ring-1 ${
//                                             errors[
//                                               `quantity_${product._id}`
//                                             ]
//                                               ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//                                               : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                                           }`}
//                                         />

//                                         {errors[
//                                           `quantity_${product._id}`
//                                         ] && (
//                                           <p className="mt-1 max-w-[180px] text-xs text-red-600">
//                                             {
//                                               errors[
//                                                 `quantity_${product._id}`
//                                               ]
//                                             }
//                                           </p>
//                                         )}

//                                         {errors[
//                                           `serial_${product._id}`
//                                         ] && (
//                                           <p className="mt-1 max-w-[220px] text-xs text-red-600">
//                                             {
//                                               errors[
//                                                 `serial_${product._id}`
//                                               ]
//                                             }
//                                           </p>
//                                         )}
//                                       </div>

//                                       {product.trackSerialNumber ===
//                                         "Yes" && (
//                                         <button
//                                           type="button"
//                                           onClick={() =>
//                                             handleOpenSerialModal(
//                                               product
//                                             )
//                                           }
//                                           title="Add Serial Numbers"
//                                           className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
//                                         >
//                                           <Hash
//                                             size={17}
//                                           />
//                                         </button>
//                                       )}
//                                     </div>
//                                   ) : (
//                                     <span className="text-gray-400">
//                                       -
//                                     </span>
//                                   )}
//                                 </td>
//                               </tr>
//                             );
//                           }
//                         )
//                       ) : (
//                         <tr>
//                           <td
//                             colSpan={5}
//                             className="px-4 py-10 text-center text-sm text-gray-500"
//                           >
//                             No products found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>

//             {/* Submit */}
//             <div className="mt-6 flex justify-end border-t border-gray-200 pt-5">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {submitting ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={16} />
//                     Submit
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Vendor Modal */}
//       <VendorModal
//         visible={showVendorModal}
//         onClose={() =>
//           setShowVendorModal(false)
//         }
//         onVendorAdded={handleVendorAdded}
//       />

//       {/* Serial Number Modal */}
//       <SerialNumberModal
//         visible={showSerialModal}
//         onClose={() => {
//           setShowSerialModal(false);
//           setSelectedProductForSerial(null);
//         }}
//         product={selectedProductForSerial}
//         selectedRow={
//           selectedProductForSerial
//             ? selectedRows[
//                 selectedProductForSerial._id
//               ]
//             : null
//         }
//         onSave={handleSerialNumbersSave}
//       />
//     </div>
//   );
// };

// export default AddStockPurchase;

// import React, { useEffect, useRef, useState } from "react";
// import {
//   ArrowLeft,
//   Plus,
//   RotateCcw,
//   Search,
//   X,
//   Save,
//   Hash,
// } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import Select from "react-select";

// import axiosInstance from "../../axiosInstance";import VendorModal from "./VendorModel";
// import SerialNumberModal from "./SerialNumberModel";

// const AddStockPurchase = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     type: "",
//     date: new Date().toISOString().split("T")[0],
//     invoiceNo: "",
//     vendor: "",
//     vendor_id: "",
//     transportAmount: "",
//     remark: "",
//     cgst: "",
//     sgst: "",
//     igst: "",
//   });

//   const [vendors, setVendors] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedRows, setSelectedRows] = useState({});
//   const [productSearchTerm, setProductSearchTerm] = useState("");
//   const [errors, setErrors] = useState({});

//   const [showVendorModal, setShowVendorModal] =
//     useState(false);

//   const [showSerialModal, setShowSerialModal] =
//     useState(false);

//   const [selectedProductForSerial, setSelectedProductForSerial] =
//     useState(null);

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const [alert, setAlert] = useState({
//     visible: false,
//     type: "success",
//     message: "",
//   });

//   const [selectionOrder, setSelectionOrder] = useState([]);
//   const selectionCounter = useRef(0);

//   // --------------------------------------------------
//   // Alert
//   // --------------------------------------------------
//   const showAlert = (type, message) => {
//     setAlert({
//       visible: true,
//       type,
//       message,
//     });

//     setTimeout(() => {
//       setAlert((prev) => ({
//         ...prev,
//         visible: false,
//       }));
//     }, 5000);
//   };

//   // --------------------------------------------------
//   // Fetch Vendors
//   // --------------------------------------------------
//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const res = await axiosInstance.get("/vendor");

//         setVendors(res.data.data || []);
//       } catch (error) {
//         console.log("error fetching vendors", error);
//         showAlert(
//           "danger",
//           "Failed to fetch vendors"
//         );
//       }
//     };

//     fetchVendors();
//   }, []);

//   // --------------------------------------------------
//   // Fetch Products
//   // --------------------------------------------------
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axiosInstance.get(
//           "/stockpurchase/products/with-stock"
//         );

//         if (res.data.success) {
//           setProducts(res.data.data);
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching products:",
//           error
//         );

//         showAlert(
//           "danger",
//           "Failed to fetch products"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // --------------------------------------------------
//   // Fetch Stock Purchase For Edit
//   // --------------------------------------------------
//   useEffect(() => {
//     const fetchStockPurchase = async () => {
//       if (!id) return;

//       try {
//         const res = await axiosInstance.get(
//           `/stockpurchase/${id}`
//         );

//         if (res.data.success) {
//           const data = res.data.data;

//           setFormData({
//             type: data.type,
//             date: data.date.split("T")[0],
//             invoiceNo: data.invoiceNo,
//             vendor: data.vendor.businessName,
//             vendor_id:
//               data.vendor._id || data.vendor.id,
//             transportAmount: data.transportAmount,
//             remark: data.remark,
//             cgst: data.cgst,
//             sgst: data.sgst,
//             igst: data.igst,
//           });

//           const selected = {};
//           const order = [];

//           data.products.forEach((prod, index) => {
//             let serialNumbers = [];

//             if (
//               prod.serialNumbers &&
//               prod.serialNumbers.length > 0
//             ) {
//               serialNumbers =
//                 prod.serialNumbers.map((sn) =>
//                   typeof sn === "string"
//                     ? sn
//                     : sn.serialNumber || sn
//                 );
//             }

//             selected[prod.product._id] = {
//               quantity:
//                 prod.purchasedQuantity.toString(),
//               price: prod.price.toString(),
//               productRemark:
//                 prod.productRemark || "",
//               productInStock:
//                 prod.product.stock?.currentStock || 0,
//               trackSerialNumber:
//                 prod.product.trackSerialNumber,
//               serialNumbers,
//             };

//             order.push({
//               productId: prod.product._id,
//               order: index,
//             });
//           });

//           setSelectedRows(selected);
//           setSelectionOrder(order);
//           selectionCounter.current =
//             data.products.length;
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching stock purchase for edit:",
//           error
//         );

//         showAlert(
//           "danger",
//           "Failed to fetch stock purchase data"
//         );
//       }
//     };

//     fetchStockPurchase();
//   }, [id]);

//   // --------------------------------------------------
//   // Form Change
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
//   };

//   // --------------------------------------------------
//   // Vendor Select
//   // --------------------------------------------------
//   const handleVendorSelect = (selectedOption) => {
//     if (selectedOption) {
//       setFormData((prev) => ({
//         ...prev,
//         vendor_id: selectedOption.value,
//         vendor: selectedOption.label,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         vendor_id: "",
//         vendor: "",
//       }));
//     }

//     setErrors((prev) => ({
//       ...prev,
//       vendor: "",
//     }));
//   };

//   // --------------------------------------------------
//   // Product Select
//   // --------------------------------------------------
//   const handleRowSelect = (
//     productId,
//     productPrice,
//     productStock,
//     trackSerialNumber
//   ) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };

//       if (updated[productId]) {
//         setSelectionOrder((prevOrder) =>
//           prevOrder.filter(
//             (item) => item.productId !== productId
//           )
//         );

//         delete updated[productId];

//         setErrors((prevErrors) => {
//           const newErrors = {
//             ...prevErrors,
//           };

//           delete newErrors[
//             `quantity_${productId}`
//           ];

//           delete newErrors[
//             `serial_${productId}`
//           ];

//           return newErrors;
//         });
//       } else {
//         const newOrder = selectionCounter.current++;

//         setSelectionOrder((prevOrder) => [
//           ...prevOrder,
//           {
//             productId,
//             order: newOrder,
//           },
//         ]);

//         updated[productId] = {
//           quantity: "1",
//           productRemark: "",
//           price: (
//             productPrice || 0
//           ).toString(),
//           productInStock:
//             productStock || 0,
//           trackSerialNumber,
//           serialNumbers: [],
//         };
//       }

//       return updated;
//     });

//     setErrors((prev) => ({
//       ...prev,
//       products: "",
//     }));
//   };

//   // --------------------------------------------------
//   // Product Row Input
//   // --------------------------------------------------
//   const handleRowInputChange = (
//     productId,
//     field,
//     value
//   ) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         [field]: value,
//       },
//     }));

//     if (field === "quantity") {
//       setErrors((prev) => ({
//         ...prev,
//         [`quantity_${productId}`]: "",
//       }));
//     }
//   };

//   // --------------------------------------------------
//   // Vendor Modal
//   // --------------------------------------------------
//   const handleAddVendor = () => {
//     setShowVendorModal(true);
//   };

//   const handleVendorAdded = (newVendor) => {
//     setVendors((prev) => [
//       ...prev,
//       newVendor,
//     ]);

//     setFormData((prev) => ({
//       ...prev,
//       vendor: newVendor.businessName,
//       vendor_id:
//         newVendor._id || newVendor.id,
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       vendor: "",
//     }));

//     showAlert(
//       "success",
//       "Vendor added successfully!"
//     );
//   };

//   // --------------------------------------------------
//   // Serial Modal
//   // --------------------------------------------------
//   const handleOpenSerialModal = (product) => {
//     setSelectedProductForSerial(product);
//     setShowSerialModal(true);
//   };

//   const handleSerialNumbersSave = (
//     productId,
//     serialNumbers
//   ) => {
//     const serialsArray = serialNumbers
//       .split("\n")
//       .map((sn) => sn.trim())
//       .filter((sn) => sn.length > 0);

//     setSelectedRows((prev) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         serialNumbers: serialsArray,
//       },
//     }));

//     setShowSerialModal(false);
//     setSelectedProductForSerial(null);

//     setErrors((prev) => ({
//       ...prev,
//       [`serial_${productId}`]: "",
//     }));

//     showAlert(
//       "success",
//       "Serial numbers saved successfully!"
//     );
//   };

//   // --------------------------------------------------
//   // Validation
//   // --------------------------------------------------
//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.type.trim()) {
//       newErrors.type = "Type is required";
//     }

//     if (!formData.date) {
//       newErrors.date = "Date is required";
//     }

//     if (!formData.invoiceNo.trim()) {
//       newErrors.invoiceNo =
//         "Invoice No is required";
//     }

//     if (!formData.vendor_id) {
//       newErrors.vendor = "Vendor is required";
//     }

//     const selectedProducts =
//       Object.keys(selectedRows);

//     if (selectedProducts.length === 0) {
//       newErrors.products =
//         "At least one product must be selected";
//     } else {
//       let hasValidProduct = false;

//       selectedProducts.forEach((productId) => {
//         const row = selectedRows[productId];

//         const quantity = parseInt(
//           row.quantity,
//           10
//         );

//         if (!quantity || quantity <= 0) {
//           newErrors[
//             `quantity_${productId}`
//           ] =
//             "Quantity must be greater than 0";
//         } else {
//           hasValidProduct = true;
//         }

//         if (
//           row.trackSerialNumber === "Yes"
//         ) {
//           const serialCount = row.serialNumbers
//             ? row.serialNumbers.length
//             : 0;

//           if (serialCount !== quantity) {
//             newErrors[
//               `serial_${productId}`
//             ] =
//               `Serial numbers (${serialCount}) must match quantity (${quantity})`;
//           }
//         }
//       });

//       if (!hasValidProduct) {
//         newErrors.products =
//           "All selected products must have valid quantity";
//       }
//     }

//     return newErrors;
//   };

//   // --------------------------------------------------
//   // Prepare Submit Data
//   // --------------------------------------------------
//   const prepareSubmitData = () => {
//     const productsData = Object.keys(
//       selectedRows
//     )
//       .filter(
//         (productId) =>
//           selectedRows[productId] &&
//           parseInt(
//             selectedRows[productId].quantity,
//             10
//           ) > 0
//       )
//       .map((productId) => {
//         const row =
//           selectedRows[productId];

//         const productData = {
//           product: productId,
//           price:
//             parseFloat(row.price) || 0,
//           purchasedQuantity:
//             parseInt(row.quantity, 10) || 0,
//         };

//         if (
//           row.serialNumbers !== undefined
//         ) {
//           productData.serialNumbers =
//             row.serialNumbers;
//         }

//         if (row.productRemark) {
//           productData.productRemark =
//             row.productRemark;
//         }

//         return productData;
//       });

//     return {
//       type: formData.type,
//       date: new Date(
//         formData.date
//       ).toISOString(),
//       invoiceNo:
//         formData.invoiceNo.trim(),
//       vendor: formData.vendor_id,
//       transportAmount:
//         parseFloat(
//           formData.transportAmount
//         ) || 0,
//       remark: formData.remark,
//       cgst:
//         parseFloat(formData.cgst) || 0,
//       sgst:
//         parseFloat(formData.sgst) || 0,
//       igst:
//         parseFloat(formData.igst) || 0,
//       products: productsData,
//     };
//   };

//   // --------------------------------------------------
//   // Reset
//   // --------------------------------------------------
//   const handleReset = () => {
//     setFormData({
//       type: "",
//       date: new Date()
//         .toISOString()
//         .split("T")[0],
//       invoiceNo: "",
//       vendor: "",
//       vendor_id: "",
//       transportAmount: "",
//       remark: "",
//       cgst: "",
//       sgst: "",
//       igst: "",
//     });

//     setSelectedRows({});
//     setProductSearchTerm("");
//     setErrors({});
//     setSelectionOrder([]);
//     selectionCounter.current = 0;

//     showAlert(
//       "info",
//       "Form has been reset"
//     );
//   };

//   // --------------------------------------------------
//   // Submit
//   // --------------------------------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setSubmitting(true);
//     setErrors({});

//     const newErrors = validateForm();

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setSubmitting(false);

//       const firstErrorKey =
//         Object.keys(newErrors)[0];

//       if (firstErrorKey) {
//         const elementId =
//           firstErrorKey.includes(
//             "quantity_"
//           ) ||
//           firstErrorKey.includes("serial_")
//             ? "products-section"
//             : firstErrorKey;

//         const element =
//           document.getElementById(
//             elementId
//           ) ||
//           document.querySelector(
//             `[name="${firstErrorKey}"]`
//           );

//         if (element) {
//           element.scrollIntoView({
//             behavior: "smooth",
//             block: "center",
//           });

//           element.focus();
//         }
//       }

//       showAlert(
//         "warning",
//         "Please fix the form errors before submitting"
//       );

//       return;
//     }

//     try {
//       const submitData =
//         prepareSubmitData();

//       let response;

//       if (id) {
//         response = await axiosInstance.put(
//           `/stockpurchase/${id}`,
//           submitData
//         );
//       } else {
//         response =
//           await axiosInstance.post(
//             "/stockpurchase",
//             submitData
//           );
//       }

//       if (response.data.success) {
//         showAlert(
//           "success",
//           `Stock purchase ${
//             id ? "updated" : "created"
//           } successfully!`
//         );

//         setTimeout(() => {
//           navigate("/stock-purchase");
//         }, 1500);
//       } else {
//         showAlert(
//           "danger",
//           response.data.message ||
//             "Failed to save stock purchase"
//         );

//         setSubmitting(false);
//       }
//     } catch (error) {
//       console.error(
//         "Error saving stock purchase:",
//         error
//       );

//       let errorMessage =
//         "Failed to save stock purchase";

//       if (error.response?.data) {
//         const err =
//           error.response.data;

//         if (
//           err.errors &&
//           Array.isArray(err.errors)
//         ) {
//           const backendErrors = {};

//           err.errors.forEach((item) => {
//             if (item.field) {
//               backendErrors[item.field] =
//                 item.message;
//             }
//           });

//           if (
//             Object.keys(
//               backendErrors
//             ).length > 0
//           ) {
//             setErrors(backendErrors);

//             showAlert(
//               "danger",
//               "Please check the form for errors"
//             );

//             setSubmitting(false);
//             return;
//           }
//         } else if (err.message) {
//           errorMessage = err.message;
//         }
//       }

//       showAlert(
//         "danger",
//         errorMessage
//       );

//       setSubmitting(false);
//     }
//   };

//   // --------------------------------------------------
//   // Filter Products
//   // --------------------------------------------------
//   const filteredProducts = products
//     .filter((product) =>
//       product.productTitle
//         ?.toLowerCase()
//         .includes(
//           productSearchTerm.toLowerCase()
//         )
//     )
//     .sort((a, b) => {
//       const aSelected =
//         !!selectedRows[a._id];

//       const bSelected =
//         !!selectedRows[b._id];

//       if (aSelected && bSelected) {
//         const aOrder =
//           selectionOrder.find(
//             (item) =>
//               item.productId === a._id
//           )?.order || 0;

//         const bOrder =
//           selectionOrder.find(
//             (item) =>
//               item.productId === b._id
//           )?.order || 0;

//         return aOrder - bOrder;
//       }

//       if (aSelected && !bSelected)
//         return -1;

//       if (!aSelected && bSelected)
//         return 1;

//       return 0;
//     });

//   // --------------------------------------------------
//   // Back
//   // --------------------------------------------------
//   const handleBack = () => {
//     navigate("/stock-purchase");
//   };

//   // --------------------------------------------------
//   // Select Styles
//   // --------------------------------------------------
//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: "40px",
//       borderRadius: "6px",
//       borderColor: state.isFocused
//         ? "#2759A2"
//         : "#d1d5db",
//       boxShadow: state.isFocused
//         ? "0 0 0 1px #2759A2"
//         : "none",
//       "&:hover": {
//         borderColor: "#2759A2",
//       },
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 9999,
//     }),
//   };

//   const inputClass = (hasError = false) =>
//     `h-10 w-full rounded-md border bg-white px-3 text-sm text-gray-700 outline-none transition ${
//       hasError
//         ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
//         : "border-gray-300 focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
//     }`;

//   const labelClass = (hasError = false) =>
//     `mb-1.5 block text-sm font-medium ${
//       hasError
//         ? "text-red-600"
//         : "text-gray-700"
//     }`;

//   // --------------------------------------------------
//   // Render
//   // --------------------------------------------------
//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
//       {/* Page Header */}
//       <div className="mb-3 flex items-center">
//         <button
//           type="button"
//           onClick={handleBack}
//           className="mr-3 inline-flex items-center gap-1 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#214d8d]"
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>

//         <h1 className="text-[24px] font-[450] leading-tight text-[#212529]">
//           {id ? "Edit" : "Add"} Stock Purchase
//         </h1>
//       </div>

//       {/* Main Card */}
//       <div className="overflow-hidden rounded-sm border border-gray-200 border-t-4 border-t-[#2759A2] bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex justify-end border-b border-gray-200 px-4 py-3">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#214d8d]"
//           >
//             <RotateCcw size={16} />
//             Reset
//           </button>
//         </div>

//         {/* Card Body */}
//         <div className="p-4">
//           {/* Alert */}
//           {alert.visible && (
//             <div
//               className={`mb-5 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
//                 alert.type === "success"
//                   ? "border-green-200 bg-green-50 text-green-700"
//                   : alert.type === "warning"
//                   ? "border-yellow-200 bg-yellow-50 text-yellow-700"
//                   : alert.type === "info"
//                   ? "border-blue-200 bg-blue-50 text-blue-700"
//                   : "border-red-200 bg-red-50 text-red-700"
//               }`}
//             >
//               <span>{alert.message}</span>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setAlert((prev) => ({
//                     ...prev,
//                     visible: false,
//                   }))
//                 }
//                 className="rounded p-1 hover:bg-black/5"
//               >
//                 <X size={17} />
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* Basic Details */}
//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
//               {/* Type */}
//               <div>
//                 <label
//                   htmlFor="type"
//                   className={labelClass(
//                     !!errors.type
//                   )}
//                 >
//                   Type{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <select
//                   id="type"
//                   name="type"
//                   value={formData.type}
//                   onChange={handleChange}
//                   className={inputClass(
//                     !!errors.type
//                   )}
//                 >
//                   <option value="">
//                     Select Type
//                   </option>
//                   <option value="new">
//                     New
//                   </option>
//                   <option value="refurbish">
//                     Refurbish
//                   </option>
//                 </select>

//                 {errors.type && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.type}
//                   </p>
//                 )}
//               </div>

//               {/* Date */}
//               <div>
//                 <label
//                   htmlFor="date"
//                   className={labelClass(
//                     !!errors.date
//                   )}
//                 >
//                   Date{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   className={inputClass(
//                     !!errors.date
//                   )}
//                 />

//                 {errors.date && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.date}
//                   </p>
//                 )}
//               </div>

//               {/* Invoice */}
//               <div>
//                 <label
//                   htmlFor="invoiceNo"
//                   className={labelClass(
//                     !!errors.invoiceNo
//                   )}
//                 >
//                   Invoice No{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   type="text"
//                   id="invoiceNo"
//                   name="invoiceNo"
//                   placeholder="Invoice No."
//                   value={formData.invoiceNo}
//                   onChange={handleChange}
//                   className={inputClass(
//                     !!errors.invoiceNo
//                   )}
//                 />

//                 {errors.invoiceNo && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.invoiceNo}
//                   </p>
//                 )}
//               </div>

//               {/* Vendor */}
//               <div>
//                 <label
//                   className={labelClass(
//                     !!errors.vendor
//                   )}
//                 >
//                   Vendor{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <div className="flex gap-2">
//                   <div className="min-w-0 flex-1">
//                     <Select
//                       inputId="vendor"
//                       name="vendor"
//                       placeholder="Search Vendor..."
//                       value={
//                         formData.vendor_id
//                           ? {
//                               value:
//                                 formData.vendor_id,
//                               label:
//                                 formData.vendor,
//                             }
//                           : null
//                       }
//                       onChange={
//                         handleVendorSelect
//                       }
//                       options={vendors.map(
//                         (vendor) => ({
//                           value:
//                             vendor._id ||
//                             vendor.id,
//                           label:
//                             vendor.businessName,
//                         })
//                       )}
//                       isClearable
//                       styles={selectStyles}
//                     />
//                   </div>

//                   <button
//                     type="button"
//                     onClick={handleAddVendor}
//                     className="inline-flex h-10 shrink-0 items-center gap-1 rounded-sm bg-[#2759A2] px-3 text-sm font-semibold text-white transition hover:bg-[#214d8d]"
//                   >
//                     <Plus size={15} />
//                     ADD
//                   </button>
//                 </div>

//                 {errors.vendor && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.vendor}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Transport / Remark */}
//             <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
//               <div>
//                 <label
//                   htmlFor="transportAmount"
//                   className={labelClass()}
//                 >
//                   Transport Amount
//                 </label>

//                 <input
//                   type="number"
//                   id="transportAmount"
//                   name="transportAmount"
//                   value={
//                     formData.transportAmount
//                   }
//                   onChange={handleChange}
//                   placeholder="Transport Amount"
//                   min="0"
//                   step="0.01"
//                   className={inputClass()}
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="remark"
//                   className={labelClass()}
//                 >
//                   Remark
//                 </label>

//                 <textarea
//                   id="remark"
//                   name="remark"
//                   value={formData.remark}
//                   onChange={handleChange}
//                   placeholder="Remark"
//                   rows={3}
//                   className="min-h-[40px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
//                 />
//               </div>
//             </div>

//             {/* Taxes */}
//             <div className="mt-6">
//               <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-normal text-[#343a40]">
//                 Invoice Taxes
//               </h2>

//               <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
//                 <div>
//                   <label
//                     htmlFor="cgst"
//                     className={labelClass()}
//                   >
//                     CGST
//                   </label>

//                   <input
//                     type="number"
//                     id="cgst"
//                     name="cgst"
//                     value={formData.cgst}
//                     onChange={handleChange}
//                     placeholder="CGST"
//                     min="0"
//                     step="0.01"
//                     className={inputClass()}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="sgst"
//                     className={labelClass()}
//                   >
//                     SGST
//                   </label>

//                   <input
//                     type="number"
//                     id="sgst"
//                     name="sgst"
//                     value={formData.sgst}
//                     onChange={handleChange}
//                     placeholder="SGST"
//                     min="0"
//                     step="0.01"
//                     className={inputClass()}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="igst"
//                     className={labelClass()}
//                   >
//                     IGST
//                   </label>

//                   <input
//                     type="number"
//                     id="igst"
//                     name="igst"
//                     value={formData.igst}
//                     onChange={handleChange}
//                     placeholder="IGST"
//                     min="0"
//                     step="0.01"
//                     className={inputClass()}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Products */}
//             <div
//               className="mt-6"
//               id="products-section"
//             >
//               <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <h2 className="text-xl font-normal text-[#343a40]">
//                     Products

//                     {errors.products && (
//                       <span className="ml-2 text-sm font-normal text-red-600">
//                         ({errors.products})
//                       </span>
//                     )}
//                   </h2>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <label
//                     htmlFor="productSearch"
//                     className="whitespace-nowrap text-sm font-semibold text-gray-800"
//                   >
//                     Search:
//                   </label>

//                   <div className="relative w-full sm:w-[250px]">
//                     <Search
//                       size={16}
//                       className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     />

//                     <input
//                       id="productSearch"
//                       type="text"
//                       value={productSearchTerm}
//                       onChange={(e) =>
//                         setProductSearchTerm(
//                           e.target.value
//                         )
//                       }
//                       placeholder="Search products..."
//                       className="h-10 w-full rounded-sm border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Products Loading */}
//               {loading ? (
//                 <div className="flex justify-center py-8">
//                   <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2759A2]" />
//                 </div>
//               ) : (
//                 <div className="w-full overflow-y-auto overflow-x-hidden rounded-none border border-gray-200" style={{ maxHeight: "420px" }}>
//                   <table className="w-full table-fixed border-collapse text-sm">
//                       <colgroup>
//                         <col className="w-[7%]" />
//                         <col className="w-[45%]" />
//                         <col className="w-[12%]" />
//                         <col className="w-[18%]" />
//                         <col className="w-[18%]" />
//                       </colgroup>
//                     <thead className="sticky top-0 z-10">
//                       <tr className="bg-white text-left text-sm font-bold text-gray-900">
//                         <th className="border-b border-gray-200 bg-white px-3 py-3">
//                           Select
//                         </th>

//                         <th className="border-b border-gray-200 bg-white px-3 py-3">
//                           Product Name
//                         </th>

//                         <th className="border-b border-gray-200 bg-white px-3 py-3">
//                           Price
//                         </th>

//                         <th className="border-b border-gray-200 bg-white px-3 py-3">
//                           Available Qty
//                         </th>

//                         <th className="border-b border-gray-200 bg-white px-3 py-3">
//                           Purchase Qty
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {filteredProducts.length >
//                       0 ? (
//                         filteredProducts.map(
//                           (product) => {
//                             const selected =
//                               selectedRows[
//                                 product._id
//                               ];

//                             return (
//                               <tr
//                                 key={product._id}
//                                 className={`border-b border-gray-100 transition ${
//                                   selected
//                                     ? "bg-[#d9ead3]"
//                                     : "hover:bg-blue-50"
//                                 }`}
//                               >
//                                 {/* Checkbox */}
//                                 <td className="border-b border-gray-100 px-3 py-3">
//                                   <input
//                                     type="checkbox"
//                                     checked={
//                                       !!selected
//                                     }
//                                     onChange={() =>
//                                       handleRowSelect(
//                                         product._id,
//                                         product.productPrice,
//                                         product.stock
//                                           ?.currentStock,
//                                         product.trackSerialNumber
//                                       )
//                                     }
//                                     className="h-5 w-5 cursor-pointer rounded border-gray-300 text-[#2759A2] focus:ring-[#2759A2]"
//                                   />
//                                 </td>

//                                 {/* Product */}
//                                 <td className="border-b border-gray-100 px-3 py-3 font-normal text-gray-800">
//                                   {
//                                     product.productTitle
//                                   }
//                                 </td>

//                                 {/* Price */}
//                                 <td className="border-b border-gray-100 px-3 py-3">
//                                   {selected ? (
//                                     <input
//                                       type="number"
//                                       value={
//                                         selected.price
//                                       }
//                                       onChange={(e) =>
//                                         handleRowInputChange(
//                                           product._id,
//                                           "price",
//                                           e.target.value
//                                         )
//                                       }
//                                       min="0"
//                                       step="0.01"
//                                       className="h-8 w-[105px] rounded-sm border border-gray-300 bg-white px-2 text-sm outline-none focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
//                                     />
//                                   ) : (
//                                     <span className="text-gray-500">
//                                       -
//                                     </span>
//                                   )}
//                                 </td>

//                                 {/* Available */}
//                                 <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
//                                   {product.stock
//                                     ?.currentStock ||
//                                     0}
//                                 </td>

//                                 {/* Purchase Qty */}
//                                 <td className="border-b border-gray-100 px-3 py-3">
//                                   {selected ? (
//                                     <div className="flex items-start gap-2">
//                                       <div>
//                                         <input
//                                           type="number"
//                                           value={
//                                             selected.quantity
//                                           }
//                                           onChange={(
//                                             e
//                                           ) =>
//                                             handleRowInputChange(
//                                               product._id,
//                                               "quantity",
//                                               e.target
//                                                 .value
//                                             )
//                                           }
//                                           min="1"
//                                           className={`h-8 w-[105px] rounded-sm border px-2 text-sm outline-none focus:ring-1 ${
//                                             errors[
//                                               `quantity_${product._id}`
//                                             ]
//                                               ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//                                               : "border-gray-300 focus:border-[#2759A2] focus:ring-[#2759A2]"
//                                           }`}
//                                         />

//                                         {errors[
//                                           `quantity_${product._id}`
//                                         ] && (
//                                           <p className="mt-1 max-w-[180px] text-xs text-red-600">
//                                             {
//                                               errors[
//                                                 `quantity_${product._id}`
//                                               ]
//                                             }
//                                           </p>
//                                         )}

//                                         {errors[
//                                           `serial_${product._id}`
//                                         ] && (
//                                           <p className="mt-1 max-w-[220px] text-xs text-red-600">
//                                             {
//                                               errors[
//                                                 `serial_${product._id}`
//                                               ]
//                                             }
//                                           </p>
//                                         )}
//                                       </div>

//                                       {product.trackSerialNumber ===
//                                         "Yes" && (
//                                         <button
//                                           type="button"
//                                           onClick={() =>
//                                             handleOpenSerialModal(
//                                               product
//                                             )
//                                           }
//                                           title="Add Serial Numbers"
//                                           className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-sm border border-blue-200 bg-blue-50 text-[#2759A2] transition hover:bg-blue-100"
//                                         >
//                                           <Hash
//                                             size={17}
//                                           />
//                                         </button>
//                                       )}
//                                     </div>
//                                   ) : (
//                                     <span className="text-gray-400">
//                                       -
//                                     </span>
//                                   )}
//                                 </td>
//                               </tr>
//                             );
//                           }
//                         )
//                       ) : (
//                         <tr>
//                           <td
//                             colSpan={5}
//                             className="px-4 py-10 text-center text-sm text-gray-500"
//                           >
//                             No products found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>

//             {/* Submit */}
//             <div className="mt-5 flex justify-end border-t border-gray-200 pt-4">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-md bg-[#2759A2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214d8d] disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {submitting ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={16} />
//                     Submit
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Vendor Modal */}
//       <VendorModal
//         visible={showVendorModal}
//         onClose={() =>
//           setShowVendorModal(false)
//         }
//         onVendorAdded={handleVendorAdded}
//       />

//       {/* Serial Number Modal */}
//       <SerialNumberModal
//         visible={showSerialModal}
//         onClose={() => {
//           setShowSerialModal(false);
//           setSelectedProductForSerial(null);
//         }}
//         product={selectedProductForSerial}
//         selectedRow={
//           selectedProductForSerial
//             ? selectedRows[
//                 selectedProductForSerial._id
//               ]
//             : null
//         }
//         onSave={handleSerialNumbersSave}
//       />
//     </div>
//   );
// };

// export default AddStockPurchase;


import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Plus,
  RotateCcw,
  Search,
  X,
  Save,
  Menu,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

import axiosInstance from "../../axiosInstance";import VendorModal from "./VendorModel";
import SerialNumberModal from "./SerialNumberModel";

const AddStockPurchase = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    type: "",
    date: new Date().toISOString().split("T")[0],
    invoiceNo: "",
    vendor: "",
    vendor_id: "",
    transportAmount: "",
    remark: "",
    cgst: "",
    sgst: "",
    igst: "",
  });

  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [errors, setErrors] = useState({});

  const [showVendorModal, setShowVendorModal] =
    useState(false);

  const [showSerialModal, setShowSerialModal] =
    useState(false);

  const [selectedProductForSerial, setSelectedProductForSerial] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [alert, setAlert] = useState({
    visible: false,
    type: "success",
    message: "",
  });

  const [selectionOrder, setSelectionOrder] = useState([]);
  const selectionCounter = useRef(0);

  // --------------------------------------------------
  // Alert
  // --------------------------------------------------
  const showAlert = (type, message) => {
    setAlert({
      visible: true,
      type,
      message,
    });

    setTimeout(() => {
      setAlert((prev) => ({
        ...prev,
        visible: false,
      }));
    }, 5000);
  };

  // --------------------------------------------------
  // Fetch Vendors
  // --------------------------------------------------
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axiosInstance.get("/vendor");

        setVendors(res.data.data || []);
      } catch (error) {
        console.log("error fetching vendors", error);
        showAlert(
          "danger",
          "Failed to fetch vendors"
        );
      }
    };

    fetchVendors();
  }, []);

  // --------------------------------------------------
  // Fetch Products
  // --------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get(
          "/stockpurchase/products/with-stock"
        );

        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );

        showAlert(
          "danger",
          "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --------------------------------------------------
  // Fetch Stock Purchase For Edit
  // --------------------------------------------------
  useEffect(() => {
    const fetchStockPurchase = async () => {
      if (!id) return;

      try {
        const res = await axiosInstance.get(
          `/stockpurchase/${id}`
        );

        if (res.data.success) {
          const data = res.data.data;

          setFormData({
            type: data.type,
            date: data.date.split("T")[0],
            invoiceNo: data.invoiceNo,
            vendor: data.vendor.businessName,
            vendor_id:
              data.vendor._id || data.vendor.id,
            transportAmount: data.transportAmount,
            remark: data.remark,
            cgst: data.cgst,
            sgst: data.sgst,
            igst: data.igst,
          });

          const selected = {};
          const order = [];

          data.products.forEach((prod, index) => {
            let serialNumbers = [];

            if (
              prod.serialNumbers &&
              prod.serialNumbers.length > 0
            ) {
              serialNumbers =
                prod.serialNumbers.map((sn) =>
                  typeof sn === "string"
                    ? sn
                    : sn.serialNumber || sn
                );
            }

            selected[prod.product._id] = {
              quantity:
                prod.purchasedQuantity.toString(),
              price: prod.price.toString(),
              productRemark:
                prod.productRemark || "",
              productInStock:
                prod.product.stock?.currentStock || 0,
              trackSerialNumber:
                prod.product.trackSerialNumber,
              serialNumbers,
            };

            order.push({
              productId: prod.product._id,
              order: index,
            });
          });

          setSelectedRows(selected);
          setSelectionOrder(order);
          selectionCounter.current =
            data.products.length;
        }
      } catch (error) {
        console.error(
          "Error fetching stock purchase for edit:",
          error
        );

        showAlert(
          "danger",
          "Failed to fetch stock purchase data"
        );
      }
    };

    fetchStockPurchase();
  }, [id]);

  // --------------------------------------------------
  // Form Change
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // --------------------------------------------------
  // Vendor Select
  // --------------------------------------------------
  const handleVendorSelect = (selectedOption) => {
    if (selectedOption) {
      setFormData((prev) => ({
        ...prev,
        vendor_id: selectedOption.value,
        vendor: selectedOption.label,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        vendor_id: "",
        vendor: "",
      }));
    }

    setErrors((prev) => ({
      ...prev,
      vendor: "",
    }));
  };

  // --------------------------------------------------
  // Product Select
  // --------------------------------------------------
  const handleRowSelect = (
    productId,
    productPrice,
    productStock,
    trackSerialNumber
  ) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };

      if (updated[productId]) {
        setSelectionOrder((prevOrder) =>
          prevOrder.filter(
            (item) => item.productId !== productId
          )
        );

        delete updated[productId];

        setErrors((prevErrors) => {
          const newErrors = {
            ...prevErrors,
          };

          delete newErrors[
            `quantity_${productId}`
          ];

          delete newErrors[
            `serial_${productId}`
          ];

          return newErrors;
        });
      } else {
        const newOrder = selectionCounter.current++;

        setSelectionOrder((prevOrder) => [
          ...prevOrder,
          {
            productId,
            order: newOrder,
          },
        ]);

        updated[productId] = {
          quantity: "1",
          productRemark: "",
          price: (
            productPrice || 0
          ).toString(),
          productInStock:
            productStock || 0,
          trackSerialNumber,
          serialNumbers: [],
        };
      }

      return updated;
    });

    setErrors((prev) => ({
      ...prev,
      products: "",
    }));
  };

  // --------------------------------------------------
  // Product Row Input
  // --------------------------------------------------
  const handleRowInputChange = (
    productId,
    field,
    value
  ) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));

    if (field === "quantity") {
      setErrors((prev) => ({
        ...prev,
        [`quantity_${productId}`]: "",
      }));
    }
  };

  // --------------------------------------------------
  // Vendor Modal
  // --------------------------------------------------
  const handleAddVendor = () => {
    setShowVendorModal(true);
  };

  const handleVendorAdded = (newVendor) => {
    setVendors((prev) => [
      ...prev,
      newVendor,
    ]);

    setFormData((prev) => ({
      ...prev,
      vendor: newVendor.businessName,
      vendor_id:
        newVendor._id || newVendor.id,
    }));

    setErrors((prev) => ({
      ...prev,
      vendor: "",
    }));

    showAlert(
      "success",
      "Vendor added successfully!"
    );
  };

  // --------------------------------------------------
  // Serial Modal
  // --------------------------------------------------
  const handleOpenSerialModal = (product) => {
    setSelectedProductForSerial(product);
    setShowSerialModal(true);
  };

  const handleSerialNumbersSave = (
    productId,
    serialNumbers
  ) => {
    const serialsArray = serialNumbers
      .split("\n")
      .map((sn) => sn.trim())
      .filter((sn) => sn.length > 0);

    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        serialNumbers: serialsArray,
      },
    }));

    setShowSerialModal(false);
    setSelectedProductForSerial(null);

    setErrors((prev) => ({
      ...prev,
      [`serial_${productId}`]: "",
    }));

    showAlert(
      "success",
      "Serial numbers saved successfully!"
    );
  };

  // --------------------------------------------------
  // Validation
  // --------------------------------------------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.type.trim()) {
      newErrors.type = "Type is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.invoiceNo.trim()) {
      newErrors.invoiceNo =
        "Invoice No is required";
    }

    if (!formData.vendor_id) {
      newErrors.vendor = "Vendor is required";
    }

    const selectedProducts =
      Object.keys(selectedRows);

    if (selectedProducts.length === 0) {
      newErrors.products =
        "At least one product must be selected";
    } else {
      let hasValidProduct = false;

      selectedProducts.forEach((productId) => {
        const row = selectedRows[productId];

        const quantity = parseInt(
          row.quantity,
          10
        );

        if (!quantity || quantity <= 0) {
          newErrors[
            `quantity_${productId}`
          ] =
            "Quantity must be greater than 0";
        } else {
          hasValidProduct = true;
        }

        if (
          row.trackSerialNumber === "Yes"
        ) {
          const serialCount = row.serialNumbers
            ? row.serialNumbers.length
            : 0;

          if (serialCount !== quantity) {
            newErrors[
              `serial_${productId}`
            ] =
              `Serial numbers (${serialCount}) must match quantity (${quantity})`;
          }
        }
      });

      if (!hasValidProduct) {
        newErrors.products =
          "All selected products must have valid quantity";
      }
    }

    return newErrors;
  };

  // --------------------------------------------------
  // Prepare Submit Data
  // --------------------------------------------------
  const prepareSubmitData = () => {
    const productsData = Object.keys(
      selectedRows
    )
      .filter(
        (productId) =>
          selectedRows[productId] &&
          parseInt(
            selectedRows[productId].quantity,
            10
          ) > 0
      )
      .map((productId) => {
        const row =
          selectedRows[productId];

        const productData = {
          product: productId,
          price:
            parseFloat(row.price) || 0,
          purchasedQuantity:
            parseInt(row.quantity, 10) || 0,
        };

        if (
          row.serialNumbers !== undefined
        ) {
          productData.serialNumbers =
            row.serialNumbers;
        }

        if (row.productRemark) {
          productData.productRemark =
            row.productRemark;
        }

        return productData;
      });

    return {
      type: formData.type,
      date: new Date(
        formData.date
      ).toISOString(),
      invoiceNo:
        formData.invoiceNo.trim(),
      vendor: formData.vendor_id,
      transportAmount:
        parseFloat(
          formData.transportAmount
        ) || 0,
      remark: formData.remark,
      cgst:
        parseFloat(formData.cgst) || 0,
      sgst:
        parseFloat(formData.sgst) || 0,
      igst:
        parseFloat(formData.igst) || 0,
      products: productsData,
    };
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  const handleReset = () => {
    setFormData({
      type: "",
      date: new Date()
        .toISOString()
        .split("T")[0],
      invoiceNo: "",
      vendor: "",
      vendor_id: "",
      transportAmount: "",
      remark: "",
      cgst: "",
      sgst: "",
      igst: "",
    });

    setSelectedRows({});
    setProductSearchTerm("");
    setErrors({});
    setSelectionOrder([]);
    selectionCounter.current = 0;

    showAlert(
      "info",
      "Form has been reset"
    );
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setErrors({});

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);

      const firstErrorKey =
        Object.keys(newErrors)[0];

      if (firstErrorKey) {
        const elementId =
          firstErrorKey.includes(
            "quantity_"
          ) ||
          firstErrorKey.includes("serial_")
            ? "products-section"
            : firstErrorKey;

        const element =
          document.getElementById(
            elementId
          ) ||
          document.querySelector(
            `[name="${firstErrorKey}"]`
          );

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          element.focus();
        }
      }

      showAlert(
        "warning",
        "Please fix the form errors before submitting"
      );

      return;
    }

    try {
      const submitData =
        prepareSubmitData();

      let response;

      if (id) {
        response = await axiosInstance.put(
          `/stockpurchase/${id}`,
          submitData
        );
      } else {
        response =
          await axiosInstance.post(
            "/stockpurchase",
            submitData
          );
      }

      if (response.data.success) {
        showAlert(
          "success",
          `Stock purchase ${
            id ? "updated" : "created"
          } successfully!`
        );

        setTimeout(() => {
          navigate("/stock-purchase");
        }, 1500);
      } else {
        showAlert(
          "danger",
          response.data.message ||
            "Failed to save stock purchase"
        );

        setSubmitting(false);
      }
    } catch (error) {
      console.error(
        "Error saving stock purchase:",
        error
      );

      let errorMessage =
        "Failed to save stock purchase";

      if (error.response?.data) {
        const err =
          error.response.data;

        if (
          err.errors &&
          Array.isArray(err.errors)
        ) {
          const backendErrors = {};

          err.errors.forEach((item) => {
            if (item.field) {
              backendErrors[item.field] =
                item.message;
            }
          });

          if (
            Object.keys(
              backendErrors
            ).length > 0
          ) {
            setErrors(backendErrors);

            showAlert(
              "danger",
              "Please check the form for errors"
            );

            setSubmitting(false);
            return;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      showAlert(
        "danger",
        errorMessage
      );

      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Filter Products
  // --------------------------------------------------
  const filteredProducts = products
    .filter((product) =>
      product.productTitle
        ?.toLowerCase()
        .includes(
          productSearchTerm.toLowerCase()
        )
    )
    .sort((a, b) => {
      const aSelected =
        !!selectedRows[a._id];

      const bSelected =
        !!selectedRows[b._id];

      if (aSelected && bSelected) {
        const aOrder =
          selectionOrder.find(
            (item) =>
              item.productId === a._id
          )?.order || 0;

        const bOrder =
          selectionOrder.find(
            (item) =>
              item.productId === b._id
          )?.order || 0;

        return aOrder - bOrder;
      }

      if (aSelected && !bSelected)
        return -1;

      if (!aSelected && bSelected)
        return 1;

      return 0;
    });

  // --------------------------------------------------
  // Back
  // --------------------------------------------------
  const handleBack = () => {
    navigate("/stock-purchase");
  };

  // --------------------------------------------------
  // Select Styles
  // --------------------------------------------------
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "6px",
      borderColor: state.isFocused
        ? "#2759A2"
        : "#d1d5db",
      boxShadow: state.isFocused
        ? "0 0 0 1px #2759A2"
        : "none",
      "&:hover": {
        borderColor: "#2759A2",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const inputClass = (hasError = false) =>
    `h-10 w-full rounded-md border bg-white px-3 text-sm text-gray-700 outline-none transition ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        : "border-gray-300 focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
    }`;

  const labelClass = (hasError = false) =>
    `mb-1.5 block text-sm font-medium ${
      hasError
        ? "text-red-600"
        : "text-gray-700"
    }`;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* Page Header */}
      <div className="mb-3 flex items-center">
        <button
          type="button"
          onClick={handleBack}
          className="mr-3 inline-flex items-center gap-1 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#214d8d]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-[24px] font-[450] leading-tight text-[#212529]">
          {id ? "Edit" : "Add"} Stock Purchase
        </h1>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-sm border border-gray-200 border-t-4 border-t-[#2759A2] bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex justify-end border-b border-gray-200 px-4 py-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#214d8d]"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Alert */}
          {alert.visible && (
            <div
              className={`mb-5 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
                alert.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : alert.type === "warning"
                  ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                  : alert.type === "info"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <span>{alert.message}</span>

              <button
                type="button"
                onClick={() =>
                  setAlert((prev) => ({
                    ...prev,
                    visible: false,
                  }))
                }
                className="rounded p-1 hover:bg-black/5"
              >
                <X size={17} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Details */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  className={labelClass(
                    !!errors.type
                  )}
                >
                  Type{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={inputClass(
                    !!errors.type
                  )}
                >
                  <option value="">
                    Select Type
                  </option>
                  <option value="new">
                    New
                  </option>
                  <option value="refurbish">
                    Refurbish
                  </option>
                </select>

                {errors.type && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.type}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className={labelClass(
                    !!errors.date
                  )}
                >
                  Date{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={inputClass(
                    !!errors.date
                  )}
                />

                {errors.date && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Invoice */}
              <div>
                <label
                  htmlFor="invoiceNo"
                  className={labelClass(
                    !!errors.invoiceNo
                  )}
                >
                  Invoice No{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  id="invoiceNo"
                  name="invoiceNo"
                  placeholder="Invoice No."
                  value={formData.invoiceNo}
                  onChange={handleChange}
                  className={inputClass(
                    !!errors.invoiceNo
                  )}
                />

                {errors.invoiceNo && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.invoiceNo}
                  </p>
                )}
              </div>

              {/* Vendor */}
              <div>
                <label
                  className={labelClass(
                    !!errors.vendor
                  )}
                >
                  Vendor{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="flex gap-2">
                  <div className="min-w-0 flex-1">
                    <Select
                      inputId="vendor"
                      name="vendor"
                      placeholder="Search Vendor..."
                      value={
                        formData.vendor_id
                          ? {
                              value:
                                formData.vendor_id,
                              label:
                                formData.vendor,
                            }
                          : null
                      }
                      onChange={
                        handleVendorSelect
                      }
                      options={vendors.map(
                        (vendor) => ({
                          value:
                            vendor._id ||
                            vendor.id,
                          label:
                            vendor.businessName,
                        })
                      )}
                      isClearable
                      styles={selectStyles}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVendor}
                    className="inline-flex h-10 shrink-0 items-center gap-1 rounded-sm bg-[#2759A2] px-3 text-sm font-semibold text-white transition hover:bg-[#214d8d]"
                  >
                    <Plus size={15} />
                    ADD
                  </button>
                </div>

                {errors.vendor && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.vendor}
                  </p>
                )}
              </div>
            </div>

            {/* Transport / Remark */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label
                  htmlFor="transportAmount"
                  className={labelClass()}
                >
                  Transport Amount
                </label>

                <input
                  type="number"
                  id="transportAmount"
                  name="transportAmount"
                  value={
                    formData.transportAmount
                  }
                  onChange={handleChange}
                  placeholder="Transport Amount"
                  min="0"
                  step="0.01"
                  className={inputClass()}
                />
              </div>

              <div>
                <label
                  htmlFor="remark"
                  className={labelClass()}
                >
                  Remark
                </label>

                <textarea
                  id="remark"
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  placeholder="Remark"
                  rows={3}
                  className="min-h-[40px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
                />
              </div>
            </div>

            {/* Taxes */}
            <div className="mt-6">
              <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-normal text-[#343a40]">
                Invoice Taxes
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="cgst"
                    className={labelClass()}
                  >
                    CGST
                  </label>

                  <input
                    type="number"
                    id="cgst"
                    name="cgst"
                    value={formData.cgst}
                    onChange={handleChange}
                    placeholder="CGST"
                    min="0"
                    step="0.01"
                    className={inputClass()}
                  />
                </div>

                <div>
                  <label
                    htmlFor="sgst"
                    className={labelClass()}
                  >
                    SGST
                  </label>

                  <input
                    type="number"
                    id="sgst"
                    name="sgst"
                    value={formData.sgst}
                    onChange={handleChange}
                    placeholder="SGST"
                    min="0"
                    step="0.01"
                    className={inputClass()}
                  />
                </div>

                <div>
                  <label
                    htmlFor="igst"
                    className={labelClass()}
                  >
                    IGST
                  </label>

                  <input
                    type="number"
                    id="igst"
                    name="igst"
                    value={formData.igst}
                    onChange={handleChange}
                    placeholder="IGST"
                    min="0"
                    step="0.01"
                    className={inputClass()}
                  />
                </div>
              </div>
            </div>

            {/* Products */}
            <div
              className="mt-6"
              id="products-section"
            >
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-normal text-[#343a40]">
                    Products

                    {errors.products && (
                      <span className="ml-2 text-sm font-normal text-red-600">
                        ({errors.products})
                      </span>
                    )}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="productSearch"
                    className="whitespace-nowrap text-sm font-semibold text-gray-800"
                  >
                    Search:
                  </label>

                  <div className="relative w-full sm:w-[250px]">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="productSearch"
                      type="text"
                      value={productSearchTerm}
                      onChange={(e) =>
                        setProductSearchTerm(
                          e.target.value
                        )
                      }
                      placeholder="Search products..."
                      className="h-10 w-full rounded-sm border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
                    />
                  </div>
                </div>
              </div>

              {/* Products Loading */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2759A2]" />
                </div>
              ) : (
                <div className="w-full overflow-y-auto overflow-x-hidden rounded-none border border-gray-200" style={{ maxHeight: "420px" }}>
                  <table className="w-full table-fixed border-collapse text-sm">
                      <colgroup>
                        <col className="w-[7%]" />
                        <col className="w-[45%]" />
                        <col className="w-[12%]" />
                        <col className="w-[18%]" />
                        <col className="w-[18%]" />
                      </colgroup>
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-white text-left text-sm font-bold text-gray-900">
                        <th className="border-b border-gray-200 bg-white px-3 py-3">
                          Select
                        </th>

                        <th className="border-b border-gray-200 bg-white px-3 py-3">
                          Product Name
                        </th>

                        <th className="border-b border-gray-200 bg-white px-3 py-3">
                          Price
                        </th>

                        <th className="border-b border-gray-200 bg-white px-3 py-3">
                          Available Qty
                        </th>

                        <th className="border-b border-gray-200 bg-white px-3 py-3">
                          Purchase Qty
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.length >
                      0 ? (
                        filteredProducts.map(
                          (product) => {
                            const selected =
                              selectedRows[
                                product._id
                              ];

                            return (
                              <tr
                                key={product._id}
                                className={`border-b border-gray-100 transition ${
                                  selected
                                    ? "bg-[#d9ead3]"
                                    : "hover:bg-blue-50"
                                }`}
                              >
                                {/* Checkbox */}
                                <td className="border-b border-gray-100 px-3 py-3">
                                  <input
                                    type="checkbox"
                                    checked={
                                      !!selected
                                    }
                                    onChange={() =>
                                      handleRowSelect(
                                        product._id,
                                        product.productPrice,
                                        product.stock
                                          ?.currentStock,
                                        product.trackSerialNumber
                                      )
                                    }
                                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-[#2759A2] focus:ring-[#2759A2]"
                                  />
                                </td>

                                {/* Product */}
                                <td className="border-b border-gray-100 px-3 py-3 font-normal text-gray-800">
                                  {
                                    product.productTitle
                                  }
                                </td>

                                {/* Price */}
                                <td className="border-b border-gray-100 px-3 py-3">
                                  {selected ? (
                                    <input
                                      type="number"
                                      value={
                                        selected.price
                                      }
                                      onChange={(e) =>
                                        handleRowInputChange(
                                          product._id,
                                          "price",
                                          e.target.value
                                        )
                                      }
                                      min="0"
                                      step="0.01"
                                      className="h-8 w-[105px] rounded-sm border border-gray-300 bg-white px-2 text-sm outline-none focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
                                    />
                                  ) : (
                                    <span className="text-gray-500">
                                      -
                                    </span>
                                  )}
                                </td>

                                {/* Available */}
                                <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
                                  {product.stock
                                    ?.currentStock ||
                                    0}
                                </td>

                                {/* Purchase Qty */}
                                <td className="border-b border-gray-100 px-3 py-2 align-top">
                                  {selected ? (
                                    <div className="flex flex-col items-start">
                                      <input
                                        type="number"
                                        value={
                                          selected.quantity
                                        }
                                        onChange={(
                                          e
                                        ) =>
                                          handleRowInputChange(
                                            product._id,
                                            "quantity",
                                            e.target
                                              .value
                                          )
                                        }
                                        min="1"
                                        className={`h-8 w-[100px] rounded-sm border bg-white px-2 text-sm outline-none focus:ring-1 ${
                                          errors[
                                            `quantity_${product._id}`
                                          ]
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:border-[#2759A2] focus:ring-[#2759A2]"
                                        }`}
                                      />

                                      {errors[
                                        `quantity_${product._id}`
                                      ] && (
                                        <p className="mt-1 max-w-[180px] text-xs text-red-600">
                                          {
                                            errors[
                                              `quantity_${product._id}`
                                            ]
                                          }
                                        </p>
                                      )}

                                      {errors[
                                        `serial_${product._id}`
                                      ] && (
                                        <p className="mt-1 max-w-[220px] text-xs text-red-600">
                                          {
                                            errors[
                                              `serial_${product._id}`
                                            ]
                                          }
                                        </p>
                                      )}

                                      {product.trackSerialNumber ===
                                        "Yes" && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleOpenSerialModal(
                                              product
                                            )
                                          }
                                          title="Add Serial Numbers"
                                          className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-sm text-[#2759A2] transition hover:bg-blue-50"
                                        >
                                          <Menu
                                            size={18}
                                            strokeWidth={2}
                                          />
                                        </button>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">
                                      -
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          }
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-10 text-center text-sm text-gray-500"
                          >
                            No products found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="mt-5 flex justify-end border-t border-gray-200 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-md bg-[#2759A2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#214d8d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Submit
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Vendor Modal */}
      <VendorModal
        visible={showVendorModal}
        onClose={() =>
          setShowVendorModal(false)
        }
        onVendorAdded={handleVendorAdded}
      />

      {/* Serial Number Modal */}
      <SerialNumberModal
        visible={showSerialModal}
        onClose={() => {
          setShowSerialModal(false);
          setSelectedProductForSerial(null);
        }}
        product={selectedProductForSerial}
        selectedRow={
          selectedProductForSerial
            ? selectedRows[
                selectedProductForSerial._id
              ]
            : null
        }
        onSave={handleSerialNumbersSave}
      />
    </div>
  );
};

export default AddStockPurchase;