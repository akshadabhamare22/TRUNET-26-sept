import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../../axiosInstance";
import SearchShiftingModel from "./SearchShiftingModel";
import { formatDate, formatDateTime } from "../../utils/FormatDateTime";
import { confirmDelete, showSuccess, showError } from "../../utils/sweetAlerts";
import Pagination from "../../utils/Pagination";
import usePermission from "../../utils/usePermission";

const PAGE_SIZE = 100;

const getCenterId = (center) => {
  if (!center) return "";
  if (typeof center === "object") {
    return String(center._id || center.id || "");
  }
  return String(center);
};

const getSearchableValues = (building) => [
  building?.customer?.name,
  building?.customer?.username,
  building?.customer?.mobile,
  building?.customer?.email,
  building?.fromCenter?.centerName,
  building?.fromCenter?.centerCode,
  building?.toCenter?.centerName,
  building?.toCenter?.centerCode,
  building?.remark,
  building?.status,
  building?.address1,
  building?.address2,
  building?.city,
];

const matchesShiftingFilters = (building, filters = {}) => {
  const keyword = String(filters.keyword || "").trim().toLowerCase();
  const selectedCenter = String(filters.center || "").trim();

  // Match the keyword against customer and shifting-request details.
  if (keyword) {
    const matchesKeyword = getSearchableValues(building).some((value) =>
      String(value ?? "").toLowerCase().includes(keyword)
    );

    if (!matchesKeyword) return false;
  }

  // The selected branch can be either the source or destination branch.
  if (selectedCenter) {
    const fromCenterId = getCenterId(building?.fromCenter);
    const toCenterId = getCenterId(building?.toCenter);

    if (
      fromCenterId !== selectedCenter &&
      toCenterId !== selectedCenter
    ) {
      return false;
    }
  }

  return true;
};

const ShiftinRequestList = () => {
  const [buildings, setBuildings] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const [activeSearch, setActiveSearch] = useState({
    keyword: "",
    center: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState({});
  const dropdownRefs = useRef({});
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};

  const userCenter =
    loggedInUser.center?._id ||
    loggedInUser.center ||
    loggedInUser.centerId ||
    loggedInUser.centerID ||
    null;

  const { hasAnyPermission } = usePermission();

  // --------------------------------------------------
  // Fetch Shifting Requests
  // IMPORTANT: Do not send modal search filters to the
  // backend. Filter the returned records on the frontend.
  // --------------------------------------------------
  const fetchData = async (_searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `/shiftingRequest?page=${page}&limit=${PAGE_SIZE}`
      );

      if (response.data?.success) {
        const records = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setBuildings(records);

        const pagination = response.data.pagination || {};
        setCurrentPage(Number(pagination.page || page));
        setTotalPages(
          Math.max(1, Number(pagination.totalPages || 1))
        );
      } else {
        throw new Error(
          response.data?.message ||
            "API returned an unsuccessful response"
        );
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data?.message ||
            err.response.data?.error ||
            `Error ${err.response.status}: ${err.response.statusText}`
        );
        console.error("Shifting request API error:", err.response.data);
      } else {
        setError(
          err.message ||
            "An error occurred while fetching shifting requests."
        );
        console.error("Error fetching shifting requests:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Fetch Data For Export
  // Fetch without search filters and apply the same
  // frontend filtering logic used by the table.
  // --------------------------------------------------
  const fetchDataForExport = async () => {
    try {
      const response = await axiosInstance.get(
        `/shiftingRequest?page=1&limit=${PAGE_SIZE}`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to fetch export data"
        );
      }

      const records = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      return records.filter((building) =>
        matchesShiftingFilters(building, activeSearch)
      );
    } catch (err) {
      console.error("Error fetching data for export:", err);
      showError("Error fetching data for export");
      return [];
    }
  };

  // --------------------------------------------------
  // Fetch Centers
  // --------------------------------------------------
  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get(
        "/centers?centerType=Center"
      );

      if (response.data?.success) {
        setCenters(
          Array.isArray(response.data.data)
            ? response.data.data
            : []
        );
      }
    } catch (err) {
      console.error("Error fetching centers:", err);
    }
  };

  // --------------------------------------------------
  // Initial Load
  // --------------------------------------------------
  useEffect(() => {
    fetchCenters();
    fetchData({}, 1);
  }, []);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData({}, page);
  };

  // --------------------------------------------------
  // Sorting
  // --------------------------------------------------
  const handleSort = (key) => {
    let direction = "ascending";

    if (
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });

    setBuildings((previousBuildings) => {
      return [...previousBuildings].sort((a, b) => {
        const getValue = (obj) =>
          key.split(".").reduce(
            (value, part) => value?.[part],
            obj
          );

        const aValue = getValue(a);
        const bValue = getValue(b);

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        const comparison =
          typeof aValue === "string" && typeof bValue === "string"
            ? aValue.localeCompare(bValue, undefined, {
                numeric: true,
                sensitivity: "base",
              })
            : aValue < bValue
              ? -1
              : aValue > bValue
                ? 1
                : 0;

        return direction === "ascending" ? comparison : -comparison;
      });
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;

    return sortConfig.direction === "ascending" ? (
      <ArrowUp size={14} className="ml-1 inline-block" />
    ) : (
      <ArrowDown size={14} className="ml-1 inline-block" />
    );
  };

  // --------------------------------------------------
  // Modal Search
  // --------------------------------------------------
  const handleSearch = (searchData) => {
    const normalizedSearch = {
      keyword: String(searchData.keyword || "").trim(),
      center: String(searchData.center || ""),
    };

    setActiveSearch(normalizedSearch);
    setSearchTerm("");
    setCurrentPage(1);

    // Fetch unfiltered data. The filters are applied below.
    fetchData({}, 1);
  };

  const handleResetSearch = () => {
    const resetData = {
      keyword: "",
      center: "",
    };

    setActiveSearch(resetData);
    setSearchTerm("");
    setCurrentPage(1);
    fetchData({}, 1);
  };

  // --------------------------------------------------
  // Frontend Filtering
  // Apply keyword + branch filters, then local table search.
  // --------------------------------------------------
  const filteredBuildings = buildings.filter((building) => {
    if (!matchesShiftingFilters(building, activeSearch)) {
      return false;
    }

    const localKeyword = searchTerm.trim().toLowerCase();

    if (!localKeyword) return true;

    return getSearchableValues(building).some((value) =>
      String(value ?? "").toLowerCase().includes(localKeyword)
    );
  });

  // --------------------------------------------------
  // Dropdown
  // --------------------------------------------------
  const toggleDropdown = (id) => {
    setDropdownOpen((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const closedDropdowns = {};

      Object.keys(dropdownRefs.current).forEach((key) => {
        const element = dropdownRefs.current[key];

        if (element && !element.contains(event.target)) {
          closedDropdowns[key] = false;
        }
      });

      if (Object.keys(closedDropdowns).length) {
        setDropdownOpen((previous) => ({
          ...previous,
          ...closedDropdowns,
        }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --------------------------------------------------
  // Approve / Reject
  // --------------------------------------------------
  const handleStatusChange = async (id, status) => {
    try {
      const response = await axiosInstance.put(
        `/shiftingRequest/${id}/status`,
        { status }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to update status"
        );
      }

      setAlert({
        visible: true,
        type: "success",
        message: `Request ${
          status === "Approve" ? "approved" : "rejected"
        } successfully.`,
      });

      fetchData({}, currentPage);
    } catch (err) {
      console.error("Error updating status:", err);

      setAlert({
        visible: true,
        type: "danger",
        message:
          err.response?.data?.message ||
          err.message ||
          "Error updating status",
      });
    } finally {
      setTimeout(() => {
        setAlert({
          visible: false,
          type: "",
          message: "",
        });
      }, 3000);
    }
  };

  // --------------------------------------------------
  // CSV Export
  // --------------------------------------------------
  const generateDetailExport = async () => {
    try {
      const allData = await fetchDataForExport();

      if (!allData || allData.length === 0) {
        showError("No data available for export");
        return;
      }

      const headers = [
        "User",
        "From Center",
        "To Center",
        "Remark",
        "Status",
        "Status Detail",
        "Date",
        "Created At",
      ];

      const csvData = allData.map((building) => [
        building.customer?.name ||
          building.customer?.username ||
          "N/A",
        building.fromCenter?.centerName || "N/A",
        building.toCenter?.centerName || "N/A",
        building.remark || "",
        building.status || "N/A",
        building.status === "Approve" && building.approvedBy
          ? `Approve At ${formatDate(building.approvedAt)} by ${building.approvedBy.fullName}`
          : building.status === "Reject" && building.rejectedBy
            ? `Rejected At ${formatDate(building.rejectedAt)} by ${building.rejectedBy.fullName}`
            : "Pending",
        formatDate(building.date),
        formatDateTime(building.createdAt),
      ]);

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const value = String(field ?? "");
              return `"${value.replace(/"/g, '""')}"`;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;

      let filename = `shifting_requests_${
        new Date().toISOString().split("T")[0]
      }`;

      if (activeSearch.keyword) {
        filename += `_search_${activeSearch.keyword}`;
      }

      if (activeSearch.center) {
        const centerName =
          centers.find(
            (center) => String(center._id) === activeSearch.center
          )?.centerName || "center";

        filename += `_${centerName}`;
      }

      link.download = `${filename}.csv`;
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      showSuccess("CSV export completed successfully!");
    } catch (err) {
      console.error("Error generating export:", err);
      showError("Error generating export file");
    }
  };

  // --------------------------------------------------
  // Permissions
  // --------------------------------------------------
  const canEditDelete = (building) => {
    const fromCenterId = getCenterId(building.fromCenter);

    return (
      userCenter &&
      String(fromCenterId) === String(userCenter)
    );
  };

  const canApproveReject = (building) => {
    const toCenterId = getCenterId(building.toCenter);

    return (
      userCenter &&
      String(toCenterId) === String(userCenter)
    );
  };

  const shouldShowActions = (building) =>
    building.status === "Pending";

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------
  const handleDelete = async (itemId) => {
    const result = await confirmDelete();

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/shiftingRequest/${itemId}`);

      setBuildings((previous) =>
        previous.filter((item) => item._id !== itemId)
      );

      showSuccess("Data deleted successfully!");
    } catch (err) {
      console.error("Error deleting data:", err);
      showError(
        err.response?.data?.message || "Error deleting shifting request"
      );
    }
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------
  const handleEdit = (itemId) => {
    navigate(`/edit-shiftingRequest/${itemId}`);
  };

  const hasActiveFilters =
    Boolean(activeSearch.keyword) || Boolean(activeSearch.center);

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
      <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <p>{error}</p>
        <p className="mt-1 text-xs text-red-600">
          Please check your permissions or contact administrator.
        </p>
        <button
          type="button"
          onClick={() => fetchData({}, currentPage)}
          className="mt-3 rounded bg-red-100 px-3 py-1.5 font-medium hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
          Shifting Request List
        </h1>
      </div>

      {/* Alert */}
      {alert.visible && (
        <div
          className={`mb-4 flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
            alert.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <span>{alert.message}</span>
          <button
            type="button"
            onClick={() =>
              setAlert({ visible: false, type: "", message: "" })
            }
            className="ml-4 rounded p-1 hover:bg-black/5"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search Modal */}
      <SearchShiftingModel
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
      />

      {/* Main Card */}
      <div className="mt-4 overflow-hidden rounded-sm border border-gray-200 border-t-4 border-t-[#2759A2] bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {hasAnyPermission("Shifting", [
              "manage_shifting_all_center",
              "manage_shifting_own_center",
            ]) && (
              <Link
                to="/add-shiftingRequest"
                className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a89]"
              >
                <Plus size={16} />
                Add
              </Link>
            )}

            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a89]"
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
              className="inline-flex items-center gap-1.5 rounded-md bg-[#2759A2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a89]"
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

        {/* Card Body */}
        <div className="p-4">
          {/* Local Search */}
          <div className="mb-4 flex justify-end">
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <label
                htmlFor="shifting-search"
                className="whitespace-nowrap text-sm font-medium text-gray-700"
              >
                Search:
              </label>

              <div className="relative w-full sm:w-[350px]">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="shifting-search"
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  disabled={Boolean(hasActiveFilters)}
                  placeholder="Search requests..."
                  className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto border border-gray-200">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-[1100px] w-full border-collapse text-sm">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr className="bg-white text-left text-sm font-bold text-black">
                    <th className="border border-gray-100 px-2 py-3">
                      User
                    </th>

                    <th
                      className="cursor-pointer border border-gray-100 px-2 py-3 hover:bg-gray-100"
                      onClick={() => handleSort("fromCenter.centerName")}
                    >
                      From Branch
                      {getSortIcon("fromCenter.centerName")}
                    </th>

                    <th
                      className="cursor-pointer border border-gray-100 px-2 py-3 hover:bg-gray-100"
                      onClick={() => handleSort("toCenter.centerName")}
                    >
                      To Branch
                      {getSortIcon("toCenter.centerName")}
                    </th>

                    <th className="border border-gray-100 px-2 py-3">
                      Remark
                    </th>

                    <th className="border border-gray-100 px-2 py-3">
                      Status
                    </th>

                    <th className="border border-gray-100 px-2 py-3">
                      Status Detail
                    </th>

                    <th
                      className="cursor-pointer border border-gray-100 px-2 py-3 hover:bg-gray-100"
                      onClick={() => handleSort("date")}
                    >
                      Date
                      {getSortIcon("date")}
                    </th>

                    <th className="border border-gray-100 px-2 py-3">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBuildings.length > 0 ? (
                    filteredBuildings.map((building) => (
                      <tr
                        key={building._id}
                        className={`transition hover:bg-gray-50 ${
                          building.status === "Pending"
                            ? "bg-[#DFF0D8]"
                            : ""
                        }`}
                      >
                        <td className="border border-gray-100 px-2 py-3 text-black">
                          {building.customer?.name ||
                            building.customer?.username ||
                            "N/A"}
                        </td>

                        <td className="border border-gray-100 px-2 py-3 text-black">
                          {building.fromCenter?.centerName || "N/A"}
                        </td>

                        <td className="border border-gray-100 px-2 py-3 text-black">
                          {building.toCenter?.centerName || "N/A"}
                        </td>

                        <td className="max-w-[250px] border border-gray-100 px-2 py-3 text-black">
                          <span
                            className="block truncate"
                            title={building.remark || ""}
                          >
                            {building.remark || "-"}
                          </span>
                        </td>

                        <td className="border border-gray-100 px-2 py-3">
                          {building.status && (
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                building.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : building.status === "Approve"
                                    ? "bg-green-100 text-green-700"
                                    : building.status === "Reject"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {building.status}
                            </span>
                          )}
                        </td>

                        <td className="max-w-[280px] border border-gray-100 px-2 py-3 text-black">
                          {building.status === "Approve" &&
                          building.approvedBy
                            ? `Approve At ${formatDate(
                                building.approvedAt
                              )} by ${building.approvedBy.fullName}`
                            : building.status === "Reject" &&
                                building.rejectedBy
                              ? `Rejected At ${formatDate(
                                  building.rejectedAt
                                )} by ${building.rejectedBy.fullName}`
                              : "-"}
                        </td>

                        <td className="whitespace-nowrap border border-gray-100 px-2 py-3 text-black">
                          {formatDate(building.date)}
                        </td>

                        <td className="border border-gray-100 px-2 py-3">
                          {shouldShowActions(building) && (
                            <div
                              className="relative"
                              ref={(element) => {
                                dropdownRefs.current[building._id] = element;
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  toggleDropdown(building._id)
                                }
                                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                              >
                                <Settings size={14} />
                                Options
                                <MoreVertical size={13} />
                              </button>

                              {dropdownOpen[building._id] && (
                                <div className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                                  {canEditDelete(building) && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleEdit(building._id)
                                        }
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                      >
                                        <Pencil size={15} />
                                        Edit
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDelete(building._id)
                                        }
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 size={15} />
                                        Delete
                                      </button>
                                    </>
                                  )}

                                  {canApproveReject(building) && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStatusChange(
                                            building._id,
                                            "Approve"
                                          )
                                        }
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50"
                                      >
                                        <Check size={15} />
                                        Approve
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStatusChange(
                                            building._id,
                                            "Reject"
                                          )
                                        }
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                      >
                                        <X size={15} />
                                        Reject
                                      </button>
                                    </>
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
                        className="px-4 py-10 text-center text-sm text-gray-500"
                      >
                        No shifting requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Filter result count */}
          {(activeSearch.keyword || activeSearch.center) && (
            <p className="mt-3 text-sm text-gray-500">
              {filteredBuildings.length} matching shifting request
              {filteredBuildings.length === 1 ? "" : "s"} found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShiftinRequestList;
