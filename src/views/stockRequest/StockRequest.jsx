

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Download,
  FilePlus2,
  MoreVertical,
  Pencil,
  RotateCcw,
  Search,
  Settings,
  Trash2,
  X,
} from 'lucide-react';
import axiosInstance from '../../axiosInstance';
import { confirmDelete, showError, showSuccess } from '../../utils/sweetAlerts';
import SearchStockModel from './SearchStockModel';
import Pagination from '../../utils/Pagination';
import { formatDate, formatDateTime } from '../../utils/FormatDateTime';
import usePermission from '../../utils/usePermission';
import {
    Link,
  useNavigate,
  useLocation,
} from "react-router-dom";


const StockRequest = () => {
  const [customers, setCustomers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [resellers,setResellers] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const location = useLocation();
  const [activeSearch, setActiveSearch] = useState({ 
    keyword: '', 
    center: location.state?.centerFilter || '', // Get center filter from navigation state
    outlet: '',
    status: '',
    startDate: '',
    endDate: '',
    indentStartDate: '',
    indentEndDate: '',
    product: location.state?.productFilter || ''
  });
  const [productName, setProductName] = useState(location.state?.productName || '');
  const [centerName, setCenterName] = useState(''); // State to store center name
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeTab, setActiveTab] = useState('open');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  
  const { hasPermission, hasAnyPermission,isSuperAdmin} = usePermission();
  
  const statusFilters = {
    open: ['Confirmed', 'Submitted', 'Shipped', 'Incompleted', 'Draft'],
    closed: ['Rejected', 'Completed']
  };

  const fetchData = async (searchParams = {}, tab = activeTab, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (!searchParams.status) {
        const statuses = statusFilters[tab];
        statuses.forEach(status => {
          params.append('status', status);
        });
      } else {
        params.append('status', searchParams.status);
      }
      if (searchParams.keyword) {
        params.append('orderNumber', searchParams.keyword);
      }
      if (searchParams.center) {
        params.append('center', searchParams.center);
      }
      if (searchParams.outlet) {
        params.append('outlet', searchParams.outlet);
      }
      if (searchParams.product) {
        params.append('product', searchParams.product);
      }
      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate);
      }
      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate);
      }
      if (searchParams.indentStartDate) {
        params.append('startDate', searchParams.indentStartDate);
      }
      if (searchParams.indentEndDate) {
        params.append('endDate', searchParams.indentEndDate);
      }
      if (searchParams.status) {
        params.append('statusChanged', searchParams.status);
      }
      params.append('page', page);
      
      const url = `/stockrequest?${params.toString()}`;
      console.log('API URL:', url);
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setCustomers(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers?centerType=Center');
      if (response.data.success) {
        setCenters(response.data.data);
        const outletCenters = response.data.data.filter(center => 
          center.centerType === 'Outlet' || center.centerType === 'outlet'
        );
        setOutlets(outletCenters);
        
        // If there's a center filter, find and set the center name
        if (location.state?.centerFilter) {
          const foundCenter = response.data.data.find(c => c._id === location.state.centerFilter);
          if (foundCenter) {
            setCenterName(foundCenter.centerName);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers');
      if (response.data.success) {
        setResellers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching resellers:', error);
    }
  };

  useEffect(() => {
    // If there's a product filter from navigation state, apply it
    if (location.state?.productFilter) {
      const initialSearch = {
        ...activeSearch,
        product: location.state.productFilter,
        center: location.state.centerFilter || '' // Also apply center filter if present
      };
      setActiveSearch(initialSearch);
      setProductName(location.state?.productName || '');
      fetchData(initialSearch, activeTab, 1);
    } else if (location.state?.centerFilter) {
      // If only center filter is present
      const initialSearch = {
        ...activeSearch,
        center: location.state.centerFilter
      };
      setActiveSearch(initialSearch);
      fetchData(initialSearch, activeTab, 1);
    } else {
      fetchData(activeSearch, activeTab, 1);
    }
    fetchCenters();
    fetchResellers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center name when centers are loaded
  useEffect(() => {
    if (location.state?.centerFilter && centers.length > 0) {
      const foundCenter = centers.find(c => c._id === location.state.centerFilter);
      if (foundCenter) {
        setCenterName(foundCenter.centerName);
      }
    }
  }, [centers, location.state?.centerFilter]);
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, activeTab, page);
  };
  
  useEffect(() => {
    fetchData(activeSearch, activeTab);
  }, [activeTab]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedCustomers = [...customers].sort((a, b) => {
      let aValue = a;
      let bValue = b;
      
      if (key.includes('.')) {
        const keys = key.split('.');
        aValue = keys.reduce((obj, k) => obj && obj[k], a);
        bValue = keys.reduce((obj, k) => obj && obj[k], b);
      } else {
        aValue = a[key];
        bValue = b[key];
      }
      
      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setCustomers(sortedCustomers);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp size={14} className="ml-1 inline-block" />
    ) : (
      <ArrowDown size={14} className="ml-1 inline-block" />
    );
  };

  const handleSearch = (searchData) => {
    setActiveSearch(searchData);
    setProductName('');
    setCenterName('');
    fetchData(searchData, activeTab, 1);
  };

  const handleResetSearch = () => {
    const emptySearch = { 
      keyword: '', 
      center: '', 
      outlet: '',
      status: '',
      startDate: '',
      endDate: '',
      indentStartDate: '',
      indentEndDate: '',
      product: ''
    };
    setActiveSearch(emptySearch);
    setProductName('');
    setCenterName('');
    setSearchTerm('');
    // Clear the navigation state so refreshing/going back doesn't re-apply the filters
    navigate(location.pathname, { replace: true, state: {} });
    fetchData(emptySearch, activeTab, 1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Preserve the product and center filters when switching tabs
    const newSearch = {
      keyword: '',
      center: activeSearch.center, // Keep the center filter
      outlet: '',
      status: '',
      startDate: '',
      endDate: '',
      indentStartDate: '',
      indentEndDate: '',
      product: activeSearch.product // Keep the product filter
    };

    setActiveSearch(newSearch);
    setSearchTerm('');
    
    // Fetch data with the new tab and preserved filters
    fetchData(newSearch, tab, 1);
  };
  
  const handleClick = (itemId) => {
    navigate(`/stockRequest-profile/${itemId}`, {
      state: {
        productFilter: activeSearch.product,
        productName: productName,
        centerFilter: activeSearch.center,
        fromTransferReport: true,
        isProductDetailView: true,
        hideClearFilter: true
      }
    });
  };

  const filteredCustomers = customers.filter(customer => {
    if (activeSearch.keyword || activeSearch.center || activeSearch.status || activeSearch.outlet || activeSearch.product) {
      return true;
    }
    return Object.values(customer).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const handleDeleteData = async (customerId) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/stockrequest/${customerId}`);
        setCustomers((prev) => prev.filter((c) => c._id !== customerId));
        showSuccess('Indent Request deleted successfully!');
      } catch (error) {
        console.error('Error deleting indent:', error);
      }
    }
  };
  
  const generateDetailExport = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (activeSearch.keyword) {
        params.append('orderNumber', activeSearch.keyword);
      }
      if (activeSearch.center) {
        params.append('center', activeSearch.center);
      }
      if (activeSearch.outlet) {
        params.append('outlet', activeSearch.outlet);
      }
      if (activeSearch.status) {
        params.append('status', activeSearch.status);
      } else {
        const statuses = statusFilters[activeTab];
        statuses.forEach(status => {
          params.append('status', status);
        });
      }
      if (activeSearch.startDate) {
        params.append('startDate', activeSearch.startDate);
      }
      if (activeSearch.endDate) {
        params.append('endDate', activeSearch.endDate);
      }
      if (activeSearch.indentStartDate) {
        params.append('startDate', activeSearch.indentStartDate);
      }
      if (activeSearch.indentEndDate) {
        params.append('endDate', activeSearch.indentEndDate);
      }
      
      const exportUrl = `/stockrequest?${params.toString()}`;
      console.log('Export URL:', exportUrl);
      
      const response = await axiosInstance.get(exportUrl);
      
      if (!response.data.success || !response.data.data || response.data.data.length === 0) {
        showError('No data available for export with current filters');
        return;
      }

      const allData = response.data.data;
      
      const headers = [
        'Order Date',
        'Order Number', 
        'Status',
        'Center Title',
        'Approved At',
        'Shipped At',
        'Shipped Date',
        'Reject At',
        'Reject Remark',
        'Completed At',
        'Product Title',
        'Product Qty',
        'Approved Qty',
        'Approved Remark',
        'Received Qty',
        'Received Remark'
      ];

      const csvData = allData.flatMap(request => {
        if (!request.products || request.products.length === 0) {
          return [[
            formatDate(request.date),
            request.orderNumber,
            request.status,
            request.center?.centerName || 'N/A',
            request.approvalInfo?.approvedAt ? formatDateTime(request.approvalInfo.approvedAt) : '',
            request.shippingInfo?.shippedAt ? formatDateTime(request.shippingInfo.shippedAt) : '',
            request.shippingInfo?.shippedDate ? formatDate(request.shippingInfo.shippedDate) : '',
            request.completionInfo?.incompleteOn ? formatDateTime(request.completionInfo.incompleteOn) : '',
            '',
            request.completionInfo?.completedOn ? formatDateTime(request.completionInfo.completedOn) : '',
            'No Product',
            0,
            0,
            '',
            0,
            ''
          ]];
        }
  
        return request.products.map(product => [
          formatDate(request.date),
          request.orderNumber,
          request.status,
          request.center?.centerName || 'N/A',
          request.approvalInfo?.approvedAt ? formatDateTime(request.approvalInfo.approvedAt) : '',
          request.shippingInfo?.shippedAt ? formatDateTime(request.shippingInfo.shippedAt) : '',
          request.shippingInfo?.shippedDate ? formatDate(request.shippingInfo.shippedDate) : '',
          request.completionInfo?.incompleteOn ? formatDateTime(request.completionInfo.incompleteOn) : '',
          '',
          request.completionInfo?.completedOn ? formatDateTime(request.completionInfo.completedOn) : '',
          product.product?.productTitle || '',
          product.quantity || 0,
          product.approvedQuantity || 0,
          product.approvedRemark || '',
          product.receivedQuantity || 0,
          product.receivedRemark || ''
        ]);
      });
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(field => {
            const stringField = String(field || '');
            return `"${stringField.replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `indent_detail_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating export:', error);
      showError('Error generating export file');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditCustomer = (customerId) => {
    navigate(`/edit-stockRequest/${customerId}`)
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => {
      const isCurrentlyOpen = !!prev[id];
      const newState = {};
      if (!isCurrentlyOpen) {
        newState[id] = true;
      }
      return newState;
    });
  };

  // Clear center filter only
  const handleClearCenterFilter = () => {
    const newSearch = {
      ...activeSearch,
      center: ''
    };
    setActiveSearch(newSearch);
    setCenterName('');
    // Update navigation state to remove center filter
    navigate(location.pathname, { 
      replace: true, 
      state: { 
        productFilter: activeSearch.product,
        productName: productName
      } 
    });
    fetchData(newSearch, activeTab, 1);
  };

  // Clear product filter only
  const handleClearProductFilter = () => {
    const newSearch = {
      ...activeSearch,
      product: ''
    };
    setActiveSearch(newSearch);
    setProductName('');
    // Update navigation state to remove product filter
    navigate(location.pathname, { 
      replace: true, 
      state: { 
        centerFilter: activeSearch.center 
      } 
    });
    fetchData(newSearch, activeTab, 1);
  };
  const hasAdvancedSearch =
    !!(
      activeSearch.keyword ||
      activeSearch.center ||
      activeSearch.status ||
      activeSearch.outlet ||
      activeSearch.startDate ||
      activeSearch.endDate ||
      activeSearch.indentStartDate ||
      activeSearch.indentEndDate ||
      activeSearch.product
    );

  const renderTable = () => (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-[1050px] w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            {[
              ['Date', 'date'],
              ['Number', 'orderNumber'],
              ['From', 'warehouse.centerName'],
              ['Branch', 'center.centerName'],
              ['Posted By', 'createdBy.email'],
              ['Status', 'status'],
              ['Remarks', 'products[0].productRemark'],
            ].map(([label, key]) => (
              <th
                key={label}
                scope="col"
                onClick={() =>
                  handleSort(
                    label === 'From' ? 'warehouse.warehouseName' : key
                  )
                }
                className="cursor-pointer whitespace-nowrap border-b border-gray-200 px-4 py-3 transition hover:bg-gray-100"
              >
                <span className="inline-flex items-center">
                  {label}
                  {getSortIcon(
                    label === 'From' ? 'warehouse.warehouseName' : key
                  )}
                </span>
              </th>
            ))}

            <th className="whitespace-nowrap border-b border-gray-200 px-4 py-3">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((item) => (
              <tr
                key={item._id}
                className={`border-b border-gray-100 transition hover:bg-gray-50 ${
                  item.status === 'Submitted' ? 'bg-blue-50/40' : ''
                }`}
              >
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {formatDate(item.date)}
                </td>

                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleClick(item._id)}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {item.orderNumber}
                  </button>
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {item.warehouse?.centerName || ''}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {item.center?.centerName || 'N/A'}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {item.createdBy?.email || 'N/A'}
                  {item.createdAt &&
                    ` At ${new Date(item.createdAt).toLocaleTimeString(
                      'en-US',
                      {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      }
                    )}`}
                </td>

                <td className="px-4 py-3">
                  {item.status && (
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        item.status === 'Submitted'
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : item.status === 'Confirmed'
                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                            : item.status === 'Shipped'
                              ? 'border-amber-200 bg-amber-50 text-amber-700'
                              : item.status === 'Completed'
                                ? 'border-green-200 bg-green-50 text-green-700'
                                : item.status === 'Rejected'
                                  ? 'border-red-200 bg-red-50 text-red-700'
                                  : item.status === 'Incompleted'
                                    ? 'border-orange-200 bg-orange-50 text-orange-700'
                                    : 'border-gray-200 bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </td>

                <td className="max-w-[260px] px-4 py-3 text-gray-700">
                  {item.products?.[0]?.productRemark || ''}
                </td>

                <td className="px-4 py-3">
                  {['Shipped', 'Incompleted', 'Rejected'].includes(
                    item.status
                  ) ? null : (
                    <div
                      className="relative"
                      ref={(el) => {
                        dropdownRefs.current[item._id] = el;
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => toggleDropdown(item._id)}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                      >
                        <Settings size={14} />
                        Options
                        <MoreVertical size={13} />
                      </button>

                      {dropdownOpen[item._id] && (
                        <div className="absolute right-0 z-30 mt-1 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-xl">
                          {item.status === 'Submitted' &&
                            hasPermission('Indent', 'manage_indent') && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleEditCustomer(item._id)
                                }
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                              >
                                <Pencil size={15} />
                                Edit
                              </button>
                            )}

                          {hasAnyPermission('Indent', [
                            'delete_indent_own_center',
                            'delete_indent_all_center',
                          ]) && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteData(item._id)
                              }
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-12 text-center text-sm text-gray-500"
              >
                No {activeTab} stock requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-800">
          Stock Request List
        </h1>
      </div>

      <SearchStockModel
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        outlets={outlets}
        resellers={resellers}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {hasPermission('Indent', 'manage_indent') && (
              <Link
                to="/add-stockRequest"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <FilePlus2 size={16} />
                Add
              </Link>
            )}

            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Search size={16} />
              Search
            </button>

            {hasAdvancedSearch && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <RotateCcw size={16} />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={generateDetailExport}
              disabled={customers.length === 0}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Detail Export
            </button>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        <div className="p-5">
          {/* Tabs */}
          <div className="mb-5 flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => handleTabChange('open')}
              className={`relative px-5 py-3 text-sm font-medium transition ${
                activeTab === 'open'
                  ? 'text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Open
              {activeTab === 'open' && (
                <span className="absolute inset-x-0 bottom-0 h-1 rounded-t bg-blue-600" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('closed')}
              className={`relative px-5 py-3 text-sm font-medium transition ${
                activeTab === 'closed'
                  ? 'text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Closed
              {activeTab === 'closed' && (
                <span className="absolute inset-x-0 bottom-0 h-1 rounded-t bg-blue-600" />
              )}
            </button>
          </div>

          {/* Active navigation filters */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {activeSearch.product && (
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  Product: {productName || 'Selected product'}
                  <button
                    type="button"
                    onClick={handleClearProductFilter}
                    className="rounded-full p-0.5 text-red-500 transition hover:bg-red-100 hover:text-red-700"
                    aria-label="Clear product filter"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {activeSearch.center && centerName && (
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  Center: {centerName}
                  <button
                    type="button"
                    onClick={handleClearCenterFilter}
                    className="rounded-full p-0.5 text-red-500 transition hover:bg-red-100 hover:text-red-700"
                    aria-label="Clear center filter"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="stock-request-search"
                className="whitespace-nowrap text-sm font-medium text-gray-600"
              >
                Search:
              </label>

              <input
                id="stock-request-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={hasAdvancedSearch}
                placeholder={
                  hasAdvancedSearch
                    ? 'Disabled during advanced search'
                    : ''
                }
                className="h-9 w-full max-w-[350px] rounded-md border border-gray-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
          </div>

          {activeTab === 'open' && renderTable()}
          {activeTab === 'closed' && renderTable()}
        </div>
      </div>
    </div>
  );
};

export default StockRequest;
