import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { X } from "lucide-react";
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
    // Prevent applying a date range where the start date is after the end date.
    if (
      searchData.startDate &&
      searchData.endDate &&
      searchData.startDate > searchData.endDate
    ) {
      window.alert("Start Date cannot be later than End Date.");
      return;
    }

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
      height: "38px",
      minHeight: "38px",
      borderRadius: "4px",
      borderColor: state.isFocused ? "#2f5fa7" : "#cfd4da",
      boxShadow: state.isFocused ? "0 0 0 1px #2f5fa7" : "none",
      "&:hover": {
        borderColor: "#b8bec6",
      },
    }),

    placeholder: (base) => ({
      ...base,
      color: "#8a8f95",
      fontSize: "15px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#343a40",
      fontSize: "15px",
    }),
    input: (base) => ({
      ...base,
      fontSize: "15px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#c5c9ce",
      padding: "7px",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "#d9dde2",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <>
      <style>{`
        @keyframes searchStockSlideDown {
          from {
            opacity: 0;
            transform: translateY(-70px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .search-stock-modal-enter {
          animation: searchStockSlideDown 0.3s ease-out forwards;
        }
      `}</style>

      <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 px-4 pt-[150px]">
        <div className="search-stock-modal-enter w-full max-w-[800px] overflow-hidden rounded-[7px] bg-white shadow-xl">
        {/* Header */}
        <div className="flex h-[63px] items-center justify-between border-b border-[#dfe3e8] px-4">
          <h2 className="text-[20px] font-normal text-[#343a40]">
            Search Available Stock
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-[#777] transition hover:bg-gray-100 hover:text-[#555]"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-[16px]">
          {/* Reseller + Center */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Reseller */}
            <div>
              <label
                htmlFor="resellerId"
                className="mb-[7px] block text-[15px] font-semibold text-[#343a40]"
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
                className="mb-[7px] block text-[15px] font-semibold text-[#343a40]"
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
          <div className="mt-[20px]">
            <label
              htmlFor="product"
              className="mb-[7px] block text-[15px] font-semibold text-[#343a40]"
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
                className="mb-[7px] block text-[15px] font-semibold text-[#343a40]"
              >
                Start Date
              </label>

              <input
                type="date"
                id="startDate"
                name="startDate"
                value={searchData.startDate}
                onChange={handleChange}
                className="block h-[38px] w-full rounded-[4px] border border-[#cfd4da] bg-white px-3 py-2 text-[15px] text-[#666] outline-none transition focus:border-[#2f5fa7] focus:ring-1 focus:ring-[#2f5fa7]"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="mb-[7px] block text-[15px] font-semibold text-[#343a40]"
              >
                End Date
              </label>

              <input
                type="date"
                id="endDate"
                name="endDate"
                value={searchData.endDate}
                onChange={handleChange}
                className="block h-[38px] w-full rounded-[4px] border border-[#cfd4da] bg-white px-3 py-2 text-[15px] text-[#666] outline-none transition focus:border-[#2f5fa7] focus:ring-1 focus:ring-[#2f5fa7]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex h-[70px] items-center justify-end gap-3 border-t border-[#dfe3e8] bg-white px-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-[39px] items-center justify-center gap-2 rounded-[4px] border-0 bg-[#6c7a89] px-3.5 text-[15px] font-medium text-white transition hover:bg-[#5f6c79]"
          >
            Reset All
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex h-[39px] items-center justify-center gap-2 rounded-[4px] bg-[#2f5fa7] px-3.5 text-[15px] font-medium text-white transition hover:bg-[#264f8d]"
          >
            Search
          </button>
        </div>
        </div>
      </div>
    </>
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