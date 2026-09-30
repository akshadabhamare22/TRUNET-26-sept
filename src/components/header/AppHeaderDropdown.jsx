// import React, { useEffect, useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import {
//   ChevronDown,
//   KeyRound,
//   LogOut,
//   X,
//   Building2,
//   Loader2,
// } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'

// import avatar10 from './../../assets/images/avatars/10.png'
// import axiosInstance from '../../axiosInstance'

// const AppHeaderDropdown = () => {
//   const { t } = useTranslation()
//   const navigate = useNavigate()

//   const [user, setUser] = useState(null)
//   const [center, setCenter] = useState(null)
//   const [accessibleCenters, setAccessibleCenters] = useState([])

//   const [showDropdown, setShowDropdown] = useState(false)
//   const [showChangePasswordModal, setShowChangePasswordModal] =
//     useState(false)

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmNewPassword: '',
//   })

//   const [loading, setLoading] = useState(false)
//   const [alert, setAlert] = useState({
//     type: '',
//     message: '',
//   })

//   const [errors, setErrors] = useState({})

//   // Load user and center information
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user')
//     const storedCenter = localStorage.getItem('userCenter')

//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser)

//         setUser(parsedUser)

//         if (
//           parsedUser.accessibleCenters &&
//           Array.isArray(parsedUser.accessibleCenters)
//         ) {
//           setAccessibleCenters(
//             parsedUser.accessibleCenters,
//           )
//         }
//       } catch (error) {
//         console.error('Error parsing stored user:', error)
//       }
//     }

//     if (storedCenter) {
//       try {
//         setCenter(JSON.parse(storedCenter))
//       } catch (error) {
//         console.error('Error parsing stored center:', error)
//       }
//     }
//   }, [])

//   // Reset password form whenever modal opens
//   useEffect(() => {
//     if (showChangePasswordModal) {
//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmNewPassword: '',
//       })

//       setAlert({
//         type: '',
//         message: '',
//       })

//       setErrors({})
//     }
//   }, [showChangePasswordModal])

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest('[data-user-dropdown]')) {
//         setShowDropdown(false)
//       }
//     }

//     if (showDropdown) {
//       document.addEventListener(
//         'mousedown',
//         handleClickOutside,
//       )
//     }

//     return () => {
//       document.removeEventListener(
//         'mousedown',
//         handleClickOutside,
//       )
//     }
//   }, [showDropdown])

//   // Sign out
//   const handleSignOut = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     localStorage.removeItem('userCenter')

//     navigate('/login')
//   }

//   // Open change password modal
//   const handleChangePasswordClick = () => {
//     setShowDropdown(false)
//     setShowChangePasswordModal(true)
//   }

//   // Switch center
//   const handleSwitchCenterClick = () => {
//     setShowDropdown(false)
//     navigate('/select-center')
//   }

//   // Password field change
//   const handlePasswordChange = (field, value) => {
//     setPasswordData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))

//     if (value.trim()) {
//       setErrors((prev) => ({
//         ...prev,
//         [field]: '',
//       }))
//     }
//   }

//   // Validate password form
//   const validateForm = () => {
//     const newErrors = {}

//     if (!passwordData.currentPassword.trim()) {
//       newErrors.currentPassword =
//         'This is a required field'
//     }

//     if (!passwordData.newPassword.trim()) {
//       newErrors.newPassword =
//         'This is a required field'
//     }

//     if (!passwordData.confirmNewPassword.trim()) {
//       newErrors.confirmNewPassword =
//         'This is a required field'
//     }

//     if (
//       passwordData.newPassword &&
//       passwordData.newPassword.length < 6
//     ) {
//       newErrors.newPassword =
//         'Password must be at least 6 characters long'
//     }

//     if (
//       passwordData.newPassword !==
//       passwordData.confirmNewPassword
//     ) {
//       newErrors.confirmNewPassword =
//         'Passwords do not match'
//     }

//     setErrors(newErrors)

//     return Object.keys(newErrors).length === 0
//   }

//   // Change password
//   const handleChangePassword = async () => {
//     if (!validateForm()) return

//     setLoading(true)

//     setAlert({
//       type: '',
//       message: '',
//     })

//     try {
//       const response = await axiosInstance.put(
//         '/auth/update-password',
//         {
//           currentPassword:
//             passwordData.currentPassword,

//           newPassword:
//             passwordData.newPassword,

//           confirmNewPassword:
//             passwordData.confirmNewPassword,
//         },
//       )

//       if (response.data.success) {
//         setAlert({
//           type: 'success',
//           message:
//             'Password changed successfully!',
//         })

//         setTimeout(() => {
//           setShowChangePasswordModal(false)

//           setPasswordData({
//             currentPassword: '',
//             newPassword: '',
//             confirmNewPassword: '',
//           })
//         }, 1500)
//       } else {
//         setAlert({
//           type: 'danger',
//           message:
//             response.data.message ||
//             'Failed to change password',
//         })
//       }
//     } catch (error) {
//       console.error(
//         'Error changing password:',
//         error,
//       )

//       if (error.response?.data?.errors) {
//         const backendErrors = {}

//         error.response.data.errors.forEach((err) => {
//           backendErrors[err.path] = err.msg
//         })

//         setErrors(backendErrors)
//       } else {
//         const msg =
//           error.response?.data?.message ||
//           error.message ||
//           'An error occurred while changing password'

//         setAlert({
//           type: 'danger',
//           message: msg,
//         })
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Close password modal
//   const closeModal = () => {
//     setShowChangePasswordModal(false)

//     setPasswordData({
//       currentPassword: '',
//       newPassword: '',
//       confirmNewPassword: '',
//     })

//     setAlert({
//       type: '',
//       message: '',
//     })

//     setErrors({})
//   }

//   const getInputClass = (field) => {
//     if (errors[field]) {
//       return 'border-red-500 focus:border-red-500 focus:ring-red-200'
//     }

//     if (passwordData[field]) {
//       return 'border-green-500 focus:border-green-500 focus:ring-green-200'
//     }

//     return 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
//   }

//   return (
//     <>
//       {/* User Dropdown */}
//       <div
//         data-user-dropdown
//         className="relative"
//       >
//         <button
//           type="button"
//           onClick={() =>
//             setShowDropdown((prev) => !prev)
//           }
//           className="flex h-10 items-center gap-2 rounded-md px-2 text-white transition hover:bg-white/10"
//           aria-expanded={showDropdown}
//         >
//           <img
//             src={avatar10}
//             alt="Profile"
//             className="h-8 w-8 rounded-full border-2 border-white/30 object-cover"
//           />

//           <span className="hidden text-sm font-normal sm:inline">
//             {user?.fullName || 'User Name'}
//           </span>

//           <ChevronDown
//             size={16}
//             className={`transition-transform duration-200 ${
//               showDropdown
//                 ? 'rotate-180'
//                 : ''
//             }`}
//           />
//         </button>

//         {showDropdown && (
//           <div className="absolute right-0 top-full z-[1000] mt-2 w-[300px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl">
//             {/* Profile Header */}
//             <div className="bg-[#2759a2] px-4 py-4 text-center text-white">
//               <div className="mx-auto mb-2 h-[84px] w-[84px] overflow-hidden rounded-full border-[3px] border-white/20">
//                 <img
//                   src={avatar10}
//                   alt="Profile"
//                   className="h-full w-full rounded-full border-2 border-[#2759a2] object-cover"
//                 />
//               </div>

//               <p className="m-0 text-xs font-light text-white/80">
//                 {user?.email ||
//                   'user@example.com'}
//               </p>

//               <p className="mt-2 text-[15px] text-white/90">
//                 {user?.role
//                   ? `${user.role.roleTitle} - ${
//                       center?.centerName ||
//                       'Unknown'
//                     }`
//                   : 'Role - Unknown'}
//               </p>

//               {accessibleCenters.length > 1 && (
//                 <div className="mt-2">
//                   <small className="text-white/70">
//                     Access to{' '}
//                     {accessibleCenters.length}{' '}
//                     centers
//                   </small>
//                 </div>
//               )}
//             </div>

//             {/* Actions */}
//             <div className="m-1 flex flex-wrap justify-between gap-1 bg-white p-1">
//               <button
//                 type="button"
//                 onClick={
//                   handleChangePasswordClick
//                 }
//                 className="flex items-center gap-1 border border-gray-300 px-2 py-1.5 text-xs text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
//               >
//                 <KeyRound size={13} />
//                 Change Password
//               </button>

//               {accessibleCenters.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={
//                     handleSwitchCenterClick
//                   }
//                   className="flex items-center gap-1 border border-gray-300 px-2 py-1.5 text-xs text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
//                 >
//                   <Building2 size={13} />
//                   Switch Center
//                 </button>
//               )}

//               <button
//                 type="button"
//                 onClick={handleSignOut}
//                 className="flex items-center gap-1 border border-gray-300 px-2 py-1.5 text-xs text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
//               >
//                 <LogOut size={13} />
//                 Sign Out
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Change Password Modal */}
//       {showChangePasswordModal && (
//         <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4">
//           <div className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//               <h2 className="m-0 text-lg font-semibold text-gray-800">
//                 Change Password
//               </h2>

