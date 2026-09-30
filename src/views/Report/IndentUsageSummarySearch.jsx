import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import axiosInstance from '../../axiosInstance';
import { showError } from '../../utils/sweetAlerts';

const INITIAL_SEARCH = {
  productId: '',
  centerId: '',
  reseller: '',
  startDate: '',
  endDate: '',
};

const IndentUsageSummarySearch = ({
  visible,
  onClose,
  onSearch,
  centers,
  products,
}) => {
  const [searchData, setSearchData] =
    useState(INITIAL_SEARCH);

  const [resellers, setResellers] = useState([]);
  const [loadingResellers, setLoadingResellers] =
    useState(false);

  const [resellerCenters, setResellerCenters] =
    useState([]);
  const [loadingCenters, setLoadingCenters] =
    useState(false);

  // ------------------------------------------------------------
  // Fetch Resellers
  // ------------------------------------------------------------

  useEffect(() => {
    const fetchResellers = async () => {
      setLoadingResellers(true);

      try {
        const response =
          await axiosInstance.get('/resellers');

        if (response.data.success) {
          setResellers(
            response.data.data || []
          );
        }
      } catch (error) {
        console.error(
          'Error fetching resellers:',
          error
        );

        setResellers([]);
      } finally {
        setLoadingResellers(false);
      }
    };

    fetchResellers();
  }, []);

  // ------------------------------------------------------------
  // Fetch Centers By Reseller
  // ------------------------------------------------------------

  useEffect(() => {
    const fetchCentersByReseller = async () => {
      if (searchData.reseller) {
        setLoadingCenters(true);

        try {
          const response =
            await axiosInstance.get(
              `/centers/reseller/${searchData.reseller}`
            );

          if (response.data.success) {
            setResellerCenters(
              response.data.data || []
            );
          } else {
            setResellerCenters([]);
          }
        } catch (error) {
          console.error(
            'Error fetching centers for reseller:',
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
          centerId: '',
        }));
      }
    };

    fetchCentersByReseller();
  }, [searchData.reseller]);

  // ------------------------------------------------------------
  // Reset When Modal Closes
  // ------------------------------------------------------------

  useEffect(() => {
    if (!visible) {
      setSearchData(INITIAL_SEARCH);
      setResellerCenters([]);
    }
  }, [visible]);

  // ------------------------------------------------------------
  // Input Change
  // ------------------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ------------------------------------------------------------
  // Date Formatting
  // ------------------------------------------------------------

const formatDateForApi = (dateString) => {
  if (!dateString) return "";

  // HTML <input type="date"> already returns YYYY-MM-DD.
  // Keep this exact format for the API to avoid DD-MM-YYYY
  // parsing and timezone-related date shifts.
  if (/^\\d{4}-\\d{2}-\\d{2}$/.test(dateString)) {
    return dateString;
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

  // ------------------------------------------------------------
  // Search
  // ------------------------------------------------------------

  const handleSearch = () => {
    if (
      (searchData.startDate &&
        !searchData.endDate) ||
      (!searchData.startDate &&
        searchData.endDate)
    ) {
      showError(
        'Please select both Start Date and End Date, or leave both empty.'
      );

      return;
    }

    if (
      searchData.startDate &&
      searchData.endDate &&
      new Date(searchData.startDate) >
        new Date(searchData.endDate)
    ) {
      showError(
        'Start Date cannot be after End Date.'
      );

      return;
    }

    const apiSearchData = {};

    // Product
    if (searchData.productId) {
      const selectedProduct = products.find(
        (product) =>
          product._id === searchData.productId
      );

      if (selectedProduct) {
        apiSearchData.productId =
          selectedProduct._id;
      } else {
        apiSearchData.productId =
          searchData.productId;
      }
    }

    // Center
    if (searchData.centerId) {
      const selectedCenter =
        resellerCenters.find(
          (center) =>
            center._id === searchData.centerId
        );

      if (selectedCenter) {
        apiSearchData.centerId =
          selectedCenter._id;

        console.log(
          'Selected Center ID:',
          selectedCenter._id
        );

        console.log(
          'Selected Center Name:',
          selectedCenter.centerName
        );
      } else {
        apiSearchData.centerId =
          searchData.centerId;
      }
    }

    // Reseller
    if (searchData.reseller) {
      const selectedReseller =
        resellers.find(
          (reseller) =>
            reseller._id ===
            searchData.reseller
        );

      if (selectedReseller) {
        apiSearchData.resellerId =
          selectedReseller._id;
      } else {
        apiSearchData.resellerId =
          searchData.reseller;
      }
    }

    // Date Range
    if (
      searchData.startDate &&
      searchData.endDate
    ) {
      apiSearchData.startDate = formatDateForApi(
        searchData.startDate
      );

      apiSearchData.endDate = formatDateForApi(
        searchData.endDate
      );
    }

    console.log(
      'Search Data being sent:',
      apiSearchData
    );

    onSearch(apiSearchData);
    onClose();
  };

  // ------------------------------------------------------------
  // Reset
  // ------------------------------------------------------------

  const handleReset = () => {
    setSearchData(INITIAL_SEARCH);
    setResellerCenters([]);

    onSearch({
      productId: '',
      centerId: '',
      resellerId: '',
      startDate: '',
      endDate: '',
    });

    onClose();
  };

  // ------------------------------------------------------------
  // React Select Styles
  // ------------------------------------------------------------

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '38px',
      borderRadius: '6px',
      borderColor: state.isFocused
        ? '#3b82f6'
        : '#d1d5db',
      boxShadow: state.isFocused
        ? '0 0 0 1px #3b82f6'
        : 'none',
      '&:hover': {
        borderColor: '#9ca3af',
      },
      fontSize: '14px',
    }),

    menu: (base) => ({
      ...base,
      zIndex: 9999,
      fontSize: '14px',
    }),

    option: (
      base,
      state
    ) => ({
      ...base,
      backgroundColor:
        state.isSelected
          ? '#2563eb'
          : state.isFocused
            ? '#eff6ff'
            : '#fff',
      color: state.isSelected
        ? '#fff'
        : '#374151',
      cursor: 'pointer',
    }),

    placeholder: (base) => ({
      ...base,
      color: '#9ca3af',
    }),
  };

  // ------------------------------------------------------------
  // Options
  // ------------------------------------------------------------

  const resellerOptions =
    resellers.map((reseller) => ({
      value: reseller._id,
      label: reseller.businessName,
    }));

  const centerOptions =
    resellerCenters.map((center) => ({
      value: center._id,
      label: `${center.centerName} (${
        center.centerCode || 'N/A'
      })`,
    }));

  const productOptions =
    products.map((product) => ({
      value: product._id,
      label: product.productTitle,
    }));

  const selectedReseller =
    resellerOptions.find(
      (option) =>
        option.value ===
        searchData.reseller
    ) || null;

  const selectedCenter =
    centerOptions.find(
      (option) =>
        option.value ===
        searchData.centerId
    ) || null;

  const selectedProduct =
    productOptions.find(
      (option) =>
        option.value ===
        searchData.productId
    ) || null;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl overflow-visible rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Search
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-2xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          {/* Reseller + Branch */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Reseller */}
            <div>
              <label
                htmlFor="reseller"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Reseller
              </label>

              <Select
                id="reseller"
                name="reseller"
                placeholder={
                  loadingResellers
                    ? 'Loading resellers...'
                    : 'Select Reseller...'
                }
                value={selectedReseller}
                onChange={(selected) =>
                  setSearchData(
                    (prev) => ({
                      ...prev,
                      reseller:
                        selected
                          ? selected.value
                          : '',
                      centerId: '',
                    })
                  )
                }
                options={resellerOptions}
                isClearable
                isLoading={
                  loadingResellers
                }
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
                id="center"
                name="centerId"
                placeholder={
                  loadingCenters
                    ? 'Loading branches...'
                    : searchData.reseller
                      ? 'Select Branch...'
                      : 'Select a reseller first'
                }
                value={selectedCenter}
                onChange={(selected) =>
                  setSearchData(
                    (prev) => ({
                      ...prev,
                      centerId:
                        selected
                          ? selected.value
                          : '',
                    })
                  )
                }
                options={centerOptions}
                isClearable
                isDisabled={
                  !searchData.reseller ||
                  loadingCenters
                }
                isLoading={
                  loadingCenters
                }
                styles={selectStyles}
              />

              {searchData.reseller &&
                !loadingCenters &&
                resellerCenters.length ===
                  0 && (
                  <p className="mt-1.5 text-xs text-gray-500">
                    No branches found for
                    this reseller
                  </p>
                )}
            </div>
          </div>

          {/* Product */}
          <div>
            <label
              htmlFor="product"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Product
            </label>

            <Select
              id="product"
              name="productId"
              placeholder="Search Product..."
              value={selectedProduct}
              onChange={(selected) =>
                setSearchData(
                  (prev) => ({
                    ...prev,
                    productId:
                      selected
                        ? selected.value
                        : '',
                  })
                )
              }
              options={productOptions}
              isClearable
              styles={selectStyles}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>

              <input
                id="startDate"
                type="date"
                name="startDate"
                value={
                  searchData.startDate
                }
                onChange={handleChange}
                className="h-[38px] w-full rounded-md border border-gray-300 px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                id="endDate"
                type="date"
                name="endDate"
                value={
                  searchData.endDate
                }
                onChange={handleChange}
                className="h-[38px] w-full rounded-md border border-gray-300 px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <p className="mt-1 text-xs text-gray-500">
                Optional
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

IndentUsageSummarySearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
};

export default IndentUsageSummarySearch;