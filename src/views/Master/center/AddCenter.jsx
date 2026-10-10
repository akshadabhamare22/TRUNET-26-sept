// import React, { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import Select from 'react-select'
// import axiosInstance from '../../../axiosInstance';

// const initialFormData = {
//   centerType: '',
//   centerName: '',
//   centerCode: '',
//   email: '',
//   mobile: '',
//   status: '',
//   addressLine1: '',
//   addressLine2: '',
//   city: '',
//   state: '',
//   stockVerified: '',
//   resellerId: '',
//   areaId: '',
// }

// const AddCenter = () => {
//   const navigate = useNavigate()
//   const { id } = useParams()

//   const [formData, setFormData] = useState(initialFormData)
//   const [centers, setCenters] = useState([])
//   const [areas, setAreas] = useState([])
//   const [resellers, setResellers] = useState([])
//   const [errors, setErrors] = useState({})
//   const [alert, setAlert] = useState({
//     type: '',
//     message: '',
//   })

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const centersRes = await axiosInstance.get('/centers')
//         setCenters(centersRes.data.data || [])

//         const resellersRes = await axiosInstance.get('/resellers')
//         setResellers(resellersRes.data.data || [])
//       } catch (error) {
//         console.error('Error fetching data:', error)
//       }
//     }

//     fetchData()
//   }, [])

//   useEffect(() => {
//     if (id) {
//       fetchCenter(id)
//     }
//   }, [id])

//   useEffect(() => {
//     if (formData.resellerId) {
//       fetchAreasByReseller(formData.resellerId)
//     } else {
//       setAreas([])
//       setFormData((prev) => ({
//         ...prev,
//         areaId: '',
//       }))
//     }
//   }, [formData.resellerId])

//   const fetchAreasByReseller = async (resellerId) => {
//     try {
//       const response = await axiosInstance.get(`/areas/reseller/${resellerId}`)
//       setAreas(response.data.data || [])
//     } catch (error) {
//       console.error('Error fetching areas:', error)
//       setAreas([])
//     }
//   }

//   const fetchCenter = async (centerId) => {
//     try {
//       const response = await axiosInstance.get(`/centers/${centerId}`)
//       const data = response.data.data

//       setFormData({
//         centerType: data.centerType || '',
//         centerName: data.centerName || '',
//         centerCode: data.centerCode || '',
//         email: data.email || '',
//         mobile: data.mobile || '',
//         status: data.status || '',
//         addressLine1: data.addressLine1 || '',
//         addressLine2: data.addressLine2 || '',
//         city: data.city || '',
//         state: data.state || '',
//         stockVerified: data.stockVerified || '',
//         resellerId: data.reseller?._id || '',
//         areaId: data.area?._id || '',
//       })

//       if (data.reseller?._id) {
//         fetchAreasByReseller(data.reseller._id)
//       }
//     } catch (error) {
//       console.error('Error fetching center:', error)
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target

//     if (name === 'resellerId') {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//         areaId: '',
//       }))
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }))
//     }

//     setErrors((prev) => ({
//       ...prev,
//       [name]: '',
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     const newErrors = {}

//     const requiredFields = [
//       'resellerId',
//       'areaId',
//       'centerType',
//       'centerName',
//       'centerCode',
//       'status',
//     ]

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = 'This is a required field'
//       }
//     })

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors)
//       return
//     }

//     try {
//       if (id) {
//         await axiosInstance.put(`/centers/${id}`, formData)

//         setAlert({
//           type: 'success',
//           message: 'Center updated successfully!',
//         })
//       } else {
//         await axiosInstance.post('/centers', formData)

//         setAlert({
//           type: 'success',
//           message: 'Center added successfully!',
//         })
//       }

//       setTimeout(() => {
//         navigate('/center-list')
//       }, 1500)
//     } catch (error) {
//       console.error('Error saving center:', error)

//       let message = 'Failed to save center. Please try again!'

//       if (error.response) {
//         message =
//           error.response.data?.message ||
//           error.response.data?.error ||
//           message
//       } else if (error.request) {
//         message = 'No response from server. Please check your connection.'
//       } else {
//         message = error.message
//       }

