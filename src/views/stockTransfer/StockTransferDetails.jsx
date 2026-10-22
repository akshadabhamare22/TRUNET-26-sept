

// import React, { useState, useEffect } from 'react';
// import {
//   AlertCircle,
//   ArrowLeft,
//   Ban,
//   Check,
//   ClipboardCheck,
//   FileText,
//   PackageCheck,
//   Printer,
//   RefreshCw,
//   Send,
//   Truck,
//   X,
// } from 'lucide-react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axiosInstance from '../../axiosInstance';
// import companyLogo from '../../assets/images/logo.png'
// import { formatDate, formatDateTime } from '../../utils/FormatDateTime';
// import ShipGoodsModal from '../stockRequest/ShipGoodsModal';
// import IncompleteRemarkModal from '../stockRequest/IncompleteRemarkModal';
// import usePermission from '../../utils/usePermission';
// import StockSerialNumber from './StockSerialNumber';

// const StockTransferDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [approvedProducts, setApprovedProducts] = useState([]);
//   const [alert, setAlert] = useState({ type: '', message: '', visible: false });
//   const [shipmentModal, setShipmentModal] = useState(false)
//   const [errors, setErrors] = useState({});
//   const [currentShipmentAction, setCurrentShipmentAction] = useState(null);
//   const [incompleteModal, setIncompleteModal] = useState(false);
//   const [productReceipts, setProductReceipts] = useState([]);
//   const [serialModalVisible, setSerialModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [assignedSerials, setAssignedSerials] = useState({});

//   const { hasPermission} = usePermission(); 
  
//   const [shipmentData, setShipmentData] = useState({
//     shippedDate: '',
//     expectedDeliveryDate: '',
//     shipmentDetails: '',
//     shipmentRemark: '',
//     documents: []
//   });

//   const user = JSON.parse(localStorage.getItem('user')) || {};
//   const userRole = (user?.role?.roleTitle || '').toLowerCase();
//   const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
//   const userCenterType = userCenter.centerType || 'Outlet';

//   const userCenterId = userCenter._id;
//   const isToCenterUser = data?.toCenter?._id === userCenterId;

//   const isFromCenterUser = data?.fromCenter?._id === userCenterId;

//   const handleOpenSerialModal = (product) => {
//     console.log('Opening serial modal for product:', {
//       productId: product.product?._id,
//       productTitle: product.product?.productTitle,
//       currentApprovedQty: approvedProducts.find(p => p.productId === product.product?._id)?.approvedQty,
//       hasAssignedSerials: !!assignedSerials[product.product?._id]
//     });
//     setSelectedProduct(product);
//     setSerialModalVisible(true);
//   };
   
//   // const handleSerialNumbersUpdate = (productId, serialsArray) => {
//   //   setAssignedSerials(prev => ({
//   //     ...prev,
//   //     [productId]: serialsArray
//   //   }));
//   // };

//   const handleSerialNumbersUpdate = (productId, serialsArray) => {
//     console.log('handleSerialNumbersUpdate called:', {
//       productId,
//       serialsArray,
//       serialsCount: serialsArray.length
//     });
    
//     setAssignedSerials(prev => ({
//       ...prev,
//       [productId]: serialsArray
//     }));
    
//     setApprovedProducts(prev => prev.map(p => {
//       if (p.productId === productId) {
//         return {
//           ...p,
//           approvedQty: serialsArray.length.toString()
//         };
//       }
//       return p;
//     }));
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get(`/stocktransfer/${id}`);
//         if (response.data.success) {
//           setData(response.data.data);
//           const initialApproved = response.data.data.products.map(item => ({
//             _id: item._id,    
//             productId: item.product?._id,   
//             approvedQty:item.approvedQuantity !== undefined && item.approvedQuantity !== null? item.approvedQuantity: item.quantity || '',
  
//             approvedRemark: item.approvedRemark || ''
//           }));
//           setApprovedProducts(initialApproved);
          
//         } else {
//           throw new Error('Failed to fetch data');
//         }
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     if (id) fetchData();
//   }, [id]);

//   const handleShipGoods = async (shipmentData) => {
//     try {
//       const response = await axiosInstance.post(`/stocktransfer/${id}/ship`, shipmentData)
//       if (response.data.success) {
//         setAlert({ type: 'success', message: 'Shipment created successfully', visible: true })
//         setShipmentModal(false)
//         setTimeout(() => window.location.reload(), 1000)
//       } else {
//         setAlert({ type: 'danger', message: 'Failed to create shipment', visible: true })
//       }
//     } catch (err) {
//       console.error(err)
//       setAlert({ type: 'danger', message: 'Error creating shipment', visible: true })
//     }
//   }

//   const handleBack = () => navigate('/stock-transfer');

//   useEffect(() => {
//     if (data?.products) {
//       const initialReceipts = data.products.map(item => ({
//         productId: item.product?._id, 
//         receivedQuantity: item.receivedQuantity,
//         receivedRemark:item.receivedRemark
//       }));
//       setProductReceipts(initialReceipts);
//     }
//   }, [data]);
  
//   const handleReceiptChange = (productId, field, value) => {
//     setProductReceipts(prev =>
//       prev.map(p => (p.productId === productId ? { ...p, [field]: value } : p))
//     );
//   };

//   // const handleApprovedChange = (productId, field, value) => {
//   //   if (field === 'approvedQty') {
//   //     if (value === '' || /^\d+$/.test(value)) {
//   //       setErrors(prev => ({ ...prev, [productId]: undefined }));
//   //     } else {
//   //       setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
//   //     }
//   //   }
  
//   //   setApprovedProducts(prev =>
//   //     prev.map(p =>
//   //       p._id === productId ? { ...p, [field]: value } : p
//   //     )
//   //   );
//   // };  

  
//   const handleApprovedChange = (productId, field, value) => {
//     if (field === 'approvedQty') {
//       if (value === '' || /^\d+$/.test(value)) {
//         setErrors(prev => ({ ...prev, [productId]: undefined }));
//       } else {
//         setErrors(prev => ({ ...prev, [productId]: 'Invalid number' }));
//       }
//     }
  
//     setApprovedProducts(prev =>
//       prev.map(p =>
//         p.productId === productId ? { ...p, [field]: value } : p
//       )
//     );
//   };
  
// //approve admin

// const handleApprove = async () => {
//   let hasError = false;
//   const validationErrors = {};
  
//   const payload = approvedProducts.map(p => {

//     if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
//       validationErrors[p._id] = 'The input value was not a correct number';
//       hasError = true;
//     }
    
//     const productItem = data.products.find(item => item.product?._id === p.productId);
//     if (productItem && Number(p.approvedQty) > productItem.quantity) {
//       validationErrors[p._id] = `Approved quantity cannot exceed requested quantity (${productItem.quantity})`;
//       hasError = true;
//     }
    
//     if (productItem?.product?.trackSerialNumber === "Yes" && Number(p.approvedQty) > 0) {
//       const serialsForProduct = assignedSerials[p.productId] || [];
//       if (serialsForProduct.length !== Number(p.approvedQty)) {
//         validationErrors[p._id] = `Please assign ${p.approvedQty} serial number(s) for this product`;
//         hasError = true;
//       }
//     }
    
//     return {
//       productId: p.productId,
//       approvedQuantity: Number(p.approvedQty),
//       approvedRemark: p.approvedRemark || '',
//       approvedSerials: (assignedSerials[p.productId] || []).map(s => s.serialNumber)
//     };
//   });

//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
    
//     const missingSerials = Object.entries(validationErrors)
//       .filter(([_, error]) => error.includes('serial number'))
//       .map(([_, error]) => error);
    
//     if (missingSerials.length > 0) {
//       setAlert({ 
//         type: 'danger', 
//         message: `Missing serial numbers: ${missingSerials.join('. ')}`, 
//         visible: true 
//       });
//     }
//     return;
//   }
//   try {
    
//     setAlert({ type: 'info', message: 'Processing approval...', visible: true });
//     const response = await axiosInstance.post(`/stocktransfer/${id}/approve`, {
//       productApprovals: payload
//     });

//     if (response.data.success) {
//       setAlert({ 
//         type: 'success', 
//         message: response.data.message || 'Transfer approved successfully', 
//         visible: true 
//       });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ 
//         type: 'danger', 
//         message: response.data.message || 'Failed to approve transfer', 
//         visible: true 
//       });
//     }
//   } catch (err) {
//     console.error('Error approving transfer:', err);
    
//     let errorMessage = "Something went wrong while approving the transfer";
    
//     if (err.response?.data) {
//       const { data } = err.response;
      
//       if (data.errors && Array.isArray(data.errors)) {
//         const validationMessages = data.errors.map(error => {
//           if (typeof error === 'string') return error;
//           if (error.message) return error.message;
//           if (error.field && error.message) return `${error.field}: ${error.message}`;
//           return JSON.stringify(error);
//         }).join('. ');
        
//         errorMessage = `Validation failed: ${validationMessages}`;
//       }

//       else if (data.validationResults && Array.isArray(data.validationResults)) {
//         const failedValidations = data.validationResults
//           .filter(result => !result.valid)
//           .map(result => result.error || `Product ${result.productName} validation failed`)
//           .join('. ');
        
//         errorMessage = failedValidations || data.message || "Validation failed";
//       }

//       else if (data.validationErrors && Array.isArray(data.validationErrors)) {
//         const validationErrors = data.validationErrors
//           .map(error => error.error || `Product ${error.productName || error.productId} validation failed`)
//           .join('. ');
        
//         errorMessage = validationErrors || data.message || "Validation failed";
//       }
   
//       else if (data.error && typeof data.error === 'string') {
//         errorMessage = data.error;
//       }

//       else if (data.message) {
//         errorMessage = data.message;
//       }
//     }
    
//     setAlert({ 
//       type: 'danger', 
//       message: errorMessage, 
//       visible: true 
//     });
//   }
// };


// const handleApproveAdmin = async () => {
//   let hasError = false;
//   const payload = approvedProducts.map(p => {
//     if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
//       setErrors(prev => ({ ...prev, [p._id]: 'The input value was not a correct number' }));
//       hasError = true;
//     }
//     return {
//       productId: p.productId,
//       approvedQuantity: Number(p.approvedQty),
//       approvedRemark: p.approvedRemark || ''
//     };
//   });

//   if (hasError) return;

//   try {
//     const response = await axiosInstance.patch(`/stocktransfer/${id}/admin/approve`, {
//       productApprovals: payload
//     });

//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Data approved successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to approve data', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     const errorMessage =
//       err.response?.data?.message ||
//       err.response?.data?.error ||   
//       err.message ||              
//       "Something went wrong";
  
//     setAlert({ type: 'danger', message: errorMessage, visible: true });
//   }
// };


// //reject admin
// const handleRejectAdmin = async () => {
//   try {
//     const response = await axiosInstance.patch(`/stocktransfer/${id}/admin/reject`);
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Data reject successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to reject data', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error rejecting data', visible: true });
//   }
// };



// // Reject
// const handleReject = async () => {
//   try {
//     const response = await axiosInstance.post(`/stocktransfer/${id}/reject`);
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Data rejected successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to reject data', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error rejecting data', visible: true });
//   }
// };


// // Submit
// const handleSubmitRequest = async () => {
//   try {
//     const response = await axiosInstance.post(`/stocktransfer/${id}/submit`, { status: 'Submitted' });
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Data submitted successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to submit', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error to submit data', visible: true });
//   }
// };


// //****************************** approve qty **************************************/

// // const handleChangeApprovedQty = async () => {
// //   let hasError = false;
// //   const payload = approvedProducts.map(p => {
// //     if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
// //       setErrors(prev => ({
// //         ...prev,
// //         [p._id]: 'The input value was not a correct number',
// //       }));
// //       hasError = true;
// //     }
// //     return {
// //       productId: p.productId,
// //       approvedQuantity: Number(p.approvedQty),
// //       approvedRemark: p.approvedRemark || '',
// //       approvedSerials: (assignedSerials[p.productId] || []).map(s => s.serialNumber),
// //     };
// //   });

// //   if (hasError) return;

// //   try {
// //     const response = await axiosInstance.patch(
// //       `/stocktransfer/${id}/approved-quantities`,
// //       { productApprovals: payload }
// //     );

// //     if (response.data.success) {
// //       setAlert({
// //         type: 'success',
// //         message: 'Approved quantities updated successfully',
// //         visible: true,
// //       });
// //       // setTimeout(() => window.location.reload(), 1000);
// //     } else {
// //       setAlert({
// //         type: 'danger',
// //         message: response.data.message || 'Failed to update approved quantities',
// //         visible: true,
// //       });
// //     }
// //   } catch (err) {
// //     console.error(err);
// //     const backendMessage =
// //       err.response?.data?.message || 'Error updating approved quantities';

// //     setAlert({
// //       type: 'danger',
// //       message: backendMessage,
// //       visible: true,
// //     });
// //   }
// // };


// // approve qty
// const handleChangeApprovedQty = async () => {
//   let hasError = false;
//   const validationErrors = {};
  
//   const payload = approvedProducts.map(p => {
//     if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
//       validationErrors[p._id] = 'The input value was not a correct number';
//       hasError = true;
//     }
    
//     const productItem = data.products.find(item => item.product?._id === p.productId);
//     if (productItem && Number(p.approvedQty) > productItem.quantity) {
//       validationErrors[p._id] = `Approved quantity cannot exceed requested quantity (${productItem.quantity})`;
//       hasError = true;
//     }
//     if (productItem?.product?.trackSerialNumber === "Yes" && Number(p.approvedQty) > 0) {
//       const serialsForProduct = assignedSerials[p.productId] || [];
//       if (serialsForProduct.length !== Number(p.approvedQty)) {
//         validationErrors[p._id] = `Please assign ${p.approvedQty} serial number(s) for this product`;
//         hasError = true;
//       }
//     }
//     const serialsArray = assignedSerials[p.productId] || [];
//     return {
//       productId: p.productId,
//       approvedQuantity: Number(p.approvedQty),
//       approvedRemark: p.approvedRemark || '',
//       approvedSerials: serialsArray.map(s => s.serialNumber),
//     };
//   });

//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
    
//     const missingSerials = Object.entries(validationErrors)
//       .filter(([_, error]) => error.includes('serial number'))
//       .map(([_, error]) => error);
    
//     if (missingSerials.length > 0) {
//       setAlert({ 
//         type: 'danger', 
//         message: `Missing serial numbers: ${missingSerials.join('. ')}`, 
//         visible: true 
//       });
//     }
    
//     return;
//   }

//   try {
//     setAlert({ type: 'info', message: 'Updating approved quantities...', visible: true });
    
//     const response = await axiosInstance.patch(
//       `/stocktransfer/${id}/approved-quantities`,
//       { productApprovals: payload }
//     );

//     if (response.data.success) {
//       setAlert({
//         type: 'success',
//         message: 'Approved quantities updated successfully',
//         visible: true,
//       });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({
//         type: 'danger',
//         message: response.data.message || 'Failed to update approved quantities',
//         visible: true,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     const backendMessage =
//       err.response?.data?.message || 'Error updating approved quantities';

//     setAlert({
//       type: 'danger',
//       message: backendMessage,
//       visible: true,
//     });
//   }
// };

// //Cancel Shipment
// const handleCancelShipment = async () => {
//   try {
//     const response = await axiosInstance.patch(`/stocktransfer/${id}/reject-shipment`);
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Shipment canceled successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to cancel shipment', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error canceling shipment', visible: true });
//   }
// };

// // complete

// // const handleCompleteIndent = async () => {
// //   try {
// //     let payload = [];

// //     if (isToCenterUser) {
// //       payload = productReceipts.map(item => ({
// //         productId: item.productId,
// //         receivedQuantity: Number(item.receivedQuantity) || 0,
// //         receivedRemark: item.receivedRemark || '',
// //       }));
// //     } else {
// //       payload = data.products.map(item => ({
// //         productId: item.product?._id,
// //         receivedQuantity: item.approvedQuantity || item.receivedQuantity || 0,
// //         receivedRemark: item.receivedRemark || '',
// //       }));
// //     }

// //     const response = await axiosInstance.post(`/stocktransfer/${id}/complete`, {
// //       productReceipts: payload,
// //     });
    
// //     if (!response.data.success) {
// //       setAlert({
// //         type: 'danger',
// //         message: response.data.message || 'Failed to complete indent',
// //         visible: true,
// //       });
// //       return;
// //     }
    
// //     setAlert({
// //       type: 'success',
// //       message: 'Indent completed successfully',
// //       visible: true,
// //     });

// //     setTimeout(() => window.location.reload(), 1000);
// //   } catch (err) {
// //     console.error('Error in handleCompleteIndent:', err);

// //     const errorMessage =
// //       err.response?.data?.message ||
// //       err.message ||
// //       'An unexpected error occurred while completing the indent';

// //     setAlert({
// //       type: 'danger',
// //       message: errorMessage,
// //       visible: true,
// //     });
// //   }
// // };


// const handleCompleteIndent = async () => {
//   try {
//     let payload = [];
    
//     if (isToCenterUser) {
//       payload = data.products.map(item => {
//         const receiptItem = productReceipts.find(p => p.productId === item.product?._id);
//         const receivedQtyInput = receiptItem?.receivedQuantity;
//         const receivedQuantity = receivedQtyInput !== undefined && receivedQtyInput !== '' 
//           ? Number(receivedQtyInput) 
//           : (item.approvedQuantity || 0);
//         if (receivedQtyInput !== undefined && receivedQtyInput !== '' && Number(receivedQtyInput) <= 0) {
//           throw new Error(`Received quantity must be greater than 0 for product: ${item.product?.productTitle || item.product?._id}`);
//         }
//         if (receivedQuantity > (item.approvedQuantity || 0)) {
//           throw new Error(`Received quantity (${receivedQuantity}) cannot exceed approved quantity (${item.approvedQuantity || 0}) for product: ${item.product?.productTitle || item.product?._id}`);
//         }
        
//         return {
//           productId: item.product?._id,
//           receivedQuantity: receivedQuantity,
//           receivedRemark: receiptItem?.receivedRemark || item.receivedRemark || '',
//         };
//       });
//     } else {
//       payload = data.products.map(item => ({
//         productId: item.product?._id,
//         receivedQuantity: item.approvedQuantity || item.receivedQuantity || 0,
//         receivedRemark: item.receivedRemark || '',
//       }));
//     }

//     const response = await axiosInstance.post(`/stocktransfer/${id}/complete`, {
//       productReceipts: payload,
//     });
    
//     if (!response.data.success) {
//       setAlert({
//         type: 'danger',
//         message: response.data.message || 'Failed to complete indent',
//         visible: true,
//       });
//       return;
//     }
    
//     setAlert({
//       type: 'success',
//       message: 'Indent completed successfully',
//       visible: true,
//     });

//     setTimeout(() => window.location.reload(), 1000);
//   } catch (err) {
//     console.error('Error in handleCompleteIndent:', err);

//     const errorMessage = err.message || 
//       err.response?.data?.message ||
//       'An unexpected error occurred while completing the indent';

//     setAlert({
//       type: 'danger',
//       message: errorMessage,
//       visible: true,
//     });
//   }
// };

// // Update Shipment
// const handleOpenUpdateShipment = () => {
//   if (data.shippingInfo) {
//     setShipmentData({
//       shippedDate: data.shippingInfo.shippedDate?.split('T')[0] || '',
//       expectedDeliveryDate: data.shippingInfo.expectedDeliveryDate?.split('T')[0] || '',
//       shipmentDetails: data.shippingInfo.shipmentDetails || '',
//       shipmentRemark: data.shippingInfo.shipmentRemark || '',
//       documents: data.shippingInfo.documents || []
//     });
//   }
//   setCurrentShipmentAction(() => handleUpdateShipment);
//   setShipmentModal(true);
// };

// const handleUpdateShipment = async (shipmentData) => {
//   try {
//     const response = await axiosInstance.patch(`/stocktransfer/${id}/shipping-info`, shipmentData);
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Shipment updated successfully', visible: true });
//       setShipmentModal(false);
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to update shipment', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error updating shipment', visible: true });
//   }
// };

// const handleMarkIncomplete = async (remark) => {
//   try {

//     const receivedProducts = productReceipts.map(item => ({
//       productId: item.productId,
//       receivedQuantity: Number(item.receivedQuantity) || 0,
//       receivedRemark: item.receivedRemark || '',
//     }));
//     const payload = {
//       incompleteRemark: remark,
//       receivedProducts,
//     };
//     const response = await axiosInstance.post(
//       `/stocktransfer/${id}/mark-incomplete`,
//        payload
//     );
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'marked as incomplete', visible: true });
//       setIncompleteModal(false);
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to mark incomplete', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error marking incomplete', visible: true });
//   }
// };

// //handle incomplete
// // const handleIncomplete = async () => {
// //   try {
// //     const approvalsPayload = approvedProducts.map(p => ({
// //       productId: p.productId,
// //       approvedQuantity: Number(p.approvedQty) || 0,
// //       approvedRemark: p.approvedRemark || ''
// //     }));
// //     const receiptsPayload = productReceipts.map(r => ({
// //       productId: r.productId,
// //      receivedQuantity: Number(r.receivedQuantity) || 0,
// //       receivedRemark: r.receivedRemark || ''
// //     }));

// //     const response = await axiosInstance.patch(
// //       `/stocktransfer/${id}/complete-incomplete`,
// //       {
// //         productApprovals: approvalsPayload,
// //         productReceipts: receiptsPayload,
// //       }
// //     );

// //     if (response.data.success) {
// //       setAlert({ type: 'success', message: 'Indent completed successfully', visible: true });
// //       setTimeout(() => window.location.reload(), 1000);
// //     } else {
// //       setAlert({ type: 'danger', message: response.data.message || 'Failed to complete indent', visible: true });
// //     }
// //   } catch (err) {
// //     console.error(err);
// //     setAlert({ type: 'danger', message: 'Error completing indent', visible: true });
// //   }
// // };



// //handle incomplete

// const handleIncomplete = async () => {
//   try {
//     const approvalsPayload = approvedProducts.map(p => {
//       const productItem = data.products.find(item => item.product?._id === p.productId);
//       const serialsForProduct = assignedSerials[p.productId] || [];
//       let approvedSerialsArray = [];
      
//       if (serialsForProduct.length > 0) {
//         approvedSerialsArray = serialsForProduct.map(s => s.serialNumber);
//       } else if (productItem?.approvedSerials?.length > 0) {
//         approvedSerialsArray = productItem.approvedSerials.slice(0, Number(p.approvedQty) || 0);
//       }
//       if (productItem?.product?.trackSerialNumber === "Yes" && 
//           Number(p.approvedQty) > 0 && 
//           approvedSerialsArray.length === 0) {
//         throw new Error(`Please assign serial numbers for product: ${productItem.product.productTitle}`);
//       }
      
//       return {
//         productId: p.productId,
//         approvedQuantity: Number(p.approvedQty) || 0,
//         approvedRemark: p.approvedRemark || '',
//         approvedSerials: approvedSerialsArray
//       };
//     });
//     const receiptsPayload = productReceipts.map(r => ({
//       productId: r.productId,
//       receivedQuantity: Number(r.receivedQuantity) || 0,
//       receivedRemark: r.receivedRemark || ''
//     }));

//     const response = await axiosInstance.patch(
//       `/stocktransfer/${id}/complete-incomplete`,
//       {
//         productApprovals: approvalsPayload,
//         productReceipts: receiptsPayload,
//       }
//     );

//     if (response.data.success) {
//       setAlert({ 
//         type: 'success', 
//         message: response.data.message || 'Incomplete transfer completed successfully', 
//         visible: true 
//       });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ 
//         type: 'danger', 
//         message: response.data.message || 'Failed to complete incomplete transfer', 
//         visible: true 
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     if (err.response?.data) {
//       const { data } = err.response;
      
//       if (data.validationErrors && Array.isArray(data.validationErrors)) {
//         const validationMessages = data.validationErrors
//           .map(error => error.error || `Product ${error.productName || error.productId} validation failed`)
//           .join('. ');
        
//         setAlert({ 
//           type: 'danger', 
//           message: validationMessages, 
//           visible: true 
//         });
//       } else if (data.message) {
//         setAlert({ 
//           type: 'danger', 
//           message: data.message, 
//           visible: true 
//         });
//       } else {
//         setAlert({ 
//           type: 'danger', 
//           message: err.message || 'Error completing incomplete transfer', 
//           visible: true 
//         });
//       }
//     } else {
//       setAlert({ 
//         type: 'danger', 
//         message: err.message || 'Error completing incomplete transfer', 
//         visible: true 
//       });
//     }
//   }
// };
//   const handleApprovedBlur = (productId, value) => {
//     if (value === '' || !/^\d+$/.test(value)) {
//       setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
//     }
//   };


//   const handlePrintIndent = () => {
//     const printWindow = window.open('', '_blank');
//     const logoPath = companyLogo; 
//     const currentDate = new Date().toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
  
//     let subtotal = 0;
//     const gstRate = 18;
    
//     const productsWithTotals = data.products.map(item => {
//       const approvedQty = item.quantity || 0;
//       const salePrice = item.product?.salePrice || 0;
//       const total = approvedQty * salePrice;
//       const gstAmount = (total * gstRate) / 100;
//       const amountWithGst = total + gstAmount;
      
//       subtotal += total;
      
//       return {
//         ...item,
//         approvedQty,
//         salePrice,
//         total,
//         gstAmount,
//         amountWithGst
//       };
//     });
  
//     const totalGst = (subtotal * gstRate) / 100;
//     const grandTotal = subtotal + totalGst;
//     const indentDate = data.date ? new Date(data.date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     }) : '';

//     const formatDate = (dateString) => {
//       if (!dateString) return '';
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     };
  
//     const formatDateTime = (dateString) => {
//       if (!dateString) return '';
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     };
  
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Indent Invoice - ${data.transferNumber || ''}</title>
//         <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
//         <style>
//           *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//           :root {
//             --ink:        #0f1117;
//             --ink-mid:    #3a3f4b;
//             --ink-light:  #6b7280;
//             --rule:       #d1d5db;
//             --rule-light: #e5e8ec;
//             --accent:     #1a56db;
//             --accent-bg:  #eff4ff;
//             --surface:    #f8f9fb;
//             --white:      #ffffff;
//             --status-bg:  #e8f5e9;
//             --status-txt: #2e7d32;
//           }

//           body {
//             font-family: 'DM Sans', sans-serif;
//             background: #edf0f4;
//             color: var(--ink);
//             font-size: 13px;
//             line-height: 1.5;
//             padding: 32px 0 48px;
//           }

//           /* ── Page shell ─────────────────────────────────────── */
//           .page {
//             width: 900px;
//             margin: 0 auto;
//             background: var(--white);
//             border: 1px solid var(--rule);
//             border-radius: 6px;
//             overflow: hidden;
//             box-shadow: 0 4px 24px rgba(0,0,0,.08);
//           }

//           /* ── Top accent stripe ──────────────────────────────── */
//           .stripe {
//             height: 5px;
//             background: linear-gradient(90deg, var(--accent) 0%, #3b82f6 60%, #60a5fa 100%);
//           }

//           /* ── Header ─────────────────────────────────────────── */
//           .header {
//             display: flex;
//             align-items: flex-start;
//             justify-content: space-between;
//             padding: 28px 36px 22px;
//             border-bottom: 1px solid var(--rule-light);
//           }
//           .logo-wrap {
//             width: 160px;
//             height: 80px;
//             display: flex;
//             align-items: center;
//           }
//           .logo-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }

//           .company-block { text-align: right; }
//           .company-name {
//             font-size: 16px;
//             font-weight: 700;
//             color: var(--ink);
//             line-height: 1.3;
//             margin-bottom: 6px;
//           }
//           .company-block p {
//             font-size: 12px;
//             color: var(--ink-mid);
//             line-height: 1.6;
//           }

//           /* ── Title band ─────────────────────────────────────── */
//           .title-band {
//             background: var(--ink);
//             padding: 12px 36px;
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//           }
//           .title-band .doc-title {
//             font-size: 15px;
//             font-weight: 700;
//             letter-spacing: .08em;
//             text-transform: uppercase;
//             color: #fff;
//           }
//           .status-pill {
//             display: inline-flex;
//             align-items: center;
//             gap: 6px;
//             background: var(--status-bg);
//             color: var(--status-txt);
//             font-size: 11px;
//             font-weight: 600;
//             letter-spacing: .06em;
//             text-transform: uppercase;
//             padding: 4px 12px;
//             border-radius: 20px;
//           }
//           .status-pill::before {
//             content: '';
//             width: 7px; height: 7px;
//             border-radius: 50%;
//             background: var(--status-txt);
//             flex-shrink: 0;
//           }

//           /* ── Meta row ───────────────────────────────────────── */
//           .meta-row {
//             display: flex;
//             gap: 0;
//             border-bottom: 1px solid var(--rule-light);
//           }
//           .meta-cell {
//             flex: 1;
//             padding: 14px 36px;
//             border-right: 1px solid var(--rule-light);
//           }
//           .meta-cell:last-child { border-right: none; }
//           .meta-label {
//             font-size: 10px;
//             font-weight: 600;
//             letter-spacing: .08em;
//             text-transform: uppercase;
//             color: var(--ink-light);
//             margin-bottom: 3px;
//           }
//           .meta-value {
//             font-family: 'DM Mono', monospace;
//             font-size: 14px;
//             font-weight: 500;
//             color: var(--ink);
//           }

//           /* ── Address section ────────────────────────────────── */
//           .address-row {
//             display: grid;
//             grid-template-columns: 1fr 1px 1fr;
//             border-bottom: 1px solid var(--rule-light);
//           }
//           .address-divider { background: var(--rule-light); }
//           .address-cell { padding: 20px 36px; }
//           .address-cell .section-label {
//             font-size: 10px;
//             font-weight: 700;
//             letter-spacing: .1em;
//             text-transform: uppercase;
//             color: var(--accent);
//             border-bottom: 2px solid var(--accent-bg);
//             padding-bottom: 5px;
//             margin-bottom: 10px;
//           }
//           .address-name {
//             font-size: 13px;
//             font-weight: 700;
//             color: var(--ink);
//             margin-bottom: 4px;
//           }
//           .address-cell p {
//             font-size: 12px;
//             color: var(--ink-mid);
//             line-height: 1.65;
//           }

//           /* ── Transfer arrow badge ───────────────────────────── */
//           .transfer-arrow {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 20px;
//             color: var(--accent);
//             background: var(--accent-bg);
//             border-radius: 50%;
//             width: 36px;
//             height: 36px;
//             margin: auto;
//             position: relative;
//             top: 50%;
//             transform: translateY(-50%);
//           }

//           /* ── Products table ─────────────────────────────────── */
//           .table-wrap { padding: 0 36px 28px; margin-top: 24px; }
//           .table-heading {
//             font-size: 10px;
//             font-weight: 700;
//             letter-spacing: .1em;
//             text-transform: uppercase;
//             color: var(--ink-light);
//             margin-bottom: 10px;
//           }

//           .products-table {
//             width: 100%;
//             border-collapse: collapse;
//             font-size: 12.5px;
//           }
//           .products-table thead tr { background: var(--ink); }
//           .products-table th {
//             padding: 10px 12px;
//             text-align: left;
//             color: #fff;
//             font-weight: 600;
//             font-size: 11px;
//             letter-spacing: .05em;
//             text-transform: uppercase;
//             white-space: nowrap;
//           }
//           .products-table th:not(:first-child) { text-align: right; }
//           .products-table td {
//             padding: 9px 12px;
//             border-bottom: 1px solid var(--rule-light);
//             color: var(--ink-mid);
//             vertical-align: top;
//           }
//           .products-table td:not(:first-child):not(:nth-child(2)) {
//             text-align: right;
//             font-family: 'DM Mono', monospace;
//             font-size: 12px;
//           }
//           .products-table td:nth-child(2) { color: var(--ink); font-weight: 500; }
//           .products-table tbody tr:nth-child(even) td { background: var(--surface); }
//           .products-table tbody tr:last-child td { border-bottom: none; }
//           .products-table .amount-col { font-weight: 700; color: var(--ink); }

//           /* ── Totals ─────────────────────────────────────────── */
//           .totals-row {
//             display: flex;
//             justify-content: flex-end;
//             padding: 0 36px 24px;
//           }
//           .totals-box {
//             width: 280px;
//             border: 1px solid var(--rule);
//             border-radius: 6px;
//             overflow: hidden;
//           }
//           .totals-line {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 8px 16px;
//             border-bottom: 1px solid var(--rule-light);
//             font-size: 12.5px;
//           }
//           .totals-line:last-child { border-bottom: none; }
//           .totals-line .t-label { color: var(--ink-mid); }
//           .totals-line .t-val { font-family: 'DM Mono', monospace; color: var(--ink); font-weight: 500; }
//           .totals-line.grand { background: var(--ink); color: #fff; }
//           .totals-line.grand .t-label { color: #c8d0de; font-weight: 600; font-size: 12px; letter-spacing: .05em; text-transform: uppercase; }
//           .totals-line.grand .t-val { color: #fff; font-size: 15px; font-weight: 700; }

//           /* ── Info grid ──────────────────────────────────────── */
//           .info-section { padding: 0 36px 28px; }
//           .info-grid {
//             width: 100%;
//             border-collapse: collapse;
//             border: 1px solid var(--rule);
//             border-radius: 6px;
//             overflow: hidden;
//             font-size: 12.5px;
//           }
//           .info-grid td {
//             padding: 9px 14px;
//             border: 1px solid var(--rule-light);
//             vertical-align: top;
//           }
//           .info-grid .lbl {
//             font-size: 10px;
//             font-weight: 700;
//             letter-spacing: .07em;
//             text-transform: uppercase;
//             color: var(--ink-light);
//             background: var(--surface);
//             white-space: nowrap;
//             width: 14%;
//           }
//           .info-grid .val { color: var(--ink-mid); width: 36%; }

//           /* ── Signature ──────────────────────────────────────── */
//           .sig-row {
//             border-top: 1px solid var(--rule-light);
//             padding: 24px 36px 28px;
//             display: flex;
//             justify-content: space-between;
//             align-items: flex-end;
//           }
//           .sig-note {
//             font-size: 11px;
//             color: var(--ink-light);
//             max-width: 360px;
//             line-height: 1.7;
//           }
//           .sig-block { text-align: center; width: 180px; }
//           .sig-line {
//             border-top: 1.5px solid var(--ink-mid);
//             padding-top: 8px;
//             margin-top: 44px;
//             font-size: 11.5px;
//             font-weight: 600;
//             color: var(--ink-mid);
//             letter-spacing: .04em;
//             text-transform: uppercase;
//           }

//           /* ── Print buttons ──────────────────────────────────── */
//           .btn-row {
//             text-align: center;
//             padding: 20px 0 8px;
//             display: flex;
//             gap: 12px;
//             justify-content: center;
//           }
//           .btn {
//             padding: 10px 28px;
//             font-family: 'DM Sans', sans-serif;
//             font-size: 13px;
//             font-weight: 600;
//             border: none;
//             border-radius: 5px;
//             cursor: pointer;
//             letter-spacing: .02em;
//             transition: opacity .15s;
//           }
//           .btn:hover { opacity: .85; }
//           .btn-primary { background: var(--accent); color: #fff; }
//           .btn-ghost { background: var(--surface); color: var(--ink-mid); border: 1px solid var(--rule); }

//           /* ── Print media ────────────────────────────────────── */
//           @media print {
//             body { background: #fff; padding: 0; font-size: 11.5px; }
//             .page { width: 100%; box-shadow: none; border: none; border-radius: 0; }
//             .btn-row { display: none; }
//             .products-table thead tr { background: var(--ink) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//             .title-band { background: var(--ink) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//             .info-grid .lbl { background: var(--surface) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//             .totals-line.grand { background: var(--ink) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//             .stripe { background: var(--accent) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="page">
//           <div class="stripe"></div>

//           <!-- ── HEADER ───────────────────────────────────────── -->
//           <div class="header">
//             <div class="logo-wrap">
//               <img src="${logoPath}" alt="Company Logo">
//             </div>
//             <div class="company-block">
//               <div class="company-name">Sancfil Technologies Internet Services Pvt Ltd</div>
//               <p>A1, 1st Floor, Landmark Co-operative Housing Society</p>
//               <p>Sector 14, Vashi, Navi Mumbai – 400 709</p>
//               <p>Tel: +91 8097578100 / 8097578176</p>
//               <p>stock@trunet.co.in</p>
//             </div>
//           </div>

//           <!-- ── TITLE BAND ────────────────────────────────────── -->
//           <div class="title-band">
//             <span class="doc-title">Stock Transfer Indent</span>
//             <span class="status-pill">${data.status || 'Pending'}</span>
//           </div>

//           <!-- ── META ROW ──────────────────────────────────────── -->
//           <div class="meta-row">
//             <div class="meta-cell">
//               <div class="meta-label">Transfer Number</div>
//               <div class="meta-value">${data.transferNumber || '—'}</div>
//             </div>
//             <div class="meta-cell">
//               <div class="meta-label">Indent Date</div>
//               <div class="meta-value">${indentDate || '—'}</div>
//             </div>
//             <div class="meta-cell">
//               <div class="meta-label">Print Date</div>
//               <div class="meta-value">${currentDate}</div>
//             </div>
//           </div>

//           <!-- ── ADDRESSES ─────────────────────────────────────── -->
//           <div class="address-row">
//             <div class="address-cell">
//               <div class="section-label">From — Center</div>
//               <div class="address-name">${data.fromCenter?.centerName || ''}</div>
//               <p>${data.fromCenter?.addressLine1 || ''} ${data.fromCenter?.addressLine2 || ''}</p>
//               <p>${data.fromCenter?.city || ''}${data.fromCenter?.city && data.fromCenter?.state ? ', ' : ''}${data.fromCenter?.state || ''}</p>
//               <p>${data.fromCenter?.email || ''}</p>
//             </div>
//             <div class="address-divider"></div>
//             <div class="address-cell">
//               <div class="section-label">To — Center</div>
//               <div class="address-name">${data.toCenter?.centerName || ''}</div>
//               <p>${data.toCenter?.addressLine1 || ''} ${data.toCenter?.addressLine2 || ''}</p>
//               <p>${data.toCenter?.city || ''}${data.toCenter?.city && data.toCenter?.state ? ', ' : ''}${data.toCenter?.state || ''}</p>
//               <p>${data.toCenter?.email || ''}</p>
//             </div>
//           </div>

//           <!-- ── PRODUCTS TABLE ────────────────────────────────── -->
//           <div class="table-wrap">
//             <div class="table-heading">Products &amp; Pricing</div>
//             <table class="products-table">
//               <thead>
//                 <tr>
//                   <th style="width:36px">#</th>
//                   <th>Product</th>
//                   <th>Qty</th>
//                   <th>Rate (₹)</th>
//                   <th>Total (₹)</th>
//                   <th>GST @${gstRate}%&nbsp;(₹)</th>
//                   <th>Amount (₹)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${productsWithTotals.map((item, index) => `
//                   <tr>
//                     <td style="color:var(--ink-light);font-size:11px">${index + 1}</td>
//                     <td>${item.product?.productTitle || ''}</td>
//                     <td>${item.quantity || 0}</td>
//                     <td>${item.salePrice.toFixed(2)}</td>
//                     <td>${item.total.toFixed(2)}</td>
//                     <td>${item.gstAmount.toFixed(2)}</td>
//                     <td class="amount-col">${item.amountWithGst.toFixed(2)}</td>
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>
//           </div>

//           <!-- ── TOTALS ────────────────────────────────────────── -->
//           <div class="totals-row">
//             <div class="totals-box">
//               <div class="totals-line">
//                 <span class="t-label">Subtotal</span>
//                 <span class="t-val">₹ ${subtotal.toFixed(2)}</span>
//               </div>
//               <div class="totals-line">
//                 <span class="t-label">GST @ ${gstRate}%</span>
//                 <span class="t-val">₹ ${totalGst.toFixed(2)}</span>
//               </div>
//               <div class="totals-line grand">
//                 <span class="t-label">Grand Total</span>
//                 <span class="t-val">₹ ${grandTotal.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           <!-- ── INFO GRID ─────────────────────────────────────── -->
//           <div class="info-section">
//             <div class="table-heading" style="margin-bottom:10px">Shipment &amp; Additional Info</div>
//             <table class="info-grid">
//               <tr>
//                 <td class="lbl">Approved On</td>
//                 <td class="val">${formatDateTime(data.centerApproval?.approvedAt) || ''}</td>
//                 <td class="lbl">Shipment Date</td>
//                 <td class="val">${formatDate(data.shippingInfo?.shippedDate) || ''}</td>
//               </tr>
//               <tr>
//                 <td class="lbl">Expected Delivery</td>
//                 <td class="val">${formatDate(data.shippingInfo?.expectedDeliveryDate) || formatDate(data.shippingInfo?.shippedDate) || ''}</td>
//                 <td class="lbl">Completed On</td>
//                 <td class="val">${formatDateTime(data.completedOn) || ''}</td>
//               </tr>
//               <tr>
//                 <td class="lbl">Shipment Detail</td>
//                 <td class="val">${data.shippingInfo?.shipmentDetail || '—'}</td>
//                 <td class="lbl">Shipment Remark</td>
//                 <td class="val">${data.shippingInfo?.shipmentRemark || '—'}</td>
//               </tr>
//               <tr>
//                 <td class="lbl">Remark</td>
//                 <td class="val" colspan="3">${data.remark || '—'}</td>
//               </tr>
//             </table>
//           </div>

//           <!-- ── SIGNATURE ─────────────────────────────────────── -->
//           <div class="sig-row">
//             <p class="sig-note">
//               This is a computer-generated transfer indent document.<br>
//               Please verify all details before processing. For queries contact stock@trunet.co.in
//             </p>
//             <div class="sig-block">
//               <div class="sig-line">Authorized Signatory</div>
//             </div>
//           </div>

//         </div><!-- /.page -->

//         <!-- ── PRINT BUTTONS (screen only) ──────────────────────── -->
//         <div class="btn-row">
//           <button class="btn btn-primary" onclick="window.print()">🖨 Print Indent</button>
//           <button class="btn btn-ghost" onclick="window.close()">✕ Close</button>
//         </div>

//       </body>
//       </html>
//     `;
    
//     printWindow.document.write(printContent);
//     printWindow.document.close();
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mx-4 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6 lg:mx-8">
//         <div className="flex items-center gap-2">
//           <AlertCircle size={18} />
//           <span>{error}</span>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="mx-4 mt-5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 sm:mx-6 lg:mx-8">
//         Stock Request not found
//       </div>
//     );
//   }

//   const getStatusClasses = (status) => {
//     switch ((status || "").toLowerCase()) {
//       case "draft":
//         return "bg-gray-100 text-gray-700";
//       case "submitted":
//         return "bg-blue-100 text-blue-700";
//       case "admin_approved":
//         return "bg-indigo-100 text-indigo-700";
//       case "confirmed":
//         return "bg-amber-100 text-amber-700";
//       case "shipped":
//         return "bg-purple-100 text-purple-700";
//       case "incompleted":
//         return "bg-orange-100 text-orange-700";
//       case "completed":
//         return "bg-green-100 text-green-700";
//       case "rejected":
//       case "admin_rejected":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const actionButtonClasses = {
//     primary:
//       "inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50",
//     success:
//       "inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50",
//     warning:
//       "inline-flex items-center gap-2 rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50",
//     danger:
//       "inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50",
//     secondary:
//       "inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50",
//   };

