import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Save, X } from "lucide-react";

const SerialNumberModal = ({
  visible,
  onClose,
  product,
  selectedRow,
  onSave,
}) => {
  const [serialText, setSerialText] = useState("");

  useEffect(() => {
    if (selectedRow && selectedRow.serialNumbers) {
      setSerialText(selectedRow.serialNumbers.join("\n"));
    } else {
      setSerialText("");
    }
  }, [selectedRow, visible]);

  const handleSave = () => {
    if (product) {
      onSave(product._id, serialText);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Serial Number for {product?.productTitle || "Product"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div>
            <label
              htmlFor="serialNumbers"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Serial Numbers
            </label>

            <textarea
              id="serialNumbers"
              name="serialNumbers"
              value={serialText}
              onChange={(e) => setSerialText(e.target.value)}
              rows={6}
              placeholder="Enter one serial number per line"
              className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-3 rounded-md bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">
              Please provide one serial number per line.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <X size={16} />
            Close
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Save size={16} />
            Save Serial Numbers
          </button>
        </div>
      </div>
    </div>
  );
};

SerialNumberModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    _id: PropTypes.string,
    productTitle: PropTypes.string,
  }),
  selectedRow: PropTypes.shape({
    quantity: PropTypes.number,
    serialNumbers: PropTypes.arrayOf(PropTypes.string),
  }),
  onSave: PropTypes.func.isRequired,
};

export default SerialNumberModal;