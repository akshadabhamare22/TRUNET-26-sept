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
} from "../../../utils/sweetAlerts";

import Pagination from "../../../utils/Pagination";

const ResellerList = () => {
  const [customers, setCustomers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [sortConfig, setSortConfig] =
    useState({
      key: null,
      direction: "ascending",
    });

  const [searchTerm, setSearchTerm] =
    useState("");

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

  const dropdownRefs =
    useRef({});

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
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* ==================================================
          PAGE TITLE
      ================================================== */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Reseller List
      </div>

      {/* ==================================================
          MAIN CARD
      ================================================== */}
      <div
        className="
          w-full
          overflow-hidden
          rounded-[2px]
          border
          border-[#e5e7eb]
          bg-white
          shadow-[0_1px_3px_rgba(0,0,0,0.05)]
        "
      >
        {/* ==================================================
            BLUE TOP BORDER
        ================================================== */}
        <div className="h-[4px] w-full bg-[#2f64ad]" />

        {/* ==================================================
            CARD TOOLBAR
        ================================================== */}
        <div
          className="
            flex
            min-h-[68px]
            items-center
            justify-between
            border-b
            border-[#e5e7eb]
            bg-white
            px-[17px]
            py-[10px]
          "
        >
          {/* Add */}
          <div>
            <Link
              to="/add-reseller"
              className="
                inline-flex
                h-[36px]
                items-center
                gap-[4px]
                rounded-[4px]
                bg-[#2f64ad]
                px-[10px]
                text-[16px]
                font-semibold
                text-white
                transition
                duration-150
                hover:bg-[#255596]
                focus:outline-none
              "
            >
              <Plus
                size={19}
                strokeWidth={2}
              />

              Add
            </Link>
          </div>

          {/* Pagination */}
          <div className="flex items-center">
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

        {/* ==================================================
            TABLE AREA
        ================================================== */}
        <div className="px-[17px] pb-[20px] pt-[16px]">
          {/* Search */}
          <div
            className="
              mb-[16px]
              flex
              items-center
              justify-end
            "
          >
            <div
              className="
                flex
                items-center
                gap-[6px]
              "
            >
              <label
                htmlFor="reseller-search"
                className="
                  whitespace-nowrap
                  text-[16px]
                  font-semibold
                  text-[#111827]
                "
              >
                Search:
              </label>

              <div className="relative">
                <Search
                  size={16}
                  strokeWidth={1.8}
                  className="
                    pointer-events-none
                    absolute
                    left-[9px]
                    top-1/2
                    -translate-y-1/2
                    text-[#777]
                  "
                />

                <input
                  id="reseller-search"
                  type="text"
                  value={
                    searchTerm
                  }
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value,
                    )
                  }
                  className="
                    h-[34px]
                    w-[235px]
                    rounded-[2px]
                    border
                    border-[#d5dbe3]
                    bg-white
                    pl-[31px]
                    pr-[10px]
                    text-[14px]
                    text-[#343a40]
                    outline-none
                    transition
                    focus:border-[#2f64ad]
                    focus:ring-1
                    focus:ring-[#2f64ad]/20
                  "
                />
              </div>
            </div>
          </div>

          {/* ==================================================
              TABLE - VERTICAL SCROLL ONLY
          ================================================== */}
          <div
            className="
              w-full
              overflow-x-hidden
              overflow-y-auto
              rounded-[2px]
              border
              border-[#e5e7eb]
            "
            style={{
              maxHeight: "500px",
            }}
          >
            <table
              className="
                w-full
                table-fixed
                border-collapse
                text-[16px]
              "
            >
              {/* ==================================================
                  TABLE HEADER
              ================================================== */}
              <thead
                className="
                  sticky
                  top-0
                  z-20
                  bg-white
                "
              >
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
                    className="w-[23%]"
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
                    className="w-[8.5%]"
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
                    className="w-[11.5%]"
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
                    className="w-[8.5%]"
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
                    className="w-[19%]"
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
                    className="w-[10%]"
                  />

                  <th
                    className="
                      w-[10.5%]
                      whitespace-nowrap
                      border
                      border-[#e5e7eb]
                      bg-white
                      px-[9px]
                      py-[11px]
                      text-left
                      text-[16px]
                      font-semibold
                      text-[#111827]
                    "
                  >
                    Action
                  </th>
                </tr>
              </thead>

              {/* ==================================================
                  TABLE BODY
              ================================================== */}
              <tbody>
                {filteredCustomers.length >
                0 ? (
                  filteredCustomers.map(
                    (
                      vendor,
                      index,
                    ) => (
                      <tr
                        key={
                          vendor._id
                        }
                        className={`
                          transition-colors
                          duration-100
                          ${
                            index %
                              2 ===
                            0
                              ? "bg-[#f1f1f1]"
                              : "bg-white"
                          }
                          hover:bg-[#e8eef7]
                        `}
                      >
                        {/* Business Name */}
                        <td
                          className="
                            overflow-hidden
                            border
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            align-middle
                            text-[16px]
                            leading-[22px]
                            text-[#111827]
                          "
                        >
                          <div className="break-words">
                            {
                              vendor.businessName
                            }
                          </div>
                        </td>

                        {/* Contact */}
                        <td
                          className="
                            overflow-hidden
                            border
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            align-middle
                            text-[16px]
                            leading-[22px]
                            text-[#111827]
                          "
                        >
                          <div className="truncate">
                            {
                              vendor.contactNumber
                            }
                          </div>
                        </td>

                        {/* Name */}
                        <td
                          className="
                            overflow-hidden
                            border
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            align-middle
                            text-[16px]
                            leading-[22px]
                            text-[#111827]
                          "
                        >
                          <div className="break-words">
                            {vendor.name ||
                              ""}
                          </div>
                        </td>

                        {/* Mobile */}
                        <td
                          className="
                            overflow-hidden
                            border
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            align-middle
                            text-[16px]
                            leading-[22px]
                            text-[#111827]
                          "
                        >
                          <div className="truncate">
                            {
                              vendor.contactNumber
                            }
                          </div>
                        </td>

                        {/* Email */}
                        <td
                          className="
                            overflow-hidden
                            border
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            align-middle
                            text-[16px]
                            leading-[22px]
                            text-[#111827]
                          "
                        >
                          <div className="truncate">
                            {
                              vendor.email
                            }
                          </div>
                        </td>

                        {/* City */}
                        <td
                          className="
                            overflow-hidden
                            border
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            align-middle
                            text-[16px]
                            leading-[22px]
                            text-[#111827]
                          "
                        >
                          <div className="truncate">
                            {
                              vendor.city
                            }
                          </div>
                        </td>

                        {/* Action */}
                        <td
                          className="
                            relative
                            border
                            border-[#e5e7eb]
                            px-[8px]
                            py-[8px]
                            align-middle
                          "
                        >
                          <div
                            className="relative inline-block"
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
                              className="
                                inline-flex
                                h-[34px]
                                items-center
                                gap-[5px]
                                whitespace-nowrap
                                rounded-[5px]
                                border
                                border-[#bfc3c8]
                                bg-white
                                px-[9px]
                                text-[14px]
                                font-medium
                                text-[#374151]
                                shadow-none
                                transition
                                hover:bg-[#f5f5f5]
                                focus:outline-none
                              "
                            >
                              <Settings
                                size={15}
                                strokeWidth={
                                  1.8
                                }
                              />

                              Options

                              <MoreVertical
                                size={14}
                                strokeWidth={
                                  1.8
                              }
                              />
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen[
                              vendor._id
                            ] && (
                              <div
                                className="
                                  absolute
                                  right-0
                                  top-full
                                  z-[100]
                                  mt-[4px]
                                  w-[130px]
                                  overflow-hidden
                                  rounded-[4px]
                                  border
                                  border-[#d9d9d9]
                                  bg-white
                                  py-[3px]
                                  shadow-[0_5px_15px_rgba(0,0,0,0.18)]
                                "
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditVendor(
                                      vendor._id,
                                    )
                                  }
                                  className="
                                    flex
                                    w-full
                                    items-center
                                    gap-[8px]
                                    px-[11px]
                                    py-[8px]
                                    text-left
                                    text-[14px]
                                    text-[#374151]
                                    transition
                                    hover:bg-[#f3f4f6]
                                  "
                                >
                                  <Pencil
                                    size={14}
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
                                  className="
                                    flex
                                    w-full
                                    items-center
                                    gap-[8px]
                                    px-[11px]
                                    py-[8px]
                                    text-left
                                    text-[14px]
                                    text-red-600
                                    transition
                                    hover:bg-red-50
                                  "
                                >
                                  <Trash2
                                    size={14}
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
                      className="
                        border
                        border-[#e5e7eb]
                        bg-[#f1f1f1]
                        px-4
                        py-[28px]
                        text-center
                        text-[16px]
                        text-[#555]
                      "
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
  className = "",
}) => {
  return (
    <th
      scope="col"
      onClick={() =>
        onSort(sortKey)
      }
      className={`
        ${className}
        cursor-pointer
        whitespace-nowrap
        border
        border-[#e5e7eb]
        bg-white
        px-[9px]
        py-[11px]
        text-left
        text-[16px]
        font-semibold
        text-[#111827]
        transition
        hover:bg-[#f5f5f5]
      `}
    >
      <div className="flex items-center gap-[2px]">
        <span>
          {label}
        </span>

        {getSortIcon(sortKey)}
      </div>
    </th>
  );
};

export default ResellerList;