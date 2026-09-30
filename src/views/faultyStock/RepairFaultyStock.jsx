import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  Check,
  FileSpreadsheet,
  RotateCcw,
  Search,
  Undo2,
  X,
} from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import { formatDate } from '../../utils/FormatDateTime'
import ReportSearchmodel from '../reportSubmission/ReportSearchModel'
import {
  confirmAction,
  showSuccess,
  showError,
  showToast,
} from '../../../src/utils/sweetAlerts'

const RepairTeamStock = () => {
  const [data, setData] = useState([])
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [searchModalVisible, setSearchModalVisible] =
    useState(false)

  const [dropdownOpen, setDropdownOpen] = useState({})
  const [activeSearch, setActiveSearch] = useState({
    center: '',
    date: '',
  })

  const [exportLoading, setExportLoading] =
    useState(false)

  const [selectedItems, setSelectedItems] = useState([])
  const [processing, setProcessing] = useState(false)

  const [processError, setProcessError] =
    useState(null)

  const [processSuccess, setProcessSuccess] =
    useState(null)

  const dropdownRefs = useRef({})

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach(
        (key) => {
          const ref = dropdownRefs.current[key]

          if (
            ref &&
            !ref.contains(event.target)
          ) {
            setDropdownOpen((prev) => ({
              ...prev,
              [key]: false,
            }))
          }
        },
      )
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  const fetchData = async (
    searchParams = {},
  ) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (searchParams.center) {
        params.append(
          'center',
          searchParams.center,
        )
      }

      if (
        searchParams.date &&
        searchParams.date.includes(' to ')
      ) {
        const [
          startDateStr,
          endDateStr,
        ] = searchParams.date.split(
          ' to ',
        )

        const convertDateFormat = (
          dateStr,
        ) => {
          const [
            day,
            month,
            year,
          ] = dateStr.split('-')

          return `${year}-${month}-${day}`
        }

        params.append(
          'startDate',
          convertDateFormat(
            startDateStr,
          ),
        )

        params.append(
          'endDate',
          convertDateFormat(
            endDateStr,
          ),
        )
      }

      const url = params.toString()
        ? `/faulty-stock/repair-transfers/center?${params.toString()}`
        : '/faulty-stock/repair-transfers/center'

      const response =
        await axiosInstance.get(url)

      if (response.data.success) {
        setData(response.data.data || [])
      } else {
        throw new Error(
          'API returned unsuccessful response',
        )
      }
    } catch (err) {
      setError(err.message)
      console.error(
        'Error fetching data:',
        err,
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchCenters = async () => {
    try {
      const response =
        await axiosInstance.get(
          '/centers',
        )

      if (response.data.success) {
        setCenters(response.data.data)
      }
    } catch (error) {
      console.error(
        'Error fetching centers:',
        error,
      )
    }
  }

  useEffect(() => {
    fetchData()
    fetchCenters()
  }, [])

  const getStatusBadgeClass = (
    status,
  ) => {
    const statusColors = {
      pending_under_repair:
        'bg-yellow-100 text-yellow-800',
      under_repair:
        'bg-blue-100 text-blue-700',
      repaired:
        'bg-green-100 text-green-700',
      irreparable:
        'bg-red-100 text-red-700',
      damaged:
        'bg-gray-100 text-gray-700',
      disposed:
        'bg-gray-200 text-gray-800',
      returned_to_vendor:
        'bg-blue-100 text-blue-700',
    }

    return (
      statusColors[status] ||
      'bg-gray-100 text-gray-700'
    )
  }

  const getRowClass = (status) => {
    switch (status) {
      case 'repaired':
        return 'bg-green-50'

      case 'irreparable':
        return 'bg-red-50'

      case 'under_repair':
        return 'bg-yellow-50'

      case 'pending_under_repair':
        return 'bg-orange-50'

      default:
        return ''
    }
  }

  const getFlattenedData = () => {
    const flattenedData = []

    data.forEach((repairTransfer) => {
      const {
        serialNumbers,
        product,
        quantity,
        status,
        ...rest
      } = repairTransfer

      if (
        product?.trackSerialNumber ===
          'Yes' &&
        serialNumbers &&
        serialNumbers.length > 0
      ) {
        serialNumbers.forEach(
          (serial) => {
            flattenedData.push({
              ...rest,
              product,
              serialNumber:
                serial.serialNumber,
              serialStatus: serial.status,
              quantity: 1,
              isSerialized: true,
              originalQuantity: quantity,
              transferStatus: status,
              repairHistory:
                serial.repairHistory ||
                [],
            })
          },
        )
      } else {
        flattenedData.push({
          ...rest,
          product,
          serialNumber: 'N/A',
          serialStatus: status,
          quantity,
          isSerialized: false,
          originalQuantity: quantity,
          transferStatus: status,
          repairHistory:
            rest.repairUpdates ||
            [],
        })
      }
    })

    return flattenedData
  }

  const getPendingUnderRepairItems =
    () => {
      const flattenedData =
        getFlattenedData()

      return flattenedData.filter(
        (item) =>
          item.serialStatus ===
          'pending_under_repair',
      )
    }

  const handleSelectItem = (
    itemId,
    isSelected,
  ) => {
    setSelectedItems((prev) => {
      if (isSelected) {
        return [...prev, itemId]
      }

      return prev.filter(
        (id) => id !== itemId,
      )
    })
  }

  const getItemUniqueId = (item) => {
    return `${item._id}-${item.serialNumber || 'non-serial'}`
  }

  const handleSelectAll = () => {
    const pendingItems =
      getPendingUnderRepairItems()

    const pendingItemIds =
      pendingItems.map(
        (item) =>
          getItemUniqueId(item),
      )

    if (
      selectedItems.length ===
      pendingItemIds.length
    ) {
      setSelectedItems([])
    } else {
      setSelectedItems(
        pendingItemIds,
      )
    }
  }

  const getSelectedPendingItems =
    () => {
      const flattenedData =
        getFlattenedData()

      return flattenedData.filter(
        (item) =>
          selectedItems.includes(
            getItemUniqueId(item),
          ) &&
          item.serialStatus ===
            'pending_under_repair',
      )
    }

  const hasSelectedPendingItems =
    () => {
      return (
        getSelectedPendingItems()
          .length > 0
      )
    }

  const acceptPendingItems =
    async () => {
      if (
        !hasSelectedPendingItems()
      ) {
        showToast(
          'Please select pending under repair items to accept',
          'warning',
        )
        return
      }

      const selected =
        getSelectedPendingItems()

      const itemCount =
        selected.length

      const transfersMap = {}

      selected.forEach((item) => {
        if (!transfersMap[item._id]) {
          transfersMap[item._id] = {
            transferId: item._id,
            items: [],
          }
        }

        transfersMap[
          item._id
        ].items.push({
          serialNumber:
            item.serialNumber !==
            'N/A'
              ? item.serialNumber
              : null,
          quantity: item.quantity,
        })
      })

      const transferList =
        Object.values(
          transfersMap,
        )

      try {
        const result =
          await confirmAction(
            'Accept Pending Under Repair Items',
            `<p>You are about to accept <strong>${itemCount} pending under repair item(s)</strong>.</p>`,
            'question',
            'Yes, Accept Items',
          )

        if (result.isConfirmed) {
          await processAcceptance(
            transferList,
          )
        }
      } catch (error) {
        console.error(
          'Confirmation error:',
          error,
        )
      }
    }

  const processAcceptance =
    async (transferList) => {
      setProcessing(true)
      setProcessError(null)
      setProcessSuccess(null)

      try {
        const results = []

        for (
          const transferData of transferList
        ) {
          try {
            const {
              transferId,
              items,
            } = transferData

            const requestBody = {
              transferId,
              remark:
                'Accepted by repair team',
            }

            const serialNumbers =
              items
                .filter(
                  (item) =>
                    item.serialNumber,
                )
                .map((item) => ({
                  serialNumber:
                    item.serialNumber,
                  remark:
                    'Accepted at repair center',
                }))

            if (
              serialNumbers.length >
              0
            ) {
              requestBody.acceptedQuantities =
                serialNumbers
            } else {
              const totalQty =
                items.reduce(
                  (
                    sum,
                    item,
                  ) =>
                    sum +
                    item.quantity,
                  0,
                )

              requestBody.acceptedQuantities =
                {
                  totalAcceptedQty:
                    totalQty,
                  remark: `Accepted ${totalQty} items`,
                }
            }

            const response =
              await axiosInstance.post(
                '/faulty-stock/accept-repair-transfer',
                requestBody,
              )

            if (
              response.data.success
            ) {
              results.push({
                transferId,
                success: true,
                message:
                  response.data
                    .message,
              })
            } else {
              results.push({
                transferId,
                success: false,
                message:
                  response.data
                    .message ||
                  'Acceptance failed',
              })
            }
          } catch (error) {
            results.push({
              transferId:
                transferData.transferId,
              success: false,
              message:
                error.response
                  ?.data
                  ?.message ||
                error.message,
            })
          }
        }

        const successful =
          results.filter(
            (result) =>
              result.success,
          )

        const failed =
          results.filter(
            (result) =>
              !result.success,
          )

        if (failed.length === 0) {
          setProcessSuccess(
            `Successfully accepted all ${successful.length} transfers`,
          )

          showSuccess(
            `Successfully accepted ${successful.length} transfer(s)`,
          )
        } else {
          const errorMsg =
            `${successful.length} transfers accepted successfully, ` +
            `${failed.length} transfers failed`

          setProcessError(
            errorMsg,
          )

          showError(errorMsg)
        }

        await fetchData()
        setSelectedItems([])
      } catch (error) {
        const errorMsg = `Error accepting items: ${error.message}`

        setProcessError(
          errorMsg,
        )

        showError(errorMsg)
      } finally {
        setProcessing(false)

        setTimeout(() => {
          setProcessSuccess(null)
          setProcessError(null)
        }, 5000)
      }
    }

  const handleSort = (key) => {
    let direction = 'ascending'

    if (
      sortConfig.key === key &&
      sortConfig.direction ===
        'ascending'
    ) {
      direction =
        'descending'
    }

    setSortConfig({
      key,
      direction,
    })
  }

  const getSortIcon = (key) => {
    if (
      sortConfig.key !== key
    ) {
      return null
    }

    return sortConfig.direction ===
      'ascending' ? (
      <ArrowUp className="ml-1 inline-block h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 inline-block h-4 w-4" />
    )
  }

  const handleSearch = (
    searchData,
  ) => {
    setActiveSearch(searchData)
    fetchData(searchData)
  }

  const handleResetSearch = () => {
    setActiveSearch({
      center: '',
      date: '',
    })

    setSearchTerm('')
    fetchData()
  }

  const generateCSVExport =
    async () => {
      try {
        setExportLoading(true)

        const params =
          new URLSearchParams()

        if (activeSearch.center) {
          params.append(
            'center',
            activeSearch.center,
          )
        }

        if (
          activeSearch.date &&
          activeSearch.date.includes(
            ' to ',
          )
        ) {
          const [
            startDateStr,
            endDateStr,
          ] =
            activeSearch.date.split(
              ' to ',
            )

          const convertDateFormat =
            (dateStr) => {
              const [
                day,
                month,
                year,
              ] =
                dateStr.split(
                  '-',
                )

              return `${year}-${month}-${day}`
            }

          params.append(
            'startDate',
            convertDateFormat(
              startDateStr,
            ),
          )

          params.append(
            'endDate',
            convertDateFormat(
              endDateStr,
            ),
          )
        }

        const apiUrl =
          params.toString()
            ? `/reportsubmission?${params.toString()}`
            : '/reportsubmission'

        const response =
          await axiosInstance.get(
            apiUrl,
          )

        if (
          !response.data.success
        ) {
          throw new Error(
            'API returned unsuccessful response',
          )
        }

        const exportData =
          response.data.data ||
          []

        if (
          exportData.length ===
          0
        ) {
          alert(
            'No data available for export with current filters',
          )
          return
        }

        const headers = [
          'Date',
          'Center',
          'Remark',
          'Created At',
          'Created By',
        ]

        const csvData =
          exportData.map(
            (item) => [
              formatDate(
                item.date || '',
              ),
              item.center
                ?.centerName || '',
              item.remark || '',
              formatDate(
                item.createdAt ||
                  '',
              ),
              item.createdBy
                ?.email || '',
            ],
          )

        const csvContent =
          [
            headers.join(','),
            ...csvData.map(
              (row) =>
                row
                  .map(
                    (field) => {
                      const stringField =
                        String(
                          field ||
                            '',
                        )

                      return `"${stringField.replace(
                        /"/g,
                        '""',
                      )}"`
                    },
                  )
                  .join(','),
            ),
          ].join('\n')

        const blob =
          new Blob(
            [
              '\uFEFF' +
                csvContent,
            ],
            {
              type: 'text/csv;charset=utf-8;',
            },
          )

        const link =
          document.createElement(
            'a',
          )

        const downloadUrl =
          URL.createObjectURL(
            blob,
          )

        link.setAttribute(
          'href',
          downloadUrl,
        )

        let fileName =
          'Repair-team-stock'

        if (
          activeSearch.center ||
          activeSearch.date
        ) {
          fileName +=
            '_filtered'
        }

        fileName += `_${new Date()
          .toISOString()
          .split('T')[0]}.csv`

        link.setAttribute(
          'download',
          fileName,
        )

        link.style.visibility =
          'hidden'

        document.body.appendChild(
          link,
        )

        link.click()

        document.body.removeChild(
          link,
        )

        URL.revokeObjectURL(
          downloadUrl,
        )

        showToast(
          'Export completed successfully!',
          'success',
        )
      } catch (error) {
        console.error(
          'Error generating CSV export:',
          error,
        )

        showError(
          'Error generating export file. Please try again.',
        )
      } finally {
        setExportLoading(false)
      }
    }

  const flattenedData =
    getFlattenedData()

  const filteredData =
    flattenedData.filter(
      (item) => {
        if (
          activeSearch.center ||
          activeSearch.date
        ) {
          return true
        }

        const searchFields = [
          item.product
            ?.productTitle,
          item.fromCenter
            ?.centerName,
          item.serialNumber,
          item.serialStatus,
          item.transferRemark,
        ]

        return searchFields.some(
          (field) =>
            field &&
            field
              .toString()
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase(),
              ),
        )
      },
    )

  const sortedData = [
    ...filteredData,
  ].sort((a, b) => {
    if (!sortConfig.key) {
      return 0
    }

    let aValue = a
    let bValue = b

    if (
      sortConfig.key.includes(
        '.',
      )
    ) {
      const keys =
        sortConfig.key.split(
          '.',
        )

      aValue = keys.reduce(
        (obj, key) =>
          obj && obj[key],
        a,
      )

      bValue = keys.reduce(
        (obj, key) =>
          obj && obj[key],
        b,
      )
    } else {
      aValue =
        a[sortConfig.key]

      bValue =
        b[sortConfig.key]
    }

    if (aValue < bValue) {
      return sortConfig.direction ===
        'ascending'
        ? -1
        : 1
    }

    if (aValue > bValue) {
      return sortConfig.direction ===
        'ascending'
        ? 1
        : -1
    }

    return 0
  })

  const pendingItems =
    getPendingUnderRepairItems()

  const allPendingSelected =
    pendingItems.length > 0 &&
    selectedItems.length ===
      pendingItems.length

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        Error loading data: {error}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-xl font-semibold text-gray-800">
        Faulty Stock
      </div>

      <ReportSearchmodel
        visible={
          searchModalVisible
        }
        onClose={() =>
          setSearchModalVisible(
            false,
          )
        }
        onSearch={handleSearch}
        centers={centers}
        initialSearchData={
          activeSearch
        }
      />

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/transfer-repaired-stock">
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Transfer
              </button>
            </Link>

            <Link to="/repaired-stock">
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Undo2 className="h-4 w-4" />
                Repaired
              </button>
            </Link>

            <button
              type="button"
              onClick={
                generateCSVExport
              }
              disabled={
                exportLoading
              }
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exportLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              Export
            </button>

            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(
                  true,
                )
              }
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            {hasSelectedPendingItems() && (
              <button
                type="button"
                onClick={
                  acceptPendingItems
                }
                disabled={
                  processing
                }
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-green-600 px-3 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Check className="h-4 w-4" />
                )}

                Accept (
                {
                  getSelectedPendingItems()
                    .length
                }
                )
              </button>
            )}

            {(activeSearch.center ||
              activeSearch.date) && (
              <button
                type="button"
                onClick={
                  handleResetSearch
                }
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-gray-600 px-3 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Search
              </button>
            )}
          </div>

          {/* Static pagination UI preserved from old page */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>First</span>
            <span>&lt;</span>
            <span className="rounded bg-blue-600 px-2 py-1 text-white">
              1
            </span>
            <span>&gt;</span>
            <span>Last</span>
          </div>
        </div>

        {/* Process Alerts */}
        <div className="px-4 pt-4">
          {processSuccess && (
            <div className="mb-3 flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <span>
                {processSuccess}
              </span>

              <button
                type="button"
                onClick={() =>
                  setProcessSuccess(
                    null,
                  )
                }
                className="ml-3 text-green-600 hover:text-green-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {processError && (
            <div className="mb-3 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>
                {processError}
              </span>

              <button
                type="button"
                onClick={() =>
                  setProcessError(
                    null,
                  )
                }
                className="ml-3 text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="flex justify-end px-4 py-3">
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <label
              htmlFor="repair-team-search"
              className="whitespace-nowrap text-sm font-medium text-gray-700"
            >
              Search:
            </label>

            <input
              id="repair-team-search"
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value,
                )
              }
              disabled={processing}
              className="h-8 w-full rounded border border-gray-300 px-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-[350px]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto px-4 pb-4">
          <table className="min-w-[1100px] w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-[50px] border border-gray-200 px-3 py-2 text-center">
                  <input
                    id="header-select-all"
                    type="checkbox"
                    checked={
                      allPendingSelected
                    }
                    onChange={
                      handleSelectAll
                    }
                    disabled={
                      processing
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>

                {[
                  ['date', 'Date'],
                  [
                    'fromCenter.centerName',
                    'Center',
                  ],
                  [
                    'product.productTitle',
                    'Product',
                  ],
                  [
                    'serialNumber',
                    'Serial Number',
                  ],
                  [
                    'quantity',
                    'Quantity',
                  ],
                  [
                    'quantity',
                    'Pending Quantity',
                  ],
                  [
                    'serialStatus',
                    'Status',
                  ],
                ].map(
                  ([key, label]) => (
                    <th
                      key={`${key}-${label}`}
                      onClick={() =>
                        !processing &&
                        handleSort(
                          key,
                        )
                      }
                      className={`cursor-pointer whitespace-nowrap border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 transition hover:bg-gray-100 ${
                        processing
                          ? 'cursor-not-allowed opacity-60'
                          : ''
                      }`}
                    >
                      {label}
                      {getSortIcon(
                        key,
                      )}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {sortedData.length >
              0 ? (
                sortedData.map(
                  (item) => {
                    const isPending =
                      item.serialStatus ===
                      'pending_under_repair'

                    const itemId =
                      getItemUniqueId(
                        item,
                      )

                    const isSelected =
                      selectedItems.includes(
                        itemId,
                      )

                    return (
                      <tr
                        key={
                          itemId
                        }
                        className={`transition hover:bg-gray-50 ${getRowClass(
                          item.serialStatus,
                        )}`}
                      >
                        <td className="border border-gray-200 px-3 py-2 text-center">
                          {isPending && (
                            <input
                              id={`select-${itemId}`}
                              type="checkbox"
                              checked={
                                isSelected
                              }
                              onChange={(
                                e,
                              ) =>
                                !processing &&
                                handleSelectItem(
                                  itemId,
                                  e
                                    .target
                                    .checked,
                                )
                              }
                              disabled={
                                processing
                              }
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          )}
                        </td>

                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">
                          {formatDate(
                            item.date ||
                              '',
                          )}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {item
                            .fromCenter
                            ?.centerName ||
                            ' '}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {item.product
                            ?.productTitle ||
                            ' '}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {item.isSerialized
                            ? item.serialNumber
                            : ' '}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {item.quantity}

                          {item.isSerialized &&
                            item.originalQuantity >
                              1 && (
                              <span className="block text-xs text-gray-500">
                                of{' '}
                                {
                                  item.originalQuantity
                                }
                              </span>
                            )}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {item.pendingUnderRepairQty ||
                            0}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(
                              item.serialStatus,
                            )}`}
                          >
                            {item.serialStatus
                              ?.replace(
                                '_',
                                ' ',
                              ) ||
                              ' '}
                          </span>
                        </td>
                      </tr>
                    )
                  },
                )
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="border border-gray-200 px-3 py-8 text-center text-sm text-gray-500"
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
  )
}

export default RepairTeamStock