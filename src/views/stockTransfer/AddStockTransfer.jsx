// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from '../../axiosInstance';
// import { generateOrderNumber } from '../../utils/orderNumberGenerator';
// import {
//   ArrowLeft,
//   Check,
//   FileText,
//   RotateCcw,
//   Search,
//   Save,
//   X,
// } from 'lucide-react';

// const AddStockTransfer = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     fromCenter: '',
//     remark: '',
//     date: new Date().toISOString().split('T')[0],
//     transferNumber: '',
//   });
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [centerLoading, setCenterLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRows, setSelectedRows] = useState({});
//   const [errors, setErrors] = useState({});
//   const [generatingOrderNo, setGeneratingOrderNo] = useState(false);
//   const [alert, setAlert] = useState({ show: false, message: '', type: '' });

//   const [selectionOrder, setSelectionOrder] = useState([]);
//   const selectionCounter = useRef(0);

//   useEffect(() => {
//     fetchCenters();
//     fetchProducts();
//     if (!id) {
//       generateAutoOrderNumber();
//     }
//   }, []);

//   useEffect(() => {
//     if (id) {
//       fetchStockRequest(id);
//     }
//   }, [id]);

//   const generateAutoOrderNumber = async () => {
//     setGeneratingOrderNo(true);
//     try {
//       const transferNumber = await generateOrderNumber(axiosInstance);
//       setFormData(prev => ({
//         ...prev,
//         transferNumber: transferNumber
//       }));
//     } catch (error) {
//       console.error('Error generating order number:', error);
//     } finally {
//       setGeneratingOrderNo(false);
//     }
//   };

//   const fetchCenters = async () => {
//     try {
//       const res = await axiosInstance.get('/centers/resellers/center');
//       if (res.data.success) {
//         setCenters(res.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error);
//     } finally {
//       setCenterLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await axiosInstance.get('/stockpurchase/products/with-stock');
//       if (res.data.success) {
//         setProducts(res.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStockRequest = async (requestId) => {
//     try {
//       const res = await axiosInstance.get(`/stocktransfer/${requestId}`);
//       const data = res.data.data;

//       setFormData({
//         fromCenter: data.fromCenter?._id || '',
//         remark: data.remark || '',
//         date: data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0],
//         transferNumber: data.transferNumber || '',
//       });

//       const selectedProducts = {};
//       const order = [];
      
//       data.products.forEach((p, index) => {
//         selectedProducts[p.product._id] = { 
//           quantity: p.quantity,
//           productRemark: p.productRemark || '',
//           productInStock: p.productInStock || 0,
//         };
//         order.push({ productId: p.product._id, order: index });
//       });
      
//       setSelectedRows(selectedProducts);
//       setSelectionOrder(order);
//       selectionCounter.current = data.products.length;
//     } catch (error) {
//       console.error('Error fetching stock transfer request:', error);
//     }
//   };

//   const handleRowSelect = (productId, productStock) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };
//       if (updated[productId]) {
//         setSelectionOrder(prevOrder => prevOrder.filter(item => item.productId !== productId));
//         delete updated[productId];
//       } else {
//         const newOrder = selectionCounter.current++;
//         setSelectionOrder(prevOrder => [
//           { productId, order: newOrder },
//           ...prevOrder
//         ]);
//         updated[productId] = { quantity: '', productRemark: '', productInStock: productStock || 0 };
//       }
//       return updated;
//     });
//   };
  
//   const handleRowInputChange = (productId, field, value) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         [field]: value,
//       },
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.fromCenter) newErrors.fromCenter = 'This is a required field';
//     if (!formData.date) newErrors.date = 'This is a required field';

//     const selectedProducts = Object.keys(selectedRows).filter(id => selectedRows[id]);
//     if (selectedProducts.length === 0) {
//       newErrors.products = 'At least one product must be selected';
//     }

//     selectedProducts.forEach(productId => {
//       const product = selectedRows[productId];
//       if (!product.quantity || product.quantity <= 0) {
//         newErrors[`quantity_${productId}`] = 'Quantity must be greater than 0';
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const productsData = Object.keys(selectedRows)
//     .filter((productId) => selectedRows[productId]) 
//     .map((productId) => ({
//       product: productId,
//       quantity: parseInt(selectedRows[productId].quantity),
//       productRemark: selectedRows[productId].productRemark,
//     }));

