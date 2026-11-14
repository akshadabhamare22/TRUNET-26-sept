
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

//   // Products load only after a warehouse is selected, so start as false
//   const [loading, setLoading] = useState(false);
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

//   // Used to ignore responses from an older warehouse selection
//   const productRequestId = useRef(0);

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

//     if (!id) {
//       generateAutoOrderNumber();
//     }
//   }, []);

//   // Load product stock for the SELECTED warehouse (outlet).
//   // Re-runs whenever the warehouse changes (also in edit mode,
//   // once fetchStockRequest has filled formData.warehouse).
//   useEffect(() => {
//     fetchProducts(formData.warehouse);
//   }, [formData.warehouse]);

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

//   // Fetch Outlet records from:
//   // GET /centers/main-warehouse?centerType=Outlet
//   // API data is an array of Outlet/Center records. The selected value must
//   // be item._id (Outlet ID), because product stock is fetched by outlet ID.
//   const fetchWarehouses = async () => {
//     try {
//       setWarehouseLoading(true);

//       const res = await axiosInstance.get("/centers/main-warehouse", {
//         params: { centerType: "Outlet" },
//       });

//       const responseData = Array.isArray(res.data?.data)
//         ? res.data.data
//         : Array.isArray(res.data?.data?.centers)
//           ? res.data.data.centers
//           : [];

//       if (res.data?.success) {
//         const outletList = responseData.filter((item) => {
//           const centerStatus = String(item?.status || "").toLowerCase();
//           const centerType = String(item?.centerType || "").toLowerCase();

//           return (
//             centerType === "outlet" &&
//             (!centerStatus || centerStatus === "enable")
//           );
//         });

//         setWarehouses(outletList);
//         console.log("Outlet records retrieved:", outletList);
//       } else {
//         setWarehouses([]);
//         console.error("Outlet API returned an unsuccessful response:", res.data);
//       }
//     } catch (error) {
//       setWarehouses([]);
//       console.error(
//         "Error fetching outlets:",
//         error.response?.data || error.message
//       );
//     } finally {
//       setWarehouseLoading(false);
//     }
//   };

//   // Fetch products with stock for the selected outlet
//   // const fetchProducts = async (outletId) => {
//   //   const requestId = ++productRequestId.current;

//   //   if (!outletId) {
//   //     setProducts([]);
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);

//   //     const res = await axiosInstance.get(
//   //       "/stockpurchase/products/with-stock",
//   //       { params: { outlet: outletId } }
//   //     );

//   //     // A newer request has started; ignore this response
//   //     if (requestId !== productRequestId.current) return;

//   //     if (res.data?.success) {
//   //       const responseData = res.data.data;
//   //       const productList = Array.isArray(responseData)
//   //         ? responseData
//   //         : Array.isArray(responseData?.products)
//   //           ? responseData.products
//   //           : [];

//   //       setProducts(productList);
//   //     } else {
//   //       setProducts([]);
//   //     }
//   //   } catch (error) {
//   //     if (requestId !== productRequestId.current) return;

//   //     console.error("Error fetching products:", error);
//   //     setProducts([]);
//   //   } finally {
//   //     if (requestId === productRequestId.current) {
//   //       setLoading(false);
//   //     }
//   //   }
//   // };

// const fetchProducts = async (outletId) => {
//   const requestId = ++productRequestId.current;

//   if (!outletId) {
//     setProducts([]);
//     setLoading(false);
//     return;
//   }

//   try {
//     setLoading(true);

//     let allProducts = [];
//     let totalPages = 1;

//     // Fetch products page by page
//     for (let page = 1; page <= totalPages; page++) {
//       const res = await axiosInstance.get(
//         "/stockpurchase/products/with-stock",
//         {
//           params: {
//             outlet: outletId,
//             page,
//             limit: 100,
//           },
//         }
//       );

//       // Ignore outdated requests
//       if (requestId !== productRequestId.current) {
//         return;
//       }

//       if (!res.data?.success) {
//         throw new Error(
//           res.data?.message || "Failed to fetch products"
//         );
//       }

//       const responseData = res.data.data;

//       const productList = Array.isArray(responseData)
//         ? responseData
//         : Array.isArray(responseData?.products)
//           ? responseData.products
//           : [];

//       allProducts = [...allProducts, ...productList];

//       // Read pagination from the API response
//       totalPages = Number(res.data?.pagination?.totalPages) || 1;
//     }

//     if (requestId !== productRequestId.current) {
//       return;
//     }

//     // Display all fetched products
//     setProducts(allProducts);

//     console.log("Total products fetched:", allProducts.length);

//   } catch (error) {
//     if (requestId !== productRequestId.current) {
//       return;
//     }

//     console.error("Error fetching products:", error);
//     setProducts([]);
//   } finally {
//     if (requestId === productRequestId.current) {
//       setLoading(false);
//     }
//   }
// };


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

//     // Stock differs per warehouse, so clear earlier product selections
//     if (name === "warehouse") {
//       setSelectedRows({});
//       setSelectionOrder([]);
//       selectionCounter.current = 0;
//       setSearchTerm("");
//     }
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

//                   {warehouses.map((item) => {
//                     const outletName =
//                       item.centerName || item.reseller?.businessName || "Unnamed Outlet";
//                     const outletCode = item.centerCode || "";
//                     const warehouseName =
//                       item.warehouse?.warehouseName || item.warehouseName || "";
//                     const warehouseCode =
//                       item.warehouse?.warehouseCode || item.warehouseCode || "";

//                     return (
//                       <option key={item._id} value={item._id}>
//                         {outletName}
//                         {outletCode ? ` (${outletCode})` : ""}
//                         {warehouseName ? ` — ${warehouseName}` : ""}
//                         {warehouseCode ? ` (${warehouseCode})` : ""}
//                       </option>
//                     );
//                   })}
//                 </select>

//                 {errors.warehouse && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.warehouse}
//                   </p>
//                 )}

//                 {warehouses.length === 0 && !warehouseLoading && (
//                   <p className="mt-1 text-xs text-red-600">
//                     No active Outlets available
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
//                                         getAvailableStock(product)
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
//                               {formData.warehouse
//                                 ? "No products found"
//                                 : "Select a warehouse to see products and stock"}
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

// Safety cap so a misbehaving API can never cause an endless loop
const MAX_PRODUCT_PAGES = 100;

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

  // ---- NEW: complete product list (all pages) for the selected warehouse ----
  const [allProducts, setAllProducts] = useState(null);
  const [allLoading, setAllLoading] = useState(false);

  // Products load only after a warehouse is selected, so start as false
  const [loading, setLoading] = useState(false);
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

  // Used to ignore responses from an older warehouse selection
  const productRequestId = useRef(0);

  // NEW: same idea for the "load all pages" request
  const allProductsRequestId = useRef(0);

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

    if (!id) {
      generateAutoOrderNumber();
    }
  }, []);

  // Load product stock for the SELECTED warehouse (outlet).
  // Re-runs whenever the warehouse changes (also in edit mode,
  // once fetchStockRequest has filled formData.warehouse).
  useEffect(() => {
    fetchProducts(formData.warehouse);
  }, [formData.warehouse]);

  // NEW: also load ALL pages of products for the selected warehouse
  useEffect(() => {
    fetchAllProducts(formData.warehouse);
  }, [formData.warehouse]);

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

  // Fetch Outlet records from:
  // GET /centers/main-warehouse?centerType=Outlet
  // API data is an array of Outlet/Center records. The selected value must
  // be item._id (Outlet ID), because product stock is fetched by outlet ID.
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
        const outletList = responseData.filter((item) => {
          const centerStatus = String(item?.status || "").toLowerCase();
          const centerType = String(item?.centerType || "").toLowerCase();

          return (
            centerType === "outlet" &&
            (!centerStatus || centerStatus === "enable")
          );
        });

        setWarehouses(outletList);
        console.log("Outlet records retrieved:", outletList);
      } else {
        setWarehouses([]);
        console.error("Outlet API returned an unsuccessful response:", res.data);
      }
    } catch (error) {
      setWarehouses([]);
      console.error(
        "Error fetching outlets:",
        error.response?.data || error.message
      );
    } finally {
      setWarehouseLoading(false);
    }
  };

  // Fetch products with stock for the selected outlet
  const fetchProducts = async (outletId) => {
    const requestId = ++productRequestId.current;

    if (!outletId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.get(
        "/stockpurchase/products/with-stock",
        { params: { outlet: outletId } }
      );

      // A newer request has started; ignore this response
      if (requestId !== productRequestId.current) return;

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
      if (requestId !== productRequestId.current) return;

      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      if (requestId === productRequestId.current) {
        setLoading(false);
      }
    }
  };

  // --------------------------------------------------
  // NEW: Fetch ALL pages of products for the selected outlet.
  // Used by the table and the local search so that products
  // which are not on the first page can still be found.
  // --------------------------------------------------
  const fetchAllProducts = async (outletId) => {
    const requestId = ++allProductsRequestId.current;

    // Reset the cached full list whenever the outlet changes
    setAllProducts(null);

    if (!outletId) {
      setAllLoading(false);
      return;
    }

    try {
      setAllLoading(true);

      const combined = [];
      const seen = new Set();
      let totalPages = null;
      let page = 1;

      while (page <= MAX_PRODUCT_PAGES) {
        const res = await axiosInstance.get(
          "/stockpurchase/products/with-stock",
          { params: { outlet: outletId, page } }
        );

        // A newer request has started; ignore this response
        if (requestId !== allProductsRequestId.current) return;

        if (!res.data?.success) break;

        const payload = res.data.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.products)
            ? payload.products
            : [];

        const pagination =
          payload?.pagination || res.data?.pagination || {};

        // <-- ADDED LOG (paste position)
        console.log("PAGE", page, "items:", list.length, "pagination:", pagination);

        if (pagination.totalPages) {
          totalPages = pagination.totalPages;
        }

        let added = 0;
        list.forEach((product) => {
          if (!seen.has(product._id)) {
            seen.add(product._id);
            combined.push(product);
            added++;
          }
        });

        // Nothing new on this page -> we have everything
        // (also covers APIs that ignore the page parameter)
        if (added === 0) break;

        // Reached the last page reported by the API
        if (totalPages && page >= totalPages) break;

        page++;
      }

      if (requestId !== allProductsRequestId.current) return;

      if (combined.length > 0) {
        setAllProducts(combined);
      }
    } catch (error) {
      if (requestId !== allProductsRequestId.current) return;

      console.error("Error fetching all products:", error);
      // falls back to the products from fetchProducts
    } finally {
      if (requestId === allProductsRequestId.current) {
        setAllLoading(false);
      }
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

    // Stock differs per warehouse, so clear earlier product selections
    if (name === "warehouse") {
      setSelectedRows({});
      setSelectionOrder([]);
      selectionCounter.current = 0;
      setSearchTerm("");
    }
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

  // NEW: use the complete list (all pages) once it has loaded,
  // otherwise fall back to the first batch from fetchProducts
  const sourceProducts = allProducts !== null ? allProducts : products;

  // Filter and sort products
  const filteredAndSortedProducts = [...sourceProducts]
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

                  {warehouses.map((item) => {
                    const outletName =
                      item.centerName || item.reseller?.businessName || "Unnamed Outlet";
                    const outletCode = item.centerCode || "";
                    const warehouseName =
                      item.warehouse?.warehouseName || item.warehouseName || "";
                    const warehouseCode =
                      item.warehouse?.warehouseCode || item.warehouseCode || "";

                    return (
                      <option key={item._id} value={item._id}>
                        {outletName}
                        {outletCode ? ` (${outletCode})` : ""}
                        {warehouseName ? ` — ${warehouseName}` : ""}
                        {warehouseCode ? ` (${warehouseCode})` : ""}
                      </option>
                    );
                  })}
                </select>

                {errors.warehouse && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.warehouse}
                  </p>
                )}

                {warehouses.length === 0 && !warehouseLoading && (
                  <p className="mt-1 text-xs text-red-600">
                    No active Outlets available
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

                  {allLoading && !loading && (
                    <span className="text-xs text-gray-500">
                      Loading all products...
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
                                        getAvailableStock(product)
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
                              {formData.warehouse
                                ? allLoading
                                  ? "Loading all products..."
                                  : "No products found"
                                : "Select a warehouse to see products and stock"}
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