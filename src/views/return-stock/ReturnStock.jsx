// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import {
//   ArrowLeft,
//   List,
//   LoaderCircle,
//   Search,
//   X,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// import axiosInstance from '../../axiosInstance';
// import ReturnSerialNumber from './ReturnSerialNumber';

// const ReturnStock = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] =
//     useState({
//       date: new Date()
//         .toISOString()
//         .split('T')[0],
//       remark: '',
//     });

//   const [products, setProducts] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [searchTerm, setSearchTerm] =
//     useState('');

//   const [selectedRows, setSelectedRows] =
//     useState({});

//   const [errors, setErrors] =
//     useState({});

//   const [alert, setAlert] =
//     useState({
//       show: false,
//       message: '',
//       type: '',
//     });

//   const [
//     serialModalVisible,
//     setSerialModalVisible,
//   ] = useState(false);

//   const [
//     selectedProduct,
//     setSelectedProduct,
//   ] = useState(null);

//   const [
//     selectionOrder,
//     setSelectionOrder,
//   ] = useState([]);

//   const [
//     assignedSerials,
//     setAssignedSerials,
//   ] = useState({});

//   const selectionCounter =
//     useRef(0);

//   /* =========================================================
//      FETCH PRODUCTS
//   ========================================================== */

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res =
//         await axiosInstance.get(
//           '/stockpurchase/products/with-stock'
//         );

//       if (res.data.success) {
//         setProducts(res.data.data);
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
//      SERIAL NUMBER UPDATE
//   ========================================================== */

//   const handleSerialNumbersUpdate = (
//     productId,
//     serialsArray
//   ) => {
//     setAssignedSerials(
//       (prev) => ({
//         ...prev,
//         [productId]:
//           serialsArray,
//       })
//     );
//   };

//   const handleOpenSerialModal = (
//     product
//   ) => {
//     setSelectedProduct(product);
//     setSerialModalVisible(true);
//   };

//   /* =========================================================
//      PRODUCT ROW SELECTION
//   ========================================================== */

//   const handleRowSelect = (
//     productId,
//     productStock
//   ) => {
//     setSelectedRows((prev) => {
//       const updated = {
//         ...prev,
//       };

//       if (updated[productId]) {
//         setSelectionOrder(
//           (prevOrder) =>
//             prevOrder.filter(
//               (item) =>
//                 item.productId !==
//                 productId
//             )
//         );

//         delete updated[productId];
//       } else {
//         const newOrder =
//           selectionCounter.current++;

//         setSelectionOrder(
//           (prevOrder) => [
//             {
//               productId,
//               order: newOrder,
//             },
//             ...prevOrder,
//           ]
//         );

//         updated[productId] = {
//           quantity: '',
//           productRemark: '',
//           productInStock:
//             productStock || 0,
//         };
//       }

//       return updated;
//     });

//     setErrors((prev) => {
//       const updated = {
//         ...prev,
//       };

//       delete updated.products;
//       delete updated[
//         `quantity_${productId}`
//       ];
//       delete updated[
//         `serials_${productId}`
//       ];

//       return updated;
//     });
//   };

//   /* =========================================================
//      PRODUCT INPUT CHANGE
//   ========================================================== */

//   const handleRowInputChange = (
//     productId,
//     field,
//     value
//   ) => {
//     setSelectedRows((prev) => {
//       const newRows = {
//         ...prev,
//         [productId]: {
//           ...prev[productId],
//           [field]: value,
//         },
//       };

//       if (field === 'quantity') {
//         const product =
//           products.find(
//             (p) =>
//               p._id === productId
//           );

//         if (
//           product?.trackSerialNumber ===
//           'Yes'
//         ) {
//           setAssignedSerials(
//             (prevSerials) => {
//               const newSerials = {
//                 ...prevSerials,
//               };

//               delete newSerials[
//                 productId
//               ];

//               return newSerials;
//             }
//           );
//         }

//         setErrors((prevErrors) => {
//           const updated = {
//             ...prevErrors,
//           };

//           delete updated[
//             `quantity_${productId}`
//           ];

//           delete updated[
//             `serials_${productId}`
//           ];

//           return updated;
//         });
//       }

//       return newRows;
//     });
//   };

