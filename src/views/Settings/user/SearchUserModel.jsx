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

const SearchUserModel = ({
  visible,
  onClose,
  onSearch,
  centers,
  roles,
  status,
}) => {
  const [searchData, setSearchData] =
    useState({
      keyword: "",
      center: "",
      role: "",
      status: "",
    });

  // --------------------------------------------------
  // Reset when modal closes
  // --------------------------------------------------
  useEffect(() => {
    if (!visible) {
      setSearchData({
        keyword: "",
        center: "",
        role: "",
        status: "",
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
      center: "",
      role: "",
      status: "",
    };

    setSearchData(resetData);
    onSearch(resetData);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
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
                value={
                  searchData.keyword
                }
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Center */}
            <div>
              <label
                htmlFor="center"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Center
              </label>

              <select
                id="center"
                name="center"
                value={
                  searchData.center
                }
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">
                  SELECT CENTER
                </option>

                {centers.map(
                  (center) => (
                    <option
                      key={center._id}
                      value={center._id}
                    >
                      {
                        center.centerName
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Role
              </label>

              <select
                id="role"
                name="role"
                value={
                  searchData.role
                }
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">
                  SELECT ROLE
                </option>

                {roles.map(
                  (role) => (
                    <option
                      key={role._id}
                      value={role._id}
                    >
                      {
                        role.roleTitle
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

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
                value={
                  searchData.status
                }
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">
                  -SELECT-
                </option>

                <option value="Enable">
                  Enable
                </option>

                <option value="Disable">
                  Disable
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* Footer */}
        {/* ------------------------------------------------ */}
        <div className="flex items-center justify-end gap-2 border-t bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={
              handleReset
            }
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw size={16} />
            Close
          </button>

          <button
            type="button"
            onClick={
              handleSearch
            }
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

SearchUserModel.propTypes = {
  visible:
    PropTypes.bool.isRequired,

  onClose:
    PropTypes.func.isRequired,

  onSearch:
    PropTypes.func.isRequired,

  centers:
    PropTypes.array.isRequired,

  roles:
    PropTypes.array.isRequired,

  status:
    PropTypes.array.isRequired,
};

export default SearchUserModel;