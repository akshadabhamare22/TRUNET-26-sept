import React, { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
} from "lucide-react";

const TaxList = () => {
  const staticData = [
    {
      title: "SGST@9%",
      category: "SGST",
      rate: 9,
      remark: "",
      status: "Enable",
    },
    {
      title: "CGST@9%",
      category: "CGST",
      rate: 9,
      remark: "",
      status: "Enable",
    },
    {
      title: "IGST@9%",
      category: "IGST",
      rate: 9,
      remark: "",
      status: "Enable",
    },
    {
      title: "IGST@18%",
      category: "IGST",
      rate: 18,
      remark: "",
      status: "Enable",
    },
    {
      title: "SGST@2.5%",
      category: "SGST",
      rate: 2.5,
      remark: "",
      status: "Enable",
    },
    {
      title: "CGST@2.5%",
      category: "CGST",
      rate: 2.5,
      remark: "",
      status: "Enable",
    },
    {
      title: "IGST@5%",
      category: "IGST",
      rate: 5,
      remark: "",
      status: "Enable",
    },
    {
      title: "SGST@6%",
      category: "SGST",
      rate: 6,
      remark: "",
      status: "Enable",
    },
    {
      title: "CGST@6%",
      category: "CGST",
      rate: 6,
      remark: "",
      status: "Enable",
    },
    {
      title: "IGST@12%",
      category: "IGST",
      rate: 12,
      remark: "",
      status: "Enable",
    },
    {
      title: "SGST@14%",
      category: "SGST",
      rate: 14,
      remark: "",
      status: "Enable",
    },
    {
      title: "CGST@14%",
      category: "CGST",
      rate: 14,
      remark: "",
      status: "Enable",
    },
    {
      title: "IGST@28%",
      category: "IGST",
      rate: 28,
      remark: "",
      status: "Enable",
    },
  ];

  const [data, setData] =
    useState(staticData);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [sortConfig, setSortConfig] =
    useState({
      key: null,
      direction: "ascending",
    });

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
        if (a[key] < b[key]) {
          return direction ===
            "ascending"
            ? -1
            : 1;
        }

        if (a[key] > b[key]) {
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
    (item) =>
      item.title
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase(),
        ) ||
      item.category
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase(),
        ),
  );

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* ==================================================
          PAGE TITLE
      ================================================== */}
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Tax List
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
          border-[#e5e7eb]
          bg-white
          shadow-[0_1px_3px_rgba(0,0,0,0.04)]
        "
      >
        {/* Top blue line */}
        <div className="h-[4px] w-full bg-[#2f5fa7]" />

        {/* ==================================================
            CARD BODY
        ================================================== */}
        <div
          className="
            px-[18px]
            pb-[18px]
            pt-[17px]
          "
        >
          {/* ==================================================
              SEARCH
          ================================================== */}
          <div
            className="
              mb-[18px]
              flex
              items-center
              justify-end
            "
          >
            <div
              className="
                flex
                items-center
                gap-[7px]
              "
            >
              <label
                htmlFor="tax-search"
                className="
                  whitespace-nowrap
                  text-[16px]
                  font-semibold
                  text-[#111827]
                "
              >
                Search:
              </label>

              <input
                id="tax-search"
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
                  border-[#d6dce3]
                  bg-white
                  px-[9px]
                  text-[14px]
                  text-[#343a40]
                  outline-none
                  transition
                  focus:border-[#2f5fa7]
                  focus:ring-1
                  focus:ring-[#2f5fa7]/20
                "
              />
            </div>
          </div>

          {/* ==================================================
              TABLE CONTAINER
              ONLY VERTICAL SCROLL
          ================================================== */}
          <div
            className="
              h-[535px]
              w-full
              overflow-y-auto
              overflow-x-hidden
              border
              border-[#e1e5e9]
              scrollbar-thin
              scrollbar-thumb-[#9ca3af]
              scrollbar-track-[#f1f3f5]
            "
          >
            <table
              className="
                w-full
                table-fixed
                border-collapse
              "
            >
              {/* ==================================================
                  TABLE HEADER
              ================================================== */}
              <thead
                className="
                  sticky
                  top-0
                  z-20
                  bg-white
                "
              >
                <tr>
                  {/* Title */}
                  <SortableHeader
                    label="Title"
                    sortKey="title"
                    onSort={
                      handleSort
                    }
                    getSortIcon={
                      getSortIcon
                    }
                    className="w-[25%]"
                  />

                  {/* Category */}
                  <SortableHeader
                    label="Category"
                    sortKey="category"
                    onSort={
                      handleSort
                    }
                    getSortIcon={
                      getSortIcon
                    }
                    className="w-[18%]"
                  />

                  {/* Rate */}
                  <SortableHeader
                    label="Rate"
                    sortKey="rate"
                    onSort={
                      handleSort
                    }
                    getSortIcon={
                      getSortIcon
                    }
                    className="w-[12%]"
                  />

                  {/* Remark */}
                  <th
                    className="
                      w-[25%]
                      whitespace-nowrap
                      border-b
                      border-r
                      border-[#e1e5e9]
                      bg-white
                      px-[9px]
                      py-[11px]
                      text-left
                      text-[16px]
                      font-semibold
                      text-[#111827]
                    "
                  >
                    Remark
                  </th>

                  {/* Status */}
                  <th
                    className="
                      w-[20%]
                      whitespace-nowrap
                      border-b
                      border-[#e1e5e9]
                      bg-white
                      px-[9px]
                      py-[11px]
                      text-left
                      text-[16px]
                      font-semibold
                      text-[#111827]
                    "
                  >
                    Status
                  </th>
                </tr>
              </thead>

              {/* ==================================================
                  TABLE BODY
              ================================================== */}
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map(
                    (
                      item,
                      index,
                    ) => (
                      <tr
                        key={`${item.title}-${index}`}
                        className="
                          transition-colors
                          duration-100
                          even:bg-[#f1f1f1]
                          odd:bg-white
                          hover:bg-[#eaf2fb]
                        "
                      >
                        {/* Title */}
                        <td
                          className="
                            overflow-hidden
                            border-b
                            border-r
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            text-[16px]
                            text-[#111827]
                          "
                        >
                          <div className="truncate">
                            {
                              item.title
                            }
                          </div>
                        </td>

                        {/* Category */}
                        <td
                          className="
                            overflow-hidden
                            border-b
                            border-r
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            text-[16px]
                            text-[#111827]
                          "
                        >
                          <div className="truncate">
                            {
                              item.category
                            }
                          </div>
                        </td>

                        {/* Rate */}
                        <td
                          className="
                            border-b
                            border-r
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            text-[16px]
                            text-[#111827]
                          "
                        >
                          {
                            item.rate
                          }
                        </td>

                        {/* Remark */}
                        <td
                          className="
                            overflow-hidden
                            border-b
                            border-r
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                            text-[16px]
                            text-[#111827]
                          "
                        >
                          <div className="truncate">
                            {
                              item.remark
                            }
                          </div>
                        </td>

                        {/* Status */}
                        <td
                          className="
                            border-b
                            border-[#e5e7eb]
                            px-[9px]
                            py-[9px]
                          "
                        >
                          <span
                            className="
                              inline-flex
                              items-center
                              rounded-[5px]
                              bg-[#198754]
                              px-[10px]
                              py-[3px]
                              text-[13px]
                              font-medium
                              text-white
                            "
                          >
                            {
                              item.status
                            }
                          </span>
                        </td>
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="
                        px-4
                        py-[35px]
                        text-center
                        text-[15px]
                        text-gray-500
                      "
                    >
                      No records found
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

// ==================================================
// SORTABLE HEADER
// ==================================================
const SortableHeader = ({
  label,
  sortKey,
  onSort,
  getSortIcon,
  className = "",
}) => {
  return (
    <th
      scope="col"
      onClick={() =>
        onSort(sortKey)
      }
      className={`
        ${className}
        sticky
        top-0
        z-20
        cursor-pointer
        whitespace-nowrap
        border-b
        border-r
        border-[#e1e5e9]
        bg-white
        px-[9px]
        py-[11px]
        text-left
        text-[16px]
        font-semibold
        text-[#111827]
        transition
        hover:bg-[#f5f7fa]
      `}
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-[5px]
        "
      >
        <span>
          {label}
        </span>

        {getSortIcon(
          sortKey,
        )}
      </div>
    </th>
  );
};

export default TaxList;