
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Ban, Check, Printer, Truck, X, AlertCircle, Info, PackageCheck } from 'lucide-react';
import RejectionReasonModal from './RejectionReasonModal';
import axiosInstance from '../../axiosInstance';
import companyLogo from '../../assets/images/logo.png';
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
  const [shipmentModal, setShipmentModal] = useState(false);
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
  const userRole = (user?.role?.roleTitle || '').toLowerCase();
  const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
  const userCenterType = (userCenter.centerType || 'Outlet').toLowerCase();

  const userCenterId = userCenter._id;
  const isCenter = data?.center?._id === userCenterId;
  const isWarehouse = data?.warehouse?._id === userCenterId;

  const shouldShowExtraColumns = userCenterType !== 'center';

  const [shipmentData, setShipmentData] = useState({
    shippedDate: '',
    expectedDeliveryDate: '',
    shipmentDetails: '',
    shipmentRemark: '',
    documents: []
  });

  const { hasPermission } = usePermission();

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
        const response = await axiosInstance.get(`/stockrequest/${id}`);
        if (response.data.success) {
          const stockData = response.data.data;
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
      const response = await axiosInstance.post(`/stockrequest/${id}/ship`, shipmentData);
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Shipment created successfully', visible: true });
        setShipmentModal(false);
        try {
          await axiosInstance.patch(`/stockrequest/${id}/warehouse-challan-approval`, {
            warehouseChallanApproval: 'approved'
          });
        } catch (challanError) {
          console.error('Failed to auto-approve challan:', challanError);
        }
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setAlert({ type: 'danger', message: 'Failed to create shipment', visible: true });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'danger', message: 'Error creating shipment', visible: true });
    }
  };

  useEffect(() => {
    if (data?.products) {
      const initialReceipts = data.products.map(item => ({
        productId: item.product?._id,
        productTitle: item.product?.productTitle,
        receivedQuantity: item.receivedQuantity !== undefined && item.receivedQuantity !== null ? item.receivedQuantity : '',
        receivedRemark: item.receivedRemark || '',
      }));
      setProductReceipts(initialReceipts);
    }
  }, [data]);

  useEffect(() => {
    if (data?.status === 'Shipped' && userCenterType === 'center' && isCenter && data?.products && productReceipts.length > 0) {
      let needsUpdate = false;
      const updatedReceipts = productReceipts.map(receipt => {
        const product = data.products.find(p => p.product?._id === receipt.productId);
        if (product &&
            (receipt.receivedQuantity === undefined || receipt.receivedQuantity === null || receipt.receivedQuantity === '' || receipt.receivedQuantity === 0) &&
            product.approvedQuantity && product.approvedQuantity > 0) {
          needsUpdate = true;
          return { ...receipt, receivedQuantity: product.approvedQuantity };
        }
        return receipt;
      });
      if (needsUpdate) setProductReceipts(updatedReceipts);
    }
  }, [data, userCenterType, isCenter, productReceipts.length]);

  const handleReceiptChange = (productId, field, value) => {
    setProductReceipts(prev =>
      prev.map(p => (p.productId === productId ? { ...p, [field]: value } : p))
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
      prev.map(p => (p._id === productId ? { ...p, [field]: value } : p))
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
      const response = await axiosInstance.post(`/stockrequest/${id}/approve`, { productApprovals: payload });
      if (!response.data.success) {
        setAlert({ type: 'danger', message: response.data.message || 'Failed to approve request', visible: true });
        return;
      }
      setAlert({ type: 'success', message: 'Stock request approved successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || err.message || 'An unexpected error occurred', visible: true });
    }
  };

  const handleReject = async (rejectionReason) => {
    try {
      const response = await axiosInstance.put(`/stockrequest/${id}`, { status: 'Rejected', rejectionReason });
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Stock request rejected successfully', visible: true });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setAlert({ type: 'danger', message: 'Failed to reject request', visible: true });
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Error rejecting stock request', visible: true });
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
      setAlert({ type: 'danger', message: 'Error to submit data', visible: true });
    }
  };

  const handleChangeApprovedQty = async () => {
    let hasError = false;
    const payload = approvedProducts.map(p => {
      if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
        setErrors(prev => ({ ...prev, [p._id]: 'The input value was not a correct number' }));
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

    try {
      const response = await axiosInstance.patch(`/stockrequest/${id}/approved-quantities`, { productApprovals: payload });
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Approved quantities updated successfully', visible: true });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setAlert({ type: 'danger', message: response.data.message || 'Failed to update approved quantities', visible: true });
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Error updating approved quantities', visible: true });
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
      setAlert({ type: 'danger', message: 'Error canceling shipment', visible: true });
    }
  };

  const handleCompleteIndent = async () => {
    try {
      if (userCenterType === 'center') {
        const missingReceipts = productReceipts.filter(item =>
          item.receivedQuantity === undefined || item.receivedQuantity === null || item.receivedQuantity === '' || isNaN(Number(item.receivedQuantity))
        );
        if (missingReceipts.length > 0) {
          setAlert({ type: 'danger', message: 'Please enter received quantity for all products before completing the indent', visible: true });
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

      const response = await axiosInstance.post(`/stockrequest/${id}/complete`, { productReceipts: payload });
      if (!response.data.success) {
        setAlert({ type: 'danger', message: response.data.message || 'Failed to complete indent', visible: true });
        return;
      }
      setAlert({ type: 'success', message: 'Indent completed successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || err.message || 'An unexpected error occurred', visible: true });
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

    if (!result.isConfirmed) return;

    try {
      await handleCompleteIndent();
      await axiosInstance.patch(`/stockrequest/${id}/center-challan-approval`, { centerChallanApproval: 'approved' });
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
      setAlert({ type: 'danger', message: 'Error updating shipment', visible: true });
    }
  };

  const handleMarkIncomplete = async (remark) => {
    try {
      if (userCenterType === 'center') {
        const missingReceipts = productReceipts.filter(item =>
          item.receivedQuantity === undefined || item.receivedQuantity === null || item.receivedQuantity === '' || isNaN(Number(item.receivedQuantity))
        );
        if (missingReceipts.length > 0) {
          setAlert({ type: 'danger', message: 'Please enter received quantity for all products before marking as incomplete', visible: true });
          return;
        }
      }

      const receivedProducts = productReceipts.map(item => ({
        productId: item.productId,
        receivedQuantity: Number(item.receivedQuantity) || 0,
        receivedRemark: item.receivedRemark || '',
      }));

      const response = await axiosInstance.post(`/stockrequest/${id}/mark-incomplete`, { incompleteRemark: remark, receivedProducts });
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Stock request marked as incomplete', visible: true });
        setIncompleteModal(false);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setAlert({ type: 'danger', message: 'Failed to mark incomplete', visible: true });
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'Error marking incomplete', visible: true });
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Draft": return "border-[#d9dee4] bg-[#f1f3f5] text-[#555e68]";
      case "Submitted": return "border-[#00b0f0] bg-[#00b0f0] text-white";
      case "Confirmed": return "border-[#bfe4cb] bg-[#edf8f1] text-[#27844a]";
      case "Shipped": return "border-[#d8c8f0] bg-[#f0eafd] text-[#6944a7]";
      case "Completed": return "border-[#bfe4cb] bg-[#eaf7ee] text-[#27844a]";
      case "Rejected": return "border-[#efc4bf] bg-[#fff1ef] text-[#b63329]";
      case "Incompleted": return "border-[#ead49e] bg-[#fff6e5] text-[#9a6a12]";
      default: return "border-[#d9dee4] bg-[#f1f3f5] text-[#555e68]";
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
          ...(isSerialized && { approvedSerials: currentSerials.map(s => s.serialNumber).slice(0, Number(p.approvedQty)) })
        };
      });

      const receiptsPayload = productReceipts.map(r => ({
        productId: r.productId,
        receivedQuantity: Number(r.receivedQuantity) || 0,
        receivedRemark: r.receivedRemark || '',
      }));

      const response = await axiosInstance.patch(`/stockrequest/${id}/complete-incomplete`, {
        productApprovals: approvalsPayload,
        productReceipts: receiptsPayload,
      });
      if (!response.data.success) {
        setAlert({ type: 'danger', message: response.data.message || 'Failed to complete indent', visible: true });
        return;
      }
      setAlert({ type: 'success', message: 'Indent completed successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || err.message || 'An unexpected error occurred', visible: true });
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
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    let subtotal = 0;
    const gstRate = 18;

    const productsWithTotals = data.products.map(item => {
      const approvedQty = item.quantity || 0;
      const salePrice = item.product?.salePrice || 0;
      const total = approvedQty * salePrice;
      const gstAmount = (total * gstRate) / 100;
      const amountWithGst = total + gstAmount;
      subtotal += total;
      return { ...item, approvedQty, salePrice, total, gstAmount, amountWithGst };
    });

    const totalGst = (subtotal * gstRate) / 100;
    const grandTotal = subtotal + totalGst;
    const indentDate = data.date ? new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    const formatDateTime = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Indent Invoice - ${data.orderNumber || ''}</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
        <style>
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          :root { --ink: #0f1117; --ink-mid: #3a3f4b; --ink-light: #6b7280; --rule: #d1d5db; --rule-light: #e5e8ec; --accent: #1a56db; --accent-bg: #eff4ff; --surface: #f8f9fb; --white: #ffffff; --status-bg: #e8f5e9; --status-txt: #2e7d32; }
          body { font-family: 'DM Sans', sans-serif; background: #edf0f4; color: var(--ink); font-size: 13px; line-height: 1.5; padding: 32px 0 48px; }
          .page { width: 900px; margin: 0 auto; background: var(--white); border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
          .stripe { height: 5px; background: linear-gradient(90deg, var(--accent) 0%, #3b82f6 60%, #60a5fa 100%); }
          .header { display: flex; align-items: flex-start; justify-content: space-between; padding: 28px 36px 22px; border-bottom: 1px solid var(--rule-light); }
          .logo-wrap { width: 160px; height: 80px; display: flex; align-items: center; }
          .logo-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }
          .company-block { text-align: right; }
          .company-name { font-size: 16px; font-weight: 700; color: var(--ink); line-height: 1.3; margin-bottom: 6px; }
          .company-block p { font-size: 12px; color: var(--ink-mid); line-height: 1.6; }
          .title-band { background: var(--ink); padding: 12px 36px; display: flex; align-items: center; justify-content: space-between; }
          .title-band .doc-title { font-size: 15px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #fff; }
          .status-pill { display: inline-flex; align-items: center; gap: 6px; background: var(--status-bg); color: var(--status-txt); font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; }
          .status-pill::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--status-txt); flex-shrink: 0; }
          .meta-row { display: flex; gap: 0; border-bottom: 1px solid var(--rule-light); }
          .meta-cell { flex: 1; padding: 14px 36px; border-right: 1px solid var(--rule-light); }
          .meta-cell:last-child { border-right: none; }
          .meta-label { font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-light); margin-bottom: 3px; }
          .meta-value { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 500; color: var(--ink); }
          .address-row { display: grid; grid-template-columns: 1fr 1px 1fr; border-bottom: 1px solid var(--rule-light); }
          .address-divider { background: var(--rule-light); }
          .address-cell { padding: 20px 36px; }
          .address-cell .section-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); border-bottom: 2px solid var(--accent-bg); padding-bottom: 5px; margin-bottom: 10px; }
          .address-name { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
          .address-cell p { font-size: 12px; color: var(--ink-mid); line-height: 1.65; }
          .table-wrap { padding: 0 36px 28px; margin-top: 24px; }
          .table-heading { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-light); margin-bottom: 10px; }
          .products-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
          .products-table thead tr { background: var(--ink); }
          .products-table th { padding: 10px 12px; text-align: left; color: #fff; font-weight: 600; font-size: 11px; letter-spacing: .05em; text-transform: uppercase; white-space: nowrap; }
          .products-table th:not(:first-child) { text-align: right; }
          .products-table td { padding: 9px 12px; border-bottom: 1px solid var(--rule-light); color: var(--ink-mid); vertical-align: top; }
          .products-table td:not(:first-child):not(:nth-child(2)) { text-align: right; font-family: 'DM Mono', monospace; font-size: 12px; }
          .products-table td:nth-child(2) { color: var(--ink); font-weight: 500; }
          .products-table tbody tr:nth-child(even) td { background: var(--surface); }
          .products-table tbody tr:last-child td { border-bottom: none; }
          .products-table .amount-col { font-weight: 700; color: var(--ink); }
          .totals-row { display: flex; justify-content: flex-end; padding: 0 36px 24px; }
          .totals-box { width: 280px; border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; }
          .totals-line { display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; border-bottom: 1px solid var(--rule-light); font-size: 12.5px; }
          .totals-line:last-child { border-bottom: none; }
          .totals-line .t-label { color: var(--ink-mid); }
          .totals-line .t-val { font-family: 'DM Mono', monospace; color: var(--ink); font-weight: 500; }
          .totals-line.grand { background: var(--ink); color: #fff; }
          .totals-line.grand .t-label { color: #c8d0de; font-weight: 600; font-size: 12px; letter-spacing: .05em; text-transform: uppercase; }
          .totals-line.grand .t-val { color: #fff; font-size: 15px; font-weight: 700; }
          .info-section { padding: 0 36px 28px; }
          .info-grid { width: 100%; border-collapse: collapse; border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; font-size: 12.5px; }
          .info-grid td { padding: 9px 14px; border: 1px solid var(--rule-light); vertical-align: top; }
          .info-grid .lbl { font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--ink-light); background: var(--surface); white-space: nowrap; width: 14%; }
          .info-grid .val { color: var(--ink-mid); width: 36%; }
          .info-grid .val strong { color: var(--ink); }
          .sig-row { border-top: 1px solid var(--rule-light); padding: 24px 36px 28px; display: flex; justify-content: space-between; align-items: flex-end; }
          .sig-note { font-size: 11px; color: var(--ink-light); max-width: 360px; line-height: 1.7; }
          .sig-block { text-align: center; width: 180px; }
          .sig-line { border-top: 1.5px solid var(--ink-mid); padding-top: 8px; margin-top: 44px; font-size: 11.5px; font-weight: 600; color: var(--ink-mid); letter-spacing: .04em; text-transform: uppercase; }
          .btn-row { text-align: center; padding: 20px 0 8px; display: flex; gap: 12px; justify-content: center; }
          .btn { padding: 10px 28px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; border: none; border-radius: 5px; cursor: pointer; letter-spacing: .02em; transition: opacity .15s; }
          .btn:hover { opacity: .85; }
          .btn-primary { background: var(--accent); color: #fff; }
          .btn-ghost { background: var(--surface); color: var(--ink-mid); border: 1px solid var(--rule); }
          @media print { body { background: #fff; padding: 0; font-size: 11.5px; } .page { width: 100%; box-shadow: none; border: none; border-radius: 0; } .btn-row { display: none; } .products-table thead tr { background: var(--ink) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .title-band { background: var(--ink) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .info-grid .lbl { background: var(--surface) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .totals-line.grand { background: var(--ink) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .stripe { background: var(--accent) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="stripe"></div>
          <div class="header">
            <div class="logo-wrap"><img src="${logoPath}" alt="Company Logo"></div>
            <div class="company-block">
              <div class="company-name">Sancfil Technologies Internet Services Pvt Ltd</div>
              <p>A1, 1st Floor, Landmark Co-operative Housing Society</p>
              <p>Sector 14, Vashi, Navi Mumbai – 400 709</p>
              <p>Tel: +91 8097578100 / 8097578176</p>
              <p>stock@trunet.co.in</p>
            </div>
          </div>
          <div class="title-band">
            <span class="doc-title">Stock Indent</span>
            <span class="status-pill">${data.status || 'Pending'}</span>
          </div>
          <div class="meta-row">
            <div class="meta-cell"><div class="meta-label">Indent Number</div><div class="meta-value">${data.orderNumber || '—'}</div></div>
            <div class="meta-cell"><div class="meta-label">Indent Date</div><div class="meta-value">${indentDate || '—'}</div></div>
            <div class="meta-cell"><div class="meta-label">Print Date</div><div class="meta-value">${currentDate}</div></div>
          </div>
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
          <div class="totals-row">
            <div class="totals-box">
              <div class="totals-line"><span class="t-label">Subtotal</span><span class="t-val">₹ ${subtotal.toFixed(2)}</span></div>
              <div class="totals-line"><span class="t-label">GST @ ${gstRate}%</span><span class="t-val">₹ ${totalGst.toFixed(2)}</span></div>
              <div class="totals-line grand"><span class="t-label">Grand Total</span><span class="t-val">₹ ${grandTotal.toFixed(2)}</span></div>
            </div>
          </div>
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
          <div class="sig-row">
            <p class="sig-note">
              This is a computer-generated indent document.<br>
              Please verify all details before processing. For queries contact stock@trunet.co.in
            </p>
            <div class="sig-block"><div class="sig-line">Authorized Signatory</div></div>
          </div>
        </div>
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
      <div className="flex min-h-[50vh] items-center justify-center bg-[#f4f6f8]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#dfe3e8] border-t-[#2759A2]" />
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
      <div className="m-4 rounded-[4px] border border-[#ead49e] bg-[#fff8e8] px-4 py-3 text-sm text-[#9a6a12]">
        Stock Request not found
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-[#f4f6f8] px-4 py-4 sm:px-5 lg:px-8">
      {alert.visible && (
        <div
          className={`mb-5 flex items-start justify-between gap-4 rounded-[4px] border px-4 py-3 text-sm shadow-sm ${
            alert.type === 'success'
              ? 'border-[#bfe4cb] bg-[#edf8f1] text-[#27844a]'
              : 'border-[#efc4bf] bg-[#fff1ef] text-[#b63329]'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{alert.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlert({ ...alert, visible: false })}
            className="rounded p-1 text-[#59636f] transition hover:bg-black/5"
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-[25px] font-medium leading-tight text-[#252b33]">
            Indent Detail
          </h1>
        </div>
      </div>

      {/* Indent information */}
      <div className="mb-5 overflow-hidden rounded-[3px] border border-[#dfe3e8] border-t-[4px] border-t-[#2759A2] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-4 border-b border-[#e1e5e9] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[19px] font-semibold text-[#252a31]">
              Indent: {data.orderNumber || ''}
            </h2>
            {data.status && (
              <span
                className={`inline-flex items-center rounded-[5px] border px-3 py-1.5 text-[13px] font-semibold shadow-sm ${getStatusClasses(
                  data.status
                )}`}
              >
                {data.status}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {data.status === 'Shipped' && hasPermission('Indent', 'complete_indent') && (
              <button
                type="button"
                onClick={handleCompleteIndentWithChallan}
                className="inline-flex items-center gap-2 rounded-[4px] bg-[#4caf50] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#43a047]"
              >
                <Check size={16} />
                Complete The Indent
              </button>
            )}
            {/* PRINT INDENT BUTTON - MATCHES VIEW CHALLAN STYLE */}
            <button
              type="button"
              onClick={handlePrintIndent}
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"
            >
              <Printer size={16} />
              Print Indent
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-[15px]">
            <tbody>
              {[
                ['Center/Center Code:', data.orderNumber || '', 'Shipment Date:', formatDate(data.shippingInfo?.shippedDate || ''), 'Completed on:', formatDateTime(data.completionInfo?.completedOn || '')],
                ['Indent Date:', data.date || '', 'Expected Delivery:', formatDate(data.shippingInfo?.expectedDeliveryDate || ''), 'Completed by:', data.completionInfo?.completedBy?.fullName || ''],
                ['Remark:', data.remark || '', 'Shipment Detail:', data.shippingInfo?.shipmentDetails || '', 'Incomplete on:', formatDateTime(data.incompleteInfo?.incompleteOn || '')],
                ['Created at:', formatDateTime(data.createdAt), 'Shipment Remark:', data.shippingInfo?.shipmentRemark || '', 'Incomplete by:', data.incompleteInfo?.incompleteBy?.fullName || ''],
                ['Created by:', data.createdBy?.fullName || '', 'Document:', data.document || '', 'Incomplete Remark:', data.incompleteInfo?.incompleteRemark || ''],
                ['Approved at:', formatDateTime(data.approvalInfo?.approvedAt || ''), 'Shipped at:', formatDateTime(data.shippingInfo?.shippedAt || ''), data.status === 'Completed' ? 'Received at:' : data.status === 'Rejected' ? 'Rejected at:' : '', data.status === 'Completed' ? formatDateTime(data.receivingInfo?.receivedAt || '') : data.status === 'Rejected' ? formatDateTime(data.rejectionInfo?.rejectedAt || '') : ''],
                ['Approved by:', data.approvalInfo?.approvedBy?.fullName || '', 'Shipped by:', data.shippingInfo?.shippedBy?.fullName || '', data.status === 'Completed' ? 'Received by:' : data.status === 'Rejected' ? 'Rejected by:' : '', data.status === 'Completed' ? data.receivingInfo?.receivedBy?.fullName || '' : data.status === 'Rejected' ? data.rejectionInfo?.rejectedBy?.fullName || '' : ''],
                ['', '', '', '', data.status === 'Rejected' ? 'Rejected Remark:' : '', data.status === 'Rejected' ? data.rejectionInfo?.rejectionReason || '' : ''],
              ].map((row, index) => (
                <tr 
                  key={index} 
                  className="border-b border-[#e1e5e9] last:border-b-0 transition-colors duration-150 hover:bg-[#f0f4f8]"
                >
                  {row.map((cell, cellIndex) =>
                    cellIndex % 2 === 0 ? (
                      <td key={cellIndex} className="whitespace-nowrap border border-[#e1e5e9] bg-[#f1f3f5] px-4 py-3 text-[14px] font-bold text-[#252a31]">
                        {cell}
                      </td>
                    ) : (
                      <td key={cellIndex} className="min-w-[150px] border border-[#e1e5e9] px-4 py-3 text-[15px] text-[#3f4650]">
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
      <div className="overflow-hidden rounded-[3px] border border-[#dfe3e8] border-t-[4px] border-t-[#2759A2] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-4 border-b border-[#e1e5e9] px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-[19px] font-semibold text-[#252a31]">
            Product Details
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {data.status === 'Draft' && (
              <button type="button" onClick={handleSubmitRequest} className="inline-flex items-center gap-2 rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]">
                <Check size={16} /> Submit
              </button>
            )}

            {data.status === 'Confirmed' && userCenterType === 'outlet' && (userRole === 'admin' || userRole === 'superadmin') && isWarehouse && (
              <>
                <button type="button" onClick={handleChangeApprovedQty} className="rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]">Change Approved Qty</button>
                <button type="button" onClick={() => { setCurrentShipmentAction(() => handleShipGoods); setShipmentModal(true); }} className="inline-flex items-center gap-2 rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"><Truck size={16} /> Ship the Goods</button>
                <button type="button" onClick={openRejectionModal} className="rounded-[4px] bg-[#d32f2f] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b71c1c]">Reject Request</button>
              </>
            )}

           
{(data.status === 'Confirmed' ||
  data.status === 'Shipped' ||
  data.status === 'Incompleted' ||
  data.status === 'Completed') &&
  (isWarehouse || isCenter) && (
    <button
      type="button"
      onClick={() => setChallanModal(true)}
      className="inline-flex items-center gap-2 rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"
    >
      <PackageCheck size={16} />
      View Challan
    </button>
  )}


            {data.status === 'Shipped' && userCenterType === 'outlet' && (userRole === 'admin' || userRole === 'superadmin') && isWarehouse && (
              <>
                <button type="button" onClick={handleOpenUpdateShipment} className="inline-flex items-center gap-2 rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#214b89]"><Truck size={16} /> Update Shipment</button>
                <button type="button" onClick={handleCancelShipment} className="inline-flex items-center gap-2 rounded-[4px] bg-[#d32f2f] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b71c1c]"><Ban size={16} /> Cancel Shipment</button>
                <button type="button" onClick={openRejectionModal} className="rounded-[4px] bg-[#d32f2f] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b71c1c]">Reject Request</button>
              </>
            )}

            {data.status === 'Shipped' && userCenterType === 'center' && isCenter && (
              <button type="button" onClick={() => setIncompleteModal(true)} className="rounded-[4px] bg-[#d88916] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b96f0e]">Incomplete</button>
            )}

            {data.status === 'Submitted' && hasPermission('Indent', 'stock_transfer_approve_from_outlet') && isWarehouse && (
              <>
                <button type="button" onClick={handleApprove} className="rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#214b89]">Submit &amp; Approve Request</button>
                <button type="button" onClick={openRejectionModal} className="rounded-[4px] bg-[#d32f2f] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b71c1c]">Submit &amp; Reject Request</button>
              </>
            )}

            {data.status === 'Incompleted' && userCenterType === 'outlet' && (userRole === 'admin' || userRole === 'superadmin') && isWarehouse && (
              <button type="button" onClick={handleIncomplete} className="rounded-[4px] bg-[#4caf50] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#43a047]">Change Qty And Complete Request</button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse text-[14px]">
            <thead>
              <tr className="bg-[#f1f3f5] text-left text-[14px] font-bold text-[#252a31]">
                <th className="border border-[#dfe3e8] px-3.5 py-3.5 align-middle">Product</th>
                <th className="border border-[#dfe3e8] px-3.5 py-3.5 align-middle">Center Stock</th>
                <th className="border border-[#dfe3e8] px-3.5 py-3.5 align-middle">Requested Qty</th>
                {shouldShowExtraColumns && <th className="border border-[#dfe3e8] px-3.5 py-3.5 align-middle">Stock Qty</th>}
                {shouldShowExtraColumns && <th className="border border-[#dfe3e8] px-3.5 py-3.5 align-middle">Reseller Qty</th>}
                <th className="border border-[#dfe3e8] px-3.5 py-3.5 align-middle">Product Remark</th>
                <th className="border border-[#dfe3e8] px-3.5 py-3.5 align-middle">Approved Qty</th>
                <th className="border border-[#dfe3e8] px-3.5 py-3.5 align-middle">Approved Remark</th>
                <th className="border border-[#dfe3e8] px-3.5 py-3.5 align-middle">Received Qty</th>
                <th className="border border-[#dfe3e8] px-3.5 py-3.5 align-middle">Received Remark</th>
              </tr>
            </thead>

            <tbody>
              {data.products?.length > 0 ? (
                data.products.map((item) => {
                  const approvedItem = approvedProducts.find((p) => p._id === item._id) || {};
                  const currentReceipt = productReceipts.find((p) => p.productId === item.product?._id);
                  const receivedQtyValue = currentReceipt?.receivedQuantity !== undefined && currentReceipt?.receivedQuantity !== '' ? currentReceipt.receivedQuantity : '';
                  const receivedRemarkValue = currentReceipt?.receivedRemark !== undefined ? currentReceipt.receivedRemark : item.receivedRemark || '';
                  const approvedQty = approvedItem.approvedQty || item.approvedQuantity || 0;
                  const shouldShowMismatch = data.status === 'Incompleted' || data.status === 'Completed';
                  const isQuantityMismatch = shouldShowMismatch && Number(receivedQtyValue) !== Number(approvedQty);

                  return (
                    <tr 
                      key={item._id} 
                      className={`border-b border-[#e1e5e9] transition-colors duration-150 ${
                        isQuantityMismatch ? 'bg-[#fff1ef]' : 'hover:bg-[#f0f4f8]'
                      }`}
                    >
                      <td className="border border-[#e1e5e9] px-3.5 py-3.5 font-semibold text-[#252a31]">{item.product?.productTitle || ''}</td>
                      <td className="border border-[#e1e5e9] px-3.5 py-3.5 text-[#3f4650]">{item.centerStockQuantity || 0}</td>
                      <td className="border border-[#e1e5e9] px-3.5 py-3.5 text-[#3f4650]">{item.quantity || 0}</td>
                      {shouldShowExtraColumns && <td className="border border-[#e1e5e9] px-3.5 py-3.5 text-[#3f4650]">{item.outletStock?.availableQuantity || 0}</td>}
                      {shouldShowExtraColumns && <td className="border border-[#e1e5e9] px-3.5 py-3.5 text-[#3f4650]">{item.resellerStock?.availableQuantity || 0}</td>}
                      <td className="border border-[#e1e5e9] px-3.5 py-3.5 text-[#59636f]">{item.productRemark || ''}</td>

                      <td className="px-4 py-3">
                        {isWarehouse ? (
                          <div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={approvedItem.approvedQty ?? ''}
                                onChange={(e) => handleApprovedChange(item._id, 'approvedQty', e.target.value)}
                                onBlur={(e) => handleApprovedBlur(item._id, e.target.value)}
                                className={`w-20 rounded-[4px] border px-2.5 py-1.5 text-sm outline-none transition focus:ring-2 ${errors[item._id] ? 'border-[#d85a50] bg-[#fff1ef] focus:border-[#c9362b] focus:ring-[#c9362b]/10' : 'border-[#cfd5dc] focus:border-[#2759A2] focus:ring-[#2759A2]/10'}`}
                              />
                              {item.product?.trackSerialNumber === 'Yes' && (
                                <button type="button" onClick={() => handleOpenSerialModal(item)} title="Add Serial Numbers" className="rounded-[4px] p-1.5 text-[#2759A2] transition hover:bg-[#eaf1f9]">
                                  <Info size={18} />
                                </button>
                              )}
                            </div>
                            {errors[item._id] && <p className="mt-1 text-xs font-medium text-[#c9362b]">{errors[item._id]}</p>}
                          </div>
                        ) : (
                          <span className="text-[#3f4650]">{approvedItem.approvedQty || 0}</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {isWarehouse ? (
                          <input
                            type="text"
                            value={approvedItem.approvedRemark || ''}
                            onChange={(e) => handleApprovedChange(item._id, 'approvedRemark', e.target.value)}
                            className="w-full min-w-[150px] rounded-[4px] border border-[#cfd5dc] bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/10"
                          />
                        ) : (
                          <span className="text-[#3f4650]">{item.approvedRemark || ''}</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {userCenterType === 'center' && isCenter && data.status === 'Shipped' ? (
                            <input
                              type="text"
                              value={receivedQtyValue}
                              onChange={(e) => handleReceiptChange(item.product?._id, 'receivedQuantity', e.target.value)}
                              placeholder={String(item.approvedQuantity || 0)}
                              className="w-20 rounded-[4px] border border-[#cfd5dc] bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/10"
                            />
                          ) : (
                            <span className="text-[#3f4650]">{receivedQtyValue || 0}</span>
                          )}
                          {item.product?.trackSerialNumber === 'Yes' && item.receivedQuantity > 0 && (
                            <button type="button" onClick={() => handleOpenReceivedSerialModal(item)} title={`Received serial numbers (${item.transferredSerials?.length || 0})`} className="rounded-[4px] p-1.5 text-[#2759A2] transition hover:bg-[#eaf1f9]">
                              <Info size={18} />
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {userCenterType === 'center' && isCenter && data.status === 'Shipped' ? (
                          <input
                            type="text"
                            value={receivedRemarkValue}
                            onChange={(e) => handleReceiptChange(item.product?._id, 'receivedRemark', e.target.value)}
                            className="w-full min-w-[150px] rounded-[4px] border border-[#cfd5dc] bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/10"
                          />
                        ) : (
                          <span className="text-[#3f4650]">{item.receivedRemark || ''}</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={shouldShowExtraColumns ? 10 : 8} className="border border-[#e1e5e9] px-4 py-10 text-center text-sm text-[#69727d]">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ShipGoodsModal visible={shipmentModal} onClose={() => setShipmentModal(false)} onSubmit={currentShipmentAction} initialData={shipmentData} />
      <IncompleteRemarkModal visible={incompleteModal} onClose={() => setIncompleteModal(false)} onSubmit={handleMarkIncomplete} initialRemark={data.incompleteRemark} />
      <SerialNumbers
        visible={serialModalVisible}
        onClose={() => setSerialModalVisible(false)}
        product={selectedProduct}
        approvedQty={Number(approvedProducts.find((p) => p._id === selectedProduct?._id)?.approvedQty) || 0}
        initialSerials={assignedSerials[selectedProduct?.product?._id] || []}
        onSerialNumbersUpdate={handleSerialNumbersUpdate}
        warehouseId={data?.warehouse?._id}
        resellerId={data?.stockSummary?.resellerId}
        resellerName={data?.stockSummary?.resellerName}
        data={data}
      />
      <ReceivedSerialNumbers visible={receivedSerialModal} onClose={() => setReceivedSerialModal(false)} product={selectedReceivedProduct} />
      <ChallanModal visible={challanModal} onClose={() => setChallanModal(false)} data={data} />
      <RejectionReasonModal visible={rejectionModal} onClose={() => setRejectionModal(false)} onSubmit={handleReject} />
    </div>
  );
};

export default StockProfile;