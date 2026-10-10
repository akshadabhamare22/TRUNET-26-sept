// import React, { useEffect, useState } from 'react';
// import { ArrowLeft, Search, X } from 'lucide-react';
// import { useNavigate, useParams } from 'react-router-dom';
// import Select from 'react-select';

// import axiosInstance from '../../axiosInstance';

// const AddReportSubmission = () => {
//   const [productSearchTerm, setProductSearchTerm] =
//     useState('');

//   const [selectedRows, setSelectedRows] =
//     useState({});

//   const [loading, setLoading] =
//     useState(true);

//   const [products, setProducts] =
//     useState([]);

//   const [alert, setAlert] = useState({
//     type: '',
//     message: '',
//   });

//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     date: new Date()
//       .toISOString()
//       .split('T')[0],
//     remark: '',
//   });

//   const [errors, setErrors] =
//     useState({});

//   const [centers, setCenters] =
//     useState([]);

//   const [otherCenter, setOtherCenter] =
//     useState(false);

//   const [centerId, setCenterId] =
//     useState('');

//   const userCenter =
//     JSON.parse(
//       localStorage.getItem('userCenter')
//     ) || {};

//   const userCenterType = (
//     userCenter.centerType || 'Outlet'
//   ).toLowerCase();

//   /* =========================================================
//      FETCH CENTERS
//   ========================================================= */

//   useEffect(() => {
//     const fetchCenters = async () => {
//       try {
//         const res =
//           await axiosInstance.get(
//             '/centers'
//           );

//         setCenters(
//           res.data.data || []
//         );
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchCenters();
//   }, []);

//   /* =========================================================
//      LOAD PRODUCTS / EXISTING SUBMISSION
//   ========================================================= */

//   useEffect(() => {
//     const loadData = async () => {
//       await fetchProducts();

//       if (id) {
//         await fetchExistingSubmission(id);
//       }
//     };

//     loadData();
//   }, [id]);

//   /* =========================================================
//      FETCH EXISTING SUBMISSION
//   ========================================================= */

//   const fetchExistingSubmission = async (
//     submissionId
//   ) => {
//     try {
//       const res =
//         await axiosInstance.get(
//           `/reportsubmission/${submissionId}`
//         );

//       const data = res.data.data;

//       setFormData({
//         date: data.date
//           ? new Date(data.date)
//               .toISOString()
//               .split('T')[0]
//           : new Date()
//               .toISOString()
//               .split('T')[0],

//         remark: data.remark || '',
//       });

//       setOtherCenter(
//         data.stockClosingForOtherCenter ||
//           false
//       );

//       setCenterId(
//         data.center?._id || ''
//       );

//       const existingSelectedRows =
//         {};

//       if (
//         data.products &&
//         Array.isArray(data.products)
//       ) {
//         data.products.forEach(
//           (product) => {
//             const productId =
//               product.product?._id ||
//               product.product;

//             existingSelectedRows[
//               productId
//             ] = {
//               productQty:
//                 product.productQty ||
//                 0,

//               damageQty:
//                 product.damageQty ||
//                 0,

//               comment:
//                 product.comment || '',
//             };
//           }
//         );

//         setSelectedRows(
//           existingSelectedRows
//         );
//       }
//     } catch (error) {
//       console.log(
//         'Error fetching existing submission',
//         error
//       );
//     }
//   };

//   /* =========================================================
//      FETCH PRODUCTS
//   ========================================================= */

//   const fetchProducts = async () => {
//     try {
//       const res =
//         await axiosInstance.get(
//           '/stocktransfer/summary/original-outlet'
//         );

//       if (res.data.success) {
//         const productSummary =
//           res.data.data?.summary || [];

//         setProducts(
//           productSummary
//         );

//         if (!id) {
//           const initialSelectedRows =
//             {};

//           productSummary.forEach(
//             (product) => {
//               initialSelectedRows[
//                 product.productId
//               ] = {
//                 productQty:
//                   product.currentStock
//                     ?.warehouse
//                     ?.available ||
//                   product.currentStock
//                     ?.center
//                     ?.available ||
//                   0,

//                 damageQty:
//                   product.currentStock
//                     ?.distributedCenters
//                     ?.damaged ||
//                   0,

//                 comment: '',
//               };
//             }
//           );

//           setSelectedRows(
//             initialSelectedRows
//           );
//         }
//       }
//     } catch (error) {
//       console.error(
//         'Error fetching products:',
//         error
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================================================
//      PRODUCT ROW INPUT
//   ========================================================= */

//   const handleRowInputChange = (
//     productId,
//     field,
//     value
//   ) => {
//     setSelectedRows((prev) => ({
//       ...prev,

//       [productId]: {
//         ...prev[productId],

//         [field]: value,
//       },
//     }));
//   };

//   /* =========================================================
//      FORM CHANGE
//   ========================================================= */

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
//       [name]: '',
//     }));
//   };

//   /* =========================================================
//      CENTER CHANGE
//   ========================================================= */

//   const handleCenterChange = (e) => {
//     setCenterId(
//       e.target.value
//     );

//     setErrors((prev) => ({
//       ...prev,
//       centerId: '',
//     }));
//   };

//   /* =========================================================
//      SUBMIT
//   ========================================================= */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};

//     if (!formData.date) {
//       newErrors.date =
//         'This is a required field';
//     }

//     if (
//       otherCenter &&
//       !centerId
//     ) {
//       newErrors.centerId =
//         'This is a required field';
//     }

//     if (!formData.remark) {
//       newErrors.remark =
//         'This is a required field';
//     }

//     /*
//       Product validation intentionally
//       remains disabled as in the original.
//     */

//     if (
//       Object.keys(newErrors).length
//     ) {
//       setErrors(newErrors);
//       return;
//     }

//     const submissionData = {
//       date: formData.date,

//       stockClosingForOtherCenter:
//         otherCenter,

//       center: otherCenter
//         ? centerId
//         : undefined,

//       remark:
//         formData.remark,

//       products:
//         Object.keys(selectedRows)
//           .filter(
//             (productId) =>
//               Number(
//                 selectedRows[
//                   productId
//                 ].productQty
//               ) > 0 ||
//               Number(
//                 selectedRows[
//                   productId
//                 ].damageQty
//               ) > 0 ||
//               selectedRows[
//                 productId
//               ].comment !== ''
//           )
//           .map(
//             (productId) => ({
//               product:
//                 productId,

//               productQty:
//                 Number(
//                   selectedRows[
//                     productId
//                   ].productQty
//                 ) || 0,

//               damageQty:
//                 Number(
//                   selectedRows[
//                     productId
//                   ].damageQty
//                 ) || 0,

//               comment:
//                 selectedRows[
//                   productId
//                 ].comment || '',
//             })
//           ),

//       status: 'Submitted',
//     };

//     if (!otherCenter) {
//       delete submissionData.center;
//     }

//     try {
//       if (id) {
//         await axiosInstance.put(
//           `/reportsubmission/${id}`,
//           submissionData
//         );

//         setAlert({
//           type: 'success',
//           message:
//             'Report submission updated successfully!',
//         });
//       } else {
//         await axiosInstance.post(
//           '/reportsubmission',
//           submissionData
//         );

//         setAlert({
//           type: 'success',
//           message:
//             'Report submission created successfully!',
//         });
//       }

//       setTimeout(
//         () =>
//           navigate(
//             '/report-submission'
//           ),
//         1500
//       );
//     } catch (error) {
//       console.error(
//         'Error saving shifting request:',
//         error
//       );

//       let message =
//         'Failed to save report submission. Please try again!';

//       if (error.response) {
//         const data =
//           error.response.data;

//         if (
//           data.errors &&
//           Array.isArray(data.errors)
//         ) {
//           message =
//             data.errors.join(
//               ', '
//             );
//         } else {
//           message =
//             data.message ||
//             data.error ||
//             message;
//         }

//         if (
//           data.message ===
//           'Only the closing center can update stockClosingForOtherCenter field'
//         ) {
//           message =
//             'Only the closing center can update stockClosingForOtherCenter field';
//         }
//       } else if (error.request) {
//         message =
//           'No response from server. Please check your connection.';
//       } else {
//         message =
//           error.message;
//       }