//   return (
//     <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
//       {alert.visible && (
//         <div
//           className={`mb-5 flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm ${
//             alert.type === "success"
//               ? "border-green-200 bg-green-50 text-green-700"
//               : alert.type === "info"
//                 ? "border-blue-200 bg-blue-50 text-blue-700"
//                 : "border-red-200 bg-red-50 text-red-700"
//           }`}
//           role="alert"
//         >
//           <div className="flex items-start gap-2">
//             <AlertCircle size={18} className="mt-0.5 shrink-0" />
//             <span>{alert.message}</span>
//           </div>

//           <button
//             type="button"
//             onClick={() => setAlert({ ...alert, visible: false })}
//             className="rounded p-1 transition hover:bg-black/5"
//             aria-label="Close alert"
//           >
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* Page header */}
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             onClick={handleBack}
//             className={actionButtonClasses.secondary}
//           >
//             <ArrowLeft size={16} />
//             Back
//           </button>

//           <div>
//             <h1 className="text-xl font-semibold text-gray-800">
//               Indent Detail
//             </h1>
//             <p className="mt-0.5 text-sm text-gray-500">
//               Transfer #{data.orderNumber || ""}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main details card */}
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
//           <div className="flex flex-wrap items-center gap-3">
//             <h2 className="text-base font-semibold text-gray-800">
//               Indent: {data.orderNumber || ""}
//             </h2>

//             {data.status && (
//               <span
//                 className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
//                   data.status
//                 )}`}
//               >
//                 {data.status}
//               </span>
//             )}
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             {data.status === "Shipped" && isToCenterUser && (
//               <button
//                 type="button"
//                 className={actionButtonClasses.success}
//                 onClick={handleCompleteIndent}
//               >
//                 <PackageCheck size={16} />
//                 Complete The Indent
//               </button>
//             )}

//             <button
//               type="button"
//               className={actionButtonClasses.secondary}
//               onClick={handlePrintIndent}
//             >
//               <Printer size={16} />
//               Print Indent
//             </button>
//           </div>
//         </div>

//         <div className="p-5">
//           {/* Status banner */}
//           <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
//             {data.status === "Submitted" ? (
//               <strong>Transfer Pending from SSV TELECOM PVT LTD</strong>
//             ) : (
//               <span>
//                 <strong>Transfer Approved by SSV TELECOM PVT LTD at </strong>
//                 {formatDateTime(data.adminApproval?.approvedAt || "")}
//               </span>
//             )}
//           </div>

//           {/* Transfer information */}
//           <div className="overflow-x-auto rounded-lg border border-gray-200">
//             <table className="min-w-[900px] w-full border-collapse text-sm">
//               <tbody>
//                 {[
//                   [
//                     "Center/Center Code",
//                     data.orderNumber || "",
//                     "Shipment Date",
//                     formatDate(data.shippingInfo?.shippedDate || ""),
//                     "Completed on",
//                     formatDateTime(data.completionInfo?.completedOn || ""),
//                   ],
//                   [
//                     "Indent Date",
//                     formatDate(data.date || ""),
//                     "Expected Delivery",
//                     formatDate(data.shippingInfo?.expectedDeliveryDate || ""),
//                     "Completed by",
//                     data.completionInfo?.completedBy?.fullName || "",
//                   ],
//                   [
//                     "Remark",
//                     data.remark || "",
//                     "Shipment Detail",
//                     data.shippingInfo?.shipmentDetails || "",
//                     "Incomplete on",
//                     formatDateTime(data.completionInfo?.incompleteOn || ""),
//                   ],
//                   [
//                     "Created at",
//                     formatDateTime(data.createdAt),
//                     "Shipment Remark",
//                     data.shippingInfo?.shipmentRemark || "",
//                     "Incomplete by",
//                     data.completionInfo?.incompleteBy?.fullName || "",
//                   ],
//                   [
//                     "Created by",
//                     data.createdBy?.fullName || "",
//                     "Document",
//                     data.document || "",
//                     "Incomplete Remark",
//                     data.completionInfo?.incompleteRemark || "",
//                   ],
//                   [
//                     "Approved at",
//                     formatDateTime(data.centerApproval?.approvedAt || ""),
//                     "Shipped at",
//                     formatDateTime(data.shippingInfo?.shippedAt || ""),
//                     "Received at",
//                     formatDateTime(data.receivingInfo?.receivedAt || ""),
//                   ],
//                   [
//                     "Approved by",
//                     data.centerApproval?.approvedBy?.fullName || "",
//                     "Shipped by",
//                     data.shippingInfo?.shippedBy?.fullName || "",
//                     "Received by",
//                     data.receivingInfo?.receivedBy?.fullName || "",
//                   ],
//                 ].map((row, index) => (
//                   <tr key={index} className="border-b border-gray-200 last:border-b-0">
//                     <td className="w-[14%] bg-gray-50 px-4 py-3 font-semibold text-gray-600">
//                       {row[0]}:
//                     </td>
//                     <td className="w-[19%] px-4 py-3 text-gray-800">
//                       {row[1] || "—"}
//                     </td>
//                     <td className="w-[14%] bg-gray-50 px-4 py-3 font-semibold text-gray-600">
//                       {row[2]}:
//                     </td>
//                     <td className="w-[19%] px-4 py-3 text-gray-800">
//                       {row[3] || "—"}
//                     </td>
//                     <td className="w-[14%] bg-gray-50 px-4 py-3 font-semibold text-gray-600">
//                       {row[4]}:
//                     </td>
//                     <td className="w-[20%] px-4 py-3 text-gray-800">
//                       {row[5] || "—"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Product details */}
//       <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
//           <h2 className="text-base font-semibold text-gray-800">
//             Product Details
//           </h2>

//           <div className="flex flex-wrap items-center gap-2">
//             {data.status === "Draft" &&
//               userRole !== "admin" &&
//               userRole !== "superadmin" && (
//                 <button
//                   type="button"
//                   className={actionButtonClasses.primary}
//                   onClick={handleSubmitRequest}
//                 >
//                   <Send size={16} />
//                   Submit
//                 </button>
//               )}

//             {data.status === "Incompleted" &&
//               userRole !== "admin" &&
//               isFromCenterUser && (
//                 <button
//                   type="button"
//                   className={actionButtonClasses.warning}
//                   onClick={handleIncomplete}
//                 >
//                   <RefreshCw size={16} />
//                   Change Qty And Complete Request
//                 </button>
//               )}

//             {data.status === "Confirmed" &&
//               userRole !== "admin" &&
//               isFromCenterUser && (
//                 <>
//                   <button
//                     type="button"
//                     className={actionButtonClasses.primary}
//                     onClick={handleChangeApprovedQty}
//                   >
//                     <ClipboardCheck size={16} />
//                     Change Approved Qty
//                   </button>

//                   <button
//                     type="button"
//                     className={actionButtonClasses.success}
//                     onClick={() => {
//                       setCurrentShipmentAction(() => handleShipGoods);
//                       setShipmentModal(true);
//                     }}
//                   >
//                     <Truck size={16} />
//                     Ship the Goods
//                   </button>

//                   <button
//                     type="button"
//                     className={actionButtonClasses.danger}
//                     onClick={handleReject}
//                   >
//                     <Ban size={16} />
//                     Reject Request
//                   </button>
//                 </>
//               )}

//             {data.status === "Shipped" &&
//               userRole !== "admin" &&
//               isFromCenterUser && (
//                 <>
//                   <button
//                     type="button"
//                     className={actionButtonClasses.primary}
//                     onClick={handleOpenUpdateShipment}
//                   >
//                     <Truck size={16} />
//                     Update Shipment
//                   </button>

//                   <button
//                     type="button"
//                     className={actionButtonClasses.danger}
//                     onClick={handleCancelShipment}
//                   >
//                     <Ban size={16} />
//                     Cancel Shipment
//                   </button>

//                   <button
//                     type="button"
//                     className={actionButtonClasses.danger}
//                     onClick={handleReject}
//                   >
//                     <Ban size={16} />
//                     Reject Request
//                   </button>
//                 </>
//               )}

//             {data.status === "Shipped" &&
//               userRole !== "admin" &&
//               isToCenterUser && (
//                 <button
//                   type="button"
//                   className={actionButtonClasses.warning}
//                   onClick={() => setIncompleteModal(true)}
//                 >
//                   <AlertCircle size={16} />
//                   Incomplete
//                 </button>
//               )}

//             {data.status === "Admin_Approved" &&
//               userRole !== "admin" &&
//               hasPermission("Transfer", "approval_transfer_center") &&
//               isFromCenterUser && (
//                 <>
//                   <button
//                     type="button"
//                     className={actionButtonClasses.success}
//                     onClick={handleApprove}
//                   >
//                     <Check size={16} />
//                     Submit &amp; Approve Request
//                   </button>

//                   <button
//                     type="button"
//                     className={actionButtonClasses.danger}
//                     onClick={handleReject}
//                   >
//                     <Ban size={16} />
//                     Submit &amp; Reject Request
//                   </button>
//                 </>
//               )}

//             {data.status === "Submitted" &&
//               (userRole === "admin" || userRole === "superadmin") && (
//                 <>
//                   <button
//                     type="button"
//                     className={actionButtonClasses.success}
//                     onClick={handleApproveAdmin}
//                   >
//                     <Check size={16} />
//                     Approval
//                   </button>

//                   <button
//                     type="button"
//                     className={actionButtonClasses.danger}
//                     onClick={handleRejectAdmin}
//                   >
//                     <Ban size={16} />
//                     Reject
//                   </button>
//                 </>
//               )}
//           </div>
//         </div>

//         <div className="p-5">
//           <div className="overflow-x-auto rounded-lg border border-gray-200">
//             <table className="min-w-[1200px] w-full border-collapse text-sm">
//               <thead>
//                 <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
//                   <th className="border-b border-gray-200 px-4 py-3">Product</th>
//                   <th className="border-b border-gray-200 px-4 py-3">Center Stock</th>
//                   <th className="border-b border-gray-200 px-4 py-3">Requested Qty</th>
//                   <th className="border-b border-gray-200 px-4 py-3">Stock Qty</th>
//                   <th className="border-b border-gray-200 px-4 py-3">Product Remark</th>
//                   <th className="border-b border-gray-200 px-4 py-3">Approved Qty</th>
//                   <th className="border-b border-gray-200 px-4 py-3">Approved Remark</th>
//                   <th className="border-b border-gray-200 px-4 py-3">Received Qty</th>
//                   <th className="border-b border-gray-200 px-4 py-3">Received Remark</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {data.products?.length > 0 ? (
//                   data.products.map((item) => {
//                     const approvedItem =
//                       approvedProducts.find(
//                         (p) => p.productId === item.product?._id
//                       ) || {};

//                     const receivedQty =
//                       productReceipts.find(
//                         (p) => p.productId === item.product?._id
//                       )?.receivedQuantity ||
//                       item.receivedQuantity ||
//                       0;

//                     const approvedQty =
//                       approvedItem.approvedQty ||
//                       item.approvedQuantity ||
//                       0;

//                     const shouldShowMismatch =
//                       data.status === "Incompleted" ||
//                       data.status === "Completed";

//                     const isQuantityMismatch =
//                       shouldShowMismatch &&
//                       Number(receivedQty) !== Number(approvedQty);

//                     return (
//                       <tr
//                         key={item._id}
//                         className={`border-b border-gray-100 transition hover:bg-gray-50 ${
//                           isQuantityMismatch ? "bg-red-50" : ""
//                         }`}
//                       >
//                         <td className="px-4 py-3 font-medium text-gray-800">
//                           {item.product?.productTitle || ""}
//                         </td>

//                         <td className="px-4 py-3 text-gray-700">
//                           {item.centerStockQuantity || 0}
//                         </td>

//                         <td className="px-4 py-3 text-gray-700">
//                           {item.quantity || 0}
//                         </td>

//                         <td className="px-4 py-3 text-gray-700">
//                           {item.productInStock || 0}
//                         </td>

//                         <td className="max-w-[240px] px-4 py-3 text-gray-700">
//                           {item.productRemark || ""}
//                         </td>

//                         <td className="px-4 py-3">
//                           {isFromCenterUser ? (
//                             <div className="flex items-start gap-2">
//                               <div>
//                                 <input
//                                   type="text"
//                                   value={approvedItem.approvedQty ?? ""}
//                                   onChange={(e) =>
//                                     handleApprovedChange(
//                                       item.product._id,
//                                       "approvedQty",
//                                       e.target.value
//                                     )
//                                   }
//                                   onBlur={(e) =>
//                                     handleApprovedBlur(
//                                       item._id,
//                                       e.target.value
//                                     )
//                                   }
//                                   className={`w-20 rounded-md border px-2 py-1.5 text-sm outline-none focus:ring-2 ${
//                                     errors[item._id]
//                                       ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
//                                       : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
//                                   }`}
//                                 />

//                                 {errors[item._id] && (
//                                   <p className="mt-1 text-xs text-red-600">
//                                     {errors[item._id]}
//                                   </p>
//                                 )}
//                               </div>

//                               {item.product?.trackSerialNumber === "Yes" && (
//                                 <button
//                                   type="button"
//                                   onClick={() => handleOpenSerialModal(item)}
//                                   title="Add Serial Numbers"
//                                   className="rounded p-1.5 text-blue-600 transition hover:bg-blue-50"
//                                 >
//                                   <FileText size={19} />
//                                 </button>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-gray-700">
//                               {approvedItem.approvedQty || ""}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-4 py-3">
//                           {isFromCenterUser ? (
//                             <input
//                               type="text"
//                               value={approvedItem.approvedRemark || ""}
//                               onChange={(e) =>
//                                 handleApprovedChange(
//                                   item.product._id,
//                                   "approvedRemark",
//                                   e.target.value
//                                 )
//                               }
//                               className="w-full min-w-[160px] rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                             />
//                           ) : (
//                             <span className="text-gray-700">
//                               {item.approvedRemark || ""}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-4 py-3">
//                           {userCenterType === "Center" &&
//                           isToCenterUser &&
//                           data.status === "Shipped" ? (
//                             <input
//                               type="text"
//                               value={
//                                 productReceipts.find(
//                                   (p) => p.productId === item.product?._id
//                                 )?.receivedQuantity || ""
//                               }
//                               onChange={(e) =>
//                                 handleReceiptChange(
//                                   item.product?._id,
//                                   "receivedQuantity",
//                                   e.target.value
//                                 )
//                               }
//                               className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                             />
//                           ) : (
//                             <span className="text-gray-700">
//                               {item.receivedQuantity || ""}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-4 py-3">
//                           {userCenterType === "Center" &&
//                           isToCenterUser &&
//                           data.status === "Shipped" ? (
//                             <input
//                               type="text"
//                               value={
//                                 productReceipts.find(
//                                   (p) => p.productId === item.product?._id
//                                 )?.receivedRemark || ""
//                               }
//                               onChange={(e) =>
//                                 handleReceiptChange(
//                                   item.product?._id,
//                                   "receivedRemark",
//                                   e.target.value
//                                 )
//                               }
//                               className="w-full min-w-[180px] rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                             />
//                           ) : (
//                             <span className="text-gray-700">
//                               {item.receivedRemark || ""}
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={9}
//                       className="px-4 py-10 text-center text-sm text-gray-500"
//                     >
//                       No products found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       <ShipGoodsModal
//         visible={shipmentModal}
//         onClose={() => setShipmentModal(false)}
//         onSubmit={currentShipmentAction}
//         initialData={shipmentData}
//       />

//       <IncompleteRemarkModal
//         visible={incompleteModal}
//         onClose={() => setIncompleteModal(false)}
//         onSubmit={handleMarkIncomplete}
//         initialRemark={data.incompleteRemark}
//       />

//       <StockSerialNumber
//         visible={serialModalVisible}
//         onClose={() => setSerialModalVisible(false)}
//         product={selectedProduct}
//         approvedQty={
//           Number(
//             approvedProducts.find(
//               (p) => p.productId === selectedProduct?.product?._id
//             )?.approvedQty
//           ) || 0
//         }
//         initialSerials={
//           assignedSerials[selectedProduct?.product?._id] || []
//         }
//         onSerialNumbersUpdate={handleSerialNumbersUpdate}
//         warehouseId={data?.fromCenter?._id}
//       />
//     </div>
//   );
// };

// export default StockTransferDetails;



// import React, { useState, useEffect } from 'react';
// import {
//   AlertCircle,
//   ArrowLeft,
//   Ban,
//   Check,
//   ClipboardCheck,
//   FileText,
//   PackageCheck,
//   Printer,
//   RefreshCw,
//   Send,
//   Truck,
//   X,
// } from 'lucide-react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axiosInstance from '../../axiosInstance';
// import companyLogo from '../../assets/images/logo.png'
// import { formatDate, formatDateTime } from '../../utils/FormatDateTime';
// import ShipGoodsModal from '../stockRequest/ShipGoodsModal';
// import IncompleteRemarkModal from '../stockRequest/IncompleteRemarkModal';
// import usePermission from '../../utils/usePermission';
// import StockSerialNumber from './StockSerialNumber';

// const StockTransferDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [approvedProducts, setApprovedProducts] = useState([]);
//   const [alert, setAlert] = useState({ type: '', message: '', visible: false });
//   const [shipmentModal, setShipmentModal] = useState(false)
//   const [errors, setErrors] = useState({});
//   const [currentShipmentAction, setCurrentShipmentAction] = useState(null);
//   const [incompleteModal, setIncompleteModal] = useState(false);
//   const [productReceipts, setProductReceipts] = useState([]);
//   const [serialModalVisible, setSerialModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [assignedSerials, setAssignedSerials] = useState({});

//   const { hasPermission} = usePermission(); 
  
//   const [shipmentData, setShipmentData] = useState({
//     shippedDate: '',
//     expectedDeliveryDate: '',
//     shipmentDetails: '',
//     shipmentRemark: '',
//     documents: []
//   });

//   const user = JSON.parse(localStorage.getItem('user')) || {};
//   const userRole = (user?.role?.roleTitle || '').toLowerCase();
//   const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
//   const userCenterType = userCenter.centerType || 'Outlet';

//   const userCenterId = userCenter._id;
//   const isToCenterUser = data?.toCenter?._id === userCenterId;

//   const isFromCenterUser = data?.fromCenter?._id === userCenterId;

//   const handleOpenSerialModal = (product) => {
//     console.log('Opening serial modal for product:', {
//       productId: product.product?._id,
//       productTitle: product.product?.productTitle,
//       currentApprovedQty: approvedProducts.find(p => p.productId === product.product?._id)?.approvedQty,
//       hasAssignedSerials: !!assignedSerials[product.product?._id]
//     });
//     setSelectedProduct(product);
//     setSerialModalVisible(true);
//   };
   
//   // const handleSerialNumbersUpdate = (productId, serialsArray) => {
//   //   setAssignedSerials(prev => ({
//   //     ...prev,
//   //     [productId]: serialsArray
//   //   }));
//   // };

//   const handleSerialNumbersUpdate = (productId, serialsArray) => {
//     console.log('handleSerialNumbersUpdate called:', {
//       productId,
//       serialsArray,
//       serialsCount: serialsArray.length
//     });
    
//     setAssignedSerials(prev => ({
//       ...prev,
//       [productId]: serialsArray
//     }));
    
//     setApprovedProducts(prev => prev.map(p => {
//       if (p.productId === productId) {
//         return {
//           ...p,
//           approvedQty: serialsArray.length.toString()
//         };
//       }
//       return p;
//     }));
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get(`/stocktransfer/${id}`);
//         if (response.data.success) {
//           setData(response.data.data);
//           const initialApproved = response.data.data.products.map(item => ({
//             _id: item._id,    
//             productId: item.product?._id,   
//             approvedQty:item.approvedQuantity !== undefined && item.approvedQuantity !== null? item.approvedQuantity: item.quantity || '',
  
//             approvedRemark: item.approvedRemark || ''
//           }));
//           setApprovedProducts(initialApproved);
          
//         } else {
//           throw new Error('Failed to fetch data');
//         }
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     if (id) fetchData();
//   }, [id]);

//   const handleShipGoods = async (shipmentData) => {
//     try {
//       const response = await axiosInstance.post(`/stocktransfer/${id}/ship`, shipmentData)
//       if (response.data.success) {
//         setAlert({ type: 'success', message: 'Shipment created successfully', visible: true })
//         setShipmentModal(false)
//         setTimeout(() => window.location.reload(), 1000)
//       } else {
//         setAlert({ type: 'danger', message: 'Failed to create shipment', visible: true })
//       }
//     } catch (err) {
//       console.error(err)
//       setAlert({ type: 'danger', message: 'Error creating shipment', visible: true })
//     }
//   }

//   const handleBack = () => navigate('/stock-transfer');

//   useEffect(() => {
//     if (data?.products) {
//       const initialReceipts = data.products.map(item => ({
//         productId: item.product?._id, 
//         receivedQuantity: item.receivedQuantity,
//         receivedRemark:item.receivedRemark
//       }));
//       setProductReceipts(initialReceipts);
//     }
//   }, [data]);
  
//   const handleReceiptChange = (productId, field, value) => {
//     setProductReceipts(prev =>
//       prev.map(p => (p.productId === productId ? { ...p, [field]: value } : p))
//     );
//   };

//   // const handleApprovedChange = (productId, field, value) => {
//   //   if (field === 'approvedQty') {
//   //     if (value === '' || /^\d+$/.test(value)) {
//   //       setErrors(prev => ({ ...prev, [productId]: undefined }));
//   //     } else {
//   //       setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
//   //     }
//   //   }
  
//   //   setApprovedProducts(prev =>
//   //     prev.map(p =>
//   //       p._id === productId ? { ...p, [field]: value } : p
//   //     )
//   //   );
//   // };  

  
//   const handleApprovedChange = (productId, field, value) => {
//     if (field === 'approvedQty') {
//       if (value === '' || /^\d+$/.test(value)) {
//         setErrors(prev => ({ ...prev, [productId]: undefined }));
//       } else {
//         setErrors(prev => ({ ...prev, [productId]: 'Invalid number' }));
//       }
//     }
  
//     setApprovedProducts(prev =>
//       prev.map(p =>
//         p.productId === productId ? { ...p, [field]: value } : p
//       )
//     );
//   };
  
// //approve admin

// const handleApprove = async () => {
//   let hasError = false;
//   const validationErrors = {};
  
//   const payload = approvedProducts.map(p => {

//     if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
//       validationErrors[p._id] = 'The input value was not a correct number';
//       hasError = true;
//     }
    
//     const productItem = data.products.find(item => item.product?._id === p.productId);
//     if (productItem && Number(p.approvedQty) > productItem.quantity) {
//       validationErrors[p._id] = `Approved quantity cannot exceed requested quantity (${productItem.quantity})`;
//       hasError = true;
//     }
    
//     if (productItem?.product?.trackSerialNumber === "Yes" && Number(p.approvedQty) > 0) {
//       const serialsForProduct = assignedSerials[p.productId] || [];
//       if (serialsForProduct.length !== Number(p.approvedQty)) {
//         validationErrors[p._id] = `Please assign ${p.approvedQty} serial number(s) for this product`;
//         hasError = true;
//       }
//     }
    
//     return {
//       productId: p.productId,
//       approvedQuantity: Number(p.approvedQty),
//       approvedRemark: p.approvedRemark || '',
//       approvedSerials: (assignedSerials[p.productId] || []).map(s => s.serialNumber)
//     };
//   });

//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
    
//     const missingSerials = Object.entries(validationErrors)
//       .filter(([_, error]) => error.includes('serial number'))
//       .map(([_, error]) => error);
    
//     if (missingSerials.length > 0) {
//       setAlert({ 
//         type: 'danger', 
//         message: `Missing serial numbers: ${missingSerials.join('. ')}`, 
//         visible: true 
//       });
//     }
//     return;
//   }
//   try {
    
//     setAlert({ type: 'info', message: 'Processing approval...', visible: true });
//     const response = await axiosInstance.post(`/stocktransfer/${id}/approve`, {
//       productApprovals: payload
//     });

//     if (response.data.success) {
//       setAlert({ 
//         type: 'success', 
//         message: response.data.message || 'Transfer approved successfully', 
//         visible: true 
//       });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ 
//         type: 'danger', 
//         message: response.data.message || 'Failed to approve transfer', 
//         visible: true 
//       });
//     }
//   } catch (err) {
//     console.error('Error approving transfer:', err);
    
//     let errorMessage = "Something went wrong while approving the transfer";
    
//     if (err.response?.data) {
//       const { data } = err.response;
      
//       if (data.errors && Array.isArray(data.errors)) {
//         const validationMessages = data.errors.map(error => {
//           if (typeof error === 'string') return error;
//           if (error.message) return error.message;
//           if (error.field && error.message) return `${error.field}: ${error.message}`;
//           return JSON.stringify(error);
//         }).join('. ');
        
//         errorMessage = `Validation failed: ${validationMessages}`;
//       }

//       else if (data.validationResults && Array.isArray(data.validationResults)) {
//         const failedValidations = data.validationResults
//           .filter(result => !result.valid)
//           .map(result => result.error || `Product ${result.productName} validation failed`)
//           .join('. ');
        
//         errorMessage = failedValidations || data.message || "Validation failed";
//       }

//       else if (data.validationErrors && Array.isArray(data.validationErrors)) {
//         const validationErrors = data.validationErrors
//           .map(error => error.error || `Product ${error.productName || error.productId} validation failed`)
//           .join('. ');
        
//         errorMessage = validationErrors || data.message || "Validation failed";
//       }
   
//       else if (data.error && typeof data.error === 'string') {
//         errorMessage = data.error;
//       }

//       else if (data.message) {
//         errorMessage = data.message;
//       }
//     }
    
//     setAlert({ 
//       type: 'danger', 
//       message: errorMessage, 
//       visible: true 
//     });
//   }
// };


// const handleApproveAdmin = async () => {
//   let hasError = false;
//   const payload = approvedProducts.map(p => {
//     if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
//       setErrors(prev => ({ ...prev, [p._id]: 'The input value was not a correct number' }));
//       hasError = true;
//     }
//     return {
//       productId: p.productId,
//       approvedQuantity: Number(p.approvedQty),
//       approvedRemark: p.approvedRemark || ''
//     };
//   });

//   if (hasError) return;

//   try {
//     const response = await axiosInstance.patch(`/stocktransfer/${id}/admin/approve`, {
//       productApprovals: payload
//     });

//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Data approved successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to approve data', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     const errorMessage =
//       err.response?.data?.message ||
//       err.response?.data?.error ||   
//       err.message ||              
//       "Something went wrong";
  
//     setAlert({ type: 'danger', message: errorMessage, visible: true });
//   }
// };


// //reject admin
// const handleRejectAdmin = async () => {
//   try {
//     const response = await axiosInstance.patch(`/stocktransfer/${id}/admin/reject`);
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Data reject successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to reject data', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error rejecting data', visible: true });
//   }
// };



