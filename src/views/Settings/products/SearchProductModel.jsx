import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

const SearchProductModel = ({
  visible,
  onClose,
  onSearch,
  categories,
}) => {
  const [searchData, setSearchData] = useState({
    keyword: "",
    category: "",
    status: "",
  });

  // Reset form whenever modal is closed
  useEffect(() => {
    if (!visible) {
      setSearchData({
        keyword: "",
        category: "",
        status: "",
      });
    }
  }, [visible]);

  // Handle input/select changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Search
  const handleSearch = () => {
    onSearch(searchData);
    onClose();
  };

  // Reset
  const handleReset = () => {
    const resetData = {
      keyword: "",
      category: "",
      status: "",
    };

    setSearchData(resetData);
    onSearch(resetData);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
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

        {/* Modal Body */}
        <div className="p-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Product Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Product Category
              </label>

              <select
                id="category"
                name="category"
                value={searchData.category}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  SELECT CATEGORY
                </option>

                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat.productCategory}
                  >
                    {cat.productCategory}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={searchData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  SELECT STATUS
                </option>

                <option value="Enable">
                  Enable
                </option>

                <option value="Disable">
                  Disable
                </option>
              </select>
            </div>

            {/* Empty column - preserved from original */}
            <div />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-gray-300 bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

SearchProductModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};

export default SearchProductModel;