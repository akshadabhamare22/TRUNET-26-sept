
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   AlertCircle,
//   ArrowLeft,
//   Check,
//   Plus,
//   RotateCcw,
//   Search,
//   X,
// } from 'lucide-react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from '../../axiosInstance';
// import BuildingFormModal from './BuildingModel';
// import CustomerModel from './CustomerModel';
// import ControlRoomModel from './ControlRoomModel';
// import UsageSerialNumbers from './UsageSerialNumbers';
// import Select from 'react-select';

// const AddStockUsage = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const getTodayDate = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const day = String(today.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const [formData, setFormData] = useState({
//     date: getTodayDate(),
//     usageType: '',
//     remark: '',
//     customer: '',
//     connectionType: '',
//     packageAmount: '',
//     packageDuration: '',
//     onuCharges: '',
//     installationCharges: '',
//     reason: '',
//     fromBuilding: '',
//     toBuilding: '',
//     controlRoom: '',
//     stolenFrom: '',
//     address: '',
//     shiftingAmount: '',
//     wireChangeAmount: '',
//     toCenter:'',
//     damageReason:''
//   });

//   const [errors, setErrors] = useState({});
//   const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
//   const [isControlRoomModalOpen, setIsControlRoomModalOpen] = useState(false);
//   const [showCustomerModal, setShowCustomerModal] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRows, setSelectedRows] = useState({});
//   const [buildings, setBuildings] = useState([]);
//   const [controlRooms, setControlRooms] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [currentBuildingType, setCurrentBuildingType] = useState(''); 
//   const [loading, setLoading] = useState(true);
//   const [serialModalVisible, setSerialModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [assignedSerials, setAssignedSerials] = useState({});
//   const [alert, setAlert] = useState({ show: false, message: '', type: '' });

//   // Track selection order
//   const [selectionOrder, setSelectionOrder] = useState([]);
//   const selectionCounter = useRef(0);

//   useEffect(() => {
//     if (id) {
//       fetchStockUsage(id);
//     }
//     fetchCustomers();
//     fetchBuildings();
//     fetchControlRooms();
//     fetchProducts();
//     fetchCenters();
//   }, [id]);

//   const showAlert = (message, type) => {
//     setAlert({ show: true, message, type });
//     setTimeout(() => {
//       setAlert({ show: false, message: '', type: '' });
//     }, 5000);
//   };

//   const handleOpenSerialModal = (product) => {
//     const usageQuantity = parseInt(selectedRows[product._id]?.quantity) || 0;
//     if (usageQuantity > 0) {
//       setSelectedProduct(product);
//       setSerialModalVisible(true);
//     }
//   };
   
//   const handleSerialNumbersUpdate = (productId, serialsArray) => {
//     setAssignedSerials(prev => ({
//       ...prev,
//       [productId]: serialsArray
//     }));
//   };
  
//   const fetchStockUsage = async (usageId) => {
//     try {
//       const res = await axiosInstance.get(`/stockusage/${usageId}`);
//       const data = res.data.data;
//       const apiDate = data.date ? data.date.split('T')[0] : '';
      
//       const fromBuilding = data.fromBuilding?._id || data.fromBuilding || '';
//       const toBuilding = data.toBuilding?._id || data.toBuilding || '';
//       const toCenter = data.toCenter?._id || data.toCenter || '';
      
//       setFormData(prev => ({
//         ...prev,
//         ...data,
//         date: apiDate,
//         customer: data.customer?._id || data.customer || '',
//         fromBuilding: fromBuilding,
//         toBuilding: toBuilding,
//         controlRoom: data.controlRoom?._id || data.controlRoom || '',
//         toCenter: toCenter
//       }));
    
//       if (data.items && data.items.length > 0) {
//         const existingSelectedRows = {};
//         const existingAssignedSerials = {};
//         const order = [];
        
//         data.items.forEach((item, index) => {
//           const productId = item.product?.productId || item.product;
//           existingSelectedRows[productId] = {
//             quantity: item.quantity.toString(),
//             productRemark: item.productRemark || '',
//             productInStock: item.oldStock || 0
//           };
          
//           if (item.serialNumbers && item.serialNumbers.length > 0) {
//             existingAssignedSerials[productId] = item.serialNumbers;
//           }
          
//           order.push({ productId, order: index });
//         });
        
//         setSelectedRows(existingSelectedRows);
//         setAssignedSerials(existingAssignedSerials);
//         setSelectionOrder(order);
//         selectionCounter.current = data.items.length;
//       }
      
//     } catch (error) {
//       console.error('Error fetching stock usage:', error);
//       showAlert('Failed to fetch stock usage data', 'danger');
//     }
//   };

//   const fetchCustomers = async () => {
//     try {
//       const res = await axiosInstance.get('/customers/all');
//       setCustomers(res.data.data || []);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//       showAlert('Failed to fetch customers', 'danger');
//     }
//   };

//   const fetchBuildings = async () => {
//     try {
//       const res = await axiosInstance.get('/buildings');
//       setBuildings(res.data.data || []);
//     } catch (error) {
//       console.error('Error fetching buildings:', error);
//       showAlert('Failed to fetch buildings', 'danger');
//     }
//   };

//   const fetchControlRooms = async () => {
//     try {
//       const res = await axiosInstance.get('/controlRooms');
//       setControlRooms(res.data.data || []);
//     } catch (error) {
//       console.error('Error fetching control rooms:', error);
//       showAlert('Failed to fetch control rooms', 'danger');
//     }
//   };
  
//   // const fetchCenters = async () => {
//   //   try {
//   //     const res = await axiosInstance.get('/centers/main-warehouse?centerType=Outlet');
//   //     setCenters(res.data.data || []);
//   //   } catch (error) {
//   //     console.error('Error fetching centers:', error);
//   //     showAlert('Failed to fetch centers', 'danger');
//   //   }
//   // };
  
//   const fetchCenters = async () => {
//     try {
//       const res = await axiosInstance.get('/centers/main-warehouse?centerType=Outlet');
//       if (res.data.success) {
//         const telecomWarehouses = res.data.data.filter(warehouse => 
//           warehouse.centerName?.toLowerCase().includes('telecom') || 
//           warehouse.centerType?.toLowerCase().includes('telecom') ||
//           warehouse.category?.toLowerCase().includes('telecom')
//         );
//         setCenters(telecomWarehouses);
//       }
//     } catch (error) {
//       console.error('Error fetching warehouses:', error);
//       showAlert('Failed to fetch centers', 'danger');
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
//       showAlert('Failed to fetch products', 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRowSelect = (productId, productStock) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };
//       if (updated[productId]) {
//         // Remove from selection order when unselecting
//         setSelectionOrder(prevOrder => prevOrder.filter(item => item.productId !== productId));
//         delete updated[productId];
//       } else {
//         // Add to selection order when selecting
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
  
//   const handleUsageQtyChange = (productId, value) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         quantity: value
//       }
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let newErrors = {};
    
//     if (!formData.date) newErrors.date = 'Date is text-red-600';
//     if (!formData.usageType) newErrors.usageType = 'Usage Type is text-red-600';
//     if (Object.keys(selectedRows).length === 0) {
//       newErrors.products = 'Please select at least one product';
//     }
  
//     Object.keys(selectedRows).forEach(productId => {
//       const product = products.find(p => p._id === productId);
//       const selectedRow = selectedRows[productId];
      
//       if (!selectedRow.quantity || parseInt(selectedRow.quantity) <= 0) {
//         newErrors.products = `Please enter valid usage quantity for ${product?.productTitle}`;
//       }
      
//       if (product?.trackSerialNumber === "Yes") {
//         const usageQty = parseInt(selectedRow.quantity);
//         const assignedSerialsForProduct = assignedSerials[productId] || [];
        
//         if (assignedSerialsForProduct.length !== usageQty) {
//           newErrors.products = `Please assign serial numbers for all ${usageQty} items of ${product?.productTitle}`;
//         }
//       }
//     });
  
//     if (formData.usageType === 'Customer') {
//       if (!formData.customer) newErrors.customer = 'Customer is text-red-600';
//       if (!formData.connectionType) newErrors.connectionType = 'Previous Connection Type is text-red-600';
//       if (!formData.packageAmount) newErrors.packageAmount = 'Package Amount is text-red-600';
//       if (!formData.packageDuration) newErrors.packageDuration = 'Package Duration is text-red-600';
//       if (!formData.onuCharges) newErrors.onuCharges = 'ONU Charges is text-red-600';
//       if (!formData.installationCharges) newErrors.installationCharges = 'Installation Charges is text-red-600';
//       if (!formData.reason) newErrors.reason = 'Reason is text-red-600';
//     }
    
//     if (formData.usageType === 'Building' && !formData.fromBuilding) {
//       newErrors.fromBuilding = 'From Building is text-red-600';
//     }
    
//     if (formData.usageType === 'Building to Building') {
//       if (!formData.fromBuilding) newErrors.fromBuilding = 'From Building is text-red-600';
//       if (!formData.toBuilding) newErrors.toBuilding = 'To Building is text-red-600';
//     }
    
//     if (formData.usageType === 'Control Room' && !formData.controlRoom) {
//       newErrors.controlRoom = 'Control Room is text-red-600';
//     }
    
//     if (formData.usageType === 'Stolen from Field' && !formData.stolenFrom) {
//       newErrors.stolenFrom = 'Stolen From is text-red-600';
//     }
    
//     if (formData.usageType === 'Other' && !formData.address) {
//       newErrors.address = 'Address is text-red-600';
//     }
  
//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;
//     }
  
//     try {
//         const items = Object.keys(selectedRows).map(productId => {
//         const product = products.find(p => p._id === productId);
//         const selectedRow = selectedRows[productId];
//         const serialNumbers = assignedSerials[productId] || [];
        
//         const item = {
//           product: productId,
//           quantity: parseInt(selectedRow.quantity),
//           productRemark: selectedRow.productRemark || '',
//         };
//         if (serialNumbers.length > 0) {
//           item.serialNumbers = serialNumbers;
//         }
        
//         return item;
//       });
  
//       const payload = {
//         date: formData.date,
//         usageType: formData.usageType,
//         remark: formData.remark || '',
//         customer: formData.customer || null,
//         connectionType: formData.connectionType || null,
//         packageAmount: formData.packageAmount ? parseFloat(formData.packageAmount) : 0,
//         packageDuration: formData.packageDuration || null,
//         onuCharges: formData.onuCharges ? parseFloat(formData.onuCharges) : 0,
//         installationCharges: formData.installationCharges ? parseFloat(formData.installationCharges) : 0,
//         reason: formData.reason || null,
//         shiftingAmount: formData.shiftingAmount ? parseFloat(formData.shiftingAmount) : 0,
//         wireChangeAmount: formData.wireChangeAmount ? parseFloat(formData.wireChangeAmount) : 0,
//         fromBuilding: formData.fromBuilding || null,
//         toBuilding: formData.toBuilding || null,
//         fromControlRoom: formData.controlRoom || null,
//         stolenFrom: formData.stolenFrom || null,
//         address: formData.address || null,
//         toCenter: formData.toCenter || null,
//         damageReason: formData.damageReason || null,
//         items: items
//       };
  
//       console.log('Submitting payload:', payload);
  
//       if (id) {
//         await axiosInstance.put(`/stockusage/${id}`, payload);
//         showAlert('Stock usage updated successfully!', 'success');
//         setTimeout(() => {
//           navigate('/stock-usage');
//         }, 1500);
//       } else {
//         await axiosInstance.post('/stockusage', payload);
//         showAlert('Stock usage added successfully!', 'success');
//         setTimeout(() => {
//           navigate('/stock-usage');
//         }, 1500);
//       }
//     } catch (error) {
//       console.error('Error saving stock usage:', error);
      
//       let errorMessage = 'Failed to save stock usage';
      
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;

//         if (errorMessage.includes('CenterStock validation failed') && errorMessage.includes('Must be a valid Center (not Outlet)')) {
//           errorMessage = 'Invalid center type. Please select a valid Center (not an Outlet) for stock usage.';
//         }
//       }
      
