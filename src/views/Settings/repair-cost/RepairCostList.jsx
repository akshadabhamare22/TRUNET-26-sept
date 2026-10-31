import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  ArrowDown,
  ArrowUp,
  CloudDownload,
  CloudUpload,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";

import axiosInstance from "../../../axiosInstance";

import {
  confirmDelete,
  showError,
  showSuccess,
} from "../../../utils/sweetAlerts";

import Pagination from "../../../utils/Pagination";

import AddRepairedCost from "./AddRepairedCost";
import ImportRepairCostsModal from "./ImportRepairCostsModal";

const RepairedCostList = () => {
  const [repairCosts, setRepairCosts] =
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

  const [dropdownOpen, setDropdownOpen] =
    useState({});

  const [showModal, setShowModal] =
    useState(false);

  const [showImportModal, setShowImportModal] =
    useState(false);

  const [
    editingRepairCost,
    setEditingRepairCost,
  ] = useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [importLoading, setImportLoading] =
    useState(false);

  const dropdownRefs = useRef({});

  // --------------------------------------------------
  // Fetch Repair Costs
  // --------------------------------------------------
  const fetchRepairCosts = async (
    page = 1,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await axiosInstance.get(
          `/repaired-cost?page=${page}`,
        );

      if (response.data.success) {
        setRepairCosts(
          response.data.data,
        );

        setCurrentPage(
          response.data.pagination
            .currentPage,
        );

        setTotalPages(
          response.data.pagination
            .totalPages,
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
    fetchRepairCosts(1);
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

    fetchRepairCosts(page);
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

    const sortedData = [
      ...repairCosts,
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

    setRepairCosts(sortedData);
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
        className="inline-block align-middle"
      />
    ) : (
      <ArrowDown
        size={14}
        className="inline-block align-middle"
      />
    );
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const filteredData =
    repairCosts.filter(
      (repairCost) =>
        Object.values(repairCost).some(
          (value) => {
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
          },
        ),
    );

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------
  const handleDeleteRepairCost =
    async (id) => {
      const result =
        await confirmDelete();

      if (!result.isConfirmed) {
        return;
      }

      try {
        await axiosInstance.delete(
          `/repaired-cost/${id}`,
        );

        fetchRepairCosts(
          currentPage,
        );

        showSuccess(
          "Repair cost deleted successfully!",
        );
      } catch (error) {
        console.error(
          "Error deleting repair cost:",
          error,
        );

        showError(
          error.response?.data
            ?.message ||
            "Failed to delete repair cost",
        );
      }
    };

  // --------------------------------------------------
  // Add / Edit Callback
  // --------------------------------------------------
  const handleRepairCostAdded = async (
    newRepairCost,
    isEdit,
  ) => {
    if (isEdit) {
      setRepairCosts((prev) =>
        prev.map((item) =>
          item._id ===
          newRepairCost._id
            ? newRepairCost
            : item,
        ),
      );
    } else {
      fetchRepairCosts(
        currentPage,
      );
    }
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------
  const handleEditRepairCost = (
    repairCost,
  ) => {
    setEditingRepairCost(
      repairCost,
    );

    setShowModal(true);

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
  // Import
  // --------------------------------------------------
  const handleImportClick = () => {
    setShowImportModal(true);
  };

  // --------------------------------------------------
  // Download Template
  // --------------------------------------------------
  const handleDownloadTemplate =
    async () => {
      try {
        setImportLoading(true);

        const response =
          await axiosInstance.get(
            "/repaired-cost/template",
            {
              responseType: "blob",
            },
          );

        const url =
          window.URL.createObjectURL(
            new Blob([response.data]),
          );

        const link =
          document.createElement("a");

        link.href = url;

        link.setAttribute(
          "download",
          "repair_costs_template.csv",
        );

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error(
          "Error downloading template:",
          error,
        );

        if (
          error.response?.data &&
          typeof error.response
            .data === "object"
        ) {
          try {
            const errorData =
              error.response.data;

            showError(
              errorData.message ||
                "Failed to download template",
            );
          } catch {
            showError(
              "Failed to download template",
            );
          }
        } else {
          showError(
            "Failed to download template",
          );
        }
      } finally {
        setImportLoading(false);
      }
    };

  // --------------------------------------------------
  // Import Complete
  // --------------------------------------------------
  const handleImportComplete = (
    result,
  ) => {
    if (result.success) {
      fetchRepairCosts(
        currentPage,
      );

      showSuccess(
        "Import completed!",
      );
    }

    setShowImportModal(false);
  };

  // --------------------------------------------------
  // Close Dropdown on Outside Click
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

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-4
            border-gray-200
            border-t-[#2f5fa7]
          "
        />
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div
        className="
          rounded-md
          border
          border-red-200
          bg-red-50
          px-4
          py-3
          text-sm
          text-red-700
        "
      >
        {error}
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">

      {/* ================= PAGE TITLE ================= */}
            <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">

        Repaired Cost Management
      </div>

      {/* ================= MAIN CARD ================= */}
      <div
        className="
          overflow-hidden
          border-0
          bg-white
          shadow-[0_1px_5px_rgba(0,0,0,0.12)]
        "
      >

        {/* ================= CARD HEADER ================= */}
        <div
          className="
            flex
            min-h-[70px]
            flex-col
            gap-3
            border-t-[4px]
            border-t-[#2f5fa7]
            border-b
            border-[#dedede]
            bg-white
            px-[18px]
            py-[10px]
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex flex-wrap items-center gap-[4px]">

            {/* Add */}
            <button
              type="button"
              onClick={() => {
                setEditingRepairCost(
                  null,
                );

                setShowModal(true);
              }}
              className="
                inline-flex
                h-[36px]
                items-center
                gap-[5px]
                rounded-[4px]
                bg-[#2f5fa7]
                px-[10px]
                text-[15px]
                font-semibold
                text-white
                transition
                hover:bg-[#244c88]
                active:scale-[0.98]
              "
            >
              <Plus size={17} />
              Add
            </button>

            {/* Import */}
            <button
              type="button"
              onClick={
                handleImportClick
              }
              className="
                inline-flex
                h-[36px]
                items-center
                gap-[5px]
                rounded-[4px]
                bg-[#2f5fa7]
                px-[10px]
                text-[15px]
                font-semibold
                text-white
                transition
                hover:bg-[#244c88]
                active:scale-[0.98]
              "
            >
              <CloudUpload
                size={17}
              />
              Import
            </button>

            {/* Download Template */}
            <button
              type="button"
              onClick={
                handleDownloadTemplate
              }
              disabled={
                importLoading
              }
              className="
                inline-flex
                h-[36px]
                items-center
                gap-[5px]
                rounded-[4px]
                bg-[#2f5fa7]
                px-[10px]
                text-[15px]
                font-semibold
                text-white
                transition
                hover:bg-[#244c88]
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <CloudDownload
                size={17}
              />

              {importLoading
                ? "Downloading..."
                : "Download Template"}
            </button>
          </div>

          {/* ================= PAGINATION ================= */}
          <div className="flex items-center justify-end">
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

        {/* ================= CARD BODY ================= */}
        <div className="px-[18px] py-[17px]">

          {/* ================= SEARCH ================= */}
          <div className="mb-[18px] flex justify-end">
            <div className="flex items-center gap-[7px]">

              <label
                htmlFor="repair-cost-search"
                className="
                  whitespace-nowrap
                  text-[16px]
                  font-semibold
                  text-[#111]
                "
              >
                Search:
              </label>

              <div className="relative">
                <Search
                  size={15}
                  className="
                    pointer-events-none
                    absolute
                    left-[9px]
                    top-1/2
                    -translate-y-1/2
                    text-[#999]
                  "
                />

                <input
                  id="repair-cost-search"
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
                    h-[33px]
                    w-[238px]
                    rounded-[2px]
                    border
                    border-[#d9d9d9]
                    bg-white
                    pl-[31px]
                    pr-[9px]
                    text-[15px]
                    text-[#333]
                    outline-none
                    transition
                    focus:border-[#2f5fa7]
                  "
                />
              </div>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div
            className="
              w-full
              overflow-hidden
              border
              border-[#eeeeee]
            "
          >
            {/* Vertical scrolling ONLY */}
            <div
              className="
                max-h-[500px]
                overflow-y-auto
                overflow-x-hidden
              "
              style={{
                scrollbarWidth: "thin",
              }}
            >
              <table
                className="
                  w-full
                  table-fixed
                  border-collapse
                "
              >
                <colgroup>
                  <col
                    style={{
                      width: "15%",
                    }}
                  />

                  <col
                    style={{
                      width: "30%",
                    }}
                  />

                  <col
                    style={{
                      width: "30%",
                    }}
                  />

                  <col
                    style={{
                      width: "25%",
                    }}
                  />
                </colgroup>

                {/* ================= TABLE HEADER ================= */}
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th
                      className="
                        border-b
                        border-r
                        border-[#e8e8e8]
                        bg-white
                        px-[9px]
                        py-[11px]
                        text-left
                        text-[16px]
                        font-semibold
                        text-[#111]
                      "
                    >
                      SR.No.
                    </th>

                    <th
                      onClick={() =>
                        handleSort(
                          "product.productTitle",
                        )
                      }
                      className="
                        cursor-pointer
                        border-b
                        border-r
                        border-[#e8e8e8]
                        bg-white
                        px-[9px]
                        py-[11px]
                        text-left
                        text-[16px]
                        font-semibold
                        text-[#111]
                        transition
                        hover:bg-[#f7f7f7]
                      "
                    >
                      <span className="inline-flex items-center gap-[5px]">
                        Product Name

                        {getSortIcon(
                          "product.productTitle",
                        )}
                      </span>
                    </th>

                    <th
                      onClick={() =>
                        handleSort(
                          "repairCost",
                        )
                      }
                      className="
                        cursor-pointer
                        border-b
                        border-r
                        border-[#e8e8e8]
                        bg-white
                        px-[9px]
                        py-[11px]
                        text-left
                        text-[16px]
                        font-semibold
                        text-[#111]
                        transition
                        hover:bg-[#f7f7f7]
                      "
                    >
                      <span className="inline-flex items-center gap-[5px]">
                        Repair Cost (₹)

                        {getSortIcon(
                          "repairCost",
                        )}
                      </span>
                    </th>

                    <th
                      className="
                        border-b
                        border-[#e8e8e8]
                        bg-white
                        px-[9px]
                        py-[11px]
                        text-left
                        text-[16px]
                        font-semibold
                        text-[#111]
                      "
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                {/* ================= TABLE BODY ================= */}
                <tbody>
                  {filteredData.length >
                  0 ? (
                    filteredData.map(
                      (
                        repairCost,
                        index,
                      ) => (
                        <tr
                          key={
                            repairCost._id
                          }
                          className="
                            transition
                            even:bg-[#f1f1f1]
                            hover:bg-[#eaf2fb]
                          "
                        >

                          {/* SR No */}
                          <td
                            className="
                              border-b
                              border-r
                              border-[#e9e9e9]
                              px-[9px]
                              py-[10px]
                              text-[16px]
                              text-[#111]
                            "
                          >
                            {(currentPage -
                              1) *
                              100 +
                              index +
                              1}
                          </td>

                          {/* Product */}
                          <td
                            className="
                              border-b
                              border-r
                              border-[#e9e9e9]
                              px-[9px]
                              py-[10px]
                              text-[16px]
                              text-[#111]
                            "
                          >
                            {repairCost
                              .product
                              ?.productTitle ||
                              "N/A"}
                          </td>

                          {/* Repair Cost */}
                          <td
                            className="
                              border-b
                              border-r
                              border-[#e9e9e9]
                              px-[9px]
                              py-[10px]
                              text-[16px]
                              text-[#111]
                            "
                          >
                            ₹{" "}
                            {repairCost.repairCost?.toFixed(
                              2,
                            ) ||
                              "0.00"}
                          </td>

                          {/* Action */}
                          <td
                            className="
                              relative
                              border-b
                              border-[#e9e9e9]
                              px-[9px]
                              py-[10px]
                            "
                          >
                            <div
                              className="relative inline-block"
                              ref={(el) => {
                                dropdownRefs.current[
                                  repairCost._id
                                ] = el;
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  toggleDropdown(
                                    repairCost._id,
                                  )
                                }
                                className="
                                  inline-flex
                                  h-[35px]
                                  items-center
                                  gap-[5px]
                                  rounded-[5px]
                                  border
                                  border-[#c9c9c9]
                                  bg-white
                                  px-[10px]
                                  text-[15px]
                                  font-normal
                                  text-[#333]
                                  transition
                                  hover:bg-[#f7f7f7]
                                "
                              >
                                <Settings
                                  size={15}
                                />

                                Options

                                <MoreVertical
                                  size={14}
                                />
                              </button>

                              {dropdownOpen[
                                repairCost._id
                              ] && (
                                <div
                                  className="
                                    absolute
                                    right-0
                                    z-30
                                    mt-1
                                    min-w-[145px]
                                    overflow-hidden
                                    rounded-[4px]
                                    border
                                    border-[#ddd]
                                    bg-white
                                    py-1
                                    shadow-lg
                                  "
                                >
                                  {/* Edit */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditRepairCost(
                                        repairCost,
                                      )
                                    }
                                    className="
                                      flex
                                      w-full
                                      items-center
                                      gap-2
                                      px-3
                                      py-2
                                      text-left
                                      text-[14px]
                                      text-gray-700
                                      transition
                                      hover:bg-[#eef4fb]
                                      hover:text-[#2f5fa7]
                                    "
                                  >
                                    <Pencil
                                      size={15}
                                    />

                                    Edit
                                  </button>

                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteRepairCost(
                                        repairCost._id,
                                      )
                                    }
                                    className="
                                      flex
                                      w-full
                                      items-center
                                      gap-2
                                      px-3
                                      py-2
                                      text-left
                                      text-[14px]
                                      text-red-600
                                      transition
                                      hover:bg-red-50
                                    "
                                  >
                                    <Trash2
                                      size={15}
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
                        className="
                          bg-[#f1f1f1]
                          px-4
                          py-[14px]
                          text-center
                          text-[16px]
                          text-[#111]
                        "
                      >
                        No repair costs
                        found. Add your
                        first repair cost.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      <AddRepairedCost
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingRepairCost(
            null,
          );
        }}
        onRepairCostAdded={
          handleRepairCostAdded
        }
        repairCost={
          editingRepairCost
        }
      />

      {/* ================= IMPORT MODAL ================= */}
      <ImportRepairCostsModal
        visible={showImportModal}
        onClose={() =>
          setShowImportModal(false)
        }
        onImportComplete={
          handleImportComplete
        }
      />
    </div>
  );
};

RepairedCostList.propTypes = {};

export default RepairedCostList;