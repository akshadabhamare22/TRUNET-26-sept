

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, } from 'react-router-dom';
import { ArrowLeft, Ban, Check, Printer, Truck, X, AlertCircle, Info, PackageCheck } from 'lucide-react';
import RejectionReasonModal from './RejectionReasonModal';
import axiosInstance from '../../axiosInstance';
import companyLogo from '../../assets/images/logo.png'
import ShipGoodsModal from './ShipGoodsModal';
import IncompleteRemarkModal from './IncompleteRemarkModal';
import { formatDate, formatDateTime } from '../../utils/FormatDateTime';
import SerialNumbers from './SerialNumbers';
import ReceivedSerialNumbers from './ReceivedSerialNumbers';
import usePermission from '../../utils/usePermission';
import ChallanModal from './ChallanModal';
import Swal from 'sweetalert2';

const StockProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBack = () => {
  navigate(-1);
};

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
  const [challanModal, setChallanModal] = useState(false);
  const [rejectionModal, setRejectionModal] = useState(false);
  const [receivedSerialModal, setReceivedSerialModal] = useState(false);
  const [selectedReceivedProduct, setSelectedReceivedProduct] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user')) || {};
  // Update this section around line 80-82
const userRole = (user?.role?.roleTitle || '').toLowerCase();
const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
const userCenterType = (userCenter.centerType || 'Outlet').toLowerCase();

const userCenterId = userCenter._id;
const isCenter = data?.center?._id === userCenterId;
const isWarehouse = data?.warehouse?._id === userCenterId;

// Hide stock qty and reseller qty for center users only
const shouldShowExtraColumns = userCenterType !== 'center';

  const showStockQty = userRole === 'admin' || 'superadmin';

  const [shipmentData, setShipmentData] = useState({
    shippedDate: '',
    expectedDeliveryDate: '',
    shipmentDetails: '',
    shipmentRemark: '',
    documents: []
  });
  
  const { hasPermission, hasAnyPermission } = usePermission();
  
  const handleOpenSerialModal = (product) => {
    setSelectedProduct(product);
    setSerialModalVisible(true);
  };
  
  const handleOpenReceivedSerialModal = (product) => {
    setSelectedReceivedProduct(product);
    setReceivedSerialModal(true);
  };
   
  const handleSerialNumbersUpdate = (productId, serialsArray) => {
    setAssignedSerials(prev => ({
      ...prev,
      [productId]: serialsArray
    }));
  };
  
  const openRejectionModal = () => {
    setRejectionModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching stock request data for ID:', id);
        const response = await axiosInstance.get(`/stockrequest/${id}`);
        if (response.data.success) {
          const stockData = response.data.data;
          console.log('Fetched stock data:', stockData);
          console.log('Products in stock data:', stockData.products);
          
          // Log received quantities from API
          stockData.products.forEach((item, index) => {
            console.log(`Product ${index + 1}: ${item.product?.productTitle}`, {
              receivedQuantity: item.receivedQuantity,
              approvedQuantity: item.approvedQuantity,
              status: item.status
            });
          });
          
          setData(stockData);

          const initialApproved = stockData.products.map(item => ({
            _id: item._id,
            productId: item.product?._id,
            approvedQty:
              item.approvedQuantity !== undefined && item.approvedQuantity !== null
                ? item.approvedQuantity
                : item.quantity || '',
            approvedRemark: item.approvedRemark || ''
          }));
          setApprovedProducts(initialApproved);
  
          const initialSerials = {};
          stockData.products.forEach(item => {
            if (item.product?.trackSerialNumber === "Yes" && item.approvedSerials?.length > 0) {
              initialSerials[item.product._id] = item.approvedSerials.map(sn => ({ serialNumber: sn }));
            }
          });
          setAssignedSerials(initialSerials);
  
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
      const response = await axiosInstance.post(`/stockrequest/${id}/ship`, shipmentData)
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Shipment created successfully', visible: true })
        setShipmentModal(false)
        try {
          await axiosInstance.patch(`/stockrequest/${id}/warehouse-challan-approval`, { 
            warehouseChallanApproval: 'approved' 
          });
          console.log('Challan auto-approved after shipment');
        } catch (challanError) {
          console.error('Failed to auto-approve challan:', challanError);
        }
        
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setAlert({ type: 'danger', message: 'Failed to create shipment', visible: true })
      }
    } catch (err) {
      console.error(err)
      setAlert({ type: 'danger', message: 'Error creating shipment', visible: true })
    }
  }

  // Updated useEffect for productReceipts with console logs
  useEffect(() => {
    if (data?.products) {
      console.log('Initializing productReceipts from data.products');
      console.log('Current data.products:', data.products);
      
      const initialReceipts = data.products.map(item => {
        const receivedQty = item.receivedQuantity !== undefined && item.receivedQuantity !== null 
          ? item.receivedQuantity 
          : '';
        
        console.log(`Product: ${item.product?.productTitle}`, {
          originalReceivedQuantity: item.receivedQuantity,
          approvedQuantity: item.approvedQuantity,
          setReceivedQuantity: receivedQty,
          receivedRemark: item.receivedRemark || ''
        });
        
        return {
          productId: item.product?._id,
          productTitle: item.product?.productTitle,
          receivedQuantity: receivedQty,
          receivedRemark: item.receivedRemark || '',
        };
      });
      
      console.log('Initial productReceipts state:', initialReceipts);
      setProductReceipts(initialReceipts);
    }
  }, [data]);

  // Auto-fill received quantity with approved quantity for center users
  useEffect(() => {
    // Only auto-fill when:
    // 1. Data is loaded
    // 2. Status is Shipped
    // 3. User is center
    // 4. User is viewing their own center
    // 5. Product receipts are initialized
    if (data?.status === 'Shipped' && userCenterType === 'center' && isCenter && data?.products && productReceipts.length > 0) {
      let needsUpdate = false;
      const updatedReceipts = productReceipts.map(receipt => {
        const product = data.products.find(p => p.product?._id === receipt.productId);
        // If received quantity is empty or 0, and approved quantity exists, auto-fill
        if (product && 
            (receipt.receivedQuantity === undefined || 
             receipt.receivedQuantity === null || 
             receipt.receivedQuantity === '' || 
             receipt.receivedQuantity === 0) && 
            product.approvedQuantity && 
            product.approvedQuantity > 0) {
          needsUpdate = true;
          console.log(`Auto-filling ${product.product?.productTitle} with approved quantity: ${product.approvedQuantity}`);
          return {
            ...receipt,
            receivedQuantity: product.approvedQuantity
          };
        }
        return receipt;
      });
      
      if (needsUpdate) {
        console.log('Auto-filling received quantities with approved quantities:', updatedReceipts);
        setProductReceipts(updatedReceipts);
      }
    }
  }, [data, userCenterType, isCenter, productReceipts.length]);
  
  const handleReceiptChange = (productId, field, value) => {
    console.log(`Updating receipt for product ${productId}:`, { field, value });
    setProductReceipts(prev =>
      prev.map(p => {
        if (p.productId === productId) {
          console.log(`Updated product receipt:`, { ...p, [field]: value });
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  const handleApprovedChange = (productId, field, value) => {
    if (field === 'approvedQty') {
      if (value === '' || /^\d+$/.test(value)) {
        setErrors(prev => ({ ...prev, [productId]: undefined }));
      } else {
        setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
      }
    }
  
    setApprovedProducts(prev =>
      prev.map(p =>
        p._id === productId ? { ...p, [field]: value } : p
      )
    );
  };  

const handleApprove = async () => {
  let hasError = false;

  const payload = approvedProducts.map(p => {
    if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
      setErrors(prev => ({ ...prev, [p._id]: 'The input value was not a correct number' }));
      hasError = true;
    }
    const productSerials = assignedSerials[p.productId] || [];
    const limitedSerials = productSerials.slice(0, Number(p.approvedQty));

    return {
      productId: p.productId,
      approvedQuantity: Number(p.approvedQty),
      approvedRemark: p.approvedRemark || '',
      approvedSerials: limitedSerials.map(s => s.serialNumber),
    };
  });

  if (hasError) return;

  try {
    const response = await axiosInstance.post(`/stockrequest/${id}/approve`, {
      productApprovals: payload,
    });
    if (!response.data.success) {
      setAlert({
        type: 'danger',
        message: response.data.message || 'Failed to approve request',
        visible: true,
      });
      return;
    }
    setAlert({
      type: 'success',
      message: 'Stock request approved successfully',
      visible: true,
    });
    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    console.error(err);

    const errorMessage =
      err.response?.data?.message ||
      err.message || 
      'An unexpected error occurred';

    setAlert({
      type: 'danger',
      message: errorMessage,
      visible: true,
    });
  }
};

const handleReject = async (rejectionReason) => {
  try {
    const response = await axiosInstance.put(`/stockrequest/${id}`, { 
      status: 'Rejected', 
      rejectionReason: rejectionReason 
    });
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Stock request rejected successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to reject request', visible: true });
    }
  } catch (err) {
    console.error(err);
    const errorMessage = err.response?.data?.message || 'Error rejecting stock request';
    setAlert({ type: 'danger', message: errorMessage, visible: true });
  }
};

const handleSubmitRequest = async () => {
  try {
    const response = await axiosInstance.put(`/stockrequest/${id}`, { status: 'Submitted' });
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

const handleChangeApprovedQty = async () => {
  let hasError = false;
  const payload = approvedProducts.map(p => {
    if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
      setErrors(prev => ({
        ...prev,
        [p._id]: 'The input value was not a correct number',
      }));
      hasError = true;
    }
    return {
      productId: p.productId,
      approvedQuantity: Number(p.approvedQty),
      approvedRemark: p.approvedRemark || '',
      approvedSerials: (assignedSerials[p.productId] || []).map(s => s.serialNumber),
    };
  });

  if (hasError) return;
  console.log("Final payload sent to API:", payload); 
  try {
    const response = await axiosInstance.patch(
      `/stockrequest/${id}/approved-quantities`,
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

const handleCancelShipment = async () => {
  try {
    const response = await axiosInstance.post(`/stockrequest/${id}/reject-shipment`);
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

const handleCompleteIndent = async () => {
  try {
    console.log('Completing indent with productReceipts:', productReceipts);
    
    if (userCenterType === 'center') {
      const missingReceipts = productReceipts.filter(item => 
        item.receivedQuantity === undefined || 
        item.receivedQuantity === null || 
        item.receivedQuantity === '' ||
        isNaN(Number(item.receivedQuantity))
      );

      if (missingReceipts.length > 0) {
        console.log('Missing receipts:', missingReceipts);
        setAlert({
          type: 'danger',
          message: 'Please enter received quantity for all products before completing the indent',
          visible: true,
        });
        return;
      }
    }

    let payload = [];

    if (isCenter) {
      payload = productReceipts.map(item => ({
        productId: item.productId,
        receivedQuantity: Number(item.receivedQuantity) || 0,
        receivedRemark: item.receivedRemark || '',
      }));
    } else {
      payload = data.products.map(item => ({
        productId: item.product?._id,
        receivedQuantity: item.approvedQuantity || item.receivedQuantity || 0,
        receivedRemark: item.receivedRemark || '',
      }));
    }

    console.log('Complete indent payload:', payload);
    
    const response = await axiosInstance.post(`/stockrequest/${id}/complete`, {
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

    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred while completing the indent';

    setAlert({
      type: 'danger',
      message: errorMessage,
      visible: true,
    });
  }
};

const handleCompleteIndentWithChallan = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to complete this indent and approve the challan?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, complete it!',
    cancelButtonText: 'Cancel'
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    await handleCompleteIndent();
    const response = await axiosInstance.patch(`/stockrequest/${id}/center-challan-approval`, { 
      centerChallanApproval: 'approved' 
    });
    
    if (response.data.success) {
      console.log('Challan auto-approved after completion');
    }
    
  } catch (err) {
    console.error('Error in complete process:', err);
  }
};

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
    const response = await axiosInstance.patch(`/stockrequest/${id}/shipping-info`, shipmentData);
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
    console.log('Marking as incomplete with productReceipts:', productReceipts);
    
    if (userCenterType === 'center') {
      const missingReceipts = productReceipts.filter(item => 
        item.receivedQuantity === undefined || 
        item.receivedQuantity === null || 
        item.receivedQuantity === '' ||
        isNaN(Number(item.receivedQuantity))
      );

      if (missingReceipts.length > 0) {
        console.log('Missing receipts:', missingReceipts);
        setAlert({
          type: 'danger',
          message: 'Please enter received quantity for all products before marking as incomplete',
          visible: true,
        });
        return;
      }
    }
    
    const receivedProducts = productReceipts.map(item => ({
      productId: item.productId,
      receivedQuantity: Number(item.receivedQuantity) || 0,
      receivedRemark: item.receivedRemark || '',
    }));
    
    const payload = {
      incompleteRemark: remark,
      receivedProducts,
    };
    
    console.log('Incomplete Payload:', payload);
    const response = await axiosInstance.post(
      `/stockrequest/${id}/mark-incomplete`,
      payload
    );

    if (response.data.success) {
      setAlert({
        type: 'success',
        message: 'Stock request marked as incomplete',
        visible: true,
      });
      setIncompleteModal(false);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({
        type: 'danger',
        message: 'Failed to mark incomplete',
        visible: true,
      });
    }
  } catch (err) {
    console.error(err);
    setAlert({
      type: 'danger',
      message: 'Error marking incomplete',
      visible: true,
    });
  }
};
const getStatusClasses = (status) => {
  switch (status) {
    case "Draft":
      return "border-gray-300 bg-gray-100 text-gray-700";

    case "Submitted":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "Confirmed":
      return "border-green-200 bg-green-50 text-green-700";

    case "Shipped":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "Completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "Rejected":
      return "border-red-200 bg-red-50 text-red-700";

    case "Incompleted":
      return "border-orange-200 bg-orange-50 text-orange-700";

    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
};

const handleIncomplete = async () => {
  try {
    const approvalsPayload = approvedProducts.map(p => {
      const product = data.products.find(prod => prod.product?._id === p.productId);
      const isSerialized = product?.product?.trackSerialNumber === "Yes";
      
      const currentSerials = assignedSerials[p.productId] || [];
      
      return {
        productId: p.productId,
        approvedQuantity: Number(p.approvedQty) || 0,
        approvedRemark: p.approvedRemark || '',
        ...(isSerialized && {
          approvedSerials: currentSerials.map(s => s.serialNumber).slice(0, Number(p.approvedQty))
        })
      };
    });

    const receiptsPayload = productReceipts.map(r => ({
      productId: r.productId,
      receivedQuantity: Number(r.receivedQuantity) || 0,
      receivedRemark: r.receivedRemark || '',
    }));

    console.log('Final Incomplete Payload:', {
      productApprovals: approvalsPayload,
      productReceipts: receiptsPayload,
    });

    const response = await axiosInstance.patch(
      `/stockrequest/${id}/complete-incomplete`,
      {
        productApprovals: approvalsPayload,
        productReceipts: receiptsPayload,
      }
    );
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
    console.error('Error in handleIncomplete:', err);
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred while completing the indent';

    setAlert({
      type: 'danger',
      message: errorMessage,
      visible: true,
    });
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
      <title>Indent Invoice - ${data.orderNumber || ''}</title>
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

        /* ── Meta row (Indent No / Date) ────────────────────── */
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
        .products-table thead tr {
          background: var(--ink);
        }
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
        .products-table td:not(:first-child):not(:nth-child(2)) { text-align: right; font-family: 'DM Mono', monospace; font-size: 12px; }
        .products-table td:nth-child(2) { color: var(--ink); font-weight: 500; }
        .products-table tbody tr:nth-child(even) td { background: var(--surface); }
        .products-table tbody tr:last-child td { border-bottom: none; }
        .products-table .amount-col { font-weight: 700; color: var(--ink); }

        /* Totals footer */
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
        .totals-line.grand {
          background: var(--ink);
          color: #fff;
        }
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
        .info-grid .val {
          color: var(--ink-mid);
          width: 36%;
        }
        .info-grid .val strong { color: var(--ink); }

        /* ── Footer / signature ─────────────────────────────── */
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

        /* ── Print buttons (screen only) ────────────────────── */
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
          <span class="doc-title">Stock Indent</span>
          <span class="status-pill">${data.status || 'Pending'}</span>
        </div>

        <!-- ── META ROW ──────────────────────────────────────── -->
        <div class="meta-row">
          <div class="meta-cell">
            <div class="meta-label">Indent Number</div>
            <div class="meta-value">${data.orderNumber || '—'}</div>
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
            <div class="section-label">From — Center Details</div>
            <div class="address-name">${data.center?.centerName || ''}</div>
            <p>${data.center?.addressLine1 || ''} ${data.center?.addressLine2 || ''}</p>
            <p>${data.center?.city || ''}${data.center?.city && data.center?.state ? ', ' : ''}${data.center?.state || ''}</p>
            <p>${data.center?.email || ''}</p>
          </div>
          <div class="address-divider"></div>
          <div class="address-cell">
            <div class="section-label">To — Warehouse Details</div>
            <div class="address-name">${data.warehouse?.centerName || ''}</div>
            <p>${data.warehouse?.addressLine1 || ''} ${data.warehouse?.addressLine2 || ''}</p>
            <p>${data.warehouse?.city || ''}${data.warehouse?.city && data.warehouse?.state ? ', ' : ''}${data.warehouse?.state || ''}</p>
            <p>${data.warehouse?.email || ''}</p>
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
              <td class="val">${formatDateTime(data.approvalInfo?.approvedAt) || 'March 6, 2026'}</td>
              <td class="lbl">Shipment Date</td>
              <td class="val">${formatDate(data.shippingInfo?.shippedDate) || 'March 6, 2026'}</td>
            </tr>
            <tr>
              <td class="lbl">Expected Delivery</td>
              <td class="val">${formatDate(data.shippingInfo?.expectedDeliveryDate) || formatDate(data.shippingInfo?.shippedDate) || 'March 6, 2026'}</td>
              <td class="lbl">Completed On</td>
              <td class="val">${formatDateTime(data.completedOn) || '07 Mar 2026'}</td>
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
            This is a computer-generated indent document.<br>
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
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="m-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Stock Request not found
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
      {alert.visible && (
        <div
          className={`mb-5 flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm ${
            alert.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{alert.message}</span>
          </div>

          <button
            type="button"
            onClick={() => setAlert({ ...alert, visible: false })}
            className="rounded p-1 hover:bg-black/5"
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="text-xl font-semibold text-gray-800">
            Indent Detail
          </h1>
        </div>
      </div>

      {/* Indent information */}
      <div className="mb-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-semibold text-gray-800">
              Indent: {data.orderNumber || ''}
            </h2>

            {data.status && (
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                  data.status
                )}`}
              >
                {data.status}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {data.status === 'Shipped' &&
              hasPermission('Indent', 'complete_indent') && (
                <button
                  type="button"
                  onClick={handleCompleteIndentWithChallan}
                  className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
                >
                  <Check size={16} />
                  Complete The Indent
                </button>
              )}

            <button
              type="button"
              onClick={handlePrintIndent}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Printer size={16} />
              Print Indent
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-sm">
            <tbody>
              {[
                [
                  'Center/Center Code:',
                  data.orderNumber || '',
                  'Shipment Date:',
                  formatDate(data.shippingInfo?.shippedDate || ''),
                  'Completed on:',
                  formatDateTime(data.completionInfo?.completedOn || ''),
                ],
                [
                  'Indent Date:',
                  data.date || '',
                  'Expected Delivery:',
                  formatDate(data.shippingInfo?.expectedDeliveryDate || ''),
                  'Completed by:',
                  data.completionInfo?.completedBy?.fullName || '',
                ],
                [
                  'Remark:',
                  data.remark || '',
                  'Shipment Detail:',
                  data.shippingInfo?.shipmentDetails || '',
                  'Incomplete on:',
                  formatDateTime(data.incompleteInfo?.incompleteOn || ''),
                ],
                [
                  'Created at:',
                  formatDateTime(data.createdAt),
                  'Shipment Remark:',
                  data.shippingInfo?.shipmentRemark || '',
                  'Incomplete by:',
                  data.incompleteInfo?.incompleteBy?.fullName || '',
                ],
                [
                  'Created by:',
                  data.createdBy?.fullName || '',
                  'Document:',
                  data.document || '',
                  'Incomplete Remark:',
                  data.incompleteInfo?.incompleteRemark || '',
                ],
                [
                  'Approved at:',
                  formatDateTime(data.approvalInfo?.approvedAt || ''),
                  'Shipped at:',
                  formatDateTime(data.shippingInfo?.shippedAt || ''),
                  data.status === 'Completed'
                    ? 'Received at:'
                    : data.status === 'Rejected'
                      ? 'Rejected at:'
                      : '',
                  data.status === 'Completed'
                    ? formatDateTime(data.receivingInfo?.receivedAt || '')
                    : data.status === 'Rejected'
                      ? formatDateTime(data.rejectionInfo?.rejectedAt || '')
                      : '',
                ],
                [
                  'Approved by:',
                  data.approvalInfo?.approvedBy?.fullName || '',
                  'Shipped by:',
                  data.shippingInfo?.shippedBy?.fullName || '',
                  data.status === 'Completed'
                    ? 'Received by:'
                    : data.status === 'Rejected'
                      ? 'Rejected by:'
                      : '',
                  data.status === 'Completed'
                    ? data.receivingInfo?.receivedBy?.fullName || ''
                    : data.status === 'Rejected'
                      ? data.rejectionInfo?.rejectedBy?.fullName || ''
                      : '',
                ],
                [
                  '',
                  '',
                  '',
                  '',
                  data.status === 'Rejected' ? 'Rejected Remark:' : '',
                  data.status === 'Rejected'
                    ? data.rejectionInfo?.rejectionReason || ''
                    : '',
                ],
              ].map((row, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-b-0">
                  {row.map((cell, cellIndex) =>
                    cellIndex % 2 === 0 ? (
                      <td
                        key={cellIndex}
                        className="whitespace-nowrap bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600"
                      >
                        {cell}
                      </td>
                    ) : (
                      <td
                        key={cellIndex}
                        className="min-w-[150px] px-4 py-3 text-sm text-gray-800"
                      >
                        {cell}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product details */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-base font-semibold text-gray-800">
            Product Details
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {data.status === 'Draft' && (
              <button
                type="button"
                onClick={handleSubmitRequest}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Check size={16} />
                Submit
              </button>
            )}

            {data.status === 'Confirmed' &&
              userCenterType === 'outlet' &&
              (userRole === 'admin' || userRole === 'superadmin') &&
              isWarehouse && (
                <>
                  <button
                    type="button"
                    onClick={handleChangeApprovedQty}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Change Approved Qty
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentShipmentAction(() => handleShipGoods);
                      setShipmentModal(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    <Truck size={16} />
                    Ship the Goods
                  </button>

                  <button
                    type="button"
                    onClick={openRejectionModal}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Reject Request
                  </button>
                </>
              )}

            {(data.status === 'Confirmed' ||
              data.status === 'Shipped' ||
              data.status === 'Incompleted' ||
              data.status === 'Completed') &&
              isWarehouse && (
                <button
                  type="button"
                  onClick={() => setChallanModal(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <PackageCheck size={16} />
                  View Challan
                </button>
              )}

            {(data.status === 'Shipped' || data.status === 'Completed') &&
              isCenter && (
                <button
                  type="button"
                  onClick={() => setChallanModal(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <PackageCheck size={16} />
                  View Challan
                </button>
              )}

            {data.status === 'Shipped' &&
              userCenterType === 'outlet' &&
              (userRole === 'admin' || userRole === 'superadmin') &&
              isWarehouse && (
                <>
                  <button
                    type="button"
                    onClick={handleOpenUpdateShipment}
                    className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                  >
                    <Truck size={16} />
                    Update Shipment
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelShipment}
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    <Ban size={16} />
                    Cancel Shipment
                  </button>

                  <button
                    type="button"
                    onClick={openRejectionModal}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Reject Request
                  </button>
                </>
              )}

            {data.status === 'Shipped' &&
              userCenterType === 'center' &&
              isCenter && (
                <button
                  type="button"
                  onClick={() => setIncompleteModal(true)}
                  className="rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
                >
                  Incomplete
                </button>
              )}

            {data.status === 'Submitted' &&
              hasPermission(
                'Indent',
                'stock_transfer_approve_from_outlet'
              ) &&
              isWarehouse && (
                <>
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                  >
                    Submit &amp; Approve Request
                  </button>

                  <button
                    type="button"
                    onClick={openRejectionModal}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Submit &amp; Reject Request
                  </button>
                </>
              )}

            {data.status === 'Incompleted' &&
              userCenterType === 'outlet' &&
              (userRole === 'admin' || userRole === 'superadmin') &&
              isWarehouse && (
                <button
                  type="button"
                  onClick={handleIncomplete}
                  className="rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
                >
                  Change Qty And Complete Request
                </button>
              )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                <th className="border-b border-gray-200 px-4 py-3">Product</th>
                <th className="border-b border-gray-200 px-4 py-3">Center Stock</th>
                <th className="border-b border-gray-200 px-4 py-3">Requested Qty</th>
                {shouldShowExtraColumns && (
                  <th className="border-b border-gray-200 px-4 py-3">Stock Qty</th>
                )}
                {shouldShowExtraColumns && (
                  <th className="border-b border-gray-200 px-4 py-3">Reseller Qty</th>
                )}
                <th className="border-b border-gray-200 px-4 py-3">Product Remark</th>
                <th className="border-b border-gray-200 px-4 py-3">Approved Qty</th>
                <th className="border-b border-gray-200 px-4 py-3">Approved Remark</th>
                <th className="border-b border-gray-200 px-4 py-3">Received Qty</th>
                <th className="border-b border-gray-200 px-4 py-3">Received Remark</th>
              </tr>
            </thead>

            <tbody>
              {data.products?.length > 0 ? (
                data.products.map((item) => {
                  const approvedItem =
                    approvedProducts.find((p) => p._id === item._id) || {};

                  const currentReceipt = productReceipts.find(
                    (p) => p.productId === item.product?._id
                  );

                  const receivedQtyValue =
                    currentReceipt?.receivedQuantity !== undefined &&
                    currentReceipt?.receivedQuantity !== ''
                      ? currentReceipt.receivedQuantity
                      : '';

                  const receivedRemarkValue =
                    currentReceipt?.receivedRemark !== undefined
                      ? currentReceipt.receivedRemark
                      : item.receivedRemark || '';

                  console.log(`Rendering product: ${item.product?.productTitle}`, {
                    currentReceipt,
                    receivedQtyValue,
                    receivedRemarkValue,
                    originalReceivedQuantity: item.receivedQuantity,
                    approvedQuantity: item.approvedQuantity,
                    status: data.status,
                    isCenter,
                    userCenterType,
                  });

                  const approvedQty =
                    approvedItem.approvedQty ||
                    item.approvedQuantity ||
                    0;

                  const shouldShowMismatch =
                    data.status === 'Incompleted' ||
                    data.status === 'Completed';

                  const isQuantityMismatch =
                    shouldShowMismatch &&
                    Number(receivedQtyValue) !== Number(approvedQty);

                  return (
                    <tr
                      key={item._id}
                      className={`border-b border-gray-100 ${
                        isQuantityMismatch
                          ? 'bg-red-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {item.product?.productTitle || ''}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {item.centerStockQuantity || 0}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {item.quantity || 0}
                      </td>

                      {shouldShowExtraColumns && (
                        <td className="px-4 py-3 text-gray-700">
                          {item.outletStock?.availableQuantity || 0}
                        </td>
                      )}

                      {shouldShowExtraColumns && (
                        <td className="px-4 py-3 text-gray-700">
                          {item.resellerStock?.availableQuantity || 0}
                        </td>
                      )}

                      <td className="px-4 py-3 text-gray-600">
                        {item.productRemark || ''}
                      </td>

                      <td className="px-4 py-3">
                        {isWarehouse ? (
                          <div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={approvedItem.approvedQty ?? ''}
                                onChange={(e) =>
                                  handleApprovedChange(
                                    item._id,
                                    'approvedQty',
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
                                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                                }`}
                              />

                              {item.product?.trackSerialNumber === 'Yes' && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenSerialModal(item)}
                                  title="Add Serial Numbers"
                                  className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50"
                                >
                                  <Info size={18} />
                                </button>
                              )}
                            </div>

                            {errors[item._id] && (
                              <p className="mt-1 text-xs text-red-600">
                                {errors[item._id]}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-700">
                            {approvedItem.approvedQty || 0}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {isWarehouse ? (
                          <input
                            type="text"
                            value={approvedItem.approvedRemark || ''}
                            onChange={(e) =>
                              handleApprovedChange(
                                item._id,
                                'approvedRemark',
                                e.target.value
                              )
                            }
                            className="w-full min-w-[150px] rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        ) : (
                          <span className="text-gray-700">
                            {item.approvedRemark || ''}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {userCenterType === 'center' &&
                          isCenter &&
                          data.status === 'Shipped' ? (
                            <input
                              type="text"
                              value={receivedQtyValue}
                              onChange={(e) =>
                                handleReceiptChange(
                                  item.product?._id,
                                  'receivedQuantity',
                                  e.target.value
                                )
                              }
                              placeholder={String(item.approvedQuantity || 0)}
                              className="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          ) : (
                            <span className="text-gray-700">
                              {receivedQtyValue || 0}
                            </span>
                          )}

                          {item.product?.trackSerialNumber === 'Yes' &&
                            item.receivedQuantity > 0 && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenReceivedSerialModal(item)
                                }
                                title={`Received serial numbers (${
                                  item.transferredSerials?.length || 0
                                })`}
                                className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50"
                              >
                                <Info size={18} />
                              </button>
                            )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {userCenterType === 'center' &&
                        isCenter &&
                        data.status === 'Shipped' ? (
                          <input
                            type="text"
                            value={receivedRemarkValue}
                            onChange={(e) =>
                              handleReceiptChange(
                                item.product?._id,
                                'receivedRemark',
                                e.target.value
                              )
                            }
                            className="w-full min-w-[150px] rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        ) : (
                          <span className="text-gray-700">
                            {item.receivedRemark || ''}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={shouldShowExtraColumns ? 10 : 8}
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

      <SerialNumbers
        visible={serialModalVisible}
        onClose={() => setSerialModalVisible(false)}
        product={selectedProduct}
        approvedQty={
          Number(
            approvedProducts.find(
              (p) => p._id === selectedProduct?._id
            )?.approvedQty
          ) || 0
        }
        initialSerials={
          assignedSerials[selectedProduct?.product?._id] || []
        }
        onSerialNumbersUpdate={handleSerialNumbersUpdate}
        warehouseId={data?.warehouse?._id}
        resellerId={data?.stockSummary?.resellerId}
        resellerName={data?.stockSummary?.resellerName}
        data={data}
      />

      <ReceivedSerialNumbers
        visible={receivedSerialModal}
        onClose={() => setReceivedSerialModal(false)}
        product={selectedReceivedProduct}
      />

      <ChallanModal
        visible={challanModal}
        onClose={() => setChallanModal(false)}
        data={data}
      />

      <RejectionReasonModal
        visible={rejectionModal}
        onClose={() => setRejectionModal(false)}
        onSubmit={handleReject}
      />
    </div>
  );
};

export default StockProfile;
