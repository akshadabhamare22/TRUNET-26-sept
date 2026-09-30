import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Printer,
  Send,
  Truck,
  XCircle,
  Ban,
  Edit3,
  PackageCheck,
  AlertTriangle,
  List,
} from "lucide-react";
import axiosInstance from "../../axiosInstance";import ShipGoodsModal from "./ShipGoodsModal";
import IncompleteRemarkModal from "./IncompleteRemarkModal";
import { formatDate, formatDateTime } from "../../utils/FormatDateTime";
import SerialNumbers from "./SerialNumbers";
import usePermission from "../../utils/usePermission";
import ChallanModal from "./ChallanModal";
import { showError } from "../../utils/sweetAlerts";
import Swal from "sweetalert2";

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
  const [serialModalVisible, setSerialModalVisible] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [assignedSerials, setAssignedSerials] =
    useState({});

  const [challanModal, setChallanModal] =
    useState(false);

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const userRole = (
    user?.role?.roleTitle || ""
  ).toLowerCase();

  const userCenter =
    JSON.parse(
      localStorage.getItem("userCenter")
    ) || {};

  const userCenterType = (
    userCenter.centerType || "Outlet"
  ).toLowerCase();

  const userCenterId = userCenter._id;

  const isCenter =
    data?.center?._id === userCenterId;

  const isWarehouse =
    data?.warehouse?._id === userCenterId;

  const [shipmentData, setShipmentData] =
    useState({
      shippedDate: "",
      expectedDeliveryDate: "",
      shipmentDetails: "",
      shipmentRemark: "",
      documents: [],
    });

  const { hasPermission } = usePermission();

  /* -------------------------------------------------------
     Helpers
  ------------------------------------------------------- */

  const setSuccessAlert = (message) => {
    setAlert({
      type: "success",
      message,
      visible: true,
    });
  };

  const setDangerAlert = (message) => {
    setAlert({
      type: "danger",
      message,
      visible: true,
    });
  };

  const handleOpenSerialModal = (product) => {
    setSelectedProduct(product);
    setSerialModalVisible(true);
  };

  const handleSerialNumbersUpdate = (
    productId,
    serialsArray
  ) => {
    setAssignedSerials((prev) => ({
      ...prev,
      [productId]: serialsArray,
    }));
  };

  /* -------------------------------------------------------
     Fetch Stock Request
  ------------------------------------------------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get(
          `/stockrequest/${id}`
        );

        if (response.data.success) {
          const stockData = response.data.data;

          setData(stockData);

          const initialApproved =
            stockData.products.map((item) => ({
              _id: item._id,
              productId: item.product?._id,
              approvedQty:
                item.approvedQuantity !==
                  undefined &&
                item.approvedQuantity !== null
                  ? item.approvedQuantity
                  : item.quantity || "",
              approvedRemark:
                item.approvedRemark || "",
            }));

          setApprovedProducts(
            initialApproved
          );

          const initialSerials = {};

          stockData.products.forEach(
            (item) => {
              if (
                item.product
                  ?.trackSerialNumber === "Yes" &&
                item.approvedSerials?.length > 0
              ) {
                initialSerials[
                  item.product._id
                ] =
                  item.approvedSerials.map(
                    (sn) => ({
                      serialNumber: sn,
                    })
                  );
              }
            }
          );

          setAssignedSerials(
            initialSerials
          );
        } else {
          throw new Error(
            "Failed to fetch data"
          );
        }
      } catch (err) {
        setError(err.message);
        console.error(
          "Error fetching data:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  /* -------------------------------------------------------
     Initialize Product Receipts
  ------------------------------------------------------- */

  useEffect(() => {
    if (data?.products) {
      const initialReceipts =
        data.products.map((item) => ({
          productId: item.product?._id,
          receivedQuantity:
            item.receivedQuantity || 0,
          receivedRemark:
            item.receivedRemark || "",
        }));

      setProductReceipts(
        initialReceipts
      );
    }
  }, [data]);

  /* -------------------------------------------------------
     Shipment
  ------------------------------------------------------- */

  const handleShipGoods = async (
    shipmentData
  ) => {
    try {
      const response =
        await axiosInstance.post(
          `/stockrequest/${id}/ship`,
          shipmentData
        );

      if (response.data.success) {
        setSuccessAlert(
          "Shipment created successfully"
        );

        setShipmentModal(false);

        try {
          await axiosInstance.patch(
            `/stockrequest/${id}/warehouse-challan-approval`,
            {
              warehouseChallanApproval:
                "approved",
            }
          );
        } catch (challanError) {
          console.error(
            "Failed to auto-approve challan:",
            challanError
          );
        }

        setTimeout(
          () => window.location.reload(),
          1000
        );
      } else {
        setDangerAlert(
          "Failed to create shipment"
        );
      }
    } catch (err) {
      console.error(err);

      setDangerAlert(
        "Error creating shipment"
      );
    }
  };

  const handleOpenUpdateShipment = () => {
    if (data?.shippingInfo) {
      setShipmentData({
        shippedDate:
          data.shippingInfo.shippedDate?.split(
            "T"
          )[0] || "",

        expectedDeliveryDate:
          data.shippingInfo.expectedDeliveryDate?.split(
            "T"
          )[0] || "",

        shipmentDetails:
          data.shippingInfo
            .shipmentDetails || "",

        shipmentRemark:
          data.shippingInfo
            .shipmentRemark || "",

        documents:
          data.shippingInfo.documents || [],
      });
    }

    setCurrentShipmentAction(
      () => handleUpdateShipment
    );

    setShipmentModal(true);
  };

  const handleUpdateShipment = async (
    shipmentData
  ) => {
    try {
      const response =
        await axiosInstance.patch(
          `/stockrequest/${id}/shipping-info`,
          shipmentData
        );

      if (response.data.success) {
        setSuccessAlert(
          "Shipment updated successfully"
        );

        setShipmentModal(false);

        setTimeout(
          () => window.location.reload(),
          1000
        );
      } else {
        setDangerAlert(
          "Failed to update shipment"
        );
      }
    } catch (err) {
      console.error(err);

      setDangerAlert(
        "Error updating shipment"
      );
    }
  };

  const handleCancelShipment =
    async () => {
      try {
        const response =
          await axiosInstance.post(
            `/stockrequest/${id}/reject-shipment`
          );

        if (response.data.success) {
          setSuccessAlert(
            "Shipment canceled successfully"
          );

          setTimeout(
            () => window.location.reload(),
            1000
          );
        } else {
          setDangerAlert(
            "Failed to cancel shipment"
          );
        }
      } catch (err) {
        console.error(err);

        setDangerAlert(
          "Error canceling shipment"
        );
      }
    };

  /* -------------------------------------------------------
     Receipt Changes
  ------------------------------------------------------- */

  const handleReceiptChange = (
    productId,
    field,
    value
  ) => {
    setProductReceipts((prev) =>
      prev.map((product) =>
        product.productId === productId
          ? {
              ...product,
              [field]: value,
            }
          : product
      )
    );
  };

  /* -------------------------------------------------------
     Approved Quantity
  ------------------------------------------------------- */

  const handleApprovedChange = (
    productId,
    field,
    value
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
          : product
      )
    );
  };

  const handleApprovedBlur = (
    productId,
    value
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

  /* -------------------------------------------------------
     Approve Request
  ------------------------------------------------------- */

  const handleApprove = async () => {
    let hasError = false;

    const payload =
      approvedProducts.map((product) => {
        if (
          product.approvedQty === "" ||
          !/^\d+$/.test(
            product.approvedQty
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
              product.approvedQty
            ),

          approvedRemark:
            product.approvedRemark || "",

          approvedSerials: (
            assignedSerials[
              product.productId
            ] || []
          ).map(
            (serial) =>
              serial.serialNumber
          ),
        };
      });

    if (hasError) return;

    try {
      const response =
        await axiosInstance.post(
          `/stockrequest/${id}/approve`,
          {
            productApprovals:
              payload,
          }
        );

      if (!response.data.success) {
        setDangerAlert(
          response.data.message ||
            "Failed to approve request"
        );

        return;
      }

      setSuccessAlert(
        "Stock request approved successfully"
      );

      setTimeout(
        () => window.location.reload(),
        1000
      );
    } catch (err) {
      console.error(err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred";

      setDangerAlert(errorMessage);
    }
  };

  /* -------------------------------------------------------
     Reject Request
  ------------------------------------------------------- */

  const handleReject = async () => {
    try {
      const response =
        await axiosInstance.put(
          `/stockrequest/${id}`,
          {
            status: "Rejected",
          }
        );

      if (response.data.success) {
        setSuccessAlert(
          "Stock request rejected successfully"
        );

        setTimeout(
          () => window.location.reload(),
          1000
        );
      } else {
        setDangerAlert(
          "Failed to reject request"
        );
      }
    } catch (err) {
      console.error(err);

      setDangerAlert(
        "Error rejecting stock request"
      );
    }
  };

  /* -------------------------------------------------------
     Submit Draft
  ------------------------------------------------------- */

  const handleSubmitRequest =
    async () => {
      try {
        const response =
          await axiosInstance.put(
            `/stockrequest/${id}`,
            {
              status: "Submitted",
            }
          );

        if (response.data.success) {
          setSuccessAlert(
            "Data submitted successfully"
          );

          setTimeout(
            () => window.location.reload(),
            1000
          );
        } else {
          setDangerAlert(
            "Failed to submit"
          );
        }
      } catch (err) {
        console.error(err);

        setDangerAlert(
          "Error to submit data"
        );
      }
    };

  /* -------------------------------------------------------
     Change Approved Quantity
  ------------------------------------------------------- */

  const handleChangeApprovedQty =
    async () => {
      let hasError = false;

      const payload =
        approvedProducts.map(
          (product) => {
            if (
              product.approvedQty === "" ||
              !/^\d+$/.test(
                product.approvedQty
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
                  product.approvedQty
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
                  serial.serialNumber
              ),
            };
          }
        );

      if (hasError) return;

      try {
        const response =
          await axiosInstance.patch(
            `/stockrequest/${id}/approved-quantities`,
            {
              productApprovals:
                payload,
            }
          );

        if (response.data.success) {
          setSuccessAlert(
            "Approved quantities updated successfully"
          );

          setTimeout(
            () =>
              window.location.reload(),
            1000
          );
        } else {
          setDangerAlert(
            response.data.message ||
              "Failed to update approved quantities"
          );
        }
      } catch (err) {
        console.error(err);

        const backendMessage =
          err.response?.data?.message ||
          "Error updating approved quantities";

        setDangerAlert(
          backendMessage
        );
      }
    };

  /* -------------------------------------------------------
     Complete Indent
  ------------------------------------------------------- */

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
                    item.receivedQuantity
                  ) || 0,

                receivedRemark:
                  item.receivedRemark ||
                  "",
              })
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
              })
            );
        }

        const response =
          await axiosInstance.post(
            `/stockrequest/${id}/complete`,
            {
              productReceipts:
                payload,
            }
          );

        if (!response.data.success) {
          setDangerAlert(
            response.data.message ||
              "Failed to complete indent"
          );

          return;
        }

        setSuccessAlert(
          "Indent completed successfully"
        );

        setTimeout(
          () => window.location.reload(),
          1000
        );
      } catch (err) {
        console.error(
          "Error in handleCompleteIndent:",
          err
        );

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while completing the indent";

        setDangerAlert(
          errorMessage
        );
      }
    };

  /* -------------------------------------------------------
     Incomplete
  ------------------------------------------------------- */

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
                  item.receivedQuantity
                ) || 0,

              receivedRemark:
                item.receivedRemark || "",
            })
          );

        const payload = {
          incompleteRemark:
            remark,
          receivedProducts,
        };

        const response =
          await axiosInstance.post(
            `/stockrequest/${id}/mark-incomplete`,
            payload
          );

        if (response.data.success) {
          setSuccessAlert(
            "Stock request marked as incomplete"
          );

          setIncompleteModal(false);

          setTimeout(
            () => window.location.reload(),
            1000
          );
        } else {
          setDangerAlert(
            "Failed to mark incomplete"
          );
        }
      } catch (err) {
        console.error(err);

        setDangerAlert(
          "Error marking incomplete"
        );
      }
    };

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
                  product.approvedQty
                ) || 0,

              approvedRemark:
                product.approvedRemark ||
                "",
            })
          );

        const receiptsPayload =
          productReceipts.map(
            (receipt) => ({
              productId:
                receipt.productId,

              receivedQuantity:
                Number(
                  receipt.receivedQuantity
                ) || 0,

              receivedRemark:
                receipt.receivedRemark ||
                "",
            })
          );

        const response =
          await axiosInstance.patch(
            `/stockrequest/${id}/complete-incomplete`,
            {
              productApprovals:
                approvalsPayload,

              productReceipts:
                receiptsPayload,
            }
          );

        if (!response.data.success) {
          setDangerAlert(
            response.data.message ||
              "Failed to complete indent"
          );

          return;
        }

        setSuccessAlert(
          "Indent completed successfully"
        );

        setTimeout(
          () => window.location.reload(),
          1000
        );
      } catch (err) {
        console.error(
          "Error in handleIncomplete:",
          err
        );

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while completing the indent";

        setDangerAlert(
          errorMessage
        );
      }
    };

  /* -------------------------------------------------------
     Challan Approval
  ------------------------------------------------------- */

  const handleWarehouseApproveChallan =
    async () => {
      const result =
        await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to approve this challan?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor:
            "#dc3545",
          cancelButtonColor:
            "#6c757d",
          confirmButtonText:
            "Yes, approve it!",
          cancelButtonText:
            "Cancel",
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
            }
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
            confirmButtonColor:
              "#d33",
            confirmButtonText: "OK",
          });
        }
      } catch (err) {
        console.error(
          "Challan approval error:",
          err
        );

        showError(err);
      }
    };

  const handleCenterApproveChallan =
    async () => {
      const result =
        await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to approve this challan?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor:
            "#dc3545",
          cancelButtonColor:
            "#6c757d",
          confirmButtonText:
            "Yes, approve it!",
          cancelButtonText:
            "Cancel",
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
            }
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
            confirmButtonColor:
              "#d33",
            confirmButtonText: "OK",
          });
        }
      } catch (err) {
        console.error(
          "Challan approval error:",
          err
        );

        showError(err);
      }
    };

  /* -------------------------------------------------------
     Print
     ------------------------------------------------------- */

  const handlePrintIndent = () => {
    const printWindow = window.open(
      "",
      "_blank"
    );

    if (!printWindow) return;

    const logoPath =
      "/src/assets/images/logo.png";

    const currentDate =
      new Date().toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

    let subtotal = 0;
    const gstRate = 18;

    const productsWithTotals =
      data.products.map((item) => {
        const approvedQty =
          item.quantity || 0;

        const salePrice =
          item.product?.salePrice || 0;

        const total =
          approvedQty * salePrice;

        const gstAmount =
          (total * gstRate) / 100;

        const amountWithGst =
          total + gstAmount;

        subtotal += total;

        return {
          ...item,
          approvedQty,
          salePrice,
          total,
          gstAmount,
          amountWithGst,
        };
      });

    const totalGst =
      (subtotal * gstRate) / 100;

    const grandTotal =
      subtotal + totalGst;

    const indentDate = data.date
      ? new Date(
          data.date
        ).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )
      : "";

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Indent Invoice - ${
          data.orderNumber || ""
        }</title>

        <style>
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          :root {
            --ink: #0f1117;
            --ink-mid: #3a3f4b;
            --ink-light: #6b7280;
            --rule: #d1d5db;
            --rule-light: #e5e8ec;
            --accent: #1a56db;
            --accent-bg: #eff4ff;
            --surface: #f8f9fb;
            --white: #ffffff;
            --status-bg: #e8f5e9;
            --status-txt: #2e7d32;
          }

          body {
            font-family: Arial, sans-serif;
            background: #edf0f4;
            color: var(--ink);
            font-size: 13px;
            line-height: 1.5;
            padding: 32px 0 48px;
          }

          .page {
            width: 900px;
            margin: 0 auto;
            background: var(--white);
            border: 1px solid var(--rule);
            border-radius: 6px;
            overflow: hidden;
          }

          .stripe {
            height: 5px;
            background: linear-gradient(
              90deg,
              var(--accent) 0%,
              #3b82f6 60%,
              #60a5fa 100%
            );
          }

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

          .logo-wrap img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }

          .company-block {
            text-align: right;
          }

          .company-name {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 6px;
          }

          .company-block p {
            font-size: 12px;
            color: var(--ink-mid);
            line-height: 1.6;
          }

          .title-band {
            background: var(--ink);
            padding: 12px 36px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .doc-title {
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
            padding: 4px 12px;
            border-radius: 20px;
          }

          .meta-row {
            display: flex;
            border-bottom: 1px solid var(--rule-light);
          }

          .meta-cell {
            flex: 1;
            padding: 14px 36px;
            border-right: 1px solid var(--rule-light);
          }

          .meta-cell:last-child {
            border-right: none;
          }

          .meta-label {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: .08em;
            text-transform: uppercase;
            color: var(--ink-light);
            margin-bottom: 3px;
          }

          .meta-value {
            font-size: 14px;
            font-weight: 500;
          }

          .address-row {
            display: grid;
            grid-template-columns: 1fr 1px 1fr;
            border-bottom: 1px solid var(--rule-light);
          }

          .address-divider {
            background: var(--rule-light);
          }

          .address-cell {
            padding: 20px 36px;
          }

          .section-label {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: .1em;
            text-transform: uppercase;
            color: var(--accent);
            padding-bottom: 5px;
            margin-bottom: 10px;
          }

          .address-name {
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 4px;
          }

          .address-cell p {
            font-size: 12px;
            color: var(--ink-mid);
            line-height: 1.65;
          }

          .table-wrap {
            padding: 0 36px 28px;
            margin-top: 24px;
          }

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
          }

          .products-table th:not(:first-child) {
            text-align: right;
          }

          .products-table td {
            padding: 9px 12px;
            border-bottom: 1px solid var(--rule-light);
            color: var(--ink-mid);
          }

          .products-table td:not(:first-child) {
            text-align: right;
          }

          .products-table td:nth-child(2) {
            text-align: left;
            color: var(--ink);
            font-weight: 500;
          }

          .amount-col {
            font-weight: 700;
            color: var(--ink);
          }

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
            padding: 8px 16px;
            border-bottom: 1px solid var(--rule-light);
            font-size: 12.5px;
          }

          .totals-line.grand {
            background: var(--ink);
            color: #fff;
          }

          .info-section {
            padding: 0 36px 28px;
          }

          .info-grid {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid var(--rule);
            font-size: 12.5px;
          }

          .info-grid td {
            padding: 9px 14px;
            border: 1px solid var(--rule-light);
          }

          .info-grid .lbl {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--ink-light);
            background: var(--surface);
            width: 14%;
          }

          .info-grid .val {
            color: var(--ink-mid);
            width: 36%;
          }

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

          .sig-block {
            text-align: center;
            width: 180px;
          }

          .sig-line {
            border-top: 1.5px solid var(--ink-mid);
            padding-top: 8px;
            margin-top: 44px;
            font-size: 11.5px;
            font-weight: 600;
            text-transform: uppercase;
          }

          .btn-row {
            text-align: center;
            padding: 20px 0 8px;
            display: flex;
            gap: 12px;
            justify-content: center;
          }

          .btn {
            padding: 10px 28px;
            font-size: 13px;
            font-weight: 600;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          .btn-primary {
            background: var(--accent);
            color: #fff;
          }

          .btn-ghost {
            background: var(--surface);
            color: var(--ink-mid);
            border: 1px solid var(--rule);
          }

          @media print {
            body {
              background: #fff;
              padding: 0;
            }

            .page {
              width: 100%;
              box-shadow: none;
              border: none;
              border-radius: 0;
            }

            .btn-row {
              display: none;
            }

            .products-table thead tr,
            .title-band,
            .totals-line.grand {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>

      <body>
        <div class="page">
          <div class="stripe"></div>

          <div class="header">
            <div class="logo-wrap">
              <img
                src="${logoPath}"
                alt="Company Logo"
              />
            </div>

            <div class="company-block">
              <div class="company-name">
                Sancfil Technologies Internet Services Pvt Ltd
              </div>
              <p>
                A1, 1st Floor, Landmark Co-operative Housing Society
              </p>
              <p>
                Sector 14, Vashi, Navi Mumbai – 400 709
              </p>
              <p>
                Tel: +91 8097578100 / 8097578176
              </p>
              <p>stock@trunet.co.in</p>
            </div>
          </div>

          <div class="title-band">
            <span class="doc-title">
              Stock Indent
            </span>

            <span class="status-pill">
              ${data.status || "Pending"}
            </span>
          </div>

          <div class="meta-row">
            <div class="meta-cell">
              <div class="meta-label">
                Indent Number
              </div>
              <div class="meta-value">
                ${data.orderNumber || "—"}
              </div>
            </div>

            <div class="meta-cell">
              <div class="meta-label">
                Indent Date
              </div>
              <div class="meta-value">
                ${indentDate || "—"}
              </div>
            </div>

            <div class="meta-cell">
              <div class="meta-label">
                Print Date
              </div>
              <div class="meta-value">
                ${currentDate}
              </div>
            </div>
          </div>

          <div class="address-row">
            <div class="address-cell">
              <div class="section-label">
                From — Center Details
              </div>

              <div class="address-name">
                ${
                  data.center?.centerName || ""
                }
              </div>

              <p>
                ${
                  data.center?.addressLine1 ||
                  ""
                }
                {" "}
                ${
                  data.center?.addressLine2 ||
                  ""
                }
              </p>

              <p>
                ${
                  data.center?.city || ""
                }
                ${
                  data.center?.city &&
                  data.center?.state
                    ? ", "
                    : ""
                }
                ${
                  data.center?.state || ""
                }
              </p>

              <p>
                ${
                  data.center?.email || ""
                }
              </p>
            </div>

            <div class="address-divider"></div>

            <div class="address-cell">
              <div class="section-label">
                To — Warehouse Details
              </div>

              <div class="address-name">
                ${
                  data.warehouse?.centerName ||
                  ""
                }
              </div>

              <p>
                ${
                  data.warehouse?.addressLine1 ||
                  ""
                }
                {" "}
                ${
                  data.warehouse?.addressLine2 ||
                  ""
                }
              </p>

              <p>
                ${
                  data.warehouse?.city || ""
                }
                ${
                  data.warehouse?.city &&
                  data.warehouse?.state
                    ? ", "
                    : ""
                }
                ${
                  data.warehouse?.state || ""
                }
              </p>

              <p>
                ${
                  data.warehouse?.email || ""
                }
              </p>
            </div>
          </div>

          <div class="table-wrap">
            <div class="table-heading">
              Products &amp; Pricing
            </div>

            <table class="products-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Rate (₹)</th>
                  <th>Total (₹)</th>
                  <th>GST @${gstRate}% (₹)</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>

              <tbody>
                ${productsWithTotals
                  .map(
                    (item, index) => `
                      <tr>
                        <td>${index + 1}</td>
                        <td>
                          ${
                            item.product
                              ?.productTitle ||
                            ""
                          }
                        </td>
                        <td>
                          ${item.quantity || 0}
                        </td>
                        <td>
                          ${item.salePrice.toFixed(
                            2
                          )}
                        </td>
                        <td>
                          ${item.total.toFixed(
                            2
                          )}
                        </td>
                        <td>
                          ${item.gstAmount.toFixed(
                            2
                          )}
                        </td>
                        <td class="amount-col">
                          ${item.amountWithGst.toFixed(
                            2
                          )}
                        </td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <div class="totals-row">
            <div class="totals-box">
              <div class="totals-line">
                <span>Subtotal</span>
                <span>
                  ₹ ${subtotal.toFixed(2)}
                </span>
              </div>

              <div class="totals-line">
                <span>
                  GST @ ${gstRate}%
                </span>
                <span>
                  ₹ ${totalGst.toFixed(2)}
                </span>
              </div>

              <div class="totals-line grand">
                <span>Grand Total</span>
                <span>
                  ₹ ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <div class="table-heading">
              Shipment &amp; Additional Info
            </div>

            <table class="info-grid">
              <tbody>
                <tr>
                  <td class="lbl">
                    Approved On
                  </td>

                  <td class="val">
                    ${
                      formatDateTime(
                        data.approvalInfo
                          ?.approvedAt
                      ) ||
                      "March 6, 2026"
                    }
                  </td>

                  <td class="lbl">
                    Shipment Date
                  </td>

                  <td class="val">
                    ${
                      formatDate(
                        data.shippingInfo
                          ?.shippedDate
                      ) ||
                      "March 6, 2026"
                    }
                  </td>
                </tr>

                <tr>
                  <td class="lbl">
                    Expected Delivery
                  </td>

                  <td class="val">
                    ${
                      formatDate(
                        data.shippingInfo
                          ?.expectedDeliveryDate
                      ) ||
                      formatDate(
                        data.shippingInfo
                          ?.shippedDate
                      ) ||
                      "March 6, 2026"
                    }
                  </td>

                  <td class="lbl">
                    Completed On
                  </td>

                  <td class="val">
                    ${
                      formatDateTime(
                        data.completedOn
                      ) ||
                      "07 Mar 2026"
                    }
                  </td>
                </tr>

                <tr>
                  <td class="lbl">
                    Shipment Detail
                  </td>

                  <td class="val">
                    ${
                      data.shippingInfo
                        ?.shipmentDetails ||
                      "—"
                    }
                  </td>

                  <td class="lbl">
                    Shipment Remark
                  </td>

                  <td class="val">
                    ${
                      data.shippingInfo
                        ?.shipmentRemark ||
                      "—"
                    }
                  </td>
                </tr>

                <tr>
                  <td class="lbl">
                    Remark
                  </td>

                  <td
                    class="val"
                    colspan="3"
                  >
                    ${data.remark || "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="sig-row">
            <p class="sig-note">
              This is a computer-generated
              indent document.
              <br />
              Please verify all details before
              processing. For queries contact
              stock@trunet.co.in
            </p>

            <div class="sig-block">
              <div class="sig-line">
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>

        <div class="btn-row">
          <button
            class="btn btn-primary"
            onclick="window.print()"
          >
            Print Indent
          </button>

          <button
            class="btn btn-ghost"
            onclick="window.close()"
          >
            Close
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(
      printContent
    );

    printWindow.document.close();
  };

  /* -------------------------------------------------------
     Navigation
  ------------------------------------------------------- */

  const handleBack = () =>
    navigate("/stock-request");

  /* -------------------------------------------------------
     Loading / Error
  ------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <span className="text-sm text-gray-500">
            Loading stock request...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Error loading stock request:{" "}
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-4 mt-5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
        Stock Request not found
      </div>
    );
  }

  const getStatusClasses = (status) => {
    const statusMap = {
      Draft:
        "bg-gray-100 text-gray-700",
      Submitted:
        "bg-blue-100 text-blue-700",
      Confirmed:
        "bg-indigo-100 text-indigo-700",
      Shipped:
        "bg-orange-100 text-orange-700",
      Completed:
        "bg-green-100 text-green-700",
      Rejected:
        "bg-red-100 text-red-700",
      Incompleted:
        "bg-yellow-100 text-yellow-700",
    };

    return (
      statusMap[status] ||
      "bg-gray-100 text-gray-700"
    );
  };

  return (
    <div className="w-full px-4 py-5 md:px-6">
      {/* Alert */}
      {alert.visible && (
        <div
          className={`mb-5 flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
            alert.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}

            <span>{alert.message}</span>
          </div>

          <button
            type="button"
            onClick={() =>
              setAlert((prev) => ({
                ...prev,
                visible: false,
              }))
            }
            className="rounded p-1 hover:bg-black/5"
          >
            <XCircle size={18} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-xl font-semibold text-gray-800">
          Indent Detail
        </h1>
      </div>

      {/* ---------------------------------------------------
          Request Details
      --------------------------------------------------- */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 px-5 py-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Indent:{" "}
              {data.orderNumber || ""}
            </h2>

            {data.status && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                  data.status
                )}`}
              >
                {data.status}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {data.status === "Shipped" &&
              hasPermission(
                "Indent",
                "complete_indent"
              ) && (
                <button
                  type="button"
                  onClick={
                    handleCompleteIndent
                  }
                  className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  <PackageCheck
                    size={16}
                  />
                  Complete The Indent
                </button>
              )}

            <button
              type="button"
              onClick={handlePrintIndent}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Printer size={16} />
              Print Indent
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <tbody>
              {[
                [
                  "Center/Center Code:",
                  data.orderNumber || "",
                  "Shipment Date:",
                  formatDate(
                    data.shippingInfo
                      ?.shippedDate || ""
                  ),
                  "Completed on:",
                  formatDateTime(
                    data.completionInfo
                      ?.completedOn || ""
                  ),
                ],
                [
                  "Indent Date:",
                  data.date || "",
                  "Expected Delivery:",
                  formatDate(
                    data.shippingInfo
                      ?.expectedDeliveryDate ||
                      ""
                  ),
                  "Completed by:",
                  data.completionInfo
                    ?.completedBy
                    ?.fullName || "",
                ],
                [
                  "Remark:",
                  data.remark || "",
                  "Shipment Detail:",
                  data.shippingInfo
                    ?.shipmentDetails || "",
                  "Incomplete on:",
                  formatDateTime(
                    data.incompleteOn || ""
                  ),
                ],
                [
                  "Created at:",
                  formatDateTime(
                    data.createdAt
                  ),
                  "Shipment Remark:",
                  data.shippingInfo
                    ?.shipmentRemark || "",
                  "Incomplete by:",
                  data.incompleteBy || "",
                ],
                [
                  "Created by:",
                  data.createdBy?.fullName ||
                    "",
                  "Document:",
                  data.document || "",
                  "Incomplete Remark:",
                  data.incompleteRemark ||
                    "",
                ],
                [
                  "Approved at:",
                  formatDateTime(
                    data.approvalInfo
                      ?.approvedAt || ""
                  ),
                  "Shipped at:",
                  formatDateTime(
                    data.shippingInfo
                      ?.shippedAt || ""
                  ),
                  "Received at:",
                  formatDateTime(
                    data.receivingInfo
                      ?.receivedAt || ""
                  ),
                ],
                [
                  "Approved by:",
                  data.approvalInfo
                    ?.approvedBy
                    ?.fullName || "",
                  "Shipped by:",
                  data.shippingInfo
                    ?.shippedBy
                    ?.fullName || "",
                  "Received by:",
                  data.receivingInfo
                    ?.receivedBy
                    ?.fullName || "",
                ],
              ].map(
                (row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <td className="w-[13%] bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600">
                      {row[0]}
                    </td>

                    <td className="w-[20%] px-4 py-3 text-sm text-gray-800">
                      {row[1]}
                    </td>

                    <td className="w-[13%] bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600">
                      {row[2]}
                    </td>

                    <td className="w-[20%] px-4 py-3 text-sm text-gray-800">
                      {row[3]}
                    </td>

                    <td className="w-[13%] bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600">
                      {row[4]}
                    </td>

                    <td className="w-[21%] px-4 py-3 text-sm text-gray-800">
                      {row[5]}
                    </td>
                  </tr>
                )
              )}

              <tr>
                <td className="bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600">
                  Challan Approved at:
                </td>

                <td className="px-4 py-3 text-sm text-gray-800">
                  {formatDateTime(
                    data.approvalInfo
                      ?.challanApprovedAt ||
                      ""
                  )}
                </td>

                <td className="bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600">
                  Challan Approved by:
                </td>

                <td
                  colSpan={3}
                  className="px-4 py-3 text-sm text-gray-800"
                >
                  {
                    data.approvalInfo
                      ?.challanApprovedBy
                      ?.fullName
                  }

                  {data.approvalInfo
                    ?.challanApprovedBy
                    ?.email && (
                    <>
                      <br />
                      <span className="text-xs text-gray-500">
                        {
                          data
                            .approvalInfo
                            .challanApprovedBy
                            .email
                        }
                      </span>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------
          Product Details
      --------------------------------------------------- */}
      <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 px-5 py-4 xl:flex-row xl:items-center">
          <h2 className="text-lg font-semibold text-gray-800">
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
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Send size={16} />
                Submit
              </button>
            )}

            {/* Confirmed */}
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
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Edit3 size={16} />
                    Change Approved Qty
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentShipmentAction(
                        () =>
                          handleShipGoods
                      );
                      setShipmentModal(
                        true
                      );
                    }}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Truck size={16} />
                    Ship the Goods
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleReject
                    }
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <Ban size={16} />
                    Reject Request
                  </button>
                </>
              )}

            {/* Warehouse View Challan */}
            {(
              data.status ===
                "Confirmed" ||
              data.status === "Shipped"
            ) &&
              isWarehouse && (
                <button
                  type="button"
                  onClick={() =>
                    setChallanModal(
                      true
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  <FileText
                    size={16}
                  />
                  View Challan
                </button>
              )}

            {/* Center View + Approve Challan */}
            {data.status ===
              "Shipped" &&
              isCenter && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setChallanModal(
                        true
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    <FileText
                      size={16}
                    />
                    View Challan
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleCenterApproveChallan
                    }
                    className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    <CheckCircle
                      size={16}
                    />
                    Approved Challan
                  </button>
                </>
              )}

            {/* Shipped Warehouse Actions */}
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
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Truck size={16} />
                    Update Shipment
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleCancelShipment
                    }
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <Ban size={16} />
                    Cancel Shipment
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleReject
                    }
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <XCircle
                      size={16}
                    />
                    Reject Request
                  </button>
                </>
              )}

            {/* Center Incomplete */}
            {data.status ===
              "Shipped" &&
              userCenterType ===
                "center" &&
              userRole === "center" &&
              isCenter && (
                <button
                  type="button"
                  onClick={() =>
                    setIncompleteModal(
                      true
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-md bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                >
                  <AlertTriangle
                    size={16}
                  />
                  Incomplete
                </button>
              )}

            {/* Submitted */}
            {data.status ===
              "Submitted" &&
              hasPermission(
                "Indent",
                "stock_transfer_approve_from_outlet"
              ) &&
              isWarehouse && (
                <>
                  <button
                    type="button"
                    onClick={
                      handleApprove
                    }
                    className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    <CheckCircle
                      size={16}
                    />
                    Submit &amp; Approve
                    Request
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleReject
                    }
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <XCircle
                      size={16}
                    />
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
                  className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  <PackageCheck
                    size={16}
                  />
                  Change Qty And
                  Complete Request
                </button>
              )}
          </div>
        </div>

        <div className="overflow-x-auto p-5">
          <table className="w-full min-w-[1200px] border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                {[
                  "Product",
                  "Center Stock",
                  "Requested Qty",
                  "Stock Qty",
                  "Product Remark",
                  "Approved Qty",
                  "Approved Remark",
                  "Received Qty",
                  "Received Remark",
                ].map((header) => (
                  <th
                    key={header}
                    className="border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                  >
                    {header}
                  </th>
                ))}
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
                          item._id
                      ) || {};

                    const receipt =
                      productReceipts.find(
                        (product) =>
                          product.productId ===
                          item.product?._id
                      );

                    const isSerialized =
                      item.product
                        ?.trackSerialNumber ===
                      "Yes";

                    return (
                      <tr
                        key={item._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.product
                            ?.productTitle ||
                            ""}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {item.centerStockQuantity ||
                            0}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {item.quantity ||
                            0}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {item.productInStock ||
                            0}
                        </td>

                        <td className="max-w-[220px] px-4 py-3 text-gray-700">
                          {item.productRemark ||
                            ""}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {isWarehouse ? (
                              <>
                                <input
                                  type="text"
                                  value={
                                    approvedItem.approvedQty ??
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleApprovedChange(
                                      item._id,
                                      "approvedQty",
                                      e.target
                                        .value
                                    )
                                  }
                                  onBlur={(e) =>
                                    handleApprovedBlur(
                                      item._id,
                                      e.target
                                        .value
                                    )
                                  }
                                  className={`w-20 rounded-md border px-2 py-1.5 text-sm outline-none ${
                                    errors[
                                      item._id
                                    ]
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-300 focus:border-blue-500"
                                  }`}
                                />

                                {isSerialized && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenSerialModal(
                                        item
                                      )
                                    }
                                    title="Add Serial Numbers"
                                    className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50"
                                  >
                                    <List
                                      size={
                                        19
                                      }
                                    />
                                  </button>
                                )}
                              </>
                            ) : (
                              approvedItem.approvedQty ||
                              ""
                            )}
                          </div>

                          {errors[
                            item._id
                          ] && (
                            <p className="mt-1 text-xs text-red-600">
                              {
                                errors[
                                  item._id
                                ]
                              }
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isWarehouse ? (
                            <input
                              type="text"
                              value={
                                approvedItem.approvedRemark ||
                                ""
                              }
                              onChange={(e) =>
                                handleApprovedChange(
                                  item._id,
                                  "approvedRemark",
                                  e.target
                                    .value
                                )
                              }
                              className="w-full min-w-[160px] rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                            />
                          ) : (
                            item.approvedRemark ||
                            ""
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {userCenterType ===
                            "center" &&
                          isCenter &&
                          data.status ===
                            "Shipped" ? (
                            <input
                              type="text"
                              value={
                                receipt
                                  ?.receivedQuantity ??
                                ""
                              }
                              onChange={(e) =>
                                handleReceiptChange(
                                  item.product?._id,
                                  "receivedQuantity",
                                  e.target
                                    .value
                                )
                              }
                              className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                            />
                          ) : (
                            item.receivedQuantity ||
                            ""
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {userCenterType ===
                            "center" &&
                          isCenter &&
                          data.status ===
                            "Shipped" ? (
                            <input
                              type="text"
                              value={
                                receipt
                                  ?.receivedRemark ||
                                ""
                              }
                              onChange={(e) =>
                                handleReceiptChange(
                                  item.product?._id,
                                  "receivedRemark",
                                  e.target
                                    .value
                                )
                              }
                              className="w-full min-w-[160px] rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                            />
                          ) : (
                            item.receivedRemark ||
                            ""
                          )}
                        </td>
                      </tr>
                    );
                  }
                )
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

      {/* ---------------------------------------------------
          Modals
      --------------------------------------------------- */}

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
        onSubmit={
          handleMarkIncomplete
        }
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
              selectedProduct?._id
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

export default StockProfile;