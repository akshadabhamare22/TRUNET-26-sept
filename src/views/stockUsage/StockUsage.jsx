import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Download,
  FilePlus2,
  MoreVertical,
  RotateCcw,
  Search,
  Settings,
  X,
  Ban,
} from "lucide-react";

import axiosInstance from "../../axiosInstance";import { showError, showSuccess, confirmAction } from "../../utils/sweetAlerts";
import SearchStockUsage from "./SearchStockUsage";
import { formatDate, formatDateTime } from "../../utils/FormatDateTime";
import Pagination from "../../utils/Pagination";
import usePermission from "../../utils/usePermission";

const StockUsage = () => {
  const [customers, setCustomers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ keyword: '', center: '', usageType: '' });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  const { hasPermission, hasAnyPermission } = usePermission();

  const fetchData = async (searchParams = {}, tab = activeTab, page = 1) => {
    try {
      setLoading(true);
      setError(null); 
      if (tab === 'pending') {
        const params = new URLSearchParams();
        params.append('page', page);
        if (searchParams.keyword) {
          params.append('search', searchParams.keyword);
        }
        if (searchParams.center) {
          params.append('center', searchParams.center);
        }
        
        const url = params.toString() ? `/damage?${params.toString()}` : '/damage';
        console.log('Fetching Damage Return URL:', url);
        
        const response = await axiosInstance.get(url);
        
        if (response.data.success) {
          setCustomers(response.data.data);
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
        } else {
          throw new Error(response.data.message || 'API returned unsuccessful response');
        }
      } else {
        const params = new URLSearchParams();
        if (searchParams.keyword) {
          params.append('search', searchParams.keyword);
        }
        if (searchParams.center) {
          params.append('center', searchParams.center);
        }
        if (searchParams.usageType) {
          params.append('usageType', searchParams.usageType);
        }
        if (searchParams.startDate) {
          params.append('startDate', searchParams.startDate);
        }
        if (searchParams.endDate) {
          params.append('endDate', searchParams.endDate);
        }

        params.append('page', page);
        const url = params.toString() ? `/stockusage?${params.toString()}` : '/stockusage';
        console.log('Fetching All Data URL:', url);
        
        const response = await axiosInstance.get(url);
        
        if (response.data.success) {
          setCustomers(response.data.data);
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      }
    } catch (err) {
    if (err.response) {
      if (err.response.data) {

        if (err.response.data.success === false && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.response.data.message || err.response.statusText);
        }
      } else {
        setError(`Error: ${err.response.status} ${err.response.statusText}`);
      }
    } else if (err.request) {
      setError('No response from server. Please check your network connection.');
    } else {
      setError(err.message);
    }
    console.error('Error fetching data:', err);

    setCustomers([]);
    setCurrentPage(1);
    setTotalPages(1);
  } finally {
    setLoading(false);
  }
  };

  const fetchDataForExport = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'pending') {
        const params = new URLSearchParams();
        if (activeSearch.keyword) {
          params.append('search', activeSearch.keyword);
        }
        if (activeSearch.center) {
          params.append('center', activeSearch.center);
        }

        const url = params.toString() ? `/damage?${params.toString()}` : '/damage';
        
        const response = await axiosInstance.get(url);
        return response.data.success ? response.data.data : [];
      } else {
        const params = new URLSearchParams();
        if (activeSearch.keyword) {
          params.append('search', activeSearch.keyword);
        }
        if (activeSearch.center) {
          params.append('center', activeSearch.center);
        }
        if (activeSearch.usageType) {
          params.append('usageType', activeSearch.usageType);
        }
        if (activeSearch.startDate) {
          params.append('startDate', activeSearch.startDate);
        }
        if (activeSearch.endDate) {
          params.append('endDate', activeSearch.endDate);
        }
        const url = params.toString() ? `/stockusage?${params.toString()}` : '/stockusage';
        
        const response = await axiosInstance.get(url);
        return response.data.success ? response.data.data : [];
      }
    } catch (err) {
      console.error('Error fetching data for export:', err);
      showError('Error fetching data for export');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers?centerType=Center');
      if (response.data.success) {
        setCenters(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCenters();
  }, []);

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
    if (sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction === "ascending" ? (
      <ArrowUp size={14} className="ml-1 inline-block" />
    ) : (
      <ArrowDown size={14} className="ml-1 inline-block" />
    );
  };

  const handleSearch = (searchData) => {
    setActiveSearch(searchData);
    fetchData(searchData, activeTab, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ keyword: '', center: '', usageType: '', startDate: '', endDate: '' });
    setSearchTerm('');
    fetchData({}, activeTab, 1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveSearch({ keyword: '', center: '', usageType: '', startDate: '', endDate: '' });
    setSearchTerm('');
  };
  
  const handleClick = (itemId) => {
    navigate(`/edit-stockUsage/${itemId}`);
  };

  const filteredCustomers = customers.filter(customer => {
    if (activeSearch.keyword || activeSearch.center || activeSearch.usageType || activeSearch.startDate || activeSearch.endDate) {
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

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {};
      let shouldUpdate = false;
      
      Object.keys(dropdownRefs.current).forEach(key => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          newDropdownState[key] = false;
          shouldUpdate = true;
        }
      });
      
      if (shouldUpdate) {
        setDropdownOpen(prev => ({ ...prev, ...newDropdownState }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const generateDetailExport = async () => {
    try {
      setLoading(true);
    
      const allData = await fetchDataForExport();
      
      if (!allData || allData.length === 0) {
        showError('No data available for export');
        return;
      }
  
      const headers = [
        'Date',
        'Type', 
        'Center',
        'Remark',
        'Detail',
        'Status',
        'Created At'
      ];
  
      const csvData = allData.flatMap(request => {
        let detail = '';
        
        switch(request.usageType) {
          case 'Customer':
            detail = `User: ${request.customer?.username || 'N/A'}, Mobile: ${request.customer?.mobile || ''}, Package: ${request.packageAmount || 'N/A'}/-, Type: ${request.connectionType || 'N/A'}, Reason: ${request.reason || 'N/A'}`;
            break;
          case 'Building':
            detail = `Building: ${request.fromBuilding?.buildingName || 'N/A'}`;
            break;
          case 'Building to Building':
            detail = `From: ${request.fromBuilding?.buildingName || 'N/A'} → To: ${request.toBuilding?.buildingName || 'N/A'}`;
            break;
          case 'Control Room':
            detail = `Control Room: ${request.fromControlRoom?.buildingName || 'N/A'}`; 
            break;
          case 'Damage':
            detail = `${request.damageReason || 'N/A'}`;
  if (request.status === 'cancelled') {
    detail += ` [REVERTED: ${request.revertRemark || 'No reason provided'}]`;
  }
  break;
          case 'Damage Return':
            detail = `Returned from: ${request.originalUsageType || 'N/A'}`;
            break;
          case 'Stolen from Field':
            detail = `Stolen From: ${request.stolenFrom || 'N/A'}`;
            break;
          case 'Stolen from Center':
            detail = `Stolen From Center: ${request.center?.centerName || 'N/A'}`;
            break;
          case 'Other':
            detail = `Address: ${request.address || 'N/A'}`;
            break;
          default:
            detail = 'N/A';
        }

        if (request.items && request.items.length > 0) {
          return request.items.map(item => [
            formatDate(request.date),
            activeTab === 'pending' ? 'Damage Return' : request.usageType,
            request.center?.centerName || 'N/A',
            request.remark || '',
            detail,
            request.status,
            formatDateTime(request.createdAt)
          ]);
        } else {
          return [[
            formatDate(request.date),
            activeTab === 'pending' ? 'Damage Return' : request.usageType,
            request.center?.centerName || 'N/A',
            request.remark || '',
            detail,
            request.status,
            formatDateTime(request.createdAt)
          ]];
        }
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
      let filename = `stock_usage_${activeTab}_${new Date().toISOString().split('T')[0]}`;
      if (activeSearch.keyword) filename += `_search_${activeSearch.keyword}`;
      if (activeSearch.center) {
        const centerName = centers.find(c => c._id === activeSearch.center)?.centerName || 'center';
        filename += `_${centerName}`;
      }
      if (activeSearch.usageType) {
        filename += `_type_${activeSearch.usageType}`;
      }
      if (activeSearch.startDate || activeSearch.endDate) {
        filename += `_date_${activeSearch.startDate || 'start'}_to_${activeSearch.endDate || 'end'}`;
      }
      filename += '.csv';
      
      link.setAttribute('download', filename);
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

  const handleAcceptDamageReturn = async (itemId) => {
    const result = await confirmAction(
      'Accept Damage Return',
      'Are you sure you want to accept this damage return? This action cannot be undone.',
      'question',
      'Yes, Accept!'
    );
  
    if (result.isConfirmed) {
      try {
        const { value: remark } = await Swal.fire({
          title: 'Approval Remark',
          input: 'text',
          inputLabel: 'Enter approval remark (optional)',
          inputPlaceholder: 'Enter your remark here...',
          showCancelButton: true,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel'
        });
  
        if (remark !== undefined) {
          const response = await axiosInstance.patch(`/damage/${itemId}/approve`, {
            approvalRemark: remark || 'Damage request approved'
          });
          
          if (response.data.success) {
            showSuccess('Damage return accepted successfully!');
            fetchData(activeSearch, activeTab, currentPage);
          } else {
            throw new Error(response.data.message || 'Failed to accept damage return');
          }
        }
      } catch (error) {
        console.error('Error accepting damage return:', error);
        showError(error.response?.data?.message || error.message || 'Failed to accept damage return');
      }
    }
  };
  
  const handleRejectDamageReturn = async (itemId) => {
    const result = await confirmAction(
      'Reject Damage Return',
      'Are you sure you want to reject this damage return? This action cannot be undone.',
      'warning',
      'Yes, Reject!'
    );
  
    if (result.isConfirmed) {
      try {
        const { value: remark } = await Swal.fire({
          title: 'Rejection Remark',
          input: 'text',
          inputLabel: 'Enter rejection remark (optional)',
          inputPlaceholder: 'Enter your remark here...',
          showCancelButton: true,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel'
        });
  
        if (remark !== undefined) {
          const response = await axiosInstance.patch(`/damage/${itemId}/reject`, {
            rejectionRemark: remark || 'Damage request rejected'
          });
          
          if (response.data.success) {
            showSuccess('Damage return rejected successfully!');
            fetchData(activeSearch, activeTab, currentPage);
          } else {
            throw new Error(response.data.message || 'Failed to reject damage return');
          }
        }
      } catch (error) {
        console.error('Error rejecting damage return:', error);
        showError(error.response?.data?.message || error.message || 'Failed to reject damage return');
      }
    }
  };

  const renderTable = () => (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-[1050px] w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 text-left">
            {[
              ["Date", "date"],
              ["Type", "usageType"],
              ["Branch", "center.centerName"],
              ["Remark", "remark"],
              ["Detail", "customer.username"],
              ["Created At", "createdAt"],
            ].map(([label, key]) => (
              <th
                key={key}
                scope="col"
                onClick={() => handleSort(key)}
                className="cursor-pointer whitespace-nowrap border-b border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-100"
              >
                {label}
                {getSortIcon(key)}
              </th>
            ))}
            <th className="whitespace-nowrap border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <tr
                key={customer._id}
                className={`border-b border-gray-100 transition hover:bg-gray-50 ${
                  customer.type === "Damage Return" ? "bg-yellow-50" : ""
                } ${
                  customer.status === "cancelled"
                    ? "bg-red-50 text-red-900"
                    : ""
                }`}
              >
                <td className="whitespace-nowrap px-4 py-3 align-top">
                  <button
                    type="button"
                    onClick={() => handleClick(customer._id)}
                    className="border-0 bg-transparent p-0 text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {formatDate(customer.date)}
                  </button>
                </td>

                <td className="whitespace-nowrap px-4 py-3 align-top">
                  {activeTab === "pending"
                    ? "Damage Return"
                    : customer.usageType}
                </td>

                <td className="px-4 py-3 align-top">
                  {customer.center?.centerName || ""}
                </td>

                <td className="px-4 py-3 align-top">
                  {customer.remark || ""}
                </td>

                <td className="min-w-[280px] px-4 py-3 align-top text-gray-700">
                  {customer.usageType === "Customer" ? (
                    <>
                      <div>
                        User: {customer.customer?.username || "N/A"}
                      </div>
                      <div>
                        ({customer.customer?.mobile || ""})
                      </div>
                      <div>
                        Package: {customer.packageAmount || "N/A"}/-
                      </div>
                      <div>
                        Type: {customer.connectionType || "N/A"}
                      </div>
                      <div>
                        Reason: {customer.reason || "N/A"}
                      </div>
                    </>
                  ) : customer.usageType === "Building" ? (
                    `Building: ${
                      customer.fromBuilding?.buildingName || "N/A"
                    }`
                  ) : customer.usageType === "Building to Building" ? (
                    `From: ${
                      customer.fromBuilding?.buildingName || "N/A"
                    } → To: ${
                      customer.toBuilding?.buildingName || "N/A"
                    }`
                  ) : customer.usageType === "Control Room" ? (
                    `Control Room: ${
                      customer.controlRoom?.name || "N/A"
                    }`
                  ) : customer.usageType === "Damage" ? (
                    <div>
                      <div>{customer.damageReason || "N/A"}</div>

                      {customer.status === "cancelled" && (
                        <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-2.5 py-2 text-xs text-red-700">
                          <div className="flex items-start gap-1.5">
                            <Settings size={14} className="mt-0.5 shrink-0" />
                            <span>
                              <strong>Reverted:</strong>{" "}
                              {customer.revertRemark ||
                                "No reason provided"}
                            </span>
                          </div>

                          {customer.revertDate && (
                            <div className="mt-1 pl-5 text-gray-600">
                              on {formatDate(customer.revertDate)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : customer.usageType === "Damage Return" ? (
                    "Pending Damage Return"
                  ) : customer.usageType === "Stolen from Field" ? (
                    `Stolen From: ${customer.stolenFrom || "N/A"}`
                  ) : customer.usageType === "Stolen from Center" ? (
                    `Stolen From Center: ${
                      customer.center?.centerName || "N/A"
                    }`
                  ) : customer.usageType === "Other" ? (
                    `Address: ${customer.address || "N/A"}`
                  ) : (
                    "N/A"
                  )}
                </td>

                <td className="whitespace-nowrap px-4 py-3 align-top">
                  {formatDateTime(customer.createdAt)}
                </td>

                <td className="px-4 py-3 align-top">
                  {activeTab === "pending" &&
                    hasPermission("Usage", "accept_damage_return") && (
                      <div
                        className="relative"
                        ref={(el) => {
                          dropdownRefs.current[customer._id] = el;
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => toggleDropdown(customer._id)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                          <Settings size={14} />
                          Options
                          <MoreVertical size={14} />
                        </button>

                        {dropdownOpen[customer._id] && (
                          <div className="absolute right-0 z-40 mt-1 w-56 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-xl">
                            <button
                              type="button"
                              onClick={() =>
                                handleAcceptDamageReturn(customer._id)
                              }
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Check size={15} className="text-green-600" />
                              Accept Damage Return
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleRejectDamageReturn(customer._id)
                              }
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Ban size={15} className="text-red-600" />
                              Reject Damage Return
                            </button>
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
                colSpan={7}
                className="px-4 py-10 text-center text-sm text-gray-500"
              >
                No{" "}
                {activeTab === "pending" ? "damage return " : ""}
                stock usage records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const hasActiveFilters =
    activeSearch.keyword ||
    activeSearch.center ||
    activeSearch.usageType ||
    activeSearch.startDate ||
    activeSearch.endDate;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6 lg:mx-8">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
      <div className="mb-4 text-xl font-semibold text-gray-800">
        Stock Usage
      </div>

      <SearchStockUsage
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
      />

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Card header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {hasAnyPermission("Usage", [
              "manage_usage_own_center",
              "manage_usage_all_center",
            ]) && (
              <Link
                to="/add-stockUsage"
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <FilePlus2 size={16} />
                Add
              </Link>
            )}

            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Search size={16} />
              Search
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <RotateCcw size={16} />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={generateDetailExport}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
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

        {/* Tabs + content */}
        <div className="p-4">
          <div className="mb-4 flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => handleTabChange("all")}
              className={`border-b-4 px-5 py-2.5 text-sm font-medium transition ${
                activeTab === "all"
                  ? "border-blue-700 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("pending")}
              className={`border-b-4 px-5 py-2.5 text-sm font-medium transition ${
                activeTab === "pending"
                  ? "border-blue-700 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Pending
            </button>
          </div>

          <div className="mb-4 flex items-center justify-end gap-2">
            <label
              htmlFor="stock-usage-local-search"
              className="text-sm font-medium text-gray-700"
            >
              Search:
            </label>

            <input
              id="stock-usage-local-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={hasActiveFilters}
              className="h-8 w-full max-w-[350px] rounded-md border border-gray-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default StockUsage;