//     const payload = {
//       fromCenter: formData.fromCenter,
//       remark: formData.remark,
//       date: formData.date,
//       transferNumber: formData.transferNumber,
//       products: productsData,
//       status: 'Submitted' 
//     };

//     try {
//       if (id) {
//         await axiosInstance.put(`/stocktransfer/${id}`, payload);
//         setAlert({ show: true, message: 'Data updated successfully!', type: 'success' });
//       } else {
//         await axiosInstance.post('/stocktransfer', payload);
//         setAlert({ show: true, message: 'Data added successfully!', type: 'success' });
//       }
//       setTimeout(() => {
//         navigate('/stock-transfer');
//       }, 1500);
//     } catch (error) {
//       console.error('Error saving stock transfer request:', error);
//     const errorMessage = error.response?.data?.message || 'Error saving stock transfer request. Please try again.';
//     setAlert({ show: true, message: errorMessage, type: 'danger' });
//     }
//   };

//   const handleSaveDraft = async () => {
//     const productsData = Object.keys(selectedRows)
//     .filter((productId) => selectedRows[productId]) 
//     .map((productId) => ({
//       product: productId,
//       quantity: parseInt(selectedRows[productId].quantity) || 0,
//       productRemark: selectedRows[productId].productRemark,
//     }));

//     const payload = {
//       fromCenter: formData.fromCenter,
//       remark: formData.remark,
//       date: formData.date,
//       transferNumber: formData.transferNumber,
//       products: productsData,
//       status: 'Draft' 
//     };

//     try {
//       if (id) {
//         await axiosInstance.put(`/stocktransfer/${id}`, payload);
//         setAlert({ show: true, message: 'Data updated successfully!', type: 'success' });
//       } else {
//         await axiosInstance.post('/stocktransfer', payload);
//         setAlert({ show: true, message: 'Data saved successfully!', type: 'success' });
//       }
      
//       setTimeout(() => {
//         navigate('/stock-transfer');
//       }, 1500);
//     } catch (error) {
//       console.error('Error saving draft:', error);
//       const errorMessage = error.response?.data?.message || 'Error saving draft. Please try again.';
//       setAlert({ show: true, message: errorMessage, type: 'danger' });
//     }
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };
//   const filteredProducts = products
//     .filter((p) =>
//       p.productTitle?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => {
//       const aSelected = !!selectedRows[a._id];
//       const bSelected = !!selectedRows[b._id];
//       if (aSelected && bSelected) {
//         const aOrder = selectionOrder.find(item => item.productId === a._id)?.order || 0;
//         const bOrder = selectionOrder.find(item => item.productId === b._id)?.order || 0;
//         return aOrder - bOrder;
//       }

//       if (aSelected && !bSelected) return -1;
//       if (!aSelected && bSelected) return 1;
//       return 0;
//     });

//   const inputBase =
//     'w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:ring-2';
//   const normalInput =
//     `${inputBase} border-gray-300 focus:border-blue-500 focus:ring-blue-100`;
//   const errorInput =
//     `${inputBase} border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100`;

//   return (
//     <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
//       {/* Page header */}
//       <div className="mb-5 flex items-center gap-3">
//         <button
//           type="button"
//           onClick={handleBack}
//           className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>

//         <h1 className="text-xl font-semibold text-gray-800">
//           {id ? 'Edit' : 'Add'} Transfer Request
//         </h1>
//       </div>

//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         {/* Header actions */}
//         <div className="flex flex-col gap-2 border-b border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end">
//           <button
//             type="button"
//             onClick={handleSaveDraft}
//             className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//           >
//             <Save size={16} />
//             Save As Draft
//           </button>

//           <button
//             type="button"
//             onClick={handleSubmit}
//             className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//           >
//             <Check size={16} />
//             Submit Transfer
//           </button>
//         </div>

