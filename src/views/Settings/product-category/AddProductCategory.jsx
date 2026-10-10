// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";

// import axiosInstance from "../../../axiosInstance";
// const AddProductCategory = ({
//   visible,
//   onClose,
//   onCategoryAdded,
//   category,
// }) => {
//   const [productCategory, setProductCategory] =
//     useState("");

//   const [remark, setRemark] = useState("");

//   const [errors, setErrors] = useState({});

//   const [alert, setAlert] = useState({
//     type: "",
//     message: "",
//   });

//   // --------------------------------------------------
//   // Initialize form for Add / Edit
//   // --------------------------------------------------
//   useEffect(() => {
//     if (category) {
//       setProductCategory(
//         category.productCategory || "",
//       );

//       setRemark(category.remark || "");
//     } else {
//       setProductCategory("");
//       setRemark("");
//     }

//     setErrors({});

//     setAlert({
//       type: "",
//       message: "",
//     });
//   }, [category, visible]);

//   // --------------------------------------------------
//   // Validation
//   // --------------------------------------------------
//   const validateForm = () => {
//     const newErrors = {};

//     if (!productCategory.trim()) {
//       newErrors.productCategory =
//         "This is a required field";
//     }

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;
//   };

//   // --------------------------------------------------
//   // Submit
//   // --------------------------------------------------
//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       let response;

//       // Edit Product Category
//       if (category) {
//         response = await axiosInstance.put(
//           `/product-category/${category._id}`,
//           {
//             productCategory,
//             remark,
//           },
//         );

//         if (response.data.success) {
//           setAlert({
//             type: "success",
//             message:
//               "Product Category updated successfully!",
//           });

//           if (onCategoryAdded) {
//             onCategoryAdded(
//               response.data.data,
//               true,
//             );
//           }
//         }
//       }

//       // Add Product Category
//       else {
//         response = await axiosInstance.post(
//           "/product-category",
//           {
//             productCategory,
//             remark,
//           },
//         );

//         if (response.data.success) {
//           setAlert({
//             type: "success",
//             message:
//               "Product Category added successfully!",
//           });

//           if (onCategoryAdded) {
//             onCategoryAdded(
//               response.data.data,
//               false,
//             );
//           }
//         }
//       }

//       setProductCategory("");
//       setRemark("");

//       setTimeout(() => {
//         onClose();
//       }, 1500);
//     } catch (error) {
//       console.error(
//         "Error saving product category:",
//         error,
//       );

//       // Backend validation errors
//       if (error.response?.data?.errors) {
//         const backendErrors = {};

//         error.response.data.errors.forEach(
//           (err) => {
//             backendErrors[err.path] = err.msg;
//           },
//         );

//         setErrors(backendErrors);
//       } else {
//         const msg =
//           error.response?.data?.message ||
//           error.message ||
//           "Failed to save product category";

//         setAlert({
//           type: "danger",
//           message: msg,
//         });
//       }
//     }
//   };

//   // --------------------------------------------------
//   // Hide modal
//   // --------------------------------------------------
//   if (!visible) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
//       <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             {category
//               ? "Edit Product Category"
//               : "Add Product Category"}
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             className="text-2xl leading-none text-gray-400 transition hover:text-gray-700"
//             aria-label="Close"
//           >
//             ×
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5">
//           {/* Alert */}
//           {alert.message && (
//             <div
//               className={`mb-5 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
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
//                 className="ml-4 text-lg font-semibold opacity-70 hover:opacity-100"
//                 aria-label="Close alert"
//               >
//                 ×
//               </button>
//             </div>
//           )}

//           {/* Form */}
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Product Category */}
//             <div>
//               <label
//                 htmlFor="productCategory"
//                 className={`mb-2 block text-sm font-medium ${
//                   errors.productCategory
//                     ? "text-red-600"
//                     : productCategory
//                       ? "text-green-600"
//                       : "text-gray-700"
//                 }`}
//               >
//                 Product Category{" "}
//                 <span className="text-red-500">
//                   *
//                 </span>
//               </label>

//               <input
//                 type="text"
//                 id="productCategory"
//                 placeholder="Product Category"
//                 value={productCategory}
//                 onChange={(e) => {
//                   const value = e.target.value;

