import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Download, RotateCcw, Search } from "lucide-react";
import axiosInstance from "../../axiosInstance";import Pagination from "../../utils/Pagination";
import { showError } from "../../utils/sweetAlerts";
import { formatDate, formatDateTime } from "../../utils/FormatDateTime";
import CommonSearch from "./CommonSearch";

const StolenReport = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const [activeSearch, setActiveSearch] = useState({
    center: "",
    product: "",
    startDate: "",
    endDate: "",
    keyword: "",
    outlet: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);

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

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchParams.center) {
        params.append("center", searchParams.center);
      }

      if (searchParams.product) {
        params.append("product", searchParams.product);
      }

      if (searchParams.startDate && searchParams.endDate) {
        const convertedStartDate = convertToYYYYMMDD(
          searchParams.startDate
        );
        const convertedEndDate = convertToYYYYMMDD(searchParams.endDate);

        params.append("startDate", convertedStartDate);
        params.append("endDate", convertedEndDate);
      }

      if (searchParams.keyword) {
        params.append("search", searchParams.keyword);
      }

      if (searchParams.outlet) {
        params.append("outlet", searchParams.outlet);
      }

      params.append("page", page);

      const url = params.toString()
        ? `/reports/stolenstock?${params.toString()}`
        : "/reports/stolenstock";

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setData(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        const errorMessage =
          response.data.message ||
          "API returned unsuccessful response";

        setError(errorMessage);
        console.error("Backend error:", response.data);
      }
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Error ${err.response.status}: ${err.response.statusText}`;

        setError(errorMessage);
        console.error("Error response:", err.response.data);
      } else if (err.request) {
        setError(
          "No response received from server. Please check your network connection."
        );
        console.error("Error request:", err.request);
      } else {
        setError(err.message || "An error occurred while fetching data");
        console.error("Error message:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get("/centers");

      if (response.data.success) {
        setCenters(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products/all");

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchProducts();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    fetchData(activeSearch, page);
  };

  const getFlattenedData = () => {
    const flattened = [];

    data.forEach((report) => {
      if (report.items && report.items.length > 0) {
        report.items.forEach((item) => {
          flattened.push({
            ...report,
            itemDetail: item,
            uniqueKey: `${report._id}_${item._id}`,
          });
        });
      } else {
        flattened.push({
          ...report,
          itemDetail: null,
          uniqueKey: `${report._id}_no_item`,
        });
      }
    });

    return flattened;
  };

  const calculateTotals = () => {
    let totalQty = 0;

    getFlattenedData().forEach((row) => {
      totalQty += parseFloat(row.itemDetail?.quantity || 0);
    });

    return { totalQty };
  };

  const getNestedValue = (obj, key) => {
    if (!key.includes(".")) {
      return obj?.[key];
    }

    return key.split(".").reduce((value, part) => value?.[part], obj);
  };

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
      <ArrowUp size={14} className="inline-block" />
    ) : (
      <ArrowDown size={14} className="inline-block" />
    );
  };

  const handleSearch = (searchData) => {
    const mergedSearchData = {
      ...activeSearch,
      ...searchData,
    };

    setActiveSearch(mergedSearchData);
    fetchData(mergedSearchData, 1);
  };

  const handleResetSearch = () => {
    const resetSearch = {
      center: "",
      product: "",
      startDate: "",
      endDate: "",
      keyword: "",
      outlet: "",
    };

    setActiveSearch(resetSearch);
    setSearchTerm("");
    fetchData({}, 1);
  };

  const isSearchActive = () => {
    return (
      activeSearch.center ||
      activeSearch.product ||
      activeSearch.startDate ||
      activeSearch.endDate ||
      activeSearch.keyword ||
      activeSearch.outlet
    );
  };

  const filteredFlattenedData = getFlattenedData().filter((item) => {
    if (isSearchActive()) {
      return true;
    }

    if (!searchTerm) {
      return true;
    }

    return Object.values(item).some((value) => {
      if (typeof value === "object" && value !== null) {
        return Object.values(value).some(
          (nestedValue) =>
            nestedValue &&
            nestedValue
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
      }

      return (
        value &&
        value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
  });

  const fetchAllDataForExport = async () => {
    try {
      const params = new URLSearchParams();

      if (activeSearch.center) {
        params.append("center", activeSearch.center);
      }

      if (activeSearch.product) {
        params.append("product", activeSearch.product);
      }

      if (activeSearch.startDate && activeSearch.endDate) {
        const convertedStartDate = convertToYYYYMMDD(
          activeSearch.startDate
        );
        const convertedEndDate = convertToYYYYMMDD(
          activeSearch.endDate
        );

        params.append("startDate", convertedStartDate);
        params.append("endDate", convertedEndDate);
      }

      const url = `/reports/stolenstock?${params.toString()}`;
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error("API returned unsuccessful response");
    } catch (err) {
      console.error("Error fetching data for export:", err);
      showError("Error fetching data for export");
      return [];
    }
  };

  const generateDetailExport = async () => {
    try {
      setLoading(true);

      const allData = await fetchAllDataForExport();

      if (!allData || allData.length === 0) {
        showError("No data available for export");
        return;
      }

      const headers = [
        "Date",
        "Type",
        "Center",
        "Product",
        "Quantity",
        "Remark",
        "Created At",
      ];

      const csvData = allData.flatMap((request) => {
        if (request.items && request.items.length > 0) {
          return request.items.map((item) => [
            formatDate(request.date),
            request.usageType || "N/A",
            request.center?.centerName || "N/A",
            item.product?.productTitle || "N/A",
            item.quantity || 0,
            request.remark || "",
            formatDateTime(request.createdAt),
          ]);
        }

        return [
          [
            formatDate(request.date),
            request.usageType || "N/A",
            request.center?.centerName || "N/A",
            "No Product",
            0,
            request.remark || "",
            formatDateTime(request.createdAt),
          ],
        ];
      });

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
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `stolen_report_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );

      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating export:", error);
      showError("Error generating export file");
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Stolen Report
        </h1>
      </div>

      <CommonSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
      />

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Search size={15} />
              Search
            </button>

            {isSearchActive() && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <RotateCcw size={15} />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={generateDetailExport}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <Download size={15} />
              Export
            </button>
          </div>

          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Search */}
          <div className="mb-4 flex justify-end">
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <label
                htmlFor="stolen-report-search"
                className="whitespace-nowrap text-sm font-medium text-gray-700"
              >
                Search:
              </label>

              <input
                id="stolen-report-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-[350px]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto rounded-md border border-gray-200">
            <table className="min-w-[900px] w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th
                    onClick={() => handleSort("date")}
                    className="cursor-pointer whitespace-nowrap border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Date {getSortIcon("date")}
                  </th>

                  <th
                    onClick={() => handleSort("usageType")}
                    className="cursor-pointer whitespace-nowrap border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Type {getSortIcon("usageType")}
                  </th>

                  <th
                    onClick={() => handleSort("center.centerName")}
                    className="cursor-pointer whitespace-nowrap border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Branch {getSortIcon("center.centerName")}
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        "itemDetail.product.productTitle"
                      )
                    }
                    className="cursor-pointer whitespace-nowrap border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Product{" "}
                    {getSortIcon(
                      "itemDetail.product.productTitle"
                    )}
                  </th>

                  <th
                    onClick={() =>
                      handleSort("itemDetail.quantity")
                    }
                    className="cursor-pointer whitespace-nowrap border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Qty{" "}
                    {getSortIcon("itemDetail.quantity")}
                  </th>

                  <th
                    onClick={() => handleSort("remark")}
                    className="cursor-pointer whitespace-nowrap border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Remark {getSortIcon("remark")}
                  </th>

                  <th
                    onClick={() => handleSort("createdAt")}
                    className="cursor-pointer whitespace-nowrap border-b border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Created At {getSortIcon("createdAt")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredFlattenedData.length > 0 ? (
                  <>
                    {filteredFlattenedData.map((item) => (
                      <tr
                        key={item.uniqueKey}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="border-b border-r border-gray-200 px-4 py-3 text-gray-700">
                          {formatDate(item.date)}
                        </td>

                        <td className="border-b border-r border-gray-200 px-4 py-3 text-gray-700">
                          {item.usageType}
                        </td>

                        <td className="border-b border-r border-gray-200 px-4 py-3 text-gray-700">
                          {item.center?.centerName}
                        </td>

                        <td className="border-b border-r border-gray-200 px-4 py-3 text-gray-700">
                          {item.itemDetail?.product?.productTitle ||
                            "No Product"}
                        </td>

                        <td className="border-b border-r border-gray-200 px-4 py-3 text-gray-700">
                          {item.itemDetail?.quantity || 0}
                        </td>

                        <td className="border-b border-r border-gray-200 px-4 py-3 text-gray-700">
                          {item.remark || ""}
                        </td>

                        <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                          {formatDateTime(item.createdAt)}
                        </td>
                      </tr>
                    ))}

                    <tr className="bg-gray-50 font-semibold">
                      <td
                        colSpan={4}
                        className="border-b border-r border-gray-200 px-4 py-3 text-gray-700"
                      >
                        Total Count
                      </td>

                      <td className="border-b border-r border-gray-200 px-4 py-3 text-gray-700">
                        {totals.totalQty}
                      </td>

                      <td
                        colSpan={2}
                        className="border-b border-gray-200 px-4 py-3"
                      />
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={7}
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

export default StolenReport;