//         <div className="p-5">
//           {alert.show && (
//             <div
//               className={`mb-5 flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm ${
//                 alert.type === 'success'
//                   ? 'border-green-200 bg-green-50 text-green-700'
//                   : 'border-red-200 bg-red-50 text-red-700'
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <FileText size={17} />
//                 <span>{alert.message}</span>
//               </div>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setAlert({
//                     show: false,
//                     message: '',
//                     type: '',
//                   })
//                 }
//                 className="rounded p-1 hover:bg-black/5"
//                 aria-label="Close alert"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* Main fields */}
//             <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
//               {/* Branch */}
//               <div>
//                 <label
//                   htmlFor="fromCenter"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Branch <span className="text-red-500">*</span>
//                 </label>

//                 <select
//                   id="fromCenter"
//                   name="fromCenter"
//                   value={formData.fromCenter}
//                   onChange={handleChange}
//                   disabled={centerLoading}
//                   className={
//                     errors.fromCenter
//                       ? errorInput
//                       : formData.fromCenter
//                         ? `${normalInput} border-green-300`
//                         : normalInput
//                   }
//                 >
//                   <option value="">Select Center</option>
//                   {centers.map((center) => (
//                     <option key={center._id} value={center._id}>
//                       {center.centerName}
//                     </option>
//                   ))}
//                 </select>

//                 {errors.fromCenter && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.fromCenter}
//                   </p>
//                 )}
//               </div>

//               {/* Date */}
//               <div>
//                 <label
//                   htmlFor="date"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Date <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   disabled
//                   value={formData.date}
//                   onChange={handleChange}
//                   className={
//                     errors.date
//                       ? errorInput
//                       : `${normalInput} border-green-300`
//                   }
//                 />

//                 {errors.date && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.date}
//                   </p>
//                 )}
//               </div>

//               {/* Transfer Number */}
//               <div>
//                 <label
//                   htmlFor="transferNumber"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Transfer Number
//                 </label>

//                 <input
//                   type="text"
//                   id="transferNumber"
//                   name="transferNumber"
//                   value={formData.transferNumber}
//                   onChange={handleChange}
//                   disabled
//                   className={`${normalInput} bg-gray-100 text-gray-600`}
//                 />

//                 {generatingOrderNo && (
//                   <p className="mt-1 text-xs text-gray-500">
//                     Generating transfer number...
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Remark */}
//             <div className="mt-5">
//               <label
//                 htmlFor="remark"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Remark
//               </label>

//               <textarea
//                 id="remark"
//                 name="remark"
//                 rows={3}
//                 value={formData.remark}
//                 onChange={handleChange}
//                 placeholder="Additional Comment"
//                 className={`${normalInput} resize-none`}
//               />
//             </div>

//             {/* Products */}
//             <div className="mt-7">
//               <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//                 <div className="flex items-center gap-3">
//                   <h2 className="text-base font-semibold text-gray-800">
//                     Select Products
//                   </h2>

//                   {errors.products && (
//                     <span className="text-xs font-medium text-red-600">
//                       {errors.products}
//                     </span>
//                   )}
//                 </div>

//                 <div className="relative w-full lg:w-[280px]">
//                   <Search
//                     size={16}
//                     className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                   />

//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) =>
//                       setSearchTerm(e.target.value)
//                     }
//                     placeholder="Search products..."
//                     className={`${normalInput} pl-9`}
//                   />
//                 </div>
//               </div>

//               {loading ? (
//                 <div className="flex justify-center py-10">
//                   <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto rounded-lg border border-gray-200">
//                   <table className="min-w-[900px] w-full border-collapse text-sm">
//                     <thead>
//                       <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
//                         <th className="border-b border-gray-200 px-4 py-3">
//                           Select
//                         </th>
//                         <th className="border-b border-gray-200 px-4 py-3">
//                           Product Name
//                         </th>
//                         <th className="border-b border-gray-200 px-4 py-3">
//                           Stock
//                         </th>
//                         <th className="border-b border-gray-200 px-4 py-3">
//                           Quantity
//                         </th>
//                         <th className="border-b border-gray-200 px-4 py-3">
//                           Remark
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {filteredProducts.length > 0 ? (
//                         filteredProducts.map((p) => {
//                           const selected =
//                             !!selectedRows[p._id];

//                           return (
//                             <tr
//                               key={p._id}
//                               className={`border-b border-gray-100 transition ${
//                                 selected
//                                   ? 'bg-blue-50/60'
//                                   : 'hover:bg-gray-50'
//                               }`}
//                             >
//                               <td className="px-4 py-3">
//                                 <input
//                                   type="checkbox"
//                                   checked={selected}
//                                   onChange={() =>
//                                     handleRowSelect(
//                                       p._id,
//                                       p.stock
//                                     )
//                                   }
//                                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                 />
//                               </td>

//                               <td className="px-4 py-3 font-medium text-gray-800">
//                                 {p.productTitle}
//                               </td>

//                               <td className="px-4 py-3 text-gray-700">
//                                 {p.stock?.currentStock || 0}
//                               </td>

//                               <td className="px-4 py-3">
//                                 {selected && (
//                                   <div>
//                                     <input
//                                       type="number"
//                                       min="1"
//                                       value={
//                                         selectedRows[p._id]
//                                           .quantity
//                                       }
//                                       onChange={(e) =>
//                                         handleRowInputChange(
//                                           p._id,
//                                           'quantity',
//                                           e.target.value
//                                         )
//                                       }
//                                       placeholder="Quantity"
//                                       className={`w-[110px] rounded-md border px-3 py-1.5 text-sm outline-none focus:ring-2 ${
//                                         errors[
//                                           `quantity_${p._id}`
//                                         ]
//                                           ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100'
//                                           : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
//                                       }`}
//                                     />

//                                     {errors[
//                                       `quantity_${p._id}`
//                                     ] && (
//                                       <p className="mt-1 text-xs text-red-600">
//                                         Quantity required
//                                       </p>
//                                     )}
//                                   </div>
//                                 )}
//                               </td>

//                               <td className="px-4 py-3">
//                                 {selected && (
//                                   <input
//                                     type="text"
//                                     value={
//                                       selectedRows[p._id]
//                                         .productRemark
//                                     }
//                                     onChange={(e) =>
//                                       handleRowInputChange(
//                                         p._id,
//                                         'productRemark',
//                                         e.target.value
//                                       )
//                                     }
//                                     placeholder="Product Remark"
//                                     className="w-full min-w-[220px] rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                   />
//                                 )}
//                               </td>
//                             </tr>
//                           );
//                         })
//                       ) : (
//                         <tr>
//                           <td
//                             colSpan={5}
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

//             {/* Footer actions */}
//             <div className="mt-5 flex flex-col-reverse gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
//               <button
//                 type="button"
//                 onClick={handleSaveDraft}
//                 className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//               >
//                 <RotateCcw size={16} />
//                 Save As Draft
//               </button>

//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//               >
//                 <Check size={16} />
//                 Submit Transfer
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddStockTransfer;


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import { generateOrderNumber } from '../../utils/orderNumberGenerator';
import {
  ArrowLeft,
  Check,
  FileText,
  RotateCcw,
  Search,
  Save,
  X,
} from 'lucide-react';

const AddStockTransfer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    fromCenter: '',
    remark: '',
    date: new Date().toISOString().split('T')[0],
    transferNumber: '',
  });
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [centerLoading, setCenterLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState({});
  const [errors, setErrors] = useState({});
  const [generatingOrderNo, setGeneratingOrderNo] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const [selectionOrder, setSelectionOrder] = useState([]);
  const selectionCounter = useRef(0);

  useEffect(() => {
    fetchCenters();
    fetchProducts();
    if (!id) {
      generateAutoOrderNumber();
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchStockRequest(id);
    }
  }, [id]);

  const generateAutoOrderNumber = async () => {
    setGeneratingOrderNo(true);
    try {
      const transferNumber = await generateOrderNumber(axiosInstance);
      setFormData(prev => ({
        ...prev,
        transferNumber: transferNumber
      }));
    } catch (error) {
      console.error('Error generating order number:', error);
    } finally {
      setGeneratingOrderNo(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const res = await axiosInstance.get('/centers/resellers/center');
      if (res.data.success) {
        setCenters(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
    } finally {
      setCenterLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/stockpurchase/products/with-stock');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockRequest = async (requestId) => {
    try {
      const res = await axiosInstance.get(`/stocktransfer/${requestId}`);
      const data = res.data.data;

      setFormData({
        fromCenter: data.fromCenter?._id || '',
        remark: data.remark || '',
        date: data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0],
        transferNumber: data.transferNumber || '',
      });

      const selectedProducts = {};
      const order = [];
      
      data.products.forEach((p, index) => {
        selectedProducts[p.product._id] = { 
          quantity: p.quantity,
          productRemark: p.productRemark || '',
          productInStock: p.productInStock || 0,
        };
        order.push({ productId: p.product._id, order: index });
      });
      
      setSelectedRows(selectedProducts);
      setSelectionOrder(order);
      selectionCounter.current = data.products.length;
    } catch (error) {
      console.error('Error fetching stock transfer request:', error);
    }
  };

  const handleRowSelect = (productId, productStock) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        setSelectionOrder(prevOrder => prevOrder.filter(item => item.productId !== productId));
        delete updated[productId];
      } else {
        const newOrder = selectionCounter.current++;
        setSelectionOrder(prevOrder => [
          { productId, order: newOrder },
          ...prevOrder
        ]);
        updated[productId] = { quantity: '', productRemark: '', productInStock: productStock || 0 };
      }
      return updated;
    });
  };
  
  const handleRowInputChange = (productId, field, value) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fromCenter) newErrors.fromCenter = 'This is a required field';
    if (!formData.date) newErrors.date = 'This is a required field';

    const selectedProducts = Object.keys(selectedRows).filter(id => selectedRows[id]);
    if (selectedProducts.length === 0) {
      newErrors.products = 'At least one product must be selected';
    }

    selectedProducts.forEach(productId => {
      const product = selectedRows[productId];
      if (!product.quantity || product.quantity <= 0) {
        newErrors[`quantity_${productId}`] = 'Quantity must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productsData = Object.keys(selectedRows)
    .filter((productId) => selectedRows[productId]) 
    .map((productId) => ({
      product: productId,
      quantity: parseInt(selectedRows[productId].quantity),
      productRemark: selectedRows[productId].productRemark,
    }));

    const payload = {
      fromCenter: formData.fromCenter,
      remark: formData.remark,
      date: formData.date,
      transferNumber: formData.transferNumber,
      products: productsData,
      status: 'Submitted' 
    };

    try {
      if (id) {
        await axiosInstance.put(`/stocktransfer/${id}`, payload);
        setAlert({ show: true, message: 'Data updated successfully!', type: 'success' });
      } else {
        await axiosInstance.post('/stocktransfer', payload);
        setAlert({ show: true, message: 'Data added successfully!', type: 'success' });
      }
      setTimeout(() => {
        navigate('/stock-transfer');
      }, 1500);
    } catch (error) {
      console.error('Error saving stock transfer request:', error);
    const errorMessage = error.response?.data?.message || 'Error saving stock transfer request. Please try again.';
    setAlert({ show: true, message: errorMessage, type: 'danger' });
    }
  };

  const handleSaveDraft = async () => {
    const productsData = Object.keys(selectedRows)
    .filter((productId) => selectedRows[productId]) 
    .map((productId) => ({
      product: productId,
      quantity: parseInt(selectedRows[productId].quantity) || 0,
      productRemark: selectedRows[productId].productRemark,
    }));

    const payload = {
      fromCenter: formData.fromCenter,
      remark: formData.remark,
      date: formData.date,
      transferNumber: formData.transferNumber,
      products: productsData,
      status: 'Draft' 
    };

    try {
      if (id) {
        await axiosInstance.put(`/stocktransfer/${id}`, payload);
        setAlert({ show: true, message: 'Data updated successfully!', type: 'success' });
      } else {
        await axiosInstance.post('/stocktransfer', payload);
        setAlert({ show: true, message: 'Data saved successfully!', type: 'success' });
      }
      
      setTimeout(() => {
        navigate('/stock-transfer');
      }, 1500);
    } catch (error) {
      console.error('Error saving draft:', error);
      const errorMessage = error.response?.data?.message || 'Error saving draft. Please try again.';
      setAlert({ show: true, message: errorMessage, type: 'danger' });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
  const filteredProducts = products
    .filter((p) =>
      p.productTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aSelected = !!selectedRows[a._id];
      const bSelected = !!selectedRows[b._id];
      if (aSelected && bSelected) {
        const aOrder = selectionOrder.find(item => item.productId === a._id)?.order || 0;
        const bOrder = selectionOrder.find(item => item.productId === b._id)?.order || 0;
        return aOrder - bOrder;
      }

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

  const inputBase =
    'w-full h-[41px] rounded-[1px] border bg-white px-3 py-2 text-[14px] text-[#495057] outline-none transition focus:ring-1';
  const normalInput =
    `${inputBase} border-[#ced4da] focus:border-[#80bdff] focus:ring-[#bfdeff]`;
  const errorInput =
    `${inputBase} border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100`;

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* Page header */}
      <div className="mb-2 flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1 rounded-md border border-[#2759a2] bg-[#2759a2] px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1f4b8b]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
          {id ? 'Edit' : 'Add'} Transfer Request
        </h1>
      </div>

      <div className="overflow-hidden rounded-t-[3px] border-x border-b border-gray-200 border-t-[4px] border-t-[#2759a2] bg-white shadow-none">
        {/* Header actions */}
        <div className="flex flex-col gap-2 border-b border-gray-200 bg-white px-5 py-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#2759a2] bg-[#2759a2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f4b8b]"
          >
            <Save size={16} />
            Save As Draft
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#b52b27] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#98231f]"
          >
            <Check size={16} />
            Submit Transfer
          </button>
        </div>

        <div className="p-[22px]">
          {alert.show && (
            <div
              className={`mb-5 flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm ${
                alert.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText size={17} />
                <span>{alert.message}</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAlert({
                    show: false,
                    message: '',
                    type: '',
                  })
                }
                className="rounded p-1 hover:bg-black/5"
                aria-label="Close alert"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Main fields */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {/* Branch */}
              <div>
                <label
                  htmlFor="fromCenter"
                  className="mb-1.5 block text-[16px] font-semibold text-[#343a40]"
                >
                  Branch <span className="text-red-500">*</span>
                </label>

                <select
                  id="fromCenter"
                  name="fromCenter"
                  value={formData.fromCenter}
                  onChange={handleChange}
                  disabled={centerLoading}
                  className={
                    errors.fromCenter
                      ? errorInput
                      : formData.fromCenter
                        ? `${normalInput} border-green-300`
                        : normalInput
                  }
                >
                  <option value="">Select Center</option>
                  {centers.map((center) => (
                    <option key={center._id} value={center._id}>
                      {center.centerName}
                    </option>
                  ))}
                </select>

                {errors.fromCenter && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.fromCenter}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="mb-1.5 block text-[16px] font-semibold text-[#343a40]"
                >
                  Date <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  id="date"
                  name="date"
                  disabled
                  value={formData.date}
                  onChange={handleChange}
                  className={
                    errors.date
                      ? errorInput
                      : `${normalInput} border-green-300`
                  }
                />

                {errors.date && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Transfer Number */}
              <div>
                <label
                  htmlFor="transferNumber"
                  className="mb-1.5 block text-[16px] font-semibold text-[#343a40]"
                >
                  Transfer Number
                </label>

                <input
                  type="text"
                  id="transferNumber"
                  name="transferNumber"
                  value={formData.transferNumber}
                  onChange={handleChange}
                  disabled
                  className={`${normalInput} bg-[#f8f9fa] text-[#6c757d]`}
                />

                {generatingOrderNo && (
                  <p className="mt-1 text-xs text-gray-500">
                    Generating transfer number...
                  </p>
                )}
              </div>
            </div>

            {/* Remark */}
            <div className="mt-5">
              <label
                htmlFor="remark"
                className="mb-1.5 block text-[16px] font-semibold text-[#343a40]"
              >
                Remark
              </label>

              <textarea
                id="remark"
                name="remark"
                rows={3}
                value={formData.remark}
                onChange={handleChange}
                placeholder="Additional Comment"
                className={`${normalInput} !h-[87px] resize-y`}
              />
            </div>

            {/* Products */}
            <div className="mt-6">
              <div className="mb-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-[21px] font-normal text-[#343a40]">
                    Select Products
                  </h2>

                  {errors.products && (
                    <span className="text-xs font-medium text-red-600">
                      {errors.products}
                    </span>
                  )}
                </div>

                <div className="relative w-full lg:w-[265px]">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    placeholder="Search products..."
                    className={`${normalInput} pl-9`}
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                </div>
              ) : (
                <div className="max-h-[310px] overflow-y-auto overflow-x-hidden border border-gray-200">
                  <table className="w-full table-fixed border-collapse text-[14px]">
                    <thead>
                      <tr className="sticky top-0 z-10 bg-white text-left text-[15px] font-bold text-black">
                        <th className="border border-gray-100 px-2 py-3">
                          Select
                        </th>
                        <th className="border border-gray-100 px-2 py-3">
                          Product Name
                        </th>
                        <th className="border border-gray-100 px-2 py-3">
                          Stock
                        </th>
                        <th className="border border-gray-100 px-2 py-3">
                          Quantity
                        </th>
                        <th className="border border-gray-100 px-2 py-3">
                          Remark
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => {
                          const selected =
                            !!selectedRows[p._id];

                          return (
                            <tr
                              key={p._id}
                              className={`border-b border-gray-100 transition ${
                                selected
                                  ? 'bg-[#d5e6ce]'
                                  : 'odd:bg-[#f1f1f1] even:bg-white hover:bg-gray-50'
                              }`}
                            >
                              <td className="border-x border-gray-100 px-2 py-2 align-top">
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() =>
                                    handleRowSelect(
                                      p._id,
                                      p.stock
                                    )
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>

                              <td className="border-x border-gray-100 px-2 py-2 align-top font-normal text-[#111827]">
                                {p.productTitle}
                              </td>

                              <td className="border-x border-gray-100 px-2 py-2 align-top text-[#111827]">
                                {p.stock?.currentStock || 0}
                              </td>

                              <td className="border-x border-gray-100 px-2 py-2 align-top">
                                {selected && (
                                  <div>
                                    <input
                                      type="number"
                                      min="1"
                                      value={
                                        selectedRows[p._id]
                                          .quantity
                                      }
                                      onChange={(e) =>
                                        handleRowInputChange(
                                          p._id,
                                          'quantity',
                                          e.target.value
                                        )
                                      }
                                      placeholder="Quantity"
                                      className={`w-[110px] rounded-md border px-3 py-1.5 text-sm outline-none focus:ring-2 ${
                                        errors[
                                          `quantity_${p._id}`
                                        ]
                                          ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100'
                                          : 'border-[#ced4da] focus:border-[#80bdff] focus:ring-[#bfdeff]'
                                      }`}
                                    />

                                    {errors[
                                      `quantity_${p._id}`
                                    ] && (
                                      <p className="mt-1 text-xs text-red-600">
                                        Quantity required
                                      </p>
                                    )}
                                  </div>
                                )}
                              </td>

                              <td className="border-x border-gray-100 px-2 py-2 align-top">
                                {selected && (
                                  <input
                                    type="text"
                                    value={
                                      selectedRows[p._id]
                                        .productRemark
                                    }
                                    onChange={(e) =>
                                      handleRowInputChange(
                                        p._id,
                                        'productRemark',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Product Remark"
                                    className="w-full min-w-0 rounded-none border border-[#ced4da] px-3 py-1.5 text-sm outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#bfdeff]"
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
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

            {/* Footer actions */}
            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#2759a2] bg-[#2759a2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f4b8b]"
              >
                <RotateCcw size={16} />
                Save As Draft
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#b52b27] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#98231f]"
              >
                <Check size={16} />
                Submit Transfer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStockTransfer;
