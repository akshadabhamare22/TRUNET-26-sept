// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Check,
//   RotateCcw,
//   Search,
//   X,
//   XCircle,
// } from "lucide-react";
// import axiosInstance from "../../axiosInstance";import UnderRepairedSerial from "./UnderRepairedSerial";

// const TestMaterial = () => {
//   const navigate = useNavigate();

//   const getTodayDate = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, "0");
//     const day = String(today.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const [formData, setFormData] = useState({
//     date: getTodayDate(),
//     remark: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRows, setSelectedRows] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [alert, setAlert] = useState({
//     show: false,
//     message: "",
//     type: "",
//   });
//   const [serialModalVisible, setSerialModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [assignedSerials, setAssignedSerials] = useState({});

//   useEffect(() => {
//     fetchUnderTestingProducts();
//   }, []);

//   const showAlert = (message, type) => {
//     setAlert({ show: true, message, type });

//     setTimeout(() => {
//       setAlert({ show: false, message: "", type: "" });
//     }, 5000);
//   };

//   const fetchUnderTestingProducts = async () => {
//     try {
//       setLoading(true);

//       const res = await axiosInstance.get(
//         "/testing-material/under-testing-product",
//       );

//       if (res.data.success) {
//         setProducts(res.data.data.products || []);

//         if (res.data.data.products.length === 0) {
//           showAlert("No products currently under testing", "info");
//         }
//       } else {
//         showAlert(
//           res.data.message || "Failed to fetch products",
//           "danger",
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching under testing products:", error);

//       showAlert(
//         error.response?.data?.message ||
//           "Failed to fetch under testing products",
//         "danger",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenSerialModal = (repairTransfer) => {
//     const usageQuantity =
//       parseInt(selectedRows[repairTransfer._id]?.quantity) || 0;

//     if (usageQuantity > 0) {
//       const productForSerial = {
//         _id: repairTransfer.product._id,
//         productTitle: repairTransfer.product.productTitle,
//         trackSerialNumber: repairTransfer.product.trackSerialNumber,
//         repairTransferId: repairTransfer._id,
//       };

//       setSelectedProduct(productForSerial);
//       setSerialModalVisible(true);
//     }
//   };

//   const handleSerialNumbersUpdate = (productId, serialsArray) => {
//     setAssignedSerials((prev) => ({
//       ...prev,
//       [productId]: serialsArray,
//     }));
//   };

//   const handleRowSelect = (productId, underTestingQty) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };

//       if (updated[productId]) {
//         delete updated[productId];
//       } else {
//         updated[productId] = {
//           quantity: "",
//           underTestingQty: underTestingQty || 0,
//         };
//       }

//       return updated;
//     });
//   };

//   const handleUsageQtyChange = (productId, value) => {
//     const numValue = parseInt(value) || 0;

//     setSelectedRows((prev) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         quantity: numValue > 0 ? numValue : "",
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

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.date) {
//       newErrors.date = "Date is required";
//     }

//     if (Object.keys(selectedRows).length === 0) {
//       newErrors.products = "Please select at least one product";
//     }

//     Object.keys(selectedRows).forEach((productId) => {
//       const product = products.find((p) => p._id === productId);
//       const selectedRow = selectedRows[productId];

//       if (!selectedRow.quantity || parseInt(selectedRow.quantity) <= 0) {
//         newErrors.products = `Please enter valid quantity for ${
//           product?.product?.productTitle
//         }`;
//       }

//       const usageQty = parseInt(selectedRow.quantity);
//       const maxQty = selectedRow.underTestingQty;

//       if (usageQty > maxQty) {
//         newErrors.products = `Cannot test more than ${maxQty} items for ${
//           product?.product?.productTitle
//         }`;
//       }
//     });

//     return newErrors;
//   };

//   const handleSubmit = async (testResult) => {
//     const newErrors = validateForm();

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       const items = Object.keys(selectedRows).map((productId) => {
//         const product = products.find((p) => p._id === productId);
//         const selectedRow = selectedRows[productId];
//         const usageQty = parseInt(selectedRow.quantity);

//         // Preserve the original source logic for serialized products.
//         let serialNumbers = [];

//         if (
//           product?.serialized &&
//           product?.serialNumbers?.data?.length > 0
//         ) {
//           serialNumbers = product.serialNumbers.data
//             .filter((serial) => serial.status === "under_testing")
//             .slice(0, usageQty)
//             .map((serial) => serial.serialNumber);
//         }

//         return {
//           testingStockId: productId,
//           product: product.product._id,
//           quantity: usageQty,
//           serialNumbers,
//           testResult,
//         };
//       });

//       const payload = {
//         date: formData.date,
//         remark: formData.remark || "",
//         items,
//       };

//       console.log("Submitting test result payload:", payload);

//       const response = await axiosInstance.post(
//         "/testing-material/update-test-results",
//         payload,
//       );

//       if (response.data.success) {
//         const statusMessage =
//           testResult === "passed"
//             ? "marked as passed!"
//             : "marked as failed!";

//         showAlert(`Products ${statusMessage}`, "success");

//         setTimeout(() => {
//           fetchUnderTestingProducts();
//           setSelectedRows({});
//           setFormData({
//             date: getTodayDate(),
//             remark: "",
//           });
//         }, 1500);
//       } else {
//         showAlert(
//           response.data.message || "Failed to update test results",
//           "danger",
//         );
//       }
//     } catch (error) {
//       console.error("Error updating test results:", error);

//       let errorMessage = "Failed to update test results";

//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }

//       showAlert(errorMessage, "danger");
//     }
//   };

//   const handleTestingOk = () => {
//     handleSubmit("passed");
//   };

//   const handleTestingFailed = () => {
//     handleSubmit("failed");
//   };

//   const handleReset = () => {
//     setFormData({
//       date: getTodayDate(),
//       remark: "",
//     });
//     setSelectedRows({});
//     setErrors({});
//     showAlert("Form has been reset", "info");
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const filteredProducts = products.filter(
//     (p) =>
//       p.product?.productTitle
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       p.product?.productCode
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()),
//   );

//   const alertClasses = {
//     success: "border-green-200 bg-green-50 text-green-700",
//     danger: "border-red-200 bg-red-50 text-red-700",
//     info: "border-blue-200 bg-blue-50 text-blue-700",
//     warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="mx-auto max-w-[1600px]">
//         {/* Page Header */}
//         <div className="mb-4 flex flex-wrap items-center gap-3">
//           <button
//             type="button"
//             onClick={handleBack}
//             className="inline-flex items-center gap-2 rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
//           >
//             <ArrowLeft size={16} />
//             Back
//           </button>

//           <h1 className="text-xl font-semibold text-gray-800">
//             Test Under Testing Products
//           </h1>
//         </div>

//         {/* Main Card */}
//         <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//           <div className="flex justify-end border-b border-gray-200 bg-gray-50 px-4 py-3">
//             <button
//               type="button"
//               onClick={handleReset}
//               className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//             >
//               <RotateCcw size={15} />
//               Reset
//             </button>
//           </div>

//           <div className="p-4 md:p-5">
//             {alert.show && (
//               <div
//                 className={`mb-4 flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm ${
//                   alertClasses[alert.type] ||
//                   "border-gray-200 bg-gray-50 text-gray-700"
//                 }`}
//                 role="alert"
//               >
//                 <span>{alert.message}</span>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setAlert({
//                       show: false,
//                       message: "",
//                       type: "",
//                     })
//                   }
//                   className="shrink-0 opacity-70 transition hover:opacity-100"
//                   aria-label="Close alert"
//                 >
//                   <X size={17} />
//                 </button>
//               </div>
//             )}

//             <form onSubmit={(e) => e.preventDefault()}>
//               {/* Basic Information */}
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
//                 <div>
//                   <label
//                     htmlFor="test-date"
//                     className={`mb-1.5 block text-sm font-medium ${
//                       errors.date ? "text-red-600" : "text-gray-700"
//                     }`}
//                   >
//                     Date <span className="text-red-500">*</span>
//                   </label>

//                   <input
//                     id="test-date"
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleChange}
//                     disabled
//                     className={`w-full rounded-md border px-3 py-2 text-sm outline-none ${
//                       errors.date
//                         ? "border-red-400 bg-red-50"
//                         : "border-gray-300 bg-gray-100"
//                     }`}
//                   />

//                   {errors.date && (
//                     <p className="mt-1 text-xs text-red-600">{errors.date}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="test-remark"
//                     className="mb-1.5 block text-sm font-medium text-gray-700"
//                   >
//                     Remark
//                   </label>

//                   <textarea
//                     id="test-remark"
//                     name="remark"
//                     value={formData.remark}
//                     onChange={handleChange}
//                     placeholder="Remark"
//                     rows={3}
//                     className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   />
//                 </div>
//               </div>

//               {/* Products */}
//               <div className="mt-6">
//                 <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//                   <div className="flex items-center gap-3">
//                     <h2 className="text-base font-semibold text-gray-800">
//                       Select Products
//                     </h2>

//                     {errors.products && (
//                       <span className="text-sm font-medium text-red-600">
//                         {errors.products}
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex w-full items-center gap-2 sm:w-auto">
//                     <label
//                       htmlFor="product-search"
//                       className="shrink-0 text-sm font-medium text-gray-600"
//                     >
//                       Search:
//                     </label>

//                     <div className="relative w-full sm:w-[250px]">
//                       <Search
//                         size={16}
//                         className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                       />
//                       <input
//                         id="product-search"
//                         type="text"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         placeholder="Search products..."
//                         className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {loading ? (
//                   <div className="flex min-h-[180px] items-center justify-center">
//                     <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//                   </div>
//                 ) : (
//                   <div className="overflow-x-auto rounded-md border border-gray-200">
//                     <table className="min-w-full border-collapse text-sm">
//                       <thead className="bg-gray-100">
//                         <tr>
//                           {[
//                             "Select",
//                             "Product Name",
//                             "Total Qty",
//                             "Under Testing Qty",
//                             "Test Qty",
//                           ].map((heading) => (
//                             <th
//                               key={heading}
//                               className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700"
//                             >
//                               {heading}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {filteredProducts.length > 0 ? (
//                           filteredProducts.map((product) => {
//                             const isSelected = !!selectedRows[product._id];
//                             const productInfo = product.product;
//                             const underTestingQty =
//                               product.quantities.underTesting;
//                             const trackSerial =
//                               product.product?.trackSerialNumber === "Yes";

//                             return (
//                               <tr
//                                 key={product._id}
//                                 className={`border-b border-gray-100 transition ${
//                                   isSelected
//                                     ? "bg-blue-50"
//                                     : "bg-white hover:bg-gray-50"
//                                 }`}
//                               >
//                                 <td className="px-4 py-3">
//                                   <input
//                                     type="checkbox"
//                                     checked={isSelected}
//                                     onChange={() =>
//                                       handleRowSelect(
//                                         product._id,
//                                         underTestingQty,
//                                       )
//                                     }
//                                     className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                   />
//                                 </td>

//                                 <td className="px-4 py-3 font-medium text-gray-800">
//                                   {productInfo?.productTitle}
//                                 </td>

//                                 <td className="px-4 py-3 text-gray-700">
//                                   {product.quantities.total}
//                                 </td>

//                                 <td className="px-4 py-3 font-semibold text-gray-800">
//                                   {underTestingQty}
//                                 </td>

//                                 <td className="px-4 py-3">
//                                   {isSelected && (
//                                     <div className="flex items-center gap-2">
//                                       <input
//                                         type="number"
//                                         value={
//                                           selectedRows[product._id]?.quantity ||
//                                           ""
//                                         }
//                                         onChange={(e) =>
//                                           handleUsageQtyChange(
//                                             product._id,
//                                             e.target.value,
//                                           )
//                                         }
//                                         placeholder="Qty"
//                                         min="1"
//                                         max={underTestingQty}
//                                         className="w-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                       />

//                                       {trackSerial && (
//                                         <button
//                                           type="button"
//                                           onClick={() =>
//                                             handleOpenSerialModal(product)
//                                           }
//                                           title="Assign Serial Numbers"
//                                           className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
//                                         >
//                                           <span className="text-base font-bold">
//                                             ☰
//                                           </span>
//                                         </button>
//                                       )}
//                                     </div>
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
//                               {searchTerm
//                                 ? "No products match your search"
//                                 : "No products currently under testing"}
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>

//               {/* Actions */}
//               <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-4">
//                 <button
//                   type="button"
//                   onClick={handleTestingOk}
//                   className="inline-flex items-center gap-2 rounded-md bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
//                 >
//                   <Check size={17} />
//                   Testing Ok
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleTestingFailed}
//                   className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
//                 >
//                   <XCircle size={17} />
//                   Testing Failed
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         <UnderRepairedSerial
//           visible={serialModalVisible}
//           onClose={() => setSerialModalVisible(false)}
//           product={selectedProduct}
//           usageQty={
//             parseInt(
//               selectedRows[selectedProduct?.repairTransferId]?.quantity,
//             ) || 0
//           }
//           onSerialNumbersUpdate={handleSerialNumbersUpdate}
//         />
//       </div>
//     </div>
//   );
// };

// export default TestMaterial;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  RotateCcw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import axiosInstance from "../../axiosInstance";
import UnderRepairedSerial from "./UnderRepairedSerial";

const TestMaterial = () => {
  const navigate = useNavigate();

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    date: getTodayDate(),
    remark: "",
  });

  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState({});

  useEffect(() => {
    fetchUnderTestingProducts();
  }, []);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });

    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 5000);
  };

  const fetchUnderTestingProducts = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        "/testing-material/under-testing-product",
      );

      if (res.data.success) {
        setProducts(res.data.data.products || []);

        if (res.data.data.products.length === 0) {
          showAlert("No products currently under testing", "info");
        }
      } else {
        showAlert(
          res.data.message || "Failed to fetch products",
          "danger",
        );
      }
    } catch (error) {
      console.error("Error fetching under testing products:", error);

      showAlert(
        error.response?.data?.message ||
          "Failed to fetch under testing products",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSerialModal = (repairTransfer) => {
    const usageQuantity =
      parseInt(selectedRows[repairTransfer._id]?.quantity) || 0;

    if (usageQuantity > 0) {
      const productForSerial = {
        _id: repairTransfer.product._id,
        productTitle: repairTransfer.product.productTitle,
        trackSerialNumber: repairTransfer.product.trackSerialNumber,
        repairTransferId: repairTransfer._id,
      };

      setSelectedProduct(productForSerial);
      setSerialModalVisible(true);
    }
  };

  const handleSerialNumbersUpdate = (productId, serialsArray) => {
    setAssignedSerials((prev) => ({
      ...prev,
      [productId]: serialsArray,
    }));
  };

  const handleRowSelect = (productId, underTestingQty) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };

      if (updated[productId]) {
        delete updated[productId];
      } else {
        updated[productId] = {
          quantity: "",
          underTestingQty: underTestingQty || 0,
        };
      }

      return updated;
    });
  };

  const handleUsageQtyChange = (productId, value) => {
    const numValue = parseInt(value) || 0;

    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: numValue > 0 ? numValue : "",
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (Object.keys(selectedRows).length === 0) {
      newErrors.products = "Please select at least one product";
    }

    Object.keys(selectedRows).forEach((productId) => {
      const product = products.find((p) => p._id === productId);
      const selectedRow = selectedRows[productId];

      if (!selectedRow.quantity || parseInt(selectedRow.quantity) <= 0) {
        newErrors.products = `Please enter valid quantity for ${
          product?.product?.productTitle
        }`;
      }

      const usageQty = parseInt(selectedRow.quantity);
      const maxQty = selectedRow.underTestingQty;

      if (usageQty > maxQty) {
        newErrors.products = `Cannot test more than ${maxQty} items for ${
          product?.product?.productTitle
        }`;
      }
    });

    return newErrors;
  };

  const handleSubmit = async (testResult) => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const items = Object.keys(selectedRows).map((productId) => {
        const product = products.find((p) => p._id === productId);
        const selectedRow = selectedRows[productId];
        const usageQty = parseInt(selectedRow.quantity);

        // Preserve the original source logic for serialized products.
        let serialNumbers = [];

        if (
          product?.serialized &&
          product?.serialNumbers?.data?.length > 0
        ) {
          serialNumbers = product.serialNumbers.data
            .filter((serial) => serial.status === "under_testing")
            .slice(0, usageQty)
            .map((serial) => serial.serialNumber);
        }

        return {
          testingStockId: productId,
          product: product.product._id,
          quantity: usageQty,
          serialNumbers,
          testResult,
        };
      });

      const payload = {
        date: formData.date,
        remark: formData.remark || "",
        items,
      };

      console.log("Submitting test result payload:", payload);

      const response = await axiosInstance.post(
        "/testing-material/update-test-results",
        payload,
      );

      if (response.data.success) {
        const statusMessage =
          testResult === "passed"
            ? "marked as passed!"
            : "marked as failed!";

        showAlert(`Products ${statusMessage}`, "success");

        setTimeout(() => {
          fetchUnderTestingProducts();
          setSelectedRows({});
          setFormData({
            date: getTodayDate(),
            remark: "",
          });
        }, 1500);
      } else {
        showAlert(
          response.data.message || "Failed to update test results",
          "danger",
        );
      }
    } catch (error) {
      console.error("Error updating test results:", error);

      let errorMessage = "Failed to update test results";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      showAlert(errorMessage, "danger");
    }
  };

  const handleTestingOk = () => {
    handleSubmit("passed");
  };

  const handleTestingFailed = () => {
    handleSubmit("failed");
  };

  const handleReset = () => {
    setFormData({
      date: getTodayDate(),
      remark: "",
    });
    setSelectedRows({});
    setErrors({});
    showAlert("Form has been reset", "info");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.product?.productTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      p.product?.productCode
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const alertClasses = {
    success: "border-green-200 bg-green-50 text-green-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
  };

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      <div className="mx-auto max-w-[1600px]">
        {/* Page Header */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-md bg-[#2759a2] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="mb-2 text-[24px] font-[450] leading-tight text-[#212529]">
            Test Under Testing Products
          </h1>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-sm border border-gray-200 border-t-4 border-t-[#2759a2] bg-white shadow-sm">
          <div className="flex justify-end border-b border-gray-200 bg-white px-4 py-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-md bg-[#2759a2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b]"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </div>

          <div className="p-4 md:p-5">
            {alert.show && (
              <div
                className={`mb-4 flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm ${
                  alertClasses[alert.type] ||
                  "border-gray-200 bg-gray-50 text-gray-700"
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
                  className="shrink-0 opacity-70 transition hover:opacity-100"
                  aria-label="Close alert"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label
                    htmlFor="test-date"
                    className={`mb-1.5 block text-sm font-medium ${
                      errors.date ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    Date <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="test-date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    disabled
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none ${
                      errors.date
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300 bg-gray-100"
                    }`}
                  />

                  {errors.date && (
                    <p className="mt-1 text-xs text-red-600">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="test-remark"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Remark
                  </label>

                  <textarea
                    id="test-remark"
                    name="remark"
                    value={formData.remark}
                    onChange={handleChange}
                    placeholder="Remark"
                    rows={3}
                    className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Products */}
              <div className="mt-6">
                <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-medium text-gray-800">
                      Select Products
                    </h2>

                    {errors.products && (
                      <span className="text-sm font-medium text-red-600">
                        {errors.products}
                      </span>
                    )}
                  </div>

                  <div className="flex w-full items-center gap-2 sm:w-auto">
                    <label
                      htmlFor="product-search"
                      className="shrink-0 text-sm font-medium text-gray-600"
                    >
                      Search:
                    </label>

                    <div className="relative w-full sm:w-[250px]">
                      <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="product-search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="flex min-h-[180px] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                  </div>
                ) : (
                  <div className="max-h-[440px] overflow-y-auto overflow-x-hidden rounded-sm border border-gray-200">
                    <table className="w-full border-collapse text-sm">
                      <thead className="sticky top-0 z-10 bg-white">
                        <tr>
                          {[
                            "Select",
                            "Product Name",
                            "Total Qty",
                            "Under Testing Qty",
                            "Test Qty",
                          ].map((heading) => (
                            <th
                              key={heading}
                              className="border border-gray-100 px-3 py-3 text-left font-bold text-gray-800"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => {
                            const isSelected = !!selectedRows[product._id];
                            const productInfo = product.product;
                            const underTestingQty =
                              product.quantities.underTesting;
                            const trackSerial =
                              product.product?.trackSerialNumber === "Yes";

                            return (
                              <tr
                                key={product._id}
                                className={`border-b border-gray-100 transition-colors ${
                                  isSelected
                                    ? "bg-[#dff0d8]"
                                    : filteredProducts.indexOf(product) % 2 === 0
                                      ? "bg-[#f1f1f1] hover:bg-gray-200"
                                      : "bg-white hover:bg-gray-100"
                                }`}
                              >
                                <td className="border-r border-gray-100 px-3 py-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      handleRowSelect(
                                        product._id,
                                        underTestingQty,
                                      )
                                    }
                                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                </td>

                                <td className="border-r border-gray-100 px-3 py-3 font-medium text-gray-800">
                                  {productInfo?.productTitle}
                                </td>

                                <td className="border-r border-gray-100 px-3 py-3 text-gray-700">
                                  {product.quantities.total}
                                </td>

                                <td className="border-r border-gray-100 px-3 py-3 font-semibold text-gray-800">
                                  {underTestingQty}
                                </td>

                                <td className="border-r border-gray-100 px-3 py-3">
                                  {isSelected && (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        value={
                                          selectedRows[product._id]?.quantity ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          handleUsageQtyChange(
                                            product._id,
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Qty"
                                        min="1"
                                        max={underTestingQty}
                                        className="w-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
                                      />

                                      {trackSerial && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleOpenSerialModal(product)
                                          }
                                          title="Assign Serial Numbers"
                                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                                        >
                                          <span className="text-base font-bold">
                                            ☰
                                          </span>
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
                              colSpan={5}
                              className="px-4 py-10 text-center text-sm text-gray-500"
                            >
                              {searchTerm
                                ? "No products match your search"
                                : "No products currently under testing"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={handleTestingOk}
                  className="inline-flex items-center gap-2 rounded-md bg-[#2759a2] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b]"
                >
                  <Check size={17} />
                  Testing Ok
                </button>

                <button
                  type="button"
                  onClick={handleTestingFailed}
                  className="inline-flex items-center gap-2 rounded-md bg-[#b42318] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#912018]"
                >
                  <XCircle size={17} />
                  Testing Failed
                </button>
              </div>
            </form>
          </div>
        </div>

        <UnderRepairedSerial
          visible={serialModalVisible}
          onClose={() => setSerialModalVisible(false)}
          product={selectedProduct}
          usageQty={
            parseInt(
              selectedRows[selectedProduct?.repairTransferId]?.quantity,
            ) || 0
          }
          onSerialNumbersUpdate={handleSerialNumbersUpdate}
        />
      </div>
    </div>
  );
};

export default TestMaterial;