//                   setProductCategory(value);

//                   if (value.trim()) {
//                     setErrors((prev) => ({
//                       ...prev,
//                       productCategory: "",
//                     }));
//                   }
//                 }}
//                 className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
//                   errors.productCategory
//                     ? "border-red-500 focus:ring-2 focus:ring-red-100"
//                     : productCategory
//                       ? "border-green-500 focus:ring-2 focus:ring-green-100"
//                       : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 }`}
//               />

//               {errors.productCategory && (
//                 <p className="mt-1 text-xs text-red-600">
//                   {errors.productCategory}
//                 </p>
//               )}
//             </div>

//             {/* Remark */}
//             <div>
//               <label
//                 htmlFor="remark"
//                 className="mb-2 block text-sm font-medium text-gray-700"
//               >
//                 Remark
//               </label>

//               <input
//                 type="text"
//                 id="remark"
//                 placeholder="Product category remark"
//                 value={remark}
//                 onChange={(e) =>
//                   setRemark(e.target.value)
//                 }
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
//           <button
//             type="button"
//             onClick={handleSubmit}
//             className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// AddProductCategory.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onCategoryAdded: PropTypes.func,
//   category: PropTypes.object,
// };

// export default AddProductCategory;

import React, {
  useEffect,
  useState,
} from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

import axiosInstance from "../../../axiosInstance";