//               <button
//                 type="button"
//                 onClick={closeModal}
//                 className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
//                 aria-label="Close"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="px-6 py-5">
//               {/* Alert */}
//               {alert.message && (
//                 <div
//                   className={`mb-5 flex items-start justify-between rounded-md border px-4 py-3 text-sm ${
//                     alert.type === 'success'
//                       ? 'border-green-200 bg-green-50 text-green-700'
//                       : 'border-red-200 bg-red-50 text-red-700'
//                   }`}
//                 >
//                   <span>{alert.message}</span>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setAlert({
//                         type: '',
//                         message: '',
//                       })
//                     }
//                     className="ml-3 opacity-70 hover:opacity-100"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               )}

//               {/* Current Password */}
//               <div className="mb-5">
//                 <label
//                   htmlFor="currentPassword"
//                   className={`mb-2 block text-sm font-medium ${
//                     errors.currentPassword
//                       ? 'text-red-600'
//                       : passwordData.currentPassword
//                         ? 'text-green-600'
//                         : 'text-gray-700'
//                   }`}
//                 >
//                   Current Password{' '}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   id="currentPassword"
//                   type="password"
//                   placeholder="Current Password"
//                   value={
//                     passwordData.currentPassword
//                   }
//                   onChange={(e) =>
//                     handlePasswordChange(
//                       'currentPassword',
//                       e.target.value,
//                     )
//                   }
//                   disabled={loading}
//                   className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-2 ${getInputClass(
//                     'currentPassword',
//                   )}`}
//                 />

//                 {errors.currentPassword && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.currentPassword}
//                   </p>
//                 )}
//               </div>

//               {/* New Password */}
//               <div className="mb-5">
//                 <label
//                   htmlFor="newPassword"
//                   className={`mb-2 block text-sm font-medium ${
//                     errors.newPassword
//                       ? 'text-red-600'
//                       : passwordData.newPassword
//                         ? 'text-green-600'
//                         : 'text-gray-700'
//                   }`}
//                 >
//                   New Password{' '}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   id="newPassword"
//                   type="password"
//                   placeholder="New Password"
//                   value={
//                     passwordData.newPassword
//                   }
//                   onChange={(e) =>
//                     handlePasswordChange(
//                       'newPassword',
//                       e.target.value,
//                     )
//                   }
//                   disabled={loading}
//                   className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-2 ${getInputClass(
//                     'newPassword',
//                   )}`}
//                 />

//                 {errors.newPassword && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.newPassword}
//                   </p>
//                 )}
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label
//                   htmlFor="confirmNewPassword"
//                   className={`mb-2 block text-sm font-medium ${
//                     errors.confirmNewPassword
//                       ? 'text-red-600'
//                       : passwordData.confirmNewPassword
//                         ? 'text-green-600'
//                         : 'text-gray-700'
//                   }`}
//                 >
//                   Confirm New Password{' '}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   id="confirmNewPassword"
//                   type="password"
//                   placeholder="Confirm New Password"
//                   value={
//                     passwordData.confirmNewPassword
//                   }
//                   onChange={(e) =>
//                     handlePasswordChange(
//                       'confirmNewPassword',
//                       e.target.value,
//                     )
//                   }
//                   disabled={loading}
//                   className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-2 ${getInputClass(
//                     'confirmNewPassword',
//                   )}`}
//                 />