//   /* =========================================================
//      FORM CHANGE
//   ========================================================== */

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
//      VALIDATION
//   ========================================================== */

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.date) {
//       newErrors.date =
//         'This is a required field';
//     }

//     const selectedProducts =
//       Object.keys(
//         selectedRows
//       ).filter(
//         (id) =>
//           selectedRows[id]
//       );

//     if (
//       selectedProducts.length === 0
//     ) {
//       newErrors.products =
//         'At least one product must be selected';
//     }

//     selectedProducts.forEach(
//       (productId) => {
//         const product =
//           selectedRows[
//             productId
//           ];

//         const productInfo =
//           products.find(
//             (p) =>
//               p._id === productId
//           );

//         if (
//           !product.quantity ||
//           product.quantity <= 0
//         ) {
//           newErrors[
//             `quantity_${productId}`
//           ] =
//             'Quantity must be greater than 0';
//         }

//         if (
//           productInfo?.trackSerialNumber ===
//           'Yes'
//         ) {
//           const assignedSerialsForProduct =
//             assignedSerials[
//               productId
//             ];

//           if (
//             !assignedSerialsForProduct ||
//             assignedSerialsForProduct.length ===
//               0
//           ) {
//             newErrors[
//               `serials_${productId}`
//             ] =
//               'Serial numbers are required for this product';
//           } else if (
//             assignedSerialsForProduct.length !==
//             parseInt(
//               product.quantity,
//               10
//             )
//           ) {
//             newErrors[
//               `serials_${productId}`
//             ] = `Please assign exactly ${product.quantity} serial number(s)`;
//           }
//         }
//       }
//     );

//     setErrors(newErrors);

//     return (
//       Object.keys(newErrors)
//         .length === 0
//     );
//   };

//   /* =========================================================
//      SUBMIT
//   ========================================================== */

//   const handleSubmit = async (
//     e
//   ) => {
//     e.preventDefault();

//     const isValid =
//       validateForm();

//     if (!isValid) {
//       return;
//     }

//     const productsData =
//       Object.keys(
//         selectedRows
//       )
//         .filter(
//           (productId) =>
//             selectedRows[
//               productId
//             ]
//         )
//         .map(
//           (productId) => {
//             const productInfo =
//               products.find(
//                 (p) =>
//                   p._id ===
//                   productId
//               );

//             const productData = {
//               product:
//                 productId,
//               quantity:
//                 parseInt(
//                   selectedRows[
//                     productId
//                   ].quantity,
//                   10
//                 ),
//             };

//             if (
//               productInfo?.trackSerialNumber ===
//                 'Yes' &&
//               assignedSerials[
//                 productId
//               ]
//             ) {
//               productData.serialNumbers =
//                 assignedSerials[
//                   productId
//                 ];
//             }

//             return productData;
//           }
//         );

//     const payload = {
//       date: formData.date,
//       remark:
//         formData.remark || '',
//       products:
//         productsData,
//     };

//     try {
//       await axiosInstance.post(
//         '/center-return',
//         payload
//       );

//       setAlert({
//         show: true,
//         message:
//           'Stock returned to reseller successfully!',
//         type: 'success',
//       });

//       setTimeout(() => {
//         navigate(
//           '/available-stock'
//         );
//       }, 1500);
//     } catch (error) {
//       const errorMessage =
//         error.response?.data
//           ?.message ||
//         'Error processing return request. Please try again.';

//       setAlert({
//         show: true,
//         message: errorMessage,
//         type: 'danger',
//       });
//     }
//   };

//   /* =========================================================
//      BACK
//   ========================================================== */

//   const handleBack = () => {
//     navigate(-1);
//   };

//   /* =========================================================
//      FILTER + SORT PRODUCTS
//   ========================================================== */

//   const filteredProducts =
//     products
//       .filter((p) =>
//         p.productTitle
//           ?.toLowerCase()
//           .includes(
//             searchTerm.toLowerCase()
//           )
//       )
//       .sort((a, b) => {
//         const aSelected =
//           !!selectedRows[a._id];

//         const bSelected =
//           !!selectedRows[b._id];

//         if (
//           aSelected &&
//           bSelected
//         ) {
//           const aOrder =
//             selectionOrder.find(
//               (item) =>
//                 item.productId ===
//                 a._id
//             )?.order || 0;

//           const bOrder =
//             selectionOrder.find(
//               (item) =>
//                 item.productId ===
//                 b._id
//             )?.order || 0;

//           return (
//             aOrder - bOrder
//           );
//         }

//         if (
//           aSelected &&
//           !bSelected
//         ) {
//           return -1;
//         }

//         if (
//           !aSelected &&
//           bSelected
//         ) {
//           return 1;
//         }

//         return 0;
//       });

//   /* =========================================================
//      UI
//   ========================================================== */

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-5 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">
//         {/* HEADER */}

//         <div className="mb-5 flex flex-wrap items-center gap-3">
//           <button
//             type="button"
//             onClick={handleBack}
//             className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
//           >
//             <ArrowLeft
//               size={17}
//             />
//             Back
//           </button>

//           <h1 className="text-2xl font-semibold text-gray-800">
//             Return Products
//           </h1>
//         </div>

//         {/* MAIN CARD */}

//         <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//           <div className="p-5">
//             {/* ALERT */}

//             {alert.show && (
//               <div
//                 className={`mb-5 flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${
//                   alert.type ===
//                   'success'
//                     ? 'border-green-200 bg-green-50 text-green-700'
//                     : 'border-red-200 bg-red-50 text-red-700'
//                 }`}
//               >
//                 <span>
//                   {
//                     alert.message
//                   }
//                 </span>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setAlert({
//                       show: false,
//                       message: '',
//                       type: '',
//                     })
//                   }
//                   className="ml-3 rounded p-1 hover:bg-black/5"
//                 >
//                   <X
//                     size={16}
//                   />
//                 </button>
//               </div>
//             )}

//             <form
//               onSubmit={
//                 handleSubmit
//               }
//             >
//               {/* FORM FIELDS */}

//               <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//                 {/* DATE */}

//                 <div>
//                   <label
//                     htmlFor="date"
//                     className={`mb-2 block text-sm font-medium ${
//                       errors.date
//                         ? 'text-red-600'
//                         : 'text-gray-700'
//                     }`}
//                   >
//                     Date{' '}
//                     <span className="text-red-500">
//                       *
//                     </span>
//                   </label>

//                   <input
//                     type="date"
//                     id="date"
//                     name="date"
//                     disabled
//                     value={
//                       formData.date
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
//                       errors.date
//                         ? 'border-red-400 bg-red-50'
//                         : 'border-gray-300 bg-gray-100'
//                     }`}
//                   />

//                   {errors.date && (
//                     <p className="mt-1 text-xs text-red-600">
//                       {
//                         errors.date
//                       }
//                     </p>
//                   )}
//                 </div>

//                 {/* REMARK */}

//                 <div>
//                   <label
//                     htmlFor="remark"
//                     className="mb-2 block text-sm font-medium text-gray-700"
//                   >
//                     Remark
//                   </label>

//                   <textarea
//                     id="remark"
//                     name="remark"
//                     value={
//                       formData.remark
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     placeholder="Additional Comment"
//                     rows={3}
//                     className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   />
//                 </div>
//               </div>

//               {/* PRODUCTS */}

//               <div className="mt-7">
//                 <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                   <div>
//                     <h2 className="text-lg font-semibold text-gray-800">
//                       Select Products
//                     </h2>

//                     {errors.products && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {
//                           errors.products
//                         }
//                       </p>
//                     )}
//                   </div>

//                   {/* SEARCH */}

//                   <div className="flex items-center gap-2">
//                     <label
//                       htmlFor="product-search"
//                       className="text-sm font-medium text-gray-600"
//                     >
//                       Search:
//                     </label>

//                     <div className="relative">
//                       <Search
//                         size={16}
//                         className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                       />

//                       <input
//                         id="product-search"
//                         type="text"
//                         value={
//                           searchTerm
//                         }
//                         onChange={(e) =>
//                           setSearchTerm(
//                             e.target
//                               .value
//                           )
//                         }
//                         placeholder="Search product..."
//                         className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* LOADING */}

//                 {loading ? (
//                   <div className="flex min-h-[180px] items-center justify-center">
//                     <div className="flex flex-col items-center gap-3 text-gray-500">
//                       <LoaderCircle
//                         size={32}
//                         className="animate-spin text-blue-600"
//                       />

//                       <span className="text-sm">
//                         Loading
//                         products...
//                       </span>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="overflow-x-auto rounded-lg border border-gray-200">
//                     <table className="w-full min-w-[850px] border-collapse text-sm">
//                       <thead>
//                         <tr className="bg-gray-100 text-left">
//                           <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                             Select
//                           </th>

//                           <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                             Product Name
//                           </th>

//                           <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                             Stock
//                           </th>

//                           <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                             Quantity
//                           </th>

//                           <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
//                             Remark
//                           </th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {filteredProducts.length >
//                         0 ? (
//                           filteredProducts.map(
//                             (p) => {
//                               const isSelected =
//                                 !!selectedRows[
//                                   p._id
//                                 ];

//                               return (
//                                 <tr
//                                   key={
//                                     p._id
//                                   }
//                                   className={`border-b border-gray-100 transition ${
//                                     isSelected
//                                       ? 'bg-blue-50'
//                                       : 'hover:bg-gray-50'
//                                   }`}
//                                 >
//                                   {/* SELECT */}

//                                   <td className="px-4 py-3 align-top">
//                                     <input
//                                       type="checkbox"
//                                       checked={
//                                         isSelected
//                                       }
//                                       onChange={() =>
//                                         handleRowSelect(
//                                           p._id,
//                                           p.stock
//                                         )
//                                       }
//                                       className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                     />
//                                   </td>

//                                   {/* PRODUCT */}

//                                   <td className="px-4 py-3 align-top font-medium text-gray-800">
//                                     {
//                                       p.productTitle
//                                     }
//                                   </td>

//                                   {/* STOCK */}

//                                   <td className="px-4 py-3 align-top text-gray-600">
//                                     {p
//                                       .stock
//                                       ?.currentStock ||
//                                       0}
//                                   </td>

//                                   {/* QUANTITY */}

//                                   <td className="px-4 py-3 align-top">
//                                     {isSelected && (
//                                       <div className="min-w-[170px]">
//                                         <div className="flex items-center gap-2">
//                                           <input
//                                             type="number"
//                                             min="1"
//                                             value={
//                                               selectedRows[
//                                                 p._id
//                                               ]
//                                                 .quantity
//                                             }
//                                             onChange={(
//                                               e
//                                             ) =>
//                                               handleRowInputChange(
//                                                 p._id,
//                                                 'quantity',
//                                                 e
//                                                   .target
//                                                   .value
//                                               )
//                                             }
//                                             placeholder="Quantity"
//                                             className={`h-9 w-28 rounded-lg border px-3 text-sm outline-none ${
//                                               errors[
//                                                 `quantity_${p._id}`
//                                               ]
//                                                 ? 'border-red-400 bg-red-50'
//                                                 : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
//                                             }`}
//                                           />

//                                           {p.trackSerialNumber ===
//                                             'Yes' && (
//                                             <button
//                                               type="button"
//                                               onClick={() =>
//                                                 handleOpenSerialModal(
//                                                   p
//                                                 )
//                                               }
//                                               title="Add Serial Numbers"
//                                               className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
//                                             >
//                                               <List
//                                                 size={
//                                                   18
//                                                 }
//                                               />
//                                             </button>
//                                           )}
//                                         </div>

//                                         {errors[
//                                           `quantity_${p._id}`
//                                         ] && (
//                                           <p className="mt-1 text-xs text-red-600">
//                                             Quantity
//                                             required
//                                           </p>
//                                         )}

//                                         {errors[
//                                           `serials_${p._id}`
//                                         ] && (
//                                           <p className="mt-1 text-xs text-red-600">
//                                             {
//                                               errors[
//                                                 `serials_${p._id}`
//                                               ]
//                                             }
//                                           </p>
//                                         )}

//                                         {p.trackSerialNumber ===
//                                           'Yes' &&
//                                           assignedSerials[
//                                             p._id
//                                           ]?.length >
//                                             0 && (
//                                             <p className="mt-1 text-xs text-green-600">
//                                               {
//                                                 assignedSerials[
//                                                   p._id
//                                                 ].length
//                                               }{' '}
//                                               serial
//                                               number
//                                               {assignedSerials[
//                                                 p._id
//                                               ].length >
//                                               1
//                                                 ? 's'
//                                                 : ''}{' '}
//                                               assigned
//                                             </p>
//                                           )}
//                                       </div>
//                                     )}
//                                   </td>

//                                   {/* REMARK */}

//                                   <td className="px-4 py-3 align-top">
//                                     {isSelected && (
//                                       <input
//                                         type="text"
//                                         value={
//                                           selectedRows[
//                                             p._id
//                                           ]
//                                             .productRemark
//                                         }
//                                         onChange={(
//                                           e
//                                         ) =>
//                                           handleRowInputChange(
//                                             p._id,
//                                             'productRemark',
//                                             e
//                                               .target
//                                               .value
//                                           )
//                                         }
//                                         placeholder="Product Remark"
//                                         className="w-full min-w-[200px] rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                       />
//                                     )}
//                                   </td>
//                                 </tr>
//                               );
//                             }
//                           )
//                         ) : (
//                           <tr>
//                             <td
//                               colSpan={
//                                 5
//                               }
//                               className="px-4 py-10 text-center text-sm text-gray-500"
//                             >
//                               No products
//                               found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>

//               {/* FOOTER */}

//               <div className="mt-5 flex justify-end border-t border-gray-200 pt-4">
//                 <button
//                   type="submit"
//                   className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
//                 >
//                   Submit Transfer
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* SERIAL NUMBER MODAL */}

//       <ReturnSerialNumber
//         visible={
//           serialModalVisible
//         }
//         onClose={() =>
//           setSerialModalVisible(
//             false
//           )
//         }
//         product={
//           selectedProduct
//         }
//         quantity={
//           selectedRows[
//             selectedProduct?._id
//           ]?.quantity || 0
//         }
//         onSerialNumbersUpdate={
//           handleSerialNumbersUpdate
//         }
//       />
//     </div>
//   );
// };

// export default ReturnStock;

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ArrowLeft,
  List,
  LoaderCircle,
  Search,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import ReturnSerialNumber from './ReturnSerialNumber';

const ReturnStock = () => {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      date: new Date()
        .toISOString()
        .split('T')[0],
      remark: '',
    });

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [selectedRows, setSelectedRows] =
    useState({});

  const [errors, setErrors] =
    useState({});

  const [alert, setAlert] =
    useState({
      show: false,
      message: '',
      type: '',
    });

  const [
    serialModalVisible,
    setSerialModalVisible,
  ] = useState(false);

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);

  const [
    selectionOrder,
    setSelectionOrder,
  ] = useState([]);

  const [
    assignedSerials,
    setAssignedSerials,
  ] = useState({});

  const selectionCounter =
    useRef(0);

  /* =========================================================
     FETCH PRODUCTS
  ========================================================== */

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res =
        await axiosInstance.get(
          '/stockpurchase/products/with-stock'
        );

      if (res.data.success) {
        setProducts(res.data.data);
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
     SERIAL NUMBER UPDATE
  ========================================================== */

  const handleSerialNumbersUpdate = (
    productId,
    serialsArray
  ) => {
    setAssignedSerials(
      (prev) => ({
        ...prev,
        [productId]:
          serialsArray,
      })
    );
  };

  const handleOpenSerialModal = (
    product
  ) => {
    setSelectedProduct(product);
    setSerialModalVisible(true);
  };

  /* =========================================================
     PRODUCT ROW SELECTION
  ========================================================== */

  const handleRowSelect = (
    productId,
    productStock
  ) => {
    setSelectedRows((prev) => {
      const updated = {
        ...prev,
      };

      if (updated[productId]) {
        setSelectionOrder(
          (prevOrder) =>
            prevOrder.filter(
              (item) =>
                item.productId !==
                productId
            )
        );

        delete updated[productId];
      } else {
        const newOrder =
          selectionCounter.current++;

        setSelectionOrder(
          (prevOrder) => [
            {
              productId,
              order: newOrder,
            },
            ...prevOrder,
          ]
        );

        updated[productId] = {
          quantity: '',
          productRemark: '',
          productInStock:
            productStock || 0,
        };
      }

      return updated;
    });

    setErrors((prev) => {
      const updated = {
        ...prev,
      };

      delete updated.products;
      delete updated[
        `quantity_${productId}`
      ];
      delete updated[
        `serials_${productId}`
      ];

      return updated;
    });
  };

  /* =========================================================
     PRODUCT INPUT CHANGE
  ========================================================== */

  const handleRowInputChange = (
    productId,
    field,
    value
  ) => {
    setSelectedRows((prev) => {
      const newRows = {
        ...prev,
        [productId]: {
          ...prev[productId],
          [field]: value,
        },
      };

      if (field === 'quantity') {
        const product =
          products.find(
            (p) =>
              p._id === productId
          );

        if (
          product?.trackSerialNumber ===
          'Yes'
        ) {
          setAssignedSerials(
            (prevSerials) => {
              const newSerials = {
                ...prevSerials,
              };

              delete newSerials[
                productId
              ];

              return newSerials;
            }
          );
        }

        setErrors((prevErrors) => {
          const updated = {
            ...prevErrors,
          };

          delete updated[
            `quantity_${productId}`
          ];

          delete updated[
            `serials_${productId}`
          ];

          return updated;
        });
      }

      return newRows;
    });
  };

  /* =========================================================
     FORM CHANGE
  ========================================================== */

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
     VALIDATION
  ========================================================== */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date =
        'This is a required field';
    }

    const selectedProducts =
      Object.keys(
        selectedRows
      ).filter(
        (id) =>
          selectedRows[id]
      );

    if (
      selectedProducts.length === 0
    ) {
      newErrors.products =
        'At least one product must be selected';
    }

    selectedProducts.forEach(
      (productId) => {
        const product =
          selectedRows[
            productId
          ];

        const productInfo =
          products.find(
            (p) =>
              p._id === productId
          );

        if (
          !product.quantity ||
          product.quantity <= 0
        ) {
          newErrors[
            `quantity_${productId}`
          ] =
            'Quantity must be greater than 0';
        }

        if (
          productInfo?.trackSerialNumber ===
          'Yes'
        ) {
          const assignedSerialsForProduct =
            assignedSerials[
              productId
            ];

          if (
            !assignedSerialsForProduct ||
            assignedSerialsForProduct.length ===
              0
          ) {
            newErrors[
              `serials_${productId}`
            ] =
              'Serial numbers are required for this product';
          } else if (
            assignedSerialsForProduct.length !==
            parseInt(
              product.quantity,
              10
            )
          ) {
            newErrors[
              `serials_${productId}`
            ] = `Please assign exactly ${product.quantity} serial number(s)`;
          }
        }
      }
    );

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  /* =========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    const isValid =
      validateForm();

    if (!isValid) {
      return;
    }

    const productsData =
      Object.keys(
        selectedRows
      )
        .filter(
          (productId) =>
            selectedRows[
              productId
            ]
        )
        .map(
          (productId) => {
            const productInfo =
              products.find(
                (p) =>
                  p._id ===
                  productId
              );

            const productData = {
              product:
                productId,
              quantity:
                parseInt(
                  selectedRows[
                    productId
                  ].quantity,
                  10
                ),
            };

            if (
              productInfo?.trackSerialNumber ===
                'Yes' &&
              assignedSerials[
                productId
              ]
            ) {
              productData.serialNumbers =
                assignedSerials[
                  productId
                ];
            }

            return productData;
          }
        );

    const payload = {
      date: formData.date,
      remark:
        formData.remark || '',
      products:
        productsData,
    };

    try {
      await axiosInstance.post(
        '/center-return',
        payload
      );

      setAlert({
        show: true,
        message:
          'Stock returned to reseller successfully!',
        type: 'success',
      });

      setTimeout(() => {
        navigate(
          '/available-stock'
        );
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data
          ?.message ||
        'Error processing return request. Please try again.';

      setAlert({
        show: true,
        message: errorMessage,
        type: 'danger',
      });
    }
  };

  /* =========================================================
     BACK
  ========================================================== */

  const handleBack = () => {
    navigate(-1);
  };

  /* =========================================================
     FILTER + SORT PRODUCTS
  ========================================================== */

  const filteredProducts =
    products
      .filter((p) =>
        p.productTitle
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
      )
      .sort((a, b) => {
        const aSelected =
          !!selectedRows[a._id];

        const bSelected =
          !!selectedRows[b._id];

        if (
          aSelected &&
          bSelected
        ) {
          const aOrder =
            selectionOrder.find(
              (item) =>
                item.productId ===
                a._id
            )?.order || 0;

          const bOrder =
            selectionOrder.find(
              (item) =>
                item.productId ===
                b._id
            )?.order || 0;

          return (
            aOrder - bOrder
          );
        }

        if (
          aSelected &&
          !bSelected
        ) {
          return -1;
        }

        if (
          !aSelected &&
          bSelected
        ) {
          return 1;
        }

        return 0;
      });

  /* =========================================================
     UI
  ========================================================== */

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      <div className="w-full">
        {/* HEADER */}

        <div className="mb-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-[4px] bg-[#2759a2] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#214a87]"
          >
            <ArrowLeft
              size={17}
            />
            Back
          </button>

          <h1 className="mb-2 text-[24px] font-[450] leading-tight text-[#212529]">
            Return Products
          </h1>
        </div>

        {/* MAIN CARD */}

        <div className="overflow-hidden rounded-md border border-[#dce2ea] border-t-[4px] border-t-[#2759a2] bg-white shadow-sm">
          <div className="p-4 sm:p-5">
            {/* ALERT */}

            {alert.show && (
              <div
                className={`mb-5 flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${
                  alert.type ===
                  'success'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                <span>
                  {
                    alert.message
                  }
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setAlert({
                      show: false,
                      message: '',
                      type: '',
                    })
                  }
                  className="ml-3 rounded p-1 hover:bg-black/5"
                >
                  <X
                    size={16}
                  />
                </button>
              </div>
            )}

            <form
              onSubmit={
                handleSubmit
              }
            >
              {/* FORM FIELDS */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* DATE */}

                <div>
                  <label
                    htmlFor="date"
                    className={`mb-2 block text-sm font-medium ${
                      errors.date
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}
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
                    disabled
                    value={
                      formData.date
                    }
                    onChange={
                      handleChange
                    }
                    className={`w-full rounded-[2px] border px-3 py-2.5 text-sm outline-none ${
                      errors.date
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-300 bg-gray-100'
                    }`}
                  />

                  {errors.date && (
                    <p className="mt-1 text-xs text-red-600">
                      {
                        errors.date
                      }
                    </p>
                  )}
                </div>

                {/* REMARK */}

                <div>
                  <label
                    htmlFor="remark"
                    className="mb-2 block text-[15px] font-semibold text-[#303846]"
                  >
                    Remark
                  </label>

                  <textarea
                    id="remark"
                    name="remark"
                    value={
                      formData.remark
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Additional Comment"
                    rows={3}
                    className="w-full resize-none rounded-[2px] border border-[#d7dce2] px-3 py-2.5 text-sm outline-none transition focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* PRODUCTS */}

              <div className="mt-7">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-[20px] font-normal text-[#303640]">
                      Select Products
                    </h2>

                    {errors.products && (
                      <p className="mt-1 text-sm text-red-600">
                        {
                          errors.products
                        }
                      </p>
                    )}
                  </div>

                  {/* SEARCH */}

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="product-search"
                      className="text-sm font-medium text-gray-600"
                    >
                      Search:
                    </label>

                    <div className="relative">
                      <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="product-search"
                        type="text"
                        value={
                          searchTerm
                        }
                        onChange={(e) =>
                          setSearchTerm(
                            e.target
                              .value
                          )
                        }
                        placeholder="Search product..."
                        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                      />
                    </div>
                  </div>
                </div>

                {/* LOADING */}

                {loading ? (
                  <div className="flex min-h-[180px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <LoaderCircle
                        size={32}
                        className="animate-spin text-blue-600"
                      />

                      <span className="text-sm">
                        Loading
                        products...
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-[430px] overflow-auto rounded-[2px] border border-[#e1e5eb] bg-white">
                    <table className="w-full min-w-[850px] border-collapse text-[14px] text-[#303846]">
                      <thead className="sticky top-0 z-20 bg-[#f1f3f5]">
                        <tr className="bg-[#f1f3f5] text-left">
                          <th className="sticky top-0 z-20 border-b border-[#e1e5eb] bg-[#f1f3f5] px-3 py-3 font-bold text-[#17191d]">
                            Select
                          </th>

                          <th className="sticky top-0 z-20 border-b border-[#e1e5eb] bg-[#f1f3f5] px-3 py-3 font-bold text-[#17191d]">
                            Product Name
                          </th>

                          <th className="sticky top-0 z-20 border-b border-[#e1e5eb] bg-[#f1f3f5] px-3 py-3 font-bold text-[#17191d]">
                            Stock
                          </th>

                          <th className="sticky top-0 z-20 border-b border-[#e1e5eb] bg-[#f1f3f5] px-3 py-3 font-bold text-[#17191d]">
                            Quantity
                          </th>

                          <th className="sticky top-0 z-20 border-b border-[#e1e5eb] bg-[#f1f3f5] px-3 py-3 font-bold text-[#17191d]">
                            Remark
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredProducts.length >
                        0 ? (
                          filteredProducts.map(
                            (p) => {
                              const isSelected =
                                !!selectedRows[
                                  p._id
                                ];

                              return (
                                <tr
                                  key={
                                    p._id
                                  }
                                  className={`border-b border-[#e2e5e9] transition-colors ${
                                    isSelected
                                      ? '!bg-[#DFF0D8]'
                                      : '[&:nth-child(odd)]:bg-white [&:nth-child(even)]:bg-[#f1f1f1] hover:bg-[#e7e7e7]'
                                  }`}
                                >
                                  {/* SELECT */}

                                  <td className="border-b border-[#edf0f3] px-3 py-3 align-top">
                                    <input
                                      type="checkbox"
                                      checked={
                                        isSelected
                                      }
                                      onChange={() =>
                                        handleRowSelect(
                                          p._id,
                                          p.stock
                                        )
                                      }
                                      className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                  </td>

                                  {/* PRODUCT */}

                                  <td className="border-b border-[#edf0f3] px-3 py-3 align-top font-medium text-[#303846]">
                                    {
                                      p.productTitle
                                    }
                                  </td>

                                  {/* STOCK */}

                                  <td className="border-b border-[#edf0f3] px-3 py-3 align-top text-[#303846]">
                                    {p
                                      .stock
                                      ?.currentStock ||
                                      0}
                                  </td>

                                  {/* QUANTITY */}

                                  <td className="border-b border-[#edf0f3] px-3 py-3 align-top">
                                    {isSelected && (
                                      <div className="min-w-[170px]">
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="number"
                                            min="1"
                                            value={
                                              selectedRows[
                                                p._id
                                              ]
                                                .quantity
                                            }
                                            onChange={(
                                              e
                                            ) =>
                                              handleRowInputChange(
                                                p._id,
                                                'quantity',
                                                e
                                                  .target
                                                  .value
                                              )
                                            }
                                            placeholder="Quantity"
                                            className={`h-9 w-28 rounded-lg border px-3 text-sm outline-none ${
                                              errors[
                                                `quantity_${p._id}`
                                              ]
                                                ? 'border-red-400 bg-red-50'
                                                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                            }`}
                                          />

                                          {p.trackSerialNumber ===
                                            'Yes' && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleOpenSerialModal(
                                                  p
                                                )
                                              }
                                              title="Add Serial Numbers"
                                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                                            >
                                              <List
                                                size={
                                                  18
                                                }
                                              />
                                            </button>
                                          )}
                                        </div>

                                        {errors[
                                          `quantity_${p._id}`
                                        ] && (
                                          <p className="mt-1 text-xs text-red-600">
                                            Quantity
                                            required
                                          </p>
                                        )}

                                        {errors[
                                          `serials_${p._id}`
                                        ] && (
                                          <p className="mt-1 text-xs text-red-600">
                                            {
                                              errors[
                                                `serials_${p._id}`
                                              ]
                                            }
                                          </p>
                                        )}

                                        {p.trackSerialNumber ===
                                          'Yes' &&
                                          assignedSerials[
                                            p._id
                                          ]?.length >
                                            0 && (
                                            <p className="mt-1 text-xs text-green-600">
                                              {
                                                assignedSerials[
                                                  p._id
                                                ].length
                                              }{' '}
                                              serial
                                              number
                                              {assignedSerials[
                                                p._id
                                              ].length >
                                              1
                                                ? 's'
                                                : ''}{' '}
                                              assigned
                                            </p>
                                          )}
                                      </div>
                                    )}
                                  </td>

                                  {/* REMARK */}

                                  <td className="border-b border-[#edf0f3] px-3 py-3 align-top">
                                    {isSelected && (
                                      <input
                                        type="text"
                                        value={
                                          selectedRows[
                                            p._id
                                          ]
                                            .productRemark
                                        }
                                        onChange={(
                                          e
                                        ) =>
                                          handleRowInputChange(
                                            p._id,
                                            'productRemark',
                                            e
                                              .target
                                              .value
                                          )
                                        }
                                        placeholder="Product Remark"
                                        className="w-full min-w-[200px] rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                      />
                                    )}
                                  </td>
                                </tr>
                              );
                            }
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={
                                5
                              }
                              className="px-4 py-10 text-center text-sm text-gray-500"
                            >
                              No products
                              found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* FOOTER */}

              <div className="mt-5 flex justify-end border-t border-[#e1e5eb] pt-4">
                <button
                  type="submit"
                  className="rounded-[4px] bg-[#ac2925] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#214a87]"
                >
                  Submit Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* SERIAL NUMBER MODAL */}

      <ReturnSerialNumber
        visible={
          serialModalVisible
        }
        onClose={() =>
          setSerialModalVisible(
            false
          )
        }
        product={
          selectedProduct
        }
        quantity={
          selectedRows[
            selectedProduct?._id
          ]?.quantity || 0
        }
        onSerialNumbersUpdate={
          handleSerialNumbersUpdate
        }
      />
    </div>
  );
};

export default ReturnStock;