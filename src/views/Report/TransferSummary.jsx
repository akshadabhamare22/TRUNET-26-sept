

import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  FileSpreadsheet,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../axiosInstance";
import Pagination from "../../utils/Pagination";
import { showError, showSuccess } from "../../utils/sweetAlerts";
import { formatDisplayDate } from "../../utils/FormatDateTime";
import SearchIndentSummary from "./SearchIndentSummary";

const TransferSummary = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  const [activeSearch, setActiveSearch] = useState({
    center: "",
    product: "",
    startDate: "",
    endDate: "",
    usageType: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---------------------------------------------------------
  // Fetch Transfer Summary
  // ---------------------------------------------------------
  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchParams.center) {
        params.append("fromCenter", searchParams.center);
      }

      if (searchParams.product) {
        params.append("product", searchParams.product);
      }

      if (searchParams.usageType) {
        params.append("status", searchParams.usageType);
      }

      if (searchParams.startDate && searchParams.endDate) {
        const convertDateFormat = (dateStr) => {
          const parts = dateStr.split("-");

          if (parts.length !== 3) {
            return dateStr;
          }

          const [day, month, year] = parts;
          return `${year}-${month}-${day}`;
        };

        params.append(
          "startDate",
          convertDateFormat(searchParams.startDate)
        );

        params.append(
          "endDate",
          convertDateFormat(searchParams.endDate)
        );
      }

      params.append("page", page);

      const url = params.toString()
        ? `/reports/transfers/summary?${params.toString()}`
        : "/reports/transfers/summary";

      console.log("Fetching Transfer URL:", url);

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setData(response.data.data || []);

        setCurrentPage(response.data.pagination?.currentPage || 1);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        const errorMessage =
          response.data.message || "API returned unsuccessful response";

        setError(errorMessage);
        console.error("Backend error:", response.data);
      }
    } catch (err) {
      setError(err.message || "Error fetching transfer data");
      console.error("Error fetching transfer data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Fetch Centers
  // ---------------------------------------------------------
  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get("/centers");

      if (response.data.success) {
        setCenters(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
    }
  };

  // ---------------------------------------------------------
  // Fetch Products
  // ---------------------------------------------------------
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products/all");

      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ---------------------------------------------------------
  // Initial Load
  // ---------------------------------------------------------
  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchProducts();
  }, []);

  // ---------------------------------------------------------
  // Product Click
  // ---------------------------------------------------------
  const handleProductClick = (item) => {
    console.log("Transfer Summary product clicked:", {
      productId: item.productId,
      productName: item.product,
      fromCenterId: item.fromCenterId,
    });

    if (!item.productId) {
      console.error("Product ID missing:", item);
      return;
    }

    navigate("/stock-request", {
      state: {
        productFilter: item.productId,
        productName: item.product,
        centerFilter: item.fromCenterId,
        fromTransferReport: true,
      },
    });
  };

  // ---------------------------------------------------------
  // Total Qty Click -> Transfer Detail (only that row's records)
  // ---------------------------------------------------------
  const handleQtyClick = (item) => {
    if (!item.productId || !item.fromCenterId) {
      console.error("Product ID / Center ID missing:", item);
      return;
    }

    const params = new URLSearchParams();

    params.append("product", item.productId);
    params.append("center", item.fromCenterId);
    params.append("transferType", "given");
    params.append("productName", item.product || "");
    params.append("centerName", item.fromCenter || "");
    params.append("totalQty", item.totalReceivedQty || 0);

    // Parent branch (needs toCenterId in summary API response)
    const parentCenterId =
      item.toCenterId || item.parentCenterId || item.toCenter?._id;

    if (parentCenterId) {
      params.append("parentCenter", parentCenterId);
    }

    // Keep the same period that the summary is showing
    if (activeSearch.startDate && activeSearch.endDate) {
      params.append("startDate", convertDateFormat(activeSearch.startDate));
      params.append("endDate", convertDateFormat(activeSearch.endDate));
    } else {
      const now = new Date();
      params.append("month", `${now.getFullYear()}-${now.getMonth() + 1}`);
    }

    navigate(`/transfer-detail?${params.toString()}`);
  };

  // ---------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    fetchData(activeSearch, page);
  };

  // ---------------------------------------------------------
  // Calculate Totals
  // ---------------------------------------------------------
  const calculateTotals = () => {
    const totals = {
      totalReceivedQty: 0,
      totalRequestedQty: 0,
      totalApprovedQty: 0,
    };

    data.forEach((item) => {
      totals.totalReceivedQty += parseFloat(item.totalReceivedQty || 0);
      totals.totalRequestedQty += parseFloat(item.totalRequestedQty || 0);
      totals.totalApprovedQty += parseFloat(item.totalApprovedQty || 0);
    });

    return totals;
  };

  // ---------------------------------------------------------
  // Nested Value Helper
  // ---------------------------------------------------------
  const getNestedValue = (object, path) => {
    return path.split(".").reduce(
      (current, key) => current?.[key],
      object
    );
  };

  // ---------------------------------------------------------
  // Sorting
  // ---------------------------------------------------------
  const handleSort = (key) => {
    let direction = "ascending";

    if (
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({
      key,
      direction,
    });

    const sortedData = [...data].sort((a, b) => {
      const aValue = getNestedValue(a, key);
      const bValue = getNestedValue(b, key);

      if (aValue == null && bValue == null) {
        return 0;
      }

      if (aValue == null) {
        return 1;
      }

      if (bValue == null) {
        return -1;
      }

      if (aValue < bValue) {
        return direction === "ascending" ? -1 : 1;
      }

      if (aValue > bValue) {
        return direction === "ascending" ? 1 : -1;
      }

      return 0;
    });

    setData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction === "ascending" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  // ---------------------------------------------------------
  // Search
  // ---------------------------------------------------------
  const handleSearch = (searchData) => {
    const mergedSearchData = {
      ...activeSearch,
      ...searchData,
    };

    setActiveSearch(mergedSearchData);
    setSearchTerm("");

    fetchData(mergedSearchData, 1);
  };

  // ---------------------------------------------------------
  // Reset Search
  // ---------------------------------------------------------
  const handleResetSearch = () => {
    const resetData = {
      center: "",
      product: "",
      startDate: "",
      endDate: "",
      usageType: "",
    };

    setActiveSearch(resetData);
    setSearchTerm("");

    fetchData({}, 1);
  };

  // ---------------------------------------------------------
  // Check Active Search
  // ---------------------------------------------------------
  const isSearchActive = () => {
    return Boolean(
      activeSearch.center ||
        activeSearch.product ||
        activeSearch.startDate ||
        activeSearch.endDate ||
        activeSearch.usageType
    );
  };

  // ---------------------------------------------------------
  // Open Export Modal
  // ---------------------------------------------------------
  const openExportModal = () => {
    setExportStartDate(activeSearch.startDate || "");
    setExportEndDate(activeSearch.endDate || "");
    setExportModalVisible(true);
  };

  // ---------------------------------------------------------
  // Date Converter
  // ---------------------------------------------------------
  const convertDateFormat = (dateStr) => {
    if (!dateStr) {
      return dateStr;
    }

    const parts = dateStr.split("-");

    if (
      parts.length === 3 &&
      parts[0].length === 2 &&
      parts[1].length === 2 &&
      parts[2].length === 4
    ) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    }

    return dateStr;
  };

  // ---------------------------------------------------------
  // Export
  // ---------------------------------------------------------
  const generateDetailExport = async () => {
    try {
      setExportLoading(true);

      if (
        exportStartDate &&
        exportEndDate &&
        exportStartDate > exportEndDate
      ) {
        showError("Start date cannot be greater than end date");
        return;
      }

      const params = new URLSearchParams();

      if (activeSearch.center) {
        params.append("fromCenter", activeSearch.center);
      }

      if (activeSearch.product) {
        params.append("product", activeSearch.product);
      }

      if (activeSearch.usageType) {
        params.append("status", activeSearch.usageType);
      }

      if (exportStartDate) {
        params.append(
          "startDate",
          convertDateFormat(exportStartDate)
        );
      }

      if (exportEndDate) {
        params.append(
          "endDate",
          convertDateFormat(exportEndDate)
        );
      }

      params.append("export", "true");

      const apiUrl = params.toString()
        ? `/reports/transfers/summary?${params.toString()}`
        : "/reports/transfers/summary";

      const response = await axiosInstance.get(apiUrl);

      if (!response.data.success) {
        throw new Error("API returned unsuccessful response");
      }

      const exportData = response.data.data;

      if (!exportData || exportData.length === 0) {
        showError("No data available for export");
        return;
      }

      const headers = [
        "From Center",
        "To Center",
        "Product",
        "Total Qty",
      ];

      const csvData = exportData.map((item) => [
        item.fromCenter || "N/A",
        item.toCenter || "N/A",
        item.product || "N/A",
        item.totalReceivedQty || 0,
      ]);

      let filename = "transfer_summary_report";

      if (exportStartDate && exportEndDate) {
        filename += `_${exportStartDate}_to_${exportEndDate}`;
      } else if (exportStartDate) {
        filename += `_from_${exportStartDate}`;
      } else if (exportEndDate) {
        filename += `_until_${exportEndDate}`;
      } else {
        filename += `_${new Date().toISOString().split("T")[0]}`;
      }

      filename += ".csv";

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const stringField = String(field || "");

              return `"${stringField.replace(/"/g, '""')}"`;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const link = document.createElement("a");
      const downloadUrl = URL.createObjectURL(blob);

      link.setAttribute("href", downloadUrl);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);

      showSuccess("Export completed successfully!");

      setExportModalVisible(false);
      setExportStartDate("");
      setExportEndDate("");
    } catch (error) {
      console.error("Error generating export:", error);
      showError("Error generating export file");
    } finally {
      setExportLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Frontend Search
  // ---------------------------------------------------------
  const filteredData = data.filter((item) => {
    if (isSearchActive()) {
      return true;
    }

    if (!searchTerm.trim()) {
      return true;
    }

    const searchValue = searchTerm.toLowerCase();

    return Object.values(item).some((value) => {
      if (typeof value === "object" && value !== null) {
        return Object.values(value).some(
          (nestedValue) =>
            nestedValue &&
            nestedValue
              .toString()
              .toLowerCase()
              .includes(searchValue)
        );
      }

      return (
        value &&
        value
          .toString()
          .toLowerCase()
          .includes(searchValue)
      );
    });
  });

  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  // ---------------------------------------------------------
  // Error
  // ---------------------------------------------------------
  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* Title */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        <h1 className="text-[24px] font-[450] text-[#212529]">
          Transfer Summary Report
        </h1>
      </div>

      {/* Search Modal */}
      <SearchIndentSummary
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
      />

      {/* Export Modal */}
      {exportModalVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Export Transfer Summary Report
              </h2>

              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 px-5 py-5">
              {/* Start Date */}
              <div>
                <label
                  htmlFor="exportStartDate"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Start Date{" "}
                  <span className="font-normal text-gray-500">
                    (Optional)
                  </span>
                </label>

                <input
                  type="date"
                  id="exportStartDate"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to include all records from beginning
                </p>
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="exportEndDate"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  End Date{" "}
                  <span className="font-normal text-gray-500">
                    (Optional)
                  </span>
                </label>

                <input
                  type="date"
                  id="exportEndDate"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to include all records until today
                </p>
              </div>

              {/* Current Filters */}
              {(activeSearch.center ||
                activeSearch.product ||
                activeSearch.usageType) && (
                <div className="rounded-md bg-gray-50 p-3">
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Current Filters:
                  </p>

                  <ul className="space-y-1 text-xs text-gray-600">
                    {activeSearch.center && (
                      <li>
                        <span className="font-medium">From Center:</span>{" "}
                        {centers.find((c) => c._id === activeSearch.center)
                          ?.centerName || ""}
                      </li>
                    )}

                    {activeSearch.product && (
                      <li>
                        <span className="font-medium">Product:</span>{" "}
                        {products.find((p) => p._id === activeSearch.product)
                          ?.productTitle || ""}
                      </li>
                    )}

                    {activeSearch.usageType && (
                      <li>
                        <span className="font-medium">Status:</span>{" "}
                        {activeSearch.usageType}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4">
              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={generateDetailExport}
                disabled={exportLoading}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exportLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={16} />
                    Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="mt-4 overflow-hidden rounded-md border border-gray-200 border-t-[4px] border-t-[#2f5fa7] bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] bg-[#2f5fa7] px-3 text-sm font-semibold text-white transition hover:bg-[#254d89]"
            >
              <Search size={15} />
              Search
            </button>

            {/* Reset */}
            {isSearchActive() && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] border border-gray-400 bg-white px-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                <RotateCcw size={15} />
                Reset Search
              </button>
            )}

            {/* Export - Updated to bold gray text */}
            <button
              type="button"
              onClick={openExportModal}
              disabled={exportLoading || data.length === 0}
              className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] border border-gray-400 bg-white px-3 text-sm font-bold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileSpreadsheet size={15} className="text-gray-600" />
              <span className="font-bold text-gray-600">Export</span>
            </button>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Body */}
        <div className="p-[16px]">
          {/* Search + Export Date Info */}
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              {(exportStartDate || exportEndDate) && (
                <div className="text-xs text-gray-500">
                  {exportStartDate && `Export From: ${exportStartDate} `}
                  {exportEndDate && `To: ${exportEndDate}`}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <label
                htmlFor="summary-search"
                className="whitespace-nowrap text-sm font-semibold text-gray-700"
              >
                Search:
              </label>

              <input
                id="summary-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isSearchActive()}
                placeholder={
                  isSearchActive()
                    ? "Disabled during advanced search"
                    : "Search..."
                }
                className="h-[30px] w-full rounded-none border border-[#d5dce5] px-2 text-sm outline-none focus:border-[#2f5fa7] disabled:cursor-not-allowed disabled:bg-gray-100 lg:w-[220px]"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mb-5 rounded-[5px] border border-[#00b5d8] bg-[#08b9d9] px-5 py-3 text-white">
            <h4 className="mb-1 text-[17px] font-semibold">
              Showing Result
            </h4>

            <p className="text-[15px] font-semibold">
              {formatDisplayDate(
                activeSearch.startDate,
                activeSearch.endDate
              )}
            </p>
          </div>

          {/* Table */}
          <div className="max-h-[500px] w-full overflow-auto border border-[#eeeeee]">
            <table className="w-full min-w-[700px] table-fixed border-collapse text-[16px]">
              <colgroup>
                <col className="w-[20%]" />
                <col className="w-[35%]" />
                <col className="w-[22%]" />
                <col className="w-[23%]" />
              </colgroup>

              <thead className="sticky top-0 z-10 bg-white">
                <tr className="text-left">
                  <SortableHeader
                    label="Branch"
                    sortKey="fromCenter"
                    onSort={handleSort}
                    sortIcon={getSortIcon("fromCenter")}
                  />

                  <SortableHeader
                    label="Parent Branch"
                    sortKey="toCenter"
                    onSort={handleSort}
                    sortIcon={getSortIcon("toCenter")}
                  />

                  <SortableHeader
                    label="Product"
                    sortKey="product"
                    onSort={handleSort}
                    sortIcon={getSortIcon("product")}
                  />

                  <SortableHeader
                    label="Total Qty"
                    sortKey="totalReceivedQty"
                    onSort={handleSort}
                    sortIcon={getSortIcon("totalReceivedQty")}
                  />
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((item, index) => (
                      <tr
                        key={item._id || `${item.product}-${index}`}
                        className={`border-t border-[#eeeeee] transition-colors hover:bg-[#f1f3f5] ${
                          index % 2 === 0 ? "bg-[#f1f2f3]" : "bg-white"
                        }`}
                      >
                        {/* Branch */}
                        <td className="break-words px-2 py-[10px] text-gray-800">
                          {item.fromCenter || ""}
                        </td>

                        {/* Parent Branch */}
                        <td className="break-words px-2 py-[10px] text-gray-800">
                          {item.toCenter || ""}
                        </td>

                        {/* Product */}
                        <td className="break-words px-2 py-[10px] text-gray-800">
                          {item.product ? (
                            <button
                              type="button"
                              onClick={() => handleProductClick(item)}
                              title="Click to view stock request details"
                              className="font-medium text-[#2f5fa7] underline decoration-blue-300 underline-offset-2 hover:text-[#254d89]"
                            >
                              {item.product}
                            </button>
                          ) : (
                            <span className="text-gray-500">No Product</span>
                          )}
                        </td>

                        {/* Total Qty (click -> Transfer Detail) */}
                        <td className="break-words px-2 py-[10px] text-gray-800">
                          <button
                            type="button"
                            onClick={() => handleQtyClick(item)}
                            title="Click to view transfer details"
                            className="font-bold text-[#007bff] underline hover:text-[#0056b3]"
                          >
                            {item.totalReceivedQty || 0}
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Total Row */}
                    <tr className="border-t-2 border-gray-300 bg-gray-100 font-semibold text-gray-800">
                      <td colSpan={3} className="px-2 py-[10px]">
                        Total
                      </td>

                      <td className="px-2 py-[10px]">
                        {totals.totalReceivedQty.toFixed(2)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="bg-[#f1f2f3] px-4 py-3 text-center text-[16px] text-gray-800"
                    >
                      No data found
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

// ---------------------------------------------------------
// Sortable Header
// ---------------------------------------------------------
const SortableHeader = ({
  label,
  sortKey,
  onSort,
  sortIcon,
}) => {
  return (
    <th
      scope="col"
      onClick={() => onSort(sortKey)}
      className="cursor-pointer select-none whitespace-nowrap border border-[#eeeeee] bg-white px-2 py-[10px] text-left font-semibold text-[#212529] transition hover:bg-gray-50"
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>

        {sortIcon && (
          <span className="text-gray-500">
            {sortIcon}
          </span>
        )}
      </div>
    </th>
  );
};

export default TransferSummary;