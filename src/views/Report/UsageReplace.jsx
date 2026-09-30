import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Download,
  RotateCcw,
  Search,
} from 'lucide-react';

import axiosInstance from '../../axiosInstance';
import Pagination from '../../utils/Pagination';
import { showError } from '../../utils/sweetAlerts';
import { formatDate } from '../../utils/FormatDateTime';

import CommonSearch from './CommonSearch';

const UsageReplace = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] =
    useState(false);

  const [activeSearch, setActiveSearch] = useState({
    keyword: '',
    center: '',
    product: '',
    startDate: '',
    endDate: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* =========================================================
     FETCH DATA
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

      if (searchParams.startDate) {
        const [day, month, year] =
          searchParams.startDate.split('-');

        params.append(
          'startDate',
          `${year}-${month}-${day}`
        );
      }

      if (searchParams.endDate) {
        const [day, month, year] =
          searchParams.endDate.split('-');

        params.append(
          'endDate',
          `${year}-${month}-${day}`
        );
      }

      params.append('page', page);

      const url =
        `/reports/replace-report?${params.toString()}`;

      const response =
        await axiosInstance.get(url);

      if (response.data.success) {
        setData(response.data.data || []);

        setCurrentPage(
          response.data.pagination?.currentPage ||
            1
        );

        setTotalPages(
          response.data.pagination?.totalPages ||
            1
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
        await axiosInstance.get('/products/all');

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
     SORT
  ========================================================= */

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
        let aValue = a;
        let bValue = b;

        if (key.includes('.')) {
          const keys = key.split('.');

          aValue = keys.reduce(
            (obj, currentKey) =>
              obj && obj[currentKey],
            a
          );

          bValue = keys.reduce(
            (obj, currentKey) =>
              obj && obj[currentKey],
            b
          );
        } else {
          aValue = a[key];
          bValue = b[key];
        }

        if (aValue == null) {
          aValue = '';
        }

        if (bValue == null) {
          bValue = '';
        }

        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();

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
    setActiveSearch(searchData);
    setCurrentPage(1);
    fetchData(searchData, 1);
  };

  const handleResetSearch = () => {
    const resetSearch = {
      product: '',
      center: '',
      startDate: '',
      endDate: '',
      keyword: '',
    };

    setActiveSearch(resetSearch);
    setSearchTerm('');
    setSortConfig({
      key: null,
      direction: 'ascending',
    });

    setCurrentPage(1);

    fetchData({}, 1);
  };

  /* =========================================================
     FRONTEND SEARCH
  ========================================================= */

  const filteredData = data.filter(
    (item) => {
      if (!searchTerm) {
        return true;
      }

      const searchLower =
        searchTerm.toLowerCase();

      return (
        (
          item.usageType &&
          item.usageType
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          item.product?.productTitle &&
          item.product.productTitle
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          item.center?.centerName &&
          item.center.centerName
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          item.customerName &&
          item.customerName
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          item.buildingName &&
          item.buildingName
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          item.statusReason &&
          item.statusReason
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          item.oldSerialNumber &&
          item.oldSerialNumber
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          item.newSerialNumber &&
          item.newSerialNumber
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          item.replaceProductName &&
          item.replaceProductName
            .toLowerCase()
            .includes(searchLower)
        )
      );
    }
  );

  /* =========================================================
     EXPORT
  ========================================================= */

  const fetchAllDataForExport =
    async () => {
      try {
        setLoading(true);

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

        if (activeSearch.startDate) {
          const [
            day,
            month,
            year,
          ] =
            activeSearch.startDate.split(
              '-'
            );

          params.append(
            'startDate',
            `${year}-${month}-${day}`
          );
        }

        if (activeSearch.endDate) {
          const [
            day,
            month,
            year,
          ] =
            activeSearch.endDate.split(
              '-'
            );

          params.append(
            'endDate',
            `${year}-${month}-${day}`
          );
        }

        const url =
          `/reports/replace-report?${params.toString()}`;

        const response =
          await axiosInstance.get(url);

        if (response.data.success) {
          return response.data.data || [];
        }

        throw new Error(
          'API returned unsuccessful response'
        );
      } catch (err) {
        console.error(
          'Error fetching data for export:',
          err
        );

        showError(
          'Error fetching data for export'
        );

        return [];
      } finally {
        setLoading(false);
      }
    };

  const generateDetailExport =
    async () => {
      try {
        setLoading(true);

        const allData =
          await fetchAllDataForExport();

        if (
          !allData ||
          allData.length === 0
        ) {
          showError(
            'No data available for export'
          );
          return;
        }

        const headers = [
          'Date',
          'Type',
          'Center',
          'Product',
          'Product Type',
          'Replace For (Old Serial)',
          'Replace Product Name',
          'Quantity',
          'Damage Quantity',
          'User/Building',
          'Mobile',
          'Status',
          'New Serial Number',
          'Reason',
        ];

        const csvData =
          allData.map((item) => [
            formatDate(
              item.date || ''
            ),
            item.usageType || '',
            item.center?.centerName ||
              '',
            item.product?.productTitle ||
              '',
            item.productType || '',
            item.replaceFor || '',
            item.replaceProductName ||
              '',
            item.qty || 0,
            item.damageQty || 0,
            item.buildingName ||
              item.customerName ||
              '',
            item.mobile || '',
            item.connectionType ||
              '',
            item.newSerialNumber ||
              '',
            item.reason || '',
          ]);

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

        const url =
          URL.createObjectURL(blob);

        link.setAttribute(
          'href',
          url
        );

        link.setAttribute(
          'download',
          `Usage_Replace_Report_${
            new Date()
              .toISOString()
              .split('T')[0]
          }.csv`
        );

        link.style.visibility =
          'hidden';

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

        URL.revokeObjectURL(url);
      } catch (err) {
        console.error(
          'Error generating export:',
          err
        );

        showError(
          'Error generating export file'
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================================================
     TOTALS
  ========================================================= */

  const calculateTotals = () => {
    const totals = {
      totalQty: 0,
      totalDamageQty: 0,
    };

    filteredData.forEach((item) => {
      totals.totalQty += parseFloat(
        item.qty || 0
      );

      totals.totalDamageQty +=
        parseFloat(
          item.damageQty || 0
        );
    });

    return totals;
  };

  const totals = calculateTotals();

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
        <span className="font-semibold">
          Error loading data:
        </span>{' '}
        {error}
      </div>
    );
  }

  const searchActive =
    Boolean(
      activeSearch.product ||
        activeSearch.center ||
        activeSearch.startDate ||
        activeSearch.endDate
    );

  return (
    <div className="min-w-0 p-4">
      {/* TITLE */}

      <div className="mb-4 text-2xl font-semibold text-gray-800">
        Usage Replace Report
      </div>

      {/* SEARCH MODAL */}

      <CommonSearch
        visible={searchModalVisible}
        onClose={() =>
          setSearchModalVisible(false)
        }
        onSearch={handleSearch}
        centers={centers}
        products={products}
      />

      {/* MAIN CARD */}

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* CARD HEADER */}

        <div className="flex flex-col gap-3 border-b bg-gray-50 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(true)
              }
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Search size={16} />
              Search
            </button>

            {searchActive && (
              <button
                type="button"
                onClick={
                  handleResetSearch
                }
                className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
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
                generateDetailExport
              }
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={16} />

              {loading
                ? 'Exporting...'
                : 'Export'}
            </button>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={
              handlePageChange
            }
          />
        </div>

        {/* SEARCH AREA */}

        <div className="flex flex-col gap-3 border-b px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-semibold text-gray-700">
            Total Records:{' '}
            {filteredData.length}
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="usageReplaceSearch"
              className="text-sm font-medium text-gray-700"
            >
              Search:
            </label>

            <input
              id="usageReplaceSearch"
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

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="min-w-[1500px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <SortableHeader
                  label="Date"
                  onClick={() =>
                    handleSort(
                      'date'
                    )
                  }
                  icon={getSortIcon(
                    'date'
                  )}
                />

                <SortableHeader
                  label="Type"
                  onClick={() =>
                    handleSort(
                      'usageType'
                    )
                  }
                  icon={getSortIcon(
                    'usageType'
                  )}
                />

                <SortableHeader
                  label="Branch"
                  onClick={() =>
                    handleSort(
                      'center.centerName'
                    )
                  }
                  icon={getSortIcon(
                    'center.centerName'
                  )}
                />

                <SortableHeader
                  label="Product"
                  onClick={() =>
                    handleSort(
                      'product.productTitle'
                    )
                  }
                  icon={getSortIcon(
                    'product.productTitle'
                  )}
                />

                <SortableHeader
                  label="Product Type"
                  onClick={() =>
                    handleSort(
                      'replaceProductName'
                    )
                  }
                  icon={getSortIcon(
                    'replaceProductName'
                  )}
                />

                <SortableHeader
                  label="Qty"
                  onClick={() =>
                    handleSort(
                      'qty'
                    )
                  }
                  icon={getSortIcon(
                    'qty'
                  )}
                />

                <SortableHeader
                  label="Damage Qty"
                  onClick={() =>
                    handleSort(
                      'damageQty'
                    )
                  }
                  icon={getSortIcon(
                    'damageQty'
                  )}
                />

                <SortableHeader
                  label="User/Building"
                  onClick={() =>
                    handleSort(
                      'buildingName'
                    )
                  }
                  icon={getSortIcon(
                    'buildingName'
                  )}
                />

                <SortableHeader
                  label="Mobile"
                  onClick={() =>
                    handleSort(
                      'mobile'
                    )
                  }
                  icon={getSortIcon(
                    'mobile'
                  )}
                />

                <SortableHeader
                  label="Status"
                  onClick={() =>
                    handleSort(
                      'connectionType'
                    )
                  }
                  icon={getSortIcon(
                    'connectionType'
                  )}
                />

                <SortableHeader
                  label="Reason"
                  onClick={() =>
                    handleSort(
                      'reason'
                    )
                  }
                  icon={getSortIcon(
                    'reason'
                  )}
                />
              </tr>
            </thead>

            <tbody>
              {filteredData.length >
              0 ? (
                <>
                  {filteredData.map(
                    (item) => (
                      <tr
                        key={item._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-3 py-2">
                          {formatDate(
                            item.date
                          )}
                        </td>

                        <td className="px-3 py-2">
                          {item.usageType ||
                            ''}
                        </td>

                        <td className="px-3 py-2">
                          {item.center
                            ?.centerName ||
                            ''}
                        </td>

                        <td className="px-3 py-2">
                          {item.product
                            ?.productTitle ||
                            ''}
                        </td>

                        <td className="px-3 py-2">
                          <span className="font-medium text-gray-700">
                            Replace for{' '}
                          </span>
                          {
                            item.replaceProductName
                          }
                        </td>

                        <td className="px-3 py-2">
                          {item.qty || 0}
                        </td>

                        <td className="px-3 py-2">
                          {item.damageQty ||
                            0}
                        </td>

                        <td className="px-3 py-2">
                          <button
                            type="button"
                            className="border-0 bg-transparent p-0 text-left text-blue-600 hover:underline"
                          >
                            {item.buildingName ||
                              ''}
                            {item.customerName ||
                              ''}
                          </button>
                        </td>

                        <td className="px-3 py-2">
                          {item.mobile ||
                            ''}
                        </td>

                        <td className="px-3 py-2">
                          {item.connectionType ||
                            ''}
                        </td>

                        <td className="px-3 py-2">
                          {item.reason ||
                            ''}
                        </td>
                      </tr>
                    )
                  )}

                  {/* TOTAL ROW */}

                  <tr className="bg-gray-100 font-semibold">
                    <td
                      colSpan={5}
                      className="px-3 py-3 text-left"
                    >
                      Total Count
                    </td>

                    <td className="px-3 py-3">
                      {totals.totalQty}
                    </td>

                    <td className="px-3 py-3">
                      {totals.totalDamageQty}
                    </td>

                    <td
                      colSpan={4}
                      className="px-3 py-3"
                    />
                  </tr>
                </>
              ) : (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No replacement
                    records found
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
   TABLE HEADER
========================================================= */

const SortableHeader = ({
  label,
  onClick,
  icon,
}) => (
  <th
    onClick={onClick}
    className="cursor-pointer whitespace-nowrap border-b border-gray-200 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 hover:bg-gray-200"
  >
    <div className="flex items-center gap-1">
      <span>{label}</span>
      {icon}
    </div>
  </th>
);

export default UsageReplace;