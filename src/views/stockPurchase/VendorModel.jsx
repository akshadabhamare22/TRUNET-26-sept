// import React, { useState } from "react";
// import PropTypes from "prop-types";
// import { RotateCcw, Save, X } from "lucide-react";
// import axiosInstance from "../../axiosInstance";
// const initialFormData = {
//   businessName: "",
//   contactNumber: "",
//   name: "",
//   mobile: "",
//   email: "",
//   gstNumber: "",
//   panNumber: "",
//   address1: "",
//   address2: "",
//   city: "",
//   state: "",
//   logo: "",
// };

// const VendorModal = ({ visible, onClose, onVendorAdded }) => {
//   const [formData, setFormData] = useState(initialFormData);
//   const [errors, setErrors] = useState({});
//   const [apiError, setApiError] = useState("");

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

//     setApiError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};

//     ["businessName", "contactNumber", "name", "email", "address1"].forEach(
//       (field) => {
//         if (!formData[field]) {
//           newErrors[field] = "This is a required field";
//         }
//       }
//     );

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       const res = await axiosInstance.post("/vendor", formData);

//       if (onVendorAdded) {
//         onVendorAdded(res.data.data);
//       }

//       onClose();
//     } catch (error) {
//       console.error("Error saving vendor:", error);

//       if (
//         error.response?.data?.errors &&
//         Array.isArray(error.response.data.errors)
//       ) {
//         const validationMessages = error.response.data.errors
//           .map((err) => err.msg)
//           .join(", ");

//         setApiError(validationMessages);
//       } else if (error.response?.data?.message) {
//         setApiError(error.response.data.message);
//       } else {
//         setApiError("Something went wrong. Please try again.");
//       }
//     }
//   };

//   const handleReset = () => {
//     setFormData(initialFormData);
//     setErrors({});
//     setApiError("");
//   };

//   if (!visible) return null;

//   const inputClass = (field) =>
//     `w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
//       errors[field]
//         ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
//         : formData[field]
//           ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-2 focus:ring-green-100"
//           : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//     }`;

//   const labelClass = (field) =>
//     `mb-1.5 block text-sm font-medium ${
//       errors[field]
//         ? "text-red-600"
//         : formData[field]
//           ? "text-green-700"
//           : "text-gray-700"
//     }`;

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6">
//       <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Add Vendor
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="overflow-y-auto px-6 py-5">
//           {/* API Error */}
//           {apiError && (
//             <div
//               className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
//               role="alert"
//             >
//               {apiError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//               {/* Business Name */}
//               <div>
//                 <label htmlFor="businessName" className={labelClass("businessName")}>
//                   Business Name <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   id="businessName"
//                   name="businessName"
//                   value={formData.businessName}
//                   onChange={handleChange}
//                   className={inputClass("businessName")}
//                 />

//                 {errors.businessName && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.businessName}
//                   </p>
//                 )}
//               </div>

//               {/* Contact Number */}
//               <div>
//                 <label
//                   htmlFor="contactNumber"
//                   className={labelClass("contactNumber")}
//                 >
//                   Contact Number <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   id="contactNumber"
//                   name="contactNumber"
//                   value={formData.contactNumber}
//                   onChange={handleChange}
//                   className={inputClass("contactNumber")}
//                 />

//                 {errors.contactNumber && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.contactNumber}
//                   </p>
//                 )}
//               </div>

//               {/* Name */}
//               <div>
//                 <label htmlFor="name" className={labelClass("name")}>
//                   Name <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className={inputClass("name")}
//                 />

//                 {errors.name && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.name}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
//               {/* Mobile */}
//               <div>
//                 <label
//                   htmlFor="mobile"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Mobile
//                 </label>

//                 <input
//                   type="tel"
//                   id="mobile"
//                   name="mobile"
//                   value={formData.mobile}
//                   onChange={handleChange}
//                   className={inputClass("mobile")}
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label htmlFor="email" className={labelClass("email")}>
//                   Email <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={inputClass("email")}
//                 />

//                 {errors.email && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.email}
//                   </p>
//                 )}
//               </div>

