

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

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchParams.center) {
        params.append('center', searchParams.center);
      }

      if (searchParams.product) {
        params.append('product', searchParams.product);
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

      const url = `/reports/replace-report?${params.toString()}`;
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setData(response.data.data || []);

        setCurrentPage(
          response.data.pagination?.currentPage || 1
        );

        setTotalPages(
          response.data.pagination?.totalPages || 1
        );
      } else {
        const errorMessage =
          response.data.message ||
          'API returned unsuccessful response';

        setError(errorMessage);

        console.error('Backend error:', response.data);
      }
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Error ${err.response.status}: ${err.response.statusText}`;

        setError(errorMessage);

        console.error('Error response:', err.response.data);
      } else if (err.request) {
        setError(
          'No response received from server. Please check your network connection.'
        );

        console.error('Error request:', err.request);
      } else {
        setError(
          err.message ||
            'An error occurred while fetching data'
        );

        console.error('Error message:', err.message);
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
      const response = await axiosInstance.get('/centers');

      if (response.data.success) {
        setCenters(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching centers:', err);
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
      console.error('Error fetching products:', err);
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
    if (page < 1 || page > totalPages) {
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
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }

    setSortConfig({
      key,
      direction,
    });

    const sortedData = [...data].sort((a, b) => {
      let aValue;
      let bValue;

      if (key.includes('.')) {
        const keys = key.split('.');

        aValue = keys.reduce(
          (obj, currentKey) => obj && obj[currentKey],
          a
        );

        bValue = keys.reduce(
          (obj, currentKey) => obj && obj[currentKey],
          b
        );
      } else {
        aValue = a[key];
        bValue = b[key];
      }

      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }

      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }

      return 0;
    });

    setData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction === 'ascending' ? (
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

  const filteredData = data.filter((item) => {
    if (!searchTerm) {
      return true;
    }

    const searchLower = searchTerm.toLowerCase();

    return (
      (item.usageType &&
        item.usageType.toLowerCase().includes(searchLower)) ||
      (item.product?.productTitle &&
        item.product.productTitle
          .toLowerCase()
          .includes(searchLower)) ||
      (item.center?.centerName &&
        item.center.centerName
          .toLowerCase()
          .includes(searchLower)) ||
      (item.customerName &&
        item.customerName.toLowerCase().includes(searchLower)) ||
      (item.buildingName &&
        item.buildingName.toLowerCase().includes(searchLower)) ||
      (item.statusReason &&
        item.statusReason.toLowerCase().includes(searchLower)) ||
      (item.oldSerialNumber &&
        item.oldSerialNumber.toLowerCase().includes(searchLower)) ||
      (item.newSerialNumber &&
        item.newSerialNumber.toLowerCase().includes(searchLower)) ||
      (item.replaceProductName &&
        item.replaceProductName.toLowerCase().includes(searchLower))
    );
  });

  /* =========================================================
     EXPORT
  ========================================================= */

  const fetchAllDataForExport = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (activeSearch.center) {
        params.append('center', activeSearch.center);
      }

      if (activeSearch.product) {
        params.append('product', activeSearch.product);
      }

      if (activeSearch.startDate) {
        const [day, month, year] =
          activeSearch.startDate.split('-');

        params.append(
          'startDate',
          `${year}-${month}-${day}`
        );
      }

      if (activeSearch.endDate) {
        const [day, month, year] =
          activeSearch.endDate.split('-');

        params.append(
          'endDate',
          `${year}-${month}-${day}`
        );
      }

      const url = `/reports/replace-report?${params.toString()}`;
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        return response.data.data || [];
      }

      throw new Error(
        'API returned unsuccessful response'
      );
    } catch (err) {
      console.error('Error fetching data for export:', err);

      showError('Error fetching data for export');

      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateDetailExport = async () => {
    try {
      setLoading(true);

      const allData = await fetchAllDataForExport();

      if (!allData || allData.length === 0) {
        showError('No data available for export');
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

      const csvData = allData.map((item) => [
        formatDate(item.date || ''),
        item.usageType || '',
        item.center?.centerName || '',
        item.product?.productTitle || '',
        item.productType || '',
        item.replaceFor || '',
        item.replaceProductName || '',
        item.qty || 0,
        item.damageQty || 0,
        item.buildingName || item.customerName || '',
        item.mobile || '',
        item.connectionType || '',
        item.newSerialNumber || '',
        item.reason || '',
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const stringField = String(field ?? '');

              return `"${stringField.replace(/"/g, '""')}"`;
            })
            .join(',')
        ),
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });

      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);

      link.setAttribute(
        'download',
        `Usage_Replace_Report_${
          new Date().toISOString().split('T')[0]
        }.csv`
      );

      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating export:', err);

      showError('Error generating export file');
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
      totals.totalQty += parseFloat(item.qty || 0);
      totals.totalDamageQty += parseFloat(item.damageQty || 0);
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
        <span className="font-semibold">Error loading data:</span>{' '}
        {error}
      </div>
    );
  }

  const searchActive = Boolean(
    activeSearch.product ||
      activeSearch.center ||
      activeSearch.startDate ||
      activeSearch.endDate
  );

  return (
    <div className="min-w-0 bg-[#f4f5f7] p-4">
      {/* TITLE */}

      <div className="mb-[26px] text-[24px] font-[450] leading-[30px] text-[#212529]">
        Usage Replace Report
      </div>

      {/* SEARCH MODAL */}

      <CommonSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
      />

      {/* MAIN CARD */}

      <div className="mt-0 min-w-0 overflow-hidden rounded-[3px] border-t-[4px] border-t-[#2f5fa7] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        {/* CARD HEADER */}

        <div className="flex flex-col gap-2 border-b border-[#dee2e6] bg-white px-[16px] py-[8px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-[5px]">
            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex h-[34px] items-center justify-center gap-[5px] rounded-[3px] border border-[#2f5fa7] bg-[#2f5fa7] px-[10px] text-[14px] font-normal text-white transition-colors hover:border-[#254d89] hover:bg-[#254d89]"
            >
              <Search size={15} />
              Search
            </button>

            {searchActive && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex h-[34px] items-center justify-center gap-[5px] rounded-[3px] border border-[#6c757d] bg-[#6c757d] px-[10px] text-[14px] font-normal text-white transition-colors hover:border-[#5c636a] hover:bg-[#5c636a]"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={generateDetailExport}
              disabled={loading}
              className="inline-flex h-[34px] items-center justify-center gap-[5px] rounded-[3px] border border-[#2f5fa7] bg-[#2f5fa7] px-[10px] text-[14px] font-normal text-white transition-colors hover:border-[#254d89] hover:bg-[#254d89] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={14} />
              Export
            </button>
          </div>

          <div className="flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* SEARCH AREA */}

        <div className="flex flex-col gap-3 border-b border-[#dee2e6] bg-white px-[16px] py-[14px] sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[16px] font-medium text-[#212529]">
            Total Records: {filteredData.length}
          </div>

          <div className="flex items-center justify-end gap-[5px]">
            <label
              htmlFor="usageReplaceSearch"
              className="whitespace-nowrap text-[14px] font-medium text-[#212529]"
            >
              Search:
            </label>

            <input
              id="usageReplaceSearch"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-[30px] w-full rounded-none border border-[#ced4da] bg-white px-[8px] text-[14px] text-[#343a40] outline-none focus:border-[#86b7fe] focus:ring-[2px] focus:ring-[#0d6efd]/10 sm:w-[220px]"
            />
          </div>
        </div>

        {/* TABLE
            Fixed layout + explicit column widths prevent horizontal overflow.
            Cell content wraps inside its own column.
        */}

        <div className="w-full min-w-0 overflow-hidden px-[16px] pb-[16px] pt-[14px]">
          <table className="w-full table-fixed border-collapse border border-[#e5e7eb] text-left text-[14px] text-[#111827]">
            <colgroup>
              <col style={{ width: '6%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '4%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '6%' }} />
              <col style={{ width: '6%' }} />
              <col style={{ width: '11%' }} />
            </colgroup>

            <thead>
              <tr className="bg-white">
                <SortableHeader
                  label="Date"
                  onClick={() => handleSort('date')}
                  icon={getSortIcon('date')}
                />

                <SortableHeader
                  label="Type"
                  onClick={() => handleSort('usageType')}
                  icon={getSortIcon('usageType')}
                />

                <SortableHeader
                  label="Branch"
                  onClick={() => handleSort('center.centerName')}
                  icon={getSortIcon('center.centerName')}
                />

                <SortableHeader
                  label="Product"
                  onClick={() => handleSort('product.productTitle')}
                  icon={getSortIcon('product.productTitle')}
                />

                <SortableHeader
                  label="Product Type"
                  onClick={() => handleSort('replaceProductName')}
                  icon={getSortIcon('replaceProductName')}
                />

                <SortableHeader
                  label="Qty"
                  onClick={() => handleSort('qty')}
                  icon={getSortIcon('qty')}
                />

                <SortableHeader
                  label="Damage Qty"
                  onClick={() => handleSort('damageQty')}
                  icon={getSortIcon('damageQty')}
                />

                <SortableHeader
                  label="User/Building"
                  onClick={() => handleSort('buildingName')}
                  icon={getSortIcon('buildingName')}
                />

                <SortableHeader
                  label="Mobile"
                  onClick={() => handleSort('mobile')}
                  icon={getSortIcon('mobile')}
                />

                <SortableHeader
                  label="Status"
                  onClick={() => handleSort('connectionType')}
                  icon={getSortIcon('connectionType')}
                />

                <SortableHeader
                  label="Reason"
                  onClick={() => handleSort('reason')}
                  icon={getSortIcon('reason')}
                />
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                <>
                  {filteredData.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`border-b border-[#e5e7eb] transition-colors hover:bg-[#f7f8fa] ${
                        index % 2 === 0
                          ? 'bg-[#f1f2f2]'
                          : 'bg-white'
                      }`}
                    >
                      <td className="break-words border-r border-[#e5e7eb] px-[8px] py-[10px] align-top">
                        {formatDate(item.date)}
                      </td>

                      <td className="break-words border-r border-[#e5e7eb] px-[8px] py-[10px] align-top">
                        {item.usageType || ''}
                      </td>

                      <td className="break-words border-r border-[#e5e7eb] px-[8px] py-[10px] align-top">
                        {item.center?.centerName || ''}
                      </td>

                      <td className="break-words border-r border-[#e5e7eb] px-[8px] py-[10px] align-top [overflow-wrap:anywhere]">
                        {item.product?.productTitle || ''}
                      </td>

                      <td className="break-words border-r border-[#e5e7eb] px-[8px] py-[10px] align-top [overflow-wrap:anywhere]">
                        {item.replaceProductName || ''}
                      </td>

                      <td className="break-words border-r border-[#e5e7eb] px-[6px] py-[10px] align-top">
                        {item.qty || 0}
                      </td>

                      <td className="break-words border-r border-[#e5e7eb] px-[6px] py-[10px] align-top">
                        {item.damageQty || 0}
                      </td>

                      <td className="break-words border-r border-[#e5e7eb] px-[8px] py-[10px] align-top [overflow-wrap:anywhere]">
                        <button
                          type="button"
                          className="border-0 bg-transparent p-0 text-left text-[#111827] hover:underline"
                        >
                          {item.buildingName || item.customerName || ''}
                        </button>
                      </td>

                      <td className="break-words border-r border-[#e5e7eb] px-[6px] py-[10px] align-top [overflow-wrap:anywhere]">
                        {item.mobile || ''}
                      </td>

                      <td className="break-words border-r border-[#e5e7eb] px-[6px] py-[10px] align-top">
                        {item.connectionType || ''}
                      </td>

                      <td className="break-words px-[8px] py-[10px] align-top [overflow-wrap:anywhere]">
                        {item.reason || ''}
                      </td>
                    </tr>
                  ))}

                  {/* TOTAL ROW */}

                  <tr className="bg-[#dff0d8] font-semibold text-[#212529]">
                    <td
                      colSpan={5}
                      className="border-r border-white px-[8px] py-[10px]"
                    >
                      Total Count
                    </td>

                    <td className="border-r border-white px-[6px] py-[10px]">
                      {totals.totalQty}
                    </td>

                    <td className="border-r border-white px-[6px] py-[10px]">
                      {totals.totalDamageQty}
                    </td>

                    <td colSpan={4} className="px-[8px] py-[10px]" />
                  </tr>
                </>
              ) : (
                <tr>
                  <td
                    colSpan={11}
                    className="border-b border-[#e5e7eb] px-4 py-10 text-center text-[14px] text-[#6c757d]"
                  >
                    No replacement records found
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

const SortableHeader = ({ label, onClick, icon }) => (
  <th
    onClick={onClick}
    className="cursor-pointer border border-[#e5e7eb] px-[7px] py-[10px] text-left align-bottom text-[14px] font-semibold leading-[20px] text-[#111827] transition-colors hover:bg-[#f8f9fa]"
  >
    <div className="flex min-w-0 items-end gap-[3px]">
      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
        {label}
      </span>

      {icon && (
        <span className="shrink-0 pb-[2px]">
          {icon}
        </span>
      )}
    </div>
  </th>
);

export default UsageReplace;