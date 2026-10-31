import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Download,
  Eye,
  FilePlus2,
  RotateCcw,
  Search,
  Settings,
  TestTube2,
  Trash2,
  X,
} from "lucide-react";

import axiosInstance from "../../axiosInstance";import Pagination from "../../utils/Pagination";
import {
  showError,
  showSuccess,
  confirmAction,
  showToast,
  confirmDelete,
} from "../../utils/sweetAlerts";
import SearchCenterStock from "../Report/SearchCenterStock";
import usePermission from "../../utils/usePermission";

const TestingStock = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const [activeSearch, setActiveSearch] = useState({
    fromCenter: "",
    toCenter: "",
    product: "",
    status: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("open");
  const [expandedRows, setExpandedRows] = useState({});

  const dropdownRefs = useRef({});
  const navigate = useNavigate();

  const { hasPermission } = usePermission();

  const statusFilters = {
    open: ["pending_testing", "under_testing"],
    closed: ["completed", "cancelled"],
  };

  const fetchData = async (
    searchParams = {},
    tab = activeTab,
    page = 1
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (!searchParams.status) {
        const statuses = statusFilters[tab];

        statuses.forEach((status) => {
          params.append("status", status);
        });
      } else {
        params.append("status", searchParams.status);
      }

      if (searchParams.fromCenter) {
        params.append("fromCenter", searchParams.fromCenter);
      }

      if (searchParams.toCenter) {
        params.append("toCenter", searchParams.toCenter);
      }

      if (searchParams.product) {
        params.append("product", searchParams.product);
      }

      params.append("page", page);

      const url = params.toString()
        ? `/testing-material?${params.toString()}`
        : "/testing-material";

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setData(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        setExpandedRows({});
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
          err.message || "An error occurred while fetching data"
        );
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

  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get("/resellers");

      if (response.data.success) {
        setResellers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching resellers:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchProducts();
    fetchResellers();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    fetchData(activeSearch, activeTab, page);
  };

  useEffect(() => {
    fetchData(activeSearch, activeTab);
  }, [activeTab]);

  const handleSort = (key) => {
    let direction = "ascending";

    if (
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      let aValue = a;
      let bValue = b;

      if (key.includes(".")) {
        const keys = key.split(".");

        aValue = keys.reduce(
          (obj, currentKey) =>
            obj && obj[currentKey],
          a
        );

        bValue = keys.reduce(
          (obj, currentKey) =>
            obj && obj[currentKey],
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

    setData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction === "ascending" ? (
      <ArrowUp size={14} className="ml-1 inline-block" />
    ) : (
      <ArrowDown size={14} className="ml-1 inline-block" />
    );
  };

  const handleSearch = (searchData) => {
    setActiveSearch(searchData);
    fetchData(searchData, activeTab, 1);
  };

  const handleResetSearch = () => {
    const resetData = {
      fromCenter: "",
      toCenter: "",
      product: "",
      status: "",
    };

    setActiveSearch(resetData);
    setSearchTerm("");
    fetchData({}, activeTab, 1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    setActiveSearch({
      fromCenter: "",
      toCenter: "",
      product: "",
      status: "",
    });

    setSearchTerm("");
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getStatusClasses = (status) => {
    const statusConfig = {
      pending_testing: "bg-yellow-100 text-yellow-800",
      under_testing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      statusConfig[status] || "bg-gray-100 text-gray-700"
    );
  };

  const getStatusLabel = (status) => {
    const statusConfig = {
      pending_testing: "Pending Testing",
      under_testing: "Under Testing",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return statusConfig[status] || status || "N/A";
  };

  const getTestResultClasses = (result) => {
    const resultConfig = {
      passed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      under_testing: "bg-blue-100 text-blue-800",
      inconclusive: "bg-yellow-100 text-yellow-800",
      pending: "bg-gray-100 text-gray-700",
    };

    return (
      resultConfig[result] || "bg-gray-100 text-gray-700"
    );
  };

  const getTestResultLabel = (result) => {
    const resultConfig = {
      passed: "Passed",
      failed: "Failed",
      under_testing: "Testing",
      inconclusive: "Inconclusive",
      pending: "Pending",
    };

    return resultConfig[result] || result || "Pending";
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClick = (itemId) => {
    navigate(`/testing-profile/${itemId}`);
  };

  const handleAcceptRequest = async (requestId, request) => {
    const result = await confirmAction(
      "Accept Testing Request",
      `Are you sure you want to accept this testing request?<br><br>
       <strong>Request:</strong> ${
         request.requestNumber || "N/A"
       }<br>
       <strong>From:</strong> ${
         request.fromCenter?.centerName || "N/A"
       }<br>
       <strong>To:</strong> ${
         request.toCenter?.centerName || "N/A"
       }<br>
       <strong>Products:</strong> ${
         request.products?.length || 0
       }`,
      "question",
      "Yes, Accept"
    );

    if (!result.isConfirmed) {
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.put(
        `/testing-material/${requestId}/accept`,
        {}
      );

      showToast(
        "Testing request accepted successfully!",
        "success"
      );

      fetchData(
        activeSearch,
        activeTab,
        currentPage
      );
    } catch (error) {
      console.error("Error accepting request:", error);

      showError(
        error.response?.data?.message ||
          "Failed to accept request"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTesting = async (
    requestId,
    request
  ) => {
    const result = await confirmAction(
      "Complete Testing",
      `Are you sure you want to mark this testing as completed?<br><br>
       <strong>Request:</strong> ${
         request.requestNumber || "N/A"
       }<br>
       <strong>From:</strong> ${
         request.fromCenter?.centerName || "N/A"
       }<br>
       <strong>To:</strong> ${
         request.toCenter?.centerName || "N/A"
       }<br>
       <strong>Status:</strong> ${request.status}`,
      "question",
      "Yes, Complete"
    );

    if (!result.isConfirmed) {
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.put(
        `/testing-material/${requestId}/complete`,
        {}
      );

      showToast(
        "Testing marked as completed successfully!",
        "success"
      );

      fetchData(
        activeSearch,
        activeTab,
        currentPage
      );
    } catch (error) {
      console.error("Error completing testing:", error);

      showError(
        error.response?.data?.message ||
          "Failed to complete testing"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => {
      const isCurrentlyOpen = !!prev[id];
      const newState = {};

      if (!isCurrentlyOpen) {
        newState[id] = true;
      }

      return newState;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const nextState = {};
      let changed = false;

      Object.keys(dropdownRefs.current).forEach((key) => {
        const element = dropdownRefs.current[key];

        if (
          element &&
          !element.contains(event.target) &&
          dropdownOpen[key]
        ) {
          nextState[key] = false;
          changed = true;
        }
      });

      if (changed) {
        setDropdownOpen((prev) => ({
          ...prev,
          ...nextState,
        }));
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [dropdownOpen]);

  const filteredData = data.filter((item) => {
    if (
      activeSearch.fromCenter ||
      activeSearch.toCenter ||
      activeSearch.product ||
      activeSearch.status
    ) {
      return true;
    }

    const searchValue = searchTerm.toLowerCase();

    return Object.values(item).some((value) => {
      if (
        typeof value === "object" &&
        value !== null
      ) {
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

  const generateDetailExport = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (activeSearch.fromCenter) {
        params.append(
          "fromCenter",
          activeSearch.fromCenter
        );
      }

      if (activeSearch.toCenter) {
        params.append(
          "toCenter",
          activeSearch.toCenter
        );
      }

      if (activeSearch.product) {
        params.append(
          "product",
          activeSearch.product
        );
      }

      if (activeSearch.status) {
        params.append(
          "status",
          activeSearch.status
        );
      } else {
        const statuses = statusFilters[activeTab];

        statuses.forEach((status) => {
          params.append("status", status);
        });
      }

      const apiUrl = params.toString()
        ? `/testing-material?${params.toString()}`
        : "/testing-material";

      const response = await axiosInstance.get(apiUrl);

      if (!response.data.success) {
        throw new Error(
          "API returned unsuccessful response"
        );
      }

      const exportData = response.data.data;

      if (!exportData || exportData.length === 0) {
        showError("No data available for export");
        return;
      }

      const headers = [
        "Request Date",
        "Request Number",
        "From Center",
        "To Center",
        "Status",
        "Requested By",
        "Requested At",
        "Product Title",
        "Quantity",
        "Serial Numbers",
        "Test Result",
        "Remark",
      ];

      const csvData = exportData.flatMap((request) => {
        if (
          !request.products ||
          request.products.length === 0
        ) {
          return [
            [
              formatDate(request.requestedAt),
              request.requestNumber,
              request.fromCenter?.centerName || "N/A",
              request.toCenter?.centerName || "N/A",
              request.status,
              request.requestedBy?.fullName || "N/A",
              formatDateTime(request.requestedAt),
              "No Product",
              0,
              "",
              "",
              request.remark || "",
            ],
          ];
        }

        return request.products.map((product) => [
          formatDate(request.requestedAt),
          request.requestNumber,
          request.fromCenter?.centerName || "N/A",
          request.toCenter?.centerName || "N/A",
          request.status,
          request.requestedBy?.fullName || "N/A",
          formatDateTime(request.requestedAt),
          product.product?.productTitle || "",
          product.quantity || 0,
          product.serialNumbers
            ?.map((serial) => serial.serialNumber)
            .join(", ") || "",
          product.testResult || "pending",
          product.remark || "",
        ]);
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
      const downloadUrl = URL.createObjectURL(blob);

      link.setAttribute("href", downloadUrl);
      link.setAttribute(
        "download",
        `testing_material_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );

      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error generating export:", error);
      showError("Error generating export file");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = () => {
    navigate("/transfer-to-testing");
  };

  const handleTest = () => {
    navigate("/test-material");
  };

  const hasAdvancedSearch = Boolean(
    activeSearch.fromCenter ||
      activeSearch.toCenter ||
      activeSearch.product ||
      activeSearch.status
  );

  if (loading && data.length === 0) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6 lg:mx-8">
        {error}
      </div>
    );
  }

  const renderTable = () => (
    <div className="max-h-[80vh] w-full overflow-y-auto overflow-x-auto rounded-sm border border-gray-200">
      <table className="min-w-[1200px] w-full border-collapse text-sm">
        <thead>
          <tr className="sticky top-0 z-10 bg-[#f1f3f5] text-left shadow-sm">
            {[
              ["Date", "requestedAt"],
              ["Request Number", "requestNumber"],
              ["From Center", "fromCenter.centerName"],
              ["To Center", "toCenter.centerName"],
              ["Requested By", "requestedBy.fullName"],
              ["Status", "status"],
            ].map(([label, key]) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="cursor-pointer whitespace-nowrap border-b border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-100"
              >
                {label}
                {getSortIcon(key)}
              </th>
            ))}

            <th className="whitespace-nowrap border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
              Remarks
            </th>

            <th className="whitespace-nowrap border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.flatMap((item) => [
              <tr
                key={item._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-4 py-3 align-top">
                  {formatDate(item.requestedAt)}
                </td>

                <td className="px-4 py-3 align-top">
                  <button
                    type="button"
                    onClick={() => handleClick(item._id)}
                    className="border-0 bg-transparent p-0 font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {item.requestNumber}
                  </button>
                </td>

                <td className="px-4 py-3 align-top">
                  {item.fromCenter?.centerName || ""}
                </td>

                <td className="px-4 py-3 align-top">
                  {item.toCenter?.centerName || ""}
                </td>

                <td className="px-4 py-3 align-top">
                  <div>
                    {item.requestedBy?.fullName || "N/A"}
                  </div>

                  {item.requestedAt && (
                    <div className="mt-1 text-xs text-gray-500">
                      At{" "}
                      {new Date(
                        item.requestedAt
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </div>
                  )}
                </td>

                <td className="px-4 py-3 align-top">
                  {item.status && (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                        item.status
                      )}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                  )}
                </td>

                <td className="max-w-[250px] px-4 py-3 align-top">
                  {item.remark || ""}
                </td>

                <td className="px-4 py-3 align-top">
                  {item.status === "completed" ||
                  item.status === "cancelled" ? null : (
                    <div
                      className="relative"
                      ref={(element) => {
                        dropdownRefs.current[item._id] =
                          element;
                      }}
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      <button
                        type="button"
                        onClick={() =>
                          toggleDropdown(item._id)
                        }
                        className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                      >
                        <Settings size={14} />
                        Options
                        <ChevronDown size={14} />
                      </button>

                      {dropdownOpen[item._id] && (
                        <div className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-xl">
                          {item.status ===
                            "pending_testing" &&
                            hasPermission(
                              "Testing Material",
                              "accept_testing_request"
                            ) && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleAcceptRequest(
                                    item._id,
                                    item
                                  )
                                }
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Check
                                  size={15}
                                  className="text-green-600"
                                />
                                Accept
                              </button>
                            )}

                          {item.status ===
                            "under_testing" &&
                            hasPermission(
                              "Testing Material",
                              "complete_testing"
                            ) && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCompleteTesting(
                                    item._id,
                                    item
                                  )
                                }
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Check
                                  size={15}
                                  className="text-blue-600"
                                />
                                Complete
                              </button>
                            )}
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>,

              expandedRows[item._id] &&
                item.products?.map((product, index) => (
                  <tr
                    key={`${item._id}-${index}`}
                    className="bg-gray-50"
                  >
                    <td
                      colSpan={2}
                      className="px-4 py-3"
                    />

                    <td
                      colSpan={6}
                      className="px-4 py-3"
                    >
                      <div className="ml-4">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span>
                            <strong>
                              Product {index + 1}:
                            </strong>{" "}
                            {product.product?.productTitle ||
                              "N/A"}
                          </span>

                          <span>
                            <strong>Quantity:</strong>{" "}
                            {product.quantity || 0}
                          </span>

                          <span className="flex items-center gap-2">
                            <strong>Test Result:</strong>

                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getTestResultClasses(
                                product.testResult
                              )}`}
                            >
                              {getTestResultLabel(
                                product.testResult ||
                                  "pending"
                              )}
                            </span>
                          </span>
                        </div>

                        {product.serialNumbers?.length >
                          0 && (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                            <strong>
                              Serials:
                            </strong>

                            <span>
                              {
                                product.serialNumbers
                                  .length
                              }
                            </span>

                            {product.serialNumbers
                              .slice(0, 3)
                              .map((serial) => (
                                <span
                                  key={
                                    serial._id ||
                                    serial.serialNumber
                                  }
                                  className="rounded bg-white px-2 py-0.5 text-gray-700 ring-1 ring-gray-200"
                                >
                                  {serial.serialNumber}
                                </span>
                              ))}

                            {product.serialNumbers.length >
                              3 && (
                              <span className="rounded bg-gray-200 px-2 py-0.5 text-gray-700">
                                +
                                {product.serialNumbers
                                  .length - 3}{" "}
                                more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )),
            ])
          ) : (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-10 text-center text-sm text-gray-500"
              >
                No {activeTab} testing requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Testing Material Requests
      </div>

      <SearchCenterStock
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        resellers={resellers}
        statusOptions={[
          {
            value: "pending_testing",
            label: "Pending Testing",
          },
          {
            value: "under_testing",
            label: "Under Testing",
          },
          {
            value: "completed",
            label: "Completed",
          },
          {
            value: "cancelled",
            label: "Cancelled",
          },
        ]}
        customFields={[
          {
            name: "fromCenter",
            label: "From Center",
            type: "select",
          },
          {
            name: "toCenter",
            label: "To Center",
            type: "select",
          },
        ]}
      />

      <div className="overflow-hidden rounded-md border-t-4 border-t-[#2759a2] border-x border-b border-gray-200 bg-white shadow-sm">
        {/* Header actions */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {hasPermission(
              "Testing Material",
              "create_testing_request"
            ) && (
              <button
                type="button"
                onClick={handleTransfer}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#2759a2] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b] focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <FilePlus2 size={16} />
                New Transfer
              </button>
            )}

            <button
              type="button"
              onClick={handleTest}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#2759a2] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b] focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <TestTube2 size={16} />
              Test Items
            </button>

            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(true)
              }
              className="inline-flex items-center gap-1.5 rounded-md bg-[#2759a2] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b] focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <Search size={16} />
              Search
            </button>

            {hasAdvancedSearch && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <RotateCcw size={16} />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={generateDetailExport}
              disabled={data.length === 0}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#2759a2] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b] disabled:cursor-not-allowed disabled:opacity-50"
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

        <div className="p-4 sm:p-5">
          {/* Tabs */}
          <div className="mb-4 flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => handleTabChange("open")}
              className={`border-b-4 px-5 py-2.5 text-sm font-medium transition ${
                activeTab === "open"
                  ? "border-blue-700 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Open
            </button>

            <button
              type="button"
              onClick={() =>
                handleTabChange("closed")
              }
              className={`border-b-4 px-5 py-2.5 text-sm font-medium transition ${
                activeTab === "closed"
                  ? "border-blue-700 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Closed
            </button>
          </div>

          {/* Summary + local search */}
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-700">
              <strong>Total:</strong> {data.length}
              <span className="mx-2 text-gray-400">|</span>
              <strong>Filtered:</strong>{" "}
              {filteredData.length}
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="testing-stock-search"
                className="text-sm font-medium text-gray-700"
              >
                Search:
              </label>

              <input
                id="testing-stock-search"
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                disabled={hasAdvancedSearch}
                placeholder={
                  hasAdvancedSearch
                    ? "Disabled during advanced search"
                    : "Search..."
                }
                className="h-9 w-full max-w-[350px] rounded-md border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          </div>

          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default TestingStock;

