import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Search, X } from "lucide-react";
import axiosInstance from "../../axiosInstance";
const TransactionSearch = ({
  visible,
  onClose,
  onSearch,
  centers,
  products,
  customers,
}) => {
  const [searchData, setSearchData] = useState({
    product: "",
    center: "",
    usageType: "",
    customer: "",
    reseller: "",
    startDate: "",
    endDate: "",
  });

  const [resellers, setResellers] = useState([]);
  const [loadingResellers, setLoadingResellers] = useState(false);

  const [resellerCenters, setResellerCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(false);

  // Fetch all resellers
  useEffect(() => {
    const fetchResellers = async () => {
      setLoadingResellers(true);

      try {
        const response = await axiosInstance.get("/resellers");

        if (response.data.success) {
          setResellers(response.data.data || []);
        } else {
          setResellers([]);
        }
      } catch (error) {
        console.error("Error fetching resellers:", error);
        setResellers([]);
      } finally {
        setLoadingResellers(false);
      }
    };

    fetchResellers();
  }, []);

  // Fetch centers based on selected reseller
  useEffect(() => {
    const fetchCentersByReseller = async () => {
      if (searchData.reseller) {
        setLoadingCenters(true);

        try {
          const response = await axiosInstance.get(
            `/centers/reseller/${searchData.reseller}`
          );

          if (response.data.success) {
            setResellerCenters(response.data.data);
          } else {
            setResellerCenters([]);
          }
        } catch (error) {
          console.error(
            "Error fetching centers for reseller:",
            error
          );
          setResellerCenters([]);
        } finally {
          setLoadingCenters(false);
        }
      } else {
        setResellerCenters([]);

        setSearchData((prev) => ({
          ...prev,
          center: "",
        }));
      }
    };

    fetchCentersByReseller();
  }, [searchData.reseller]);

  // Reset when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchData({
        product: "",
        center: "",
        usageType: "",
        customer: "",
        reseller: "",
        startDate: "",
        endDate: "",
      });

      setResellerCenters([]);
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
      product: "",
      center: "",
      usageType: "",
      customer: "",
      reseller: "",
      startDate: "",
      endDate: "",
    };

    setSearchData(resetData);
    setResellerCenters([]);

    onSearch(resetData);
    onClose();
  };

  if (!visible) return null;

  const resellerOptions = resellers.map((reseller) => ({
    value: reseller._id,
    label: reseller.businessName,
  }));

  const centerOptions = resellerCenters.map((center) => ({
    value: center._id,
    label: center.centerName,
  }));

  const productOptions = products.map((product) => ({
    value: product._id,
    label: product.productTitle,
  }));

  const selectedReseller =
    resellerOptions.find(
      (option) => option.value === searchData.reseller
    ) || null;

  const selectedCenter =
    centerOptions.find(
      (option) => option.value === searchData.center
    ) || null;

  const selectedProduct =
    productOptions.find(
      (option) => option.value === searchData.product
    ) || null;

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "6px",
      borderColor: state.isFocused
        ? "#2563eb"
        : "#d1d5db",
      boxShadow: state.isFocused
        ? "0 0 0 1px #2563eb"
        : "none",
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
            Search
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
          {/* Reseller + Branch */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Reseller */}
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
                placeholder={
                  loadingResellers
                    ? "Loading resellers..."
                    : "Select Reseller..."
                }
                value={selectedReseller}
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    reseller: selected
                      ? selected.value
                      : "",
                    center: "",
                  }))
                }
                options={resellerOptions}
                isClearable
                isLoading={loadingResellers}
                classNamePrefix="react-select"
                styles={selectStyles}
              />
            </div>

            {/* Branch */}
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
                  loadingCenters
                    ? "Loading branches..."
                    : searchData.reseller
                      ? "Select Branch..."
                      : "Select a reseller first"
                }
                value={selectedCenter}
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    center: selected
                      ? selected.value
                      : "",
                  }))
                }
                options={centerOptions}
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
                resellerCenters.length === 0 && (
                  <p className="mt-1.5 text-xs text-gray-500">
                    No branches found for this reseller
                  </p>
                )}
            </div>
          </div>

          {/* Type + User */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Type */}
            <div>
              <label
                htmlFor="usageType"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Type
              </label>

              <select
                id="usageType"
                name="usageType"
                value={searchData.usageType}
                onChange={handleChange}
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-SELECT-</option>
                <option value="Customer">Customer</option>
                <option value="Building">Building</option>
                <option value="Building to Building">
                  Building to Building
                </option>
                <option value="Control Room">
                  Control Room
                </option>
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

            {/* User */}
            <div>
              <label
                htmlFor="customer"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                User
              </label>

              <select
                id="customer"
                name="customer"
                value={searchData.customer}
                onChange={handleChange}
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-SELECT-</option>

                {customers.map((customer) => (
                  <option
                    key={customer._id}
                    value={customer._id}
                  >
                    {customer.username}-{customer.mobile}
                  </option>
                ))}
              </select>
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
                  product: selected
                    ? selected.value
                    : "",
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
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <p className="mt-1 text-xs text-gray-500">
                Optional
              </p>
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
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <p className="mt-1 text-xs text-gray-500">
                Optional
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Close
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

TransactionSearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  customers: PropTypes.array.isRequired,
};

export default TransactionSearch;