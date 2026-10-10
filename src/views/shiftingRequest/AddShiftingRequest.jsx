// import React, { useEffect, useState } from "react";
// import { ArrowLeft, RotateCcw, Save } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import Select from "react-select";

// import axiosInstance from "../../axiosInstance";
// const selectStyles = {
//   control: (base, state) => ({
//     ...base,
//     minHeight: "40px",
//     borderRadius: "6px",
//     borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
//     boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
//     "&:hover": {
//       borderColor: "#2563eb",
//     },
//   }),
//   menu: (base) => ({
//     ...base,
//     zIndex: 50,
//   }),
// };

// const AddShiftingRequest = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split("T")[0],
//     toCenter: "",
//     customer: "",
//     address1: "",
//     address2: "",
//     city: "",
//     remark: "",
//   });

//   const [customers, setCustomers] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [alert, setAlert] = useState({
//     type: "",
//     message: "",
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchCustomers();
//     fetchCenters();

//     if (id) {
//       fetchShiftingRequest(id);
//     }
//   }, [id]);

//   const fetchCustomers = async () => {
//     try {
//       const res = await axiosInstance.get("/customers/all");
//       setCustomers(res.data.data || []);
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     }
//   };

//   const fetchCenters = async () => {
//     try {
//       const res = await axiosInstance.get(
//         "/centers/main-warehouse?centerType=Center"
//       );

//       setCenters(res.data.data || []);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchShiftingRequest = async (requestId) => {
//     try {
//       setLoading(true);

//       const res = await axiosInstance.get(
//         `/shiftingRequest/${requestId}`
//       );

//       if (res.data.success) {
//         const data = res.data.data;

//         setFormData({
//           date: data.date
//             ? new Date(data.date).toISOString().split("T")[0]
//             : new Date().toISOString().split("T")[0],

//           toCenter: data.toCenter?._id || data.toCenter || "",

//           customer: data.customer?._id || data.customer || "",

//           address1: data.address1 || "",
//           address2: data.address2 || "",
//           city: data.city || "",
//           remark: data.remark || "",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching shifting request:", error);
//     } finally {
//       setLoading(false);
//     }
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
//       newErrors.date = "This is a required field";
//     }

//     if (!formData.toCenter) {
//       newErrors.toCenter = "This is a required field";
//     }

//     if (!formData.customer) {
//       newErrors.customer = "This is a required field";
//     }

//     if (!formData.address1) {
//       newErrors.address1 = "This is a required field";
//     }

//     if (!formData.remark) {
//       newErrors.remark = "This is a required field";
//     }

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       const payload = {
//         date: formData.date,
//         toCenter: formData.toCenter,
//         customer: formData.customer,
//         address1: formData.address1,
//         address2: formData.address2,
//         city: formData.city,
//         remark: formData.remark,
//       };

//       if (id) {
//         await axiosInstance.put(`/shiftingRequest/${id}`, payload);

//         setAlert({
//           type: "success",
//           message: "Data updated successfully!",
//         });
//       } else {
//         await axiosInstance.post("/shiftingRequest", payload);

//         setAlert({
//           type: "success",
//           message: "Data added successfully!",
//         });
//       }

//       setTimeout(() => {
//         navigate("/shifting-request");
//       }, 1500);
//     } catch (error) {
//       console.error("Error saving shifting request:", error);

//       let message = "Failed to save Data. Please try again!";

//       if (error.response) {
//         message =
//           error.response.data?.message ||
//           error.response.data?.error ||
//           message;
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

//   const handleReset = () => {
//     setFormData({
//       date: new Date().toISOString().split("T")[0],
//       customer: "",
//       toCenter: "",
//       address1: "",
//       address2: "",
//       city: "",
//       remark: "",
//     });

//     setErrors({});
//   };

//   const handleBack = () => {
//     navigate("/shifting-request");
//   };

//   const selectedCustomer = customers.find(
//     (customer) => customer._id === formData.customer
//   );

//   const selectedCenter = centers.find(
//     (center) => center._id === formData.toCenter
//   );

//   if (loading && id) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="flex items-center gap-3 text-sm text-gray-600">
//           <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
//           Loading...
//         </div>
//       </div>
//     );
//   }

//   const inputClass = (field) =>
//     `w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
//       errors[field]
//         ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
//         : formData[field]
//           ? "border-green-500 bg-green-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//           : "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//     }`;

//   const labelClass = (field) =>
//     `mb-1.5 block text-sm font-medium ${
//       errors[field]
//         ? "text-red-600"
//         : formData[field]
//           ? "text-green-600"
//           : "text-gray-700"
//     }`;

//   return (
//     <div className="w-full px-4 py-4">
//       {/* Header */}
//       <div className="mb-4 flex flex-wrap items-center gap-3">
//         <button
//           type="button"
//           onClick={handleBack}
//           className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>

//         <h1 className="text-xl font-semibold text-gray-800">
//           {id ? "Edit" : "Add"} Shifting Request
//         </h1>
//       </div>

//       {/* Main Card */}
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="flex justify-end border-b border-gray-200 bg-gray-50 px-5 py-3">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//           >
//             <RotateCcw size={15} />
//             Reset
//           </button>
//         </div>

//         {/* Card Body */}
//         <div className="p-5">
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
//                 className="ml-4 text-lg leading-none opacity-70 hover:opacity-100"
//               >
//                 ×
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* Row 1 */}
//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
//               {/* Date */}
//               <div>
//                 <label htmlFor="date" className={labelClass("date")}>
//                   Date <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   className={inputClass("date")}
//                   value={formData.date}
//                   onChange={handleChange}
//                 />

