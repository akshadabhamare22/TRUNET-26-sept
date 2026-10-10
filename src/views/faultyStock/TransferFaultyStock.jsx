// import React, { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import axiosInstance from '../../axiosInstance'
// import {
//   ArrowLeft,
//   Check,
//   ChevronDown,
//   ChevronUp,
//   RotateCcw,
//   Search,
//   X,
// } from 'lucide-react'

// const TransferFaultyStock = () => {
//   const navigate = useNavigate()
//   const { id } = useParams()

//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split('T')[0],
//     repairCenterId: '',
//     transferRemark: '',
//   })

//   const [centers, setCenters] = useState([])
//   const [products, setProducts] = useState([])
//   const [selectedRows, setSelectedRows] = useState({})
//   const [productSearchTerm, setProductSearchTerm] = useState('')
//   const [errors, setErrors] = useState({})
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)

//   const [alert, setAlert] = useState({
//     visible: false,
//     type: 'success',
//     message: '',
//   })

//   const [expandedProducts, setExpandedProducts] = useState({})

//   useEffect(() => {
//     const fetchCenters = async () => {
//       try {
//         const res = await axiosInstance.get('/centers?centerType=Center')
//         setCenters(res.data.data || [])
//       } catch (error) {
//         console.log('error fetching center', error)
//         showAlert('danger', 'Failed to fetch center')
//       }
//     }

//     fetchCenters()
//   }, [])

//   useEffect(() => {
//     fetchProducts()
//   }, [])

//   const fetchProducts = async () => {
//     try {
//       const res = await axiosInstance.get('/stockusage/faulty-stock')

//       if (res.data.success) {
//         console.log('Fetched products:', res.data.data)
//         setProducts(res.data.data || [])
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error)
//       showAlert('danger', 'Failed to fetch products')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const showAlert = (type, message) => {
//     setAlert({
//       visible: true,
//       type,
//       message,
//     })

//     setTimeout(() => {
//       setAlert((prev) => ({
//         ...prev,
//         visible: false,
//       }))
//     }, 5000)
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))

//     setErrors((prev) => ({
//       ...prev,
//       [name]: '',
//     }))
//   }

//   // Extract only damaged serials
//   const extractDamagedSerials = (product) => {
//     if (product.product?.trackSerialNumber === 'Yes') {
//       return product.damagedSerialNumbers || []
//     }

//     return []
//   }

//   // Count damaged items
//   const countDamagedItems = (product) => {
//     return product.statusBreakdown?.damaged || 0
//   }

//   const handleRowSelect = (product) => {
//     const faultyStockId = product._id
//     const productId = product.product._id
//     const damagedCount = countDamagedItems(product)
//     const damagedSerials = extractDamagedSerials(product)

//     setSelectedRows((prev) => ({
//       ...prev,
//       [faultyStockId]: prev[faultyStockId]
//         ? undefined
//         : {
//             quantity: Math.min(damagedCount, product.quantity || 1),
//             damageRemark: '',
//             availableQuantity: damagedCount,
//             damagedCount,
//             serialNumbers: damagedSerials,
//             selectedSerials: [],
//             productId,
//             faultyStockId,
//             productName: product.product?.productTitle || 'Unknown Product',
//             isSerialized: product.product?.trackSerialNumber === 'Yes',
//           },
//     }))

//     setErrors((prev) => ({
//       ...prev,
//       products: '',
//       [`quantity_${faultyStockId}`]: '',
//     }))
//   }

//   const handleRowDataChange = (faultyStockId, field, value) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [faultyStockId]: {
//         ...prev[faultyStockId],
//         [field]: value,
//       },
//     }))
//   }

//   const handleQuantityChange = (faultyStockId, newQuantity) => {
//     const row = selectedRows[faultyStockId]

//     if (!row) return

//     const maxQuantity = Math.min(row.damagedCount, row.availableQuantity)

//     const validQuantity = Math.max(
//       1,
//       Math.min(newQuantity, maxQuantity),
//     )

//     if (row.isSerialized) {
//       const autoSelectedSerials = row.serialNumbers.slice(0, validQuantity)

//       setSelectedRows((prev) => ({
//         ...prev,
//         [faultyStockId]: {
//           ...prev[faultyStockId],
//           quantity: validQuantity,
//           selectedSerials: autoSelectedSerials,
//         },
//       }))
//     } else {
//       setSelectedRows((prev) => ({
//         ...prev,
//         [faultyStockId]: {
//           ...prev[faultyStockId],
//           quantity: validQuantity,
//         },
//       }))
//     }

//     setErrors((prev) => ({
//       ...prev,
//       [`quantity_${faultyStockId}`]: '',
//     }))
//   }

//   const handleSerialSelect = (
//     faultyStockId,
//     serialNumber,
//     isChecked,
//   ) => {
//     const row = selectedRows[faultyStockId]

//     if (!row || !row.isSerialized) return

//     let updatedSelectedSerials = [
//       ...(row.selectedSerials || []),
//     ]

//     if (isChecked) {
//       if (!updatedSelectedSerials.includes(serialNumber)) {
//         updatedSelectedSerials.push(serialNumber)
//       }
//     } else {
//       updatedSelectedSerials = updatedSelectedSerials.filter(
//         (sn) => sn !== serialNumber,
//       )
//     }

//     setSelectedRows((prev) => ({
//       ...prev,
//       [faultyStockId]: {
//         ...prev[faultyStockId],
//         selectedSerials: updatedSelectedSerials,
//         quantity: updatedSelectedSerials.length,
//       },
//     }))
//   }

//   const selectAllSerials = (faultyStockId) => {
//     const row = selectedRows[faultyStockId]

//     if (!row || !row.isSerialized) return

//     setSelectedRows((prev) => ({
//       ...prev,
//       [faultyStockId]: {
//         ...prev[faultyStockId],
//         selectedSerials: [...row.serialNumbers],
//         quantity: row.serialNumbers.length,
//       },
//     }))
//   }

//   const deselectAllSerials = (faultyStockId) => {
//     const row = selectedRows[faultyStockId]

//     if (!row) return

//     setSelectedRows((prev) => ({
//       ...prev,
//       [faultyStockId]: {
//         ...prev[faultyStockId],
//         selectedSerials: [],
//         quantity: 0,
//       },
//     }))
//   }

//   const toggleProductDetails = (faultyStockId) => {
//     setExpandedProducts((prev) => ({
//       ...prev,
//       [faultyStockId]: !prev[faultyStockId],
//     }))
//   }

//   const validateForm = () => {
//     const newErrors = {}

