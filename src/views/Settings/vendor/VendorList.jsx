import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../../../axiosInstance";
import { confirmDelete, showSuccess } from '../../../utils/sweetAlerts'
import SearchVendorModel from "./SearchVendorModel";
import Pagination from "../../../utils/Pagination";

const VendorList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [searchModalVisible, setSearchModalVisible] =
    useState(false);

  const [activeSearch, setActiveSearch] = useState({
    keyword: "",
    center: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dropdownRefs = useRef({});

  const navigate = useNavigate();

  // =========================
  // Fetch Vendors
  // =========================
  const fetchVendors = async (
    searchParams = {},
    page = 1,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchParams.keyword) {
        params.append(
          "search",
          searchParams.keyword,
        );
      }

      params.append("page", page);

      const url = params.toString()
        ? `/vendor?${params.toString()}`
        : "/vendor";

      const response =
        await axiosInstance.get(url);

      if (response.data.success) {
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
          response.data.message ||
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

  useEffect(() => {
    fetchVendors();
  }, []);

  // =========================
  // Pagination
  // =========================
  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    fetchVendors(
      activeSearch,
      page,
    );
  };

  // =========================
  // Sorting
  // =========================
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

    const sortedCustomers =
      [...customers].sort(
        (a, b) => {
          let aValue = a;
          let bValue = b;

          if (key.includes(".")) {
            const keys = key.split(".");

            aValue = keys.reduce(
              (obj, k) =>
                obj && obj[k],
              a,
            );

            bValue = keys.reduce(
              (obj, k) =>
                obj && obj[k],
              b,
            );
          } else {
            aValue = a[key];
            bValue = b[key];
          }

          if (
            aValue < bValue
          ) {
            return direction ===
              "ascending"
              ? -1
              : 1;
          }

          if (
            aValue > bValue
          ) {
            return direction ===
              "ascending"
              ? 1
              : -1;
          }

          return 0;
        },
      );

    setCustomers(
      sortedCustomers,
    );
  };

  const getSortIcon = (key) => {
    if (
      sortConfig.key !== key
    ) {
      return null;
    }

    return sortConfig.direction ===
      "ascending" ? (
      <ChevronUp
        size={15}
        className="inline-block"
      />
    ) : (
      <ChevronDown
        size={15}
        className="inline-block"
      />
    );
  };

  // =========================
  // Advanced Search
  // =========================
  const handleSearch = (
    searchData,
  ) => {
    setActiveSearch(
      searchData,
    );

    fetchVendors(
      searchData,
      1,
    );
  };

  const handleResetSearch =
    () => {
      const resetData = {
        keyword: "",
      };

      setActiveSearch(
        resetData,
      );

      setSearchTerm("");

      fetchVendors(
        {},
        1,
      );
    };

  // =========================
  // Local Search
  // =========================
  const filteredCustomers =
    customers.filter(
      (customer) =>
        Object.values(
          customer,
        ).some((value) => {
          if (
            typeof value ===
              "object" &&
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
                    searchTerm
                      .toLowerCase(),
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
        }),
    );

  // =========================
  // Delete Vendor
  // =========================
  const handleDeleteVendor =
    async (vendorId) => {
      const result =
        await confirmDelete();

      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(
            `/vendor/${vendorId}`,
          );

          setCustomers(
            (prev) =>
              prev.filter(
                (vendor) =>
                  vendor._id !==
                  vendorId,
              ),
          );

          showSuccess(
            "Vendor deleted successfully!",
          );
        } catch (error) {
          console.error(
            "Error deleting vendor:",
            error,
          );
        }
      }
    };

  // =========================
  // Edit Vendor
  // =========================
  const handleEditVendor =
    (vendorId) => {
      navigate(
        `/edit-vendor/${vendorId}`,
      );
    };

  // =========================
  // Dropdown
  // =========================
  const toggleDropdown = (
    id,
  ) => {
    setDropdownOpen(
      (prev) => ({
        ...prev,
        [id]: !prev[id],
      }),
    );
  };

  // =========================
  // Click Outside Dropdown
  // =========================
  useEffect(() => {
    const handleClickOutside =
      (event) => {
        const newDropdownState =
          {};

        let shouldUpdate = false;

        Object.keys(
          dropdownRefs.current,
        ).forEach((key) => {
          const element =
            dropdownRefs.current[
              key
            ];

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

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <div
        className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-4 text-xl font-semibold text-gray-800">
        Vendor List
      </div>

      {/* Search Modal */}
      <SearchVendorModel
        visible={
          searchModalVisible
        }
        onClose={() =>
          setSearchModalVisible(
            false,
          )
        }
        onSearch={handleSearch}
      />

      {/* Main Card */}
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/add-vendor">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Plus size={15} />
                Add
              </button>
            </Link>

            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(
                  true,
                )
              }
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Search size={15} />
              Search
            </button>

            {(
              activeSearch.keyword ||
              activeSearch.center
            ) && (
              <button
                type="button"
                onClick={
                  handleResetSearch
                }
                className="inline-flex items-center gap-1.5 rounded-md bg-gray-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                <RotateCcw
                  size={15}
                />
                Reset Search
              </button>
            )}
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

        {/* Card Body */}
        <div className="p-4">
          {/* Local Search */}
          <div className="mb-4 flex justify-end">
            <div className="flex items-center gap-2">
              <label
                htmlFor="vendor-search"
                className="text-sm font-medium text-gray-700"
              >
                Search:
              </label>

              <input
                id="vendor-search"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value,
                  )
                }
                className="h-8 w-full max-w-[350px] rounded-none border border-gray-300 px-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th
                    onClick={() =>
                      handleSort(
                        "centerName",
                      )
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-200"
                  >
                    <span className="inline-flex items-center gap-1">
                      Business Name
                      {getSortIcon(
                        "centerName",
                      )}
                    </span>
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        "centerCode",
                      )
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-200"
                  >
                    <span className="inline-flex items-center gap-1">
                      Contact
                      {getSortIcon(
                        "centerCode",
                      )}
                    </span>
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        "center.centerType",
                      )
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-200"
                  >
                    <span className="inline-flex items-center gap-1">
                      Name
                      {getSortIcon(
                        "center.centerType",
                      )}
                    </span>
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        "mobile",
                      )
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-200"
                  >
                    <span className="inline-flex items-center gap-1">
                      Mobile
                      {getSortIcon(
                        "mobile",
                      )}
                    </span>
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        "email",
                      )
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-200"
                  >
                    <span className="inline-flex items-center gap-1">
                      Email
                      {getSortIcon(
                        "email",
                      )}
                    </span>
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        "city",
                      )
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-200"
                  >
                    <span className="inline-flex items-center gap-1">
                      City
                      {getSortIcon(
                        "city",
                      )}
                    </span>
                  </th>

                  <th className="whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.length >
                0 ? (
                  filteredCustomers.map(
                    (vendor) => (
                      <tr
                        key={
                          vendor._id
                        }
                        className="transition hover:bg-gray-50"
                      >
                        <td className="border border-gray-200 px-4 py-3 text-gray-700">
                          {
                            vendor.businessName
                          }
                        </td>

                        <td className="border border-gray-200 px-4 py-3 text-gray-700">
                          {
                            vendor.contactNumber
                          }
                        </td>

                        <td className="border border-gray-200 px-4 py-3 text-gray-700">
                          {vendor.name ||
                            "N/A"}
                        </td>

                        <td className="border border-gray-200 px-4 py-3 text-gray-700">
                          {
                            vendor.mobile
                          }
                        </td>

                        <td className="border border-gray-200 px-4 py-3 text-gray-700">
                          {
                            vendor.email
                          }
                        </td>

                        <td className="border border-gray-200 px-4 py-3 text-gray-700">
                          {vendor.city}
                        </td>

                        <td className="relative border border-gray-200 px-4 py-3">
                          <div
                            ref={(el) => {
                              dropdownRefs.current[
                                vendor._id
                              ] = el;
                            }}
                            className="relative"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleDropdown(
                                  vendor._id,
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                            >
                              <Settings
                                size={
                                  15
                                }
                              />
                              Options
                              <MoreHorizontal
                                size={
                                  14
                                }
                              />
                            </button>

                            {dropdownOpen[
                              vendor._id
                            ] && (
                              <div className="absolute right-0 z-50 mt-1 w-36 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditVendor(
                                      vendor._id,
                                    )
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                                >
                                  <Pencil
                                    size={
                                      15
                                    }
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
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                                >
                                  <Trash2
                                    size={
                                      15
                                    }
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
                      className="border border-gray-200 px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No vendor found
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

export default VendorList;