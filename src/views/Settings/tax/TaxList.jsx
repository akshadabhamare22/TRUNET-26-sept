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
        className="ml-1"
      />
    ) : (
      <ArrowDown
        size={14}
        className="ml-1"
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
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-4 text-2xl font-semibold text-gray-800">
        Tax List
      </div>

      {/* Main Card */}
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-4">
          {/* Search */}
          <div className="mb-4 flex justify-end">
            <div className="flex w-full items-center justify-end gap-2">
              <label
                htmlFor="tax-search"
                className="text-sm font-medium text-gray-700"
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
                className="h-8 w-full max-w-[350px] border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
                  />

                  {/* Remark */}
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Remark
                  </th>

                  {/* Status */}
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredData.length >
                0 ? (
                  filteredData.map(
                    (item, index) => (
                      <tr
                        key={`${item.title}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.title}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700">
                          {
                            item.category
                          }
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.rate}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.remark}
                        </td>

                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-sm text-gray-500"
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

// --------------------------------------------------
// Sortable Header
// --------------------------------------------------
const SortableHeader = ({
  label,
  sortKey,
  onSort,
  getSortIcon,
}) => {
  return (
    <th
      scope="col"
      onClick={() =>
        onSort(sortKey)
      }
      className="cursor-pointer whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 hover:bg-gray-100"
    >
      <div className="flex items-center justify-between gap-2">
        <span>{label}</span>

        {getSortIcon(sortKey)}
      </div>
    </th>
  );
};

export default TaxList;