//       setAlert({
//         type: 'danger',
//         message,
//       })
//     }
//   }

//   const handleReset = () => {
//     setFormData(initialFormData)
//     setErrors({})
//   }

//   const getFieldClass = (field) => {
//     if (errors[field]) {
//       return 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200'
//     }

//     if (formData[field]) {
//       return 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-200'
//     }

//     return 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
//   }

//   const inputClass = (field) =>
//     `h-10 w-full rounded-md border px-3 text-sm text-gray-700 outline-none transition focus:ring-2 ${getFieldClass(
//       field,
//     )}`

//   const labelClass = (field) => {
//     if (errors[field]) {
//       return 'text-red-600'
//     }

//     if (formData[field]) {
//       return 'text-green-600'
//     }

//     return 'text-gray-700'
//   }

//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: '40px',
//       height: '40px',
//       borderRadius: '6px',
//       borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
//       boxShadow: state.isFocused ? '0 0 0 2px rgba(59,130,246,0.15)' : 'none',
//       '&:hover': {
//         borderColor: '#9ca3af',
//       },
//       fontSize: '14px',
//     }),
//     valueContainer: (base) => ({
//       ...base,
//       height: '40px',
//       padding: '0 12px',
//     }),
//     indicatorsContainer: (base) => ({
//       ...base,
//       height: '40px',
//     }),
//     option: (base, state) => ({
//       ...base,
//       fontSize: '14px',
//       backgroundColor: state.isSelected
//         ? '#2759a2'
//         : state.isFocused
//           ? '#eff6ff'
//           : '#ffffff',
//       color: state.isSelected ? '#ffffff' : '#374151',
//       cursor: 'pointer',
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 50,
//     }),
//   }

//   return (
//     <div className="w-full px-4 py-6 md:px-6">
//       {/* Page Title */}
//       <div className="mb-5 text-2xl font-semibold text-gray-800">
//         {id ? 'Edit' : 'Add'} Storage Outlet
//       </div>

//       {/* Main Card */}
//       <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Card Header */}
//         <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
//           <h2 className="text-base font-semibold text-gray-800">Outlet</h2>
//         </div>

//         {/* Card Body */}
//         <div className="p-5">
//           {/* Alert */}
//           {alert.message && (
//             <div
//               className={`mb-5 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
//                 alert.type === 'success'
//                   ? 'border-green-200 bg-green-50 text-green-700'
//                   : 'border-red-200 bg-red-50 text-red-700'
//               }`}
//             >
//               <span>{alert.message}</span>

//               <button
//                 type="button"
//                 onClick={() => setAlert({ type: '', message: '' })}
//                 className="ml-4 text-lg font-semibold opacity-70 hover:opacity-100"
//               >
//                 ×
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* Row 1 */}
//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
//               {/* Outlet Type */}
//               <div>
//                 <label
//                   htmlFor="centerType"
//                   className={`mb-1.5 block text-sm font-medium ${labelClass(
//                     'centerType',
//                   )}`}
//                 >
//                   Outlet Type <span className="text-red-500">*</span>
//                 </label>

//                 <select
//                   id="centerType"
//                   name="centerType"
//                   value={formData.centerType}
//                   onChange={handleChange}
//                   className={inputClass('centerType')}
//                 >
//                   <option value="">SELECT</option>
//                   <option value="Center">Center</option>
//                   <option value="Outlet">Warehouse</option>
//                 </select>

//                 {errors.centerType && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.centerType}
//                   </p>
//                 )}
//               </div>

//               {/* Reseller */}
//               <div>
//                 <label
//                   htmlFor="resellerId"
//                   className={`mb-1.5 block text-sm font-medium ${labelClass(
//                     'resellerId',
//                   )}`}
//                 >
//                   Reseller Name <span className="text-red-500">*</span>
//                 </label>

