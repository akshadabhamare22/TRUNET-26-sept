import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  RotateCcw,
  Search,
} from "lucide-react";

import axiosInstance from "../../axiosInstance";
import Pagination from "../../utils/Pagination";
import { showError } from "../../utils/sweetAlerts";
import {
  formatDate,
  formatDateTime,
} from "../../utils/FormatDateTime";

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
  const [searchModalVisible, setSearchModalVisible] =
    useState(false);

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
        return `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}`;
      }
    }

    return dateStr;
  };

  /* =========================================================
     FETCH DATA
  ========================================================= */

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
        const convertedEndDate = convertToYYYYMMDD(
          searchParams.endDate
        );

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
        setError(
          err.message || "An error occurred while fetching data"
        );
        console.error("Error message:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH CENTERS
  ========================================================= */

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

  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

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

  /* =========================================================
     PAGINATION
  ========================================================= */

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    fetchData(activeSearch, page);
  };

  /* =========================================================
     FLATTEN DATA
  ========================================================= */

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

  /* =========================================================
     TOTALS
  ========================================================= */

  const calculateTotals = () => {
    let totalQty = 0;

    getFlattenedData().forEach((row) => {
      totalQty += parseFloat(row.itemDetail?.quantity || 0);
    });

    return { totalQty };
  };

  const totals = calculateTotals();

  /* =========================================================
     SORT
  ========================================================= */

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
      <ArrowUp size={14} className="inline-block shrink-0" />
    ) : (
      <ArrowDown size={14} className="inline-block shrink-0" />
    );
  };

  /* =========================================================
     SEARCH
  ========================================================= */

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

  /* =========================================================
     EXPORT
  ========================================================= */

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
              const stringField = String(field ?? "");
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
        `stolen_report_${new Date().toISOString().split("T")[0]}.csv`
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

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

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

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="w-full min-w-0 bg-transparent">
      {/* TITLE */}

      <div className="mb-[26px]">
        <h1 className="m-0 text-[24px] font-normal leading-[30px] text-[#212529]">
          Stolen Report
        </h1>
      </div>

      {/* SEARCH MODAL */}

      <CommonSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
      />

      {/* MAIN CARD */}

      <div className="mt-0 w-full min-w-0 overflow-hidden rounded-[3px] border-0 border-t-[4px] border-solid border-t-[#2f5fa7] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        {/* CARD HEADER */}

        <div className="flex min-h-[50px] flex-wrap items-center justify-between gap-2 border-b border-[#dee2e6] bg-white px-[16px] py-[8px]">
          <div className="flex flex-wrap items-center gap-[5px]">
            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex h-[34px] items-center justify-center gap-[5px] rounded-[3px] border border-[#2f5fa7] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition-colors hover:border-[#254d89] hover:bg-[#254d89] focus:outline-none focus:ring-2 focus:ring-[#2f5fa7]/25"
            >
              <Search size={15} />
              Search
            </button>

            <button
              type="button"
              onClick={generateDetailExport}
              className="inline-flex h-[34px] items-center justify-center gap-[5px] rounded-[3px] border border-[#2f5fa7] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition-colors hover:border-[#254d89] hover:bg-[#254d89] focus:outline-none focus:ring-2 focus:ring-[#2f5fa7]/25"
            >
              <Download size={14} />
              Export
            </button>
          </div>

          <div className="ml-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* TABLE BODY */}

        <div className="min-w-0 px-[16px] pb-[32px] pt-[15px]">
          {/* SEARCH INPUT */}

          <div className="mb-[16px] flex min-h-[31px] items-center justify-end">
            <div className="flex w-full items-center justify-end gap-[5px] sm:w-auto">
              <label
                htmlFor="stolen-report-search"
                className="whitespace-nowrap text-[14px] font-medium text-[#212529]"
              >
                Search:
              </label>

              <input
                id="stolen-report-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-[30px] w-full rounded-none border border-[#ced4da] bg-white px-[7px] text-[14px] text-[#212529] outline-none focus:border-[#86b7fe] focus:ring-[2px] focus:ring-[#0d6efd]/10 sm:w-[220px]"
              />
            </div>
          </div>

          {/* TABLE — FITS THE CARD, NO HORIZONTAL SCROLLBAR */}

          <div className="w-full min-w-0 overflow-hidden">
            <table className="w-full table-fixed border-collapse text-left text-[16px] text-[#111111]">
              <colgroup>
                <col style={{ width: "12%" }} />
                <col style={{ width: "19%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "5.5%" }} />
                <col style={{ width: "9.5%" }} />
                <col style={{ width: "26%" }} />
              </colgroup>

              <thead>
                <tr className="bg-white">
                  <SortableHeader
                    label="Date"
                    onClick={() => handleSort("date")}
                    icon={getSortIcon("date")}
                  />

                  <SortableHeader
                    label="Type"
                    onClick={() => handleSort("usageType")}
                    icon={getSortIcon("usageType")}
                  />

                  <SortableHeader
                    label="Branch"
                    onClick={() => handleSort("center.centerName")}
                    icon={getSortIcon("center.centerName")}
                  />

                  <SortableHeader
                    label="Product"
                    onClick={() =>
                      handleSort("itemDetail.product.productTitle")
                    }
                    icon={getSortIcon(
                      "itemDetail.product.productTitle"
                    )}
                  />

                  <SortableHeader
                    label="Qty"
                    onClick={() => handleSort("itemDetail.quantity")}
                    icon={getSortIcon("itemDetail.quantity")}
                  />

                  <SortableHeader
                    label="Remark"
                    onClick={() => handleSort("remark")}
                    icon={getSortIcon("remark")}
                  />

                  <SortableHeader
                    label="Created At"
                    onClick={() => handleSort("createdAt")}
                    icon={getSortIcon("createdAt")}
                    last
                  />
                </tr>
              </thead>

              <tbody>
                {filteredFlattenedData.length > 0 ? (
                  <>
                    {filteredFlattenedData.map((item, index) => (
                      <tr
                        key={item.uniqueKey}
                        className={
                          index % 2 === 0
                            ? "bg-[#f1f2f2] transition-colors hover:bg-[#e9ecef]"
                            : "bg-white transition-colors hover:bg-[#f8f9fa]"
                        }
                      >
                        <td className="break-words border-b border-r border-[#eeeeee] px-[8px] py-[9px] align-top leading-[24px]">
                          {formatDate(item.date)}
                        </td>

                        <td className="break-words border-b border-r border-[#eeeeee] px-[8px] py-[9px] align-top leading-[24px]">
                          {item.usageType || ""}
                        </td>

                        <td className="break-words border-b border-r border-[#eeeeee] px-[8px] py-[9px] align-top leading-[24px]">
                          {item.center?.centerName || ""}
                        </td>

                        <td className="break-words border-b border-r border-[#eeeeee] px-[8px] py-[9px] align-top leading-[24px]">
                          {item.itemDetail?.product?.productTitle ||
                            "No Product"}
                        </td>

                        <td className="break-words border-b border-r border-[#eeeeee] px-[8px] py-[9px] align-top leading-[24px]">
                          {item.itemDetail?.quantity || 0}
                        </td>

                        <td className="break-words border-b border-r border-[#eeeeee] px-[8px] py-[9px] align-top leading-[24px]">
                          {item.remark || ""}
                        </td>

                        <td className="break-words border-b border-[#eeeeee] px-[8px] py-[9px] align-top leading-[24px]">
                          {formatDateTime(item.createdAt)}
                        </td>
                      </tr>
                    ))}

                    {/* TOTAL COUNT ROW */}

                    <tr className="bg-[#dff0d8] font-normal text-[#111111]">
                      <td
                        colSpan={4}
                        className="border-b border-r border-[#eeeeee] px-[8px] py-[9px] align-middle leading-[24px]"
                      >
                        Total Count
                      </td>

                      <td className="border-b border-r border-[#eeeeee] px-[8px] py-[9px] align-middle leading-[24px]">
                        {totals.totalQty}
                      </td>

                      <td
                        colSpan={2}
                        className="border-b border-[#eeeeee] px-[8px] py-[9px]"
                      />
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="border-b border-[#eeeeee] px-3 py-10 text-center text-[14px] text-[#6c757d]"
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

/* =========================================================
   TABLE HEADER
========================================================= */

const SortableHeader = ({
  label,
  onClick,
  icon,
  last = false,
}) => (
  <th
    scope="col"
    onClick={onClick}
    className={`border border-[#eeeeee] bg-white px-[8px] py-[9px] text-left align-bottom text-[16px] font-semibold leading-[24px] text-[#111111] ${
      last ? "" : ""
    } cursor-pointer`}
  >
    <div className="flex min-w-0 items-center gap-[4px]">
      <span className="min-w-0 break-words">{label}</span>
      {icon}
    </div>
  </th>
);

export default StolenReport;