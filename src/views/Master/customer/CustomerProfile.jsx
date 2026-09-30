import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle,
  ChevronDown,
  Edit,
  RefreshCw,
  RotateCcw,
  Settings,
  XCircle,
  AlertTriangle,
} from 'lucide-react'

import axiosInstance from '../../../axiosInstance'
import {
  confirmAction,
  showError,
  showSuccess,
} from '../../../utils/sweetAlerts'
import CustomerSerialNumber from './CustomerSerialNumber'

const CustomerProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('device')

  const [deviceData, setDeviceData] = useState([])
  const [usageData, setUsageData] = useState([])
  const [shiftingData, setShiftingData] = useState([])

  const [dropdownOpen, setDropdownOpen] = useState({})
  const [serialModalVisible, setSerialModalVisible] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState(null)

  const [loadingTabs, setLoadingTabs] = useState({
    device: false,
    usage: false,
    shifting: false,
  })

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
    tab: 'device',
  })

  const dropdownRefs = useRef({})

  const fetchDeviceData = async () => {
    try {
      setLoadingTabs((prev) => ({
        ...prev,
        device: true,
      }))

      const response = await axiosInstance.get(
        `/stockusage/customer/${id}/devices`
      )

      if (response.data.success) {
        setDeviceData(response.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching device data:', err)
      setDeviceData([])
    } finally {
      setLoadingTabs((prev) => ({
        ...prev,
        device: false,
      }))
    }
  }

  const fetchUsageData = async () => {
    try {
      setLoadingTabs((prev) => ({
        ...prev,
        usage: true,
      }))

      const response = await axiosInstance.get(
        `/stockusage/customer/${id}`
      )

      if (response.data.success) {
        setUsageData(response.data.data || [])
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

  const fetchShiftingData = async () => {
    try {
      setLoadingTabs((prev) => ({
        ...prev,
        shifting: true,
      }))

      const response = await axiosInstance.get(
        `/shiftingRequest/customer/${id}/requests`
      )

      if (response.data.success) {
        setShiftingData(response.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching shifting data:', err)
      setShiftingData([])
    } finally {
      setLoadingTabs((prev) => ({
        ...prev,
        shifting: false,
      }))
    }
  }

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true)

        const response = await axiosInstance.get(`/customers/${id}`)

        if (response.data.success) {
          setCustomer(response.data.data)
          fetchDeviceData()
        } else {
          throw new Error('Failed to fetch customer data')
        }
      } catch (err) {
        setError(err.message)
        console.error('Error fetching customer:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCustomer()
    }
  }, [id])

  const handleTabChange = (tab) => {
    setActiveTab(tab)

    switch (tab) {
      case 'device':
        if (deviceData.length === 0) {
          fetchDeviceData()
        }
        break

      case 'usage':
        if (usageData.length === 0) {
          fetchUsageData()
        }
        break

      case 'shifting':
        if (shiftingData.length === 0) {
          fetchShiftingData()
        }
        break

      default:
        break
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
      case 'device':
        dataToSort = [...deviceData]
        setDataFunction = setDeviceData
        break

      case 'usage':
        dataToSort = [...usageData]
        setDataFunction = setUsageData
        break

      case 'shifting':
        dataToSort = [...shiftingData]
        setDataFunction = setShiftingData
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
          (obj, k) => obj && obj[k],
          a
        )

        bValue = keys.reduce(
          (obj, k) => obj && obj[k],
          b
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
      <ArrowUp size={15} className="inline-block" />
    ) : (
      <ArrowDown size={15} className="inline-block" />
    )
  }

  const toggleDropdown = (itemId) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

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
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [])

  const handleDamageReturn = async (
    usageId,
    serialNumber
  ) => {
    try {
      const html = `
        Are you sure you want to mark serial number
        <strong>${serialNumber}</strong> as Damage?<br><br>
      `

      const result = await confirmAction(
        'Are you sure to damage?',
        html,
        'warning',
        'Yes,Damage it!'
      )

      if (result.isConfirmed) {
        const response = await axiosInstance.post(
          '/damage/damage-returns',
          {
            usageId,
            serialNumber,
            remark:
              'Product marked as damaged - returned from customer',
          }
        )

        if (response.data.success) {
          showSuccess(
            `Serial number ${serialNumber} has been marked as Damage Return successfully`
          )

          fetchDeviceData()
        } else {
          throw new Error(
            response.data.message ||
              'Failed to mark as Damage Return'
          )
        }
      }
    } catch (error) {
      console.error('Error in damage return:', error)
      showError(error)
    }
  }

  const handleReturn = async (
    usageId,
    productId,
    serialNumber
  ) => {
    try {
      const html = `
        Are you sure you want to return serial number
        <strong>${serialNumber}</strong>?<br><br>
      `

      const result = await confirmAction(
        'Confirm Return',
        html,
        'question',
        'Yes, Return it!'
      )

      if (result.isConfirmed) {
        const response = await axiosInstance.post(
          '/stockusage/return/product',
          {
            usageId,
            productId,
            serialNumber,
          }
        )

        if (response.data.success) {
          showSuccess(
            `Serial number ${serialNumber} has been returned successfully`
          )

          fetchDeviceData()
        } else {
          throw new Error(
            response.data.message ||
              'Failed to return device'
          )
        }
      }
    } catch (error) {
      console.error('Error in return:', error)
      showError(error)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: {
        className:
          'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: AlertTriangle,
      },
      Approve: {
        className:
          'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle,
      },
      Rejected: {
        className:
          'bg-red-100 text-red-700 border-red-200',
        icon: XCircle,
      },
      Completed: {
        className:
          'bg-blue-100 text-blue-700 border-blue-200',
        icon: CheckCircle,
      },
    }

    const config =
      statusConfig[status] || {
        className:
          'bg-gray-100 text-gray-700 border-gray-200',
        icon: null,
      }

    const Icon = config.icon

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
      >
        {Icon && <Icon size={13} />}
        {status}
      </span>
    )
  }

  const SortableHeader = ({
    children,
    sortKey,
    tab,
  }) => (
    <th
      scope="col"
      onClick={() => handleSort(sortKey, tab)}
      className="cursor-pointer whitespace-nowrap border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 transition hover:bg-gray-100"
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {getSortIcon(sortKey, tab)}
      </span>
    </th>
  )

  const renderDeviceTable = () => (
    <div>
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-[1300px] w-full border-collapse text-sm">
          <thead>
            <tr>
              <SortableHeader sortKey="Product" tab="device">
                Product
              </SortableHeader>

              <SortableHeader
                sortKey="Serial No."
                tab="device"
              >
                Serial No
              </SortableHeader>

              <SortableHeader sortKey="Type" tab="device">
                Type
              </SortableHeader>

              <SortableHeader sortKey="Date" tab="device">
                Date
              </SortableHeader>

              <SortableHeader
                sortKey="Connection Type"
                tab="device"
              >
                Connection Type
              </SortableHeader>

              <SortableHeader
                sortKey="Package Amount"
                tab="device"
              >
                Package Amount
              </SortableHeader>

              <SortableHeader
                sortKey="Package Duration"
                tab="device"
              >
                Package Duration
              </SortableHeader>

              <SortableHeader
                sortKey="ONU Charges"
                tab="device"
              >
                ONU Charges
              </SortableHeader>

              <SortableHeader
                sortKey="Installation Charges"
                tab="device"
              >
                Installation Charges
              </SortableHeader>

              <SortableHeader sortKey="Remark" tab="device">
                Remark
              </SortableHeader>

              <th className="whitespace-nowrap border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loadingTabs.device ? (
              <tr>
                <td
                  colSpan="11"
                  className="px-4 py-10 text-center text-gray-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />
                    Loading device data...
                  </div>
                </td>
              </tr>
            ) : deviceData.length > 0 ? (
              deviceData.map((item, index) => {
                const isDamage =
                  item.type === 'Damage'

                return (
                  <tr
                    key={item._id || index}
                    className={`border-b transition ${
                      isDamage
                        ? 'bg-red-50 hover:bg-red-100'
                        : 'bg-green-50/30 hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-700">
                      {item.Product || 'N/A'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item['Serial No.'] || 'N/A'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item.Type || 'N/A'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item.Date || 'N/A'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item['Connection Type'] || 'N/A'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item['Package Amount'] || 'N/A'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item['Package Duration'] || 'N/A'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item['ONU Charges'] || 'N/A'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item['Installation Charges'] ||
                        'N/A'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item.Reason || 'N/A'}
                    </td>

                    <td className="px-4 py-3">
                      {item.Type !== 'Return' && (
                        <div
                          className="relative"
                          ref={(el) => {
                            dropdownRefs.current[item._id] = el
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              toggleDropdown(item._id)
                            }
                            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                          >
                            <Settings size={14} />
                            Options
                            <ChevronDown size={13} />
                          </button>

                          {dropdownOpen[item._id] && (
                            <div className="absolute right-0 z-30 mt-1 w-40 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() =>
                                  handleReturn(
                                    item.usageId,
                                    item.productId,
                                    item['Serial No.']
                                  )
                                }
                              >
                                <RotateCcw size={15} />
                                Return
                              </button>

                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  setSelectedDevice({
                                    productId:
                                      item.productId,
                                    productName:
                                      item.Product,
                                    usageId: item.usageId,
                                    oldSerialNumber:
                                      item['Serial No.'],
                                  })

                                  setSerialModalVisible(true)
                                }}
                              >
                                <RefreshCw size={15} />
                                Replace
                              </button>

                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                onClick={() =>
                                  handleDamageReturn(
                                    item.usageId,
                                    item['Serial No.']
                                  )
                                }
                              >
                                <AlertTriangle size={15} />
                                Damage
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No device data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-5 text-sm text-gray-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-green-100 ring-1 ring-green-200" />
          Use Product
        </span>

        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-red-100 ring-1 ring-red-200" />
          Damage Product
        </span>
      </div>
    </div>
  )

  const renderUsageTable = () => (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-[1000px] w-full border-collapse text-sm">
        <thead>
          <tr>
            <SortableHeader sortKey="Date" tab="usage">
              Date
            </SortableHeader>

            <SortableHeader sortKey="Type" tab="usage">
              Type
            </SortableHeader>

            <SortableHeader sortKey="Center" tab="usage">
              Center
            </SortableHeader>

            <SortableHeader sortKey="Product" tab="usage">
              Product
            </SortableHeader>

            <SortableHeader sortKey="Old Stock" tab="usage">
              Old Stock
            </SortableHeader>

            <SortableHeader sortKey="Qty" tab="usage">
              Qty
            </SortableHeader>

            <SortableHeader
              sortKey="Damage Qty"
              tab="usage"
            >
              Damage Qty
            </SortableHeader>

            <SortableHeader sortKey="New Stock" tab="usage">
              New Stock
            </SortableHeader>
          </tr>
        </thead>

        <tbody>
          {loadingTabs.usage ? (
            <tr>
              <td
                colSpan="8"
                className="px-4 py-10 text-center text-gray-500"
              >
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />
                  Loading usage data...
                </div>
              </td>
            </tr>
          ) : usageData.length > 0 ? (
            usageData.map((item, index) => (
              <tr
                key={item._id || index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  {item.Date || 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {item.Type || 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {item.Center || 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {item.Product || 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {item['Old Stock'] || 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {item.Qty || 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {item['Damage Qty'] || 0}
                </td>
                <td className="px-4 py-3">
                  {item['New Stock'] || 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="px-4 py-10 text-center text-gray-500"
              >
                No usage data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

  const renderShiftingTable = () => (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-[1000px] w-full border-collapse text-sm">
        <thead>
          <tr>
            <SortableHeader
              sortKey="Center To"
              tab="shifting"
            >
              Center To
            </SortableHeader>

            <SortableHeader sortKey="Date" tab="shifting">
              Date
            </SortableHeader>

            <SortableHeader sortKey="status" tab="shifting">
              Status
            </SortableHeader>

            <SortableHeader
              sortKey="Status Detail"
              tab="shifting"
            >
              Status Detail
            </SortableHeader>

            <SortableHeader
              sortKey="Old Address"
              tab="shifting"
            >
              Old Address
            </SortableHeader>

            <SortableHeader
              sortKey="Current Address"
              tab="shifting"
            >
              Current Address
            </SortableHeader>
          </tr>
        </thead>

        <tbody>
          {loadingTabs.shifting ? (
            <tr>
              <td
                colSpan="6"
                className="px-4 py-10 text-center text-gray-500"
              >
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />
                  Loading shifting data...
                </div>
              </td>
            </tr>
          ) : shiftingData.length > 0 ? (
            shiftingData.map((item) => (
              <tr
                key={item._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  {item['Center To'] || 'N/A'}
                </td>

                <td className="px-4 py-3">
                  {item.Date || 'N/A'}
                </td>

                <td className="px-4 py-3">
                  {getStatusBadge(item.status)}
                </td>

                <td className="px-4 py-3">
                  {item['Status Detail'] || 'N/A'}
                </td>

                <td className="px-4 py-3">
                  {item['Old Address'] || 'N/A'}
                </td>

                <td className="px-4 py-3">
                  {item['Current Address'] || 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="px-4 py-10 text-center text-gray-500"
              >
                No shifting data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <RefreshCw
          size={30}
          className="animate-spin text-blue-600"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="m-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Error loading customer profile: {error}
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="m-4 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
        Customer not found
      </div>
    )
  }

  const handleEdit = () => {
    navigate(`/edit-customer/${id}`)
  }

  const handleBack = () => {
    navigate('/customers-list')
  }

  const tabs = [
    { key: 'device', label: 'Device' },
    { key: 'usage', label: 'Usage' },
    { key: 'shifting', label: 'Shifting' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <h1 className="text-2xl font-semibold text-gray-800">
              {customer.username}
            </h1>

            <button
              type="button"
              onClick={handleEdit}
              className="rounded-md border border-gray-300 bg-white p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
              title="Edit Customer"
            >
              <Edit size={17} />
            </button>
          </div>
        </div>

        {/* Customer Details */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Customer Details
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="w-40 bg-gray-50 px-5 py-3 font-medium text-gray-600">
                    Name:
                  </td>
                  <td className="px-5 py-3 text-gray-800">
                    {customer.name || 'N/A'}
                  </td>
                </tr>

                <tr className="border-b border-gray-100">
                  <td className="bg-gray-50 px-5 py-3 font-medium text-gray-600">
                    Mobile:
                  </td>
                  <td className="px-5 py-3 text-gray-800">
                    {customer.mobile || 'N/A'}
                  </td>
                </tr>

                <tr className="border-b border-gray-100">
                  <td className="bg-gray-50 px-5 py-3 font-medium text-gray-600">
                    Email:
                  </td>
                  <td className="px-5 py-3 text-gray-800">
                    {customer.email || 'N/A'}
                  </td>
                </tr>

                <tr className="border-b border-gray-100">
                  <td className="bg-gray-50 px-5 py-3 font-medium text-gray-600">
                    Center:
                  </td>
                  <td className="px-5 py-3 text-gray-800">
                    {customer.center?.centerName || 'N/A'}
                  </td>
                </tr>

                <tr>
                  <td className="bg-gray-50 px-5 py-3 font-medium text-gray-600">
                    Address:
                  </td>
                  <td className="px-5 py-3 text-gray-800">
                    {[
                      customer.address1,
                      customer.address2,
                      customer.city,
                      customer.state,
                    ]
                      .filter(Boolean)
                      .join(' ') || 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabs / Data */}
        <div className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`border-t-4 px-5 py-3 text-sm font-medium transition ${
                    activeTab === tab.key
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            {activeTab === 'device' &&
              renderDeviceTable()}

            {activeTab === 'usage' &&
              renderUsageTable()}

            {activeTab === 'shifting' &&
              renderShiftingTable()}
          </div>
        </div>

        {/* Replace Modal */}
        <CustomerSerialNumber
          visible={serialModalVisible}
          onClose={() => {
            setSerialModalVisible(false)
            setSelectedDevice(null)
          }}
          productId={selectedDevice?.productId}
          productName={selectedDevice?.productName}
          usageId={selectedDevice?.usageId}
          oldSerialNumber={
            selectedDevice?.oldSerialNumber
          }
          onReplaceSuccess={fetchDeviceData}
        />
      </div>
    </div>
  )
}

export default CustomerProfile