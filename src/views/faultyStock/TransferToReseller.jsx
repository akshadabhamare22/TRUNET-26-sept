import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../axiosInstance'
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  PackageCheck,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'
import TransferSerialNumber from './TransferSerialNumber'
import {
  confirmAction,
  showSuccess,
  showError,
} from '../../utils/sweetAlerts'

const TransferToReseller = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    transferRemark: '',
  })

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
  const [acceptingItems, setAcceptingItems] = useState({})

  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    message: '',
  })

  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    fetchRepairedProducts()
  }, [])

  const fetchRepairedProducts = async () => {
    try {
      setLoading(true)

      const response = await axiosInstance.get(
        '/faulty-stock/outlet-repaired-stock',
      )

      if (response.data.success) {
        console.log(
          'Fetched repaired products in outlet:',
          response.data.data,
        )

        const allProducts =
          response.data.data.repairedProducts || []

        const transformedProducts = allProducts.map(
          (product) => {
            const repairedSerials = []

            // Pending serials
            if (
              product.pendingRepairedSerials &&
              Array.isArray(product.pendingRepairedSerials)
            ) {
              product.pendingRepairedSerials.forEach(
                (serial) => {
                  repairedSerials.push({
                    ...serial,
                    status:
                      serial.status || 'pending_approval',
                    isPending: true,
                  })
                },
              )
            }

            // Available serials
            if (
              product.availableRepairedSerials &&
              Array.isArray(
                product.availableRepairedSerials,
              )
            ) {
              product.availableRepairedSerials.forEach(
                (serial) => {
                  repairedSerials.push({
                    ...serial,
                    status: serial.status || 'available',
                    isPending: false,
                  })
                },
              )
            }

            // Reseller group serials
            if (
              product.resellerGroups &&
              Array.isArray(product.resellerGroups)
            ) {
              product.resellerGroups.forEach((group) => {
                if (
                  group.serials &&
                  Array.isArray(group.serials)
                ) {
                  group.serials.forEach((serialNumber) => {
                    const exists = repairedSerials.some(
                      (serial) =>
                        serial.serialNumber === serialNumber,
                    )

                    if (!exists) {
                      repairedSerials.push({
                        serialNumber,
                        status: 'available',
                        isPending: false,
                        source: 'reseller_group',
                      })
                    }
                  })
                }
              })
            }

            return {
              ...product,
              repairedSerials,
              totalRepairedQuantity:
                product.totalRepairedQuantity || 0,
              pendingRepairedQuantity:
                product.pendingRepairedQuantity || 0,
              availableRepairedQuantity:
                product.availableRepairedQuantity || 0,
            }
          },
        )

        setProducts(transformedProducts)
      }
    } catch (error) {
      console.error(
        'Error fetching repaired products:',
        error,
      )

      showAlert(
        'danger',
        'Failed to fetch repaired products',
      )
    } finally {
      setLoading(false)
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

  // Accept single pending item
  const handleAcceptItem = async (product) => {
    try {
      const isSerialized =
        product.product?.trackSerialNumber === 'Yes'

      let serialNumbers = []

      if (isSerialized) {
        const pendingSerials =
          product.repairedSerials?.filter(
            (serial) =>
              serial.status === 'pending_approval',
          )

        if (!pendingSerials || pendingSerials.length === 0) {
          showAlert(
            'warning',
            'No pending items found for this product',
          )
          return
        }

        serialNumbers = pendingSerials.map(
          (serial) => serial.serialNumber,
        )

        const result = await confirmAction(
          'Accept Repaired Items',
          `Are you sure you want to accept ${serialNumbers.length} items of ${product.product?.productTitle}?<br><small>Serial Numbers: ${serialNumbers.join(', ')}</small>`,
          'question',
          'Yes, accept items',
        )

        if (!result.isConfirmed) return
      } else {
        const result = await confirmAction(
          'Accept Repaired Items',
          `Are you sure you want to accept repaired items of ${product.product?.productTitle}?`,
          'question',
          'Yes, accept items',
        )

        if (!result.isConfirmed) return
      }

      setAcceptingItems((prev) => ({
        ...prev,
        [product.outletStockId]: true,
      }))

      const acceptData = {
        productId: product.product._id,
        action: 'accept',
        ...(isSerialized &&
          serialNumbers.length > 0 && {
            serialNumbers,
          }),
      }

      const response = await axiosInstance.post(
        '/warehouse-repaired',
        acceptData,
      )

      if (response.data.success) {
        showSuccess(
          response.data.message ||
            'Items accepted successfully!',
        )

        await fetchRepairedProducts()

        setSelectedRows((prev) => {
          const updated = { ...prev }
          delete updated[product.outletStockId]
          return updated
        })
      } else {
        throw new Error(
          response.data.message ||
            'Failed to accept items',
        )
      }
    } catch (error) {
      console.error(
        'Error accepting item:',
        error,
      )

      showError(error, 'Failed to accept items')
    } finally {
      setAcceptingItems((prev) => ({
        ...prev,
        [product.outletStockId]: false,
      }))
    }
  }

  // Accept selected pending items
  const handleAcceptSelected = async () => {
    const selectedProducts = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map((id) => {
        const row = selectedRows[id]
        const product = products.find(
          (item) => item.outletStockId === id,
        )

        return {
          ...product,
          selectedRow: row,
        }
      })

    if (selectedProducts.length === 0) {
      showAlert(
        'warning',
        'Please select items to accept',
      )
      return
    }

    try {
      const result = await confirmAction(
        'Accept Selected Items',
        `Are you sure you want to accept ${selectedProducts.length} item(s)?`,
        'question',
        'Yes, accept all',
      )

      if (!result.isConfirmed) return

      setSubmitting(true)

      for (const product of selectedProducts) {
        const isSerialized =
          product.product?.trackSerialNumber === 'Yes'

        let serialNumbers = []

        if (isSerialized) {
          serialNumbers =
            assignedSerials[product.outletStockId] ||
            product.repairedSerials
              ?.filter(
                (serial) =>
                  serial.status === 'pending_approval',
              )
              .map((serial) => serial.serialNumber) ||
            []
        }

        const acceptData = {
          productId: product.product._id,
          action: 'accept',
          ...(isSerialized &&
            serialNumbers.length > 0 && {
              serialNumbers,
            }),
        }

        await axiosInstance.post(
          '/warehouse-repaired',
          acceptData,
        )
      }

      showSuccess(
        `${selectedProducts.length} item(s) accepted successfully!`,
      )

      await fetchRepairedProducts()

      setSelectedRows({})
      setAssignedSerials({})
    } catch (error) {
      console.error(
        'Error accepting selected items:',
        error,
      )

      showError(error, 'Failed to accept items')
    } finally {
      setSubmitting(false)
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

  const handleOpenSerialModal = (product) => {
    const productForSerial = {
      _id: product.product._id,
      productTitle: product.product.productTitle,
      trackSerialNumber:
        product.product.trackSerialNumber,
      productId: product.product._id,
      outletStockId: product.outletStockId,
    }

    setSelectedProduct(productForSerial)
    setSerialModalVisible(true)
  }

  const handleSerialNumbersUpdate = (
    outletStockId,
    serialsArray,
  ) => {
    setAssignedSerials((prev) => ({
      ...prev,
      [outletStockId]: serialsArray,
    }))
  }

  const handleRowSelect = (product) => {
    const outletStockId = product.outletStockId

    setSelectedRows((prev) => ({
      ...prev,
      [outletStockId]: prev[outletStockId]
        ? undefined
        : {
            quantity: Math.min(
              1,
              getPendingCount(product),
            ),
            remark: '',
            outletStockId,
            productId: product.product._id,
            productData: product,
            resellerGroups:
              product.resellerGroups,
            outlet: product.outlet,
          },
    }))
  }

  const handleRowDataChange = (
    outletStockId,
    field,
    value,
  ) => {
    setSelectedRows((prev) => ({
      ...prev,
      [outletStockId]: {
        ...prev[outletStockId],
        [field]: value,
      },
    }))
  }

  const getAvailableCount = (product) => {
    if (
      product.product?.trackSerialNumber === 'Yes'
    ) {
      const availableSerials =
        product.availableRepairedSerials || []

      const repairedSerials =
        product.repairedSerials || []

      const countFromApi = availableSerials.length

      const countFromRepairedSerials =
        repairedSerials.filter(
          (serial) =>
            serial.status === 'available' &&
            !serial.isPending,
        ).length

      return countFromApi > 0
        ? countFromApi
        : countFromRepairedSerials
    }

    return product.availableRepairedQuantity || 0
  }

  const getPendingCount = (product) => {
    if (
      product.product?.trackSerialNumber === 'Yes'
    ) {
      const pendingSerials =
        product.pendingRepairedSerials || []

      const repairedSerials =
        product.repairedSerials || []

      const countFromApi = pendingSerials.length

      const countFromRepairedSerials =
        repairedSerials.filter(
          (serial) =>
            serial.status === 'pending_approval' ||
            serial.isPending === true,
        ).length

      return countFromApi > 0
        ? countFromApi
        : countFromRepairedSerials
    }

    return product.pendingRepairedQuantity || 0
  }

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
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

    try {
      const selectedProducts = Object.keys(
        selectedRows,
      )
        .filter((id) => selectedRows[id])
        .map((id) => {
          const row = selectedRows[id]

          const product = products.find(
            (item) => item.outletStockId === id,
          )

          const resellerGroup =
            row.resellerGroups &&
            row.resellerGroups.length > 0
              ? row.resellerGroups[0]
              : null

          if (!resellerGroup) {
            throw new Error(
              `No reseller information found for product ${row.productData?.product?.productTitle}`,
            )
          }

          const itemData = {
            productId: row.productId,
            quantity: parseInt(row.quantity, 10) || 0,
            remark: row.remark || '',
            resellerId:
              resellerGroup.reseller._id,
            destinationCenterId:
              resellerGroup.center._id,
            outletStockId: row.outletStockId,
          }

          if (
            product?.product?.trackSerialNumber ===
            'Yes'
          ) {
            const serialNumbers =
              assignedSerials[row.outletStockId] || []

            if (serialNumbers.length > 0) {
              itemData.serialNumbers = serialNumbers
            }
          }

          return itemData
        })

      if (selectedProducts.length === 0) {
        showAlert(
          'warning',
          'Please select items to transfer',
        )

        setSubmitting(false)
        return
      }

      const submitData = {
        items: selectedProducts,
        transferRemark:
          formData.transferRemark || '',
      }

      console.log(
        'Submitting data to reseller:',
        submitData,
      )

      const response = await axiosInstance.post(
        '/faulty-stock/transfer-to-reseller-center',
        submitData,
      )

      if (response.data.success) {
        showSuccess(
          response.data.message ||
            'Repaired stock transferred to reseller successfully!',
        )

        setTimeout(() => {
          navigate('/reseller-stock')
        }, 1500)
      } else {
        showAlert(
          'danger',
          response.data.message ||
            'Failed to transfer repaired stock to reseller',
        )
      }
    } catch (error) {
      console.error(
        'Error transferring to reseller:',
        error,
      )

      showError(
        error,
        'Failed to transfer repaired stock to reseller',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const filteredProducts = products.filter((p) => {
    const search =
      productSearchTerm.toLowerCase()

    return (
      p.product?.productTitle
        ?.toLowerCase()
        .includes(search) ||
      p.product?.productCode
        ?.toLowerCase()
        .includes(search) ||
      (
        p.reseller?.resellerName
          ?.toLowerCase() || ''
      ).includes(search) ||
      (
        p.center?.centerName?.toLowerCase() ||
        ''
      ).includes(search)
    )
  })

  const handleBack = () => {
    navigate('/faulty-stock')
  }

  const groupedProducts = filteredProducts.reduce(
    (groups, product) => {
      const outletName =
        product.outlet?.centerName ||
        'Unknown Outlet'

      if (!groups[outletName]) {
        groups[outletName] = []
      }

      groups[outletName].push(product)

      return groups
    },
    {},
  )

  const pendingProductCount = products.filter(
    (product) => getPendingCount(product) > 0,
  ).length

  const availableProductCount = products.filter(
    (product) => getAvailableCount(product) > 0,
  ).length

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
   <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      <div className="mx-auto max-w-[1600px]">
        {/* Page Header */}
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-md bg-[#2759a2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b] focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <h1 className="mb-2 text-[24px] font-[450] leading-tight text-[#212529]">
              Manage Repaired Stock in Outlet
            </h1>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {/* Alert */}
        {alert.visible && (
          <div
            className={`mb-4 flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${getAlertClasses()}`}
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

        {/* Main Card */}
        <div className="overflow-hidden rounded-md border border-slate-200 border-t-4 border-t-[#2759a2] bg-white shadow-sm">
          {/* Tabs */}
          <div className="border-b border-slate-200 px-4 py-4 md:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab('pending')
                  }
                  className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                    activeTab === 'pending'
                      ? 'bg-[#2759a2] text-white shadow-sm'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ClipboardList size={16} />
                  Pending Approval

                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeTab === 'pending'
                        ? 'bg-white/20 text-white'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {pendingProductCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab('available')
                  }
                  className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                    activeTab === 'available'
                      ? 'bg-[#2759a2] text-white shadow-sm'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <PackageCheck size={16} />
                  Available Stock

                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeTab === 'available'
                        ? 'bg-white/20 text-white'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {availableProductCount}
                  </span>
                </button>
              </div>

              {activeTab === 'pending' &&
                Object.keys(selectedRows).filter(
                  (id) => selectedRows[id],
                ).length > 0 && (
                  <button
                    type="button"
                    onClick={handleAcceptSelected}
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Accepting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={17} />
                        Accept Selected (
                        {
                          Object.keys(
                            selectedRows,
                          ).filter(
                            (id) => selectedRows[id],
                          ).length
                        }
                        )
                      </>
                    )}
                  </button>
                )}
            </div>
          </div>

          {/* Pending Tab */}
          {activeTab === 'pending' && (
            <div className="p-4 md:p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Pending Approval Items
                </h2>

                <p className="text-sm text-slate-500">
                  Items transferred from repair center
                  waiting for acceptance
                </p>
              </div>

              <div className="mb-4 flex justify-end">
                <div className="relative w-full md:w-[300px]">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={productSearchTerm}
                    onChange={(e) =>
                      setProductSearchTerm(
                        e.target.value,
                      )
                    }
                    placeholder="Search products..."
                    className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center">
                  <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                  <p className="mt-3 text-sm text-gray-500">
                    Loading repaired products...
                  </p>
                </div>
              ) : Object.keys(groupedProducts)
                  .length > 0 ? (
                Object.keys(groupedProducts).map(
                  (outletName) => {
                    const pendingProducts =
                      groupedProducts[
                        outletName
                      ].filter(
                        (product) =>
                          getPendingCount(product) > 0,
                      )

                    if (pendingProducts.length === 0) {
                      return null
                    }

                    return (
                      <div
                        key={outletName}
                        className="mb-6"
                      >
                        <div className="mb-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5">
                          <h3 className="font-semibold text-gray-800">
                            {outletName}
                          </h3>
                        </div>

                        <div className="max-h-[520px] overflow-y-auto overflow-x-auto rounded-md border border-slate-200">
                          <table className="min-w-[950px] w-full border-collapse text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="w-[60px] border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                  Select
                                </th>

                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                  Product Name
                                </th>

                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                  Reseller
                                </th>

                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                  Original Center
                                </th>

                                <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                                  Pending Qty
                                </th>

                                <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                                  Available Qty
                                </th>

                                <th className="w-[130px] border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                                  Action
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {pendingProducts.map(
                                (product) => {
                                  const outletStockId =
                                    product.outletStockId

                                  const isSelected =
                                    !!selectedRows[
                                      outletStockId
                                    ]

                                  const trackSerial =
                                    product.product
                                      ?.trackSerialNumber ===
                                    'Yes'

                                  const pendingCount =
                                    getPendingCount(
                                      product,
                                    )

                                  const availableCount =
                                    getAvailableCount(
                                      product,
                                    )

                                  const isAccepting =
                                    acceptingItems[
                                      outletStockId
                                    ]

                                  const resellerInfo =
                                    product.resellerGroups &&
                                    product
                                      .resellerGroups
                                      .length > 0
                                      ? product
                                          .resellerGroups[0]
                                      : {
                                          reseller: {
                                            resellerName:
                                              'N/A',
                                          },
                                          center: {
                                            centerName:
                                              'N/A',
                                          },
                                        }

                                  return (
                                    <tr
                                      key={
                                        outletStockId
                                      }
                                      className={`transition ${
                                        isSelected
                                          ? 'bg-[#dff0d8]'
                                          : 'odd:bg-white even:bg-slate-50 hover:bg-slate-100'
                                      }`}
                                    >
                                      <td className="border-b border-slate-200 px-4 py-3">
                                        <input
                                          type="checkbox"
                                          checked={
                                            isSelected
                                          }
                                          onChange={() =>
                                            handleRowSelect(
                                              product,
                                            )
                                          }
                                          className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                      </td>

                                      <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-800">
                                        {product.product
                                          ?.productTitle ||
                                          ''}
                                      </td>

                                      <td className="border-b border-slate-200 px-4 py-3 text-slate-700">
                                        {resellerInfo
                                          .reseller
                                          ?.resellerName ||
                                          'N/A'}
                                      </td>

                                      <td className="border-b border-slate-200 px-4 py-3 text-slate-700">
                                        {resellerInfo
                                          .center
                                          ?.centerName ||
                                          'N/A'}
                                      </td>

                                      <td className="border-b border-slate-200 px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                          <span className="font-semibold text-orange-600">
                                            {
                                              pendingCount
                                            }
                                          </span>

                                          {trackSerial &&
                                            isSelected && (
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleOpenSerialModal(
                                                    product,
                                                  )
                                                }
                                                title="Assign specific serials"
                                                className="rounded-md border border-blue-200 bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100"
                                              >
                                                <ClipboardList
                                                  size={
                                                    16
                                                  }
                                                />
                                              </button>
                                            )}
                                        </div>

                                        {trackSerial && (
                                          <div className="mt-1 text-xs text-gray-500">
                                            {product.repairedSerials?.filter(
                                              (serial) =>
                                                serial.status ===
                                                'pending_approval',
                                            ).length ||
                                              0}{' '}
                                            serial(s)
                                          </div>
                                        )}
                                      </td>

                                      <td className="border-b border-slate-200 px-4 py-3 text-center">
                                        <span
                                          className={
                                            availableCount >
                                            0
                                              ? 'font-semibold text-green-600'
                                              : 'text-gray-400'
                                          }
                                        >
                                          {
                                            availableCount
                                          }
                                        </span>
                                      </td>

                                      <td className="border-b border-slate-200 px-4 py-3">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleAcceptItem(
                                              product,
                                            )
                                          }
                                          disabled={
                                            isAccepting
                                          }
                                          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                          {isAccepting ? (
                                            <>
                                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                              Accepting...
                                            </>
                                          ) : (
                                            <>
                                              <CheckCircle2
                                                size={
                                                  16
                                                }
                                              />
                                              Accept
                                            </>
                                          )}
                                        </button>
                                      </td>
                                    </tr>
                                  )
                                },
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  },
                )
              ) : (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-md border border-slate-200 bg-white py-16 text-center">
                  <CheckCircle2
                    size={48}
                    className="mb-3 text-green-500"
                  />

                  <h3 className="text-lg font-semibold text-slate-800">
                    No Pending Items
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    All repaired items have been
                    accepted.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Available Tab */}
          {activeTab === 'available' && (
            <form onSubmit={handleSubmit}>
              <div className="p-4 md:p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Available Repaired Stock
                  </h2>

                  <p className="text-sm text-slate-500">
                    Accepted items available for
                    transfer to resellers
                  </p>
                </div>

                {/* Transfer Details */}
                <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="date"
                      className={`mb-1.5 block text-sm font-medium ${
                        errors.date
                          ? 'text-red-600'
                          : 'text-gray-700'
                      }`}
                    >
                      Transfer Date{' '}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
                        errors.date
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />

                    {errors.date && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.date}
                      </p>
                    )}
                  </div>

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
                      className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Search */}
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Select Products for Reseller
                      Transfer
                    </h3>

                    {errors.products && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.products}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full md:w-[300px]">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={productSearchTerm}
                      onChange={(e) =>
                        setProductSearchTerm(
                          e.target.value,
                        )
                      }
                      placeholder="Search available products..."
                      className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="flex min-h-[220px] items-center justify-center">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                  </div>
                ) : Object.keys(groupedProducts)
                    .length > 0 ? (
                  Object.keys(groupedProducts).map(
                    (outletName) => {
                      const availableProducts =
                        groupedProducts[
                          outletName
                        ].filter(
                          (product) =>
                            getAvailableCount(
                              product,
                            ) > 0,
                        )

                      if (
                        availableProducts.length === 0
                      ) {
                        return null
                      }

                      return (
                        <div
                          key={outletName}
                          className="mb-6"
                        >
                          <div className="mb-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5">
                            <h3 className="font-semibold text-gray-800">
                              {outletName}
                            </h3>
                          </div>

                          <div className="max-h-[520px] overflow-y-auto overflow-x-auto rounded-md border border-slate-200">
                            <table className="min-w-[1050px] w-full border-collapse text-sm">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                    Select
                                  </th>

                                  <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                    Product Name
                                  </th>

                                  <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                    Reseller
                                  </th>

                                  <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                    Original Center
                                  </th>

                                  <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                                    Available Qty
                                  </th>

                                  <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                                    Transfer Qty
                                  </th>

                                  <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                    Remark
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {availableProducts.map(
                                  (product) => {
                                    const outletStockId =
                                      product.outletStockId

                                    const isSelected =
                                      !!selectedRows[
                                        outletStockId
                                      ]

                                    const selectedRow =
                                      selectedRows[
                                        outletStockId
                                      ]

                                    const trackSerial =
                                      product.product
                                        ?.trackSerialNumber ===
                                      'Yes'

                                    const availableCount =
                                      getAvailableCount(
                                        product,
                                      )

                                    const resellerInfo =
                                      product.resellerGroups &&
                                      product
                                        .resellerGroups
                                        .length > 0
                                        ? product
                                            .resellerGroups[0]
                                        : {
                                            reseller: {
                                              resellerName:
                                                'N/A',
                                            },
                                            center: {
                                              centerName:
                                                'N/A',
                                            },
                                          }

                                    return (
                                      <tr
                                        key={
                                          outletStockId
                                        }
                                        className={`transition ${
                                          isSelected
                                            ? 'bg-blue-50'
                                            : 'hover:bg-gray-50'
                                        }`}
                                      >
                                        <td className="border-b border-slate-200 px-4 py-3">
                                          <input
                                            type="checkbox"
                                            checked={
                                              isSelected
                                            }
                                            onChange={() =>
                                              handleRowSelect(
                                                product,
                                              )
                                            }
                                            className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                          />
                                        </td>

                                        <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-800">
                                          {product.product
                                            ?.productTitle ||
                                            'N/A'}
                                        </td>

                                        <td className="border-b border-slate-200 px-4 py-3 text-slate-700">
                                          {resellerInfo
                                            .reseller
                                            ?.resellerName ||
                                            'N/A'}
                                        </td>

                                        <td className="border-b border-slate-200 px-4 py-3 text-slate-700">
                                          {resellerInfo
                                            .center
                                            ?.centerName ||
                                            'N/A'}
                                        </td>

                                        <td className="border-b border-slate-200 px-4 py-3 text-center">
                                          <span className="font-semibold text-green-600">
                                            {
                                              availableCount
                                            }
                                          </span>
                                        </td>

                                        <td className="border-b border-slate-200 px-4 py-3">
                                          {isSelected && (
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="number"
                                                value={
                                                  selectedRow?.quantity ||
                                                  ''
                                                }
                                                onChange={(
                                                  e,
                                                ) =>
                                                  handleRowDataChange(
                                                    outletStockId,
                                                    'quantity',
                                                    e
                                                      .target
                                                      .value,
                                                  )
                                                }
                                                placeholder="Qty"
                                                min="1"
                                                max={
                                                  availableCount
                                                }
                                                className="w-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
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
                                                  <ClipboardList
                                                    size={
                                                      17
                                                    }
                                                  />
                                                </button>
                                              )}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border-b border-slate-200 px-4 py-3">
                                          {isSelected && (
                                            <input
                                              type="text"
                                              placeholder="Remark..."
                                              value={
                                                selectedRow?.remark ||
                                                ''
                                              }
                                              onChange={(
                                                e,
                                              ) =>
                                                handleRowDataChange(
                                                  outletStockId,
                                                  'remark',
                                                  e
                                                    .target
                                                    .value,
                                                )
                                              }
                                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2759a2] focus:ring-2 focus:ring-blue-100"
                                            />
                                          )}
                                        </td>
                                      </tr>
                                    )
                                  },
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    },
                  )
                ) : (
                  <div className="rounded-lg border border-gray-200 py-10 text-center text-sm text-gray-500">
                    No available repaired products
                    found
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-4 py-4 md:px-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Transferring to Reseller...
                    </>
                  ) : (
                    'Transfer to Reseller Stock'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Serial Number Modal */}
        <TransferSerialNumber
          visible={serialModalVisible}
          onClose={() =>
            setSerialModalVisible(false)
          }
          product={selectedProduct}
          usageQty={
            parseInt(
              selectedRows[
                selectedProduct?.outletStockId
              ]?.quantity,
              10,
            ) || 0
          }
          onSerialNumbersUpdate={(
            productId,
            serials,
          ) => {
            handleSerialNumbersUpdate(
              selectedProduct?.outletStockId,
              serials,
            )
          }}
          availableSerials={
            selectedProduct
              ? products.find(
                  (product) =>
                    product.outletStockId ===
                    selectedProduct.outletStockId,
                )?.repairedSerials || []
              : []
          }
          showOnlyPending={
            activeTab === 'pending'
          }
        />
      </div>
    </div>
  )
}

export default TransferToReseller