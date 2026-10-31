import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  Edit,
  RefreshCw,
  Recycle,
  Reply,
  Settings,
} from 'lucide-react';

import axiosInstance from '../../../axiosInstance';
import {
  confirmAction,
  showError,
  showSuccess,
} from '../../../utils/sweetAlerts';

import CustomerSerialNumber from '../customer/CustomerSerialNumber';

const getObjectId = (value) =>
  value && typeof value === 'object' ? value._id || value.id || '' : value || '';

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString('en-GB');
};

const normalizeDevice = (item) => {
  const product = item?.product || {};
  const serialNumbers = Array.isArray(item?.serialNumbers)
    ? item.serialNumbers
    : [];

  return {
    ...item,
    Product: product.productTitle || item.Product || item.productName || 'N/A',
    'Serial No.': serialNumbers.length
      ? serialNumbers.map((serial) =>
          typeof serial === 'object'
            ? serial.serialNumber || serial.serialNo || serial.number || ''
            : serial
        ).filter(Boolean).join(', ')
      : item['Serial No.'] || item.serialNumber || 'N/A',
    Type: item.Type || item.type || item.recordType || 'Stock',
    Date: formatDate(item.Date || item.date || item.createdAt || item.updatedAt),
    productId: getObjectId(product) || item.productId || '',
    usageId: item.usageId || item.stockUsageId || '',
    recordType: item.recordType || item.type || '',
    availableQuantity: item.availableQuantity ?? item.totalQuantity ?? 0,
  };
};

const normalizeUsage = (record) => {
  const items = Array.isArray(record?.items) ? record.items : [];
  const date = formatDate(record?.date || record?.createdAt);
  const center =
    record?.center?.centerName ||
    record?.centerName ||
    (typeof record?.center === 'string' ? record.center : '') ||
    'N/A';

  if (!items.length) {
    return [{
      ...record,
      Date: date,
      Type: record?.usageType || record?.type || 'N/A',
      Center: center,
      Product: record?.product?.productTitle || record?.Product || 'N/A',
      'Old Stock': record?.oldStock ?? 'N/A',
      Qty: record?.quantity ?? record?.qty ?? 'N/A',
      'Damage Qty': record?.damageQuantity ?? record?.damageQty ?? 0,
      'New Stock': record?.newStock ?? 'N/A',
    }];
  }

  return items.map((item, index) => ({
    ...record,
    ...item,
    _id: `${record?._id || 'usage'}-${item?._id || index}`,
    usageId: record?._id || record?.usageId || '',
    productId: getObjectId(item?.product) || item?.productId || '',
    Date: date,
    Type: record?.usageType || record?.type || 'N/A',
    Center: center,
    Product:
      item?.product?.productTitle ||
      item?.productName ||
      record?.product?.productTitle ||
      'N/A',
    'Old Stock': item?.oldStock ?? record?.oldStock ?? 'N/A',
    Qty: item?.quantity ?? item?.qty ?? record?.quantity ?? 'N/A',
    'Damage Qty': item?.damageQuantity ?? item?.damageQty ?? record?.damageQuantity ?? 0,
    'New Stock': item?.newStock ?? record?.newStock ?? 'N/A',
  }));
};

const normalizeShifting = (item, index) => ({
  ...item,
  _id: item?._id || `shifting-${index}`,
  'Center To':
    item?.['Center To'] ||
    item?.centerTo?.centerName ||
    item?.toCenter?.centerName ||
    item?.newCenter?.centerName ||
    item?.centerToName ||
    item?.toCenterName ||
    'N/A',
  Date: formatDate(item?.Date || item?.date || item?.createdAt),
  status: item?.status || item?.requestStatus || item?.approvalStatus || 'Pending',
});

const ControlRoomProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('device');

  const [deviceData, setDeviceData] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [shiftingData, setShiftingData] =
    useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState({});

  const [serialModalVisible, setSerialModalVisible] =
    useState(false);
  const [selectedDevice, setSelectedDevice] =
    useState(null);

  const [loadingTabs, setLoadingTabs] = useState({
    device: false,
    usage: false,
    shifting: false,
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
    tab: 'device',
  });

  const dropdownRefs = useRef({});

  // --------------------------------------------------
  // Search - Device
  // --------------------------------------------------
  const filteredDeviceData = useMemo(() => {
    if (!searchTerm) return deviceData;

    return deviceData.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [deviceData, searchTerm]);

  // --------------------------------------------------
  // Search - Usage
  // --------------------------------------------------
  const filteredUsageData = useMemo(() => {
    if (!searchTerm) return usageData;

    return usageData.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [usageData, searchTerm]);

  // --------------------------------------------------
  // Search - Shifting
  // --------------------------------------------------
  const filteredShiftingData = useMemo(() => {
    if (!searchTerm) return shiftingData;

    return shiftingData.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [shiftingData, searchTerm]);

  // --------------------------------------------------
  // Fetch Control Room
  // --------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(
          `/controlRooms/${id}`
        );

        if (response.data.success) {
          setData(response.data.data);
          fetchDeviceData();
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
        console.error(
          'Error fetching data:',
          err
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // --------------------------------------------------
  // Fetch Device Data
  // --------------------------------------------------
  const fetchDeviceData = async () => {
    if (!id) return;
    try {
      setLoadingTabs((prev) => ({ ...prev, device: true }));
      const response = await axiosInstance.get(
        `/stockusage/control-room/${id}/devices`
      );
      if (response.data?.success) {
        const rows = Array.isArray(response.data.data) ? response.data.data : [];
        setDeviceData(rows.map(normalizeDevice));
      } else {
        setDeviceData([]);
      }
    } catch (err) {
      console.error('Error fetching control-room device data:', err);
      setDeviceData([]);
    } finally {
      setLoadingTabs((prev) => ({ ...prev, device: false }));
    }
  };

  // --------------------------------------------------
  // Fetch Usage Data
  // --------------------------------------------------
  const fetchUsageData = async () => {
    if (!id) return;
    try {
      setLoadingTabs((prev) => ({ ...prev, usage: true }));
      const response = await axiosInstance.get(
        `/stockusage/control-room/${id}`
      );
      if (response.data?.success) {
        const records = Array.isArray(response.data.data) ? response.data.data : [];
        setUsageData(records.flatMap(normalizeUsage));
      } else {
        setUsageData([]);
      }
    } catch (err) {
      console.error('Error fetching control-room usage data:', err);
      setUsageData([]);
    } finally {
      setLoadingTabs((prev) => ({ ...prev, usage: false }));
    }
  };

  // --------------------------------------------------
  // Fetch Shifting Data
  // --------------------------------------------------
  const fetchShiftingData = async () => {
    if (!id) return;
    try {
      setLoadingTabs((prev) => ({ ...prev, shifting: true }));
      const response = await axiosInstance.get(
        `/shiftingRequest/controlRooms/${id}/requests`
      );
      if (response.data?.success) {
        const records = Array.isArray(response.data.data) ? response.data.data : [];
        setShiftingData(records.map(normalizeShifting));
      } else {
        setShiftingData([]);
      }
    } catch (err) {
      console.error('Error fetching control-room shifting data:', err);
      setShiftingData([]);
    } finally {
      setLoadingTabs((prev) => ({ ...prev, shifting: false }));
    }
  };

  // --------------------------------------------------
  // Tab Change
  // --------------------------------------------------
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');

    switch (tab) {
      case 'device':
        if (deviceData.length === 0) {
          fetchDeviceData();
        }
        break;

      case 'usage':
        if (usageData.length === 0) {
          fetchUsageData();
        }
        break;

      case 'shifting':
        if (shiftingData.length === 0) {
          fetchShiftingData();
        }
        break;

      default:
        break;
    }
  };

  // --------------------------------------------------
  // Sorting
  // --------------------------------------------------
  const handleSort = (key, tab) => {
    let direction = 'ascending';

    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending' &&
      sortConfig.tab === tab
    ) {
      direction = 'descending';
    }

    setSortConfig({
      key,
      direction,
      tab,
    });

    let dataToSort = [];
    let setDataFunction = null;

    switch (tab) {
      case 'device':
        dataToSort = [...deviceData];
        setDataFunction = setDeviceData;
        break;

      case 'usage':
        dataToSort = [...usageData];
        setDataFunction = setUsageData;
        break;

      case 'shifting':
        dataToSort = [...shiftingData];
        setDataFunction = setShiftingData;
        break;

      default:
        return;
    }

    const sortedData = dataToSort.sort((a, b) => {
      let aValue = a;
      let bValue = b;

      if (key.includes(' ')) {
        aValue = a[key];
        bValue = b[key];
      } else if (key.includes('.')) {
        const keys = key.split('.');

        aValue = keys.reduce(
          (obj, k) => obj?.[k],
          a
        );

        bValue = keys.reduce(
          (obj, k) => obj?.[k],
          b
        );
      } else {
        aValue = a[key];
        bValue = b[key];
      }

      if (
        aValue === null ||
        aValue === undefined
      ) {
        aValue = '';
      }

      if (
        bValue === null ||
        bValue === undefined
      ) {
        bValue = '';
      }

      if (
        typeof aValue === 'string' &&
        typeof bValue === 'string'
      ) {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return direction === 'ascending'
          ? -1
          : 1;
      }

      if (aValue > bValue) {
        return direction === 'ascending'
          ? 1
          : -1;
      }

      return 0;
    });

    setDataFunction(sortedData);
  };

  const getSortIcon = (key, tab) => {
    if (
      sortConfig.key !== key ||
      sortConfig.tab !== tab
    ) {
      return null;
    }

    return sortConfig.direction ===
      'ascending' ? (
      <ArrowUp size={14} className="ml-1" />
    ) : (
      <ArrowDown
        size={14}
        className="ml-1"
      />
    );
  };

  // --------------------------------------------------
  // Status Badge
  // --------------------------------------------------
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
    };

    return (
      <span
        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
          statusConfig[status] ||
          'border-gray-200 bg-gray-100 text-gray-700'
        }`}
      >
        {status}
      </span>
    );
  };

  // --------------------------------------------------
  // Dropdown
  // --------------------------------------------------
  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // --------------------------------------------------
  // Close Dropdown Outside
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {};
      let shouldUpdate = false;

      Object.keys(dropdownRefs.current).forEach(
        (key) => {
          const element =
            dropdownRefs.current[key];

          if (
            element &&
            !element.contains(event.target)
          ) {
            newDropdownState[key] = false;
            shouldUpdate = true;
          }
        }
      );

      if (shouldUpdate) {
        setDropdownOpen((prev) => ({
          ...prev,
          ...newDropdownState,
        }));
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // --------------------------------------------------
  // Damage Return
  // --------------------------------------------------
  const handleDamageReturn = async (
    usageId,
    serialNumber
  ) => {
    try {
      const html = `Are you sure you want to mark serial number <strong>${serialNumber}</strong> as Damage?<br><br>`;

      const result = await confirmAction(
        'Are you sure to damage?',
        html,
        'warning',
        'Yes,Damage it!'
      );

      if (result.isConfirmed) {
        const response =
          await axiosInstance.post(
            '/damage/damage-returns',
            {
              usageId,
              serialNumber,
              remark:
                'Product marked as damaged - returned from control room',
            }
          );

        if (response.data.success) {
          showSuccess(
            `Serial number ${serialNumber} has been marked as Damage Return successfully`
          );

          fetchDeviceData();
        } else {
          throw new Error(
            response.data.message ||
              'Failed to mark as Damage Return'
          );
        }
      }
    } catch (error) {
      console.error(
        'Error in damage return:',
        error
      );
      showError(error);
    }
  };

  // --------------------------------------------------
  // Return Device
  // --------------------------------------------------
  const handleReturn = async (
    usageId,
    productId,
    serialNumber
  ) => {
    try {
      const html = `Are you sure you want to return serial number <strong>${serialNumber}</strong>?<br><br>`;

      const result = await confirmAction(
        'Confirm Return',
        html,
        'question',
        'Yes, Return it!'
      );

      if (result.isConfirmed) {
        const response =
          await axiosInstance.post(
            '/stockusage/return/product',
            {
              usageId,
              productId,
              serialNumber,
            }
          );

        if (response.data.success) {
          showSuccess(
            `Serial number ${serialNumber} has been returned successfully`
          );

          fetchDeviceData();
        } else {
          throw new Error(
            response.data.message ||
              'Failed to return device'
          );
        }
      }
    } catch (error) {
      console.error(
        'Error in return:',
        error
      );
      showError(error);
    }
  };

  // --------------------------------------------------
  // Device Table
  // --------------------------------------------------
  const renderDeviceTable = () => (
    <div>
      <div className="w-full overflow-hidden rounded-[2px] border border-[#e1e4e8]">
        <div className="max-h-[430px] overflow-y-auto overflow-x-hidden">
        <table className="w-full table-fixed border-collapse text-[14px]">
          <colgroup>
            <col className="w-[25%]" />
            <col className="w-[22%]" />
            <col className="w-[17%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
          </colgroup>
          <thead className="sticky top-0 z-20">
            <tr className="bg-[#f8f9fa]">
              <th
                onClick={() =>
                  handleSort('Product', 'device')
                }
                className="cursor-pointer border-b border-r border-[#e1e4e8] bg-[#f8f9fa] px-3 py-3 text-left text-[14px] font-bold tracking-wide text-[#151515] transition hover:bg-[#eef3f9] select-none"
              >
                <div className="flex items-center">
                  Product
                  {getSortIcon(
                    'Product',
                    'device'
                  )}
                </div>
              </th>

              <th
                onClick={() =>
                  handleSort(
                    'Serial No.',
                    'device'
                  )
                }
                className="cursor-pointer border-b border-r border-[#e1e4e8] bg-[#f8f9fa] px-3 py-3 text-left text-[14px] font-bold tracking-wide text-[#151515] transition hover:bg-[#eef3f9] select-none"
              >
                <div className="flex items-center">
                  Serial No
                  {getSortIcon(
                    'Serial No.',
                    'device'
                  )}
                </div>
              </th>

              <th
                onClick={() =>
                  handleSort('Type', 'device')
                }
                className="cursor-pointer border-b border-r border-[#e1e4e8] bg-[#f8f9fa] px-3 py-3 text-left text-[14px] font-bold tracking-wide text-[#151515] transition hover:bg-[#eef3f9] select-none"
              >
                <div className="flex items-center">
                  Type
                  {getSortIcon(
                    'Type',
                    'device'
                  )}
                </div>
              </th>

              <th
                onClick={() =>
                  handleSort('Date', 'device')
                }
                className="cursor-pointer border-b border-r border-[#e1e4e8] bg-[#f8f9fa] px-3 py-3 text-left text-[14px] font-bold tracking-wide text-[#151515] transition hover:bg-[#eef3f9] select-none"
              >
                <div className="flex items-center">
                  Date
                  {getSortIcon(
                    'Date',
                    'device'
                  )}
                </div>
              </th>

              <th className="border-b border-[#e1e4e8] bg-[#f8f9fa] px-3 py-3 text-left text-[14px] font-bold tracking-wide text-[#151515]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loadingTabs.device ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-[14px] text-[#6b7280]"
                >
                  <div className="flex items-center justify-center gap-2 text-[#6b7280]">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2759A2] border-t-transparent" />
                    Loading device data...
                  </div>
                </td>
              </tr>
            ) : filteredDeviceData.length >
              0 ? (
              filteredDeviceData.map(
                (item, index) => {
                  const rowType =
                    item.type || item.Type;

                  return (
                    <tr
                      key={
                        item._id || index
                      }
                      className={
                        rowType === 'Damage'
                          ? 'bg-red-50 hover:bg-red-100'
                          : 'bg-green-50 hover:bg-green-100'
                      }
                    >
                      <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle text-[14px] leading-[20px] text-[#151515]">
                        {item.Product || 'N/A'}
                      </td>

                      <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle text-[14px] leading-[20px] text-[#151515]">
                        {item[
                          'Serial No.'
                        ] || 'N/A'}
                      </td>

                      <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle text-[14px] leading-[20px] text-[#151515]">
                        {item.Type || 'N/A'}
                      </td>

                      <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle text-[14px] leading-[20px] text-[#151515]">
                        {item.Date || 'N/A'}
                      </td>

                      <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle">
                        {item.recordType !== 'return' && item.usageId && item.productId && item['Serial No.'] !== 'N/A' && (
                          <div
                            className="relative inline-block"
                            ref={(element) => {
                              dropdownRefs.current[
                                item._id
                              ] = element;
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleDropdown(
                                  item._id
                                )
                              }
                              className="inline-flex h-[34px] items-center gap-1.5 rounded-[4px] border border-[#c8cdd3] bg-white px-2.5 text-[14px] font-medium text-[#3f4650] transition hover:bg-[#f4f5f6] focus:outline-none focus:ring-1 focus:ring-[#2759A2]"
                            >
                              <Settings
                                size={15}
                              />
                              Options
                              <ChevronDown
                                size={14}
                              />
                            </button>

                            {dropdownOpen[
                              item._id
                            ] && (
                              <div className="absolute right-0 z-50 mt-1 w-[150px] overflow-hidden rounded-[4px] border border-[#dfe3e8] bg-white py-1 shadow-[0_5px_16px_rgba(0,0,0,0.15)]">
                                {/* Return */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleReturn(
                                      item.usageId,
                                      item.productId,
                                      item[
                                        'Serial No.'
                                      ]
                                    )
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[14px] text-[#343a40] transition hover:bg-[#f1f5f9]"
                                >
                                  <Reply
                                    size={15}
                                  />
                                  Return
                                </button>

                                {/* Replace */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedDevice(
                                      {
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
                                      }
                                    );

                                    setSerialModalVisible(
                                      true
                                    );
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[14px] text-[#343a40] transition hover:bg-[#f1f5f9]"
                                >
                                  <RefreshCw
                                    size={15}
                                  />
                                  Replace
                                </button>

                                {/* Damage */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDamageReturn(
                                      item.usageId,
                                      item[
                                        'Serial No.'
                                      ]
                                    )
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[14px] text-[#dc3545] transition hover:bg-[#fff1f2]"
                                >
                                  <Recycle
                                    size={15}
                                  />
                                  Damage
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-[14px] text-[#6b7280]"
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
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-[14px] text-[#495057]">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#dff0d8]" />
          Use Product
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#f4dede]" />
          Damage Product
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------
  // Usage Table
  // --------------------------------------------------
  const renderUsageTable = () => (
    <div className="w-full overflow-hidden rounded-[2px] border border-[#e1e4e8]">
      <div className="max-h-[430px] overflow-y-auto overflow-x-hidden">
      <table className="w-full table-fixed border-collapse text-[14px]">
        <colgroup>
          <col className="w-[12%]" />
          <col className="w-[11%]" />
          <col className="w-[14%]" />
          <col className="w-[23%]" />
          <col className="w-[10%]" />
          <col className="w-[9%]" />
          <col className="w-[10%]" />
          <col className="w-[11%]" />
        </colgroup>
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
            ].map(([label, key]) => (
              <th
                key={key}
                onClick={() =>
                  handleSort(key, 'usage')
                }
                className="cursor-pointer border-b border-r border-[#e1e4e8] bg-[#f8f9fa] px-3 py-3 text-left text-[14px] font-bold tracking-wide text-[#151515] transition hover:bg-[#eef3f9] select-none"
              >
                <div className="flex items-center">
                  {label}
                  {getSortIcon(
                    key,
                    'usage'
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loadingTabs.usage ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-10 text-center text-[14px] text-[#6b7280]"
              >
                <div className="flex items-center justify-center gap-2 text-[#6b7280]">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2759A2] border-t-transparent" />
                  Loading usage data...
                </div>
              </td>
            </tr>
          ) : filteredUsageData.length >
            0 ? (
            filteredUsageData.map(
              (item, index) => (
                <tr
                  key={
                    item._id || index
                  }
                  className="transition-colors hover:bg-[#f5f7fa]"
                >
                  <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle">
                    {item.Date || 'N/A'}
                  </td>

                  <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle">
                    {item.Type || 'N/A'}
                  </td>

                  <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle">
                    {item.Center || 'N/A'}
                  </td>

                  <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle">
                    {item.Product || 'N/A'}
                  </td>

                  <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle">
                    {item['Old Stock'] ?? 'N/A'}
                  </td>

                  <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle">
                    {item.Qty ?? 'N/A'}
                  </td>

                  <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle">
                    {item['Damage Qty'] ||
                      0}
                  </td>

                  <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle">
                    {item['New Stock'] ?? 'N/A'}
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-10 text-center text-[14px] text-[#6b7280]"
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
    </div>
  );

  // --------------------------------------------------
  // Shifting Table
  // --------------------------------------------------
  const renderShiftingTable = () => (
    <div className="w-full overflow-hidden rounded-[2px] border border-[#e1e4e8]">
      <div className="max-h-[430px] overflow-y-auto overflow-x-hidden">
      <table className="w-full table-fixed border-collapse text-[14px]">
        <thead>
          <tr className="bg-gray-50">
            <th
              onClick={() =>
                handleSort(
                  'Center To',
                  'shifting'
                )
              }
              className="cursor-pointer border-b border-r border-[#e1e4e8] bg-[#f8f9fa] px-3 py-3 text-left text-[14px] font-bold tracking-wide text-[#151515] transition hover:bg-[#eef3f9] select-none"
            >
              <div className="flex items-center">
                Center To
                {getSortIcon(
                  'Center To',
                  'shifting'
                )}
              </div>
            </th>

            <th
              onClick={() =>
                handleSort(
                  'Date',
                  'shifting'
                )
              }
              className="cursor-pointer border-b border-r border-[#e1e4e8] bg-[#f8f9fa] px-3 py-3 text-left text-[14px] font-bold tracking-wide text-[#151515] transition hover:bg-[#eef3f9] select-none"
            >
              <div className="flex items-center">
                Date
                {getSortIcon(
                  'Date',
                  'shifting'
                )}
              </div>
            </th>

            <th
              onClick={() =>
                handleSort(
                  'status',
                  'shifting'
                )
              }
              className="cursor-pointer border-b border-r border-[#e1e4e8] bg-[#f8f9fa] px-3 py-3 text-left text-[14px] font-bold tracking-wide text-[#151515] transition hover:bg-[#eef3f9] select-none"
            >
              <div className="flex items-center">
                Status
                {getSortIcon(
                  'status',
                  'shifting'
                )}
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {loadingTabs.shifting ? (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-10 text-center text-[14px] text-[#6b7280]"
              >
                <div className="flex items-center justify-center gap-2 text-[#6b7280]">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2759A2] border-t-transparent" />
                  Loading shifting data...
                </div>
              </td>
            </tr>
          ) : filteredShiftingData.length >
            0 ? (
            filteredShiftingData.map(
              (item) => (
                <tr
                  key={item._id}
                  className="transition-colors hover:bg-[#f5f7fa]"
                >
                  <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle">
                    {item['Center To'] ||
                      'N/A'}
                  </td>

                  <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle">
                    {item.Date || 'N/A'}
                  </td>

                  <td className="border-b border-[#e5e7eb] px-3 py-[9px] align-middle">
                    {getStatusBadge(
                      item.status
                    )}
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-10 text-center text-[14px] text-[#6b7280]"
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
    </div>
  );

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div
        className="mx-4 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        Error loading data: {error}
      </div>
    );
  }

  // --------------------------------------------------
  // No Data
  // --------------------------------------------------
  if (!data) {
    return (
      <div
        className="mx-4 mt-4 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700"
        role="alert"
      >
        Control Room not found
      </div>
    );
  }

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------
  const handleEdit = () => {
    navigate(`/edit-controlRoom/${id}`);
  };

  // --------------------------------------------------
  // Back
  // --------------------------------------------------
  const handleBack = () => {
    navigate('/controlRoom-list');
  };

  return (
    <div className="min-h-full w-full bg-[#f4f5f7] px-4 py-4 md:px-5">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-[36px] items-center gap-1.5 rounded-[4px] bg-[#2759A2] px-3 text-[14px] font-medium text-white transition hover:bg-[#214d8d] focus:outline-none focus:ring-2 focus:ring-[#2759A2]/30"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <h1 className="text-[24px] font-[450] leading-tight text-[#212529]">
            {data.buildingName}
          </h1>

          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-[4px] border border-[#d1d6dc] bg-white text-[#3f95c9] transition hover:border-[#2759A2] hover:bg-[#f1f5f9] hover:text-[#2759A2] focus:outline-none"
            title="Edit"
          >
            <Edit size={19} />
          </button>
        </div>

        {/* Control Room Details */}
        <div className="overflow-hidden rounded-[2px] border border-[#dfe3e8] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <div className="h-[4px] w-full bg-[#2759A2]" />

          <div className="px-3 py-3 text-[18px] font-semibold text-[#343a40] md:px-3">
            Control Room Details
          </div>

          <div className="px-4 pb-4 md:px-8">
            <div className="overflow-hidden border border-[#e5e7eb]">
              <table className="w-full border-collapse text-[14px]">
                <tbody>
                  <tr className="border-b border-[#e5e7eb]">
                    <td className="w-[24%] bg-[#f8f9fa] px-3 py-2 text-[14px] font-semibold text-[#343a40]">
                      Name:
                    </td>
                    <td className="px-3 py-2 text-[14px] text-[#343a40]">
                      {data.buildingName || 'N/A'}
                    </td>
                  </tr>

                  <tr className="border-b border-[#e5e7eb]">
                    <td className="w-[24%] bg-[#f8f9fa] px-3 py-2 text-[14px] font-semibold text-[#343a40]">
                      Address:
                    </td>
                    <td className="px-3 py-2 text-[14px] text-[#343a40]">
                      {data.address1 || 'N/A'}
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[24%] bg-[#f8f9fa] px-3 py-2 text-[14px] font-semibold text-[#343a40]">
                      Center:
                    </td>
                    <td className="px-3 py-2 text-[14px] text-[#343a40]">
                      {data.center?.centerName || 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tabs Card */}
        <div className="mt-5 overflow-hidden rounded-[2px] border border-[#dfe3e8] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <div className="h-[4px] w-full bg-[#2759A2]" />

          <div className="px-4 pb-5 pt-0 md:px-4">
            {/* Tabs */}
            <div className="flex border-b border-[#dfe3e8]">
              {[
                {
                  key: 'device',
                  label: 'Device',
                },
                {
                  key: 'usage',
                  label: 'Usage',
                },
                {
                  key: 'shifting',
                  label: 'Shifting',
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`relative px-5 py-3 text-[14px] font-medium transition ${
                    activeTab === tab.key
                      ? 'text-[#151515]'
                      : 'text-[#343a40] hover:text-[#151515]'
                  }`}
                >
                  {activeTab === tab.key && (
                    <span className="absolute left-0 right-0 top-0 h-[4px] rounded-t-[3px] bg-[#2759A2]" />
                  )}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="mb-4 mt-4 flex items-center justify-end gap-2">
              <label
                htmlFor="control-room-profile-search"
                className="text-[14px] font-bold text-[#343a40]"
              >
                Search:
              </label>

              <input
                id="control-room-profile-search"
                type="text"
                placeholder="Search current tab..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-[34px] w-full max-w-[240px] rounded-[2px] border border-[#d5dae0] bg-white px-2.5 text-[14px] text-[#212529] outline-none transition focus:border-[#2759A2] focus:ring-1 focus:ring-[#2759A2]"
              />
            </div>

            {/* Active Tab */}
            {activeTab === 'device' && renderDeviceTable()}

            {activeTab === 'usage' && renderUsageTable()}

            {activeTab === 'shifting' && renderShiftingTable()}
          </div>
        </div>

        {/* Replace Serial Modal */}
        <CustomerSerialNumber
          visible={serialModalVisible}
          onClose={() => {
            setSerialModalVisible(false);
            setSelectedDevice(null);
          }}
          productId={selectedDevice?.productId}
          productName={selectedDevice?.productName}
          usageId={selectedDevice?.usageId}
          oldSerialNumber={selectedDevice?.oldSerialNumber}
          onReplaceSuccess={fetchDeviceData}
        />
      </div>
    </div>
  );
};

export default ControlRoomProfile;