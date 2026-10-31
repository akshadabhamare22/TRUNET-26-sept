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
} from "../../../utils/sweetAlerts";

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
      <ArrowUp
        size={14}
        strokeWidth={2}
      />
    ) : (
      <ArrowDown
        size={14}
        strokeWidth={2}
      />
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

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* ================================================= */}
      {/* PAGE TITLE */}
      {/* ================================================= */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Role List
      </div>

      {/* ================================================= */}
      {/* MAIN CARD */}
      {/* ================================================= */}
      <div
        className="
          overflow-hidden
          rounded-[2px]
          border
          border-[#e1e5e9]
          bg-white
          shadow-[0_2px_5px_rgba(0,0,0,0.06)]
        "
      >
        {/* ================================================= */}
        {/* BLUE TOP BORDER */}
        {/* ================================================= */}
        <div className="h-[4px] w-full bg-[#2f64ad]" />

        {/* ================================================= */}
        {/* TOOLBAR */}
        {/* ================================================= */}
        <div
          className="
            flex
            min-h-[68px]
            flex-col
            gap-3
            border-b
            border-[#e1e5e9]
            bg-white
            px-[17px]
            py-[10px]
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Add Button */}
          <div className="flex items-center">
            <Link to="/add-role">
              <button
                type="button"
                className="
                  inline-flex
                  h-[36px]
                  items-center
                  gap-[5px]
                  rounded-[4px]
                  bg-[#2f64ad]
                  px-[11px]
                  text-[15px]
                  font-medium
                  text-white
                  shadow-none
                  transition-all
                  duration-200
                  hover:bg-[#245494]
                  focus:outline-none
                "
              >
                <Plus
                  size={17}
                  strokeWidth={2}
                />

                Add
              </button>
            </Link>
          </div>

          {/* Pagination */}
          <div className="flex items-center">
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

        {/* ================================================= */}
        {/* CARD BODY */}
        {/* ================================================= */}
        <div className="px-[17px] pb-[20px] pt-[17px]">
          {/* ================================================= */}
          {/* SEARCH */}
          {/* ================================================= */}
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
                w-full
                items-center
                justify-end
                gap-[5px]
                sm:w-auto
              "
            >
              <label
                htmlFor="role-search"
                className="
                  whitespace-nowrap
                  text-[15px]
                  font-semibold
                  text-[#202124]
                "
              >
                Search:
              </label>

              <div className="relative">
                <Search
                  size={15}
                  strokeWidth={1.8}
                  className="
                    pointer-events-none
                    absolute
                    left-[9px]
                    top-1/2
                    -translate-y-1/2
                    text-[#777]
                  "
                />

                <input
                  id="role-search"
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
                    h-[34px]
                    w-full
                    rounded-[2px]
                    border
                    border-[#d8dadd]
                    bg-white
                    pl-[30px]
                    pr-[9px]
                    text-[14px]
                    text-[#212529]
                    outline-none
                    transition
                    focus:border-[#2f64ad]
                    focus:ring-0
                    sm:w-[237px]
                  "
                />
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* TABLE CONTAINER */}
          {/* ================================================= */}
          <div
            className="
              w-full
              overflow-hidden
              border
              border-[#e3e5e8]
            "
          >
            {/* Vertical Scroll Only */}
            <div
              className="
                max-h-[500px]
                overflow-y-auto
                overflow-x-hidden
                scrollbar-thin
                scrollbar-track-[#f1f1f1]
                scrollbar-thumb-[#a7a7a7]
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
                {/* ================================================= */}
                {/* TABLE HEADER */}
                {/* ================================================= */}
                <thead className="sticky top-0 z-20 bg-white">
                  <tr className="bg-[#ffffff]">
                    {/* ID */}
                    <th
                      onClick={() =>
                        handleSort(
                          "username",
                        )
                      }
                      className="
                        w-[8%]
                        cursor-pointer
                        border-b
                        border-r
                        border-[#e5e5e5]
                        px-[9px]
                        py-[11px]
                        text-left
                        font-bold
                        text-[#111]
                        transition
                        hover:bg-[#f5f5f5]
                      "
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span>
                          ID
                        </span>

                        {getSortIcon(
                          "username",
                        )}
                      </div>
                    </th>

                    {/* Role */}
                    <th
                      onClick={() =>
                        handleSort(
                          "name",
                        )
                      }
                      className="
                        w-[18%]
                        cursor-pointer
                        border-b
                        border-r
                        border-[#e5e5e5]
                        px-[9px]
                        py-[11px]
                        text-left
                        font-bold
                        text-[#111]
                        transition
                        hover:bg-[#f5f5f5]
                      "
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span>
                          Role
                        </span>

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
                      className="
                        w-[64%]
                        cursor-pointer
                        border-b
                        border-r
                        border-[#e5e5e5]
                        px-[9px]
                        py-[11px]
                        text-left
                        font-bold
                        text-[#111]
                        transition
                        hover:bg-[#f5f5f5]
                      "
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span>
                          Permission
                        </span>

                        {getSortIcon(
                          "center.centerName",
                        )}
                      </div>
                    </th>

                    {/* Action */}
                    <th
                      className="
                        w-[10%]
                        border-b
                        border-[#e5e5e5]
                        px-[9px]
                        py-[11px]
                        text-left
                        font-bold
                        text-[#111]
                      "
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                {/* ================================================= */}
                {/* TABLE BODY */}
                {/* ================================================= */}
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
                          className="
                            align-top
                            transition-colors
                            even:bg-[#ffffff]
                            odd:bg-[#f1f1f1]
                            hover:bg-[#eaf2fb]
                          "
                        >
                          {/* ID */}
                          <td
                            className="
                              border-b
                              border-r
                              border-[#e5e5e5]
                              px-[9px]
                              py-[10px]
                              align-top
                              text-[16px]
                              text-[#111]
                            "
                          >
                            {index + 1}
                          </td>

                          {/* Role */}
                          <td
                            className="
                              border-b
                              border-r
                              border-[#e5e5e5]
                              px-[9px]
                              py-[10px]
                              align-top
                              text-[16px]
                              font-normal
                              text-[#111]
                              break-words
                            "
                          >
                            {
                              item.roleTitle
                            }
                          </td>

                          {/* Permissions */}
                          <td
                            className="
                              border-b
                              border-r
                              border-[#e5e5e5]
                              px-[9px]
                              py-[8px]
                              align-top
                              text-[15px]
                              text-[#111]
                            "
                          >
                            {item.permissions &&
                            item
                              .permissions
                              .length >
                              0 ? (
                              <div className="space-y-[2px]">
                                {item.permissions.map(
                                  (
                                    permissionModule,
                                    moduleIndex,
                                  ) => (
                                    <div
                                      key={`${item._id}-${moduleIndex}`}
                                      className="space-y-[1px]"
                                    >
                                      {permissionModule.permissions?.map(
                                        (
                                          permission,
                                          permissionIndex,
                                        ) => (
                                          <div
                                            key={`${item._id}-${moduleIndex}-${permissionIndex}`}
                                            className="
                                              break-words
                                              leading-[21px]
                                              text-[#111]
                                            "
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
                              <span className="text-[14px] text-[#999]">
                                No
                                Permissions
                              </span>
                            )}
                          </td>

                          {/* Action */}
                          <td
                            className="
                              relative
                              border-b
                              border-[#e5e5e5]
                              px-[9px]
                              py-[9px]
                              align-top
                            "
                          >
                            <div
                              className="relative inline-block"
                              ref={(el) => {
                                dropdownRefs.current[
                                  item._id
                                ] =
                                  el;
                              }}
                            >
                              {/* Options Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  toggleDropdown(
                                    item._id,
                                  )
                                }
                                className="
                                  inline-flex
                                  h-[34px]
                                  items-center
                                  gap-[5px]
                                  whitespace-nowrap
                                  rounded-[5px]
                                  border
                                  border-[#bfc3c7]
                                  bg-[#fff]
                                  px-[9px]
                                  text-[14px]
                                  font-normal
                                  text-[#333]
                                  transition-all
                                  duration-150
                                  hover:bg-[#f4f4f4]
                                  focus:outline-none
                                "
                              >
                                <Settings
                                  size={16}
                                  strokeWidth={
                                    1.8
                                  }
                                />

                                Options
                              </button>

                              {/* Dropdown */}
                              {dropdownOpen[
                                item._id
                              ] && (
                                <div
                                  className="
                                    absolute
                                    right-0
                                    z-50
                                    mt-[4px]
                                    min-w-[145px]
                                    overflow-hidden
                                    rounded-[4px]
                                    border
                                    border-[#d9d9d9]
                                    bg-white
                                    py-[3px]
                                    shadow-[0_5px_15px_rgba(0,0,0,0.18)]
                                  "
                                >
                                  {/* Edit */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditData(
                                        item._id,
                                      )
                                    }
                                    className="
                                      flex
                                      w-full
                                      items-center
                                      gap-[8px]
                                      px-[12px]
                                      py-[8px]
                                      text-left
                                      text-[14px]
                                      text-[#333]
                                      transition
                                      hover:bg-[#f2f5f8]
                                    "
                                  >
                                    <Pencil
                                      size={
                                        15
                                      }
                                      strokeWidth={
                                        1.8
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
                                      size={
                                        15
                                      }
                                      strokeWidth={
                                        1.8
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
                        className="
                          border-b
                          border-[#e5e5e5]
                          px-4
                          py-10
                          text-center
                          text-[15px]
                          text-[#777]
                        "
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
    </div>
  );
};

export default RoleList;