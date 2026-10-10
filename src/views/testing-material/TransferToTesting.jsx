// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   Check,
//   Hash,
//   RotateCcw,
//   Search,
//   Send,
//   X,
// } from "lucide-react";
// import axiosInstance from "../../axiosInstance";import TestingSerialNumber from "./TestingSerialNumber";

// const TransferToTesting = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const getTodayDate = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, "0");
//     const day = String(today.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const [formData, setFormData] = useState({
//     date: getTodayDate(),
//     toCenter: "",
//     remark: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRows, setSelectedRows] = useState({});
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const [serialModalVisible, setSerialModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [assignedSerials, setAssignedSerials] = useState({});
//   const [alert, setAlert] = useState({
//     show: false,
//     message: "",
//     type: "",
//   });

//   const [selectionOrder, setSelectionOrder] = useState([]);
//   const [userCenterId, setUserCenterId] = useState(null);
//   const selectionCounter = useRef(0);

//   useEffect(() => {
//     fetchProducts();
//     fetchCenters();
//   }, [id]);

//   const showAlert = (message, type) => {
//     setAlert({ show: true, message, type });

//     setTimeout(() => {
//       setAlert({ show: false, message: "", type: "" });
//     }, 1500);
//   };

//   const handleOpenSerialModal = (product) => {
//     const usageQuantity =
//       parseInt(selectedRows[product._id]?.quantity, 10) || 0;

//     if (usageQuantity > 0) {
//       setSelectedProduct(product);
//       setSerialModalVisible(true);
//     }
//   };

//   const handleSerialNumbersUpdate = (productId, serialsArray) => {
//     setAssignedSerials((prev) => ({
//       ...prev,
//       [productId]: serialsArray,
//     }));
//   };

//   const fetchCenters = async () => {
//     try {
//       const res = await axiosInstance.get(
//         "/centers/main-warehouse?centerType=Center",
//       );
//       setCenters(res.data.data || []);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const getUserCenter = async () => {
//       try {
//         const response = await axiosInstance.get("/auth/me");

//         if (
//           response.data.success &&
//           response.data.data?.user?.center?._id
//         ) {
//           setUserCenterId(response.data.data.user.center._id);
//         }
//       } catch (err) {
//         console.error("Error fetching user info:", err);
//       }
//     };

//     getUserCenter();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await axiosInstance.get(
//         "/stockpurchase/products/with-stock",
//       );

//       if (res.data.success) {
//         setProducts(res.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       showAlert("Failed to fetch products", "danger");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRowSelect = (productId, productStock) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };

//       if (updated[productId]) {
//         setSelectionOrder((prevOrder) =>
//           prevOrder.filter((item) => item.productId !== productId),
//         );
//         delete updated[productId];
//       } else {
//         const newOrder = selectionCounter.current++;

//         setSelectionOrder((prevOrder) => [
//           { productId, order: newOrder },
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

//   const handleUsageQtyChange = (productId, value) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         quantity: value,
//       },
//     }));
//   };

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

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};

//     if (!formData.date) {
//       newErrors.date = "Date is required";
//     }

//     if (!formData.toCenter) {
//       newErrors.toCenter = "Testing center is required";
//     }

//     if (Object.keys(selectedRows).length === 0) {
//       newErrors.products = "Please select at least one product";
//     }

//     Object.keys(selectedRows).forEach((productId) => {
//       const product = products.find((p) => p._id === productId);
//       const selectedRow = selectedRows[productId];

//       if (!selectedRow.quantity || parseInt(selectedRow.quantity, 10) <= 0) {
//         newErrors.products = `Please enter valid transfer quantity for ${product?.productTitle}`;
//       }

//       if (product?.trackSerialNumber === "Yes") {
//         const usageQty = parseInt(selectedRow.quantity, 10);
//         const assignedSerialsForProduct = assignedSerials[productId] || [];

//         if (assignedSerialsForProduct.length !== usageQty) {
//           newErrors.products = `Please assign serial numbers for all ${usageQty} items of ${product?.productTitle}`;
//         }
//       }
//     });

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       setSubmitLoading(true);

