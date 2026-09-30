import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  Info,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import axiosInstance from "../../axiosInstance";import Pagination from "../../utils/Pagination";
import { showError } from "../../utils/sweetAlerts";
import ResellerQtySearch from "./ResellerQtySearch";

const ResellerStock = () => {
  const [data, setData] = useState([]);
  const [flattenedData, setFlattenedData] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const [activeSearch, setActiveSearch] = useState({
    reseller: "",
    product: "",
    center: "",
    startDate: "",
    endDate: "",
    status: "Completed",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [centers, setCenters] = useState([]);

  const [stats, setStats] = useState({
    totalResellers: 0,
    totalForwardedQty: 0,
  });

  // --------------------------------------------------
  // Fetch Data
  // --------------------------------------------------
  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchParams.reseller) {
        params.append("resellerId", searchParams.reseller);
      }

      if (searchParams.center) {
        params.append("center", searchParams.center);
      }

      if (searchParams.product) {
        params.append("product", searchParams.product);
      }

      if (searchParams.startDate) {
        params.append("startDate", searchParams.startDate);
      }

      if (searchParams.endDate) {
        params.append("endDate", searchParams.endDate);
      }

      if (searchParams.status) {
        params.append("status", searchParams.status);
      }

      params.append("page", page);

      const url = params.toString()
        ? `/resellerStock/reseller-forwarded-qty?${params.toString()}`
        : "/resellerStock/reseller-forwarded-qty";

      console.log("Fetching from URL:", url);

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        let apiData = [];

        if (Array.isArray(response.data.data)) {
          apiData = response.data.data;
        } else if (
          response.data.data &&
          typeof response.data.data === "object"
        ) {
          apiData = [response.data.data];
        }

        setData(apiData);

        // Flatten data for table
        const flattened = [];

        apiData.forEach((reseller) => {
          if (
            reseller.products &&
            reseller.products.length > 0
          ) {
            reseller.products.forEach((product) => {
              const centersList = Object.values(
                product.centers || {}
              )
                .map(
                  (center) =>
                    `${center.centerName} (${center.forwardedQty})`
                )
                .join(", ");

              const centersCount = Object.keys(
                product.centers || {}
              ).length;

              flattened.push({
                _id: `${reseller.resellerId}_${product.productId}`,
                resellerId: reseller.resellerId,
                resellerName: reseller.resellerName,
                resellerEmail: reseller.resellerEmail,
                resellerMobile: reseller.resellerMobile,
                productId: product.productId,
                productName: product.productName,
                productCode: product.productCode,
                availableQuantity:
                  product.totalForwardedQty,
                displayQuantity:
                  product.totalForwardedQty,
                orderCount: product.orderCount,
                centers: product.centers || {},
                centersCount,
                centersList,
              });
            });
          }
        });

        setFlattenedData(flattened);

        if (response.data.pagination) {
          setCurrentPage(
            response.data.pagination.currentPage
          );
          setTotalPages(
            response.data.pagination.totalPages
          );
        }

        setStats(response.data.stats || {});
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
        console.error(
          "Error response:",
          err.response.data
        );
      } else if (err.request) {
        setError(
          "No response received from server. Please check your network connection."
        );
        console.error("Error request:", err.request);
      } else {
        setError(
          err.message ||
            "An error occurred while fetching data"
        );
        console.error("Error message:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Fetch Resellers
  // --------------------------------------------------
  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get("/resellers");

      if (response.data.success) {
        setResellers(response.data.data || []);
      }
    } catch (error) {
      console.error(
        "Error fetching resellers:",
        error
      );
    }
  };

  // --------------------------------------------------
  // Fetch Products
  // --------------------------------------------------
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(
        "/products/all"
      );

      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error(
        "Error fetching products:",
        error
      );
    }
  };

  useEffect(() => {
    fetchData();
    fetchResellers();
    fetchProducts();
  }, []);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    fetchData(activeSearch, page);
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

    setSortConfig({
      key,
      direction,
    });

    const sortedData = [...flattenedData].sort(
      (a, b) => {
        let aValue = a[key] || 0;
        let bValue = b[key] || 0;

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
        }

        if (typeof bValue === "string") {
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return direction === "ascending" ? -1 : 1;
        }

        if (aValue > bValue) {
          return direction === "ascending" ? 1 : -1;
        }

        return 0;
      }
    );

    setFlattenedData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction === "ascending" ? (
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
  // Search
  // --------------------------------------------------
  const handleSearch = (searchData) => {
    setActiveSearch(searchData);
    fetchData(searchData, 1);
  };

  // --------------------------------------------------
  // Reset Search
  // --------------------------------------------------
  const handleResetSearch = () => {
    const resetData = {
      reseller: "",
      product: "",
      center: "",
      startDate: "",
      endDate: "",
      status: "Completed",
    };

    setActiveSearch(resetData);
    setSearchTerm("");

    fetchData({}, 1);
  };

  // --------------------------------------------------
  // Client-side Search
  // --------------------------------------------------
  const filteredData = flattenedData.filter(
    (item) => {
      if (searchTerm) {
        const searchLower =
          searchTerm.toLowerCase();

        return (
          (item.resellerName &&
            item.resellerName
              .toLowerCase()
              .includes(searchLower)) ||
          (item.productName &&
            item.productName
              .toLowerCase()
              .includes(searchLower)) ||
          (item.productCode &&
            item.productCode
              .toLowerCase()
              .includes(searchLower))
        );
      }

      return true;
    }
  );

  // --------------------------------------------------
  // Export
  // --------------------------------------------------
  const generateExport = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (activeSearch.reseller) {
        params.append(
          "resellerId",
          activeSearch.reseller
        );
      }

      if (activeSearch.center) {
        params.append(
          "center",
          activeSearch.center
        );
      }

      if (activeSearch.product) {
        params.append(
          "product",
          activeSearch.product
        );
      }

      if (activeSearch.startDate) {
        params.append(
          "startDate",
          activeSearch.startDate
        );
      }

      if (activeSearch.endDate) {
        params.append(
          "endDate",
          activeSearch.endDate
        );
      }

      if (activeSearch.status) {
        params.append(
          "status",
          activeSearch.status
        );
      }

      params.append("export", "true");

      const apiUrl = params.toString()
        ? `/resellerStock/reseller-forwarded-qty?${params.toString()}`
        : "/resellerStock/reseller-forwarded-qty";

      const response =
        await axiosInstance.get(apiUrl);

      if (!response.data.success) {
        throw new Error(
          "API returned unsuccessful response"
        );
      }

      let exportData = [];

      if (Array.isArray(response.data.data)) {
        exportData = response.data.data;
      } else if (
        response.data.data &&
        typeof response.data.data === "object"
      ) {
        exportData = [response.data.data];
      }

      const flattenedExport = [];

      exportData.forEach((reseller) => {
        if (
          reseller.products &&
          reseller.products.length > 0
        ) {
          reseller.products.forEach((product) => {
            const centersFormatted = Object.values(
              product.centers || {}
            )
              .map(
                (center) =>
                  `${center.centerName} (${center.forwardedQty})`
              )
              .join("; ");

            flattenedExport.push({
              resellerName:
                reseller.resellerName,
              resellerEmail:
                reseller.resellerEmail,
              productName:
                product.productName,
              productCode:
                product.productCode,
              quantity:
                product.totalForwardedQty,
              orderCount:
                product.orderCount,
              centers:
                centersFormatted,
              centersCount:
                Object.keys(
                  product.centers || {}
                ).length,
            });
          });
        }
      });

      if (flattenedExport.length === 0) {
        showError(
          "No data available for export"
        );
        return;
      }

      const headers = [
        "Reseller Name",
        "Product Name",
        "Forwarded Quantity",
        "Order Count",
        "Centers Count",
        "Centers (with quantity)",
      ];

      const csvData = flattenedExport.map(
        (item) => [
          item.resellerName || "",
          item.productName || "",
          item.quantity || 0,
          item.orderCount || 0,
          item.centersCount || 0,
          item.centers || "",
        ]
      );

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) =>
          row
            .map(
              (field) =>
                `"${String(field || "").replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob(
        ["\uFEFF" + csvContent],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

      const link = document.createElement("a");
      const downloadUrl =
        URL.createObjectURL(blob);

      const filterText = [];

      if (activeSearch.reseller) {
        const reseller = resellers.find(
          (r) =>
            r._id === activeSearch.reseller
        );

        if (reseller) {
          filterText.push(
            reseller.businessName
          );
        }
      }

      const filename = `reseller_forwarded_qty_${
        filterText.length > 0
          ? filterText.join("_") + "_"
          : ""
      }${new Date()
        .toISOString()
        .split("T")[0]}.csv`;

      link.setAttribute(
        "href",
        downloadUrl
      );
      link.setAttribute(
        "download",
        filename
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(
        "Error generating export:",
        error
      );

      showError(
        "Error generating export file"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Center Details
  // --------------------------------------------------
  const renderCenterDetails = (centerData) => {
    if (
      !centerData ||
      Object.keys(centerData).length === 0
    ) {
      return (
        <span className="text-gray-400">
          No centers
        </span>
      );
    }

    return (
      <div className="group relative inline-block">
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Info size={16} />
          {Object.keys(centerData).length} centers
        </button>

        <div className="invisible absolute bottom-full right-0 z-30 mb-2 w-80 rounded-lg border border-gray-200 bg-white p-3 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
          <div className="mb-2 text-sm font-semibold text-gray-700">
            Center Details
          </div>

          <div className="max-h-60 space-y-2 overflow-y-auto">
            {Object.values(centerData).map(
              (center, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 rounded-md bg-gray-50 px-3 py-2"
                >
                  <span className="text-sm text-gray-700">
                    {center.centerName} (
                    {center.centerCode})
                  </span>

                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {center.forwardedQty}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="absolute right-5 top-full h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // Initial Loading
  // --------------------------------------------------
  if (
    loading &&
    flattenedData.length === 0
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div
        className="mx-4 mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-800">
          Reseller Forwarded Quantity Report
        </h1>
      </div>

      {/* Search Modal */}
      <ResellerQtySearch
        visible={searchModalVisible}
        onClose={() =>
          setSearchModalVisible(false)
        }
        onSearch={handleSearch}
        resellers={resellers}
        products={products}
      />

      {/* Main Card */}
      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(true)
              }
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Search size={16} />
              Search
            </button>

            {/* Reset */}
            {(activeSearch.reseller ||
              activeSearch.startDate) && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-2 rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                <RotateCcw size={16} />
                Reset Search
              </button>
            )}

            {/* Export */}
            <button
              type="button"
              onClick={generateExport}
              disabled={
                flattenedData.length === 0
              }
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Export
            </button>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Search */}
          <div className="mb-4 flex justify-end">
            <div className="flex items-center gap-2">
              <label
                htmlFor="resellerSearch"
                className="text-sm font-medium text-gray-600"
              >
                Search:
              </label>

              <input
                id="resellerSearch"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="h-8 w-full max-w-[350px] rounded-none border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th
                    onClick={() =>
                      handleSort("resellerName")
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Reseller{" "}
                    {getSortIcon("resellerName")}
                  </th>

                  <th
                    onClick={() =>
                      handleSort("productName")
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Product{" "}
                    {getSortIcon("productName")}
                  </th>

                  <th
                    onClick={() =>
                      handleSort("productCode")
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Product Code{" "}
                    {getSortIcon("productCode")}
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        "availableQuantity"
                      )
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Forwarded Quantity{" "}
                    {getSortIcon(
                      "availableQuantity"
                    )}
                  </th>

                  <th
                    onClick={() =>
                      handleSort("orderCount")
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Orders{" "}
                    {getSortIcon("orderCount")}
                  </th>

                  <th
                    onClick={() =>
                      handleSort("centersCount")
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Centers{" "}
                    {getSortIcon("centersCount")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="border border-gray-200 px-4 py-3">
                        {item.resellerName || ""}
                      </td>

                      <td className="border border-gray-200 px-4 py-3">
                        {item.productName || ""}
                      </td>

                      <td className="border border-gray-200 px-4 py-3">
                        {item.productCode || ""}
                      </td>

                      <td className="border border-gray-200 px-4 py-3">
                        {item.displayQuantity || 0}
                      </td>

                      <td className="border border-gray-200 px-4 py-3">
                        {item.orderCount || 0}
                      </td>

                      <td className="border border-gray-200 px-4 py-3">
                        {renderCenterDetails(
                          item.centers
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="border border-gray-200 px-4 py-8 text-center text-gray-500"
                    >
                      {loading ? (
                        <div className="flex justify-center">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        </div>
                      ) : (
                        "No data found. Try adjusting your search filters."
                      )}
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

export default ResellerStock;