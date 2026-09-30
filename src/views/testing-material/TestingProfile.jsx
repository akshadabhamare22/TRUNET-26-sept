import React, {
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  Check,
  List,
  X,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

import axiosInstance from "../../axiosInstance";import { formatDateTime } from "../../utils/FormatDateTime";
import usePermission from "../../utils/usePermission";

// =====================================================
// Testing Serial Numbers Modal
// =====================================================

const TestingSerialNumbersModal = ({
  visible,
  onClose,
  product,
}) => {
  if (!visible) {
    return null;
  }

  const serialNumbers =
    product?.serialNumbers || [];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Serial Numbers for{" "}
            {product?.product
              ?.productTitle || ""}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {serialNumbers.length >
          0 ? (
            <div>
              <p className="mb-3 text-sm text-gray-700">
                <strong>
                  Total Serial Numbers:
                </strong>{" "}
                {serialNumbers.length}
              </p>

              <div className="max-h-[300px] overflow-y-auto rounded-md border border-gray-200">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr>
                      <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                        #
                      </th>

                      <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                        Serial Number
                      </th>

                      <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {serialNumbers.map(
                      (
                        serial,
                        index,
                      ) => (
                        <tr
                          key={`${serial.serialNumber}-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                            {index + 1}
                          </td>

                          <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                            {
                              serial.serialNumber
                            }
                          </td>

                          <td className="border-b border-gray-200 px-4 py-3">
                            <StatusBadge
                              status={
                                serial.status ||
                                "pending_testing"
                              }
                              serial
                            />
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-500">
              No serial numbers
              found for this
              product.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// Status Badge
// =====================================================

const StatusBadge = ({
  status,
  result = false,
}) => {
  const statusConfig = result
    ? {
        passed: {
          className:
            "bg-green-100 text-green-700",
          label: "Passed",
        },
        failed: {
          className:
            "bg-red-100 text-red-700",
          label: "Failed",
        },
        inconclusive: {
          className:
            "bg-yellow-100 text-yellow-700",
          label: "Inconclusive",
        },
        under_testing: {
          className:
            "bg-blue-100 text-blue-700",
          label: "Testing",
        },
        pending: {
          className:
            "bg-gray-100 text-gray-700",
          label: "Pending",
        },
      }
    : {
        pending_testing: {
          className:
            "bg-yellow-100 text-yellow-700",
          label: "Pending Testing",
        },
        under_testing: {
          className:
            "bg-blue-100 text-blue-700",
          label: "Under Testing",
        },
        completed: {
          className:
            "bg-green-100 text-green-700",
          label: "Completed",
        },
        cancelled: {
          className:
            "bg-red-100 text-red-700",
          label: "Cancelled",
        },
      };

  const config =
    statusConfig[status] || {
      className:
        "bg-gray-100 text-gray-700",
      label: status,
    };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

TestingSerialNumbersModal.propTypes =
  {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    product: PropTypes.shape({
      product: PropTypes.shape({
        productTitle:
          PropTypes.string,
      }),
      serialNumbers:
        PropTypes.arrayOf(
          PropTypes.shape({
            serialNumber:
              PropTypes.string,
            status:
              PropTypes.string,
          }),
        ),
    }),
  };

TestingSerialNumbersModal.defaultProps =
  {
    product: null,
  };

// =====================================================
// Testing Profile
// =====================================================

const TestingProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [alert, setAlert] =
    useState({
      type: "",
      message: "",
      visible: false,
    });

  const [serialModal, setSerialModal] =
    useState(false);

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);

  const userCenter =
    JSON.parse(
      localStorage.getItem(
        "userCenter",
      ),
    ) || {};

  const userCenterId =
    userCenter._id;

  const isToCenter =
    data?.toCenter?._id ===
    userCenterId;

  const { hasPermission } =
    usePermission();

  // ===================================================
  // Fetch Testing Material
  // ===================================================

  useEffect(() => {
    fetchTestingMaterial();
  }, [id]);

  const fetchTestingMaterial =
    async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await axiosInstance.get(
            `/testing-material/${id}`,
          );

        if (
          response.data.success
        ) {
          setData(
            response.data.data,
          );
        } else {
          throw new Error(
            "Failed to fetch data",
          );
        }
      } catch (err) {
        setError(err.message);

        console.error(
          "Error fetching data:",
          err,
        );
      } finally {
        setLoading(false);
      }
    };

  // ===================================================
  // Back
  // ===================================================

  const handleBack = () => {
    navigate("/testing-stock");
  };

  // ===================================================
  // Serial Modal
  // ===================================================

  const handleOpenSerialModal =
    (product) => {
      setSelectedProduct(
        product,
      );
      setSerialModal(true);
    };

  // ===================================================
  // Accept Request
  // ===================================================

  const handleAcceptRequest =
    async () => {
      const result =
        await Swal.fire({
          title:
            "Accept Testing Request?",
          text:
            "Are you sure you want to accept this testing request?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor:
            "#28a745",
          cancelButtonColor:
            "#6c757d",
          confirmButtonText:
            "Yes, Accept",
          cancelButtonText:
            "Cancel",
        });

      if (!result.isConfirmed) {
        return;
      }

      try {
        setLoading(true);

        const response =
          await axiosInstance.put(
            `/testing-material/${id}/accept`,
            {},
          );

        if (
          response.data.success
        ) {
          setAlert({
            type: "success",
            message:
              "Testing request accepted successfully!",
            visible: true,
          });

          fetchTestingMaterial();
        } else {
          throw new Error(
            response.data
              .message ||
              "Failed to accept request",
          );
        }
      } catch (err) {
        setAlert({
          type: "danger",
          message:
            err.response?.data
              ?.message ||
            "Error accepting request",
          visible: true,
        });
      } finally {
        setLoading(false);
      }
    };

  // ===================================================
  // Loading
  // ===================================================

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  // ===================================================
  // Error
  // ===================================================

  if (error) {
    return (
      <div
        className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        Error loading testing
        material: {error}
      </div>
    );
  }

  // ===================================================
  // No Data
  // ===================================================

  if (!data) {
    return (
      <div
        className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700"
        role="alert"
      >
        Testing Material Request
        not found
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Alert */}
      {alert.visible && (
        <div
          className={`mb-4 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
            alert.type ===
            "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <span>
            {alert.message}
          </span>

          <button
            type="button"
            onClick={() =>
              setAlert({
                ...alert,
                visible: false,
              })
            }
            className="ml-4 rounded p-1 hover:bg-black/5"
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page Title */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-xl font-semibold text-gray-800">
          Testing Material Request
          Details
        </h1>
      </div>

      {/* Request Details */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="text-base font-semibold text-gray-800">
            Request:{" "}
            {data.requestNumber}

            {data.status && (
              <span className="ml-2">
                <StatusBadge
                  status={data.status}
                />
              </span>
            )}
          </div>

          <div className="flex items-center">
            {data.status ===
              "pending_testing" &&
              isToCenter &&
              hasPermission(
                "Testing Material",
                "accept_testing_request",
              ) && (
                <button
                  type="button"
                  onClick={
                    handleAcceptRequest
                  }
                  className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  <Check
                    size={15}
                  />
                  Accept Request
                </button>
              )}
          </div>
        </div>

        {/* Details */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <tbody>
              <tr>
                <td className="w-[14%] border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700">
                  Request Number:
                </td>

                <td className="w-[19%] border border-gray-200 px-4 py-3 text-gray-700">
                  {data.requestNumber}
                </td>

                <td className="w-[14%] border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700">
                  Status:
                </td>

                <td className="w-[19%] border border-gray-200 px-4 py-3">
                  <StatusBadge
                    status={
                      data.status
                    }
                  />
                </td>

                <td className="w-[14%] border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700">
                  Completed At:
                </td>

                <td className="w-[20%] border border-gray-200 px-4 py-3 text-gray-700">
                  {formatDateTime(
                    data.completedAt ||
                      "",
                  )}
                </td>
              </tr>

              <tr>
                <td className="border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700">
                  From Center:
                </td>

                <td className="border border-gray-200 px-4 py-3 text-gray-700">
                  {data.fromCenter
                    ?.centerName}{" "}
                  (
                  {
                    data
                      .fromCenter
                      ?.centerCode
                  }
                  )
                </td>

                <td className="border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700">
                  To Center:
                </td>

                <td className="border border-gray-200 px-4 py-3 text-gray-700">
                  {data.toCenter
                    ?.centerName}{" "}
                  (
                  {
                    data.toCenter
                      ?.centerCode
                  }
                  )
                </td>

                <td className="border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700">
                  Completed By:
                </td>

                <td className="border border-gray-200 px-4 py-3 text-gray-700">
                  {data.completedBy
                    ?.fullName || ""}
                </td>
              </tr>

              <tr>
                <td className="border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700">
                  Requested At:
                </td>

                <td className="border border-gray-200 px-4 py-3 text-gray-700">
                  {formatDateTime(
                    data.requestedAt,
                  )}
                </td>

                <td className="border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700">
                  Accepted At:
                </td>

                <td className="border border-gray-200 px-4 py-3 text-gray-700">
                  {formatDateTime(
                    data.acceptedAt ||
                      "",
                  )}
                </td>

                <td className="border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700">
                  Remark:
                </td>

                <td className="border border-gray-200 px-4 py-3 text-gray-700">
                  {data.remark ||
                    "N/A"}
                </td>
              </tr>

              <tr>
                <td className="border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700">
                  Requested By:
                </td>

                <td className="border border-gray-200 px-4 py-3 text-gray-700">
                  {
                    data
                      .requestedBy
                      ?.fullName
                  }
                </td>

                <td className="border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700">
                  Accepted By:
                </td>

                <td className="border border-gray-200 px-4 py-3 text-gray-700">
                  {data.acceptedBy
                    ?.fullName || ""}
                </td>

                <td className="border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700">
                  Total Products:
                </td>

                <td className="border border-gray-200 px-4 py-3 text-gray-700">
                  {data.products
                    ?.length || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-800">
            Product Details
          </h2>
        </div>

        <div className="p-4">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[750px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                    #
                  </th>

                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                    Product
                  </th>

                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                    Product Code
                  </th>

                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                    Quantity
                  </th>

                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                    Test Result
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.products
                  ?.length > 0 ? (
                  data.products.map(
                    (
                      item,
                      index,
                    ) => {
                      const isSerialized =
                        item.product
                          ?.trackSerialNumber ===
                        "Yes";

                      const hasSerialNumbers =
                        isSerialized &&
                        item
                          .serialNumbers
                          ?.length >
                          0;

                      return (
                        <tr
                          key={
                            item._id
                          }
                          className="transition hover:bg-gray-50"
                        >
                          <td className="border border-gray-200 px-4 py-3 text-gray-700">
                            {index +
                              1}
                          </td>

                          <td className="border border-gray-200 px-4 py-3 text-gray-700">
                            {item
                              .product
                              ?.productTitle ||
                              ""}
                          </td>

                          <td className="border border-gray-200 px-4 py-3 text-gray-700">
                            {item
                              .product
                              ?.productCode ||
                              ""}
                          </td>

                          <td className="border border-gray-200 px-4 py-3 text-center text-gray-700">
                            <div className="flex items-center justify-center gap-2">
                              <span>
                                {item.quantity ||
                                  0}
                              </span>

                              {hasSerialNumbers && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenSerialModal(
                                      item,
                                    )
                                  }
                                  title={`View ${item.serialNumbers.length} serial number(s)`}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <List
                                    size={
                                      18
                                    }
                                  />
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="border border-gray-200 px-4 py-3">
                            <StatusBadge
                              status={
                                item.testResult ||
                                "pending"
                              }
                              result
                            />
                          </td>
                        </tr>
                      );
                    },
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="border border-gray-200 px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No products
                      found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Serial Numbers Modal */}
      <TestingSerialNumbersModal
        visible={serialModal}
        onClose={() =>
          setSerialModal(false)
        }
        product={
          selectedProduct
        }
      />
    </div>
  );
};

export default TestingProfile;