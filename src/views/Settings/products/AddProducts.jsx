// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Select from "react-select";

// import axiosInstance from "../../../axiosInstance";
// const initialFormData = {
//   productCategory: "",
//   productTitle: "",
//   productCode: "",
//   productPrice: "",
//   salePrice: "",
//   hsnCode: "",
//   productImage: "",
//   productWeight: "",
//   productBarcode: "",
//   status: "",
//   description: "",
//   trackSerialNumber: "",
//   repairable: "",
//   replaceable: "",
// };

// const AddProducts = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState(initialFormData);
//   const [errors, setErrors] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [alert, setAlert] = useState({
//     type: "",
//     message: "",
//   });

//   // --------------------------------------------------
//   // Fetch Categories
//   // --------------------------------------------------
//   const fetchCategories = async () => {
//     try {
//       const res = await axiosInstance.get(
//         "/product-category",
//       );

//       setCategories(res.data.data || []);
//     } catch (error) {
//       console.error(
//         "Error fetching categories:",
//         error,
//       );
//     }
//   };

//   // --------------------------------------------------
//   // Fetch Product For Edit
//   // --------------------------------------------------
//   const fetchProducts = async (productId) => {
//     try {
//       const res = await axiosInstance.get(
//         `/products/${productId}`,
//       );

//       const product = res.data.data;

//       setFormData({
//         ...initialFormData,
//         ...product,
//         productCategory:
//           product.productCategory?._id || "",
//       });
//     } catch (error) {
//       console.error(
//         "Error fetching products:",
//         error,
//       );
//     }
//   };

//   // --------------------------------------------------
//   // Initial Load
//   // --------------------------------------------------
//   useEffect(() => {
//     fetchCategories();

//     if (id) {
//       fetchProducts(id);
//     }
//   }, [id]);

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
//   // Product Category Change
//   // --------------------------------------------------
//   const handleCategoryChange = (selected) => {
//     const value = selected
//       ? selected.value
//       : "";

//     setFormData((prev) => ({
//       ...prev,
//       productCategory: value,
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       productCategory: "",
//     }));

//     setAlert({
//       type: "",
//       message: "",
//     });
//   };

//   // --------------------------------------------------
//   // Submit
//   // --------------------------------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let newErrors = {};