//                 {errors.confirmNewPassword && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.confirmNewPassword}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 disabled={loading}
//                 className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={handleChangePassword}
//                 disabled={loading}
//                 className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2759a2] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#1f4b8c] disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {loading && (
//                   <Loader2
//                     size={16}
//                     className="animate-spin"
//                   />
//                 )}

//                 {loading
//                   ? 'Changing...'
//                   : 'Submit'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default AppHeaderDropdown



import React, {
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  KeyRound,
  LogOut,
  X,
  Building2,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import avatar10 from "./../../assets/images/avatars/10.png";
import axiosInstance from "../../axiosInstance";

const AppHeaderDropdown = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [center, setCenter] = useState(null);
  const [accessibleCenters, setAccessibleCenters] =
    useState([]);

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [
    showChangePasswordModal,
    setShowChangePasswordModal,
  ] = useState(false);

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  // --------------------------------------------------
  // Load user from localStorage
  // --------------------------------------------------
  const loadUserData = () => {
    try {
      const storedUser =
        localStorage.getItem("user");

      const storedCenter =
        localStorage.getItem("userCenter");

      if (storedUser) {
        const parsedUser =
          JSON.parse(storedUser);

        setUser(parsedUser);

        if (
          Array.isArray(
            parsedUser.accessibleCenters,
          )
        ) {
          setAccessibleCenters(
            parsedUser.accessibleCenters,
          );
        } else {
          setAccessibleCenters([]);
        }
      } else {
        setUser(null);
        setAccessibleCenters([]);
      }

      if (storedCenter) {
        setCenter(
          JSON.parse(storedCenter),
        );
      } else {
        setCenter(null);
      }
    } catch (error) {
      console.error(
        "Error loading user data:",
        error,
      );
    }
  };

  // --------------------------------------------------
  // Initial load
  // --------------------------------------------------
  useEffect(() => {
    loadUserData();
  }, []);

  // --------------------------------------------------
  // Refresh header after center switch
  // --------------------------------------------------
  useEffect(() => {
    const handleCenterChanged = () => {
      loadUserData();
    };

    window.addEventListener(
      "centerChanged",
      handleCenterChanged,
    );

    return () => {
      window.removeEventListener(
        "centerChanged",
        handleCenterChanged,
      );
    };
  }, []);

  // --------------------------------------------------
  // Reload data whenever dropdown opens
  // --------------------------------------------------
  useEffect(() => {
    if (showDropdown) {
      loadUserData();
    }
  }, [showDropdown]);

  // --------------------------------------------------
  // Reset password form
  // --------------------------------------------------
  useEffect(() => {
    if (showChangePasswordModal) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setAlert({
        type: "",
        message: "",
      });

      setErrors({});
    }
  }, [showChangePasswordModal]);

  // --------------------------------------------------
  // Close dropdown outside
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(
          "[data-user-dropdown]",
        )
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [showDropdown]);

  // --------------------------------------------------
  // Sign out
  // --------------------------------------------------
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(
      "refreshToken",
    );
    localStorage.removeItem("user");
    localStorage.removeItem(
      "userCenter",
    );
    localStorage.removeItem(
      "tempToken",
    );
    localStorage.removeItem(
      "userTemp",
    );

    setShowDropdown(false);

    navigate("/login");
  };

  // --------------------------------------------------
  // Change password
  // --------------------------------------------------
  const handleChangePasswordClick = () => {
    setShowDropdown(false);
    setShowChangePasswordModal(true);
  };

  // --------------------------------------------------
  // Switch center
  // --------------------------------------------------
  const handleSwitchCenterClick = () => {
    setShowDropdown(false);
    navigate("/select-center");
  };

  // --------------------------------------------------
  // Password field change
  // --------------------------------------------------
  const handlePasswordChange = (
    field,
    value,
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // --------------------------------------------------
  // Validate password
  // --------------------------------------------------
  const validateForm = () => {
    const newErrors = {};

    if (
      !passwordData.currentPassword.trim()
    ) {
      newErrors.currentPassword =
        "This is a required field";
    }

    if (
      !passwordData.newPassword.trim()
    ) {
      newErrors.newPassword =
        "This is a required field";
    }

    if (
      !passwordData.confirmNewPassword.trim()
    ) {
      newErrors.confirmNewPassword =
        "This is a required field";
    }

    if (
      passwordData.newPassword &&
      passwordData.newPassword.length < 6
    ) {
      newErrors.newPassword =
        "Password must be at least 6 characters long";
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmNewPassword
    ) {
      newErrors.confirmNewPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // --------------------------------------------------
  // Change password API
  // --------------------------------------------------
  const handleChangePassword =
    async () => {
      if (!validateForm()) return;

      setLoading(true);

      setAlert({
        type: "",
        message: "",
      });

      try {
        const response =
          await axiosInstance.put(
            "/auth/update-password",
            {
              currentPassword:
                passwordData.currentPassword,

              newPassword:
                passwordData.newPassword,

              confirmNewPassword:
                passwordData.confirmNewPassword,
            },
          );

        if (response.data?.success) {
          setAlert({
            type: "success",
            message:
              "Password changed successfully!",
          });

          setTimeout(() => {
            setShowChangePasswordModal(
              false,
            );

            setPasswordData({
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            });
          }, 1500);
        } else {
          setAlert({
            type: "danger",
            message:
              response.data?.message ||
              "Failed to change password",
          });
        }
      } catch (error) {
        console.error(
          "Error changing password:",
          error,
        );

        if (
          error.response?.data?.errors
        ) {
          const backendErrors = {};

          error.response.data.errors.forEach(
            (err) => {
              backendErrors[err.path] =
                err.msg;
            },
          );

          setErrors(backendErrors);
        } else {
          setAlert({
            type: "danger",
            message:
              error.response?.data
                ?.message ||
              error.message ||
              "An error occurred while changing password",
          });
        }
      } finally {
        setLoading(false);
      }
    };

  // --------------------------------------------------
  // Close modal
  // --------------------------------------------------
  const closeModal = () => {
    setShowChangePasswordModal(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

    setAlert({
      type: "",
      message: "",
    });

    setErrors({});
  };

  // --------------------------------------------------
  // Input classes
  // --------------------------------------------------
  const getInputClass = (field) => {
    if (errors[field]) {
      return "border-red-500 focus:border-red-500 focus:ring-red-200";
    }

    if (passwordData[field]) {
      return "border-green-500 focus:border-green-500 focus:ring-green-200";
    }

    return "border-gray-300 focus:border-blue-500 focus:ring-blue-200";
  };

  return (
    <>
      {/* User Dropdown */}
      <div
        data-user-dropdown
        className="relative"
      >
        <button
          type="button"
          onClick={() =>
            setShowDropdown(
              (prev) => !prev,
            )
          }
          className="flex h-10 items-center gap-2 rounded-md px-2 text-white transition hover:bg-white/10"
          aria-expanded={showDropdown}
        >
          <img
            src={avatar10}
            alt="Profile"
            className="h-8 w-8 rounded-full border-2 border-white/30 object-cover"
          />

          <span className="hidden text-sm font-normal sm:inline">
            {user?.fullName || "User Name"}
          </span>

          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              showDropdown
                ? "rotate-180"
                : ""
            }`}
          />
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full z-[1000] mt-2 w-[330px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl">
            {/* Profile Header */}
            <div className="bg-[#2759a2] px-4 py-4 text-center text-white">
              <div className="mx-auto mb-2 h-[84px] w-[84px] overflow-hidden rounded-full border-[3px] border-white/20">
                <img
                  src={avatar10}
                  alt="Profile"
                  className="h-full w-full rounded-full border-2 border-[#2759a2] object-cover"
                />
              </div>

              <p className="m-0 text-xs font-light text-white/80">
                {user?.email ||
                  "user@example.com"}
              </p>

              <p className="mt-2 text-[15px] text-white/90">
                {user?.role
                  ? `${user.role.roleTitle} - ${
                      center?.centerName ||
                      "Unknown"
                    }`
                  : `- ${
                      center?.centerName ||
                      "Unknown"
                    }`}
              </p>

              {/* Number of accessible centers */}
              {accessibleCenters.length >
                1 && (
                <div className="mt-2">
                  <small className="text-white/70">
                    Access to{" "}
                    {
                      accessibleCenters.length
                    }{" "}
                    centers
                  </small>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="m-1 flex flex-wrap justify-between gap-1 bg-white p-1">
              {/* Change Password */}
              <button
                type="button"
                onClick={
                  handleChangePasswordClick
                }
                className="flex items-center gap-1 border border-gray-300 px-2 py-1.5 text-xs text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <KeyRound size={13} />
                Change Password
              </button>

              {/* Switch Center */}
              {accessibleCenters.length >
                1 && (
                <button
                  type="button"
                  onClick={
                    handleSwitchCenterClick
                  }
                  className="flex items-center gap-1 border border-gray-300 px-2 py-1.5 text-xs text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  <Building2 size={13} />
                  Switch Center
                </button>
              )}

              {/* Sign Out */}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1 border border-gray-300 px-2 py-1.5 text-xs text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="m-0 text-lg font-semibold text-gray-800">
                Change Password
              </h2>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {alert.message && (
                <div
                  className={`mb-5 flex items-start justify-between rounded-md border px-4 py-3 text-sm ${
                    alert.type ===
                    "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
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
                    className="ml-3 opacity-70 hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Current Password */}
              <div className="mb-5">
                <label
                  htmlFor="currentPassword"
                  className={`mb-2 block text-sm font-medium ${
                    errors.currentPassword
                      ? "text-red-600"
                      : passwordData.currentPassword
                        ? "text-green-600"
                        : "text-gray-700"
                  }`}
                >
                  Current Password{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="currentPassword"
                  type="password"
                  placeholder="Current Password"
                  value={
                    passwordData.currentPassword
                  }
                  onChange={(e) =>
                    handlePasswordChange(
                      "currentPassword",
                      e.target.value,
                    )
                  }
                  disabled={loading}
                  className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-2 ${getInputClass(
                    "currentPassword",
                  )}`}
                />

                {errors.currentPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {
                      errors.currentPassword
                    }
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="mb-5">
                <label
                  htmlFor="newPassword"
                  className={`mb-2 block text-sm font-medium ${
                    errors.newPassword
                      ? "text-red-600"
                      : passwordData.newPassword
                        ? "text-green-600"
                        : "text-gray-700"
                  }`}
                >
                  New Password{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="newPassword"
                  type="password"
                  placeholder="New Password"
                  value={
                    passwordData.newPassword
                  }
                  onChange={(e) =>
                    handlePasswordChange(
                      "newPassword",
                      e.target.value,
                    )
                  }
                  disabled={loading}
                  className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-2 ${getInputClass(
                    "newPassword",
                  )}`}
                />

                {errors.newPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmNewPassword"
                  className={`mb-2 block text-sm font-medium ${
                    errors.confirmNewPassword
                      ? "text-red-600"
                      : passwordData.confirmNewPassword
                        ? "text-green-600"
                        : "text-gray-700"
                  }`}
                >
                  Confirm New Password{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Confirm New Password"
                  value={
                    passwordData.confirmNewPassword
                  }
                  onChange={(e) =>
                    handlePasswordChange(
                      "confirmNewPassword",
                      e.target.value,
                    )
                  }
                  disabled={loading}
                  className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-2 ${getInputClass(
                    "confirmNewPassword",
                  )}`}
                />

                {errors.confirmNewPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {
                      errors.confirmNewPassword
                    }
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleChangePassword
                }
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2759a2] px-5 py-2 text-sm font-medium text-white hover:bg-[#1f4b8c] disabled:opacity-60"
              >
                {loading && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {loading
                  ? "Changing..."
                  : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppHeaderDropdown;