import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  Download,
  FilePlus2,
  RotateCcw,
  Search,
} from "lucide-react";

import axiosInstance from "../../axiosInstance";import SearchStockPurchase from "./SearchStockPurchase";
import ExportStockPurchase from "./ExportStockPurchase";
import Pagination from "../../utils/Pagination";
import { showError, showSuccess } from "../../utils/sweetAlerts";
import usePermission from "../../utils/usePermission";

const StockPurchase = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const [activeSearch, setActiveSearch] = useState({
    keyword: "",
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  // Convert DD-MM-YYYY to YYYY-MM-DD for API
  const convertToYYYYMMDD = (dateStr) => {
    if (!dateStr) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    const parts = dateStr.split("-");

    if (parts.length === 3) {
      const [day, month, year] = parts;

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
    }

    return dateStr;
  };

  // Fetch stock purchase data
  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchParams.keyword) {
        params.append("search", searchParams.keyword);
      }

      if (searchParams.startDate) {
        const convertedStartDate = convertToYYYYMMDD(
          searchParams.startDate
        );

        params.append("startDate", convertedStartDate);
      }

      if (searchParams.endDate) {
        const convertedEndDate = convertToYYYYMMDD(searchParams.endDate);

        params.append("endDate", convertedEndDate);
      }

      params.append("page", page);

      const url = params.toString()
        ? `/stockpurchase?${params.toString()}`
        : "/stockpurchase";

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setCustomers(response.data.data);

        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        throw new Error(
          response.data.message || "API returned unsuccessful response"
        );
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching stock purchase data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    fetchData(activeSearch, page);
  };

  // Calculate totals
  const calculateTotals = () => {
    const totals = {
      amount: 0,
      productAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0,
    };

    filteredCustomers.forEach((customer) => {
      totals.amount += parseFloat(customer.transportAmount || 0);
      totals.productAmount += parseFloat(customer.productAmount || 0);
      totals.cgst += parseFloat(customer.cgst || 0);
      totals.sgst += parseFloat(customer.sgst || 0);
      totals.igst += parseFloat(customer.igst || 0);
      totals.total += parseFloat(customer.totalAmount || 0);
    });

    return totals;
  };

  // Sorting
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

    const sortedCustomers = [...customers].sort((a, b) => {
      let aValue = a;
      let bValue = b;

      if (key.includes(".")) {
        const keys = key.split(".");

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

      if (aValue < bValue) {
        return direction === "ascending" ? -1 : 1;
      }

      if (aValue > bValue) {
        return direction === "ascending" ? 1 : -1;
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
      <ArrowUp size={14} className="inline-block ml-1" />
    ) : (
      <ArrowDown size={14} className="inline-block ml-1" />
    );
  };

  // Advanced search
  const handleSearch = (searchData) => {
    setActiveSearch(searchData);
    setSearchTerm("");
    fetchData(searchData, 1);
  };

  // Reset advanced search
  const handleResetSearch = () => {
    const resetData = {
      keyword: "",
      startDate: "",
      endDate: "",
    };

    setActiveSearch(resetData);
    setSearchTerm("");
    setSortConfig({
      key: null,
      direction: "ascending",
    });

    fetchData({}, 1);
  };

  // Export stock purchase data
  const handleExport = async (exportFilters) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      // Keyword filter
      if (activeSearch.keyword) {
        params.append("search", activeSearch.keyword);
      }

      // Start date
      if (exportFilters.startDate) {
        const convertedStartDate = convertToYYYYMMDD(
          exportFilters.startDate
        );

        params.append("startDate", convertedStartDate);
      }

      // End date
      if (exportFilters.endDate) {
        const convertedEndDate = convertToYYYYMMDD(
          exportFilters.endDate
        );

        params.append("endDate", convertedEndDate);
      }

      params.append("export", "true");

      const exportUrl = `/stockpurchase?${params.toString()}`;

      console.log("Export URL:", exportUrl);

      const response = await axiosInstance.get(exportUrl, {
        responseType: "blob",
      });

      if (!response.data || response.data.size === 0) {
        showError("No data available for export");
        return;
      }

      // Create filename
      let filename = `stock_purchase_${
        new Date().toISOString().split("T")[0]
      }`;

      if (activeSearch.keyword) {
        filename += `_${activeSearch.keyword}`;
      }

      if (exportFilters.startDate) {
        filename += `_from_${exportFilters.startDate}`;
      }

      if (exportFilters.endDate) {
        filename += `_to_${exportFilters.endDate}`;
      }

      filename += ".xlsx";

      // Create blob
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      showSuccess("Export completed successfully!");
    } catch (error) {
      console.error("Error generating export:", error);

      showError(
        error.response?.data?.message ||
          error.message ||
          "Error generating export file"
      );
    } finally {
      setLoading(false);
    }
  };

  // Display date
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Local search
  const filteredCustomers = customers.filter((customer) => {
    if (
      activeSearch.keyword ||
      activeSearch.startDate ||
      activeSearch.endDate
    ) {
      return true;
    }

    const searchValue = searchTerm.toLowerCase();

    return Object.values(customer).some((value) => {
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
        value.toString().toLowerCase().includes(searchValue)
      );
    });
  });

  const hasActiveFilters =
    activeSearch.keyword ||
    activeSearch.startDate ||
    activeSearch.endDate;

  const totals = calculateTotals();

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  const tableHeaders = [
    {
      key: "outlet",
      label: "Branch",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "invoiceNo",
      label: "Invoice",
    },
    {
      key: "vendor.businessName",
      label: "Vendor",
    },
    {
      key: "transportAmount",
      label: "Trns. Amt.",
    },
    {
      key: "productAmount",
      label: "Amount",
    },
    {
      key: "cgst",
      label: "CGST",
    },
    {
      key: "sgst",
      label: "SGST",
    },
    {
      key: "igst",
      label: "IGST",
    },
    {
      key: "totalAmount",
      label: "Total",
    },
    {
      key: "remark",
      label: "Remark",
    },
  ];

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Stock Purchase
        </h1>
      </div>

      {/* Search Modal */}
      <SearchStockPurchase
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
      />

      {/* Export Modal */}
      <ExportStockPurchase
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        onExport={handleExport}
      />

      {/* Main Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {hasPermission("Purchase", "add_purchase_stock") && (
              <Link to="/add-stockPurchase">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <FilePlus2 size={16} />
                  Add
                </button>
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
                className="inline-flex items-center gap-1.5 rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                <RotateCcw size={16} />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={() => setExportModalVisible(true)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Detail Export
            </button>
          </div>

          {/* Pagination */}
          <div className="shrink-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Filters + Local Search */}
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Active Filters:
                  </span>

                  {activeSearch.keyword && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      Keyword: {activeSearch.keyword}
                    </span>
                  )}

                  {activeSearch.startDate && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      From: {activeSearch.startDate}
                    </span>
                  )}

                  {activeSearch.endDate && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      To: {activeSearch.endDate}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="stockPurchaseSearch"
                className="text-sm font-medium text-gray-700"
              >
                Search:
              </label>

              <input
                id="stockPurchaseSearch"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-[300px]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-[1200px] w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {tableHeaders.map((header) => (
                    <th
                      key={header.key}
                      scope="col"
                      onClick={() => handleSort(header.key)}
                      className="cursor-pointer whitespace-nowrap border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-200"
                    >
                      <span className="inline-flex items-center">
                        {header.label}
                        {getSortIcon(header.key)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.length > 0 ? (
                  <>
                    {filteredCustomers.map((customer) => (
                      <tr
                        key={customer._id}
                        className="border-b border-gray-100 transition hover:bg-gray-50"
                      >
                        {/* Branch */}
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {customer.outlet?.centerName || ""}
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {formatDisplayDate(customer.date)}
                        </td>

                        {/* Invoice */}
                        <td className="whitespace-nowrap px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/edit-stockPurchase/${customer._id}`
                              )
                            }
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {customer.invoiceNo}
                          </button>
                        </td>

                        {/* Vendor */}
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {customer.vendor?.businessName || "N/A"}
                        </td>

                        {/* Transport Amount */}
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {customer.transportAmount || 0}
                        </td>

                        {/* Product Amount */}
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {customer.productAmount || 0}
                        </td>

                        {/* CGST */}
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {customer.cgst || 0}
                        </td>

                        {/* SGST */}
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {customer.sgst || 0}
                        </td>

                        {/* IGST */}
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {customer.igst || 0}
                        </td>

                        {/* Total */}
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800">
                          {customer.totalAmount || 0}
                        </td>

                        {/* Remark */}
                        <td className="px-4 py-3 text-gray-700">
                          {customer.remark || ""}
                        </td>
                      </tr>
                    ))}

                    {/* Total Row */}
                    <tr className="bg-gray-100 font-semibold text-gray-800">
                      <td
                        colSpan={4}
                        className="border-t border-gray-300 px-4 py-3 text-right"
                      >
                        Total
                      </td>

                      <td className="border-t border-gray-300 px-4 py-3">
                        {totals.amount.toFixed(2)}
                      </td>

                      <td className="border-t border-gray-300 px-4 py-3">
                        {totals.productAmount.toFixed(2)}
                      </td>

                      <td className="border-t border-gray-300 px-4 py-3">
                        {totals.cgst.toFixed(2)}
                      </td>

                      <td className="border-t border-gray-300 px-4 py-3">
                        {totals.sgst.toFixed(2)}
                      </td>

                      <td className="border-t border-gray-300 px-4 py-3">
                        {totals.igst.toFixed(2)}
                      </td>

                      <td className="border-t border-gray-300 px-4 py-3">
                        {totals.total.toFixed(2)}
                      </td>

                      <td className="border-t border-gray-300 px-4 py-3" />
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-4 py-10 text-center text-sm text-gray-500"
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

export default StockPurchase;