const AddProductCategory = ({
  visible,
  onClose,
  onCategoryAdded,
  category,
}) => {
  const [productCategory, setProductCategory] =
    useState("");

  const [remark, setRemark] = useState("");

  const [errors, setErrors] = useState({});

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  // --------------------------------------------------
  // Initialize form for Add / Edit
  // --------------------------------------------------
  useEffect(() => {
    if (category) {
      setProductCategory(
        category.productCategory || "",
      );

      setRemark(category.remark || "");
    } else {
      setProductCategory("");
      setRemark("");
    }

    setErrors({});

    setAlert({
      type: "",
      message: "",
    });
  }, [category, visible]);

  // --------------------------------------------------
  // Validation
  // --------------------------------------------------
  const validateForm = () => {
    const newErrors = {};

    if (!productCategory.trim()) {
      newErrors.productCategory =
        "This is a required field";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let response;

      // --------------------------------------------------
      // Edit Product Category
      // --------------------------------------------------
      if (category) {
        response = await axiosInstance.put(
          `/product-category/${category._id}`,
          {
            productCategory,
            remark,
          },
        );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Product Category updated successfully!",
          });

          if (onCategoryAdded) {
            onCategoryAdded(
              response.data.data,
              true,
            );
          }
        }
      }

      // --------------------------------------------------
      // Add Product Category
      // --------------------------------------------------
      else {
        response = await axiosInstance.post(
          "/product-category",
          {
            productCategory,
            remark,
          },
        );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Product Category added successfully!",
          });

          if (onCategoryAdded) {
            onCategoryAdded(
              response.data.data,
              false,
            );
          }
        }
      }

      setProductCategory("");
      setRemark("");

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error(
        "Error saving product category:",
        error,
      );

      // --------------------------------------------------
      // Backend validation errors
      // --------------------------------------------------
      if (error.response?.data?.errors) {
        const backendErrors = {};

        error.response.data.errors.forEach(
          (err) => {
            backendErrors[err.path] = err.msg;
          },
        );

        setErrors(backendErrors);
      } else {
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Failed to save product category";

        setAlert({
          type: "danger",
          message: msg,
        });
      }
    }
  };

  // --------------------------------------------------
  // Hide modal
  // --------------------------------------------------
  if (!visible) {
    return null;
  }

  return (
    <>
      {/* ================= OVERLAY ================= */}
      <div
        className="
          fixed
          inset-0
          z-[9999]
          flex
          items-start
          justify-center
          bg-black/50
          px-4
        "
      >
        {/* ================= MODAL ================= */}
        <div
          className="
            mt-[70px]
            w-full
            max-w-[850px]
            overflow-hidden
            rounded-[7px]
            bg-white
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
            animate-[categoryCurtain_0.4s_ease-out]
          "
        >
          {/* ================= HEADER ================= */}
          <div
            className="
              flex
              h-[65px]
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
              {category
                ? "Edit Product Category"
                : "Add Product Category"}
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
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
              "
            >
              <X
                size={25}
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* ================= BODY ================= */}
          <div className="px-[17px] pb-[30px] pt-[18px]">

            {/* ================= ALERT ================= */}
            {alert.message && (
              <div
                className={`
                  mb-[20px]
                  flex
                  items-center
                  justify-between
                  rounded-[4px]
                  border
                  px-[15px]
                  py-[11px]
                  text-[14px]
                  ${
                    alert.type === "success"
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
                    text-[20px]
                    leading-none
                    opacity-60
                    hover:opacity-100
                  "
                  aria-label="Close alert"
                >
                  ×
                </button>
              </div>
            )}

            {/* ================= FORM ================= */}
            <div
              className="
                grid
                grid-cols-1
                gap-x-[21px]
                gap-y-[22px]
                md:grid-cols-2
              "
            >
              {/* ================= PRODUCT CATEGORY ================= */}
              <div>
                <label
                  htmlFor="productCategory"
                  className={`
                    mb-[8px]
                    block
                    text-[16px]
                    font-semibold
                    leading-[20px]
                    ${
                      errors.productCategory
                        ? "text-red-600"
                        : "text-[#343a40]"
                    }
                  `}
                >
                  Product Category{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  id="productCategory"
                  placeholder="Product Category"
                  value={productCategory}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setProductCategory(value);

                    if (value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        productCategory: "",
                      }));
                    }
                  }}
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
                    duration-200
                    ${
                      errors.productCategory
                        ? "border-red-500 focus:ring-1 focus:ring-red-100"
                        : "border-[#d9d9d9] focus:border-[#2f5fa7] focus:ring-1 focus:ring-[#2f5fa7]/20"
                    }
                  `}
                />

                {errors.productCategory && (
                  <p
                    className="
                      mt-[5px]
                      text-[13px]
                      text-red-600
                    "
                  >
                    {errors.productCategory}
                  </p>
                )}
              </div>

              {/* ================= REMARK ================= */}
              <div>
                <label
                  htmlFor="remark"
                  className="
                    mb-[8px]
                    block
                    text-[16px]
                    font-semibold
                    leading-[20px]
                    text-[#343a40]
                  "
                >
                  Remark
                </label>

                <input
                  type="text"
                  id="remark"
                  placeholder="Product category remark"
                  value={remark}
                  onChange={(e) =>
                    setRemark(e.target.value)
                  }
                  className="
                    h-[41px]
                    w-full
                    rounded-[2px]
                    border
                    border-[#d9d9d9]
                    bg-white
                    px-[12px]
                    text-[16px]
                    text-[#343a40]
                    outline-none
                    transition
                    duration-200
                    focus:border-[#2f5fa7]
                    focus:ring-1
                    focus:ring-[#2f5fa7]/20
                  "
                />
              </div>
            </div>
          </div>

          {/* ================= FOOTER ================= */}
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
            {/* Close */}
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
              "
            >
              Close
            </button>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              className="
                h-[41px]
                rounded-[6px]
                bg-[#b52b2b]
                px-[17px]
                text-[16px]
                font-medium
                text-white
                transition-all
                duration-200
                hover:bg-[#982323]
                active:scale-[0.98]
              "
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* ================= CURTAIN ANIMATION ================= */}
      <style>
        {`
          @keyframes categoryCurtain {
            0% {
              opacity: 0;
              transform: translateY(-60px) scaleY(0.82);
              transform-origin: top center;
            }

            45% {
              opacity: 1;
              transform: translateY(8px) scaleY(1.03);
              transform-origin: top center;
            }

            70% {
              transform: translateY(-3px) scaleY(0.99);
              transform-origin: top center;
            }

            100% {
              opacity: 1;
              transform: translateY(0) scaleY(1);
              transform-origin: top center;
            }
          }
        `}
      </style>
    </>
  );
};

AddProductCategory.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCategoryAdded: PropTypes.func,
  category: PropTypes.object,
};

export default AddProductCategory;