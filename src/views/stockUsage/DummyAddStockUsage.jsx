

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import BuildingFormModal from './BuildingModel';
import CustomerModel from './CustomerModel';
import ControlRoomModel from './ControlRoomModel';
import UsageSerialNumbers from './UsageSerialNumbers';

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
    wireChangeAmount: ''
  });

  const [errors, setErrors] = useState({});
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isControlRoomModalOpen, setIsControlRoomModalOpen] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState({});
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [buildingSearchTerm, setBuildingSearchTerm] = useState('');
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [currentBuildingType, setCurrentBuildingType] = useState(''); 
  const [controlRooms, setControlRooms] = useState([]);
  const [filteredControlRooms, setFilteredControlRooms] = useState([]);
  const [controlRoomSearchTerm, setControlRoomSearchTerm] = useState('');
  const [showControlRoomDropdown, setShowControlRoomDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const [warehouses, setWarehouses] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [warehouseSearchTerm, setWarehouseSearchTerm] = useState('');
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  useEffect(() => {
    if (id) {
      fetchStockUsage(id);
    }
    fetchCustomers();
    fetchBuildings();
    fetchControlRooms();
    fetchProducts();
    fetchWarehouses(); 
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
      
      setFormData(prev => ({
        ...prev,
        ...data,
        date: apiDate,
        customer: data.customer?._id || data.customer || '',
        fromBuilding: data.fromBuilding?._id || data.fromBuilding || '',
        toBuilding: data.toBuilding?._id || data.toBuilding || '',
        controlRoom: data.controlRoom?._id || data.controlRoom || ''
      }));
    
      if (data.customer) {
        setCustomerSearchTerm(data.customer.name || data.customer.username || '');
      }
      
      if (data.fromBuilding) {
        setBuildingSearchTerm(data.fromBuilding.buildingName || '');
      }
      
      if (data.controlRoom) {
        setControlRoomSearchTerm(data.controlRoom.buildingName || '');
      }
  
      if (data.items && data.items.length > 0) {
        const existingSelectedRows = {};
        const existingAssignedSerials = {};
        
        data.items.forEach(item => {
          const productId = item.product?.productId || item.product;
          existingSelectedRows[productId] = {
            quantity: item.quantity.toString(),
            productRemark: item.productRemark || '',
            productInStock: item.oldStock || 0
          };
          
          if (item.serialNumbers && item.serialNumbers.length > 0) {
            existingAssignedSerials[productId] = item.serialNumbers;
          }
        });
        
        setSelectedRows(existingSelectedRows);
        setAssignedSerials(existingAssignedSerials);
      }
      
    } catch (error) {
      console.error('Error fetching stock usage:', error);
      showAlert('Failed to fetch stock usage data', 'danger');
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axiosInstance.get('/customers');
      setCustomers(res.data.data || []);
      setFilteredCustomers(res.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showAlert('Failed to fetch customers', 'danger');
    }
  };

  const fetchBuildings = async () => {
    try {
      const res = await axiosInstance.get('/buildings');
      setBuildings(res.data.data || []);
      setFilteredBuildings(res.data.data || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      showAlert('Failed to fetch buildings', 'danger');
    }
  };

  const fetchControlRooms = async () => {
    try {
      const res = await axiosInstance.get('/controlRooms');
      setControlRooms(res.data.data || []);
      setFilteredControlRooms(res.data.data || []);
    } catch (error) {
      console.error('Error fetching control rooms:', error);
      showAlert('Failed to fetch control rooms', 'danger');
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
      showAlert('Failed to fetch products', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await axiosInstance.get('/centers?centerType=Outlet');
      setWarehouses(res.data.data || []);
      setFilteredWarehouses(res.data.data || []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      showAlert('Failed to fetch warehouses', 'danger');
    }
  };


  const handleRowSelect = (productId, productStock) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        delete updated[productId];
      } else {
        updated[productId] = { quantity: '', productRemark: '', productInStock: productStock || 0 };
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
  
  useEffect(() => {
    if (customerSearchTerm) {
      const filtered = customers.filter(customer =>
        customer.name?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.username?.toLowerCase().includes(customerSearchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customerSearchTerm, customers]);

  useEffect(() => {
    if (buildingSearchTerm) {
      const filtered = buildings.filter(building =>
        building.buildingName?.toLowerCase().includes(buildingSearchTerm.toLowerCase()) ||
        building.code?.toLowerCase().includes(buildingSearchTerm.toLowerCase())
      );
      setFilteredBuildings(filtered);
    } else {
      setFilteredBuildings(buildings);
    }
  }, [buildingSearchTerm, buildings]);

  useEffect(() => {
    if (controlRoomSearchTerm) {
      const filtered = controlRooms.filter(controlRoom =>
        controlRoom.buildingName?.toLowerCase().includes(controlRoomSearchTerm.toLowerCase()) ||
        controlRoom.code?.toLowerCase().includes(controlRoomSearchTerm.toLowerCase())
      );
      setFilteredControlRooms(filtered);
    } else {
      setFilteredControlRooms(controlRooms);
    }
  }, [controlRoomSearchTerm, controlRooms]);


  useEffect(() => {
    if (warehouseSearchTerm) {
      const filtered = warehouses.filter(warehouse =>
        warehouse.centerName?.toLowerCase().includes(warehouseSearchTerm.toLowerCase())
      );
      setFilteredWarehouses(filtered);
    } else {
      setFilteredWarehouses(warehouses);
    }
  }, [warehouseSearchTerm, warehouses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCustomerSearchChange = (e) => {
    const value = e.target.value;
    setCustomerSearchTerm(value);
    setFormData(prev => ({
      ...prev,
      customer: value,
    }));
  };

  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      customer:customer._id,
    }));
    setCustomerSearchTerm(customer.name || customer.username);
    setShowCustomerDropdown(false);
  };

  const handleCustomerInputFocus = () => {
    setShowCustomerDropdown(true);
  };

  const handleCustomerInputBlur = () => {
    setTimeout(() => {
      setShowCustomerDropdown(false);
    }, 200);
  };

  const handleBuildingSearchChange = (e, type = 'from') => {
    const value = e.target.value;
    setBuildingSearchTerm(value);
    setCurrentBuildingType(type);
    
    if (type === 'from') {
      setFormData(prev => ({
        ...prev,
        fromBuilding: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        toBuilding: value,
  
      }));
    }
  };

  const handleBuildingSelect = (building, type = 'from') => {
    if (type === 'from') {
      setFormData(prev => ({
        ...prev,
        fromBuilding: building._id || building.id,
      }));
      setBuildingSearchTerm(building.buildingName);
    } else {
      setFormData(prev => ({
        ...prev,
        toBuilding: building._id || building.id,
      }));
    }
    setShowBuildingDropdown(false);
  };

  const handleBuildingInputFocus = (type = 'from') => {
    setCurrentBuildingType(type);
    setShowBuildingDropdown(true);
  };

  const handleBuildingInputBlur = () => {
    setTimeout(() => {
      setShowBuildingDropdown(false);
    }, 200);
  };

  const handleControlRoomSearchChange = (e) => {
    const value = e.target.value;
    setControlRoomSearchTerm(value);
    setFormData(prev => ({
      ...prev,
      controlRoom: value,
    }));
  };

  const handleControlRoomSelect = (controlRoom) => {
    setFormData(prev => ({
      ...prev,
      controlRoom: controlRoom._id || controlRoom.id,
    }));
    setControlRoomSearchTerm(controlRoom.buildingName);
    setShowControlRoomDropdown(false);
  };

  const handleControlRoomInputFocus = () => {
    setShowControlRoomDropdown(true);
  };

  const handleControlRoomInputBlur = () => {
    setTimeout(() => {
      setShowControlRoomDropdown(false);
    }, 200);
  };


  const handleWarehouseSearchChange = (e) => {
    const value = e.target.value;
    setWarehouseSearchTerm(value);
    setFormData(prev => ({
      ...prev,
      warehouse: value,
    }));
  };
  
  const handleWarehouseSelect = (warehouse) => {
    setFormData(prev => ({
      ...prev,
      warehouse: warehouse._id || warehouse.id,
    }));
    setWarehouseSearchTerm(warehouse.centerName || '');
    setShowWarehouseDropdown(false);
  };
  
  const handleWarehouseInputFocus = () => {
    setShowWarehouseDropdown(true);
  };
  
  const handleWarehouseInputBlur = () => {
    setTimeout(() => {
      setShowWarehouseDropdown(false);
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.usageType) newErrors.usageType = 'Usage Type is required';
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
      if (!formData.customer) newErrors.customer = 'Customer is required';
      if (!formData.connectionType) newErrors.connectionType = 'Previous Connection Type is required';
      if (!formData.packageAmount) newErrors.packageAmount = 'Package Amount is required';
      if (!formData.packageDuration) newErrors.packageDuration = 'Package Duration is required';
      if (!formData.onuCharges) newErrors.onuCharges = 'ONU Charges is required';
      if (!formData.installationCharges) newErrors.installationCharges = 'Installation Charges is required';
      if (!formData.reason) newErrors.reason = 'Reason is required';
    }
    
    if (formData.usageType === 'Building' && !formData.fromBuilding) {
      newErrors.fromBuilding = 'From Building is required';
    }
    
    if (formData.usageType === 'Building to Building') {
      if (!formData.fromBuilding) newErrors.fromBuilding = 'From Building is required';
      if (!formData.toBuilding) newErrors.toBuilding = 'To Building is required';
    }
    
    if (formData.usageType === 'Control Room' && !formData.controlRoom) {
      newErrors.controlRoom = 'Control Room is required';
    }
    
    if (formData.usageType === 'Stolen from Field' && !formData.stolenFrom) {
      newErrors.stolenFrom = 'Stolen From is required';
    }
    
    if (formData.usageType === 'Damage' && !formData.warehouse) {
      newErrors.warehouse = 'Warehouse is required';
    }
    if (formData.usageType === 'Other' && !formData.address) {
      newErrors.address = 'Address is required';
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
        warehouse: formData.warehouse || null, 
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
      wireChangeAmount: ''
    });
    setCustomerSearchTerm('');
    setBuildingSearchTerm('');
    setControlRoomSearchTerm('');
    setWarehouseSearchTerm(''); 
    setSelectedRows({});
    setAssignedSerials({});
    setErrors({});
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddCustomer = () => {
    setShowCustomerModal(true);
  };

  const handleCustomerAdded = (newCustomer) => {
    setCustomers((prev) => [...prev, newCustomer]);
    setFilteredCustomers((prev) => [...prev, newCustomer]);

    setFormData((prev) => ({
      ...prev,
      customer: newCustomer._id,
    }));
    setCustomerSearchTerm(newCustomer.name || newCustomer.username);
    showAlert('Customer added successfully!', 'success');
  };

  const handleAddBuilding = () => {
    setIsBuildingModalOpen(true);
  };

  const handleBuildingAdded = (newBuilding) => {
    setBuildings((prev) => [...prev, newBuilding]);
    setFilteredBuildings((prev) => [...prev, newBuilding]);

    if (currentBuildingType === 'from') {
      setFormData((prev) => ({
        ...prev,
        fromBuilding: newBuilding._id || newBuilding.id,
      }));
      setBuildingSearchTerm(newBuilding.name);
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
    setFilteredControlRooms((prev) => [...prev, newControlRoom]);

    setFormData((prev) => ({
      ...prev,
      controlRoom: newControlRoom._id || newControlRoom.id,
    }));
    setControlRoomSearchTerm(newControlRoom.buildingName);
    showAlert('Control room added successfully!', 'success');
  };

  const filteredProducts = products.filter((p) =>
    p.productTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderConditionalFields = () => {
    switch (formData.usageType) {
      case 'Customer':
        return (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="min-w-0 space-y-1 relative">
                <label className={`block text-sm font-medium text-gray-700 ${errors.customer ? 'text-red-600' : formData.customer ? 'text-green-600' : ''}`}>
                  Customer <span className="text-red-600">*</span>
                </label>
                <div className="flex min-w-0 gap-2">
                  <div className="relative min-w-0 flex-1">
                    <input
                      type="text"
                      name="customer"
                      className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.customer ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.customer ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                      value={customerSearchTerm}
                      onChange={handleCustomerSearchChange}
                      onFocus={handleCustomerInputFocus}
                      onBlur={handleCustomerInputBlur}
                      placeholder="Search User"
                    />
                    <Search size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <button type="button" className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700" onClick={handleAddCustomer}>
                    <Plus size={15} /> ADD
                  </button>
                </div>
                {showCustomerDropdown && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                      <span>Select Customer</span>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <div
                            key={customer._id}
                            className="cursor-pointer border-b border-gray-100 px-3 py-2 transition hover:bg-blue-50"
                            onClick={() => handleCustomerSelect(customer)}
                          >
                            <div className="text-sm text-gray-700">{customer.username}-{customer.mobile}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-3 text-sm text-gray-500">No customers found</div>
                      )}
                    </div>
                  </div>
                )}
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
            <div className="min-w-0 space-y-1 relative">
              <label className={`block text-sm font-medium text-gray-700 ${errors.fromBuilding ? 'text-red-600' : formData.fromBuilding ? 'text-green-600' : ''}`}>
                From Building <span className="text-red-600">*</span>
              </label>
              <div className="flex min-w-0 gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type="text"
                    name="fromBuilding"
                    className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.fromBuilding ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.fromBuilding ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                    value={buildingSearchTerm}
                    onChange={(e) => handleBuildingSearchChange(e, 'from')}
                    onFocus={() => handleBuildingInputFocus('from')}
                    onBlur={handleBuildingInputBlur}
                    placeholder="Search Building"
                  />
                  <Search size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button type="button" className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700" onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}>
                  <Plus size={15} /> ADD
                </button>
              </div>
              {showBuildingDropdown && currentBuildingType === 'from' && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                    <span>Select Building</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {filteredBuildings.length > 0 ? (
                      filteredBuildings.map((building) => (
                        <div
                          key={building.id}
                          className="cursor-pointer border-b border-gray-100 px-3 py-2 transition hover:bg-blue-50"
                          onClick={() => handleBuildingSelect(building, 'from')}
                        >
                          <div className="text-sm text-gray-700">{building.buildingName}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-sm text-gray-500">No buildings found</div>
                    )}
                  </div>
                </div>
              )}
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
            <div className="min-w-0 space-y-1 relative">
              <label className={`block text-sm font-medium text-gray-700 ${errors.fromBuilding ? 'text-red-600' : formData.fromBuilding ? 'text-green-600' : ''}`}>
                From Building <span className="text-red-600">*</span>
              </label>
              <div className="flex min-w-0 gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type="text"
                    name="fromBuilding"
                    className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.fromBuilding ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.fromBuilding ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                    value={buildingSearchTerm}
                    onChange={(e) => handleBuildingSearchChange(e, 'from')}
                    onFocus={() => handleBuildingInputFocus('from')}
                    onBlur={handleBuildingInputBlur}
                    placeholder="Search Building"
                  />
                  <Search size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button type="button" className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700" onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}>
                  <Plus size={15} /> ADD
                </button>
              </div>
              {showBuildingDropdown && currentBuildingType === 'from' && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                    <span>Select Building</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {filteredBuildings.length > 0 ? (
                      filteredBuildings.map((building) => (
                        <div
                          key={building.id}
                          className="cursor-pointer border-b border-gray-100 px-3 py-2 transition hover:bg-blue-50"
                          onClick={() => handleBuildingSelect(building, 'from')}
                        >
                          <div className="text-sm text-gray-700">{building.buildingName}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-sm text-gray-500">No buildings found</div>
                    )}
                  </div>
                </div>
              )}
              {errors.fromBuilding && <span className="text-xs text-red-600">{errors.fromBuilding}</span>}
            </div>

            <div className="min-w-0 space-y-1 relative">
              <label className={`block text-sm font-medium text-gray-700 ${errors.toBuilding ? 'text-red-600' : formData.toBuilding ? 'text-green-600' : ''}`}>
                To Building <span className="text-red-600">*</span>
              </label>
              <div className="flex min-w-0 gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type="text"
                    name="toBuilding"
                    className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.toBuilding ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.toBuilding ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                    value={formData.toBuilding}
                    onChange={(e) => handleBuildingSearchChange(e, 'to')}
                    onFocus={() => handleBuildingInputFocus('to')}
                    onBlur={handleBuildingInputBlur}
                    placeholder="Search Building"
                  />
                  <Search size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button type="button" className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700" onClick={() => { setCurrentBuildingType('to'); handleAddBuilding(); }}>
                  <Plus size={15} /> ADD
                </button>
              </div>
              {showBuildingDropdown && currentBuildingType === 'to' && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                    <span>Select Building</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {filteredBuildings.length > 0 ? (
                      filteredBuildings.map((building) => (
                        <div
                          key={building.id}
                          className="cursor-pointer border-b border-gray-100 px-3 py-2 transition hover:bg-blue-50"
                          onClick={() => handleBuildingSelect(building, 'to')}
                        >
                          <div className="text-sm text-gray-700">{building.buildingName}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-sm text-gray-500">No buildings found</div>
                    )}
                  </div>
                </div>
              )}
              {errors.toBuilding && <span className="text-xs text-red-600">{errors.toBuilding}</span>}
            </div>
            <div className="min-w-0 space-y-1"></div>
            <div className="min-w-0 space-y-1"></div>
          </div>
        );

      case 'Control Room':
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0 space-y-1 relative">
              <label className={`block text-sm font-medium text-gray-700 ${errors.controlRoom ? 'text-red-600' : formData.controlRoom ? 'text-green-600' : ''}`}>
                Control Room <span className="text-red-600">*</span>
              </label>
              <div className="flex min-w-0 gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type="text"
                    name="controlRoom"
                    className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.controlRoom ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.controlRoom ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                    value={controlRoomSearchTerm}
                    onChange={handleControlRoomSearchChange}
                    onFocus={handleControlRoomInputFocus}
                    onBlur={handleControlRoomInputBlur}
                    placeholder="Search Control Room"
                  />
                  <Search size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button type="button" className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700" onClick={handleAddControlRoom}>
                  <Plus size={15} /> ADD
                </button>
              </div>
              {showControlRoomDropdown && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                    <span>Select Control Room</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {filteredControlRooms.length > 0 ? (
                      filteredControlRooms.map((controlRoom) => (
                        <div
                          key={controlRoom.id}
                          className="cursor-pointer border-b border-gray-100 px-3 py-2 transition hover:bg-blue-50"
                          onClick={() => handleControlRoomSelect(controlRoom)}
                        >
                          <div className="text-sm text-gray-700">{controlRoom.buildingName}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-sm text-gray-500">No control rooms found</div>
                    )}
                  </div>
                </div>
              )}
              {errors.controlRoom && <span className="text-xs text-red-600">{errors.controlRoom}</span>}
            </div>
            <div className="min-w-0 space-y-1"></div>
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
                  <div className="min-w-0 space-y-1 relative">
                  <label className={`block text-sm font-medium text-gray-700 ${errors.fromBuilding ? 'text-red-600' : formData.fromBuilding ? 'text-green-600' : ''}`}>
                    From Building <span className="text-red-600">*</span>
                  </label>
                  <div className="flex min-w-0 gap-2">
                    <div className="relative min-w-0 flex-1">
                      <input
                        type="text"
                        name="fromBuilding"
                        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.fromBuilding ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.fromBuilding ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                        value={buildingSearchTerm}
                        onChange={(e) => handleBuildingSearchChange(e, 'from')}
                        onFocus={() => handleBuildingInputFocus('from')}
                        onBlur={handleBuildingInputBlur}
                        placeholder="Search Building"
                      />
                      <Search size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <button type="button" className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700" onClick={() => { setCurrentBuildingType('from'); handleAddBuilding(); }}>
                      <Plus size={15} /> ADD
                    </button>
                  </div>
                  {showBuildingDropdown && currentBuildingType === 'from' && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                        <span>Select Building</span>
                      </div>
                      <div className="max-h-56 overflow-y-auto">
                        {filteredBuildings.length > 0 ? (
                          filteredBuildings.map((building) => (
                            <div
                              key={building.id}
                              className="cursor-pointer border-b border-gray-100 px-3 py-2 transition hover:bg-blue-50"
                              onClick={() => handleBuildingSelect(building, 'from')}
                            >
                              <div className="text-sm text-gray-700">{building.buildingName}</div>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-3 text-sm text-gray-500">No buildings found</div>
                        )}
                      </div>
                    </div>
                  )}
                  {errors.fromBuilding && <span className="text-xs text-red-600">{errors.fromBuilding}</span>}
                </div>
            )}
            { formData.stolenFrom === 'Customer' && (
                <>
                  <div className="min-w-0 space-y-1 relative">
                <label className={`block text-sm font-medium text-gray-700 ${errors.customer ? 'text-red-600' : formData.customer ? 'text-green-600' : ''}`}>
                  Customer <span className="text-red-600">*</span>
                </label>
                <div className="flex min-w-0 gap-2">
                  <div className="relative min-w-0 flex-1">
                    <input
                      type="text"
                      name="customer"
                      className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.customer ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.customer ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                      value={customerSearchTerm}
                      onChange={handleCustomerSearchChange}
                      onFocus={handleCustomerInputFocus}
                      onBlur={handleCustomerInputBlur}
                      placeholder="Search User"
                    />
                    <Search size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <button type="button" className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700" onClick={handleAddCustomer}>
                    <Plus size={15} /> ADD
                  </button>
                </div>
                {showCustomerDropdown && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                      <span>Select Customer</span>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <div
                            key={customer._id}
                            className="cursor-pointer border-b border-gray-100 px-3 py-2 transition hover:bg-blue-50"
                            onClick={() => handleCustomerSelect(customer)}
                          >
                            <div className="text-sm text-gray-700">{customer.username}-{customer.mobile}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-3 text-sm text-gray-500">No customers found</div>
                      )}
                    </div>
                  </div>
                )}
                {errors.customer && <span className="text-xs text-red-600">{errors.customer}</span>}
              </div>
                </>
            )}

            {formData.stolenFrom === 'Control Room' && (
              <>
                   <div className="min-w-0 space-y-1 relative">
              <label className={`block text-sm font-medium text-gray-700 ${errors.controlRoom ? 'text-red-600' : formData.controlRoom ? 'text-green-600' : ''}`}>
                Control Room <span className="text-red-600">*</span>
              </label>
              <div className="flex min-w-0 gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type="text"
                    name="controlRoom"
                    className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.controlRoom ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.controlRoom ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                    value={controlRoomSearchTerm}
                    onChange={handleControlRoomSearchChange}
                    onFocus={handleControlRoomInputFocus}
                    onBlur={handleControlRoomInputBlur}
                    placeholder="Search Control Room"
                  />
                  <Search size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button type="button" className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700" onClick={handleAddControlRoom}>
                  <Plus size={15} /> ADD
                </button>
              </div>
              {showControlRoomDropdown && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                    <span>Select Control Room</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {filteredControlRooms.length > 0 ? (
                      filteredControlRooms.map((controlRoom) => (
                        <div
                          key={controlRoom.id}
                          className="cursor-pointer border-b border-gray-100 px-3 py-2 transition hover:bg-blue-50"
                          onClick={() => handleControlRoomSelect(controlRoom)}
                        >
                          <div className="text-sm text-gray-700">{controlRoom.buildingName}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-sm text-gray-500">No control rooms found</div>
                    )}
                  </div>
                </div>
              )}
              {errors.controlRoom && <span className="text-xs text-red-600">{errors.controlRoom}</span>}
            </div>
              </>
            )}
            <div className="min-w-0 space-y-1"></div>
            <div className="min-w-0 space-y-1"></div>
          </div>
        );
      
        case 'Damage':
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="min-w-0 space-y-1 relative">
        <label className={`block text-sm font-medium text-gray-700 ${errors.warehouse ? 'text-red-600' : formData.warehouse ? 'text-green-600' : ''}`}>
          Warehouse<span className="text-red-600">*</span>
        </label>
        <div className="flex min-w-0 gap-2">
          <div className="relative min-w-0 flex-1">
            <input
              type="text"
              name="warehouse"
              className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.warehouse ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.warehouse ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
              value={warehouseSearchTerm}
              onChange={handleWarehouseSearchChange}
              onFocus={handleWarehouseInputFocus}
              onBlur={handleWarehouseInputBlur}
              placeholder="Search"
            />
            <Search size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {showWarehouseDropdown && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
            <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
              <span>Select</span>
            </div>
            <div className="max-h-56 overflow-y-auto">
              {filteredWarehouses.length > 0 ? (
                filteredWarehouses.map((warehouse) => (
                  <div
                    key={warehouse._id || warehouse.id}
                    className="cursor-pointer border-b border-gray-100 px-3 py-2 transition hover:bg-blue-50"
                    onClick={() => handleWarehouseSelect(warehouse)}
                  >
                    <div className="text-sm text-gray-700">{warehouse.centerName }</div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-3 text-sm text-gray-500">No warehouses found</div>
              )}
            </div>
          </div>
        )}
        {errors.warehouse && <span className="text-xs text-red-600">{errors.warehouse}</span>}
      </div>
      <div className="min-w-0 space-y-1"></div>
      <div className="min-w-0 space-y-1"></div>
      <div className="min-w-0 space-y-1"></div>
    </div>
  );

      case 'Other':
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                type="text"
                name="address"
                className="min-h-[90px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
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
    <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center gap-3 text-xl font-semibold text-gray-800">
        <button
          type="button"
          className="mr-3 inline-flex items-center gap-1.5 rounded-md bg-gray-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-700"
          onClick={handleBack}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        {id ? 'Edit' : 'Add'} Stock Usage 
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-end border-b border-gray-200 bg-gray-50 px-5 py-3 ">
          <button type="button" className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50" onClick={handleReset}>
            Reset
          </button>
        </div>
        <div className="p-5">
          {alert.show && (
            <div
              className={`mx-3 mb-4 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
                alert.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
              role="alert"
            >
              <span>{alert.message}</span>
              <button
                type="button"
                onClick={() => setAlert({ show: false, message: '', type: '' })}
                className="ml-4 rounded p-1 text-current hover:bg-black/5"
                aria-label="Close alert"
              >
                ×
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.date ? 'text-red-600' : formData.date ? 'text-green-600' : ''}`}>
                  Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.date ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.date ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                  disabled
                />
                {errors.date && <span className="text-xs text-red-600">{errors.date}</span>}
              </div>

              <div className="min-w-0 space-y-1">
                <label className={`block text-sm font-medium text-gray-700 ${errors.usageType ? 'text-red-600' : formData.usageType ? 'text-green-600' : ''}`}>
                  Usage Type <span className="text-red-600">*</span>
                </label>
                <select
                  name="usageType"
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.usageType ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : formData.usageType ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100' : ''}`}
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
                {errors.usageType && <span className="text-xs text-red-600">{errors.usageType}</span>}
              </div>

              <div className="min-w-0 space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="remark">
                  Remark
                </label>
                <textarea
                  name="remark"
                  className="min-h-[90px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Remark"
                  value={formData.remark}
                  onChange={handleChange}
                />
              </div>
              <div className="min-w-0 space-y-1"></div>
            </div>

            {renderConditionalFields()}
            
            <div className="mt-5">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h5>Select Products</h5>
                {errors.products && <span className="text-xs font-medium text-red-600">{errors.products}</span>}
                <div className="flex">
                  <label className="mr-2 mt-1">Search:</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-[250px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Search products..."
                  />
                </div>
              </div>

              {loading ? (
                <div className="my-6 flex justify-center">
                  <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" aria-label="Loading" />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-[1000px] w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Select</th>
                      <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Product Name</th>
                      <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Available Quantity</th>
                      <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Type</th>
                      <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Damage Qty</th>
                      <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Old Replace</th>
                      <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Usage Qty</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                  const isSelected = !!selectedRows[p._id];

      return (
        <tr key={p._id} className={isSelected ? "bg-blue-50" : "hover:bg-gray-50"}>
          <td className="px-4 py-3 text-gray-700">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleRowSelect(p._id, p.stock)}
              className="h-5 w-5 accent-blue-600"
            />
          </td>

          <td className="px-4 py-3 text-gray-700">{p.productTitle}</td>
          <td className="px-4 py-3 text-gray-700">{p.stock?.currentStock || 0}</td>

          <td className="px-4 py-3 text-gray-700"></td>
          <td className="px-4 py-3 text-gray-700"></td>
          <td className="px-4 py-3 text-gray-700"></td>

          <td className="px-4 py-3 text-gray-700">
  {isSelected && (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={selectedRows[p._id]?.quantity || ''}
        onChange={(e) => handleUsageQtyChange(p._id, e.target.value)}
        placeholder="Usage Qty"
        className="w-[100px] rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        min="1"
        max={p.stock?.currentStock || 0}
      />

      {selectedRows[p._id] && p.trackSerialNumber === "Yes" && (
        <span
          className="cursor-pointer text-lg text-blue-600 transition hover:text-blue-800"
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
      <td colSpan={7} className="text-center">
        No products found
      </td>
    </tr>
  )}
</tbody>

                </table>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end border-t border-gray-200 pt-4">
              <button type="submit" className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
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