//       showAlert(errorMessage, 'danger');
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       date: getTodayDate(),
//       usageType: '',
//       remark: '',
//       customer: '',
//       connectionType: '',
//       packageAmount: '',
//       packageDuration: '',
//       onuCharges: '',
//       installationCharges: '',
//       reason: '',
//       fromBuilding: '',
//       toBuilding: '',
//       fromControlRoom: '',
//       stolenFrom: '',
//       address: '',
//       shiftingAmount: '',
//       wireChangeAmount: '',
//       toCenter: '',
//       damageReason: '' 
//     });
//     setSelectedRows({});
//     setAssignedSerials({});
//     setSelectionOrder([]);
//     selectionCounter.current = 0;
//     setErrors({});
//     showAlert('Form has been reset', 'info');
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const handleAddCustomer = () => {
//     setShowCustomerModal(true);
//   };

//   const handleCustomerAdded = (newCustomer) => {
//     setCustomers((prev) => [...prev, newCustomer]);

//     setFormData((prev) => ({
//       ...prev,
//       customer: newCustomer._id,
//     }));
//     showAlert('Customer added successfully!', 'success');
//   };

//   const handleAddBuilding = () => {
//     setIsBuildingModalOpen(true);
//   };

//   const handleBuildingAdded = (newBuilding) => {
//     setBuildings((prev) => [...prev, newBuilding]);

//     if (currentBuildingType === 'from') {
//       setFormData((prev) => ({
//         ...prev,
//         fromBuilding: newBuilding._id || newBuilding.id,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         toBuilding: newBuilding._id || newBuilding.id
//       }));
//     }
//     showAlert('Building added successfully!', 'success');
//   };

//   const handleAddControlRoom = () => {
//     setIsControlRoomModalOpen(true);
//   };

//   const handleControlRoomAdded = (newControlRoom) => {
//     setControlRooms((prev) => [...prev, newControlRoom]);

//     setFormData((prev) => ({
//       ...prev,
//       controlRoom: newControlRoom._id || newControlRoom.id,
//     }));
//     showAlert('Control room added successfully!', 'success');
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

//   const renderConditionalFields = () => {
//     switch (formData.usageType) {
//       case 'Customer':
//         return (
//           <>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.customer ? 'text-red-600' : formData.customer ? 'text-green-600' : ''}`}>
//                   Customer <span className="text-red-600">*</span>
//                 </label>
//                 <div className="flex min-w-0 gap-2">
//                 <div className="min-w-0 flex-1">
//                   <Select
//                     id="customer"
//                     name="customer"
//                     placeholder="Search..."
//                     value={
//                       formData.customer
//                         ? {
//                             value: formData.customer,
//                             label: customers.find((c) => c._id === formData.customer)
//                               ? `${customers.find((c) => c._id === formData.customer).username} - ${customers.find((c) => c._id === formData.customer).mobile}`
//                               : "",
//                           }
//                         : null
//                     }
//                     onChange={(selected) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         customer: selected ? selected.value : "",
//                       }))
//                     }
//                     options={customers.map((customer) => ({
//                       value: customer._id,
//                       label: `${customer.username} - ${customer.mobile}`,
//                     }))}
//                     isClearable
//                     classNamePrefix="react-select"
//                     className={`w-full ${
//                       errors.customer ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.customer ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                     }`}
//                   />
//                   </div>
//                   <button
//                     type="button"
//                     className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                     onClick={handleAddCustomer}
//                   >
//                     <Plus size={16} /> ADD
//                   </button>
//                 </div>
//                 {errors.customer && <span className="text-xs text-red-600">{errors.customer}</span>}
//               </div>
//               <div className="min-w-0 space-y-1"></div>
//               <div className="min-w-0 space-y-1"></div>
//               <div className="min-w-0 space-y-1"></div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.connectionType ? 'text-red-600' : formData.connectionType ? 'text-green-600' : ''}`}>
//                   Connection Type <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   name="connectionType"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.connectionType ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.connectionType ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.connectionType}
//                   onChange={handleChange}
//                 >
//                   <option value="">SELECT</option>
//                   <option value="NC">NC</option>
//                   <option value="Convert">Convert</option>
//                   <option value="Shifting">Shifting</option>
//                   <option value="Repair">Repair</option>
//                 </select>
//                 {errors.connectionType && <span className="text-xs text-red-600">{errors.connectionType}</span>}
//               </div>

//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.packageAmount ? 'text-red-600' : formData.packageAmount ? 'text-green-600' : ''}`}>
//                   Package Amount <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="packageAmount"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.packageAmount ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.packageAmount ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.packageAmount}
//                   onChange={handleChange}
//                   placeholder="Package Amount"
//                 />
//                 {errors.packageAmount && <span className="text-xs text-red-600">{errors.packageAmount}</span>}
//               </div>

//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.packageDuration ? 'text-red-600' : formData.packageDuration ? 'text-green-600' : ''}`}>
//                   Package Duration <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="packageDuration"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.packageDuration ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.packageDuration ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.packageDuration}
//                   onChange={handleChange}
//                   placeholder="Package Duration"
//                 />
//                 {errors.packageDuration && <span className="text-xs text-red-600">{errors.packageDuration}</span>}
//               </div>

//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.onuCharges ? 'text-red-600' : formData.onuCharges ? 'text-green-600' : ''}`}>
//                   ONU Charges <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="onuCharges"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.onuCharges ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.onuCharges ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.onuCharges}
//                   onChange={handleChange}
//                   placeholder="ONU Charges"
//                 />
//                 {errors.onuCharges && <span className="text-xs text-red-600">{errors.onuCharges}</span>}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.installationCharges ? 'text-red-600' : formData.installationCharges ? 'text-green-600' : ''}`}>
//                   Installation Charges <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="installationCharges"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.installationCharges ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.installationCharges ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.installationCharges}
//                   onChange={handleChange}
//                   placeholder="Installation Charges"
//                 />
//                 {errors.installationCharges && <span className="text-xs text-red-600">{errors.installationCharges}</span>}
//               </div>

//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.reason ? 'text-red-600' : formData.reason ? 'text-green-600' : ''}`}>
//                   Reason <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   name="reason"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.reason ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.reason ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.reason}
//                   onChange={handleChange}
//                 >
//                   <option value="">SELECT</option>
//                   <option value="NC">NC</option>
//                   <option value="Convert">Convert</option>
//                   <option value="Shifting">Shifting</option>
//                   <option value="Repair">Repair</option>
//                 </select>
//                 {errors.reason && <span className="text-xs text-red-600">{errors.reason}</span>}
//               </div>
//               <div className="min-w-0 space-y-1"></div>
//               <div className="min-w-0 space-y-1"></div>
//             </div>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.shiftingAmount ? 'text-red-600' : formData.shiftingAmount ? 'text-green-600' : ''}`}>
//                   Shifting Amount<span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="shiftingAmount"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.shiftingAmount ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.shiftingAmount ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.shiftingAmount}
//                   onChange={handleChange}
//                   placeholder='Shifting Amount'
//                 />
//                 {errors.shiftingAmount && <span className="text-xs text-red-600">{errors.shiftingAmount}</span>}
//               </div>

//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.wireChangeAmount ? 'text-red-600' : formData.wireChangeAmount ? 'text-green-600' : ''}`}>
//                   Wire Change Amount <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="wireChangeAmount"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.wireChangeAmount ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.wireChangeAmount ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.wireChangeAmount}
//                   onChange={handleChange}
//                   placeholder='Wire Change Amount'
//                 />
//                 {errors.wireChangeAmount && <span className="text-xs text-red-600">{errors.wireChangeAmount}</span>}
//               </div>
//               <div className="min-w-0 space-y-1"></div>
//               <div className="min-w-0 space-y-1"></div>
//             </div>
//           </>
//         );

//       case 'Building':
//         return (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//             <div className="min-w-0 space-y-1">
//               <label className={`block text-sm font-medium text-gray-700 ${errors.fromBuilding ? 'text-red-600' : formData.fromBuilding ? 'text-green-600' : ''}`}>
//                 From Building <span className="text-red-600">*</span>
//               </label>
//               <div className="flex min-w-0 gap-2">
//               <div className="min-w-0 flex-1">
//                 <Select
//                   id="fromBuilding"
//                   name="fromBuilding"
//                   placeholder="Search..."
//                   value={
//                     formData.fromBuilding
//                       ? {
//                           value: formData.fromBuilding,
//                           label: buildings.find((b) => b._id === formData.fromBuilding)
//                             ?.buildingName || "",
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       fromBuilding: selected ? selected.value : "",
//                     }))
//                   }
//                   options={buildings.map((building) => ({
//                     value: building._id,
//                     label: building.buildingName,
//                   }))}
//                   isClearable
//                   classNamePrefix="react-select"
//                   className={`w-full ${
//                     errors.fromBuilding ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.fromBuilding ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                   }`}
//                 />
//                 </div>
//                 <button
//                   type="button"
//                   className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}
//                 >
//                   <Plus size={16} /> ADD
//                 </button>
//               </div>
//               {errors.fromBuilding && <span className="text-xs text-red-600">{errors.fromBuilding}</span>}
//             </div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//           </div>
//         );

//       case 'Building to Building':
//         return (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//             <div className="min-w-0 space-y-1">
//               <label className={`block text-sm font-medium text-gray-700 ${errors.fromBuilding ? 'text-red-600' : formData.fromBuilding ? 'text-green-600' : ''}`}>
//                 From Building <span className="text-red-600">*</span>
//               </label>
//               <div className="flex min-w-0 gap-2">
//               <div className="min-w-0 flex-1">
//                 <Select
//                   id="fromBuilding"
//                   name="fromBuilding"
//                   placeholder="Search..."
//                   value={
//                     formData.fromBuilding
//                       ? {
//                           value: formData.fromBuilding,
//                           label: buildings.find((b) => b._id === formData.fromBuilding)
//                             ?.buildingName || "",
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       fromBuilding: selected ? selected.value : "",
//                     }))
//                   }
//                   options={buildings.map((building) => ({
//                     value: building._id,
//                     label: building.buildingName,
//                   }))}
//                   isClearable
//                   classNamePrefix="react-select"
//                   className={`w-full ${
//                     errors.fromBuilding ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.fromBuilding ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                   }`}
//                 />
//                 </div>
//                 <button
//                   type="button"
//                   className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}
//                 >
//                   <Plus size={16} /> ADD
//                 </button>
//               </div>
//               {errors.fromBuilding && <span className="text-xs text-red-600">{errors.fromBuilding}</span>}
//             </div>

//             <div className="min-w-0 space-y-1">
//               <label className={`block text-sm font-medium text-gray-700 ${errors.toBuilding ? 'text-red-600' : formData.toBuilding ? 'text-green-600' : ''}`}>
//                 To Building <span className="text-red-600">*</span>
//               </label>
//               <div className="flex min-w-0 gap-2">
//               <div className="min-w-0 flex-1">
//                 <Select
//                   id="toBuilding"
//                   name="toBuilding"
//                   placeholder="Search..."
//                   value={
//                     formData.toBuilding
//                       ? {
//                           value: formData.toBuilding,
//                           label: buildings.find((b) => b._id === formData.toBuilding)
//                             ?.buildingName || "",
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       toBuilding: selected ? selected.value : "",
//                     }))
//                   }
//                   options={buildings.map((building) => ({
//                     value: building._id,
//                     label: building.buildingName,
//                   }))}
//                   isClearable
//                   classNamePrefix="react-select"
//                   className={`w-full ${
//                     errors.toBuilding ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.toBuilding ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                   }`}
//                 />
//                 </div>
//                 <button
//                   type="button"
//                   className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   onClick={() => { setCurrentBuildingType('to'); handleAddBuilding(); }}
//                 >
//                   <Plus size={16} /> ADD
//                 </button>
//               </div>
//               {errors.toBuilding && <span className="text-xs text-red-600">{errors.toBuilding}</span>}
//             </div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//           </div>
//         );

//       case 'Control Room':
//         return (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//             <div className="min-w-0 space-y-1">
//               <label className={`block text-sm font-medium text-gray-700 ${errors.controlRoom ? 'text-red-600' : formData.controlRoom ? 'text-green-600' : ''}`}>
//                 Control Room <span className="text-red-600">*</span>
//               </label>
//               <div className="flex min-w-0 gap-2">
//               <div className="min-w-0 flex-1">
//                 <Select
//                   id="controlRoom"
//                   name="controlRoom"
//                   placeholder="Search..."
//                   value={
//                     formData.controlRoom
//                       ? {
//                           value: formData.controlRoom,
//                           label: controlRooms.find((cr) => cr._id === formData.controlRoom)
//                             ?.buildingName || "",
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       controlRoom: selected ? selected.value : "",
//                     }))
//                   }
//                   options={controlRooms.map((controlRoom) => ({
//                     value: controlRoom._id,
//                     label: controlRoom.buildingName,
//                   }))}
//                   isClearable
//                   classNamePrefix="react-select"
//                   className={`w-full ${
//                     errors.controlRoom ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.controlRoom ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                   }`}
//                 />
//                 </div>
//                 <button
//                   type="button"
//                   className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   onClick={handleAddControlRoom}
//                 >
//                   <Plus size={16} /> ADD
//                 </button>
//               </div>
//               {errors.controlRoom && <span className="text-xs text-red-600">{errors.controlRoom}</span>}
//             </div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//           </div>
//         );
      

//         case 'Damage':
//           return (
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.toCenter ? 'text-red-600' : formData.toCenter ? 'text-green-600' : ''}`}>
//                   To Center <span className="text-red-600">*</span>
//                 </label>
//                 <div className="flex min-w-0 gap-2">
//                   <div className="min-w-0 flex-1">
//                     <Select
//                       id="toCenter"
//                       name="toCenter"
//                       placeholder="Select center..."
//                       value={
//                         formData.toCenter
//                           ? {
//                               value: formData.toCenter,
//                               label: centers.find((c) => c._id === formData.toCenter)
//                                 ?.centerName || "",
//                             }
//                           : null
//                       }
//                       onChange={(selected) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           toCenter: selected ? selected.value : "",
//                         }))
//                       }
//                       options={centers.map((center) => ({
//                         value: center._id,
//                         label: center.centerName,
//                       }))}
//                       isClearable
//                       classNamePrefix="react-select"
//                       className={`w-full ${
//                         errors.toCenter ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.toCenter ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                       }`}
//                     />
//                   </div>
//                 </div>
//                 {errors.toCenter && <span className="text-xs text-red-600">{errors.toCenter}</span>}
//               </div>
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.damageReason ? 'text-red-600' : formData.damageReason ? 'text-green-600' : ''}`}>
//                  Damage Reason <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   name="damageReason"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.damageReason ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.reason ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.damageReason}
//                   onChange={handleChange}
//                 >
//                   <option value="">SELECT</option>
//                   <option value="Physical Damage">Physical Damage</option>
//                   <option value="Water Damage">Water Damage</option>
//                   <option value="Power Surge">Power Surge</option>
//                   <option value="Manufacturing Defect">Manufacturing Defect</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 {errors.damageReason && <span className="text-xs text-red-600">{errors.damageReason}</span>}
//               </div>
//               <div className="min-w-0 space-y-1"></div>
//               <div className="min-w-0 space-y-1"></div>
//             </div>
//           );
  
//       case 'Stolen from Field':
//         return (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//             <div className="min-w-0 space-y-1">
//               <label className={`block text-sm font-medium text-gray-700 ${errors.stolenFrom ? 'text-red-600' : formData.stolenFrom ? 'text-green-600' : ''}`}>
//                 Stolen From <span className="text-red-600">*</span>
//               </label>
//               <select
//                 type="text"
//                 name="stolenFrom"
//                 className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.stolenFrom ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.stolenFrom ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                 value={formData.stolenFrom}
//                 onChange={handleChange}
//                 placeholder="Stolen From"
//               >
//                 <option value="">SELECT</option>
//                 <option value="Building">Building</option>
//                 <option value="Customer">Customer</option>
//                 <option value="Control Room">Control Room</option>
//               </select>
//               {errors.stolenFrom && <span className="text-xs text-red-600">{errors.stolenFrom}</span>}
//             </div>
            
//             {formData.stolenFrom === 'Building' && (
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.fromBuilding ? 'text-red-600' : formData.fromBuilding ? 'text-green-600' : ''}`}>
//                   From Building <span className="text-red-600">*</span>
//                 </label>
//                 <div className="flex min-w-0 gap-2">
//                 <div className="min-w-0 flex-1">
//                   <Select
//                     id="fromBuilding"
//                     name="fromBuilding"
//                     placeholder="Search..."
//                     value={
//                       formData.fromBuilding
//                         ? {
//                             value: formData.fromBuilding,
//                             label: buildings.find((b) => b._id === formData.fromBuilding)
//                               ?.buildingName || "",
//                           }
//                         : null
//                     }
//                     onChange={(selected) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         fromBuilding: selected ? selected.value : "",
//                       }))
//                     }
//                     options={buildings.map((building) => ({
//                       value: building._id,
//                       label: building.buildingName,
//                     }))}
//                     isClearable
//                     classNamePrefix="react-select"
//                     className={`w-full ${
//                       errors.fromBuilding ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.fromBuilding ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                     }`}
//                   />
//                   </div>
//                   <button
//                     type="button"
//                     className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                     onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}
//                   >
//                     <Plus size={16} /> ADD
//                   </button>
//                 </div>
//                 {errors.fromBuilding && <span className="text-xs text-red-600">{errors.fromBuilding}</span>}
//               </div>
//             )}
            
//             {formData.stolenFrom === 'Customer' && (
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.customer ? 'text-red-600' : formData.customer ? 'text-green-600' : ''}`}>
//                   Customer <span className="text-red-600">*</span>
//                 </label>
//                 <div className="flex min-w-0 gap-2">
//                 <div className="min-w-0 flex-1">
//                   <Select
//                     id="customer"
//                     name="customer"
//                     placeholder="Search..."
//                     value={
//                       formData.customer
//                         ? {
//                             value: formData.customer,
//                             label: customers.find((c) => c._id === formData.customer)
//                               ? `${customers.find((c) => c._id === formData.customer).username} - ${customers.find((c) => c._id === formData.customer).mobile}`
//                               : "",
//                           }
//                         : null
//                     }
//                     onChange={(selected) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         customer: selected ? selected.value : "",
//                       }))
//                     }
//                     options={customers.map((customer) => ({
//                       value: customer._id,
//                       label: `${customer.username} - ${customer.mobile}`,
//                     }))}
//                     isClearable
//                     classNamePrefix="react-select"
//                     className={`w-full ${
//                       errors.customer ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.customer ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                     }`}
//                   />
//                   </div>
//                   <button
//                     type="button"
//                     className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                     onClick={handleAddCustomer}
//                   >
//                     <Plus size={16} /> ADD
//                   </button>
//                 </div>
//                 {errors.customer && <span className="text-xs text-red-600">{errors.customer}</span>}
//               </div>
//             )}

//             {formData.stolenFrom === 'Control Room' && (
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.controlRoom ? 'text-red-600' : formData.controlRoom ? 'text-green-600' : ''}`}>
//                   Control Room <span className="text-red-600">*</span>
//                 </label>
//                 <div className="flex min-w-0 gap-2">
//                 <div className="min-w-0 flex-1">
//                   <Select
//                     id="controlRoom"
//                     name="controlRoom"
//                     placeholder="Search..."
//                     value={
//                       formData.controlRoom
//                         ? {
//                             value: formData.controlRoom,
//                             label: controlRooms.find((cr) => cr._id === formData.controlRoom)
//                               ?.buildingName || "",
//                           }
//                         : null
//                     }
//                     onChange={(selected) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         controlRoom: selected ? selected.value : "",
//                       }))
//                     }
//                     options={controlRooms.map((controlRoom) => ({
//                       value: controlRoom._id,
//                       label: controlRoom.buildingName,
//                     }))}
//                     isClearable
//                     classNamePrefix="react-select"
//                     className={`w-full ${
//                       errors.controlRoom ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.controlRoom ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                     }`}
//                   />
//                   </div>
//                   <button
//                     type="button"
//                     className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                     onClick={handleAddControlRoom}
//                   >
//                     <Plus size={16} /> ADD
//                   </button>
//                 </div>
//                 {errors.controlRoom && <span className="text-xs text-red-600">{errors.controlRoom}</span>}
//               </div>
//             )}
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//           </div>
//         );

//       case 'Other':
//         return (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//             <div className="min-w-0 space-y-1">
//               <label className={`block text-sm font-medium text-gray-700 ${errors.address ? 'text-red-600' : formData.address ? 'text-green-600' : ''}`}>
//                 Address <span className="text-red-600">*</span>
//               </label>
//               <textarea
//                 type="text"
//                 name="address"
//                 // className="min-h-[90px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 className={`min-h-[90px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
//                   ${errors.address ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.address ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                 value={formData.address}
//                 onChange={handleChange}
//                 placeholder="Address"
//               />
//                {errors.address && <span className="text-xs text-red-600">{errors.address}</span>}
//             </div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
//       <div className="mb-5 flex items-center gap-3 text-xl font-semibold text-gray-800">
//         <button
//           type="button"
//           className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//           onClick={handleBack}
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>
//         {id ? 'Edit' : 'Add'} Stock Usage 
//       </div>
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         <div className="flex items-center justify-end border-b border-gray-200 bg-gray-50 px-5 py-3">
//           <button type="button" className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50" onClick={handleReset}>
//             Reset
//           </button>
//         </div>
//         <div className="p-5">
//           {alert.show && (
//             <div
//               className={`mb-4 mx-3 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
//                 alert.type === 'success'
//                   ? 'border-green-200 bg-green-50 text-green-700'
//                   : alert.type === 'info'
//                     ? 'border-blue-200 bg-blue-50 text-blue-700'
//                     : 'border-red-200 bg-red-50 text-red-700'
//               }`}
//               role="alert"
//             >
//               <div className="flex items-center gap-2">
//                 <AlertCircle size={18} />
//                 <span>{alert.message}</span>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setAlert({ show: false, message: '', type: '' })}
//                 className="rounded p-1 hover:bg-black/5"
//                 aria-label="Close alert"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           )}
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.date ? 'text-red-600' : formData.date ? 'text-green-600' : ''}`}>
//                   Date <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="date"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.date ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.date ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.date}
//                   onChange={handleChange}
//                   disabled
//                 />
//                 {errors.date && <span className="text-xs text-red-600">{errors.date}</span>}
//               </div>

//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.usageType ? 'text-red-600' : formData.usageType ? 'text-green-600' : ''}`}>
//                   Usage Type <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   name="usageType"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.usageType ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.usageType ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.usageType}
//                   onChange={handleChange}
//                 >
//                   <option value="">SELECT</option>
//                   <option value="Customer">Customer</option>
//                   <option value="Building">Building</option>
//                   <option value="Building to Building">Building to Building</option>
//                   <option value="Control Room">Control Room</option>
//                   <option value="Damage">Damage</option>
//                   <option value="Stolen from Center">Stolen from Center</option>
//                   <option value="Stolen from Field">Stolen from Field</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 {errors.usageType && <span className="text-xs text-red-600">{errors.usageType}</span>}
//               </div>

//               <div className="min-w-0 space-y-1">
//                 <label className="block text-sm font-medium text-gray-700" htmlFor="remark">
//                   Remark
//                 </label>
//                 <textarea
//                   name="remark"
//                   className="min-h-[90px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   placeholder="Remark"
//                   value={formData.remark}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="min-w-0 space-y-1"></div>
//             </div>

//             {renderConditionalFields()}
            
//             <div className="mt-5">
//               <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <h5>Select Products</h5>
//                 {errors.products && <span className="text-xs font-medium text-red-600">{errors.products}</span>}
//                 <div className="flex">
//                   <label className="mr-2 mt-1">Search:</label>
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full max-w-[250px] rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     placeholder="Search products..."
//                   />
//                 </div>
//               </div>

//               {loading ? (
//                 <div className="flex justify-center py-6">
//                   <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto rounded-lg border border-gray-200">
//                 <table className="min-w-[1000px] w-full border-collapse text-sm">
//                   <thead className="bg-gray-50">
//                     <tr className="border-b border-gray-100 hover:bg-gray-50">
//                       <th className="border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Select</th>
//                       <th className="border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Product Name</th>
//                       <th className="border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Available Quantity</th>
//                       <th className="border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Type</th>
//                       <th className="border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Damage Qty</th>
//                       <th className="border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Old Replace</th>
//                       <th className="border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Usage Qty</th>
//                     </tr>
//                   </thead>
                  
//                   <tbody>
//                 {filteredProducts.length > 0 ? (
//                   filteredProducts.map((p) => {
//                   const isSelected = !!selectedRows[p._id];

//       return (
//         <tr key={p._id} className={`border-b border-gray-100 ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}>
//           <td className="px-4 py-3 text-gray-700">
//             <input
//               type="checkbox"
//               checked={isSelected}
//               onChange={() => handleRowSelect(p._id, p.stock)}
//               style={{ height: "20px", width: "20px" }}
//             />
//           </td>

//           <td className="px-4 py-3 text-gray-700">{p.productTitle}</td>
//           <td className="px-4 py-3 text-gray-700">{p.stock?.currentStock || 0}</td>

//           <td className="px-4 py-3 text-gray-700"></td>
//           <td className="px-4 py-3 text-gray-700"></td>
//           <td className="px-4 py-3 text-gray-700"></td>

//           <td className="px-4 py-3 text-gray-700">
//   {isSelected && (
//     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//       <input
//         type="number"
//         value={selectedRows[p._id]?.quantity || ''}
//         onChange={(e) => handleUsageQtyChange(p._id, e.target.value)}
//         placeholder="Usage Qty"
//         className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//         min="1"
//         max={p.stock?.currentStock || 0}
//       />

//       {selectedRows[p._id] && p.trackSerialNumber === "Yes" && (
//         <span
//           style={{
//             fontSize: '18px',
//             cursor: 'pointer',
//             color: '#337ab7',
//           }}
//           onClick={() => handleOpenSerialModal(p)}
//           title="Add Serial Numbers"
//         >
//           ☰
//         </span>
//       )}
//     </div>
//   )}
// </td>

//         </tr>
//       );
//     })
//   ) : (
//     <tr className="border-b border-gray-100 hover:bg-gray-50">
//       <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
//         No products found
//       </td>
//     </tr>
//   )}
// </tbody>

//                 </table>
//                 </div>
//               )}
//             </div>

//             <div className="mt-5 flex justify-end border-t border-gray-200 pt-4">
//               <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <CustomerModel
//         visible={showCustomerModal}
//         onClose={() => setShowCustomerModal(false)}
//         onCustomerAdded={handleCustomerAdded} 
//       />

//       <BuildingFormModal
//         visible={isBuildingModalOpen}
//         onClose={() => setIsBuildingModalOpen(false)}
//         onBuildingAdded={handleBuildingAdded}
//       />
//       <ControlRoomModel
//         visible={isControlRoomModalOpen}
//         onClose={() => setIsControlRoomModalOpen(false)}
//         onControlRoomAdded={handleControlRoomAdded}
//       />
//       <UsageSerialNumbers
//         visible={serialModalVisible}
//         onClose={() => setSerialModalVisible(false)}
//         product={selectedProduct}
//         usageQty={parseInt(selectedRows[selectedProduct?._id]?.quantity) || 0}
//         onSerialNumbersUpdate={handleSerialNumbersUpdate}
//       />
//     </div>
//   );
// };

// export default AddStockUsage;




// import React, { useState, useEffect, useRef } from 'react';
// import {
//   AlertCircle,
//   ArrowLeft,
//   Check,
//   Plus,
//   RotateCcw,
//   Search,
//   X,
// } from 'lucide-react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from '../../axiosInstance';
// import BuildingFormModal from './BuildingModel';
// import CustomerModel from './CustomerModel';
// import ControlRoomModel from './ControlRoomModel';
// import UsageSerialNumbers from './UsageSerialNumbers';
// import Select from 'react-select';

// const reactSelectStyles = {
//   control: (base, state) => ({
//     ...base,
//     minHeight: '42px',
//     height: '42px',
//     width: '100%',
//     borderRadius: '0px',
//     borderColor: state.isFocused
//       ? '#2759A2'
//       : state.selectProps.value
//         ? '#22c55e'
//         : '#d9dde3',
//     backgroundColor: state.selectProps.value ? '#f0fdf4' : '#ffffff',
//     boxShadow: state.isFocused ? '0 0 0 1px rgba(39, 89, 162, 0.18)' : 'none',
//     '&:hover': {
//       borderColor: state.isFocused ? '#2759A2' : '#b9c0c8',
//     },
//     cursor: 'pointer',
//   }),

//   valueContainer: (base) => ({
//     ...base,
//     padding: '0 12px',
//     minWidth: 0,
//   }),

//   input: (base) => ({
//     ...base,
//     margin: 0,
//     padding: 0,
//     color: '#343a40',
//     fontSize: '14px',
//   }),

//   placeholder: (base) => ({
//     ...base,
//     color: '#6c757d',
//     fontSize: '14px',
//   }),

//   singleValue: (base) => ({
//     ...base,
//     color: '#343a40',
//     fontSize: '14px',
//     maxWidth: '100%',
//   }),

//   indicatorsContainer: (base) => ({
//     ...base,
//     height: '40px',
//   }),

//   clearIndicator: (base) => ({
//     ...base,
//     padding: '8px',
//     color: '#6c757d',
//     '&:hover': {
//       color: '#dc3545',
//     },
//   }),

//   dropdownIndicator: (base, state) => ({
//     ...base,
//     padding: '8px 10px',
//     color: state.isFocused ? '#2759A2' : '#6c757d',
//     '&:hover': {
//       color: '#2759A2',
//     },
//   }),

//   indicatorSeparator: (base) => ({
//     ...base,
//     backgroundColor: '#d9dde3',
//     margin: '7px 0',
//   }),

//   menuPortal: (base) => ({
//     ...base,
//     zIndex: 9999999,
//   }),

//   menu: (base) => ({
//     ...base,
//     marginTop: '4px',
//     borderRadius: '4px',
//     border: '1px solid #d9dde3',
//     backgroundColor: '#ffffff',
//     boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
//     overflow: 'hidden',
//     zIndex: 9999999,
//   }),

//   menuList: (base) => ({
//     ...base,
//     maxHeight: '260px',
//     padding: '4px 0',
//     overflowY: 'auto',
//     overflowX: 'hidden',
//   }),

//   option: (base, state) => ({
//     ...base,
//     padding: '10px 12px',
//     fontSize: '14px',
//     color: '#343a40',
//     backgroundColor: state.isSelected
//       ? '#2f80ed'
//       : state.isFocused
//         ? '#e7f0ff'
//         : '#ffffff',
//     cursor: 'pointer',
//     '&:active': {
//       backgroundColor: '#2759A2',
//       color: '#ffffff',
//     },
//   }),

//   noOptionsMessage: (base) => ({
//     ...base,
//     color: '#6c757d',
//     fontSize: '14px',
//     padding: '12px',
//   }),
// };

// const AddStockUsage = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const getTodayDate = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const day = String(today.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const [formData, setFormData] = useState({
//     date: getTodayDate(),
//     usageType: '',
//     remark: '',
//     customer: '',
//     connectionType: '',
//     packageAmount: '',
//     packageDuration: '',
//     onuCharges: '',
//     installationCharges: '',
//     reason: '',
//     fromBuilding: '',
//     toBuilding: '',
//     controlRoom: '',
//     stolenFrom: '',
//     address: '',
//     shiftingAmount: '',
//     wireChangeAmount: '',
//     toCenter:'',
//     damageReason:''
//   });

//   const [errors, setErrors] = useState({});
//   const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
//   const [isControlRoomModalOpen, setIsControlRoomModalOpen] = useState(false);
//   const [showCustomerModal, setShowCustomerModal] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRows, setSelectedRows] = useState({});
//   const [buildings, setBuildings] = useState([]);
//   const [controlRooms, setControlRooms] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [currentBuildingType, setCurrentBuildingType] = useState(''); 
//   const [loading, setLoading] = useState(true);
//   const [serialModalVisible, setSerialModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [assignedSerials, setAssignedSerials] = useState({});
//   const [alert, setAlert] = useState({ show: false, message: '', type: '' });

//   // Track selection order
//   const [selectionOrder, setSelectionOrder] = useState([]);
//   const selectionCounter = useRef(0);

//   useEffect(() => {
//     if (id) {
//       fetchStockUsage(id);
//     }
//     fetchCustomers();
//     fetchBuildings();
//     fetchControlRooms();
//     fetchProducts();
//     fetchCenters();
//   }, [id]);

//   const showAlert = (message, type) => {
//     setAlert({ show: true, message, type });
//     setTimeout(() => {
//       setAlert({ show: false, message: '', type: '' });
//     }, 5000);
//   };

//   const handleOpenSerialModal = (product) => {
//     const usageQuantity = parseInt(selectedRows[product._id]?.quantity) || 0;
//     if (usageQuantity > 0) {
//       setSelectedProduct(product);
//       setSerialModalVisible(true);
//     }
//   };
   
//   const handleSerialNumbersUpdate = (productId, serialsArray) => {
//     setAssignedSerials(prev => ({
//       ...prev,
//       [productId]: serialsArray
//     }));
//   };
  
//   const fetchStockUsage = async (usageId) => {
//     try {
//       const res = await axiosInstance.get(`/stockusage/${usageId}`);
//       const data = res.data.data;
//       const apiDate = data.date ? data.date.split('T')[0] : '';
      
//       const fromBuilding = data.fromBuilding?._id || data.fromBuilding || '';
//       const toBuilding = data.toBuilding?._id || data.toBuilding || '';
//       const toCenter = data.toCenter?._id || data.toCenter || '';
      
//       setFormData(prev => ({
//         ...prev,
//         ...data,
//         date: apiDate,
//         customer: data.customer?._id || data.customer || '',
//         fromBuilding: fromBuilding,
//         toBuilding: toBuilding,
//         controlRoom: data.controlRoom?._id || data.controlRoom || '',
//         toCenter: toCenter
//       }));
    
//       if (data.items && data.items.length > 0) {
//         const existingSelectedRows = {};
//         const existingAssignedSerials = {};
//         const order = [];
        
//         data.items.forEach((item, index) => {
//           const productId = item.product?.productId || item.product;
//           existingSelectedRows[productId] = {
//             quantity: item.quantity.toString(),
//             productRemark: item.productRemark || '',
//             productInStock: item.oldStock || 0
//           };
          
//           if (item.serialNumbers && item.serialNumbers.length > 0) {
//             existingAssignedSerials[productId] = item.serialNumbers;
//           }
          
//           order.push({ productId, order: index });
//         });
        
//         setSelectedRows(existingSelectedRows);
//         setAssignedSerials(existingAssignedSerials);
//         setSelectionOrder(order);
//         selectionCounter.current = data.items.length;
//       }
      
//     } catch (error) {
//       console.error('Error fetching stock usage:', error);
//       showAlert('Failed to fetch stock usage data', 'danger');
//     }
//   };

//   const fetchCustomers = async () => {
//     try {
//       const res = await axiosInstance.get('/customers/all');
//       setCustomers(res.data.data || []);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//       showAlert('Failed to fetch customers', 'danger');
//     }
//   };

//   const fetchBuildings = async () => {
//     try {
//       const res = await axiosInstance.get('/buildings');
//       setBuildings(res.data.data || []);
//     } catch (error) {
//       console.error('Error fetching buildings:', error);
//       showAlert('Failed to fetch buildings', 'danger');
//     }
//   };

//   const fetchControlRooms = async () => {
//     try {
//       const res = await axiosInstance.get('/controlRooms');
//       setControlRooms(res.data.data || []);
//     } catch (error) {
//       console.error('Error fetching control rooms:', error);
//       showAlert('Failed to fetch control rooms', 'danger');
//     }
//   };
  
//   // const fetchCenters = async () => {
//   //   try {
//   //     const res = await axiosInstance.get('/centers/main-warehouse?centerType=Outlet');
//   //     setCenters(res.data.data || []);
//   //   } catch (error) {
//   //     console.error('Error fetching centers:', error);
//   //     showAlert('Failed to fetch centers', 'danger');
//   //   }
//   // };
  
//   const fetchCenters = async () => {
//     try {
//       const res = await axiosInstance.get('/centers/main-warehouse?centerType=Outlet');
//       if (res.data.success) {
//         const telecomWarehouses = res.data.data.filter(warehouse => 
//           warehouse.centerName?.toLowerCase().includes('telecom') || 
//           warehouse.centerType?.toLowerCase().includes('telecom') ||
//           warehouse.category?.toLowerCase().includes('telecom')
//         );
//         setCenters(telecomWarehouses);
//       }
//     } catch (error) {
//       console.error('Error fetching warehouses:', error);
//       showAlert('Failed to fetch centers', 'danger');
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
//       showAlert('Failed to fetch products', 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRowSelect = (productId, productStock) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };
//       if (updated[productId]) {
//         // Remove from selection order when unselecting
//         setSelectionOrder(prevOrder => prevOrder.filter(item => item.productId !== productId));
//         delete updated[productId];
//       } else {
//         // Add to selection order when selecting
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
  
//   const handleUsageQtyChange = (productId, value) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         quantity: value
//       }
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let newErrors = {};
    
//     if (!formData.date) newErrors.date = 'Date is text-red-600';
//     if (!formData.usageType) newErrors.usageType = 'Usage Type is text-red-600';
//     if (Object.keys(selectedRows).length === 0) {
//       newErrors.products = 'Please select at least one product';
//     }
  
//     Object.keys(selectedRows).forEach(productId => {
//       const product = products.find(p => p._id === productId);
//       const selectedRow = selectedRows[productId];
      
//       if (!selectedRow.quantity || parseInt(selectedRow.quantity) <= 0) {
//         newErrors.products = `Please enter valid usage quantity for ${product?.productTitle}`;
//       }
      
//       if (product?.trackSerialNumber === "Yes") {
//         const usageQty = parseInt(selectedRow.quantity);
//         const assignedSerialsForProduct = assignedSerials[productId] || [];
        
//         if (assignedSerialsForProduct.length !== usageQty) {
//           newErrors.products = `Please assign serial numbers for all ${usageQty} items of ${product?.productTitle}`;
//         }
//       }
//     });
  
//     if (formData.usageType === 'Customer') {
//       if (!formData.customer) newErrors.customer = 'Customer is text-red-600';
//       if (!formData.connectionType) newErrors.connectionType = 'Previous Connection Type is text-red-600';
//       if (!formData.packageAmount) newErrors.packageAmount = 'Package Amount is text-red-600';
//       if (!formData.packageDuration) newErrors.packageDuration = 'Package Duration is text-red-600';
//       if (!formData.onuCharges) newErrors.onuCharges = 'ONU Charges is text-red-600';
//       if (!formData.installationCharges) newErrors.installationCharges = 'Installation Charges is text-red-600';
//       if (!formData.reason) newErrors.reason = 'Reason is text-red-600';
//     }
    
//     if (formData.usageType === 'Building' && !formData.fromBuilding) {
//       newErrors.fromBuilding = 'From Building is text-red-600';
//     }
    
//     if (formData.usageType === 'Building to Building') {
//       if (!formData.fromBuilding) newErrors.fromBuilding = 'From Building is text-red-600';
//       if (!formData.toBuilding) newErrors.toBuilding = 'To Building is text-red-600';
//     }
    
//     if (formData.usageType === 'Control Room' && !formData.controlRoom) {
//       newErrors.controlRoom = 'Control Room is text-red-600';
//     }
    
//     if (formData.usageType === 'Stolen from Field' && !formData.stolenFrom) {
//       newErrors.stolenFrom = 'Stolen From is text-red-600';
//     }
    
//     if (formData.usageType === 'Other' && !formData.address) {
//       newErrors.address = 'Address is text-red-600';
//     }
  
//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;
//     }
  
//     try {
//         const items = Object.keys(selectedRows).map(productId => {
//         const product = products.find(p => p._id === productId);
//         const selectedRow = selectedRows[productId];
//         const serialNumbers = assignedSerials[productId] || [];
        
//         const item = {
//           product: productId,
//           quantity: parseInt(selectedRow.quantity),
//           productRemark: selectedRow.productRemark || '',
//         };
//         if (serialNumbers.length > 0) {
//           item.serialNumbers = serialNumbers;
//         }
        
//         return item;
//       });
  
//       const payload = {
//         date: formData.date,
//         usageType: formData.usageType,
//         remark: formData.remark || '',
//         customer: formData.customer || null,
//         connectionType: formData.connectionType || null,
//         packageAmount: formData.packageAmount ? parseFloat(formData.packageAmount) : 0,
//         packageDuration: formData.packageDuration || null,
//         onuCharges: formData.onuCharges ? parseFloat(formData.onuCharges) : 0,
//         installationCharges: formData.installationCharges ? parseFloat(formData.installationCharges) : 0,
//         reason: formData.reason || null,
//         shiftingAmount: formData.shiftingAmount ? parseFloat(formData.shiftingAmount) : 0,
//         wireChangeAmount: formData.wireChangeAmount ? parseFloat(formData.wireChangeAmount) : 0,
//         fromBuilding: formData.fromBuilding || null,
//         toBuilding: formData.toBuilding || null,
//         fromControlRoom: formData.controlRoom || null,
//         stolenFrom: formData.stolenFrom || null,
//         address: formData.address || null,
//         toCenter: formData.toCenter || null,
//         damageReason: formData.damageReason || null,
//         items: items
//       };
  
//       console.log('Submitting payload:', payload);
  
//       if (id) {
//         await axiosInstance.put(`/stockusage/${id}`, payload);
//         showAlert('Stock usage updated successfully!', 'success');
//         setTimeout(() => {
//           navigate('/stock-usage');
//         }, 1500);
//       } else {
//         await axiosInstance.post('/stockusage', payload);
//         showAlert('Stock usage added successfully!', 'success');
//         setTimeout(() => {
//           navigate('/stock-usage');
//         }, 1500);
//       }
//     } catch (error) {
//       console.error('Error saving stock usage:', error);
      
//       let errorMessage = 'Failed to save stock usage';
      
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;

//         if (errorMessage.includes('CenterStock validation failed') && errorMessage.includes('Must be a valid Center (not Outlet)')) {
//           errorMessage = 'Invalid center type. Please select a valid Center (not an Outlet) for stock usage.';
//         }
//       }
      
//       showAlert(errorMessage, 'danger');
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       date: getTodayDate(),
//       usageType: '',
//       remark: '',
//       customer: '',
//       connectionType: '',
//       packageAmount: '',
//       packageDuration: '',
//       onuCharges: '',
//       installationCharges: '',
//       reason: '',
//       fromBuilding: '',
//       toBuilding: '',
//       fromControlRoom: '',
//       stolenFrom: '',
//       address: '',
//       shiftingAmount: '',
//       wireChangeAmount: '',
//       toCenter: '',
//       damageReason: '' 
//     });
//     setSelectedRows({});
//     setAssignedSerials({});
//     setSelectionOrder([]);
//     selectionCounter.current = 0;
//     setErrors({});
//     showAlert('Form has been reset', 'info');
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const handleAddCustomer = () => {
//     setShowCustomerModal(true);
//   };

//   const handleCustomerAdded = (newCustomer) => {
//     setCustomers((prev) => [...prev, newCustomer]);

//     setFormData((prev) => ({
//       ...prev,
//       customer: newCustomer._id,
//     }));
//     showAlert('Customer added successfully!', 'success');
//   };

//   const handleAddBuilding = () => {
//     setIsBuildingModalOpen(true);
//   };

//   const handleBuildingAdded = (newBuilding) => {
//     setBuildings((prev) => [...prev, newBuilding]);

//     if (currentBuildingType === 'from') {
//       setFormData((prev) => ({
//         ...prev,
//         fromBuilding: newBuilding._id || newBuilding.id,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         toBuilding: newBuilding._id || newBuilding.id
//       }));
//     }
//     showAlert('Building added successfully!', 'success');
//   };

//   const handleAddControlRoom = () => {
//     setIsControlRoomModalOpen(true);
//   };

//   const handleControlRoomAdded = (newControlRoom) => {
//     setControlRooms((prev) => [...prev, newControlRoom]);

//     setFormData((prev) => ({
//       ...prev,
//       controlRoom: newControlRoom._id || newControlRoom.id,
//     }));
//     showAlert('Control room added successfully!', 'success');
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

//   const renderConditionalFields = () => {
//     switch (formData.usageType) {
//       case 'Customer':
//         return (
//           <>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.customer ? 'text-red-600' : formData.customer ? 'text-green-600' : ''}`}>
//                   Customer <span className="text-red-600">*</span>
//                 </label>
//                 <div className="flex min-w-0 gap-2">
//                 <div className="min-w-0 flex-1">
//                   <Select
//                     id="customer"
//                     name="customer"
//                     placeholder="Search..."
//                     value={
//                       formData.customer
//                         ? {
//                             value: formData.customer,
//                             label: customers.find((c) => c._id === formData.customer)
//                               ? `${customers.find((c) => c._id === formData.customer).username} - ${customers.find((c) => c._id === formData.customer).mobile}`
//                               : "",
//                           }
//                         : null
//                     }
//                     onChange={(selected) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         customer: selected ? selected.value : "",
//                       }))
//                     }
//                     options={customers.map((customer) => ({
//                       value: customer._id,
//                       label: `${customer.username} - ${customer.mobile}`,
//                     }))}
//                     isClearable
//                     classNamePrefix="react-select"
//                     className={`w-full ${
//                       errors.customer ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.customer ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                     }`}
//                   styles={reactSelectStyles}
//                   menuPortalTarget={document.body}
//                   menuPosition="fixed"
//                   menuShouldScrollIntoView={false}
//                   />
//                   </div>
//                   <button
//                     type="button"
//                     className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                     onClick={handleAddCustomer}
//                   >
//                     <Plus size={16} /> ADD
//                   </button>
//                 </div>
//                 {errors.customer && <span className="text-xs text-red-600">{errors.customer}</span>}
//               </div>
//               <div className="min-w-0 space-y-1"></div>
//               <div className="min-w-0 space-y-1"></div>
//               <div className="min-w-0 space-y-1"></div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.connectionType ? 'text-red-600' : formData.connectionType ? 'text-green-600' : ''}`}>
//                   Connection Type <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   name="connectionType"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.connectionType ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.connectionType ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.connectionType}
//                   onChange={handleChange}
//                 >
//                   <option value="">SELECT</option>
//                   <option value="NC">NC</option>
//                   <option value="Convert">Convert</option>
//                   <option value="Shifting">Shifting</option>
//                   <option value="Repair">Repair</option>
//                 </select>
//                 {errors.connectionType && <span className="text-xs text-red-600">{errors.connectionType}</span>}
//               </div>

//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.packageAmount ? 'text-red-600' : formData.packageAmount ? 'text-green-600' : ''}`}>
//                   Package Amount <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="packageAmount"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.packageAmount ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.packageAmount ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.packageAmount}
//                   onChange={handleChange}
//                   placeholder="Package Amount"
//                 />
//                 {errors.packageAmount && <span className="text-xs text-red-600">{errors.packageAmount}</span>}
//               </div>

//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.packageDuration ? 'text-red-600' : formData.packageDuration ? 'text-green-600' : ''}`}>
//                   Package Duration <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="packageDuration"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.packageDuration ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.packageDuration ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.packageDuration}
//                   onChange={handleChange}
//                   placeholder="Package Duration"
//                 />
//                 {errors.packageDuration && <span className="text-xs text-red-600">{errors.packageDuration}</span>}
//               </div>

//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.onuCharges ? 'text-red-600' : formData.onuCharges ? 'text-green-600' : ''}`}>
//                   ONU Charges <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="onuCharges"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.onuCharges ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.onuCharges ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.onuCharges}
//                   onChange={handleChange}
//                   placeholder="ONU Charges"
//                 />
//                 {errors.onuCharges && <span className="text-xs text-red-600">{errors.onuCharges}</span>}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.installationCharges ? 'text-red-600' : formData.installationCharges ? 'text-green-600' : ''}`}>
//                   Installation Charges <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="installationCharges"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.installationCharges ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.installationCharges ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.installationCharges}
//                   onChange={handleChange}
//                   placeholder="Installation Charges"
//                 />
//                 {errors.installationCharges && <span className="text-xs text-red-600">{errors.installationCharges}</span>}
//               </div>

//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.reason ? 'text-red-600' : formData.reason ? 'text-green-600' : ''}`}>
//                   Reason <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   name="reason"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.reason ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.reason ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.reason}
//                   onChange={handleChange}
//                 >
//                   <option value="">SELECT</option>
//                   <option value="NC">NC</option>
//                   <option value="Convert">Convert</option>
//                   <option value="Shifting">Shifting</option>
//                   <option value="Repair">Repair</option>
//                 </select>
//                 {errors.reason && <span className="text-xs text-red-600">{errors.reason}</span>}
//               </div>
//               <div className="min-w-0 space-y-1"></div>
//               <div className="min-w-0 space-y-1"></div>
//             </div>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.shiftingAmount ? 'text-red-600' : formData.shiftingAmount ? 'text-green-600' : ''}`}>
//                   Shifting Amount<span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="shiftingAmount"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.shiftingAmount ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.shiftingAmount ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.shiftingAmount}
//                   onChange={handleChange}
//                   placeholder='Shifting Amount'
//                 />
//                 {errors.shiftingAmount && <span className="text-xs text-red-600">{errors.shiftingAmount}</span>}
//               </div>

//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.wireChangeAmount ? 'text-red-600' : formData.wireChangeAmount ? 'text-green-600' : ''}`}>
//                   Wire Change Amount <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="wireChangeAmount"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.wireChangeAmount ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.wireChangeAmount ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.wireChangeAmount}
//                   onChange={handleChange}
//                   placeholder='Wire Change Amount'
//                 />
//                 {errors.wireChangeAmount && <span className="text-xs text-red-600">{errors.wireChangeAmount}</span>}
//               </div>
//               <div className="min-w-0 space-y-1"></div>
//               <div className="min-w-0 space-y-1"></div>
//             </div>
//           </>
//         );

//       case 'Building':
//         return (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//             <div className="min-w-0 space-y-1">
//               <label className={`block text-sm font-medium text-gray-700 ${errors.fromBuilding ? 'text-red-600' : formData.fromBuilding ? 'text-green-600' : ''}`}>
//                 From Building <span className="text-red-600">*</span>
//               </label>
//               <div className="flex min-w-0 gap-2">
//               <div className="min-w-0 flex-1">
//                 <Select
//                   id="fromBuilding"
//                   name="fromBuilding"
//                   placeholder="Search..."
//                   value={
//                     formData.fromBuilding
//                       ? {
//                           value: formData.fromBuilding,
//                           label: buildings.find((b) => b._id === formData.fromBuilding)
//                             ?.buildingName || "",
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       fromBuilding: selected ? selected.value : "",
//                     }))
//                   }
//                   options={buildings.map((building) => ({
//                     value: building._id,
//                     label: building.buildingName,
//                   }))}
//                   isClearable
//                   classNamePrefix="react-select"
//                   className={`w-full ${
//                     errors.fromBuilding ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.fromBuilding ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                   }`}
//                 styles={reactSelectStyles}
//                 menuPortalTarget={document.body}
//                 menuPosition="fixed"
//                 menuShouldScrollIntoView={false}
//                 />
//                 </div>
//                 <button
//                   type="button"
//                   className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}
//                 >
//                   <Plus size={16} /> ADD
//                 </button>
//               </div>
//               {errors.fromBuilding && <span className="text-xs text-red-600">{errors.fromBuilding}</span>}
//             </div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//           </div>
//         );

//       case 'Building to Building':
//         return (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//             <div className="min-w-0 space-y-1">
//               <label className={`block text-sm font-medium text-gray-700 ${errors.fromBuilding ? 'text-red-600' : formData.fromBuilding ? 'text-green-600' : ''}`}>
//                 From Building <span className="text-red-600">*</span>
//               </label>
//               <div className="flex min-w-0 gap-2">
//               <div className="min-w-0 flex-1">
//                 <Select
//                   id="fromBuilding"
//                   name="fromBuilding"
//                   placeholder="Search..."
//                   value={
//                     formData.fromBuilding
//                       ? {
//                           value: formData.fromBuilding,
//                           label: buildings.find((b) => b._id === formData.fromBuilding)
//                             ?.buildingName || "",
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       fromBuilding: selected ? selected.value : "",
//                     }))
//                   }
//                   options={buildings.map((building) => ({
//                     value: building._id,
//                     label: building.buildingName,
//                   }))}
//                   isClearable
//                   classNamePrefix="react-select"
//                   className={`w-full ${
//                     errors.fromBuilding ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.fromBuilding ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                   }`}
//                 styles={reactSelectStyles}
//                 menuPortalTarget={document.body}
//                 menuPosition="fixed"
//                 menuShouldScrollIntoView={false}
//                 />
//                 </div>
//                 <button
//                   type="button"
//                   className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}
//                 >
//                   <Plus size={16} /> ADD
//                 </button>
//               </div>
//               {errors.fromBuilding && <span className="text-xs text-red-600">{errors.fromBuilding}</span>}
//             </div>

//             <div className="min-w-0 space-y-1">
//               <label className={`block text-sm font-medium text-gray-700 ${errors.toBuilding ? 'text-red-600' : formData.toBuilding ? 'text-green-600' : ''}`}>
//                 To Building <span className="text-red-600">*</span>
//               </label>
//               <div className="flex min-w-0 gap-2">
//               <div className="min-w-0 flex-1">
//                 <Select
//                   id="toBuilding"
//                   name="toBuilding"
//                   placeholder="Search..."
//                   value={
//                     formData.toBuilding
//                       ? {
//                           value: formData.toBuilding,
//                           label: buildings.find((b) => b._id === formData.toBuilding)
//                             ?.buildingName || "",
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       toBuilding: selected ? selected.value : "",
//                     }))
//                   }
//                   options={buildings.map((building) => ({
//                     value: building._id,
//                     label: building.buildingName,
//                   }))}
//                   isClearable
//                   classNamePrefix="react-select"
//                   className={`w-full ${
//                     errors.toBuilding ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.toBuilding ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                   }`}
//                 styles={reactSelectStyles}
//                 menuPortalTarget={document.body}
//                 menuPosition="fixed"
//                 menuShouldScrollIntoView={false}
//                 />
//                 </div>
//                 <button
//                   type="button"
//                   className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   onClick={() => { setCurrentBuildingType('to'); handleAddBuilding(); }}
//                 >
//                   <Plus size={16} /> ADD
//                 </button>
//               </div>
//               {errors.toBuilding && <span className="text-xs text-red-600">{errors.toBuilding}</span>}
//             </div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//           </div>
//         );

//       case 'Control Room':
//         return (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//             <div className="min-w-0 space-y-1">
//               <label className={`block text-sm font-medium text-gray-700 ${errors.controlRoom ? 'text-red-600' : formData.controlRoom ? 'text-green-600' : ''}`}>
//                 Control Room <span className="text-red-600">*</span>
//               </label>
//               <div className="flex min-w-0 gap-2">
//               <div className="min-w-0 flex-1">
//                 <Select
//                   id="controlRoom"
//                   name="controlRoom"
//                   placeholder="Search..."
//                   value={
//                     formData.controlRoom
//                       ? {
//                           value: formData.controlRoom,
//                           label: controlRooms.find((cr) => cr._id === formData.controlRoom)
//                             ?.buildingName || "",
//                         }
//                       : null
//                   }
//                   onChange={(selected) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       controlRoom: selected ? selected.value : "",
//                     }))
//                   }
//                   options={controlRooms.map((controlRoom) => ({
//                     value: controlRoom._id,
//                     label: controlRoom.buildingName,
//                   }))}
//                   isClearable
//                   classNamePrefix="react-select"
//                   className={`w-full ${
//                     errors.controlRoom ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.controlRoom ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                   }`}
//                 styles={reactSelectStyles}
//                 menuPortalTarget={document.body}
//                 menuPosition="fixed"
//                 menuShouldScrollIntoView={false}
//                 />
//                 </div>
//                 <button
//                   type="button"
//                   className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   onClick={handleAddControlRoom}
//                 >
//                   <Plus size={16} /> ADD
//                 </button>
//               </div>
//               {errors.controlRoom && <span className="text-xs text-red-600">{errors.controlRoom}</span>}
//             </div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//           </div>
//         );
      

//         case 'Damage':
//           return (
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.toCenter ? 'text-red-600' : formData.toCenter ? 'text-green-600' : ''}`}>
//                   To Center <span className="text-red-600">*</span>
//                 </label>
//                 <div className="flex min-w-0 gap-2">
//                   <div className="min-w-0 flex-1">
//                     <Select
//                       id="toCenter"
//                       name="toCenter"
//                       placeholder="Select center..."
//                       value={
//                         formData.toCenter
//                           ? {
//                               value: formData.toCenter,
//                               label: centers.find((c) => c._id === formData.toCenter)
//                                 ?.centerName || "",
//                             }
//                           : null
//                       }
//                       onChange={(selected) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           toCenter: selected ? selected.value : "",
//                         }))
//                       }
//                       options={centers.map((center) => ({
//                         value: center._id,
//                         label: center.centerName,
//                       }))}
//                       isClearable
//                       classNamePrefix="react-select"
//                       className={`w-full ${
//                         errors.toCenter ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.toCenter ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                       }`}
//                     styles={reactSelectStyles}
//                     menuPortalTarget={document.body}
//                     menuPosition="fixed"
//                     menuShouldScrollIntoView={false}
//                     />
//                   </div>
//                 </div>
//                 {errors.toCenter && <span className="text-xs text-red-600">{errors.toCenter}</span>}
//               </div>
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.damageReason ? 'text-red-600' : formData.damageReason ? 'text-green-600' : ''}`}>
//                  Damage Reason <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   name="damageReason"
//                   className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.damageReason ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.reason ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                   value={formData.damageReason}
//                   onChange={handleChange}
//                 >
//                   <option value="">SELECT</option>
//                   <option value="Physical Damage">Physical Damage</option>
//                   <option value="Water Damage">Water Damage</option>
//                   <option value="Power Surge">Power Surge</option>
//                   <option value="Manufacturing Defect">Manufacturing Defect</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 {errors.damageReason && <span className="text-xs text-red-600">{errors.damageReason}</span>}
//               </div>
//               <div className="min-w-0 space-y-1"></div>
//               <div className="min-w-0 space-y-1"></div>
//             </div>
//           );
  
//       case 'Stolen from Field':
//         return (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//             <div className="min-w-0 space-y-1">
//               <label className={`block text-sm font-medium text-gray-700 ${errors.stolenFrom ? 'text-red-600' : formData.stolenFrom ? 'text-green-600' : ''}`}>
//                 Stolen From <span className="text-red-600">*</span>
//               </label>
//               <select
//                 type="text"
//                 name="stolenFrom"
//                 className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.stolenFrom ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.stolenFrom ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                 value={formData.stolenFrom}
//                 onChange={handleChange}
//                 placeholder="Stolen From"
//               >
//                 <option value="">SELECT</option>
//                 <option value="Building">Building</option>
//                 <option value="Customer">Customer</option>
//                 <option value="Control Room">Control Room</option>
//               </select>
//               {errors.stolenFrom && <span className="text-xs text-red-600">{errors.stolenFrom}</span>}
//             </div>
            
//             {formData.stolenFrom === 'Building' && (
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.fromBuilding ? 'text-red-600' : formData.fromBuilding ? 'text-green-600' : ''}`}>
//                   From Building <span className="text-red-600">*</span>
//                 </label>
//                 <div className="flex min-w-0 gap-2">
//                 <div className="min-w-0 flex-1">
//                   <Select
//                     id="fromBuilding"
//                     name="fromBuilding"
//                     placeholder="Search..."
//                     value={
//                       formData.fromBuilding
//                         ? {
//                             value: formData.fromBuilding,
//                             label: buildings.find((b) => b._id === formData.fromBuilding)
//                               ?.buildingName || "",
//                           }
//                         : null
//                     }
//                     onChange={(selected) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         fromBuilding: selected ? selected.value : "",
//                       }))
//                     }
//                     options={buildings.map((building) => ({
//                       value: building._id,
//                       label: building.buildingName,
//                     }))}
//                     isClearable
//                     classNamePrefix="react-select"
//                     className={`w-full ${
//                       errors.fromBuilding ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.fromBuilding ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                     }`}
//                   styles={reactSelectStyles}
//                   menuPortalTarget={document.body}
//                   menuPosition="fixed"
//                   menuShouldScrollIntoView={false}
//                   />
//                   </div>
//                   <button
//                     type="button"
//                     className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                     onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}
//                   >
//                     <Plus size={16} /> ADD
//                   </button>
//                 </div>
//                 {errors.fromBuilding && <span className="text-xs text-red-600">{errors.fromBuilding}</span>}
//               </div>
//             )}
            
//             {formData.stolenFrom === 'Customer' && (
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.customer ? 'text-red-600' : formData.customer ? 'text-green-600' : ''}`}>
//                   Customer <span className="text-red-600">*</span>
//                 </label>
//                 <div className="flex min-w-0 gap-2">
//                 <div className="min-w-0 flex-1">
//                   <Select
//                     id="customer"
//                     name="customer"
//                     placeholder="Search..."
//                     value={
//                       formData.customer
//                         ? {
//                             value: formData.customer,
//                             label: customers.find((c) => c._id === formData.customer)
//                               ? `${customers.find((c) => c._id === formData.customer).username} - ${customers.find((c) => c._id === formData.customer).mobile}`
//                               : "",
//                           }
//                         : null
//                     }
//                     onChange={(selected) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         customer: selected ? selected.value : "",
//                       }))
//                     }
//                     options={customers.map((customer) => ({
//                       value: customer._id,
//                       label: `${customer.username} - ${customer.mobile}`,
//                     }))}
//                     isClearable
//                     classNamePrefix="react-select"
//                     className={`w-full ${
//                       errors.customer ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.customer ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                     }`}
//                   styles={reactSelectStyles}
//                   menuPortalTarget={document.body}
//                   menuPosition="fixed"
//                   menuShouldScrollIntoView={false}
//                   />
//                   </div>
//                   <button
//                     type="button"
//                     className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                     onClick={handleAddCustomer}
//                   >
//                     <Plus size={16} /> ADD
//                   </button>
//                 </div>
//                 {errors.customer && <span className="text-xs text-red-600">{errors.customer}</span>}
//               </div>
//             )}

//             {formData.stolenFrom === 'Control Room' && (
//               <div className="min-w-0 space-y-1">
//                 <label className={`block text-sm font-medium text-gray-700 ${errors.controlRoom ? 'text-red-600' : formData.controlRoom ? 'text-green-600' : ''}`}>
//                   Control Room <span className="text-red-600">*</span>
//                 </label>
//                 <div className="flex min-w-0 gap-2">
//                 <div className="min-w-0 flex-1">
//                   <Select
//                     id="controlRoom"
//                     name="controlRoom"
//                     placeholder="Search..."
//                     value={
//                       formData.controlRoom
//                         ? {
//                             value: formData.controlRoom,
//                             label: controlRooms.find((cr) => cr._id === formData.controlRoom)
//                               ?.buildingName || "",
//                           }
//                         : null
//                     }
//                     onChange={(selected) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         controlRoom: selected ? selected.value : "",
//                       }))
//                     }
//                     options={controlRooms.map((controlRoom) => ({
//                       value: controlRoom._id,
//                       label: controlRoom.buildingName,
//                     }))}
//                     isClearable
//                     classNamePrefix="react-select"
//                     className={`w-full ${
//                       errors.controlRoom ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.controlRoom ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
//                     }`}
//                   styles={reactSelectStyles}
//                   menuPortalTarget={document.body}
//                   menuPosition="fixed"
//                   menuShouldScrollIntoView={false}
//                   />
//                   </div>
//                   <button
//                     type="button"
//                     className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                     onClick={handleAddControlRoom}
//                   >
//                     <Plus size={16} /> ADD
//                   </button>
//                 </div>
//                 {errors.controlRoom && <span className="text-xs text-red-600">{errors.controlRoom}</span>}
//               </div>
//             )}
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//           </div>
//         );

//       case 'Other':
//         return (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//             <div className="min-w-0 space-y-1">
//               <label className={`block text-sm font-medium text-gray-700 ${errors.address ? 'text-red-600' : formData.address ? 'text-green-600' : ''}`}>
//                 Address <span className="text-red-600">*</span>
//               </label>
//               <textarea
//                 type="text"
//                 name="address"
//                 // className="min-h-[90px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 className={`min-h-[90px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
//                   ${errors.address ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.address ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
//                 value={formData.address}
//                 onChange={handleChange}
//                 placeholder="Address"
//               />
//                {errors.address && <span className="text-xs text-red-600">{errors.address}</span>}
//             </div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//             <div className="min-w-0 space-y-1"></div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//         <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

//       {/* Page Header */}
//       <div className="mb-2 flex items-center gap-4">
//         <button
//           type="button"
//           onClick={handleBack}
//           className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-2 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1f4b8c] focus:outline-none focus:ring-2 focus:ring-[#2759A2]/30"
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>
        

//         <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//           {id ? 'Edit' : 'Add'} Stock Usage
//         </h1>
//       </div>

//       {/* Main Card */}
//       <div className="overflow-hidden border border-[#e1e4e8] bg-white shadow-sm">
//         {/* Blue top border */}
//         <div className="h-1 w-full bg-[#2759A2]" />

//         {/* Card Toolbar */}
//         <div className="flex min-h-[64px] items-center justify-end border-b border-[#e5e7eb] bg-white px-5 py-3">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1f4b8c] focus:outline-none focus:ring-2 focus:ring-[#2759A2]/30"
//           >
//             <RotateCcw size={15} />
//             Reset
//           </button>
//         </div>

//         <div className="px-5 py-5">
//           {alert.show && (
//             <div
//               className={`mb-5 flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm ${
//                 alert.type === 'success'
//                   ? 'border-green-200 bg-green-50 text-green-700'
//                   : alert.type === 'info'
//                     ? 'border-blue-200 bg-blue-50 text-blue-700'
//                     : 'border-red-200 bg-red-50 text-red-700'
//               }`}
//               role="alert"
//             >
//               <div className="flex items-center gap-2">
//                 <AlertCircle size={18} />
//                 <span>{alert.message}</span>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setAlert({ show: false, message: '', type: '' })}
//                 className="rounded p-1 transition hover:bg-black/5"
//                 aria-label="Close alert"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* Basic Information */}
//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
//               <div className="min-w-0">
//                 <label
//                   className={`mb-1.5 block text-sm font-semibold ${
//                     errors.date
//                       ? 'text-red-600'
//                       : formData.date
//                         ? 'text-green-600'
//                         : 'text-[#343a40]'
//                   }`}
//                 >
//                   Date <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="date"
//                   className={`h-[42px] w-full rounded-none border bg-white px-3 text-sm text-[#343a40] outline-none transition focus:ring-1 ${
//                     errors.date
//                       ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200'
//                       : formData.date
//                         ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-200'
//                         : 'border-[#d9dde3] focus:border-[#2759A2] focus:ring-[#2759A2]/20'
//                   }`}
//                   value={formData.date}
//                   onChange={handleChange}
//                   disabled
//                 />
//                 {errors.date && <span className="mt-1 block text-xs text-red-600">{errors.date}</span>}
//               </div>

//               <div className="min-w-0">
//                 <label
//                   className={`mb-1.5 block text-sm font-semibold ${
//                     errors.usageType
//                       ? 'text-red-600'
//                       : formData.usageType
//                         ? 'text-green-600'
//                         : 'text-[#343a40]'
//                   }`}
//                 >
//                   Usage Type <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   name="usageType"
//                   className={`h-[42px] w-full rounded-none border bg-white px-3 text-sm text-[#343a40] outline-none transition focus:ring-1 ${
//                     errors.usageType
//                       ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200'
//                       : formData.usageType
//                         ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-200'
//                         : 'border-[#d9dde3] focus:border-[#2759A2] focus:ring-[#2759A2]/20'
//                   }`}
//                   value={formData.usageType}
//                   onChange={handleChange}
//                 >
//                   <option value="">SELECT</option>
//                   <option value="Customer">Customer</option>
//                   <option value="Building">Building</option>
//                   <option value="Building to Building">Building to Building</option>
//                   <option value="Control Room">Control Room</option>
//                   <option value="Damage">Damage</option>
//                   <option value="Stolen from Center">Stolen from Center</option>
//                   <option value="Stolen from Field">Stolen from Field</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 {errors.usageType && <span className="mt-1 block text-xs text-red-600">{errors.usageType}</span>}
//               </div>

//               <div className="min-w-0">
//                 <label className="mb-1.5 block text-sm font-semibold text-[#343a40]" htmlFor="remark">
//                   Remark
//                 </label>
//                 <textarea
//                   name="remark"
//                   className="min-h-[90px] w-full resize-y rounded-none border border-[#d9dde3] bg-white px-3 py-2 text-sm text-[#343a40] outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]/20"
//                   placeholder="Remark"
//                   value={formData.remark}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div />
//             </div>

//             {renderConditionalFields()}

//             {/* Products Section */}
//             <div className="mt-7">
//               <div className="mb-3 flex flex-col gap-3 border-b border-[#e2e5e9] pb-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div className="flex items-center gap-3">
//                   <h2 className="text-[20px] font-normal text-[#343a40]">Select Products</h2>
//                   {errors.products && (
//                     <span className="text-xs font-medium text-red-600">{errors.products}</span>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <label className="text-sm font-semibold text-[#343a40]">Search:</label>
//                   <div className="relative">
//                     <Search
//                       size={16}
//                       className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     />
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="h-[40px] w-full min-w-[230px] rounded-md border border-[#d9dde3] bg-white pl-9 pr-3 text-sm text-[#343a40] outline-none transition placeholder:text-gray-400 focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/10"
//                       placeholder="Search products..."
//                     />
//                   </div>
//                 </div>
//               </div>

//               {loading ? (
//                 <div className="flex min-h-[180px] items-center justify-center rounded-md border border-[#e1e4e8] bg-white">
//                   <div className="flex flex-col items-center gap-3">
//                     <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#2759A2]" />
//                     <span className="text-sm text-gray-500">Loading products...</span>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="overflow-y-auto overflow-x-hidden rounded-md border border-[#e1e4e8] max-h-[470px]">
//                   <table className="w-full border-collapse text-sm">
//                     <thead className="sticky top-0 z-10 bg-white">
//                       <tr>
//                         <th className="border-b border-r border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
//                           Select
//                         </th>
//                         <th className="border-b border-r border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
//                           Product Name
//                         </th>
//                         <th className="border-b border-r border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
//                           Available Quantity
//                         </th>
//                         <th className="border-b border-r border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
//                           Type
//                         </th>
//                         <th className="border-b border-r border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
//                           Damage Qty
//                         </th>
//                         <th className="border-b border-r border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
//                           Old Replace
//                         </th>
//                         <th className="border-b border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
//                           Usage Qty
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {filteredProducts.length > 0 ? (
//                         filteredProducts.map((p, index) => {
//                           const isSelected = !!selectedRows[p._id];

//                           return (
//                             <tr
//                               key={p._id}
//                               className={`border-b border-[#e5e7eb] transition ${
//                                 isSelected
//                                   ? 'bg-[#d9ead3] hover:bg-[#d1e5cb]'
//                                   : index % 2 === 0
//                                     ? 'bg-[#f1f1f1] hover:bg-[#e9e9e9]'
//                                     : 'bg-white hover:bg-[#f7f7f7]'
//                               }`}
//                             >
//                               <td className="px-3 py-3 align-middle text-[#343a40]">
//                                 <input
//                                   type="checkbox"
//                                   checked={isSelected}
//                                   onChange={() => handleRowSelect(p._id, p.stock)}
//                                   className="h-5 w-5 cursor-pointer accent-[#2759A2]"
//                                 />
//                               </td>

//                               <td className="px-3 py-3 align-middle font-medium text-[#20252b]">
//                                 {p.productTitle}
//                               </td>

//                               <td className="px-3 py-3 align-middle text-[#20252b]">
//                                 {p.stock?.currentStock || 0}
//                               </td>

//                               <td className="px-3 py-3 align-middle text-[#343a40]" />
//                               <td className="px-3 py-3 align-middle text-[#343a40]" />
//                               <td className="px-3 py-3 align-middle text-[#343a40]" />

//                               <td className="px-3 py-3 align-middle text-[#343a40]">
//                                 {isSelected && (
//                                   <div className="flex items-center gap-2">
//                                     <input
//                                       type="number"
//                                       value={selectedRows[p._id]?.quantity || ''}
//                                       onChange={(e) => handleUsageQtyChange(p._id, e.target.value)}
//                                       placeholder="Usage Qty"
//                                       className="h-[36px] w-24 rounded-md border border-[#cfd4da] bg-white px-2 text-sm text-[#343a40] outline-none focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/10"
//                                       min="1"
//                                       max={p.stock?.currentStock || 0}
//                                     />

//                                     {selectedRows[p._id] && p.trackSerialNumber === "Yes" && (
//                                       <span
//                                         className="cursor-pointer text-lg font-semibold text-[#2759A2] transition hover:text-[#1f4b8c]"
//                                         onClick={() => handleOpenSerialModal(p)}
//                                         title="Add Serial Numbers"
//                                       >
//                                         ☰
//                                       </span>
//                                     )}
//                                   </div>
//                                 )}
//                               </td>
//                             </tr>
//                           );
//                         })
//                       ) : (
//                         <tr>
//                           <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
//                             No products found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>

//             {/* Submit */}
//             <div className="mt-5 flex justify-end border-t border-[#e1e4e8] pt-4">
//               <button
//                 type="submit"
//                 className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8c] focus:outline-none focus:ring-2 focus:ring-[#2759A2]/30"
//               >
//                 <Check size={17} />
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <CustomerModel
//         visible={showCustomerModal}
//         onClose={() => setShowCustomerModal(false)}
//         onCustomerAdded={handleCustomerAdded}
//       />

//       <BuildingFormModal
//         visible={isBuildingModalOpen}
//         onClose={() => setIsBuildingModalOpen(false)}
//         onBuildingAdded={handleBuildingAdded}
//       />

//       <ControlRoomModel
//         visible={isControlRoomModalOpen}
//         onClose={() => setIsControlRoomModalOpen(false)}
//         onControlRoomAdded={handleControlRoomAdded}
//       />

//       <UsageSerialNumbers
//         visible={serialModalVisible}
//         onClose={() => setSerialModalVisible(false)}
//         product={selectedProduct}
//         usageQty={parseInt(selectedRows[selectedProduct?._id]?.quantity) || 0}
//         onSerialNumbersUpdate={handleSerialNumbersUpdate}
//       />
//     </div>
//   );
// };

// export default AddStockUsage;






import React, { useState, useEffect, useRef } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Plus,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import BuildingFormModal from './BuildingModel';
import CustomerModel from './CustomerModel';
import ControlRoomModel from './ControlRoomModel';
import UsageSerialNumbers from './UsageSerialNumbers';
import Select from 'react-select';

const reactSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '42px',
    height: '42px',
    width: '100%',
    borderRadius: '0px',
    borderColor: state.isFocused
      ? '#2759A2'
      : state.selectProps.value
        ? '#22c55e'
        : '#d9dde3',
    backgroundColor: state.selectProps.value ? '#f0fdf4' : '#ffffff',
    boxShadow: state.isFocused ? '0 0 0 1px rgba(39, 89, 162, 0.18)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#2759A2' : '#b9c0c8',
    },
    cursor: 'pointer',
  }),

  valueContainer: (base) => ({
    ...base,
    padding: '0 12px',
    minWidth: 0,
  }),

  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: '#343a40',
    fontSize: '14px',
  }),

  placeholder: (base) => ({
    ...base,
    color: '#6c757d',
    fontSize: '14px',
  }),

  singleValue: (base) => ({
    ...base,
    color: '#343a40',
    fontSize: '14px',
    maxWidth: '100%',
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: '40px',
  }),

  clearIndicator: (base) => ({
    ...base,
    padding: '8px',
    color: '#6c757d',
    '&:hover': {
      color: '#dc3545',
    },
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    padding: '8px 10px',
    color: state.isFocused ? '#2759A2' : '#6c757d',
    '&:hover': {
      color: '#2759A2',
    },
  }),

  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: '#d9dde3',
    margin: '7px 0',
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 9999999,
  }),

  menu: (base) => ({
    ...base,
    marginTop: '4px',
    borderRadius: '4px',
    border: '1px solid #d9dde3',
    backgroundColor: '#ffffff',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    zIndex: 9999999,
  }),

  menuList: (base) => ({
    ...base,
    maxHeight: '260px',
    padding: '4px 0',
    overflowY: 'auto',
    overflowX: 'hidden',
  }),

  option: (base, state) => ({
    ...base,
    padding: '10px 12px',
    fontSize: '14px',
    color: '#343a40',
    backgroundColor: state.isSelected
      ? '#2f80ed'
      : state.isFocused
        ? '#e7f0ff'
        : '#ffffff',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#2759A2',
      color: '#ffffff',
    },
  }),

  noOptionsMessage: (base) => ({
    ...base,
    color: '#6c757d',
    fontSize: '14px',
    padding: '12px',
  }),
};

// The with-stock API returns availableQuantity at the product level and also
// inside stock.availableQuantity. Older UI code was reading stock.currentStock,
// which is not present in this API response and therefore always displayed 0.
const getAvailableQuantity = (product) => {
  const candidates = [
    product?.availableQuantity,
    product?.stock?.availableQuantity,
    product?.stock?.currentStock,
    product?.stock?.totalQuantity,
  ];

  for (const value of candidates) {
    if (value !== null && value !== undefined && value !== '') {
      const quantity = Number(value);
      if (Number.isFinite(quantity)) return quantity;
    }
  }

  return 0;
};

const AddStockUsage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    date: getTodayDate(),
    usageType: '',
    remark: '',
    customer: '',
    connectionType: '',
    packageAmount: '',
    packageDuration: '',
    onuCharges: '',
    installationCharges: '',
    reason: '',
    fromBuilding: '',
    toBuilding: '',
    controlRoom: '',
    stolenFrom: '',
    address: '',
    shiftingAmount: '',
    wireChangeAmount: '',
    toCenter:'',
    damageReason:''
  });

  const [errors, setErrors] = useState({});
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isControlRoomModalOpen, setIsControlRoomModalOpen] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState({});
  const [buildings, setBuildings] = useState([]);
  const [controlRooms, setControlRooms] = useState([]);
  const [centers, setCenters] = useState([]);
  const [currentBuildingType, setCurrentBuildingType] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Track selection order
  const [selectionOrder, setSelectionOrder] = useState([]);
  const selectionCounter = useRef(0);

  useEffect(() => {
    if (id) {
      fetchStockUsage(id);
    }
    fetchCustomers();
    fetchBuildings();
    fetchControlRooms();
    fetchProducts();
    fetchCenters();
  }, [id]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleOpenSerialModal = (product) => {
    const usageQuantity = parseInt(selectedRows[product._id]?.quantity) || 0;
    if (usageQuantity > 0) {
      setSelectedProduct(product);
      setSerialModalVisible(true);
    }
  };
   
  const handleSerialNumbersUpdate = (productId, serialsArray) => {
    setAssignedSerials(prev => ({
      ...prev,
      [productId]: serialsArray
    }));
  };
  
  const fetchStockUsage = async (usageId) => {
    try {
      const res = await axiosInstance.get(`/stockusage/${usageId}`);
      const data = res.data.data;
      const apiDate = data.date ? data.date.split('T')[0] : '';
      
      const fromBuilding = data.fromBuilding?._id || data.fromBuilding || '';
      const toBuilding = data.toBuilding?._id || data.toBuilding || '';
      const toCenter = data.toCenter?._id || data.toCenter || '';
      
      setFormData(prev => ({
        ...prev,
        ...data,
        date: apiDate,
        customer: data.customer?._id || data.customer || '',
        fromBuilding: fromBuilding,
        toBuilding: toBuilding,
        controlRoom: data.controlRoom?._id || data.controlRoom || '',
        toCenter: toCenter
      }));
    
      if (data.items && data.items.length > 0) {
        const existingSelectedRows = {};
        const existingAssignedSerials = {};
        const order = [];
        
        data.items.forEach((item, index) => {
          const productId = item.product?.productId || item.product;
          existingSelectedRows[productId] = {
            quantity: item.quantity.toString(),
            productRemark: item.productRemark || '',
            productInStock: Number(item.oldStock ?? item.product?.availableQuantity ?? item.product?.stock?.availableQuantity ?? 0)
          };
          
          if (item.serialNumbers && item.serialNumbers.length > 0) {
            existingAssignedSerials[productId] = item.serialNumbers;
          }
          
          order.push({ productId, order: index });
        });
        
        setSelectedRows(existingSelectedRows);
        setAssignedSerials(existingAssignedSerials);
        setSelectionOrder(order);
        selectionCounter.current = data.items.length;
      }
      
    } catch (error) {
      console.error('Error fetching stock usage:', error);
      showAlert('Failed to fetch stock usage data', 'danger');
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axiosInstance.get('/customers/all');
      setCustomers(res.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showAlert('Failed to fetch customers', 'danger');
    }
  };

  const fetchBuildings = async () => {
    try {
      const res = await axiosInstance.get('/buildings');
      setBuildings(res.data.data || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      showAlert('Failed to fetch buildings', 'danger');
    }
  };

  const fetchControlRooms = async () => {
    try {
      const res = await axiosInstance.get('/controlRooms');
      setControlRooms(res.data.data || []);
    } catch (error) {
      console.error('Error fetching control rooms:', error);
      showAlert('Failed to fetch control rooms', 'danger');
    }
  };
  
  // const fetchCenters = async () => {
  //   try {
  //     const res = await axiosInstance.get('/centers/main-warehouse?centerType=Outlet');
  //     setCenters(res.data.data || []);
  //   } catch (error) {
  //     console.error('Error fetching centers:', error);
  //     showAlert('Failed to fetch centers', 'danger');
  //   }
  // };
  
  const fetchCenters = async () => {
    try {
      const res = await axiosInstance.get('/centers/main-warehouse?centerType=Outlet');
      if (res.data.success) {
        const telecomWarehouses = res.data.data.filter(warehouse => 
          warehouse.centerName?.toLowerCase().includes('telecom') || 
          warehouse.centerType?.toLowerCase().includes('telecom') ||
          warehouse.category?.toLowerCase().includes('telecom')
        );
        setCenters(telecomWarehouses);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      showAlert('Failed to fetch centers', 'danger');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/stockpurchase/products/with-stock');
      if (res.data.success) {
        setProducts(Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data.data?.products) ? res.data.data.products : []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showAlert('Failed to fetch products', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelect = (productId, productStock) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        // Remove from selection order when unselecting
        setSelectionOrder(prevOrder => prevOrder.filter(item => item.productId !== productId));
        delete updated[productId];
      } else {
        // Add to selection order when selecting
        const newOrder = selectionCounter.current++;
        setSelectionOrder(prevOrder => [
          { productId, order: newOrder },
          ...prevOrder
        ]);
        updated[productId] = { quantity: '', productRemark: '', productInStock: Number(productStock) || 0 };
      }
      return updated;
    });
  };
  
  const handleUsageQtyChange = (productId, value) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: value
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    
    if (!formData.date) newErrors.date = 'Date is text-red-600';
    if (!formData.usageType) newErrors.usageType = 'Usage Type is text-red-600';
    if (Object.keys(selectedRows).length === 0) {
      newErrors.products = 'Please select at least one product';
    }
  
    Object.keys(selectedRows).forEach(productId => {
      const product = products.find(p => p._id === productId);
      const selectedRow = selectedRows[productId];
      
      if (!selectedRow.quantity || parseInt(selectedRow.quantity) <= 0) {
        newErrors.products = `Please enter valid usage quantity for ${product?.productTitle}`;
      }
      
      if (product?.trackSerialNumber === "Yes") {
        const usageQty = parseInt(selectedRow.quantity);
        const assignedSerialsForProduct = assignedSerials[productId] || [];
        
        if (assignedSerialsForProduct.length !== usageQty) {
          newErrors.products = `Please assign serial numbers for all ${usageQty} items of ${product?.productTitle}`;
        }
      }
    });
  
    if (formData.usageType === 'Customer') {
      if (!formData.customer) newErrors.customer = 'Customer is text-red-600';
      if (!formData.connectionType) newErrors.connectionType = 'Previous Connection Type is text-red-600';
      if (!formData.packageAmount) newErrors.packageAmount = 'Package Amount is text-red-600';
      if (!formData.packageDuration) newErrors.packageDuration = 'Package Duration is text-red-600';
      if (!formData.onuCharges) newErrors.onuCharges = 'ONU Charges is text-red-600';
      if (!formData.installationCharges) newErrors.installationCharges = 'Installation Charges is text-red-600';
      if (!formData.reason) newErrors.reason = 'Reason is text-red-600';
    }
    
    if (formData.usageType === 'Building' && !formData.fromBuilding) {
      newErrors.fromBuilding = 'From Building is text-red-600';
    }
    
    if (formData.usageType === 'Building to Building') {
      if (!formData.fromBuilding) newErrors.fromBuilding = 'From Building is text-red-600';
      if (!formData.toBuilding) newErrors.toBuilding = 'To Building is text-red-600';
    }
    
    if (formData.usageType === 'Control Room' && !formData.controlRoom) {
      newErrors.controlRoom = 'Control Room is text-red-600';
    }
    
    if (formData.usageType === 'Stolen from Field' && !formData.stolenFrom) {
      newErrors.stolenFrom = 'Stolen From is text-red-600';
    }
    
    if (formData.usageType === 'Other' && !formData.address) {
      newErrors.address = 'Address is text-red-600';
    }
  
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
  
    try {
        const items = Object.keys(selectedRows).map(productId => {
        const product = products.find(p => p._id === productId);
        const selectedRow = selectedRows[productId];
        const serialNumbers = assignedSerials[productId] || [];
        
        const item = {
          product: productId,
          quantity: parseInt(selectedRow.quantity),
          productRemark: selectedRow.productRemark || '',
        };
        if (serialNumbers.length > 0) {
          item.serialNumbers = serialNumbers;
        }
        
        return item;
      });
  
      const payload = {
        date: formData.date,
        usageType: formData.usageType,
        remark: formData.remark || '',
        customer: formData.customer || null,
        connectionType: formData.connectionType || null,
        packageAmount: formData.packageAmount ? parseFloat(formData.packageAmount) : 0,
        packageDuration: formData.packageDuration || null,
        onuCharges: formData.onuCharges ? parseFloat(formData.onuCharges) : 0,
        installationCharges: formData.installationCharges ? parseFloat(formData.installationCharges) : 0,
        reason: formData.reason || null,
        shiftingAmount: formData.shiftingAmount ? parseFloat(formData.shiftingAmount) : 0,
        wireChangeAmount: formData.wireChangeAmount ? parseFloat(formData.wireChangeAmount) : 0,
        fromBuilding: formData.fromBuilding || null,
        toBuilding: formData.toBuilding || null,
        fromControlRoom: formData.controlRoom || null,
        stolenFrom: formData.stolenFrom || null,
        address: formData.address || null,
        toCenter: formData.toCenter || null,
        damageReason: formData.damageReason || null,
        items: items
      };
  
      console.log('Submitting payload:', payload);
  
      if (id) {
        await axiosInstance.put(`/stockusage/${id}`, payload);
        showAlert('Stock usage updated successfully!', 'success');
        setTimeout(() => {
          navigate('/stock-usage');
        }, 1500);
      } else {
        await axiosInstance.post('/stockusage', payload);
        showAlert('Stock usage added successfully!', 'success');
        setTimeout(() => {
          navigate('/stock-usage');
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving stock usage:', error);
      
      let errorMessage = 'Failed to save stock usage';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        if (errorMessage.includes('CenterStock validation failed') && errorMessage.includes('Must be a valid Center (not Outlet)')) {
          errorMessage = 'Invalid center type. Please select a valid Center (not an Outlet) for stock usage.';
        }
      }
      
      showAlert(errorMessage, 'danger');
    }
  };

  const handleReset = () => {
    setFormData({
      date: getTodayDate(),
      usageType: '',
      remark: '',
      customer: '',
      connectionType: '',
      packageAmount: '',
      packageDuration: '',
      onuCharges: '',
      installationCharges: '',
      reason: '',
      fromBuilding: '',
      toBuilding: '',
      fromControlRoom: '',
      stolenFrom: '',
      address: '',
      shiftingAmount: '',
      wireChangeAmount: '',
      toCenter: '',
      damageReason: '' 
    });
    setSelectedRows({});
    setAssignedSerials({});
    setSelectionOrder([]);
    selectionCounter.current = 0;
    setErrors({});
    showAlert('Form has been reset', 'info');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddCustomer = () => {
    setShowCustomerModal(true);
  };

  const handleCustomerAdded = (newCustomer) => {
    setCustomers((prev) => [...prev, newCustomer]);

    setFormData((prev) => ({
      ...prev,
      customer: newCustomer._id,
    }));
    showAlert('Customer added successfully!', 'success');
  };

  const handleAddBuilding = () => {
    setIsBuildingModalOpen(true);
  };

  const handleBuildingAdded = (newBuilding) => {
    setBuildings((prev) => [...prev, newBuilding]);

    if (currentBuildingType === 'from') {
      setFormData((prev) => ({
        ...prev,
        fromBuilding: newBuilding._id || newBuilding.id,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        toBuilding: newBuilding._id || newBuilding.id
      }));
    }
    showAlert('Building added successfully!', 'success');
  };

  const handleAddControlRoom = () => {
    setIsControlRoomModalOpen(true);
  };

  const handleControlRoomAdded = (newControlRoom) => {
    setControlRooms((prev) => [...prev, newControlRoom]);

    setFormData((prev) => ({
      ...prev,
      controlRoom: newControlRoom._id || newControlRoom.id,
    }));
    showAlert('Control room added successfully!', 'success');
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

  const renderConditionalFields = () => {
    switch (formData.usageType) {
      case 'Customer':
        return (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.customer ? 'text-red-600' : formData.customer ? 'text-green-600' : ''}`}>
                  Customer <span className="text-red-600">*</span>
                </label>
                <div className="flex min-w-0 gap-2">
                <div className="min-w-0 flex-1">
                  <Select
                    id="customer"
                    name="customer"
                    placeholder="Search..."
                    value={
                      formData.customer
                        ? {
                            value: formData.customer,
                            label: customers.find((c) => c._id === formData.customer)
                              ? `${customers.find((c) => c._id === formData.customer).username} - ${customers.find((c) => c._id === formData.customer).mobile}`
                              : "",
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setFormData((prev) => ({
                        ...prev,
                        customer: selected ? selected.value : "",
                      }))
                    }
                    options={customers.map((customer) => ({
                      value: customer._id,
                      label: `${customer.username} - ${customer.mobile}`,
                    }))}
                    isClearable
                    classNamePrefix="react-select"
                    className={`w-full ${
                      errors.customer ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.customer ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
                    }`}
                  styles={reactSelectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  menuShouldScrollIntoView={false}
                  />
                  </div>
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    onClick={handleAddCustomer}
                  >
                    <Plus size={16} /> ADD
                  </button>
                </div>
                {errors.customer && <span className="text-xs text-red-600">{errors.customer}</span>}
              </div>
              <div className="min-w-0 space-y-1"></div>
              <div className="min-w-0 space-y-1"></div>
              <div className="min-w-0 space-y-1"></div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.connectionType ? 'text-red-600' : formData.connectionType ? 'text-green-600' : ''}`}>
                  Connection Type <span className="text-red-600">*</span>
                </label>
                <select
                  name="connectionType"
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.connectionType ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.connectionType ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                  value={formData.connectionType}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="NC">NC</option>
                  <option value="Convert">Convert</option>
                  <option value="Shifting">Shifting</option>
                  <option value="Repair">Repair</option>
                </select>
                {errors.connectionType && <span className="text-xs text-red-600">{errors.connectionType}</span>}
              </div>

              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.packageAmount ? 'text-red-600' : formData.packageAmount ? 'text-green-600' : ''}`}>
                  Package Amount <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="packageAmount"
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.packageAmount ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.packageAmount ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                  value={formData.packageAmount}
                  onChange={handleChange}
                  placeholder="Package Amount"
                />
                {errors.packageAmount && <span className="text-xs text-red-600">{errors.packageAmount}</span>}
              </div>

              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.packageDuration ? 'text-red-600' : formData.packageDuration ? 'text-green-600' : ''}`}>
                  Package Duration <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="packageDuration"
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.packageDuration ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.packageDuration ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                  value={formData.packageDuration}
                  onChange={handleChange}
                  placeholder="Package Duration"
                />
                {errors.packageDuration && <span className="text-xs text-red-600">{errors.packageDuration}</span>}
              </div>

              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.onuCharges ? 'text-red-600' : formData.onuCharges ? 'text-green-600' : ''}`}>
                  ONU Charges <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="onuCharges"
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.onuCharges ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.onuCharges ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                  value={formData.onuCharges}
                  onChange={handleChange}
                  placeholder="ONU Charges"
                />
                {errors.onuCharges && <span className="text-xs text-red-600">{errors.onuCharges}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.installationCharges ? 'text-red-600' : formData.installationCharges ? 'text-green-600' : ''}`}>
                  Installation Charges <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="installationCharges"
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.installationCharges ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.installationCharges ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                  value={formData.installationCharges}
                  onChange={handleChange}
                  placeholder="Installation Charges"
                />
                {errors.installationCharges && <span className="text-xs text-red-600">{errors.installationCharges}</span>}
              </div>

              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.reason ? 'text-red-600' : formData.reason ? 'text-green-600' : ''}`}>
                  Reason <span className="text-red-600">*</span>
                </label>
                <select
                  name="reason"
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.reason ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.reason ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                  value={formData.reason}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="NC">NC</option>
                  <option value="Convert">Convert</option>
                  <option value="Shifting">Shifting</option>
                  <option value="Repair">Repair</option>
                </select>
                {errors.reason && <span className="text-xs text-red-600">{errors.reason}</span>}
              </div>
              <div className="min-w-0 space-y-1"></div>
              <div className="min-w-0 space-y-1"></div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.shiftingAmount ? 'text-red-600' : formData.shiftingAmount ? 'text-green-600' : ''}`}>
                  Shifting Amount<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="shiftingAmount"
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.shiftingAmount ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.shiftingAmount ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                  value={formData.shiftingAmount}
                  onChange={handleChange}
                  placeholder='Shifting Amount'
                />
                {errors.shiftingAmount && <span className="text-xs text-red-600">{errors.shiftingAmount}</span>}
              </div>

              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.wireChangeAmount ? 'text-red-600' : formData.wireChangeAmount ? 'text-green-600' : ''}`}>
                  Wire Change Amount <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="wireChangeAmount"
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.wireChangeAmount ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.wireChangeAmount ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                  value={formData.wireChangeAmount}
                  onChange={handleChange}
                  placeholder='Wire Change Amount'
                />
                {errors.wireChangeAmount && <span className="text-xs text-red-600">{errors.wireChangeAmount}</span>}
              </div>
              <div className="min-w-0 space-y-1"></div>
              <div className="min-w-0 space-y-1"></div>
            </div>
          </>
        );

      case 'Building':
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0 space-y-1">
              <label className={`block text-sm font-medium text-gray-700 ${errors.fromBuilding ? 'text-red-600' : formData.fromBuilding ? 'text-green-600' : ''}`}>
                From Building <span className="text-red-600">*</span>
              </label>
              <div className="flex min-w-0 gap-2">
              <div className="min-w-0 flex-1">
                <Select
                  id="fromBuilding"
                  name="fromBuilding"
                  placeholder="Search..."
                  value={
                    formData.fromBuilding
                      ? {
                          value: formData.fromBuilding,
                          label: buildings.find((b) => b._id === formData.fromBuilding)
                            ?.buildingName || "",
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      fromBuilding: selected ? selected.value : "",
                    }))
                  }
                  options={buildings.map((building) => ({
                    value: building._id,
                    label: building.buildingName,
                  }))}
                  isClearable
                  classNamePrefix="react-select"
                  className={`w-full ${
                    errors.fromBuilding ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.fromBuilding ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
                  }`}
                styles={reactSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuShouldScrollIntoView={false}
                />
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}
                >
                  <Plus size={16} /> ADD
                </button>
              </div>
              {errors.fromBuilding && <span className="text-xs text-red-600">{errors.fromBuilding}</span>}
            </div>
            <div className="min-w-0 space-y-1"></div>
            <div className="min-w-0 space-y-1"></div>
            <div className="min-w-0 space-y-1"></div>
          </div>
        );

      case 'Building to Building':
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0 space-y-1">
              <label className={`block text-sm font-medium text-gray-700 ${errors.fromBuilding ? 'text-red-600' : formData.fromBuilding ? 'text-green-600' : ''}`}>
                From Building <span className="text-red-600">*</span>
              </label>
              <div className="flex min-w-0 gap-2">
              <div className="min-w-0 flex-1">
                <Select
                  id="fromBuilding"
                  name="fromBuilding"
                  placeholder="Search..."
                  value={
                    formData.fromBuilding
                      ? {
                          value: formData.fromBuilding,
                          label: buildings.find((b) => b._id === formData.fromBuilding)
                            ?.buildingName || "",
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      fromBuilding: selected ? selected.value : "",
                    }))
                  }
                  options={buildings.map((building) => ({
                    value: building._id,
                    label: building.buildingName,
                  }))}
                  isClearable
                  classNamePrefix="react-select"
                  className={`w-full ${
                    errors.fromBuilding ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.fromBuilding ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
                  }`}
                styles={reactSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuShouldScrollIntoView={false}
                />
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}
                >
                  <Plus size={16} /> ADD
                </button>
              </div>
              {errors.fromBuilding && <span className="text-xs text-red-600">{errors.fromBuilding}</span>}
            </div>

            <div className="min-w-0 space-y-1">
              <label className={`block text-sm font-medium text-gray-700 ${errors.toBuilding ? 'text-red-600' : formData.toBuilding ? 'text-green-600' : ''}`}>
                To Building <span className="text-red-600">*</span>
              </label>
              <div className="flex min-w-0 gap-2">
              <div className="min-w-0 flex-1">
                <Select
                  id="toBuilding"
                  name="toBuilding"
                  placeholder="Search..."
                  value={
                    formData.toBuilding
                      ? {
                          value: formData.toBuilding,
                          label: buildings.find((b) => b._id === formData.toBuilding)
                            ?.buildingName || "",
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      toBuilding: selected ? selected.value : "",
                    }))
                  }
                  options={buildings.map((building) => ({
                    value: building._id,
                    label: building.buildingName,
                  }))}
                  isClearable
                  classNamePrefix="react-select"
                  className={`w-full ${
                    errors.toBuilding ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.toBuilding ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
                  }`}
                styles={reactSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuShouldScrollIntoView={false}
                />
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  onClick={() => { setCurrentBuildingType('to'); handleAddBuilding(); }}
                >
                  <Plus size={16} /> ADD
                </button>
              </div>
              {errors.toBuilding && <span className="text-xs text-red-600">{errors.toBuilding}</span>}
            </div>
            <div className="min-w-0 space-y-1"></div>
            <div className="min-w-0 space-y-1"></div>
          </div>
        );

      case 'Control Room':
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0 space-y-1">
              <label className={`block text-sm font-medium text-gray-700 ${errors.controlRoom ? 'text-red-600' : formData.controlRoom ? 'text-green-600' : ''}`}>
                Control Room <span className="text-red-600">*</span>
              </label>
              <div className="flex min-w-0 gap-2">
              <div className="min-w-0 flex-1">
                <Select
                  id="controlRoom"
                  name="controlRoom"
                  placeholder="Search..."
                  value={
                    formData.controlRoom
                      ? {
                          value: formData.controlRoom,
                          label: controlRooms.find((cr) => cr._id === formData.controlRoom)
                            ?.buildingName || "",
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      controlRoom: selected ? selected.value : "",
                    }))
                  }
                  options={controlRooms.map((controlRoom) => ({
                    value: controlRoom._id,
                    label: controlRoom.buildingName,
                  }))}
                  isClearable
                  classNamePrefix="react-select"
                  className={`w-full ${
                    errors.controlRoom ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.controlRoom ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
                  }`}
                styles={reactSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuShouldScrollIntoView={false}
                />
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  onClick={handleAddControlRoom}
                >
                  <Plus size={16} /> ADD
                </button>
              </div>
              {errors.controlRoom && <span className="text-xs text-red-600">{errors.controlRoom}</span>}
            </div>
            <div className="min-w-0 space-y-1"></div>
            <div className="min-w-0 space-y-1"></div>
            <div className="min-w-0 space-y-1"></div>
          </div>
        );
      

        case 'Damage':
          return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.toCenter ? 'text-red-600' : formData.toCenter ? 'text-green-600' : ''}`}>
                  To Center <span className="text-red-600">*</span>
                </label>
                <div className="flex min-w-0 gap-2">
                  <div className="min-w-0 flex-1">
                    <Select
                      id="toCenter"
                      name="toCenter"
                      placeholder="Select center..."
                      value={
                        formData.toCenter
                          ? {
                              value: formData.toCenter,
                              label: centers.find((c) => c._id === formData.toCenter)
                                ?.centerName || "",
                            }
                          : null
                      }
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          toCenter: selected ? selected.value : "",
                        }))
                      }
                      options={centers.map((center) => ({
                        value: center._id,
                        label: center.centerName,
                      }))}
                      isClearable
                      classNamePrefix="react-select"
                      className={`w-full ${
                        errors.toCenter ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.toCenter ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
                      }`}
                    styles={reactSelectStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    menuShouldScrollIntoView={false}
                    />
                  </div>
                </div>
                {errors.toCenter && <span className="text-xs text-red-600">{errors.toCenter}</span>}
              </div>
              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.damageReason ? 'text-red-600' : formData.damageReason ? 'text-green-600' : ''}`}>
                 Damage Reason <span className="text-red-600">*</span>
                </label>
                <select
                  name="damageReason"
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.damageReason ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.reason ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                  value={formData.damageReason}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="Physical Damage">Physical Damage</option>
                  <option value="Water Damage">Water Damage</option>
                  <option value="Power Surge">Power Surge</option>
                  <option value="Manufacturing Defect">Manufacturing Defect</option>
                  <option value="Other">Other</option>
                </select>
                {errors.damageReason && <span className="text-xs text-red-600">{errors.damageReason}</span>}
              </div>
              <div className="min-w-0 space-y-1"></div>
              <div className="min-w-0 space-y-1"></div>
            </div>
          );
  
      case 'Stolen from Field':
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0 space-y-1">
              <label className={`block text-sm font-medium text-gray-700 ${errors.stolenFrom ? 'text-red-600' : formData.stolenFrom ? 'text-green-600' : ''}`}>
                Stolen From <span className="text-red-600">*</span>
              </label>
              <select
                type="text"
                name="stolenFrom"
                className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.stolenFrom ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.stolenFrom ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                value={formData.stolenFrom}
                onChange={handleChange}
                placeholder="Stolen From"
              >
                <option value="">SELECT</option>
                <option value="Building">Building</option>
                <option value="Customer">Customer</option>
                <option value="Control Room">Control Room</option>
              </select>
              {errors.stolenFrom && <span className="text-xs text-red-600">{errors.stolenFrom}</span>}
            </div>
            
            {formData.stolenFrom === 'Building' && (
              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.fromBuilding ? 'text-red-600' : formData.fromBuilding ? 'text-green-600' : ''}`}>
                  From Building <span className="text-red-600">*</span>
                </label>
                <div className="flex min-w-0 gap-2">
                <div className="min-w-0 flex-1">
                  <Select
                    id="fromBuilding"
                    name="fromBuilding"
                    placeholder="Search..."
                    value={
                      formData.fromBuilding
                        ? {
                            value: formData.fromBuilding,
                            label: buildings.find((b) => b._id === formData.fromBuilding)
                              ?.buildingName || "",
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setFormData((prev) => ({
                        ...prev,
                        fromBuilding: selected ? selected.value : "",
                      }))
                    }
                    options={buildings.map((building) => ({
                      value: building._id,
                      label: building.buildingName,
                    }))}
                    isClearable
                    classNamePrefix="react-select"
                    className={`w-full ${
                      errors.fromBuilding ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.fromBuilding ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
                    }`}
                  styles={reactSelectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  menuShouldScrollIntoView={false}
                  />
                  </div>
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}
                  >
                    <Plus size={16} /> ADD
                  </button>
                </div>
                {errors.fromBuilding && <span className="text-xs text-red-600">{errors.fromBuilding}</span>}
              </div>
            )}
            
            {formData.stolenFrom === 'Customer' && (
              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.customer ? 'text-red-600' : formData.customer ? 'text-green-600' : ''}`}>
                  Customer <span className="text-red-600">*</span>
                </label>
                <div className="flex min-w-0 gap-2">
                <div className="min-w-0 flex-1">
                  <Select
                    id="customer"
                    name="customer"
                    placeholder="Search..."
                    value={
                      formData.customer
                        ? {
                            value: formData.customer,
                            label: customers.find((c) => c._id === formData.customer)
                              ? `${customers.find((c) => c._id === formData.customer).username} - ${customers.find((c) => c._id === formData.customer).mobile}`
                              : "",
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setFormData((prev) => ({
                        ...prev,
                        customer: selected ? selected.value : "",
                      }))
                    }
                    options={customers.map((customer) => ({
                      value: customer._id,
                      label: `${customer.username} - ${customer.mobile}`,
                    }))}
                    isClearable
                    classNamePrefix="react-select"
                    className={`w-full ${
                      errors.customer ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.customer ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
                    }`}
                  styles={reactSelectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  menuShouldScrollIntoView={false}
                  />
                  </div>
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    onClick={handleAddCustomer}
                  >
                    <Plus size={16} /> ADD
                  </button>
                </div>
                {errors.customer && <span className="text-xs text-red-600">{errors.customer}</span>}
              </div>
            )}

            {formData.stolenFrom === 'Control Room' && (
              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.controlRoom ? 'text-red-600' : formData.controlRoom ? 'text-green-600' : ''}`}>
                  Control Room <span className="text-red-600">*</span>
                </label>
                <div className="flex min-w-0 gap-2">
                <div className="min-w-0 flex-1">
                  <Select
                    id="controlRoom"
                    name="controlRoom"
                    placeholder="Search..."
                    value={
                      formData.controlRoom
                        ? {
                            value: formData.controlRoom,
                            label: controlRooms.find((cr) => cr._id === formData.controlRoom)
                              ?.buildingName || "",
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setFormData((prev) => ({
                        ...prev,
                        controlRoom: selected ? selected.value : "",
                      }))
                    }
                    options={controlRooms.map((controlRoom) => ({
                      value: controlRoom._id,
                      label: controlRoom.buildingName,
                    }))}
                    isClearable
                    classNamePrefix="react-select"
                    className={`w-full ${
                      errors.controlRoom ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : formData.controlRoom ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : ""
                    }`}
                  styles={reactSelectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  menuShouldScrollIntoView={false}
                  />
                  </div>
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    onClick={handleAddControlRoom}
                  >
                    <Plus size={16} /> ADD
                  </button>
                </div>
                {errors.controlRoom && <span className="text-xs text-red-600">{errors.controlRoom}</span>}
              </div>
            )}
            <div className="min-w-0 space-y-1"></div>
            <div className="min-w-0 space-y-1"></div>
          </div>
        );

      case 'Other':
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0 space-y-1">
              <label className={`block text-sm font-medium text-gray-700 ${errors.address ? 'text-red-600' : formData.address ? 'text-green-600' : ''}`}>
                Address <span className="text-red-600">*</span>
              </label>
              <textarea
                type="text"
                name="address"
                // className="min-h-[90px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                className={`min-h-[90px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                  ${errors.address ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.address ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
               {errors.address && <span className="text-xs text-red-600">{errors.address}</span>}
            </div>
            <div className="min-w-0 space-y-1"></div>
            <div className="min-w-0 space-y-1"></div>
            <div className="min-w-0 space-y-1"></div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
        <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

      {/* Page Header */}
      <div className="mb-2 flex items-center gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-2 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1f4b8c] focus:outline-none focus:ring-2 focus:ring-[#2759A2]/30"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        

        <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
          {id ? 'Edit' : 'Add'} Stock Usage
        </h1>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden border border-[#e1e4e8] bg-white shadow-sm">
        {/* Blue top border */}
        <div className="h-1 w-full bg-[#2759A2]" />

        {/* Card Toolbar */}
        <div className="flex min-h-[64px] items-center justify-end border-b border-[#e5e7eb] bg-white px-5 py-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1f4b8c] focus:outline-none focus:ring-2 focus:ring-[#2759A2]/30"
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        <div className="px-5 py-5">
          {alert.show && (
            <div
              className={`mb-5 flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm ${
                alert.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : alert.type === 'info'
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-red-200 bg-red-50 text-red-700'
              }`}
              role="alert"
            >
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />
                <span>{alert.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setAlert({ show: false, message: '', type: '' })}
                className="rounded p-1 transition hover:bg-black/5"
                aria-label="Close alert"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="min-w-0">
                <label
                  className={`mb-1.5 block text-sm font-semibold ${
                    errors.date
                      ? 'text-red-600'
                      : formData.date
                        ? 'text-green-600'
                        : 'text-[#343a40]'
                  }`}
                >
                  Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  className={`h-[42px] w-full rounded-none border bg-white px-3 text-sm text-[#343a40] outline-none transition focus:ring-1 ${
                    errors.date
                      ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200'
                      : formData.date
                        ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-200'
                        : 'border-[#d9dde3] focus:border-[#2759A2] focus:ring-[#2759A2]/20'
                  }`}
                  value={formData.date}
                  onChange={handleChange}
                  disabled
                />
                {errors.date && <span className="mt-1 block text-xs text-red-600">{errors.date}</span>}
              </div>

              <div className="min-w-0">
                <label
                  className={`mb-1.5 block text-sm font-semibold ${
                    errors.usageType
                      ? 'text-red-600'
                      : formData.usageType
                        ? 'text-green-600'
                        : 'text-[#343a40]'
                  }`}
                >
                  Usage Type <span className="text-red-600">*</span>
                </label>
                <select
                  name="usageType"
                  className={`h-[42px] w-full rounded-none border bg-white px-3 text-sm text-[#343a40] outline-none transition focus:ring-1 ${
                    errors.usageType
                      ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200'
                      : formData.usageType
                        ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-200'
                        : 'border-[#d9dde3] focus:border-[#2759A2] focus:ring-[#2759A2]/20'
                  }`}
                  value={formData.usageType}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="Customer">Customer</option>
                  <option value="Building">Building</option>
                  <option value="Building to Building">Building to Building</option>
                  <option value="Control Room">Control Room</option>
                  <option value="Damage">Damage</option>
                  <option value="Stolen from Center">Stolen from Center</option>
                  <option value="Stolen from Field">Stolen from Field</option>
                  <option value="Other">Other</option>
                </select>
                {errors.usageType && <span className="mt-1 block text-xs text-red-600">{errors.usageType}</span>}
              </div>

              <div className="min-w-0">
                <label className="mb-1.5 block text-sm font-semibold text-[#343a40]" htmlFor="remark">
                  Remark
                </label>
                <textarea
                  name="remark"
                  className="min-h-[90px] w-full resize-y rounded-none border border-[#d9dde3] bg-white px-3 py-2 text-sm text-[#343a40] outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]/20"
                  placeholder="Remark"
                  value={formData.remark}
                  onChange={handleChange}
                />
              </div>

              <div />
            </div>

            {renderConditionalFields()}

            {/* Products Section */}
            <div className="mt-7">
              <div className="mb-3 flex flex-col gap-3 border-b border-[#e2e5e9] pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-[20px] font-normal text-[#343a40]">Select Products</h2>
                  {errors.products && (
                    <span className="text-xs font-medium text-red-600">{errors.products}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-[#343a40]">Search:</label>
                  <div className="relative">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-[40px] w-full min-w-[230px] rounded-md border border-[#d9dde3] bg-white pl-9 pr-3 text-sm text-[#343a40] outline-none transition placeholder:text-gray-400 focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/10"
                      placeholder="Search products..."
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex min-h-[180px] items-center justify-center rounded-md border border-[#e1e4e8] bg-white">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#2759A2]" />
                    <span className="text-sm text-gray-500">Loading products...</span>
                  </div>
                </div>
              ) : (
                <div className="overflow-y-auto overflow-x-hidden rounded-md border border-[#e1e4e8] max-h-[470px]">
                  <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 z-10 bg-white">
                      <tr>
                        <th className="border-b border-r border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
                          Select
                        </th>
                        <th className="border-b border-r border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
                          Product Name
                        </th>
                        <th className="border-b border-r border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
                          Available Quantity
                        </th>
                        <th className="border-b border-r border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
                          Type
                        </th>
                        <th className="border-b border-r border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
                          Damage Qty
                        </th>
                        <th className="border-b border-r border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
                          Old Replace
                        </th>
                        <th className="border-b border-[#e1e4e8] bg-white px-3 py-3 text-left font-bold text-[#20252b]">
                          Usage Qty
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((p, index) => {
                          const isSelected = !!selectedRows[p._id];

                          return (
                            <tr
                              key={p._id}
                              className={`border-b border-[#e5e7eb] transition ${
                                isSelected
                                  ? 'bg-[#d9ead3] hover:bg-[#d1e5cb]'
                                  : index % 2 === 0
                                    ? 'bg-[#f1f1f1] hover:bg-[#e9e9e9]'
                                    : 'bg-white hover:bg-[#f7f7f7]'
                              }`}
                            >
                              <td className="px-3 py-3 align-middle text-[#343a40]">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleRowSelect(p._id, getAvailableQuantity(p))}
                                  className="h-5 w-5 cursor-pointer accent-[#2759A2]"
                                />
                              </td>

                              <td className="px-3 py-3 align-middle font-medium text-[#20252b]">
                                {p.productTitle}
                              </td>

                              <td className="px-3 py-3 align-middle text-[#20252b]">
                                {getAvailableQuantity(p)}
                              </td>

                              <td className="px-3 py-3 align-middle text-[#343a40]" />
                              <td className="px-3 py-3 align-middle text-[#343a40]" />
                              <td className="px-3 py-3 align-middle text-[#343a40]" />

                              <td className="px-3 py-3 align-middle text-[#343a40]">
                                {isSelected && (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      value={selectedRows[p._id]?.quantity || ''}
                                      onChange={(e) => handleUsageQtyChange(p._id, e.target.value)}
                                      placeholder="Usage Qty"
                                      className="h-[36px] w-24 rounded-md border border-[#cfd4da] bg-white px-2 text-sm text-[#343a40] outline-none focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/10"
                                      min="1"
                                      max={getAvailableQuantity(p)}
                                    />

                                    {selectedRows[p._id] && p.trackSerialNumber === "Yes" && (
                                      <span
                                        className="cursor-pointer text-lg font-semibold text-[#2759A2] transition hover:text-[#1f4b8c]"
                                        onClick={() => handleOpenSerialModal(p)}
                                        title="Add Serial Numbers"
                                      >
                                        ☰
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                            No products found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="mt-5 flex justify-end border-t border-[#e1e4e8] pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-[#2759A2] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8c] focus:outline-none focus:ring-2 focus:ring-[#2759A2]/30"
              >
                <Check size={17} />
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <CustomerModel
        visible={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onCustomerAdded={handleCustomerAdded}
      />

      <BuildingFormModal
        visible={isBuildingModalOpen}
        onClose={() => setIsBuildingModalOpen(false)}
        onBuildingAdded={handleBuildingAdded}
      />

      <ControlRoomModel
        visible={isControlRoomModalOpen}
        onClose={() => setIsControlRoomModalOpen(false)}
        onControlRoomAdded={handleControlRoomAdded}
      />

      <UsageSerialNumbers
        visible={serialModalVisible}
        onClose={() => setSerialModalVisible(false)}
        product={selectedProduct}
        usageQty={parseInt(selectedRows[selectedProduct?._id]?.quantity) || 0}
        onSerialNumbersUpdate={handleSerialNumbersUpdate}
      />
    </div>
  );
};

export default AddStockUsage;