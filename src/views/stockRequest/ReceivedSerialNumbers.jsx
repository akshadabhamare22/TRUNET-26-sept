import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

const ReceivedSerialNumbers = ({
  visible,
  onClose,
  product,
}) => {
  const [loading, setLoading] = useState(false);
  const [serialDetails, setSerialDetails] = useState([]);

  useEffect(() => {
    if (visible && product) {
      processSerialDetails();
    }
  }, [visible, product]);

  const processSerialDetails = () => {
    if (!product) return;

    const details = [];

    // Get transferred serials from the product
    const transferredSerials =
      product.transferredSerials || [];

    const centerStockSerials =
      product.centerStockSerials?.allSerials || [];

    // For each transferred serial, find its details
    transferredSerials.forEach((serialNumber) => {
      const serialDetail =
        centerStockSerials.find(
          (s) => s.serialNumber === serialNumber
        );

      if (serialDetail) {
        details.push({
          serialNumber:
            serialDetail.serialNumber,

          status:
            serialDetail.status ||
            "transferred",

          currentLocation:
            serialDetail.currentLocation,

          transferredDate:
            serialDetail.transferredDate,

          source:
            getSourceFromTransferHistory(
              serialDetail.transferHistory
            ),

          transferHistory:
            serialDetail.transferHistory || [],
        });
      } else {
        // If not found in center stock, it might be with reseller
        details.push({
          serialNumber,
          status: "transferred",
          currentLocation: "Reseller",
          transferredDate: null,
          source: "Unknown",
          transferHistory: [],
        });
      }
    });

    setSerialDetails(details);
  };

  const getSourceFromTransferHistory = (
    transferHistory
  ) => {
    if (
      !transferHistory ||
      transferHistory.length === 0
    ) {
      return "Unknown";
    }

    const lastTransfer =
      transferHistory[
        transferHistory.length - 1
      ];

    if (
      lastTransfer.transferType ===
      "inbound_transfer"
    ) {
      return "Outlet";
    }

    if (
      lastTransfer.transferType ===
      "center_to_reseller_return"
    ) {
      return "Reseller";
    }

    return "Unknown";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return (
          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
            Available
          </span>
        );

      case "transferred":
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
            Transferred
          </span>
        );

      case "consumed":
        return (
          <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
            Consumed
          </span>
        );

      default:
        return (
          <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getSourceBadge = (source) => {
    switch (source) {
      case "Outlet":
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
            Outlet
          </span>
        );

      case "Reseller":
        return (
          <span className="inline-flex rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700">
            Reseller
          </span>
        );

      default:
        return (
          <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
            {source}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(
      dateString
    ).toLocaleString();
  };

  if (!product) return null;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Serial Numbers for{" "}
              {product?.product?.productTitle}
            </h2>

            {product?.product?.productCode && (
              <p className="mt-1 text-xs text-gray-500">
                Product Code:{" "}
                {product.product.productCode}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <div className="mt-3 text-sm text-gray-500">
                Loading serial numbers...
              </div>
            </div>
          ) : serialDetails.length === 0 ? (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              No transferred serial numbers found
              for this product.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[600px] border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700"
                      style={{ width: "15%" }}
                    >
                      SR No.
                    </th>

                    <th
                      className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700"
                      style={{ width: "45%" }}
                    >
                      Serial Number
                    </th>

                    <th
                      className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700"
                      style={{ width: "40%" }}
                    >
                      Source
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {serialDetails.map(
                    (serial, index) => (
                      <tr
                        key={`${serial.serialNumber}-${index}`}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
                          <span className="font-semibold">
                            {index + 1}
                          </span>
                        </td>

                        <td className="border-b border-gray-100 px-4 py-3">
                          <span className="font-semibold text-gray-800">
                            {serial.serialNumber}
                          </span>
                        </td>

                        <td className="border-b border-gray-100 px-4 py-3">
                          {getSourceBadge(
                            serial.source
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ReceivedSerialNumbers.propTypes = {
  visible: PropTypes.bool.isRequired,

  onClose: PropTypes.func.isRequired,

  product: PropTypes.shape({
    product: PropTypes.shape({
      _id: PropTypes.string,
      productTitle: PropTypes.string,
      productCode: PropTypes.string,
      trackSerialNumber: PropTypes.string,
    }),

    approvedQuantity:
      PropTypes.number,

    receivedQuantity:
      PropTypes.number,

    transferredSerials:
      PropTypes.arrayOf(
        PropTypes.string
      ),

    sourceBreakdown:
      PropTypes.shape({
        fromReseller:
          PropTypes.shape({
            quantity:
              PropTypes.number,
            serials:
              PropTypes.array,
          }),

        fromOutlet:
          PropTypes.shape({
            quantity:
              PropTypes.number,
            serials:
              PropTypes.array,
          }),
      }),

    centerStockSerials:
      PropTypes.shape({
        allSerials:
          PropTypes.array,
      }),
  }),
};

ReceivedSerialNumbers.defaultProps = {
  product: null,
};

export default ReceivedSerialNumbers;