//     if (!formData.date) {
//       newErrors.date = 'Date is required'
//     }

//     if (!formData.repairCenterId) {
//       newErrors.repairCenterId = 'Center is required'
//     }

//     const selectedProducts = Object.keys(selectedRows).filter(
//       (id) => selectedRows[id],
//     )

//     if (selectedProducts.length === 0) {
//       newErrors.products = 'At least one product must be selected'
//     } else {
//       selectedProducts.forEach((faultyStockId) => {
//         const row = selectedRows[faultyStockId]

//         if (row.quantity <= 0) {
//           newErrors[`quantity_${faultyStockId}`] =
//             'Quantity must be greater than 0'
//         }

//         if (row.quantity > row.damagedCount) {
//           newErrors[`quantity_${faultyStockId}`] =
//             `Cannot exceed available damaged items (${row.damagedCount})`
//         }
//       })
//     }

//     return newErrors
//   }

//   const prepareSubmitData = () => {
//     const items = Object.keys(selectedRows)
//       .filter((faultyStockId) => selectedRows[faultyStockId])
//       .map((faultyStockId) => {
//         const row = selectedRows[faultyStockId]

//         const itemData = {
//           productId: row.productId,
//           quantity: parseInt(row.quantity) || 0,
//           damageRemark: row.damageRemark || '',
//         }

//         if (
//           row.isSerialized &&
//           row.selectedSerials &&
//           row.selectedSerials.length > 0
//         ) {
//           itemData.serialNumbers = row.selectedSerials
//         }

//         return itemData
//       })

//     return {
//       items,
//       repairCenterId: formData.repairCenterId,
//       transferRemark: formData.transferRemark || '',
//     }
//   }

//   const handleReset = () => {
//     setFormData({
//       date: new Date().toISOString().split('T')[0],
//       repairCenterId: '',
//       transferRemark: '',
//     })

//     setSelectedRows({})
//     setProductSearchTerm('')
//     setErrors({})
//     setExpandedProducts({})
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setSubmitting(true)

//     const newErrors = validateForm()

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors)
//       setSubmitting(false)
//       showAlert(
//         'warning',
//         'Please fix the form errors before submitting',
//       )
//       return
//     }

//     try {
//       const submitData = prepareSubmitData()

//       console.log(
//         'Submitting data:',
//         JSON.stringify(submitData, null, 2),
//       )

//       const response = await axiosInstance.post(
//         '/faulty-stock/transfer',
//         submitData,
//       )

//       if (response.data.success) {
//         showAlert(
//           'success',
//           'Faulty stock transferred successfully!',
//         )

//         setTimeout(() => {
//           navigate('/faulty-stock')
//         }, 1500)
//       } else {
//         showAlert(
//           'danger',
//           response.data.message ||
//             'Failed to transfer faulty stock',
//         )
//       }
//     } catch (error) {
//       console.error(
//         'Error transferring faulty stock:',
//         error,
//       )

//       let errorMessage = 'Failed to transfer faulty stock'

//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message
//       }

//       if (error.response?.data?.errors) {
//         errorMessage = error.response.data.errors.join(', ')
//       }

//       showAlert('danger', errorMessage)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const filteredProducts = products.filter((p) => {
//     const search = productSearchTerm.toLowerCase()

//     return (
//       p.product?.productTitle
//         ?.toLowerCase()
//         .includes(search) ||
//       p.product?._id?.toLowerCase().includes(search)
//     )
//   })

//   const handleBack = () => {
//     navigate('/faulty-stock')
//   }

//   const getStatusCounts = (product) => {
//     if (product.statusBreakdown) {
//       return {
//         damaged: product.statusBreakdown.damaged || 0,
//         underRepair: product.statusBreakdown.underRepair || 0,
//         repaired: product.statusBreakdown.repaired || 0,
//         irreparable: product.statusBreakdown.irreparable || 0,
//       }
//     }

//     if (
//       product.product?.trackSerialNumber === 'Yes' &&
//       product.serialNumbers
//     ) {
//       return {
//         damaged: product.serialNumbers.filter(
//           (sn) => sn.status === 'damaged',
//         ).length,
//         underRepair: product.serialNumbers.filter(
//           (sn) => sn.status === 'under_repair',
//         ).length,
//         repaired: product.serialNumbers.filter(
//           (sn) => sn.status === 'repaired',
//         ).length,
//         irreparable: product.serialNumbers.filter(
//           (sn) => sn.status === 'irreparable',
//         ).length,
//       }
//     }

//     return {
//       damaged: product.damagedQty || 0,
//       underRepair: product.underRepairQty || 0,
//       repaired: product.repairedQty || 0,
//       irreparable: product.irrepairedQty || 0,
//     }
//   }

//   const selectedProductIds = Object.keys(selectedRows).filter(
//     (id) => selectedRows[id],
//   )

//   const getAlertClasses = () => {
//     switch (alert.type) {
//       case 'success':
//         return 'border-green-200 bg-green-50 text-green-800'
//       case 'danger':
//         return 'border-red-200 bg-red-50 text-red-800'
//       case 'warning':
//         return 'border-yellow-200 bg-yellow-50 text-yellow-800'
//       default:
//         return 'border-blue-200 bg-blue-50 text-blue-800'
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="mx-auto max-w-[1600px]">
//         {/* Page Header */}
//         <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={handleBack}
//               className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
//             >
//               <ArrowLeft size={17} />
//               Back
//             </button>

//             <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">
//               Transfer To Repair Team
//             </h1>
//           </div>
//         </div>

//         {/* Main Card */}
//         <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//           {/* Card Header */}
//           <div className="flex items-center justify-end border-b border-gray-200 bg-gray-50 px-4 py-3">
//             <button
//               type="button"
//               onClick={handleReset}
//               className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//             >
//               <RotateCcw size={16} />
//               Reset
//             </button>
//           </div>

//           {/* Alert */}
//           {alert.visible && (
//             <div
//               className={`mx-4 mt-4 flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${getAlertClasses()}`}
//             >
//               <span>{alert.message}</span>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setAlert((prev) => ({
//                     ...prev,
//                     visible: false,
//                   }))
//                 }
//                 className="ml-4 opacity-70 transition hover:opacity-100"
//               >
//                 <X size={17} />
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="p-4 md:p-6">
//               {/* Basic Form */}
//               <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
//                 {/* Date */}
//                 <div>
//                   <label
//                     htmlFor="date"
//                     className={`mb-1.5 block text-sm font-medium ${
//                       errors.date
//                         ? 'text-red-600'
//                         : 'text-gray-700'
//                     }`}
//                   >
//                     Date <span className="text-red-500">*</span>
//                   </label>

