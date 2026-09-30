import React, {
  useEffect,
  useState,
} from "react";
import PropTypes from "prop-types";
import {
  Search,
  RotateCcw,
  X,
} from "lucide-react";

const SearchVendorModel = ({
  visible,
  onClose,
  onSearch,
}) => {
  const [searchData, setSearchData] =
    useState({
      keyword: "",
    });

  // --------------------------------------------------
  // Reset when modal closes
  // --------------------------------------------------
  useEffect(() => {
    if (!visible) {
      setSearchData({
        keyword: "",
      });
    }
  }, [visible]);

  // --------------------------------------------------
  // Handle Change
  // --------------------------------------------------
  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const handleSearch = () => {
    onSearch(searchData);
    onClose();
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  const handleReset = () => {
    const resetData = {
      keyword: "",
    };

    setSearchData(resetData);
    onSearch(resetData);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* ------------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------------ */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Search
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* ------------------------------------------------ */}
        {/* Body */}
        {/* ------------------------------------------------ */}
        <div className="px-6 py-5">
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* Footer */}
        {/* ------------------------------------------------ */}
        <div className="flex items-center justify-end gap-2 border-t bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw size={16} />
            Close
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

SearchVendorModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchVendorModel;