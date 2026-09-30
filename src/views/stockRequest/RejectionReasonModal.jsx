import React, { useState } from "react";
import PropTypes from "prop-types";
import { AlertCircle, Send, X } from "lucide-react";

const RejectionReasonModal = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [rejectionReason, setRejectionReason] =
    useState("");

  const [customReason, setCustomReason] =
    useState("");

  const [error, setError] = useState("");

  const rejectionOptions = [
    {
      value: "",
      label: "Select a reason...",
    },
    {
      value: "No consumption/Usage added",
      label: "No consumption/Usage added",
    },
    {
      value: "Wrong request",
      label: "Wrong request",
    },
    {
      value:
        "Select appropriate warehouse and raise request again",
      label:
        "Select appropriate warehouse and raise request again",
    },
    {
      value:
        "Share one request at a time with all required items",
      label:
        "Share one request at a time with all required items",
    },
    {
      value: "other",
      label: "other",
    },
  ];

  const handleSubmit = () => {
    let finalReason = rejectionReason;

    if (rejectionReason === "other") {
      if (!customReason.trim()) {
        setError(
          "Please provide the rejection reason"
        );
        return;
      }

      finalReason = customReason;
    } else if (!rejectionReason) {
      setError(
        "Please select a rejection reason"
      );
      return;
    }

    onSubmit(finalReason);

    setRejectionReason("");
    setCustomReason("");
    setError("");
  };

  const handleClose = () => {
    setRejectionReason("");
    setCustomReason("");
    setError("");
    onClose();
  };

  const handleReasonChange = (value) => {
    setRejectionReason(value);

    if (error) {
      setError("");
    }
  };

  if (!visible) return null;

  const isReasonError =
    !!error &&
    rejectionReason !== "other";

  const isCustomError =
    !!error &&
    rejectionReason === "other";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Reject Stock Request
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-5 py-5">
          {/* Rejection Reason */}
          <div>
            <label
              htmlFor="rejectionReason"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Reason for Reject{" "}
              <span className="text-red-500">
                *
              </span>
            </label>

            <select
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) =>
                handleReasonChange(
                  e.target.value
                )
              }
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition ${
                isReasonError
                  ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            >
              {rejectionOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>

            {isReasonError && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Custom Reason */}
          {rejectionReason ===
            "other" && (
            <div>
              <label
                htmlFor="customReason"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Please specify reason{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <textarea
                id="customReason"
                value={customReason}
                onChange={(e) => {
                  setCustomReason(
                    e.target.value
                  );

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="Please provide the specific reason for rejection..."
                rows={4}
                className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 ${
                  isCustomError
                    ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />

              {isCustomError && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <X size={16} />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            <Send size={16} />
            Reject Request
          </button>
        </div>
      </div>
    </div>
  );
};

RejectionReasonModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default RejectionReasonModal;