//               {/* GST */}
//               <div>
//                 <label
//                   htmlFor="gstNumber"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   GST No
//                 </label>

//                 <input
//                   type="text"
//                   id="gstNumber"
//                   name="gstNumber"
//                   value={formData.gstNumber}
//                   onChange={handleChange}
//                   className={inputClass("gstNumber")}
//                 />
//               </div>
//             </div>

//             <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
//               {/* PAN */}
//               <div>
//                 <label
//                   htmlFor="panNumber"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   PAN No
//                 </label>

//                 <input
//                   type="text"
//                   id="panNumber"
//                   name="panNumber"
//                   value={formData.panNumber}
//                   onChange={handleChange}
//                   className={inputClass("panNumber")}
//                 />
//               </div>

//               {/* Address 1 */}
//               <div>
//                 <label htmlFor="address1" className={labelClass("address1")}>
//                   Address 1 <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   id="address1"
//                   name="address1"
//                   value={formData.address1}
//                   onChange={handleChange}
//                   className={inputClass("address1")}
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
//                   value={formData.address2}
//                   onChange={handleChange}
//                   className={inputClass("address2")}
//                 />
//               </div>
//             </div>

//             <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
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
//                   value={formData.city}
//                   onChange={handleChange}
//                   className={inputClass("city")}
//                 />
//               </div>

//               {/* State */}
//               <div>
//                 <label
//                   htmlFor="state"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   State
//                 </label>

//                 <input
//                   type="text"
//                   id="state"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   className={inputClass("state")}
//                 />
//               </div>

//               {/* Logo */}
//               <div>
//                 <label
//                   htmlFor="logo"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Logo
//                 </label>

//                 <input
//                   type="file"
//                   id="logo"
//                   name="logo"
//                   onChange={handleChange}
//                   className="block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-600 file:mr-3 file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
//                 />
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-200 pt-5">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//               >
//                 <RotateCcw size={16} />
//                 Reset
//               </button>

//               <button
//                 type="submit"
//                 className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//               >
//                 <Save size={16} />
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// VendorModal.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onVendorAdded: PropTypes.func,
// };

// export default VendorModal;

import React, { useState } from "react";
import PropTypes from "prop-types";
import { RotateCcw, Save, X } from "lucide-react";
import axiosInstance from "../../axiosInstance";
const initialFormData = {
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
  logo: "",
};

const VendorModal = ({ visible, onClose, onVendorAdded }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

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

    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    ["businessName", "contactNumber", "name", "email", "address1"].forEach(
      (field) => {
        if (!formData[field]) {
          newErrors[field] = "This is a required field";
        }
      }
    );

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axiosInstance.post("/vendor", formData);

      if (onVendorAdded) {
        onVendorAdded(res.data.data);
      }

      onClose();
    } catch (error) {
      console.error("Error saving vendor:", error);

      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        const validationMessages = error.response.data.errors
          .map((err) => err.msg)
          .join(", ");

        setApiError(validationMessages);
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setApiError("");
  };

  if (!visible) return null;

  const inputClass = (field) =>
    `w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
      errors[field]
        ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : formData[field]
          ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-2 focus:ring-green-100"
          : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    }`;

  const labelClass = (field) =>
    `mb-1.5 block text-sm font-medium ${
      errors[field]
        ? "text-red-600"
        : formData[field]
          ? "text-green-700"
          : "text-gray-700"
    }`;

  const vendorModalAnimation = (
    <style>{`
      @keyframes vendorModalDrop {
        from {
          opacity: 0;
          transform: translateY(-32px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .vendor-modal-drop {
        animation: vendorModalDrop 220ms ease-out;
      }
    `}</style>
  )

  return (
    <>
      {vendorModalAnimation}
      <div className="fixed inset-0 z-[9999] bg-black/50 px-4 pt-4 sm:px-6 sm:pt-5">
      <div className="mx-auto flex max-h-[calc(100vh-55px)] w-full max-w-[860px] flex-col overflow-hidden rounded-b-[7px] rounded-t-[2px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] vendor-modal-drop">
        {/* Header */}
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-[#e5e5e5] bg-white px-[17px]">
          <h2 className="m-0 text-[22px] font-normal leading-none text-[#343a40]">
            Add Vendor
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-[4px] text-[#777] transition hover:bg-[#f3f3f3] hover:text-[#333] focus:outline-none"
            aria-label="Close"
          >
            <X size={26} strokeWidth={1.8} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-[17px] py-[17px]">
          {apiError && (
            <div
              className="mb-[15px] rounded-[4px] border border-[#f1b0b7] bg-[#f8d7da] px-3 py-2.5 text-[14px] text-[#842029]"
              role="alert"
            >
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-x-[20px] gap-y-[16px] md:grid-cols-3">
              {/* Business Name */}
              <div>
                <label
                  htmlFor="businessName"
                  className={`mb-[7px] block text-[16px] font-semibold leading-[19px] ${
                    errors.businessName ? 'text-[#dc3545]' : 'text-[#343a40]'
                  }`}
                >
                  Business Name <span className="text-[#dc3545]">*</span>
                </label>

                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={`h-[41px] w-full rounded-[2px] border bg-white px-[10px] text-[15px] text-[#212529] outline-none transition ${
                    errors.businessName
                      ? 'border-[#dc3545] focus:border-[#dc3545]'
                      : 'border-[#dcdcdc] focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]'
                  }`}
                />

                {errors.businessName && (
                  <p className="mt-1 text-[12px] text-[#dc3545]">
                    {errors.businessName}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label
                  htmlFor="contactNumber"
                  className={`mb-[7px] block text-[16px] font-semibold leading-[19px] ${
                    errors.contactNumber ? 'text-[#dc3545]' : 'text-[#343a40]'
                  }`}
                >
                  Contact Number <span className="text-[#dc3545]">*</span>
                </label>

                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={`h-[41px] w-full rounded-[2px] border bg-white px-[10px] text-[15px] text-[#212529] outline-none transition ${
                    errors.contactNumber
                      ? 'border-[#dc3545] focus:border-[#dc3545]'
                      : 'border-[#dcdcdc] focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]'
                  }`}
                />

                {errors.contactNumber && (
                  <p className="mt-1 text-[12px] text-[#dc3545]">
                    {errors.contactNumber}
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className={`mb-[7px] block text-[16px] font-semibold leading-[19px] ${
                    errors.name ? 'text-[#dc3545]' : 'text-[#343a40]'
                  }`}
                >
                  Name <span className="text-[#dc3545]">*</span>
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`h-[41px] w-full rounded-[2px] border bg-white px-[10px] text-[15px] text-[#212529] outline-none transition ${
                    errors.name
                      ? 'border-[#dc3545] focus:border-[#dc3545]'
                      : 'border-[#dcdcdc] focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]'
                  }`}
                />

                {errors.name && (
                  <p className="mt-1 text-[12px] text-[#dc3545]">
                    {errors.name}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="mt-[20px] grid grid-cols-1 gap-x-[20px] gap-y-[16px] md:grid-cols-3">
              {/* Mobile */}
              <div>
                <label
                  htmlFor="mobile"
                  className="mb-[7px] block text-[16px] font-semibold leading-[19px] text-[#343a40]"
                >
                  Mobile
                </label>

                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="h-[41px] w-full rounded-[2px] border border-[#dcdcdc] bg-white px-[10px] text-[15px] text-[#212529] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className={`mb-[7px] block text-[16px] font-semibold leading-[19px] ${
                    errors.email ? 'text-[#dc3545]' : 'text-[#343a40]'
                  }`}
                >
                  Email <span className="text-[#dc3545]">*</span>
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`h-[41px] w-full rounded-[2px] border bg-white px-[10px] text-[15px] text-[#212529] outline-none transition ${
                    errors.email
                      ? 'border-[#dc3545] focus:border-[#dc3545]'
                      : 'border-[#dcdcdc] focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]'
                  }`}
                />

                {errors.email && (
                  <p className="mt-1 text-[12px] text-[#dc3545]">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* GST */}
              <div>
                <label
                  htmlFor="gstNumber"
                  className="mb-[7px] block text-[16px] font-semibold leading-[19px] text-[#343a40]"
                >
                  GST No
                </label>

                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className="h-[41px] w-full rounded-[2px] border border-[#dcdcdc] bg-white px-[10px] text-[15px] text-[#212529] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="mt-[20px] grid grid-cols-1 gap-x-[20px] gap-y-[16px] md:grid-cols-3">
              {/* PAN */}
              <div>
                <label
                  htmlFor="panNumber"
                  className="mb-[7px] block text-[16px] font-semibold leading-[19px] text-[#343a40]"
                >
                  Pan No
                </label>

                <input
                  type="text"
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  className="h-[41px] w-full rounded-[2px] border border-[#dcdcdc] bg-white px-[10px] text-[15px] text-[#212529] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                />
              </div>

              {/* Address 1 */}
              <div>
                <label
                  htmlFor="address1"
                  className={`mb-[7px] block text-[16px] font-semibold leading-[19px] ${
                    errors.address1 ? 'text-[#dc3545]' : 'text-[#343a40]'
                  }`}
                >
                  Address 1 <span className="text-[#dc3545]">*</span>
                </label>

                <input
                  type="text"
                  id="address1"
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  className={`h-[41px] w-full rounded-[2px] border bg-white px-[10px] text-[15px] text-[#212529] outline-none transition ${
                    errors.address1
                      ? 'border-[#dc3545] focus:border-[#dc3545]'
                      : 'border-[#dcdcdc] focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]'
                  }`}
                />

                {errors.address1 && (
                  <p className="mt-1 text-[12px] text-[#dc3545]">
                    {errors.address1}
                  </p>
                )}
              </div>

              {/* Address 2 */}
              <div>
                <label
                  htmlFor="address2"
                  className="mb-[7px] block text-[16px] font-semibold leading-[19px] text-[#343a40]"
                >
                  Address 2
                </label>

                <input
                  type="text"
                  id="address2"
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  className="h-[41px] w-full rounded-[2px] border border-[#dcdcdc] bg-white px-[10px] text-[15px] text-[#212529] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="mt-[20px] grid grid-cols-1 gap-x-[20px] gap-y-[16px] md:grid-cols-3">
              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-[7px] block text-[16px] font-semibold leading-[19px] text-[#343a40]"
                >
                  City
                </label>

                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="h-[41px] w-full rounded-[2px] border border-[#dcdcdc] bg-white px-[10px] text-[15px] text-[#212529] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                />
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="state"
                  className="mb-[7px] block text-[16px] font-semibold leading-[19px] text-[#343a40]"
                >
                  State
                </label>

                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="h-[41px] w-full rounded-[2px] border border-[#dcdcdc] bg-white px-[10px] text-[15px] text-[#212529] outline-none transition focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
                />
              </div>

              {/* Logo */}
              <div>
                <label
                  htmlFor="logo"
                  className="mb-[7px] block text-[16px] font-semibold leading-[19px] text-[#343a40]"
                >
                  Logo
                </label>

                <input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={handleChange}
                  className="h-[41px] w-full cursor-pointer rounded-[2px] border border-[#dcdcdc] bg-white text-[14px] text-[#333] file:mr-2 file:h-full file:border-0 file:bg-[#f5f5f5] file:px-[10px] file:text-[14px] file:font-normal file:text-[#333] hover:file:bg-[#eeeeee]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-[31px] flex items-center justify-end gap-[12px] border-t border-[#e5e5e5] pt-[21px]">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-[42px] items-center gap-2 rounded-[4px] border border-[#2759A2] bg-[#2759A2] px-[16px] text-[15px] font-normal text-white transition hover:bg-[#1f4f91] focus:outline-none"
              >
                <RotateCcw size={16} strokeWidth={2} />
                Reset
              </button>

              <button
                type="submit"
                className="inline-flex h-[42px] items-center gap-2 rounded-[4px] border border-[#c92a2a] bg-[#c92a2a] px-[17px] text-[15px] font-normal text-white transition hover:bg-[#b42323] focus:outline-none"
              >
                <Save size={16} strokeWidth={2} />
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
};

VendorModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onVendorAdded: PropTypes.func,
};

export default VendorModal;