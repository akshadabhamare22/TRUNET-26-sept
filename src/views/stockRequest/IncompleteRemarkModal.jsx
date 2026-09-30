import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FileText, Send, X } from "lucide-react";

const IncompleteRemarkModal = ({
  visible,
  onClose,
  onSubmit,
  initialRemark = "",
}) => {
  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (initialRemark) {
      setRemark(initialRemark);
    } else {
      setRemark("");
    }
  }, [initialRemark, visible]);

  const handleSubmit = () => {
    if (!remark.trim()) return;

    onSubmit(remark);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <FileText
              size={20}
              className="text-blue-600"
            />

            <h2 className="text-lg font-semibold text-gray-800">
              Add Incomplete Remark
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <label
            htmlFor="incomplete-remark"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Remark
          </label>

          <textarea
            id="incomplete-remark"
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter remark..."
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {!remark.trim() && (
            <p className="mt-1.5 text-xs text-gray-500">
              Please enter a remark before submitting.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <X size={16} />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!remark.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

IncompleteRemarkModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialRemark: PropTypes.string,
};

export default IncompleteRemarkModal;