//     [
//       "productCategory",
//       "productTitle",
//       "status",
//       "trackSerialNumber",
//       "repairable",
//       "replaceable",
//       "productPrice",
//       "salePrice",
//       "hsnCode",
//     ].forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] =
//           "This is a required field";
//       }
//     });

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       if (id) {
//         await axiosInstance.put(
//           `/products/${id}`,
//           formData,
//         );

//         setAlert({
//           type: "success",
//           message: "Data updated successfully!",
//         });
//       } else {
//         await axiosInstance.post(
//           "/products",
//           formData,
//         );

//         setAlert({
//           type: "success",
//           message: "Data added successfully!",
//         });
//       }

//       setTimeout(() => {
//         navigate("/product-list");
//       }, 1500);
//     } catch (error) {
//       console.error(
//         "Error saving data:",
//         error,
//       );

//       // ----------------------------------------------
//       // Backend validation errors
//       // ----------------------------------------------
//       if (
//         error.response &&
//         error.response.data?.errors
//       ) {
//         const backendErrors =
//           error.response.data.errors;

//         const fieldErrors = {};
//         const errorMessages = [];

//         backendErrors.forEach((err) => {
//           if (err.path) {
//             fieldErrors[err.path] = err.msg;
//           }

//           if (err.msg) {
//             errorMessages.push(err.msg);
//           }
//         });

//         setErrors(fieldErrors);

//         if (errorMessages.length > 0) {
//           setAlert({
//             type: "danger",
//             message: errorMessages[0],
//           });
//         } else if (
//           error.response.data.message
//         ) {
//           setAlert({
//             type: "danger",
//             message:
//               error.response.data.message,
//           });
//         }

//         return;
//       }

//       // ----------------------------------------------
//       // MongoDB duplicate error
//       // ----------------------------------------------
//       if (
//         error.response &&
//         error.response.data?.debug &&
//         error.response.data.debug.includes(
//           "E11000",
//         )
//       ) {
//         setAlert({
//           type: "danger",
//           message:
//             "Product with this title or code already exists",
//         });

//         return;
//       }

//       // ----------------------------------------------
//       // Other errors
//       // ----------------------------------------------
//       let message =
//         "Failed to save data. Please try again!";

//       if (error.response) {
//         message =
//           error.response.data?.message ||
//           error.response.data?.error ||
//           `Server error: ${error.response.status}`;
//       } else if (error.request) {
//         message =
//           "No response from server. Please check your connection.";
//       } else {
//         message = error.message;
//       }

//       setAlert({
//         type: "danger",
//         message,
//       });
//     }
//   };

//   // --------------------------------------------------
//   // Reset
//   // --------------------------------------------------
//   const handleReset = () => {
//     setFormData(initialFormData);
//     setErrors({});
//     setAlert({
//       type: "",
//       message: "",
//     });
//   };

//   // --------------------------------------------------
//   // React Select Options
//   // --------------------------------------------------
//   const categoryOptions = categories.map(
//     (category) => ({
//       value: category._id,
//       label: category.productCategory,
//     }),
//   );

//   const selectedCategory =
//     categoryOptions.find(
//       (option) =>
//         option.value ===
//         formData.productCategory,
//     ) || null;

//   // --------------------------------------------------
//   // Common Classes
//   // --------------------------------------------------
//   const getInputClass = (field) => {
//     const base =
//       "w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-700 outline-none transition";

//     if (errors[field]) {
//       return `${base} border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100`;
//     }

//     if (formData[field]) {
//       return `${base} border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-100`;
//     }

//     return `${base} border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100`;
//   };

//   const getLabelClass = (field) => {
//     if (errors[field]) {
//       return "text-red-600";
//     }

//     if (formData[field]) {
//       return "text-green-600";
//     }

//     return "text-gray-700";
//   };

//   const renderError = (field) => {
//     if (!errors[field]) {
//       return null;
//     }

//     return (
//       <span className="mt-1 block text-xs text-red-600">
//         {errors[field]}
//       </span>
//     );
//   };

//   return (
//     <div className="w-full">
//       {/* Page Title */}
//       <div className="mb-5 text-xl font-semibold text-gray-800">
//         {id ? "Edit" : "Add"} Product
//       </div>

//       {/* Main Card */}
//       <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
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
//               <span>{alert.message}</span>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setAlert({
//                     type: "",
//                     message: "",
//                   })
//                 }
//                 className="ml-4 font-semibold opacity-70 hover:opacity-100"
//               >
//                 ×
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* -------------------------------------- */}
//             {/* Row 1 */}
//             {/* -------------------------------------- */}
//             <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
//               {/* Product Category */}
//               <div>
//                 <label
//                   htmlFor="productCategory"
//                   className={`mb-1.5 block text-sm font-medium ${getLabelClass(
//                     "productCategory",
//                   )}`}
//                 >
//                   Product Category{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <Select
//                   inputId="productCategory"
//                   name="productCategory"
//                   placeholder="Search Product Category..."
//                   value={selectedCategory}
//                   onChange={handleCategoryChange}
//                   options={categoryOptions}
//                   isClearable
//                   className="text-sm"
//                   styles={{
//                     control: (
//                       base,
//                       state,
//                     ) => ({
//                       ...base,
//                       minHeight: "40px",
//                       borderRadius: "6px",
//                       borderColor:
//                         errors.productCategory
//                           ? "#ef4444"
//                           : formData.productCategory
//                             ? "#22c55e"
//                             : state.isFocused
//                               ? "#3b82f6"
//                               : "#d1d5db",
//                       boxShadow:
//                         state.isFocused
//                           ? "0 0 0 1px #3b82f6"
//                           : "none",
//                     }),
//                   }}
//                 />

//                 {renderError(
//                   "productCategory",
//                 )}
//               </div>

//               {/* Product Title */}
//               <div>
//                 <label
//                   htmlFor="productTitle"
//                   className={`mb-1.5 block text-sm font-medium ${getLabelClass(
//                     "productTitle",
//                   )}`}
//                 >
//                   Product Title{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   type="text"
//                   id="productTitle"
//                   name="productTitle"
//                   value={formData.productTitle}
//                   onChange={handleChange}
//                   className={getInputClass(
//                     "productTitle",
//                   )}
//                 />

//                 {renderError(
//                   "productTitle",
//                 )}
//               </div>

//               {/* Product Code */}
//               <div>
//                 <label
//                   htmlFor="productCode"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Product Code
//                 </label>

//                 <input
//                   type="text"
//                   id="productCode"
//                   name="productCode"
//                   value={formData.productCode}
//                   onChange={handleChange}
//                   className={getInputClass(
//                     "productCode",
//                   )}
//                 />
//               </div>
//             </div>

//             {/* -------------------------------------- */}
//             {/* Row 2 */}
//             {/* -------------------------------------- */}
//             <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
//               {/* Product Price */}
//               <div>
//                 <label
//                   htmlFor="productPrice"
//                   className={`mb-1.5 block text-sm font-medium ${getLabelClass(
//                     "productPrice",
//                   )}`}
//                 >
//                   Product Price{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   type="text"
//                   id="productPrice"
//                   name="productPrice"
//                   value={formData.productPrice}
//                   onChange={handleChange}
//                   className={getInputClass(
//                     "productPrice",
//                   )}
//                 />

//                 {renderError(
//                   "productPrice",
//                 )}
//               </div>

//               {/* Sale Price */}
//               <div>
//                 <label
//                   htmlFor="salePrice"
//                   className={`mb-1.5 block text-sm font-medium ${getLabelClass(
//                     "salePrice",
//                   )}`}
//                 >
//                   Sale Price{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   type="text"
//                   id="salePrice"
//                   name="salePrice"
//                   value={formData.salePrice}
//                   onChange={handleChange}
//                   className={getInputClass(
//                     "salePrice",
//                   )}
//                 />

//                 {renderError("salePrice")}
//               </div>

//               {/* HSN Code */}
//               <div>
//                 <label
//                   htmlFor="hsnCode"
//                   className={`mb-1.5 block text-sm font-medium ${getLabelClass(
//                     "hsnCode",
//                   )}`}
//                 >
//                   HSN Code{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   type="text"
//                   id="hsnCode"
//                   name="hsnCode"
//                   value={formData.hsnCode}
//                   onChange={handleChange}
//                   className={getInputClass(
//                     "hsnCode",
//                   )}
//                 />

//                 {renderError("hsnCode")}
//               </div>
//             </div>

//             {/* -------------------------------------- */}
//             {/* Row 3 */}
//             {/* -------------------------------------- */}
//             <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
//               {/* Product Image */}
//               <div>
//                 <label
//                   htmlFor="productImage"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Product Image
//                 </label>

//                 <input
//                   type="file"
//                   id="productImage"
//                   name="productImage"
//                   onChange={handleChange}
//                   className="block w-full rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-3 file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
//                 />
//               </div>

//               {/* Product Weight */}
//               <div>
//                 <label
//                   htmlFor="productWeight"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Product Weight
//                 </label>

//                 <input
//                   type="tel"
//                   id="productWeight"
//                   name="productWeight"
//                   value={formData.productWeight}
//                   onChange={handleChange}
//                   className={getInputClass(
//                     "productWeight",
//                   )}
//                 />
//               </div>

//               {/* Product Barcode */}
//               <div>
//                 <label
//                   htmlFor="productBarcode"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Product Barcode
//                 </label>

