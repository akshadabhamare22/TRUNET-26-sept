import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { RotateCcw, Search, X } from "lucide-react";

const SearchStockUsage = ({
  visible,
  onClose,
  onSearch,
  centers,
}) => {
  const [searchData, setSearchData] = useState({
    keyword: "",
    center: "",
    usageType: "",
  });

  useEffect(() => {
    if (!visible) {
      setSearchData({
        keyword: "",
        center: "",
        usageType: "",
      });
    }
  }, [visible]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    onSearch(searchData);
    onClose();
  };

  const handleReset = () => {
    const resetData = {
      keyword: "",
      center: "",
      usageType: "",
    };

    setSearchData(resetData);
    onSearch(resetData);
  };

  if (!visible) return null;

  const centerOptions = centers.map((center) => ({
    value: center._id,
    label: center.centerName,
  }));

  const selectedCenter =
    searchData.center
      ? centerOptions.find(
          (center) => center.value === searchData.center
        ) || null
      : null;

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      borderRadius: "6px",
      borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
      boxShadow: state.isFocused
        ? "0 0 0 1px #2563eb"
        : "none",
      "&:hover": {
        borderColor: "#2563eb",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Search
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
        <div className="px-6 py-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Branch */}
            <div>
              <label
                htmlFor="center"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Branch
              </label>

              <Select
                id="center"
                name="center"
                placeholder="Select Branch..."
                value={selectedCenter}
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    center: selected ? selected.value : "",
                  }))
                }
                options={centerOptions}
                isClearable
                styles={selectStyles}
                classNamePrefix="react-select"
              />
            </div>

            {/* Usage Type */}
            <div>
              <label
                htmlFor="usageType"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Usage Type{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                id="usageType"
                name="usageType"
                value={searchData.usageType}
                onChange={handleChange}
                className="h-[42px] w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">SELECT</option>
                <option value="Customer">Customer</option>
                <option value="Building">Building</option>
                <option value="Building to Building">
                  Building to Building
                </option>
                <option value="Control Room">Control Room</option>
                <option value="Damage">Damage</option>
                <option value="Stolen from Center">
                  Stolen from Center
                </option>
                <option value="Stolen from Field">
                  Stolen from Field
                </option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Keyword */}
            <div>
              <label
                htmlFor="keyword"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Keyword
              </label>

              <input
                type="text"
                id="keyword"
                name="keyword"
                value={searchData.keyword}
                onChange={handleChange}
                placeholder="Enter keyword..."
                className="h-[42px] w-full rounded-md border border-gray-300 px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
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

SearchStockUsage.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
};

export default SearchStockUsage;