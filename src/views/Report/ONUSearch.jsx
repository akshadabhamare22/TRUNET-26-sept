import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { X, RotateCcw, Search } from 'lucide-react'

const ONUSearch = ({ visible, onClose, onSearch, products, resellers, centers }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    status: '',
    keyword: '',
    reseller: '',
    usageType: '',
    customer: '',
  })

  useEffect(() => {
    if (!visible) {
      setSearchData({
        product: '',
        status: '',
        keyword: '',
        reseller: '',
        usageType: '',
        customer: '',
      })
    }
  }, [visible])

  const handleChange = (e) => {
    const { name, value } = e.target

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = () => {
    onSearch(searchData)
    onClose()
  }

  const handleReset = () => {
    const resetData = {
      product: '',
      status: '',
      keyword: '',
      reseller: '',
      usageType: '',
      customer: '',
    }

    setSearchData(resetData)
    onSearch(resetData)
    onClose()
  }

  if (!visible) return null

  const selectedProduct = products.find(
    (product) => product._id === searchData.product,
  )

  const selectedReseller = resellers.find(
    (reseller) => reseller._id === searchData.reseller,
  )

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Search</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-6">
          {/* Product + Status */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="product"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Product
              </label>

              <Select
                inputId="product"
                name="product"
                placeholder="Search Product..."
                value={
                  selectedProduct
                    ? {
                        value: selectedProduct._id,
                        label: selectedProduct.productTitle,
                      }
                    : null
                }
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    product: selected ? selected.value : '',
                  }))
                }
                options={products.map((product) => ({
                  value: product._id,
                  label: product.productTitle,
                }))}
                isClearable
                className="w-full"
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={searchData.status}
                onChange={handleChange}
                className="h-[38px] w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">SELECT</option>
                <option value="all">All</option>
                <option value="consumed">In Use</option>
                <option value="Not in Use">Not in Use</option>
                <option value="damaged">Damage</option>
                <option value="Own Product">Own Product</option>
              </select>
            </div>
          </div>

          {/* Reseller + Keyword */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="reseller"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Reseller Name
              </label>

              <Select
                inputId="reseller"
                name="reseller"
                placeholder="Select Reseller..."
                value={
                  selectedReseller
                    ? {
                        value: selectedReseller._id,
                        label: selectedReseller.businessName,
                      }
                    : null
                }
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    reseller: selected ? selected.value : '',
                  }))
                }
                options={resellers.map((reseller) => ({
                  value: reseller._id,
                  label: reseller.businessName,
                }))}
                isClearable
                className="w-full"
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <label
                htmlFor="keyword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Keyword
              </label>

              <input
                type="text"
                id="keyword"
                name="keyword"
                value={searchData.keyword}
                onChange={handleChange}
                className="h-[38px] w-full rounded-md border border-gray-300 px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>
    </div>
  )
}

ONUSearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  resellers: PropTypes.array.isRequired,
  centers: PropTypes.array,
}

export default ONUSearch