//                 {errors.date && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.date}
//                   </p>
//                 )}
//               </div>

//               {/* Customer */}
//               <div>
//                 <label className={labelClass("customer")}>
//                   Customer <span className="text-red-500">*</span>
//                 </label>

//                 <Select
//                   inputId="customer"
//                   name="customer"
//                   isDisabled={!!id}
//                   value={
//                     selectedCustomer
//                       ? {
//                           label: `${
//                             selectedCustomer.name ||
//                             selectedCustomer.username
//                           } - ${selectedCustomer.mobile}`,
//                           value: formData.customer,
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     handleChange({
//                       target: {
//                         name: "customer",
//                         value: selected ? selected.value : "",
//                       },
//                     })
//                   }
//                   options={customers.map((customer) => ({
//                     label: `${customer.username} - ${customer.mobile}`,
//                     value: customer._id,
//                   }))}
//                   placeholder="Search Customer"
//                   styles={selectStyles}
//                 />

//                 {errors.customer && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.customer}
//                   </p>
//                 )}
//               </div>

//               {/* To Branch */}
//               <div>
//                 <label className={labelClass("toCenter")}>
//                   To Branch <span className="text-red-500">*</span>
//                 </label>

//                 <Select
//                   inputId="toCenter"
//                   name="toCenter"
//                   value={
//                     selectedCenter
//                       ? {
//                           label: selectedCenter.centerName,
//                           value: formData.toCenter,
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     handleChange({
//                       target: {
//                         name: "toCenter",
//                         value: selected ? selected.value : "",
//                       },
//                     })
//                   }
//                   options={centers.map((center) => ({
//                     label: center.centerName,
//                     value: center._id,
//                   }))}
//                   placeholder="Select Branch"
//                   styles={selectStyles}
//                 />

//                 {errors.toCenter && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.toCenter}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Row 2 */}
//             <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
//               {/* Address 1 */}
//               <div>
//                 <label htmlFor="address1" className={labelClass("address1")}>
//                   Address 1 <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   id="address1"
//                   name="address1"
//                   className={inputClass("address1")}
//                   value={formData.address1}
//                   onChange={handleChange}
//                   placeholder="Address1"
//                 />

//                 {errors.address1 && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.address1}
//                   </p>
//                 )}
//               </div>

//               {/* Address 2 */}
//               <div>
//                 <label
//                   htmlFor="address2"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Address 2
//                 </label>

//                 <input
//                   type="text"
//                   id="address2"
//                   name="address2"
//                   className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                   value={formData.address2}
//                   onChange={handleChange}
//                   placeholder="Address2"
//                 />
//               </div>

//               {/* City */}
//               <div>
//                 <label
//                   htmlFor="city"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   City
//                 </label>

//                 <input
//                   type="text"
//                   id="city"
//                   name="city"
//                   className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                   value={formData.city}
//                   onChange={handleChange}
//                   placeholder="City"
//                 />
//               </div>
//             </div>

//             {/* Remark */}
//             <div className="mt-5 grid grid-cols-1 md:grid-cols-2">
//               <div>
//                 <label htmlFor="remark" className={labelClass("remark")}>
//                   Remark <span className="text-red-500">*</span>
//                 </label>

//                 <textarea
//                   id="remark"
//                   name="remark"
//                   placeholder="Remark"
//                   rows={3}
//                   className={`w-full resize-y rounded-md border px-3 py-2 text-sm outline-none transition ${
//                     errors.remark
//                       ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500"
//                       : formData.remark
//                         ? "border-green-500 bg-green-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         : "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                   }`}
//                   value={formData.remark}
//                   onChange={handleChange}
//                 />

//                 {errors.remark && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.remark}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//               >
//                 <RotateCcw size={15} />
//                 Reset
//               </button>

//               <button
//                 type="submit"
//                 className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//               >
//                 <Save size={15} />
//                 {id ? "Update" : "Submit"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddShiftingRequest;


import React, { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

import axiosInstance from "../../axiosInstance";
const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "41px",
    borderRadius: "4px",
    borderColor: state.isFocused ? "#2759a2" : "#d6d6d6",
    boxShadow: state.isFocused ? "0 0 0 1px #2759a2" : "none",
    "&:hover": {
      borderColor: "#2759a2",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 50,
  }),
};

const AddShiftingRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    toCenter: "",
    customer: "",
    address1: "",
    address2: "",
    city: "",
    remark: "",
  });

  const [customers, setCustomers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchCenters();

    if (id) {
      fetchShiftingRequest(id);
    }
  }, [id]);

  const fetchCustomers = async () => {
    try {
      const res = await axiosInstance.get("/customers/all");
      setCustomers(res.data.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchCenters = async () => {
    try {
      const res = await axiosInstance.get(
        "/centers/main-warehouse?centerType=Center"
      );

      setCenters(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShiftingRequest = async (requestId) => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/shiftingRequest/${requestId}`
      );

      if (res.data.success) {
        const data = res.data.data;

        setFormData({
          date: data.date
            ? new Date(data.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],

          toCenter: data.toCenter?._id || data.toCenter || "",

          customer: data.customer?._id || data.customer || "",

          address1: data.address1 || "",
          address2: data.address2 || "",
          city: data.city || "",
          remark: data.remark || "",
        });
      }
    } catch (error) {
      console.error("Error fetching shifting request:", error);
    } finally {
      setLoading(false);
    }
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
      newErrors.date = "This is a required field";
    }

    if (!formData.toCenter) {
      newErrors.toCenter = "This is a required field";
    }

    if (!formData.customer) {
      newErrors.customer = "This is a required field";
    }

    if (!formData.address1) {
      newErrors.address1 = "This is a required field";
    }

    if (!formData.remark) {
      newErrors.remark = "This is a required field";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        date: formData.date,
        toCenter: formData.toCenter,
        customer: formData.customer,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        remark: formData.remark,
      };

      if (id) {
        await axiosInstance.put(`/shiftingRequest/${id}`, payload);

        setAlert({
          type: "success",
          message: "Data updated successfully!",
        });
      } else {
        await axiosInstance.post("/shiftingRequest", payload);

        setAlert({
          type: "success",
          message: "Data added successfully!",
        });
      }

      setTimeout(() => {
        navigate("/shifting-request");
      }, 1500);
    } catch (error) {
      console.error("Error saving shifting request:", error);

      let message = "Failed to save Data. Please try again!";

      if (error.response) {
        message =
          error.response.data?.message ||
          error.response.data?.error ||
          message;
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

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      customer: "",
      toCenter: "",
      address1: "",
      address2: "",
      city: "",
      remark: "",
    });

    setErrors({});
  };

  const handleBack = () => {
    navigate("/shifting-request");
  };

  const selectedCustomer = customers.find(
    (customer) => customer._id === formData.customer
  );

  const selectedCenter = centers.find(
    (center) => center._id === formData.toCenter
  );

  if (loading && id) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          Loading...
        </div>
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full rounded-[3px] border px-3 py-[9px] text-sm outline-none transition ${
      errors[field]
        ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        : "border-[#d6d6d6] bg-white focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2]"
    }`;

  const labelClass = (field) =>
    `mb-1.5 block text-[15px] font-semibold ${
      errors[field]
        ? "text-red-600"
        : field === "date" && formData[field]
          ? "text-green-600"
          : "text-[#343a40]"
    }`;

  return (
    <div className="w-full bg-[#f4f5f7] px-3 py-2 md:px-2">
      {/* Header */}
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex h-[34px] items-center gap-1 rounded-md bg-[#2759a2] px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="mb-2 text-[24px] font-[450] leading-tight text-[#212529]">
          {id ? "Edit" : "Add"} Shifting Request
        </h1>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-b-sm border-x border-b border-gray-200 border-t-4 border-t-[#2759a2] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        {/* Card Header */}
        <div className="flex min-h-[64px] justify-end border-b border-gray-200 bg-white px-5 py-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-[42px] items-center gap-2 rounded-md bg-[#2759a2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b]"
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        {/* Card Body */}
        <div className="px-5 py-5">
          {/* Alert */}
          {alert.message && (
            <div
              className={`mb-5 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
                alert.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
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
                className="ml-4 text-lg leading-none opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {/* Date */}
              <div>
                <label htmlFor="date" className={labelClass("date")}>
                  Date <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  id="date"
                  name="date"
                  className={inputClass("date")}
                  value={formData.date}
                  onChange={handleChange}
                />

                {errors.date && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Customer */}
              <div>
                <label className={labelClass("customer")}>
                  Customer <span className="text-red-500">*</span>
                </label>

                <Select
                  inputId="customer"
                  name="customer"
                  isDisabled={!!id}
                  value={
                    selectedCustomer
                      ? {
                          label: `${
                            selectedCustomer.name ||
                            selectedCustomer.username
                          } - ${selectedCustomer.mobile}`,
                          value: formData.customer,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    handleChange({
                      target: {
                        name: "customer",
                        value: selected ? selected.value : "",
                      },
                    })
                  }
                  options={customers.map((customer) => ({
                    label: `${customer.username} - ${customer.mobile}`,
                    value: customer._id,
                  }))}
                  placeholder="Search Customer"
                  styles={selectStyles}
                />

                {errors.customer && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.customer}
                  </p>
                )}
              </div>

              {/* To Branch */}
              <div>
                <label className={labelClass("toCenter")}>
                  To Branch <span className="text-red-500">*</span>
                </label>

                <Select
                  inputId="toCenter"
                  name="toCenter"
                  value={
                    selectedCenter
                      ? {
                          label: selectedCenter.centerName,
                          value: formData.toCenter,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    handleChange({
                      target: {
                        name: "toCenter",
                        value: selected ? selected.value : "",
                      },
                    })
                  }
                  options={centers.map((center) => ({
                    label: center.centerName,
                    value: center._id,
                  }))}
                  placeholder="Select Branch"
                  styles={selectStyles}
                />

                {errors.toCenter && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.toCenter}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {/* Address 1 */}
              <div>
                <label htmlFor="address1" className={labelClass("address1")}>
                  Address 1 <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="address1"
                  name="address1"
                  className={inputClass("address1")}
                  value={formData.address1}
                  onChange={handleChange}
                  placeholder="Address1"
                />

                {errors.address1 && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.address1}
                  </p>
                )}
              </div>

              {/* Address 2 */}
              <div>
                <label
                  htmlFor="address2"
                  className="mb-1.5 block text-[15px] font-semibold text-gray-700"
                >
                  Address 2
                </label>

                <input
                  type="text"
                  id="address2"
                  name="address2"
                  className="w-full rounded-[3px] border border-[#d6d6d6] bg-white px-3 py-[9px] text-sm outline-none transition focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2]"
                  value={formData.address2}
                  onChange={handleChange}
                  placeholder="Address2"
                />
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-1.5 block text-[15px] font-semibold text-gray-700"
                >
                  City
                </label>

                <input
                  type="text"
                  id="city"
                  name="city"
                  className="w-full rounded-[3px] border border-[#d6d6d6] bg-white px-3 py-[9px] text-sm outline-none transition focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2]"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>
            </div>

            {/* Remark */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label htmlFor="remark" className={labelClass("remark")}>
                  Remark <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="remark"
                  name="remark"
                  placeholder="Remark"
                  rows={3}
                  className={`w-full resize-y rounded-md border px-3 py-2 text-sm outline-none transition ${
                    errors.remark
                      ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500"
                      : "border-[#d6d6d6] bg-white focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2]"
                  }`}
                  value={formData.remark}
                  onChange={handleChange}
                />

                {errors.remark && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.remark}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-[42px] items-center gap-2 rounded-md bg-[#2759a2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4b8b]"
              >
                <RotateCcw size={15} />
                Reset
              </button>

              <button
                type="submit"
                className="inline-flex h-[42px] items-center gap-2 rounded-md bg-[#b3261e] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#982019]"
              >
                <Save size={15} />
                {id ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddShiftingRequest;