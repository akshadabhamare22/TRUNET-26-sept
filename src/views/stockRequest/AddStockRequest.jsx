// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   Check,
//   FileText,
//   RotateCcw,
//   Search,
//   Send,
// } from "lucide-react";

// import axiosInstance from "../../axiosInstance";import { generateOrderNumber } from "../../utils/orderNumberGenerator";

// const AddStockRequest = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     warehouse: "",
//     remark: "",
//     date: new Date().toISOString().split("T")[0],
//     orderNumber: "",
//   });

//   const [warehouses, setWarehouses] = useState([]);
//   const [products, setProducts] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [warehouseLoading, setWarehouseLoading] = useState(true);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRows, setSelectedRows] = useState({});
//   const [errors, setErrors] = useState({});

//   const [generatingOrderNo, setGeneratingOrderNo] = useState(false);

//   const [alert, setAlert] = useState({
//     show: false,
//     message: "",
//     type: "",
//   });

//   const [selectionOrder, setSelectionOrder] = useState([]);
//   const selectionCounter = useRef(0);

//   // Initial data
//   useEffect(() => {
//     fetchWarehouses();
//     fetchProducts();

//     if (!id) {
//       generateAutoOrderNumber();
//     }
//   }, []);

//   // Fetch edit request
//   useEffect(() => {
//     if (id) {
//       fetchStockRequest(id);
//     }
//   }, [id]);

//   // Generate automatic order number
//   const generateAutoOrderNumber = async () => {
//     setGeneratingOrderNo(true);

//     try {
//       const orderNumber = await generateOrderNumber(
//         axiosInstance,
//         "stockrequest"
//       );

//       setFormData((prev) => ({
//         ...prev,
//         orderNumber,
//       }));
//     } catch (error) {
//       console.error("Error generating order number:", error);
//     } finally {
//       setGeneratingOrderNo(false);
//     }
//   };

//   // Fetch telecom warehouses
//   const fetchWarehouses = async () => {
//     try {
//       const res = await axiosInstance.get(
//         "/centers/main-warehouse?centerType=Outlet"
//       );

//       if (res.data.success) {
//         const telecomWarehouses = res.data.data.filter(
//           (warehouse) =>
//             warehouse.centerName
//               ?.toLowerCase()
//               .includes("telecom") ||
//             warehouse.centerType
//               ?.toLowerCase()
//               .includes("telecom") ||
//             warehouse.category
//               ?.toLowerCase()
//               .includes("telecom")
//         );

//         setWarehouses(telecomWarehouses);
//       }
//     } catch (error) {
//       console.error("Error fetching warehouses:", error);
//     } finally {
//       setWarehouseLoading(false);
//     }
//   };

//   // Fetch products
//   const fetchProducts = async () => {
//     try {
//       const res = await axiosInstance.get(
//         "/stockpurchase/products/with-stock"
//       );

//       if (res.data.success) {
//         setProducts(res.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch existing stock request for edit
//   const fetchStockRequest = async (requestId) => {
//     try {
//       const res = await axiosInstance.get(
//         `/stockrequest/${requestId}`
//       );

//       const data = res.data.data;

//       setFormData({
//         warehouse: data.warehouse?._id || "",
//         remark: data.remark || "",
//         date: data.date
//           ? data.date.split("T")[0]
//           : new Date().toISOString().split("T")[0],
//         orderNumber: data.orderNumber || "",
//       });

//       const selectedProducts = {};
//       const order = [];

//       data.products.forEach((p, index) => {
//         selectedProducts[p.product._id] = {
//           quantity: p.quantity,
//           productRemark: p.productRemark || "",
//           productInStock: p.productInStock || 0,
//         };

//         order.push({
//           productId: p.product._id,
//           order: index,
//         });
//       });

//       setSelectedRows(selectedProducts);
//       setSelectionOrder(order);
//       selectionCounter.current = data.products.length;
//     } catch (error) {
//       console.error("Error fetching stock request:", error);
//     }
//   };

//   // Select / deselect product
//   const handleRowSelect = (productId, productStock) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };

//       if (updated[productId]) {
//         setSelectionOrder((prevOrder) =>
//           prevOrder.filter(
//             (item) => item.productId !== productId
//           )
//         );

//         delete updated[productId];
//       } else {
//         const newOrder = selectionCounter.current++;

//         setSelectionOrder((prevOrder) => [
//           {
//             productId,
//             order: newOrder,
//           },
//           ...prevOrder,
//         ]);

//         updated[productId] = {
//           quantity: "",
//           productRemark: "",
//           productInStock: productStock || 0,
//         };
//       }

//       return updated;
//     });
//   };

//   // Product quantity / remark change
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

//   // Form change
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

//   // Form validation
//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.warehouse) {
//       newErrors.warehouse = "This is a required field";
//     }

//     if (!formData.date) {
//       newErrors.date = "This is a required field";
//     }

//     const selectedProducts = Object.keys(selectedRows).filter(
//       (productId) => selectedRows[productId]
//     );

//     if (selectedProducts.length === 0) {
//       newErrors.products =
//         "At least one product must be selected";
//     }

//     selectedProducts.forEach((productId) => {
//       const product = selectedRows[productId];

//       if (!product.quantity || product.quantity <= 0) {
//         newErrors[`quantity_${productId}`] =
//           "Quantity must be greater than 0";
//       }
//     });

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;
//   };

//   // Submit request
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     const productsData = Object.keys(selectedRows)
//       .filter((productId) => selectedRows[productId])
//       .map((productId) => ({
//         product: productId,
//         quantity: parseInt(
//           selectedRows[productId].quantity,
//           10
//         ),
//         productRemark:
//           selectedRows[productId].productRemark,
//       }));

//     const payload = {
//       warehouse: formData.warehouse,
//       remark: formData.remark,
//       date: formData.date,
//       orderNumber: formData.orderNumber,
//       products: productsData,
//       status: "Submitted",
//     };

//     try {
//       if (id) {
//         await axiosInstance.put(
//           `/stockrequest/${id}`,
//           payload
//         );

//         setAlert({
//           show: true,
//           message: "Stock request updated successfully!",
//           type: "success",
//         });
//       } else {
//         await axiosInstance.post(
//           "/stockrequest",
//           payload
//         );

//         setAlert({
//           show: true,
//           message: "Stock request created successfully!",
//           type: "success",
//         });
//       }

//       setTimeout(() => {
//         navigate("/stock-request");
//       }, 1000);
//     } catch (error) {
//       console.error(
//         "Error saving stock request:",
//         error
//       );

//       const errorMessage =
//         error.response?.data?.message ||
//         "Error saving stock request. Please try again.";

//       setAlert({
//         show: true,
//         message: errorMessage,
//         type: "danger",
//       });
//     }
//   };

//   // Save as draft
//   const handleSaveDraft = async () => {
//     const productsData = Object.keys(selectedRows)
//       .filter((productId) => selectedRows[productId])
//       .map((productId) => ({
//         product: productId,
//         quantity:
//           parseInt(
//             selectedRows[productId].quantity,
//             10
//           ) || 0,
//         productRemark:
//           selectedRows[productId].productRemark,
//       }));

//     const payload = {
//       warehouse: formData.warehouse,
//       remark: formData.remark,
//       date: formData.date,
//       orderNumber: formData.orderNumber,
//       products: productsData,
//       status: "Draft",
//     };

//     try {
//       if (id) {
//         await axiosInstance.put(
//           `/stockrequest/${id}`,
//           payload
//         );

//         setAlert({
//           show: true,
//           message: "Draft updated successfully!",
//           type: "success",
//         });
//       } else {
//         await axiosInstance.post(
//           "/stockrequest",
//           payload
//         );

//         setAlert({
//           show: true,
//           message: "Draft saved successfully!",
//           type: "success",
//         });
//       }

//       setTimeout(() => {
//         navigate("/stock-request");
//       }, 1500);
//     } catch (error) {
//       console.error("Error saving draft:", error);

//       const errorMessage =
//         error.response?.data?.message ||
//         "Error saving draft. Please try again.";

//       setAlert({
//         show: true,
//         message: errorMessage,
//         type: "danger",
//       });
//     }
//   };

//   const handleBack = () => {
//     navigate("/stock-request");
//   };

//   // Filter and sort products
//   const filteredAndSortedProducts = [...products]
//     .filter((product) =>
//       product.productTitle
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => {
//       const aSelected = !!selectedRows[a._id];
//       const bSelected = !!selectedRows[b._id];

//       if (aSelected && bSelected) {
//         const aOrder =
//           selectionOrder.find(
//             (item) => item.productId === a._id
//           )?.order || 0;

//         const bOrder =
//           selectionOrder.find(
//             (item) => item.productId === b._id
//           )?.order || 0;

//         return aOrder - bOrder;
//       }

//       if (aSelected && !bSelected) return -1;
//       if (!aSelected && bSelected) return 1;

//       return 0;
//     });

//   const inputBaseClass =
//     "w-full rounded-md border px-3 py-2 text-sm outline-none transition";

//   const getInputClass = (field) => {
//     if (errors[field]) {
//       return `${inputBaseClass} border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100`;
//     }

//     if (formData[field]) {
//       return `${inputBaseClass} border-green-500 bg-green-50 focus:border-green-500 focus:ring-2 focus:ring-green-100`;
//     }

//     return `${inputBaseClass} border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100`;
//   };

//   return (
//     <div className="w-full px-4 py-4 lg:px-6">
//       {/* Page Header */}
//       <div className="mb-4 flex items-center text-2xl font-semibold text-gray-800">
//         <button
//           type="button"
//           onClick={handleBack}
//           className="mr-3 inline-flex items-center gap-1.5 rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>

//         {id ? "Edit" : "Add"} Indent Request
//       </div>

//       {/* Main Card */}
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         {/* Header Buttons */}
//         <div className="flex flex-wrap justify-end gap-2 border-b border-gray-200 bg-gray-50 px-5 py-4">
//           <button
//             type="button"
//             onClick={handleSaveDraft}
//             className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//           >
//             <FileText size={16} />
//             Save As Draft
//           </button>

//           <button
//             type="button"
//             onClick={handleSubmit}
//             className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//           >
//             <Send size={16} />
//             Submit Request
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-5">
//           {/* Alert */}
//           {alert.show && (
//             <div
//               className={`mb-5 flex items-start justify-between rounded-md border px-4 py-3 text-sm ${
//                 alert.type === "success"
//                   ? "border-green-200 bg-green-50 text-green-700"
//                   : "border-red-200 bg-red-50 text-red-700"
//               }`}
//               role="alert"
//             >
//               <span>{alert.message}</span>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setAlert({
//                     show: false,
//                     message: "",
//                     type: "",
//                   })
//                 }
//                 className="ml-4 font-semibold opacity-70 hover:opacity-100"
//               >
//                 ×
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* Basic Details */}
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//               {/* Warehouse */}
//               <div>
//                 <label
//                   htmlFor="warehouse"
//                   className={`mb-1.5 block text-sm font-medium ${
//                     errors.warehouse
//                       ? "text-red-600"
//                       : formData.warehouse
//                         ? "text-green-700"
//                         : "text-gray-700"
//                   }`}
//                 >
//                   Warehouse{" "}
//                   <span className="text-red-500">*</span>
//                 </label>

//                 <select
//                   id="warehouse"
//                   name="warehouse"
//                   value={formData.warehouse}
//                   onChange={handleChange}
//                   disabled={warehouseLoading}
//                   className={`${getInputClass(
//                     "warehouse"
//                   )} disabled:cursor-not-allowed disabled:bg-gray-100`}
//                 >
//                   <option value="">
//                     {warehouseLoading
//                       ? "Loading warehouses..."
//                       : "Select Warehouse"}
//                   </option>

//                   {warehouses.map((warehouse) => (
//                     <option
//                       key={warehouse._id}
//                       value={warehouse._id}
//                     >
//                       {warehouse.centerName}
//                     </option>
//                   ))}
//                 </select>

//                 {errors.warehouse && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.warehouse}
//                   </p>
//                 )}

//                 {warehouses.length === 0 &&
//                   !warehouseLoading && (
//                     <p className="mt-1 text-xs text-red-600">
//                       No telecom warehouses available
//                     </p>
//                   )}
//               </div>

//               {/* Date */}
//               <div>
//                 <label
//                   htmlFor="date"
//                   className={`mb-1.5 block text-sm font-medium ${
//                     errors.date
//                       ? "text-red-600"
//                       : formData.date
//                         ? "text-green-700"
//                         : "text-gray-700"
//                   }`}
//                 >
//                   Date{" "}
//                   <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   disabled
//                   className={`${getInputClass(
//                     "date"
//                   )} cursor-not-allowed bg-gray-100`}
//                 />

//                 {errors.date && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.date}
//                   </p>
//                 )}
//               </div>

//               {/* Order Number */}
//               <div>
//                 <label
//                   htmlFor="orderNumber"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Order Number
//                 </label>

//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="orderNumber"
//                     name="orderNumber"
//                     value={formData.orderNumber}
//                     onChange={handleChange}
//                     disabled
//                     className={`${inputBaseClass} cursor-not-allowed border-gray-300 bg-gray-100 pr-10`}
//                   />

//                   {generatingOrderNo && (
//                     <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                       <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Remark */}
//             <div className="mt-4">
//               <label
//                 htmlFor="remark"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Remark
//               </label>

//               <textarea
//                 id="remark"
//                 name="remark"
//                 value={formData.remark}
//                 onChange={handleChange}
//                 placeholder="Additional Comment"
//                 rows={3}
//                 className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//             </div>

//             {/* Product Section */}
//             <div className="mt-6">
//               <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//                 <div className="flex items-center gap-3">
//                   <h2 className="text-lg font-semibold text-gray-800">
//                     Select Products
//                   </h2>

//                   {errors.products && (
//                     <span className="text-sm text-red-600">
//                       {errors.products}
//                     </span>
//                   )}
//                 </div>

//                 {/* Product Search */}
//                 <div className="flex w-full items-center gap-2 md:w-auto">
//                   <label
//                     htmlFor="productSearch"
//                     className="whitespace-nowrap text-sm font-medium text-gray-700"
//                   >
//                     Search:
//                   </label>

//                   <div className="relative w-full md:w-[250px]">
//                     <Search
//                       size={16}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     />

//                     <input
//                       id="productSearch"
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) =>
//                         setSearchTerm(e.target.value)
//                       }
//                       placeholder="Search products..."
//                       className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Product Loading */}
//               {loading ? (
//                 <div className="flex items-center justify-center py-10">
//                   <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto rounded-lg border border-gray-200">
//                   <table className="min-w-[850px] w-full border-collapse text-sm">
//                     <thead>
//                       <tr className="bg-gray-100">
//                         <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                           Select
//                         </th>

//                         <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                           Product Name
//                         </th>

//                         <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                           Stock
//                         </th>

//                         <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                           Quantity
//                         </th>

