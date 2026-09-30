import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../axiosInstance'
import { ArrowLeft, RotateCcw, Search, X } from 'lucide-react'
import TransferSerialNumber from './TransferSerialNumber'

const TransferRepairedStock = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    outletId: '',
    transferRemark: '',
  })

  const [centers, setCenters] = useState([])
  const [products, setProducts] = useState([])
  const [selectedRows, setSelectedRows] = useState({})
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [serialModalVisible, setSerialModalVisible] =
    useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [assignedSerials, setAssignedSerials] = useState({})

  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    message: '',
  })

  useEffect(() => {
    fetchCenters()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchCenters = async () => {
    try {
      const res = await axiosInstance.get(
        '/centers/main-warehouse?centerType=Outlet',
      )

      if (res.data.success) {
        const telecomWarehouses = res.data.data.filter(
          (warehouse) =>
            warehouse.centerName
              ?.toLowerCase()
              .includes('telecom') ||
            warehouse.centerType
              ?.toLowerCase()
              .includes('telecom') ||
            warehouse.category
              ?.toLowerCase()
              .includes('telecom'),
        )

        setCenters(telecomWarehouses)
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error)
      showAlert('danger', 'Failed to fetch warehouse')
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get(
        '/faulty-stock/repaired-products',
      )

      if (res.data.success) {
        console.log(
          'Fetched repaired products:',
          res.data.data,
        )

        let repairedProducts = []

        if (res.data.data.repairedProducts) {
          repairedProducts = res.data.data.repairedProducts
        } else if (Array.isArray(res.data.data)) {
          repairedProducts = res.data.data
        }

        setProducts(repairedProducts || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      showAlert('danger', 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
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

  const extractSerialNumbers = (serialNumbersArray) => {
    if (
      !serialNumbersArray ||
      serialNumbersArray.length === 0
    ) {
      return []
    }

    return serialNumbersArray
      .map((sn) => {
        if (typeof sn === 'string') {
          return sn
        }

        if (sn.serialNumber) {
          return sn.serialNumber
        }

        return ''
      })
      .filter((sn) => sn.length > 0)
  }

  const handleOpenSerialModal = (product) => {
    const transferQuantity =
      parseInt(
        selectedRows[product.product._id]?.quantity,
        10,
      ) || 0

    if (transferQuantity > 0) {
      const productForSerial = {
        _id: product.product._id,
        productTitle: product.product.productTitle,
        trackSerialNumber:
          product.product.trackSerialNumber,
        productId: product.product._id,
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

  const handleRowSelect = (product) => {
    const productId = product.product._id

    setSelectedRows((prev) => ({
      ...prev,
      [productId]: prev[productId]
        ? undefined
        : {
            quantity: Math.min(
              1,
              product.totalRepairedQuantity || 1,
            ),
            damageRemark: '',
            availableQuantity:
              product.totalRepairedQuantity || 0,
            serialNumbers: extractSerialNumbers(
              product.repairedSerials,
            ),
            productId,
            productData: product,
          },
    }))

    setErrors((prev) => ({
      ...prev,
      products: '',
    }))
  }

  const handleRowDataChange = (
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

    setErrors((prev) => ({
      ...prev,
      products: '',
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    if (!formData.outletId) {
      newErrors.outletId = 'Center is required'
    }

    const selectedProducts = Object.keys(
      selectedRows,
    ).filter((id) => selectedRows[id])

    if (selectedProducts.length === 0) {
      newErrors.products =
        'At least one product must be selected'
    }

    Object.keys(selectedRows).forEach((productId) => {
      const selectedRow = selectedRows[productId]

      if (!selectedRow) return

      const product = products.find(
        (p) => p.product._id === productId,
      )

      if (
        !selectedRow.quantity ||
        parseInt(selectedRow.quantity, 10) <= 0
      ) {
        newErrors.products = `Please enter valid quantity for ${product?.product?.productTitle}`
      }

      if (
        selectedRow.quantity >
        selectedRow.availableQuantity
      ) {
        newErrors.products = `Quantity exceeds available repaired quantity for ${product?.product?.productTitle}`
      }

      if (
        product?.product?.trackSerialNumber === 'Yes'
      ) {
        const transferQty = parseInt(
          selectedRow.quantity,
          10,
        )

        const assignedSerialsForProduct =
          assignedSerials[productId] || []

        if (
          assignedSerialsForProduct.length !== transferQty
        ) {
          newErrors.products = `Please assign serial numbers for all ${transferQty} items of ${product?.product?.productTitle}`
        }
      }
    })

    return newErrors
  }

  const prepareSubmitData = () => {
    const items = Object.keys(selectedRows)
      .filter((productId) => selectedRows[productId])
      .map((productId) => {
        const row = selectedRows[productId]

        const product = products.find(
          (p) => p.product._id === productId,
        )

        const itemData = {
          productId: row.productId,
          quantity: parseInt(row.quantity, 10) || 0,
          damageRemark: row.damageRemark || '',
        }

        if (
          product?.product?.trackSerialNumber === 'Yes'
        ) {
          const serialNumbers =
            assignedSerials[productId] || []

          if (serialNumbers.length > 0) {
            itemData.serialNumbers = serialNumbers
          }
        }

        return itemData
      })

    return {
      items,
      outletId: formData.outletId,
      transferRemark: formData.transferRemark || '',
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
      outletId: '',
      transferRemark: '',
    })

    setSelectedRows({})
    setAssignedSerials({})
    setProductSearchTerm('')
    setErrors({})
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

      console.log(
        'Submitting data:',
        JSON.stringify(submitData, null, 2),
      )

      const response = await axiosInstance.post(
        '/faulty-stock/transfer-repaired-to-warehouse',
        submitData,
      )

      if (response.data.success) {
        showAlert(
          'success',
          'Repaired stock transferred successfully!',
        )

        setTimeout(() => {
          navigate('/repair-faulty-stock')
        }, 1500)
      } else {
        showAlert(
          'danger',
          response.data.message ||
            'Failed to transfer repaired stock',
        )
      }
    } catch (error) {
      console.error(
        'Error transferring repaired stock:',
        error,
      )

      let errorMessage =
        'Failed to transfer repaired stock'

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      showAlert('danger', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredProducts = products.filter((p) => {
    const search = productSearchTerm.toLowerCase()

    return (
      p.product?.productTitle
        ?.toLowerCase()
        .includes(search) ||
      p.product?.productCode
        ?.toLowerCase()
        .includes(search)
    )
  })

  const handleBack = () => {
    navigate('/repair-faulty-stock')
  }

  const getAlertClasses = () => {
    switch (alert.type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800'
      case 'danger':
        return 'border-red-200 bg-red-50 text-red-800'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">
              Transfer Repaired Stock
            </h1>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Card Header */}
          <div className="flex justify-end border-b border-gray-200 bg-gray-50 px-4 py-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          {/* Alert */}
          {alert.visible && (
            <div
              className={`mx-4 mt-4 flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${getAlertClasses()}`}
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
                className="ml-4 opacity-70 hover:opacity-100"
              >
                <X size={17} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="p-4 md:p-6">
              {/* Basic Form */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Date */}
                <div>
                  <label
                    htmlFor="date"
                    className={`mb-1.5 block text-sm font-medium ${
                      errors.date
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}
                  >
                    Date{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                      errors.date
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : formData.date
                          ? 'border-green-400 focus:border-blue-500 focus:ring-blue-100'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  />

                  {errors.date && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Warehouse */}
                <div>
                  <label
                    htmlFor="outletId"
                    className={`mb-1.5 block text-sm font-medium ${
                      errors.outletId
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}
                  >
                    Warehouse{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="outletId"
                    name="outletId"
                    value={formData.outletId}
                    onChange={handleChange}
                    className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                      errors.outletId
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : formData.outletId
                          ? 'border-green-400 focus:border-blue-500 focus:ring-blue-100'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  >
                    <option value="">Select</option>

                    {centers.map((center) => (
                      <option
                        key={center._id}
                        value={center._id}
                      >
                        {center.centerName}
                      </option>
                    ))}
                  </select>

                  {errors.outletId && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.outletId}
                    </p>
                  )}
                </div>

                {/* Remark */}
                <div>
                  <label
                    htmlFor="transferRemark"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Transfer Remark
                  </label>

                  <textarea
                    id="transferRemark"
                    name="transferRemark"
                    value={formData.transferRemark}
                    onChange={handleChange}
                    rows={3}
                    className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Products */}
              <div className="mt-7">
                <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Repaired Products
                    </h2>

                    {errors.products && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.products}
                      </p>
                    )}
                  </div>

                  <div className="flex w-full items-center gap-2 md:w-auto">
                    <label
                      htmlFor="product-search"
                      className="whitespace-nowrap text-sm font-medium text-gray-600"
                    >
                      Search:
                    </label>

                    <div className="relative w-full md:w-[280px]">
                      <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="product-search"
                        type="text"
                        value={productSearchTerm}
                        onChange={(e) =>
                          setProductSearchTerm(
                            e.target.value,
                          )
                        }
                        placeholder="Search products..."
                        className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="flex min-h-[180px] items-center justify-center">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-[850px] w-full border-collapse text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                            Select
                          </th>

                          <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                            Product Name
                          </th>

                          <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                            Repaired Quantity
                          </th>

                          <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                            Transfer Quantity
                          </th>

                          <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                            Remark
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => {
                            const productId =
                              product.product._id

                            const isSelected =
                              !!selectedRows[productId]

                            const selectedRow =
                              selectedRows[productId]

                            const trackSerial =
                              product.product
                                ?.trackSerialNumber === 'Yes'

                            return (
                              <tr
                                key={productId}
                                className={`transition ${
                                  isSelected
                                    ? 'bg-blue-50'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                {/* Select */}
                                <td className="border-b border-gray-200 px-4 py-3 align-middle">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      handleRowSelect(
                                        product,
                                      )
                                    }
                                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                </td>

                                {/* Product */}
                                <td className="border-b border-gray-200 px-4 py-3 font-medium text-gray-800">
                                  {product.product
                                    ?.productTitle ||
                                    'N/A'}
                                </td>

                                {/* Repaired Quantity */}
                                <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                                  {product.totalRepairedQuantity ||
                                    0}

                                  {product.repairDates &&
                                    product.repairDates
                                      .length > 0 && (
                                      <div className="mt-1 text-xs text-gray-400">
                                        Repaired stock
                                      </div>
                                    )}
                                </td>

                                {/* Transfer Quantity */}
                                <td className="border-b border-gray-200 px-4 py-3">
                                  {isSelected && (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        value={
                                          selectedRow?.quantity ||
                                          ''
                                        }
                                        onChange={(e) =>
                                          handleRowDataChange(
                                            productId,
                                            'quantity',
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Qty"
                                        min="1"
                                        max={
                                          product.totalRepairedQuantity ||
                                          1
                                        }
                                        className="w-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                      />

                                      {trackSerial && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleOpenSerialModal(
                                              product,
                                            )
                                          }
                                          title="Assign Serial Numbers"
                                          className="flex h-9 w-9 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                                        >
                                          <span className="text-lg leading-none">
                                            ☰
                                          </span>
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </td>

                                {/* Remark */}
                                <td className="border-b border-gray-200 px-4 py-3">
                                  {isSelected && (
                                    <input
                                      type="text"
                                      placeholder="Remark..."
                                      value={
                                        selectedRow?.damageRemark ||
                                        ''
                                      }
                                      onChange={(e) =>
                                        handleRowDataChange(
                                          productId,
                                          'damageRemark',
                                          e.target.value,
                                        )
                                      }
                                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                  )}
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-10 text-center text-gray-500"
                            >
                              No repaired products found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-4 py-4 md:px-6">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Transferring...
                  </>
                ) : (
                  'Transfer Repaired Stock'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Serial Number Modal */}
        <TransferSerialNumber
          visible={serialModalVisible}
          onClose={() => setSerialModalVisible(false)}
          product={selectedProduct}
          usageQty={
            parseInt(
              selectedRows[selectedProduct?._id]?.quantity,
              10,
            ) || 0
          }
          onSerialNumbersUpdate={
            handleSerialNumbersUpdate
          }
          availableSerials={
            selectedProduct
              ? products.find(
                  (p) =>
                    p.product._id ===
                    selectedProduct._id,
                )?.repairedSerials || []
              : []
          }
        />
      </div>
    </div>
  )
}

export default TransferRepairedStock