// // Reject
// const handleReject = async () => {
//   try {
//     const response = await axiosInstance.post(`/stocktransfer/${id}/reject`);
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Data rejected successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to reject data', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error rejecting data', visible: true });
//   }
// };


// // Submit
// const handleSubmitRequest = async () => {
//   try {
//     const response = await axiosInstance.post(`/stocktransfer/${id}/submit`, { status: 'Submitted' });
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Data submitted successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to submit', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error to submit data', visible: true });
//   }
// };


// //****************************** approve qty **************************************/

// // const handleChangeApprovedQty = async () => {
// //   let hasError = false;
// //   const payload = approvedProducts.map(p => {
// //     if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
// //       setErrors(prev => ({
// //         ...prev,
// //         [p._id]: 'The input value was not a correct number',
// //       }));
// //       hasError = true;
// //     }
// //     return {
// //       productId: p.productId,
// //       approvedQuantity: Number(p.approvedQty),
// //       approvedRemark: p.approvedRemark || '',
// //       approvedSerials: (assignedSerials[p.productId] || []).map(s => s.serialNumber),
// //     };
// //   });

// //   if (hasError) return;

// //   try {
// //     const response = await axiosInstance.patch(
// //       `/stocktransfer/${id}/approved-quantities`,
// //       { productApprovals: payload }
// //     );

// //     if (response.data.success) {
// //       setAlert({
// //         type: 'success',
// //         message: 'Approved quantities updated successfully',
// //         visible: true,
// //       });
// //       // setTimeout(() => window.location.reload(), 1000);
// //     } else {
// //       setAlert({
// //         type: 'danger',
// //         message: response.data.message || 'Failed to update approved quantities',
// //         visible: true,
// //       });
// //     }
// //   } catch (err) {
// //     console.error(err);
// //     const backendMessage =
// //       err.response?.data?.message || 'Error updating approved quantities';

// //     setAlert({
// //       type: 'danger',
// //       message: backendMessage,
// //       visible: true,
// //     });
// //   }
// // };


// // approve qty
// const handleChangeApprovedQty = async () => {
//   let hasError = false;
//   const validationErrors = {};
  
//   const payload = approvedProducts.map(p => {
//     if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
//       validationErrors[p._id] = 'The input value was not a correct number';
//       hasError = true;
//     }
    
//     const productItem = data.products.find(item => item.product?._id === p.productId);
//     if (productItem && Number(p.approvedQty) > productItem.quantity) {
//       validationErrors[p._id] = `Approved quantity cannot exceed requested quantity (${productItem.quantity})`;
//       hasError = true;
//     }
//     if (productItem?.product?.trackSerialNumber === "Yes" && Number(p.approvedQty) > 0) {
//       const serialsForProduct = assignedSerials[p.productId] || [];
//       if (serialsForProduct.length !== Number(p.approvedQty)) {
//         validationErrors[p._id] = `Please assign ${p.approvedQty} serial number(s) for this product`;
//         hasError = true;
//       }
//     }
//     const serialsArray = assignedSerials[p.productId] || [];
//     return {
//       productId: p.productId,
//       approvedQuantity: Number(p.approvedQty),
//       approvedRemark: p.approvedRemark || '',
//       approvedSerials: serialsArray.map(s => s.serialNumber),
//     };
//   });

//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
    
//     const missingSerials = Object.entries(validationErrors)
//       .filter(([_, error]) => error.includes('serial number'))
//       .map(([_, error]) => error);
    
//     if (missingSerials.length > 0) {
//       setAlert({ 
//         type: 'danger', 
//         message: `Missing serial numbers: ${missingSerials.join('. ')}`, 
//         visible: true 
//       });
//     }
    
//     return;
//   }

//   try {
//     setAlert({ type: 'info', message: 'Updating approved quantities...', visible: true });
    
//     const response = await axiosInstance.patch(
//       `/stocktransfer/${id}/approved-quantities`,
//       { productApprovals: payload }
//     );

//     if (response.data.success) {
//       setAlert({
//         type: 'success',
//         message: 'Approved quantities updated successfully',
//         visible: true,
//       });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({
//         type: 'danger',
//         message: response.data.message || 'Failed to update approved quantities',
//         visible: true,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     const backendMessage =
//       err.response?.data?.message || 'Error updating approved quantities';

//     setAlert({
//       type: 'danger',
//       message: backendMessage,
//       visible: true,
//     });
//   }
// };

// //Cancel Shipment
// const handleCancelShipment = async () => {
//   try {
//     const response = await axiosInstance.patch(`/stocktransfer/${id}/reject-shipment`);
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Shipment canceled successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to cancel shipment', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error canceling shipment', visible: true });
//   }
// };

// // complete

// // const handleCompleteIndent = async () => {
// //   try {
// //     let payload = [];

// //     if (isToCenterUser) {
// //       payload = productReceipts.map(item => ({
// //         productId: item.productId,
// //         receivedQuantity: Number(item.receivedQuantity) || 0,
// //         receivedRemark: item.receivedRemark || '',
// //       }));
// //     } else {
// //       payload = data.products.map(item => ({
// //         productId: item.product?._id,
// //         receivedQuantity: item.approvedQuantity || item.receivedQuantity || 0,
// //         receivedRemark: item.receivedRemark || '',
// //       }));
// //     }

// //     const response = await axiosInstance.post(`/stocktransfer/${id}/complete`, {
// //       productReceipts: payload,
// //     });
    
// //     if (!response.data.success) {
// //       setAlert({
// //         type: 'danger',
// //         message: response.data.message || 'Failed to complete indent',
// //         visible: true,
// //       });
// //       return;
// //     }
    
// //     setAlert({
// //       type: 'success',
// //       message: 'Indent completed successfully',
// //       visible: true,
// //     });

// //     setTimeout(() => window.location.reload(), 1000);
// //   } catch (err) {
// //     console.error('Error in handleCompleteIndent:', err);

// //     const errorMessage =
// //       err.response?.data?.message ||
// //       err.message ||
// //       'An unexpected error occurred while completing the indent';

// //     setAlert({
// //       type: 'danger',
// //       message: errorMessage,
// //       visible: true,
// //     });
// //   }
// // };


// const handleCompleteIndent = async () => {
//   try {
//     let payload = [];
    
//     if (isToCenterUser) {
//       payload = data.products.map(item => {
//         const receiptItem = productReceipts.find(p => p.productId === item.product?._id);
//         const receivedQtyInput = receiptItem?.receivedQuantity;
//         const receivedQuantity = receivedQtyInput !== undefined && receivedQtyInput !== '' 
//           ? Number(receivedQtyInput) 
//           : (item.approvedQuantity || 0);
//         if (receivedQtyInput !== undefined && receivedQtyInput !== '' && Number(receivedQtyInput) <= 0) {
//           throw new Error(`Received quantity must be greater than 0 for product: ${item.product?.productTitle || item.product?._id}`);
//         }
//         if (receivedQuantity > (item.approvedQuantity || 0)) {
//           throw new Error(`Received quantity (${receivedQuantity}) cannot exceed approved quantity (${item.approvedQuantity || 0}) for product: ${item.product?.productTitle || item.product?._id}`);
//         }
        
//         return {
//           productId: item.product?._id,
//           receivedQuantity: receivedQuantity,
//           receivedRemark: receiptItem?.receivedRemark || item.receivedRemark || '',
//         };
//       });
//     } else {
//       payload = data.products.map(item => ({
//         productId: item.product?._id,
//         receivedQuantity: item.approvedQuantity || item.receivedQuantity || 0,
//         receivedRemark: item.receivedRemark || '',
//       }));
//     }

//     const response = await axiosInstance.post(`/stocktransfer/${id}/complete`, {
//       productReceipts: payload,
//     });
    
//     if (!response.data.success) {
//       setAlert({
//         type: 'danger',
//         message: response.data.message || 'Failed to complete indent',
//         visible: true,
//       });
//       return;
//     }
    
//     setAlert({
//       type: 'success',
//       message: 'Indent completed successfully',
//       visible: true,
//     });

//     setTimeout(() => window.location.reload(), 1000);
//   } catch (err) {
//     console.error('Error in handleCompleteIndent:', err);

//     const errorMessage = err.message || 
//       err.response?.data?.message ||
//       'An unexpected error occurred while completing the indent';

//     setAlert({
//       type: 'danger',
//       message: errorMessage,
//       visible: true,
//     });
//   }
// };

// // Update Shipment
// const handleOpenUpdateShipment = () => {
//   if (data.shippingInfo) {
//     setShipmentData({
//       shippedDate: data.shippingInfo.shippedDate?.split('T')[0] || '',
//       expectedDeliveryDate: data.shippingInfo.expectedDeliveryDate?.split('T')[0] || '',
//       shipmentDetails: data.shippingInfo.shipmentDetails || '',
//       shipmentRemark: data.shippingInfo.shipmentRemark || '',
//       documents: data.shippingInfo.documents || []
//     });
//   }
//   setCurrentShipmentAction(() => handleUpdateShipment);
//   setShipmentModal(true);
// };

// const handleUpdateShipment = async (shipmentData) => {
//   try {
//     const response = await axiosInstance.patch(`/stocktransfer/${id}/shipping-info`, shipmentData);
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Shipment updated successfully', visible: true });
//       setShipmentModal(false);
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to update shipment', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error updating shipment', visible: true });
//   }
// };

// const handleMarkIncomplete = async (remark) => {
//   try {

//     const receivedProducts = productReceipts.map(item => ({
//       productId: item.productId,
//       receivedQuantity: Number(item.receivedQuantity) || 0,
//       receivedRemark: item.receivedRemark || '',
//     }));
//     const payload = {
//       incompleteRemark: remark,
//       receivedProducts,
//     };
//     const response = await axiosInstance.post(
//       `/stocktransfer/${id}/mark-incomplete`,
//        payload
//     );
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'marked as incomplete', visible: true });
//       setIncompleteModal(false);
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to mark incomplete', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error marking incomplete', visible: true });
//   }
// };

// //handle incomplete
// // const handleIncomplete = async () => {
// //   try {
// //     const approvalsPayload = approvedProducts.map(p => ({
// //       productId: p.productId,
// //       approvedQuantity: Number(p.approvedQty) || 0,
// //       approvedRemark: p.approvedRemark || ''
// //     }));
// //     const receiptsPayload = productReceipts.map(r => ({
// //       productId: r.productId,
// //      receivedQuantity: Number(r.receivedQuantity) || 0,
// //       receivedRemark: r.receivedRemark || ''
// //     }));

// //     const response = await axiosInstance.patch(
// //       `/stocktransfer/${id}/complete-incomplete`,
// //       {
// //         productApprovals: approvalsPayload,
// //         productReceipts: receiptsPayload,
// //       }
// //     );

// //     if (response.data.success) {
// //       setAlert({ type: 'success', message: 'Indent completed successfully', visible: true });
// //       setTimeout(() => window.location.reload(), 1000);
// //     } else {
// //       setAlert({ type: 'danger', message: response.data.message || 'Failed to complete indent', visible: true });
// //     }
// //   } catch (err) {
// //     console.error(err);
// //     setAlert({ type: 'danger', message: 'Error completing indent', visible: true });
// //   }
// // };



// //handle incomplete

// const handleIncomplete = async () => {
//   try {
//     const approvalsPayload = approvedProducts.map(p => {
//       const productItem = data.products.find(item => item.product?._id === p.productId);
//       const serialsForProduct = assignedSerials[p.productId] || [];
//       let approvedSerialsArray = [];
      
//       if (serialsForProduct.length > 0) {
//         approvedSerialsArray = serialsForProduct.map(s => s.serialNumber);
//       } else if (productItem?.approvedSerials?.length > 0) {
//         approvedSerialsArray = productItem.approvedSerials.slice(0, Number(p.approvedQty) || 0);
//       }
//       if (productItem?.product?.trackSerialNumber === "Yes" && 
//           Number(p.approvedQty) > 0 && 
//           approvedSerialsArray.length === 0) {
//         throw new Error(`Please assign serial numbers for product: ${productItem.product.productTitle}`);
//       }
      
//       return {
//         productId: p.productId,
//         approvedQuantity: Number(p.approvedQty) || 0,
//         approvedRemark: p.approvedRemark || '',
//         approvedSerials: approvedSerialsArray
//       };
//     });
//     const receiptsPayload = productReceipts.map(r => ({
//       productId: r.productId,
//       receivedQuantity: Number(r.receivedQuantity) || 0,
//       receivedRemark: r.receivedRemark || ''
//     }));

//     const response = await axiosInstance.patch(
//       `/stocktransfer/${id}/complete-incomplete`,
//       {
//         productApprovals: approvalsPayload,
//         productReceipts: receiptsPayload,
//       }
//     );

//     if (response.data.success) {
//       setAlert({ 
//         type: 'success', 
//         message: response.data.message || 'Incomplete transfer completed successfully', 
//         visible: true 
//       });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ 
//         type: 'danger', 
//         message: response.data.message || 'Failed to complete incomplete transfer', 
//         visible: true 
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     if (err.response?.data) {
//       const { data } = err.response;
      
//       if (data.validationErrors && Array.isArray(data.validationErrors)) {
//         const validationMessages = data.validationErrors
//           .map(error => error.error || `Product ${error.productName || error.productId} validation failed`)
//           .join('. ');
        
//         setAlert({ 
//           type: 'danger', 
//           message: validationMessages, 
//           visible: true 
//         });
//       } else if (data.message) {
//         setAlert({ 
//           type: 'danger', 
//           message: data.message, 
//           visible: true 
//         });
//       } else {
//         setAlert({ 
//           type: 'danger', 
//           message: err.message || 'Error completing incomplete transfer', 
//           visible: true 
//         });
//       }
//     } else {
//       setAlert({ 
//         type: 'danger', 
//         message: err.message || 'Error completing incomplete transfer', 
//         visible: true 
//       });
//     }
//   }
// };
//   const handleApprovedBlur = (productId, value) => {
//     if (value === '' || !/^\d+$/.test(value)) {
//       setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
//     }
//   };


//   const handlePrintIndent = () => {
//     const printWindow = window.open('', '_blank');
//     const logoPath = companyLogo; 
//     const currentDate = new Date().toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
  
//     let subtotal = 0;
//     const gstRate = 18;
    
//     const productsWithTotals = data.products.map(item => {
//       const approvedQty = item.quantity || 0;
//       const salePrice = item.product?.salePrice || 0;
//       const total = approvedQty * salePrice;
//       const gstAmount = (total * gstRate) / 100;
//       const amountWithGst = total + gstAmount;
      
//       subtotal += total;
      
//       return {
//         ...item,
//         approvedQty,
//         salePrice,
//         total,
//         gstAmount,
//         amountWithGst
//       };
//     });
  
//     const totalGst = (subtotal * gstRate) / 100;
//     const grandTotal = subtotal + totalGst;
//     const indentDate = data.date ? new Date(data.date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     }) : '';

//     const formatDate = (dateString) => {
//       if (!dateString) return '';
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     };
  
//     const formatDateTime = (dateString) => {
//       if (!dateString) return '';
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     };
  
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Indent Invoice - ${data.transferNumber || ''}</title>
//         <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
//         <style>
//           *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//           :root {
//             --ink:        #0f1117;
//             --ink-mid:    #3a3f4b;
//             --ink-light:  #6b7280;
//             --rule:       #d1d5db;
//             --rule-light: #e5e8ec;
//             --accent:     #1a56db;
//             --accent-bg:  #eff4ff;
//             --surface:    #f8f9fb;
//             --white:      #ffffff;
//             --status-bg:  #e8f5e9;
//             --status-txt: #2e7d32;
//           }

//           body {
//             font-family: 'DM Sans', sans-serif;
//             background: #edf0f4;
//             color: var(--ink);
//             font-size: 13px;
//             line-height: 1.5;
//             padding: 32px 0 48px;
//           }

//           /* ── Page shell ─────────────────────────────────────── */
//           .page {
//             width: 900px;
//             margin: 0 auto;
//             background: var(--white);
//             border: 1px solid var(--rule);
//             border-radius: 6px;
//             overflow: hidden;
//             box-shadow: 0 4px 24px rgba(0,0,0,.08);
//           }

//           /* ── Top accent stripe ──────────────────────────────── */
//           .stripe {
//             height: 5px;
//             background: linear-gradient(90deg, var(--accent) 0%, #3b82f6 60%, #60a5fa 100%);
//           }

//           /* ── Header ─────────────────────────────────────────── */
//           .header {
//             display: flex;
//             align-items: flex-start;
//             justify-content: space-between;
//             padding: 28px 36px 22px;
//             border-bottom: 1px solid var(--rule-light);
//           }
//           .logo-wrap {
//             width: 160px;
//             height: 80px;
//             display: flex;
//             align-items: center;
//           }
//           .logo-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }

//           .company-block { text-align: right; }
//           .company-name {
//             font-size: 16px;
//             font-weight: 700;
//             color: var(--ink);
//             line-height: 1.3;
//             margin-bottom: 6px;
//           }
//           .company-block p {
//             font-size: 12px;
//             color: var(--ink-mid);
//             line-height: 1.6;
//           }

//           /* ── Title band ─────────────────────────────────────── */
//           .title-band {
//             background: var(--ink);
//             padding: 12px 36px;
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//           }
//           .title-band .doc-title {
//             font-size: 15px;
//             font-weight: 700;
//             letter-spacing: .08em;
//             text-transform: uppercase;
//             color: #fff;
//           }
//           .status-pill {
//             display: inline-flex;
//             align-items: center;
//             gap: 6px;
//             background: var(--status-bg);
//             color: var(--status-txt);
//             font-size: 11px;
//             font-weight: 600;
//             letter-spacing: .06em;
//             text-transform: uppercase;
//             padding: 4px 12px;
//             border-radius: 20px;
//           }
//           .status-pill::before {
//             content: '';
//             width: 7px; height: 7px;
//             border-radius: 50%;
//             background: var(--status-txt);
//             flex-shrink: 0;
//           }

//           /* ── Meta row ───────────────────────────────────────── */
//           .meta-row {
//             display: flex;
//             gap: 0;
//             border-bottom: 1px solid var(--rule-light);
//           }
//           .meta-cell {
//             flex: 1;
//             padding: 14px 36px;
//             border-right: 1px solid var(--rule-light);
//           }
//           .meta-cell:last-child { border-right: none; }
//           .meta-label {
//             font-size: 10px;
//             font-weight: 600;
//             letter-spacing: .08em;
//             text-transform: uppercase;
//             color: var(--ink-light);
//             margin-bottom: 3px;
//           }
//           .meta-value {
//             font-family: 'DM Mono', monospace;
//             font-size: 14px;
//             font-weight: 500;
//             color: var(--ink);
//           }

//           /* ── Address section ────────────────────────────────── */
//           .address-row {
//             display: grid;
//             grid-template-columns: 1fr 1px 1fr;
//             border-bottom: 1px solid var(--rule-light);
//           }
//           .address-divider { background: var(--rule-light); }
//           .address-cell { padding: 20px 36px; }
//           .address-cell .section-label {
//             font-size: 10px;
//             font-weight: 700;
//             letter-spacing: .1em;
//             text-transform: uppercase;
//             color: var(--accent);
//             border-bottom: 2px solid var(--accent-bg);
//             padding-bottom: 5px;
//             margin-bottom: 10px;
//           }
//           .address-name {
//             font-size: 13px;
//             font-weight: 700;
//             color: var(--ink);
//             margin-bottom: 4px;
//           }
//           .address-cell p {
//             font-size: 12px;
//             color: var(--ink-mid);
//             line-height: 1.65;
//           }

//           /* ── Transfer arrow badge ───────────────────────────── */
//           .transfer-arrow {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 20px;
//             color: var(--accent);
//             background: var(--accent-bg);
//             border-radius: 50%;
//             width: 36px;
//             height: 36px;
//             margin: auto;
//             position: relative;
//             top: 50%;
//             transform: translateY(-50%);
//           }

//           /* ── Products table ─────────────────────────────────── */
//           .table-wrap { padding: 0 36px 28px; margin-top: 24px; }
//           .table-heading {
//             font-size: 10px;
//             font-weight: 700;
//             letter-spacing: .1em;
//             text-transform: uppercase;
//             color: var(--ink-light);
//             margin-bottom: 10px;
//           }

//           .products-table {
//             width: 100%;
//             border-collapse: collapse;
//             font-size: 12.5px;
//           }
//           .products-table thead tr { background: var(--ink); }
//           .products-table th {
//             padding: 10px 12px;
//             text-align: left;
//             color: #fff;
//             font-weight: 600;
//             font-size: 11px;
//             letter-spacing: .05em;
//             text-transform: uppercase;
//             white-space: nowrap;
//           }
//           .products-table th:not(:first-child) { text-align: right; }
//           .products-table td {
//             padding: 9px 12px;
//             border-bottom: 1px solid var(--rule-light);
//             color: var(--ink-mid);
//             vertical-align: top;
//           }
//           .products-table td:not(:first-child):not(:nth-child(2)) {
//             text-align: right;
//             font-family: 'DM Mono', monospace;
//             font-size: 12px;
//           }
//           .products-table td:nth-child(2) { color: var(--ink); font-weight: 500; }
//           .products-table tbody tr:nth-child(even) td { background: var(--surface); }
//           .products-table tbody tr:last-child td { border-bottom: none; }
//           .products-table .amount-col { font-weight: 700; color: var(--ink); }

//           /* ── Totals ─────────────────────────────────────────── */
//           .totals-row {
//             display: flex;
//             justify-content: flex-end;
//             padding: 0 36px 24px;
//           }
//           .totals-box {
//             width: 280px;
//             border: 1px solid var(--rule);
//             border-radius: 6px;
//             overflow: hidden;
//           }
//           .totals-line {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 8px 16px;
//             border-bottom: 1px solid var(--rule-light);
//             font-size: 12.5px;
//           }
//           .totals-line:last-child { border-bottom: none; }
//           .totals-line .t-label { color: var(--ink-mid); }
//           .totals-line .t-val { font-family: 'DM Mono', monospace; color: var(--ink); font-weight: 500; }
//           .totals-line.grand { background: var(--ink); color: #fff; }
//           .totals-line.grand .t-label { color: #c8d0de; font-weight: 600; font-size: 12px; letter-spacing: .05em; text-transform: uppercase; }
//           .totals-line.grand .t-val { color: #fff; font-size: 15px; font-weight: 700; }

//           /* ── Info grid ──────────────────────────────────────── */
//           .info-section { padding: 0 36px 28px; }
//           .info-grid {
//             width: 100%;
//             border-collapse: collapse;
//             border: 1px solid var(--rule);
//             border-radius: 6px;
//             overflow: hidden;
//             font-size: 12.5px;
//           }
//           .info-grid td {
//             padding: 9px 14px;
//             border: 1px solid var(--rule-light);
//             vertical-align: top;
//           }
//           .info-grid .lbl {
//             font-size: 10px;
//             font-weight: 700;
//             letter-spacing: .07em;
//             text-transform: uppercase;
//             color: var(--ink-light);
//             background: var(--surface);
//             white-space: nowrap;
//             width: 14%;
//           }
//           .info-grid .val { color: var(--ink-mid); width: 36%; }

//           /* ── Signature ──────────────────────────────────────── */
//           .sig-row {
//             border-top: 1px solid var(--rule-light);
//             padding: 24px 36px 28px;
//             display: flex;
//             justify-content: space-between;
//             align-items: flex-end;
//           }
//           .sig-note {
//             font-size: 11px;
//             color: var(--ink-light);
//             max-width: 360px;
//             line-height: 1.7;
//           }
//           .sig-block { text-align: center; width: 180px; }
//           .sig-line {
//             border-top: 1.5px solid var(--ink-mid);
//             padding-top: 8px;
//             margin-top: 44px;
//             font-size: 11.5px;
//             font-weight: 600;
//             color: var(--ink-mid);
//             letter-spacing: .04em;
//             text-transform: uppercase;
//           }

//           /* ── Print buttons ──────────────────────────────────── */
//           .btn-row {
//             text-align: center;
//             padding: 20px 0 8px;
//             display: flex;
//             gap: 12px;
//             justify-content: center;
//           }
//           .btn {
//             padding: 10px 28px;
//             font-family: 'DM Sans', sans-serif;
//             font-size: 13px;
//             font-weight: 600;
//             border: none;
//             border-radius: 5px;
//             cursor: pointer;
//             letter-spacing: .02em;
//             transition: opacity .15s;
//           }
//           .btn:hover { opacity: .85; }
//           .btn-primary { background: var(--accent); color: #fff; }
//           .btn-ghost { background: var(--surface); color: var(--ink-mid); border: 1px solid var(--rule); }

//           /* ── Print media ────────────────────────────────────── */
//           @media print {
//             body { background: #fff; padding: 0; font-size: 11.5px; }
//             .page { width: 100%; box-shadow: none; border: none; border-radius: 0; }
//             .btn-row { display: none; }
//             .products-table thead tr { background: var(--ink) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//             .title-band { background: var(--ink) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//             .info-grid .lbl { background: var(--surface) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//             .totals-line.grand { background: var(--ink) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//             .stripe { background: var(--accent) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="page">
//           <div class="stripe"></div>

//           <!-- ── HEADER ───────────────────────────────────────── -->
//           <div class="header">
//             <div class="logo-wrap">
//               <img src="${logoPath}" alt="Company Logo">
//             </div>
//             <div class="company-block">
//               <div class="company-name">Sancfil Technologies Internet Services Pvt Ltd</div>
//               <p>A1, 1st Floor, Landmark Co-operative Housing Society</p>
//               <p>Sector 14, Vashi, Navi Mumbai – 400 709</p>
//               <p>Tel: +91 8097578100 / 8097578176</p>
//               <p>stock@trunet.co.in</p>
//             </div>
//           </div>

//           <!-- ── TITLE BAND ────────────────────────────────────── -->
//           <div class="title-band">
//             <span class="doc-title">Stock Transfer Indent</span>
//             <span class="status-pill">${data.status || 'Pending'}</span>
//           </div>

//           <!-- ── META ROW ──────────────────────────────────────── -->
//           <div class="meta-row">
//             <div class="meta-cell">
//               <div class="meta-label">Transfer Number</div>
//               <div class="meta-value">${data.transferNumber || '—'}</div>
//             </div>
//             <div class="meta-cell">
//               <div class="meta-label">Indent Date</div>
//               <div class="meta-value">${indentDate || '—'}</div>
//             </div>
//             <div class="meta-cell">
//               <div class="meta-label">Print Date</div>
//               <div class="meta-value">${currentDate}</div>
//             </div>
//           </div>

//           <!-- ── ADDRESSES ─────────────────────────────────────── -->
//           <div class="address-row">
//             <div class="address-cell">
//               <div class="section-label">From — Center</div>
//               <div class="address-name">${data.fromCenter?.centerName || ''}</div>
//               <p>${data.fromCenter?.addressLine1 || ''} ${data.fromCenter?.addressLine2 || ''}</p>
//               <p>${data.fromCenter?.city || ''}${data.fromCenter?.city && data.fromCenter?.state ? ', ' : ''}${data.fromCenter?.state || ''}</p>
//               <p>${data.fromCenter?.email || ''}</p>
//             </div>
//             <div class="address-divider"></div>
//             <div class="address-cell">
//               <div class="section-label">To — Center</div>
//               <div class="address-name">${data.toCenter?.centerName || ''}</div>
//               <p>${data.toCenter?.addressLine1 || ''} ${data.toCenter?.addressLine2 || ''}</p>
//               <p>${data.toCenter?.city || ''}${data.toCenter?.city && data.toCenter?.state ? ', ' : ''}${data.toCenter?.state || ''}</p>
//               <p>${data.toCenter?.email || ''}</p>
//             </div>
//           </div>

//           <!-- ── PRODUCTS TABLE ────────────────────────────────── -->
//           <div class="table-wrap">
//             <div class="table-heading">Products &amp; Pricing</div>
//             <table class="products-table">
//               <thead>
//                 <tr>
//                   <th style="width:36px">#</th>
//                   <th>Product</th>
//                   <th>Qty</th>
//                   <th>Rate (₹)</th>
//                   <th>Total (₹)</th>
//                   <th>GST @${gstRate}%&nbsp;(₹)</th>
//                   <th>Amount (₹)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${productsWithTotals.map((item, index) => `
//                   <tr>
//                     <td style="color:var(--ink-light);font-size:11px">${index + 1}</td>
//                     <td>${item.product?.productTitle || ''}</td>
//                     <td>${item.quantity || 0}</td>
//                     <td>${item.salePrice.toFixed(2)}</td>
//                     <td>${item.total.toFixed(2)}</td>
//                     <td>${item.gstAmount.toFixed(2)}</td>
//                     <td class="amount-col">${item.amountWithGst.toFixed(2)}</td>
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>
//           </div>

//           <!-- ── TOTALS ────────────────────────────────────────── -->
//           <div class="totals-row">
//             <div class="totals-box">
//               <div class="totals-line">
//                 <span class="t-label">Subtotal</span>
//                 <span class="t-val">₹ ${subtotal.toFixed(2)}</span>
//               </div>
//               <div class="totals-line">
//                 <span class="t-label">GST @ ${gstRate}%</span>
//                 <span class="t-val">₹ ${totalGst.toFixed(2)}</span>
//               </div>
//               <div class="totals-line grand">
//                 <span class="t-label">Grand Total</span>
//                 <span class="t-val">₹ ${grandTotal.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           <!-- ── INFO GRID ─────────────────────────────────────── -->
//           <div class="info-section">
//             <div class="table-heading" style="margin-bottom:10px">Shipment &amp; Additional Info</div>
//             <table class="info-grid">
//               <tr>
//                 <td class="lbl">Approved On</td>
//                 <td class="val">${formatDateTime(data.centerApproval?.approvedAt) || ''}</td>
//                 <td class="lbl">Shipment Date</td>
//                 <td class="val">${formatDate(data.shippingInfo?.shippedDate) || ''}</td>
//               </tr>
//               <tr>
//                 <td class="lbl">Expected Delivery</td>
//                 <td class="val">${formatDate(data.shippingInfo?.expectedDeliveryDate) || formatDate(data.shippingInfo?.shippedDate) || ''}</td>
//                 <td class="lbl">Completed On</td>
//                 <td class="val">${formatDateTime(data.completedOn) || ''}</td>
//               </tr>
//               <tr>
//                 <td class="lbl">Shipment Detail</td>
//                 <td class="val">${data.shippingInfo?.shipmentDetail || '—'}</td>
//                 <td class="lbl">Shipment Remark</td>
//                 <td class="val">${data.shippingInfo?.shipmentRemark || '—'}</td>
//               </tr>
//               <tr>
//                 <td class="lbl">Remark</td>
//                 <td class="val" colspan="3">${data.remark || '—'}</td>
//               </tr>
//             </table>
//           </div>

//           <!-- ── SIGNATURE ─────────────────────────────────────── -->
//           <div class="sig-row">
//             <p class="sig-note">
//               This is a computer-generated transfer indent document.<br>
//               Please verify all details before processing. For queries contact stock@trunet.co.in
//             </p>
//             <div class="sig-block">
//               <div class="sig-line">Authorized Signatory</div>
//             </div>
//           </div>

//         </div><!-- /.page -->

//         <!-- ── PRINT BUTTONS (screen only) ──────────────────────── -->
//         <div class="btn-row">
//           <button class="btn btn-primary" onclick="window.print()">🖨 Print Indent</button>
//           <button class="btn btn-ghost" onclick="window.close()">✕ Close</button>
//         </div>

//       </body>
//       </html>
//     `;
    
//     printWindow.document.write(printContent);
//     printWindow.document.close();
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mx-4 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6 lg:mx-8">
//         <div className="flex items-center gap-2">
//           <AlertCircle size={18} />
//           <span>{error}</span>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="mx-4 mt-5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 sm:mx-6 lg:mx-8">
//         Stock Request not found
//       </div>
//     );
//   }

//   const getStatusClasses = (status) => {
//     switch ((status || "").toLowerCase()) {
//       case "draft":
//         return "bg-gray-100 text-gray-700";
//       case "submitted":
//         return "bg-blue-100 text-blue-700";
//       case "admin_approved":
//         return "bg-indigo-100 text-indigo-700";
//       case "confirmed":
//         return "bg-amber-100 text-amber-700";
//       case "shipped":
//         return "bg-purple-100 text-purple-700";
//       case "incompleted":
//         return "bg-orange-100 text-orange-700";
//       case "completed":
//         return "bg-green-100 text-green-700";
//       case "rejected":
//       case "admin_rejected":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const actionButtonClasses = {
//     primary:
//       "inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-2 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-[#2759A2] text-white shadow-sm hover:bg-[#214b89]",
//     success:
//       "inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-2 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-[#2759A2] text-white shadow-sm hover:bg-[#214b89]",
//     warning:
//       "inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-2 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-[#d89418] text-white shadow-sm hover:bg-[#bb7910]",
//     danger:
//       "inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-2 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-[#c9362b] text-white shadow-sm hover:bg-[#ad2e25]",
//     secondary:
//       "inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-2 text-sm font-semibold transition-all duration-150 bg-[#2759A2] text-white shadow-sm hover:bg-[#214b89]",
//   };

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
//       {alert.visible && (
//         <div
//           className={`mb-5 flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm shadow-sm ${
//             alert.type === "success"
//               ? "border-green-200 bg-green-50 text-green-700"
//               : alert.type === "info"
//                 ? "border-blue-200 bg-blue-50 text-blue-700"
//                 : "border-red-200 bg-red-50 text-red-700"
//           }`}
//           role="alert"
//         >
//           <div className="flex items-start gap-2">
//             <AlertCircle size={18} className="mt-0.5 shrink-0" />
//             <span>{alert.message}</span>
//           </div>

//           <button
//             type="button"
//             onClick={() => setAlert({ ...alert, visible: false })}
//             className="rounded p-1 transition hover:bg-black/5"
//             aria-label="Close alert"
//           >
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* Page header */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             onClick={handleBack}
//             className={actionButtonClasses.secondary}
//           >
//             <ArrowLeft size={16} />
//             Back
//           </button>

//           <div>
//             <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//               Indent Detail
//             </h1>
//             <p className="mt-1 text-sm text-[#69727d]">
//               {data.orderNumber || ""}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main details card */}
//       <div className="overflow-hidden rounded-[3px] border border-[#dfe3e8] border-t-[4px] border-t-[#2759A2] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.08)]">
//         <div className="flex flex-col gap-3 border-b border-[#e2e5e9] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-wrap items-center gap-3">
//             <h2 className="text-[20px] font-semibold text-[#252a31]">
//               Indent: {data.orderNumber || ""}
//             </h2>

