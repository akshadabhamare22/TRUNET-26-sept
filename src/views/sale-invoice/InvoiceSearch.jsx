import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { RotateCcw, Search, X } from 'lucide-react';
import Select from 'react-select';

const InvoiceSearch = ({
  visible,
  onClose,
  onSearch,
  centers,
  resellers,
}) => {
  const initialSearchData = {
    center: '',
    reseller: '',
    startDate: '',
    endDate: '',
    status: '',
    cancelWithCreditNote: '',
    invoiceNumber: '',
  };

  const [searchData, setSearchData] =
    useState(initialSearchData);

  const [filteredCenters, setFilteredCenters] =
    useState([]);

  // Filter centers based on selected reseller
  useEffect(() => {
    if (searchData.reseller) {
      const filtered = centers.filter(
        (center) =>
          center.reseller?._id ===
          searchData.reseller
      );

      setFilteredCenters(filtered);
    } else {
      setFilteredCenters(centers);
    }

    // Reset center selection when reseller changes
    setSearchData((prev) => ({
      ...prev,
      center: '',
    }));
  }, [searchData.reseller, centers]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const apiSearchData = {
      center: searchData.center,
      reseller: searchData.reseller,
      invoiceNumber:
        searchData.invoiceNumber,
      status: searchData.status,
      cancelWithCreditNote:
        searchData.cancelWithCreditNote,
    };

    if (
      searchData.startDate &&
      searchData.endDate
    ) {
      apiSearchData.startDate =
        searchData.startDate;

      apiSearchData.endDate =
        searchData.endDate;
    } else if (searchData.startDate) {
      apiSearchData.startDate =
        searchData.startDate;
    } else if (searchData.endDate) {
      apiSearchData.endDate =
        searchData.endDate;
    }

    console.log(
      'Search Data for API:',
      apiSearchData
    );

    onSearch(apiSearchData);
    onClose();
  };

  const handleReset = () => {
    setSearchData(initialSearchData);
    setFilteredCenters(centers);
  };

  const statusOptions = [
    {
      value: '',
      label: 'All Status',
    },
    {
      value: 'generated',
      label: 'Generated',
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
    },
  ];

  const creditNoteOptions = [
    {
      value: '',
      label: 'All',
    },
    {
      value: 'true',
      label: 'With Credit Note',
    },
    {
      value: 'false',
      label: 'Without Credit Note',
    },
  ];

  // Get unique resellers for dropdown
  const uniqueResellers =
    resellers.length > 0
      ? resellers
      : Array.from(
          new Map(
            centers.map((center) => [
              center.reseller?._id,
              center.reseller,
            ])
          ).values()
        ).filter(
          (reseller) =>
            reseller && reseller._id
        );

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderRadius: '8px',
      borderColor: state.isFocused
        ? '#3b82f6'
        : '#d1d5db',
      boxShadow: state.isFocused
        ? '0 0 0 2px rgba(59, 130, 246, 0.15)'
        : 'none',
      '&:hover': {
        borderColor: '#9ca3af',
      },
    }),

    menu: (base) => ({
      ...base,
      zIndex: 99999,
    }),

    option: (
      base,
      state
    ) => ({
      ...base,
      backgroundColor:
        state.isSelected
          ? '#2563eb'
          : state.isFocused
            ? '#eff6ff'
            : '#fff',
      color:
        state.isSelected
          ? '#fff'
          : '#374151',
      cursor: 'pointer',
    }),
  };

  if (!visible) {
    return null;
  }

  const selectedReseller =
    uniqueResellers.find(
      (reseller) =>
        reseller._id ===
        searchData.reseller
    );

  const selectedCenter =
    filteredCenters.find(
      (center) =>
        center._id ===
        searchData.center
    );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Search Sale Invoices
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
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            {/* Invoice Number */}
            <div>
              <label
                htmlFor="invoiceNumber"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Invoice Number
              </label>

              <input
                id="invoiceNumber"
                type="text"
                name="invoiceNumber"
                value={
                  searchData.invoiceNumber
                }
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Reseller + Branch */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Reseller */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Reseller
                </label>

                <Select
                  id="reseller"
                  name="reseller"
                  placeholder="Select Reseller..."
                  value={
                    selectedReseller
                      ? {
                          value:
                            selectedReseller._id,
                          label:
                            selectedReseller.businessName,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setSearchData(
                      (prev) => ({
                        ...prev,
                        reseller:
                          selected
                            ? selected.value
                            : '',
                      })
                    )
                  }
                  options={uniqueResellers.map(
                    (reseller) => ({
                      value:
                        reseller._id,
                      label:
                        reseller.businessName,
                    })
                  )}
                  isClearable
                  styles={selectStyles}
                />
              </div>

              {/* Branch */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Branch
                </label>

                <Select
                  id="center"
                  name="center"
                  placeholder={
                    searchData.reseller
                      ? 'Select Branch...'
                      : 'Select Reseller First'
                  }
                  value={
                    selectedCenter
                      ? {
                          value:
                            selectedCenter._id,
                          label:
                            selectedCenter.centerName,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setSearchData(
                      (prev) => ({
                        ...prev,
                        center:
                          selected
                            ? selected.value
                            : '',
                      })
                    )
                  }
                  options={filteredCenters.map(
                    (center) => ({
                      value:
                        center._id,
                      label:
                        center.centerName,
                    })
                  )}
                  isClearable
                  isDisabled={
                    !searchData.reseller
                  }
                  styles={selectStyles}
                />

                {searchData.reseller &&
                  filteredCenters.length ===
                    0 && (
                    <p className="mt-1.5 text-xs text-red-600">
                      No branches found for
                      this reseller
                    </p>
                  )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>

                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={
                    searchData.startDate
                  }
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="endDate"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>

                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={
                    searchData.endDate
                  }
                  onChange={handleChange}
                  min={
                    searchData.startDate
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Status + Credit Note */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={
                    searchData.status
                  }
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {statusOptions.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Credit Note */}
              <div>
                <label
                  htmlFor="cancelWithCreditNote"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Cancel with Credit Note
                </label>

                <select
                  id="cancelWithCreditNote"
                  name="cancelWithCreditNote"
                  value={
                    searchData.cancelWithCreditNote
                  }
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {creditNoteOptions.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>

                <p className="mt-1.5 text-xs text-gray-500">
                  Note: This filter only
                  applies to cancelled
                  invoices
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

InvoiceSearch.propTypes = {
  visible:
    PropTypes.bool.isRequired,

  onClose:
    PropTypes.func.isRequired,

  onSearch:
    PropTypes.func.isRequired,

  centers:
    PropTypes.array.isRequired,

  resellers:
    PropTypes.array.isRequired,
};

export default InvoiceSearch;