


import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { RotateCcw, Search, X } from "lucide-react";

const SearchSaleInvoice = ({
  visible,
  onClose,
  onSearch,
  centers,
  resellers,
}) => {
  const [searchData, setSearchData] = useState({
    center: "",
    reseller: "",
    startDate: "",
    endDate: "",
  });

  const [filteredCenters, setFilteredCenters] = useState([]);

  // Filter centers based on selected reseller
  useEffect(() => {
    if (searchData.reseller) {
      const filtered = centers.filter(
        (center) => center.reseller?._id === searchData.reseller
      );

      setFilteredCenters(filtered);
    } else {
      setFilteredCenters(centers);
    }

    // Reset center selection when reseller changes
    setSearchData((prev) => ({
      ...prev,
      center: "",
    }));
  }, [searchData.reseller, centers]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const apiSearchData = {
      center: searchData.center,
      reseller: searchData.reseller,
    };

    if (searchData.startDate && searchData.endDate) {
      apiSearchData.startDate = searchData.startDate;
      apiSearchData.endDate = searchData.endDate;
    } else if (searchData.startDate) {
      apiSearchData.startDate = searchData.startDate;
    } else if (searchData.endDate) {
      apiSearchData.endDate = searchData.endDate;
    }

    console.log("Search Data for API:", apiSearchData);

    onSearch(apiSearchData);
    onClose();
  };

  const handleReset = () => {
    setSearchData({
      center: "",
      reseller: "",
      startDate: "",
      endDate: "",
    });

    setFilteredCenters(centers);
  };

  // Get unique resellers for the dropdown
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
        ).filter((reseller) => reseller && reseller._id);

  const resellerOptions = uniqueResellers.map((reseller) => ({
    value: reseller._id,
    label: reseller.businessName,
  }));

  const centerOptions = filteredCenters.map((center) => ({
    value: center._id,
    label: center.centerName,
  }));

  const selectedReseller =
    resellerOptions.find(
      (option) => option.value === searchData.reseller
    ) || null;

  const selectedCenter =
    centerOptions.find(
      (option) => option.value === searchData.center
    ) || null;

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "4px",
      borderColor: state.isFocused ? "#2759a2" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #2759a2" : "none",
      backgroundColor: state.isDisabled ? "#f3f4f6" : "#ffffff",
      "&:hover": {
        borderColor: "#2759a2",
      },
      cursor: "pointer",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "2px 10px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280",
      fontSize: "14px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#374151",
      fontSize: "14px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 10010,
      borderRadius: "4px",
      overflow: "hidden",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 10010,
    }),
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes saleInvoiceModalDrop {
          0% { opacity: 0; transform: translateY(-42px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes saleInvoiceOverlayFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .sale-invoice-modal-overlay {
          animation: saleInvoiceOverlayFade 180ms ease-out both;
        }
        .sale-invoice-modal-panel {
          animation: saleInvoiceModalDrop 320ms cubic-bezier(.2,.75,.25,1) both;
    
        }
        .sale-invoice-field:focus {
          outline: none;
          border-color: #2759a2;
          box-shadow: 0 0 0 2px rgba(39,89,162,.12);
        }
        @media (prefers-reduced-motion: reduce) {
          .sale-invoice-modal-overlay, .sale-invoice-modal-panel {
            animation: none;
          }
        }
      `}</style>

      <div className="sale-invoice-modal-overlay fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6 sm:py-8">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-sale-invoice-title"
          className="sale-invoice-modal-panel my-0 w-full max-w-3xl overflow-visible rounded-md bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
            <div>
              <h2
                id="search-sale-invoice-title"
                className="text-lg font-semibold text-gray-800"
              >
                Search Sale Invoices
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Filter invoices by reseller, branch, and date range
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2759a2]/30"
              aria-label="Close"
            >
              <X size={21} />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-5 px-5 py-5 sm:px-6">
            {/* Reseller + Branch */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="reseller"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Reseller
                </label>

                <Select
                  inputId="reseller"
                  name="reseller"
                  placeholder="Select Reseller..."
                  value={selectedReseller}
                  onChange={(selected) =>
                    setSearchData((prev) => ({
                      ...prev,
                      reseller: selected ? selected.value : "",
                    }))
                  }
                  options={resellerOptions}
                  isClearable
                  classNamePrefix="react-select"
                  styles={selectStyles}
                  menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                />
              </div>

              <div>
                <label
                  htmlFor="center"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Branch
                </label>

                <Select
                  inputId="center"
                  name="center"
                  placeholder={
                    searchData.reseller
                      ? "Select Branch..."
                      : "Select Reseller First"
                  }
                  value={selectedCenter}
                  onChange={(selected) =>
                    setSearchData((prev) => ({
                      ...prev,
                      center: selected ? selected.value : "",
                    }))
                  }
                  options={centerOptions}
                  isClearable
                  isDisabled={!searchData.reseller}
                  classNamePrefix="react-select"
                  styles={selectStyles}
                  menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                />

                {searchData.reseller && filteredCenters.length === 0 && (
                  <p className="mt-1.5 text-xs text-red-600">
                    No branches found for this reseller
                  </p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="sale-invoice-start-date"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Start Date
                </label>

                <input
                  id="sale-invoice-start-date"
                  type="date"
                  name="startDate"
                  value={searchData.startDate}
                  onChange={handleDateChange}
                  className="sale-invoice-field h-10 w-full rounded border border-gray-300 bg-white px-3 text-sm text-gray-700 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="sale-invoice-end-date"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  End Date
                </label>

                <input
                  id="sale-invoice-end-date"
                  type="date"
                  name="endDate"
                  value={searchData.endDate}
                  onChange={handleDateChange}
                  min={searchData.startDate}
                  className="sale-invoice-field h-10 w-full rounded border border-gray-300 bg-white px-3 text-sm text-gray-700 transition"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center justify-center gap-2 rounded bg-[#2759a2] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1e477f] focus:outline-none focus:ring-2 focus:ring-[#2759a2]/30"
            >
              <Search size={16} />
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

SearchSaleInvoice.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  resellers: PropTypes.array.isRequired,
};

export default SearchSaleInvoice;
