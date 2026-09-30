import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import axiosInstance from "../../../axiosInstance";
import {
  confirmDelete,
  showError,
  showSuccess,
} from '../../../utils/sweetAlerts'
import Pagination from "../../../utils/Pagination";

const ResellerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [activeSearch, setActiveSearch] =
    useState({
      keyword: "",
      center: "",
    });

  const [dropdownOpen, setDropdownOpen] =
    useState({});

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const dropdownRefs = useRef({});
  const navigate = useNavigate();

  // --------------------------------------------------
  // Fetch Resellers
  // --------------------------------------------------
  const fetchData = async (
    searchParams = {},
    page = 1,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params =
        new URLSearchParams();

      if (searchParams.keyword) {
        params.append(
          "search",
          searchParams.keyword,
        );
      }

      params.append("page", page);

      const url = params.toString()
        ? `/resellers?${params.toString()}`
        : "/resellers";

      const response =
        await axiosInstance.get(url);

      if (response.data?.success) {
        setCustomers(
          response.data.data || [],
        );

        setCurrentPage(
          response.data.pagination
            ?.currentPage || 1,
        );

        setTotalPages(
          response.data.pagination
            ?.totalPages || 1,
        );
      } else {
        const errorMessage =
          response.data?.message ||
          "API returned unsuccessful response";

        setError(errorMessage);

        console.error(
          "Backend error:",
          response.data,
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
          "Error response:",
          err.response.data,
        );
      } else if (err.request) {
        setError(
          "No response received from server. Please check your network connection.",
        );

        console.error(
          "Error request:",
          err.request,
        );
      } else {
        setError(
          err.message ||
            "An error occurred while fetching data",
        );

        console.error(
          "Error message:",
          err.message,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Initial Load
  // --------------------------------------------------
  useEffect(() => {
    fetchData();
  }, []);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------
  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    fetchData(
      activeSearch,
      page,
    );
  };

  // --------------------------------------------------
  // Sorting
  // --------------------------------------------------
  const handleSort = (key) => {
    let direction = "ascending";

    if (
      sortConfig.key === key &&
      sortConfig.direction ===
        "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({
      key,
      direction,
    });

    const sortedCustomers = [
      ...customers,
    ].sort((a, b) => {
      let aValue = a;
      let bValue = b;

      if (key.includes(".")) {
        const keys = key.split(".");

        aValue = keys.reduce(
          (obj, currentKey) =>
            obj && obj[currentKey],
          a,
        );

        bValue = keys.reduce(
          (obj, currentKey) =>
            obj && obj[currentKey],
          b,
        );
      } else {
        aValue = a[key];
        bValue = b[key];
      }

      if (
        aValue === null ||
        aValue === undefined
      ) {
        aValue = "";
      }

      if (
        bValue === null ||
        bValue === undefined
      ) {
        bValue = "";
      }

      if (aValue < bValue) {
        return direction ===
          "ascending"
          ? -1
          : 1;
      }

      if (aValue > bValue) {
        return direction ===
          "ascending"
          ? 1
          : -1;
      }

      return 0;
    });

    setCustomers(sortedCustomers);
  };

  // --------------------------------------------------
  // Sort Icon
  // --------------------------------------------------
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction ===
      "ascending" ? (
      <ArrowUp
        size={14}
        className="ml-1 inline-block"
      />
    ) : (
      <ArrowDown
        size={14}
        className="ml-1 inline-block"
      />
    );
  };

  // --------------------------------------------------
  // Local Search
  // --------------------------------------------------
  const filteredCustomers =
    customers.filter((customer) =>
      Object.values(customer).some(
        (value) => {
          if (
            typeof value === "object" &&
            value !== null
          ) {
            return Object.values(
              value,
            ).some(
              (nestedValue) =>
                nestedValue &&
                nestedValue
                  .toString()
                  .toLowerCase()
                  .includes(
                    searchTerm.toLowerCase(),
                  ),
            );
          }

          return (
            value &&
            value
              .toString()
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase(),
              )
          );
        },
      ),
    );

  // --------------------------------------------------
  // Delete Reseller
  // --------------------------------------------------
  const handleDeleteVendor = async (
    vendorId,
  ) => {
    const result =
      await confirmDelete();

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axiosInstance.delete(
        `/resellers/${vendorId}`,
      );

      setCustomers((prev) =>
        prev.filter(
          (customer) =>
            customer._id !== vendorId,
        ),
      );

      showSuccess(
        "Data deleted successfully!",
      );
    } catch (error) {
      console.error(
        "Error deleting data:",
        error,
      );

      showError(error);
    }
  };

  // --------------------------------------------------
  // Edit Reseller
  // --------------------------------------------------
  const handleEditVendor = (
    vendorId,
  ) => {
    navigate(
      `/update-reseller/${vendorId}`,
    );
  };

  // --------------------------------------------------
  // Dropdown
  // --------------------------------------------------
  const toggleDropdown = (id) => {
    setDropdownOpen(
      (prev) => ({
        ...prev,
        [id]: !prev[id],
      }),
    );
  };

  // --------------------------------------------------
  // Close Dropdown Outside
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (
      event,
    ) => {
      const newDropdownState =
        {};
      let shouldUpdate = false;

      Object.keys(
        dropdownRefs.current,
      ).forEach((key) => {
        const element =
          dropdownRefs.current[key];

        if (
          element &&
          !element.contains(
            event.target,
          )
        ) {
          newDropdownState[key] =
            false;

          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        setDropdownOpen(
          (prev) => ({
            ...prev,
            ...newDropdownState,
          }),
        );
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-4 text-2xl font-semibold text-gray-800">
        Reseller List
      </div>

      {/* Main Card */}
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Add Button */}
          <div>
            <Link
              to="/add-reseller"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus size={16} />
              Add
            </Link>
          </div>

          {/* Pagination */}
          <div>
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
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Search */}
          <div className="mb-4 flex justify-end">
            <div className="flex w-full items-center justify-end gap-2">
              <label
                htmlFor="reseller-search"
                className="text-sm font-medium text-gray-700"
              >
                Search:
              </label>

              <input
                id="reseller-search"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value,
                  )
                }
                className="h-8 w-full max-w-[350px] border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <SortableHeader
                    label="Business Name"
                    sortKey="centerName"
                    onSort={
                      handleSort
                    }
                    getSortIcon={
                      getSortIcon
                    }
                  />

                  <SortableHeader
                    label="Contact"
                    sortKey="centerCode"
                    onSort={
                      handleSort
                    }
                    getSortIcon={
                      getSortIcon
                    }
                  />

                  <SortableHeader
                    label="Name"
                    sortKey="center.centerType"
                    onSort={
                      handleSort
                    }
                    getSortIcon={
                      getSortIcon
                    }
                  />

                  <SortableHeader
                    label="Mobile"
                    sortKey="mobile"
                    onSort={
                      handleSort
                    }
                    getSortIcon={
                      getSortIcon
                    }
                  />

                  <SortableHeader
                    label="Email"
                    sortKey="email"
                    onSort={
                      handleSort
                    }
                    getSortIcon={
                      getSortIcon
                    }
                  />

                  <SortableHeader
                    label="City"
                    sortKey="city"
                    onSort={
                      handleSort
                    }
                    getSortIcon={
                      getSortIcon
                    }
                  />

                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredCustomers.length >
                0 ? (
                  filteredCustomers.map(
                    (vendor) => (
                      <tr
                        key={
                          vendor._id
                        }
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {
                            vendor.businessName
                          }
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700">
                          {
                            vendor.contactNumber
                          }
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700">
                          {vendor.name ||
                            ""}
                        </td>

                        {/* Preserved from original source */}
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {
                            vendor.contactNumber
                          }
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700">
                          {
                            vendor.email
                          }
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700">
                          {vendor.city}
                        </td>

                        {/* Action */}
                        <td className="relative px-4 py-3">
                          <div
                            className="relative"
                            ref={(
                              element,
                            ) => {
                              dropdownRefs.current[
                                vendor._id
                              ] =
                                element;
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleDropdown(
                                  vendor._id,
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                              <Settings
                                size={15}
                              />
                              Options
                              <MoreVertical
                                size={14}
                              />
                            </button>

                            {dropdownOpen[
                              vendor._id
                            ] && (
                              <div className="absolute right-0 z-20 mt-1 w-32 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditVendor(
                                      vendor._id,
                                    )
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Pencil
                                    size={15}
                                  />
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteVendor(
                                      vendor._id,
                                    )
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2
                                    size={15}
                                  />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-sm text-gray-500"
                    >
                      No reseller found
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

// --------------------------------------------------
// Sortable Header
// --------------------------------------------------
const SortableHeader = ({
  label,
  sortKey,
  onSort,
  getSortIcon,
}) => {
  return (
    <th
      scope="col"
      onClick={() =>
        onSort(sortKey)
      }
      className="cursor-pointer whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 hover:bg-gray-100"
    >
      {label}
      {getSortIcon(sortKey)}
    </th>
  );
};

export default ResellerList;