//             {data.status && (
//               <span
//                 className={`rounded-[5px] border px-3 py-1.5 text-[13px] font-semibold ${getStatusClasses(
//                   data.status
//                 )}`}
//               >
//                 {data.status}
//               </span>
//             )}
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             {data.status === "Shipped" && isToCenterUser && (
//               <button
//                 type="button"
//                 className={actionButtonClasses.success}
//                 onClick={handleCompleteIndent}
//               >
//                 <PackageCheck size={16} />
//                 Complete The Indent
//               </button>
//             )}

//             <button
//               type="button"
//               className={actionButtonClasses.secondary}
//               onClick={handlePrintIndent}
//             >
//               <Printer size={16} />
//               Print Indent
//             </button>
//           </div>
//         </div>

//         <div className="p-5">
//           {/* Status banner */}
//           <div className="mb-5 rounded-sm border border-[#c8e2ef] bg-[#d9edf7] px-4 py-3 text-sm text-[#24465b]">
//             {data.status === "Submitted" ? (
//               <strong>Transfer Pending from SSV TELECOM PVT LTD</strong>
//             ) : (
//               <span>
//                 <strong>Transfer Approved by SSV TELECOM PVT LTD at </strong>
//                 {formatDateTime(data.adminApproval?.approvedAt || "")}
//               </span>
//             )}
//           </div>

//           {/* Transfer information */}
//           <div className="overflow-x-auto">
//             <table className="min-w-[1000px] w-full border-collapse">
//               <tbody>
//                 {[
//                   [
//                     "Center/Center Code",
//                     data.orderNumber || "",
//                     "Shipment Date",
//                     formatDate(data.shippingInfo?.shippedDate || ""),
//                     "Completed on",
//                     formatDateTime(data.completionInfo?.completedOn || ""),
//                   ],
//                   [
//                     "Indent Date",
//                     formatDate(data.date || ""),
//                     "Expected Delivery",
//                     formatDate(data.shippingInfo?.expectedDeliveryDate || ""),
//                     "Completed by",
//                     data.completionInfo?.completedBy?.fullName || "",
//                   ],
//                   [
//                     "Remark",
//                     data.remark || "",
//                     "Shipment Detail",
//                     data.shippingInfo?.shipmentDetails || "",
//                     "Incomplete on",
//                     formatDateTime(data.completionInfo?.incompleteOn || ""),
//                   ],
//                   [
//                     "Created at",
//                     formatDateTime(data.createdAt),
//                     "Shipment Remark",
//                     data.shippingInfo?.shipmentRemark || "",
//                     "Incomplete by",
//                     data.completionInfo?.incompleteBy?.fullName || "",
//                   ],
//                   [
//                     "Created by",
//                     data.createdBy?.fullName || "",
//                     "Document",
//                     data.document || "",
//                     "Incomplete Remark",
//                     data.completionInfo?.incompleteRemark || "",
//                   ],
//                   [
//                     "Approved at",
//                     formatDateTime(data.centerApproval?.approvedAt || ""),
//                     "Shipped at",
//                     formatDateTime(data.shippingInfo?.shippedAt || ""),
//                     "Received at",
//                     formatDateTime(data.receivingInfo?.receivedAt || ""),
//                   ],
//                   [
//                     "Approved by",
//                     data.centerApproval?.approvedBy?.fullName || "",
//                     "Shipped by",
//                     data.shippingInfo?.shippedBy?.fullName || "",
//                     "Received by",
//                     data.receivingInfo?.receivedBy?.fullName || "",
//                   ],
//                 ].map((row, index) => (
//                   <tr key={index} className="border-b border-[#e2e5e9]">
//                     <td className="whitespace-nowrap border-r border-[#e1e5ea] bg-[#f1f3f5] px-4 py-3 text-[15px] font-bold text-[#252a31]">
//                       {row[0]}:
//                     </td>
//                     <td className="border-r border-[#e1e5ea] px-4 py-3 text-[15px] text-[#3f4650]">
//                       {row[1] || "—"}
//                     </td>
//                     <td className="whitespace-nowrap border-r border-[#e1e5ea] bg-[#f1f3f5] px-4 py-3 text-[15px] font-bold text-[#252a31]">
//                       {row[2]}:
//                     </td>
//                     <td className="border-r border-[#e1e5ea] px-4 py-3 text-[15px] text-[#3f4650]">
//                       {row[3] || "—"}
//                     </td>
//                     <td className="whitespace-nowrap border-r border-[#e1e5ea] bg-[#f1f3f5] px-4 py-3 text-[15px] font-bold text-[#252a31]">
//                       {row[4]}:
//                     </td>
//                     <td className="px-4 py-3 text-[15px] text-[#3f4650]">
//                       {row[5] || "—"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Product details */}
//       <div className="mt-5 overflow-hidden rounded-[3px] border border-[#dfe3e8] border-t-[4px] border-t-[#2759A2] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.08)]">
//         <div className="flex flex-col gap-3 border-b border-[#e2e5e9] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
//           <h2 className="text-[20px] font-semibold text-[#252a31]">
//             Product Details
//           </h2>

//           <div className="flex flex-wrap items-center gap-2">
//             {data.status === "Draft" &&
//               userRole !== "admin" &&
//               userRole !== "superadmin" && (
//                 <button
//                   type="button"
//                   className={actionButtonClasses.primary}
//                   onClick={handleSubmitRequest}
//                 >
//                   <Send size={16} />
//                   Submit
//                 </button>
//               )}

//             {data.status === "Incompleted" &&
//               userRole !== "admin" &&
//               isFromCenterUser && (
//                 <button
//                   type="button"
//                   className={actionButtonClasses.warning}
//                   onClick={handleIncomplete}
//                 >
//                   <RefreshCw size={16} />
//                   Change Qty And Complete Request
//                 </button>
//               )}

//             {data.status === "Confirmed" &&
//               userRole !== "admin" &&
//               isFromCenterUser && (
//                 <>
//                   <button
//                     type="button"
//                     className={actionButtonClasses.primary}
//                     onClick={handleChangeApprovedQty}
//                   >
//                     <ClipboardCheck size={16} />
//                     Change Approved Qty
//                   </button>

//                   <button
//                     type="button"
//                     className={actionButtonClasses.success}
//                     onClick={() => {
//                       setCurrentShipmentAction(() => handleShipGoods);
//                       setShipmentModal(true);
//                     }}
//                   >
//                     <Truck size={16} />
//                     Ship the Goods
//                   </button>

//                   <button
//                     type="button"
//                     className={actionButtonClasses.danger}
//                     onClick={handleReject}
//                   >
//                     <Ban size={16} />
//                     Reject Request
//                   </button>
//                 </>
//               )}

//             {data.status === "Shipped" &&
//               userRole !== "admin" &&
//               isFromCenterUser && (
//                 <>
//                   <button
//                     type="button"
//                     className={actionButtonClasses.primary}
//                     onClick={handleOpenUpdateShipment}
//                   >
//                     <Truck size={16} />
//                     Update Shipment
//                   </button>

//                   <button
//                     type="button"
//                     className={actionButtonClasses.danger}
//                     onClick={handleCancelShipment}
//                   >
//                     <Ban size={16} />
//                     Cancel Shipment
//                   </button>

//                   <button
//                     type="button"
//                     className={actionButtonClasses.danger}
//                     onClick={handleReject}
//                   >
//                     <Ban size={16} />
//                     Reject Request
//                   </button>
//                 </>
//               )}

//             {data.status === "Shipped" &&
//               userRole !== "admin" &&
//               isToCenterUser && (
//                 <button
//                   type="button"
//                   className={actionButtonClasses.warning}
//                   onClick={() => setIncompleteModal(true)}
//                 >
//                   <AlertCircle size={16} />
//                   Incomplete
//                 </button>
//               )}

//             {data.status === "Admin_Approved" &&
//               userRole !== "admin" &&
//               hasPermission("Transfer", "approval_transfer_center") &&
//               isFromCenterUser && (
//                 <>
//                   <button
//                     type="button"
//                     className={actionButtonClasses.success}
//                     onClick={handleApprove}
//                   >
//                     <Check size={16} />
//                     Submit &amp; Approve Request
//                   </button>

//                   <button
//                     type="button"
//                     className={actionButtonClasses.danger}
//                     onClick={handleReject}
//                   >
//                     <Ban size={16} />
//                     Submit &amp; Reject Request
//                   </button>
//                 </>
//               )}

//             {data.status === "Submitted" &&
//               (userRole === "admin" || userRole === "superadmin") && (
//                 <>
//                   <button
//                     type="button"
//                     className={actionButtonClasses.success}
//                     onClick={handleApproveAdmin}
//                   >
//                     <Check size={16} />
//                     Approval
//                   </button>

//                   <button
//                     type="button"
//                     className={actionButtonClasses.danger}
//                     onClick={handleRejectAdmin}
//                   >
//                     <Ban size={16} />
//                     Reject
//                   </button>
//                 </>
//               )}
//           </div>
//         </div>

//         <div className="p-5">
//           <div className="overflow-x-auto">
//             <table className="min-w-[1200px] w-full border-collapse text-[14px] text-[#3f4650]">
//               <thead>
//                 <tr className="bg-[#f1f3f5] text-left text-[14px] font-bold text-[#252a31]">
//                   <th className="border-b border-[#e1e5ea] px-4 py-3">Product</th>
//                   <th className="border-b border-[#e1e5ea] px-4 py-3">Center Stock</th>
//                   <th className="border-b border-[#e1e5ea] px-4 py-3">Requested Qty</th>
//                   <th className="border-b border-[#e1e5ea] px-4 py-3">Stock Qty</th>
//                   <th className="border-b border-[#e1e5ea] px-4 py-3">Product Remark</th>
//                   <th className="border-b border-[#e1e5ea] px-4 py-3">Approved Qty</th>
//                   <th className="border-b border-[#e1e5ea] px-4 py-3">Approved Remark</th>
//                   <th className="border-b border-[#e1e5ea] px-4 py-3">Received Qty</th>
//                   <th className="border-b border-[#e1e5ea] px-4 py-3">Received Remark</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {data.products?.length > 0 ? (
//                   data.products.map((item) => {
//                     const approvedItem =
//                       approvedProducts.find(
//                         (p) => p.productId === item.product?._id
//                       ) || {};

//                     const receivedQty =
//                       productReceipts.find(
//                         (p) => p.productId === item.product?._id
//                       )?.receivedQuantity ||
//                       item.receivedQuantity ||
//                       0;

//                     const approvedQty =
//                       approvedItem.approvedQty ||
//                       item.approvedQuantity ||
//                       0;

//                     const shouldShowMismatch =
//                       data.status === "Incompleted" ||
//                       data.status === "Completed";

//                     const isQuantityMismatch =
//                       shouldShowMismatch &&
//                       Number(receivedQty) !== Number(approvedQty);

//                     return (
//                       <tr
//                         key={item._id}
//                         className={`border-b border-gray-100 transition hover:bg-gray-50 ${
//                           isQuantityMismatch ? "bg-red-50" : ""
//                         }`}
//                       >
//                         <td className="px-4 py-3 font-medium text-[#252a31]">
//                           {item.product?.productTitle || ""}
//                         </td>

//                         <td className="px-4 py-3 text-[14px] text-[#3f4650]">
//                           {item.centerStockQuantity || 0}
//                         </td>

//                         <td className="px-4 py-3 text-[14px] text-[#3f4650]">
//                           {item.quantity || 0}
//                         </td>

//                         <td className="px-4 py-3 text-[14px] text-[#3f4650]">
//                           {item.productInStock || 0}
//                         </td>

//                         <td className="max-w-[240px] px-4 py-3 text-[14px] text-[#3f4650]">
//                           {item.productRemark || ""}
//                         </td>

//                         <td className="px-4 py-3">
//                           {isFromCenterUser ? (
//                             <div className="flex items-start gap-2">
//                               <div>
//                                 <input
//                                   type="text"
//                                   value={approvedItem.approvedQty ?? ""}
//                                   onChange={(e) =>
//                                     handleApprovedChange(
//                                       item.product._id,
//                                       "approvedQty",
//                                       e.target.value
//                                     )
//                                   }
//                                   onBlur={(e) =>
//                                     handleApprovedBlur(
//                                       item._id,
//                                       e.target.value
//                                     )
//                                   }
//                                   className={`w-20 rounded-md border px-2 py-1.5 text-sm outline-none focus:ring-2 ${
//                                     errors[item._id]
//                                       ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
//                                       : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
//                                   }`}
//                                 />

//                                 {errors[item._id] && (
//                                   <p className="mt-1 text-xs text-red-600">
//                                     {errors[item._id]}
//                                   </p>
//                                 )}
//                               </div>

//                               {item.product?.trackSerialNumber === "Yes" && (
//                                 <button
//                                   type="button"
//                                   onClick={() => handleOpenSerialModal(item)}
//                                   title="Add Serial Numbers"
//                                   className="rounded p-1.5 text-blue-600 transition hover:bg-blue-50"
//                                 >
//                                   <FileText size={19} />
//                                 </button>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-gray-700">
//                               {approvedItem.approvedQty || ""}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-4 py-3">
//                           {isFromCenterUser ? (
//                             <input
//                               type="text"
//                               value={approvedItem.approvedRemark || ""}
//                               onChange={(e) =>
//                                 handleApprovedChange(
//                                   item.product._id,
//                                   "approvedRemark",
//                                   e.target.value
//                                 )
//                               }
//                               className="w-full min-w-[160px] rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                             />
//                           ) : (
//                             <span className="text-gray-700">
//                               {item.approvedRemark || ""}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-4 py-3">
//                           {userCenterType === "Center" &&
//                           isToCenterUser &&
//                           data.status === "Shipped" ? (
//                             <input
//                               type="text"
//                               value={
//                                 productReceipts.find(
//                                   (p) => p.productId === item.product?._id
//                                 )?.receivedQuantity || ""
//                               }
//                               onChange={(e) =>
//                                 handleReceiptChange(
//                                   item.product?._id,
//                                   "receivedQuantity",
//                                   e.target.value
//                                 )
//                               }
//                               className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                             />
//                           ) : (
//                             <span className="text-gray-700">
//                               {item.receivedQuantity || ""}
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-4 py-3">
//                           {userCenterType === "Center" &&
//                           isToCenterUser &&
//                           data.status === "Shipped" ? (
//                             <input
//                               type="text"
//                               value={
//                                 productReceipts.find(
//                                   (p) => p.productId === item.product?._id
//                                 )?.receivedRemark || ""
//                               }
//                               onChange={(e) =>
//                                 handleReceiptChange(
//                                   item.product?._id,
//                                   "receivedRemark",
//                                   e.target.value
//                                 )
//                               }
//                               className="w-full min-w-[180px] rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                             />
//                           ) : (
//                             <span className="text-gray-700">
//                               {item.receivedRemark || ""}
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={9}
//                       className="px-4 py-10 text-center text-sm text-gray-500"
//                     >
//                       No products found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       <ShipGoodsModal
//         visible={shipmentModal}
//         onClose={() => setShipmentModal(false)}
//         onSubmit={currentShipmentAction}
//         initialData={shipmentData}
//       />

//       <IncompleteRemarkModal
//         visible={incompleteModal}
//         onClose={() => setIncompleteModal(false)}
//         onSubmit={handleMarkIncomplete}
//         initialRemark={data.incompleteRemark}
//       />

//       <StockSerialNumber
//         visible={serialModalVisible}
//         onClose={() => setSerialModalVisible(false)}
//         product={selectedProduct}
//         approvedQty={
//           Number(
//             approvedProducts.find(
//               (p) => p.productId === selectedProduct?.product?._id
//             )?.approvedQty
//           ) || 0
//         }
//         initialSerials={
//           assignedSerials[selectedProduct?.product?._id] || []
//         }
//         onSerialNumbersUpdate={handleSerialNumbersUpdate}
//         warehouseId={data?.fromCenter?._id}
//       />
//     </div>
//   );
// };

// export default StockTransferDetails;




import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Ban,
  Check,
  ClipboardCheck,
  FileText,
  PackageCheck,
  Printer,
  RefreshCw,
  Send,
  Truck,
  X,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import companyLogo from '../../assets/images/logo.png'
import { formatDate, formatDateTime } from '../../utils/FormatDateTime';
import ShipGoodsModal from '../stockRequest/ShipGoodsModal';
import IncompleteRemarkModal from '../stockRequest/IncompleteRemarkModal';
import usePermission from '../../utils/usePermission';
import StockSerialNumber from './StockSerialNumber';

const StockTransferDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [approvedProducts, setApprovedProducts] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });
  const [shipmentModal, setShipmentModal] = useState(false)
  const [errors, setErrors] = useState({});
  const [currentShipmentAction, setCurrentShipmentAction] = useState(null);
  const [incompleteModal, setIncompleteModal] = useState(false);
  const [productReceipts, setProductReceipts] = useState([]);
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState({});

  const { hasPermission} = usePermission(); 
  
  const [shipmentData, setShipmentData] = useState({
    shippedDate: '',
    expectedDeliveryDate: '',
    shipmentDetails: '',
    shipmentRemark: '',
    documents: []
  });

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = (user?.role?.roleTitle || '').toLowerCase();
  const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
  const userCenterType = userCenter.centerType || 'Outlet';

  const userCenterId = userCenter._id;
  const isToCenterUser = data?.toCenter?._id === userCenterId;

  const isFromCenterUser = data?.fromCenter?._id === userCenterId;

  const handleOpenSerialModal = (product) => {
    console.log('Opening serial modal for product:', {
      productId: product.product?._id,
      productTitle: product.product?.productTitle,
      currentApprovedQty: approvedProducts.find(p => p.productId === product.product?._id)?.approvedQty,
      hasAssignedSerials: !!assignedSerials[product.product?._id]
    });
    setSelectedProduct(product);
    setSerialModalVisible(true);
  };
   
  // const handleSerialNumbersUpdate = (productId, serialsArray) => {
  //   setAssignedSerials(prev => ({
  //     ...prev,
  //     [productId]: serialsArray
  //   }));
  // };

  const handleSerialNumbersUpdate = (productId, serialsArray) => {
    console.log('handleSerialNumbersUpdate called:', {
      productId,
      serialsArray,
      serialsCount: serialsArray.length
    });
    
    setAssignedSerials(prev => ({
      ...prev,
      [productId]: serialsArray
    }));
    
    setApprovedProducts(prev => prev.map(p => {
      if (p.productId === productId) {
        return {
          ...p,
          approvedQty: serialsArray.length.toString()
        };
      }
      return p;
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/stocktransfer/${id}`);
        if (response.data.success) {
          setData(response.data.data);
          const initialApproved = response.data.data.products.map(item => ({
            _id: item._id,    
            productId: item.product?._id,   
            approvedQty:item.approvedQuantity !== undefined && item.approvedQuantity !== null? item.approvedQuantity: item.quantity || '',
  
            approvedRemark: item.approvedRemark || ''
          }));
          setApprovedProducts(initialApproved);
          
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) fetchData();
  }, [id]);

  const handleShipGoods = async (shipmentData) => {
    try {
      const response = await axiosInstance.post(`/stocktransfer/${id}/ship`, shipmentData)
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Shipment created successfully', visible: true })
        setShipmentModal(false)
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setAlert({ type: 'danger', message: 'Failed to create shipment', visible: true })
      }
    } catch (err) {
      console.error(err)
      setAlert({ type: 'danger', message: 'Error creating shipment', visible: true })
    }
  }

  const handleBack = () => navigate('/stock-transfer');

  useEffect(() => {
    if (data?.products) {
      const initialReceipts = data.products.map(item => ({
        productId: item.product?._id, 
        receivedQuantity: item.receivedQuantity,
        receivedRemark:item.receivedRemark
      }));
      setProductReceipts(initialReceipts);
    }
  }, [data]);
  
  const handleReceiptChange = (productId, field, value) => {
    setProductReceipts(prev =>
      prev.map(p => (p.productId === productId ? { ...p, [field]: value } : p))
    );
  };

  // const handleApprovedChange = (productId, field, value) => {
  //   if (field === 'approvedQty') {
  //     if (value === '' || /^\d+$/.test(value)) {
  //       setErrors(prev => ({ ...prev, [productId]: undefined }));
  //     } else {
  //       setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
  //     }
  //   }
  
  //   setApprovedProducts(prev =>
  //     prev.map(p =>
  //       p._id === productId ? { ...p, [field]: value } : p
  //     )
  //   );
  // };  

  
  const handleApprovedChange = (productId, field, value) => {
    if (field === 'approvedQty') {
      if (value === '' || /^\d+$/.test(value)) {
        setErrors(prev => ({ ...prev, [productId]: undefined }));
      } else {
        setErrors(prev => ({ ...prev, [productId]: 'Invalid number' }));
      }
    }
  
    setApprovedProducts(prev =>
      prev.map(p =>
        p.productId === productId ? { ...p, [field]: value } : p
      )
    );
  };
  
//approve admin

const handleApprove = async () => {
  let hasError = false;
  const validationErrors = {};
  
  const payload = approvedProducts.map(p => {

    if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
      validationErrors[p._id] = 'The input value was not a correct number';
      hasError = true;
    }
    
    const productItem = data.products.find(item => item.product?._id === p.productId);
    if (productItem && Number(p.approvedQty) > productItem.quantity) {
      validationErrors[p._id] = `Approved quantity cannot exceed requested quantity (${productItem.quantity})`;
      hasError = true;
    }
    
    if (productItem?.product?.trackSerialNumber === "Yes" && Number(p.approvedQty) > 0) {
      const serialsForProduct = assignedSerials[p.productId] || [];
      if (serialsForProduct.length !== Number(p.approvedQty)) {
        validationErrors[p._id] = `Please assign ${p.approvedQty} serial number(s) for this product`;
        hasError = true;
      }
    }
    
    return {
      productId: p.productId,
      approvedQuantity: Number(p.approvedQty),
      approvedRemark: p.approvedRemark || '',
      approvedSerials: (assignedSerials[p.productId] || []).map(s => s.serialNumber)
    };
  });

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    
    const missingSerials = Object.entries(validationErrors)
      .filter(([_, error]) => error.includes('serial number'))
      .map(([_, error]) => error);
    
    if (missingSerials.length > 0) {
      setAlert({ 
        type: 'danger', 
        message: `Missing serial numbers: ${missingSerials.join('. ')}`, 
        visible: true 
      });
    }
    return;
  }
  try {
    
    setAlert({ type: 'info', message: 'Processing approval...', visible: true });
    const response = await axiosInstance.post(`/stocktransfer/${id}/approve`, {
      productApprovals: payload
    });

    if (response.data.success) {
      setAlert({ 
        type: 'success', 
        message: response.data.message || 'Transfer approved successfully', 
        visible: true 
      });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ 
        type: 'danger', 
        message: response.data.message || 'Failed to approve transfer', 
        visible: true 
      });
    }
  } catch (err) {
    console.error('Error approving transfer:', err);
    
    let errorMessage = "Something went wrong while approving the transfer";
    
    if (err.response?.data) {
      const { data } = err.response;
      
      if (data.errors && Array.isArray(data.errors)) {
        const validationMessages = data.errors.map(error => {
          if (typeof error === 'string') return error;
          if (error.message) return error.message;
          if (error.field && error.message) return `${error.field}: ${error.message}`;
          return JSON.stringify(error);
        }).join('. ');
        
        errorMessage = `Validation failed: ${validationMessages}`;
      }

      else if (data.validationResults && Array.isArray(data.validationResults)) {
        const failedValidations = data.validationResults
          .filter(result => !result.valid)
          .map(result => result.error || `Product ${result.productName} validation failed`)
          .join('. ');
        
        errorMessage = failedValidations || data.message || "Validation failed";
      }

      else if (data.validationErrors && Array.isArray(data.validationErrors)) {
        const validationErrors = data.validationErrors
          .map(error => error.error || `Product ${error.productName || error.productId} validation failed`)
          .join('. ');
        
        errorMessage = validationErrors || data.message || "Validation failed";
      }
   
      else if (data.error && typeof data.error === 'string') {
        errorMessage = data.error;
      }

      else if (data.message) {
        errorMessage = data.message;
      }
    }
    
    setAlert({ 
      type: 'danger', 
      message: errorMessage, 
      visible: true 
    });
  }
};


const handleApproveAdmin = async () => {
  let hasError = false;
  const payload = approvedProducts.map(p => {
    if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
      setErrors(prev => ({ ...prev, [p._id]: 'The input value was not a correct number' }));
      hasError = true;
    }
    return {
      productId: p.productId,
      approvedQuantity: Number(p.approvedQty),
      approvedRemark: p.approvedRemark || ''
    };
  });

  if (hasError) return;

  try {
    const response = await axiosInstance.patch(`/stocktransfer/${id}/admin/approve`, {
      productApprovals: payload
    });

    if (response.data.success) {
      setAlert({ type: 'success', message: 'Data approved successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to approve data', visible: true });
    }
  } catch (err) {
    console.error(err);
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||   
      err.message ||              
      "Something went wrong";
  
    setAlert({ type: 'danger', message: errorMessage, visible: true });
  }
};


//reject admin
const handleRejectAdmin = async () => {
  try {
    const response = await axiosInstance.patch(`/stocktransfer/${id}/admin/reject`);
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Data reject successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to reject data', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error rejecting data', visible: true });
  }
};



// Reject
const handleReject = async () => {
  try {
    const response = await axiosInstance.post(`/stocktransfer/${id}/reject`);
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Data rejected successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to reject data', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error rejecting data', visible: true });
  }
};


// Submit
const handleSubmitRequest = async () => {
  try {
    const response = await axiosInstance.post(`/stocktransfer/${id}/submit`, { status: 'Submitted' });
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Data submitted successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to submit', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error to submit data', visible: true });
  }
};


//****************************** approve qty **************************************/

// const handleChangeApprovedQty = async () => {
//   let hasError = false;
//   const payload = approvedProducts.map(p => {
//     if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
//       setErrors(prev => ({
//         ...prev,
//         [p._id]: 'The input value was not a correct number',
//       }));
//       hasError = true;
//     }
//     return {
//       productId: p.productId,
//       approvedQuantity: Number(p.approvedQty),
//       approvedRemark: p.approvedRemark || '',
//       approvedSerials: (assignedSerials[p.productId] || []).map(s => s.serialNumber),
//     };
//   });

//   if (hasError) return;

//   try {
//     const response = await axiosInstance.patch(
//       `/stocktransfer/${id}/approved-quantities`,
//       { productApprovals: payload }
//     );

//     if (response.data.success) {
//       setAlert({
//         type: 'success',
//         message: 'Approved quantities updated successfully',
//         visible: true,
//       });
//       // setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({
//         type: 'danger',
//         message: response.data.message || 'Failed to update approved quantities',
//         visible: true,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     const backendMessage =
//       err.response?.data?.message || 'Error updating approved quantities';

//     setAlert({
//       type: 'danger',
//       message: backendMessage,
//       visible: true,
//     });
//   }
// };


// approve qty
const handleChangeApprovedQty = async () => {
  let hasError = false;
  const validationErrors = {};
  
  const payload = approvedProducts.map(p => {
    if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
      validationErrors[p._id] = 'The input value was not a correct number';
      hasError = true;
    }
    
    const productItem = data.products.find(item => item.product?._id === p.productId);
    if (productItem && Number(p.approvedQty) > productItem.quantity) {
      validationErrors[p._id] = `Approved quantity cannot exceed requested quantity (${productItem.quantity})`;
      hasError = true;
    }
    if (productItem?.product?.trackSerialNumber === "Yes" && Number(p.approvedQty) > 0) {
      const serialsForProduct = assignedSerials[p.productId] || [];
      if (serialsForProduct.length !== Number(p.approvedQty)) {
        validationErrors[p._id] = `Please assign ${p.approvedQty} serial number(s) for this product`;
        hasError = true;
      }
    }
    const serialsArray = assignedSerials[p.productId] || [];
    return {
      productId: p.productId,
      approvedQuantity: Number(p.approvedQty),
      approvedRemark: p.approvedRemark || '',
      approvedSerials: serialsArray.map(s => s.serialNumber),
    };
  });

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    
    const missingSerials = Object.entries(validationErrors)
      .filter(([_, error]) => error.includes('serial number'))
      .map(([_, error]) => error);
    
    if (missingSerials.length > 0) {
      setAlert({ 
        type: 'danger', 
        message: `Missing serial numbers: ${missingSerials.join('. ')}`, 
        visible: true 
      });
    }
    
    return;
  }

  try {
    setAlert({ type: 'info', message: 'Updating approved quantities...', visible: true });
    
    const response = await axiosInstance.patch(
      `/stocktransfer/${id}/approved-quantities`,
      { productApprovals: payload }
    );

    if (response.data.success) {
      setAlert({
        type: 'success',
        message: 'Approved quantities updated successfully',
        visible: true,
      });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({
        type: 'danger',
        message: response.data.message || 'Failed to update approved quantities',
        visible: true,
      });
    }
  } catch (err) {
    console.error(err);
    const backendMessage =
      err.response?.data?.message || 'Error updating approved quantities';

    setAlert({
      type: 'danger',
      message: backendMessage,
      visible: true,
    });
  }
};

//Cancel Shipment
const handleCancelShipment = async () => {
  try {
    const response = await axiosInstance.patch(`/stocktransfer/${id}/reject-shipment`);
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Shipment canceled successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to cancel shipment', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error canceling shipment', visible: true });
  }
};

// complete

// const handleCompleteIndent = async () => {
//   try {
//     let payload = [];

//     if (isToCenterUser) {
//       payload = productReceipts.map(item => ({
//         productId: item.productId,
//         receivedQuantity: Number(item.receivedQuantity) || 0,
//         receivedRemark: item.receivedRemark || '',
//       }));
//     } else {
//       payload = data.products.map(item => ({
//         productId: item.product?._id,
//         receivedQuantity: item.approvedQuantity || item.receivedQuantity || 0,
//         receivedRemark: item.receivedRemark || '',
//       }));
//     }

//     const response = await axiosInstance.post(`/stocktransfer/${id}/complete`, {
//       productReceipts: payload,
//     });
    
//     if (!response.data.success) {
//       setAlert({
//         type: 'danger',
//         message: response.data.message || 'Failed to complete indent',
//         visible: true,
//       });
//       return;
//     }
    
//     setAlert({
//       type: 'success',
//       message: 'Indent completed successfully',
//       visible: true,
//     });

//     setTimeout(() => window.location.reload(), 1000);
//   } catch (err) {
//     console.error('Error in handleCompleteIndent:', err);

//     const errorMessage =
//       err.response?.data?.message ||
//       err.message ||
//       'An unexpected error occurred while completing the indent';

//     setAlert({
//       type: 'danger',
//       message: errorMessage,
//       visible: true,
//     });
//   }
// };


const handleCompleteIndent = async () => {
  try {
    let payload = [];
    
    if (isToCenterUser) {
      payload = data.products.map(item => {
        const receiptItem = productReceipts.find(p => p.productId === item.product?._id);
        const receivedQtyInput = receiptItem?.receivedQuantity;
        const receivedQuantity = receivedQtyInput !== undefined && receivedQtyInput !== '' 
          ? Number(receivedQtyInput) 
          : (item.approvedQuantity || 0);
        if (receivedQtyInput !== undefined && receivedQtyInput !== '' && Number(receivedQtyInput) <= 0) {
          throw new Error(`Received quantity must be greater than 0 for product: ${item.product?.productTitle || item.product?._id}`);
        }
        if (receivedQuantity > (item.approvedQuantity || 0)) {
          throw new Error(`Received quantity (${receivedQuantity}) cannot exceed approved quantity (${item.approvedQuantity || 0}) for product: ${item.product?.productTitle || item.product?._id}`);
        }
        
        return {
          productId: item.product?._id,
          receivedQuantity: receivedQuantity,
          receivedRemark: receiptItem?.receivedRemark || item.receivedRemark || '',
        };
      });
    } else {
      payload = data.products.map(item => ({
        productId: item.product?._id,
        receivedQuantity: item.approvedQuantity || item.receivedQuantity || 0,
        receivedRemark: item.receivedRemark || '',
      }));
    }

    const response = await axiosInstance.post(`/stocktransfer/${id}/complete`, {
      productReceipts: payload,
    });
    
    if (!response.data.success) {
      setAlert({
        type: 'danger',
        message: response.data.message || 'Failed to complete indent',
        visible: true,
      });
      return;
    }
    
    setAlert({
      type: 'success',
      message: 'Indent completed successfully',
      visible: true,
    });

    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    console.error('Error in handleCompleteIndent:', err);

    const errorMessage = err.message || 
      err.response?.data?.message ||
      'An unexpected error occurred while completing the indent';

    setAlert({
      type: 'danger',
      message: errorMessage,
      visible: true,
    });
  }
};

// Update Shipment
const handleOpenUpdateShipment = () => {
  if (data.shippingInfo) {
    setShipmentData({
      shippedDate: data.shippingInfo.shippedDate?.split('T')[0] || '',
      expectedDeliveryDate: data.shippingInfo.expectedDeliveryDate?.split('T')[0] || '',
      shipmentDetails: data.shippingInfo.shipmentDetails || '',
      shipmentRemark: data.shippingInfo.shipmentRemark || '',
      documents: data.shippingInfo.documents || []
    });
  }
  setCurrentShipmentAction(() => handleUpdateShipment);
  setShipmentModal(true);
};

const handleUpdateShipment = async (shipmentData) => {
  try {
    const response = await axiosInstance.patch(`/stocktransfer/${id}/shipping-info`, shipmentData);
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Shipment updated successfully', visible: true });
      setShipmentModal(false);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to update shipment', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error updating shipment', visible: true });
  }
};

const handleMarkIncomplete = async (remark) => {
  try {

    const receivedProducts = productReceipts.map(item => ({
      productId: item.productId,
      receivedQuantity: Number(item.receivedQuantity) || 0,
      receivedRemark: item.receivedRemark || '',
    }));
    const payload = {
      incompleteRemark: remark,
      receivedProducts,
    };
    const response = await axiosInstance.post(
      `/stocktransfer/${id}/mark-incomplete`,
       payload
    );
    if (response.data.success) {
      setAlert({ type: 'success', message: 'marked as incomplete', visible: true });
      setIncompleteModal(false);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to mark incomplete', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error marking incomplete', visible: true });
  }
};

//handle incomplete
// const handleIncomplete = async () => {
//   try {
//     const approvalsPayload = approvedProducts.map(p => ({
//       productId: p.productId,
//       approvedQuantity: Number(p.approvedQty) || 0,
//       approvedRemark: p.approvedRemark || ''
//     }));
//     const receiptsPayload = productReceipts.map(r => ({
//       productId: r.productId,
//      receivedQuantity: Number(r.receivedQuantity) || 0,
//       receivedRemark: r.receivedRemark || ''
//     }));

//     const response = await axiosInstance.patch(
//       `/stocktransfer/${id}/complete-incomplete`,
//       {
//         productApprovals: approvalsPayload,
//         productReceipts: receiptsPayload,
//       }
//     );

//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Indent completed successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: response.data.message || 'Failed to complete indent', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error completing indent', visible: true });
//   }
// };



//handle incomplete

const handleIncomplete = async () => {
  try {
    const approvalsPayload = approvedProducts.map(p => {
      const productItem = data.products.find(item => item.product?._id === p.productId);
      const serialsForProduct = assignedSerials[p.productId] || [];
      let approvedSerialsArray = [];
      
      if (serialsForProduct.length > 0) {
        approvedSerialsArray = serialsForProduct.map(s => s.serialNumber);
      } else if (productItem?.approvedSerials?.length > 0) {
        approvedSerialsArray = productItem.approvedSerials.slice(0, Number(p.approvedQty) || 0);
      }
      if (productItem?.product?.trackSerialNumber === "Yes" && 
          Number(p.approvedQty) > 0 && 
          approvedSerialsArray.length === 0) {
        throw new Error(`Please assign serial numbers for product: ${productItem.product.productTitle}`);
      }
      
      return {
        productId: p.productId,
        approvedQuantity: Number(p.approvedQty) || 0,
        approvedRemark: p.approvedRemark || '',
        approvedSerials: approvedSerialsArray
      };
    });
    const receiptsPayload = productReceipts.map(r => ({
      productId: r.productId,
      receivedQuantity: Number(r.receivedQuantity) || 0,
      receivedRemark: r.receivedRemark || ''
    }));

    const response = await axiosInstance.patch(
      `/stocktransfer/${id}/complete-incomplete`,
      {
        productApprovals: approvalsPayload,
        productReceipts: receiptsPayload,
      }
    );

    if (response.data.success) {
      setAlert({ 
        type: 'success', 
        message: response.data.message || 'Incomplete transfer completed successfully', 
        visible: true 
      });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ 
        type: 'danger', 
        message: response.data.message || 'Failed to complete incomplete transfer', 
        visible: true 
      });
    }
  } catch (err) {
    console.error(err);
    if (err.response?.data) {
      const { data } = err.response;
      
      if (data.validationErrors && Array.isArray(data.validationErrors)) {
        const validationMessages = data.validationErrors
          .map(error => error.error || `Product ${error.productName || error.productId} validation failed`)
          .join('. ');
        
        setAlert({ 
          type: 'danger', 
          message: validationMessages, 
          visible: true 
        });
      } else if (data.message) {
        setAlert({ 
          type: 'danger', 
          message: data.message, 
          visible: true 
        });
      } else {
        setAlert({ 
          type: 'danger', 
          message: err.message || 'Error completing incomplete transfer', 
          visible: true 
        });
      }
    } else {
      setAlert({ 
        type: 'danger', 
        message: err.message || 'Error completing incomplete transfer', 
        visible: true 
      });
    }
  }
};
  const handleApprovedBlur = (productId, value) => {
    if (value === '' || !/^\d+$/.test(value)) {
      setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
    }
  };


  const handlePrintIndent = () => {
    const printWindow = window.open('', '_blank');
    const logoPath = companyLogo; 
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  
    let subtotal = 0;
    const gstRate = 18;
    
    const productsWithTotals = data.products.map(item => {
      const approvedQty = item.quantity || 0;
      const salePrice = item.product?.salePrice || 0;
      const total = approvedQty * salePrice;
      const gstAmount = (total * gstRate) / 100;
      const amountWithGst = total + gstAmount;
      
      subtotal += total;
      
      return {
        ...item,
        approvedQty,
        salePrice,
        total,
        gstAmount,
        amountWithGst
      };
    });
  
    const totalGst = (subtotal * gstRate) / 100;
    const grandTotal = subtotal + totalGst;
    const indentDate = data.date ? new Date(data.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';

    const formatDate = (dateString) => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    const formatDateTime = (dateString) => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Indent Invoice - ${data.transferNumber || ''}</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
        <style>
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          :root {
            --ink:        #0f1117;
            --ink-mid:    #3a3f4b;
            --ink-light:  #6b7280;
            --rule:       #d1d5db;
            --rule-light: #e5e8ec;
            --accent:     #1a56db;
            --accent-bg:  #eff4ff;
            --surface:    #f8f9fb;
            --white:      #ffffff;
            --status-bg:  #e8f5e9;
            --status-txt: #2e7d32;
          }

          body {
            font-family: 'DM Sans', sans-serif;
            background: #edf0f4;
            color: var(--ink);
            font-size: 13px;
            line-height: 1.5;
            padding: 32px 0 48px;
          }

          /* ── Page shell ─────────────────────────────────────── */
          .page {
            width: 900px;
            margin: 0 auto;
            background: var(--white);
            border: 1px solid var(--rule);
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,.08);
          }

          /* ── Top accent stripe ──────────────────────────────── */
          .stripe {
            height: 5px;
            background: linear-gradient(90deg, var(--accent) 0%, #3b82f6 60%, #60a5fa 100%);
          }

          /* ── Header ─────────────────────────────────────────── */
          .header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            padding: 28px 36px 22px;
            border-bottom: 1px solid var(--rule-light);
          }
          .logo-wrap {
            width: 160px;
            height: 80px;
            display: flex;
            align-items: center;
          }
          .logo-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }

          .company-block { text-align: right; }
          .company-name {
            font-size: 16px;
            font-weight: 700;
            color: var(--ink);
            line-height: 1.3;
            margin-bottom: 6px;
          }
          .company-block p {
            font-size: 12px;
            color: var(--ink-mid);
            line-height: 1.6;
          }

          /* ── Title band ─────────────────────────────────────── */
          .title-band {
            background: var(--ink);
            padding: 12px 36px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .title-band .doc-title {
            font-size: 15px;
            font-weight: 700;
            letter-spacing: .08em;
            text-transform: uppercase;
            color: #fff;
          }
          .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: var(--status-bg);
            color: var(--status-txt);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: .06em;
            text-transform: uppercase;
            padding: 4px 12px;
            border-radius: 20px;
          }
          .status-pill::before {
            content: '';
            width: 7px; height: 7px;
            border-radius: 50%;
            background: var(--status-txt);
            flex-shrink: 0;
          }

          /* ── Meta row ───────────────────────────────────────── */
          .meta-row {
            display: flex;
            gap: 0;
            border-bottom: 1px solid var(--rule-light);
          }
          .meta-cell {
            flex: 1;
            padding: 14px 36px;
            border-right: 1px solid var(--rule-light);
          }
          .meta-cell:last-child { border-right: none; }
          .meta-label {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: .08em;
            text-transform: uppercase;
            color: var(--ink-light);
            margin-bottom: 3px;
          }
          .meta-value {
            font-family: 'DM Mono', monospace;
            font-size: 14px;
            font-weight: 500;
            color: var(--ink);
          }

          /* ── Address section ────────────────────────────────── */
          .address-row {
            display: grid;
            grid-template-columns: 1fr 1px 1fr;
            border-bottom: 1px solid var(--rule-light);
          }
          .address-divider { background: var(--rule-light); }
          .address-cell { padding: 20px 36px; }
          .address-cell .section-label {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: .1em;
            text-transform: uppercase;
            color: var(--accent);
            border-bottom: 2px solid var(--accent-bg);
            padding-bottom: 5px;
            margin-bottom: 10px;
          }
          .address-name {
            font-size: 13px;
            font-weight: 700;
            color: var(--ink);
            margin-bottom: 4px;
          }
          .address-cell p {
            font-size: 12px;
            color: var(--ink-mid);
            line-height: 1.65;
          }

          /* ── Transfer arrow badge ───────────────────────────── */
          .transfer-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: var(--accent);
            background: var(--accent-bg);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            margin: auto;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
          }

          /* ── Products table ─────────────────────────────────── */
          .table-wrap { padding: 0 36px 28px; margin-top: 24px; }
          .table-heading {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: .1em;
            text-transform: uppercase;
            color: var(--ink-light);
            margin-bottom: 10px;
          }

          .products-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12.5px;
          }
          .products-table thead tr { background: var(--ink); }
          .products-table th {
            padding: 10px 12px;
            text-align: left;
            color: #fff;
            font-weight: 600;
            font-size: 11px;
            letter-spacing: .05em;
            text-transform: uppercase;
            white-space: nowrap;
          }
          .products-table th:not(:first-child) { text-align: right; }
          .products-table td {
            padding: 9px 12px;
            border-bottom: 1px solid var(--rule-light);
            color: var(--ink-mid);
            vertical-align: top;
          }
          .products-table td:not(:first-child):not(:nth-child(2)) {
            text-align: right;
            font-family: 'DM Mono', monospace;
            font-size: 12px;
          }
          .products-table td:nth-child(2) { color: var(--ink); font-weight: 500; }
          .products-table tbody tr:nth-child(even) td { background: var(--surface); }
          .products-table tbody tr:last-child td { border-bottom: none; }
          .products-table .amount-col { font-weight: 700; color: var(--ink); }

          /* ── Totals ─────────────────────────────────────────── */
          .totals-row {
            display: flex;
            justify-content: flex-end;
            padding: 0 36px 24px;
          }
          .totals-box {
            width: 280px;
            border: 1px solid var(--rule);
            border-radius: 6px;
            overflow: hidden;
          }
          .totals-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 16px;
            border-bottom: 1px solid var(--rule-light);
            font-size: 12.5px;
          }
          .totals-line:last-child { border-bottom: none; }
          .totals-line .t-label { color: var(--ink-mid); }
          .totals-line .t-val { font-family: 'DM Mono', monospace; color: var(--ink); font-weight: 500; }
          .totals-line.grand { background: var(--ink); color: #fff; }
          .totals-line.grand .t-label { color: #c8d0de; font-weight: 600; font-size: 12px; letter-spacing: .05em; text-transform: uppercase; }
          .totals-line.grand .t-val { color: #fff; font-size: 15px; font-weight: 700; }

          /* ── Info grid ──────────────────────────────────────── */
          .info-section { padding: 0 36px 28px; }
          .info-grid {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid var(--rule);
            border-radius: 6px;
            overflow: hidden;
            font-size: 12.5px;
          }
          .info-grid td {
            padding: 9px 14px;
            border: 1px solid var(--rule-light);
            vertical-align: top;
          }
          .info-grid .lbl {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: .07em;
            text-transform: uppercase;
            color: var(--ink-light);
            background: var(--surface);
            white-space: nowrap;
            width: 14%;
          }
          .info-grid .val { color: var(--ink-mid); width: 36%; }

          /* ── Signature ──────────────────────────────────────── */
          .sig-row {
            border-top: 1px solid var(--rule-light);
            padding: 24px 36px 28px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .sig-note {
            font-size: 11px;
            color: var(--ink-light);
            max-width: 360px;
            line-height: 1.7;
          }
          .sig-block { text-align: center; width: 180px; }
          .sig-line {
            border-top: 1.5px solid var(--ink-mid);
            padding-top: 8px;
            margin-top: 44px;
            font-size: 11.5px;
            font-weight: 600;
            color: var(--ink-mid);
            letter-spacing: .04em;
            text-transform: uppercase;
          }

          /* ── Print buttons ──────────────────────────────────── */
          .btn-row {
            text-align: center;
            padding: 20px 0 8px;
            display: flex;
            gap: 12px;
            justify-content: center;
          }
          .btn {
            padding: 10px 28px;
            font-family: 'DM Sans', sans-serif;
            font-size: 13px;
            font-weight: 600;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            letter-spacing: .02em;
            transition: opacity .15s;
          }
          .btn:hover { opacity: .85; }
          .btn-primary { background: var(--accent); color: #fff; }
          .btn-ghost { background: var(--surface); color: var(--ink-mid); border: 1px solid var(--rule); }

          /* ── Print media ────────────────────────────────────── */
          @media print {
            body { background: #fff; padding: 0; font-size: 11.5px; }
            .page { width: 100%; box-shadow: none; border: none; border-radius: 0; }
            .btn-row { display: none; }
            .products-table thead tr { background: var(--ink) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .title-band { background: var(--ink) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .info-grid .lbl { background: var(--surface) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .totals-line.grand { background: var(--ink) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .stripe { background: var(--accent) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="stripe"></div>

          <!-- ── HEADER ───────────────────────────────────────── -->
          <div class="header">
            <div class="logo-wrap">
              <img src="${logoPath}" alt="Company Logo">
            </div>
            <div class="company-block">
              <div class="company-name">Sancfil Technologies Internet Services Pvt Ltd</div>
              <p>A1, 1st Floor, Landmark Co-operative Housing Society</p>
              <p>Sector 14, Vashi, Navi Mumbai – 400 709</p>
              <p>Tel: +91 8097578100 / 8097578176</p>
              <p>stock@trunet.co.in</p>
            </div>
          </div>

          <!-- ── TITLE BAND ────────────────────────────────────── -->
          <div class="title-band">
            <span class="doc-title">Stock Transfer Indent</span>
            <span class="status-pill">${data.status || 'Pending'}</span>
          </div>

          <!-- ── META ROW ──────────────────────────────────────── -->
          <div class="meta-row">
            <div class="meta-cell">
              <div class="meta-label">Transfer Number</div>
              <div class="meta-value">${data.transferNumber || '—'}</div>
            </div>
            <div class="meta-cell">
              <div class="meta-label">Indent Date</div>
              <div class="meta-value">${indentDate || '—'}</div>
            </div>
            <div class="meta-cell">
              <div class="meta-label">Print Date</div>
              <div class="meta-value">${currentDate}</div>
            </div>
          </div>

          <!-- ── ADDRESSES ─────────────────────────────────────── -->
          <div class="address-row">
            <div class="address-cell">
              <div class="section-label">From — Center</div>
              <div class="address-name">${data.fromCenter?.centerName || ''}</div>
              <p>${data.fromCenter?.addressLine1 || ''} ${data.fromCenter?.addressLine2 || ''}</p>
              <p>${data.fromCenter?.city || ''}${data.fromCenter?.city && data.fromCenter?.state ? ', ' : ''}${data.fromCenter?.state || ''}</p>
              <p>${data.fromCenter?.email || ''}</p>
            </div>
            <div class="address-divider"></div>
            <div class="address-cell">
              <div class="section-label">To — Center</div>
              <div class="address-name">${data.toCenter?.centerName || ''}</div>
              <p>${data.toCenter?.addressLine1 || ''} ${data.toCenter?.addressLine2 || ''}</p>
              <p>${data.toCenter?.city || ''}${data.toCenter?.city && data.toCenter?.state ? ', ' : ''}${data.toCenter?.state || ''}</p>
              <p>${data.toCenter?.email || ''}</p>
            </div>
          </div>

          <!-- ── PRODUCTS TABLE ────────────────────────────────── -->
          <div class="table-wrap">
            <div class="table-heading">Products &amp; Pricing</div>
            <table class="products-table">
              <thead>
                <tr>
                  <th style="width:36px">#</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Rate (₹)</th>
                  <th>Total (₹)</th>
                  <th>GST @${gstRate}%&nbsp;(₹)</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${productsWithTotals.map((item, index) => `
                  <tr>
                    <td style="color:var(--ink-light);font-size:11px">${index + 1}</td>
                    <td>${item.product?.productTitle || ''}</td>
                    <td>${item.quantity || 0}</td>
                    <td>${item.salePrice.toFixed(2)}</td>
                    <td>${item.total.toFixed(2)}</td>
                    <td>${item.gstAmount.toFixed(2)}</td>
                    <td class="amount-col">${item.amountWithGst.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- ── TOTALS ────────────────────────────────────────── -->
          <div class="totals-row">
            <div class="totals-box">
              <div class="totals-line">
                <span class="t-label">Subtotal</span>
                <span class="t-val">₹ ${subtotal.toFixed(2)}</span>
              </div>
              <div class="totals-line">
                <span class="t-label">GST @ ${gstRate}%</span>
                <span class="t-val">₹ ${totalGst.toFixed(2)}</span>
              </div>
              <div class="totals-line grand">
                <span class="t-label">Grand Total</span>
                <span class="t-val">₹ ${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- ── INFO GRID ─────────────────────────────────────── -->
          <div class="info-section">
            <div class="table-heading" style="margin-bottom:10px">Shipment &amp; Additional Info</div>
            <table class="info-grid">
              <tr>
                <td class="lbl">Approved On</td>
                <td class="val">${formatDateTime(data.centerApproval?.approvedAt) || ''}</td>
                <td class="lbl">Shipment Date</td>
                <td class="val">${formatDate(data.shippingInfo?.shippedDate) || ''}</td>
              </tr>
              <tr>
                <td class="lbl">Expected Delivery</td>
                <td class="val">${formatDate(data.shippingInfo?.expectedDeliveryDate) || formatDate(data.shippingInfo?.shippedDate) || ''}</td>
                <td class="lbl">Completed On</td>
                <td class="val">${formatDateTime(data.completedOn) || ''}</td>
              </tr>
              <tr>
                <td class="lbl">Shipment Detail</td>
                <td class="val">${data.shippingInfo?.shipmentDetail || '—'}</td>
                <td class="lbl">Shipment Remark</td>
                <td class="val">${data.shippingInfo?.shipmentRemark || '—'}</td>
              </tr>
              <tr>
                <td class="lbl">Remark</td>
                <td class="val" colspan="3">${data.remark || '—'}</td>
              </tr>
            </table>
          </div>

          <!-- ── SIGNATURE ─────────────────────────────────────── -->
          <div class="sig-row">
            <p class="sig-note">
              This is a computer-generated transfer indent document.<br>
              Please verify all details before processing. For queries contact stock@trunet.co.in
            </p>
            <div class="sig-block">
              <div class="sig-line">Authorized Signatory</div>
            </div>
          </div>

        </div><!-- /.page -->

        <!-- ── PRINT BUTTONS (screen only) ──────────────────────── -->
        <div class="btn-row">
          <button class="btn btn-primary" onclick="window.print()">🖨 Print Indent</button>
          <button class="btn btn-ghost" onclick="window.close()">✕ Close</button>
        </div>

      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6 lg:mx-8">
        <div className="flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-4 mt-5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 sm:mx-6 lg:mx-8">
        Stock Request not found
      </div>
    );
  }

  const getStatusClasses = (status) => {
    switch ((status || "").toLowerCase()) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "admin_approved":
        return "bg-indigo-100 text-indigo-700";
      case "confirmed":
        return "bg-amber-100 text-amber-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "incompleted":
        return "bg-orange-100 text-orange-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "rejected":
      case "admin_rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const actionButtonClasses = {
    primary:
      "inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-2 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-[#2759A2] text-white shadow-sm hover:bg-[#214b89]",
    success:
      "inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-2 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-[#2759A2] text-white shadow-sm hover:bg-[#214b89]",
    warning:
      "inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-2 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-[#d89418] text-white shadow-sm hover:bg-[#bb7910]",
    danger:
      "inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-2 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 bg-[#c9362b] text-white shadow-sm hover:bg-[#ad2e25]",
    secondary:
      "inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-2 text-sm font-semibold transition-all duration-150 bg-[#2759A2] text-white shadow-sm hover:bg-[#214b89]",
  };

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {alert.visible && (
        <div
          className={`mb-5 flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm shadow-sm ${
            alert.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : alert.type === "info"
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="alert"
        >
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{alert.message}</span>
          </div>

          <button
            type="button"
            onClick={() => setAlert({ ...alert, visible: false })}
            className="rounded p-1 transition hover:bg-black/5"
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className={actionButtonClasses.secondary}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div>
            <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
              Indent Detail
            </h1>
          </div>
        </div>
      </div>

      {/* Main details card */}
      <div className="overflow-hidden rounded-[3px] border border-[#dfe3e8] border-t-[4px] border-t-[#2759A2] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-3 border-b border-[#e2e5e9] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[20px] font-semibold text-[#252a31]">
              Indent:
            </h2>

            {data.status && (
              <span
                className={`rounded-[5px] border px-3 py-1.5 text-[13px] font-semibold ${getStatusClasses(
                  data.status
                )}`}
              >
                {data.status}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {data.status === "Shipped" && isToCenterUser && (
              <button
                type="button"
                className={actionButtonClasses.success}
                onClick={handleCompleteIndent}
              >
                <PackageCheck size={16} />
                Complete The Indent
              </button>
            )}

            <button
              type="button"
              className={actionButtonClasses.secondary}
              onClick={handlePrintIndent}
            >
              <Printer size={16} />
              Print Indent
            </button>
          </div>
        </div>

        <div className="p-5">
          {/* Status banner */}
          <div className="mb-5 rounded-sm border border-[#c8e2ef] bg-[#d9edf7] px-4 py-3 text-sm text-[#24465b]">
            {data.status === "Submitted" ? (
              <strong>Transfer Pending from SSV TELECOM PVT LTD</strong>
            ) : (
              <span>
                <strong>Transfer Approved by SSV TELECOM PVT LTD at </strong>
                {formatDateTime(data.adminApproval?.approvedAt || "")}
              </span>
            )}
          </div>

          {/* Transfer information */}
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full border-collapse">
              <tbody>
                {[
                  [
                    "Center/Center Code",
                    `${data.fromCenter?.centerName || ""}${data.fromCenter?.centerCode ? ` (${data.fromCenter.centerCode})` : ""} → ${data.toCenter?.centerName || ""}${data.toCenter?.centerCode ? ` (${data.toCenter.centerCode})` : ""}`.trim(),
                    "Shipment Date",
                    formatDate(data.shippingInfo?.shippedDate || data.shippingInfo?.shipmentDate || data.shippedDate || ""),
                    "Completed on",
                    formatDateTime(data.completionInfo?.completedOn || data.completedOn || data.completedAt || ""),
                  ],
                  [
                    "Indent Date",
                    formatDate(data.date || ""),
                    "Expected Delivery",
                    formatDate(data.shippingInfo?.expectedDeliveryDate || ""),
                    "Completed by",
                    data.completionInfo?.completedBy?.fullName || data.completedBy?.fullName || data.completedBy?.name || "",
                  ],
                  [
                    "Remark",
                    data.remark || "",
                    "Shipment Detail",
                    data.shippingInfo?.shipmentDetails || data.shippingInfo?.shipmentDetail || data.shipmentDetails || data.shipmentDetail || "",
                    "Incomplete on",
                    formatDateTime(data.completionInfo?.incompleteOn || data.incompleteOn || ""),
                  ],
                  [
                    "Created at",
                    formatDateTime(data.createdAt),
                    "Shipment Remark",
                    data.shippingInfo?.shipmentRemark || "",
                    "Incomplete by",
                    data.completionInfo?.incompleteBy?.fullName || data.incompleteBy?.fullName || data.incompleteBy?.name || "",
                  ],
                  [
                    "Created by",
                    data.createdBy?.fullName || "",
                    "Document",
                    (Array.isArray(data.shippingInfo?.documents) && data.shippingInfo.documents.length
                      ? data.shippingInfo.documents.map((doc) => typeof doc === "string" ? doc : doc?.originalName || doc?.fileName || doc?.name || doc?.url || "").filter(Boolean).join(", ")
                      : (typeof data.challanDocument === "string" ? data.challanDocument : data.challanDocument?.originalName || data.challanDocument?.fileName || data.challanDocument?.name || data.challanDocument?.url || data.document || "")),
                    "Incomplete Remark",
                    data.completionInfo?.incompleteRemark || data.incompleteRemark || "",
                  ],
                  [
                    "Approved at",
                    formatDateTime(data.centerApproval?.approvedAt || data.adminApproval?.approvedAt || data.approvedAt || ""),
                    "Shipped at",
                    formatDateTime(data.shippingInfo?.shippedAt || data.shippedAt || ""),
                    "Received at",
                    formatDateTime(data.receivingInfo?.receivedAt || data.receivedAt || ""),
                  ],
                  [
                    "Approved by",
                    data.centerApproval?.approvedBy?.fullName || data.adminApproval?.approvedBy?.fullName || data.approvedBy?.fullName || data.approvedBy?.name || "",
                    "Shipped by",
                    data.shippingInfo?.shippedBy?.fullName || data.shippedBy?.fullName || data.shippedBy?.name || "",
                    "Received by",
                    data.receivingInfo?.receivedBy?.fullName || data.receivedBy?.fullName || data.receivedBy?.name || "",
                  ],
                ].map((row, index) => (
                  <tr key={index} className="border-b border-[#e2e5e9]">
                    <td className="whitespace-nowrap border-r border-[#e1e5ea] bg-[#f1f3f5] px-4 py-3 text-[15px] font-bold text-[#252a31]">
                      {row[0]}:
                    </td>
                    <td className="border-r border-[#e1e5ea] px-4 py-3 text-[15px] text-[#3f4650]">
                      {row[1] || "—"}
                    </td>
                    <td className="whitespace-nowrap border-r border-[#e1e5ea] bg-[#f1f3f5] px-4 py-3 text-[15px] font-bold text-[#252a31]">
                      {row[2]}:
                    </td>
                    <td className="border-r border-[#e1e5ea] px-4 py-3 text-[15px] text-[#3f4650]">
                      {row[3] || "—"}
                    </td>
                    <td className="whitespace-nowrap border-r border-[#e1e5ea] bg-[#f1f3f5] px-4 py-3 text-[15px] font-bold text-[#252a31]">
                      {row[4]}:
                    </td>
                    <td className="px-4 py-3 text-[15px] text-[#3f4650]">
                      {row[5] || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="mt-5 overflow-hidden rounded-[3px] border border-[#dfe3e8] border-t-[4px] border-t-[#2759A2] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-3 border-b border-[#e2e5e9] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[20px] font-semibold text-[#252a31]">
            Product Details
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {data.status === "Draft" &&
              userRole !== "admin" &&
              userRole !== "superadmin" && (
                <button
                  type="button"
                  className={actionButtonClasses.primary}
                  onClick={handleSubmitRequest}
                >
                  <Send size={16} />
                  Submit
                </button>
              )}

            {data.status === "Incompleted" &&
              userRole !== "admin" &&
              isFromCenterUser && (
                <button
                  type="button"
                  className={actionButtonClasses.warning}
                  onClick={handleIncomplete}
                >
                  <RefreshCw size={16} />
                  Change Qty And Complete Request
                </button>
              )}

            {data.status === "Confirmed" &&
              userRole !== "admin" &&
              isFromCenterUser && (
                <>
                  <button
                    type="button"
                    className={actionButtonClasses.primary}
                    onClick={handleChangeApprovedQty}
                  >
                    <ClipboardCheck size={16} />
                    Change Approved Qty
                  </button>

                  <button
                    type="button"
                    className={actionButtonClasses.success}
                    onClick={() => {
                      setCurrentShipmentAction(() => handleShipGoods);
                      setShipmentModal(true);
                    }}
                  >
                    <Truck size={16} />
                    Ship the Goods
                  </button>

                  <button
                    type="button"
                    className={actionButtonClasses.danger}
                    onClick={handleReject}
                  >
                    <Ban size={16} />
                    Reject Request
                  </button>
                </>
              )}

            {data.status === "Shipped" &&
              userRole !== "admin" &&
              isFromCenterUser && (
                <>
                  <button
                    type="button"
                    className={actionButtonClasses.primary}
                    onClick={handleOpenUpdateShipment}
                  >
                    <Truck size={16} />
                    Update Shipment
                  </button>

                  <button
                    type="button"
                    className={actionButtonClasses.danger}
                    onClick={handleCancelShipment}
                  >
                    <Ban size={16} />
                    Cancel Shipment
                  </button>

                  <button
                    type="button"
                    className={actionButtonClasses.danger}
                    onClick={handleReject}
                  >
                    <Ban size={16} />
                    Reject Request
                  </button>
                </>
              )}

            {data.status === "Shipped" &&
              userRole !== "admin" &&
              isToCenterUser && (
                <button
                  type="button"
                  className={actionButtonClasses.warning}
                  onClick={() => setIncompleteModal(true)}
                >
                  <AlertCircle size={16} />
                  Incomplete
                </button>
              )}

            {data.status === "Admin_Approved" &&
              userRole !== "admin" &&
              hasPermission("Transfer", "approval_transfer_center") &&
              isFromCenterUser && (
                <>
                  <button
                    type="button"
                    className={actionButtonClasses.success}
                    onClick={handleApprove}
                  >
                    <Check size={16} />
                    Submit &amp; Approve Request
                  </button>

                  <button
                    type="button"
                    className={actionButtonClasses.danger}
                    onClick={handleReject}
                  >
                    <Ban size={16} />
                    Submit &amp; Reject Request
                  </button>
                </>
              )}

            {data.status === "Submitted" &&
              (userRole === "admin" || userRole === "superadmin") && (
                <>
                  <button
                    type="button"
                    className={actionButtonClasses.success}
                    onClick={handleApproveAdmin}
                  >
                    <Check size={16} />
                    Approval
                  </button>

                  <button
                    type="button"
                    className={actionButtonClasses.danger}
                    onClick={handleRejectAdmin}
                  >
                    <Ban size={16} />
                    Reject
                  </button>
                </>
              )}
          </div>
        </div>

        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full border-collapse text-[14px] text-[#3f4650]">
              <thead>
                <tr className="bg-[#f1f3f5] text-left text-[14px] font-bold text-[#252a31]">
                  <th className="border-b border-[#e1e5ea] px-4 py-3">Product</th>
                  <th className="border-b border-[#e1e5ea] px-4 py-3">Center Stock</th>
                  <th className="border-b border-[#e1e5ea] px-4 py-3">Requested Qty</th>
                  <th className="border-b border-[#e1e5ea] px-4 py-3">Stock Qty</th>
                  <th className="border-b border-[#e1e5ea] px-4 py-3">Product Remark</th>
                  <th className="border-b border-[#e1e5ea] px-4 py-3">Approved Qty</th>
                  <th className="border-b border-[#e1e5ea] px-4 py-3">Approved Remark</th>
                  <th className="border-b border-[#e1e5ea] px-4 py-3">Received Qty</th>
                  <th className="border-b border-[#e1e5ea] px-4 py-3">Received Remark</th>
                </tr>
              </thead>

              <tbody>
                {data.products?.length > 0 ? (
                  data.products.map((item) => {
                    const approvedItem =
                      approvedProducts.find(
                        (p) => p.productId === item.product?._id
                      ) || {};

                    const receivedQty =
                      productReceipts.find(
                        (p) => p.productId === item.product?._id
                      )?.receivedQuantity ||
                      item.receivedQuantity ||
                      0;

                    const approvedQty =
                      approvedItem.approvedQty ||
                      item.approvedQuantity ||
                      0;

                    const shouldShowMismatch =
                      data.status === "Incompleted" ||
                      data.status === "Completed";

                    const isQuantityMismatch =
                      shouldShowMismatch &&
                      Number(receivedQty) !== Number(approvedQty);

                    return (
                      <tr
                        key={item._id || item.product?._id}
                        className={`border-b border-gray-100 transition hover:bg-gray-50 ${
                          isQuantityMismatch ? "bg-red-50" : ""
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-[#252a31]">
                          {item.product?.productTitle || ""}
                        </td>

                        <td className="px-4 py-3 text-[14px] text-[#3f4650]">
                          {item.centerStockQuantity ?? 0}
                        </td>

                        <td className="px-4 py-3 text-[14px] text-[#3f4650]">
                          {item.quantity || 0}
                        </td>

                        <td className="px-4 py-3 text-[14px] text-[#3f4650]">
                          {item.productInStock ?? item.stockQuantity ?? 0}
                        </td>

                        <td className="max-w-[240px] px-4 py-3 text-[14px] text-[#3f4650]">
                          {item.productRemark || ""}
                        </td>

                        <td className="px-4 py-3">
                          {isFromCenterUser ? (
                            <div className="flex items-start gap-2">
                              <div>
                                <input
                                  type="text"
                                  value={approvedItem.approvedQty ?? ""}
                                  onChange={(e) =>
                                    handleApprovedChange(
                                      item.product._id,
                                      "approvedQty",
                                      e.target.value
                                    )
                                  }
                                  onBlur={(e) =>
                                    handleApprovedBlur(
                                      item._id,
                                      e.target.value
                                    )
                                  }
                                  className={`w-20 rounded-md border px-2 py-1.5 text-sm outline-none focus:ring-2 ${
                                    errors[item._id]
                                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
                                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                  }`}
                                />

                                {errors[item._id] && (
                                  <p className="mt-1 text-xs text-red-600">
                                    {errors[item._id]}
                                  </p>
                                )}
                              </div>

                              {item.product?.trackSerialNumber === "Yes" && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenSerialModal(item)}
                                  title="Add Serial Numbers"
                                  className="rounded p-1.5 text-blue-600 transition hover:bg-blue-50"
                                >
                                  <FileText size={19} />
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-700">
                              {approvedItem.approvedQty || ""}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isFromCenterUser ? (
                            <input
                              type="text"
                              value={approvedItem.approvedRemark || ""}
                              onChange={(e) =>
                                handleApprovedChange(
                                  item.product._id,
                                  "approvedRemark",
                                  e.target.value
                                )
                              }
                              className="w-full min-w-[160px] rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          ) : (
                            <span className="text-gray-700">
                              {item.approvedRemark || ""}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {userCenterType === "Center" &&
                          isToCenterUser &&
                          data.status === "Shipped" ? (
                            <input
                              type="text"
                              value={
                                productReceipts.find(
                                  (p) => p.productId === item.product?._id
                                )?.receivedQuantity || ""
                              }
                              onChange={(e) =>
                                handleReceiptChange(
                                  item.product?._id,
                                  "receivedQuantity",
                                  e.target.value
                                )
                              }
                              className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          ) : (
                            <span className="text-gray-700">
                              {item.receivedQuantity || ""}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {userCenterType === "Center" &&
                          isToCenterUser &&
                          data.status === "Shipped" ? (
                            <input
                              type="text"
                              value={
                                productReceipts.find(
                                  (p) => p.productId === item.product?._id
                                )?.receivedRemark || ""
                              }
                              onChange={(e) =>
                                handleReceiptChange(
                                  item.product?._id,
                                  "receivedRemark",
                                  e.target.value
                                )
                              }
                              className="w-full min-w-[180px] rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          ) : (
                            <span className="text-gray-700">
                              {item.receivedRemark || ""}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-sm text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ShipGoodsModal
        visible={shipmentModal}
        onClose={() => setShipmentModal(false)}
        onSubmit={currentShipmentAction}
        initialData={shipmentData}
      />

      <IncompleteRemarkModal
        visible={incompleteModal}
        onClose={() => setIncompleteModal(false)}
        onSubmit={handleMarkIncomplete}
        initialRemark={data.incompleteRemark}
      />

      <StockSerialNumber
        visible={serialModalVisible}
        onClose={() => setSerialModalVisible(false)}
        product={selectedProduct}
        approvedQty={
          Number(
            approvedProducts.find(
              (p) => p.productId === selectedProduct?.product?._id
            )?.approvedQty
          ) || 0
        }
        initialSerials={
          assignedSerials[selectedProduct?.product?._id] || []
        }
        onSerialNumbersUpdate={handleSerialNumbersUpdate}
        warehouseId={data?.fromCenter?._id}
      />
    </div>
  );
};

export default StockTransferDetails;