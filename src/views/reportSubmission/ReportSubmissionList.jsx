

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Download,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Copy,
} from 'lucide-react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import Swal from 'sweetalert2';

import axiosInstance from '../../axiosInstance';
import {
  formatDate,
  formatDateTime,
} from '../../utils/FormatDateTime';
import ReportSearchmodel from './ReportSearchModel';

const ReportSubmissionList = () => {
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
      direction: 'ascending',
    });

  const [searchTerm, setSearchTerm] =
    useState('');

  const [
    searchModalVisible,
    setSearchModalVisible,
  ] = useState(false);

  const [dropdownOpen, setDropdownOpen] =
    useState({});

  const [activeSearch, setActiveSearch] =
    useState({
      center: '',
      date: '',
    });

  const [exportLoading, setExportLoading] =
    useState(false);

  const dropdownRefs =
    useRef({});

  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem('user')
    ) || {};

  const userRole = (
    user?.role?.roleTitle || ''
  ).toLowerCase();

  /* =========================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      Object.keys(
        dropdownRefs.current
      ).forEach((key) => {
        const ref =
          dropdownRefs.current[key];

        if (
          ref &&
          !ref.contains(event.target)
        ) {
          setDropdownOpen(
            (prev) => ({
              ...prev,
              [key]: false,
            })
          );
        }
      });
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     FETCH REPORT SUBMISSIONS
  ========================================================= */

  const fetchData = async (
    searchParams = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params =
        new URLSearchParams();

      if (searchParams.center) {
        params.append(
          'center',
          searchParams.center
        );
      }

      if (
        searchParams.date &&
        searchParams.date.includes(
          ' to '
        )
      ) {
        const [
          startDateStr,
          endDateStr,
        ] =
          searchParams.date.split(
            ' to '
          );

        const convertDateFormat = (
          dateStr
        ) => {
          const [
            day,
            month,
            year,
          ] = dateStr.split('-');

          return `${year}-${month}-${day}`;
        };

        params.append(
          'startDate',
          convertDateFormat(
            startDateStr
          )
        );

        params.append(
          'endDate',
          convertDateFormat(
            endDateStr
          )
        );
      }

      const url = params.toString()
        ? `/reportsubmission?${params.toString()}`
        : '/reportsubmission';

      const response =
        await axiosInstance.get(
          url
        );

      if (response.data.success) {
        setData(
          response.data.data || []
        );
      } else {
        throw new Error(
          'API returned unsuccessful response'
        );
      }
    } catch (err) {
      setError(
        err.message
      );

      console.error(
        'Error fetching data:',
        err
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH CENTERS
  ========================================================= */

  const fetchCenters = async () => {
    try {
      const response =
        await axiosInstance.get(
          '/centers?centerType=Center'
        );

      if (response.data.success) {
        setCenters(
          response.data.data || []
        );
      }
    } catch (err) {
      console.error(
        'Error fetching centers:',
        err
      );
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchData();
    fetchCenters();
  }, []);

  /* =========================================================
     NESTED VALUE
  ========================================================= */

  const getNestedValue = (
    object,
    key
  ) => {
    return key
      .split('.')
      .reduce(
        (value, currentKey) =>
          value?.[currentKey],
        object
      );
  };

  /* =========================================================
     SORT
  ========================================================= */

  const handleSort = (key) => {
    let direction =
      'ascending';

    if (
      sortConfig.key === key &&
      sortConfig.direction ===
        'ascending'
    ) {
      direction =
        'descending';
    }

    setSortConfig({
      key,
      direction,
    });

    const sortedData = [
      ...data,
    ].sort((a, b) => {
      let aValue =
        getNestedValue(
          a,
          key
        );

      let bValue =
        getNestedValue(
          b,
          key
        );

      if (
        aValue == null
      ) {
        aValue = '';
      }

      if (
        bValue == null
      ) {
        bValue = '';
      }

      if (
        aValue instanceof Date
      ) {
        aValue =
          aValue.getTime();
      }

      if (
        bValue instanceof Date
      ) {
        bValue =
          bValue.getTime();
      }

      if (
        typeof aValue ===
          'string' &&
        typeof bValue ===
          'string'
      ) {
        aValue =
          aValue.toLowerCase();

        bValue =
          bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return direction ===
          'ascending'
          ? -1
          : 1;
      }

      if (aValue > bValue) {
        return direction ===
          'ascending'
          ? 1
          : -1;
      }

      return 0;
    });

    setData(sortedData);
  };

  /* =========================================================
     SORT ICON
  ========================================================= */

  const getSortIcon = (key) => {
    if (
      sortConfig.key !== key
    ) {
      return null;
    }

    return sortConfig.direction ===
      'ascending' ? (
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

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (
    searchData
  ) => {
    setActiveSearch(
      searchData
    );

    fetchData(searchData);
  };

  /* =========================================================
     RESET SEARCH
  ========================================================= */

  const handleResetSearch = () => {
    const emptySearch = {
      center: '',
      date: '',
    };

    setActiveSearch(
      emptySearch
    );

    setSearchTerm('');

    fetchData();
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleClick = (
    itemId
  ) => {
    navigate(
      `/edit-reportSubmission/${itemId}`
    );
  };

  /* =========================================================
     APPROVE
  ========================================================= */

  const handleApprove = async (
    item
  ) => {
    setDropdownOpen(
      (prev) => ({
        ...prev,
        [item._id]: false,
      })
    );

    const result =
      await Swal.fire({
        title:
          'Are you sure?',
        text:
          'You want to approve this stock closing entry?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor:
          '#2563eb',
        cancelButtonColor:
          '#6b7280',
        confirmButtonText:
          'Yes, approve it!',
        cancelButtonText:
          'Cancel',
      });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response =
        await axiosInstance.patch(
          `/reportsubmission/${item._id}/status`,
          {
            status:
              'Approved',
          }
        );

      if (response.data.success) {
        setData(
          (prevData) =>
            prevData.map(
              (customer) =>
                customer._id ===
                item._id
                  ? {
                      ...customer,
                      status:
                        'Approved',
                    }
                  : customer
            )
        );

        Swal.fire(
          'Approved!',
          'Stock closing has been approved successfully.',
          'success'
        );
      } else {
        throw new Error(
          response.data
            .message ||
            'Failed to approve'
        );
      }
    } catch (err) {
      console.error(
        'Error approving stock closing:',
        err
      );

      Swal.fire(
        'Error!',
        err.response?.data
          ?.message ||
          'Failed to approve stock closing.',
        'error'
      );
    }
  };

  /* =========================================================
     DUPLICATE
  ========================================================= */

  const handleDuplicate = async (
    item
  ) => {
    setDropdownOpen(
      (prev) => ({
        ...prev,
        [item._id]: false,
      })
    );

    const result =
      await Swal.fire({
        title:
          'Are you sure?',
        text:
          'You want to mark this stock closing entry as duplicate?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor:
          '#dc2626',
        cancelButtonColor:
          '#6b7280',
        confirmButtonText:
          'Yes, mark as duplicate!',
        cancelButtonText:
          'Cancel',
      });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response =
        await axiosInstance.patch(
          `/reportsubmission/${item._id}/status`,
          {
            status:
              'Duplicate',
          }
        );

      if (response.data.success) {
        setData(
          (prevData) =>
            prevData.map(
              (customer) =>
                customer._id ===
                item._id
                  ? {
                      ...customer,
                      status:
                        'Duplicate',
                    }
                  : customer
            )
        );

        Swal.fire(
          'Marked as Duplicate!',
          'Stock closing has been marked as duplicate.',
          'success'
        );
      } else {
        throw new Error(
          response.data
            .message ||
            'Failed to mark as duplicate'
        );
      }
    } catch (err) {
      console.error(
        'Error marking stock closing as duplicate:',
        err
      );

      Swal.fire(
        'Error!',
        err.response?.data
          ?.message ||
          'Failed to mark as duplicate.',
        'error'
      );
    }
  };

  /* =========================================================
     CSV EXPORT
  ========================================================= */

  const generateCSVExport =
    async () => {
      try {
        setExportLoading(true);

        const params =
          new URLSearchParams();

        if (
          activeSearch.center
        ) {
          params.append(
            'center',
            activeSearch.center
          );
        }

        if (
          activeSearch.date &&
          activeSearch.date.includes(
            ' to '
          )
        ) {
          const [
            startDateStr,
            endDateStr,
          ] =
            activeSearch.date.split(
              ' to '
            );

          const convertDateFormat =
            (dateStr) => {
              const [
                day,
                month,
                year,
              ] =
                dateStr.split(
                  '-'
                );

              return `${year}-${month}-${day}`;
            };

          params.append(
            'startDate',
            convertDateFormat(
              startDateStr
            )
          );

          params.append(
            'endDate',
            convertDateFormat(
              endDateStr
            )
          );
        }

        const apiUrl =
          params.toString()
            ? `/reportsubmission?${params.toString()}`
            : '/reportsubmission';

        const response =
          await axiosInstance.get(
            apiUrl
          );

        if (
          !response.data.success
        ) {
          throw new Error(
            'API returned unsuccessful response'
          );
        }

        const exportData =
          response.data.data || [];

        if (
          exportData.length ===
          0
        ) {
          alert(
            'No data available for export with current filters'
          );

          return;
        }

        const headers = [
          'Date',
          'Center',
          'Remark',
          'Created At',
          'Created By',
        ];

        const csvData =
          exportData.map(
            (item) => [
              formatDate(
                item.date || ''
              ),

              item.closingCenter
                ?.centerName ||
                '',

              item.remark || '',

              formatDateTime(
                item.createdAt ||
                  ''
              ),

              item.createdBy
                ?.email || '',
            ]
          );

        const csvContent = [
          headers.join(','),
          ...csvData.map(
            (row) =>
              row
                .map(
                  (field) => {
                    const stringField =
                      String(
                        field ?? ''
                      );

                    return `"${stringField.replace(
                      /"/g,
                      '""'
                    )}"`;
                  }
                )
                .join(',')
          ),
        ].join('\n');

        const blob =
          new Blob(
            [
              '\uFEFF' +
                csvContent,
            ],
            {
              type: 'text/csv;charset=utf-8;',
            }
          );

        const link =
          document.createElement(
            'a'
          );

        const downloadUrl =
          URL.createObjectURL(
            blob
          );

        link.href =
          downloadUrl;

        let fileName =
          'Closing-stock-log';

        if (
          activeSearch.center ||
          activeSearch.date
        ) {
          fileName +=
            '_filtered';
        }

        fileName += `_${new Date()
          .toISOString()
          .split('T')[0]}.csv`;

        link.download =
          fileName;

        link.style.visibility =
          'hidden';

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

        URL.revokeObjectURL(
          downloadUrl
        );
      } catch (err) {
        console.error(
          'Error generating CSV export:',
          err
        );

        alert(
          'Error generating export file. Please try again.'
        );
      } finally {
        setExportLoading(false);
      }
    };

  /* =========================================================
     FRONTEND SEARCH
  ========================================================= */

  const filteredData =
    data.filter(
      (customer) => {
        if (
          activeSearch.center ||
          activeSearch.date
        ) {
          return true;
        }

        if (!searchTerm) {
          return true;
        }

        const lowerSearch =
          searchTerm.toLowerCase();

        return Object.values(
          customer
        ).some((value) => {
          if (
            typeof value ===
              'object' &&
            value !== null
          ) {
            return Object.values(
              value
            ).some(
              (
                nestedValue
              ) =>
                nestedValue !=
                  null &&
                String(
                  nestedValue
                )
                  .toLowerCase()
                  .includes(
                    lowerSearch
                  )
            );
          }

          return (
            value != null &&
            String(value)
              .toLowerCase()
              .includes(
                lowerSearch
              )
          );
        });
      }
    );

  /* =========================================================
     DROPDOWN
  ========================================================= */

  const toggleDropdown = (
    id
  ) => {
    setDropdownOpen(
      (prev) => ({
        ...prev,
        [id]: !prev[id],
      })
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* TITLE */}

      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Closing Stock Logs
      </div>

      {/* SEARCH MODAL */}

      <ReportSearchmodel
        visible={
          searchModalVisible
        }
        onClose={() =>
          setSearchModalVisible(
            false
          )
        }
        onSearch={
          handleSearch
        }
        centers={centers}
        initialSearchData={
          activeSearch
        }
      />

      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <div className="mt-4 overflow-hidden rounded-t-sm border-t-4 border-t-[#2b5da5] bg-white shadow-sm">
        {/* HEADER */}

        <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {/* ADD */}

            <Link
              to="/add-reportSubmission"
              className="inline-flex items-center gap-1.5 rounded bg-[#2b5da5] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#214b88]"
            >
              <Plus size={16} />
              Add
            </Link>

            {/* EXPORT */}

            <button
              type="button"
              onClick={
                generateCSVExport
              }
              disabled={
                exportLoading
              }
              className="inline-flex items-center gap-1.5 rounded bg-[#2b5da5] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#214b88] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exportLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download
                    size={16}
                  />
                  Export
                </>
              )}
            </button>

            {/* SEARCH */}

            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(
                  true
                )
              }
              className="inline-flex items-center gap-1.5 rounded bg-[#2b5da5] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#214b88]"
            >
              <Search size={16} />
              Search
            </button>

            {/* RESET */}

            {(activeSearch.center ||
              activeSearch.date) && (
              <button
                type="button"
                onClick={
                  handleResetSearch
                }
                className="inline-flex items-center gap-1.5 rounded bg-gray-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                <RotateCcw
                  size={16}
                />
                Reset Search
              </button>
            )}
          </div>

          {/* PAGINATION UI
              Original component had static pagination.
          */}

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-sm border border-[#d9dee7] bg-white px-2.5 py-1.5 text-xs text-[#3448a5] hover:bg-gray-50"
            >
              First
            </button>

            <button
              type="button"
              className="rounded-sm border border-[#d9dee7] bg-white px-2.5 py-1.5 text-xs text-[#3448a5] hover:bg-gray-50"
            >
              &lt;
            </button>

            <button
              type="button"
              className="rounded-sm border border-[#2b5da5] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#2b5da5]"
            >
              1
            </button>

            <button
              type="button"
              className="rounded-sm border border-[#d9dee7] bg-white px-2.5 py-1.5 text-xs text-[#3448a5] hover:bg-gray-50"
            >
              &gt;
            </button>

            <button
              type="button"
              className="rounded-sm border border-[#d9dee7] bg-white px-2.5 py-1.5 text-xs text-[#3448a5] hover:bg-gray-50"
            >
              Last
            </button>
          </div>
        </div>

        {/* SEARCH INPUT */}

        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 md:flex-row md:items-center md:justify-end">
          <div className="flex w-full items-center gap-2 md:w-auto">
            <label
              htmlFor="reportSearch"
              className="whitespace-nowrap text-sm font-semibold text-[#263746]"
            >
              Search:
            </label>

            <input
              id="reportSearch"
              type="text"
              value={
                searchTerm
              }
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              className="h-9 w-full rounded-sm border border-[#d7dce4] bg-white px-3 text-sm outline-none focus:border-[#2b5da5] focus:ring-2 focus:ring-blue-100 md:w-[235px]"
            />
          </div>
        </div>

        {/* =====================================================
            TABLE
        ====================================================== */}

        <div className="max-h-[calc(100vh-290px)] min-h-[350px] overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed border-collapse text-sm">
            <colgroup>
              <col className="w-[7%]" />
              <col className="w-[12%]" />
              <col className="w-[25%]" />
              <col className="w-[12%]" />
              <col className="w-[21%]" />
              <col className="w-[10%]" />
              {(userRole === 'admin' || userRole === 'superadmin') && <col className="w-[13%]" />}
            </colgroup>
            <thead>
              <tr className="sticky top-0 z-10 bg-white text-left">
                <SortableHeader
                  label="Date"
                  icon={getSortIcon(
                    'date'
                  )}
                  onClick={() =>
                    handleSort(
                      'date'
                    )
                  }
                />

                <SortableHeader
                  label="Branch"
                  icon={getSortIcon(
                    'closingCenter.centerName'
                  )}
                  onClick={() =>
                    handleSort(
                      'closingCenter.centerName'
                    )
                  }
                />

                <SortableHeader
                  label="Remark"
                  icon={getSortIcon(
                    'remark'
                  )}
                  onClick={() =>
                    handleSort(
                      'remark'
                    )
                  }
                />

                <SortableHeader
                  label="Created At"
                  icon={getSortIcon(
                    'createdAt'
                  )}
                  onClick={() =>
                    handleSort(
                      'createdAt'
                    )
                  }
                />

                <SortableHeader
                  label="Created By"
                  icon={getSortIcon(
                    'createdBy.fullname'
                  )}
                  onClick={() =>
                    handleSort(
                      'createdBy.fullname'
                    )
                  }
                />

                <SortableHeader
                  label="Approve Remark"
                  icon={getSortIcon(
                    'approvedRemark'
                  )}
                  onClick={() =>
                    handleSort(
                      'approvedRemark'
                    )
                  }
                />

                {(userRole ===
                  'admin' ||
                  userRole ===
                    'superadmin') && (
                  <th className="border-b border-gray-200 px-2 py-3 text-left text-sm font-bold text-black">
                    Options
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredData.length >
              0 ? (
                filteredData.map(
                  (customer) => {
                    const rowClass =
                      customer.status ===
                      'Approved'
                        ? 'bg-green-50'
                        : customer.status ===
                            'Duplicate'
                          ? 'bg-red-50'
                          : '';

                    return (
                      <tr
                        key={
                          customer._id
                        }
                        className={`border-b border-white transition-colors ${rowClass || (filteredData.indexOf(customer) % 2 === 0 ? "bg-white" : "bg-[#f1f1f1]")} hover:bg-[#e8eef7]`}
                      >
                        {/* DATE */}

                        <td className="break-words border-r border-gray-100 px-2 py-3 align-top">
                          <button
                            type="button"
                            onClick={() =>
                              handleClick(
                                customer._id
                              )
                            }
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {formatDate(
                              customer.date ||
                                ''
                            )}
                          </button>
                        </td>

                        {/* BRANCH */}

                        <td className="break-words border-r border-gray-100 px-2 py-3 align-top text-gray-900">
                          {customer
                            .closingCenter
                            ?.centerName ||
                            'N/A'}
                        </td>

                        {/* REMARK */}

                        <td className="break-words border-r border-gray-100 px-2 py-3 align-top text-gray-900">
                          {customer.remark ||
                            ''}
                        </td>

                        {/* CREATED AT */}

                        <td className="break-words border-r border-gray-100 px-2 py-3 align-top text-gray-900">
                          {formatDateTime(
                            customer.createdAt ||
                              'N/A'
                          )}
                        </td>

                        {/* CREATED BY */}

                        <td className="break-words border-r border-gray-100 px-2 py-3 align-top text-gray-900">
                          {customer
                            .createdBy
                            ?.email ||
                            'N/A'}
                        </td>

                        {/* APPROVE REMARK */}

                        <td className="break-words border-r border-gray-100 px-2 py-3 align-top text-gray-900">
                          {customer.approvedRemark ||
                            ''}
                        </td>

                        {/* OPTIONS */}

                        {(userRole ===
                          'admin' ||
                          userRole ===
                            'superadmin') && (
                          <td className="break-words border-r border-gray-100 px-2 py-3 align-top">
                            <div
                              className="relative"
                              ref={(element) => {
                                dropdownRefs.current[
                                  customer._id
                                ] =
                                  element;
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  toggleDropdown(
                                    customer._id
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-[#f8f8f8] px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-white"
                              >
                                <Settings
                                  size={15}
                                />
                                Options
                                <ChevronDown
                                  size={14}
                                />
                              </button>

                              {dropdownOpen[
                                customer
                                  ._id
                              ] && (
                                <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded border border-gray-200 bg-white py-1 shadow-lg">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleApprove(
                                        customer
                                      )
                                    }
                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    <Check
                                      size={15}
                                      className="text-green-600"
                                    />
                                    Approve
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDuplicate(
                                        customer
                                      )
                                    }
                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    <Copy
                                      size={15}
                                      className="text-orange-600"
                                    />
                                    Duplicate Entry
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan={
                      userRole ===
                        'admin' ||
                      userRole ===
                        'superadmin'
                        ? 7
                        : 6
                    }
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
  );
};

/* =========================================================
   SORTABLE HEADER
========================================================= */

const SortableHeader = ({
  label,
  icon,
  onClick,
}) => {
  return (
    <th
      onClick={onClick}
      className="cursor-pointer border border-gray-100 px-2 py-3 text-left text-sm font-bold text-black hover:bg-gray-50"
    >
      <div className="flex items-center">
        {label}
        {icon}
      </div>
    </th>
  );
};

export default ReportSubmissionList;