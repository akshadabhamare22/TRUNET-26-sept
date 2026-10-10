// import React, {
//   useEffect,
//   useState,
// } from "react";
// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// import axiosInstance from "../../../axiosInstance";
// const AddReseller = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] =
//     useState({
//       businessName: "",
//       contactNumber: "",
//       name: "",
//       mobile: "",
//       email: "",
//       gstNumber: "",
//       panNumber: "",
//       address1: "",
//       address2: "",
//       city: "",
//       state: "",
//     });

//   const [errors, setErrors] =
//     useState({});

//   const [alert, setAlert] =
//     useState({
//       type: "",
//       message: "",
//     });

//   // --------------------------------------------------
//   // Fetch Reseller for Edit
//   // --------------------------------------------------
//   useEffect(() => {
//     if (id) {
//       fetchVendor(id);
//     }
//   }, [id]);

//   const fetchVendor = async (
//     resellerId,
//   ) => {
//     try {
//       const res =
//         await axiosInstance.get(
//           `/resellers/${resellerId}`,
//         );

//       setFormData({
//         businessName:
//           res.data.data
//             ?.businessName || "",
//         contactNumber:
//           res.data.data
//             ?.contactNumber || "",
//         name:
//           res.data.data?.name ||
//           "",
//         mobile:
//           res.data.data?.mobile ||
//           "",
//         email:
//           res.data.data?.email ||
//           "",
//         gstNumber:
//           res.data.data
//             ?.gstNumber || "",
//         panNumber:
//           res.data.data
//             ?.panNumber || "",
//         address1:
//           res.data.data
//             ?.address1 || "",
//         address2:
//           res.data.data
//             ?.address2 || "",
//         city:
//           res.data.data?.city ||
//           "",
//         state:
//           res.data.data?.state ||
//           "",
//       });
//     } catch (error) {
//       console.error(
//         "Error fetching vendors:",
//         error,
//       );

//       setAlert({
//         type: "danger",
//         message:
//           error.response?.data
//             ?.message ||
//           "Failed to fetch reseller data.",
//       });
//     }
//   };

//   // --------------------------------------------------
//   // Handle Input Change
//   // --------------------------------------------------
//   const handleChange = (e) => {
//     const {
//       name,
//       value,
//     } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       [name]: "",
//     }));

//     if (alert.message) {
//       setAlert({
//         type: "",
//         message: "",
//       });
//     }
//   };

//   // --------------------------------------------------
//   // Submit
//   // --------------------------------------------------
//   const handleSubmit = async (
//     e,
//   ) => {
//     e.preventDefault();

//     const newErrors = {};

//     [
//       "businessName",
//       "contactNumber",
//       "name",
//       "email",
//       "address1",
//     ].forEach((field) => {
//       if (
//         !formData[field] ||
//         !formData[field].trim()
//       ) {
//         newErrors[field] =
//           "This is a required field";
//       }
//     });

//     if (
//       Object.keys(newErrors).length
//     ) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       if (id) {
//         await axiosInstance.put(
//           `/resellers/${id}`,
//           formData,
//         );

//         setAlert({
//           type: "success",
//           message:
//             "Data updated successfully!",
//         });
//       } else {
//         await axiosInstance.post(
//           "/resellers",
//           formData,
//         );

//         setAlert({
//           type: "success",
//           message:
//             "Data added successfully!",
//         });
//       }

//       setTimeout(() => {
//         navigate("/reseller-list");
//       }, 1500);
//     } catch (error) {
//       console.error(
//         "Error saving Data:",
//         error,
//       );

//       let message =
//         "Failed to save Data. Please try again!";

//       if (error.response) {
//         message =
//           error.response.data
//             ?.message ||
//           error.response.data
//             ?.error ||
//           message;
//       } else if (error.request) {
//         message =
//           "No response from server. Please check your connection.";
//       } else {
//         message =
//           error.message || message;
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
//     setFormData({
//       businessName: "",
//       contactNumber: "",
//       name: "",
//       mobile: "",
//       email: "",
//       gstNumber: "",
//       panNumber: "",
//       address1: "",
//       address2: "",
//       city: "",
//       state: "",
//     });

//     setErrors({});

//     setAlert({
//       type: "",
//       message: "",
//     });
//   };

//   // --------------------------------------------------
//   // Input Class Helper
//   // --------------------------------------------------
//   const getInputClass = (
//     field,
//   ) => {
//     if (errors[field]) {
//       return "border-red-500 focus:border-red-500 focus:ring-red-500";
//     }

