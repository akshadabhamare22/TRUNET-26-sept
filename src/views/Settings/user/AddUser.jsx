// import React, {
//   useEffect,
//   useState,
// } from "react";
// import {
//   CheckCircle,
//   Info,
//   X,
// } from "lucide-react";
// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";
// import Select from "react-select";

// import axiosInstance from "../../../axiosInstance";
// const AddUser = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] =
//     useState({
//       fullName: "",
//       username: "",
//       email: "",
//       mobile: "",
//       password: "",
//       confirmPassword: "",
//       role: "",
//       centers: [],
//       status: "",
//     });

//   const [centers, setCenters] =
//     useState([]);

//   const [roles, setRoles] =
//     useState([]);

//   const [errors, setErrors] =
//     useState({});

//   const [alert, setAlert] =
//     useState({
//       type: "",
//       message: "",
//     });

//   const [isEditing, setIsEditing] =
//     useState(false);

//   const [loading, setLoading] =
//     useState(false);

//   const user =
//     JSON.parse(
//       localStorage.getItem("user"),
//     ) || {};

//   const userRole = (
//     user?.role?.roleTitle || ""
//   ).toLowerCase();

//   // --------------------------------------------------
//   // Fetch Centers
//   // --------------------------------------------------
//   const fetchCenters = async () => {
//     try {
//       const res =
//         await axiosInstance.get(
//           "/centers/main-warehouse",
//         );

//       setCenters(
//         res.data.data || [],
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // --------------------------------------------------
//   // Fetch Roles
//   // --------------------------------------------------
//   const fetchRoles = async () => {
//     try {
//       const res =
//         await axiosInstance.get(
//           "/role",
//         );

//       setRoles(
//         res.data.data || [],
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // --------------------------------------------------
//   // Initial Load
//   // --------------------------------------------------
//   useEffect(() => {
//     if (id) {
//       setIsEditing(true);
//       fetchData(id);
//     }

//     fetchRoles();
//     fetchCenters();
//   }, [id]);

//   // --------------------------------------------------
//   // Fetch User Data
//   // --------------------------------------------------
//   const fetchData = async (
//     itemId,
//   ) => {
//     try {
//       setLoading(true);

//       const res =
//         await axiosInstance.get(
//           `/auth/user/${itemId}`,
//         );

//       const userData =
//         res.data.data.user;

//       const accessibleCenters =
//         userData.accessibleCenters ||
//         (userData.center
//           ? [userData.center]
//           : []);

//       const centerIds =
//         accessibleCenters.map(
//           (center) => center._id,
//         );

//       setFormData({
//         fullName:
//           userData.fullName || "",
//         email:
//           userData.email || "",
//         username:
//           userData.username || "",
//         mobile:
//           userData.mobile || "",
//         password: "",
//         confirmPassword: "",
//         role:
//           userData.role?._id || "",
//         centers: centerIds,
//         status:
//           userData.status || "",
//       });
//     } catch (error) {
//       console.log(
//         "error fetching data",
//         error,
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Input Change
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
//   };

//   // --------------------------------------------------
//   // Center Change
//   // --------------------------------------------------
//   const handleCenterChange = (
//     selectedOptions,
//   ) => {
//     const selectedValues =
//       selectedOptions
//         ? selectedOptions.map(
//             (option) =>
//               option.value,
//           )
//         : [];

//     setFormData((prev) => ({
//       ...prev,
//       centers: selectedValues,
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       centers: "",
//     }));
//   };

//   // --------------------------------------------------
//   // Validation
//   // --------------------------------------------------
//   const validateForm = () => {
//     const newErrors = {};

//     const requiredFields = [
//       "fullName",
//       "username",
//       "email",
//       "role",
//       "status",
//     ];

//     requiredFields.forEach(
//       (field) => {
//         if (!formData[field]) {
//           newErrors[field] =
//             "This is a required field";
//         }
//       },
//     );

//     if (
//       !formData.centers ||
//       formData.centers.length === 0
//     ) {
//       newErrors.centers =
//         "At least one center is required";
//     }

//     if (
//       formData.mobile &&
//       !/^[0-9]{10}$/.test(
//         formData.mobile,
//       )
//     ) {
//       newErrors.mobile =
//         "Mobile must be a valid 10-digit number";
//     }

//     if (!isEditing) {
//       if (!formData.password) {
//         newErrors.password =
//           "Password is required for new users";
//       }

//       if (!formData.confirmPassword) {
//         newErrors.confirmPassword =
//           "Please confirm your password";
//       }
//     }

//     if (
//       formData.password &&
//       formData.password !==
//         formData.confirmPassword
//     ) {
//       newErrors.confirmPassword =
//         "Passwords do not match";
//     }

//     if (
//       formData.password &&
//       formData.password.length < 6
//     ) {
//       newErrors.password =
//         "Password must be at least 6 characters long";
//     }

//     return newErrors;
//   };

//   // --------------------------------------------------
//   // Submit
//   // --------------------------------------------------
//   const handleSubmit = async (
//     e,
//   ) => {
//     e.preventDefault();

//     setErrors({});
//     setAlert({
//       type: "",
//       message: "",
//     });

//     const newErrors =
//       validateForm();

//     if (
//       Object.keys(newErrors)
//         .length
//     ) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       const submitData = {
//         fullName:
//           formData.fullName,
//         username:
//           formData.username,
//         email:
//           formData.email,
//         mobile:
//           formData.mobile,
//         role:
//           formData.role,
//         centers:
//           formData.centers,
//         status:
//           formData.status,
//       };

//       if (formData.password) {
//         submitData.password =
//           formData.password;

//         if (!isEditing) {
//           submitData.confirmPassword =
//             formData.confirmPassword;
//         }
//       }

//       if (
//         isEditing &&
//         formData.password
//       ) {
//         submitData.confirmPassword =
//           formData.confirmPassword;
//       }

//       if (isEditing) {
//         await axiosInstance.put(
//           `/auth/user/${id}`,
//           submitData,
//         );

//         setAlert({
//           type: "success",
//           message:
//             "User updated successfully!",
//         });
//       } else {
//         await axiosInstance.post(
//           "/auth/register",
//           submitData,
//         );

//         setAlert({
//           type: "success",
//           message:
//             "User created successfully!",
//         });
//       }

//       setTimeout(() => {
//         navigate("/user-list");
//       }, 1500);
//     } catch (error) {
//       console.error(
//         "Error saving Data:",
//         error,
//       );

//       let message = `Failed to ${
//         isEditing
//           ? "update"
//           : "create"
//       } user. Please try again!`;

//       const validationErrors =
//         {};

//       if (error.response) {
//         const responseData =
//           error.response.data;

//         if (
//           responseData.success ===
//             false &&
//           responseData.errors &&
//           Array.isArray(
//             responseData.errors,
//           )
//         ) {
//           responseData.errors.forEach(
//             (errorMsg) => {
//               const lowerMessage =
//                 errorMsg.toLowerCase();

//               if (
//                 lowerMessage.includes(
//                   "username",
//                 )
//               ) {
//                 validationErrors.username =
//                   errorMsg;
//               } else if (
//                 lowerMessage.includes(
//                   "email",
//                 )
//               ) {
//                 validationErrors.email =
//                   errorMsg;
//               } else if (
//                 lowerMessage.includes(
//                   "password",
//                 )
//               ) {
//                 validationErrors.password =
//                   errorMsg;
//               } else if (
//                 lowerMessage.includes(
//                   "fullname",
//                 )
//               ) {
//                 validationErrors.fullName =
//                   errorMsg;
//               } else if (
//                 lowerMessage.includes(
//                   "center",
//                 )
//               ) {
//                 validationErrors.centers =
//                   errorMsg;
//               } else {
//                 message = errorMsg;
//               }
//             },
//           );

//           if (
//             Object.keys(
//               validationErrors,
//             ).length > 0
//           ) {
//             setErrors(
//               validationErrors,
//             );
//           }
//         }

//         if (
//           Object.keys(
//             validationErrors,
//           ).length === 0
//         ) {
//           message =
//             responseData?.message ||
//             responseData?.error ||
//             message;
//         }
//       } else if (error.request) {
//         message =
//           "No response from server. Please check your connection.";
//       } else {
//         message =
//           error.message;
//       }

//       if (
//         message &&
//         Object.keys(
//           validationErrors,
//         ).length === 0
//       ) {
//         setAlert({
//           type: "danger",
//           message,
//         });
//       }
//     }
//   };

//   // --------------------------------------------------
//   // Reset
//   // --------------------------------------------------
//   const handleReset = () => {
//     setFormData({
//       fullName: "",
//       username: "",
//       email: "",
//       mobile: "",
//       password: "",
//       confirmPassword: "",
//       role: "",
//       centers: [],
//       status: "",
//     });

//     setErrors({});

//     setAlert({
//       type: "",
//       message: "",
//     });
//   };

//   // --------------------------------------------------
//   // Select Options
//   // --------------------------------------------------
//   const centerOptions =
//     centers.map((center) => ({
//       label: `${center.centerName} (${center.centerCode})`,
//       value: center._id,
//     }));

//   const selectedCenters =
//     formData.centers
//       .map((centerId) => {
//         const center =
//           centers.find(
//             (item) =>
//               item._id === centerId,
//           );

//         return center
//           ? {
//               label: `${center.centerName} (${center.centerCode})`,
//               value: center._id,
//             }
//           : null;
//       })
//       .filter(Boolean);

//   const roleOptions = roles.map(
//     (role) => ({
//       label: role.roleTitle,
//       value: role._id,
//     }),
//   );

//   const selectedRole =
//     roleOptions.find(
//       (role) =>
//         role.value === formData.role,
//     ) || null;

//   // --------------------------------------------------
//   // React Select Styles
//   // --------------------------------------------------
//   const customStyles = {
//     control: (
//       base,
//       state,
//     ) => ({
//       ...base,
//       minHeight: "40px",
//       borderColor:
//         errors.centers
//           ? "#dc2626"
//           : state.isFocused
//           ? "#3b82f6"
//           : "#d1d5db",
//       boxShadow:
//         state.isFocused
//           ? "0 0 0 1px #3b82f6"
//           : "none",
//       "&:hover": {
//         borderColor:
//           errors.centers
//             ? "#dc2626"
//             : "#3b82f6",
//       },
//     }),

//     multiValue: (base) => ({
//       ...base,
//       backgroundColor:
//         "#dbeafe",
//       borderRadius: "9999px",
//     }),

//     multiValueLabel: (
//       base,
//     ) => ({
//       ...base,
//       color: "#1d4ed8",
//       padding:
//         "2px 8px",
//     }),

