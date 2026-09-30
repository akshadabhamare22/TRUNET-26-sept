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
    try {
      setLoadingTabs((prev) => ({
        ...prev,
        device: true,
      }));

      const response =
        await axiosInstance.get(
          `/stockusage/control-room/${id}/devices`
        );

      if (response.data.success) {
        setDeviceData(response.data.data || []);
      }
    } catch (err) {
      console.error(
        'Error fetching device data:',
        err
      );
      setDeviceData([]);
    } finally {
      setLoadingTabs((prev) => ({
        ...prev,
        device: false,
      }));
    }
  };

  // --------------------------------------------------
  // Fetch Usage Data
  // --------------------------------------------------
  const fetchUsageData = async () => {
    try {
      setLoadingTabs((prev) => ({
        ...prev,
        usage: true,
      }));

      const response =
        await axiosInstance.get(
          `/stockusage/control-room/${id}`
        );

      if (response.data.success) {
        setUsageData(response.data.data || []);
      }
    } catch (err) {
      console.error(
        'Error fetching usage data:',
        err
      );
      setUsageData([]);
    } finally {
      setLoadingTabs((prev) => ({
        ...prev,
        usage: false,
      }));
    }
  };

  // --------------------------------------------------
  // Fetch Shifting Data
  // --------------------------------------------------
  const fetchShiftingData = async () => {
    try {
      setLoadingTabs((prev) => ({
        ...prev,
        shifting: true,
      }));

      const response =
        await axiosInstance.get(
          `/shiftingRequest/controlRooms/${id}/requests`
        );

      if (response.data.success) {
        setShiftingData(
          response.data.data || []
        );
      }
    } catch (err) {
      console.error(
        'Error fetching shifting data:',
        err
      );
      setShiftingData([]);
    } finally {
      setLoadingTabs((prev) => ({
        ...prev,
        shifting: false,
      }));
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
        dataToSort = [...filteredDeviceData];
        setDataFunction = setDeviceData;
        break;

      case 'usage':
        dataToSort = [...filteredUsageData];
        setDataFunction = setUsageData;
        break;

      case 'shifting':
        dataToSort = [
          ...filteredShiftingData,
        ];
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
      <div className="w-full overflow-x-auto">
        <table className="min-w-[750px] w-full border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th
                onClick={() =>
                  handleSort('Product', 'device')
                }
                className="cursor-pointer border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
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
                className="cursor-pointer border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
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
                className="cursor-pointer border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
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
                className="cursor-pointer border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Date
                  {getSortIcon(
                    'Date',
                    'device'
                  )}
                </div>
              </th>

              <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loadingTabs.device ? (
              <tr>
                <td
                  colSpan={5}
                  className="border border-gray-200 px-4 py-8 text-center text-gray-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
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
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {item.Product || 'N/A'}
                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {item[
                          'Serial No.'
                        ] || 'N/A'}
                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {item.Type || 'N/A'}
                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {item.Date || 'N/A'}
                      </td>

                      <td className="border border-gray-200 px-4 py-3">
                        {item.recordType !==
                          'return' && (
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
                              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
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
                              <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
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
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
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
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
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
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
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
                  className="border border-gray-200 px-4 py-8 text-center text-gray-500"
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

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-green-200" />
          Use Product
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-red-200" />
          Damage Product
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------
  // Usage Table
  // --------------------------------------------------
  const renderUsageTable = () => (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[1000px] w-full border-collapse border border-gray-200 text-sm">
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
                className="cursor-pointer border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
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
                className="border border-gray-200 px-4 py-8 text-center text-gray-500"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
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
                  className="hover:bg-gray-50"
                >
                  <td className="border border-gray-200 px-4 py-3">
                    {item.Date || 'N/A'}
                  </td>

                  <td className="border border-gray-200 px-4 py-3">
                    {item.Type || 'N/A'}
                  </td>

                  <td className="border border-gray-200 px-4 py-3">
                    {item.Center || 'N/A'}
                  </td>

                  <td className="border border-gray-200 px-4 py-3">
                    {item.Product || 'N/A'}
                  </td>

                  <td className="border border-gray-200 px-4 py-3">
                    {item['Old Stock'] ||
                      'N/A'}
                  </td>

                  <td className="border border-gray-200 px-4 py-3">
                    {item.Qty || 'N/A'}
                  </td>

                  <td className="border border-gray-200 px-4 py-3">
                    {item['Damage Qty'] ||
                      0}
                  </td>

                  <td className="border border-gray-200 px-4 py-3">
                    {item['New Stock'] ||
                      'N/A'}
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td
                colSpan={8}
                className="border border-gray-200 px-4 py-8 text-center text-gray-500"
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
  );

  // --------------------------------------------------
  // Shifting Table
  // --------------------------------------------------
  const renderShiftingTable = () => (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[650px] w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th
              onClick={() =>
                handleSort(
                  'Center To',
                  'shifting'
                )
              }
              className="cursor-pointer border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
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
              className="cursor-pointer border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
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
              className="cursor-pointer border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100"
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
                className="border border-gray-200 px-4 py-8 text-center text-gray-500"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
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
                  className="hover:bg-gray-50"
                >
                  <td className="border border-gray-200 px-4 py-3">
                    {item['Center To'] ||
                      'N/A'}
                  </td>

                  <td className="border border-gray-200 px-4 py-3">
                    {item.Date || 'N/A'}
                  </td>

                  <td className="border border-gray-200 px-4 py-3">
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
                className="border border-gray-200 px-4 py-8 text-center text-gray-500"
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
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="text-xl font-semibold text-gray-800">
            {data.buildingName}
          </h1>

          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Edit"
          >
            <Edit size={16} />
          </button>
        </div>
      </div>

      {/* Control Room Details */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4 text-base font-semibold text-gray-800">
          Control Room Details
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="w-40 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700">
                  Name:
                </td>

                <td className="px-5 py-3 text-sm text-gray-700">
                  {data.buildingName ||
                    'N/A'}
                </td>
              </tr>

              <tr className="border-b border-gray-200">
                <td className="w-40 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700">
                  Address:
                </td>

                <td className="px-5 py-3 text-sm text-gray-700">
                  {data.address1 ||
                    'N/A'}
                </td>
              </tr>

              <tr>
                <td className="w-40 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700">
                  Center:
                </td>

                <td className="px-5 py-3 text-sm text-gray-700">
                  {data.center
                    ?.centerName ||
                    'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabs Card */}
      <div className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-5">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
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
                onClick={() =>
                  handleTabChange(tab.key)
                }
                className={`relative px-5 py-3 text-sm font-medium transition ${
                  activeTab === tab.key
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {activeTab === tab.key && (
                  <span className="absolute left-0 right-0 top-0 h-1 rounded-t bg-blue-600" />
                )}

                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mb-4 mt-5 flex justify-end">
            <div className="flex items-center gap-2">
              <label
                htmlFor="control-room-profile-search"
                className="text-sm font-medium text-gray-700"
              >
                Search:
              </label>

              <input
                id="control-room-profile-search"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                className="h-8 w-full max-w-[350px] border border-gray-300 bg-white px-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Active Tab */}
          {activeTab === 'device' &&
            renderDeviceTable()}

          {activeTab === 'usage' &&
            renderUsageTable()}

          {activeTab === 'shifting' &&
            renderShiftingTable()}
        </div>
      </div>

      {/* Replace Serial Modal */}
      <CustomerSerialNumber
        visible={serialModalVisible}
        onClose={() => {
          setSerialModalVisible(false);
          setSelectedDevice(null);
        }}
        productId={
          selectedDevice?.productId
        }
        productName={
          selectedDevice?.productName
        }
        usageId={
          selectedDevice?.usageId
        }
        oldSerialNumber={
          selectedDevice?.oldSerialNumber
        }
        onReplaceSuccess={fetchDeviceData}
      />
    </div>
  );
};

export default ControlRoomProfile;