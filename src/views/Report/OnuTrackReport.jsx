import React, { useState, useRef, useEffect } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'
import axiosInstance from '../../axiosInstance'
import Pagination from '../../utils/Pagination'
import { showError, showSuccess } from '../../utils/sweetAlerts'
import { formatDate } from '../../utils/FormatDateTime'
import ONUSearch from './ONUSearch'

const OnuTrackReport = () => {
  const [data, setData] = useState([])
  const [centers, setCenters] = useState([])
  const [products, setProducts] = useState([])
  const [resellers, setResellers] = useState([])

  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [error, setError] = useState(null)

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [searchModalVisible, setSearchModalVisible] = useState(false)

  const [exportModalVisible, setExportModalVisible] = useState(false)
  const [exportStartDate, setExportStartDate] = useState('')
  const [exportEndDate, setExportEndDate] = useState('')

  const [activeSearch, setActiveSearch] = useState({
    product: '',
    status: '',
    keyword: '',
    reseller: '',
  })

  const [dropdownOpen, setDropdownOpen] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const dropdownRefs = useRef({})

  const [selectedSerial, setSelectedSerial] = useState(null)
  const [serialHistory, setSerialHistory] = useState([])
  const [serialModalVisible, setSerialModalVisible] = useState(false)

  // --------------------------------------------------
  // Fetch ONU Report
  // --------------------------------------------------
  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (searchParams.product) {
        params.append('product', searchParams.product)
      }

      if (searchParams.status) {
        params.append('status', searchParams.status)
      }

      if (searchParams.keyword) {
        params.append('search', searchParams.keyword)
      }

      if (searchParams.reseller) {
        params.append('reseller', searchParams.reseller)
      }

      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate)
      }

      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate)
      }

      params.append('page', page)

      const url = `/reports/onu-report?${params.toString()}`
      const response = await axiosInstance.get(url)

      if (response.data.success) {
        setData(response.data.data)
        setCurrentPage(response.data.pagination.currentPage)
        setTotalPages(response.data.pagination.totalPages)
      } else {
        const errorMessage =
          response.data.message ||
          'API returned unsuccessful response'

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

  // --------------------------------------------------
  // Fetch Centers
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Fetch Products
  // --------------------------------------------------
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all')

      if (response.data.success) {
        setProducts(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // --------------------------------------------------
  // Fetch Resellers
  // --------------------------------------------------
  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers')

      if (response.data.success) {
        setResellers(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching resellers:', error)
    }
  }

  useEffect(() => {
    fetchData()
    fetchCenters()
    fetchProducts()
    fetchResellers()
  }, [])

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return

    fetchData(activeSearch, page)
  }

  // --------------------------------------------------
  // Sorting
  // --------------------------------------------------
  const getNestedValue = (object, path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], object)
  }

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
      const aValue = getNestedValue(a, key)
      const bValue = getNestedValue(b, key)

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
    if (sortConfig.key !== key) return null

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp size={14} className="inline-block" />
    ) : (
      <ArrowDown size={14} className="inline-block" />
    )
  }

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const handleSearch = (searchData) => {
    setActiveSearch(searchData)
    fetchData(searchData, 1)
  }

  const handleResetSearch = () => {
    const resetData = {
      product: '',
      status: '',
      keyword: '',
      reseller: '',
    }

    setActiveSearch(resetData)
    setSearchTerm('')
    fetchData({}, 1)
  }

  const isSearchActive = () => {
    return (
      activeSearch.product ||
      activeSearch.status ||
      activeSearch.keyword ||
      activeSearch.reseller ||
      activeSearch.startDate ||
      activeSearch.endDate
    )
  }

  // --------------------------------------------------
  // Export Modal
  // --------------------------------------------------
  const openExportModal = () => {
    setExportStartDate(activeSearch.startDate || '')
    setExportEndDate(activeSearch.endDate || '')
    setExportModalVisible(true)
  }

  // --------------------------------------------------
  // Frontend Search
  // --------------------------------------------------
  const filteredData = data.filter((record) => {
    if (isSearchActive()) {
      return true
    }

    const searchLower = searchTerm.toLowerCase()

    return Object.values(record).some((value) => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(
          (nestedValue) =>
            nestedValue &&
            nestedValue
              .toString()
              .toLowerCase()
              .includes(searchLower),
        )
      }

      return (
        value &&
        value.toString().toLowerCase().includes(searchLower)
      )
    })
  })

  // --------------------------------------------------
  // Dropdown Outside Click
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {}
      let shouldUpdate = false

      Object.keys(dropdownRefs.current).forEach((key) => {
        if (
          dropdownRefs.current[key] &&
          !dropdownRefs.current[key].contains(event.target)
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
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // --------------------------------------------------
  // Serial History
  // --------------------------------------------------
  const handleSerialClick = (serial, productId) => {
    const history = data.flatMap((record) =>
      record.items
        .filter(
          (item) =>
            item.serialNumbers &&
            item.serialNumbers.some(
              (sn) => sn.serialNumber === serial,
            ),
        )
        .map((item) => ({
          date: record.date,
          transaction: 'Customer Usage',
          type: record.connectionType,
          useIn: record.usageType,
          product: item.product?.productTitle,
          centerFrom: record.center?.centerName,
          customer: record.customer?.name,
        })),
    )

    setSelectedSerial(serial)
    setSerialHistory(history)
    setSerialModalVisible(true)
  }

  // --------------------------------------------------
  // Export CSV
  // --------------------------------------------------
  const generateDetailExport = async () => {
    try {
      setExportLoading(true)

      if (
        exportStartDate &&
        exportEndDate &&
        exportStartDate > exportEndDate
      ) {
        showError('Start date cannot be greater than end date')
        setExportLoading(false)
        return
      }

      const params = new URLSearchParams()

      if (activeSearch.product) {
        params.append('product', activeSearch.product)
      }

      if (activeSearch.status) {
        params.append('status', activeSearch.status)
      }

      if (activeSearch.keyword) {
        params.append('search', activeSearch.keyword)
      }

      if (activeSearch.reseller) {
        params.append('reseller', activeSearch.reseller)
      }

      if (exportStartDate) {
        params.append('startDate', exportStartDate)
      }

      if (exportEndDate) {
        params.append('endDate', exportEndDate)
      }

      const apiUrl = `/reports/onu-report?${params.toString()}`
      const response = await axiosInstance.get(apiUrl)

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response')
      }

      const exportData = response.data.data

      if (!exportData || exportData.length === 0) {
        showError('No data available for export')
        return
      }

      const headers = [
        'Activation Date',
        'Customer',
        'Serial Number',
        'Connection Type',
        'Reseller Name',
        'Area',
        'Center',
        'ONU Amount',
      ]

      const csvData = exportData.flatMap((record) =>
        record.items.flatMap((item) =>
          (item.serialNumbers || []).map((serial) => [
            formatDate(record.date),
            record.customer?.username || '',
            serial.serialNumber || serial,
            record.connectionType || '',
            record.center?.reseller?.businessName || '',
            record.center?.area?.areaName || '',
            record.center?.centerName || '',
            record.onuCharges || 0,
          ]),
        ),
      )

      let filename = 'ONU_Track_Report'

      if (exportStartDate && exportEndDate) {
        filename += `_${exportStartDate}_to_${exportEndDate}`
      } else if (exportStartDate) {
        filename += `_from_${exportStartDate}`
      } else if (exportEndDate) {
        filename += `_until_${exportEndDate}`
      } else {
        filename += `_${new Date().toISOString().split('T')[0]}`
      }

      filename += '.csv'

      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const stringField = String(
                field !== undefined && field !== null ? field : '',
              )

              return `"${stringField.replace(/"/g, '""')}"`
            })
            .join(','),
        ),
      ].join('\n')

      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      })

      const link = document.createElement('a')
      const downloadUrl = URL.createObjectURL(blob)

      link.setAttribute('href', downloadUrl)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(downloadUrl)

      showSuccess('Export completed successfully!')

      setExportModalVisible(false)
      setExportStartDate('')
      setExportEndDate('')
    } catch (error) {
      console.error('Error generating export:', error)
      showError('Error generating export file')
    } finally {
      setExportLoading(false)
    }
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div className="m-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-4 text-xl font-semibold text-gray-800">
        ONU Track Report
      </div>

      {/* Search Modal */}
      <ONUSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        resellers={resellers}
      />

      {/* Export Modal */}
      {exportModalVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Export ONU Track Report
              </h2>

              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 px-6 py-5">
              <div>
                <label
                  htmlFor="exportStartDate"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Start Date (Optional)
                </label>

                <input
                  type="date"
                  id="exportStartDate"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to include all records from beginning
                </p>
              </div>

              <div>
                <label
                  htmlFor="exportEndDate"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  End Date (Optional)
                </label>

                <input
                  type="date"
                  id="exportEndDate"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to include all records until today
                </p>
              </div>

              {/* Current Filters */}
              {(activeSearch.product ||
                activeSearch.status ||
                activeSearch.reseller ||
                activeSearch.keyword) && (
                <div className="rounded-md bg-gray-50 p-3">
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Current Filters:
                  </p>

                  <ul className="space-y-1 text-xs text-gray-600">
                    {activeSearch.product && (
                      <li>
                        Product:{' '}
                        {
                          products.find(
                            (p) => p._id === activeSearch.product,
                          )?.productTitle
                        }
                      </li>
                    )}

                    {activeSearch.status && (
                      <li>
                        Status: {activeSearch.status}
                      </li>
                    )}

                    {activeSearch.reseller && (
                      <li>
                        Reseller:{' '}
                        {
                          resellers.find(
                            (r) => r._id === activeSearch.reseller,
                          )?.businessName
                        }
                      </li>
                    )}

                    {activeSearch.keyword && (
                      <li>
                        Keyword: {activeSearch.keyword}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={generateDetailExport}
                disabled={exportLoading}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exportLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={16} />
                    Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Search size={15} />
              Search
            </button>

            {isSearchActive() && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <RotateCcw size={15} />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={openExportModal}
              disabled={exportLoading || data.length === 0}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={15} />
              Export
            </button>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              {(exportStartDate || exportEndDate) && (
                <div className="mb-1 text-xs text-gray-500">
                  {exportStartDate && `Export From: ${exportStartDate} `}
                  {exportEndDate && `To: ${exportEndDate}`}
                </div>
              )}

              <strong className="text-sm text-gray-700">
                Total Records: {filteredData.length}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="tableSearch"
                className="text-sm font-medium text-gray-600"
              >
                Search:
              </label>

              <input
                id="tableSearch"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 w-full max-w-[350px] rounded-md border border-gray-300 px-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1100px] w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    onClick={() => handleSort('date')}
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Activation Date {getSortIcon('date')}
                  </th>

                  <th
                    onClick={() =>
                      handleSort('customer.username')
                    }
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Customer {getSortIcon('customer.username')}
                  </th>

                  <th
                    onClick={() =>
                      handleSort('items.product.productTitle')
                    }
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Product{' '}
                    {getSortIcon('items.product.productTitle')}
                  </th>

                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                    Serial Number
                  </th>

                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                    Status
                  </th>

                  <th
                    onClick={() =>
                      handleSort('connectionType')
                    }
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Connection Type{' '}
                    {getSortIcon('connectionType')}
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        'center.reseller.businessName',
                      )
                    }
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Reseller Name{' '}
                    {getSortIcon(
                      'center.reseller.businessName',
                    )}
                  </th>

                  <th
                    onClick={() =>
                      handleSort('center.area.areaName')
                    }
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Area{' '}
                    {getSortIcon('center.area.areaName')}
                  </th>

                  <th
                    onClick={() => handleSort('onuCharges')}
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    ONU Amount {getSortIcon('onuCharges')}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.flatMap((record) =>
                    record.items.flatMap((item) =>
                      (item.serialNumbers || []).map(
                        (serial, index) => {
                          const serialValue =
                            serial.serialNumber || serial

                          const rowClass =
                            serial.status === 'consumed'
                              ? 'bg-green-50'
                              : serial.status === 'damaged'
                                ? 'bg-red-50'
                                : ''

                          return (
                            <tr
                              key={`${record._id}-${item._id}-${serialValue}-${index}`}
                              className={`${rowClass} hover:bg-gray-50`}
                            >
                              <td className="border border-gray-200 px-3 py-2 text-gray-700">
                                {formatDate(record.date)}
                              </td>

                              <td className="border border-gray-200 px-3 py-2 text-gray-700">
                                {record.customer?.username || ''}
                              </td>

                              <td className="border border-gray-200 px-3 py-2 text-gray-700">
                                {item.product?.productTitle || ''}
                              </td>

                              <td className="border border-gray-200 px-3 py-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSerialClick(
                                      serialValue,
                                      item.product?.productId,
                                    )
                                  }
                                  className="border-0 bg-transparent p-0 text-left text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {serialValue}
                                </button>
                              </td>

                              <td className="border border-gray-200 px-3 py-2 text-gray-700">
                                {serial.status || 'unknown'}
                              </td>

                              <td className="border border-gray-200 px-3 py-2 text-gray-700">
                                {record.connectionType || ''}
                              </td>

                              <td className="border border-gray-200 px-3 py-2 text-gray-700">
                                {record.center?.reseller
                                  ?.businessName || ''}
                              </td>

                              <td className="border border-gray-200 px-3 py-2 text-gray-700">
                                {record.center?.area?.areaName || ''}
                              </td>

                              <td className="border border-gray-200 px-3 py-2 text-gray-700">
                                {record.onuCharges || 0}
                              </td>
                            </tr>
                          )
                        },
                      ),
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="border border-gray-200 px-3 py-8 text-center text-gray-500"
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-green-100 ring-1 ring-green-200" />
              <span>Use Product</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-red-100 ring-1 ring-red-200" />
              <span>Damage Product</span>
            </div>
          </div>
        </div>
      </div>

      {/* Serial History Modal */}
      {serialModalVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Serial No. {selectedSerial} Track History
              </h2>

              <button
                type="button"
                onClick={() => setSerialModalVisible(false)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[70vh] overflow-auto p-6">
              <table className="min-w-[900px] w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                      Transaction
                    </th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                      Use In
                    </th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                      Branch
                    </th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                      Customer
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {serialHistory.length > 0 ? (
                    serialHistory.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-3 py-2">
                          {formatDate(row.date)}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {row.transaction}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {row.type}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {row.useIn}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {row.product}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {row.centerFrom}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {row.customer}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="border border-gray-200 px-3 py-8 text-center text-gray-500"
                      >
                        No history found for this serial number
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OnuTrackReport