//     if (formData[field]) {
//       return "border-green-500 focus:border-green-500 focus:ring-green-500";
//     }

//     return "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
//   };

//   const getLabelClass = (
//     field,
//   ) => {
//     if (errors[field]) {
//       return "text-red-600";
//     }

//     if (formData[field]) {
//       return "text-green-600";
//     }

//     return "text-gray-700";
//   };

//   // --------------------------------------------------
//   // Form Field
//   // --------------------------------------------------
//   const renderInput = ({
//     id: fieldId,
//     name,
//     label,
//     type = "text",
//     required = false,
//     placeholder = "",
//   }) => (
//     <div className="w-full">
//       <label
//         htmlFor={fieldId}
//         className={`mb-1.5 block text-sm font-medium ${getLabelClass(
//           name,
//         )}`}
//       >
//         {label}

//         {required && (
//           <span className="ml-1 text-red-500">
//             *
//           </span>
//         )}
//       </label>

//       <input
//         type={type}
//         id={fieldId}
//         name={name}
//         value={
//           formData[name] || ""
//         }
//         onChange={handleChange}
//         placeholder={placeholder}
//         className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:ring-1 ${getInputClass(
//           name,
//         )}`}
//       />

//       {errors[name] && (
//         <p className="mt-1 text-xs text-red-600">
//           {errors[name]}
//         </p>
//       )}
//     </div>
//   );

//   return (
//     <div className="w-full">
//       {/* Page Title */}
//       <div className="mb-4 text-xl font-semibold text-gray-800">
//         {id ? "Edit" : "Add"} Reseller
//       </div>

//       {/* Form Card */}
//       <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
//         <div className="p-5">
//           {/* Alert */}
//           {alert.message && (
//             <div
//               className={`mb-5 flex items-start justify-between rounded-md border px-4 py-3 text-sm ${
//                 alert.type ===
//                 "success"
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
//                 className="ml-4 text-lg leading-none opacity-70 hover:opacity-100"
//               >
//                 ×
//               </button>
//             </div>
//           )}

//           <form
//             onSubmit={handleSubmit}
//           >
//             {/* Row 1 */}
//             <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
//               {renderInput({
//                 id: "businessName",
//                 name: "businessName",
//                 label:
//                   "Reseller Name",
//                 required: true,
//               })}

//               {renderInput({
//                 id: "contactNumber",
//                 name: "contactNumber",
//                 label:
//                   "Contact Number",
//                 required: true,
//                 type: "text",
//               })}

//               {renderInput({
//                 id: "name",
//                 name: "name",
//                 label:
//                   "Contact Person Name",
//                 required: true,
//               })}
//             </div>

//             {/* Row 2 */}
//             <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
//               {renderInput({
//                 id: "mobile",
//                 name: "mobile",
//                 label: "Mobile",
//                 type: "tel",
//               })}

//               {renderInput({
//                 id: "email",
//                 name: "email",
//                 label: "Email",
//                 required: true,
//                 type: "email",
//               })}

//               {renderInput({
//                 id: "gstNumber",
//                 name: "gstNumber",
//                 label: "GST No",
//               })}
//             </div>

//             {/* Row 3 */}
//             <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
//               {renderInput({
//                 id: "panNumber",
//                 name: "panNumber",
//                 label: "PAN No",
//               })}

//               {renderInput({
//                 id: "address1",
//                 name: "address1",
//                 label: "Address 1",
//                 required: true,
//               })}

//               {renderInput({
//                 id: "address2",
//                 name: "address2",
//                 label: "Address 2",
//               })}
//             </div>

//             {/* Row 4 */}
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//               {renderInput({
//                 id: "city",
//                 name: "city",
//                 label: "City",
//               })}

//               {renderInput({
//                 id: "state",
//                 name: "state",
//                 label: "State",
//               })}

//               {/* Empty column to preserve 3-column layout */}
//               <div />
//             </div>

//             {/* Footer */}
//             <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
//               <button
//                 type="button"
//                 onClick={
//                   handleReset
//                 }
//                 className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//               >
//                 Reset
//               </button>

//               <button
//                 type="submit"
//                 className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
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

// export default AddReseller;

import React, {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axiosInstance from "../../../axiosInstance";

const AddReseller = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] =
    useState({
      businessName: "",
      contactNumber: "",
      name: "",
      mobile: "",
      email: "",
      gstNumber: "",
      panNumber: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
    });

  const [errors, setErrors] =
    useState({});

  const [alert, setAlert] =
    useState({
      type: "",
      message: "",
    });

  // --------------------------------------------------
  // Fetch Reseller for Edit
  // --------------------------------------------------
  useEffect(() => {
    if (id) {
      fetchVendor(id);
    }
  }, [id]);

  const fetchVendor = async (
    resellerId,
  ) => {
    try {
      const res =
        await axiosInstance.get(
          `/resellers/${resellerId}`,
        );

      setFormData({
        businessName:
          res.data.data
            ?.businessName || "",
        contactNumber:
          res.data.data
            ?.contactNumber || "",
        name:
          res.data.data?.name ||
          "",
        mobile:
          res.data.data?.mobile ||
          "",
        email:
          res.data.data?.email ||
          "",
        gstNumber:
          res.data.data
            ?.gstNumber || "",
        panNumber:
          res.data.data
            ?.panNumber || "",
        address1:
          res.data.data
            ?.address1 || "",
        address2:
          res.data.data
            ?.address2 || "",
        city:
          res.data.data?.city ||
          "",
        state:
          res.data.data?.state ||
          "",
      });
    } catch (error) {
      console.error(
        "Error fetching vendors:",
        error,
      );

      setAlert({
        type: "danger",
        message:
          error.response?.data
            ?.message ||
          "Failed to fetch reseller data.",
      });
    }
  };

  // --------------------------------------------------
  // Handle Input Change
  // --------------------------------------------------
  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (alert.message) {
      setAlert({
        type: "",
        message: "",
      });
    }
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async (
    e,
  ) => {
    e.preventDefault();

    const newErrors = {};

    [
      "businessName",
      "contactNumber",
      "name",
      "email",
      "address1",
    ].forEach((field) => {
      if (
        !formData[field] ||
        !formData[field].trim()
      ) {
        newErrors[field] =
          "This is a required field";
      }
    });

    if (
      Object.keys(newErrors).length
    ) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(
          `/resellers/${id}`,
          formData,
        );

        setAlert({
          type: "success",
          message:
            "Data updated successfully!",
        });
      } else {
        await axiosInstance.post(
          "/resellers",
          formData,
        );

        setAlert({
          type: "success",
          message:
            "Data added successfully!",
        });
      }

      setTimeout(() => {
        navigate("/reseller-list");
      }, 1500);
    } catch (error) {
      console.error(
        "Error saving Data:",
        error,
      );

      let message =
        "Failed to save Data. Please try again!";

      if (error.response) {
        message =
          error.response.data
            ?.message ||
          error.response.data
            ?.error ||
          message;
      } else if (error.request) {
        message =
          "No response from server. Please check your connection.";
      } else {
        message =
          error.message || message;
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
    setFormData({
      businessName: "",
      contactNumber: "",
      name: "",
      mobile: "",
      email: "",
      gstNumber: "",
      panNumber: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
    });

    setErrors({});

    setAlert({
      type: "",
      message: "",
    });
  };

  // --------------------------------------------------
  // Input Class Helper
  // --------------------------------------------------
  const getInputClass = (
    field,
  ) => {
    if (errors[field]) {
      return `
        border-red-500
        focus:border-red-500
        focus:ring-red-100
      `;
    }

    if (formData[field]) {
      return `
        border-green-500
        focus:border-green-500
        focus:ring-green-100
      `;
    }

    return `
      border-[#d6d6d6]
      focus:border-[#2f64ad]
      focus:ring-[#2f64ad]/20
    `;
  };

  const getLabelClass = (
    field,
  ) => {
    if (errors[field]) {
      return "text-red-600";
    }

    if (formData[field]) {
      return "text-green-600";
    }

    return "text-[#172033]";
  };

  // --------------------------------------------------
  // Form Field
  // --------------------------------------------------
  const renderInput = ({
    id: fieldId,
    name,
    label,
    type = "text",
    required = false,
    placeholder = "",
  }) => (
    <div className="w-full">
      <label
        htmlFor={fieldId}
        className={`
          mb-[8px]
          block
          text-[16px]
          font-semibold
          ${getLabelClass(name)}
        `}
      >
        {label}

        {required && (
          <span className="ml-[2px] text-red-500">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        id={fieldId}
        name={name}
        value={
          formData[name] || ""
        }
        onChange={handleChange}
        placeholder={placeholder}
        className={`
          h-[40px]
          w-full
          rounded-[1px]
          border
          bg-white
          px-[10px]
          text-[16px]
          text-[#222]
          outline-none
          transition
          duration-150
          placeholder:text-[#999]
          focus:ring-2
          ${getInputClass(name)}
        `}
      />

      {errors[name] && (
        <p className="mt-[4px] text-[12px] text-red-600">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* ==================================================
          PAGE TITLE
      ================================================== */}
     <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">       

        {id ? "Edit" : "Add"} Reseller
      </div>

      {/* ==================================================
          FORM CARD
      ================================================== */}
      <div
        className="
          w-full
          overflow-hidden
          rounded-[2px]
          border
          border-[#e5e7eb]
          bg-white
          shadow-[0_2px_8px_rgba(0,0,0,0.08)]
        "
      >
        {/* Blue top border */}
        <div className="h-[4px] w-full bg-[#2f64ad]" />

        <div className="px-[21px] pb-[20px] pt-[22px]">

          {/* ==================================================
              ALERT
          ================================================== */}
          {alert.message && (
            <div
              className={`
                mb-[20px]
                flex
                items-start
                justify-between
                rounded-[3px]
                border
                px-[14px]
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
                  leading-none
                  opacity-70
                  hover:opacity-100
                "
              >
                ×
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >
            {/* ==================================================
                ROW 1
            ================================================== */}
            <div
              className="
                mb-[21px]
                grid
                grid-cols-1
                gap-x-[21px]
                gap-y-[20px]
                md:grid-cols-3
              "
            >
              {renderInput({
                id: "businessName",
                name: "businessName",
                label:
                  "Reseller Name",
                required: true,
              })}

              {renderInput({
                id: "contactNumber",
                name: "contactNumber",
                label:
                  "Contact Number",
                required: true,
              })}

              {renderInput({
                id: "name",
                name: "name",
                label:
                  "Contact Person Name",
                required: true,
              })}
            </div>

            {/* ==================================================
                ROW 2
            ================================================== */}
            <div
              className="
                mb-[21px]
                grid
                grid-cols-1
                gap-x-[21px]
                gap-y-[20px]
                md:grid-cols-3
              "
            >
              {renderInput({
                id: "mobile",
                name: "mobile",
                label: "Mobile",
                type: "tel",
              })}

              {renderInput({
                id: "email",
                name: "email",
                label: "Email",
                required: true,
                type: "email",
              })}

              {renderInput({
                id: "gstNumber",
                name: "gstNumber",
                label: "GST No",
              })}
            </div>

            {/* ==================================================
                ROW 3
            ================================================== */}
            <div
              className="
                mb-[21px]
                grid
                grid-cols-1
                gap-x-[21px]
                gap-y-[20px]
                md:grid-cols-3
              "
            >
              {renderInput({
                id: "panNumber",
                name: "panNumber",
                label: "Pan No",
              })}

              {renderInput({
                id: "address1",
                name: "address1",
                label: "Address 1",
                required: true,
              })}

              {renderInput({
                id: "address2",
                name: "address2",
                label: "Address 2",
              })}
            </div>

            {/* ==================================================
                ROW 4
            ================================================== */}
            <div
              className="
                grid
                grid-cols-1
                gap-x-[21px]
                gap-y-[20px]
                md:grid-cols-3
              "
            >
              {renderInput({
                id: "city",
                name: "city",
                label: "City",
              })}

              {renderInput({
                id: "state",
                name: "state",
                label: "State",
              })}

              <div />
            </div>

            {/* ==================================================
                FOOTER
            ================================================== */}
            <div
              className="
                mt-[31px]
                flex
                items-center
                justify-end
                gap-[13px]
                border-t
                border-[#e5e5e5]
                pt-[20px]
              "
            >
              {/* Reset */}
              <button
                type="button"
                onClick={
                  handleReset
                }
                className="
                  h-[43px]
                  rounded-[4px]
                  bg-[#2f64ad]
                  px-[17px]
                  text-[16px]
                  font-medium
                  text-white
                  transition
                  hover:bg-[#255596]
                  focus:outline-none
                "
              >
                Reset
              </button>

              {/* Submit */}
              <button
                type="submit"
                className="
                  h-[43px]
                  rounded-[4px]
                  bg-[#b52b27]
                  px-[17px]
                  text-[16px]
                  font-medium
                  text-white
                  transition
                  hover:bg-[#99231f]
                  focus:outline-none
                "
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReseller;