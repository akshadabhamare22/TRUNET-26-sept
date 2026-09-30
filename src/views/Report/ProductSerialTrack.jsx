import React, { useEffect, useRef, useState } from 'react'
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
import { showError } from '../../utils/sweetAlerts'
import { formatDate } from '../../utils/FormatDateTime'
import ProductSerialSearch from './ProductSerialSearch'

const ProductSerialTrack = () => {
  const [data, setData] = useState([])
  const [centers, setCenters] = useState([])
  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [searchModalVisible, setSearchModalVisible] = useState(false)

  const [activeSearch, setActiveSearch] = useState({
    productId: '',
    status: '',
    keyword: '',
    reseller: '',
    center: '',
    startDate: '',
    endDate: '',
  })

  const [dropdownOpen, setDropdownOpen] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const dropdownRefs = useRef({})

  const [selectedSerial, setSelectedSerial] = useState(null)
  const [serialHistory, setSerialHistory] = useState([])
  const [serialModalVisible, setSerialModalVisible] = useState(false)

  // --------------------------------------------------
  // Date Conversion
  // DD-MM-YYYY -> YYYY-MM-DD
  // --------------------------------------------------
  const convertToYYYYMMDD = (dateStr) => {
    if (!dateStr) return ''

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr
    }

    const parts = dateStr.split('-')

    if (parts.length === 3) {
      const [day, month, year] = parts
      return `${year}-${month}-${day}`
    }

    return dateStr
  }

  // --------------------------------------------------
  // Fetch Product Serial Report
  // --------------------------------------------------
  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (searchParams.productId) {
        params.append('productId', searchParams.productId)
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

      if (searchParams.center) {
        params.append('center', searchParams.center)
      }

      if (searchParams.startDate && searchParams.endDate) {
        const convertedStartDate = convertToYYYYMMDD(
          searchParams.startDate,
        )

        const convertedEndDate = convertToYYYYMMDD(
          searchParams.endDate,
        )

        params.append('startDate', convertedStartDate)
        params.append('endDate', convertedEndDate)

        console.log(
          'Original dates (DD-MM-YYYY):',
          searchParams.startDate,
          searchParams.endDate,
        )

        console.log(
          'Converted dates (YYYY-MM-DD):',
          convertedStartDate,
          convertedEndDate,
        )
      }

      params.append('page', page)

      const url = `/reports/serialreport?${params.toString()}`

      console.log('Fetching URL:', url)

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

        console.error(
          'Error response:',
          err.response.data,
        )
      } else if (err.request) {
        setError(
          'No response received from server. Please check your network connection.',
        )

        console.error('Error request:', err.request)
      } else {
        setError(
          err.message ||
            'An error occurred while fetching data',
        )

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
      const response = await axiosInstance.get(
        '/products/all',
      )

      if (response.data.success) {
        setProducts(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // --------------------------------------------------
  // Initial Load
  // --------------------------------------------------
  useEffect(() => {
    fetchData()
    fetchCenters()
    fetchProducts()
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
    return path.split('.').reduce(
      (obj, key) => obj?.[key],
      object,
    )
  }

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
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    )
  }

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const handleSearch = (searchData) => {
    console.log(
      'Search data received from modal:',
      searchData,
    )

    setActiveSearch(searchData)
    fetchData(searchData, 1)
  }

  const handleResetSearch = () => {
    const resetData = {
      productId: '',
      status: '',
      keyword: '',
      reseller: '',
      center: '',
      startDate: '',
      endDate: '',
    }

    setActiveSearch(resetData)
    setSearchTerm('')

    fetchData({}, 1)
  }

  const isSearchActive = () => {
    return (
      activeSearch.productId ||
      activeSearch.status ||
      activeSearch.keyword ||
      activeSearch.reseller ||
      activeSearch.center ||
      activeSearch.startDate ||
      activeSearch.endDate
    )
  }

  // --------------------------------------------------
  // Local Search
  // --------------------------------------------------
  const filteredData = data.filter((item) => {
    if (isSearchActive()) {
      return true
    }

    const lowerSearchTerm =
      searchTerm.toLowerCase()

    return Object.values(item).some((value) => {
      if (
        typeof value === 'object' &&
        value !== null
      ) {
        return Object.values(value).some(
          (nestedValue) =>
            nestedValue &&
            nestedValue
              .toString()
              .toLowerCase()
              .includes(lowerSearchTerm),
        )
      }

      return (
        value &&
        value
          .toString()
          .toLowerCase()
          .includes(lowerSearchTerm)
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

      Object.keys(dropdownRefs.current).forEach(
        (key) => {
          if (
            dropdownRefs.current[key] &&
            !dropdownRefs.current[key].contains(
              event.target,
            )
          ) {
            newDropdownState[key] = false
            shouldUpdate = true
          }
        },
      )

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

  // --------------------------------------------------
  // Serial History
  // --------------------------------------------------
  const handleSerialClick = (serial) => {
    const history = data.filter(
      (item) => item.Serial === serial,
    )

    setSelectedSerial(serial)
    setSerialHistory(history)
    setSerialModalVisible(true)
  }

  // --------------------------------------------------
  // Export
  // --------------------------------------------------
  const generateDetailExport = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()

      if (activeSearch.productId) {
        params.append(
          'productId',
          activeSearch.productId,
        )
      }

      if (activeSearch.status) {
        params.append(
          'status',
          activeSearch.status,
        )
      }

      if (activeSearch.keyword) {
        params.append(
          'search',
          activeSearch.keyword,
        )
      }

      if (activeSearch.reseller) {
        params.append(
          'reseller',
          activeSearch.reseller,
        )
      }

      if (activeSearch.center) {
        params.append(
          'center',
          activeSearch.center,
        )
      }

      if (
        activeSearch.startDate &&
        activeSearch.endDate
      ) {
        const convertedStartDate =
          convertToYYYYMMDD(
            activeSearch.startDate,
          )

        const convertedEndDate =
          convertToYYYYMMDD(
            activeSearch.endDate,
          )

        params.append(
          'startDate',
          convertedStartDate,
        )

        params.append(
          'endDate',
          convertedEndDate,
        )
      }

      params.append('export', 'true')

      const apiUrl =
        `/reports/serialreport?${params.toString()}`

      const response =
        await axiosInstance.get(apiUrl)

      if (!response.data.success) {
        throw new Error(
          'API returned unsuccessful response',
        )
      }

      const exportData = response.data.data

      if (
        !exportData ||
        exportData.length === 0
      ) {
        showError(
          'No data available for export',
        )
        return
      }

      const headers = [
        'Serial',
        'Purchase Center',
        'Center',
        'Product',
        'Product Code',
        'Product Price',
        'Status',
        'Current Location',
        'Action Date',
        'Vendor',
        'Invoice No',
        'Purchase Date',
      ]

      const csvData = exportData.map(
        (item) => [
          item.Serial || '',
          item.PurchaseCenter?.name || 'N/A',
          item.Center?.name || '',
          item.Product?.name || '',
          item.ProductCode || '',
          item.ProductPrice || '',
          item.Status || '',
          item.CurrentLocation?.name || '',
          formatDate(item.ActionDate),
          item.PurchaseInfo?.vendor?.name || '',
          item.PurchaseInfo?.invoiceNo || '',
          item.PurchaseInfo?.purchaseDate
            ? formatDate(
                item.PurchaseInfo.purchaseDate,
              )
            : '',
        ],
      )

      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const stringField = String(
                field || '',
              )

              return `"${stringField.replace(
                /"/g,
                '""',
              )}"`
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

      const link =
        document.createElement('a')

      const downloadUrl =
        URL.createObjectURL(blob)

      link.setAttribute(
        'href',
        downloadUrl,
      )

      link.setAttribute(
        'download',
        `product_serial_report_${new Date()
          .toISOString()
          .split('T')[0]}.csv`,
      )

      link.style.visibility = 'hidden'

      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)

      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error(
        'Error generating export:',
        error,
      )

      showError(
        'Error generating export file',
      )
    } finally {
      setLoading(false)
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
        Product Serial Report
      </div>

      {/* Search Modal */}
      <ProductSerialSearch
        visible={searchModalVisible}
        onClose={() =>
          setSearchModalVisible(false)
        }
        onSearch={handleSearch}
        products={products}
      />

      {/* Main Card */}
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(true)
              }
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Search size={15} />
              Search
            </button>

            {isSearchActive() && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <RotateCcw size={15} />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={generateDetailExport}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={15} />
              {loading ? 'Exporting...' : 'Export'}
            </button>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <strong className="text-sm text-gray-700">
              Total Records: {filteredData.length}
            </strong>

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
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="h-8 w-full max-w-[350px] rounded-md border border-gray-300 px-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Main Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    onClick={() =>
                      handleSort('Serial')
                    }
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Serial
                      {getSortIcon('Serial')}
                    </div>
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        'PurchaseCenter.name',
                      )
                    }
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Purchase Branch
                      {getSortIcon(
                        'PurchaseCenter.name',
                      )}
                    </div>
                  </th>

                  <th
                    onClick={() =>
                      handleSort('Center.name')
                    }
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Branch
                      {getSortIcon('Center.name')}
                    </div>
                  </th>

                  <th
                    onClick={() =>
                      handleSort('Product.name')
                    }
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Product
                      {getSortIcon('Product.name')}
                    </div>
                  </th>

                  <th
                    onClick={() =>
                      handleSort('ActionDate')
                    }
                    className="cursor-pointer border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Action At
                      {getSortIcon(
                        'ActionDate',
                      )}
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => {
                    const rowClass =
                      item.Status === 'consumed'
                        ? 'bg-green-50'
                        : item.Status ===
                            'damaged'
                          ? 'bg-red-50'
                          : ''

                    return (
                      <tr
                        key={item._id}
                        className={`${rowClass} hover:bg-gray-50`}
                      >
                        <td className="border border-gray-200 px-3 py-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleSerialClick(
                                item.Serial,
                              )
                            }
                            className="border-0 bg-transparent p-0 text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {item.Serial || ''}
                          </button>
                        </td>

                        <td className="border border-gray-200 px-3 py-2 text-gray-700">
                          {item.PurchaseCenter
                            ?.name || ''}
                        </td>

                        <td className="border border-gray-200 px-3 py-2 text-gray-700">
                          {item.Center?.name ||
                            ''}
                        </td>

                        <td className="border border-gray-200 px-3 py-2 text-gray-700">
                          {item.Product?.name ||
                            'N/A'}
                        </td>

                        <td className="border border-gray-200 px-3 py-2 text-gray-700">
                          {formatDate(
                            item.ActionDate || 0,
                          )}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
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
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Serial No. {selectedSerial} Track
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSerialModalVisible(false)
                }
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
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
                      Center From
                    </th>

                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                      Center To
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {serialHistory.length > 0 ? (
                    serialHistory.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50"
                      >
                        <td className="border border-gray-200 px-3 py-2">
                          {formatDate(
                            row.ActionDate,
                          )}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {row.Status ===
                          'consumed'
                            ? 'user usage '
                            : 'indent'}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {row.ConsumptionDetails
                            ? 'Used'
                            : 'Transfer'}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {row
                            .ConsumptionDetails
                            ?.usageType || '-'}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {row.Product?.name ||
                            '-'}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {row.PurchaseCenter
                            ?.name || '-'}
                        </td>

                        <td className="border border-gray-200 px-3 py-2">
                          {row.Center?.name ||
                            '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="border border-gray-200 px-3 py-8 text-center text-gray-500"
                      >
                        No history found for
                        this serial number
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

export default ProductSerialTrack