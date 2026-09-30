import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { RotateCcw, Search, X } from "lucide-react";

import axiosInstance from "../../axiosInstance";
const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "40px",
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    boxShadow: state.isFocused
      ? "0 0 0 1px #3b82f6"
      : "none",
    borderRadius: "6px",
    "&:hover": {
      borderColor: "#9ca3af",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 60,
  }),
};

const ResellerQtySearch = ({
  visible,
  onClose,
  onSearch,
  resellers,
  products,
}) => {
  const [searchData, setSearchData] = useState({
    product: "",
    reseller: "",
    center: "",
    startDate: "",
    endDate: "",
  });

  const [centers, setCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] =
    useState(false);

  // Reset when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchData({
        product: "",
        reseller: "",
        center: "",
        startDate: "",
        endDate: "",
      });

      setCenters([]);
    }
  }, [visible]);

  // Fetch centers based on selected reseller
  useEffect(() => {
    const fetchCenters = async () => {
      if (searchData.reseller) {
        setLoadingCenters(true);

        try {
          const response = await axiosInstance.get(
            `/centers/reseller/${searchData.reseller}`
          );

          if (response.data.success) {
            setCenters(response.data.data);
          } else {
            setCenters([]);
          }
        } catch (error) {
          console.error(
            "Error fetching centers:",
            error
          );

          setCenters([]);
        } finally {
          setLoadingCenters(false);
        }
      } else {
        setCenters([]);

        setSearchData((prev) => ({
          ...prev,
          center: "",
        }));
      }
    };

    fetchCenters();
  }, [searchData.reseller]);

  // Search
  const handleSearch = () => {
    onSearch(searchData);
    onClose();
  };

  // Reset
  const handleReset = () => {
    const resetData = {
      product: "",
      reseller: "",
      center: "",
      startDate: "",
      endDate: "",
    };

    setSearchData(resetData);
    setCenters([]);

    onSearch(resetData);
    onClose();
  };

  if (!visible) {
    return null;
  }

  const selectedReseller = resellers.find(
    (reseller) =>
      reseller._id === searchData.reseller
  );

  const selectedCenter = centers.find(
    (center) =>
      center._id === searchData.center
  );

  const selectedProduct = products.find(
    (product) =>
      product._id === searchData.product
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Search Reseller Stock
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

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {/* Reseller + Center */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Reseller */}
            <div>
              <label
                htmlFor="reseller"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Reseller{" "}
                <span className="text-red-500">*</span>
              </label>

              <Select
                id="reseller"
                name="reseller"
                placeholder="Select Reseller..."
                value={
                  searchData.reseller
                    ? {
                        value:
                          searchData.reseller,
                        label:
                          selectedReseller
                            ?.businessName || "",
                      }
                    : null
                }
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    reseller: selected
                      ? selected.value
                      : "",
                    center: "",
                  }))
                }
                options={resellers.map(
                  (reseller) => ({
                    value: reseller._id,
                    label: `${reseller.businessName}`,
                  })
                )}
                isClearable
                classNamePrefix="react-select"
                styles={selectStyles}
              />
            </div>

            {/* Center */}
            <div>
              <label
                htmlFor="center"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Center
              </label>

              <Select
                id="center"
                name="center"
                placeholder={
                  loadingCenters
                    ? "Loading centers..."
                    : searchData.reseller
                      ? "Select Center..."
                      : "Select a reseller first"
                }
                value={
                  searchData.center
                    ? {
                        value:
                          searchData.center,
                        label: selectedCenter
                          ? `${selectedCenter.centerName} (${
                              selectedCenter.centerCode ||
                              "N/A"
                            })`
                          : "",
                      }
                    : null
                }
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    center: selected
                      ? selected.value
                      : "",
                  }))
                }
                options={centers.map(
                  (center) => ({
                    value: center._id,
                    label: `${center.centerName}`,
                  })
                )}
                isClearable
                isDisabled={
                  !searchData.reseller ||
                  loadingCenters
                }
                isLoading={loadingCenters}
                classNamePrefix="react-select"
                styles={selectStyles}
              />

              {searchData.reseller &&
                !loadingCenters &&
                centers.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    No centers found for this reseller
                  </p>
                )}
            </div>
          </div>

          {/* Product */}
          <div className="mt-5">
            <label
              htmlFor="product"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Product
            </label>

            <Select
              id="product"
              name="product"
              placeholder="Search Product..."
              value={
                searchData.product
                  ? {
                      value:
                        searchData.product,
                      label:
                        selectedProduct
                          ?.productTitle || "",
                    }
                  : null
              }
              onChange={(selected) =>
                setSearchData((prev) => ({
                  ...prev,
                  product: selected
                    ? selected.value
                    : "",
                }))
              }
              options={products.map(
                (product) => ({
                  value: product._id,
                  label: `${product.productTitle} (${
                    product.productCode ||
                    "N/A"
                  })`,
                })
              )}
              isClearable
              classNamePrefix="react-select"
              styles={selectStyles}
            />
          </div>

          {/* Date Range */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>

              <input
                type="date"
                id="startDate"
                value={searchData.startDate}
                onChange={(e) =>
                  setSearchData((prev) => ({
                    ...prev,
                    startDate:
                      e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-gray-500">
                Optional
              </p>
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
                type="date"
                id="endDate"
                value={searchData.endDate}
                onChange={(e) =>
                  setSearchData((prev) => ({
                    ...prev,
                    endDate:
                      e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-gray-500">
                Optional
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
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

ResellerQtySearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  resellers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
};

export default ResellerQtySearch;