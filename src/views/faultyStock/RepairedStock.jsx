import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Search, List } from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import RepairedSerialNumber from './RepairedSerialNumber'

const RepairedStock = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const [formData, setFormData] = useState({
    date: getTodayDate(),
    remark: '',
  })

  const [errors, setErrors] = useState({})
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRows, setSelectedRows] = useState({})
  const [loading, setLoading] = useState(true)

  const [serialModalVisible, setSerialModalVisible] =
    useState(false)

  const [selectedProduct, setSelectedProduct] =
    useState(null)

  const [assignedSerials, setAssignedSerials] =
    useState({})

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [id])

  const showAlert = (message, type) => {
    setAlert({
      show: true,
      message,
      type,
    })

    setTimeout(() => {
      setAlert({
        show: false,
        message: '',
        type: '',
      })
    }, 5000)
  }

  const handleOpenSerialModal = (product) => {
    const usageQuantity =
      parseInt(
        selectedRows[product.productId]?.quantity,
        10,
      ) || 0

    if (usageQuantity > 0) {
      const productForSerial = {
        _id: product.productId,
        productTitle: product.productName,
        trackSerialNumber: product.isSerialized
          ? 'Yes'
          : 'No',
      }

      setSelectedProduct(productForSerial)
      setSerialModalVisible(true)
    }
  }

  const handleSerialNumbersUpdate = (
    productId,
    serialsArray,
  ) => {
    setAssignedSerials((prev) => ({
      ...prev,
      [productId]: serialsArray,
    }))
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(
        '/faulty-stock/under-repaired?simplified=true',
      )

      if (res.data.success) {
        setProducts(res.data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      showAlert(
        'Failed to fetch products',
        'danger',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleRowSelect = (
    productId,
    availableQuantity,
  ) => {
    setSelectedRows((prev) => {
      const updated = { ...prev }

      if (updated[productId]) {
        delete updated[productId]
      } else {
        updated[productId] = {
          quantity: '',
          productRemark: '',
          availableQuantity:
            availableQuantity || 0,
        }
      }

      return updated
    })
  }

  const handleUsageQtyChange = (
    productId,
    value,
  ) => {
    const maxQty =
      selectedRows[productId]?.availableQuantity ||
      0

    const numValue = parseInt(value, 10) || 0

    if (numValue > maxQty) {
      showAlert(
        `Cannot exceed available quantity of ${maxQty}`,
        'warning',
      )
      return
    }

    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: value,
      },
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    if (Object.keys(selectedRows).length === 0) {
      newErrors.products =
        'Please select at least one product'
    }

    Object.keys(selectedRows).forEach(
      (productId) => {
        const product = products.find(
          (p) => p.productId === productId,
        )

        const selectedRow =
          selectedRows[productId]

        if (
          !selectedRow.quantity ||
          parseInt(selectedRow.quantity, 10) <= 0
        ) {
          newErrors.products = `Please enter valid quantity for ${product?.productName}`
        }

        if (product?.isSerialized) {
          const usageQty = parseInt(
            selectedRow.quantity,
            10,
          )

          const assignedSerialsForProduct =
            assignedSerials[productId] || []

          if (
            assignedSerialsForProduct.length !==
            usageQty
          ) {
            newErrors.products = `Please assign serial numbers for all ${usageQty} items of ${product?.productName}`
          }
        }
      },
    )

    return newErrors
  }

  const handleSubmit = async (finalStatus) => {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    try {
      const items = Object.keys(
        selectedRows,
      ).map((productId) => {
        const product = products.find(
          (p) => p.productId === productId,
        )

        const selectedRow =
          selectedRows[productId]

        const serialNumbers =
          assignedSerials[productId] || []

        return {
          product: productId,
          productName: product.productName,
          quantity: parseInt(
            selectedRow.quantity,
            10,
          ),
          productRemark:
            selectedRow.productRemark || '',
          serialNumbers,
          isSerialized: product.isSerialized,
          finalStatus,
        }
      })

      const payload = {
        date: formData.date,
        remark: formData.remark || '',
        items,
      }

      console.log(
        'Submitting repair status payload:',
        payload,
      )

      const response =
        await axiosInstance.post(
          '/faulty-stock/mark-repair-status',
          payload,
        )

      if (response.data.success) {
        const statusMessage =
          finalStatus === 'repaired'
            ? 'repaired successfully!'
            : 'marked as irreparable!'

        showAlert(
          `Products ${statusMessage}`,
          'success',
        )

        setTimeout(() => {
          navigate('/repair-faulty-stock')
        }, 1500)
      } else {
        showAlert(
          response.data.message ||
            'Failed to update repair status',
          'danger',
        )
      }
    } catch (error) {
      console.error(
        'Error updating repair status:',
        error,
      )

      let errorMessage =
        'Failed to update repair status'

      if (error.response?.data?.message) {
        errorMessage =
          error.response.data.message
      }

      showAlert(errorMessage, 'danger')
    }
  }

  const handleSaveAsRepaired = () => {
    handleSubmit('repaired')
  }

  const handleSubmitIrrepaired = () => {
    handleSubmit('irreparable')
  }

  const handleReset = () => {
    setFormData({
      date: getTodayDate(),
      remark: '',
    })

    setSelectedRows({})
    setAssignedSerials({})
    setErrors({})

    showAlert(
      'Form has been reset',
      'info',
    )
  }

  const handleBack = () => {
    navigate('/repair-faulty-stock')
  }

  const filteredProducts = products.filter(
    (product) =>
      product.productName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-4 flex items-center gap-3 text-xl font-semibold text-gray-800">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-gray-600 px-3 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <span>Repaired/Irrepaired Product</span>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-end border-b border-gray-200 bg-gray-50 px-4 py-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Alert */}
          {alert.show && (
            <div
              className={`mb-4 flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
                alert.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : alert.type === 'warning'
                    ? 'border-yellow-200 bg-yellow-50 text-yellow-800'
                    : alert.type === 'info'
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              <span>{alert.message}</span>

              <button
                type="button"
                onClick={() =>
                  setAlert({
                    show: false,
                    message: '',
                    type: '',
                  })
                }
                className="ml-3 text-current opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label
                  htmlFor="repair-date"
                  className={`mb-1 block text-sm font-medium ${
                    errors.date
                      ? 'text-red-600'
                      : formData.date
                        ? 'text-green-600'
                        : 'text-gray-700'
                  }`}
                >
                  Date{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="repair-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  disabled
                  className={`h-10 w-full rounded-md border px-3 text-sm outline-none ${
                    errors.date
                      ? 'border-red-400 bg-red-50'
                      : formData.date
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300'
                  }`}
                />

                {errors.date && (
                  <span className="mt-1 block text-xs text-red-600">
                    {errors.date}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="remark"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Remark
                </label>

                <textarea
                  id="remark"
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  placeholder="Remark"
                  rows={3}
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div />
            </div>

            {/* Products Section */}
            <div className="mt-6">
              <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-semibold text-gray-800">
                    Select Products
                  </h2>

                  {errors.products && (
                    <span className="text-sm text-red-600">
                      {errors.products}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="product-search"
                    className="text-sm font-medium text-gray-700"
                  >
                    Search:
                  </label>

                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      id="product-search"
                      type="text"
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(
                          e.target.value,
                        )
                      }
                      placeholder="Search products..."
                      className="h-9 w-full rounded-md border border-gray-300 pl-8 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-[250px]"
                    />
                  </div>
                </div>
              </div>

              {/* Loading */}
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                </div>
              ) : (
                <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full min-w-[700px] border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Select
                        </th>

                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Product Name
                        </th>

                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Available Quantity
                        </th>

                        <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Repaired/Irrepaired Qty
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.length >
                      0 ? (
                        filteredProducts.map(
                          (product) => {
                            const isSelected =
                              !!selectedRows[
                                product.productId
                              ]

                            const availableQuantity =
                              product.underRepairQuantity ||
                              0

                            return (
                              <tr
                                key={
                                  product.productId
                                }
                                className={`transition ${
                                  isSelected
                                    ? 'bg-blue-50'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <td className="border-b border-gray-200 px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={
                                      isSelected
                                    }
                                    onChange={() =>
                                      handleRowSelect(
                                        product.productId,
                                        availableQuantity,
                                      )
                                    }
                                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                </td>

                                <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-800">
                                  {
                                    product.productName
                                  }
                                </td>

                                <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-700">
                                  {
                                    availableQuantity
                                  }
                                </td>

                                <td className="border-b border-gray-200 px-4 py-3">
                                  {isSelected && (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        min="1"
                                        max={
                                          availableQuantity
                                        }
                                        value={
                                          selectedRows[
                                            product
                                              .productId
                                          ]
                                            ?.quantity ||
                                          ''
                                        }
                                        onChange={(
                                          e,
                                        ) =>
                                          handleUsageQtyChange(
                                            product.productId,
                                            e.target
                                              .value,
                                          )
                                        }
                                        placeholder="Qty"
                                        className="h-9 w-[100px] rounded-md border border-gray-300 px-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                      />

                                      {product.isSerialized && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleOpenSerialModal(
                                              product,
                                            )
                                          }
                                          title="Add Serial Numbers"
                                          className="flex h-9 w-9 items-center justify-center rounded-md text-blue-600 transition hover:bg-blue-100 hover:text-blue-800"
                                        >
                                          <List className="h-5 w-5" />
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )
                          },
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="border-b border-gray-200 px-4 py-8 text-center text-sm text-gray-500"
                          >
                            No products found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="mt-5 flex flex-col justify-end gap-2 border-t border-gray-200 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={handleSaveAsRepaired}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Save As Repaired
              </button>

              <button
                type="button"
                onClick={
                  handleSubmitIrrepaired
                }
                className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Submit Irrepaired
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Serial Number Modal */}
      <RepairedSerialNumber
        visible={serialModalVisible}
        onClose={() =>
          setSerialModalVisible(false)
        }
        product={selectedProduct}
        usageQty={
          parseInt(
            selectedRows[
              selectedProduct?._id
            ]?.quantity,
            10,
          ) || 0
        }
        onSerialNumbersUpdate={
          handleSerialNumbersUpdate
        }
      />
    </div>
  )
}

export default RepairedStock