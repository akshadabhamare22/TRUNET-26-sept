import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { X } from "lucide-react";

import axiosInstance from "../../axiosInstance";

/* =========================================================
   SELECT STYLES
========================================================= */
const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "40px",
    height: "40px",
    borderColor: state.isFocused ? "#2f5fa7" : "#d1d5db",
    boxShadow: state.isFocused
      ? "0 0 0 1px #2f5fa7"
      : "none",
    borderRadius: "4px",
    backgroundColor: "#fff",
    fontSize: "14px",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#9ca3af",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 10px",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#777",
    fontSize: "14px",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#333",
    fontSize: "14px",
  }),

  input: (base) => ({
    ...base,
    fontSize: "14px",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: "38px",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "#999",
    padding: "8px",
    "&:hover": {
      color: "#555",
    },
  }),

  clearIndicator: (base) => ({
    ...base,
    padding: "6px",
  }),

  menu: (base) => ({
    ...base,
    zIndex: 99999,
    marginTop: "3px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
  }),

  menuList: (base) => ({
    ...base,
    maxHeight: "260px",
    overflowY: "auto",
    padding: "4px 0",

    scrollbarWidth: "thin",
    scrollbarColor: "#b5b5b5 #f5f5f5",

    "&::-webkit-scrollbar": {
      width: "8px",
    },

    "&::-webkit-scrollbar-track": {
      background: "#f5f5f5",
    },

    "&::-webkit-scrollbar-thumb": {
      background: "#b5b5b5",
      borderRadius: "4px",
    },

    "&::-webkit-scrollbar-thumb:hover": {
      background: "#999",
    },
  }),

  option: (base, state) => ({
    ...base,
    padding: "10px 12px",
    fontSize: "14px",
    color: "#333",
    backgroundColor: state.isSelected
      ? "#e9f0fb"
      : state.isFocused
        ? "#f3f6fa"
        : "#fff",
    cursor: "pointer",

    "&:active": {
      backgroundColor: "#e9f0fb",
    },
  }),

  noOptionsMessage: (base) => ({
    ...base,
    fontSize: "14px",
    color: "#777",
  }),

  loadingMessage: (base) => ({
    ...base,
    fontSize: "14px",
    color: "#777",
  }),
};

