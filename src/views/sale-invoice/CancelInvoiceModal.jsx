import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, X } from 'lucide-react';

const CancelInvoiceModal = ({
  visible,
  onClose,
  onConfirm,
  invoice,
}) => {
  const [cancelReason, setCancelReason] =
    useState('');

  const [cancelWithCreditNote, setCancelWithCreditNote] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const handleSubmit = async () => {
    if (!cancelReason.trim()) {
      setError(
        'Please enter a reason for cancellation'
      );
      return;
    }

    if (cancelWithCreditNote === '') {
      setError(
        'Please select whether to cancel with credit note'
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onConfirm({
        cancelReason:
          cancelReason.trim(),

        cancelWithCreditNote:
          cancelWithCreditNote === 'yes',
      });

      setCancelReason('');
      setCancelWithCreditNote('');
      setError('');

      onClose();
    } catch (err) {
      setError(
        err.message ||
          'Failed to cancel invoice'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCancelReason('');
    setCancelWithCreditNote('');
    setError('');

    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Cancel Invoice
          </h2>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Invoice Information */}
          {invoice && (
            <div className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div>
                  <span className="font-semibold text-gray-700">
                    Invoice No:
                  </span>{' '}
                  <span className="text-gray-600">
                    {invoice.invoiceNumber ||
                      'N/A'}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-gray-700">
                    Reseller:
                  </span>{' '}
                  <span className="text-gray-600">
                    {invoice.reseller
                      ?.businessName ||
                      'N/A'}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-gray-700">
                    Date:
                  </span>{' '}
                  <span className="text-gray-600">
                    {invoice.invoiceDate
                      ? new Date(
                          invoice.invoiceDate
                        ).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-gray-700">
                    Amount:
                  </span>{' '}
                  <span className="font-medium text-gray-800">
                    ₹
                    {invoice.totalAmount?.toFixed(
                      2
                    ) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            {/* Cancel Reason */}
            <div className="mb-5">
              <label
                htmlFor="cancelReason"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Cancel Reason{' '}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <textarea
                id="cancelReason"
                rows={4}
                value={cancelReason}
                onChange={(event) =>
                  setCancelReason(
                    event.target.value
                  )
                }
                disabled={loading}
                placeholder="Enter reason for cancellation..."
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            {/* Credit Note */}
            <div className="mb-5">
              <label
                htmlFor="cancelWithCreditNote"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Cancel with Credit Note{' '}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <select
                id="cancelWithCreditNote"
                value={
                  cancelWithCreditNote
                }
                onChange={(event) =>
                  setCancelWithCreditNote(
                    event.target.value
                  )
                }
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">
                  Select option
                </option>

                <option value="yes">
                  Yes
                </option>

                <option value="no">
                  No
                </option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-2 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertTriangle
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {error}
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Cancelling...
              </>
            ) : (
              'Cancel Invoice'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

CancelInvoiceModal.propTypes = {
  visible: PropTypes.bool.isRequired,

  onClose: PropTypes.func.isRequired,

  onConfirm: PropTypes.func.isRequired,

  invoice: PropTypes.shape({
    invoiceNumber:
      PropTypes.string,

    reseller:
      PropTypes.shape({
        businessName:
          PropTypes.string,
      }),

    invoiceDate:
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),

    totalAmount:
      PropTypes.number,
  }),
};

export default CancelInvoiceModal;