//                 <input
//                   type="text"
//                   id="productBarcode"
//                   name="productBarcode"
//                   value={formData.productBarcode}
//                   onChange={handleChange}
//                   className={getInputClass(
//                     "productBarcode",
//                   )}
//                 />
//               </div>
//             </div>

//             {/* -------------------------------------- */}
//             {/* Row 4 */}
//             {/* -------------------------------------- */}
//             <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
//               {/* Status */}
//               <div>
//                 <label
//                   htmlFor="status"
//                   className={`mb-1.5 block text-sm font-medium ${getLabelClass(
//                     "status",
//                   )}`}
//                 >
//                   Status{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <select
//                   id="status"
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className={getInputClass(
//                     "status",
//                   )}
//                 >
//                   <option value="">
//                     SELECT
//                   </option>
//                   <option value="Enable">
//                     Enable
//                   </option>
//                   <option value="Disable">
//                     Disable
//                   </option>
//                 </select>

//                 {renderError("status")}
//               </div>

//               {/* Description */}
//               <div>
//                 <label
//                   htmlFor="description"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Product Description
//                 </label>

//                 <textarea
//                   id="description"
//                   name="description"
//                   rows={3}
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />
//               </div>

//               <div />
//             </div>

//             {/* -------------------------------------- */}
//             {/* Row 5 */}
//             {/* -------------------------------------- */}
//             <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
//               {/* Track Serial Number */}
//               <div>
//                 <label
//                   htmlFor="trackSerialNumber"
//                   className={`mb-1.5 block text-sm font-medium ${getLabelClass(
//                     "trackSerialNumber",
//                   )}`}
//                 >
//                   Track Serial Number{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <select
//                   id="trackSerialNumber"
//                   name="trackSerialNumber"
//                   value={
//                     formData.trackSerialNumber
//                   }
//                   onChange={handleChange}
//                   className={getInputClass(
//                     "trackSerialNumber",
//                   )}
//                 >
//                   <option value="">
//                     SELECT
//                   </option>
//                   <option value="Yes">Yes</option>
//                   <option value="No">No</option>
//                 </select>

//                 {renderError(
//                   "trackSerialNumber",
//                 )}
//               </div>

//               {/* Repairable */}
//               <div>
//                 <label
//                   htmlFor="repairable"
//                   className={`mb-1.5 block text-sm font-medium ${getLabelClass(
//                     "repairable",
//                   )}`}
//                 >
//                   Repairable{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <select
//                   id="repairable"
//                   name="repairable"
//                   value={formData.repairable}
//                   onChange={handleChange}
//                   className={getInputClass(
//                     "repairable",
//                   )}
//                 >
//                   <option value="">
//                     SELECT
//                   </option>
//                   <option value="Yes">Yes</option>
//                   <option value="No">No</option>
//                 </select>

//                 {renderError("repairable")}
//               </div>

//               {/* Replaceable */}
//               <div>
//                 <label
//                   htmlFor="replaceable"
//                   className={`mb-1.5 block text-sm font-medium ${getLabelClass(
//                     "replaceable",
//                   )}`}
//                 >
//                   Replaceable{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <select
//                   id="replaceable"
//                   name="replaceable"
//                   value={formData.replaceable}
//                   onChange={handleChange}
//                   className={getInputClass(
//                     "replaceable",
//                   )}
//                 >
//                   <option value="">
//                     SELECT
//                   </option>
//                   <option value="Yes">Yes</option>
//                   <option value="No">No</option>
//                 </select>

//                 {renderError("replaceable")}
//               </div>
//             </div>

//             {/* -------------------------------------- */}
//             {/* Footer */}
//             {/* -------------------------------------- */}
//             <div className="mt-7 flex flex-col justify-end gap-3 border-t border-gray-200 pt-5 sm:flex-row">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
//               >
//                 Reset
//               </button>

//               <button
//                 type="submit"
//                 className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProducts;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

import axiosInstance from "../../../axiosInstance";

const initialFormData = {
  productCategory: "",
  productTitle: "",
  productCode: "",
  productPrice: "",
  salePrice: "",
  hsnCode: "",
  productImage: "",
  productWeight: "",
  productBarcode: "",
  status: "",
  description: "",
  trackSerialNumber: "",
  repairable: "",
  replaceable: "",
};

const AddProducts = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  // --------------------------------------------------
  // Fetch Categories
  // --------------------------------------------------
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(
        "/product-category",
      );

      setCategories(res.data.data || []);
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error,
      );
    }
  };

  // --------------------------------------------------
  // Fetch Product For Edit
  // --------------------------------------------------
  const fetchProducts = async (productId) => {
    try {
      const res = await axiosInstance.get(
        `/products/${productId}`,
      );

      const product = res.data.data;

      setFormData({
        ...initialFormData,
        ...product,
        productCategory:
          product.productCategory?._id || "",
      });
    } catch (error) {
      console.error(
        "Error fetching products:",
        error,
      );
    }
  };

  // --------------------------------------------------
  // Initial Load
  // --------------------------------------------------
  useEffect(() => {
    fetchCategories();

    if (id) {
      fetchProducts(id);
    }
  }, [id]);

  // --------------------------------------------------
  // Input Change
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

    setAlert({
      type: "",
      message: "",
    });
  };

  // --------------------------------------------------
  // Product Category Change
  // --------------------------------------------------
  const handleCategoryChange = (selected) => {
    const value = selected
      ? selected.value
      : "";

    setFormData((prev) => ({
      ...prev,
      productCategory: value,
    }));

    setErrors((prev) => ({
      ...prev,
      productCategory: "",
    }));

    setAlert({
      type: "",
      message: "",
    });
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    [
      "productCategory",
      "productTitle",
      "status",
      "trackSerialNumber",
      "repairable",
      "replaceable",
      "productPrice",
      "salePrice",
      "hsnCode",
    ].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] =
          "This is a required field";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(
          `/products/${id}`,
          formData,
        );

        setAlert({
          type: "success",
          message: "Data updated successfully!",
        });
      } else {
        await axiosInstance.post(
          "/products",
          formData,
        );

        setAlert({
          type: "success",
          message: "Data added successfully!",
        });
      }

      setTimeout(() => {
        navigate("/product-list");
      }, 1500);
    } catch (error) {
      console.error(
        "Error saving data:",
        error,
      );

      // ----------------------------------------------
      // Backend validation errors
      // ----------------------------------------------
      if (
        error.response &&
        error.response.data?.errors
      ) {
        const backendErrors =
          error.response.data.errors;

        const fieldErrors = {};
        const errorMessages = [];

        backendErrors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path] = err.msg;
          }

          if (err.msg) {
            errorMessages.push(err.msg);
          }
        });

        setErrors(fieldErrors);

        if (errorMessages.length > 0) {
          setAlert({
            type: "danger",
            message: errorMessages[0],
          });
        } else if (
          error.response.data.message
        ) {
          setAlert({
            type: "danger",
            message:
              error.response.data.message,
          });
        }

        return;
      }

      // ----------------------------------------------
      // MongoDB duplicate error
      // ----------------------------------------------
      if (
        error.response &&
        error.response.data?.debug &&
        error.response.data.debug.includes(
          "E11000",
        )
      ) {
        setAlert({
          type: "danger",
          message:
            "Product with this title or code already exists",
        });

        return;
      }

      // ----------------------------------------------
      // Other errors
      // ----------------------------------------------
      let message =
        "Failed to save data. Please try again!";

      if (error.response) {
        message =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        message =
          "No response from server. Please check your connection.";
      } else {
        message = error.message;
      }

      setAlert({
        type: "danger",
        message,
      });
    }
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setAlert({
      type: "",
      message: "",
    });
  };

  // --------------------------------------------------
  // React Select Options
  // --------------------------------------------------
  const categoryOptions = categories.map(
    (category) => ({
      value: category._id,
      label: category.productCategory,
    }),
  );

  const selectedCategory =
    categoryOptions.find(
      (option) =>
        option.value ===
        formData.productCategory,
    ) || null;

  // --------------------------------------------------
  // Common Classes
  // --------------------------------------------------
  const getInputClass = (field) => {
    const base =
      "h-[40px] w-full rounded-[2px] border bg-white px-3 text-[15px] text-[#212529] outline-none transition";

    if (errors[field]) {
      return `${base} border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100`;
    }

    if (formData[field]) {
      return `${base} border-[#28a745] focus:border-[#28a745] focus:ring-1 focus:ring-green-100`;
    }

    return `${base} border-[#d9d9d9] focus:border-[#2f5fa7] focus:ring-1 focus:ring-[#2f5fa7]`;
  };

  const getLabelClass = (field) => {
    if (errors[field]) {
      return "text-red-600";
    }

    if (formData[field]) {
      return "text-[#28a745]";
    }

    return "text-[#212529]";
  };

  const renderError = (field) => {
    if (!errors[field]) {
      return null;
    }

    return (
      <span className="mt-1 block text-[12px] text-red-600">
        {errors[field]}
      </span>
    );
  };

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-4 md:px-2">

      {/* Page Title */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        {id ? "Edit" : "Add"} Product
      </div>

      {/* Main Card */}
      <div className="overflow-hidden border-0 bg-white shadow-[0_1px_5px_rgba(0,0,0,0.12)]">

        {/* Blue Top Border */}
        <div className="border-t-[4px] border-t-[#2f5fa7]">

          {/* Form Body */}
          <div className="px-[22px] py-[22px]">

            {/* Alert */}
            {alert.message && (
              <div
                className={`mb-5 flex items-start justify-between border px-4 py-3 text-[14px] ${
                  alert.type === "success"
                    ? "border-[#c3e6cb] bg-[#d4edda] text-[#155724]"
                    : "border-[#f5c6cb] bg-[#f8d7da] text-[#721c24]"
                }`}
              >
                <span>{alert.message}</span>

                <button
                  type="button"
                  onClick={() =>
                    setAlert({
                      type: "",
                      message: "",
                    })
                  }
                  className="ml-4 text-[18px] font-semibold leading-none opacity-70 hover:opacity-100"
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* ================================================= */}
              {/* ROW 1 */}
              {/* ================================================= */}
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">

                {/* Product Category */}
                <div>
                  <label
                    htmlFor="productCategory"
                    className={`mb-2 block text-[16px] font-semibold ${getLabelClass(
                      "productCategory",
                    )}`}
                  >
                    Product Category{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <Select
                    inputId="productCategory"
                    name="productCategory"
                    placeholder="Search Product Category..."
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    options={categoryOptions}
                    isClearable
                    className="text-[15px]"
                    styles={{
                      control: (
                        base,
                        state,
                      ) => ({
                        ...base,
                        minHeight: "40px",
                        height: "40px",
                        borderRadius: "2px",
                        borderColor:
                          errors.productCategory
                            ? "#ef4444"
                            : formData.productCategory
                              ? "#28a745"
                              : state.isFocused
                                ? "#2f5fa7"
                                : "#d9d9d9",
                        boxShadow:
                          state.isFocused
                            ? "0 0 0 1px #2f5fa7"
                            : "none",
                        "&:hover": {
                          borderColor:
                            errors.productCategory
                              ? "#ef4444"
                              : formData.productCategory
                                ? "#28a745"
                                : "#2f5fa7",
                        },
                      }),
                      valueContainer: (
                        base,
                      ) => ({
                        ...base,
                        height: "38px",
                        padding:
                          "0 10px",
                      }),
                      indicatorsContainer: (
                        base,
                      ) => ({
                        ...base,
                        height: "38px",
                      }),
                      placeholder: (
                        base,
                      ) => ({
                        ...base,
                        color: "#777",
                        fontSize: "15px",
                      }),
                    }}
                  />

                  {renderError(
                    "productCategory",
                  )}
                </div>

                {/* Product Title */}
                <div>
                  <label
                    htmlFor="productTitle"
                    className={`mb-2 block text-[16px] font-semibold ${getLabelClass(
                      "productTitle",
                    )}`}
                  >
                    Product Title{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    id="productTitle"
                    name="productTitle"
                    value={formData.productTitle}
                    onChange={handleChange}
                    className={getInputClass(
                      "productTitle",
                    )}
                  />

                  {renderError(
                    "productTitle",
                  )}
                </div>

                {/* Product Code */}
                <div>
                  <label
                    htmlFor="productCode"
                    className="mb-2 block text-[16px] font-semibold text-[#212529]"
                  >
                    Product Code
                  </label>

                  <input
                    type="text"
                    id="productCode"
                    name="productCode"
                    value={formData.productCode}
                    onChange={handleChange}
                    className={getInputClass(
                      "productCode",
                    )}
                  />
                </div>

              </div>

              {/* ================================================= */}
              {/* ROW 2 */}
              {/* ================================================= */}
              <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">

                {/* Product Price */}
                <div>
                  <label
                    htmlFor="productPrice"
                    className={`mb-2 block text-[16px] font-semibold ${getLabelClass(
                      "productPrice",
                    )}`}
                  >
                    Product Price{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    id="productPrice"
                    name="productPrice"
                    value={formData.productPrice}
                    onChange={handleChange}
                    className={getInputClass(
                      "productPrice",
                    )}
                  />

                  {renderError(
                    "productPrice",
                  )}
                </div>

                {/* Sale Price */}
                <div>
                  <label
                    htmlFor="salePrice"
                    className={`mb-2 block text-[16px] font-semibold ${getLabelClass(
                      "salePrice",
                    )}`}
                  >
                    Sale Price{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    id="salePrice"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    className={getInputClass(
                      "salePrice",
                    )}
                  />

                  {renderError("salePrice")}
                </div>

                {/* HSN Code */}
                <div>
                  <label
                    htmlFor="hsnCode"
                    className={`mb-2 block text-[16px] font-semibold ${getLabelClass(
                      "hsnCode",
                    )}`}
                  >
                    HSN Code{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    id="hsnCode"
                    name="hsnCode"
                    value={formData.hsnCode}
                    onChange={handleChange}
                    className={getInputClass(
                      "hsnCode",
                    )}
                  />

                  {renderError("hsnCode")}
                </div>

              </div>

              {/* ================================================= */}
              {/* ROW 3 */}
              {/* ================================================= */}
              <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">

                {/* Product Image */}
                <div>
                  <label
                    htmlFor="productImage"
                    className="mb-2 block text-[16px] font-semibold text-[#212529]"
                  >
                    Product Image
                  </label>

                  <input
                    type="file"
                    id="productImage"
                    name="productImage"
                    onChange={handleChange}
                    className="block h-[40px] w-full rounded-[2px] border border-[#d9d9d9] bg-white text-[14px] text-[#212529] file:mr-3 file:h-[38px] file:border-0 file:bg-[#f5f5f5] file:px-3 file:text-[14px] file:font-medium file:text-[#212529] hover:file:bg-[#eeeeee]"
                  />
                </div>

                {/* Product Weight */}
                <div>
                  <label
                    htmlFor="productWeight"
                    className="mb-2 block text-[16px] font-semibold text-[#212529]"
                  >
                    Product Weight
                  </label>

                  <input
                    type="tel"
                    id="productWeight"
                    name="productWeight"
                    value={formData.productWeight}
                    onChange={handleChange}
                    className={getInputClass(
                      "productWeight",
                    )}
                  />
                </div>

                {/* Product Barcode */}
                <div>
                  <label
                    htmlFor="productBarcode"
                    className="mb-2 block text-[16px] font-semibold text-[#212529]"
                  >
                    Product Barcode
                  </label>

                  <input
                    type="text"
                    id="productBarcode"
                    name="productBarcode"
                    value={formData.productBarcode}
                    onChange={handleChange}
                    className={getInputClass(
                      "productBarcode",
                    )}
                  />
                </div>

              </div>

              {/* ================================================= */}
              {/* ROW 4 */}
              {/* ================================================= */}
              <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className={`mb-2 block text-[16px] font-semibold ${getLabelClass(
                      "status",
                    )}`}
                  >
                    Status{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={getInputClass(
                      "status",
                    )}
                  >
                    <option value="">
                      SELECT
                    </option>

                    <option value="Enable">
                      Enable
                    </option>

                    <option value="Disable">
                      Disable
                    </option>
                  </select>

                  {renderError("status")}
                </div>

                {/* Product Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-[16px] font-semibold text-[#212529]"
                  >
                    Product Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="min-h-[65px] w-full resize-y rounded-[2px] border border-[#d9d9d9] bg-white px-3 py-2 text-[15px] text-[#212529] outline-none transition focus:border-[#2f5fa7] focus:ring-1 focus:ring-[#2f5fa7]"
                  />
                </div>

                {/* Empty column */}
                <div />

              </div>

              {/* ================================================= */}
              {/* ROW 5 */}
              {/* ================================================= */}
              <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">

                {/* Track Serial Number */}
                <div>
                  <label
                    htmlFor="trackSerialNumber"
                    className={`mb-2 block text-[16px] font-semibold ${getLabelClass(
                      "trackSerialNumber",
                    )}`}
                  >
                    Track Serial Number{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="trackSerialNumber"
                    name="trackSerialNumber"
                    value={
                      formData.trackSerialNumber
                    }
                    onChange={handleChange}
                    className={getInputClass(
                      "trackSerialNumber",
                    )}
                  >
                    <option value="">
                      SELECT
                    </option>

                    <option value="Yes">
                      Yes
                    </option>

                    <option value="No">
                      No
                    </option>
                  </select>

                  {renderError(
                    "trackSerialNumber",
                  )}
                </div>

                {/* Repairable */}
                <div>
                  <label
                    htmlFor="repairable"
                    className={`mb-2 block text-[16px] font-semibold ${getLabelClass(
                      "repairable",
                    )}`}
                  >
                    Repairable{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="repairable"
                    name="repairable"
                    value={formData.repairable}
                    onChange={handleChange}
                    className={getInputClass(
                      "repairable",
                    )}
                  >
                    <option value="">
                      SELECT
                    </option>

                    <option value="Yes">
                      Yes
                    </option>

                    <option value="No">
                      No
                    </option>
                  </select>

                  {renderError("repairable")}
                </div>

                {/* Replaceable */}
                <div>
                  <label
                    htmlFor="replaceable"
                    className={`mb-2 block text-[16px] font-semibold ${getLabelClass(
                      "replaceable",
                    )}`}
                  >
                    Replaceable{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="replaceable"
                    name="replaceable"
                    value={formData.replaceable}
                    onChange={handleChange}
                    className={getInputClass(
                      "replaceable",
                    )}
                  >
                    <option value="">
                      SELECT
                    </option>

                    <option value="Yes">
                      Yes
                    </option>

                    <option value="No">
                      No
                    </option>
                  </select>

                  {renderError("replaceable")}
                </div>

              </div>

              {/* ================================================= */}
              {/* FOOTER BUTTONS */}
              {/* ================================================= */}
              <div className="mt-8 flex justify-end gap-3 border-t border-[#dedede] pt-5">

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-[40px] items-center justify-center rounded-[4px] bg-[#2f5fa7] px-5 text-[15px] font-medium text-white transition hover:bg-[#244c88] focus:outline-none focus:ring-2 focus:ring-[#2f5fa7]/30"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className="inline-flex h-[40px] items-center justify-center rounded-[4px] bg-[#c62828] px-5 text-[15px] font-medium text-white transition hover:bg-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-[#c62828]/30"
                >
                  Submit
                </button>

              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;