import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowUp,
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
  showSuccess,
} from '../../../utils/sweetAlerts'
import Pagination from "../../../utils/Pagination";

const RoleList = () => {
  const [data, setData] =
    useState([]);

  const [centers, setCenters] =
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

  const [
    searchModalVisible,
    setSearchModalVisible,
  ] = useState(false);

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
  // Fetch Roles
  // --------------------------------------------------
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await axiosInstance.get(
          "/role",
        );

      if (response.data.success) {
        setData(
          response.data.data,
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Failed to fetch roles",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------
  const handlePageChange = (
    page,
  ) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    // Preserved from original source.
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

    const sortedData = [...data].sort(
      (a, b) => {
        let aValue = a;
        let bValue = b;

        if (key.includes(".")) {
          const keys = key.split(".");

          aValue = keys.reduce(
            (obj, currentKey) =>
              obj &&
              obj[currentKey],
            a,
          );

          bValue = keys.reduce(
            (obj, currentKey) =>
              obj &&
              obj[currentKey],
            b,
          );
        } else {
          aValue = a[key];
          bValue = b[key];
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
      },
    );

    setData(sortedData);
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
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const filteredData = data.filter(
    (item) => {
      if (
        activeSearch.keyword ||
        activeSearch.center
      ) {
        return true;
      }

      return Object.values(
        item,
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
      });
    },
  );

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------
  const handleDeleteData = async (
    itemId,
  ) => {
    const result =
      await confirmDelete();

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axiosInstance.delete(
        `/role/${itemId}`,
      );

      setData((prev) =>
        prev.filter(
          (item) =>
            item._id !== itemId,
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
    }
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------
  const handleEditData = (
    itemId,
  ) => {
    navigate(
      `/edit-role/${itemId}`,
    );

    setDropdownOpen({});
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
  // Outside Click
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (
      event,
    ) => {
      const newDropdownState = {};
      let shouldUpdate = false;

      Object.keys(
        dropdownRefs.current,
      ).forEach((key) => {
        const dropdown =
          dropdownRefs.current[key];

        if (
          dropdown &&
          !dropdown.contains(
            event.target,
          )
        ) {
          newDropdownState[key] =
            false;

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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
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

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-4 text-xl font-semibold text-gray-800">
        Role List
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Add */}
          <div>
            <Link to="/add-role">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Plus size={15} />
                Add
              </button>
            </Link>
          </div>

          {/* Pagination */}
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

        {/* Card Body */}
        <div className="p-4">
          {/* Search */}
          <div className="mb-4 flex justify-end">
            <div className="flex w-full max-w-sm items-center gap-2">
              <label
                htmlFor="role-search"
                className="whitespace-nowrap text-sm font-medium text-gray-700"
              >
                Search:
              </label>

              <div className="relative flex-1">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="role-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value,
                    )
                  }
                  className="h-8 w-full border border-gray-300 bg-white pl-8 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {/* ID */}
                  <th
                    onClick={() =>
                      handleSort(
                        "username",
                      )
                    }
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>ID</span>

                      {getSortIcon(
                        "username",
                      )}
                    </div>
                  </th>

                  {/* Role */}
                  <th
                    onClick={() =>
                      handleSort("name")
                    }
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>Role</span>

                      {getSortIcon(
                        "name",
                      )}
                    </div>
                  </th>

                  {/* Permission */}
                  <th
                    onClick={() =>
                      handleSort(
                        "center.centerName",
                      )
                    }
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        Permission
                      </span>

                      {getSortIcon(
                        "center.centerName",
                      )}
                    </div>
                  </th>

                  {/* Action */}
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length >
                0 ? (
                  filteredData.map(
                    (
                      item,
                      index,
                    ) => (
                      <tr
                        key={
                          item._id
                        }
                        className="align-top hover:bg-gray-50"
                      >
                        {/* ID */}
                        <td className="border border-gray-200 px-3 py-2 text-gray-700">
                          {index + 1}
                        </td>

                        {/* Role */}
                        <td className="border border-gray-200 px-3 py-2 font-medium text-gray-800">
                          {
                            item.roleTitle
                          }
                        </td>

                        {/* Permissions */}
                        <td className="border border-gray-200 px-3 py-2">
                          {item.permissions &&
                          item
                            .permissions
                            .length >
                            0 ? (
                            <div className="space-y-1">
                              {item.permissions.map(
                                (
                                  permissionModule,
                                  moduleIndex,
                                ) => (
                                  <div
                                    key={`${item._id}-${moduleIndex}`}
                                  >
                                    {permissionModule.permissions?.map(
                                      (
                                        permission,
                                        permissionIndex,
                                      ) => (
                                        <div
                                          key={`${item._id}-${moduleIndex}-${permissionIndex}`}
                                          className="mb-1 rounded bg-gray-50 px-2 py-1 text-xs text-gray-700"
                                        >
                                          {
                                            permission
                                          }
                                        </div>
                                      ),
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No
                              Permissions
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="relative border border-gray-200 px-3 py-2">
                          <div
                            className="relative inline-block"
                            ref={(el) => {
                              dropdownRefs.current[
                                item._id
                              ] = el;
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleDropdown(
                                  item._id,
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                            >
                              <Settings
                                size={14}
                              />
                              Options
                            </button>

                            {dropdownOpen[
                              item._id
                            ] && (
                              <div className="absolute right-0 z-30 mt-1 min-w-[140px] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                                {/* Edit */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditData(
                                      item._id,
                                    )
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Pencil
                                    size={
                                      14
                                    }
                                  />
                                  Edit
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteData(
                                      item._id,
                                    )
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2
                                    size={
                                      14
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
                      colSpan={4}
                      className="border border-gray-200 px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No Data found
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

export default RoleList;