//       setAlert({
//         type: 'danger',
//         message,
//       });
//     }
//   };

//   /* =========================================================
//      BACK
//   ========================================================= */

//   const handleBack = () => {
//     navigate(
//       '/report-submission'
//     );
//   };

//   /* =========================================================
//      FILTER PRODUCTS
//   ========================================================= */

//   const filteredProducts =
//     products.filter((product) =>
//       product.productName
//         ?.toLowerCase()
//         .includes(
//           productSearchTerm.toLowerCase()
//         )
//     );

//   /* =========================================================
//      SELECT STYLES
//   ========================================================= */

//   const selectStyles = {
//     control: (
//       base,
//       state
//     ) => ({
//       ...base,
//       minHeight: '40px',
//       borderColor:
//         state.isFocused
//           ? '#3b82f6'
//           : '#d1d5db',
//       boxShadow:
//         state.isFocused
//           ? '0 0 0 1px #3b82f6'
//           : 'none',
//       '&:hover': {
//         borderColor:
//           '#9ca3af',
//       },
//     }),

//     menu: (base) => ({
//       ...base,
//       zIndex: 9999,
//     }),
//   };

//   /* =========================================================
//      RENDER
//   ========================================================= */

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       {/* PAGE HEADER */}

//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
//         <button
//           type="button"
//           onClick={handleBack}
//           className="inline-flex w-fit items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
//         >
//           <ArrowLeft size={17} />
//           Back
//         </button>

//         <h1 className="text-2xl font-semibold text-gray-800">
//           {id ? 'Edit' : 'Add'} Closing
//           Stock
//         </h1>
//       </div>

//       {/* MAIN CARD */}

//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         <div className="p-5">
//           {/* ALERT */}

//           {alert.message && (
//             <div
//               className={`mb-5 flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${
//                 alert.type ===
//                 'success'
//                   ? 'border-green-200 bg-green-50 text-green-700'
//                   : 'border-red-200 bg-red-50 text-red-700'
//               }`}
//             >
//               <span>
//                 {alert.message}
//               </span>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setAlert({
//                     type: '',
//                     message: '',
//                   })
//                 }
//                 className="ml-4 rounded p-1 hover:bg-black/5"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           )}

//           <form
//             onSubmit={handleSubmit}
//           >
//             {/* =================================================
//                 BASIC DETAILS
//             ================================================== */}

//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//               {/* DATE */}

//               <div>
//                 <label
//                   htmlFor="date"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Date{' '}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   value={
//                     formData.date
//                   }
//                   onChange={
//                     handleChange
//                   }
//                   className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
//                     errors.date
//                       ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
//                       : formData.date
//                         ? 'border-green-300 focus:border-blue-500 focus:ring-blue-100'
//                         : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
//                   }`}
//                 />

//                 {errors.date && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.date}
//                   </p>
//                 )}
//               </div>

//               {/* OTHER CENTER */}

//               {userCenterType ===
//                 'outlet' && (
//                 <div className="flex items-center pt-7">
//                   <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
//                     <input
//                       type="checkbox"
//                       checked={
//                         otherCenter
//                       }
//                       onChange={(e) =>
//                         setOtherCenter(
//                           e.target.checked
//                         )
//                       }
//                       className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     />

//                     <span>
//                       Stock closing for
//                       other center
//                     </span>
//                   </label>
//                 </div>
//               )}

//               {/* CENTER */}

//               {otherCenter && (
//                 <div>
//                   <label
//                     htmlFor="centerId"
//                     className="mb-1.5 block text-sm font-medium text-gray-700"
//                   >
//                     Branch{' '}
//                     <span className="text-red-500">
//                       *
//                     </span>
//                   </label>

