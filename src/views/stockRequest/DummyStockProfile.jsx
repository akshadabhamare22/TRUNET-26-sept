// import React, { useEffect, useState } from "react";
// import {
//   ArrowLeft,
//   Check,
//   Eye,
//   Printer,
//   Truck,
//   X,
// } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import Swal from "sweetalert2";

// import axiosInstance from "../../axiosInstance";import { formatDate, formatDateTime } from "../../utils/FormatDateTime";
// import usePermission from "../../utils/usePermission";
// import { showError } from "../../utils/sweetAlerts";

// import ShipGoodsModal from "./ShipGoodsModal";
// import IncompleteRemarkModal from "./IncompleteRemarkModal";
// import SerialNumbers from "./SerialNumbers";
// import ChallanModal from "./ChallanModal";

// const StockProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [approvedProducts, setApprovedProducts] = useState([]);
//   const [alert, setAlert] = useState({
//     type: "",
//     message: "",
//     visible: false,
//   });

//   const [shipmentModal, setShipmentModal] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [currentShipmentAction, setCurrentShipmentAction] =
//     useState(null);
//   const [incompleteModal, setIncompleteModal] = useState(false);

//   const [productReceipts, setProductReceipts] = useState([]);
//   const [serialModalVisible, setSerialModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [assignedSerials, setAssignedSerials] = useState({});
//   const [challanModal, setChallanModal] = useState(false);

//   const user = JSON.parse(localStorage.getItem("user")) || {};
//   const userRole = (
//     user?.role?.roleTitle || ""
//   ).toLowerCase();

//   const userCenter =
//     JSON.parse(localStorage.getItem("userCenter")) || {};

//   const userCenterType = (
//     userCenter.centerType || "Outlet"
//   ).toLowerCase();

//   const userCenterId = userCenter._id;

//   const isCenter = data?.center?._id === userCenterId;
//   const isWarehouse = data?.warehouse?._id === userCenterId;

//   const [shipmentData, setShipmentData] = useState({
//     shippedDate: "",
//     expectedDeliveryDate: "",
//     shipmentDetails: "",
//     shipmentRemark: "",
//     documents: [],
//   });

//   const { hasPermission } = usePermission();

//   // =====================================================
//   // Serial Numbers
//   // =====================================================

//   const handleOpenSerialModal = (product) => {
//     setSelectedProduct(product);
//     setSerialModalVisible(true);
//   };

//   const handleSerialNumbersUpdate = (
//     productId,
//     serialsArray,
//   ) => {
//     setAssignedSerials((prev) => ({
//       ...prev,
//       [productId]: serialsArray,
//     }));
//   };

