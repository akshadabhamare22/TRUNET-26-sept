import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select'
import { ArrowLeft, Loader2, Plus, RotateCcw } from 'lucide-react'

import axiosInstance from '../../axiosInstance'
import VendorModal from '../stockPurchase/VendorModel'

const AddRaisePO = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    voucherNo: '',
    vendor: '',
    vendor_id: '',
  })

  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [selectedRows, setSelectedRows] = useState({})
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [errors, setErrors] = useState({})
  const [showVendorModal, setShowVendorModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [generatingVoucher, setGeneratingVoucher] = useState(false)

  const [selectionOrder, setSelectionOrder] = useState([])
  const selectionCounter = useRef(0)

  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    message: '',
  })

  useEffect(() => {
    if (!id) {
      generateAutoVoucherNumber()
    }
  }, [id])

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axiosInstance.get('/vendor')
        setVendors(res.data.data || [])
      } catch (error) {
        console.log('error fetching vendors', error)
        showAlert('danger', 'Failed to fetch vendors')
      }
    }

    fetchVendors()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [])

  const generateAutoVoucherNumber = async () => {
    setGeneratingVoucher(true)

    try {
      const response = await axiosInstance.get('/raisePO/next-voucher')

      if (response.data.success && response.data.voucherNo) {
        setFormData((prev) => ({
          ...prev,
          voucherNo: response.data.voucherNo,
        }))
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Error generating voucher number:', error)

      showAlert(
        'danger',
        'Failed to generate unique voucher number. Please try again.',
      )

      setFormData((prev) => ({
        ...prev,
        voucherNo: '',
      }))
    } finally {
      setGeneratingVoucher(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get(
        '/stockpurchase/products/with-stock',
      )

      if (res.data.success) {
        setProducts(res.data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      showAlert('danger', 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchStockPurchase = async () => {
      if (!id) return

      try {
        const res = await axiosInstance.get(`/raisePO/${id}`)

        if (res.data.success) {
          const data = res.data.data

          setFormData({
            date: data.date.split('T')[0],
            voucherNo: data.voucherNo,
            vendor: data.vendor.businessName,
            vendor_id: data.vendor._id || data.vendor.id,
          })

          const selected = {}
          const order = []

          data.products.forEach((prod, index) => {
            selected[prod.product._id] = {
              quantity: prod.purchasedQuantity,
              price: prod.price,
              productRemark: prod.productRemark || '',
              productInStock: prod.product.stock?.currentStock || 0,
            }

            order.push({
              productId: prod.product._id,
              order: index,
            })
          })

          setSelectedRows(selected)
          setSelectionOrder(order)
          selectionCounter.current = data.products.length
        }
      } catch (error) {
        console.error(
          'Error fetching stock purchase for edit:',
          error,
        )

        showAlert(
          'danger',
          'Failed to fetch stock purchase data',
        )
      }
    }

    fetchStockPurchase()
  }, [id, products, vendors])

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

  const handleRowSelect = (
    productId,
    productPrice,
    productStock,
  ) => {
    setSelectedRows((prev) => {
      const updated = { ...prev }

      if (updated[productId]) {
        setSelectionOrder((prevOrder) =>
          prevOrder.filter(
            (item) => item.productId !== productId,
          ),
        )

        delete updated[productId]
      } else {
        const newOrder = selectionCounter.current++

        setSelectionOrder((prevOrder) => [
          { productId, order: newOrder },
          ...prevOrder,
        ])

        updated[productId] = {
          quantity: '',
          productRemark: '',
          price: productPrice || 0,
          productInStock: productStock || 0,
        }
      }

      return updated
    })
  }

  const handleRowInputChange = (
    productId,
    field,
    value,
  ) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }))
  }

  const handleAddVendor = () => {
    setShowVendorModal(true)
  }

  const handleVendorAdded = (newVendor) => {
    setVendors((prev) => [...prev, newVendor])

    setFormData((prev) => ({
      ...prev,
      vendor: newVendor.businessName,
      vendor_id: newVendor._id || newVendor.id,
    }))

    showAlert('success', 'Vendor added successfully!')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    if (!formData.voucherNo) {
      newErrors.voucherNo = 'Voucher No is required'
    }

    if (!formData.vendor_id) {
      newErrors.vendor = 'Vendor is required'
    }

    const selectedProducts = Object.keys(selectedRows).filter(
      (productId) => selectedRows[productId],
    )

    if (selectedProducts.length === 0) {
      newErrors.products = 'At least one product must be selected'
    } else {
      selectedProducts.forEach((productId) => {
        const row = selectedRows[productId]

        if (!row.quantity || row.quantity <= 0) {
          newErrors[`quantity_${productId}`] =
            'Quantity is required and must be greater than 0'
        }
      })
    }

    return newErrors
  }

  const prepareSubmitData = () => {
    const productsData = Object.keys(selectedRows)
      .filter(
        (productId) =>
          selectedRows[productId] &&
          selectedRows[productId].quantity > 0,
      )
      .map((productId) => {
        const row = selectedRows[productId]

        return {
          product: productId,
          price: parseFloat(row.price) || 0,
          purchasedQuantity: parseInt(row.quantity) || 0,
        }
      })

    return {
      date: new Date(formData.date).toISOString(),
      voucherNo: formData.voucherNo,
      vendor: formData.vendor_id,
      products: productsData,
    }
  }

  const showAlert = (type, message) => {
    setAlert({
      visible: true,
      type,
      message,
    })

    setTimeout(() => {
      setAlert((prev) => ({
        ...prev,
        visible: false,
      }))
    }, 5000)
  }

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      voucherNo: '',
      vendor: '',
      vendor_id: '',
    })

    setSelectedRows({})
    setProductSearchTerm('')
    setErrors({})
    setSelectionOrder([])
    selectionCounter.current = 0

    if (!id) {
      generateAutoVoucherNumber()
    }

    showAlert('info', 'Form has been reset')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setSubmitting(false)

      showAlert(
        'warning',
        'Please fix the form errors before submitting',
      )

      return
    }

    try {
      const submitData = prepareSubmitData()
      let response

      if (id) {
        response = await axiosInstance.put(
          `/raisePO/${id}`,
          submitData,
        )
      } else {
        response = await axiosInstance.post(
          '/raisePO',
          submitData,
        )
      }

      if (response.data.success) {
        showAlert(
          'success',
          `PO ${id ? 'updated' : 'created'} successfully!`,
        )

        setTimeout(() => {
          navigate('/raise-po')
        }, 1500)
      } else {
        showAlert(
          'danger',
          response.data.message ||
            'Failed to save stock purchase',
        )
      }
    } catch (error) {
      console.error(
        'Error saving stock purchase:',
        error,
      )

      let errorMessage =
        'Failed to save stock purchase'

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message

        if (errorMessage.includes('validation failed')) {
          if (errorMessage.includes('voucherNo')) {
            errorMessage =
              'Voucher number is required or already exists'
          } else if (errorMessage.includes('vendor')) {
            errorMessage =
              'Please select a valid vendor'
          } else if (errorMessage.includes('products')) {
            errorMessage =
              'Please select at least one product with valid quantity'
          }
        }

        if (
          errorMessage.includes('duplicate') ||
          errorMessage.includes('already exists')
        ) {
          errorMessage =
            'Voucher number already exists. Please try again with a new voucher number.'

          if (!id) {
            setTimeout(() => {
              generateAutoVoucherNumber()
            }, 2000)
          }
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      showAlert('danger', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredProducts = products
    .filter((product) =>
      product.productTitle
        ?.toLowerCase()
        .includes(productSearchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const aSelected = !!selectedRows[a._id]
      const bSelected = !!selectedRows[b._id]

      if (aSelected && bSelected) {
        const aOrder =
          selectionOrder.find(
            (item) => item.productId === a._id,
          )?.order || 0

        const bOrder =
          selectionOrder.find(
            (item) => item.productId === b._id,
          )?.order || 0

        return aOrder - bOrder
      }

      if (aSelected && !bSelected) return -1
      if (!aSelected && bSelected) return 1

      return 0
    })

  const handleBack = () => {
    navigate('/raise-po')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-5 flex items-center">
        <button
          type="button"
          onClick={handleBack}
          className="mr-4 inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-2xl font-semibold text-gray-800">
          Raise PO
        </h1>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex justify-end border-b border-gray-200 bg-gray-50 px-5 py-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Alert */}
          {alert.visible && (
            <div
              className={`mb-5 flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
                alert.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : alert.type === 'danger'
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : alert.type === 'warning'
                      ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                      : 'border-blue-200 bg-blue-50 text-blue-700'
              }`}
            >
              <span>{alert.message}</span>

              <button
                type="button"
                onClick={() =>
                  setAlert((prev) => ({
                    ...prev,
                    visible: false,
                  }))
                }
                className="ml-4 text-lg font-semibold opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className={`mb-2 block text-sm font-medium ${
                    errors.date
                      ? 'text-red-600'
                      : formData.date
                        ? 'text-green-600'
                        : 'text-gray-700'
                  }`}
                >
                  Date <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
                    errors.date
                      ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                      : formData.date
                        ? 'border-green-500 focus:ring-2 focus:ring-green-100'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />

                {errors.date && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Voucher */}
              <div>
                <label
                  htmlFor="voucherNo"
                  className={`mb-2 block text-sm font-medium ${
                    errors.voucherNo
                      ? 'text-red-600'
                      : formData.voucherNo
                        ? 'text-green-600'
                        : 'text-gray-700'
                  }`}
                >
                  Voucher No <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    id="voucherNo"
                    name="voucherNo"
                    value={formData.voucherNo}
                    onChange={handleChange}
                    disabled={Boolean(id) || generatingVoucher}
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 ${
                      errors.voucherNo
                        ? 'border-red-500'
                        : formData.voucherNo
                          ? 'border-green-500'
                          : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />

                  {generatingVoucher && !formData.voucherNo && (
                    <Loader2
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-600"
                    />
                  )}
                </div>

                {errors.voucherNo && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.voucherNo}
                  </p>
                )}
              </div>

              {/* Vendor */}
              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${
                    errors.vendor
                      ? 'text-red-600'
                      : formData.vendor_id
                        ? 'text-green-600'
                        : 'text-gray-700'
                  }`}
                >
                  Vendor <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-2">
                  <div className="min-w-0 flex-1">
                    <Select
                      id="vendor"
                      name="vendor"
                      placeholder="Search Vendor..."
                      value={
                        formData.vendor_id
                          ? {
                              value: formData.vendor_id,
                              label:
                                vendors.find(
                                  (vendor) =>
                                    vendor._id ===
                                    formData.vendor_id,
                                )?.businessName || '',
                            }
                          : null
                      }
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          vendor_id: selected
                            ? selected.value
                            : '',
                          vendor: selected
                            ? vendors.find(
                                (vendor) =>
                                  vendor._id ===
                                  selected.value,
                              )?.businessName || ''
                            : '',
                        }))
                      }
                      options={vendors.map((vendor) => ({
                        value: vendor._id,
                        label: vendor.businessName,
                      }))}
                      isClearable
                      classNamePrefix="react-select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: '42px',
                          borderRadius: '6px',
                          borderColor: errors.vendor
                            ? '#ef4444'
                            : state.isFocused
                              ? '#3b82f6'
                              : formData.vendor_id
                                ? '#22c55e'
                                : '#d1d5db',
                          boxShadow: 'none',
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 50,
                        }),
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVendor}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    <Plus size={16} />
                    ADD
                  </button>
                </div>

                {errors.vendor && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.vendor}
                  </p>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="mt-7">
              <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Products
                  </h2>

                  {errors.products && (
                    <span className="text-sm text-red-600">
                      {errors.products}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="productSearch"
                    className="text-sm font-medium text-gray-600"
                  >
                    Search:
                  </label>

                  <input
                    id="productSearch"
                    type="text"
                    value={productSearchTerm}
                    onChange={(e) =>
                      setProductSearchTerm(e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-64"
                  />
                </div>
              </div>

              {/* Product Loading */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2
                    size={28}
                    className="animate-spin text-blue-600"
                  />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Select
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Product Name
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Price
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Available Qty
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Purchase Qty
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => {
                          const selected =
                            selectedRows[product._id]

                          return (
                            <tr
                              key={product._id}
                              className={
                                selected
                                  ? 'bg-blue-50'
                                  : 'hover:bg-gray-50'
                              }
                            >
                              {/* Select */}
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={!!selected}
                                  onChange={() =>
                                    handleRowSelect(
                                      product._id,
                                      product.productPrice,
                                      product.stock?.currentStock,
                                      product.trackSerialNumber,
                                    )
                                  }
                                  className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>

                              {/* Product */}
                              <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                {product.productTitle}
                              </td>

                              {/* Price */}
                              <td className="px-4 py-3">
                                {selected ? (
                                  <input
                                    type="number"
                                    value={
                                      selected.price ||
                                      product.productPrice
                                    }
                                    onChange={(e) =>
                                      handleRowInputChange(
                                        product._id,
                                        'price',
                                        e.target.value,
                                      )
                                    }
                                    min="0"
                                    step="0.01"
                                    className="w-28 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                  />
                                ) : (
                                  ''
                                )}
                              </td>

                              {/* Available */}
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {product.stock?.currentStock || 0}
                              </td>

                              {/* Purchase Qty */}
                              <td className="px-4 py-3">
                                {selected ? (
                                  <div>
                                    <input
                                      type="number"
                                      value={selected.quantity}
                                      onChange={(e) =>
                                        handleRowInputChange(
                                          product._id,
                                          'quantity',
                                          e.target.value,
                                        )
                                      }
                                      min="1"
                                      className={`w-28 rounded-md border px-2 py-1.5 text-sm outline-none ${
                                        errors[
                                          `quantity_${product._id}`
                                        ]
                                          ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                                          : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                      }`}
                                    />

                                    {errors[
                                      `quantity_${product._id}`
                                    ] && (
                                      <p className="mt-1 text-xs text-red-600">
                                        {
                                          errors[
                                            `quantity_${product._id}`
                                          ]
                                        }
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  ''
                                )}
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-sm text-gray-500"
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

            {/* Footer */}
            <div className="mt-6 flex justify-end border-t border-gray-200 pt-5">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                )}

                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Vendor Modal */}
      <VendorModal
        visible={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        onVendorAdded={handleVendorAdded}
      />
    </div>
  )
}

export default AddRaisePO