import React, { useState, useRef, useEffect } from 'react'
import {
  ArrowUp,
  ArrowDown,
  Search,
  RotateCcw,
  FileSpreadsheet,
  Printer,
  X,
  Info,
} from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import Pagination from '../../utils/Pagination'
import { showError, showSuccess } from '../../utils/sweetAlerts'
import SearchCenterStock from './SearchCenterStock'

const AvailableStock = () => {
  const [data, setData] = useState([])
  const [centers, setCenters] = useState([])
  const [products, setProducts] = useState([])
  const [resellers, setResellers] = useState([])

  const [loading, setLoading] = useState(true)
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
    center: '',
    resellerId: '',
    startDate: '',
    endDate: '',
  })

  const [dropdownOpen, setDropdownOpen] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const dropdownRefs = useRef({})

  // =========================
  // Fetch Available Stock
  // =========================
  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (searchParams.product) {
        params.append('product', searchParams.product)
      }

      if (searchParams.center) {
        params.append('center', searchParams.center)
      }

      if (searchParams.resellerId) {
        params.append('resellerId', searchParams.resellerId)
      }

      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate)
      }

      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate)
      }

      params.append('page', page)

      const url = params.toString()
        ? `/availableStock/availableStock?${params.toString()}`
        : '/availableStock/availableStock'

      const response = await axiosInstance.get(url)

      if (response.data.success) {
        setData(response.data.data.stock)
        setCurrentPage(response.data.data.pagination.currentPage)
        setTotalPages(response.data.data.pagination.totalPages)
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

  // =========================
  // Fetch Centers
  // =========================
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

  // =========================
  // Fetch Products
  // =========================
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

  // =========================
  // Fetch Resellers
  // =========================
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

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    fetchData()
    fetchCenters()
    fetchProducts()
    fetchResellers()
  }, [])

  // =========================
  // Pagination
  // =========================
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return

    fetchData(activeSearch, page)
  }

  // =========================
  // Sorting
  // =========================
  const handleSort = (key) => {
    let direction = 'ascending'

    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }

    setSortConfig({
      key,
      direction,
    })

    const sortedData = [...data].sort((a, b) => {
      let aValue = a
      let bValue = b

      if (key.includes('.')) {
        const keys = key.split('.')

        aValue = keys.reduce(
          (obj, k) => obj && obj[k],
          a,
        )

        bValue = keys.reduce(
          (obj, k) => obj && obj[k],
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

  // =========================
  // Sort Icon
  // =========================
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

  // =========================
  // Search
  // =========================
  const handleSearch = (searchData) => {
    setActiveSearch(searchData)
    fetchData(searchData, 1)
  }

  // =========================
  // Reset Search
  // =========================
  const handleResetSearch = () => {
    setActiveSearch({
      product: '',
      center: '',
      resellerId: '',
      startDate: '',
      endDate: '',
    })

    setSearchTerm('')

    fetchData({}, 1)
  }

  // =========================
  // Export Modal
  // =========================
  const openExportModal = () => {
    setExportStartDate(activeSearch.startDate || '')
    setExportEndDate(activeSearch.endDate || '')
    setExportModalVisible(true)
  }

  // =========================
  // Generate Export
  // =========================
  const generateDetailExport = async () => {
    try {
      setLoading(true)

      // Validate dates
      if (
        exportStartDate &&
        exportEndDate &&
        exportStartDate > exportEndDate
      ) {
        showError('Start date cannot be greater than end date')
        setLoading(false)
        return
      }

      const params = new URLSearchParams()

      // Only date filters are used for export
      if (exportStartDate) {
        params.append('startDate', exportStartDate)
      }

      if (exportEndDate) {
        params.append('endDate', exportEndDate)
      }

      params.append('export', 'true')

      const apiUrl = `/availableStock/availableStock?${params.toString()}`

      console.log('Export API URL:', apiUrl)

      const response = await axiosInstance.get(apiUrl, {
        responseType: 'blob',
      })

      if (response.data instanceof Blob) {
        let filename = 'available_stock_export'

        if (exportStartDate && exportEndDate) {
          filename += `_${exportStartDate}_to_${exportEndDate}`
        } else if (exportStartDate) {
          filename += `_from_${exportStartDate}`
        } else if (exportEndDate) {
          filename += `_until_${exportEndDate}`
        } else {
          filename += `_${new Date().toISOString().split('T')[0]}`
        }

        const contentType = response.headers['content-type']

        if (
          contentType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          filename += '.xlsx'
        } else if (contentType === 'application/vnd.ms-excel') {
          filename += '.xls'
        } else {
          filename += '.xlsx'
        }

        const blob = new Blob([response.data], {
          type: contentType,
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
      } else {
        throw new Error('Unexpected response format from server')
      }
    } catch (error) {
      console.error('Error generating export:', error)

      let errorMessage = 'Error generating export file'

      if (
        error.response &&
        error.response.data instanceof Blob
      ) {
        try {
          const text = await error.response.data.text()
          const parsed = JSON.parse(text)

          errorMessage =
            parsed.message ||
            parsed.error ||
            errorMessage
        } catch (e) {
          errorMessage =
            error.response.statusText || errorMessage
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // Local Search
  // =========================
  const filteredData = data.filter((item) => {
    if (
      activeSearch.product ||
      activeSearch.center ||
      activeSearch.resellerId ||
      activeSearch.startDate ||
      activeSearch.endDate
    ) {
      return true
    }

    return Object.values(item).some((value) => {
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

  // =========================
  // Close Dropdowns
  // =========================
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

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-4 text-2xl font-semibold text-gray-800">
        Available Stock
      </div>

      {/* Search Modal */}
      <SearchCenterStock
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        resellers={resellers}
      />

      {/* Export Modal */}
      {exportModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Export Stock Data
              </h3>

              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 px-5 py-5">
              <div>
                <label
                  htmlFor="exportStartDate"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Start Date (Optional)
                </label>

                <input
                  type="date"
                  id="exportStartDate"
                  value={exportStartDate}
                  onChange={(e) =>
                    setExportStartDate(e.target.value)
                  }
                  placeholder="Select start date"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to include all records from
                  beginning
                </p>
              </div>

              <div>
                <label
                  htmlFor="exportEndDate"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  End Date (Optional)
                </label>

                <input
                  type="date"
                  id="exportEndDate"
                  value={exportEndDate}
                  onChange={(e) =>
                    setExportEndDate(e.target.value)
                  }
                  placeholder="Select end date"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to include all records until
                  today
                </p>
              </div>

              <div className="flex gap-2 rounded-md bg-blue-50 p-3 text-xs text-blue-700">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />

                <span>
                  Export will include all centers, products,
                  and resellers within the selected date
                  range.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() =>
                  setExportModalVisible(false)
                }
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={generateDetailExport}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            {/* Reset */}
            {(activeSearch.product ||
              activeSearch.center ||
              activeSearch.resellerId ||
              activeSearch.startDate ||
              activeSearch.endDate) && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-1.5 rounded-md bg-gray-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Search
              </button>
            )}

            {/* Export */}
            <button
              type="button"
              onClick={openExportModal}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export
            </button>

            {/* Print */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>

          {/* Pagination */}
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              {(activeSearch.resellerId ||
                activeSearch.startDate ||
                activeSearch.endDate) && (
                <div className="text-sm text-gray-500">
                  {activeSearch.resellerId &&
                    `Reseller: ${
                      resellers.find(
                        (r) =>
                          r._id === activeSearch.resellerId,
                      )?.businessName ||
                      activeSearch.resellerId
                    } | `}

                  {activeSearch.startDate &&
                    `From: ${activeSearch.startDate} | `}

                  {activeSearch.endDate &&
                    `To: ${activeSearch.endDate}`}
                </div>
              )}
            </div>

            {/* Local Search */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="available-stock-search"
                className="text-sm font-medium text-gray-700"
              >
                Search:
              </label>

              <input
                id="available-stock-search"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="h-8 w-full max-w-[350px] border border-gray-300 px-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    scope="col"
                    onClick={() => handleSort('outlet')}
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Branch
                    {getSortIcon('outlet')}
                  </th>

                  <th
                    scope="col"
                    onClick={() => handleSort('date')}
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Product
                    {getSortIcon('date')}
                  </th>

                  <th
                    scope="col"
                    onClick={() => handleSort('invoiceNo')}
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Category
                    {getSortIcon('invoiceNo')}
                  </th>

                  <th
                    scope="col"
                    onClick={() =>
                      handleSort('vendor.businessName')
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Stock
                    {getSortIcon('vendor.businessName')}
                  </th>

                  <th
                    scope="col"
                    onClick={() =>
                      handleSort('damagedQuantity')
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Damage
                    {getSortIcon('damagedQuantity')}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {item.centerName || ''}
                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {item.productName}
                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {item.productCategory?.name || ''}
                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {item.availableQuantity || 0}
                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {item.damagedQuantity || 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="border border-gray-200 px-4 py-8 text-center text-sm text-gray-500"
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
    </div>
  )
}

export default AvailableStock