//                         <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                           Remark
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {filteredAndSortedProducts.length > 0 ? (
//                         filteredAndSortedProducts.map(
//                           (product) => {
//                             const isSelected =
//                               !!selectedRows[product._id];

//                             return (
//                               <tr
//                                 key={product._id}
//                                 className={`border-b border-gray-100 transition ${
//                                   isSelected
//                                     ? "bg-blue-50"
//                                     : "hover:bg-gray-50"
//                                 }`}
//                               >
//                                 {/* Checkbox */}
//                                 <td className="px-4 py-3">
//                                   <input
//                                     type="checkbox"
//                                     checked={isSelected}
//                                     onChange={() =>
//                                       handleRowSelect(
//                                         product._id,
//                                         product.stock
//                                       )
//                                     }
//                                     className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                   />
//                                 </td>

//                                 {/* Product */}
//                                 <td className="px-4 py-3 font-medium text-gray-800">
//                                   {product.productTitle}
//                                 </td>

//                                 {/* Stock */}
//                                 <td className="px-4 py-3 text-gray-700">
//                                   {product.stock?.currentStock ||
//                                     0}
//                                 </td>

//                                 {/* Quantity */}
//                                 <td className="px-4 py-3">
//                                   {isSelected && (
//                                     <div>
//                                       <input
//                                         type="number"
//                                         value={
//                                           selectedRows[
//                                             product._id
//                                           ].quantity
//                                         }
//                                         onChange={(e) =>
//                                           handleRowInputChange(
//                                             product._id,
//                                             "quantity",
//                                             e.target.value
//                                           )
//                                         }
//                                         min="1"
//                                         placeholder="Quantity"
//                                         className={`w-[110px] rounded-md border px-3 py-1.5 text-sm outline-none ${
//                                           errors[
//                                             `quantity_${product._id}`
//                                           ]
//                                             ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-100"
//                                             : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                         }`}
//                                       />

//                                       {errors[
//                                         `quantity_${product._id}`
//                                       ] && (
//                                         <p className="mt-1 text-xs text-red-600">
//                                           Quantity required
//                                         </p>
//                                       )}
//                                     </div>
//                                   )}
//                                 </td>

//                                 {/* Product Remark */}
//                                 <td className="px-4 py-3">
//                                   {isSelected && (
//                                     <input
//                                       type="text"
//                                       value={
//                                         selectedRows[
//                                           product._id
//                                         ].productRemark
//                                       }
//                                       onChange={(e) =>
//                                         handleRowInputChange(
//                                           product._id,
//                                           "productRemark",
//                                           e.target.value
//                                         )
//                                       }
//                                       placeholder="Product Remark"
//                                       className="w-full min-w-[200px] rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                     />
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

//             {/* Bottom Actions */}
//             <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-5">
//               <button
//                 type="button"
//                 onClick={handleSaveDraft}
//                 className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//               >
//                 <RotateCcw size={16} />
//                 Save As Draft
//               </button>

//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//               >
//                 <Check size={16} />
//                 Submit Stock Request
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddStockRequest;


// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   Check,
//   FileText,
//   RotateCcw,
//   Search,
//   Send,
// } from "lucide-react";

// import axiosInstance from "../../axiosInstance";import { generateOrderNumber } from "../../utils/orderNumberGenerator";

// const AddStockRequest = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     warehouse: "",
//     remark: "",
//     date: new Date().toISOString().split("T")[0],
//     orderNumber: "",
//   });

//   const [warehouses, setWarehouses] = useState([]);
//   const [products, setProducts] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [warehouseLoading, setWarehouseLoading] = useState(true);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRows, setSelectedRows] = useState({});
//   const [errors, setErrors] = useState({});

//   const [generatingOrderNo, setGeneratingOrderNo] = useState(false);

//   const [alert, setAlert] = useState({
//     show: false,
//     message: "",
//     type: "",
//   });

//   const [selectionOrder, setSelectionOrder] = useState([]);
//   const selectionCounter = useRef(0);

//   // Initial data
//   useEffect(() => {
//     fetchWarehouses();
//     fetchProducts();

//     if (!id) {
//       generateAutoOrderNumber();
//     }
//   }, []);

//   // Fetch edit request
//   useEffect(() => {
//     if (id) {
//       fetchStockRequest(id);
//     }
//   }, [id]);

//   // Generate automatic order number
//   const generateAutoOrderNumber = async () => {
//     setGeneratingOrderNo(true);

//     try {
//       const orderNumber = await generateOrderNumber(
//         axiosInstance,
//         "stockrequest"
//       );

//       setFormData((prev) => ({
//         ...prev,
//         orderNumber,
//       }));
//     } catch (error) {
//       console.error("Error generating order number:", error);
//     } finally {
//       setGeneratingOrderNo(false);
//     }
//   };

//   // Fetch telecom warehouses
//   const fetchWarehouses = async () => {
//     try {
//       const res = await axiosInstance.get(
//         "/centers/main-warehouse?centerType=Outlet"
//       );

//       if (res.data.success) {
//         const telecomWarehouses = res.data.data.filter(
//           (warehouse) =>
//             warehouse.centerName
//               ?.toLowerCase()
//               .includes("telecom") ||
//             warehouse.centerType
//               ?.toLowerCase()
//               .includes("telecom") ||
//             warehouse.category
//               ?.toLowerCase()
//               .includes("telecom")
//         );

//         setWarehouses(telecomWarehouses);
//       }
//     } catch (error) {
//       console.error("Error fetching warehouses:", error);
//     } finally {
//       setWarehouseLoading(false);
//     }
//   };

//   // Fetch products
//   const fetchProducts = async () => {
//     try {
//       const res = await axiosInstance.get(
//         "/stockpurchase/products/with-stock"
//       );

//       if (res.data.success) {
//         setProducts(res.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch existing stock request for edit
//   const fetchStockRequest = async (requestId) => {
//     try {
//       const res = await axiosInstance.get(
//         `/stockrequest/${requestId}`
//       );

//       const data = res.data.data;

//       setFormData({
//         warehouse: data.warehouse?._id || "",
//         remark: data.remark || "",
//         date: data.date
//           ? data.date.split("T")[0]
//           : new Date().toISOString().split("T")[0],
//         orderNumber: data.orderNumber || "",
//       });

//       const selectedProducts = {};
//       const order = [];

//       data.products.forEach((p, index) => {
//         selectedProducts[p.product._id] = {
//           quantity: p.quantity,
//           productRemark: p.productRemark || "",
//           productInStock: p.productInStock || 0,
//         };

//         order.push({
//           productId: p.product._id,
//           order: index,
//         });
//       });

//       setSelectedRows(selectedProducts);
//       setSelectionOrder(order);
//       selectionCounter.current = data.products.length;
//     } catch (error) {
//       console.error("Error fetching stock request:", error);
//     }
//   };

//   // Select / deselect product
//   const handleRowSelect = (productId, productStock) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };

//       if (updated[productId]) {
//         setSelectionOrder((prevOrder) =>
//           prevOrder.filter(
//             (item) => item.productId !== productId
//           )
//         );

//         delete updated[productId];
//       } else {
//         const newOrder = selectionCounter.current++;

//         setSelectionOrder((prevOrder) => [
//           {
//             productId,
//             order: newOrder,
//           },
//           ...prevOrder,
//         ]);

//         updated[productId] = {
//           quantity: "",
//           productRemark: "",
//           productInStock: productStock || 0,
//         };
//       }

//       return updated;
//     });
//   };

//   // Product quantity / remark change
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

//   // Form change
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

//   // Form validation
//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.warehouse) {
//       newErrors.warehouse = "This is a required field";
//     }

//     if (!formData.date) {
//       newErrors.date = "This is a required field";
//     }

//     const selectedProducts = Object.keys(selectedRows).filter(
//       (productId) => selectedRows[productId]
//     );

//     if (selectedProducts.length === 0) {
//       newErrors.products =
//         "At least one product must be selected";
//     }

//     selectedProducts.forEach((productId) => {
//       const product = selectedRows[productId];

//       if (!product.quantity || product.quantity <= 0) {
//         newErrors[`quantity_${productId}`] =
//           "Quantity must be greater than 0";
//       }
//     });

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;
//   };

//   // Submit request
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     const productsData = Object.keys(selectedRows)
//       .filter((productId) => selectedRows[productId])
//       .map((productId) => ({
//         product: productId,
//         quantity: parseInt(
//           selectedRows[productId].quantity,
//           10
//         ),
//         productRemark:
//           selectedRows[productId].productRemark,
//       }));

//     const payload = {
//       warehouse: formData.warehouse,
//       remark: formData.remark,
//       date: formData.date,
//       orderNumber: formData.orderNumber,
//       products: productsData,
//       status: "Submitted",
//     };

//     try {
//       if (id) {
//         await axiosInstance.put(
//           `/stockrequest/${id}`,
//           payload
//         );

//         setAlert({
//           show: true,
//           message: "Stock request updated successfully!",
//           type: "success",
//         });
//       } else {
//         await axiosInstance.post(
//           "/stockrequest",
//           payload
//         );

//         setAlert({
//           show: true,
//           message: "Stock request created successfully!",
//           type: "success",
//         });
//       }

//       setTimeout(() => {
//         navigate("/stock-request");
//       }, 1000);
//     } catch (error) {
//       console.error(
//         "Error saving stock request:",
//         error
//       );

//       const errorMessage =
//         error.response?.data?.message ||
//         "Error saving stock request. Please try again.";

//       setAlert({
//         show: true,
//         message: errorMessage,
//         type: "danger",
//       });
//     }
//   };

//   // Save as draft
//   const handleSaveDraft = async () => {
//     const productsData = Object.keys(selectedRows)
//       .filter((productId) => selectedRows[productId])
//       .map((productId) => ({
//         product: productId,
//         quantity:
//           parseInt(
//             selectedRows[productId].quantity,
//             10
//           ) || 0,
//         productRemark:
//           selectedRows[productId].productRemark,
//       }));

//     const payload = {
//       warehouse: formData.warehouse,
//       remark: formData.remark,
//       date: formData.date,
//       orderNumber: formData.orderNumber,
//       products: productsData,
//       status: "Draft",
//     };

//     try {
//       if (id) {
//         await axiosInstance.put(
//           `/stockrequest/${id}`,
//           payload
//         );

//         setAlert({
//           show: true,
//           message: "Draft updated successfully!",
//           type: "success",
//         });
//       } else {
//         await axiosInstance.post(
//           "/stockrequest",
//           payload
//         );

//         setAlert({
//           show: true,
//           message: "Draft saved successfully!",
//           type: "success",
//         });
//       }

//       setTimeout(() => {
//         navigate("/stock-request");
//       }, 1500);
//     } catch (error) {
//       console.error("Error saving draft:", error);

//       const errorMessage =
//         error.response?.data?.message ||
//         "Error saving draft. Please try again.";

//       setAlert({
//         show: true,
//         message: errorMessage,
//         type: "danger",
//       });
//     }
//   };

//   const handleBack = () => {
//     navigate("/stock-request");
//   };

//   // Filter and sort products
//   const filteredAndSortedProducts = [...products]
//     .filter((product) =>
//       product.productTitle
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => {
//       const aSelected = !!selectedRows[a._id];
//       const bSelected = !!selectedRows[b._id];

//       if (aSelected && bSelected) {
//         const aOrder =
//           selectionOrder.find(
//             (item) => item.productId === a._id
//           )?.order || 0;

//         const bOrder =
//           selectionOrder.find(
//             (item) => item.productId === b._id
//           )?.order || 0;

//         return aOrder - bOrder;
//       }

//       if (aSelected && !bSelected) return -1;
//       if (!aSelected && bSelected) return 1;

//       return 0;
//     });

//   const inputBaseClass =
//     "w-full rounded-md border px-3 py-2 text-sm outline-none transition";

//   const getInputClass = (field) => {
//     if (errors[field]) {
//       return `${inputBaseClass} border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100`;
//     }

//     if (formData[field]) {
//       return `${inputBaseClass} border-green-500 bg-green-50 focus:border-green-500 focus:ring-2 focus:ring-green-100`;
//     }

//     return `${inputBaseClass} border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100`;
//   };

//   return (
//     <div className="min-h-full w-full bg-[#f1f3f6] px-4 py-4 lg:px-6">
//       <div className="mb-0 flex items-center gap-2">
//         <button
//           type="button"
//           onClick={handleBack}
//           className="inline-flex items-center gap-0.5 rounded-[3px] bg-[#2f64ad] px-2.5 py-1.5 text-[15px] font-medium text-white shadow-sm transition hover:bg-[#285895]"
//         >
//           <ArrowLeft size={16} strokeWidth={2.5} />
//           Back
//         </button>

//         <h1 className="text-[25px] font-normal leading-none text-[#303640]">
//           {id ? "Edit" : "Add"} Indent Request
//         </h1>
//       </div>

//       <div className="mt-2 overflow-hidden rounded-[2px] border border-[#dfe3e8] border-t-[4px] border-t-[#2f64ad] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
//         <div className="flex min-h-[64px] items-center justify-end gap-3 border-b border-[#e0e3e7] px-4 py-3">
//           <button
//             type="button"
//             onClick={handleSaveDraft}
//             className="inline-flex items-center gap-2 rounded-[4px] bg-[#2f64ad] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#285895]"
//           >
//             <FileText size={16} />
//             Save As Draft
//           </button>

//           <button
//             type="button"
//             onClick={handleSubmit}
//             className="inline-flex items-center gap-2 rounded-[4px] bg-[#c62828] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#ad2020]"
//           >
//             <Send size={16} />
//             Submit Request
//           </button>
//         </div>

//         <div className="px-5 pb-5 pt-5">
//           {alert.show && (
//             <div
//               className={`mb-5 flex items-start justify-between rounded-[3px] border px-4 py-3 text-sm ${
//                 alert.type === "success"
//                   ? "border-green-200 bg-green-50 text-green-700"
//                   : "border-red-200 bg-red-50 text-red-700"
//               }`}
//               role="alert"
//             >
//               <span>{alert.message}</span>
//               <button
//                 type="button"
//                 onClick={() =>
//                   setAlert({
//                     show: false,
//                     message: "",
//                     type: "",
//                   })
//                 }
//                 className="ml-4 font-semibold opacity-70 hover:opacity-100"
//               >
//                 ×
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-3">
//               <div>
//                 <label
//                   htmlFor="warehouse"
//                   className={`mb-2 block text-[16px] font-semibold ${
//                     errors.warehouse
//                       ? "text-red-600"
//                       : formData.warehouse
//                         ? "text-green-600"
//                         : "text-[#303640]"
//                   }`}
//                 >
//                   Warehouse <span className="text-red-500">*</span>
//                 </label>

//                 <select
//                   id="warehouse"
//                   name="warehouse"
//                   value={formData.warehouse}
//                   onChange={handleChange}
//                   disabled={warehouseLoading}
//                   className={`${getInputClass(
//                     "warehouse"
//                   )} h-[42px] rounded-[2px] px-3 text-[15px] disabled:cursor-not-allowed disabled:bg-[#f4f4f4]`}
//                 >
//                   <option value="">
//                     {warehouseLoading
//                       ? "Loading warehouses..."
//                       : "Select Warehouse"}
//                   </option>

//                   {warehouses.map((warehouse) => (
//                     <option key={warehouse._id} value={warehouse._id}>
//                       {warehouse.centerName}
//                     </option>
//                   ))}
//                 </select>

//                 {errors.warehouse && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.warehouse}
//                   </p>
//                 )}

//                 {warehouses.length === 0 && !warehouseLoading && (
//                   <p className="mt-1 text-xs text-red-600">
//                     No telecom warehouses available
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="date"
//                   className={`mb-2 block text-[16px] font-semibold ${
//                     errors.date
//                       ? "text-red-600"
//                       : formData.date
//                         ? "text-green-600"
//                         : "text-[#303640]"
//                   }`}
//                 >
//                   Date <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   disabled
//                   className={`${getInputClass(
//                     "date"
//                   )} h-[42px] cursor-not-allowed rounded-[2px] bg-[#f4f4f4] px-3 text-[15px]`}
//                 />

//                 {errors.date && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.date}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="orderNumber"
//                   className="mb-2 block text-[16px] font-semibold text-[#303640]"
//                 >
//                   Order Number
//                 </label>

//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="orderNumber"
//                     name="orderNumber"
//                     value={formData.orderNumber}
//                     onChange={handleChange}
//                     disabled
//                     className={`${inputBaseClass} h-[42px] cursor-not-allowed rounded-[2px] border-[#d4d7db] bg-[#f4f4f4] px-3 text-[15px] text-[#555b63]`}
//                   />

//                   {generatingOrderNo && (
//                     <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                       <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#2f64ad]" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="mt-5">
//               <label
//                 htmlFor="remark"
//                 className="mb-2 block text-[16px] font-semibold text-[#303640]"
//               >
//                 Remark
//               </label>

//               <textarea
//                 id="remark"
//                 name="remark"
//                 value={formData.remark}
//                 onChange={handleChange}
//                 placeholder="Additional Comment"
//                 rows={3}
//                 className="w-full max-w-[410px] resize-none rounded-[2px] border border-[#d4d7db] bg-white px-3 py-2.5 text-[15px] text-[#555b63] outline-none transition placeholder:text-[#777] focus:border-[#2f64ad] focus:ring-1 focus:ring-[#2f64ad]"
//               />
//             </div>

//             <div className="mt-7">
//               <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//                 <div className="flex items-center gap-3">
//                   <h2 className="text-[22px] font-normal text-[#303640]">
//                     Select Products
//                   </h2>

//                   {errors.products && (
//                     <span className="text-sm text-red-600">
//                       {errors.products}
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex w-full items-center justify-end gap-2 md:w-auto">
//                   <label
//                     htmlFor="productSearch"
//                     className="whitespace-nowrap text-[16px] font-normal text-[#303640]"
//                   >
//                     Search:
//                   </label>

//                   <div className="relative w-full md:w-[238px]">
//                     <Search
//                       size={16}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7b8087]"
//                     />

//                     <input
//                       id="productSearch"
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       placeholder="Search products..."
//                       className="h-[41px] w-full rounded-[5px] border border-[#d4d7db] bg-white py-2 pl-9 pr-3 text-[15px] text-[#303640] outline-none transition focus:border-[#2f64ad] focus:ring-1 focus:ring-[#2f64ad]"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {loading ? (
//                 <div className="flex items-center justify-center py-10">
//                   <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2f64ad]" />
//                 </div>
//               ) : (
//                 <div className="w-full overflow-hidden rounded-[2px] border border-[#e0e3e7]">
//                   <div className="max-h-[365px] overflow-y-auto overflow-x-hidden">
//                     <table className="w-full table-fixed border-collapse text-[16px]">
//                       <colgroup>
//                         <col className="w-[7%]" />
//                         <col className="w-[46%]" />
//                         <col className="w-[10%]" />
//                         <col className="w-[14%]" />
//                         <col className="w-[23%]" />
//                       </colgroup>

//                       <thead className="sticky top-0 z-20">
//                         <tr className="bg-white">
//                           <th className="border-b border-r border-[#e5e7eb] px-2 py-3 text-left font-bold text-[#151515]">
//                             Select
//                           </th>
//                           <th className="border-b border-r border-[#e5e7eb] px-2.5 py-3 text-left font-bold text-[#151515]">
//                             Product Name
//                           </th>
//                           <th className="border-b border-r border-[#e5e7eb] px-2.5 py-3 text-left font-bold text-[#151515]">
//                             Stock
//                           </th>
//                           <th className="border-b border-r border-[#e5e7eb] px-2.5 py-3 text-left font-bold text-[#151515]">
//                             Quantity
//                           </th>
//                           <th className="border-b border-[#e5e7eb] px-2.5 py-3 text-left font-bold text-[#151515]">
//                             Remark
//                           </th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {filteredAndSortedProducts.length > 0 ? (
//                           filteredAndSortedProducts.map((product) => {
//                             const isSelected = !!selectedRows[product._id];

//                             return (
//                               <tr
//                                 key={product._id}
//                                 className={`border-b border-[#e6e7e9] transition-colors ${
//                                   isSelected
//                                     ? "bg-[#d8ead2]"
//                                     : "bg-[#f4f4f4] hover:bg-[#eeeeee]"
//                                 }`}
//                               >
//                                 <td className="border-r border-[#e5e7eb] px-2 py-2 align-middle">
//                                   <input
//                                     type="checkbox"
//                                     checked={isSelected}
//                                     onChange={() =>
//                                       handleRowSelect(
//                                         product._id,
//                                         product.stock
//                                       )
//                                     }
//                                     className="h-[22px] w-[22px] cursor-pointer rounded-[2px] border-[#9ca3af] accent-[#1976d2] focus:ring-0"
//                                   />
//                                 </td>

//                                 <td className="border-r border-[#e5e7eb] px-2.5 py-2.5 align-middle font-normal text-[#171717]">
//                                   <div className="break-words">
//                                     {product.productTitle}
//                                   </div>
//                                 </td>

//                                 <td className="border-r border-[#e5e7eb] px-2.5 py-2.5 align-middle text-[#171717]">
//                                   {product.stock?.currentStock || 0}
//                                 </td>

//                                 <td className="border-r border-[#e5e7eb] px-2.5 py-2.5 align-middle">
//                                   {isSelected && (
//                                     <div>
//                                       <input
//                                         type="number"
//                                         value={
//                                           selectedRows[product._id].quantity
//                                         }
//                                         onChange={(e) =>
//                                           handleRowInputChange(
//                                             product._id,
//                                             "quantity",
//                                             e.target.value
//                                           )
//                                         }
//                                         min="1"
//                                         placeholder="Quantity"
//                                         className={`h-[34px] w-[106px] rounded-[1px] border bg-white px-3 text-[14px] text-[#555b63] outline-none ${
//                                           errors[`quantity_${product._id}`]
//                                             ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-100"
//                                             : "border-[#d7d9dc] focus:border-[#2f64ad] focus:ring-1 focus:ring-[#2f64ad]"
//                                         }`}
//                                       />

//                                       {errors[`quantity_${product._id}`] && (
//                                         <p className="mt-1 text-xs text-red-600">
//                                           Quantity required
//                                         </p>
//                                       )}
//                                     </div>
//                                   )}
//                                 </td>

//                                 <td className="px-2.5 py-2.5 align-middle">
//                                   {isSelected && (
//                                     <input
//                                       type="text"
//                                       value={
//                                         selectedRows[product._id].productRemark
//                                       }
//                                       onChange={(e) =>
//                                         handleRowInputChange(
//                                           product._id,
//                                           "productRemark",
//                                           e.target.value
//                                         )
//                                       }
//                                       placeholder="Product Remark"
//                                       className="h-[34px] w-full rounded-[1px] border border-[#d7d9dc] bg-white px-3 text-[14px] text-[#555b63] outline-none transition focus:border-[#2f64ad] focus:ring-1 focus:ring-[#2f64ad]"
//                                     />
//                                   )}
//                                 </td>
//                               </tr>
//                             );
//                           })
//                         ) : (
//                           <tr>
//                             <td
//                               colSpan={5}
//                               className="px-4 py-10 text-center text-sm text-gray-500"
//                             >
//                               No products found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-[#e0e3e7] pt-4">
//               <button
//                 type="button"
//                 onClick={handleSaveDraft}
//                 className="inline-flex items-center gap-2 rounded-[4px] bg-[#2f64ad] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#285895]"
//               >
//                 <RotateCcw size={16} />
//                 Save As Draft
//               </button>

//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="inline-flex items-center gap-2 rounded-[4px] bg-[#c62828] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#ad2020]"
//               >
//                 <Check size={16} />
//                 Submit Stock Request
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddStockRequest;




// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   Check,
//   FileText,
//   RotateCcw,
//   Search,
//   Send,
// } from "lucide-react";

// import axiosInstance from "../../axiosInstance";
// import { generateOrderNumber } from "../../utils/orderNumberGenerator";

// const AddStockRequest = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     warehouse: "",
//     remark: "",
//     date: new Date().toISOString().split("T")[0],
//     orderNumber: "",
//   });

//   const [warehouses, setWarehouses] = useState([]);
//   const [products, setProducts] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [warehouseLoading, setWarehouseLoading] = useState(true);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRows, setSelectedRows] = useState({});
//   const [errors, setErrors] = useState({});

//   const [generatingOrderNo, setGeneratingOrderNo] = useState(false);

//   const [alert, setAlert] = useState({
//     show: false,
//     message: "",
//     type: "",
//   });

//   const [selectionOrder, setSelectionOrder] = useState([]);
//   const selectionCounter = useRef(0);

//   // API response provides available stock at product.availableQuantity
//   // and also inside product.stock.availableQuantity.
//   const getAvailableStock = (product) => {
//     const candidates = [
//       product?.availableQuantity,
//       product?.stock?.availableQuantity,
//       product?.stock?.currentStock,
//       product?.currentStock,
//     ];

//     const value = candidates.find(
//       (candidate) =>
//         candidate !== null &&
//         candidate !== undefined &&
//         candidate !== ""
//     );

//     const quantity = Number(value);
//     return Number.isFinite(quantity) ? Math.max(0, quantity) : 0;
//   };

//   // Initial data
//   useEffect(() => {
//     fetchWarehouses();
//     fetchProducts();

//     if (!id) {
//       generateAutoOrderNumber();
//     }
//   }, []);

//   // Fetch edit request
//   useEffect(() => {
//     if (id) {
//       fetchStockRequest(id);
//     }
//   }, [id]);

//   // Generate automatic order number
//   const generateAutoOrderNumber = async () => {
//     setGeneratingOrderNo(true);

//     try {
//       const orderNumber = await generateOrderNumber(
//         axiosInstance,
//         "stockrequest"
//       );

//       setFormData((prev) => ({
//         ...prev,
//         orderNumber,
//       }));
//     } catch (error) {
//       console.error("Error generating order number:", error);
//     } finally {
//       setGeneratingOrderNo(false);
//     }
//   };

//   // Fetch telecom warehouses
//   // const fetchWarehouses = async () => {
//   //   try {
//   //     const res = await axiosInstance.get(
//   //       "/centers/main-warehouse?centerType=Outlet"
//   //     );

//   //     if (res.data.success) {
//   //       const telecomWarehouses = res.data.data.filter(
//   //         (warehouse) =>
//   //           warehouse.centerName
//   //             ?.toLowerCase()
//   //             .includes("telecom") ||
//   //           warehouse.centerType
//   //             ?.toLowerCase()
//   //             .includes("telecom") ||
//   //           warehouse.category
//   //             ?.toLowerCase()
//   //             .includes("telecom")
//   //       );

//   //       setWarehouses(telecomWarehouses);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching warehouses:", error);
//   //   } finally {
//   //     setWarehouseLoading(false);
//   //   }
//   // };

  
// const fetchWarehouses = async () => {
//   try {
//     setWarehouseLoading(true);

//     const res = await axiosInstance.get(
//       "/centers/main-warehouse",
//       {
//         params: {
//           centerType: "Outlet",
//         },
//       }
//     );

//     if (res.data?.success) {
//       const responseData = Array.isArray(res.data.data)
//         ? res.data.data
//         : [];

//       // Read warehouse name from nested warehouse object
//       const telecomWarehouses = responseData.filter((item) => {
//         const warehouseName =
//           item.warehouse?.warehouseName ||
//           item.warehouseName ||
//           "";

//         return warehouseName
//           .toLowerCase()
//           .includes("telecom");
//       });

//       setWarehouses(telecomWarehouses);

//       console.log("Available telecom warehouses:", telecomWarehouses);
//     } else {
//       setWarehouses([]);
//     }
//   } catch (error) {
//     console.error(
//       "Error fetching warehouses:",
//       error.response?.data || error.message
//     );

//     setWarehouses([]);
//   } finally {
//     setWarehouseLoading(false);
//   }
// };


//   // Fetch products
//   const fetchProducts = async () => {
//     try {
//       const res = await axiosInstance.get(
//         "/stockpurchase/products/with-stock"
//       );

//       if (res.data?.success) {
//         const responseData = res.data.data;
//         const productList = Array.isArray(responseData)
//           ? responseData
//           : Array.isArray(responseData?.products)
//             ? responseData.products
//             : [];

//         setProducts(productList);
//       } else {
//         setProducts([]);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch existing stock request for edit
//   const fetchStockRequest = async (requestId) => {
//     try {
//       const res = await axiosInstance.get(
//         `/stockrequest/${requestId}`
//       );

//       const data = res.data.data;

//       setFormData({
//         warehouse: data.warehouse?._id || "",
//         remark: data.remark || "",
//         date: data.date
//           ? data.date.split("T")[0]
//           : new Date().toISOString().split("T")[0],
//         orderNumber: data.orderNumber || "",
//       });

//       const selectedProducts = {};
//       const order = [];

//       data.products.forEach((p, index) => {
//         selectedProducts[p.product._id] = {
//           quantity: p.quantity,
//           productRemark: p.productRemark || "",
//           productInStock: p.productInStock || 0,
//         };

//         order.push({
//           productId: p.product._id,
//           order: index,
//         });
//       });

//       setSelectedRows(selectedProducts);
//       setSelectionOrder(order);
//       selectionCounter.current = data.products.length;
//     } catch (error) {
//       console.error("Error fetching stock request:", error);
//     }
//   };

//   // Select / deselect product
//   const handleRowSelect = (productId, productStock) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };

//       if (updated[productId]) {
//         setSelectionOrder((prevOrder) =>
//           prevOrder.filter(
//             (item) => item.productId !== productId
//           )
//         );

//         delete updated[productId];
//       } else {
//         const newOrder = selectionCounter.current++;

//         setSelectionOrder((prevOrder) => [
//           {
//             productId,
//             order: newOrder,
//           },
//           ...prevOrder,
//         ]);

//         updated[productId] = {
//           quantity: "",
//           productRemark: "",
//           productInStock: productStock || 0,
//         };
//       }

//       return updated;
//     });
//   };

//   // Product quantity / remark change
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

//   // Form change
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

//   // Form validation
//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.warehouse) {
//       newErrors.warehouse = "This is a required field";
//     }

//     if (!formData.date) {
//       newErrors.date = "This is a required field";
//     }

//     const selectedProducts = Object.keys(selectedRows).filter(
//       (productId) => selectedRows[productId]
//     );

//     if (selectedProducts.length === 0) {
//       newErrors.products =
//         "At least one product must be selected";
//     }

//     selectedProducts.forEach((productId) => {
//       const product = selectedRows[productId];

//       if (!product.quantity || product.quantity <= 0) {
//         newErrors[`quantity_${productId}`] =
//           "Quantity must be greater than 0";
//       }
//     });

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;
//   };

//   // Submit request
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     const productsData = Object.keys(selectedRows)
//       .filter((productId) => selectedRows[productId])
//       .map((productId) => ({
//         product: productId,
//         quantity: parseInt(
//           selectedRows[productId].quantity,
//           10
//         ),
//         productRemark:
//           selectedRows[productId].productRemark,
//       }));

//     const payload = {
//       warehouse: formData.warehouse,
//       remark: formData.remark,
//       date: formData.date,
//       orderNumber: formData.orderNumber,
//       products: productsData,
//       status: "Submitted",
//     };

//     try {
//       if (id) {
//         await axiosInstance.put(
//           `/stockrequest/${id}`,
//           payload
//         );

//         setAlert({
//           show: true,
//           message: "Stock request updated successfully!",
//           type: "success",
//         });
//       } else {
//         await axiosInstance.post(
//           "/stockrequest",
//           payload
//         );

//         setAlert({
//           show: true,
//           message: "Stock request created successfully!",
//           type: "success",
//         });
//       }

//       setTimeout(() => {
//         navigate("/stock-request");
//       }, 1000);
//     } catch (error) {
//       console.error(
//         "Error saving stock request:",
//         error
//       );

//       const errorMessage =
//         error.response?.data?.message ||
//         "Error saving stock request. Please try again.";

//       setAlert({
//         show: true,
//         message: errorMessage,
//         type: "danger",
//       });
//     }
//   };

//   // Save as draft
//   const handleSaveDraft = async () => {
//     const productsData = Object.keys(selectedRows)
//       .filter((productId) => selectedRows[productId])
//       .map((productId) => ({
//         product: productId,
//         quantity:
//           parseInt(
//             selectedRows[productId].quantity,
//             10
//           ) || 0,
//         productRemark:
//           selectedRows[productId].productRemark,
//       }));

//     const payload = {
//       warehouse: formData.warehouse,
//       remark: formData.remark,
//       date: formData.date,
//       orderNumber: formData.orderNumber,
//       products: productsData,
//       status: "Draft",
//     };

//     try {
//       if (id) {
//         await axiosInstance.put(
//           `/stockrequest/${id}`,
//           payload
//         );

//         setAlert({
//           show: true,
//           message: "Draft updated successfully!",
//           type: "success",
//         });
//       } else {
//         await axiosInstance.post(
//           "/stockrequest",
//           payload
//         );

//         setAlert({
//           show: true,
//           message: "Draft saved successfully!",
//           type: "success",
//         });
//       }

//       setTimeout(() => {
//         navigate("/stock-request");
//       }, 1500);
//     } catch (error) {
//       console.error("Error saving draft:", error);

//       const errorMessage =
//         error.response?.data?.message ||
//         "Error saving draft. Please try again.";

//       setAlert({
//         show: true,
//         message: errorMessage,
//         type: "danger",
//       });
//     }
//   };

//   const handleBack = () => {
//     navigate("/stock-request");
//   };

//   // Filter and sort products
//   const filteredAndSortedProducts = [...products]
//     .filter((product) =>
//       product.productTitle
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => {
//       const aSelected = !!selectedRows[a._id];
//       const bSelected = !!selectedRows[b._id];

//       if (aSelected && bSelected) {
//         const aOrder =
//           selectionOrder.find(
//             (item) => item.productId === a._id
//           )?.order || 0;

//         const bOrder =
//           selectionOrder.find(
//             (item) => item.productId === b._id
//           )?.order || 0;

//         return aOrder - bOrder;
//       }

//       if (aSelected && !bSelected) return -1;
//       if (!aSelected && bSelected) return 1;

//       return 0;
//     });

//   const inputBaseClass =
//     "w-full rounded-md border px-3 py-2 text-sm outline-none transition";

//   const getInputClass = (field) => {
//     if (errors[field]) {
//       return `${inputBaseClass} border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100`;
//     }

//     if (formData[field]) {
//       return `${inputBaseClass} border-green-500 bg-green-50 focus:border-green-500 focus:ring-2 focus:ring-green-100`;
//     }

//     return `${inputBaseClass} border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100`;
//   };

//   return (
//     <div className="min-h-full w-full bg-[#f1f3f6] px-4 py-4 lg:px-6">
//       <div className="mb-0 flex items-center gap-2">
//         <button
//           type="button"
//           onClick={handleBack}
//           className="inline-flex items-center gap-0.5 rounded-[3px] bg-[#2f64ad] px-2.5 py-1.5 text-[15px] font-medium text-white shadow-sm transition hover:bg-[#285895]"
//         >
//           <ArrowLeft size={16} strokeWidth={2.5} />
//           Back
//         </button>

//         <h1 className="text-[25px] font-normal leading-none text-[#303640]">
//           {id ? "Edit" : "Add"} Indent Request
//         </h1>
//       </div>

//       <div className="mt-2 overflow-hidden rounded-[2px] border border-[#dfe3e8] border-t-[4px] border-t-[#2f64ad] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
//         <div className="flex min-h-[64px] items-center justify-end gap-3 border-b border-[#e0e3e7] px-4 py-3">
//           <button
//             type="button"
//             onClick={handleSaveDraft}
//             className="inline-flex items-center gap-2 rounded-[4px] bg-[#2f64ad] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#285895]"
//           >
//             <FileText size={16} />
//             Save As Draft
//           </button>

//           <button
//             type="button"
//             onClick={handleSubmit}
//             className="inline-flex items-center gap-2 rounded-[4px] bg-[#c62828] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#ad2020]"
//           >
//             <Send size={16} />
//             Submit Request
//           </button>
//         </div>

//         <div className="px-5 pb-5 pt-5">
//           {alert.show && (
//             <div
//               className={`mb-5 flex items-start justify-between rounded-[3px] border px-4 py-3 text-sm ${
//                 alert.type === "success"
//                   ? "border-green-200 bg-green-50 text-green-700"
//                   : "border-red-200 bg-red-50 text-red-700"
//               }`}
//               role="alert"
//             >
//               <span>{alert.message}</span>
//               <button
//                 type="button"
//                 onClick={() =>
//                   setAlert({
//                     show: false,
//                     message: "",
//                     type: "",
//                   })
//                 }
//                 className="ml-4 font-semibold opacity-70 hover:opacity-100"
//               >
//                 ×
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-3">
//               <div>
//                 <label
//                   htmlFor="warehouse"
//                   className={`mb-2 block text-[16px] font-semibold ${
//                     errors.warehouse
//                       ? "text-red-600"
//                       : formData.warehouse
//                         ? "text-green-600"
//                         : "text-[#303640]"
//                   }`}
//                 >
//                   Warehouse <span className="text-red-500">*</span>
//                 </label>

//                 <select
//                   id="warehouse"
//                   name="warehouse"
//                   value={formData.warehouse}
//                   onChange={handleChange}
//                   disabled={warehouseLoading}
//                   className={`${getInputClass(
//                     "warehouse"
//                   )} h-[42px] rounded-[2px] px-3 text-[15px] disabled:cursor-not-allowed disabled:bg-[#f4f4f4]`}
//                 >
//                   <option value="">
//                     {warehouseLoading
//                       ? "Loading warehouses..."
//                       : "Select Warehouse"}
//                   </option>

//                   {warehouses.map((warehouse) => (
//                     <option key={warehouse._id} value={warehouse._id}>
//                       {warehouse.centerName}
//                     </option>
//                   ))}
//                 </select>

//                 {errors.warehouse && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.warehouse}
//                   </p>
//                 )}

//                 {warehouses.length === 0 && !warehouseLoading && (
//                   <p className="mt-1 text-xs text-red-600">
//                     No telecom warehouses available
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="date"
//                   className={`mb-2 block text-[16px] font-semibold ${
//                     errors.date
//                       ? "text-red-600"
//                       : formData.date
//                         ? "text-green-600"
//                         : "text-[#303640]"
//                   }`}
//                 >
//                   Date <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   disabled
//                   className={`${getInputClass(
//                     "date"
//                   )} h-[42px] cursor-not-allowed rounded-[2px] bg-[#f4f4f4] px-3 text-[15px]`}
//                 />

//                 {errors.date && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.date}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="orderNumber"
//                   className="mb-2 block text-[16px] font-semibold text-[#303640]"
//                 >
//                   Order Number
//                 </label>

//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="orderNumber"
//                     name="orderNumber"
//                     value={formData.orderNumber}
//                     onChange={handleChange}
//                     disabled
//                     className={`${inputBaseClass} h-[42px] cursor-not-allowed rounded-[2px] border-[#d4d7db] bg-[#f4f4f4] px-3 text-[15px] text-[#555b63]`}
//                   />

//                   {generatingOrderNo && (
//                     <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                       <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#2f64ad]" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="mt-5">
//               <label
//                 htmlFor="remark"
//                 className="mb-2 block text-[16px] font-semibold text-[#303640]"
//               >
//                 Remark
//               </label>

//               <textarea
//                 id="remark"
//                 name="remark"
//                 value={formData.remark}
//                 onChange={handleChange}
//                 placeholder="Additional Comment"
//                 rows={3}
//                 className="w-full max-w-[410px] resize-none rounded-[2px] border border-[#d4d7db] bg-white px-3 py-2.5 text-[15px] text-[#555b63] outline-none transition placeholder:text-[#777] focus:border-[#2f64ad] focus:ring-1 focus:ring-[#2f64ad]"
//               />
//             </div>

//             <div className="mt-7">
//               <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//                 <div className="flex items-center gap-3">
//                   <h2 className="text-[22px] font-normal text-[#303640]">
//                     Select Products
//                   </h2>

//                   {errors.products && (
//                     <span className="text-sm text-red-600">
//                       {errors.products}
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex w-full items-center justify-end gap-2 md:w-auto">
//                   <label
//                     htmlFor="productSearch"
//                     className="whitespace-nowrap text-[16px] font-normal text-[#303640]"
//                   >
//                     Search:
//                   </label>

//                   <div className="relative w-full md:w-[238px]">
//                     <Search
//                       size={16}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7b8087]"
//                     />

//                     <input
//                       id="productSearch"
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       placeholder="Search products..."
//                       className="h-[41px] w-full rounded-[5px] border border-[#d4d7db] bg-white py-2 pl-9 pr-3 text-[15px] text-[#303640] outline-none transition focus:border-[#2f64ad] focus:ring-1 focus:ring-[#2f64ad]"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {loading ? (
//                 <div className="flex items-center justify-center py-10">
//                   <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2f64ad]" />
//                 </div>
//               ) : (
//                 <div className="w-full overflow-hidden rounded-[2px] border border-[#e0e3e7]">
//                   <div className="max-h-[365px] overflow-y-auto overflow-x-hidden">
//                     <table className="w-full table-fixed border-collapse text-[16px]">
//                       <colgroup>
//                         <col className="w-[7%]" />
//                         <col className="w-[46%]" />
//                         <col className="w-[10%]" />
//                         <col className="w-[14%]" />
//                         <col className="w-[23%]" />
//                       </colgroup>

//                       <thead className="sticky top-0 z-20">
//                         <tr className="bg-white">
//                           <th className="border-b border-r border-[#e5e7eb] px-2 py-3 text-left font-bold text-[#151515]">
//                             Select
//                           </th>
//                           <th className="border-b border-r border-[#e5e7eb] px-2.5 py-3 text-left font-bold text-[#151515]">
//                             Product Name
//                           </th>
//                           <th className="border-b border-r border-[#e5e7eb] px-2.5 py-3 text-left font-bold text-[#151515]">
//                             Stock
//                           </th>
//                           <th className="border-b border-r border-[#e5e7eb] px-2.5 py-3 text-left font-bold text-[#151515]">
//                             Quantity
//                           </th>
//                           <th className="border-b border-[#e5e7eb] px-2.5 py-3 text-left font-bold text-[#151515]">
//                             Remark
//                           </th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {filteredAndSortedProducts.length > 0 ? (
//                           filteredAndSortedProducts.map((product) => {
//                             const isSelected = !!selectedRows[product._id];

//                             return (
//                               <tr
//                                 key={product._id}
//                                 className={`border-b border-[#e6e7e9] transition-colors ${
//                                   isSelected
//                                     ? "bg-[#d8ead2]"
//                                     : "bg-[#f4f4f4] hover:bg-[#eeeeee]"
//                                 }`}
//                               >
//                                 <td className="border-r border-[#e5e7eb] px-2 py-2 align-middle">
//                                   <input
//                                     type="checkbox"
//                                     checked={isSelected}
//                                     onChange={() =>
//                                       handleRowSelect(
//                                         product._id,
//                                         product.stock
//                                       )
//                                     }
//                                     className="h-[22px] w-[22px] cursor-pointer rounded-[2px] border-[#9ca3af] accent-[#1976d2] focus:ring-0"
//                                   />
//                                 </td>

//                                 <td className="border-r border-[#e5e7eb] px-2.5 py-2.5 align-middle font-normal text-[#171717]">
//                                   <div className="break-words">
//                                     {product.productTitle}
//                                   </div>
//                                 </td>

//                                 <td className="border-r border-[#e5e7eb] px-2.5 py-2.5 align-middle text-[#171717]">
//                                   {getAvailableStock(product)}
//                                 </td>

//                                 <td className="border-r border-[#e5e7eb] px-2.5 py-2.5 align-middle">
//                                   {isSelected && (
//                                     <div>
//                                       <input
//                                         type="number"
//                                         value={
//                                           selectedRows[product._id].quantity
//                                         }
//                                         onChange={(e) =>
//                                           handleRowInputChange(
//                                             product._id,
//                                             "quantity",
//                                             e.target.value
//                                           )
//                                         }
//                                         min="1"
//                                         placeholder="Quantity"
//                                         className={`h-[34px] w-[106px] rounded-[1px] border bg-white px-3 text-[14px] text-[#555b63] outline-none ${
//                                           errors[`quantity_${product._id}`]
//                                             ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-100"
//                                             : "border-[#d7d9dc] focus:border-[#2f64ad] focus:ring-1 focus:ring-[#2f64ad]"
//                                         }`}
//                                       />

//                                       {errors[`quantity_${product._id}`] && (
//                                         <p className="mt-1 text-xs text-red-600">
//                                           Quantity required
//                                         </p>
//                                       )}
//                                     </div>
//                                   )}
//                                 </td>

//                                 <td className="px-2.5 py-2.5 align-middle">
//                                   {isSelected && (
//                                     <input
//                                       type="text"
//                                       value={
//                                         selectedRows[product._id].productRemark
//                                       }
//                                       onChange={(e) =>
//                                         handleRowInputChange(
//                                           product._id,
//                                           "productRemark",
//                                           e.target.value
//                                         )
//                                       }
//                                       placeholder="Product Remark"
//                                       className="h-[34px] w-full rounded-[1px] border border-[#d7d9dc] bg-white px-3 text-[14px] text-[#555b63] outline-none transition focus:border-[#2f64ad] focus:ring-1 focus:ring-[#2f64ad]"
//                                     />
//                                   )}
//                                 </td>
//                               </tr>
//                             );
//                           })
//                         ) : (
//                           <tr>
//                             <td
//                               colSpan={5}
//                               className="px-4 py-10 text-center text-sm text-gray-500"
//                             >
//                               No products found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-[#e0e3e7] pt-4">
//               <button
//                 type="button"
//                 onClick={handleSaveDraft}
//                 className="inline-flex items-center gap-2 rounded-[4px] bg-[#2f64ad] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#285895]"
//               >
//                 <RotateCcw size={16} />
//                 Save As Draft
//               </button>

//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="inline-flex items-center gap-2 rounded-[4px] bg-[#c62828] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#ad2020]"
//               >
//                 <Check size={16} />
//                 Submit Stock Request
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddStockRequest;


import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  FileText,
  RotateCcw,
  Search,
  Send,
} from "lucide-react";

import axiosInstance from "../../axiosInstance";
import { generateOrderNumber } from "../../utils/orderNumberGenerator";

const AddStockRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    warehouse: "",
    remark: "",
    date: new Date().toISOString().split("T")[0],
    orderNumber: "",
  });

  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [warehouseLoading, setWarehouseLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState({});
  const [errors, setErrors] = useState({});

  const [generatingOrderNo, setGeneratingOrderNo] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [selectionOrder, setSelectionOrder] = useState([]);
  const selectionCounter = useRef(0);

  // API response provides available stock at product.availableQuantity
  // and also inside product.stock.availableQuantity.
  const getAvailableStock = (product) => {
    const candidates = [
      product?.availableQuantity,
      product?.stock?.availableQuantity,
      product?.stock?.currentStock,
      product?.currentStock,
    ];

    const value = candidates.find(
      (candidate) =>
        candidate !== null &&
        candidate !== undefined &&
        candidate !== ""
    );

    const quantity = Number(value);
    return Number.isFinite(quantity) ? Math.max(0, quantity) : 0;
  };

  // Initial data
  useEffect(() => {
    fetchWarehouses();
    fetchProducts();

    if (!id) {
      generateAutoOrderNumber();
    }
  }, []);

  // Fetch edit request
  useEffect(() => {
    if (id) {
      fetchStockRequest(id);
    }
  }, [id]);

  // Generate automatic order number
  const generateAutoOrderNumber = async () => {
    setGeneratingOrderNo(true);

    try {
      const orderNumber = await generateOrderNumber(
        axiosInstance,
        "stockrequest"
      );

      setFormData((prev) => ({
        ...prev,
        orderNumber,
      }));
    } catch (error) {
      console.error("Error generating order number:", error);
    } finally {
      setGeneratingOrderNo(false);
    }
  };

  // Fetch Outlet records and read the linked warehouse details.
  // In the centers API response, warehouseName is nested inside
  // item.warehouse, while item._id identifies the Outlet/Center.
  const fetchWarehouses = async () => {
    try {
      setWarehouseLoading(true);

      const res = await axiosInstance.get("/centers/main-warehouse", {
        params: { centerType: "Outlet" },
      });

      const responseData = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.data?.centers)
          ? res.data.data.centers
          : [];

      if (res.data?.success) {
        const telecomWarehouses = responseData.filter((item) => {
          const warehouseName = String(
            item?.warehouse?.warehouseName || item?.warehouseName || ""
          ).trim();
          const warehouseStatus = item?.warehouse?.status || item?.warehouseStatus;

          return (
            String(item?.centerType || "").toLowerCase() === "outlet" &&
            warehouseName.toLowerCase().includes("telecom") &&
            (!warehouseStatus || warehouseStatus.toLowerCase() === "enable")
          );
        });

        setWarehouses(telecomWarehouses);
        console.log("Telecom outlet/warehouse records:", telecomWarehouses);
      } else {
        setWarehouses([]);
        console.error("Warehouse API returned an unsuccessful response:", res.data);
      }
    } catch (error) {
      setWarehouses([]);
      console.error(
        "Error fetching warehouses:",
        error.response?.data || error.message
      );
    } finally {
      setWarehouseLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get(
        "/stockpurchase/products/with-stock"
      );

      if (res.data?.success) {
        const responseData = res.data.data;
        const productList = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.products)
            ? responseData.products
            : [];

        setProducts(productList);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing stock request for edit
  const fetchStockRequest = async (requestId) => {
    try {
      const res = await axiosInstance.get(
        `/stockrequest/${requestId}`
      );

      const data = res.data.data;

      setFormData({
        warehouse: data.warehouse?._id || "",
        remark: data.remark || "",
        date: data.date
          ? data.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        orderNumber: data.orderNumber || "",
      });

      const selectedProducts = {};
      const order = [];

      data.products.forEach((p, index) => {
        selectedProducts[p.product._id] = {
          quantity: p.quantity,
          productRemark: p.productRemark || "",
          productInStock: p.productInStock || 0,
        };

        order.push({
          productId: p.product._id,
          order: index,
        });
      });

      setSelectedRows(selectedProducts);
      setSelectionOrder(order);
      selectionCounter.current = data.products.length;
    } catch (error) {
      console.error("Error fetching stock request:", error);
    }
  };

  // Select / deselect product
  const handleRowSelect = (productId, productStock) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };

      if (updated[productId]) {
        setSelectionOrder((prevOrder) =>
          prevOrder.filter(
            (item) => item.productId !== productId
          )
        );

        delete updated[productId];
      } else {
        const newOrder = selectionCounter.current++;

        setSelectionOrder((prevOrder) => [
          {
            productId,
            order: newOrder,
          },
          ...prevOrder,
        ]);

        updated[productId] = {
          quantity: "",
          productRemark: "",
          productInStock: productStock || 0,
        };
      }

      return updated;
    });
  };

  // Product quantity / remark change
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

  // Form change
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

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.warehouse) {
      newErrors.warehouse = "This is a required field";
    }

    if (!formData.date) {
      newErrors.date = "This is a required field";
    }

    const selectedProducts = Object.keys(selectedRows).filter(
      (productId) => selectedRows[productId]
    );

    if (selectedProducts.length === 0) {
      newErrors.products =
        "At least one product must be selected";
    }

    selectedProducts.forEach((productId) => {
      const product = selectedRows[productId];

      if (!product.quantity || product.quantity <= 0) {
        newErrors[`quantity_${productId}`] =
          "Quantity must be greater than 0";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const productsData = Object.keys(selectedRows)
      .filter((productId) => selectedRows[productId])
      .map((productId) => ({
        product: productId,
        quantity: parseInt(
          selectedRows[productId].quantity,
          10
        ),
        productRemark:
          selectedRows[productId].productRemark,
      }));

    const payload = {
      warehouse: formData.warehouse,
      remark: formData.remark,
      date: formData.date,
      orderNumber: formData.orderNumber,
      products: productsData,
      status: "Submitted",
    };

    try {
      if (id) {
        await axiosInstance.put(
          `/stockrequest/${id}`,
          payload
        );

        setAlert({
          show: true,
          message: "Stock request updated successfully!",
          type: "success",
        });
      } else {
        await axiosInstance.post(
          "/stockrequest",
          payload
        );

        setAlert({
          show: true,
          message: "Stock request created successfully!",
          type: "success",
        });
      }

      setTimeout(() => {
        navigate("/stock-request");
      }, 1000);
    } catch (error) {
      console.error(
        "Error saving stock request:",
        error
      );

      const errorMessage =
        error.response?.data?.message ||
        "Error saving stock request. Please try again.";

      setAlert({
        show: true,
        message: errorMessage,
        type: "danger",
      });
    }
  };

  // Save as draft
  const handleSaveDraft = async () => {
    const productsData = Object.keys(selectedRows)
      .filter((productId) => selectedRows[productId])
      .map((productId) => ({
        product: productId,
        quantity:
          parseInt(
            selectedRows[productId].quantity,
            10
          ) || 0,
        productRemark:
          selectedRows[productId].productRemark,
      }));

    const payload = {
      warehouse: formData.warehouse,
      remark: formData.remark,
      date: formData.date,
      orderNumber: formData.orderNumber,
      products: productsData,
      status: "Draft",
    };

    try {
      if (id) {
        await axiosInstance.put(
          `/stockrequest/${id}`,
          payload
        );

        setAlert({
          show: true,
          message: "Draft updated successfully!",
          type: "success",
        });
      } else {
        await axiosInstance.post(
          "/stockrequest",
          payload
        );

        setAlert({
          show: true,
          message: "Draft saved successfully!",
          type: "success",
        });
      }

      setTimeout(() => {
        navigate("/stock-request");
      }, 1500);
    } catch (error) {
      console.error("Error saving draft:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Error saving draft. Please try again.";

      setAlert({
        show: true,
        message: errorMessage,
        type: "danger",
      });
    }
  };

  const handleBack = () => {
    navigate("/stock-request");
  };

  // Filter and sort products
  const filteredAndSortedProducts = [...products]
    .filter((product) =>
      product.productTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aSelected = !!selectedRows[a._id];
      const bSelected = !!selectedRows[b._id];

      if (aSelected && bSelected) {
        const aOrder =
          selectionOrder.find(
            (item) => item.productId === a._id
          )?.order || 0;

        const bOrder =
          selectionOrder.find(
            (item) => item.productId === b._id
          )?.order || 0;

        return aOrder - bOrder;
      }

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      return 0;
    });

  const inputBaseClass =
    "w-full rounded-md border px-3 py-2 text-sm outline-none transition";

  const getInputClass = (field) => {
    if (errors[field]) {
      return `${inputBaseClass} border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100`;
    }

    if (formData[field]) {
      return `${inputBaseClass} border-green-500 bg-green-50 focus:border-green-500 focus:ring-2 focus:ring-green-100`;
    }

    return `${inputBaseClass} border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100`;
  };

  return (
    <div className="min-h-full w-full bg-[#f1f3f6] px-4 py-4 lg:px-6">
      <div className="mb-0 flex items-center gap-2">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-0.5 rounded-[3px] bg-[#2f64ad] px-2.5 py-1.5 text-[15px] font-medium text-white shadow-sm transition hover:bg-[#285895]"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back
        </button>

        <h1 className="text-[25px] font-normal leading-none text-[#303640]">
          {id ? "Edit" : "Add"} Indent Request
        </h1>
      </div>

      <div className="mt-2 overflow-hidden rounded-[2px] border border-[#dfe3e8] border-t-[4px] border-t-[#2f64ad] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="flex min-h-[64px] items-center justify-end gap-3 border-b border-[#e0e3e7] px-4 py-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-2 rounded-[4px] bg-[#2f64ad] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#285895]"
          >
            <FileText size={16} />
            Save As Draft
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-[4px] bg-[#c62828] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#ad2020]"
          >
            <Send size={16} />
            Submit Request
          </button>
        </div>

        <div className="px-5 pb-5 pt-5">
          {alert.show && (
            <div
              className={`mb-5 flex items-start justify-between rounded-[3px] border px-4 py-3 text-sm ${
                alert.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
              role="alert"
            >
              <span>{alert.message}</span>
              <button
                type="button"
                onClick={() =>
                  setAlert({
                    show: false,
                    message: "",
                    type: "",
                  })
                }
                className="ml-4 font-semibold opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-3">
              <div>
                <label
                  htmlFor="warehouse"
                  className={`mb-2 block text-[16px] font-semibold ${
                    errors.warehouse
                      ? "text-red-600"
                      : formData.warehouse
                        ? "text-green-600"
                        : "text-[#303640]"
                  }`}
                >
                  Warehouse <span className="text-red-500">*</span>
                </label>

                <select
                  id="warehouse"
                  name="warehouse"
                  value={formData.warehouse}
                  onChange={handleChange}
                  disabled={warehouseLoading}
                  className={`${getInputClass(
                    "warehouse"
                  )} h-[42px] rounded-[2px] px-3 text-[15px] disabled:cursor-not-allowed disabled:bg-[#f4f4f4]`}
                >
                  <option value="">
                    {warehouseLoading
                      ? "Loading warehouses..."
                      : "Select Warehouse"}
                  </option>

                  {warehouses.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.warehouse?.warehouseName ||
                        item.warehouseName ||
                        item.centerName ||
                        "Unnamed warehouse"}
                    </option>
                  ))}
                </select>

                {errors.warehouse && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.warehouse}
                  </p>
                )}

                {warehouses.length === 0 && !warehouseLoading && (
                  <p className="mt-1 text-xs text-red-600">
                    No telecom warehouses available
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="date"
                  className={`mb-2 block text-[16px] font-semibold ${
                    errors.date
                      ? "text-red-600"
                      : formData.date
                        ? "text-green-600"
                        : "text-[#303640]"
                  }`}
                >
                  Date <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  disabled
                  className={`${getInputClass(
                    "date"
                  )} h-[42px] cursor-not-allowed rounded-[2px] bg-[#f4f4f4] px-3 text-[15px]`}
                />

                {errors.date && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="orderNumber"
                  className="mb-2 block text-[16px] font-semibold text-[#303640]"
                >
                  Order Number
                </label>

                <div className="relative">
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    disabled
                    className={`${inputBaseClass} h-[42px] cursor-not-allowed rounded-[2px] border-[#d4d7db] bg-[#f4f4f4] px-3 text-[15px] text-[#555b63]`}
                  />

                  {generatingOrderNo && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#2f64ad]" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="remark"
                className="mb-2 block text-[16px] font-semibold text-[#303640]"
              >
                Remark
              </label>

              <textarea
                id="remark"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                placeholder="Additional Comment"
                rows={3}
                className="w-full max-w-[410px] resize-none rounded-[2px] border border-[#d4d7db] bg-white px-3 py-2.5 text-[15px] text-[#555b63] outline-none transition placeholder:text-[#777] focus:border-[#2f64ad] focus:ring-1 focus:ring-[#2f64ad]"
              />
            </div>

            <div className="mt-7">
              <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-[22px] font-normal text-[#303640]">
                    Select Products
                  </h2>

                  {errors.products && (
                    <span className="text-sm text-red-600">
                      {errors.products}
                    </span>
                  )}
                </div>

                <div className="flex w-full items-center justify-end gap-2 md:w-auto">
                  <label
                    htmlFor="productSearch"
                    className="whitespace-nowrap text-[16px] font-normal text-[#303640]"
                  >
                    Search:
                  </label>

                  <div className="relative w-full md:w-[238px]">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7b8087]"
                    />

                    <input
                      id="productSearch"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      className="h-[41px] w-full rounded-[5px] border border-[#d4d7db] bg-white py-2 pl-9 pr-3 text-[15px] text-[#303640] outline-none transition focus:border-[#2f64ad] focus:ring-1 focus:ring-[#2f64ad]"
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2f64ad]" />
                </div>
              ) : (
                <div className="w-full overflow-hidden rounded-[2px] border border-[#e0e3e7]">
                  <div className="max-h-[365px] overflow-y-auto overflow-x-hidden">
                    <table className="w-full table-fixed border-collapse text-[16px]">
                      <colgroup>
                        <col className="w-[7%]" />
                        <col className="w-[46%]" />
                        <col className="w-[10%]" />
                        <col className="w-[14%]" />
                        <col className="w-[23%]" />
                      </colgroup>

                      <thead className="sticky top-0 z-20">
                        <tr className="bg-white">
                          <th className="border-b border-r border-[#e5e7eb] px-2 py-3 text-left font-bold text-[#151515]">
                            Select
                          </th>
                          <th className="border-b border-r border-[#e5e7eb] px-2.5 py-3 text-left font-bold text-[#151515]">
                            Product Name
                          </th>
                          <th className="border-b border-r border-[#e5e7eb] px-2.5 py-3 text-left font-bold text-[#151515]">
                            Stock
                          </th>
                          <th className="border-b border-r border-[#e5e7eb] px-2.5 py-3 text-left font-bold text-[#151515]">
                            Quantity
                          </th>
                          <th className="border-b border-[#e5e7eb] px-2.5 py-3 text-left font-bold text-[#151515]">
                            Remark
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredAndSortedProducts.length > 0 ? (
                          filteredAndSortedProducts.map((product) => {
                            const isSelected = !!selectedRows[product._id];

                            return (
                              <tr
                                key={product._id}
                                className={`border-b border-[#e6e7e9] transition-colors ${
                                  isSelected
                                    ? "bg-[#d8ead2]"
                                    : "bg-[#f4f4f4] hover:bg-[#eeeeee]"
                                }`}
                              >
                                <td className="border-r border-[#e5e7eb] px-2 py-2 align-middle">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      handleRowSelect(
                                        product._id,
                                        product.stock
                                      )
                                    }
                                    className="h-[22px] w-[22px] cursor-pointer rounded-[2px] border-[#9ca3af] accent-[#1976d2] focus:ring-0"
                                  />
                                </td>

                                <td className="border-r border-[#e5e7eb] px-2.5 py-2.5 align-middle font-normal text-[#171717]">
                                  <div className="break-words">
                                    {product.productTitle}
                                  </div>
                                </td>

                                <td className="border-r border-[#e5e7eb] px-2.5 py-2.5 align-middle text-[#171717]">
                                  {getAvailableStock(product)}
                                </td>

                                <td className="border-r border-[#e5e7eb] px-2.5 py-2.5 align-middle">
                                  {isSelected && (
                                    <div>
                                      <input
                                        type="number"
                                        value={
                                          selectedRows[product._id].quantity
                                        }
                                        onChange={(e) =>
                                          handleRowInputChange(
                                            product._id,
                                            "quantity",
                                            e.target.value
                                          )
                                        }
                                        min="1"
                                        placeholder="Quantity"
                                        className={`h-[34px] w-[106px] rounded-[1px] border bg-white px-3 text-[14px] text-[#555b63] outline-none ${
                                          errors[`quantity_${product._id}`]
                                            ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-100"
                                            : "border-[#d7d9dc] focus:border-[#2f64ad] focus:ring-1 focus:ring-[#2f64ad]"
                                        }`}
                                      />

                                      {errors[`quantity_${product._id}`] && (
                                        <p className="mt-1 text-xs text-red-600">
                                          Quantity required
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </td>

                                <td className="px-2.5 py-2.5 align-middle">
                                  {isSelected && (
                                    <input
                                      type="text"
                                      value={
                                        selectedRows[product._id].productRemark
                                      }
                                      onChange={(e) =>
                                        handleRowInputChange(
                                          product._id,
                                          "productRemark",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Product Remark"
                                      className="h-[34px] w-full rounded-[1px] border border-[#d7d9dc] bg-white px-3 text-[14px] text-[#555b63] outline-none transition focus:border-[#2f64ad] focus:ring-1 focus:ring-[#2f64ad]"
                                    />
                                  )}
                                </td>
                              </tr>
                            );
                          })
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
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-[#e0e3e7] pt-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-2 rounded-[4px] bg-[#2f64ad] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#285895]"
              >
                <RotateCcw size={16} />
                Save As Draft
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-[4px] bg-[#c62828] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#ad2020]"
              >
                <Check size={16} />
                Submit Stock Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStockRequest;