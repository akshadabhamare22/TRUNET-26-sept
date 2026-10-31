

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
  Settings,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../../../axiosInstance";
import {
  confirmDelete,
  showSuccess,
} from "../../../utils/sweetAlerts";

import AddArea from "./AddArea";
import Pagination from "../../../utils/Pagination";

const AreaList = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dropdownRefs = useRef({});
  const navigate = useNavigate();

  // --------------------------------------------------
  // Fetch Areas
  // --------------------------------------------------
  const fetchAreas = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `/areas?page=${page}`,
      );

      if (response.data.success) {
        setAreas(response.data.data.areas);

        setCurrentPage(
          response.data.data.pagination.currentPage,
        );

        setTotalPages(
          response.data.data.pagination.totalPages,
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
    fetchAreas(1);
  }, []);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    fetchAreas(page);
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

    const sortedData = [...areas].sort((a, b) => {
      let aValue = a;
      let bValue = b;

      if (key.includes(".")) {
        const keys = key.split(".");

        aValue = keys.reduce(
          (obj, k) => obj && obj[k],
          a,
        );

        bValue = keys.reduce(
          (obj, k) => obj && obj[k],
          b,
        );
      } else {
        aValue = a[key];
        bValue = b[key];
      }

      if (aValue < bValue) {
        return direction === "ascending"
          ? -1
          : 1;
      }

      if (aValue > bValue) {
        return direction === "ascending"
          ? 1
          : -1;
      }

      return 0;
    });

    setAreas(sortedData);
  };

  // --------------------------------------------------
  // Sort Icon
  // --------------------------------------------------
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
  const filteredData = areas.filter((area) =>
    Object.values(area).some((value) => {
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
    }),
  );

  // --------------------------------------------------
  // Delete Area
  // --------------------------------------------------
  const handleDeleteArea = async (areaId) => {
    const result = await confirmDelete();

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(
          `/areas/${areaId}`,
        );

        fetchAreas(currentPage);

        showSuccess(
          "Area deleted successfully!",
        );
      } catch (error) {
        console.error(
          "Error deleting area:",
          error,
        );
      }
    }
  };

  // --------------------------------------------------
  // Add / Edit Callback
  // --------------------------------------------------
  const handleAreaAdded = async (
    newArea,
    isEdit,
  ) => {
    if (isEdit) {
      setAreas((prev) =>
        prev.map((item) =>
          item._id === newArea._id
            ? newArea
            : item,
        ),
      );
    } else {
      fetchAreas(currentPage);
    }
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------
  const handleEditArea = (area) => {
    setEditingArea(area);
    setShowModal(true);
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
  // Close dropdown when clicking outside
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {};
      let shouldUpdate = false;

      Object.keys(dropdownRefs.current).forEach(
        (key) => {
          const dropdown =
            dropdownRefs.current[key];

          if (
            dropdown &&
            !dropdown.contains(event.target)
          ) {
            newDropdownState[key] = false;
            shouldUpdate = true;
          }
        },
      );

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
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div
        className="m-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
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

        Area List
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
          border-[#e4e4e4]
          bg-white
          shadow-[0_2px_7px_rgba(0,0,0,0.08)]
        "
      >
        {/* Blue top border */}
        <div className="h-[4px] w-full bg-[#2f64ad]" />

        {/* ==================================================
            CARD TOP ACTION BAR
        ================================================== */}
        <div
          className="
            flex
            min-h-[51px]
            items-center
            justify-between
            border-b
            border-[#e3e3e3]
            px-[17px]
            py-[8px]
          "
        >
          {/* Add Button */}
          <button
            type="button"
            onClick={() => {
              setEditingArea(null);
              setShowModal(true);
            }}
            className="
              inline-flex
              h-[36px]
              items-center
              gap-[4px]
              rounded-[4px]
              bg-[#2f64ad]
              px-[10px]
              text-[16px]
              font-medium
              text-white
              transition
              duration-150
              hover:bg-[#25599e]
              focus:outline-none
              focus:ring-2
              focus:ring-[#2f64ad]/30
            "
          >
            <Plus size={18} strokeWidth={2} />
            Add
          </button>

          {/* Pagination */}
          <div className="flex items-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* ==================================================
            CARD BODY
        ================================================== */}
        <div className="px-[17px] pb-[16px] pt-[17px]">
          {/* Search */}
          <div
            className="
              mb-[16px]
              flex
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
                htmlFor="area-search"
                className="
                  whitespace-nowrap
                  text-[16px]
                  font-semibold
                  text-[#222]
                "
              >
                Search:
              </label>

              <input
                id="area-search"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value,
                  )
                }
                className="
                  h-[34px]
                  w-[237px]
                  rounded-[1px]
                  border
                  border-[#d8dfe7]
                  bg-white
                  px-[9px]
                  text-[14px]
                  text-[#222]
                  outline-none
                  transition
                  focus:border-[#2f64ad]
                  focus:ring-1
                  focus:ring-[#2f64ad]/20
                "
              />
            </div>
          </div>

          {/* ==================================================
              TABLE
          ================================================== */}
          <div
            className="
              w-full
              overflow-hidden
              border
              border-[#e1e1e1]
            "
          >
            {/* Vertical scroll container */}
            <div
              className="
                max-h-[505px]
                overflow-y-auto
                overflow-x-hidden
                scrollbar-thin
                scrollbar-track-gray-100
                scrollbar-thumb-gray-400
              "
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
                <thead className="sticky top-0 z-20">
                  <tr className="bg-white">
                    {/* SR No */}
                    <th
                      className="
                        w-[8.5%]
                        border-b
                        border-r
                        border-[#e5e5e5]
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

                    {/* Reseller */}
                    <th
                      onClick={() =>
                        handleSort(
                          "reseller.businessName",
                        )
                      }
                      className="
                        w-[39%]
                        cursor-pointer
                        border-b
                        border-r
                        border-[#e5e5e5]
                        bg-white
                        px-[10px]
                        py-[11px]
                        text-left
                        text-[16px]
                        font-semibold
                        text-[#111]
                        transition
                        hover:bg-[#f7f7f7]
                      "
                    >
                      <div className="flex items-center">
                        <span>
                          Reseller Name
                        </span>

                        {getSortIcon(
                          "reseller.businessName",
                        )}
                      </div>
                    </th>

                    {/* Area */}
                    <th
                      onClick={() =>
                        handleSort(
                          "areaName",
                        )
                      }
                      className="
                        w-[32%]
                        cursor-pointer
                        border-b
                        border-r
                        border-[#e5e5e5]
                        bg-white
                        px-[10px]
                        py-[11px]
                        text-left
                        text-[16px]
                        font-semibold
                        text-[#111]
                        transition
                        hover:bg-[#f7f7f7]
                      "
                    >
                      <div className="flex items-center">
                        <span>
                          Area Name
                        </span>

                        {getSortIcon(
                          "areaName",
                        )}
                      </div>
                    </th>

                    {/* Action */}
                    <th
                      className="
                        w-[20.5%]
                        border-b
                        border-[#e5e5e5]
                        bg-white
                        px-[10px]
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

                {/* ==================================================
                    TABLE BODY
                ================================================== */}
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map(
                      (area, index) => (
                        <tr
                          key={area._id}
                          className="
                            transition
                            hover:bg-[#f7f7f7]
                          "
                        >
                          {/* SR No */}
                          <td
                            className={`
                              border-b
                              border-r
                              border-[#e7e7e7]
                              px-[9px]
                              py-[9px]
                              text-[16px]
                              text-[#111]
                              ${
                                index % 2 === 0
                                  ? "bg-[#f1f1f1]"
                                  : "bg-white"
                              }
                            `}
                          >
                            {(currentPage - 1) *
                              100 +
                              index +
                              1}
                          </td>

                          {/* Reseller Name */}
                          <td
                            className={`
                              border-b
                              border-r
                              border-[#e7e7e7]
                              px-[10px]
                              py-[9px]
                              text-[16px]
                              text-[#111]
                              ${
                                index % 2 === 0
                                  ? "bg-[#f1f1f1]"
                                  : "bg-white"
                              }
                            `}
                          >
                            <div className="truncate">
                              {area.reseller
                                ?.businessName ||
                                "-"}
                            </div>
                          </td>

                          {/* Area Name */}
                          <td
                            className={`
                              border-b
                              border-r
                              border-[#e7e7e7]
                              px-[10px]
                              py-[9px]
                              text-[16px]
                              text-[#111]
                              ${
                                index % 2 === 0
                                  ? "bg-[#f1f1f1]"
                                  : "bg-white"
                              }
                            `}
                          >
                            <div className="truncate">
                              {area.areaName ||
                                "-"}
                            </div>
                          </td>

                          {/* Action */}
                          <td
                            className={`
                              relative
                              border-b
                              border-[#e7e7e7]
                              px-[10px]
                              py-[7px]
                              ${
                                index % 2 === 0
                                  ? "bg-[#f1f1f1]"
                                  : "bg-white"
                              }
                            `}
                          >
                            <div
                              className="relative inline-block"
                              ref={(el) => {
                                dropdownRefs.current[
                                  area._id
                                ] = el;
                              }}
                            >
                              {/* Options Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  toggleDropdown(
                                    area._id,
                                  )
                                }
                                className="
                                  inline-flex
                                  h-[34px]
                                  items-center
                                  gap-[5px]
                                  rounded-[5px]
                                  border
                                  border-[#bfc3c8]
                                  bg-[#f8f8f8]
                                  px-[9px]
                                  text-[15px]
                                  font-normal
                                  text-[#30343b]
                                  transition
                                  hover:bg-[#eeeeee]
                                  focus:outline-none
                                "
                              >
                                <Settings
                                  size={16}
                                  strokeWidth={1.8}
                                />

                                <span>
                                  Options
                                </span>

                                <MoreVertical
                                  size={14}
                                  strokeWidth={1.8}
                                />
                              </button>

                              {/* Dropdown */}
                              {dropdownOpen[
                                area._id
                              ] && (
                                <div
                                  className="
                                    absolute
                                    right-0
                                    top-[38px]
                                    z-50
                                    w-[145px]
                                    overflow-hidden
                                    rounded-[4px]
                                    border
                                    border-[#ddd]
                                    bg-white
                                    py-[4px]
                                    shadow-[0_4px_14px_rgba(0,0,0,0.16)]
                                  "
                                >
                                  {/* Edit */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleEditArea(
                                        area,
                                      );

                                      setDropdownOpen(
                                        (prev) => ({
                                          ...prev,
                                          [area._id]:
                                            false,
                                        }),
                                      );
                                    }}
                                    className="
                                      flex
                                      w-full
                                      items-center
                                      gap-[8px]
                                      px-[12px]
                                      py-[8px]
                                      text-left
                                      text-[14px]
                                      text-gray-700
                                      transition
                                      hover:bg-gray-100
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
                                    onClick={() => {
                                      handleDeleteArea(
                                        area._id,
                                      );

                                      setDropdownOpen(
                                        (prev) => ({
                                          ...prev,
                                          [area._id]:
                                            false,
                                        }),
                                      );
                                    }}
                                    className="
                                      flex
                                      w-full
                                      items-center
                                      gap-[8px]
                                      px-[12px]
                                      py-[8px]
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
                          border-b
                          border-[#e5e5e5]
                          bg-[#f3f3f3]
                          px-4
                          py-[20px]
                          text-center
                          text-[15px]
                          text-gray-600
                        "
                      >
                        No area found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          ADD / EDIT AREA MODAL
      ================================================== */}
      <AddArea
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingArea(null);
        }}
        onAreaAdded={handleAreaAdded}
        area={editingArea}
      />
    </div>
  );
};

export default AreaList;