//                   <input
//                     type="date"
//                     id="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleChange}
//                     className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
//                       errors.date
//                         ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
//                         : formData.date
//                           ? 'border-green-400 focus:border-blue-500 focus:ring-blue-100'
//                           : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
//                     }`}
//                   />

//                   {errors.date && (
//                     <p className="mt-1 text-xs text-red-600">
//                       {errors.date}
//                     </p>
//                   )}
//                 </div>

//                 {/* Center */}
//                 <div>
//                   <label
//                     htmlFor="repairCenterId"
//                     className={`mb-1.5 block text-sm font-medium ${
//                       errors.repairCenterId
//                         ? 'text-red-600'
//                         : 'text-gray-700'
//                     }`}
//                   >
//                     Center <span className="text-red-500">*</span>
//                   </label>

//                   <select
//                     id="repairCenterId"
//                     name="repairCenterId"
//                     value={formData.repairCenterId}
//                     onChange={handleChange}
//                     className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 ${
//                       errors.repairCenterId
//                         ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
//                         : formData.repairCenterId
//                           ? 'border-green-400 focus:border-blue-500 focus:ring-blue-100'
//                           : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
//                     }`}
//                   >
//                     <option value="">Select Center</option>

//                     {centers.map((center) => (
//                       <option
//                         key={center._id}
//                         value={center._id}
//                       >
//                         {center.centerName}
//                       </option>
//                     ))}
//                   </select>

//                   {errors.repairCenterId && (
//                     <p className="mt-1 text-xs text-red-600">
//                       {errors.repairCenterId}
//                     </p>
//                   )}
//                 </div>

//                 {/* Remark */}
//                 <div>
//                   <label
//                     htmlFor="transferRemark"
//                     className="mb-1.5 block text-sm font-medium text-gray-700"
//                   >
//                     Transfer Remark
//                   </label>

//                   <textarea
//                     id="transferRemark"
//                     name="transferRemark"
//                     value={formData.transferRemark}
//                     onChange={handleChange}
//                     placeholder="Additional Comment for the transfer"
//                     rows={3}
//                     className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   />
//                 </div>
//               </div>

//               {/* Products Section */}
//               <div className="mt-7">
//                 <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//                   <div>
//                     <h2 className="text-lg font-semibold text-gray-800">
//                       Products
//                     </h2>

//                     {errors.products && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors.products}
//                       </p>
//                     )}
//                   </div>

//                   <div className="flex w-full items-center gap-2 md:w-auto">
//                     <label
//                       htmlFor="product-search"
//                       className="whitespace-nowrap text-sm font-medium text-gray-600"
//                     >
//                       Search:
//                     </label>

//                     <div className="relative w-full md:w-[280px]">
//                       <Search
//                         size={17}
//                         className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                       />

//                       <input
//                         id="product-search"
//                         type="text"
//                         value={productSearchTerm}
//                         onChange={(e) =>
//                           setProductSearchTerm(e.target.value)
//                         }
//                         placeholder="Search products..."
//                         className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {loading ? (
//                   <div className="flex min-h-[180px] items-center justify-center">
//                     <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//                   </div>
//                 ) : (
//                   <>
//                     {/* Product Table */}
//                     <div className="overflow-x-auto rounded-lg border border-gray-200">
//                       <table className="min-w-[850px] w-full border-collapse text-sm">
//                         <thead className="bg-gray-100">
//                           <tr>
//                             <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                               Select
//                             </th>
//                             <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
//                               Product Name
//                             </th>
//                             <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
//                               Total Items
//                             </th>
//                             <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
//                               Damaged
//                             </th>
//                             <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
//                               Under Repair
//                             </th>
//                             <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
//                               Repaired
//                             </th>
//                             <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
//                               Irreparable
//                             </th>
//                           </tr>
//                         </thead>

//                         <tbody>
//                           {filteredProducts.length > 0 ? (
//                             filteredProducts.map((p) => {
//                               const statusCounts =
//                                 getStatusCounts(p)

//                               const isSelected =
//                                 !!selectedRows[p._id]

//                               return (
//                                 <tr
//                                   key={p._id}
//                                   className={`transition ${
//                                     isSelected
//                                       ? 'bg-blue-50'
//                                       : 'hover:bg-gray-50'
//                                   }`}
//                                 >
//                                   <td className="border-b border-gray-200 px-4 py-3">
//                                     <input
//                                       type="checkbox"
//                                       checked={isSelected}
//                                       onChange={() =>
//                                         handleRowSelect(p)
//                                       }
//                                       className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                     />
//                                   </td>

//                                   <td className="border-b border-gray-200 px-4 py-3 font-medium text-gray-800">
//                                     {p.product?.productTitle ||
//                                       'N/A'}
//                                   </td>

//                                   <td className="border-b border-gray-200 px-4 py-3 text-center text-gray-700">
//                                     {p.quantity || 0}
//                                   </td>

//                                   <td
//                                     className={`border-b border-gray-200 px-4 py-3 text-center font-semibold ${
//                                       statusCounts.damaged > 0
//                                         ? 'text-green-600'
//                                         : 'text-gray-400'
//                                     }`}
//                                   >
//                                     {statusCounts.damaged}
//                                   </td>

//                                   <td
//                                     className={`border-b border-gray-200 px-4 py-3 text-center font-semibold ${
//                                       statusCounts.underRepair >
//                                       0
//                                         ? 'text-yellow-600'
//                                         : 'text-gray-400'
//                                     }`}
//                                   >
//                                     {statusCounts.underRepair}
//                                   </td>

//                                   <td
//                                     className={`border-b border-gray-200 px-4 py-3 text-center font-semibold ${
//                                       statusCounts.repaired > 0
//                                         ? 'text-blue-600'
//                                         : 'text-gray-400'
//                                     }`}
//                                   >
//                                     {statusCounts.repaired}
//                                   </td>

//                                   <td
//                                     className={`border-b border-gray-200 px-4 py-3 text-center font-semibold ${
//                                       statusCounts.irreparable >
//                                       0
//                                         ? 'text-red-600'
//                                         : 'text-gray-400'
//                                     }`}
//                                   >
//                                     {statusCounts.irreparable}
//                                   </td>
//                                 </tr>
//                               )
//                             })
//                           ) : (
//                             <tr>
//                               <td
//                                 colSpan={7}
//                                 className="px-4 py-10 text-center text-gray-500"
//                               >
//                                 No faulty products found
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Selected Products */}
//                     {selectedProductIds.length > 0 && (
//                       <div className="mt-5 overflow-hidden rounded-lg border border-gray-200">
//                         <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
//                           <div className="flex items-center gap-2">
//                             <h3 className="font-semibold text-gray-800">
//                               Selected Products Details
//                             </h3>

//                             <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
//                               {selectedProductIds.length}{' '}
//                               selected
//                             </span>
//                           </div>
//                         </div>

//                         <div className="space-y-3 p-4">
//                           {selectedProductIds.map(
//                             (faultyStockId) => {
//                               const row =
//                                 selectedRows[faultyStockId]

//                               const product = products.find(
//                                 (p) =>
//                                   p._id === faultyStockId,
//                               )

//                               const statusCounts =
//                                 getStatusCounts(product || {})

//                               const isSerialized =
//                                 row.isSerialized

//                               const isExpanded =
//                                 expandedProducts[
//                                   faultyStockId
//                                 ]

//                               return (
//                                 <div
//                                   key={faultyStockId}
//                                   className="overflow-hidden rounded-lg border border-gray-200 bg-white"
//                                 >
//                                   {/* Selected Product Header */}
//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       toggleProductDetails(
//                                         faultyStockId,
//                                       )
//                                     }
//                                     className="flex w-full items-center justify-between gap-3 bg-gray-50 px-4 py-3 text-left transition hover:bg-gray-100"
//                                   >
//                                     <div className="flex min-w-0 items-center gap-3">
//                                       {isExpanded ? (
//                                         <ChevronUp
//                                           size={18}
//                                           className="shrink-0 text-gray-500"
//                                         />
//                                       ) : (
//                                         <ChevronDown
//                                           size={18}
//                                           className="shrink-0 text-gray-500"
//                                         />
//                                       )}

//                                       <div className="min-w-0">
//                                         <h4 className="truncate font-semibold text-gray-800">
//                                           {row.productName}
//                                         </h4>

//                                         <span
//                                           className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
//                                             isSerialized
//                                               ? 'bg-blue-100 text-blue-700'
//                                               : 'bg-gray-200 text-gray-700'
//                                           }`}
//                                         >
//                                           {isSerialized
//                                             ? 'Serialized Product'
//                                             : 'Non-Serialized Product'}
//                                         </span>
//                                       </div>
//                                     </div>

//                                     <span className="text-xs text-gray-500">
//                                       {row.quantity} /{' '}
//                                       {row.damagedCount}
//                                     </span>
//                                   </button>

//                                   {isExpanded && (
//                                     <div className="border-t border-gray-200 p-4">
//                                       {/* Serial Actions */}
//                                       {isSerialized && (
//                                         <div className="mb-4 flex flex-wrap justify-end gap-2">
//                                           <button
//                                             type="button"
//                                             onClick={() =>
//                                               selectAllSerials(
//                                                 faultyStockId,
//                                               )
//                                             }
//                                             className="inline-flex items-center gap-1.5 rounded-md border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-50"
//                                           >
//                                             <Check size={14} />
//                                             Select All (
//                                             {
//                                               row.serialNumbers
//                                                 .length
//                                             }
//                                             )
//                                           </button>

//                                           <button
//                                             type="button"
//                                             onClick={() =>
//                                               deselectAllSerials(
//                                                 faultyStockId,
//                                               )
//                                             }
//                                             className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
//                                           >
//                                             <X size={14} />
//                                             Deselect All
//                                           </button>
//                                         </div>
//                                       )}

//                                       {/* Quantity & Remark */}
//                                       <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                                         <div>
//                                           <label
//                                             htmlFor={`quantity-${faultyStockId}`}
//                                             className="mb-1.5 block text-sm font-medium text-gray-700"
//                                           >
//                                             Quantity to Transfer:
//                                           </label>

//                                           <input
//                                             id={`quantity-${faultyStockId}`}
//                                             type="number"
//                                             min="1"
//                                             max={
//                                               row.damagedCount
//                                             }
//                                             value={row.quantity}
//                                             onChange={(e) =>
//                                               handleQuantityChange(
//                                                 faultyStockId,
//                                                 parseInt(
//                                                   e.target.value,
//                                                 ) || 1,
//                                               )
//                                             }
//                                             className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                           />

//                                           <p className="mt-1 text-xs text-gray-500">
//                                             Available damaged
//                                             items:{' '}
//                                             {
//                                               row.damagedCount
//                                             }
//                                           </p>

//                                           {errors[
//                                             `quantity_${faultyStockId}`
//                                           ] && (
//                                             <p className="mt-1 text-xs text-red-600">
//                                               {
//                                                 errors[
//                                                   `quantity_${faultyStockId}`
//                                                 ]
//                                               }
//                                             </p>
//                                           )}
//                                         </div>

//                                         <div className="md:col-span-2">
//                                           <label
//                                             htmlFor={`remark-${faultyStockId}`}
//                                             className="mb-1.5 block text-sm font-medium text-gray-700"
//                                           >
//                                             Damage Remark:
//                                           </label>

//                                           <input
//                                             id={`remark-${faultyStockId}`}
//                                             type="text"
//                                             placeholder="Enter damage remark..."
//                                             value={
//                                               row.damageRemark
//                                             }
//                                             onChange={(e) =>
//                                               handleRowDataChange(
//                                                 faultyStockId,
//                                                 'damageRemark',
//                                                 e.target.value,
//                                               )
//                                             }
//                                             className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                           />
//                                         </div>
//                                       </div>

//                                       {/* Serialized Products */}
//                                       {isSerialized && (
//                                         <div className="mt-5">
//                                           <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
//                                             <label className="text-sm font-medium text-gray-700">
//                                               Select Serial Numbers (
//                                               {
//                                                 row.selectedSerials
//                                                   ?.length || 0
//                                               }{' '}
//                                               selected):
//                                             </label>

//                                             <span className="text-xs text-gray-500">
//                                               Total available:{' '}
//                                               {
//                                                 row.serialNumbers
//                                                   .length
//                                               }
//                                             </span>
//                                           </div>

//                                           <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                                             {row.serialNumbers &&
//                                             row.serialNumbers
//                                               .length > 0 ? (
//                                               row.serialNumbers.map(
//                                                 (
//                                                   serialNumber,
//                                                   index,
//                                                 ) => {
//                                                   const checked =
//                                                     row.selectedSerials?.includes(
//                                                       serialNumber,
//                                                     ) ||
//                                                     false

//                                                   return (
//                                                     <label
//                                                       key={`${serialNumber}-${index}`}
//                                                       htmlFor={`serial-${faultyStockId}-${index}`}
//                                                       className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
//                                                         checked
//                                                           ? 'border-blue-300 bg-blue-50 text-blue-700'
//                                                           : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
//                                                       }`}
//                                                     >
//                                                       <input
//                                                         id={`serial-${faultyStockId}-${index}`}
//                                                         type="checkbox"
//                                                         checked={
//                                                           checked
//                                                         }
//                                                         onChange={(
//                                                           e,
//                                                         ) =>
//                                                           handleSerialSelect(
//                                                             faultyStockId,
//                                                             serialNumber,
//                                                             e
//                                                               .target
//                                                               .checked,
//                                                           )
//                                                         }
//                                                         className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                                       />

//                                                       <span className="break-all">
//                                                         {
//                                                           serialNumber
//                                                         }
//                                                       </span>
//                                                     </label>
//                                                   )
//                                                 },
//                                               )
//                                             ) : (
//                                               <div className="col-span-full py-5 text-center text-sm text-gray-500">
//                                                 No damaged serial
//                                                 numbers available
//                                               </div>
//                                             )}
//                                           </div>
//                                         </div>
//                                       )}

//                                       {/* Non Serialized Note */}
//                                       {!isSerialized && (
//                                         <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
//                                           <strong>Note:</strong>{' '}
//                                           This is a non-serialized
//                                           product. You can transfer
//                                           any quantity up to{' '}
//                                           {row.damagedCount}{' '}
//                                           damaged items.
//                                         </div>
//                                       )}

//                                       {/* Status Summary */}
//                                       <div className="mt-4 rounded-md bg-gray-50 px-3 py-2">
//                                         <p className="text-xs text-gray-500">
//                                           Status:{' '}
//                                           <span className="font-medium text-green-600">
//                                             {statusCounts.damaged}{' '}
//                                             damaged
//                                           </span>{' '}
//                                           •{' '}
//                                           <span className="font-medium text-yellow-600">
//                                             {
//                                               statusCounts.underRepair
//                                             }{' '}
//                                             under repair
//                                           </span>{' '}
//                                           •{' '}
//                                           <span className="font-medium text-blue-600">
//                                             {
//                                               statusCounts.repaired
//                                             }{' '}
//                                             repaired
//                                           </span>{' '}
//                                           •{' '}
//                                           <span className="font-medium text-red-600">
//                                             {
//                                               statusCounts.irreparable
//                                             }{' '}
//                                             irreparable
//                                           </span>
//                                         </p>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               )
//                             },
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-4 py-4 md:px-6">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {submitting ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Submitting...
//                   </>
//                 ) : (
//                   'Transfer'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default TransferFaultyStock


import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../axiosInstance'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'

const TransferFaultyStock = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    repairCenterId: '',
    transferRemark: '',
  })

  const [centers, setCenters] = useState([])
  const [products, setProducts] = useState([])
  const [selectedRows, setSelectedRows] = useState({})
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    message: '',
  })

  const [expandedProducts, setExpandedProducts] = useState({})

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axiosInstance.get('/centers?centerType=Center')
        setCenters(res.data.data || [])
      } catch (error) {
        console.log('error fetching center', error)
        showAlert('danger', 'Failed to fetch center')
      }
    }

    fetchCenters()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/stockusage/faulty-stock')

      if (res.data.success) {
        console.log('Fetched products:', res.data.data)
        setProducts(res.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      showAlert('danger', 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (type, message) => {
    setAlert({
      visible: true,
      type,
      message,
    })

    setTimeout(() => {
      setAlert((prev) => ({
        ...prev,
        visible: false,
      }))
    }, 5000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  // Extract only damaged serials
  const extractDamagedSerials = (product) => {
    if (product.product?.trackSerialNumber === 'Yes') {
      return product.damagedSerialNumbers || []
    }

    return []
  }

  // Count damaged items
  const countDamagedItems = (product) => {
    return product.statusBreakdown?.damaged || 0
  }

  const handleRowSelect = (product) => {
    const faultyStockId = product._id
    const productId = product.product._id
    const damagedCount = countDamagedItems(product)
    const damagedSerials = extractDamagedSerials(product)

    setSelectedRows((prev) => ({
      ...prev,
      [faultyStockId]: prev[faultyStockId]
        ? undefined
        : {
            quantity: Math.min(damagedCount, product.quantity || 1),
            damageRemark: '',
            availableQuantity: damagedCount,
            damagedCount,
            serialNumbers: damagedSerials,
            selectedSerials: [],
            productId,
            faultyStockId,
            productName: product.product?.productTitle || 'Unknown Product',
            isSerialized: product.product?.trackSerialNumber === 'Yes',
          },
    }))

    setErrors((prev) => ({
      ...prev,
      products: '',
      [`quantity_${faultyStockId}`]: '',
    }))
  }

  const handleRowDataChange = (faultyStockId, field, value) => {
    setSelectedRows((prev) => ({
      ...prev,
      [faultyStockId]: {
        ...prev[faultyStockId],
        [field]: value,
      },
    }))
  }

  const handleQuantityChange = (faultyStockId, newQuantity) => {
    const row = selectedRows[faultyStockId]

    if (!row) return

    const maxQuantity = Math.min(row.damagedCount, row.availableQuantity)

    const validQuantity = Math.max(
      1,
      Math.min(newQuantity, maxQuantity),
    )

    if (row.isSerialized) {
      const autoSelectedSerials = row.serialNumbers.slice(0, validQuantity)

      setSelectedRows((prev) => ({
        ...prev,
        [faultyStockId]: {
          ...prev[faultyStockId],
          quantity: validQuantity,
          selectedSerials: autoSelectedSerials,
        },
      }))
    } else {
      setSelectedRows((prev) => ({
        ...prev,
        [faultyStockId]: {
          ...prev[faultyStockId],
          quantity: validQuantity,
        },
      }))
    }

    setErrors((prev) => ({
      ...prev,
      [`quantity_${faultyStockId}`]: '',
    }))
  }

  const handleSerialSelect = (
    faultyStockId,
    serialNumber,
    isChecked,
  ) => {
    const row = selectedRows[faultyStockId]

    if (!row || !row.isSerialized) return

    let updatedSelectedSerials = [
      ...(row.selectedSerials || []),
    ]

    if (isChecked) {
      if (!updatedSelectedSerials.includes(serialNumber)) {
        updatedSelectedSerials.push(serialNumber)
      }
    } else {
      updatedSelectedSerials = updatedSelectedSerials.filter(
        (sn) => sn !== serialNumber,
      )
    }

    setSelectedRows((prev) => ({
      ...prev,
      [faultyStockId]: {
        ...prev[faultyStockId],
        selectedSerials: updatedSelectedSerials,
        quantity: updatedSelectedSerials.length,
      },
    }))
  }

  const selectAllSerials = (faultyStockId) => {
    const row = selectedRows[faultyStockId]

    if (!row || !row.isSerialized) return

    setSelectedRows((prev) => ({
      ...prev,
      [faultyStockId]: {
        ...prev[faultyStockId],
        selectedSerials: [...row.serialNumbers],
        quantity: row.serialNumbers.length,
      },
    }))
  }

  const deselectAllSerials = (faultyStockId) => {
    const row = selectedRows[faultyStockId]

    if (!row) return

    setSelectedRows((prev) => ({
      ...prev,
      [faultyStockId]: {
        ...prev[faultyStockId],
        selectedSerials: [],
        quantity: 0,
      },
    }))
  }

  const toggleProductDetails = (faultyStockId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [faultyStockId]: !prev[faultyStockId],
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    if (!formData.repairCenterId) {
      newErrors.repairCenterId = 'Center is required'
    }

    const selectedProducts = Object.keys(selectedRows).filter(
      (id) => selectedRows[id],
    )

    if (selectedProducts.length === 0) {
      newErrors.products = 'At least one product must be selected'
    } else {
      selectedProducts.forEach((faultyStockId) => {
        const row = selectedRows[faultyStockId]

        if (row.quantity <= 0) {
          newErrors[`quantity_${faultyStockId}`] =
            'Quantity must be greater than 0'
        }

        if (row.quantity > row.damagedCount) {
          newErrors[`quantity_${faultyStockId}`] =
            `Cannot exceed available damaged items (${row.damagedCount})`
        }
      })
    }

    return newErrors
  }

  const prepareSubmitData = () => {
    const items = Object.keys(selectedRows)
      .filter((faultyStockId) => selectedRows[faultyStockId])
      .map((faultyStockId) => {
        const row = selectedRows[faultyStockId]

        const itemData = {
          productId: row.productId,
          quantity: parseInt(row.quantity) || 0,
          damageRemark: row.damageRemark || '',
        }

        if (
          row.isSerialized &&
          row.selectedSerials &&
          row.selectedSerials.length > 0
        ) {
          itemData.serialNumbers = row.selectedSerials
        }

        return itemData
      })

    return {
      items,
      repairCenterId: formData.repairCenterId,
      transferRemark: formData.transferRemark || '',
    }
  }

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      repairCenterId: '',
      transferRemark: '',
    })

    setSelectedRows({})
    setProductSearchTerm('')
    setErrors({})
    setExpandedProducts({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setSubmitting(false)
      showAlert(
        'warning',
        'Please fix the form errors before submitting',
      )
      return
    }

    try {
      const submitData = prepareSubmitData()

      console.log(
        'Submitting data:',
        JSON.stringify(submitData, null, 2),
      )

      const response = await axiosInstance.post(
        '/faulty-stock/transfer',
        submitData,
      )

      if (response.data.success) {
        showAlert(
          'success',
          'Faulty stock transferred successfully!',
        )

        setTimeout(() => {
          navigate('/faulty-stock')
        }, 1500)
      } else {
        showAlert(
          'danger',
          response.data.message ||
            'Failed to transfer faulty stock',
        )
      }
    } catch (error) {
      console.error(
        'Error transferring faulty stock:',
        error,
      )

      let errorMessage = 'Failed to transfer faulty stock'

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ')
      }

      showAlert('danger', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredProducts = products.filter((p) => {
    const search = productSearchTerm.toLowerCase()

    return (
      p.product?.productTitle
        ?.toLowerCase()
        .includes(search) ||
      p.product?._id?.toLowerCase().includes(search)
    )
  })

  const handleBack = () => {
    navigate('/faulty-stock')
  }

  const getStatusCounts = (product) => {
    if (product.statusBreakdown) {
      return {
        damaged: product.statusBreakdown.damaged || 0,
        underRepair: product.statusBreakdown.underRepair || 0,
        repaired: product.statusBreakdown.repaired || 0,
        irreparable: product.statusBreakdown.irreparable || 0,
      }
    }

    if (
      product.product?.trackSerialNumber === 'Yes' &&
      product.serialNumbers
    ) {
      return {
        damaged: product.serialNumbers.filter(
          (sn) => sn.status === 'damaged',
        ).length,
        underRepair: product.serialNumbers.filter(
          (sn) => sn.status === 'under_repair',
        ).length,
        repaired: product.serialNumbers.filter(
          (sn) => sn.status === 'repaired',
        ).length,
        irreparable: product.serialNumbers.filter(
          (sn) => sn.status === 'irreparable',
        ).length,
      }
    }

    return {
      damaged: product.damagedQty || 0,
      underRepair: product.underRepairQty || 0,
      repaired: product.repairedQty || 0,
      irreparable: product.irrepairedQty || 0,
    }
  }

  const selectedProductIds = Object.keys(selectedRows).filter(
    (id) => selectedRows[id],
  )

  const getAlertClasses = () => {
    switch (alert.type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800'
      case 'danger':
        return 'border-red-200 bg-red-50 text-red-800'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800'
    }
  }

  return (
     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      <div className="mx-auto max-w-[1600px]">
        {/* Page Header */}
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-md bg-[#2759a2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4784]"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <h1 className="mb-2 text-[24px] font-[450] leading-tight text-[#212529]">
              Transfer To Repair Team
            </h1>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-sm border border-gray-200 border-t-4 border-t-[#2759a2] bg-white shadow-sm">
          {/* Card Header */}
          <div className="flex items-center justify-end border-b border-gray-200 bg-white px-4 py-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-md bg-[#2759a2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4784]"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          {/* Alert */}
          {alert.visible && (
            <div
              className={`mx-4 mt-4 flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${getAlertClasses()}`}
            >
              <span>{alert.message}</span>

              <button
                type="button"
                onClick={() =>
                  setAlert((prev) => ({
                    ...prev,
                    visible: false,
                  }))
                }
                className="ml-4 opacity-70 transition hover:opacity-100"
              >
                <X size={17} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="p-4 md:p-5">
              {/* Basic Form */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Date */}
                <div>
                  <label
                    htmlFor="date"
                    className={`mb-1.5 block text-sm font-medium ${
                      errors.date
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}
                  >
                    Date <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                      errors.date
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : formData.date
                          ? 'border-green-400 focus:border-blue-500 focus:ring-blue-100'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  />

                  {errors.date && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Center */}
                <div>
                  <label
                    htmlFor="repairCenterId"
                    className={`mb-1.5 block text-sm font-medium ${
                      errors.repairCenterId
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}
                  >
                    Center <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="repairCenterId"
                    name="repairCenterId"
                    value={formData.repairCenterId}
                    onChange={handleChange}
                    className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                      errors.repairCenterId
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : formData.repairCenterId
                          ? 'border-green-400 focus:border-blue-500 focus:ring-blue-100'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  >
                    <option value="">Select Center</option>

                    {centers.map((center) => (
                      <option
                        key={center._id}
                        value={center._id}
                      >
                        {center.centerName}
                      </option>
                    ))}
                  </select>

                  {errors.repairCenterId && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.repairCenterId}
                    </p>
                  )}
                </div>

                {/* Remark */}
                <div>
                  <label
                    htmlFor="transferRemark"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Transfer Remark
                  </label>

                  <textarea
                    id="transferRemark"
                    name="transferRemark"
                    value={formData.transferRemark}
                    onChange={handleChange}
                    placeholder="Additional Comment for the transfer"
                    rows={3}
                    className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Products Section */}
              <div className="mt-6">
                <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Products
                    </h2>

                    {errors.products && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.products}
                      </p>
                    )}
                  </div>

                  <div className="flex w-full items-center gap-2 md:w-auto">
                    <label
                      htmlFor="product-search"
                      className="whitespace-nowrap text-sm font-medium text-gray-600"
                    >
                      Search:
                    </label>

                    <div className="relative w-full md:w-[280px]">
                      <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="product-search"
                        type="text"
                        value={productSearchTerm}
                        onChange={(e) =>
                          setProductSearchTerm(e.target.value)
                        }
                        placeholder="Search products..."
                        className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="flex min-h-[180px] items-center justify-center">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                  </div>
                ) : (
                  <>
                    {/* Product Table */}
                    <div className="max-h-[440px] overflow-y-auto overflow-x-auto rounded-sm border border-gray-200">
                      <table className="min-w-[850px] w-full border-collapse text-sm">
                        <thead className="sticky top-0 z-10 bg-white">
                          <tr>
                            <th className="border-b border-gray-200 bg-white px-3 py-3 text-left font-bold text-gray-900">
                              Select
                            </th>
                            <th className="border-b border-gray-200 bg-white px-3 py-3 text-left font-bold text-gray-900">
                              Product Name
                            </th>
                            <th className="border-b border-gray-200 bg-white px-3 py-3 text-center font-bold text-gray-900">
                              Total Items
                            </th>
                            <th className="border-b border-gray-200 bg-white px-3 py-3 text-center font-bold text-gray-900">
                              Damaged
                            </th>
                            <th className="border-b border-gray-200 bg-white px-3 py-3 text-center font-bold text-gray-900">
                              Under Repair
                            </th>
                            <th className="border-b border-gray-200 bg-white px-3 py-3 text-center font-bold text-gray-900">
                              Repaired
                            </th>
                            <th className="border-b border-gray-200 bg-white px-3 py-3 text-center font-bold text-gray-900">
                              Irreparable
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((p) => {
                              const statusCounts =
                                getStatusCounts(p)

                              const isSelected =
                                !!selectedRows[p._id]

                              return (
                                <tr
                                  key={p._id}
                                  className={`transition ${
                                    isSelected
                                      ? 'bg-[#dff0d8]'
                                      : 'odd:bg-white even:bg-[#f1f1f1] hover:bg-gray-100'
                                  }`}
                                >
                                  <td className="border-b border-gray-200 px-4 py-3">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() =>
                                        handleRowSelect(p)
                                      }
                                      className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                  </td>

                                  <td className="border-b border-gray-200 px-4 py-3 font-medium text-gray-800">
                                    {p.product?.productTitle ||
                                      'N/A'}
                                  </td>

                                  <td className="border-b border-gray-200 px-4 py-3 text-center text-gray-700">
                                    {p.quantity || 0}
                                  </td>

                                  <td
                                    className={`border-b border-gray-200 px-4 py-3 text-center font-semibold ${
                                      statusCounts.damaged > 0
                                        ? 'text-green-600'
                                        : 'text-gray-400'
                                    }`}
                                  >
                                    {statusCounts.damaged}
                                  </td>

                                  <td
                                    className={`border-b border-gray-200 px-4 py-3 text-center font-semibold ${
                                      statusCounts.underRepair >
                                      0
                                        ? 'text-yellow-600'
                                        : 'text-gray-400'
                                    }`}
                                  >
                                    {statusCounts.underRepair}
                                  </td>

                                  <td
                                    className={`border-b border-gray-200 px-4 py-3 text-center font-semibold ${
                                      statusCounts.repaired > 0
                                        ? 'text-blue-600'
                                        : 'text-gray-400'
                                    }`}
                                  >
                                    {statusCounts.repaired}
                                  </td>

                                  <td
                                    className={`border-b border-gray-200 px-4 py-3 text-center font-semibold ${
                                      statusCounts.irreparable >
                                      0
                                        ? 'text-red-600'
                                        : 'text-gray-400'
                                    }`}
                                  >
                                    {statusCounts.irreparable}
                                  </td>
                                </tr>
                              )
                            })
                          ) : (
                            <tr>
                              <td
                                colSpan={7}
                                className="px-4 py-10 text-center text-gray-500"
                              >
                                No faulty products found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Selected Products */}
                    {selectedProductIds.length > 0 && (
                      <div className="mt-5 overflow-hidden rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-800">
                              Selected Products Details
                            </h3>

                            <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                              {selectedProductIds.length}{' '}
                              selected
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 p-4">
                          {selectedProductIds.map(
                            (faultyStockId) => {
                              const row =
                                selectedRows[faultyStockId]

                              const product = products.find(
                                (p) =>
                                  p._id === faultyStockId,
                              )

                              const statusCounts =
                                getStatusCounts(product || {})

                              const isSerialized =
                                row.isSerialized

                              const isExpanded =
                                expandedProducts[
                                  faultyStockId
                                ]

                              return (
                                <div
                                  key={faultyStockId}
                                  className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                                >
                                  {/* Selected Product Header */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleProductDetails(
                                        faultyStockId,
                                      )
                                    }
                                    className="flex w-full items-center justify-between gap-3 bg-gray-50 px-4 py-3 text-left transition hover:bg-gray-100"
                                  >
                                    <div className="flex min-w-0 items-center gap-3">
                                      {isExpanded ? (
                                        <ChevronUp
                                          size={18}
                                          className="shrink-0 text-gray-500"
                                        />
                                      ) : (
                                        <ChevronDown
                                          size={18}
                                          className="shrink-0 text-gray-500"
                                        />
                                      )}

                                      <div className="min-w-0">
                                        <h4 className="truncate font-semibold text-gray-800">
                                          {row.productName}
                                        </h4>

                                        <span
                                          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                            isSerialized
                                              ? 'bg-blue-100 text-blue-700'
                                              : 'bg-gray-200 text-gray-700'
                                          }`}
                                        >
                                          {isSerialized
                                            ? 'Serialized Product'
                                            : 'Non-Serialized Product'}
                                        </span>
                                      </div>
                                    </div>

                                    <span className="text-xs text-gray-500">
                                      {row.quantity} /{' '}
                                      {row.damagedCount}
                                    </span>
                                  </button>

                                  {isExpanded && (
                                    <div className="border-t border-gray-200 p-4">
                                      {/* Serial Actions */}
                                      {isSerialized && (
                                        <div className="mb-4 flex flex-wrap justify-end gap-2">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              selectAllSerials(
                                                faultyStockId,
                                              )
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-md border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-50"
                                          >
                                            <Check size={14} />
                                            Select All (
                                            {
                                              row.serialNumbers
                                                .length
                                            }
                                            )
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              deselectAllSerials(
                                                faultyStockId,
                                              )
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                          >
                                            <X size={14} />
                                            Deselect All
                                          </button>
                                        </div>
                                      )}

                                      {/* Quantity & Remark */}
                                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div>
                                          <label
                                            htmlFor={`quantity-${faultyStockId}`}
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                          >
                                            Quantity to Transfer:
                                          </label>

                                          <input
                                            id={`quantity-${faultyStockId}`}
                                            type="number"
                                            min="1"
                                            max={
                                              row.damagedCount
                                            }
                                            value={row.quantity}
                                            onChange={(e) =>
                                              handleQuantityChange(
                                                faultyStockId,
                                                parseInt(
                                                  e.target.value,
                                                ) || 1,
                                              )
                                            }
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                          />

                                          <p className="mt-1 text-xs text-gray-500">
                                            Available damaged
                                            items:{' '}
                                            {
                                              row.damagedCount
                                            }
                                          </p>

                                          {errors[
                                            `quantity_${faultyStockId}`
                                          ] && (
                                            <p className="mt-1 text-xs text-red-600">
                                              {
                                                errors[
                                                  `quantity_${faultyStockId}`
                                                ]
                                              }
                                            </p>
                                          )}
                                        </div>

                                        <div className="md:col-span-2">
                                          <label
                                            htmlFor={`remark-${faultyStockId}`}
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                          >
                                            Damage Remark:
                                          </label>

                                          <input
                                            id={`remark-${faultyStockId}`}
                                            type="text"
                                            placeholder="Enter damage remark..."
                                            value={
                                              row.damageRemark
                                            }
                                            onChange={(e) =>
                                              handleRowDataChange(
                                                faultyStockId,
                                                'damageRemark',
                                                e.target.value,
                                              )
                                            }
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                          />
                                        </div>
                                      </div>

                                      {/* Serialized Products */}
                                      {isSerialized && (
                                        <div className="mt-5">
                                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                            <label className="text-sm font-medium text-gray-700">
                                              Select Serial Numbers (
                                              {
                                                row.selectedSerials
                                                  ?.length || 0
                                              }{' '}
                                              selected):
                                            </label>

                                            <span className="text-xs text-gray-500">
                                              Total available:{' '}
                                              {
                                                row.serialNumbers
                                                  .length
                                              }
                                            </span>
                                          </div>

                                          <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                            {row.serialNumbers &&
                                            row.serialNumbers
                                              .length > 0 ? (
                                              row.serialNumbers.map(
                                                (
                                                  serialNumber,
                                                  index,
                                                ) => {
                                                  const checked =
                                                    row.selectedSerials?.includes(
                                                      serialNumber,
                                                    ) ||
                                                    false

                                                  return (
                                                    <label
                                                      key={`${serialNumber}-${index}`}
                                                      htmlFor={`serial-${faultyStockId}-${index}`}
                                                      className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                                                        checked
                                                          ? 'border-blue-300 bg-blue-50 text-blue-700'
                                                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                                      }`}
                                                    >
                                                      <input
                                                        id={`serial-${faultyStockId}-${index}`}
                                                        type="checkbox"
                                                        checked={
                                                          checked
                                                        }
                                                        onChange={(
                                                          e,
                                                        ) =>
                                                          handleSerialSelect(
                                                            faultyStockId,
                                                            serialNumber,
                                                            e
                                                              .target
                                                              .checked,
                                                          )
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                      />

                                                      <span className="break-all">
                                                        {
                                                          serialNumber
                                                        }
                                                      </span>
                                                    </label>
                                                  )
                                                },
                                              )
                                            ) : (
                                              <div className="col-span-full py-5 text-center text-sm text-gray-500">
                                                No damaged serial
                                                numbers available
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Non Serialized Note */}
                                      {!isSerialized && (
                                        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                                          <strong>Note:</strong>{' '}
                                          This is a non-serialized
                                          product. You can transfer
                                          any quantity up to{' '}
                                          {row.damagedCount}{' '}
                                          damaged items.
                                        </div>
                                      )}

                                      {/* Status Summary */}
                                      <div className="mt-4 rounded-md bg-gray-50 px-3 py-2">
                                        <p className="text-xs text-gray-500">
                                          Status:{' '}
                                          <span className="font-medium text-green-600">
                                            {statusCounts.damaged}{' '}
                                            damaged
                                          </span>{' '}
                                          •{' '}
                                          <span className="font-medium text-yellow-600">
                                            {
                                              statusCounts.underRepair
                                            }{' '}
                                            under repair
                                          </span>{' '}
                                          •{' '}
                                          <span className="font-medium text-blue-600">
                                            {
                                              statusCounts.repaired
                                            }{' '}
                                            repaired
                                          </span>{' '}
                                          •{' '}
                                          <span className="font-medium text-red-600">
                                            {
                                              statusCounts.irreparable
                                            }{' '}
                                            irreparable
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            },
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-4 py-4 md:px-6">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-md bg-[#2759a2] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4784] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Submitting...
                  </>
                ) : (
                  'Transfer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TransferFaultyStock