//     multiValueRemove: (
//       base,
//     ) => ({
//       ...base,
//       color: "#1d4ed8",
//       borderRadius:
//         "0 9999px 9999px 0",

//       ":hover": {
//         backgroundColor:
//           "#1d4ed8",
//         color: "#ffffff",
//       },
//     }),
//   };

//   // --------------------------------------------------
//   // Helpers
//   // --------------------------------------------------
//   const fieldClass = (
//     field,
//   ) =>
//     `w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
//       errors[field]
//         ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200"
//         : formData[field]
//         ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-1 focus:ring-green-200"
//         : "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
//     }`;

//   const labelClass = (
//     field,
//   ) =>
//     `mb-1.5 block text-sm font-medium ${
//       errors[field]
//         ? "text-red-600"
//         : formData[field]
//         ? "text-green-600"
//         : "text-gray-700"
//     }`;

//   const ErrorMessage = ({
//     field,
//   }) =>
//     errors[field] ? (
//       <p className="mt-1 text-xs text-red-600">
//         {errors[field]}
//       </p>
//     ) : null;

//   // --------------------------------------------------
//   // UI
//   // --------------------------------------------------
//   return (
//     <div className="w-full">
//       {/* Title */}
//       <div className="mb-4 text-xl font-semibold text-gray-800">
//         {isEditing
//           ? "Edit"
//           : "Add"}{" "}
//         User
//       </div>

//       {/* Card */}
//       <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         <div className="p-5">
//           {/* Loading */}
//           {loading ? (
//             <div className="flex min-h-[300px] items-center justify-center">
//               <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//             </div>
//           ) : (
//             <>
//               {/* Alert */}
//               {alert.message && (
//                 <div
//                   className={`mb-5 flex items-start gap-3 rounded-md border px-4 py-3 text-sm ${
//                     alert.type ===
//                     "success"
//                       ? "border-green-200 bg-green-50 text-green-700"
//                       : "border-red-200 bg-red-50 text-red-700"
//                   }`}
//                 >
//                   {alert.type ===
//                   "success" ? (
//                     <CheckCircle
//                       size={18}
//                       className="mt-0.5 shrink-0"
//                     />
//                   ) : (
//                     <Info
//                       size={18}
//                       className="mt-0.5 shrink-0"
//                     />
//                   )}

//                   <span className="flex-1">
//                     {
//                       alert.message
//                     }
//                   </span>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setAlert({
//                         type: "",
//                         message:
//                           "",
//                       })
//                     }
//                     className="opacity-70 hover:opacity-100"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               )}

//               {/* Edit Note */}
//               {isEditing &&
//                 formData.centers
//                   .length > 0 && (
//                   <div className="mb-5 flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
//                     <Info
//                       size={17}
//                       className="mt-0.5 shrink-0"
//                     />

//                     <p>
//                       <strong>
//                         Note:
//                       </strong>{" "}
//                       First center in
//                       the list will be
//                       set as active
//                       center.
//                     </p>
//                   </div>
//                 )}

//               <form
//                 onSubmit={
//                   handleSubmit
//                 }
//               >
//                 {/* Row 1 */}
//                 <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
//                   {/* Role */}
//                   <div>
//                     <label
//                       htmlFor="role"
//                       className={labelClass(
//                         "role",
//                       )}
//                     >
//                       Role{" "}
//                       <span className="text-red-500">
//                         *
//                       </span>
//                     </label>

//                     <Select
//                       inputId="role"
//                       name="role"
//                       value={
//                         selectedRole
//                       }
//                       onChange={(
//                         selected,
//                       ) =>
//                         handleChange({
//                           target: {
//                             name: "role",
//                             value:
//                               selected
//                                 ? selected.value
//                                 : "",
//                           },
//                         })
//                       }
//                       options={
//                         roleOptions
//                       }
//                       placeholder="Select Role"
//                       classNamePrefix="react-select"
//                       styles={
//                         customStyles
//                       }
//                     />

//                     <ErrorMessage field="role" />
//                   </div>

//                   {/* Centers */}
//                   <div>
//                     <label
//                       htmlFor="centers"
//                       className={labelClass(
//                         "centers",
//                       )}
//                     >
//                       Accessible
//                       Branches{" "}
//                       <span className="text-red-500">
//                         *
//                       </span>
//                     </label>

//                     <Select
//                       inputId="centers"
//                       name="centers"
//                       value={
//                         selectedCenters
//                       }
//                       onChange={
//                         handleCenterChange
//                       }
//                       options={
//                         centerOptions
//                       }
//                       placeholder="Select Branches..."
//                       isMulti
//                       closeMenuOnSelect={
//                         false
//                       }
//                       classNamePrefix="react-select"
//                       styles={
//                         customStyles
//                       }
//                     />

//                     <ErrorMessage field="centers" />
//                   </div>

//                   {/* Full Name */}
//                   <div>
//                     <label
//                       htmlFor="fullName"
//                       className={labelClass(
//                         "fullName",
//                       )}
//                     >
//                       Full Name{" "}
//                       <span className="text-red-500">
//                         *
//                       </span>
//                     </label>

//                     <input
//                       type="text"
//                       id="fullName"
//                       name="fullName"
//                       value={
//                         formData.fullName
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="Full Name"
//                       className={fieldClass(
//                         "fullName",
//                       )}
//                     />

//                     <ErrorMessage field="fullName" />
//                   </div>
//                 </div>

//                 {/* Row 2 */}
//                 <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
//                   {/* Username */}
//                   <div>
//                     <label
//                       htmlFor="username"
//                       className={labelClass(
//                         "username",
//                       )}
//                     >
//                       Username{" "}
//                       <span className="text-red-500">
//                         *
//                       </span>
//                     </label>

//                     <input
//                       type="text"
//                       id="username"
//                       name="username"
//                       value={
//                         formData.username
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="Username"
//                       className={fieldClass(
//                         "username",
//                       )}
//                     />

//                     <ErrorMessage field="username" />
//                   </div>

//                   {/* Email */}
//                   <div>
//                     <label
//                       htmlFor="email"
//                       className={labelClass(
//                         "email",
//                       )}
//                     >
//                       Email{" "}
//                       <span className="text-red-500">
//                         *
//                       </span>
//                     </label>

//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={
//                         formData.email
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="Email"
//                       className={fieldClass(
//                         "email",
//                       )}
//                     />

//                     <ErrorMessage field="email" />
//                   </div>

//                   {/* Mobile */}
//                   <div>
//                     <label
//                       htmlFor="mobile"
//                       className="mb-1.5 block text-sm font-medium text-gray-700"
//                     >
//                       Mobile
//                     </label>

//                     <input
//                       type="tel"
//                       id="mobile"
//                       name="mobile"
//                       value={
//                         formData.mobile
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="10 Digit Mobile No."
//                       maxLength={10}
//                       className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
//                         errors.mobile
//                           ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-200"
//                           : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
//                       }`}
//                     />

//                     <ErrorMessage field="mobile" />
//                   </div>
//                 </div>

//                 {/* Row 3 */}
//                 <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
//                   {/* Status */}
//                   <div>
//                     <label
//                       htmlFor="status"
//                       className={labelClass(
//                         "status",
//                       )}
//                     >
//                       Status{" "}
//                       <span className="text-red-500">
//                         *
//                       </span>
//                     </label>

//                     <select
//                       id="status"
//                       name="status"
//                       value={
//                         formData.status
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       className={fieldClass(
//                         "status",
//                       )}
//                     >
//                       <option value="">
//                         SELECT
//                       </option>
//                       <option value="Enable">
//                         Enable
//                       </option>
//                       <option value="Disable">
//                         Disable
//                       </option>
//                     </select>

//                     <ErrorMessage field="status" />
//                   </div>

//                   {/* Center Order */}
//                   <div>
//                     {formData.centers
//                       .length >
//                       0 && (
//                       <div className="mt-1 rounded-md border border-gray-200 bg-gray-50 p-3">
//                         <p className="mb-2 text-xs font-semibold text-gray-600">
//                           Centers:
//                         </p>

//                         <div className="space-y-2">
//                           {formData.centers.map(
//                             (
//                               centerId,
//                               index,
//                             ) => {
//                               const center =
//                                 centers.find(
//                                   (
//                                     item,
//                                   ) =>
//                                     item._id ===
//                                     centerId,
//                                 );

//                               if (
//                                 !center
//                               ) {
//                                 return null;
//                               }

//                               return (
//                                 <div
//                                   key={
//                                     centerId
//                                   }
//                                   className="flex items-center gap-2 text-xs"
//                                 >
//                                   <span
//                                     className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
//                                       index ===
//                                       0
//                                         ? "bg-blue-600 text-white"
//                                         : "bg-gray-200 text-gray-700"
//                                     }`}
//                                   >
//                                     {index +
//                                       1}
//                                   </span>

//                                   <span className="text-gray-700">
//                                     {
//                                       center.centerName
//                                     }{" "}
//                                     (
//                                     {
//                                       center.centerCode
//                                     }
//                                     )
//                                   </span>

//                                   {index ===
//                                     0 && (
//                                     <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
//                                       Active
//                                     </span>
//                                   )}
//                                 </div>
//                               );
//                             },
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div />
//                 </div>

//                 {/* Password */}
//                 <div className="mt-7">
//                   <h4 className="mb-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-800">
//                     Password
//                   </h4>

//                   <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
//                     {/* Password */}
//                     <div>
//                       <label
//                         htmlFor="password"
//                         className={labelClass(
//                           "password",
//                         )}
//                       >
//                         Password{" "}
//                         {!isEditing && (
//                           <span className="text-red-500">
//                             *
//                           </span>
//                         )}
//                       </label>

//                       <input
//                         type="password"
//                         id="password"
//                         name="password"
//                         value={
//                           formData.password
//                         }
//                         onChange={
//                           handleChange
//                         }
//                         placeholder={
//                           isEditing
//                             ? "Enter new password (optional)"
//                             : "Password"
//                         }
//                         className={fieldClass(
//                           "password",
//                         )}
//                       />

//                       <ErrorMessage field="password" />
//                     </div>

//                     {/* Confirm Password */}
//                     <div>
//                       <label
//                         htmlFor="confirmPassword"
//                         className={labelClass(
//                           "confirmPassword",
//                         )}
//                       >
//                         Confirm
//                         Password{" "}
//                         {!isEditing && (
//                           <span className="text-red-500">
//                             *
//                           </span>
//                         )}
//                       </label>

//                       <input
//                         type="password"
//                         id="confirmPassword"
//                         name="confirmPassword"
//                         value={
//                           formData.confirmPassword
//                         }
//                         onChange={
//                           handleChange
//                         }
//                         placeholder={
//                           isEditing
//                             ? "Confirm new password"
//                             : "Confirm Password"
//                         }
//                         className={fieldClass(
//                           "confirmPassword",
//                         )}
//                       />

//                       <ErrorMessage field="confirmPassword" />
//                     </div>

//                     <div />
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
//                   <button
//                     type="button"
//                     onClick={
//                       handleReset
//                     }
//                     className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//                   >
//                     Reset
//                   </button>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     {loading
//                       ? "Processing..."
//                       : isEditing
//                       ? "Update"
//                       : "Create"}{" "}
//                     User
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddUser;


import React, {
  useEffect,
  useState,
} from "react";
import {
  CheckCircle,
  Info,
  X,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import Select from "react-select";

import axiosInstance from "../../../axiosInstance";
const AddUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] =
    useState({
      fullName: "",
      username: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      role: "",
      centers: [],
      status: "",
    });

  const [centers, setCenters] =
    useState([]);

  const [roles, setRoles] =
    useState([]);

  const [errors, setErrors] =
    useState({});

  const [alert, setAlert] =
    useState({
      type: "",
      message: "",
    });

  const [isEditing, setIsEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const user =
    JSON.parse(
      localStorage.getItem("user"),
    ) || {};

  const userRole = (
    user?.role?.roleTitle || ""
  ).toLowerCase();

  // --------------------------------------------------
  // Fetch Centers
  // --------------------------------------------------
  const fetchCenters = async () => {
    try {
      const res =
        await axiosInstance.get(
          "/centers/main-warehouse",
        );

      setCenters(
        res.data.data || [],
      );
    } catch (error) {
      console.log(error);
    }
  };

  // --------------------------------------------------
  // Fetch Roles
  // --------------------------------------------------
  const fetchRoles = async () => {
    try {
      const res =
        await axiosInstance.get(
          "/role",
        );

      setRoles(
        res.data.data || [],
      );
    } catch (error) {
      console.log(error);
    }
  };

  // --------------------------------------------------
  // Initial Load
  // --------------------------------------------------
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchData(id);
    }

    fetchRoles();
    fetchCenters();
  }, [id]);

  // --------------------------------------------------
  // Fetch User Data
  // --------------------------------------------------
  const fetchData = async (
    itemId,
  ) => {
    try {
      setLoading(true);

      const res =
        await axiosInstance.get(
          `/auth/user/${itemId}`,
        );

      const userData =
        res.data.data.user;

      const accessibleCenters =
        userData.accessibleCenters ||
        (userData.center
          ? [userData.center]
          : []);

      const centerIds =
        accessibleCenters.map(
          (center) => center._id,
        );

      setFormData({
        fullName:
          userData.fullName || "",
        email:
          userData.email || "",
        username:
          userData.username || "",
        mobile:
          userData.mobile || "",
        password: "",
        confirmPassword: "",
        role:
          userData.role?._id || "",
        centers: centerIds,
        status:
          userData.status || "",
      });
    } catch (error) {
      console.log(
        "error fetching data",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Input Change
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
  };

  // --------------------------------------------------
  // Center Change
  // --------------------------------------------------
  const handleCenterChange = (
    selectedOptions,
  ) => {
    const selectedValues =
      selectedOptions
        ? selectedOptions.map(
            (option) =>
              option.value,
          )
        : [];

    setFormData((prev) => ({
      ...prev,
      centers: selectedValues,
    }));

    setErrors((prev) => ({
      ...prev,
      centers: "",
    }));
  };

  // --------------------------------------------------
  // Validation
  // --------------------------------------------------
  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      "fullName",
      "username",
      "email",
      "role",
      "status",
    ];

    requiredFields.forEach(
      (field) => {
        if (!formData[field]) {
          newErrors[field] =
            "This is a required field";
        }
      },
    );

    if (
      !formData.centers ||
      formData.centers.length === 0
    ) {
      newErrors.centers =
        "At least one center is required";
    }

    if (
      formData.mobile &&
      !/^[0-9]{10}$/.test(
        formData.mobile,
      )
    ) {
      newErrors.mobile =
        "Mobile must be a valid 10-digit number";
    }

    if (!isEditing) {
      if (!formData.password) {
        newErrors.password =
          "Password is required for new users";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword =
          "Please confirm your password";
      }
    }

    if (
      formData.password &&
      formData.password !==
        formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    if (
      formData.password &&
      formData.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters long";
    }

    return newErrors;
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async (
    e,
  ) => {
    e.preventDefault();

    setErrors({});
    setAlert({
      type: "",
      message: "",
    });

    const newErrors =
      validateForm();

    if (
      Object.keys(newErrors)
        .length
    ) {
      setErrors(newErrors);
      return;
    }

    try {
      const submitData = {
        fullName:
          formData.fullName,
        username:
          formData.username,
        email:
          formData.email,
        mobile:
          formData.mobile,
        role:
          formData.role,
        centers:
          formData.centers,
        status:
          formData.status,
      };

      if (formData.password) {
        submitData.password =
          formData.password;

        if (!isEditing) {
          submitData.confirmPassword =
            formData.confirmPassword;
        }
      }

      if (
        isEditing &&
        formData.password
      ) {
        submitData.confirmPassword =
          formData.confirmPassword;
      }

      if (isEditing) {
        await axiosInstance.put(  
          `/auth/user/${id}`,
          submitData,
        );

        setAlert({
          type: "success",
          message:
            "User updated successfully!",
        });
      } else {
        await axiosInstance.post(
          "/auth/register",
          submitData,
        );

        setAlert({
          type: "success",
          message:
            "User created successfully!",
        });
      }

      setTimeout(() => {
        navigate("/user-list");
      }, 1500);
    } catch (error) {
      console.error(
        "Error saving Data:",
        error,
      );

      let message = `Failed to ${
        isEditing
          ? "update"
          : "create"
      } user. Please try again!`;

      const validationErrors =
        {};

      if (error.response) {
        const responseData =
          error.response.data;

        if (
          responseData.success ===
            false &&
          responseData.errors &&
          Array.isArray(
            responseData.errors,
          )
        ) {
          responseData.errors.forEach(
            (errorMsg) => {
              const lowerMessage =
                errorMsg.toLowerCase();

              if (
                lowerMessage.includes(
                  "username",
                )
              ) {
                validationErrors.username =
                  errorMsg;
              } else if (
                lowerMessage.includes(
                  "email",
                )
              ) {
                validationErrors.email =
                  errorMsg;
              } else if (
                lowerMessage.includes(
                  "password",
                )
              ) {
                validationErrors.password =
                  errorMsg;
              } else if (
                lowerMessage.includes(
                  "fullname",
                )
              ) {
                validationErrors.fullName =
                  errorMsg;
              } else if (
                lowerMessage.includes(
                  "center",
                )
              ) {
                validationErrors.centers =
                  errorMsg;
              } else {
                message = errorMsg;
              }
            },
          );

          if (
            Object.keys(
              validationErrors,
            ).length > 0
          ) {
            setErrors(
              validationErrors,
            );
          }
        }

        if (
          Object.keys(
            validationErrors,
          ).length === 0
        ) {
          message =
            responseData?.message ||
            responseData?.error ||
            message;
        }
      } else if (error.request) {
        message =
          "No response from server. Please check your connection.";
      } else {
        message =
          error.message;
      }

      if (
        message &&
        Object.keys(
          validationErrors,
        ).length === 0
      ) {
        setAlert({
          type: "danger",
          message,
        });
      }
    }
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  const handleReset = () => {
    setFormData({
      fullName: "",
      username: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      role: "",
      centers: [],
      status: "",
    });

    setErrors({});

    setAlert({
      type: "",
      message: "",
    });
  };

  // --------------------------------------------------
  // Select Options
  // --------------------------------------------------
  const centerOptions =
    centers.map((center) => ({
      label: `${center.centerName} (${center.centerCode})`,
      value: center._id,
    }));

  const selectedCenters =
    formData.centers
      .map((centerId) => {
        const center =
          centers.find(
            (item) =>
              item._id === centerId,
          );

        return center
          ? {
              label: `${center.centerName} (${center.centerCode})`,
              value: center._id,
            }
          : null;
      })
      .filter(Boolean);

  const roleOptions = roles.map(
    (role) => ({
      label: role.roleTitle,
      value: role._id,
    }),
  );

  const selectedRole =
    roleOptions.find(
      (role) =>
        role.value === formData.role,
    ) || null;

  // --------------------------------------------------
  // React Select Styles
  // --------------------------------------------------
  const customStyles = {
    control: (
      base,
      state,
    ) => ({
      ...base,
      minHeight: "40px",
      borderColor:
        errors.centers
          ? "#dc2626"
          : state.isFocused
          ? "#3b82f6"
          : "#d1d5db",
      boxShadow:
        state.isFocused
          ? "0 0 0 1px #3b82f6"
          : "none",
      "&:hover": {
        borderColor:
          errors.centers
            ? "#dc2626"
            : "#3b82f6",
      },
    }),

    multiValue: (base) => ({
      ...base,
      backgroundColor:
        "#dbeafe",
      borderRadius: "9999px",
    }),

    multiValueLabel: (
      base,
    ) => ({
      ...base,
      color: "#1d4ed8",
      padding:
        "2px 8px",
    }),

    multiValueRemove: (
      base,
    ) => ({
      ...base,
      color: "#1d4ed8",
      borderRadius:
        "0 9999px 9999px 0",

      ":hover": {
        backgroundColor:
          "#1d4ed8",
        color: "#ffffff",
      },
    }),
  };

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  const fieldClass = (
    field,
  ) =>
    `w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
      errors[field]
        ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200"
        : formData[field]
        ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-1 focus:ring-green-200"
        : "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
    }`;

  const labelClass = (
    field,
  ) =>
    `mb-1.5 block text-sm font-medium ${
      errors[field]
        ? "text-red-600"
        : formData[field]
        ? "text-green-600"
        : "text-gray-700"
    }`;

  const ErrorMessage = ({
    field,
  }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-600">
        {errors[field]}
      </p>
    ) : null;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* Page Title */}
      <div className="mb-[18px]">
        <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
          {isEditing ? "Edit" : "Add"} User
        </h1>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden border border-[#e1e5e9] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        {/* Blue Top Border */}
        <div className="h-[4px] w-full bg-[#2f64ad]" />

        <div className="px-[21px] pb-[21px] pt-[20px]">
          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#2f64ad]" />
            </div>
          ) : (
            <>
              {/* Alert */}
              {alert.message && (
                <div
                  className={`mb-5 flex items-start gap-3 border px-4 py-3 text-sm ${
                    alert.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {alert.type === "success" ? (
                    <CheckCircle
                      size={18}
                      className="mt-0.5 shrink-0"
                    />
                  ) : (
                    <Info
                      size={18}
                      className="mt-0.5 shrink-0"
                    />
                  )}

                  <span className="flex-1">
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
                    className="opacity-60 transition hover:opacity-100"
                    aria-label="Close alert"
                  >
                    <X size={17} />
                  </button>
                </div>
              )}

              {/* Edit Note */}
              {isEditing &&
                formData.centers.length > 0 && (
                  <div className="mb-5 flex items-start gap-2 border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                    <Info
                      size={17}
                      className="mt-0.5 shrink-0"
                    />

                    <p className="m-0">
                      <strong>Note:</strong>{" "}
                      First center in the list will be
                      set as active center.
                    </p>
                  </div>
                )}

              <form onSubmit={handleSubmit}>
                {/* Row 1 */}
                <div className="grid grid-cols-1 gap-x-[21px] gap-y-[20px] lg:grid-cols-3">
                  {/* Role */}
                  <div>
                    <label
                      htmlFor="role"
                      className="mb-[7px] block text-[16px] font-semibold text-[#172033]"
                    >
                      Role{" "}
                      <span className="text-[#c62828]">
                        *
                      </span>
                    </label>

                    <Select
                      inputId="role"
                      name="role"
                      value={selectedRole}
                      onChange={(selected) =>
                        handleChange({
                          target: {
                            name: "role",
                            value: selected
                              ? selected.value
                              : "",
                          },
                        })
                      }
                      options={roleOptions}
                      placeholder="Select Role"
                      classNamePrefix="react-select"
                      styles={{
                        ...customStyles,
                        control: (
                          base,
                          state,
                        ) => ({
                          ...base,
                          minHeight: "40px",
                          height: "40px",
                          borderRadius: "0px",
                          borderColor:
                            errors.role
                              ? "#dc2626"
                              : state.isFocused
                              ? "#2f64ad"
                              : "#d9d9d9",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor:
                              errors.role
                                ? "#dc2626"
                                : "#2f64ad",
                          },
                        }),
                      }}
                    />

                    <ErrorMessage field="role" />
                  </div>

                  {/* Accessible Branches */}
                  <div>
                    <label
                      htmlFor="centers"
                      className="mb-[7px] block text-[16px] font-semibold text-[#172033]"
                    >
                      Accessible Branches{" "}
                      <span className="text-[#c62828]">
                        *
                      </span>
                    </label>

                    <Select
                      inputId="centers"
                      name="centers"
                      value={selectedCenters}
                      onChange={handleCenterChange}
                      options={centerOptions}
                      placeholder="Select Branches..."
                      isMulti
                      closeMenuOnSelect={false}
                      classNamePrefix="react-select"
                      styles={{
                        ...customStyles,
                        control: (
                          base,
                          state,
                        ) => ({
                          ...base,
                          minHeight: "40px",
                          borderRadius: "0px",
                          borderColor:
                            errors.centers
                              ? "#dc2626"
                              : state.isFocused
                              ? "#2f64ad"
                              : "#d9d9d9",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor:
                              errors.centers
                                ? "#dc2626"
                                : "#2f64ad",
                          },
                        }),
                      }}
                    />

                    <ErrorMessage field="centers" />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-[7px] block text-[16px] font-semibold text-[#172033]"
                    >
                      Full Name{" "}
                      <span className="text-[#c62828]">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className={`
                        h-[40px]
                        w-full
                        rounded-none
                        border
                        px-[11px]
                        text-[15px]
                        text-[#212529]
                        outline-none
                        transition
                        ${
                          errors.fullName
                            ? "border-red-500 bg-red-50 focus:border-red-500"
                            : "border-[#d9d9d9] bg-white focus:border-[#2f64ad]"
                        }
                      `}
                    />

                    <ErrorMessage field="fullName" />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="mt-[20px] grid grid-cols-1 gap-x-[21px] gap-y-[20px] lg:grid-cols-3">
                  {/* Username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="mb-[7px] block text-[16px] font-semibold text-[#172033]"
                    >
                      Username{" "}
                      <span className="text-[#c62828]">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      className={`
                        h-[40px]
                        w-full
                        rounded-none
                        border
                        px-[11px]
                        text-[15px]
                        text-[#212529]
                        outline-none
                        transition
                        ${
                          errors.username
                            ? "border-red-500 bg-red-50 focus:border-red-500"
                            : "border-[#d9d9d9] bg-white focus:border-[#2f64ad]"
                        }
                      `}
                    />

                    <ErrorMessage field="username" />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-[7px] block text-[16px] font-semibold text-[#172033]"
                    >
                      Email{" "}
                      <span className="text-[#c62828]">
                        *
                      </span>
                    </label>

                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className={`
                        h-[40px]
                        w-full
                        rounded-none
                        border
                        px-[11px]
                        text-[15px]
                        text-[#212529]
                        outline-none
                        transition
                        ${
                          errors.email
                            ? "border-red-500 bg-red-50 focus:border-red-500"
                            : "border-[#d9d9d9] bg-white focus:border-[#2f64ad]"
                        }
                      `}
                    />

                    <ErrorMessage field="email" />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label
                      htmlFor="mobile"
                      className="mb-[7px] block text-[16px] font-semibold text-[#172033]"
                    >
                      Mobile
                    </label>

                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="10 Digit Mobile No."
                      maxLength={10}
                      className={`
                        h-[40px]
                        w-full
                        rounded-none
                        border
                        px-[11px]
                        text-[15px]
                        text-[#212529]
                        outline-none
                        transition
                        ${
                          errors.mobile
                            ? "border-red-500 bg-red-50 focus:border-red-500"
                            : "border-[#d9d9d9] bg-white focus:border-[#2f64ad]"
                        }
                      `}
                    />

                    <ErrorMessage field="mobile" />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="mt-[20px] grid grid-cols-1 gap-x-[21px] gap-y-[20px] lg:grid-cols-3">
                  {/* Status */}
                  <div>
                    <label
                      htmlFor="status"
                      className="mb-[7px] block text-[16px] font-semibold text-[#172033]"
                    >
                      Status{" "}
                      <span className="text-[#c62828]">
                        *
                      </span>
                    </label>

                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={`
                        h-[40px]
                        w-full
                        rounded-none
                        border
                        bg-white
                        px-[11px]
                        text-[15px]
                        text-[#212529]
                        outline-none
                        transition
                        ${
                          errors.status
                            ? "border-red-500 bg-red-50 focus:border-red-500"
                            : "border-[#d9d9d9] focus:border-[#2f64ad]"
                        }
                      `}
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

                    <ErrorMessage field="status" />
                  </div>

                  {/* Center Order */}
                  <div>
                    {formData.centers.length > 0 && (
                      <div className="border border-[#e1e5e9] bg-[#f8f9fa] p-[11px]">
                        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
                          Centers
                        </p>

                        <div className="max-h-[96px] space-y-[6px] overflow-y-auto">
                          {formData.centers.map(
                            (
                              centerId,
                              index,
                            ) => {
                              const center =
                                centers.find(
                                  (item) =>
                                    item._id ===
                                    centerId,
                                );

                              if (!center) {
                                return null;
                              }

                              return (
                                <div
                                  key={centerId}
                                  className="flex items-center gap-2 text-[12px]"
                                >
                                  <span
                                    className={`flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                                      index === 0
                                        ? "bg-[#2f64ad] text-white"
                                        : "bg-[#e5e7eb] text-[#374151]"
                                    }`}
                                  >
                                    {index + 1}
                                  </span>

                                  <span className="truncate text-[#374151]">
                                    {center.centerName}{" "}
                                    ({center.centerCode})
                                  </span>

                                  {index === 0 && (
                                    <span className="shrink-0 rounded-full bg-[#e5effc] px-2 py-0.5 text-[10px] font-semibold text-[#2f64ad]">
                                      Active
                                    </span>
                                  )}
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div />
                </div>

                {/* Password Section */}
                <div className="mt-[27px]">
                  <div className="mb-[19px] flex items-center gap-3">
                    <h4 className="m-0 whitespace-nowrap text-[17px] font-semibold text-[#172033]">
                      Password
                    </h4>

                    <div className="h-px flex-1 bg-[#e1e5e9]" />
                  </div>

                  <div className="grid grid-cols-1 gap-x-[21px] gap-y-[20px] lg:grid-cols-3">
                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-[7px] block text-[16px] font-semibold text-[#172033]"
                      >
                        Password{" "}
                        {!isEditing && (
                          <span className="text-[#c62828]">
                            *
                          </span>
                        )}
                      </label>

                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={
                          isEditing
                            ? "Enter new password (optional)"
                            : "Password"
                        }
                        className={`
                          h-[40px]
                          w-full
                          rounded-none
                          border
                          px-[11px]
                          text-[15px]
                          text-[#212529]
                          outline-none
                          transition
                          ${
                            errors.password
                              ? "border-red-500 bg-red-50 focus:border-red-500"
                              : "border-[#d9d9d9] bg-white focus:border-[#2f64ad]"
                          }
                        `}
                      />

                      <ErrorMessage field="password" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-[7px] block text-[16px] font-semibold text-[#172033]"
                      >
                        Confirm Password{" "}
                        {!isEditing && (
                          <span className="text-[#c62828]">
                            *
                          </span>
                        )}
                      </label>

                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={
                          formData.confirmPassword
                        }
                        onChange={handleChange}
                        placeholder={
                          isEditing
                            ? "Confirm new password"
                            : "Confirm Password"
                        }
                        className={`
                          h-[40px]
                          w-full
                          rounded-none
                          border
                          px-[11px]
                          text-[15px]
                          text-[#212529]
                          outline-none
                          transition
                          ${
                            errors.confirmPassword
                              ? "border-red-500 bg-red-50 focus:border-red-500"
                              : "border-[#d9d9d9] bg-white focus:border-[#2f64ad]"
                          }
                        `}
                      />

                      <ErrorMessage field="confirmPassword" />
                    </div>

                    <div />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-[30px] flex flex-col-reverse gap-3 border-t border-[#e1e5e9] pt-[20px] sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="
                      h-[42px]
                      rounded-[4px]
                      border
                      border-[#2f64ad]
                      bg-[#2f64ad]
                      px-[18px]
                      text-[15px]
                      font-medium
                      text-white
                      transition
                      hover:bg-[#245494]
                      focus:outline-none
                    "
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      h-[42px]
                      rounded-[4px]
                      bg-[#b52b27]
                      px-[20px]
                      text-[15px]
                      font-medium
                      text-white
                      transition
                      hover:bg-[#9f2522]
                      focus:outline-none
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {loading
                      ? "Processing..."
                      : isEditing
                      ? "Update"
                      : "Create"}{" "}
                    User
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


export default AddUser;