//       const testingProducts = Object.keys(selectedRows).map((productId) => {
//         const product = products.find((p) => p._id === productId);
//         const selectedRow = selectedRows[productId];
//         const serialNumbers = assignedSerials[productId] || [];

//         const item = {
//           product: productId,
//           quantity: parseInt(selectedRow.quantity, 10),
//           remark: selectedRow.productRemark || "",
//         };

//         if (serialNumbers.length > 0) {
//           item.serialNumbers = serialNumbers;
//         }

//         return item;
//       });

//       const payload = {
//         toCenter: formData.toCenter,
//         remark: formData.remark || "",
//         products: testingProducts,
//       };

//       console.log("Submitting testing material request:", payload);

//       await axiosInstance.post("/testing-material", payload);

//       showAlert(
//         "Testing material request created successfully!",
//         "success",
//       );

//       setTimeout(() => {
//         navigate("/testing-stock");
//       }, 1500);
//     } catch (error) {
//       console.error("Error saving testing material request:", error);

//       let errorMessage = "Failed to create testing material request";

//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;

//         if (errorMessage.includes("Serial numbers are required")) {
//           errorMessage =
//             "Serial numbers are required for serialized products";
//         } else if (errorMessage.includes("No stock available")) {
//           errorMessage =
//             "Some products are not available in your outlet stock";
//         } else if (errorMessage.includes("Insufficient stock")) {
//           errorMessage =
//             "Insufficient stock available for one or more products";
//         } else if (
//           errorMessage.includes("not available in your outlet stock")
//         ) {
//           errorMessage =
//             "Some serial numbers are not available in your outlet stock";
//         }
//       }

//       showAlert(errorMessage, "danger");
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       date: getTodayDate(),
//       toCenter: "",
//       remark: "",
//     });
//     setSelectedRows({});
//     setAssignedSerials({});
//     setSelectionOrder([]);
//     selectionCounter.current = 0;
//     setErrors({});
//     showAlert("Form has been reset", "info");
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const filteredProducts = products
//     .filter((p) =>
//       p.productTitle?.toLowerCase().includes(searchTerm.toLowerCase()),
//     )
//     .sort((a, b) => {
//       const aSelected = !!selectedRows[a._id];
//       const bSelected = !!selectedRows[b._id];

//       if (aSelected && bSelected) {
//         const aOrder =
//           selectionOrder.find((item) => item.productId === a._id)?.order || 0;
//         const bOrder =
//           selectionOrder.find((item) => item.productId === b._id)?.order || 0;

//         return aOrder - bOrder;
//       }

//       if (aSelected && !bSelected) return -1;
//       if (!aSelected && bSelected) return 1;

//       return 0;
//     });

//   const alertClasses = {
//     success: "border-green-200 bg-green-50 text-green-800",
//     danger: "border-red-200 bg-red-50 text-red-800",
//     info: "border-blue-200 bg-blue-50 text-blue-800",
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="mb-5 flex flex-wrap items-center gap-3">
//         <button
//           type="button"
//           onClick={handleBack}
//           className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>

//         <h1 className="text-xl font-semibold text-gray-800">
//           Transfer to Testing
//         </h1>
//       </div>

//       <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         <div className="flex items-center justify-end border-b border-gray-200 bg-gray-50 px-4 py-3">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//           >
//             <RotateCcw size={16} />
//             Reset
//           </button>
//         </div>

//         <div className="p-4 md:p-6">
//           {alert.show && (
//             <div
//               className={`mb-5 flex items-start justify-between gap-4 rounded-md border px-4 py-3 text-sm ${
//                 alertClasses[alert.type] ||
//                 "border-gray-200 bg-gray-50 text-gray-700"
//               }`}
//             >
//               <span>{alert.message}</span>
//               <button
//                 type="button"
//                 onClick={() =>
//                   setAlert({ show: false, message: "", type: "" })
//                 }
//                 className="shrink-0 rounded p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
//                 aria-label="Close alert"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
//               <div>
//                 <label
//                   htmlFor="date"
//                   className={`mb-1.5 block text-sm font-medium ${
//                     errors.date ? "text-red-600" : "text-gray-700"
//                   }`}
//                 >
//                   Date <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   id="date"
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   disabled
//                   className={`w-full rounded-md border px-3 py-2.5 text-sm outline-none ${
//                     errors.date
//                       ? "border-red-400 bg-red-50"
//                       : "border-gray-300 bg-gray-100 text-gray-600"
//                   }`}
//                 />

//                 {errors.date && (
//                   <p className="mt-1 text-xs text-red-600">{errors.date}</p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="toCenter"
//                   className={`mb-1.5 block text-sm font-medium ${
//                     errors.toCenter ? "text-red-600" : "text-gray-700"
//                   }`}
//                 >
//                   Testing Center <span className="text-red-500">*</span>
//                 </label>

//                 <select
//                   id="toCenter"
//                   name="toCenter"
//                   value={formData.toCenter}
//                   onChange={handleChange}
//                   className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 ${
//                     errors.toCenter
//                       ? "border-red-400"
//                       : formData.toCenter
//                         ? "border-blue-400"
//                         : "border-gray-300"
//                   }`}
//                 >
//                   <option value="">Select Testing Center</option>
//                   {centers.map((center) => (
//                     <option key={center._id} value={center._id}>
//                       {center.centerName}
//                     </option>
//                   ))}
//                 </select>

//                 {errors.toCenter && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.toCenter}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="remark"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Remark
//                 </label>

//                 <textarea
//                   id="remark"
//                   name="remark"
//                   value={formData.remark}
//                   onChange={handleChange}
//                   rows={1}
//                   className="min-h-[42px] w-full resize-y rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />
//               </div>
//             </div>

//             <div className="mt-7">
//               <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//                 <div className="flex flex-wrap items-center gap-3">
//                   <h2 className="text-base font-semibold text-gray-800">
//                     Select Products for Testing
//                   </h2>

//                   {errors.products && (
//                     <span className="text-sm text-red-600">
//                       {errors.products}
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex w-full items-center gap-2 lg:w-auto">
//                   <label
//                     htmlFor="productSearch"
//                     className="shrink-0 text-sm font-medium text-gray-600"
//                   >
//                     Search:
//                   </label>

//                   <div className="relative w-full lg:w-[250px]">
//                     <Search
//                       size={16}
//                       className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     />
//                     <input
//                       id="productSearch"
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       placeholder="Search products..."
//                       className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {loading ? (
//                 <div className="flex min-h-[180px] items-center justify-center rounded-md border border-gray-200">
//                   <div className="flex items-center gap-3 text-sm text-gray-600">
//                     <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
//                     Loading products...
//                   </div>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto rounded-md border border-gray-200">
//                   <table className="min-w-full border-collapse text-sm">
//                     <thead>
//                       <tr className="bg-gray-50 text-left">
//                         <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                           Select
//                         </th>
//                         <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                           Product Name
//                         </th>
//                         <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                           Available Quantity
//                         </th>
//                         <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                           Transfer Qty
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {filteredProducts.length > 0 ? (
//                         filteredProducts.map((p) => {
//                           const isSelected = !!selectedRows[p._id];
//                           const availableQuantity = p.stock?.currentStock || 0;

//                           return (
//                             <tr
//                               key={p._id}
//                               className={`transition ${
//                                 isSelected
//                                   ? "bg-blue-50"
//                                   : "hover:bg-gray-50"
//                               }`}
//                             >
//                               <td className="border-b border-gray-100 px-4 py-3 align-middle">
//                                 <input
//                                   type="checkbox"
//                                   checked={isSelected}
//                                   onChange={() =>
//                                     handleRowSelect(
//                                       p._id,
//                                       p.stock?.currentStock || 0,
//                                     )
//                                   }
//                                   className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                 />
//                               </td>

//                               <td className="border-b border-gray-100 px-4 py-3 font-medium text-gray-800">
//                                 {p.productTitle}
//                               </td>

//                               <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
//                                 {availableQuantity}
//                               </td>

//                               <td className="border-b border-gray-100 px-4 py-3">
//                                 {isSelected && (
//                                   <div className="flex items-center gap-2">
//                                     <input
//                                       type="number"
//                                       value={
//                                         selectedRows[p._id]?.quantity || ""
//                                       }
//                                       onChange={(e) =>
//                                         handleUsageQtyChange(
//                                           p._id,
//                                           e.target.value,
//                                         )
//                                       }
//                                       placeholder="Transfer Qty"
//                                       min="1"
//                                       max={availableQuantity}
//                                       className="w-28 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                     />

//                                     {p.trackSerialNumber === "Yes" && (
//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           handleOpenSerialModal(p)
//                                         }
//                                         title="Add Serial Numbers"
//                                         className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
//                                       >
//                                         <Hash size={18} />
//                                       </button>
//                                     )}
//                                   </div>
//                                 )}
//                               </td>
//                             </tr>
//                           );
//                         })
//                       ) : (
//                         <tr>
//                           <td
//                             colSpan={4}
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

//             <div className="mt-5 flex justify-end border-t border-gray-200 pt-4">
//               <button
//                 type="submit"
//                 disabled={submitLoading}
//                 className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {submitLoading ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <Send size={16} />
//                     Submit Transfer Request
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <TestingSerialNumber
//         visible={serialModalVisible}
//         onClose={() => setSerialModalVisible(false)}
//         product={selectedProduct}
//         usageQty={
//           parseInt(selectedRows[selectedProduct?._id]?.quantity, 10) || 0
//         }
//         onSerialNumbersUpdate={handleSerialNumbersUpdate}
//       />
//     </div>
//   );
// };

// export default TransferToTesting;


import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Hash,
  RotateCcw,
  Search,
  Send,
  X,
} from "lucide-react";
import axiosInstance from "../../axiosInstance";import TestingSerialNumber from "./TestingSerialNumber";

const TransferToTesting = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    date: getTodayDate(),
    toCenter: "",
    remark: "",
  });

  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState({});
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState({});
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [selectionOrder, setSelectionOrder] = useState([]);
  const [userCenterId, setUserCenterId] = useState(null);
  const selectionCounter = useRef(0);

  useEffect(() => {
    fetchProducts();
    fetchCenters();
  }, [id]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });

    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 1500);
  };

  const handleOpenSerialModal = (product) => {
    const usageQuantity =
      parseInt(selectedRows[product._id]?.quantity, 10) || 0;

    if (usageQuantity > 0) {
      setSelectedProduct(product);
      setSerialModalVisible(true);
    }
  };

  const handleSerialNumbersUpdate = (productId, serialsArray) => {
    setAssignedSerials((prev) => ({
      ...prev,
      [productId]: serialsArray,
    }));
  };

  const fetchCenters = async () => {
    try {
      const res = await axiosInstance.get(
        "/centers/main-warehouse?centerType=Center",
      );
      setCenters(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUserCenter = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");

        if (
          response.data.success &&
          response.data.data?.user?.center?._id
        ) {
          setUserCenterId(response.data.data.user.center._id);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    getUserCenter();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get(
        "/stockpurchase/products/with-stock",
      );

      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      showAlert("Failed to fetch products", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelect = (productId, productStock) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };

      if (updated[productId]) {
        setSelectionOrder((prevOrder) =>
          prevOrder.filter((item) => item.productId !== productId),
        );
        delete updated[productId];
      } else {
        const newOrder = selectionCounter.current++;

        setSelectionOrder((prevOrder) => [
          { productId, order: newOrder },
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

  const handleUsageQtyChange = (productId, value) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: value,
      },
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.toCenter) {
      newErrors.toCenter = "Testing center is required";
    }

    if (Object.keys(selectedRows).length === 0) {
      newErrors.products = "Please select at least one product";
    }

    Object.keys(selectedRows).forEach((productId) => {
      const product = products.find((p) => p._id === productId);
      const selectedRow = selectedRows[productId];

      if (!selectedRow.quantity || parseInt(selectedRow.quantity, 10) <= 0) {
        newErrors.products = `Please enter valid transfer quantity for ${product?.productTitle}`;
      }

      if (product?.trackSerialNumber === "Yes") {
        const usageQty = parseInt(selectedRow.quantity, 10);
        const assignedSerialsForProduct = assignedSerials[productId] || [];

        if (assignedSerialsForProduct.length !== usageQty) {
          newErrors.products = `Please assign serial numbers for all ${usageQty} items of ${product?.productTitle}`;
        }
      }
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitLoading(true);

      const testingProducts = Object.keys(selectedRows).map((productId) => {
        const product = products.find((p) => p._id === productId);
        const selectedRow = selectedRows[productId];
        const serialNumbers = assignedSerials[productId] || [];

        const item = {
          product: productId,
          quantity: parseInt(selectedRow.quantity, 10),
          remark: selectedRow.productRemark || "",
        };

        if (serialNumbers.length > 0) {
          item.serialNumbers = serialNumbers;
        }

        return item;
      });

      const payload = {
        toCenter: formData.toCenter,
        remark: formData.remark || "",
        products: testingProducts,
      };

      console.log("Submitting testing material request:", payload);

      await axiosInstance.post("/testing-material", payload);

      showAlert(
        "Testing material request created successfully!",
        "success",
      );

      setTimeout(() => {
        navigate("/testing-stock");
      }, 1500);
    } catch (error) {
      console.error("Error saving testing material request:", error);

      let errorMessage = "Failed to create testing material request";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        if (errorMessage.includes("Serial numbers are required")) {
          errorMessage =
            "Serial numbers are required for serialized products";
        } else if (errorMessage.includes("No stock available")) {
          errorMessage =
            "Some products are not available in your outlet stock";
        } else if (errorMessage.includes("Insufficient stock")) {
          errorMessage =
            "Insufficient stock available for one or more products";
        } else if (
          errorMessage.includes("not available in your outlet stock")
        ) {
          errorMessage =
            "Some serial numbers are not available in your outlet stock";
        }
      }

      showAlert(errorMessage, "danger");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      date: getTodayDate(),
      toCenter: "",
      remark: "",
    });
    setSelectedRows({});
    setAssignedSerials({});
    setSelectionOrder([]);
    selectionCounter.current = 0;
    setErrors({});
    showAlert("Form has been reset", "info");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const filteredProducts = products
    .filter((p) =>
      p.productTitle?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const aSelected = !!selectedRows[a._id];
      const bSelected = !!selectedRows[b._id];

      if (aSelected && bSelected) {
        const aOrder =
          selectionOrder.find((item) => item.productId === a._id)?.order || 0;
        const bOrder =
          selectionOrder.find((item) => item.productId === b._id)?.order || 0;

        return aOrder - bOrder;
      }

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      return 0;
    });

  const alertClasses = {
    success: "border-green-200 bg-green-50 text-green-800",
    danger: "border-red-200 bg-red-50 text-red-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-md bg-[#2759a2] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b] focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="mb-2 text-[24px] font-[450] leading-tight text-[#212529]">
          Transfer to Testing
        </h1>
      </div>

      <div className="overflow-hidden rounded-md border border-gray-200 border-t-4 border-t-[#2759a2] bg-white shadow-sm">
        <div className="flex items-center justify-end border-b border-gray-200 bg-white px-4 py-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#2759a2] hover:text-[#2759a2]"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="p-4 md:p-6">
          {alert.show && (
            <div
              className={`mb-3 flex items-start justify-between gap-4 rounded-md border px-4 py-3 text-sm ${
                alertClasses[alert.type] ||
                "border-gray-200 bg-gray-50 text-gray-700"
              }`}
            >
              <span>{alert.message}</span>
              <button
                type="button"
                onClick={() =>
                  setAlert({ show: false, message: "", type: "" })
                }
                className="shrink-0 rounded p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
                aria-label="Close alert"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label
                  htmlFor="date"
                  className={`mb-1.5 block text-sm font-medium ${
                    errors.date ? "text-red-600" : "text-gray-700"
                  }`}
                >
                  Date <span className="text-red-500">*</span>
                </label>

                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  disabled
                  className={`w-full rounded-md border px-3 py-2.5 text-sm outline-none ${
                    errors.date
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-gray-100 text-gray-600"
                  }`}
                />

                {errors.date && (
                  <p className="mt-1 text-xs text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="toCenter"
                  className={`mb-1.5 block text-sm font-medium ${
                    errors.toCenter ? "text-red-600" : "text-gray-700"
                  }`}
                >
                  Testing Center <span className="text-red-500">*</span>
                </label>

                <select
                  id="toCenter"
                  name="toCenter"
                  value={formData.toCenter}
                  onChange={handleChange}
                  className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 ${
                    errors.toCenter
                      ? "border-red-400"
                      : formData.toCenter
                        ? "border-blue-400"
                        : "border-gray-300"
                  }`}
                >
                  <option value="">Select Testing Center</option>
                  {centers.map((center) => (
                    <option key={center._id} value={center._id}>
                      {center.centerName}
                    </option>
                  ))}
                </select>

                {errors.toCenter && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.toCenter}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="remark"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Remark
                </label>

                <textarea
                  id="remark"
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  rows={1}
                  className="min-h-[42px] w-full resize-y rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Select Products for Testing
                  </h2>

                  {errors.products && (
                    <span className="text-sm text-red-600">
                      {errors.products}
                    </span>
                  )}
                </div>

                <div className="flex w-full items-center gap-2 lg:w-auto">
                  <label
                    htmlFor="productSearch"
                    className="shrink-0 text-sm font-medium text-gray-600"
                  >
                    Search:
                  </label>

                  <div className="relative w-full lg:w-[250px]">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="productSearch"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex min-h-[180px] items-center justify-center rounded-md border border-gray-200">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#2759a2]" />
                    Loading products...
                  </div>
                </div>
              ) : (
                <div className="max-h-[520px] overflow-y-auto overflow-x-hidden rounded-md border border-gray-200">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-[#f1f3f5] text-left">
                        <th className="border-b border-gray-200 bg-[#f1f3f5] px-4 py-3 text-left font-semibold text-gray-800">
                          Select
                        </th>
                        <th className="border-b border-gray-200 bg-[#f1f3f5] px-4 py-3 text-left font-semibold text-gray-800">
                          Product Name
                        </th>
                        <th className="border-b border-gray-200 bg-[#f1f3f5] px-4 py-3 text-left font-semibold text-gray-800">
                          Available Quantity
                        </th>
                        <th className="border-b border-gray-200 bg-[#f1f3f5] px-4 py-3 text-left font-semibold text-gray-800">
                          Transfer Qty
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => {
                          const isSelected = !!selectedRows[p._id];
                          const availableQuantity = p.stock?.currentStock || 0;

                          return (
                            <tr
                              key={p._id}
                              className={`transition ${
                                isSelected
                                  ? "bg-[#DFF0D8]"
                                  : "odd:bg-white even:bg-[#f1f1f1] hover:bg-blue-50"
                              }`}
                            >
                              <td className="border-b border-gray-200 px-4 py-3 align-middle">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() =>
                                    handleRowSelect(
                                      p._id,
                                      p.stock?.currentStock || 0,
                                    )
                                  }
                                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#2759a2] focus:ring-[#2759a2]"
                                />
                              </td>

                              <td className="border-b border-gray-200 px-4 py-3 font-medium text-gray-800">
                                {p.productTitle}
                              </td>

                              <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                                {availableQuantity}
                              </td>

                              <td className="border-b border-gray-200 px-4 py-3">
                                {isSelected && (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      value={
                                        selectedRows[p._id]?.quantity || ""
                                      }
                                      onChange={(e) =>
                                        handleUsageQtyChange(
                                          p._id,
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Transfer Qty"
                                      min="1"
                                      max={availableQuantity}
                                      className="w-28 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
                                    />

                                    {p.trackSerialNumber === "Yes" && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenSerialModal(p)
                                        }
                                        title="Add Serial Numbers"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-[#2759a2] transition hover:bg-blue-100"
                                      >
                                        <Hash size={18} />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
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

            <div className="mt-5 flex justify-end border-t border-gray-200 pt-4">
              <button
                type="submit"
                disabled={submitLoading}
                className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-md bg-[#2759a2] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b] focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Transfer Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <TestingSerialNumber
        visible={serialModalVisible}
        onClose={() => setSerialModalVisible(false)}
        product={selectedProduct}
        usageQty={
          parseInt(selectedRows[selectedProduct?._id]?.quantity, 10) || 0
        }
        onSerialNumbersUpdate={handleSerialNumbersUpdate}
      />
    </div>
  );
};

export default TransferToTesting;
