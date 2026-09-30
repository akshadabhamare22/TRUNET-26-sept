import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Check, X, Upload } from "lucide-react";

const getToday = () =>
  new Date().toISOString().split("T")[0];

const ShipGoodsModal = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [shipmentData, setShipmentData] =
    useState({
      shippedDate: getToday(),
      expectedDeliveryDate: getToday(),
      shipmentDetails: "",
      shipmentRemark: "",
      documents: [],
    });

  useEffect(() => {
    if (initialData) {
      setShipmentData({
        shippedDate:
          initialData.shippedDate ||
          getToday(),
        expectedDeliveryDate:
          initialData.expectedDeliveryDate ||
          getToday(),
        shipmentDetails:
          initialData.shipmentDetails || "",
        shipmentRemark:
          initialData.shipmentRemark || "",
        documents:
          initialData.documents || [],
      });
    }
  }, [initialData]);

  const handleChange = (
    field,
    value
  ) => {
    setShipmentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e) => {
    handleChange(
      "documents",
      Array.from(e.target.files)
    );
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(shipmentData);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Shipment
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Enter shipment and delivery
              details
            </p>
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
          <div className="space-y-5">
            {/* Shipment Date */}
            <div>
              <label
                htmlFor="shippedDate"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Shipment Date
              </label>

              <input
                id="shippedDate"
                type="date"
                value={
                  shipmentData.shippedDate
                }
                onChange={(e) =>
                  handleChange(
                    "shippedDate",
                    e.target.value
                  )
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Expected Delivery Date */}
            <div>
              <label
                htmlFor="expectedDeliveryDate"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Expected Delivery Date
              </label>

              <input
                id="expectedDeliveryDate"
                type="date"
                value={
                  shipmentData.expectedDeliveryDate
                }
                onChange={(e) =>
                  handleChange(
                    "expectedDeliveryDate",
                    e.target.value
                  )
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* File Attachment */}
            <div>
              <label
                htmlFor="shipmentDocuments"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                File Attachment
              </label>

              <div className="relative">
                <Upload
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="shipmentDocuments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {shipmentData.documents?.length >
                0 && (
                <p className="mt-1.5 text-xs text-gray-500">
                  {
                    shipmentData.documents
                      .length
                  }{" "}
                  file
                  {shipmentData.documents
                    .length > 1
                    ? "s"
                    : ""}{" "}
                  selected
                </p>
              )}
            </div>

            {/* Shipment Details */}
            <div>
              <label
                htmlFor="shipmentDetails"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Shipment Details
              </label>

              <textarea
                id="shipmentDetails"
                rows={3}
                value={
                  shipmentData.shipmentDetails
                }
                onChange={(e) =>
                  handleChange(
                    "shipmentDetails",
                    e.target.value
                  )
                }
                className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter shipment details..."
              />
            </div>

            {/* Shipment Remark */}
            <div>
              <label
                htmlFor="shipmentRemark"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Shipment Remark
              </label>

              <textarea
                id="shipmentRemark"
                rows={2}
                value={
                  shipmentData.shipmentRemark
                }
                onChange={(e) =>
                  handleChange(
                    "shipmentRemark",
                    e.target.value
                  )
                }
                className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter shipment remark..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <X size={16} />
            Close
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Check size={16} />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

ShipGoodsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

ShipGoodsModal.defaultProps = {
  initialData: null,
};

export default ShipGoodsModal;