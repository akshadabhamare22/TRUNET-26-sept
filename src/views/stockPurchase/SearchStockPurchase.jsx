import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { RotateCcw, Search, X } from "lucide-react";

const SearchStockPurchase = ({ visible, onClose, onSearch }) => {
  const [searchData, setSearchData] = useState({
    keyword: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!visible) {
      setSearchData({
        keyword: "",
        startDate: "",
        endDate: "",
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

  // Format date from YYYY-MM-DD to DD-MM-YYYY for API
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");

      return `${day}-${month}-${year}`;
    }

    return dateString;
  };

  const handleSearch = () => {
    if (searchData.startDate && searchData.endDate) {
      const start = new Date(searchData.startDate);
      const end = new Date(searchData.endDate);

      if (start > end) {
        alert("Start date cannot be after end date");
        return;
      }
    }

    const apiSearchData = {
      keyword: searchData.keyword,
      startDate: formatDateToDDMMYYYY(searchData.startDate),
      endDate: formatDateToDDMMYYYY(searchData.endDate),
    };

    onSearch(apiSearchData);
    onClose();
  };

  const handleReset = () => {
    const resetData = {
      keyword: "",
      startDate: "",
      endDate: "",
    };

    setSearchData(resetData);
    onSearch(resetData);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Search Stock Purchase
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
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
              placeholder="Search by invoice no, vendor name, etc."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>

              <input
                type="date"
                id="startDate"
                name="startDate"
                value={searchData.startDate}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-gray-500">Optional</p>
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                End Date
              </label>

              <input
                type="date"
                id="endDate"
                name="endDate"
                value={searchData.endDate}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-gray-500">Optional</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw size={16} />
            Clear
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

SearchStockPurchase.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchStockPurchase;