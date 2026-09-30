import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Edit,
  MoreVertical,
  RefreshCcw,
  Repeat2,
  RotateCcw,
  Search,
  Settings,
  Trash2,
} from 'lucide-react'
import axiosInstance from '../../../axiosInstance';
import {
  confirmAction,
  showError,
  showSuccess,
} from '../../../utils/sweetAlerts'
import CustomerSerialNumber from '../customer/CustomerSerialNumber'

const BuildingProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [activeTab, setActiveTab] = useState('device')

  const [deviceData, setDeviceData] = useState([])
  const [usageData, setUsageData] = useState([])
  const [shiftingData, setShiftingData] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
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

  const filteredDeviceData = useMemo(() => {
    if (!searchTerm) return deviceData

    return deviceData.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      ),
    )
  }, [deviceData, searchTerm])

  const filteredUsageData = useMemo(() => {
    if (!searchTerm) return usageData

    return usageData.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      ),
    )
  }, [usageData, searchTerm])

  const filteredShiftingData = useMemo(() => {
    if (!searchTerm) return shiftingData

    return shiftingData.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      ),
    )
  }, [shiftingData, searchTerm])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const response = await axiosInstance.get(
          `/buildings/${id}`,
        )

        if (response.data.success) {
          setData(response.data.data)
          fetchDeviceData()
        } else {
          throw new Error('Failed to fetch data')
        }
      } catch (err) {
        setError(err.message)
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const fetchDeviceData = async () => {
    try {
      setLoadingTabs((prev) => ({
        ...prev,
        device: true,
      }))

      const response = await axiosInstance.get(
        `/stockusage/building/${id}/devices`,
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
        `/stockusage/building/${id}`,
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
        `/shiftingRequest/building/${id}/requests`,
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

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchTerm('')

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
        dataToSort = [...filteredDeviceData]
        setDataFunction = setDeviceData
        break

      case 'usage':
        dataToSort = [...filteredUsageData]
        setDataFunction = setUsageData
        break

      case 'shifting':
        dataToSort = [...filteredShiftingData]
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
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    )
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending:
        'bg-yellow-100 text-yellow-700 border-yellow-200',
      Approve:
        'bg-green-100 text-green-700 border-green-200',
      Rejected:
        'bg-red-100 text-red-700 border-red-200',
      Completed:
        'bg-blue-100 text-blue-700 border-blue-200',
    }

    return (
      <span
        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
          statusConfig[status] ||
          'bg-gray-100 text-gray-700 border-gray-200'
        }`}
      >
        {status}
      </span>
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
          !dropdownRefs.current[key].contains(
            event.target,
          )
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

  const handleDamageReturn = async (
    usageId,
    serialNumber,
  ) => {
    try {
      const html = `Are you sure you want to mark serial number <strong>${serialNumber}</strong> as Damage?<br><br>`

      const result = await confirmAction(
        'Are you sure to damage?',
        html,
        'warning',
        'Yes,Damage it!',
      )

      if (result.isConfirmed) {
        const response = await axiosInstance.post(
          '/damage/damage-returns',
          {
            usageId,
            serialNumber,
            remark:
              'Product marked as damaged - returned from building',
          },
        )

        if (response.data.success) {
          showSuccess(
            `Serial number ${serialNumber} has been marked as Damage Return successfully`,
          )

          fetchDeviceData()
        } else {
          throw new Error(
            response.data.message ||
              'Failed to mark as Damage Return',
          )
        }
      }
    } catch (error) {
      console.error(
        'Error in damage return:',
        error,
      )
      showError(error)
    }
  }

  const handleReturn = async (
    usageId,
    productId,
    serialNumber,
  ) => {
    try {
      const html = `Are you sure you want to return serial number <strong>${serialNumber}</strong>?<br><br>`

      const result = await confirmAction(
        'Confirm Return',
        html,
        'question',
        'Yes, Return it!',
      )

      if (result.isConfirmed) {
        const response = await axiosInstance.post(
          '/stockusage/return/product',
          {
            usageId,
            productId,
            serialNumber,
          },
        )

        if (response.data.success) {
          showSuccess(
            `Serial number ${serialNumber} has been returned successfully`,
          )

          fetchDeviceData()
        } else {
          throw new Error(
            response.data.message ||
              'Failed to return device',
          )
        }
      }
    } catch (error) {
      console.error('Error in return:', error)
      showError(error)
    }
  }

  const renderDeviceTable = () => (
    <div>
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th
                onClick={() =>
                  handleSort('Product', 'device')
                }
                className="cursor-pointer border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
              >
                <span className="inline-flex items-center gap-1">
                  Product
                  {getSortIcon('Product', 'device')}
                </span>
              </th>

              <th
                onClick={() =>
                  handleSort(
                    'Serial No.',
                    'device',
                  )
                }
                className="cursor-pointer border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
              >
                <span className="inline-flex items-center gap-1">
                  Serial No
                  {getSortIcon(
                    'Serial No.',
                    'device',
                  )}
                </span>
              </th>

              <th
                onClick={() =>
                  handleSort('Type', 'device')
                }
                className="cursor-pointer border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
              >
                <span className="inline-flex items-center gap-1">
                  Type
                  {getSortIcon('Type', 'device')}
                </span>
              </th>

              <th
                onClick={() =>
                  handleSort('Date', 'device')
                }
                className="cursor-pointer border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
              >
                <span className="inline-flex items-center gap-1">
                  Date
                  {getSortIcon('Date', 'device')}
                </span>
              </th>

              <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loadingTabs.device ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#2759A2]" />
                    Loading device data...
                  </div>
                </td>
              </tr>
            ) : filteredDeviceData.length > 0 ? (
              filteredDeviceData.map(
                (item, index) => (
                  <tr
                    key={item._id || index}
                    className={`border-b border-gray-100 ${
                      item.type === 'Damage'
                        ? 'bg-red-50/40'
                        : 'bg-green-50/40'
                    } hover:bg-gray-50`}
                  >
                    <td className="px-4 py-3">
                      {item.Product || 'N/A'}
                    </td>

                    <td className="px-4 py-3">
                      {item['Serial No.'] || 'N/A'}
                    </td>

                    <td className="px-4 py-3">
                      {item.Type || 'N/A'}
                    </td>

                    <td className="px-4 py-3">
                      {item.Date || 'N/A'}
                    </td>

                    <td className="px-4 py-3">
                      {item.recordType !== 'return' && (
                        <div
                          className="relative inline-block"
                          ref={(el) => {
                            dropdownRefs.current[
                              item._id
                            ] = el
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              toggleDropdown(item._id)
                            }
                            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Settings size={15} />
                            Options
                          </button>

                          {dropdownOpen[item._id] && (
                            <div className="absolute right-0 z-30 mt-1 w-36 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                              <button
                                type="button"
                                onClick={() =>
                                  handleReturn(
                                    item.usageId,
                                    item.productId,
                                    item[
                                      'Serial No.'
                                    ],
                                  )
                                }
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Repeat2
                                  size={15}
                                />
                                Return
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDevice({
                                    productId:
                                      item.productId,
                                    productName:
                                      item.Product,
                                    usageId:
                                      item.usageId,
                                    oldSerialNumber:
                                      item[
                                        'Serial No.'
                                      ],
                                  })

                                  setSerialModalVisible(
                                    true,
                                  )
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <RefreshCcw
                                  size={15}
                                />
                                Replace
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDamageReturn(
                                    item.usageId,
                                    item[
                                      'Serial No.'
                                    ],
                                  )
                                }
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={15} />
                                Damage
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ),
              )
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {deviceData.length === 0
                    ? 'No device data found'
                    : 'No matching devices found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-green-300 bg-green-100" />
          Use Product
        </span>

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-red-300 bg-red-100" />
          Damage Product
        </span>
      </div>
    </div>
  )

  const renderUsageTable = () => (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50">
            {[
              ['Date', 'Date'],
              ['Type', 'Type'],
              ['Center', 'Center'],
              ['Product', 'Product'],
              ['Old Stock', 'Old Stock'],
              ['Qty', 'Qty'],
              ['Damage Qty', 'Damage Qty'],
              ['New Stock', 'New Stock'],
            ].map(([key, label]) => (
              <th
                key={key}
                onClick={() =>
                  handleSort(key, 'usage')
                }
                className="cursor-pointer border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
              >
                <span className="inline-flex items-center gap-1">
                  {label}
                  {getSortIcon(key, 'usage')}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loadingTabs.usage ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-10 text-center text-gray-500"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#2759A2]" />
                  Loading usage data...
                </div>
              </td>
            </tr>
          ) : filteredUsageData.length > 0 ? (
            filteredUsageData.map((item, index) => (
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
                colSpan={8}
                className="px-4 py-8 text-center text-gray-500"
              >
                {usageData.length === 0
                  ? 'No usage data found'
                  : 'No matching usage records found'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

  const renderShiftingTable = () => (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th
              onClick={() =>
                handleSort(
                  'Center To',
                  'shifting',
                )
              }
              className="cursor-pointer border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
            >
              <span className="inline-flex items-center gap-1">
                Center To
                {getSortIcon(
                  'Center To',
                  'shifting',
                )}
              </span>
            </th>

            <th
              onClick={() =>
                handleSort('Date', 'shifting')
              }
              className="cursor-pointer border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
            >
              <span className="inline-flex items-center gap-1">
                Date
                {getSortIcon(
                  'Date',
                  'shifting',
                )}
              </span>
            </th>

            <th
              onClick={() =>
                handleSort('status', 'shifting')
              }
              className="cursor-pointer border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
            >
              <span className="inline-flex items-center gap-1">
                Status
                {getSortIcon(
                  'status',
                  'shifting',
                )}
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {loadingTabs.shifting ? (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-10 text-center text-gray-500"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#2759A2]" />
                  Loading shifting data...
                </div>
              </td>
            </tr>
          ) : filteredShiftingData.length > 0 ? (
            filteredShiftingData.map((item) => (
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
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-8 text-center text-gray-500"
              >
                {shiftingData.length === 0
                  ? 'No shifting data found'
                  : 'No matching shifting records found'}
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2759A2]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Error loading data: {error}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
        Building not found
      </div>
    )
  }

  const handleEdit = () => {
    navigate(`/edit-building/${id}`)
  }

  const handleBack = () => {
    navigate('/building-list')
  }

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="text-2xl font-semibold text-gray-800">
            {data.buildingName}
          </h1>

          <button
            type="button"
            onClick={handleEdit}
            className="rounded-md border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"
            title="Edit Building"
          >
            <Edit size={17} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-800">
            Building Details
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="w-40 bg-gray-50 px-5 py-3 font-medium text-gray-600">
                  Name:
                </td>
                <td className="px-5 py-3 text-gray-800">
                  {data.buildingName || 'N/A'}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <td className="w-40 bg-gray-50 px-5 py-3 font-medium text-gray-600">
                  Address:
                </td>
                <td className="px-5 py-3 text-gray-800">
                  {data.address1 || 'N/A'}
                </td>
              </tr>

              <tr>
                <td className="w-40 bg-gray-50 px-5 py-3 font-medium text-gray-600">
                  Center:
                </td>
                <td className="px-5 py-3 text-gray-800">
                  {data.center?.centerName || 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 pt-2">
          <div className="flex overflow-x-auto">
            {[
              ['device', 'Device'],
              ['usage', 'Usage'],
              ['shifting', 'Shifting'],
            ].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`border-t-4 px-5 py-3 text-sm font-medium transition ${
                  activeTab === tab
                    ? 'border-[#2759A2] bg-white text-gray-900'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4 flex justify-end items-center gap-2">
            <label
              htmlFor="profile-search"
              className="text-sm font-medium text-gray-600"
            >
              Search:
            </label>

            <div className="relative w-full max-w-[350px]">
              <Search
                size={16}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="profile-search"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="h-9 w-full border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
                placeholder="Search..."
              />
            </div>
          </div>

          {activeTab === 'device' &&
            renderDeviceTable()}

          {activeTab === 'usage' &&
            renderUsageTable()}

          {activeTab === 'shifting' &&
            renderShiftingTable()}
        </div>
      </div>

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
  )
}

export default BuildingProfile