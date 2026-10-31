
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { X } from "lucide-react";
import axiosInstance from "../../axiosInstance";

const INITIAL_SEARCH_DATA = {
  product: "",
  center: "",
  usageType: "",
  customer: "",
  reseller: "",
  startDate: "",
  endDate: "",
};

const TransactionSearch = ({
  visible,
  onClose,
  onSearch,
  centers = [],
  products = [],
  customers = [],
}) => {
  const [searchData, setSearchData] = useState(INITIAL_SEARCH_DATA);

  const [resellers, setResellers] = useState([]);
  const [loadingResellers, setLoadingResellers] = useState(false);

  const [resellerCenters, setResellerCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(false);

  // Fetch resellers
  useEffect(() => {
    let cancelled = false;

    const fetchResellers = async () => {
      setLoadingResellers(true);

      try {
        const response = await axiosInstance.get("/resellers");

        if (cancelled) return;

        if (response.data?.success) {
          setResellers(response.data.data || []);
        } else {
          setResellers([]);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching resellers:", error);
          setResellers([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingResellers(false);
        }
      }
    };

    fetchResellers();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch branches when a reseller is selected
  useEffect(() => {
    let cancelled = false;

    const fetchCentersByReseller = async () => {
      if (!searchData.reseller) {
        setResellerCenters([]);
        return;
      }

      setLoadingCenters(true);

      try {
        const response = await axiosInstance.get(
          `/centers/reseller/${searchData.reseller}`
        );

        if (cancelled) return;

        if (response.data?.success) {
          setResellerCenters(response.data.data || []);
        } else {
          setResellerCenters([]);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching branches for reseller:", error);
          setResellerCenters([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingCenters(false);
        }
      }
    };

    fetchCentersByReseller();

    return () => {
      cancelled = true;
    };
  }, [searchData.reseller]);

  // Reset fields when the modal closes
  useEffect(() => {
    if (!visible) {
      setSearchData({ ...INITIAL_SEARCH_DATA });
      setResellerCenters([]);
    }
  }, [visible]);

  // Handle native input and select changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setSearchData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Apply search filters
  const handleSearch = () => {
    onSearch({ ...searchData });
    onClose();
  };

  // Reset all filters
  const handleReset = () => {
    const resetData = { ...INITIAL_SEARCH_DATA };

    setSearchData(resetData);
    setResellerCenters([]);

    onSearch(resetData);
    onClose();
  };

  // Close modal on Escape
  useEffect(() => {
    if (!visible) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, onClose]);

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

  // React Select styling to match the screenshot
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "38px",
      height: "38px",
      borderRadius: "4px",
      borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(13, 110, 253, 0.15)"
        : "none",
      backgroundColor: state.isDisabled ? "#f1f3f5" : "#ffffff",
      cursor: state.isDisabled ? "not-allowed" : "default",
      "&:hover": {
        borderColor: state.isFocused ? "#86b7fe" : "#b6bfc8",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "0 10px",
    }),

    placeholder: (base) => ({
      ...base,
      color: "#777777",
      fontSize: "14px",
    }),

    singleValue: (base) => ({
      ...base,
      color: "#374151",
      fontSize: "14px",
    }),

    input: (base) => ({
      ...base,
      fontSize: "14px",
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: "36px",
    }),

    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "#ced4da",
    }),

    dropdownIndicator: (base) => ({
      ...base,
      padding: "8px",
      color: "#adb5bd",
    }),

    clearIndicator: (base) => ({
      ...base,
      padding: "6px",
    }),

    menu: (base) => ({
      ...base,
      zIndex: 10000,
      borderRadius: "4px",
      fontSize: "14px",
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 10000,
    }),

    option: (base, state) => ({
      ...base,
      fontSize: "14px",
      backgroundColor: state.isSelected
        ? "#0d6efd"
        : state.isFocused
          ? "#f1f5f9"
          : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#374151",
      cursor: "pointer",
    }),
  };

  const labelClass =
    "mb-2 block text-sm font-semibold leading-5 text-gray-700";

  const inputClass =
    "h-[38px] w-full rounded-[4px] border border-[#ced4da] " +
    "bg-white px-3 text-sm text-gray-700 outline-none " +
    "transition focus:border-[#86b7fe] " +
    "focus:ring-[3px] focus:ring-blue-500/15";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-search-title"
        className="flex max-h-[calc(100vh-32px)] w-full max-w-[800px] flex-col overflow-hidden rounded-[7px] bg-white shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex h-[63px] shrink-0 items-center justify-between border-b border-[#dee2e6] px-4">
          <h2
            id="transaction-search-title"
            className="text-xl font-normal leading-7 text-[#343a40]"
          >
            Search
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#858b91] transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X size={23} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-[17px]">
          {/* Reseller and Branch */}
          <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
            {/* Reseller */}
            <div className="min-w-0">
              <label htmlFor="reseller" className={labelClass}>
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
                  setSearchData((previous) => ({
                    ...previous,
                    reseller: selected ? selected.value : "",
                    center: "",
                  }))
                }
                options={resellerOptions}
                isClearable
                isLoading={loadingResellers}
                classNamePrefix="react-select"
                styles={selectStyles}
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                menuPosition="fixed"
              />
            </div>

            {/* Branch */}
            <div className="min-w-0">
              <label htmlFor="center" className={labelClass}>
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
                  setSearchData((previous) => ({
                    ...previous,
                    center: selected ? selected.value : "",
                  }))
                }
                options={centerOptions}
                isClearable
                isDisabled={!searchData.reseller || loadingCenters}
                isLoading={loadingCenters}
                classNamePrefix="react-select"
                styles={selectStyles}
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                menuPosition="fixed"
              />

              {searchData.reseller &&
                !loadingCenters &&
                resellerCenters.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    No branches found for this reseller.
                  </p>
                )}
            </div>
          </div>

          {/* Type and User */}
          <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
            {/* Type */}
            <div className="min-w-0">
              <label htmlFor="usageType" className={labelClass}>
                Type
              </label>

              <select
                id="usageType"
                name="usageType"
                value={searchData.usageType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">-SELECT-</option>
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

            {/* User */}
            <div className="min-w-0">
              <label htmlFor="customer" className={labelClass}>
                User
              </label>

              <select
                id="customer"
                name="customer"
                value={searchData.customer}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">-SELECT-</option>

                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.username}-{customer.mobile}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product */}
          <div className="mt-5 min-w-0">
            <label htmlFor="product" className={labelClass}>
              Product
            </label>

            <Select
              inputId="product"
              name="product"
              placeholder="Search Product..."
              value={selectedProduct}
              onChange={(selected) =>
                setSearchData((previous) => ({
                  ...previous,
                  product: selected ? selected.value : "",
                }))
              }
              options={productOptions}
              isClearable
              classNamePrefix="react-select"
              styles={selectStyles}
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
            />
          </div>

          {/* Start Date and End Date */}
          <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
            {/* Start Date */}
            <div className="min-w-0">
              <label htmlFor="startDate" className={labelClass}>
                Start Date
              </label>

              <input
                type="date"
                id="startDate"
                name="startDate"
                value={searchData.startDate}
                onChange={handleChange}
                className={inputClass}
              />

              <p className="mt-1 text-sm leading-4 text-gray-500">
                Optional
              </p>
            </div>

            {/* End Date */}
            <div className="min-w-0">
              <label htmlFor="endDate" className={labelClass}>
                End Date
              </label>

              <input
                type="date"
                id="endDate"
                name="endDate"
                value={searchData.endDate}
                onChange={handleChange}
                className={inputClass}
              />

              <p className="mt-1 text-sm leading-4 text-gray-500">
                Optional
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#dee2e6] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-[38px] items-center justify-center rounded-[5px] border border-[#6c757d] bg-[#6c757d] px-3 text-sm font-normal text-white transition hover:border-[#5c636a] hover:bg-[#5c636a] focus:outline-none focus:ring-2 focus:ring-gray-400/50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex h-[38px] items-center justify-center rounded-[5px] border border-[#2457a6] bg-[#2858a6] px-4 text-sm font-normal text-white transition hover:border-[#204b90] hover:bg-[#204b90] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
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
  centers: PropTypes.array,
  products: PropTypes.array,
  customers: PropTypes.array,
};

export default TransactionSearch;