//                 <Select
//                   inputId="resellerId"
//                   name="resellerId"
//                   placeholder="Select Reseller..."
//                   value={
//                     formData.resellerId
//                       ? {
//                           value: formData.resellerId,
//                           label:
//                             resellers.find(
//                               (reseller) =>
//                                 reseller._id === formData.resellerId,
//                             )?.businessName || '',
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     handleChange({
//                       target: {
//                         name: 'resellerId',
//                         value: selected ? selected.value : '',
//                       },
//                     })
//                   }
//                   options={resellers.map((reseller) => ({
//                     value: reseller._id,
//                     label: reseller.businessName,
//                   }))}
//                   isClearable
//                   styles={selectStyles}
//                 />

//                 {errors.resellerId && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.resellerId}
//                   </p>
//                 )}
//               </div>

//               {/* Branch Name */}
//               <div>
//                 <label
//                   htmlFor="centerName"
//                   className={`mb-1.5 block text-sm font-medium ${labelClass(
//                     'centerName',
//                   )}`}
//                 >
//                   Branch Name <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   id="centerName"
//                   name="centerName"
//                   value={formData.centerName}
//                   onChange={handleChange}
//                   className={inputClass('centerName')}
//                 />

//                 {errors.centerName && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.centerName}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Row 2 */}
//             <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
//               {/* Branch Code */}
//               <div>
//                 <label
//                   htmlFor="centerCode"
//                   className={`mb-1.5 block text-sm font-medium ${labelClass(
//                     'centerCode',
//                   )}`}
//                 >
//                   Branch Code <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   id="centerCode"
//                   name="centerCode"
//                   value={formData.centerCode}
//                   onChange={handleChange}
//                   className={inputClass('centerCode')}
//                 />

//                 {errors.centerCode && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.centerCode}
//                   </p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Email
//                 </label>

//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={inputClass('email')}
//                 />
//               </div>

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
//                   className={inputClass('mobile')}
//                 />
//               </div>
//             </div>

//             {/* Row 3 */}
//             <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
//               {/* Status */}
//               <div>
//                 <label
//                   htmlFor="status"
//                   className={`mb-1.5 block text-sm font-medium ${labelClass(
//                     'status',
//                   )}`}
//                 >
//                   Status <span className="text-red-500">*</span>
//                 </label>

//                 <select
//                   id="status"
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className={inputClass('status')}
//                 >
//                   <option value="">SELECT</option>
//                   <option value="Enable">Enable</option>
//                   <option value="Disable">Disable</option>
//                 </select>

//                 {errors.status && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.status}
//                   </p>
//                 )}
//               </div>

//               {/* Address Line 1 */}
//               <div>
//                 <label
//                   htmlFor="addressLine1"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Address Line 1
//                 </label>

//                 <input
//                   type="text"
//                   id="addressLine1"
//                   name="addressLine1"
//                   value={formData.addressLine1}
//                   onChange={handleChange}
//                   className={inputClass('addressLine1')}
//                 />
//               </div>

//               {/* Address Line 2 */}
//               <div>
//                 <label
//                   htmlFor="addressLine2"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Address Line 2
//                 </label>

//                 <input
//                   type="text"
//                   id="addressLine2"
//                   name="addressLine2"
//                   value={formData.addressLine2}
//                   onChange={handleChange}
//                   className={inputClass('addressLine2')}
//                 />
//               </div>
//             </div>

//             {/* Row 4 */}
//             <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
//                   className={inputClass('city')}
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
//                   className={inputClass('state')}
//                 />
//               </div>

//               {/* Stock Verified */}
//               <div>
//                 <label
//                   htmlFor="stockVerified"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Stock Verified
//                 </label>

//                 <select
//                   id="stockVerified"
//                   name="stockVerified"
//                   value={formData.stockVerified}
//                   onChange={handleChange}
//                   className={inputClass('stockVerified')}
//                 >
//                   <option value="">SELECT</option>
//                   <option value="Yes">Yes</option>
//                   <option value="No">No</option>
//                 </select>
//               </div>
//             </div>

//             {/* Row 5 */}
//             <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
//               {/* Area */}
//               <div>
//                 <label
//                   htmlFor="areaId"
//                   className={`mb-1.5 block text-sm font-medium ${labelClass(
//                     'areaId',
//                   )}`}
//                 >
//                   Area Name <span className="text-red-500">*</span>
//                 </label>

//                 <Select
//                   inputId="areaId"
//                   name="areaId"
//                   value={
//                     areas.find((area) => area._id === formData.areaId)
//                       ? {
//                           label:
//                             areas.find(
//                               (area) => area._id === formData.areaId,
//                             )?.areaName || '',
//                           value: formData.areaId,
//                         }
//                       : null
//                   }
//                   onChange={(selected) => {
//                     handleChange({
//                       target: {
//                         name: 'areaId',
//                         value: selected ? selected.value : '',
//                       },
//                     })
//                   }}
//                   options={areas.map((area) => ({
//                     label: area.areaName,
//                     value: area._id,
//                   }))}
//                   isDisabled={!formData.resellerId}
//                   placeholder={
//                     formData.resellerId
//                       ? 'Select Area'
//                       : 'Select Reseller First'
//                   }
//                   styles={selectStyles}
//                 />

//                 {errors.areaId && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.areaId}
//                   </p>
//                 )}
//               </div>

//               <div />
//               <div />
//             </div>

//             {/* Footer */}
//             <div className="mt-7 flex justify-end gap-3 border-t border-gray-200 pt-5">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//               >
//                 Reset
//               </button>

//               <button
//                 type="submit"
//                 className="rounded-md bg-[#2759A2] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#1f4782]"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AddCenter


import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select'
import axiosInstance from '../../../axiosInstance';

const initialFormData = {
  centerType: '',
  centerName: '',
  centerCode: '',
  email: '',
  mobile: '',
  status: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  stockVerified: '',
  resellerId: '',
  areaId: '',
}

const AddCenter = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState(initialFormData)
  const [centers, setCenters] = useState([])
  const [areas, setAreas] = useState([])
  const [resellers, setResellers] = useState([])
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({
    type: '',
    message: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const centersRes = await axiosInstance.get('/centers')
        setCenters(centersRes.data.data || [])

        const resellersRes = await axiosInstance.get('/resellers')
        setResellers(resellersRes.data.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (id) {
      fetchCenter(id)
    }
  }, [id])

  useEffect(() => {
    if (formData.resellerId) {
      fetchAreasByReseller(formData.resellerId)
    } else {
      setAreas([])
      setFormData((prev) => ({
        ...prev,
        areaId: '',
      }))
    }
  }, [formData.resellerId])

  const fetchAreasByReseller = async (resellerId) => {
    try {
      const response = await axiosInstance.get(`/areas/reseller/${resellerId}`)
      setAreas(response.data.data || [])
    } catch (error) {
      console.error('Error fetching areas:', error)
      setAreas([])
    }
  }

  const fetchCenter = async (centerId) => {
    try {
      const response = await axiosInstance.get(`/centers/${centerId}`)
      const data = response.data.data

      setFormData({
        centerType: data.centerType || '',
        centerName: data.centerName || '',
        centerCode: data.centerCode || '',
        email: data.email || '',
        mobile: data.mobile || '',
        status: data.status || '',
        addressLine1: data.addressLine1 || '',
        addressLine2: data.addressLine2 || '',
        city: data.city || '',
        state: data.state || '',
        stockVerified: data.stockVerified || '',
        resellerId: data.reseller?._id || '',
        areaId: data.area?._id || '',
      })

      if (data.reseller?._id) {
        fetchAreasByReseller(data.reseller._id)
      }
    } catch (error) {
      console.error('Error fetching center:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'resellerId') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        areaId: '',
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}

    const requiredFields = [
      'resellerId',
      'areaId',
      'centerType',
      'centerName',
      'centerCode',
      'status',
    ]

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This is a required field'
      }
    })

    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    try {
      if (id) {
        await axiosInstance.put(`/centers/${id}`, formData)

        setAlert({
          type: 'success',
          message: 'Center updated successfully!',
        })
      } else {
        await axiosInstance.post('/centers', formData)

        setAlert({
          type: 'success',
          message: 'Center added successfully!',
        })
      }

      setTimeout(() => {
        navigate('/center-list')
      }, 1500)
    } catch (error) {
      console.error('Error saving center:', error)

      let message = 'Failed to save center. Please try again!'

      if (error.response) {
        message =
          error.response.data?.message ||
          error.response.data?.error ||
          message
      } else if (error.request) {
        message = 'No response from server. Please check your connection.'
      } else {
        message = error.message
      }

      setAlert({
        type: 'danger',
        message,
      })
    }
  }

  const handleReset = () => {
    setFormData(initialFormData)
    setErrors({})
  }

  const getFieldClass = (field) => {
    if (errors[field]) {
      return 'border-red-500 bg-white focus:border-red-500 focus:ring-red-200'
    }

    if (formData[field]) {
      return 'border-[#20b24b] bg-white focus:border-[#20b24b] focus:ring-0'
    }

    return 'border-[#d9d9d9] bg-white focus:border-[#2759a2] focus:ring-0'
  }

  const inputClass = (field) =>
    `h-[41px] w-full rounded-[2px] border px-3 text-[15px] text-[#212529] outline-none transition ${getFieldClass(
      field,
    )}`

  const labelClass = (field) => {
    if (errors[field]) {
      return 'text-red-600'
    }

    if (formData[field]) {
      return 'text-green-600'
    }

    return 'text-gray-700'
  }

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '40px',
      height: '40px',
      borderRadius: '2px',
      borderColor: state.isFocused ? '#2f5fa7' : '#d9d9d9',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#bdbdbd',
      },
      fontSize: '15px',
      color: '#212529',
      backgroundColor: '#ffffff',
    }),
    valueContainer: (base) => ({
      ...base,
      height: '40px',
      padding: '0 10px',
      fontSize: '15px',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '40px',
    }),
    option: (base, state) => ({
      ...base,
      fontSize: '14px',
      backgroundColor: state.isSelected
        ? '#2f5fa7'
        : state.isFocused
          ? '#eef4fb'
          : '#ffffff',
      color: state.isSelected ? '#ffffff' : '#212529',
      cursor: 'pointer',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
    }),
  }

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* Page Title */}
<div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">       
   {id ? 'Edit' : 'Add'} Storage Outlet
      </div>

      {/* Main Card */}
      <div className="overflow-hidden border-0 bg-white shadow-[0_1px_5px_rgba(0,0,0,0.12)]">
        {/* Card Header */}
        <div className="border-b border-[#dedede] border-t-[4px] border-t-[#2f5fa7] bg-white px-4 py-3">
          <h2 className="text-[20px] font-normal leading-6 text-[#212529]">Outlet</h2>
        </div>

        {/* Card Body */}
        <div className="px-[22px] py-[21px]">
          {/* Alert */}
          {alert.message && (
            <div
              className={`mb-5 flex items-center justify-between rounded-[3px] border px-4 py-3 text-[14px] ${
                alert.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              <span>{alert.message}</span>

              <button
                type="button"
                onClick={() => setAlert({ type: '', message: '' })}
                className="ml-4 text-lg font-semibold opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {/* Outlet Type */}
              <div>
                <label
                  htmlFor="centerType"
                  className={`mb-1.5 block text-sm font-medium ${labelClass(
                    'centerType',
                  )}`}
                >
                  Outlet Type <span className="text-red-500">*</span>
                </label>

                <select
                  id="centerType"
                  name="centerType"
                  value={formData.centerType}
                  onChange={handleChange}
                  className={inputClass('centerType')}
                >
                  <option value="">SELECT</option>
                  <option value="Center">Center</option>
                  <option value="Outlet">Warehouse</option>
                </select>

                {errors.centerType && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.centerType}
                  </p>
                )}
              </div>

              {/* Reseller */}
              <div>
                <label
                  htmlFor="resellerId"
                  className={`mb-1.5 block text-sm font-medium ${labelClass(
                    'resellerId',
                  )}`}
                >
                  Reseller Name <span className="text-red-500">*</span>
                </label>

                <Select
                  inputId="resellerId"
                  name="resellerId"
                  placeholder="Select Reseller..."
                  value={
                    formData.resellerId
                      ? {
                          value: formData.resellerId,
                          label:
                            resellers.find(
                              (reseller) =>
                                reseller._id === formData.resellerId,
                            )?.businessName || '',
                        }
                      : null
                  }
                  onChange={(selected) =>
                    handleChange({
                      target: {
                        name: 'resellerId',
                        value: selected ? selected.value : '',
                      },
                    })
                  }
                  options={resellers.map((reseller) => ({
                    value: reseller._id,
                    label: reseller.businessName,
                  }))}
                  isClearable
                  styles={selectStyles}
                />

                {errors.resellerId && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.resellerId}
                  </p>
                )}
              </div>

              {/* Branch Name */}
              <div>
                <label
                  htmlFor="centerName"
                  className={`mb-1.5 block text-sm font-medium ${labelClass(
                    'centerName',
                  )}`}
                >
                  Branch Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="centerName"
                  name="centerName"
                  value={formData.centerName}
                  onChange={handleChange}
                  className={inputClass('centerName')}
                />

                {errors.centerName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.centerName}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {/* Branch Code */}
              <div>
                <label
                  htmlFor="centerCode"
                  className={`mb-1.5 block text-sm font-medium ${labelClass(
                    'centerCode',
                  )}`}
                >
                  Branch Code <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="centerCode"
                  name="centerCode"
                  value={formData.centerCode}
                  onChange={handleChange}
                  className={inputClass('centerCode')}
                />

                {errors.centerCode && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.centerCode}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass('email')}
                />
              </div>

              {/* Mobile */}
              <div>
                <label
                  htmlFor="mobile"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Mobile
                </label>

                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={inputClass('mobile')}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className={`mb-1.5 block text-sm font-medium ${labelClass(
                    'status',
                  )}`}
                >
                  Status <span className="text-red-500">*</span>
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={inputClass('status')}
                >
                  <option value="">SELECT</option>
                  <option value="Enable">Enable</option>
                  <option value="Disable">Disable</option>
                </select>

                {errors.status && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.status}
                  </p>
                )}
              </div>

              {/* Address Line 1 */}
              <div>
                <label
                  htmlFor="addressLine1"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Address Line 1
                </label>

                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className={inputClass('addressLine1')}
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label
                  htmlFor="addressLine2"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Address Line 2
                </label>

                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className={inputClass('addressLine2')}
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  City
                </label>

                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass('city')}
                />
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="state"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  State
                </label>

                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={inputClass('state')}
                />
              </div>

              {/* Stock Verified */}
              <div>
                <label
                  htmlFor="stockVerified"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Stock Verified
                </label>

                <select
                  id="stockVerified"
                  name="stockVerified"
                  value={formData.stockVerified}
                  onChange={handleChange}
                  className={inputClass('stockVerified')}
                >
                  <option value="">SELECT</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* Row 5 */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {/* Area */}
              <div>
                <label
                  htmlFor="areaId"
                  className={`mb-1.5 block text-sm font-medium ${labelClass(
                    'areaId',
                  )}`}
                >
                  Area Name <span className="text-red-500">*</span>
                </label>

                <Select
                  inputId="areaId"
                  name="areaId"
                  value={
                    areas.find((area) => area._id === formData.areaId)
                      ? {
                          label:
                            areas.find(
                              (area) => area._id === formData.areaId,
                            )?.areaName || '',
                          value: formData.areaId,
                        }
                      : null
                  }
                  onChange={(selected) => {
                    handleChange({
                      target: {
                        name: 'areaId',
                        value: selected ? selected.value : '',
                      },
                    })
                  }}
                  options={areas.map((area) => ({
                    label: area.areaName,
                    value: area._id,
                  }))}
                  isDisabled={!formData.resellerId}
                  placeholder={
                    formData.resellerId
                      ? 'Select Area'
                      : 'Select Reseller First'
                  }
                  styles={selectStyles}
                />

                {errors.areaId && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.areaId}
                  </p>
                )}
              </div>

              <div />
              <div />
            </div>

            {/* Footer */}
            <div className="mt-7 flex justify-end gap-3 border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Reset
              </button>

              <button
                type="submit"
                className="rounded-md bg-[#2759A2] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#1f4782]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddCenter