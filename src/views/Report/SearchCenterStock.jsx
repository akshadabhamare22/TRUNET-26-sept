import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { RotateCcw, Search, X } from "lucide-react";
import axiosInstance from "../../axiosInstance";
const SearchCenterStock = ({
  visible,
  onClose,
  onSearch,
  centers,
  products,
  resellers,
}) => {
  const [searchData, setSearchData] = useState({
    product: "",
    center: "",
    resellerId: "",
    startDate: "",
    endDate: "",
  });

  const [filteredCenters, setFilteredCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSearchData({
        product: "",
        center: "",
        resellerId: "",
        startDate: "",
        endDate: "",
      });

      setFilteredCenters([]);
    }
  }, [visible]);

  // Fetch centers when reseller changes
  useEffect(() => {
    const fetchCentersByReseller = async () => {
      if (searchData.resellerId) {
        setLoadingCenters(true);

        try {
          const response = await axiosInstance.get(
            `/centers/reseller/${searchData.resellerId}`
          );

          if (response.data.success) {
            setFilteredCenters(response.data.data);
          } else {
            setFilteredCenters([]);
          }
        } catch (error) {
          console.error("Error fetching centers:", error);
          setFilteredCenters([]);
        } finally {
          setLoadingCenters(false);
        }
      } else {
        // If no reseller selected, show all centers from props
        setFilteredCenters(centers);

        setSearchData((prev) => ({
          ...prev,
          center: "",
        }));
      }
    };

    fetchCentersByReseller();
  }, [searchData.resellerId, centers]);

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
      product: "",
      center: "",
      resellerId: "",
      startDate: "",
      endDate: "",
    };

    setSearchData(resetData);
    setFilteredCenters([]);
    onSearch(resetData);
    onClose();
  };

  if (!visible) return null;

  const resellerOptions = resellers.map((reseller) => ({
    value: reseller._id,
    label: reseller.businessName,
  }));

  const centerOptions = filteredCenters.map((center) => ({
    value: center._id,
    label: center.centerName,
  }));

  const productOptions = products.map((product) => ({
    value: product._id,
    label: product.productTitle,
  }));

  const selectedReseller =
    resellerOptions.find(
      (option) => option.value === searchData.resellerId
    ) || null;

  const selectedCenter =
    centerOptions.find((option) => option.value === searchData.center) || null;

  const selectedProduct =
    productOptions.find((option) => option.value === searchData.product) ||
    null;

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "6px",
      borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),

    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Search Available Stock
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
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
                htmlFor="resellerId"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Reseller
              </label>

              <Select
                inputId="resellerId"
                name="resellerId"
                placeholder="Select Reseller..."
                value={selectedReseller}
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    resellerId: selected ? selected.value : "",
                    center: "",
                  }))
                }
                options={resellerOptions}
                isClearable
                classNamePrefix="react-select"
                styles={selectStyles}
              />
            </div>

            {/* Center */}
            <div>
              <label
                htmlFor="center"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Center / Branch
              </label>

              <Select
                inputId="center"
                name="center"
                placeholder={
                  loadingCenters
                    ? "Loading centers..."
                    : searchData.resellerId
                      ? "Select Center..."
                      : "Select a reseller first or browse all centers"
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
                isDisabled={loadingCenters}
                isLoading={loadingCenters}
                classNamePrefix="react-select"
                styles={selectStyles}
              />

              {searchData.resellerId &&
                !loadingCenters &&
                filteredCenters.length === 0 && (
                  <p className="mt-1.5 text-xs text-gray-500">
                    No centers found for this reseller
                  </p>
                )}
            </div>
          </div>

          {/* Product */}
          <div className="mt-5">
            <label
              htmlFor="product"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Product
            </label>

            <Select
              inputId="product"
              name="product"
              placeholder="Search Product..."
              value={selectedProduct}
              onChange={(selected) =>
                setSearchData((prev) => ({
                  ...prev,
                  product: selected ? selected.value : "",
                }))
              }
              options={productOptions}
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
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
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
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw size={16} />
            Reset All
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

SearchCenterStock.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  resellers: PropTypes.array.isRequired,
};

export default SearchCenterStock;