//   // =====================================================
//   // Fetch Stock Request
//   // =====================================================

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await axiosInstance.get(
//           `/stockrequest/${id}`,
//         );

//         if (response.data.success) {
//           const stockData = response.data.data;

//           setData(stockData);

//           const initialApproved =
//             stockData.products.map((item) => ({
//               _id: item._id,
//               productId: item.product?._id,
//               approvedQty:
//                 item.approvedQuantity !== undefined &&
//                 item.approvedQuantity !== null
//                   ? item.approvedQuantity
//                   : item.quantity || "",
//               approvedRemark:
//                 item.approvedRemark || "",
//             }));

//           setApprovedProducts(initialApproved);

//           const initialSerials = {};

//           stockData.products.forEach((item) => {
//             if (
//               item.product?.trackSerialNumber === "Yes" &&
//               item.approvedSerials?.length > 0
//             ) {
//               initialSerials[item.product._id] =
//                 item.approvedSerials.map((sn) => ({
//                   serialNumber: sn,
//                 }));
//             }
//           });

//           setAssignedSerials(initialSerials);
//         } else {
//           throw new Error(
//             "Failed to fetch data",
//           );
//         }
//       } catch (err) {
//         setError(err.message);
//         console.error(
//           "Error fetching stock request:",
//           err,
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchData();
//     }
//   }, [id]);

//   // =====================================================
//   // Shipment
//   // =====================================================

//   const handleShipGoods = async (
//     shipmentDataPayload,
//   ) => {
//     try {
//       const response = await axiosInstance.post(
//         `/stockrequest/${id}/ship`,
//         shipmentDataPayload,
//       );

//       if (response.data.success) {
//         setAlert({
//           type: "success",
//           message:
//             "Shipment created successfully",
//           visible: true,
//         });

//         setShipmentModal(false);

//         try {
//           await axiosInstance.patch(
//             `/stockrequest/${id}/warehouse-challan-approval`,
//             {
//               warehouseChallanApproval:
//                 "approved",
//             },
//           );

//           console.log(
//             "Challan auto-approved after shipment",
//           );
//         } catch (challanError) {
//           console.error(
//             "Failed to auto-approve challan:",
//             challanError,
//           );
//         }

//         setTimeout(
//           () => window.location.reload(),
//           1000,
//         );
//       } else {
//         setAlert({
//           type: "danger",
//           message:
//             "Failed to create shipment",
//           visible: true,
//         });
//       }
//     } catch (err) {
//       console.error(err);

//       setAlert({
//         type: "danger",
//         message:
//           "Error creating shipment",
//         visible: true,
//       });
//     }
//   };

//   const handleBack = () => {
//     navigate("/stock-request");
//   };

//   // =====================================================
//   // Product Receipts
//   // =====================================================

//   useEffect(() => {
//     if (data?.products) {
//       const initialReceipts =
//         data.products.map((item) => ({
//           productId: item.product?._id,
//           receivedQuantity:
//             item.receivedQuantity || 0,
//           receivedRemark:
//             item.receivedRemark,
//         }));

//       setProductReceipts(initialReceipts);
//     }
//   }, [data]);

//   const handleReceiptChange = (
//     productId,
//     field,
//     value,
//   ) => {
//     setProductReceipts((prev) =>
//       prev.map((product) =>
//         product.productId === productId
//           ? {
//               ...product,
//               [field]: value,
//             }
//           : product,
//       ),
//     );
//   };

//   // =====================================================
//   // Approved Quantity
//   // =====================================================

//   const handleApprovedChange = (
//     productId,
//     field,
//     value,
//   ) => {
//     if (field === "approvedQty") {
//       if (
//         value === "" ||
//         /^\d+$/.test(value)
//       ) {
//         setErrors((prev) => ({
//           ...prev,
//           [productId]: undefined,
//         }));
//       } else {
//         setErrors((prev) => ({
//           ...prev,
//           [productId]:
//             "The input value was not a correct number",
//         }));
//       }
//     }

//     setApprovedProducts((prev) =>
//       prev.map((product) =>
//         product._id === productId
//           ? {
//               ...product,
//               [field]: value,
//             }
//           : product,
//       ),
//     );
//   };

//   // =====================================================
//   // Approve Request
//   // =====================================================

//   const handleApprove = async () => {
//     let hasError = false;

//     const payload = approvedProducts.map(
//       (product) => {
//         if (
//           product.approvedQty === "" ||
//           !/^\d+$/.test(
//             product.approvedQty,
//           )
//         ) {
//           setErrors((prev) => ({
//             ...prev,
//             [product._id]:
//               "The input value was not a correct number",
//           }));

//           hasError = true;
//         }

//         return {
//           productId: product.productId,
//           approvedQuantity: Number(
//             product.approvedQty,
//           ),
//           approvedRemark:
//             product.approvedRemark || "",
//           approvedSerials: (
//             assignedSerials[
//               product.productId
//             ] || []
//           ).map(
//             (serial) =>
//               serial.serialNumber,
//           ),
//         };
//       },
//     );

//     if (hasError) {
//       return;
//     }

//     try {
//       const response =
//         await axiosInstance.post(
//           `/stockrequest/${id}/approve`,
//           {
//             productApprovals: payload,
//           },
//         );

//       if (!response.data.success) {
//         setAlert({
//           type: "danger",
//           message:
//             response.data.message ||
//             "Failed to approve request",
//           visible: true,
//         });

//         return;
//       }

//       setAlert({
//         type: "success",
//         message:
//           "Stock request approved successfully",
//         visible: true,
//       });

//       setTimeout(
//         () => window.location.reload(),
//         1000,
//       );
//     } catch (err) {
//       console.error(err);

//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         "An unexpected error occurred";

//       setAlert({
//         type: "danger",
//         message: errorMessage,
//         visible: true,
//       });
//     }
//   };

//   // =====================================================
//   // Reject
//   // =====================================================

//   const handleReject = async () => {
//     try {
//       const response =
//         await axiosInstance.put(
//           `/stockrequest/${id}`,
//           {
//             status: "Rejected",
//           },
//         );

//       if (response.data.success) {
//         setAlert({
//           type: "success",
//           message:
//             "Stock request rejected successfully",
//           visible: true,
//         });

//         setTimeout(
//           () => window.location.reload(),
//           1000,
//         );
//       } else {
//         setAlert({
//           type: "danger",
//           message:
//             "Failed to reject request",
//           visible: true,
//         });
//       }
//     } catch (err) {
//       console.error(err);

//       setAlert({
//         type: "danger",
//         message:
//           "Error rejecting stock request",
//         visible: true,
//       });
//     }
//   };

//   // =====================================================
//   // Submit
//   // =====================================================

//   const handleSubmitRequest =
//     async () => {
//       try {
//         const response =
//           await axiosInstance.put(
//             `/stockrequest/${id}`,
//             {
//               status: "Submitted",
//             },
//           );

//         if (response.data.success) {
//           setAlert({
//             type: "success",
//             message:
//               "Data submitted successfully",
//             visible: true,
//           });

//           setTimeout(
//             () => window.location.reload(),
//             1000,
//           );
//         } else {
//           setAlert({
//             type: "danger",
//             message: "Failed to submit",
//             visible: true,
//           });
//         }
//       } catch (err) {
//         console.error(err);

//         setAlert({
//           type: "danger",
//           message:
//             "Error to submit data",
//           visible: true,
//         });
//       }
//     };

//   // =====================================================
//   // Change Approved Quantity
//   // =====================================================

//   const handleChangeApprovedQty =
//     async () => {
//       let hasError = false;

//       const payload =
//         approvedProducts.map(
//           (product) => {
//             if (
//               product.approvedQty === "" ||
//               !/^\d+$/.test(
//                 product.approvedQty,
//               )
//             ) {
//               setErrors((prev) => ({
//                 ...prev,
//                 [product._id]:
//                   "The input value was not a correct number",
//               }));

//               hasError = true;
//             }

//             return {
//               productId:
//                 product.productId,
//               approvedQuantity:
//                 Number(
//                   product.approvedQty,
//                 ),
//               approvedRemark:
//                 product.approvedRemark ||
//                 "",
//               approvedSerials: (
//                 assignedSerials[
//                   product.productId
//                 ] || []
//               ).map(
//                 (serial) =>
//                   serial.serialNumber,
//               ),
//             };
//           },
//         );

//       if (hasError) {
//         return;
//       }

//       console.log(
//         "Final payload sent to API:",
//         payload,
//       );

//       try {
//         const response =
//           await axiosInstance.patch(
//             `/stockrequest/${id}/approved-quantities`,
//             {
//               productApprovals:
//                 payload,
//             },
//           );

//         if (response.data.success) {
//           setAlert({
//             type: "success",
//             message:
//               "Approved quantities updated successfully",
//             visible: true,
//           });

//           setTimeout(
//             () => window.location.reload(),
//             1000,
//           );
//         } else {
//           setAlert({
//             type: "danger",
//             message:
//               response.data.message ||
//               "Failed to update approved quantities",
//             visible: true,
//           });
//         }
//       } catch (err) {
//         console.error(err);

//         const backendMessage =
//           err.response?.data?.message ||
//           "Error updating approved quantities";

//         setAlert({
//           type: "danger",
//           message: backendMessage,
//           visible: true,
//         });
//       }
//     };

//   // =====================================================
//   // Cancel Shipment
//   // =====================================================

//   const handleCancelShipment =
//     async () => {
//       try {
//         const response =
//           await axiosInstance.post(
//             `/stockrequest/${id}/reject-shipment`,
//           );

//         if (response.data.success) {
//           setAlert({
//             type: "success",
//             message:
//               "Shipment canceled successfully",
//             visible: true,
//           });

//           setTimeout(
//             () => window.location.reload(),
//             1000,
//           );
//         } else {
//           setAlert({
//             type: "danger",
//             message:
//               "Failed to cancel shipment",
//             visible: true,
//           });
//         }
//       } catch (err) {
//         console.error(err);

//         setAlert({
//           type: "danger",
//           message:
//             "Error canceling shipment",
//           visible: true,
//         });
//       }
//     };

//   // =====================================================
//   // Complete Indent
//   // =====================================================

//   const handleCompleteIndent =
//     async () => {
//       try {
//         let payload = [];

//         if (isCenter) {
//           payload =
//             productReceipts.map(
//               (item) => ({
//                 productId:
//                   item.productId,
//                 receivedQuantity:
//                   Number(
//                     item.receivedQuantity,
//                   ) || 0,
//                 receivedRemark:
//                   item.receivedRemark ||
//                   "",
//               }),
//             );
//         } else {
//           payload =
//             data.products.map(
//               (item) => ({
//                 productId:
//                   item.product?._id,
//                 receivedQuantity:
//                   item.approvedQuantity ||
//                   item.receivedQuantity ||
//                   0,
//                 receivedRemark:
//                   item.receivedRemark ||
//                   "",
//               }),
//             );
//         }

//         const response =
//           await axiosInstance.post(
//             `/stockrequest/${id}/complete`,
//             {
//               productReceipts: payload,
//             },
//           );

//         if (!response.data.success) {
//           setAlert({
//             type: "danger",
//             message:
//               response.data.message ||
//               "Failed to complete indent",
//             visible: true,
//           });

//           return;
//         }

//         setAlert({
//           type: "success",
//           message:
//             "Indent completed successfully",
//           visible: true,
//         });

//         setTimeout(
//           () => window.location.reload(),
//           1000,
//         );
//       } catch (err) {
//         console.error(
//           "Error in handleCompleteIndent:",
//           err,
//         );

//         const errorMessage =
//           err.response?.data?.message ||
//           err.message ||
//           "An unexpected error occurred while completing the indent";

//         setAlert({
//           type: "danger",
//           message: errorMessage,
//           visible: true,
//         });
//       }
//     };

//   // =====================================================
//   // Update Shipment
//   // =====================================================

//   const handleOpenUpdateShipment =
//     () => {
//       if (data.shippingInfo) {
//         setShipmentData({
//           shippedDate:
//             data.shippingInfo.shippedDate?.split(
//               "T",
//             )[0] || "",

//           expectedDeliveryDate:
//             data.shippingInfo.expectedDeliveryDate?.split(
//               "T",
//             )[0] || "",

//           shipmentDetails:
//             data.shippingInfo
//               .shipmentDetails || "",

//           shipmentRemark:
//             data.shippingInfo
//               .shipmentRemark || "",

//           documents:
//             data.shippingInfo.documents ||
//             [],
//         });
//       }

//       setCurrentShipmentAction(
//         () => handleUpdateShipment,
//       );

//       setShipmentModal(true);
//     };

//   const handleUpdateShipment =
//     async (shipmentDataPayload) => {
//       try {
//         const response =
//           await axiosInstance.patch(
//             `/stockrequest/${id}/shipping-info`,
//             shipmentDataPayload,
//           );

//         if (response.data.success) {
//           setAlert({
//             type: "success",
//             message:
//               "Shipment updated successfully",
//             visible: true,
//           });

//           setShipmentModal(false);

//           setTimeout(
//             () => window.location.reload(),
//             1000,
//           );
//         } else {
//           setAlert({
//             type: "danger",
//             message:
//               "Failed to update shipment",
//             visible: true,
//           });
//         }
//       } catch (err) {
//         console.error(err);

//         setAlert({
//           type: "danger",
//           message:
//             "Error updating shipment",
//           visible: true,
//         });
//       }
//     };

//   // =====================================================
//   // Mark Incomplete
//   // =====================================================

//   const handleMarkIncomplete =
//     async (remark) => {
//       try {
//         const receivedProducts =
//           productReceipts.map(
//             (item) => ({
//               productId:
//                 item.productId,
//               receivedQuantity:
//                 Number(
//                   item.receivedQuantity,
//                 ) || 0,
//               receivedRemark:
//                 item.receivedRemark ||
//                 "",
//             }),
//           );

//         const payload = {
//           incompleteRemark: remark,
//           receivedProducts,
//         };

//         console.log(
//           "Incomplete Payload:",
//           payload,
//         );

//         const response =
//           await axiosInstance.post(
//             `/stockrequest/${id}/mark-incomplete`,
//             payload,
//           );

//         if (response.data.success) {
//           setAlert({
//             type: "success",
//             message:
//               "Stock request marked as incomplete",
//             visible: true,
//           });

//           setIncompleteModal(false);

//           setTimeout(
//             () => window.location.reload(),
//             1000,
//           );
//         } else {
//           setAlert({
//             type: "danger",
//             message:
//               "Failed to mark incomplete",
//             visible: true,
//           });
//         }
//       } catch (err) {
//         console.error(err);

//         setAlert({
//           type: "danger",
//           message:
//             "Error marking incomplete",
//           visible: true,
//         });
//       }
//     };

//   // =====================================================
//   // Complete Incomplete Request
//   // =====================================================

//   const handleIncomplete =
//     async () => {
//       try {
//         const approvalsPayload =
//           approvedProducts.map(
//             (product) => ({
//               productId:
//                 product.productId,
//               approvedQuantity:
//                 Number(
//                   product.approvedQty,
//                 ) || 0,
//               approvedRemark:
//                 product.approvedRemark ||
//                 "",
//             }),
//           );

//         const receiptsPayload =
//           productReceipts.map(
//             (receipt) => ({
//               productId:
//                 receipt.productId,
//               receivedQuantity:
//                 Number(
//                   receipt.receivedQuantity,
//                 ) || 0,
//               receivedRemark:
//                 receipt.receivedRemark ||
//                 "",
//             }),
//           );

//         console.log(
//           "Final Incomplete Payload:",
//           {
//             productApprovals:
//               approvalsPayload,
//             productReceipts:
//               receiptsPayload,
//           },
//         );

//         const response =
//           await axiosInstance.patch(
//             `/stockrequest/${id}/complete-incomplete`,
//             {
//               productApprovals:
//                 approvalsPayload,
//               productReceipts:
//                 receiptsPayload,
//             },
//           );

//         if (!response.data.success) {
//           setAlert({
//             type: "danger",
//             message:
//               response.data.message ||
//               "Failed to complete indent",
//             visible: true,
//           });

//           return;
//         }

//         setAlert({
//           type: "success",
//           message:
//             "Indent completed successfully",
//           visible: true,
//         });

//         setTimeout(
//           () => window.location.reload(),
//           1000,
//         );
//       } catch (err) {
//         console.error(
//           "Error in handleIncomplete:",
//           err,
//         );

//         const errorMessage =
//           err.response?.data?.message ||
//           err.message ||
//           "An unexpected error occurred while completing the indent";

//         setAlert({
//           type: "danger",
//           message: errorMessage,
//           visible: true,
//         });
//       }
//     };

//   // =====================================================
//   // Warehouse Challan Approval
//   // =====================================================

//   const handleWarehouseApproveChallan =
//     async () => {
//       const result =
//         await Swal.fire({
//           title: "Are you sure?",
//           text: "Do you want to approve this challan?",
//           icon: "question",
//           showCancelButton: true,
//           confirmButtonColor: "#dc3545",
//           cancelButtonColor: "#6c757d",
//           confirmButtonText:
//             "Yes, approve it!",
//           cancelButtonText: "Cancel",
//           reverseButtons: false,
//         });

//       if (!result.isConfirmed) {
//         return;
//       }

//       try {
//         const response =
//           await axiosInstance.patch(
//             `/stockrequest/${id}/warehouse-challan-approval`,
//             {
//               warehouseChallanApproval:
//                 "approved",
//             },
//           );

//         if (response.data.success) {
//           await Swal.fire({
//             title: "Approved!",
//             text: "Challan has been approved successfully.",
//             icon: "success",
//             confirmButtonColor:
//               "#3085d6",
//             confirmButtonText: "OK",
//           });

//           window.location.reload();
//         } else {
//           await Swal.fire({
//             title: "Failed!",
//             text:
//               response.data.message ||
//               "Failed to approve challan",
//             icon: "error",
//             confirmButtonColor: "#d33",
//             confirmButtonText: "OK",
//           });
//         }
//       } catch (err) {
//         console.error(
//           "Challan approval error:",
//           err,
//         );

//         showError(err);
//       }
//     };

//   // =====================================================
//   // Center Challan Approval
//   // =====================================================

//   const handleCenterApproveChallan =
//     async () => {
//       const result =
//         await Swal.fire({
//           title: "Are you sure?",
//           text: "Do you want to approve this challan?",
//           icon: "question",
//           showCancelButton: true,
//           confirmButtonColor: "#dc3545",
//           cancelButtonColor: "#6c757d",
//           confirmButtonText:
//             "Yes, approve it!",
//           cancelButtonText: "Cancel",
//           reverseButtons: false,
//         });

//       if (!result.isConfirmed) {
//         return;
//       }

//       try {
//         const response =
//           await axiosInstance.patch(
//             `/stockrequest/${id}/center-challan-approval`,
//             {
//               centerChallanApproval:
//                 "approved",
//             },
//           );

//         if (response.data.success) {
//           await Swal.fire({
//             title: "Approved!",
//             text: "Challan has been approved successfully.",
//             icon: "success",
//             confirmButtonColor:
//               "#3085d6",
//             confirmButtonText: "OK",
//           });

//           window.location.reload();
//         } else {
//           await Swal.fire({
//             title: "Failed!",
//             text:
//               response.data.message ||
//               "Failed to approve challan",
//             icon: "error",
//             confirmButtonColor: "#d33",
//             confirmButtonText: "OK",
//           });
//         }
//       } catch (err) {
//         console.error(
//           "Challan approval error:",
//           err,
//         );

//         showError(err);
//       }
//     };

//   // =====================================================
//   // Approved Quantity Validation
//   // =====================================================

//   const handleApprovedBlur = (
//     productId,
//     value,
//   ) => {
//     if (
//       value === "" ||
//       !/^\d+$/.test(value)
//     ) {
//       setErrors((prev) => ({
//         ...prev,
//         [productId]:
//           "The input value was not a correct number",
//       }));
//     }
//   };

//   // =====================================================
//   // Loading
//   // =====================================================

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   // =====================================================
//   // Error
//   // =====================================================

//   if (error) {
//     return (
//       <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         Error loading stock request:{" "}
//         {error}
//       </div>
//     );
//   }

//   // =====================================================
//   // No Data
//   // =====================================================

//   if (!data) {
//     return (
//       <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
//         Stock Request not found
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {/* Alert */}
//       {alert.visible && (
//         <div
//           className={`mb-4 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
//             alert.type === "success"
//               ? "border-green-200 bg-green-50 text-green-700"
//               : "border-red-200 bg-red-50 text-red-700"
//           }`}
//         >
//           <span>{alert.message}</span>

//           <button
//             type="button"
//             onClick={() =>
//               setAlert({
//                 ...alert,
//                 visible: false,
//               })
//             }
//             className="rounded p-1 transition hover:bg-black/5"
//           >
//             <X size={17} />
//           </button>
//         </div>
//       )}

//       {/* Page Title */}
//       <div className="mb-4 flex items-center">
//         <button
//           type="button"
//           onClick={handleBack}
//           className="mr-3 inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>

//         <h1 className="text-xl font-semibold text-gray-800">
//           Indent Detail
//         </h1>
//       </div>

//       {/* =================================================
//           Indent Information
//       ================================================= */}

//       <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Header */}
//         <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
//           <div className="flex items-center gap-3">
//             <h2 className="text-base font-semibold text-gray-800">
//               Indent:{" "}
//               {data.orderNumber || ""}
//             </h2>

//             {data.status && (
//               <StatusBadge
//                 status={data.status}
//               />
//             )}
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             {data.status ===
//               "Shipped" &&
//               hasPermission(
//                 "Indent",
//                 "complete_indent",
//               ) && (
//                 <button
//                   type="button"
//                   onClick={
//                     handleCompleteIndent
//                   }
//                   className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                 >
//                   Complete The Indent
//                 </button>
//               )}

//             <button
//               type="button"
//               className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//             >
//               <Printer size={15} />
//               Print Indent
//             </button>
//           </div>
//         </div>

//         {/* Details */}
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1000px] border-collapse text-sm">
//             <tbody>
//               <DetailRow
//                 items={[
//                   [
//                     "Center/Center Code:",
//                     data.orderNumber || "",
//                   ],
//                   [
//                     "Shipment Date:",
//                     formatDate(
//                       data.shippingInfo
//                         ?.shippedDate || "",
//                     ),
//                   ],
//                   [
//                     "Completed on:",
//                     formatDateTime(
//                       data.completionInfo
//                         ?.completedOn || "",
//                     ),
//                   ],
//                 ]}
//               />

//               <DetailRow
//                 items={[
//                   [
//                     "Indent Date:",
//                     data.date || "",
//                   ],
//                   [
//                     "Expected Delivery:",
//                     formatDate(
//                       data.shippingInfo
//                         ?.expectedDeliveryDate ||
//                         "",
//                     ),
//                   ],
//                   [
//                     "Completed by:",
//                     data.completionInfo
//                       ?.completedBy
//                       ?.fullName || "",
//                   ],
//                 ]}
//               />

//               <DetailRow
//                 items={[
//                   [
//                     "Remark:",
//                     data.remark || "",
//                   ],
//                   [
//                     "Shipment Detail:",
//                     data.shippingInfo
//                       ?.shipmentDetails ||
//                       "",
//                   ],
//                   [
//                     "Incomplete on:",
//                     formatDateTime(
//                       data.incompleteOn ||
//                         "",
//                     ),
//                   ],
//                 ]}
//               />

//               <DetailRow
//                 items={[
//                   [
//                     "Created at:",
//                     formatDateTime(
//                       data.createdAt,
//                     ),
//                   ],
//                   [
//                     "Shipment Remark:",
//                     data.shippingInfo
//                       ?.shipmentRemark ||
//                       "",
//                   ],
//                   [
//                     "Incomplete by:",
//                     data.incompleteBy ||
//                       "",
//                   ],
//                 ]}
//               />

//               <DetailRow
//                 items={[
//                   [
//                     "Created by:",
//                     data.createdBy
//                       ?.fullName || "",
//                   ],
//                   [
//                     "Document:",
//                     data.document || "",
//                   ],
//                   [
//                     "Incomplete Remark:",
//                     data.incompleteRemark ||
//                       "",
//                   ],
//                 ]}
//               />

//               <DetailRow
//                 items={[
//                   [
//                     "Approved at:",
//                     formatDateTime(
//                       data.approvalInfo
//                         ?.approvedAt || "",
//                     ),
//                   ],
//                   [
//                     "Shipped at:",
//                     formatDateTime(
//                       data.shippingInfo
//                         ?.shippedAt || "",
//                     ),
//                   ],
//                   [
//                     "Received at:",
//                     formatDateTime(
//                       data.receivingInfo
//                         ?.receivedAt || "",
//                     ),
//                   ],
//                 ]}
//               />

//               <DetailRow
//                 items={[
//                   [
//                     "Approved by:",
//                     data.approvalInfo
//                       ?.approvedBy
//                       ?.fullName || "",
//                   ],
//                   [
//                     "Shipped by:",
//                     data.shippingInfo
//                       ?.shippedBy
//                       ?.fullName || "",
//                   ],
//                   [
//                     "Received by:",
//                     data.receivingInfo
//                       ?.receivedBy
//                       ?.fullName || "",
//                   ],
//                 ]}
//               />

//               <DetailRow
//                 items={[
//                   [
//                     "Challan Approved at:",
//                     formatDateTime(
//                       data.approvalInfo
//                         ?.challanApprovedAt ||
//                         "",
//                     ),
//                   ],
//                   [
//                     "Challan Approved by:",
//                     <span
//                       key="challan-approved-by"
//                       className="whitespace-pre-line"
//                     >
//                       {data.approvalInfo
//                         ?.challanApprovedBy
//                         ?.fullName || ""}
//                       {"\n"}
//                       {data.approvalInfo
//                         ?.challanApprovedBy
//                         ?.email || ""}
//                     </span>,
//                   ],
//                 ]}
//               />
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* =================================================
//           Product Details
//       ================================================= */}

//       <div className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//         {/* Product Header */}
//         <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
//           <h2 className="text-base font-semibold text-gray-800">
//             Product Details
//           </h2>

//           <div className="flex flex-wrap items-center gap-2">
//             {/* Draft */}
//             {data.status === "Draft" && (
//               <button
//                 type="button"
//                 onClick={
//                   handleSubmitRequest
//                 }
//                 className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//               >
//                 Submit
//               </button>
//             )}

//             {/* Confirmed - Warehouse Admin */}
//             {data.status ===
//               "Confirmed" &&
//               userCenterType ===
//                 "outlet" &&
//               userRole === "admin" &&
//               isWarehouse && (
//                 <>
//                   <button
//                     type="button"
//                     onClick={
//                       handleChangeApprovedQty
//                     }
//                     className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   >
//                     Change Approved Qty
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       setCurrentShipmentAction(
//                         () =>
//                           handleShipGoods,
//                       );
//                       setShipmentModal(
//                         true,
//                       );
//                     }}
//                     className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   >
//                     <Truck size={15} />
//                     Ship the Goods
//                   </button>

//                   <button
//                     type="button"
//                     onClick={
//                       handleReject
//                     }
//                     className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
//                   >
//                     Reject Request
//                   </button>
//                 </>
//               )}

//             {/* View Challan */}
//             {(data.status ===
//               "Confirmed" ||
//               data.status ===
//                 "Shipped") &&
//               isWarehouse && (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setChallanModal(true)
//                   }
//                   className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                 >
//                   <Eye size={15} />
//                   View Challan
//                 </button>
//               )}

//             {/* Shipped - Center */}
//             {data.status ===
//               "Shipped" &&
//               isCenter && (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setChallanModal(
//                         true,
//                       )
//                     }
//                     className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   >
//                     <Eye size={15} />
//                     View Challan
//                   </button>

//                   <button
//                     type="button"
//                     onClick={
//                       handleCenterApproveChallan
//                     }
//                     className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   >
//                     Approved Challan
//                   </button>
//                 </>
//               )}

//             {/* Shipped - Warehouse Admin */}
//             {data.status ===
//               "Shipped" &&
//               userCenterType ===
//                 "outlet" &&
//               userRole === "admin" &&
//               isWarehouse && (
//                 <>
//                   <button
//                     type="button"
//                     onClick={
//                       handleOpenUpdateShipment
//                     }
//                     className="rounded-md bg-yellow-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-yellow-600"
//                   >
//                     Update Shipment
//                   </button>

//                   <button
//                     type="button"
//                     onClick={
//                       handleCancelShipment
//                     }
//                     className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
//                   >
//                     Cancel Shipment
//                   </button>

//                   <button
//                     type="button"
//                     onClick={
//                       handleReject
//                     }
//                     className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
//                   >
//                     Reject Request
//                   </button>
//                 </>
//               )}

//             {/* Shipped - Center Admin */}
//             {data.status ===
//               "Shipped" &&
//               userCenterType ===
//                 "center" &&
//               userRole ===
//                 "center" &&
//               isCenter && (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setIncompleteModal(
//                       true,
//                     )
//                   }
//                   className="rounded-md bg-yellow-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-yellow-600"
//                 >
//                   Incomplete
//                 </button>
//               )}

//             {/* Submitted */}
//             {data.status ===
//               "Submitted" &&
//               hasPermission(
//                 "Indent",
//                 "stock_transfer_approve_from_outlet",
//               ) &&
//               isWarehouse && (
//                 <>
//                   <button
//                     type="button"
//                     onClick={
//                       handleApprove
//                     }
//                     className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                   >
//                     Submit &amp; Approve
//                     Request
//                   </button>

//                   <button
//                     type="button"
//                     onClick={
//                       handleReject
//                     }
//                     className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
//                   >
//                     Submit &amp; Reject
//                     Request
//                   </button>
//                 </>
//               )}

//             {/* Incompleted */}
//             {data.status ===
//               "Incompleted" &&
//               userCenterType ===
//                 "outlet" &&
//               userRole === "admin" &&
//               isWarehouse && (
//                 <button
//                   type="button"
//                   onClick={
//                     handleIncomplete
//                   }
//                   className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//                 >
//                   Change Qty And Complete
//                   Request
//                 </button>
//               )}
//           </div>
//         </div>

//         {/* Product Table */}
//         <div className="p-4">
//           <div className="w-full overflow-x-auto">
//             <table className="w-full min-w-[1300px] border-collapse text-sm">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-700">
//                     Product
//                   </th>

//                   <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-700">
//                     Center Stock
//                   </th>

//                   <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-700">
//                     Requested Qty
//                   </th>

//                   <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-700">
//                     Stock Qty
//                   </th>

//                   <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-700">
//                     Product Remark
//                   </th>

//                   <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-700">
//                     Approved Qty
//                   </th>

//                   <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-700">
//                     Approved Remark
//                   </th>

//                   <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-700">
//                     Received Qty
//                   </th>

//                   <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-700">
//                     Received Remark
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {data.products?.length >
//                 0 ? (
//                   data.products.map(
//                     (item) => {
//                       const approvedItem =
//                         approvedProducts.find(
//                           (product) =>
//                             product._id ===
//                             item._id,
//                         ) || {};

//                       const receipt =
//                         productReceipts.find(
//                           (product) =>
//                             product.productId ===
//                             item.product?._id,
//                         );

//                       return (
//                         <tr
//                           key={item._id}
//                           className="transition hover:bg-gray-50"
//                         >
//                           {/* Product */}
//                           <td className="border border-gray-200 px-3 py-3 text-gray-700">
//                             {item.product
//                               ?.productTitle ||
//                               ""}
//                           </td>

//                           {/* Center Stock */}
//                           <td className="border border-gray-200 px-3 py-3 text-gray-700">
//                             {item.centerStockQuantity ||
//                               0}
//                           </td>

//                           {/* Requested Qty */}
//                           <td className="border border-gray-200 px-3 py-3 text-gray-700">
//                             {item.quantity ||
//                               0}
//                           </td>

//                           {/* Stock Qty */}
//                           <td className="border border-gray-200 px-3 py-3 text-gray-700">
//                             {item.productInStock ||
//                               0}
//                           </td>

//                           {/* Product Remark */}
//                           <td className="border border-gray-200 px-3 py-3 text-gray-700">
//                             {item.productRemark ||
//                               ""}
//                           </td>

//                           {/* Approved Qty */}
//                           <td className="border border-gray-200 px-3 py-3">
//                             <div className="flex items-start gap-2">
//                               {isWarehouse ? (
//                                 <div className="flex flex-col">
//                                   <div className="flex items-center gap-2">
//                                     <input
//                                       type="text"
//                                       value={
//                                         approvedItem.approvedQty ??
//                                         ""
//                                       }
//                                       onChange={(
//                                         event,
//                                       ) =>
//                                         handleApprovedChange(
//                                           item._id,
//                                           "approvedQty",
//                                           event
//                                             .target
//                                             .value,
//                                         )
//                                       }
//                                       onBlur={(
//                                         event,
//                                       ) =>
//                                         handleApprovedBlur(
//                                           item._id,
//                                           event
//                                             .target
//                                             .value,
//                                         )
//                                       }
//                                       className={`w-20 rounded-md border px-2 py-1.5 text-sm outline-none transition ${
//                                         errors[
//                                           item
//                                             ._id
//                                         ]
//                                           ? "border-red-500 focus:ring-2 focus:ring-red-100"
//                                           : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                       }`}
//                                     />

//                                     {item
//                                       .product
//                                       ?.trackSerialNumber ===
//                                       "Yes" && (
//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           handleOpenSerialModal(
//                                             item,
//                                           )
//                                         }
//                                         title="Add Serial Numbers"
//                                         className="inline-flex h-8 w-8 items-center justify-center rounded-md text-blue-600 transition hover:bg-blue-50"
//                                       >
//                                         <span className="text-lg">
//                                           ☰
//                                         </span>
//                                       </button>
//                                     )}
//                                   </div>

//                                   {errors[
//                                     item
//                                       ._id
//                                   ] && (
//                                     <span className="mt-1 text-xs text-red-600">
//                                       {
//                                         errors[
//                                           item
//                                             ._id
//                                         ]
//                                       }
//                                     </span>
//                                   )}
//                                 </div>
//                               ) : (
//                                 <span className="py-1.5 text-gray-700">
//                                   {approvedItem.approvedQty ||
//                                     ""}
//                                 </span>
//                               )}
//                             </div>
//                           </td>

//                           {/* Approved Remark */}
//                           <td className="border border-gray-200 px-3 py-3">
//                             {isWarehouse ? (
//                               <input
//                                 type="text"
//                                 value={
//                                   approvedItem.approvedRemark ||
//                                   ""
//                                 }
//                                 onChange={(
//                                   event,
//                                 ) =>
//                                   handleApprovedChange(
//                                     item._id,
//                                     "approvedRemark",
//                                     event
//                                       .target
//                                       .value,
//                                   )
//                                 }
//                                 className="w-full min-w-[160px] rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                               />
//                             ) : (
//                               <span className="text-gray-700">
//                                 {item.approvedRemark ||
//                                   ""}
//                               </span>
//                             )}
//                           </td>

//                           {/* Received Qty */}
//                           <td className="border border-gray-200 px-3 py-3">
//                             {userCenterType ===
//                               "center" &&
//                             isCenter &&
//                             data.status ===
//                               "Shipped" ? (
//                               <input
//                                 type="text"
//                                 value={
//                                   receipt?.receivedQuantity ??
//                                   ""
//                                 }
//                                 onChange={(
//                                   event,
//                                 ) =>
//                                   handleReceiptChange(
//                                     item
//                                       .product
//                                       ?._id,
//                                     "receivedQuantity",
//                                     event
//                                       .target
//                                       .value,
//                                   )
//                                 }
//                                 className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                               />
//                             ) : (
//                               <span className="text-gray-700">
//                                 {item.receivedQuantity ||
//                                   ""}
//                               </span>
//                             )}
//                           </td>

//                           {/* Received Remark */}
//                           <td className="border border-gray-200 px-3 py-3">
//                             {userCenterType ===
//                               "center" &&
//                             isCenter &&
//                             data.status ===
//                               "Shipped" ? (
//                               <input
//                                 type="text"
//                                 value={
//                                   receipt?.receivedRemark ||
//                                   ""
//                                 }
//                                 onChange={(
//                                   event,
//                                 ) =>
//                                   handleReceiptChange(
//                                     item
//                                       .product
//                                       ?._id,
//                                     "receivedRemark",
//                                     event
//                                       .target
//                                       .value,
//                                   )
//                                 }
//                                 className="w-full min-w-[160px] rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                               />
//                             ) : (
//                               <span className="text-gray-700">
//                                 {item.receivedRemark ||
//                                   ""}
//                               </span>
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     },
//                   )
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={9}
//                       className="border border-gray-200 px-4 py-8 text-center text-sm text-gray-500"
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

//       {/* =================================================
//           Modals
//       ================================================= */}

//       <ShipGoodsModal
//         visible={shipmentModal}
//         onClose={() =>
//           setShipmentModal(false)
//         }
//         onSubmit={
//           currentShipmentAction
//         }
//         initialData={shipmentData}
//       />

//       <IncompleteRemarkModal
//         visible={incompleteModal}
//         onClose={() =>
//           setIncompleteModal(false)
//         }
//         onSubmit={handleMarkIncomplete}
//         initialRemark={
//           data.incompleteRemark
//         }
//       />

//       <SerialNumbers
//         visible={serialModalVisible}
//         onClose={() =>
//           setSerialModalVisible(false)
//         }
//         product={selectedProduct}
//         approvedQty={
//           approvedProducts.find(
//             (product) =>
//               product._id ===
//               selectedProduct?._id,
//           )?.approvedQty || 0
//         }
//         initialSerials={
//           assignedSerials[
//             selectedProduct?.product?._id
//           ] || []
//         }
//         onSerialNumbersUpdate={
//           handleSerialNumbersUpdate
//         }
//         warehouseId={
//           data?.warehouse?._id
//         }
//       />

//       <ChallanModal
//         visible={challanModal}
//         onClose={() =>
//           setChallanModal(false)
//         }
//         data={data}
//       />
//     </div>
//   );
// };

// // =====================================================
// // Reusable Detail Row
// // =====================================================

// const DetailRow = ({ items }) => {
//   return (
//     <tr>
//       {items.map(
//         ([label, value], index) => (
//           <React.Fragment key={`${label}-${index}`}>
//             <td className="w-[14%] border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700">
//               {label}
//             </td>

//             <td className="w-[19%] border border-gray-200 px-4 py-3 text-gray-700">
//               {value}
//             </td>
//           </React.Fragment>
//         ),
//       )}
//     </tr>
//   );
// };

// const StatusBadge = ({ status }) => {
//   const statusStyles = {
//     Draft:
//       "bg-gray-100 text-gray-700",
//     Submitted:
//       "bg-blue-100 text-blue-700",
//     Confirmed:
//       "bg-indigo-100 text-indigo-700",
//     Shipped:
//       "bg-purple-100 text-purple-700",
//     Completed:
//       "bg-green-100 text-green-700",
//     Rejected:
//       "bg-red-100 text-red-700",
//     Incompleted:
//       "bg-yellow-100 text-yellow-700",
//   };

//   return (
//     <span
//       className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//         statusStyles[status] ||
//         "bg-gray-100 text-gray-700"
//       }`}
//     >
//       {status}
//     </span>
//   );
// };

// export default StockProfile;


import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Eye,
  Printer,
  Truck,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import axiosInstance from "../../axiosInstance";import { formatDate, formatDateTime } from "../../utils/FormatDateTime";
import usePermission from "../../utils/usePermission";
import { showError } from "../../utils/sweetAlerts";

import ShipGoodsModal from "./ShipGoodsModal";
import IncompleteRemarkModal from "./IncompleteRemarkModal";
import SerialNumbers from "./SerialNumbers";
import ChallanModal from "./ChallanModal";

const StockProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [approvedProducts, setApprovedProducts] = useState([]);
  const [alert, setAlert] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const [shipmentModal, setShipmentModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentShipmentAction, setCurrentShipmentAction] =
    useState(null);
  const [incompleteModal, setIncompleteModal] = useState(false);

  const [productReceipts, setProductReceipts] = useState([]);
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState({});
  const [challanModal, setChallanModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userRole = (
    user?.role?.roleTitle || ""
  ).toLowerCase();

  const userCenter =
    JSON.parse(localStorage.getItem("userCenter")) || {};

  const userCenterType = (
    userCenter.centerType || "Outlet"
  ).toLowerCase();

  const userCenterId = userCenter._id;

  const isCenter = data?.center?._id === userCenterId;
  const isWarehouse = data?.warehouse?._id === userCenterId;

  const [shipmentData, setShipmentData] = useState({
    shippedDate: "",
    expectedDeliveryDate: "",
    shipmentDetails: "",
    shipmentRemark: "",
    documents: [],
  });

  const { hasPermission } = usePermission();

  // =====================================================
  // Serial Numbers
  // =====================================================

  const handleOpenSerialModal = (product) => {
    setSelectedProduct(product);
    setSerialModalVisible(true);
  };

  const handleSerialNumbersUpdate = (
    productId,
    serialsArray,
  ) => {
    setAssignedSerials((prev) => ({
      ...prev,
      [productId]: serialsArray,
    }));
  };

  // =====================================================
  // Fetch Stock Request
  // =====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(
          `/stockrequest/${id}`,
        );

        if (response.data.success) {
          const stockData = response.data.data;

          setData(stockData);

          const initialApproved =
            stockData.products.map((item) => ({
              _id: item._id,
              productId: item.product?._id,
              approvedQty:
                item.approvedQuantity !== undefined &&
                item.approvedQuantity !== null
                  ? item.approvedQuantity
                  : item.quantity || "",
              approvedRemark:
                item.approvedRemark || "",
            }));

          setApprovedProducts(initialApproved);

          const initialSerials = {};

          stockData.products.forEach((item) => {
            if (
              item.product?.trackSerialNumber === "Yes" &&
              item.approvedSerials?.length > 0
            ) {
              initialSerials[item.product._id] =
                item.approvedSerials.map((sn) => ({
                  serialNumber: sn,
                }));
            }
          });

          setAssignedSerials(initialSerials);
        } else {
          throw new Error(
            "Failed to fetch data",
          );
        }
      } catch (err) {
        setError(err.message);
        console.error(
          "Error fetching stock request:",
          err,
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // =====================================================
  // Shipment
  // =====================================================

  const handleShipGoods = async (
    shipmentDataPayload,
  ) => {
    try {
      const response = await axiosInstance.post(
        `/stockrequest/${id}/ship`,
        shipmentDataPayload,
      );

      if (response.data.success) {
        setAlert({
          type: "success",
          message:
            "Shipment created successfully",
          visible: true,
        });

        setShipmentModal(false);

        try {
          await axiosInstance.patch(
            `/stockrequest/${id}/warehouse-challan-approval`,
            {
              warehouseChallanApproval:
                "approved",
            },
          );

          console.log(
            "Challan auto-approved after shipment",
          );
        } catch (challanError) {
          console.error(
            "Failed to auto-approve challan:",
            challanError,
          );
        }

        setTimeout(
          () => window.location.reload(),
          1000,
        );
      } else {
        setAlert({
          type: "danger",
          message:
            "Failed to create shipment",
          visible: true,
        });
      }
    } catch (err) {
      console.error(err);

      setAlert({
        type: "danger",
        message:
          "Error creating shipment",
        visible: true,
      });
    }
  };

  const handleBack = () => {
    navigate("/stock-request");
  };

  // =====================================================
  // Product Receipts
  // =====================================================

  useEffect(() => {
    if (data?.products) {
      const initialReceipts =
        data.products.map((item) => ({
          productId: item.product?._id,
          receivedQuantity:
            item.receivedQuantity || 0,
          receivedRemark:
            item.receivedRemark,
        }));

      setProductReceipts(initialReceipts);
    }
  }, [data]);

  const handleReceiptChange = (
    productId,
    field,
    value,
  ) => {
    setProductReceipts((prev) =>
      prev.map((product) =>
        product.productId === productId
          ? {
              ...product,
              [field]: value,
            }
          : product,
      ),
    );
  };

  // =====================================================
  // Approved Quantity
  // =====================================================

  const handleApprovedChange = (
    productId,
    field,
    value,
  ) => {
    if (field === "approvedQty") {
      if (
        value === "" ||
        /^\d+$/.test(value)
      ) {
        setErrors((prev) => ({
          ...prev,
          [productId]: undefined,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [productId]:
            "The input value was not a correct number",
        }));
      }
    }

    setApprovedProducts((prev) =>
      prev.map((product) =>
        product._id === productId
          ? {
              ...product,
              [field]: value,
            }
          : product,
      ),
    );
  };

  // =====================================================
  // Approve Request
  // =====================================================

  const handleApprove = async () => {
    let hasError = false;

    const payload = approvedProducts.map(
      (product) => {
        if (
          product.approvedQty === "" ||
          !/^\d+$/.test(
            product.approvedQty,
          )
        ) {
          setErrors((prev) => ({
            ...prev,
            [product._id]:
              "The input value was not a correct number",
          }));

          hasError = true;
        }

        return {
          productId: product.productId,
          approvedQuantity: Number(
            product.approvedQty,
          ),
          approvedRemark:
            product.approvedRemark || "",
          approvedSerials: (
            assignedSerials[
              product.productId
            ] || []
          ).map(
            (serial) =>
              serial.serialNumber,
          ),
        };
      },
    );

    if (hasError) {
      return;
    }

    try {
      const response =
        await axiosInstance.post(
          `/stockrequest/${id}/approve`,
          {
            productApprovals: payload,
          },
        );

      if (!response.data.success) {
        setAlert({
          type: "danger",
          message:
            response.data.message ||
            "Failed to approve request",
          visible: true,
        });

        return;
      }

      setAlert({
        type: "success",
        message:
          "Stock request approved successfully",
        visible: true,
      });

      setTimeout(
        () => window.location.reload(),
        1000,
      );
    } catch (err) {
      console.error(err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred";

      setAlert({
        type: "danger",
        message: errorMessage,
        visible: true,
      });
    }
  };

  // =====================================================
  // Reject
  // =====================================================

  const handleReject = async () => {
    try {
      const response =
        await axiosInstance.put(
          `/stockrequest/${id}`,
          {
            status: "Rejected",
          },
        );

      if (response.data.success) {
        setAlert({
          type: "success",
          message:
            "Stock request rejected successfully",
          visible: true,
        });

        setTimeout(
          () => window.location.reload(),
          1000,
        );
      } else {
        setAlert({
          type: "danger",
          message:
            "Failed to reject request",
          visible: true,
        });
      }
    } catch (err) {
      console.error(err);

      setAlert({
        type: "danger",
        message:
          "Error rejecting stock request",
        visible: true,
      });
    }
  };

  // =====================================================
  // Submit
  // =====================================================

  const handleSubmitRequest =
    async () => {
      try {
        const response =
          await axiosInstance.put(
            `/stockrequest/${id}`,
            {
              status: "Submitted",
            },
          );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Data submitted successfully",
            visible: true,
          });

          setTimeout(
            () => window.location.reload(),
            1000,
          );
        } else {
          setAlert({
            type: "danger",
            message: "Failed to submit",
            visible: true,
          });
        }
      } catch (err) {
        console.error(err);

        setAlert({
          type: "danger",
          message:
            "Error to submit data",
          visible: true,
        });
      }
    };

  // =====================================================
  // Change Approved Quantity
  // =====================================================

  const handleChangeApprovedQty =
    async () => {
      let hasError = false;

      const payload =
        approvedProducts.map(
          (product) => {
            if (
              product.approvedQty === "" ||
              !/^\d+$/.test(
                product.approvedQty,
              )
            ) {
              setErrors((prev) => ({
                ...prev,
                [product._id]:
                  "The input value was not a correct number",
              }));

              hasError = true;
            }

            return {
              productId:
                product.productId,
              approvedQuantity:
                Number(
                  product.approvedQty,
                ),
              approvedRemark:
                product.approvedRemark ||
                "",
              approvedSerials: (
                assignedSerials[
                  product.productId
                ] || []
              ).map(
                (serial) =>
                  serial.serialNumber,
              ),
            };
          },
        );

      if (hasError) {
        return;
      }

      console.log(
        "Final payload sent to API:",
        payload,
      );

      try {
        const response =
          await axiosInstance.patch(
            `/stockrequest/${id}/approved-quantities`,
            {
              productApprovals:
                payload,
            },
          );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Approved quantities updated successfully",
            visible: true,
          });

          setTimeout(
            () => window.location.reload(),
            1000,
          );
        } else {
          setAlert({
            type: "danger",
            message:
              response.data.message ||
              "Failed to update approved quantities",
            visible: true,
          });
        }
      } catch (err) {
        console.error(err);

        const backendMessage =
          err.response?.data?.message ||
          "Error updating approved quantities";

        setAlert({
          type: "danger",
          message: backendMessage,
          visible: true,
        });
      }
    };

  // =====================================================
  // Cancel Shipment
  // =====================================================

  const handleCancelShipment =
    async () => {
      try {
        const response =
          await axiosInstance.post(
            `/stockrequest/${id}/reject-shipment`,
          );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Shipment canceled successfully",
            visible: true,
          });

          setTimeout(
            () => window.location.reload(),
            1000,
          );
        } else {
          setAlert({
            type: "danger",
            message:
              "Failed to cancel shipment",
            visible: true,
          });
        }
      } catch (err) {
        console.error(err);

        setAlert({
          type: "danger",
          message:
            "Error canceling shipment",
          visible: true,
        });
      }
    };

  // =====================================================
  // Complete Indent
  // =====================================================

  const handleCompleteIndent =
    async () => {
      try {
        let payload = [];

        if (isCenter) {
          payload =
            productReceipts.map(
              (item) => ({
                productId:
                  item.productId,
                receivedQuantity:
                  Number(
                    item.receivedQuantity,
                  ) || 0,
                receivedRemark:
                  item.receivedRemark ||
                  "",
              }),
            );
        } else {
          payload =
            data.products.map(
              (item) => ({
                productId:
                  item.product?._id,
                receivedQuantity:
                  item.approvedQuantity ||
                  item.receivedQuantity ||
                  0,
                receivedRemark:
                  item.receivedRemark ||
                  "",
              }),
            );
        }

        const response =
          await axiosInstance.post(
            `/stockrequest/${id}/complete`,
            {
              productReceipts: payload,
            },
          );

        if (!response.data.success) {
          setAlert({
            type: "danger",
            message:
              response.data.message ||
              "Failed to complete indent",
            visible: true,
          });

          return;
        }

        setAlert({
          type: "success",
          message:
            "Indent completed successfully",
          visible: true,
        });

        setTimeout(
          () => window.location.reload(),
          1000,
        );
      } catch (err) {
        console.error(
          "Error in handleCompleteIndent:",
          err,
        );

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while completing the indent";

        setAlert({
          type: "danger",
          message: errorMessage,
          visible: true,
        });
      }
    };

  // =====================================================
  // Update Shipment
  // =====================================================

  const handleOpenUpdateShipment =
    () => {
      if (data.shippingInfo) {
        setShipmentData({
          shippedDate:
            data.shippingInfo.shippedDate?.split(
              "T",
            )[0] || "",

          expectedDeliveryDate:
            data.shippingInfo.expectedDeliveryDate?.split(
              "T",
            )[0] || "",

          shipmentDetails:
            data.shippingInfo
              .shipmentDetails || "",

          shipmentRemark:
            data.shippingInfo
              .shipmentRemark || "",

          documents:
            data.shippingInfo.documents ||
            [],
        });
      }

      setCurrentShipmentAction(
        () => handleUpdateShipment,
      );

      setShipmentModal(true);
    };

  const handleUpdateShipment =
    async (shipmentDataPayload) => {
      try {
        const response =
          await axiosInstance.patch(
            `/stockrequest/${id}/shipping-info`,
            shipmentDataPayload,
          );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Shipment updated successfully",
            visible: true,
          });

          setShipmentModal(false);

          setTimeout(
            () => window.location.reload(),
            1000,
          );
        } else {
          setAlert({
            type: "danger",
            message:
              "Failed to update shipment",
            visible: true,
          });
        }
      } catch (err) {
        console.error(err);

        setAlert({
          type: "danger",
          message:
            "Error updating shipment",
          visible: true,
        });
      }
    };

  // =====================================================
  // Mark Incomplete
  // =====================================================

  const handleMarkIncomplete =
    async (remark) => {
      try {
        const receivedProducts =
          productReceipts.map(
            (item) => ({
              productId:
                item.productId,
              receivedQuantity:
                Number(
                  item.receivedQuantity,
                ) || 0,
              receivedRemark:
                item.receivedRemark ||
                "",
            }),
          );

        const payload = {
          incompleteRemark: remark,
          receivedProducts,
        };

        console.log(
          "Incomplete Payload:",
          payload,
        );

        const response =
          await axiosInstance.post(
            `/stockrequest/${id}/mark-incomplete`,
            payload,
          );

        if (response.data.success) {
          setAlert({
            type: "success",
            message:
              "Stock request marked as incomplete",
            visible: true,
          });

          setIncompleteModal(false);

          setTimeout(
            () => window.location.reload(),
            1000,
          );
        } else {
          setAlert({
            type: "danger",
            message:
              "Failed to mark incomplete",
            visible: true,
          });
        }
      } catch (err) {
        console.error(err);

        setAlert({
          type: "danger",
          message:
            "Error marking incomplete",
          visible: true,
        });
      }
    };

  // =====================================================
  // Complete Incomplete Request
  // =====================================================

  const handleIncomplete =
    async () => {
      try {
        const approvalsPayload =
          approvedProducts.map(
            (product) => ({
              productId:
                product.productId,
              approvedQuantity:
                Number(
                  product.approvedQty,
                ) || 0,
              approvedRemark:
                product.approvedRemark ||
                "",
            }),
          );

        const receiptsPayload =
          productReceipts.map(
            (receipt) => ({
              productId:
                receipt.productId,
              receivedQuantity:
                Number(
                  receipt.receivedQuantity,
                ) || 0,
              receivedRemark:
                receipt.receivedRemark ||
                "",
            }),
          );

        console.log(
          "Final Incomplete Payload:",
          {
            productApprovals:
              approvalsPayload,
            productReceipts:
              receiptsPayload,
          },
        );

        const response =
          await axiosInstance.patch(
            `/stockrequest/${id}/complete-incomplete`,
            {
              productApprovals:
                approvalsPayload,
              productReceipts:
                receiptsPayload,
            },
          );

        if (!response.data.success) {
          setAlert({
            type: "danger",
            message:
              response.data.message ||
              "Failed to complete indent",
            visible: true,
          });

          return;
        }

        setAlert({
          type: "success",
          message:
            "Indent completed successfully",
          visible: true,
        });

        setTimeout(
          () => window.location.reload(),
          1000,
        );
      } catch (err) {
        console.error(
          "Error in handleIncomplete:",
          err,
        );

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while completing the indent";

        setAlert({
          type: "danger",
          message: errorMessage,
          visible: true,
        });
      }
    };

  // =====================================================
  // Warehouse Challan Approval
  // =====================================================

  const handleWarehouseApproveChallan =
    async () => {
      const result =
        await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to approve this challan?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          cancelButtonColor: "#6c757d",
          confirmButtonText:
            "Yes, approve it!",
          cancelButtonText: "Cancel",
          reverseButtons: false,
        });

      if (!result.isConfirmed) {
        return;
      }

      try {
        const response =
          await axiosInstance.patch(
            `/stockrequest/${id}/warehouse-challan-approval`,
            {
              warehouseChallanApproval:
                "approved",
            },
          );

        if (response.data.success) {
          await Swal.fire({
            title: "Approved!",
            text: "Challan has been approved successfully.",
            icon: "success",
            confirmButtonColor:
              "#3085d6",
            confirmButtonText: "OK",
          });

          window.location.reload();
        } else {
          await Swal.fire({
            title: "Failed!",
            text:
              response.data.message ||
              "Failed to approve challan",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });
        }
      } catch (err) {
        console.error(
          "Challan approval error:",
          err,
        );

        showError(err);
      }
    };

  // =====================================================
  // Center Challan Approval
  // =====================================================

  const handleCenterApproveChallan =
    async () => {
      const result =
        await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to approve this challan?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          cancelButtonColor: "#6c757d",
          confirmButtonText:
            "Yes, approve it!",
          cancelButtonText: "Cancel",
          reverseButtons: false,
        });

      if (!result.isConfirmed) {
        return;
      }

      try {
        const response =
          await axiosInstance.patch(
            `/stockrequest/${id}/center-challan-approval`,
            {
              centerChallanApproval:
                "approved",
            },
          );

        if (response.data.success) {
          await Swal.fire({
            title: "Approved!",
            text: "Challan has been approved successfully.",
            icon: "success",
            confirmButtonColor:
              "#3085d6",
            confirmButtonText: "OK",
          });

          window.location.reload();
        } else {
          await Swal.fire({
            title: "Failed!",
            text:
              response.data.message ||
              "Failed to approve challan",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });
        }
      } catch (err) {
        console.error(
          "Challan approval error:",
          err,
        );

        showError(err);
      }
    };

  // =====================================================
  // Approved Quantity Validation
  // =====================================================

  const handleApprovedBlur = (
    productId,
    value,
  ) => {
    if (
      value === "" ||
      !/^\d+$/.test(value)
    ) {
      setErrors((prev) => ({
        ...prev,
        [productId]:
          "The input value was not a correct number",
      }));
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#f4f6f8]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#dfe3e8] border-t-[#2759A2]" />
      </div>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <div className="rounded-[4px] border border-[#efc4bf] bg-[#fff1ef] px-4 py-3 text-sm text-[#b63329]">
        Error loading stock request:{" "}
        {error}
      </div>
    );
  }

  // =====================================================
  // No Data
  // =====================================================

  if (!data) {
    return (
      <div className="rounded-[4px] border border-[#ead49e] bg-[#fff8e8] px-4 py-3 text-sm text-[#9a6a12]">
        Stock Request not found
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f4f6f8] px-0 py-1 sm:px-1">
      {/* Alert */}
      {alert.visible && (
        <div
          className={`mb-4 flex items-center justify-between rounded-[4px] border px-4 py-3 text-sm shadow-sm ${
            alert.type === "success"
              ? "border-[#bfe4cb] bg-[#edf8f1] text-[#27844a]"
              : "border-[#efc4bf] bg-[#fff1ef] text-[#b63329]"
          }`}
        >
          <span>{alert.message}</span>

          <button
            type="button"
            onClick={() =>
              setAlert({
                ...alert,
                visible: false,
              })
            }
            className="rounded p-1 text-[#5d6670] transition hover:bg-black/5"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Page Title */}
      <div className="mb-4 flex items-center border-b-0">
        <button
          type="button"
          onClick={handleBack}
          className="mr-4 inline-flex items-center gap-1.5 rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-[25px] font-medium leading-tight text-[#303640]">
          Indent Detail
        </h1>
      </div>

      {/* =================================================
          Indent Information
      ================================================= */}

      <div className="overflow-hidden rounded-[3px] border border-[#dfe3e8] border-t-[4px] border-t-[#2759A2] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-[#e2e5e9] px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[19px] font-semibold text-[#252a31]">
              Indent:{" "}
              {data.orderNumber || ""}
            </h2>

            {data.status && (
              <StatusBadge
                status={data.status}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {data.status ===
              "Shipped" &&
              hasPermission(
                "Indent",
                "complete_indent",
              ) && (
                <button
                  type="button"
                  onClick={
                    handleCompleteIndent
                  }
                  className="rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"
                >
                  Complete The Indent
                </button>
              )}

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#cfd5dc] bg-white px-3.5 py-2 text-sm font-semibold text-[#3f4650] shadow-sm transition hover:bg-[#f5f7f9]"
            >
              <Printer size={15} />
              Print Indent
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-[15px]">
            <tbody>
              <DetailRow
                items={[
                  [
                    "Center/Center Code:",
                    data.orderNumber || "",
                  ],
                  [
                    "Shipment Date:",
                    formatDate(
                      data.shippingInfo
                        ?.shippedDate || "",
                    ),
                  ],
                  [
                    "Completed on:",
                    formatDateTime(
                      data.completionInfo
                        ?.completedOn || "",
                    ),
                  ],
                ]}
              />

              <DetailRow
                items={[
                  [
                    "Indent Date:",
                    data.date || "",
                  ],
                  [
                    "Expected Delivery:",
                    formatDate(
                      data.shippingInfo
                        ?.expectedDeliveryDate ||
                        "",
                    ),
                  ],
                  [
                    "Completed by:",
                    data.completionInfo
                      ?.completedBy
                      ?.fullName || "",
                  ],
                ]}
              />

              <DetailRow
                items={[
                  [
                    "Remark:",
                    data.remark || "",
                  ],
                  [
                    "Shipment Detail:",
                    data.shippingInfo
                      ?.shipmentDetails ||
                      "",
                  ],
                  [
                    "Incomplete on:",
                    formatDateTime(
                      data.incompleteOn ||
                        "",
                    ),
                  ],
                ]}
              />

              <DetailRow
                items={[
                  [
                    "Created at:",
                    formatDateTime(
                      data.createdAt,
                    ),
                  ],
                  [
                    "Shipment Remark:",
                    data.shippingInfo
                      ?.shipmentRemark ||
                      "",
                  ],
                  [
                    "Incomplete by:",
                    data.incompleteBy ||
                      "",
                  ],
                ]}
              />

              <DetailRow
                items={[
                  [
                    "Created by:",
                    data.createdBy
                      ?.fullName || "",
                  ],
                  [
                    "Document:",
                    data.document || "",
                  ],
                  [
                    "Incomplete Remark:",
                    data.incompleteRemark ||
                      "",
                  ],
                ]}
              />

              <DetailRow
                items={[
                  [
                    "Approved at:",
                    formatDateTime(
                      data.approvalInfo
                        ?.approvedAt || "",
                    ),
                  ],
                  [
                    "Shipped at:",
                    formatDateTime(
                      data.shippingInfo
                        ?.shippedAt || "",
                    ),
                  ],
                  [
                    "Received at:",
                    formatDateTime(
                      data.receivingInfo
                        ?.receivedAt || "",
                    ),
                  ],
                ]}
              />

              <DetailRow
                items={[
                  [
                    "Approved by:",
                    data.approvalInfo
                      ?.approvedBy
                      ?.fullName || "",
                  ],
                  [
                    "Shipped by:",
                    data.shippingInfo
                      ?.shippedBy
                      ?.fullName || "",
                  ],
                  [
                    "Received by:",
                    data.receivingInfo
                      ?.receivedBy
                      ?.fullName || "",
                  ],
                ]}
              />

              <DetailRow
                items={[
                  [
                    "Challan Approved at:",
                    formatDateTime(
                      data.approvalInfo
                        ?.challanApprovedAt ||
                        "",
                    ),
                  ],
                  [
                    "Challan Approved by:",
                    <span
                      key="challan-approved-by"
                      className="whitespace-pre-line"
                    >
                      {data.approvalInfo
                        ?.challanApprovedBy
                        ?.fullName || ""}
                      {"\n"}
                      {data.approvalInfo
                        ?.challanApprovedBy
                        ?.email || ""}
                    </span>,
                  ],
                ]}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================
          Product Details
      ================================================= */}

      <div className="mt-5 overflow-hidden rounded-[3px] border border-[#dfe3e8] border-t-[4px] border-t-[#2759A2] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.08)]">
        {/* Product Header */}
        <div className="flex flex-col gap-3 border-b border-[#e2e5e9] px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-[19px] font-semibold text-[#252a31]">
            Product Details
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {/* Draft */}
            {data.status === "Draft" && (
              <button
                type="button"
                onClick={
                  handleSubmitRequest
                }
                className="rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"
              >
                Submit
              </button>
            )}

            {/* Confirmed - Warehouse Admin */}
            {data.status ===
              "Confirmed" &&
              userCenterType ===
                "outlet" &&
              userRole === "admin" &&
              isWarehouse && (
                <>
                  <button
                    type="button"
                    onClick={
                      handleChangeApprovedQty
                    }
                    className="rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"
                  >
                    Change Approved Qty
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentShipmentAction(
                        () =>
                          handleShipGoods,
                      );
                      setShipmentModal(
                        true,
                      );
                    }}
                    className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"
                  >
                    <Truck size={15} />
                    Ship the Goods
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleReject
                    }
                    className="rounded-[4px] bg-[#c9362b] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ad2e25]"
                  >
                    Reject Request
                  </button>
                </>
              )}

            {/* View Challan */}
            {(data.status ===
              "Confirmed" ||
              data.status ===
                "Shipped") &&
              isWarehouse && (
                <button
                  type="button"
                  onClick={() =>
                    setChallanModal(true)
                  }
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"
                >
                  <Eye size={15} />
                  View Challan
                </button>
              )}

            {/* Shipped - Center */}
            {data.status ===
              "Shipped" &&
              isCenter && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setChallanModal(
                        true,
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"
                  >
                    <Eye size={15} />
                    View Challan
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleCenterApproveChallan
                    }
                    className="rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"
                  >
                    Approved Challan
                  </button>
                </>
              )}

            {/* Shipped - Warehouse Admin */}
            {data.status ===
              "Shipped" &&
              userCenterType ===
                "outlet" &&
              userRole === "admin" &&
              isWarehouse && (
                <>
                  <button
                    type="button"
                    onClick={
                      handleOpenUpdateShipment
                    }
                    className="rounded-[4px] bg-[#d89418] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#bb7910]"
                  >
                    Update Shipment
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleCancelShipment
                    }
                    className="rounded-[4px] bg-[#c9362b] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ad2e25]"
                  >
                    Cancel Shipment
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleReject
                    }
                    className="rounded-[4px] bg-[#c9362b] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ad2e25]"
                  >
                    Reject Request
                  </button>
                </>
              )}

            {/* Shipped - Center Admin */}
            {data.status ===
              "Shipped" &&
              userCenterType ===
                "center" &&
              userRole ===
                "center" &&
              isCenter && (
                <button
                  type="button"
                  onClick={() =>
                    setIncompleteModal(
                      true,
                    )
                  }
                  className="rounded-[4px] bg-[#d89418] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#bb7910]"
                >
                  Incomplete
                </button>
              )}

            {/* Submitted */}
            {data.status ===
              "Submitted" &&
              hasPermission(
                "Indent",
                "stock_transfer_approve_from_outlet",
              ) &&
              isWarehouse && (
                <>
                  <button
                    type="button"
                    onClick={
                      handleApprove
                    }
                    className="rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"
                  >
                    Submit &amp; Approve
                    Request
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleReject
                    }
                    className="rounded-[4px] bg-[#c9362b] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ad2e25]"
                  >
                    Submit &amp; Reject
                    Request
                  </button>
                </>
              )}

            {/* Incompleted */}
            {data.status ===
              "Incompleted" &&
              userCenterType ===
                "outlet" &&
              userRole === "admin" &&
              isWarehouse && (
                <button
                  type="button"
                  onClick={
                    handleIncomplete
                  }
                  className="rounded-[4px] bg-[#2759A2] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#214b89]"
                >
                  Change Qty And Complete
                  Request
                </button>
              )}
          </div>
        </div>

        {/* Product Table */}
        <div className="p-4">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1300px] border-collapse text-[14px]">
              <thead>
                <tr className="bg-[#f1f3f5]">
                  <th className="border border-[#dfe3e8] bg-[#f1f3f5] px-3.5 py-3.5 text-left text-[14px] font-bold text-[#252a31]">
                    Product
                  </th>

                  <th className="border border-[#dfe3e8] bg-[#f1f3f5] px-3.5 py-3.5 text-left text-[14px] font-bold text-[#252a31]">
                    Center Stock
                  </th>

                  <th className="border border-[#dfe3e8] bg-[#f1f3f5] px-3.5 py-3.5 text-left text-[14px] font-bold text-[#252a31]">
                    Requested Qty
                  </th>

                  <th className="border border-[#dfe3e8] bg-[#f1f3f5] px-3.5 py-3.5 text-left text-[14px] font-bold text-[#252a31]">
                    Stock Qty
                  </th>

                  <th className="border border-[#dfe3e8] bg-[#f1f3f5] px-3.5 py-3.5 text-left text-[14px] font-bold text-[#252a31]">
                    Product Remark
                  </th>

                  <th className="border border-[#dfe3e8] bg-[#f1f3f5] px-3.5 py-3.5 text-left text-[14px] font-bold text-[#252a31]">
                    Approved Qty
                  </th>

                  <th className="border border-[#dfe3e8] bg-[#f1f3f5] px-3.5 py-3.5 text-left text-[14px] font-bold text-[#252a31]">
                    Approved Remark
                  </th>

                  <th className="border border-[#dfe3e8] bg-[#f1f3f5] px-3.5 py-3.5 text-left text-[14px] font-bold text-[#252a31]">
                    Received Qty
                  </th>

                  <th className="border border-[#dfe3e8] bg-[#f1f3f5] px-3.5 py-3.5 text-left text-[14px] font-bold text-[#252a31]">
                    Received Remark
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.products?.length >
                0 ? (
                  data.products.map(
                    (item) => {
                      const approvedItem =
                        approvedProducts.find(
                          (product) =>
                            product._id ===
                            item._id,
                        ) || {};

                      const receipt =
                        productReceipts.find(
                          (product) =>
                            product.productId ===
                            item.product?._id,
                        );

                      return (
                        <tr
                          key={item._id}
                          className="transition hover:bg-[#f7f9fb]"
                        >
                          {/* Product */}
                          <td className="border border-[#e1e5ea] px-3.5 py-3.5 text-[#3f4650]">
                            {item.product
                              ?.productTitle ||
                              ""}
                          </td>

                          {/* Center Stock */}
                          <td className="border border-[#e1e5ea] px-3.5 py-3.5 text-[#3f4650]">
                            {item.centerStockQuantity ||
                              0}
                          </td>

                          {/* Requested Qty */}
                          <td className="border border-[#e1e5ea] px-3.5 py-3.5 text-[#3f4650]">
                            {item.quantity ||
                              0}
                          </td>

                          {/* Stock Qty */}
                          <td className="border border-[#e1e5ea] px-3.5 py-3.5 text-[#3f4650]">
                            {item.productInStock ||
                              0}
                          </td>

                          {/* Product Remark */}
                          <td className="border border-[#e1e5ea] px-3.5 py-3.5 text-[#3f4650]">
                            {item.productRemark ||
                              ""}
                          </td>

                          {/* Approved Qty */}
                          <td className="border border-[#e1e5ea] px-3.5 py-3.5">
                            <div className="flex items-start gap-2">
                              {isWarehouse ? (
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={
                                        approvedItem.approvedQty ??
                                        ""
                                      }
                                      onChange={(
                                        event,
                                      ) =>
                                        handleApprovedChange(
                                          item._id,
                                          "approvedQty",
                                          event
                                            .target
                                            .value,
                                        )
                                      }
                                      onBlur={(
                                        event,
                                      ) =>
                                        handleApprovedBlur(
                                          item._id,
                                          event
                                            .target
                                            .value,
                                        )
                                      }
                                      className={`w-20 rounded-[4px] border px-2.5 py-1.5 text-sm outline-none transition ${
                                        errors[
                                          item
                                            ._id
                                        ]
                                          ? "border-[#d85a50] focus:ring-2 focus:ring-[#d85a50]/15"
                                          : "border-[#cfd5dc] focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/15"
                                      }`}
                                    />

                                    {item
                                      .product
                                      ?.trackSerialNumber ===
                                      "Yes" && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenSerialModal(
                                            item,
                                          )
                                        }
                                        title="Add Serial Numbers"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] text-[#2759A2] transition hover:bg-[#eaf1f9]"
                                      >
                                        <span className="text-lg">
                                          ☰
                                        </span>
                                      </button>
                                    )}
                                  </div>

                                  {errors[
                                    item
                                      ._id
                                  ] && (
                                    <span className="mt-1 text-xs font-medium text-[#c9362b]">
                                      {
                                        errors[
                                          item
                                            ._id
                                        ]
                                      }
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="py-1.5 text-[#3f4650]">
                                  {approvedItem.approvedQty ||
                                    ""}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Approved Remark */}
                          <td className="border border-[#e1e5ea] px-3.5 py-3.5">
                            {isWarehouse ? (
                              <input
                                type="text"
                                value={
                                  approvedItem.approvedRemark ||
                                  ""
                                }
                                onChange={(
                                  event,
                                ) =>
                                  handleApprovedChange(
                                    item._id,
                                    "approvedRemark",
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                className="w-full min-w-[160px] rounded-[4px] border border-[#cfd5dc] bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/15"
                              />
                            ) : (
                              <span className="text-[#3f4650]">
                                {item.approvedRemark ||
                                  ""}
                              </span>
                            )}
                          </td>

                          {/* Received Qty */}
                          <td className="border border-[#e1e5ea] px-3.5 py-3.5">
                            {userCenterType ===
                              "center" &&
                            isCenter &&
                            data.status ===
                              "Shipped" ? (
                              <input
                                type="text"
                                value={
                                  receipt?.receivedQuantity ??
                                  ""
                                }
                                onChange={(
                                  event,
                                ) =>
                                  handleReceiptChange(
                                    item
                                      .product
                                      ?._id,
                                    "receivedQuantity",
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                className="w-24 rounded-[4px] border border-[#cfd5dc] bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/15"
                              />
                            ) : (
                              <span className="text-[#3f4650]">
                                {item.receivedQuantity ||
                                  ""}
                              </span>
                            )}
                          </td>

                          {/* Received Remark */}
                          <td className="border border-[#e1e5ea] px-3.5 py-3.5">
                            {userCenterType ===
                              "center" &&
                            isCenter &&
                            data.status ===
                              "Shipped" ? (
                              <input
                                type="text"
                                value={
                                  receipt?.receivedRemark ||
                                  ""
                                }
                                onChange={(
                                  event,
                                ) =>
                                  handleReceiptChange(
                                    item
                                      .product
                                      ?._id,
                                    "receivedRemark",
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                className="w-full min-w-[160px] rounded-[4px] border border-[#cfd5dc] bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-[#2759A2] focus:ring-2 focus:ring-[#2759A2]/15"
                              />
                            ) : (
                              <span className="text-[#3f4650]">
                                {item.receivedRemark ||
                                  ""}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    },
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="border border-[#e1e5ea] px-4 py-10 text-center text-sm text-[#69727d]"
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

      {/* =================================================
          Modals
      ================================================= */}

      <ShipGoodsModal
        visible={shipmentModal}
        onClose={() =>
          setShipmentModal(false)
        }
        onSubmit={
          currentShipmentAction
        }
        initialData={shipmentData}
      />

      <IncompleteRemarkModal
        visible={incompleteModal}
        onClose={() =>
          setIncompleteModal(false)
        }
        onSubmit={handleMarkIncomplete}
        initialRemark={
          data.incompleteRemark
        }
      />

      <SerialNumbers
        visible={serialModalVisible}
        onClose={() =>
          setSerialModalVisible(false)
        }
        product={selectedProduct}
        approvedQty={
          approvedProducts.find(
            (product) =>
              product._id ===
              selectedProduct?._id,
          )?.approvedQty || 0
        }
        initialSerials={
          assignedSerials[
            selectedProduct?.product?._id
          ] || []
        }
        onSerialNumbersUpdate={
          handleSerialNumbersUpdate
        }
        warehouseId={
          data?.warehouse?._id
        }
      />

      <ChallanModal
        visible={challanModal}
        onClose={() =>
          setChallanModal(false)
        }
        data={data}
      />
    </div>
  );
};

// =====================================================
// Reusable Detail Row
// =====================================================

const DetailRow = ({ items }) => {
  return (
    <tr>
      {items.map(
        ([label, value], index) => (
          <React.Fragment key={`${label}-${index}`}>
            <td className="w-[14%] border border-[#e1e5ea] bg-[#f1f3f5] px-4 py-3 font-bold text-[#252a31]">
              {label}
            </td>

            <td className="w-[19%] border border-[#e1e5ea] px-4 py-3 text-[#3f4650]">
              {value}
            </td>
          </React.Fragment>
        ),
      )}
    </tr>
  );
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Draft:
      "bg-[#f1f3f5] text-[#555e68] border border-[#d9dee4]",
    Submitted:
      "bg-[#e8f3fb] text-[#1674a8] border border-[#b9dced]",
    Confirmed:
      "bg-[#eef0ff] text-[#4d56a8] border border-[#cdd1f4]",
    Shipped:
      "bg-[#f0eafd] text-[#6944a7] border border-[#d8c8f0]",
    Completed:
      "bg-[#eaf7ee] text-[#27844a] border border-[#bfe4cb]",
    Rejected:
      "bg-[#fff0ee] text-[#b63329] border border-[#efc4bf]",
    Incompleted:
      "bg-[#fff6e5] text-[#9a6a12] border border-[#ead49e]",
  };

  return (
    <span
      className={`inline-flex rounded-[5px] px-3 py-1.5 text-[13px] font-semibold ${
        statusStyles[status] ||
        "bg-[#f1f3f5] text-[#555e68] border border-[#d9dee4]"
      }`}
    >
      {status}
    </span>
  );
};

export default StockProfile;