//                   <Select
//                     inputId="centerId"
//                     name="centerId"
//                     value={
//                       centers.find(
//                         (center) =>
//                           center._id ===
//                           centerId
//                       )
//                         ? {
//                             label:
//                               centers.find(
//                                 (center) =>
//                                   center._id ===
//                                   centerId
//                               )
//                                 ?.centerName,
//                             value:
//                               centerId,
//                           }
//                         : null
//                     }
//                     onChange={(
//                       selected
//                     ) =>
//                       handleCenterChange(
//                         {
//                           target: {
//                             name:
//                               'centerId',
//                             value:
//                               selected
//                                 ? selected.value
//                                 : '',
//                           },
//                         }
//                       )
//                     }
//                     options={centers.map(
//                       (center) => ({
//                         label:
//                           center.centerName,
//                         value:
//                           center._id,
//                       })
//                     )}
//                     placeholder="Search Branch"
//                     styles={
//                       selectStyles
//                     }
//                     classNamePrefix="react-select"
//                   />

//                   {errors.centerId && (
//                     <p className="mt-1 text-xs text-red-600">
//                       {errors.centerId}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* REMARK */}

//               <div
//                 className={
//                   otherCenter
//                     ? ''
//                     : 'md:col-span-2'
//                 }
//               >
//                 <label
//                   htmlFor="remark"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Remark{' '}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <textarea
//                   id="remark"
//                   name="remark"
//                   rows={3}
//                   value={
//                     formData.remark
//                   }
//                   onChange={
//                     handleChange
//                   }
//                   placeholder="Remark"
//                   className={`w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
//                     errors.remark
//                       ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
//                       : formData.remark
//                         ? 'border-green-300 focus:border-blue-500 focus:ring-blue-100'
//                         : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
//                   }`}
//                 />

//                 {errors.remark && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.remark}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* =================================================
//                 PRODUCTS
//             ================================================== */}

//             <div className="mt-8">
//               <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-800">
//                     Products
//                   </h2>

//                   {errors.products && (
//                     <p className="mt-1 text-xs text-red-600">
//                       {errors.products}
//                     </p>
//                   )}
//                 </div>

//                 {/* SEARCH */}

//                 <div className="relative w-full sm:w-[280px]">
//                   <Search
//                     size={17}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                   />

//                   <input
//                     type="text"
//                     value={
//                       productSearchTerm
//                     }
//                     onChange={(e) =>
//                       setProductSearchTerm(
//                         e.target.value
//                       )
//                     }
//                     placeholder="Search products..."
//                     className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   />
//                 </div>
//               </div>

//               {/* LOADING */}

//               {loading ? (
//                 <div className="flex min-h-[180px] items-center justify-center">
//                   <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto rounded-lg border border-gray-200">
//                   <table className="w-full min-w-[900px] border-collapse text-sm">
//                     <thead>
//                       <tr className="bg-gray-100 text-left">
//                         <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                           #
//                         </th>

//                         <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                           Product
//                         </th>

//                         <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                           Current Stock
//                         </th>

//                         <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                           Product Qty
//                         </th>

//                         <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                           Damage Qty
//                         </th>

//                         <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                           Comment
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {filteredProducts.length >
//                       0 ? (
//                         filteredProducts.map(
//                           (
//                             product,
//                             index
//                           ) => (
//                             <tr
//                               key={
//                                 product.productId
//                               }
//                               className="border-b border-gray-100 transition hover:bg-gray-50"
//                             >
//                               <td className="px-4 py-3 text-gray-600">
//                                 {index +
//                                   1}
//                               </td>

//                               <td className="px-4 py-3 font-medium text-gray-800">
//                                 {
//                                   product.productName
//                                 }
//                               </td>

//                               <td className="px-4 py-3 text-gray-700">
//                                 {product
//                                   .currentStock
//                                   ?.warehouse
//                                   ?.available ||
//                                   product
//                                     .currentStock
//                                     ?.center
//                                     ?.available ||
//                                   0}
//                               </td>

//                               {/* PRODUCT QTY */}

//                               <td className="px-4 py-3">
//                                 <input
//                                   type="number"
//                                   min="0"
//                                   value={
//                                     selectedRows[
//                                       product
//                                         .productId
//                                     ]
//                                       ?.productQty ||
//                                     0
//                                   }
//                                   onChange={(
//                                     e
//                                   ) =>
//                                     handleRowInputChange(
//                                       product.productId,
//                                       'productQty',
//                                       e.target
//                                         .value
//                                     )
//                                   }
//                                   placeholder="0"
//                                   className="w-full min-w-[120px] rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                 />
//                               </td>

//                               {/* DAMAGE QTY */}

//                               <td className="px-4 py-3 text-gray-700">
//                                 {selectedRows[
//                                   product
//                                     .productId
//                                 ]
//                                   ?.damageQty ||
//                                   0}
//                               </td>

//                               {/* COMMENT */}

//                               <td className="px-4 py-3">
//                                 <input
//                                   type="text"
//                                   value={
//                                     selectedRows[
//                                       product
//                                         .productId
//                                     ]
//                                       ?.comment ||
//                                     ''
//                                   }
//                                   onChange={(
//                                     e
//                                   ) =>
//                                     handleRowInputChange(
//                                       product.productId,
//                                       'comment',
//                                       e.target
//                                         .value
//                                     )
//                                   }
//                                   placeholder="Add comment..."
//                                   className="w-full min-w-[180px] rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                 />
//                               </td>
//                             </tr>
//                           )
//                         )
//                       ) : (
//                         <tr>
//                           <td
//                             colSpan={6}
//                             className="px-4 py-10 text-center text-sm text-gray-500"
//                           >
//                             No products found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>

//             {/* =================================================
//                 FOOTER
//             ================================================== */}

//             <div className="mt-6 flex justify-end border-t border-gray-200 pt-5">
//               <button
//                 type="submit"
//                 className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
//               >
//                 {id
//                   ? 'Update'
//                   : 'Submit'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddReportSubmission;


import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

import axiosInstance from '../../axiosInstance';

const AddReportSubmission = () => {
  const [productSearchTerm, setProductSearchTerm] =
    useState('');

  const [selectedRows, setSelectedRows] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [products, setProducts] =
    useState([]);

  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    date: new Date()
      .toISOString()
      .split('T')[0],
    remark: '',
  });

  const [errors, setErrors] =
    useState({});

  const [centers, setCenters] =
    useState([]);

  const [otherCenter, setOtherCenter] =
    useState(false);

  const [centerId, setCenterId] =
    useState('');

  const userCenter =
    JSON.parse(
      localStorage.getItem('userCenter')
    ) || {};

  const userCenterType = (
    userCenter.centerType || 'Outlet'
  ).toLowerCase();

  /* =========================================================
     FETCH CENTERS
  ========================================================= */

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res =
          await axiosInstance.get(
            '/centers'
          );

        setCenters(
          res.data.data || []
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchCenters();
  }, []);

  /* =========================================================
     LOAD PRODUCTS / EXISTING SUBMISSION
  ========================================================= */

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();

      if (id) {
        await fetchExistingSubmission(id);
      }
    };

    loadData();
  }, [id]);

  /* =========================================================
     FETCH EXISTING SUBMISSION
  ========================================================= */

  const fetchExistingSubmission = async (
    submissionId
  ) => {
    try {
      const res =
        await axiosInstance.get(
          `/reportsubmission/${submissionId}`
        );

      const data = res.data.data;

      setFormData({
        date: data.date
          ? new Date(data.date)
              .toISOString()
              .split('T')[0]
          : new Date()
              .toISOString()
              .split('T')[0],

        remark: data.remark || '',
      });

      setOtherCenter(
        data.stockClosingForOtherCenter ||
          false
      );

      setCenterId(
        data.center?._id || ''
      );

      const existingSelectedRows =
        {};

      if (
        data.products &&
        Array.isArray(data.products)
      ) {
        data.products.forEach(
          (product) => {
            const productId =
              product.product?._id ||
              product.product;

            existingSelectedRows[
              productId
            ] = {
              productQty:
                product.productQty ||
                0,

              damageQty:
                product.damageQty ||
                0,

              comment:
                product.comment || '',
            };
          }
        );

        setSelectedRows(
          existingSelectedRows
        );
      }
    } catch (error) {
      console.log(
        'Error fetching existing submission',
        error
      );
    }
  };

  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

  const fetchProducts = async () => {
    try {
      const res =
        await axiosInstance.get(
          '/stocktransfer/summary/original-outlet'
        );

      if (res.data.success) {
        const productSummary =
          res.data.data?.summary || [];

        setProducts(
          productSummary
        );

        if (!id) {
          const initialSelectedRows =
            {};

          productSummary.forEach(
            (product) => {
              initialSelectedRows[
                product.productId
              ] = {
                productQty:
                  product.currentStock
                    ?.warehouse
                    ?.available ||
                  product.currentStock
                    ?.center
                    ?.available ||
                  0,

                damageQty:
                  product.currentStock
                    ?.distributedCenters
                    ?.damaged ||
                  0,

                comment: '',
              };
            }
          );

          setSelectedRows(
            initialSelectedRows
          );
        }
      }
    } catch (error) {
      console.error(
        'Error fetching products:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     PRODUCT ROW INPUT
  ========================================================= */

  const handleRowInputChange = (
    productId,
    field,
    value
  ) => {
    setSelectedRows((prev) => ({
      ...prev,

      [productId]: {
        ...prev[productId],

        [field]: value,
      },
    }));
  };

  /* =========================================================
     FORM CHANGE
  ========================================================= */

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
      [name]: '',
    }));
  };

  /* =========================================================
     CENTER CHANGE
  ========================================================= */

  const handleCenterChange = (e) => {
    setCenterId(
      e.target.value
    );

    setErrors((prev) => ({
      ...prev,
      centerId: '',
    }));
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.date) {
      newErrors.date =
        'This is a required field';
    }

    if (
      otherCenter &&
      !centerId
    ) {
      newErrors.centerId =
        'This is a required field';
    }

    if (!formData.remark) {
      newErrors.remark =
        'This is a required field';
    }

    /*
      Product validation intentionally
      remains disabled as in the original.
    */

    if (
      Object.keys(newErrors).length
    ) {
      setErrors(newErrors);
      return;
    }

    const submissionData = {
      date: formData.date,

      stockClosingForOtherCenter:
        otherCenter,

      center: otherCenter
        ? centerId
        : undefined,

      remark:
        formData.remark,

      products:
        Object.keys(selectedRows)
          .filter(
            (productId) =>
              Number(
                selectedRows[
                  productId
                ].productQty
              ) > 0 ||
              Number(
                selectedRows[
                  productId
                ].damageQty
              ) > 0 ||
              selectedRows[
                productId
              ].comment !== ''
          )
          .map(
            (productId) => ({
              product:
                productId,

              productQty:
                Number(
                  selectedRows[
                    productId
                  ].productQty
                ) || 0,

              damageQty:
                Number(
                  selectedRows[
                    productId
                  ].damageQty
                ) || 0,

              comment:
                selectedRows[
                  productId
                ].comment || '',
            })
          ),

      status: 'Submitted',
    };

    if (!otherCenter) {
      delete submissionData.center;
    }

    try {
      if (id) {
        await axiosInstance.put(
          `/reportsubmission/${id}`,
          submissionData
        );

        setAlert({
          type: 'success',
          message:
            'Report submission updated successfully!',
        });
      } else {
        await axiosInstance.post(
          '/reportsubmission',
          submissionData
        );

        setAlert({
          type: 'success',
          message:
            'Report submission created successfully!',
        });
      }

      setTimeout(
        () =>
          navigate(
            '/report-submission'
          ),
        1500
      );
    } catch (error) {
      console.error(
        'Error saving shifting request:',
        error
      );

      let message =
        'Failed to save report submission. Please try again!';

      if (error.response) {
        const data =
          error.response.data;

        if (
          data.errors &&
          Array.isArray(data.errors)
        ) {
          message =
            data.errors.join(
              ', '
            );
        } else {
          message =
            data.message ||
            data.error ||
            message;
        }

        if (
          data.message ===
          'Only the closing center can update stockClosingForOtherCenter field'
        ) {
          message =
            'Only the closing center can update stockClosingForOtherCenter field';
        }
      } else if (error.request) {
        message =
          'No response from server. Please check your connection.';
      } else {
        message =
          error.message;
      }

      setAlert({
        type: 'danger',
        message,
      });
    }
  };

  /* =========================================================
     BACK
  ========================================================= */

  const handleBack = () => {
    navigate(
      '/report-submission'
    );
  };

  /* =========================================================
     FILTER PRODUCTS
  ========================================================= */

  const filteredProducts =
    products.filter((product) =>
      product.productName
        ?.toLowerCase()
        .includes(
          productSearchTerm.toLowerCase()
        )
    );

  /* =========================================================
     SELECT STYLES
  ========================================================= */

  const selectStyles = {
    control: (
      base,
      state
    ) => ({
      ...base,
      minHeight: '40px',
      borderColor:
        state.isFocused
          ? '#3b82f6'
          : '#d1d5db',
      boxShadow:
        state.isFocused
          ? '0 0 0 1px #3b82f6'
          : 'none',
      '&:hover': {
        borderColor:
          '#9ca3af',
      },
    }),

    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* PAGE HEADER */}

      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex w-fit items-center gap-2 rounded-md bg-[#2759a2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b] focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
          {id ? 'Edit' : 'Add'} Closing
          Stock
        </h1>
      </div>

      {/* MAIN CARD */}

      <div className="overflow-hidden rounded-md border-t-4 border-t-[#2759a2] border-x border-b border-gray-200 bg-white shadow-sm">
        <div className="p-4 sm:p-5">
          {/* ALERT */}

          {alert.message && (
            <div
              className={`mb-5 flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${
                alert.type ===
                'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              <span>
                {alert.message}
              </span>

              <button
                type="button"
                onClick={() =>
                  setAlert({
                    type: '',
                    message: '',
                  })
                }
                className="ml-4 rounded p-1 hover:bg-black/5"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >
            {/* =================================================
                BASIC DETAILS
            ================================================== */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
              {/* DATE */}

              <div>
                <label
                  htmlFor="date"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Date{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="date"
                  id="date"
                  name="date"
                  value={
                    formData.date
                  }
                  onChange={
                    handleChange
                  }
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                    errors.date
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                      : formData.date
                        ? 'border-green-300 focus:border-blue-500 focus:ring-blue-100'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />

                {errors.date && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.date}
                  </p>
                )}
              </div>

              {/* OTHER CENTER */}

              {userCenterType ===
                'outlet' && (
                <div className="flex items-center pt-7">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={
                        otherCenter
                      }
                      onChange={(e) =>
                        setOtherCenter(
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                    <span>
                      Stock closing for
                      other center
                    </span>
                  </label>
                </div>
              )}

              {/* CENTER */}

              {otherCenter && (
                <div>
                  <label
                    htmlFor="centerId"
                    className="mb-1.5 block text-sm font-semibold text-gray-700"
                  >
                    Branch{' '}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <Select
                    inputId="centerId"
                    name="centerId"
                    value={
                      centers.find(
                        (center) =>
                          center._id ===
                          centerId
                      )
                        ? {
                            label:
                              centers.find(
                                (center) =>
                                  center._id ===
                                  centerId
                              )
                                ?.centerName,
                            value:
                              centerId,
                          }
                        : null
                    }
                    onChange={(
                      selected
                    ) =>
                      handleCenterChange(
                        {
                          target: {
                            name:
                              'centerId',
                            value:
                              selected
                                ? selected.value
                                : '',
                          },
                        }
                      )
                    }
                    options={centers.map(
                      (center) => ({
                        label:
                          center.centerName,
                        value:
                          center._id,
                      })
                    )}
                    placeholder="Search Branch"
                    styles={
                      selectStyles
                    }
                    classNamePrefix="react-select"
                  />

                  {errors.centerId && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.centerId}
                    </p>
                  )}
                </div>
              )}

              {/* REMARK */}

              <div
                className={
                  otherCenter
                    ? ''
                    : 'md:col-span-2'
                }
              >
                <label
                  htmlFor="remark"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Remark{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  id="remark"
                  name="remark"
                  rows={3}
                  value={
                    formData.remark
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Remark"
                  className={`w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                    errors.remark
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                      : formData.remark
                        ? 'border-green-300 focus:border-blue-500 focus:ring-blue-100'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />

                {errors.remark && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.remark}
                  </p>
                )}
              </div>
            </div>

            {/* =================================================
                PRODUCTS
            ================================================== */}

            <div className="mt-7 border-t border-gray-200 pt-5">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Products
                  </h2>

                  {errors.products && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.products}
                    </p>
                  )}
                </div>

                {/* SEARCH */}

                <div className="relative w-full sm:w-[280px]">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={
                      productSearchTerm
                    }
                    onChange={(e) =>
                      setProductSearchTerm(
                        e.target.value
                      )
                    }
                    placeholder="Search products..."
                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* LOADING */}

              {loading ? (
                <div className="flex min-h-[180px] items-center justify-center">
                  <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                </div>
              ) : (
                <div className="max-h-[55vh] overflow-y-auto overflow-x-hidden rounded-md border border-gray-200">
                  <table className="w-full table-fixed border-collapse text-sm">
                    <thead>
                      <tr className="sticky top-0 z-10 bg-[#f1f3f5] text-left shadow-sm">
                        <th className="border-b border-r border-gray-200 px-3 py-3 text-left font-semibold text-gray-800 sm:px-4">
                          #
                        </th>

                        <th className="border-b border-r border-gray-200 px-3 py-3 text-left font-semibold text-gray-800 sm:px-4">
                          Product
                        </th>

                        <th className="border-b border-r border-gray-200 px-3 py-3 text-left font-semibold text-gray-800 sm:px-4">
                          Current Stock
                        </th>

                        <th className="border-b border-r border-gray-200 px-3 py-3 text-left font-semibold text-gray-800 sm:px-4">
                          Product Qty
                        </th>

                        <th className="border-b border-r border-gray-200 px-3 py-3 text-left font-semibold text-gray-800 sm:px-4">
                          Damage Qty
                        </th>

                        <th className="border-b border-r border-gray-200 px-3 py-3 text-left font-semibold text-gray-800 sm:px-4">
                          Comment
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.length >
                      0 ? (
                        filteredProducts.map(
                          (
                            product,
                            index
                          ) => (
                            <tr
                              key={
                                product.productId
                              }
                              className="border-b border-gray-200 even:bg-[#f1f1f1] odd:bg-white transition-colors hover:bg-blue-50/70"
                            >
                              <td className="break-words px-3 py-3 text-gray-600 sm:px-4">
                                {index +
                                  1}
                              </td>

                              <td className="break-words px-3 py-3 font-medium text-gray-800 sm:px-4">
                                {
                                  product.productName
                                }
                              </td>

                              <td className="break-words px-3 py-3 text-gray-700 sm:px-4">
                                {product
                                  .currentStock
                                  ?.warehouse
                                  ?.available ||
                                  product
                                    .currentStock
                                    ?.center
                                    ?.available ||
                                  0}
                              </td>

                              {/* PRODUCT QTY */}

                              <td className="px-3 py-2.5 sm:px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={
                                    selectedRows[
                                      product
                                        .productId
                                    ]
                                      ?.productQty ||
                                    0
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    handleRowInputChange(
                                      product.productId,
                                      'productQty',
                                      e.target
                                        .value
                                    )
                                  }
                                  placeholder="0"
                                  className="w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
                                />
                              </td>

                              {/* DAMAGE QTY */}

                              <td className="break-words px-3 py-3 text-gray-700 sm:px-4">
                                {selectedRows[
                                  product
                                    .productId
                                ]
                                  ?.damageQty ||
                                  0}
                              </td>

                              {/* COMMENT */}

                              <td className="px-3 py-2.5 sm:px-4">
                                <input
                                  type="text"
                                  value={
                                    selectedRows[
                                      product
                                        .productId
                                    ]
                                      ?.comment ||
                                    ''
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    handleRowInputChange(
                                      product.productId,
                                      'comment',
                                      e.target
                                        .value
                                    )
                                  }
                                  placeholder="Add comment..."
                                  className="w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
                                />
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-10 text-center text-sm text-gray-500"
                          >
                            No products found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div className="mt-6 flex justify-end border-t border-gray-200 pt-5">
              <button
                type="submit"
                className="rounded-md bg-[#2759a2] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b] focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {id
                  ? 'Update'
                  : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReportSubmission;