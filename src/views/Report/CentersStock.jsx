import React, { useState, useRef, useEffect } from 'react'
import {
  ArrowUp,
  ArrowDown,
  Search,
  RotateCcw,
  FileSpreadsheet,
  Printer,
} from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import Pagination from '../../utils/Pagination'
import { showError } from '../../utils/sweetAlerts'
import SearchCenterStock from './SearchCenterStock'

const CenterStock = () => {
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
    product: '',
    center: '',
  })

  const [dropdownOpen, setDropdownOpen] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const dropdownRefs = useRef({})

  // =========================
  // Fetch Center Stock
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

      params.append('page', page)

      const url = params.toString()
        ? `/availableStock/centerstock?${params.toString()}`
        : '/availableStock/centerstock'

      const response = await axiosInstance.get(url)

      if (response.data.success) {
        setData(response.data.data.stock)
        setCurrentPage(response.data.data.pagination.currentPage)
        setTotalPages(response.data.data.pagination.totalPages)
      } else {
        throw new Error('API returned unsuccessful response')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching data:', err)
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
      console.error('Error fetching data:', error)
    }
  }

  // =========================
  // Fetch Products
  // =========================
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products')

      if (response.data.success) {
        setProducts(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    fetchData()
    fetchCenters()
    fetchProducts()
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
    })

    setSearchTerm('')

    fetchData({}, 1)
  }

  // =========================
  // Local Search
  // =========================
  const filteredData = data.filter((item) => {
    if (activeSearch.product || activeSearch.center) {
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
  // CSV Export
  // =========================
  const generateDetailExport = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()

      if (activeSearch.product) {
        params.append('product', activeSearch.product)
      }

      if (activeSearch.center) {
        params.append('center', activeSearch.center)
      }

      const apiUrl = params.toString()
        ? `/availableStock/centerstock?${params.toString()}`
        : '/availableStock/centerstock'

      const response = await axiosInstance.get(apiUrl)

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response')
      }

      const exportData = response.data.data.stock

      if (!exportData || exportData.length === 0) {
        showError('No data available for export')
        return
      }

      const headers = [
        'Center',
        'Products',
        'Category',
        'Stock',
        'Damage',
      ]

      const csvData = exportData.flatMap((purchase) => {
        if (
          purchase.products &&
          purchase.products.length > 0
        ) {
          return purchase.products.map((product) => [
            purchase.centerName,
            purchase.productName || 'N/A',
            purchase.productCategory?.name || '',
            purchase.availableQuantity || 0,
            purchase.damagedQuantity || 0,
          ])
        }

        return [
          [
            purchase.centerName,
            purchase.productName || 'N/A',
            purchase.productCategory?.name || '',
            purchase.availableQuantity || 0,
            purchase.damagedQuantity || 0,
          ],
        ]
      })

      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          row
            .map((field) => {
              const stringField = String(field || '')

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

      const link = document.createElement('a')
      const downloadUrl = URL.createObjectURL(blob)

      link.setAttribute('href', downloadUrl)
      link.setAttribute(
        'download',
        `available_stock_${new Date()
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

      showError('Error generating export file')
    } finally {
      setLoading(false)
    }
  }

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
      {/* Page Title */}
      <div className="mb-4 text-2xl font-semibold text-gray-800">
        Branch Stock
      </div>

      {/* Search Modal */}
      <SearchCenterStock
        visible={searchModalVisible}
        onClose={() =>
          setSearchModalVisible(false)
        }
        onSearch={handleSearch}
        centers={centers}
        products={products}
      />

      {/* Main Card */}
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(true)
              }
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            {/* Reset */}
            {(activeSearch.product ||
              activeSearch.center) && (
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
              onClick={generateDetailExport}
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

        {/* Body */}
        <div className="p-4">
          {/* Search Input */}
          <div className="mb-4 flex justify-end">
            <div className="flex items-center gap-2">
              <label
                htmlFor="center-stock-search"
                className="text-sm font-medium text-gray-700"
              >
                Search:
              </label>

              <input
                id="center-stock-search"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="h-8 w-full max-w-[350px] border border-gray-300 px-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                    onClick={() =>
                      handleSort('outlet')
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Branch
                    {getSortIcon('outlet')}
                  </th>

                  <th
                    scope="col"
                    onClick={() =>
                      handleSort('date')
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Product
                    {getSortIcon('date')}
                  </th>

                  <th
                    scope="col"
                    onClick={() =>
                      handleSort('invoiceNo')
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Category
                    {getSortIcon('invoiceNo')}
                  </th>

                  <th
                    scope="col"
                    onClick={() =>
                      handleSort(
                        'vendor.businessName',
                      )
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Stock
                    {getSortIcon(
                      'vendor.businessName',
                    )}
                  </th>

                  <th
                    scope="col"
                    onClick={() =>
                      handleSort(
                        'damagedQuantity',
                      )
                    }
                    className="cursor-pointer whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Damage
                    {getSortIcon(
                      'damagedQuantity',
                    )}
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
                        {item.productCategory?.name ||
                          ''}
                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {item.availableQuantity ||
                          'N/A'}
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

export default CenterStock