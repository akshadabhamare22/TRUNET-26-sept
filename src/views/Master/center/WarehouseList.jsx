import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Pencil,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react';

import axiosInstance from '../../../axiosInstance';
import { confirmDelete, showSuccess } from '../../../utils/sweetAlerts';
import Pagination from '../../../utils/Pagination';
import usePermission from '../../../utils/usePermission';

const WarehouseList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dropdownRefs = useRef({});
  const { hasAnyPermission } = usePermission();
  const navigate = useNavigate();

  // --------------------------------------------------
  // Fetch Warehouses
  // --------------------------------------------------
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        '/centers?centerType=Outlet'
      );

      if (response.data.success) {
        setCustomers(response.data.data || []);

        setCurrentPage(
          response.data.pagination?.currentPage || 1
        );

        setTotalPages(
          response.data.pagination?.totalPages || 1
        );
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching centers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    fetchData(page);
  };

  // --------------------------------------------------
  // Sorting
  // --------------------------------------------------
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

    const sortedCustomers = [...customers].sort((a, b) => {
      let aValue = a;
      let bValue = b;

      if (key.includes('.')) {
        const keys = key.split('.');

        aValue = keys.reduce(
          (obj, k) => obj?.[k],
          a
        );

        bValue = keys.reduce(
          (obj, k) => obj?.[k],
          b
        );
      } else {
        aValue = a?.[key];
        bValue = b?.[key];
      }

      if (aValue === null || aValue === undefined) {
        aValue = '';
      }

      if (bValue === null || bValue === undefined) {
        bValue = '';
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }

      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
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

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp size={14} className="ml-1" />
    ) : (
      <ArrowDown size={14} className="ml-1" />
    );
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const filteredCustomers = customers.filter((customer) => {
    if (!searchTerm.trim()) {
      return true;
    }

    const search = searchTerm.toLowerCase();

    return Object.values(customer).some((value) => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(
          (nestedValue) =>
            nestedValue &&
            nestedValue
              .toString()
              .toLowerCase()
              .includes(search)
        );
      }

      return (
        value &&
        value
          .toString()
          .toLowerCase()
          .includes(search)
      );
    });
  });

  // --------------------------------------------------
  // Delete Warehouse
  // --------------------------------------------------
  const handleDeleteCenter = async (customerId) => {
    const result = await confirmDelete();

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(
          `/centers/${customerId}`
        );

        setCustomers((prev) =>
          prev.filter(
            (customer) => customer._id !== customerId
          )
        );

        showSuccess('Center deleted successfully!');
      } catch (error) {
        console.error(
          'Error deleting center:',
          error
        );
      }
    }
  };

  // --------------------------------------------------
  // Edit Warehouse
  // --------------------------------------------------
  const handleEditCustomer = (customerId) => {
    navigate(`/edit-center/${customerId}`);
  };

  // --------------------------------------------------
  // Dropdown
  // --------------------------------------------------
  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // --------------------------------------------------
  // Close Dropdown On Outside Click
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {};
      let shouldUpdate = false;

      Object.keys(dropdownRefs.current).forEach((key) => {
        const dropdownElement =
          dropdownRefs.current[key];

        if (
          dropdownElement &&
          !dropdownElement.contains(event.target)
        ) {
          newDropdownState[key] = false;
          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        setDropdownOpen((prev) => ({
          ...prev,
          ...newDropdownState,
        }));
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div
        className="mx-4 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        Error loading center: {error}
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-4 text-xl font-semibold text-gray-800">
        Warehouse List
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Add Button */}
          <div>
            {hasAnyPermission('Center', [
              'manage_own_center',
              'manage_all_center',
            ]) && (
              <Link to="/add-center">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  <Plus size={16} />
                  Add
                </button>
              </Link>
            )}
          </div>

          {/* Pagination */}
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Search */}
          <div className="mb-4 flex items-center justify-end gap-2">
            <label
              htmlFor="warehouse-search"
              className="text-sm font-medium text-gray-700"
            >
              Search:
            </label>

            <input
              id="warehouse-search"
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="h-8 w-full max-w-[350px] border border-gray-300 bg-white px-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1000px] w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {/* Warehouse Title */}
                  <th
                    onClick={() =>
                      handleSort('centerName')
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Warehouse Title
                      {getSortIcon('centerName')}
                    </div>
                  </th>

                  {/* Reseller */}
                  <th
                    onClick={() =>
                      handleSort(
                        'reseller.businessName'
                      )
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Reseller
                      {getSortIcon(
                        'reseller.businessName'
                      )}
                    </div>
                  </th>

                  {/* Warehouse Code */}
                  <th
                    onClick={() =>
                      handleSort('centerCode')
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Warehouse Code
                      {getSortIcon('centerCode')}
                    </div>
                  </th>

                  {/* Type */}
                  <th
                    onClick={() =>
                      handleSort('centerType')
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Type
                      {getSortIcon('centerType')}
                    </div>
                  </th>

                  {/* Email */}
                  <th
                    onClick={() =>
                      handleSort('email')
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Email
                      {getSortIcon('email')}
                    </div>
                  </th>

                  {/* Mobile */}
                  <th
                    onClick={() =>
                      handleSort('mobile')
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Mobile
                      {getSortIcon('mobile')}
                    </div>
                  </th>

                  {/* Address */}
                  <th
                    onClick={() =>
                      handleSort('addressLine1')
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Address
                      {getSortIcon('addressLine1')}
                    </div>
                  </th>

                  {/* Action */}
                  <th className="whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Warehouse Name */}
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {customer.centerName}
                      </td>

                      {/* Reseller */}
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {customer.reseller?.businessName ||
                          ''}
                      </td>

                      {/* Warehouse Code */}
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {customer.centerCode}
                      </td>

                      {/* Type */}
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {customer.centerType ===
                        'Outlet'
                          ? 'Warehouse'
                          : 'Center'}
                      </td>

                      {/* Email */}
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {customer.email}
                      </td>

                      {/* Mobile */}
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {customer.mobile}
                      </td>

                      {/* Address */}
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {customer.addressLine1}
                      </td>

                      {/* Actions */}
                      <td className="border border-gray-200 px-4 py-3">
                        {hasAnyPermission('Center', [
                          'manage_own_center',
                          'manage_all_center',
                        ]) && (
                          <div
                            className="relative inline-block"
                            ref={(element) => {
                              dropdownRefs.current[
                                customer._id
                              ] = element;
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleDropdown(
                                  customer._id
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <Settings size={15} />
                              Options
                              <ChevronDown
                                size={14}
                              />
                            </button>

                            {dropdownOpen[
                              customer._id
                            ] && (
                              <div className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                                {/* Edit */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditCustomer(
                                      customer._id
                                    )
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                                >
                                  <Pencil size={15} />
                                  Edit
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteCenter(
                                      customer._id
                                    )
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                                >
                                  <Trash2 size={15} />
                                  Delete
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
                      colSpan={9}
                      className="border border-gray-200 px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No center found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseList;