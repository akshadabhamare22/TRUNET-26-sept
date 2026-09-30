import React from 'react';
import PropTypes from 'prop-types';
import {
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  Home,
  Info,
  User,
  X,
} from 'lucide-react';

import {
  formatDate,
  formatDateTime,
} from '../../utils/FormatDateTime';

const InvoiceDetailsModal = ({
  visible,
  onClose,
  invoice,
  onDownload,
}) => {
  if (!visible || !invoice) {
    return null;
  }

  const isCancelled =
    invoice.status === 'cancelled';

  const getStatusBadge = (status) => {
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
          Cancelled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
        Generated
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-5"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div
          className={`flex shrink-0 items-center justify-between px-6 py-4 ${
            isCancelled
              ? 'bg-red-600 text-white'
              : 'bg-[#2759a2] text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText size={21} />

            <h2 className="text-lg font-semibold">
              Invoice Details -{' '}
              {invoice?.invoiceNumber ||
                'N/A'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/90 transition hover:bg-white/15 hover:text-white"
            aria-label="Close"
          >
            <X size={21} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5">
          {/* Cancellation Details */}
          {isCancelled &&
            invoice?.cancellationDetails && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-5">
                <div className="mb-4 flex items-center gap-2 text-red-700">
                  <Info size={19} />

                  <h3 className="text-sm font-semibold">
                    Invoice Cancellation
                    Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Cancel Reason */}
                  <div>
                    <p className="mb-1 text-sm font-semibold text-gray-700">
                      Cancel Reason:
                    </p>

                    <p className="text-sm text-gray-600">
                      {invoice
                        .cancellationDetails
                        .cancelReason ||
                        'N/A'}
                    </p>
                  </div>

                  {/* Credit Note */}
                  <div>
                    <p className="mb-1 text-sm font-semibold text-gray-700">
                      Credit Note Option:
                    </p>

                    {invoice
                      .cancellationDetails
                      .cancelWithCreditNote ? (
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Yes - Cancel with
                        credit note
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                        No - Without Credit
                        Note
                      </span>
                    )}
                  </div>

                  {/* Cancelled By */}
                  <div>
                    <p className="mb-1 text-sm font-semibold text-gray-700">
                      Cancelled By:
                    </p>

                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <User size={15} />

                      <span>
                        {invoice
                          .cancellationDetails
                          .cancelledBy
                          ?.fullName ||
                          invoice
                            .cancellationDetails
                            .cancelledBy
                            ?.email ||
                          'Unknown User'}
                      </span>
                    </div>
                  </div>

                  {/* Cancelled On */}
                  <div>
                    <p className="mb-1 text-sm font-semibold text-gray-700">
                      Cancelled On:
                    </p>

                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <CalendarDays
                        size={15}
                      />

                      <span>
                        {formatDateTime(
                          invoice
                            .cancellationDetails
                            .cancelledAt
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Credit Note Message */}
                  {invoice
                    .cancellationDetails
                    .cancelWithCreditNote && (
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                        <CreditCard
                          size={17}
                        />

                        <span>
                          This invoice was
                          cancelled with
                          credit note
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Information Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Reseller Information */}
            <div className="h-full rounded-lg border border-gray-200 border-t-4 border-t-blue-600 bg-white shadow-sm">
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Building2
                    size={20}
                    className="text-blue-600"
                  />

                  <h3 className="text-sm font-semibold text-gray-800">
                    Reseller Information
                  </h3>
                </div>

                <div className="my-3 border-t border-gray-200" />

                <div className="space-y-2 text-sm">
                  <p>
                    <strong className="text-gray-700">
                      Business Name:
                    </strong>{' '}
                    <span className="text-gray-600">
                      {invoice?.reseller
                        ?.businessName ||
                        'N/A'}
                    </span>
                  </p>

                  <p>
                    <strong className="text-gray-700">
                      GST Number:
                    </strong>{' '}
                    <span className="text-gray-600">
                      {invoice?.reseller
                        ?.gstNumber ||
                        'N/A'}
                    </span>
                  </p>

                  <p>
                    <strong className="text-gray-700">
                      Address:
                    </strong>{' '}
                    <span className="text-gray-600">
                      {invoice?.reseller
                        ?.address1 ||
                        'N/A'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Centers */}
            <div className="h-full rounded-lg border border-gray-200 border-t-4 border-t-green-600 bg-white shadow-sm">
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Home
                    size={20}
                    className="text-green-600"
                  />

                  <h3 className="text-sm font-semibold text-gray-800">
                    Centers
                  </h3>
                </div>

                <div className="my-3 border-t border-gray-200" />

                {invoice?.centers &&
                invoice.centers.length >
                  0 ? (
                  <div className="space-y-2">
                    {invoice.centers.map(
                      (
                        center,
                        index
                      ) => (
                        <div
                          key={`${center?.centerName || 'center'}-${index}`}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <Building2
                            size={15}
                            className="shrink-0 text-gray-400"
                          />

                          <span>
                            {center
                              ?.centerName ||
                              'N/A'}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No centers
                    available
                  </p>
                )}
              </div>
            </div>

            {/* Invoice Details */}
            <div className="h-full rounded-lg border border-gray-200 border-t-4 border-t-cyan-600 bg-white shadow-sm">
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <CalendarDays
                    size={20}
                    className="text-cyan-600"
                  />

                  <h3 className="text-sm font-semibold text-gray-800">
                    Invoice Details
                  </h3>
                </div>

                <div className="my-3 border-t border-gray-200" />

                <div className="space-y-2 text-sm">
                  <p>
                    <strong className="text-gray-700">
                      Invoice Date:
                    </strong>{' '}
                    <span className="text-gray-600">
                      {formatDate(
                        invoice?.invoiceDate
                      )}
                    </span>
                  </p>

                  <div>
                    <strong className="text-gray-700">
                      Status:
                    </strong>{' '}
                    {getStatusBadge(
                      invoice?.status
                    )}
                  </div>

                  <p>
                    <strong className="text-gray-700">
                      Created:
                    </strong>{' '}
                    <span className="text-gray-600">
                      {formatDateTime(
                        invoice?.createdAt
                      )}
                    </span>
                  </p>

                  {invoice?.createdBy && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                      <User size={14} />

                      <span>
                        Created by:{' '}
                        {invoice
                          .createdBy
                          .fullName ||
                          invoice
                            .createdBy
                            .email ||
                          'Unknown'}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

InvoiceDetailsModal.propTypes = {
  visible:
    PropTypes.bool.isRequired,

  onClose:
    PropTypes.func.isRequired,

  onDownload:
    PropTypes.func,

  invoice:
    PropTypes.shape({
      invoiceNumber:
        PropTypes.string,

      status:
        PropTypes.string,

      invoiceDate:
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date),
        ]),

      createdAt:
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date),
        ]),

      createdBy:
        PropTypes.shape({
          fullName:
            PropTypes.string,
          email:
            PropTypes.string,
        }),

      cancellationDetails:
        PropTypes.shape({
          cancelReason:
            PropTypes.string,

          cancelWithCreditNote:
            PropTypes.bool,

          cancelledAt:
            PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.instanceOf(
                Date
              ),
            ]),

          cancelledBy:
            PropTypes.shape({
              fullName:
                PropTypes.string,
              email:
                PropTypes.string,
            }),
        }),

      reseller:
        PropTypes.shape({
          businessName:
            PropTypes.string,

          gstNumber:
            PropTypes.string,

          address1:
            PropTypes.string,
        }),

      centers:
        PropTypes.arrayOf(
          PropTypes.shape({
            centerName:
              PropTypes.string,
          })
        ),
    }),
};

export default InvoiceDetailsModal;