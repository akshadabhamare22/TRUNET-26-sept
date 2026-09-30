import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react'

import axiosInstance from '../../../axiosInstance';
import { showError, confirmDelete, showSuccess } from '../../../utils/sweetAlerts'
import Pagination from '../../../utils/Pagination';
import { formatDate, formatDateTime } from '../../../utils/FormatDateTime'
import usePermission from '../../../utils/usePermission'

const CenterProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [center, setCenter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [activeTab, setActiveTab] = useState('indent')
  const [indentActiveTab, setIndentActiveTab] = useState('closed')
  const [usageActiveTab, setUsageActiveTab] = useState('pending')

  const [indentData, setIndentData] = useState([])
  const [usageData, setUsageData] = useState([])
  const [availableStockData, setAvailableStockData] = useState([])

  const [dropdownOpen, setDropdownOpen] = useState({})

  const [indentCurrentPage, setIndentCurrentPage] = useState(1)
  const [indentTotalPages, setIndentTotalPages] = useState(1)

  const [usageCurrentPage, setUsageCurrentPage] = useState(1)
  const [usageTotalPages, setUsageTotalPages] = useState(1)

  const [stockCurrentPage, setStockCurrentPage] = useState(1)
  const [stockTotalPages, setStockTotalPages] = useState(1)

  const [loadingTabs, setLoadingTabs] = useState({
    indent: false,
    usage: false,
    availableStock: false,
  })

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
    tab: 'indent',
  })

  const dropdownRefs = useRef({})
  const { hasAnyPermission } = usePermission()

  useEffect(() => {
    const fetchCenter = async () => {
      try {
        setLoading(true)

        const response = await axiosInstance.get(`/centers/${id}`)

        if (response.data.success) {
          setCenter(response.data.data)
          fetchIndentData(1)
        } else {
          throw new Error('Failed to fetch center data')
        }
      } catch (err) {
        setError(err.message)
        console.error('Error fetching center:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCenter()
    }
  }, [id])

  const fetchIndentData = async (page = 1) => {
    try {
      setLoadingTabs((prev) => ({
        ...prev,
        indent: true,
      }))

      const response = await axiosInstance.get(
        `/stockrequest?center=${id}&status=Rejected&status=Completed&page=${page}`,
      )

      if (response.data.success) {
        setIndentData(response.data.data || [])
        setIndentCurrentPage(
          response.data.pagination?.currentPage || 1,
        )
        setIndentTotalPages(
          response.data.pagination?.totalPages || 1,
        )
      }
    } catch (err) {
      console.error('Error fetching indent data:', err)
      setIndentData([])
    } finally {
      setLoadingTabs((prev) => ({
        ...prev,
        indent: false,
      }))
    }
  }

  const fetchUsageData = async (page = 1) => {
    try {
      setLoadingTabs((prev) => ({
        ...prev,
        usage: true,
      }))

      const response = await axiosInstance.get(
        `/damage?center=${id}&page=${page}`,
      )

      if (response.data.success) {
        setUsageData(response.data.data || [])
        setUsageCurrentPage(
          response.data.pagination?.currentPage || 1,
        )
        setUsageTotalPages(
          response.data.pagination?.totalPages || 1,
        )
      }
    } catch (err) {
      console.error('Error fetching usage data:', err)
      setUsageData([])
    } finally {
      setLoadingTabs((prev) => ({
        ...prev,
        usage: false,
      }))
    }
  }

  const fetchAvailableStockData = async (page = 1) => {
    try {
      setLoadingTabs((prev) => ({
        ...prev,
        availableStock: true,
      }))

      const response = await axiosInstance.get(
        `/availableStock/availableStock?center=${id}&page=${page}`,
      )

      if (response.data.success) {
        setAvailableStockData(
          response.data.data?.stock || [],
        )

        setStockCurrentPage(
          response.data.data?.pagination?.currentPage || 1,
        )

        setStockTotalPages(
          response.data.data?.pagination?.totalPages || 1,
        )
      }
    } catch (err) {
      console.error('Error fetching available stock data:', err)
      setAvailableStockData([])
    } finally {
      setLoadingTabs((prev) => ({
        ...prev,
        availableStock: false,
      }))
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)

    switch (tab) {
      case 'indent':
        if (indentData.length === 0) {
          fetchIndentData()
        }
        break

      case 'usage':
        if (usageData.length === 0) {
          fetchUsageData()
        }
        break

      case 'availableStock':
        if (availableStockData.length === 0) {
          fetchAvailableStockData()
        }
        break

      default:
        break
    }
  }

  const handleIndentTabChange = (tab) => {
    setIndentActiveTab(tab)

    if (tab === 'open') {
      navigate('/stock-request')
    }
  }

  const handleUsageTabChange = (tab) => {
    setUsageActiveTab(tab)

    if (tab === 'all') {
      navigate('/stock-usage')
    }
  }

  const handleAddStockRequest = () => {
    navigate('/add-stockRequest')
  }

  const handleAddStockUsage = () => {
    navigate('/add-stockUsage')
  }

  const handleIndentPageChange = (page) => {
    if (page < 1 || page > indentTotalPages) return
    fetchIndentData(page)
  }

  const handleUsagePageChange = (page) => {
    if (page < 1 || page > usageTotalPages) return
    fetchUsageData(page)
  }

  const handleStockPageChange = (page) => {
    if (page < 1 || page > stockTotalPages) return
    fetchAvailableStockData(page)
  }

  const handleDeleteIndent = async (indentId) => {
    const result = await confirmDelete()

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/stockrequest/${indentId}`)

        setIndentData((prev) =>
          prev.filter((item) => item._id !== indentId),
        )

        showSuccess('Indent deleted successfully!')
      } catch (error) {
        console.error('Error deleting indent:', error)
        showError('Error deleting indent')
      }
    }
  }

  const handleSort = (key, tab) => {
    let direction = 'ascending'

    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending' &&
      sortConfig.tab === tab
    ) {
      direction = 'descending'
    }

    setSortConfig({
      key,
      direction,
      tab,
    })

    let dataToSort = []
    let setDataFunction = null

    switch (tab) {
      case 'indent':
        dataToSort = [...indentData]
        setDataFunction = setIndentData
        break

      case 'usage':
        dataToSort = [...usageData]
        setDataFunction = setUsageData
        break

      case 'availableStock':
        dataToSort = [...availableStockData]
        setDataFunction = setAvailableStockData
        break

      default:
        return
    }

    const sortedData = dataToSort.sort((a, b) => {
      let aValue = a
      let bValue = b

      if (key.includes(' ')) {
        aValue = a[key]
        bValue = b[key]
      } else if (key.includes('.')) {
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

      if (aValue == null) aValue = ''
      if (bValue == null) bValue = ''

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1
      }

      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1
      }

      return 0
    })

    setDataFunction(sortedData)
  }

  const getSortIcon = (key, tab) => {
    if (
      sortConfig.key !== key ||
      sortConfig.tab !== tab
    ) {
      return null
    }

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    )
  }

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {}
      let shouldUpdate = false

      Object.keys(dropdownRefs.current).forEach((key) => {
        const element = dropdownRefs.current[key]

        if (
          element &&
          !element.contains(event.target)
        ) {
          newDropdownState[key] = false
          shouldUpdate = true
        }
      })

      if (shouldUpdate) {
        setDropdownOpen((prev) => ({
          ...prev,
          ...newDropdownState,
        }))
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  const handleIndentClick = (itemId) => {
    navigate(`/stockRequest-profile/${itemId}`)
  }

  const SortableHeader = ({ label, sortKey, tab }) => (
    <th
      onClick={() => handleSort(sortKey, tab)}
      className="cursor-pointer select-none whitespace-nowrap border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:bg-gray-100"
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>

        {getSortIcon(sortKey, tab) || (
          <ArrowUp
            size={13}
            className="text-gray-400"
          />
        )}
      </div>
    </th>
  )

  const OptionsDropdown = ({
    id: itemId,
    canDelete,
  }) => (
    <div
      className="relative"
      ref={(el) => {
        dropdownRefs.current[itemId] = el
      }}
    >
      <button
        type="button"
        onClick={() => toggleDropdown(itemId)}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-xs font-medium text-gray-700 transition hover:border-[#2759A2] hover:bg-gray-50"
      >
        <Settings size={14} />
        Options
        <ChevronDown
          size={13}
          className={`transition-transform ${
            dropdownOpen[itemId]
              ? 'rotate-180'
              : ''
          }`}
        />
      </button>

      {dropdownOpen[itemId] && (
        <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {canDelete && (
            <button
              type="button"
              onClick={() =>
                handleDeleteIndent(itemId)
              }
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={15} />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )

  const renderIndentTable = () => (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleAddStockRequest}
          className="inline-flex h-9 w-fit items-center gap-1.5 rounded-md bg-[#2759A2] px-3 text-sm font-medium text-white transition hover:bg-[#1f4782]"
        >
          <Plus size={16} />
          Add
        </button>

        <Pagination
          currentPage={indentCurrentPage}
          totalPages={indentTotalPages}
          onPageChange={handleIndentPageChange}
        />
      </div>

      {/* Inner Tabs */}
      <div className="mb-4 flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => handleIndentTabChange('open')}
          className={`border-b-4 px-5 py-2.5 text-sm font-medium transition ${
            indentActiveTab === 'open'
              ? 'border-[#2759A2] text-[#2759A2]'
              : 'border-transparent text-gray-600 hover:text-[#2759A2]'
          }`}
        >
          Open
        </button>

        <button
          type="button"
          onClick={() => handleIndentTabChange('closed')}
          className={`border-b-4 px-5 py-2.5 text-sm font-medium transition ${
            indentActiveTab === 'closed'
              ? 'border-[#2759A2] text-[#2759A2]'
              : 'border-transparent text-gray-600 hover:text-[#2759A2]'
          }`}
        >
          Closed
        </button>
      </div>

      {indentActiveTab === 'open' && (
        <div className="rounded-md border border-gray-200 px-5 py-10 text-center">
          <p className="mb-4 text-sm text-gray-600">
            Click on the Open tab to view all open stock
            requests
          </p>

          <button
            type="button"
            onClick={() => navigate('/stock-request')}
            className="rounded-md bg-[#2759A2] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f4782]"
          >
            Go to Stock Requests
          </button>
        </div>
      )}

      {indentActiveTab === 'closed' && (
        <div className="w-full overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-[1050px] w-full border-collapse">
            <thead>
              <tr>
                <SortableHeader
                  label="Date"
                  sortKey="date"
                  tab="indent"
                />

                <SortableHeader
                  label="Number"
                  sortKey="orderNumber"
                  tab="indent"
                />

                <SortableHeader
                  label="From"
                  sortKey="warehouse.centerName"
                  tab="indent"
                />

                <SortableHeader
                  label="Center"
                  sortKey="center.centerName"
                  tab="indent"
                />

                <SortableHeader
                  label="Posted By"
                  sortKey="createdBy.email"
                  tab="indent"
                />

                <SortableHeader
                  label="Status"
                  sortKey="status"
                  tab="indent"
                />

                <SortableHeader
                  label="Remarks"
                  sortKey="products[0].productRemark"
                  tab="indent"
                />

                <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loadingTabs.indent ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#2759A2]" />
                      Loading indent data...
                    </div>
                  </td>
                </tr>
              ) : indentData.length > 0 ? (
                indentData.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`transition hover:bg-blue-50 ${
                      index % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      {formatDate(item.date)}
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() =>
                          handleIndentClick(item._id)
                        }
                        className="font-medium text-[#337ab7] hover:underline"
                      >
                        {item.orderNumber}
                      </button>
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      {item.warehouse?.centerName || ''}
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      {item.center?.centerName || 'N/A'}
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      {item.createdBy?.email || 'N/A'}

                      {item.createdAt &&
                        ` At ${new Date(
                          item.createdAt,
                        ).toLocaleTimeString(
                          'en-US',
                          {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          },
                        )}`}
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3 text-sm">
                      {item.status && (
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.status.toLowerCase() ===
                            'completed'
                              ? 'bg-green-100 text-green-700'
                              : item.status.toLowerCase() ===
                                  'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      {item.products?.[0]
                        ?.productRemark || ''}
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3">
                      <OptionsDropdown
                        id={item._id}
                        canDelete={hasAnyPermission(
                          'Indent',
                          [
                            'delete_indent_own_center',
                            'delete_indent_all_center',
                          ],
                        )}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No closed indent data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  const renderUsageTable = () => (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleAddStockUsage}
          className="inline-flex h-9 w-fit items-center gap-1.5 rounded-md bg-[#2759A2] px-3 text-sm font-medium text-white transition hover:bg-[#1f4782]"
        >
          <Plus size={16} />
          Add
        </button>

        <Pagination
          currentPage={usageCurrentPage}
          totalPages={usageTotalPages}
          onPageChange={handleUsagePageChange}
        />
      </div>

      {/* Inner Tabs */}
      <div className="mb-4 flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => handleUsageTabChange('all')}
          className={`border-b-4 px-5 py-2.5 text-sm font-medium transition ${
            usageActiveTab === 'all'
              ? 'border-[#2759A2] text-[#2759A2]'
              : 'border-transparent text-gray-600 hover:text-[#2759A2]'
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => handleUsageTabChange('pending')}
          className={`border-b-4 px-5 py-2.5 text-sm font-medium transition ${
            usageActiveTab === 'pending'
              ? 'border-[#2759A2] text-[#2759A2]'
              : 'border-transparent text-gray-600 hover:text-[#2759A2]'
          }`}
        >
          Pending
        </button>
      </div>

      {usageActiveTab === 'all' && (
        <div className="rounded-md border border-gray-200 px-5 py-10 text-center">
          <p className="mb-4 text-sm text-gray-600">
            Click on the All tab to view all stock usage
            records
          </p>

          <button
            type="button"
            onClick={() => navigate('/stock-usage')}
            className="rounded-md bg-[#2759A2] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f4782]"
          >
            Go to Stock Usage
          </button>
        </div>
      )}

      {usageActiveTab === 'pending' && (
        <div className="w-full overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-[900px] w-full border-collapse">
            <thead>
              <tr>
                <SortableHeader
                  label="Date"
                  sortKey="date"
                  tab="usage"
                />

                <SortableHeader
                  label="Type"
                  sortKey="usageType"
                  tab="usage"
                />

                <SortableHeader
                  label="Center"
                  sortKey="center.centerName"
                  tab="usage"
                />

                <SortableHeader
                  label="Remark"
                  sortKey="remark"
                  tab="usage"
                />

                <SortableHeader
                  label="Detail"
                  sortKey="customer.username"
                  tab="usage"
                />

                <SortableHeader
                  label="Created At"
                  sortKey="createdAt"
                  tab="usage"
                />
              </tr>
            </thead>

            <tbody>
              {loadingTabs.usage ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#2759A2]" />
                      Loading usage data...
                    </div>
                  </td>
                </tr>
              ) : usageData.length > 0 ? (
                usageData.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`transition hover:bg-blue-50 ${
                      index % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="border-b border-gray-100 px-4 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/edit-stockUsage/${item._id}`,
                          )
                        }
                        className="font-medium text-[#337ab7] hover:underline"
                      >
                        {formatDate(item.date)}
                      </button>
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      Damage Return
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      {item.center?.centerName || ''}
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      {item.remark || ''}
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      Pending Damage Return
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                      {formatDateTime(item.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No pending damage return records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  const renderAvailableStockTable = () => (
    <div>
      {/* Pagination */}
      <div className="mb-4 flex justify-end">
        <Pagination
          currentPage={stockCurrentPage}
          totalPages={stockTotalPages}
          onPageChange={handleStockPageChange}
        />
      </div>

      <div className="w-full overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-[800px] w-full border-collapse">
          <thead>
            <tr>
              <SortableHeader
                label="Center"
                sortKey="centerName"
                tab="availableStock"
              />

              <SortableHeader
                label="Product"
                sortKey="productName"
                tab="availableStock"
              />

              <SortableHeader
                label="Category"
                sortKey="productCategory.name"
                tab="availableStock"
              />

              <SortableHeader
                label="Stock"
                sortKey="availableQuantity"
                tab="availableStock"
              />

              <SortableHeader
                label="Damage"
                sortKey="damagedQuantity"
                tab="availableStock"
              />
            </tr>
          </thead>

          <tbody>
            {loadingTabs.availableStock ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-gray-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#2759A2]" />
                    Loading available stock data...
                  </div>
                </td>
              </tr>
            ) : availableStockData.length > 0 ? (
              availableStockData.map((item, index) => (
                <tr
                  key={item._id}
                  className={`transition hover:bg-blue-50 ${
                    index % 2 === 0
                      ? 'bg-white'
                      : 'bg-gray-50/50'
                  }`}
                >
                  <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                    {item.centerName || ''}
                  </td>

                  <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                    {item.productName}
                  </td>

                  <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                    {item.productCategory?.name || ''}
                  </td>

                  <td className="border-b border-gray-100 px-4 py-3 text-sm font-medium text-gray-700">
                    {item.availableQuantity || 0}
                  </td>

                  <td className="border-b border-gray-100 px-4 py-3 text-sm font-medium text-gray-700">
                    {item.damagedQuantity || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-gray-500"
                >
                  No available stock data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2759A2]" />
          <span className="text-sm text-gray-500">
            Loading center profile...
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-4 mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Error loading center profile: {error}
      </div>
    )
  }

  if (!center) {
    return (
      <div className="mx-4 mt-5 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
        Center not found
      </div>
    )
  }

  const handleBack = () => {
    navigate('/center-list')
  }

  return (
    <div className="w-full px-4 py-5 md:px-6">
      {/* Page Header */}
      <div className="mb-5 flex items-center">
        <button
          type="button"
          onClick={handleBack}
          className="mr-4 inline-flex h-9 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-2xl font-semibold text-gray-800">
          Center Details
        </h1>
      </div>

      {/* Center Details */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
          <h2 className="text-base font-semibold text-gray-800">
            {center.centerName}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="w-1/3 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700">
                  Name:
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {center.centerName || 'N/A'}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <td className="bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700">
                  Email:
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {center.email || 'N/A'}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <td className="bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700">
                  Mobile:
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {center.mobile || 'N/A'}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <td className="bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700">
                  Code:
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {center.centerCode || 'N/A'}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <td className="bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700">
                  Type:
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {center.centerType || 'Center'}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <td className="bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700">
                  Address:
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {center.addressLine1 || 'N/A'}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <td className="bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700">
                  City:
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {center.city || 'N/A'}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <td className="bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700">
                  State:
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {center.state || 'N/A'}
                </td>
              </tr>

              <tr>
                <td className="bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700">
                  Center Debit:
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {center.centerDebit || 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Section */}
      <div className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-5">
          {/* Main Tabs */}
          <div className="mb-5 flex overflow-x-auto border-b border-gray-200">
            <button
              type="button"
              onClick={() => handleTabChange('indent')}
              className={`whitespace-nowrap border-b-4 px-5 py-3 text-sm font-medium transition ${
                activeTab === 'indent'
                  ? 'border-[#2759A2] text-[#2759A2]'
                  : 'border-transparent text-gray-600 hover:text-[#2759A2]'
              }`}
            >
              Indent
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('usage')}
              className={`whitespace-nowrap border-b-4 px-5 py-3 text-sm font-medium transition ${
                activeTab === 'usage'
                  ? 'border-[#2759A2] text-[#2759A2]'
                  : 'border-transparent text-gray-600 hover:text-[#2759A2]'
              }`}
            >
              Usage
            </button>

            <button
              type="button"
              onClick={() =>
                handleTabChange('availableStock')
              }
              className={`whitespace-nowrap border-b-4 px-5 py-3 text-sm font-medium transition ${
                activeTab === 'availableStock'
                  ? 'border-[#2759A2] text-[#2759A2]'
                  : 'border-transparent text-gray-600 hover:text-[#2759A2]'
              }`}
            >
              Available Stock
            </button>
          </div>

          {activeTab === 'indent' &&
            renderIndentTable()}

          {activeTab === 'usage' &&
            renderUsageTable()}

          {activeTab === 'availableStock' &&
            renderAvailableStockTable()}
        </div>
      </div>
    </div>
  )
}

export default CenterProfile