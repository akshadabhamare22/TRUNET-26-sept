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
      minHeight: "38px",
      borderRadius: "6px",
      borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
      "&:hover": {
        borderColor: "#2563eb",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-3xl overflow-visible rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Search Sale Invoices
          </h2>

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
        <div className="space-y-5 px-6 py-5">
          {/* Reseller + Branch */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="reseller"
                className="mb-1.5 block text-sm font-medium text-gray-700"
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
              />
            </div>

            <div>
              <label
                htmlFor="center"
                className="mb-1.5 block text-sm font-medium text-gray-700"
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
              />

              {searchData.reseller && filteredCenters.length === 0 && (
                <p className="mt-1 text-xs text-red-500">
                  No branches found for this reseller
                </p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="sale-invoice-start-date"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>

              <input
                id="sale-invoice-start-date"
                type="date"
                name="startDate"
                value={searchData.startDate}
                onChange={handleDateChange}
                className="h-[38px] w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="sale-invoice-end-date"
                className="mb-1.5 block text-sm font-medium text-gray-700"
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
                className="h-[38px] w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>
    </div>
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