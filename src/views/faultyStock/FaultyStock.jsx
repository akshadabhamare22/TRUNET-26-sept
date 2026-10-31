import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  Check,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import { formatDate, formatDateTime } from '../../../src/utils/FormatDateTime'
import ReportSearchmodel from '../reportSubmission/ReportSearchModel'
import {
  confirmAction,
  showSuccess,
  showError,
} from '../../../src/utils/sweetAlerts'

const FaultyStock = () => {
  const [data, setData] = useState([])
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState({})

  const [activeSearch, setActiveSearch] = useState({
    center: '',
    date: '',
  })

  const [exportLoading, setExportLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [processing, setProcessing] = useState(false)
  const [processError, setProcessError] = useState(null)
  const [processSuccess, setProcessSuccess] = useState(null)

  const dropdownRefs = useRef({})

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach((key) => {
        const ref = dropdownRefs.current[key]

        if (ref && !ref.contains(event.target)) {
          setDropdownOpen((prev) => ({
            ...prev,
            [key]: false,
          }))
        }
      })
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchData = async (searchParams = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (searchParams.center) {
        params.append('center', searchParams.center)
      }

      if (searchParams.date && searchParams.date.includes(' to ')) {
        const [startDateStr, endDateStr] = searchParams.date.split(' to ')

        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-')
          return `${year}-${month}-${day}`
        }

        params.append('startDate', convertDateFormat(startDateStr))
        params.append('endDate', convertDateFormat(endDateStr))
      }

      const url = params.toString()
        ? `/faulty-stock/product-status?${params.toString()}`
        : '/faulty-stock/product-status'

      const response = await axiosInstance.get(url)

      if (response.data.success) {
        setData(response.data.data || [])
      } else {
        const errorMessage =
          response.data.message || 'API returned unsuccessful response'

        setError(errorMessage)
        console.error('Backend error:', response.data)
      }
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Error ${err.response.status}: ${err.response.statusText}`

        setError(errorMessage)
        console.error('Error response:', err.response.data)
      } else if (err.request) {
        setError(
          'No response received from server. Please check your network connection.',
        )
        console.error('Error request:', err.request)
      } else {
        setError(err.message || 'An error occurred while fetching data')
        console.error('Error message:', err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers')

      if (response.data.success) {
        setCenters(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching centers:', error)
    }
  }

  useEffect(() => {
    fetchData()
    fetchCenters()
  }, [])

  const handleSort = (key) => {
    let direction = 'ascending'

    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }

    setSortConfig({ key, direction })

    const sortedData = [...data].sort((a, b) => {
      let aValue = a
      let bValue = b

      if (key.includes('.')) {
        const keys = key.split('.')

        aValue = keys.reduce(
          (obj, currentKey) =>
            obj && obj[currentKey],
          a,
        )

        bValue = keys.reduce(
          (obj, currentKey) =>
            obj && obj[currentKey],
          b,
        )
      } else {
        aValue = a[key]
        bValue = b[key]
      }

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1
      }

      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1
      }

      return 0
    })

    setData(sortedData)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null
    }

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp className="ml-1 inline-block h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 inline-block h-4 w-4" />
    )
  }

  const handleSearch = (searchData) => {
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

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId)
      }

      return [...prev, itemId]
    })
  }

  const handleSelectAll = () => {
    const pendingItems = data
      .filter(
        (item) =>
          item.overallStatus === 'pending_damage' ||
          item.overallStatus === 'pending damage',
      )
      .map((item) => item._id)

    if (selectedItems.length === pendingItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(pendingItems)
    }
  }

  const getSelectedPendingItems = () => {
    return data.filter(
      (item) =>
        selectedItems.includes(item._id) &&
        (item.overallStatus === 'pending_damage' ||
          item.overallStatus === 'pending damage'),
    )
  }

  const hasSelectedPendingItems = () => {
    return getSelectedPendingItems().length > 0
  }

  const handleAction = async (action) => {
    const items = getSelectedPendingItems()

    if (items.length === 0) {
      return showError('Please select pending damage items')
    }

    const result = await confirmAction(
      action === 'accept' ? 'Accept Damage?' : 'Reject Damage?',
      `<b>${items.length}</b> item(s) will be ${action}ed.`,
      action === 'accept' ? 'question' : 'warning',
      action === 'accept' ? 'Yes, Accept' : 'Yes, Reject',
    )

    if (!result.isConfirmed) {
      return
    }

    try {
      setProcessing(true)
      setProcessError(null)
      setProcessSuccess(null)

      for (const item of items) {
        const payload = {
          faultyStockId: item._id,
        }

        if (action === 'accept') {
          await axiosInstance.post(
            '/faulty-stock/accept-damage',
            payload,
          )
        } else {
          await axiosInstance.post(
            '/faulty-stock/reject-damage',
            payload,
          )
        }
      }

      showSuccess(
        `Successfully ${action}ed ${items.length} item(s)`,
      )

      setSelectedItems([])
      fetchData()
    } catch (error) {
      setProcessError(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong while processing the selected items.',
      )

      showError(error)
    } finally {
      setProcessing(false)
    }
  }

  const generateCSVExport = async () => {
    try {
      setExportLoading(true)

      const params = new URLSearchParams()

      if (activeSearch.center) {
        params.append('center', activeSearch.center)
      }

      if (
        activeSearch.date &&
        activeSearch.date.includes(' to ')
      ) {
        const [startDateStr, endDateStr] =
          activeSearch.date.split(' to ')

        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-')
          return `${year}-${month}-${day}`
        }

        params.append(
          'startDate',
          convertDateFormat(startDateStr),
        )

        params.append(
          'endDate',
          convertDateFormat(endDateStr),
        )
      }

      const apiUrl = params.toString()
        ? `/reportsubmission?${params.toString()}`
        : '/reportsubmission'

      const response = await axiosInstance.get(apiUrl)

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response')
      }

      const exportData = response.data.data || []

      if (exportData.length === 0) {
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

      const csvData = exportData.map((item) => [
        formatDate(item.date || ''),
        item.center?.centerName || '',
        item.remark || '',
        formatDateTime(item.createdAt || ''),
        item.createdBy?.email || '',
      ])

      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const stringField = String(field || '')
              return `"${stringField.replace(/"/g, '""')}"`
            })
            .join(','),
        ),
      ].join('\n')

      const blob = new Blob(
        ['\uFEFF' + csvContent],
        {
          type: 'text/csv;charset=utf-8;',
        },
      )

      const link = document.createElement('a')
      const downloadUrl = URL.createObjectURL(blob)

      link.setAttribute('href', downloadUrl)

      let fileName = 'Closing-stock-log'

      if (activeSearch.center || activeSearch.date) {
        fileName += '_filtered'
      }

      fileName += `_${new Date()
        .toISOString()
        .split('T')[0]}.csv`

      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error generating CSV export:', error)
      alert(
        'Error generating export file. Please try again.',
      )
    } finally {
      setExportLoading(false)
    }
  }

  const filteredData = data.filter((customer) => {
    if (activeSearch.center || activeSearch.date) {
      return true
    }

    return Object.values(customer).some((value) => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(
          (nestedValue) =>
            nestedValue &&
            nestedValue
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        )
      }

      return (
        value &&
        value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    })
  })

  const renderStatusBadge = (status) => {
    if (!status) {
      return (
        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
          N/A
        </span>
      )
    }

    const statusText = status
      .toLowerCase()
      .replace(' ', '_')

    let badgeClass = ''

    switch (statusText) {
      case 'pending_damage':
      case 'pending damage':
        badgeClass =
          'bg-yellow-100 text-yellow-800'
        break

      case 'damaged':
        badgeClass =
          'bg-red-100 text-red-700'
        break

      case 'under_repair':
      case 'under repair':
        badgeClass =
          'bg-blue-100 text-blue-700'
        break

      case 'repaired':
        badgeClass =
          'bg-green-100 text-green-700'
        break

      default:
        badgeClass =
          'bg-gray-100 text-gray-700'
        break
    }

    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass}`}
      >
        {status}
      </span>
    )
  }

  const pendingItems = data.filter(
    (item) =>
      item.overallStatus === 'pending_damage' ||
      item.overallStatus === 'pending damage',
  )

  const allPendingSelected =
    pendingItems.length > 0 &&
    selectedItems.length === pendingItems.length

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
        {error}
      </div>
    )
  }

  return (
    <div className="w-full min-w-0 bg-[#f3f4f6]">
      <div className="mb-4 text-[22px] font-semibold tracking-tight text-[#1f2937]">
        Faulty Stock
      </div>

      <ReportSearchmodel
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        initialSearchData={activeSearch}
      />

      <div className="mt-4 overflow-hidden rounded-sm border-t-[4px] border-t-[#2759a2] bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/transfer-faulty-stock">
              <button
                type="button"
                className="inline-flex h-[35px] items-center gap-1.5 rounded-[4px] bg-[#2759a2] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e477f]"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Transfer
              </button>
            </Link>

            <button
              type="button"
              onClick={generateCSVExport}
              disabled={exportLoading}
              className="inline-flex h-[35px] items-center gap-1.5 rounded-[4px] bg-[#2759a2] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e477f] disabled:cursor-not-allowed disabled:opacity-60"
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
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex h-[35px] items-center gap-1.5 rounded-[4px] bg-[#2759a2] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e477f]"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            {hasSelectedPendingItems() && (
              <button
                type="button"
                onClick={() => handleAction('accept')}
                disabled={processing}
                className="inline-flex h-[35px] items-center gap-1.5 rounded-[4px] bg-green-600 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                Accept ({getSelectedPendingItems().length})
              </button>
            )}

            {(activeSearch.center || activeSearch.date) && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex h-[35px] items-center gap-1.5 rounded-[4px] bg-gray-600 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Search
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-[#2759a2]">
            <span>First</span>
            <span className="px-1">&lt;</span>
            <span className="rounded-sm bg-[#2759a2] px-2 py-1 text-white">
              1
            </span>
            <span className="px-1">&gt;</span>
            <span>Last</span>
          </div>
        </div>

        {/* Alerts */}
        <div className="px-4 pt-4">
          {processSuccess && (
            <div className="mb-3 flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <span>{processSuccess}</span>

              <button
                type="button"
                onClick={() => setProcessSuccess(null)}
                className="ml-3 text-green-600 hover:text-green-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {processError && (
            <div className="mb-3 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{processError}</span>

              <button
                type="button"
                onClick={() => setProcessError(null)}
                className="ml-3 text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center">
          <div />

          <div className="flex items-center gap-2">
            <label
              htmlFor="faulty-stock-search"
              className="text-sm font-medium text-gray-700"
            >
              Search:
            </label>

            <input
              id="faulty-stock-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full max-w-[350px] rounded-sm border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-[#2759a2] focus:ring-2 focus:ring-[#2759a2]/20"
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-hidden px-4 pb-4">
          <div className="max-h-[500px] overflow-y-auto overflow-x-hidden rounded-sm border border-gray-200">
          <table className="w-full table-fixed border-collapse text-[13px] leading-5">
            <thead className="sticky top-0 z-10">
              <tr className="bg-white">
                <th className="w-[42px] border border-gray-200 bg-white px-2 py-3 text-center font-bold text-black">
                  <input
                    type="checkbox"
                    checked={allPendingSelected}
                    onChange={handleSelectAll}
                    disabled={pendingItems.length === 0}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>

                {[
                  ['date', 'Date'],
                  ['center.centerName', 'Center'],
                  ['product.productTitle', 'Product'],
                  ['quantity', 'Total Quantity'],
                  ['damageQty', 'Damage Qty'],
                  ['underRepairQty', 'Under Repair Qty'],
                  ['repairedQty', 'Repaired Qty'],
                  ['irrepairedQty', 'Irrepaired Qty'],
                  ['overallStatus', 'Status'],
                ].map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="cursor-pointer border border-gray-200 bg-white px-2 py-3 text-left font-bold text-black transition hover:bg-gray-100"
                  >
                    {label}
                    {getSortIcon(key)}
                  </th>
                ))}

                <th className="border border-gray-200 bg-white px-2 py-3 text-left font-bold text-black">
                  Pending Qty
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const totalQty =
                    item.quantity ||
                    item.quantitySummary?.total ||
                    0

                  const damageQty =
                    item.damageQty ||
                    item.quantitySummary?.damageQty ||
                    0

                  const underRepairQty =
                    item.underRepairQty ||
                    item.quantitySummary?.underRepair ||
                    0

                  const repairedQty =
                    item.repairedQty ||
                    item.quantitySummary?.repaired ||
                    0

                  const irrepairedQty =
                    item.irrepairedQty ||
                    item.quantitySummary?.irrepaired ||
                    0

                  const pendingQty =
                    item.pendingDamageQty ||
                    item.quantitySummary?.pendingDamage ||
                    0

                  const isPending =
                    item.overallStatus === 'pending_damage' ||
                    item.overallStatus === 'pending damage'

                  const isSelected =
                    selectedItems.includes(item._id)

                  return (
                    <tr
                      key={item._id}
                      className={`${isSelected ? 'bg-[#dff0d8]' : filteredData.indexOf(item) % 2 === 0 ? 'bg-[#f1f1f1]' : 'bg-white'} transition-colors hover:bg-blue-50`}
                    >
                      <td className="border border-gray-100 px-2 py-3 text-center">
                        {isPending && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              handleSelectItem(item._id)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        )}
                      </td>

                      <td className="break-words border border-gray-100 px-2 py-3">
                        {formatDate(item.createdAt || '')}
                      </td>

                      <td className="break-words border border-gray-100 px-2 py-3">
                        {item.center?.centerName || 'N/A'}
                      </td>

                      <td className="break-words border border-gray-100 px-2 py-3">
                        {item.product?.productTitle ||
                          item.productDetails?.productTitle ||
                          ''}
                      </td>

                      <td className="border border-gray-100 px-2 py-3 text-center font-semibold">
                        {totalQty}
                      </td>

                      <td className="border border-gray-100 px-2 py-3 text-center">
                        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                          {damageQty}
                        </span>
                      </td>

                      <td className="border border-gray-100 px-2 py-3 text-center">
                        <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                          {underRepairQty}
                        </span>
                      </td>

                      <td className="border border-gray-100 px-2 py-3 text-center">
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                          {repairedQty}
                        </span>
                      </td>

                      <td className="border border-gray-100 px-2 py-3 text-center">
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          {irrepairedQty}
                        </span>
                      </td>

                      <td className="break-words border border-gray-100 px-2 py-3">
                        {renderStatusBadge(
                          item.overallStatus ||
                            item.status ||
                            '',
                        )}
                      </td>

                      <td className="border border-gray-100 px-2 py-3 text-center">
                        {pendingQty > 0 ? (
                          <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                            {pendingQty}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="border border-gray-100 px-3 py-8 text-center text-sm text-gray-500"
                  >
                    No faulty stock records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FaultyStock