import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Download,
  RotateCcw,
  Search,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import Pagination from '../../utils/Pagination';
import {
  showError,
  showSuccess,
} from '../../utils/sweetAlerts';
import { formatDisplayDate } from '../../utils/FormatDateTime';

import SearchIndentSummary from './SearchIndentSummary';

const UsageSummary = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] =
    useState(false);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] =
    useState(false);

  const [exportModalVisible, setExportModalVisible] =
    useState(false);

  const [exportStartDate, setExportStartDate] =
    useState('');
  const [exportEndDate, setExportEndDate] =
    useState('');

  const [activeSearch, setActiveSearch] = useState({
    center: '',
    product: '',
    startDate: '',
    endDate: '',
    usageType: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  /* =========================================================
     AGGREGATE DATA BY CENTER + PRODUCT
  ========================================================= */

  const aggregateData = (detailedData) => {
    const summaryMap = new Map();

    detailedData.forEach((item) => {
      const centerId =
        item.CenterId || item.Center || '';

      const productId =
        item.ProductId || item.Product || '';

      const key = `${centerId}|${productId}`;

      const quantity = Number(item.Qty || 0);

      if (summaryMap.has(key)) {
        const existing = summaryMap.get(key);

        existing.TotalQuantity += quantity;
      } else {
        summaryMap.set(key, {
          Center: item.Center || '',
          CenterId: item.CenterId || '',
          Product: item.Product || '',
          ProductId: item.ProductId || '',
          TotalQuantity: quantity,
        });
      }
    });

    return Array.from(summaryMap.values());
  };

  /* =========================================================
     FETCH USAGE SUMMARY
  ========================================================= */

  const fetchData = async (
    searchParams = {},
    page = 1
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchParams.center) {
        params.append(
          'center',
          searchParams.center
        );
      }

      if (searchParams.product) {
        params.append(
          'product',
          searchParams.product
        );
      }

      if (searchParams.usageType) {
        params.append(
          'usageType',
          searchParams.usageType
        );
      }

      if (
        searchParams.startDate &&
        searchParams.endDate
      ) {
        const convertDateFormat = (dateStr) => {
          const [day, month, year] =
            dateStr.split('-');

          return `${year}-${month}-${day}`;
        };

        params.append(
          'startDate',
          convertDateFormat(
            searchParams.startDate
          )
        );

        params.append(
          'endDate',
          convertDateFormat(
            searchParams.endDate
          )
        );
      }

      params.append('page', page);

      const url = params.toString()
        ? `/reports/usages/summary?${params.toString()}`
        : '/reports/usages/summary';

      const response =
        await axiosInstance.get(url);

      if (response.data.success) {
        const aggregatedData =
          aggregateData(
            response.data.data || []
          );

        setData(aggregatedData);

        setSummary(
          response.data.summary || null
        );

        setCurrentPage(
          response.data.pagination
            ?.currentPage || page
        );

        setTotalPages(
          response.data.pagination
            ?.totalPages || 1
        );
      } else {
        const errorMessage =
          response.data.message ||
          'API returned unsuccessful response';

        setError(errorMessage);

        console.error(
          'Backend error:',
          response.data
        );
      }
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Error ${err.response.status}: ${err.response.statusText}`;

        setError(errorMessage);

        console.error(
          'Error response:',
          err.response.data
        );
      } else if (err.request) {
        setError(
          'No response received from server. Please check your network connection.'
        );

        console.error(
          'Error request:',
          err.request
        );
      } else {
        setError(
          err.message ||
            'An error occurred while fetching data'
        );

        console.error(
          'Error message:',
          err.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH ALL DATA FOR EXPORT
  ========================================================= */

  const fetchAllSummaryData = async (
    searchParams = {}
  ) => {
    try {
      const params = new URLSearchParams();

      if (searchParams.center) {
        params.append(
          'center',
          searchParams.center
        );
      }

      if (searchParams.product) {
        params.append(
          'product',
          searchParams.product
        );
      }

      if (searchParams.usageType) {
        params.append(
          'usageType',
          searchParams.usageType
        );
      }

      if (
        searchParams.startDate &&
        searchParams.endDate
      ) {
        const convertDateFormat = (dateStr) => {
          const [day, month, year] =
            dateStr.split('-');

          return `${year}-${month}-${day}`;
        };

        params.append(
          'startDate',
          convertDateFormat(
            searchParams.startDate
          )
        );

        params.append(
          'endDate',
          convertDateFormat(
            searchParams.endDate
          )
        );
      }

      params.append('page', 1);
      params.append('limit', 100000);

      const url =
        `/reports/usages/summary?${params.toString()}`;

      const response =
        await axiosInstance.get(url);

      if (response.data.success) {
        return aggregateData(
          response.data.data || []
        );
      }

      return [];
    } catch (err) {
      console.error(
        'Error fetching all summary data:',
        err
      );

      return [];
    }
  };

  /* =========================================================
     FETCH CENTERS
  ========================================================= */

  const fetchCenters = async () => {
    try {
      const response =
        await axiosInstance.get('/centers');

      if (response.data.success) {
        setCenters(response.data.data || []);
      }
    } catch (err) {
      console.error(
        'Error fetching centers:',
        err
      );
    }
  };

  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

  const fetchProducts = async () => {
    try {
      const response =
        await axiosInstance.get('/products');

      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (err) {
      console.error(
        'Error fetching products:',
        err
      );
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchProducts();
  }, []);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    fetchData(activeSearch, page);
  };

  /* =========================================================
     TOTAL
  ========================================================= */

  const calculateTotals = () => {
    const totals = {
      TotalQuantity: 0,
    };

    data.forEach((item) => {
      totals.TotalQuantity += Number(
        item.TotalQuantity || 0
      );
    });

    return totals;
  };

  /* =========================================================
     SORTING
  ========================================================= */

  const getNestedValue = (object, key) => {
    return key
      .split('.')
      .reduce(
        (value, currentKey) =>
          value?.[currentKey],
        object
      );
  };

  const handleSort = (key) => {
    let direction = 'ascending';

    if (
      sortConfig.key === key &&
      sortConfig.direction ===
        'ascending'
    ) {
      direction = 'descending';
    }

    setSortConfig({
      key,
      direction,
    });

    const sortedData = [...data].sort(
      (a, b) => {
        let aValue = getNestedValue(
          a,
          key
        );

        let bValue = getNestedValue(
          b,
          key
        );

        if (aValue == null) {
          aValue = '';
        }

        if (bValue == null) {
          bValue = '';
        }

        if (
          typeof aValue === 'number' &&
          typeof bValue === 'number'
        ) {
          return direction === 'ascending'
            ? aValue - bValue
            : bValue - aValue;
        }

        aValue = String(
          aValue
        ).toLowerCase();

        bValue = String(
          bValue
        ).toLowerCase();

        if (aValue < bValue) {
          return direction === 'ascending'
            ? -1
            : 1;
        }

        if (aValue > bValue) {
          return direction === 'ascending'
            ? 1
            : -1;
        }

        return 0;
      }
    );

    setData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction ===
      'ascending' ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (searchData) => {
    const mergedSearchData = {
      ...activeSearch,
      ...searchData,
    };

    setActiveSearch(
      mergedSearchData
    );

    setCurrentPage(1);

    fetchData(
      mergedSearchData,
      1
    );
  };

  /* =========================================================
     RESET SEARCH
  ========================================================= */

  const handleResetSearch = () => {
    const emptySearch = {
      center: '',
      product: '',
      startDate: '',
      endDate: '',
      usageType: '',
    };

    setActiveSearch(emptySearch);
    setSearchTerm('');
    setSortConfig({
      key: null,
      direction: 'ascending',
    });

    setCurrentPage(1);

    fetchData({}, 1);
  };

  /* =========================================================
     SEARCH ACTIVE
  ========================================================= */

  const isSearchActive = () => {
    return Boolean(
      activeSearch.center ||
        activeSearch.product ||
        activeSearch.startDate ||
        activeSearch.endDate ||
        activeSearch.usageType
    );
  };

  /* =========================================================
     EXPORT MODAL
  ========================================================= */

  const openExportModal = () => {
    setExportStartDate(
      activeSearch.startDate || ''
    );

    setExportEndDate(
      activeSearch.endDate || ''
    );

    setExportModalVisible(true);
  };

  /* =========================================================
     EXPORT
  ========================================================= */

  const generateDetailExport = async () => {
    try {
      setExportLoading(true);

      if (
        exportStartDate &&
        exportEndDate &&
        exportStartDate > exportEndDate
      ) {
        showError(
          'Start date cannot be greater than end date'
        );

        return;
      }

      const params =
        new URLSearchParams();

      if (activeSearch.center) {
        params.append(
          'center',
          activeSearch.center
        );
      }

      if (activeSearch.product) {
        params.append(
          'product',
          activeSearch.product
        );
      }

      if (activeSearch.usageType) {
        params.append(
          'usageType',
          activeSearch.usageType
        );
      }

      const convertDateFormat = (
        dateStr
      ) => {
        if (!dateStr) {
          return dateStr;
        }

        const parts =
          dateStr.split('-');

        if (
          parts.length === 3 &&
          parts[0].length === 2 &&
          parts[1].length === 2 &&
          parts[2].length === 4
        ) {
          const [
            day,
            month,
            year,
          ] = parts;

          return `${year}-${month}-${day}`;
        }

        return dateStr;
      };

      if (exportStartDate) {
        params.append(
          'startDate',
          convertDateFormat(
            exportStartDate
          )
        );
      }

      if (exportEndDate) {
        params.append(
          'endDate',
          convertDateFormat(
            exportEndDate
          )
        );
      }

      params.append(
        'export',
        'true'
      );

      const apiUrl =
        `/reports/usages/summary?${params.toString()}`;

      const response =
        await axiosInstance.get(
          apiUrl
        );

      if (!response.data.success) {
        throw new Error(
          'API returned unsuccessful response'
        );
      }

      const exportData =
        aggregateData(
          response.data.data || []
        );

      if (
        !exportData ||
        exportData.length === 0
      ) {
        showError(
          'No data available for export'
        );

        return;
      }

      const headers = [
        'Center',
        'Product',
        'Total Quantity',
      ];

      const csvData =
        exportData.map((item) => [
          item.Center || '',
          item.Product || '',
          item.TotalQuantity || 0,
        ]);

      let filename =
        'usage_summary_report';

      if (
        exportStartDate &&
        exportEndDate
      ) {
        filename +=
          `_${exportStartDate}_to_${exportEndDate}`;
      } else if (exportStartDate) {
        filename +=
          `_from_${exportStartDate}`;
      } else if (exportEndDate) {
        filename +=
          `_until_${exportEndDate}`;
      } else {
        filename +=
          `_${new Date()
            .toISOString()
            .split('T')[0]}`;
      }

      filename += '.csv';

      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const stringField =
                String(field ?? '');

              return `"${stringField.replace(
                /"/g,
                '""'
              )}"`;
            })
            .join(',')
        ),
      ].join('\n');

      const blob = new Blob(
        ['\uFEFF' + csvContent],
        {
          type:
            'text/csv;charset=utf-8;',
        }
      );

      const link =
        document.createElement('a');

      const downloadUrl =
        URL.createObjectURL(blob);

      link.href = downloadUrl;
      link.download = filename;
      link.style.visibility =
        'hidden';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(
        downloadUrl
      );

      showSuccess(
        'Export completed successfully!'
      );

      setExportModalVisible(false);
      setExportStartDate('');
      setExportEndDate('');
    } catch (err) {
      console.error(
        'Error generating export:',
        err
      );

      showError(
        'Error generating export file'
      );
    } finally {
      setExportLoading(false);
    }
  };

  /* =========================================================
     FRONTEND SEARCH
  ========================================================= */

  const filteredData = data.filter(
    (item) => {
      if (isSearchActive()) {
        return true;
      }

      if (!searchTerm) {
        return true;
      }

      const searchLower =
        searchTerm.toLowerCase();

      return Object.values(item).some(
        (value) => {
          if (
            typeof value === 'object' &&
            value !== null
          ) {
            return Object.values(
              value
            ).some(
              (nestedValue) =>
                nestedValue != null &&
                String(nestedValue)
                  .toLowerCase()
                  .includes(
                    searchLower
                  )
            );
          }

          return (
            value != null &&
            String(value)
              .toLowerCase()
              .includes(searchLower)
          );
        }
      );
    }
  );

  const totals =
    calculateTotals();

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  /* =========================================================
     SUMMARY PERIOD
  ========================================================= */

  const formattedMonth =
    summary?.period
      ? new Date(
          `${summary.period.split('/')[1]}-${summary.period.split('/')[0]}-01`
        ).toLocaleString(
          'default',
          {
            month: 'long',
            year: 'numeric',
          }
        )
      : 'N/A';

  /* =========================================================
     TOTAL QUANTITY CLICK
  ========================================================= */

  const handleProductQuantityClick = (
    item
  ) => {
    const centerId =
      item.CenterId || '';

    const productId =
      item.ProductId || '';

    const summaryTotalQuantity =
      Number(
        item.TotalQuantity || 0
      );

    if (!productId || !centerId) {
      showError(
        'Unable to navigate to details: missing product or center information'
      );

      return;
    }

    const detailState = {
      productId,
      centerId,
      productName:
        item.Product,
      centerName:
        item.Center,
      summaryTotalQuantity,
      fromSummary: true,
    };

    if (
      activeSearch.startDate &&
      activeSearch.endDate
    ) {
      detailState.startDate =
        activeSearch.startDate;

      detailState.endDate =
        activeSearch.endDate;
    } else {
      const periodMatch =
        String(
          summary?.period || ''
        ).match(
          /^(\d{1,2})\/(\d{4})$/
        );

      if (periodMatch) {
        detailState.month =
          periodMatch[1];

        detailState.year =
          periodMatch[2];
      }
    }

    navigate(
      '/usage-detail',
      {
        state: detailState,
      }
    );
  };

  return (
    <div className="min-w-0 p-4">
      {/* TITLE */}

      <div className="mb-4 text-2xl font-semibold text-gray-800">
        Usage Summary Report
      </div>

      {/* SEARCH MODAL */}

      <SearchIndentSummary
        visible={
          searchModalVisible
        }
        onClose={() =>
          setSearchModalVisible(false)
        }
        onSearch={handleSearch}
        centers={centers}
        products={products}
      />

      {/* =====================================================
          EXPORT MODAL
      ====================================================== */}

      {exportModalVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Export Usage Summary Report
              </h2>

              <button
                type="button"
                onClick={() =>
                  setExportModalVisible(
                    false
                  )
                }
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="space-y-4 px-5 py-5">
              <div>
                <label
                  htmlFor="exportStartDate"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Start Date (Optional)
                </label>

                <input
                  id="exportStartDate"
                  type="date"
                  value={
                    exportStartDate
                  }
                  onChange={(e) =>
                    setExportStartDate(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to include
                  all records from
                  beginning
                </p>
              </div>

              <div>
                <label
                  htmlFor="exportEndDate"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  End Date (Optional)
                </label>

                <input
                  id="exportEndDate"
                  type="date"
                  value={
                    exportEndDate
                  }
                  onChange={(e) =>
                    setExportEndDate(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to include
                  all records until today
                </p>
              </div>

              {(activeSearch.center ||
                activeSearch.product ||
                activeSearch.usageType) && (
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Current Filters:
                  </p>

                  <ul className="space-y-1 text-xs text-gray-600">
                    {activeSearch.center && (
                      <li>
                        Center:{' '}
                        {centers.find(
                          (center) =>
                            center._id ===
                            activeSearch.center
                        )?.centerName ||
                          'N/A'}
                      </li>
                    )}

                    {activeSearch.product && (
                      <li>
                        Product:{' '}
                        {products.find(
                          (product) =>
                            product._id ===
                            activeSearch.product
                        )?.productTitle ||
                          'N/A'}
                      </li>
                    )}

                    {activeSearch.usageType && (
                      <li>
                        Usage Type:{' '}
                        {
                          activeSearch.usageType
                        }
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-4">
              <button
                type="button"
                onClick={() =>
                  setExportModalVisible(
                    false
                  )
                }
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  generateDetailExport
                }
                disabled={
                  exportLoading
                }
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exportLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet
                      size={16}
                    />
                    Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* HEADER */}

        <div className="flex flex-col gap-3 border-b bg-gray-50 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(
                  true
                )
              }
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Search size={16} />
              Search
            </button>

            {isSearchActive() && (
              <button
                type="button"
                onClick={
                  handleResetSearch
                }
                className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                <RotateCcw
                  size={16}
                />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={
                openExportModal
              }
              disabled={
                exportLoading ||
                data.length === 0
              }
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Export
            </button>
          </div>

          <Pagination
            currentPage={
              currentPage
            }
            totalPages={
              totalPages
            }
            onPageChange={
              handlePageChange
            }
          />
        </div>

        {/* SEARCH */}

        <div className="flex flex-col gap-3 border-b px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-gray-500">
            {exportStartDate &&
              `Export From: ${exportStartDate} `}

            {exportEndDate &&
              `To: ${exportEndDate}`}
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="usageSummarySearch"
              className="text-sm font-medium text-gray-700"
            >
              Search:
            </label>

            <input
              id="usageSummarySearch"
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-[350px]"
            />
          </div>
        </div>

        {/* SUMMARY PERIOD */}

        <div className="border-b px-4 py-4">
          <h4 className="mb-2 text-base font-semibold text-gray-800">
            Showing Result
          </h4>

          <div className="text-sm text-gray-600">
            {activeSearch.startDate &&
            activeSearch.endDate ? (
              <strong>
                {formatDisplayDate(
                  activeSearch.startDate,
                  activeSearch.endDate
                )}
              </strong>
            ) : (
              <span>
                <strong>
                  Month:
                </strong>{' '}
                {formattedMonth}
              </span>
            )}
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <SortableHeader
                  label="Branch"
                  icon={getSortIcon(
                    'Center'
                  )}
                  onClick={() =>
                    handleSort(
                      'Center'
                    )
                  }
                />

                <SortableHeader
                  label="Product"
                  icon={getSortIcon(
                    'Product'
                  )}
                  onClick={() =>
                    handleSort(
                      'Product'
                    )
                  }
                />

                <SortableHeader
                  label="Total Qty"
                  icon={getSortIcon(
                    'TotalQuantity'
                  )}
                  onClick={() =>
                    handleSort(
                      'TotalQuantity'
                    )
                  }
                />
              </tr>
            </thead>

            <tbody>
              {filteredData.length >
              0 ? (
                <>
                  {filteredData.map(
                    (
                      item,
                      index
                    ) => (
                      <tr
                        key={`${item.CenterId || item.Center}-${item.ProductId || item.Product}-${index}`}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-gray-700">
                          {item.Center ||
                            'N/A'}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {item.Product ||
                            'N/A'}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleProductQuantityClick(
                                item
                              )
                            }
                            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {Number(
                              item.TotalQuantity ||
                                0
                            )}
                          </button>
                        </td>
                      </tr>
                    )
                  )}

                  {/* TOTAL */}

                  <tr className="bg-gray-100 font-semibold text-gray-800">
                    <td
                      colSpan={2}
                      className="px-4 py-3"
                    >
                      Total
                    </td>

                    <td className="px-4 py-3">
                      {totals.TotalQuantity.toFixed(
                        2
                      )}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SORTABLE TABLE HEADER
========================================================= */

const SortableHeader = ({
  label,
  icon,
  onClick,
}) => {
  return (
    <th
      onClick={onClick}
      className="cursor-pointer border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 hover:bg-gray-200"
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {icon}
      </div>
    </th>
  );
};

export default UsageSummary;