/* =========================================================
   COMPONENT
========================================================= */
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
  const [loadingCenters, setLoadingCenters] = useState(false);

  /* =========================================================
     RESET WHEN MODAL CLOSES
  ========================================================= */
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

  /* =========================================================
     FETCH CENTERS WHEN RESELLER CHANGES
  ========================================================= */
  useEffect(() => {
    const fetchCenters = async () => {
      if (!searchData.reseller) {
        setCenters([]);

        setSearchData((prev) => ({
          ...prev,
          center: "",
        }));

        return;
      }

      setLoadingCenters(true);

      try {
        const response = await axiosInstance.get(
          `/centers/reseller/${searchData.reseller}`,
        );

        if (response.data.success) {
          setCenters(response.data.data || []);
        } else {
          setCenters([]);
        }
      } catch (error) {
        console.error("Error fetching centers:", error);
        setCenters([]);
      } finally {
        setLoadingCenters(false);
      }
    };

    fetchCenters();
  }, [searchData.reseller]);

  /* =========================================================
     SEARCH
  ========================================================= */
  const handleSearch = () => {
    onSearch(searchData);
    onClose();
  };

  /* =========================================================
     RESET
  ========================================================= */
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

  /* =========================================================
     SELECTED VALUES
  ========================================================= */
  const selectedReseller = resellers.find(
    (reseller) => reseller._id === searchData.reseller,
  );

  const selectedCenter = centers.find(
    (center) => center._id === searchData.center,
  );

  const selectedProduct = products.find(
    (product) => product._id === searchData.product,
  );

  /* =========================================================
     OPTIONS
  ========================================================= */
  const resellerOptions = resellers.map((reseller) => ({
    value: reseller._id,
    label: reseller.businessName || "",
  }));

  const centerOptions = centers.map((center) => ({
    value: center._id,
    label: center.centerName || "",
  }));

  const productOptions = products.map((product) => ({
    value: product._id,
    label: `${product.productTitle || ""} (${
      product.productCode || "N/A"
    })`,
  }));

  return (
    <>
      {/* =====================================================
          TOP → BOTTOM MODAL ANIMATION
      ===================================================== */}
      <style>
        {`
          @keyframes resellerQtySlideDown {
            0% {
              opacity: 0;
              transform: translateY(-70px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .reseller-qty-slide-down {
            animation: resellerQtySlideDown 0.35s ease-out forwards;
          }
        `}
      </style>

      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
        {/* =====================================================
            MODAL
        ===================================================== */}
        <div
          className="reseller-qty-slide-down relative w-full max-w-[800px] overflow-visible rounded-[7px] bg-white shadow-2xl"
        >
          {/* ===================================================
              HEADER
          =================================================== */}
          <div className="flex h-[62px] items-center justify-between border-b border-[#d9d9d9] px-5">
            <h2 className="text-[20px] font-normal text-[#343a40]">
              Search Reseller Stock
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded text-[#777] transition hover:bg-[#f3f3f3] hover:text-[#333]"
            >
              <X size={24} strokeWidth={1.8} />
            </button>
          </div>

          {/* ===================================================
              BODY
          =================================================== */}
          <div className="relative overflow-visible px-5 py-5">
            {/* =================================================
                RESELLER + CENTER
            ================================================= */}
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
              {/* =================================================
                  RESELLER
              ================================================= */}
              <div className="relative">
                <label
                  htmlFor="reseller"
                  className="mb-2 block text-[15px] font-semibold text-[#343a40]"
                >
                  Reseller <span className="text-red-500">*</span>
                </label>

                <Select
                  id="reseller"
                  name="reseller"
                  placeholder="Select Reseller..."
                  value={
                    searchData.reseller
                      ? {
                          value: searchData.reseller,
                          label:
                            selectedReseller?.businessName || "",
                        }
                      : null
                  }
                  onChange={(selected) => {
                    setSearchData((prev) => ({
                      ...prev,
                      reseller: selected ? selected.value : "",
                      center: "",
                    }));
                  }}
                  options={resellerOptions}
                  isClearable
                  isSearchable
                  styles={selectStyles}
                  menuPlacement="bottom"
                  menuPosition="absolute"
                  menuShouldScrollIntoView={false}
                  classNamePrefix="reseller-select"
                />
              </div>

              {/* =================================================
                  CENTER
              ================================================= */}
              <div className="relative">
                <label
                  htmlFor="center"
                  className="mb-2 block text-[15px] font-semibold text-[#343a40]"
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
                          value: searchData.center,
                          label: selectedCenter
                            ? `${selectedCenter.centerName}${
                                selectedCenter.centerCode
                                  ? ` (${selectedCenter.centerCode})`
                                  : ""
                              }`
                            : "",
                        }
                      : null
                  }
                  onChange={(selected) => {
                    setSearchData((prev) => ({
                      ...prev,
                      center: selected ? selected.value : "",
                    }));
                  }}
                  options={centerOptions}
                  isClearable
                  isSearchable
                  isDisabled={
                    !searchData.reseller || loadingCenters
                  }
                  isLoading={loadingCenters}
                  styles={selectStyles}
                  menuPlacement="bottom"
                  menuPosition="absolute"
                  menuShouldScrollIntoView={false}
                  classNamePrefix="center-select"
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

            {/* =================================================
                PRODUCT
            ================================================= */}
            <div className="relative mt-5">
              <label
                htmlFor="product"
                className="mb-2 block text-[15px] font-semibold text-[#343a40]"
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
                        value: searchData.product,
                        label:
                          selectedProduct?.productTitle || "",
                      }
                    : null
                }
                onChange={(selected) => {
                  setSearchData((prev) => ({
                    ...prev,
                    product: selected ? selected.value : "",
                  }));
                }}
                options={productOptions}
                isClearable
                isSearchable
                styles={selectStyles}
                menuPlacement="bottom"
                menuPosition="absolute"
                menuShouldScrollIntoView={false}
                classNamePrefix="product-select"
              />
            </div>

            {/* =================================================
                DATE RANGE
            ================================================= */}
            <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
              {/* START DATE */}
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-[15px] font-semibold text-[#343a40]"
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
                      startDate: e.target.value,
                    }))
                  }
                  className="h-[40px] w-full rounded-[4px] border border-[#d1d5db] bg-white px-3 text-[14px] text-[#333] outline-none transition focus:border-[#2f5fa7] focus:ring-1 focus:ring-[#2f5fa7]"
                />

                <p className="mt-1 text-[13px] text-[#777]">
                  Optional
                </p>
              </div>

              {/* END DATE */}
              <div>
                <label
                  htmlFor="endDate"
                  className="mb-2 block text-[15px] font-semibold text-[#343a40]"
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
                      endDate: e.target.value,
                    }))
                  }
                  className="h-[40px] w-full rounded-[4px] border border-[#d1d5db] bg-white px-3 text-[14px] text-[#333] outline-none transition focus:border-[#2f5fa7] focus:ring-1 focus:ring-[#2f5fa7]"
                />

                <p className="mt-1 text-[13px] text-[#777]">
                  Optional
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================
              FOOTER
          =================================================== */}
          <div className="flex justify-end gap-3 border-t border-[#d9d9d9] bg-white px-5 py-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-[38px] items-center justify-center rounded-[4px] bg-[#6c757d] px-4 text-[15px] font-medium text-white transition hover:bg-[#5a6268]"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex h-[38px] items-center justify-center rounded-[4px] bg-[#2f5fa7] px-4 text-[15px] font-medium text-white transition hover:bg-[#244c88]"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* =========================================================
   PROP TYPES
========================================================= */
ResellerQtySearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  resellers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
};

export default ResellerQtySearch;