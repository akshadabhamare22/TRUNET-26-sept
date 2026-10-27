// import React, { useEffect, useState } from 'react';
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   FileSpreadsheet,
//   RotateCcw,
//   Search,
//   X,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// import axiosInstance from '../../axiosInstance';
// import Pagination from '../../utils/Pagination';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import IndentUsageSummarySearch from './IndentUsageSummarySearch';

// const INITIAL_SEARCH = {
//   centerId: '',
//   productId: '',
//   resellerId: '',
//   month: '',
//   startDate: '',
//   endDate: '',
// };

// const IndentUsageSummary = () => {
//   const [data, setData] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [filters, setFilters] = useState(null);

//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [resellers, setResellers] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [exportLoading, setExportLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   });

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);

//   const [exportModalVisible, setExportModalVisible] = useState(false);
//   const [exportMonth, setExportMonth] = useState('');

//   const [activeSearch, setActiveSearch] = useState(INITIAL_SEARCH);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const navigate = useNavigate();

//   // ------------------------------------------------------------
//   // Helpers
//   // ------------------------------------------------------------

//   const cleanParamValue = (value) => {
//     if (!value) return value;

//     const prefixes = [
//       'center_',
//       'product_',
//       'reseller_',
//       'outlet_',
//       'warehouse_',
//     ];

//     let cleaned = value;

//     for (const prefix of prefixes) {
//       if (cleaned.startsWith(prefix)) {
//         cleaned = cleaned.replace(prefix, '');
//       }
//     }

//     return cleaned;
//   };

//   const getProductName = (productId) => {
//     if (!productId) return '';

//     const cleaned = cleanParamValue(productId);

//     if (/^[0-9a-fA-F]{24}$/.test(cleaned)) {
//       const product = products.find((item) => item._id === cleaned);
//       return product ? product.productTitle : cleaned;
//     }

//     return cleaned;
//   };

//   const getCenterName = (centerId) => {
//     if (!centerId) return '';

//     const cleaned = cleanParamValue(centerId);

//     if (/^[0-9a-fA-F]{24}$/.test(cleaned)) {
//       const center = centers.find((item) => item._id === cleaned);
//       return center ? center.centerName : cleaned;
//     }

//     return cleaned;
//   };

//   const splitMonthYear = (monthValue) => {
//     if (!monthValue || !monthValue.includes('-')) {
//       return {
//         month: '',
//         year: '',
//       };
//     }

//     const [year, month] = monthValue.split('-');

//     return {
//       month,
//       year,
//     };
//   };

//   // ------------------------------------------------------------
//   // API
//   // ------------------------------------------------------------

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();

//       if (searchParams.centerId) {
//         params.append(
//           'centerId',
//           cleanParamValue(searchParams.centerId)
//         );
//       }

//       if (searchParams.productId) {
//         params.append(
//           'productId',
//           cleanParamValue(searchParams.productId)
//         );
//       }

//       if (searchParams.resellerId) {
//         params.append(
//           'reseller',
//           cleanParamValue(searchParams.resellerId)
//         );
//       }

//       if (searchParams.startDate && searchParams.endDate) {
//         params.append('startDate', searchParams.startDate);
//         params.append('endDate', searchParams.endDate);
//       } else if (searchParams.month) {
//         const [year, month] = searchParams.month.split('-');

//         params.append('month', month);
//         params.append('year', year);
//       }

//       params.append('page', page);

//       const url = params.toString()
//         ? `/reports/indent-usage-summary?${params.toString()}`
//         : '/reports/indent-usage-summary';

//       console.log('Fetching Usage Summary URL:', url);

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         // Normalize the API response and merge duplicate
//         // Center + Product rows into a single report row.
//         const numericFields = [
//           'purchase',
//           'transferReceive',
//           'return',
//           'usage',
//           'transferGiven',
//           'nc',
//           'convert',
//           'shifting',
//           'buildingUsage',
//           'buildingDamage',
//           'other',
//           'repair',
//           'damage',
//           'distributed',
//           'replaceReturn',
//           'replaceDamage',
//           'stolenCenter',
//           'stolenField',
//         ];

//         const groupedMap = new Map();

//         (response.data.data || []).forEach((item) => {
//           const center = item.center || {};

//           const centerId =
//             center.id ||
//             center._id ||
//             item.centerId ||
//             '';

//           const productId =
//             item.productId ||
//             item.product?._id ||
//             '';

//           const productName =
//             item.productName ||
//             item.product?.productTitle ||
//             'Unknown Product';

//           const centerKey = String(
//             centerId ||
//               center.name ||
//               center.centerName ||
//               ''
//           )
//             .trim()
//             .toLowerCase();

//           const productKey = String(
//             productId || productName
//           )
//             .trim()
//             .toLowerCase();

//           const groupKey = `${centerKey}__${productKey}`;

//           if (!groupedMap.has(groupKey)) {
//             groupedMap.set(groupKey, {
//               _id:
//                 productId ||
//                 `${centerKey}-${productKey}`,

//               center: {
//                 id: centerId,
//                 name:
//                   center.name ||
//                   center.centerName ||
//                   '',
//                 code:
//                   center.code ||
//                   center.centerCode ||
//                   '',
//                 _id: centerId,
//               },

//               productId,
//               productName,

//               // Stock position: keep the first opening value.
//               opening: Number(item.opening || 0),

//               purchase: 0,
//               transferReceive: 0,
//               return: 0,
//               usage: 0,
//               transferGiven: 0,
//               nc: 0,
//               convert: 0,
//               shifting: 0,
//               buildingUsage: 0,
//               buildingDamage: 0,
//               other: 0,
//               repair: 0,
//               damage: 0,
//               distributed: 0,
//               replaceReturn: 0,
//               replaceDamage: 0,
//               stolenCenter: 0,
//               stolenField: 0,

//               closing: Number(item.closing || 0),
//             });
//           }

//           const existing = groupedMap.get(groupKey);

//           numericFields.forEach((field) => {
//             existing[field] += Number(item[field] || 0);
//           });

//           // If the first row has no opening but a later row does,
//           // use the available non-zero opening.
//           if (
//             Number(existing.opening || 0) === 0 &&
//             Number(item.opening || 0) !== 0
//           ) {
//             existing.opening = Number(item.opening);
//           }

//           // Keep the latest closing value supplied by the API.
//           if (
//             item.closing !== undefined &&
//             item.closing !== null
//           ) {
//             existing.closing = Number(item.closing || 0);
//           }
//         });

//         const transformedData = Array.from(
//           groupedMap.values()
//         );

//         setData(transformedData);
//         setSummary(response.data.summary || null);
//         setFilters(
//           response.data.filters ||
//             response.data.appliedFilters ||
//             null
//         );

//         setCurrentPage(
//           response.data.pagination?.currentPage || 1
//         );

//         setTotalPages(
//           response.data.pagination?.totalPages || 1
//         );
//       } else {
//         const errorMessage =
//           response.data.message ||
//           'API returned unsuccessful response';

//         setError(errorMessage);
//         console.error('Backend error:', response.data);
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get('/centers');

//       if (response.data.success) {
//         setCenters(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all');

//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers');

//       if (response.data.success) {
//         setResellers(response.data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching resellers:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//     fetchProducts();
//     fetchResellers();
//   }, []);

//   // ------------------------------------------------------------
//   // Pagination
//   // ------------------------------------------------------------

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;

//     fetchData(activeSearch, page);
//   };

//   // ------------------------------------------------------------
//   // Totals
//   // ------------------------------------------------------------

//   const calculateTotals = () => {
//     const totals = {
//       opening: 0,
//       purchase: 0,
//       transferReceive: 0,
//       return: 0,
//       usage: 0,
//       transferGiven: 0,
//       nc: 0,
//       convert: 0,
//       shifting: 0,
//       buildingUsage: 0,
//       buildingDamage: 0,
//       other: 0,
//       repair: 0,
//       damage: 0,
//       closing: 0,
//       distributed: 0,
//       replaceReturn: 0,
//       replaceDamage: 0,
//       stolenCenter: 0,
//       stolenField: 0,
//     };

//     data.forEach((item) => {
//       totals.opening += parseFloat(item.opening || 0);
//       totals.purchase += parseFloat(item.purchase || 0);
//       totals.transferReceive += parseFloat(
//         item.transferReceive || 0
//       );
//       totals.return += parseFloat(item.return || 0);
//       totals.usage += parseFloat(item.usage || 0);
//       totals.transferGiven += parseFloat(
//         item.transferGiven || 0
//       );
//       totals.nc += parseFloat(item.nc || 0);
//       totals.convert += parseFloat(item.convert || 0);
//       totals.shifting += parseFloat(item.shifting || 0);
//       totals.buildingUsage += parseFloat(
//         item.buildingUsage || 0
//       );
//       totals.buildingDamage += parseFloat(
//         item.buildingDamage || 0
//       );
//       totals.other += parseFloat(item.other || 0);
//       totals.repair += parseFloat(item.repair || 0);
//       totals.damage += parseFloat(item.damage || 0);
//       totals.closing += parseFloat(item.closing || 0);
//       totals.distributed += parseFloat(item.distributed || 0);
//       totals.replaceReturn += parseFloat(
//         item.replaceReturn || 0
//       );
//       totals.replaceDamage += parseFloat(
//         item.replaceDamage || 0
//       );
//       totals.stolenCenter += parseFloat(
//         item.stolenCenter || 0
//       );
//       totals.stolenField += parseFloat(
//         item.stolenField || 0
//       );
//     });

//     return totals;
//   };

//   // ------------------------------------------------------------
//   // Sorting
//   // ------------------------------------------------------------

//   const getNestedValue = (object, key) => {
//     if (!object || !key) return '';

//     return key.split('.').reduce(
//       (current, property) => current?.[property],
//       object
//     ) ?? '';
//   };

//   const handleSort = (key) => {
//     let direction = 'ascending';

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction === 'ascending'
//     ) {
//       direction = 'descending';
//     }

//     setSortConfig({
//       key,
//       direction,
//     });

//     const sortedData = [...data].sort((a, b) => {
//       const aValue = getNestedValue(a, key);
//       const bValue = getNestedValue(b, key);

//       if (aValue < bValue) {
//         return direction === 'ascending' ? -1 : 1;
//       }

//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1;
//       }

//       return 0;
//     });

//     setData(sortedData);
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return null;

//     return sortConfig.direction === 'ascending' ? (
//       <ArrowUp size={14} />
//     ) : (
//       <ArrowDown size={14} />
//     );
//   };

//   // ------------------------------------------------------------
//   // Search
//   // ------------------------------------------------------------

//   const handleSearch = (searchData) => {
//     const mergedSearchData = {
//       ...activeSearch,
//       ...searchData,
//     };

//     setActiveSearch(mergedSearchData);
//     fetchData(mergedSearchData, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch(INITIAL_SEARCH);
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const isSearchActive = () => {
//     return Boolean(
//       activeSearch.centerId ||
//         activeSearch.productId ||
//         activeSearch.resellerId ||
//         activeSearch.month ||
//         activeSearch.startDate ||
//         activeSearch.endDate
//     );
//   };

//   // ------------------------------------------------------------
//   // Export
//   // ------------------------------------------------------------

//   const openExportModal = () => {
//     setExportMonth(activeSearch.month || '');
//     setExportModalVisible(true);
//   };

//   const generateDetailExport = async () => {
//     try {
//       setExportLoading(true);

//       const params = new URLSearchParams();

//       if (activeSearch.centerId) {
//         params.append(
//           'centerId',
//           cleanParamValue(activeSearch.centerId)
//         );
//       }

//       if (activeSearch.productId) {
//         params.append(
//           'productId',
//           cleanParamValue(activeSearch.productId)
//         );
//       }

//       if (activeSearch.resellerId) {
//         params.append(
//           'reseller',
//           cleanParamValue(activeSearch.resellerId)
//         );
//       }

//       if (exportMonth) {
//         const [year, month] = exportMonth.split('-');

//         params.append('month', month);
//         params.append('year', year);
//       } else if (
//         activeSearch.startDate &&
//         activeSearch.endDate
//       ) {
//         params.append('startDate', activeSearch.startDate);
//         params.append('endDate', activeSearch.endDate);
//       } else if (activeSearch.month) {
//         const [year, month] = activeSearch.month.split('-');

//         params.append('month', month);
//         params.append('year', year);
//       }

//       params.append('export', 'true');

//       const apiUrl = params.toString()
//         ? `/reports/indent-usage-summary?${params.toString()}`
//         : '/reports/indent-usage-summary';

//       const response = await axiosInstance.get(apiUrl);

//       if (!response.data.success) {
//         throw new Error('API returned unsuccessful response');
//       }

//       const exportData = response.data.data || [];

//       if (!exportData.length) {
//         showError('No data available for export');
//         return;
//       }

//       const headers = [
//         'Center Name',
//         'Center Code',
//         'Product Name',
//         'Opening',
//         'Purchase',
//         'Distributed',
//         'Transfer Receive',
//         'Replace Return',
//         'Usage',
//         'Transfer Given',
//         'NC',
//         'Convert',
//         'Shifting',
//         'Building new usage',
//         'Building Damage',
//         'Other',
//         'Return',
//         'Repair',
//         'Damage',
//         'Replace Damage',
//         'Stolen Center',
//         'Stolen Field',
//         'Closing',
//       ];

//       const csvData = exportData.map((item) => {
//         const center = item.center || {};

//         return [
//           center.name || center.centerName || '',
//           center.code || center.centerCode || '',
//           item.productName || '',
//           item.opening || 0,
//           item.purchase || 0,
//           item.distributed || 0,
//           item.transferReceive || 0,
//           item.replaceReturn || 0,
//           item.usage || 0,
//           item.transferGiven || 0,
//           item.nc || 0,
//           item.convert || 0,
//           item.shifting || 0,
//           item.buildingUsage || 0,
//           item.buildingDamage || 0,
//           item.other || 0,
//           item.return || 0,
//           item.repair || 0,
//           item.damage || 0,
//           item.replaceDamage || 0,
//           item.stolenCenter || 0,
//           item.stolenField || 0,
//           item.closing || 0,
//         ];
//       });

//       let filename = 'indent_usage_summary_report';

//       const resolvedFilters =
//         response.data.filters ||
//         response.data.appliedFilters;

//       if (
//         resolvedFilters?.month &&
//         resolvedFilters?.year
//       ) {
//         const monthName = new Date(
//           resolvedFilters.year,
//           resolvedFilters.month - 1
//         ).toLocaleString('default', {
//           month: 'long',
//         });

//         filename += `_${monthName}_${resolvedFilters.year}`;
//       } else {
//         filename += `_${new Date()
//           .toISOString()
//           .split('T')[0]}`;
//       }

//       filename += '.csv';

//       const csvContent = [
//         headers.join(','),
//         ...csvData.map((row) =>
//           row
//             .map((field) => {
//               if (field === 0) {
//                 return '"0"';
//               }

//               const stringField = String(field || '');

//               return `"${stringField.replace(
//                 /"/g,
//                 '""'
//               )}"`;
//             })
//             .join(',')
//         ),
//       ].join('\n');

//       const blob = new Blob(
//         ['\uFEFF' + csvContent],
//         {
//           type: 'text/csv;charset=utf-8;',
//         }
//       );

//       const link = document.createElement('a');
//       const downloadUrl = URL.createObjectURL(blob);

//       link.setAttribute('href', downloadUrl);
//       link.setAttribute('download', filename);
//       link.style.visibility = 'hidden';

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       URL.revokeObjectURL(downloadUrl);

//       showSuccess('Export completed successfully!');

//       setExportModalVisible(false);
//       setExportMonth('');
//     } catch (error) {
//       console.error('Error generating export:', error);
//       showError('Error generating export file');
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // ------------------------------------------------------------
//   // Date
//   // ------------------------------------------------------------

//   const formatDateForDisplay = (dateString) => {
//     if (!dateString) return '';

//     // Do not use new Date('YYYY-MM-DD') for display because
//     // JavaScript parses it as UTC and it can shift the date.
//     const match = String(dateString).match(
//       /^(\\d{4})-(\\d{2})-(\\d{2})$/
//     );

//     if (match) {
//       const [, year, month, day] = match;
//       return `${day}-${month}-${year}`;
//     }

//     const date = new Date(dateString);

//     if (Number.isNaN(date.getTime())) {
//       return String(dateString);
//     }

//     return `${String(date.getDate()).padStart(
//       2,
//       '0'
//     )}-${String(date.getMonth() + 1).padStart(
//       2,
//       '0'
//     )}-${date.getFullYear()}`;
//   };

//   const getFormattedDateRange = () => {
//     // Always show exactly the date range selected by the user.
//     // This avoids displaying an API exclusive end date such as
//     // 01-10 when the user selected 30-09.
//     if (
//       activeSearch.startDate &&
//       activeSearch.endDate
//     ) {
//       return `${formatDateForDisplay(
//         activeSearch.startDate
//       )} to ${formatDateForDisplay(
//         activeSearch.endDate
//       )}`;
//     }

//     if (
//       filters?.dateRange?.startDate &&
//       filters?.dateRange?.endDate
//     ) {
//       return `${formatDateForDisplay(
//         filters.dateRange.startDate
//       )} to ${formatDateForDisplay(
//         filters.dateRange.endDate
//       )}`;
//     }

//     if (filters?.month && filters?.year) {
//       const monthName = new Date(
//         filters.year,
//         filters.month - 1
//       ).toLocaleString('default', {
//         month: 'long',
//       });

//       return `${monthName}-${filters.year}`;
//     }

//     if (
//       activeSearch.startDate &&
//       activeSearch.endDate
//     ) {
//       return `${activeSearch.startDate} to ${activeSearch.endDate}`;
//     }

//     if (activeSearch.month) {
//       const [year, month] =
//         activeSearch.month.split('-');

//       const monthName = new Date(
//         parseInt(year, 10),
//         parseInt(month, 10) - 1
//       ).toLocaleString('default', {
//         month: 'long',
//       });

//       return `${monthName}-${year}`;
//     }

//     const now = new Date();

//     return `${now.toLocaleString('default', {
//       month: 'long',
//     })}-${now.getFullYear()}`;
//   };

//   // ------------------------------------------------------------
//   // Frontend Search
//   // ------------------------------------------------------------

//   const filteredData = data.filter((item) => {
//     if (!searchTerm.trim()) {
//       return true;
//     }

//     return Object.values(item).some((value) => {
//       if (
//         typeof value === 'object' &&
//         value !== null
//       ) {
//         return Object.values(value).some(
//           (nestedValue) =>
//             nestedValue &&
//             nestedValue
//               .toString()
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase())
//         );
//       }

//       return (
//         value &&
//         value
//           .toString()
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     });
//   });

//   const totals = calculateTotals();

//   // ------------------------------------------------------------
//   // Click Handlers
//   // ------------------------------------------------------------

//   // const handleUsageClick = (item) => {
//   //   if (item.usage > 0) {
//   //     const productName = getProductName(
//   //       item.productId
//   //     );

//   //     const centerName = getCenterName(
//   //       item.center?.id || item.center?._id
//   //     );

//   //     const { month, year } = splitMonthYear(
//   //       activeSearch.month
//   //     );

//   //     navigate('/usage-detail', {
//   //       state: {
//   //         product: productName,
//   //         center: centerName,
//   //         productId: item.productId || '',
//   //         centerId:
//   //           item.center?.id ||
//   //           item.center?._id ||
//   //           '',
//   //         productName: item.productName || '',
//   //         centerName:
//   //           item.center?.name ||
//   //           item.center?.centerName ||
//   //           '',
//   //         month,
//   //         year,
//   //       },
//   //     });
//   //   }
//   // };

//   const handleUsageClick = (item) => {
//   if (item.usage > 0) {
//     const productName = getProductName(item.productId);

//     const centerId =
//       item.center?.id ||
//       item.center?._id ||
//       "";

//     const centerName = getCenterName(centerId);

//     const { month, year } = splitMonthYear(
//       activeSearch.month
//     );

//     // IMPORTANT:
//     // Exactly the Usage quantity shown in summary table
//     const summaryTotalQuantity = Number(
//       item.usage || 0
//     );

//     navigate("/usage-detail", {
//       state: {
//         product: productName,
//         center: centerName,

//         productId: item.productId || "",
//         centerId,

//         productName:
//           item.productName || productName,

//         centerName,

//         month,
//         year,

//         // VERY IMPORTANT
//         summaryTotalQuantity,

//         fromSummary: true,
//       },
//     });
//   }
// };

//   const handleTransferReceiveClick = (item) => {
//     if (item.transferReceive > 0) {
//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error(
//           'Missing center or product ID:',
//           {
//             centerId,
//             productId,
//           }
//         );
//         return;
//       }

//       const productName =
//         getProductName(productId);

//       const centerName =
//         getCenterName(centerId);

//       const params = new URLSearchParams({
//         product: productName,
//         center: centerName,
//         transferType: 'receive',
//       });

//       navigate(
//         `/transfer-detail?${params.toString()}`
//       );
//     }
//   };

//   const handleTransferGivenClick = (item) => {
//     if (item.transferGiven > 0) {
//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error(
//           'Missing center or product ID:',
//           {
//             centerId,
//             productId,
//           }
//         );
//         return;
//       }

//       const productName =
//         getProductName(productId);

//       const centerName =
//         getCenterName(centerId);

//       const params = new URLSearchParams({
//         product: productName,
//         center: centerName,
//         transferType: 'given',
//       });

//       navigate(
//         `/transfer-detail?${params.toString()}`
//       );
//     }
//   };

//   const handleFieldClick = (
//     item,
//     field,
//     type
//   ) => {
//     const value = item[field] || 0;

//     if (value > 0) {
//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error(
//           'Missing center or product ID:',
//           {
//             centerId,
//             productId,
//           }
//         );
//         return;
//       }

//       const productName =
//         getProductName(productId);

//       const centerName =
//         getCenterName(centerId);

//       const params = new URLSearchParams({
//         product: productName,
//         center: centerName,
//         usageType: type,
//         productName: encodeURIComponent(
//           item.productName || ''
//         ),
//         centerName: encodeURIComponent(
//           item.center?.name ||
//             item.center?.centerName ||
//             ''
//         ),
//         month: activeSearch.month || '',
//       });

//       navigate(
//         `/transaction-report?${params.toString()}`
//       );
//     }
//   };

//   const handleNcClick = (item) =>
//     handleFieldClick(item, 'nc', 'Customer');

//   const handleConvertClick = (item) =>
//     handleFieldClick(
//       item,
//       'convert',
//       'Customer'
//     );

//   const handleShiftingClick = (item) =>
//     handleFieldClick(
//       item,
//       'shifting',
//       'Customer'
//     );

//   const handleBuildingUsageClick = (item) =>
//     handleFieldClick(
//       item,
//       'buildingUsage',
//       'Building'
//     );

//   const handleBuildingDamageClick = (item) =>
//     handleFieldClick(
//       item,
//       'buildingDamage',
//       'building'
//     );

//   const handleOtherClick = (item) =>
//     handleFieldClick(item, 'other', 'other');

//   const handleDamageClick = (item) =>
//     handleFieldClick(item, 'damage', 'Damage');

//   const handleRepairClick = (item) =>
//     handleFieldClick(
//       item,
//       'repair',
//       'Customer'
//     );

//   const handleReturnClick = (item) =>
//     handleFieldClick(
//       item,
//       'return',
//       'Customer'
//     );

//   const handlePurchaseClick = (item) => {
//     if (item.purchase > 0) {
//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error(
//           'Missing center or product ID:',
//           {
//             centerId,
//             productId,
//           }
//         );
//         return;
//       }

//       const productName =
//         getProductName(productId);

//       const centerName =
//         getCenterName(centerId);

//       const params = new URLSearchParams({
//         product: productName,
//         center: centerName,
//         productName: encodeURIComponent(
//           item.productName || ''
//         ),
//         centerName: encodeURIComponent(
//           item.center?.name ||
//             item.center?.centerName ||
//             ''
//         ),
//         month: activeSearch.month || '',
//         transactionType: 'purchase',
//       });

//       navigate(
//         `/indent-detail?${params.toString()}`
//       );
//     }
//   };

//   // ------------------------------------------------------------
//   // Loading / Error
//   // ------------------------------------------------------------

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     );
//   }

//   // ------------------------------------------------------------
//   // Render
//   // ------------------------------------------------------------

//   const clickableClass = (value) =>
//     value > 0
//       ? 'cursor-pointer font-medium text-blue-600 hover:text-blue-800 hover:underline'
//       : 'cursor-default text-gray-700';

//   const renderClickableValue = (
//     value,
//     handler
//   ) => (
//     <button
//       type="button"
//       onClick={handler}
//       disabled={value === 0}
//       className={`border-0 bg-transparent p-0 ${clickableClass(
//         value
//       )}`}
//     >
//       {value || 0}
//     </button>
//   );

//   const headerClass =
//     'cursor-pointer whitespace-nowrap border-b border-gray-200 bg-gray-50 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 hover:bg-gray-100';

//   const cellClass =
//     'whitespace-nowrap border-b border-gray-100 px-3 py-3 text-sm text-gray-700';

//   return (
//     <div className="w-full">
//       <div className="mb-4">
//         <h1 className="text-xl font-semibold text-gray-800">
//           Indent / Usage Summary Report
//         </h1>
//       </div>

//       <IndentUsageSummarySearch
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//       />

//       {/* Export Modal */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Export Indent / Usage Summary
//                 Report
//               </h2>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setExportModalVisible(false)
//                 }
//                 className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-4 px-5 py-5">
//               <div>
//                 <label
//                   htmlFor="exportMonth"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Select Month (Optional)
//                 </label>

//                 <input
//                   id="exportMonth"
//                   type="month"
//                   value={exportMonth}
//                   onChange={(e) =>
//                     setExportMonth(
//                       e.target.value
//                     )
//                   }
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <p className="mt-1.5 text-xs text-gray-500">
//                   Leave empty to use current
//                   month or active search month
//                 </p>
//               </div>

//               {(activeSearch.centerId ||
//                 activeSearch.productId ||
//                 activeSearch.resellerId) && (
//                 <div className="rounded-lg bg-gray-50 p-3">
//                   <p className="mb-2 text-sm font-semibold text-gray-700">
//                     Current Filters:
//                   </p>

//                   <ul className="space-y-1 text-sm text-gray-600">
//                     {activeSearch.centerId && (
//                       <li>
//                         Center:{' '}
//                         {getCenterName(
//                           activeSearch.centerId
//                         )}
//                       </li>
//                     )}

//                     {activeSearch.productId && (
//                       <li>
//                         Product:{' '}
//                         {getProductName(
//                           activeSearch.productId
//                         )}
//                       </li>
//                     )}

//                     {activeSearch.resellerId && (
//                       <li>
//                         Reseller:{' '}
//                         {resellers.find(
//                           (item) =>
//                             item._id ===
//                             activeSearch.resellerId
//                         )?.businessName ||
//                           'Unknown Reseller'}
//                       </li>
//                     )}

//                     {activeSearch.month && (
//                       <li>
//                         Month:{' '}
//                         {getFormattedDateRange()}
//                       </li>
//                     )}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setExportModalVisible(false)
//                 }
//                 className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={generateDetailExport}
//                 disabled={exportLoading}
//                 className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {exportLoading ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Exporting...
//                   </>
//                 ) : (
//                   <>
//                     <FileSpreadsheet size={16} />
//                     Export
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Card */}
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         {/* Header */}
//         <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-wrap items-center gap-2">
//             <button
//               type="button"
//               onClick={() =>
//                 setSearchModalVisible(true)
//               }
//               className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//             >
//               <Search size={16} />
//               Search
//             </button>

//             {isSearchActive() && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex items-center gap-1.5 rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
//               >
//                 <RotateCcw size={16} />
//                 Reset Search
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={openExportModal}
//               disabled={
//                 exportLoading ||
//                 data.length === 0
//               }
//               className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Download size={16} />
//               Export
//             </button>
//           </div>

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>

//         {/* Body */}
//         <div className="p-4">
//           <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//             <div>
//               {exportMonth && (
//                 <div className="text-sm text-gray-500">
//                   Export Month:{' '}
//                   {exportMonth}
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               <label
//                 htmlFor="tableSearch"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 Search:
//               </label>

//               <input
//                 id="tableSearch"
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) =>
//                   setSearchTerm(
//                     e.target.value
//                   )
//                 }
//                 className="h-8 w-full max-w-[350px] border border-gray-300 px-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Summary */}
//           <div className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
//             <h3 className="mb-3 text-base font-semibold text-gray-800">
//               Showing Result
//             </h3>

//             <ul className="grid gap-2 text-sm text-gray-600 md:grid-cols-2 lg:grid-cols-4">
//               <li>
//                 <strong className="text-gray-800">
//                   Date:
//                 </strong>{' '}
//                 {getFormattedDateRange()}
//               </li>

//               {filters?.center && (
//                 <li>
//                   <strong className="text-gray-800">
//                     Branch:
//                   </strong>{' '}
//                   {typeof filters.center ===
//                   'object'
//                     ? filters.center.name
//                     : filters.center}
//                 </li>
//               )}

//               {activeSearch.productId && (
//                 <li>
//                   <strong className="text-gray-800">
//                     Product:
//                   </strong>{' '}
//                   {getProductName(
//                     activeSearch.productId
//                   )}
//                 </li>
//               )}

//               {activeSearch.resellerId && (
//                 <li>
//                   <strong className="text-gray-800">
//                     Reseller:
//                   </strong>{' '}
//                   {resellers.find(
//                     (item) =>
//                       item._id ===
//                       activeSearch.resellerId
//                   )?.businessName ||
//                     'Unknown Reseller'}
//                 </li>
//               )}

//               <li>
//                 <strong className="text-gray-800">
//                   Total Products:
//                 </strong>{' '}
//                 {data.length}
//               </li>
//             </ul>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto rounded-lg border border-gray-200">
//             <table className="min-w-[1900px] w-full border-collapse">
//               <thead>
//                 <tr>
//                   <th
//                     onClick={() =>
//                       handleSort('center.name')
//                     }
//                     className={headerClass}
//                   >
//                     <div className="flex items-center gap-1">
//                       Branch
//                       {getSortIcon(
//                         'center.name'
//                       )}
//                     </div>
//                   </th>

//                   <th
//                     onClick={() =>
//                       handleSort(
//                         'productName'
//                       )
//                     }
//                     className={headerClass}
//                   >
//                     <div className="flex items-center gap-1">
//                       Product
//                       {getSortIcon(
//                         'productName'
//                       )}
//                     </div>
//                   </th>

//                   {[
//                     ['opening', 'Opening'],
//                     ['purchase', 'Purchase'],
//                     [
//                       'transferReceive',
//                       'Transfer Received',
//                     ],
//                     ['return', 'Return'],
//                     ['usage', 'Usage'],
//                     [
//                       'transferGiven',
//                       'Transfer Given',
//                     ],
//                     ['nc', 'NC'],
//                     ['convert', 'Convert'],
//                     ['shifting', 'Shifting'],
//                     [
//                       'buildingUsage',
//                       'Building new usage',
//                     ],
//                     [
//                       'buildingDamage',
//                       'Building Damage',
//                     ],
//                     ['other', 'Other'],
//                     ['repair', 'Repair'],
//                     ['damage', 'Damage'],
//                     ['closing', 'Closing'],
//                   ].map(([key, label]) => (
//                     <th
//                       key={key}
//                       onClick={() =>
//                         handleSort(key)
//                       }
//                       className={headerClass}
//                     >
//                       <div className="flex items-center gap-1">
//                         {label}
//                         {getSortIcon(key)}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length > 0 ? (
//                   <>
//                     {filteredData.map(
//                       (item, idx) => (
//                         <tr
//                           key={
//                             item._id || idx
//                           }
//                           className="hover:bg-gray-50"
//                         >
//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {item.center
//                               ?.name ||
//                               item.center
//                                 ?.centerName ||
//                               'N/A'}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {item.productName ||
//                               'N/A'}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {item.opening ||
//                               0}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {renderClickableValue(
//                               item.purchase,
//                               () =>
//                                 handlePurchaseClick(
//                                   item
//                                 )
//                             )}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {renderClickableValue(
//                               item.transferReceive,
//                               () =>
//                                 handleTransferReceiveClick(
//                                   item
//                                 )
//                             )}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {renderClickableValue(
//                               item.return,
//                               () =>
//                                 handleReturnClick(
//                                   item
//                                 )
//                             )}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {renderClickableValue(
//                               item.usage,
//                               () =>
//                                 handleUsageClick(
//                                   item
//                                 )
//                             )}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {renderClickableValue(
//                               item.transferGiven,
//                               () =>
//                                 handleTransferGivenClick(
//                                   item
//                                 )
//                             )}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {renderClickableValue(
//                               item.nc,
//                               () =>
//                                 handleNcClick(
//                                   item
//                                 )
//                             )}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {renderClickableValue(
//                               item.convert,
//                               () =>
//                                 handleConvertClick(
//                                   item
//                                 )
//                             )}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {renderClickableValue(
//                               item.shifting,
//                               () =>
//                                 handleShiftingClick(
//                                   item
//                                 )
//                             )}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {renderClickableValue(
//                               item.buildingUsage,
//                               () =>
//                                 handleBuildingUsageClick(
//                                   item
//                                 )
//                             )}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {renderClickableValue(
//                               item.buildingDamage,
//                               () =>
//                                 handleBuildingDamageClick(
//                                   item
//                                 )
//                             )}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {renderClickableValue(
//                               item.other,
//                               () =>
//                                 handleOtherClick(
//                                   item
//                                 )
//                             )}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {renderClickableValue(
//                               item.repair,
//                               () =>
//                                 handleRepairClick(
//                                   item
//                                 )
//                             )}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {renderClickableValue(
//                               item.damage,
//                               () =>
//                                 handleDamageClick(
//                                   item
//                                 )
//                             )}
//                           </td>

//                           <td
//                             className={
//                               cellClass
//                             }
//                           >
//                             {item.closing ||
//                               0}
//                           </td>
//                         </tr>
//                       )
//                     )}

//                     {/* Total */}
//                     <tr className="bg-gray-100 font-semibold">
//                       <td
//                         colSpan={2}
//                         className="border-b border-gray-200 px-3 py-3 text-sm text-gray-800"
//                       >
//                         Total
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.opening}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.purchase}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.transferReceive}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.return}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.usage}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.transferGiven}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.nc}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.convert}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.shifting}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.buildingUsage}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.buildingDamage}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.other}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.repair}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.damage}
//                       </td>

//                       <td className="border-b border-gray-200 px-3 py-3 text-sm">
//                         {totals.closing}
//                       </td>
//                     </tr>
//                   </>
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={17}
//                       className="px-4 py-10 text-center text-sm text-gray-500"
//                     >
//                       No data found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IndentUsageSummary;







// import React, { useEffect, useState } from 'react';
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   FileSpreadsheet,
//   RotateCcw,
//   Search,
//   X,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// import axiosInstance from '../../axiosInstance';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import IndentUsageSummarySearch from './IndentUsageSummarySearch';

// const INITIAL_SEARCH = {
//   centerId: '',
//   productId: '',
//   resellerId: '',
//   month: '',
//   startDate: '',
//   endDate: '',
// };

// const NUMERIC_FIELDS = [
//   'purchase',
//   'transferReceive',
//   'return',
//   'usage',
//   'transferGiven',
//   'nc',
//   'convert',
//   'shifting',
//   'buildingUsage',
//   'buildingDamage',
//   'other',
//   'repair',
//   'damage',
//   'distributed',
//   'replaceReturn',
//   'replaceDamage',
//   'stolenCenter',
//   'stolenField',
// ];

// const TABLE_COLUMNS = [
//   { key: 'opening', label: 'Opening' },
//   { key: 'purchase', label: 'Purchase', handler: 'purchase' },
//   {
//     key: 'transferReceive',
//     label: 'Transfer Received',
//     handler: 'transferReceive',
//   },
//   { key: 'return', label: 'Return', handler: 'return' },
//   { key: 'usage', label: 'Usage', handler: 'usage' },
//   {
//     key: 'transferGiven',
//     label: 'Transfer Given',
//     handler: 'transferGiven',
//   },
//   { key: 'nc', label: 'NC', handler: 'nc' },
//   { key: 'convert', label: 'Convert', handler: 'convert' },
//   { key: 'shifting', label: 'Shifting', handler: 'shifting' },
//   {
//     key: 'buildingUsage',
//     label: 'Building new usage',
//     handler: 'buildingUsage',
//   },
//   {
//     key: 'buildingDamage',
//     label: 'Building Damage',
//     handler: 'buildingDamage',
//   },
//   { key: 'other', label: 'Other', handler: 'other' },
//   { key: 'repair', label: 'Repair', handler: 'repair' },
//   { key: 'damage', label: 'Damage', handler: 'damage' },
//   { key: 'closing', label: 'Closing' },
// ];

// const INDIGO_BLUE = '#2f5fa7';
// const PAGINATION_PURPLE = '#5146e5';

// const IndentUsageSummary = () => {
//   const [data, setData] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [filters, setFilters] = useState(null);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [resellers, setResellers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [exportLoading, setExportLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   });

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [exportModalVisible, setExportModalVisible] = useState(false);
//   const [exportMonth, setExportMonth] = useState('');
//   const [activeSearch, setActiveSearch] = useState(INITIAL_SEARCH);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const navigate = useNavigate();

//   // ------------------------------------------------------------
//   // Helpers
//   // ------------------------------------------------------------

//   const cleanParamValue = (value) => {
//     if (!value) return value;

//     const prefixes = [
//       'center_',
//       'product_',
//       'reseller_',
//       'outlet_',
//       'warehouse_',
//     ];

//     let cleaned = value;

//     for (const prefix of prefixes) {
//       if (cleaned.startsWith(prefix)) {
//         cleaned = cleaned.replace(prefix, '');
//       }
//     }

//     return cleaned;
//   };

//   const getProductName = (productId) => {
//     if (!productId) return '';

//     const cleaned = cleanParamValue(productId);

//     if (/^[0-9a-fA-F]{24}$/.test(cleaned)) {
//       const product = products.find((item) => item._id === cleaned);
//       return product ? product.productTitle : cleaned;
//     }

//     return cleaned;
//   };

//   const getCenterName = (centerId) => {
//     if (!centerId) return '';

//     const cleaned = cleanParamValue(centerId);

//     if (/^[0-9a-fA-F]{24}$/.test(cleaned)) {
//       const center = centers.find((item) => item._id === cleaned);
//       return center ? center.centerName : cleaned;
//     }

//     return cleaned;
//   };

//   const splitMonthYear = (monthValue) => {
//     if (!monthValue || !monthValue.includes('-')) {
//       return { month: '', year: '' };
//     }

//     const [year, month] = monthValue.split('-');

//     return { month, year };
//   };

//   // ------------------------------------------------------------
//   // API
//   // ------------------------------------------------------------

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();

//       if (searchParams.centerId) {
//         params.append(
//           'centerId',
//           cleanParamValue(searchParams.centerId)
//         );
//       }

//       if (searchParams.productId) {
//         params.append(
//           'productId',
//           cleanParamValue(searchParams.productId)
//         );
//       }

//       if (searchParams.resellerId) {
//         params.append(
//           'reseller',
//           cleanParamValue(searchParams.resellerId)
//         );
//       }

//       if (searchParams.startDate && searchParams.endDate) {
//         params.append('startDate', searchParams.startDate);
//         params.append('endDate', searchParams.endDate);
//       } else if (searchParams.month) {
//         const [year, month] = searchParams.month.split('-');
//         params.append('month', month);
//         params.append('year', year);
//       }

//       params.append('page', page);

//       const url = params.toString()
//         ? `/reports/indent-usage-summary?${params.toString()}`
//         : '/reports/indent-usage-summary';

//       console.log('Fetching Usage Summary URL:', url);

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         const groupedMap = new Map();

//         (response.data.data || []).forEach((item) => {
//           const center = item.center || {};

//           const centerId =
//             center.id ||
//             center._id ||
//             item.centerId ||
//             '';

//           const productId =
//             item.productId ||
//             item.product?._id ||
//             '';

//           const productName =
//             item.productName ||
//             item.product?.productTitle ||
//             'Unknown Product';

//           const centerKey = String(
//             centerId ||
//               center.name ||
//               center.centerName ||
//               ''
//           )
//             .trim()
//             .toLowerCase();

//           const productKey = String(productId || productName)
//             .trim()
//             .toLowerCase();

//           const groupKey = `${centerKey}__${productKey}`;

//           if (!groupedMap.has(groupKey)) {
//             groupedMap.set(groupKey, {
//               _id: productId || `${centerKey}-${productKey}`,
//               center: {
//                 id: centerId,
//                 name: center.name || center.centerName || '',
//                 code: center.code || center.centerCode || '',
//                 _id: centerId,
//               },
//               productId,
//               productName,
//               opening: Number(item.opening || 0),
//               purchase: 0,
//               transferReceive: 0,
//               return: 0,
//               usage: 0,
//               transferGiven: 0,
//               nc: 0,
//               convert: 0,
//               shifting: 0,
//               buildingUsage: 0,
//               buildingDamage: 0,
//               other: 0,
//               repair: 0,
//               damage: 0,
//               distributed: 0,
//               replaceReturn: 0,
//               replaceDamage: 0,
//               stolenCenter: 0,
//               stolenField: 0,
//               closing: Number(item.closing || 0),
//             });
//           }

//           const existing = groupedMap.get(groupKey);

//           NUMERIC_FIELDS.forEach((field) => {
//             existing[field] += Number(item[field] || 0);
//           });

//           if (
//             Number(existing.opening || 0) === 0 &&
//             Number(item.opening || 0) !== 0
//           ) {
//             existing.opening = Number(item.opening);
//           }

//           if (item.closing !== undefined && item.closing !== null) {
//             existing.closing = Number(item.closing || 0);
//           }
//         });

//         const transformedData = Array.from(groupedMap.values());

//         setData(transformedData);
//         setSummary(response.data.summary || null);
//         setFilters(
//           response.data.filters ||
//             response.data.appliedFilters ||
//             null
//         );

//         setCurrentPage(response.data.pagination?.currentPage || 1);
//         setTotalPages(response.data.pagination?.totalPages || 1);
//       } else {
//         const errorMessage =
//           response.data.message ||
//           'API returned unsuccessful response';

//         setError(errorMessage);
//         console.error('Backend error:', response.data);
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get('/centers');

//       if (response.data.success) {
//         setCenters(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all');

//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers');

//       if (response.data.success) {
//         setResellers(response.data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching resellers:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//     fetchProducts();
//     fetchResellers();
//   }, []);

//   // ------------------------------------------------------------
//   // Pagination
//   // ------------------------------------------------------------

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages || page === currentPage) return;
//     fetchData(activeSearch, page);
//   };

//   const getPaginationItems = () => {
//     const pages = [];

//     if (totalPages <= 5) {
//       for (let page = 1; page <= totalPages; page += 1) {
//         pages.push(page);
//       }

//       return pages;
//     }

//     if (currentPage <= 3) {
//       pages.push(1, 2, 3, 'ellipsis', totalPages);
//       return pages;
//     }

//     if (currentPage >= totalPages - 2) {
//       pages.push(
//         1,
//         'ellipsis',
//         totalPages - 2,
//         totalPages - 1,
//         totalPages
//       );

//       return pages;
//     }

//     pages.push(
//       1,
//       'ellipsis',
//       currentPage - 1,
//       currentPage,
//       currentPage + 1,
//       'ellipsis',
//       totalPages
//     );

//     return pages;
//   };

//   // Pagination UI only.
//   const renderPagination = () => {
//     const buttonBaseClass =
//       'inline-flex h-[31px] min-w-[25px] items-center justify-center border border-[#dee2e6] bg-white px-[7px] text-[13px] font-normal leading-none transition-colors';

//     const disabledClass =
//       'cursor-not-allowed bg-[#e9ecef] text-[#6c757d]';

//     const pageClass =
//       'text-[#007bff] hover:bg-[#e9ecef]';

//     const activeClass =
//       `relative z-[1] border-[${PAGINATION_PURPLE}] bg-[${PAGINATION_PURPLE}] text-white`;

//     const pages = getPaginationItems();

//     const isFirstPage = currentPage === 1;
//     const isLastPage = currentPage === totalPages;

//     return (
//       <nav
//         aria-label="Pagination"
//         className="flex flex-wrap items-center justify-end"
//       >
//         <button
//           type="button"
//           onClick={() => handlePageChange(1)}
//           disabled={isFirstPage}
//           className={`inline-flex h-[31px] items-center justify-center rounded-l-[4px] border border-[#dee2e6] px-[9px] text-[13px] font-normal leading-none transition-colors ${
//             isFirstPage ? disabledClass : pageClass
//           }`}
//         >
//           First
//         </button>

//         <button
//           type="button"
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={isFirstPage}
//           aria-label="Previous page"
//           className={`-ml-px ${buttonBaseClass} ${
//             isFirstPage ? disabledClass : pageClass
//           }`}
//         >
//           &lt;
//         </button>

//         {pages.map((page, index) =>
//           page === 'ellipsis' ? (
//             <span
//               key={`ellipsis-${index}`}
//               className={`-ml-px ${buttonBaseClass} cursor-default text-[#6c757d]`}
//               aria-hidden="true"
//             >
//               ...
//             </span>
//           ) : (
//             <button
//               key={page}
//               type="button"
//               onClick={() => handlePageChange(page)}
//               disabled={currentPage === page}
//               aria-label={`Page ${page}`}
//               aria-current={currentPage === page ? 'page' : undefined}
//               className={`-ml-px ${buttonBaseClass} ${
//                 currentPage === page
//                   ? 'relative z-[1] border-[#5146e5] bg-[#5146e5] text-white'
//                   : pageClass
//               }`}
//             >
//               {page}
//             </button>
//           )
//         )}

//         <button
//           type="button"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={isLastPage}
//           aria-label="Next page"
//           className={`-ml-px ${buttonBaseClass} ${
//             isLastPage ? disabledClass : pageClass
//           }`}
//         >
//           &gt;
//         </button>

//         <button
//           type="button"
//           onClick={() => handlePageChange(totalPages)}
//           disabled={isLastPage}
//           className={`-ml-px inline-flex h-[31px] items-center justify-center rounded-r-[4px] border border-[#dee2e6] px-[9px] text-[13px] font-normal leading-none transition-colors ${
//             isLastPage ? disabledClass : pageClass
//           }`}
//         >
//           Last
//         </button>
//       </nav>
//     );
//   };

//   // ------------------------------------------------------------
//   // Totals
//   // ------------------------------------------------------------

//   const calculateTotals = () => {
//     const totals = {
//       opening: 0,
//       purchase: 0,
//       transferReceive: 0,
//       return: 0,
//       usage: 0,
//       transferGiven: 0,
//       nc: 0,
//       convert: 0,
//       shifting: 0,
//       buildingUsage: 0,
//       buildingDamage: 0,
//       other: 0,
//       repair: 0,
//       damage: 0,
//       closing: 0,
//       distributed: 0,
//       replaceReturn: 0,
//       replaceDamage: 0,
//       stolenCenter: 0,
//       stolenField: 0,
//     };

//     data.forEach((item) => {
//       totals.opening += parseFloat(item.opening || 0);
//       totals.purchase += parseFloat(item.purchase || 0);
//       totals.transferReceive += parseFloat(item.transferReceive || 0);
//       totals.return += parseFloat(item.return || 0);
//       totals.usage += parseFloat(item.usage || 0);
//       totals.transferGiven += parseFloat(item.transferGiven || 0);
//       totals.nc += parseFloat(item.nc || 0);
//       totals.convert += parseFloat(item.convert || 0);
//       totals.shifting += parseFloat(item.shifting || 0);
//       totals.buildingUsage += parseFloat(item.buildingUsage || 0);
//       totals.buildingDamage += parseFloat(item.buildingDamage || 0);
//       totals.other += parseFloat(item.other || 0);
//       totals.repair += parseFloat(item.repair || 0);
//       totals.damage += parseFloat(item.damage || 0);
//       totals.closing += parseFloat(item.closing || 0);
//       totals.distributed += parseFloat(item.distributed || 0);
//       totals.replaceReturn += parseFloat(item.replaceReturn || 0);
//       totals.replaceDamage += parseFloat(item.replaceDamage || 0);
//       totals.stolenCenter += parseFloat(item.stolenCenter || 0);
//       totals.stolenField += parseFloat(item.stolenField || 0);
//     });

//     return totals;
//   };

//   // ------------------------------------------------------------
//   // Sorting
//   // ------------------------------------------------------------

//   const getNestedValue = (object, key) => {
//     if (!object || !key) return '';

//     return (
//       key.split('.').reduce(
//         (current, property) => current?.[property],
//         object
//       ) ?? ''
//     );
//   };

//   const handleSort = (key) => {
//     let direction = 'ascending';

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction === 'ascending'
//     ) {
//       direction = 'descending';
//     }

//     setSortConfig({ key, direction });

//     const sortedData = [...data].sort((a, b) => {
//       const aValue = getNestedValue(a, key);
//       const bValue = getNestedValue(b, key);

//       if (aValue < bValue) {
//         return direction === 'ascending' ? -1 : 1;
//       }

//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1;
//       }

//       return 0;
//     });

//     setData(sortedData);
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return null;

//     return sortConfig.direction === 'ascending' ? (
//       <ArrowUp size={14} />
//     ) : (
//       <ArrowDown size={14} />
//     );
//   };

//   // ------------------------------------------------------------
//   // Search
//   // ------------------------------------------------------------

//   const handleSearch = (searchData) => {
//     const mergedSearchData = {
//       ...activeSearch,
//       ...searchData,
//     };

//     setActiveSearch(mergedSearchData);
//     fetchData(mergedSearchData, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch(INITIAL_SEARCH);
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const isSearchActive = () =>
//     Boolean(
//       activeSearch.centerId ||
//         activeSearch.productId ||
//         activeSearch.resellerId ||
//         activeSearch.month ||
//         activeSearch.startDate ||
//         activeSearch.endDate
//     );

//   // ------------------------------------------------------------
//   // Export
//   // ------------------------------------------------------------

//   const openExportModal = () => {
//     setExportMonth(activeSearch.month || '');
//     setExportModalVisible(true);
//   };

//   const generateDetailExport = async () => {
//     try {
//       setExportLoading(true);

//       const params = new URLSearchParams();

//       if (activeSearch.centerId) {
//         params.append(
//           'centerId',
//           cleanParamValue(activeSearch.centerId)
//         );
//       }

//       if (activeSearch.productId) {
//         params.append(
//           'productId',
//           cleanParamValue(activeSearch.productId)
//         );
//       }

//       if (activeSearch.resellerId) {
//         params.append(
//           'reseller',
//           cleanParamValue(activeSearch.resellerId)
//         );
//       }

//       if (exportMonth) {
//         const [year, month] = exportMonth.split('-');
//         params.append('month', month);
//         params.append('year', year);
//       } else if (activeSearch.startDate && activeSearch.endDate) {
//         params.append('startDate', activeSearch.startDate);
//         params.append('endDate', activeSearch.endDate);
//       } else if (activeSearch.month) {
//         const [year, month] = activeSearch.month.split('-');
//         params.append('month', month);
//         params.append('year', year);
//       }

//       params.append('export', 'true');

//       const apiUrl = params.toString()
//         ? `/reports/indent-usage-summary?${params.toString()}`
//         : '/reports/indent-usage-summary';

//       const response = await axiosInstance.get(apiUrl);

//       if (!response.data.success) {
//         throw new Error('API returned unsuccessful response');
//       }

//       const exportData = response.data.data || [];

//       if (!exportData.length) {
//         showError('No data available for export');
//         return;
//       }

//       const headers = [
//         'Center Name',
//         'Center Code',
//         'Product Name',
//         'Opening',
//         'Purchase',
//         'Distributed',
//         'Transfer Receive',
//         'Replace Return',
//         'Usage',
//         'Transfer Given',
//         'NC',
//         'Convert',
//         'Shifting',
//         'Building new usage',
//         'Building Damage',
//         'Other',
//         'Return',
//         'Repair',
//         'Damage',
//         'Replace Damage',
//         'Stolen Center',
//         'Stolen Field',
//         'Closing',
//       ];

//       const csvData = exportData.map((item) => {
//         const center = item.center || {};

//         return [
//           center.name || center.centerName || '',
//           center.code || center.centerCode || '',
//           item.productName || '',
//           item.opening || 0,
//           item.purchase || 0,
//           item.distributed || 0,
//           item.transferReceive || 0,
//           item.replaceReturn || 0,
//           item.usage || 0,
//           item.transferGiven || 0,
//           item.nc || 0,
//           item.convert || 0,
//           item.shifting || 0,
//           item.buildingUsage || 0,
//           item.buildingDamage || 0,
//           item.other || 0,
//           item.return || 0,
//           item.repair || 0,
//           item.damage || 0,
//           item.replaceDamage || 0,
//           item.stolenCenter || 0,
//           item.stolenField || 0,
//           item.closing || 0,
//         ];
//       });

//       let filename = 'indent_usage_summary_report';

//       const resolvedFilters =
//         response.data.filters || response.data.appliedFilters;

//       if (resolvedFilters?.month && resolvedFilters?.year) {
//         const monthName = new Date(
//           resolvedFilters.year,
//           resolvedFilters.month - 1
//         ).toLocaleString('default', {
//           month: 'long',
//         });

//         filename += `_${monthName}_${resolvedFilters.year}`;
//       } else {
//         filename += `_${new Date().toISOString().split('T')[0]}`;
//       }

//       filename += '.csv';

//       const csvContent = [
//         headers.join(','),
//         ...csvData.map((row) =>
//           row
//             .map((field) => {
//               if (field === 0) return '"0"';

//               const stringField = String(field || '');

//               return `"${stringField.replace(/"/g, '""')}"`;
//             })
//             .join(',')
//         ),
//       ].join('\n');

//       const blob = new Blob(['\uFEFF' + csvContent], {
//         type: 'text/csv;charset=utf-8;',
//       });

//       const link = document.createElement('a');
//       const downloadUrl = URL.createObjectURL(blob);

//       link.setAttribute('href', downloadUrl);
//       link.setAttribute('download', filename);
//       link.style.visibility = 'hidden';

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(downloadUrl);

//       showSuccess('Export completed successfully!');
//       setExportModalVisible(false);
//       setExportMonth('');
//     } catch (error) {
//       console.error('Error generating export:', error);
//       showError('Error generating export file');
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // ------------------------------------------------------------
//   // Date
//   // ------------------------------------------------------------

//   const formatDateForDisplay = (dateString) => {
//     if (!dateString) return '';

//     const match = String(dateString).match(
//       /^(\d{4})-(\d{2})-(\d{2})$/
//     );

//     if (match) {
//       const [, year, month, day] = match;
//       return `${day}-${month}-${year}`;
//     }

//     const date = new Date(dateString);

//     if (Number.isNaN(date.getTime())) {
//       return String(dateString);
//     }

//     return `${String(date.getDate()).padStart(2, '0')}-${String(
//       date.getMonth() + 1
//     ).padStart(2, '0')}-${date.getFullYear()}`;
//   };

//   const getFormattedDateRange = () => {
//     if (activeSearch.startDate && activeSearch.endDate) {
//       return `${formatDateForDisplay(
//         activeSearch.startDate
//       )} to ${formatDateForDisplay(activeSearch.endDate)}`;
//     }

//     if (
//       filters?.dateRange?.startDate &&
//       filters?.dateRange?.endDate
//     ) {
//       return `${formatDateForDisplay(
//         filters.dateRange.startDate
//       )} to ${formatDateForDisplay(filters.dateRange.endDate)}`;
//     }

//     if (filters?.month && filters?.year) {
//       const monthName = new Date(
//         filters.year,
//         filters.month - 1
//       ).toLocaleString('default', {
//         month: 'long',
//       });

//       return `${monthName}-${filters.year}`;
//     }

//     if (activeSearch.month) {
//       const [year, month] = activeSearch.month.split('-');

//       const monthName = new Date(
//         parseInt(year, 10),
//         parseInt(month, 10) - 1
//       ).toLocaleString('default', {
//         month: 'long',
//       });

//       return `${monthName}-${year}`;
//     }

//     const now = new Date();

//     return `${now.toLocaleString('default', {
//       month: 'long',
//     })}-${now.getFullYear()}`;
//   };

//   // ------------------------------------------------------------
//   // Frontend Search
//   // ------------------------------------------------------------

//   const filteredData = data.filter((item) => {
//     if (!searchTerm.trim()) return true;

//     return Object.values(item).some((value) => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(
//           (nestedValue) =>
//             nestedValue &&
//             nestedValue
//               .toString()
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase())
//         );
//       }

//       return (
//         value &&
//         value
//           .toString()
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     });
//   });

//   const totals = calculateTotals();

//   // ------------------------------------------------------------
//   // Click Handlers
//   // ------------------------------------------------------------

//   const handleUsageClick = (item) => {
//     if (item.usage > 0) {
//       const productName = getProductName(item.productId);

//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const centerName = getCenterName(centerId);

//       const { month, year } = splitMonthYear(activeSearch.month);

//       const summaryTotalQuantity = Number(item.usage || 0);

//       navigate('/usage-detail', {
//         state: {
//           product: productName,
//           center: centerName,
//           productId: item.productId || '',
//           centerId,
//           productName: item.productName || productName,
//           centerName,
//           month,
//           year,
//           summaryTotalQuantity,
//           fromSummary: true,
//         },
//       });
//     }
//   };

//   const handleTransferReceiveClick = (item) => {
//     if (item.transferReceive > 0) {
//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error('Missing center or product ID:', {
//           centerId,
//           productId,
//         });
//         return;
//       }

//       const productName = getProductName(productId);
//       const centerName = getCenterName(centerId);

//       const params = new URLSearchParams({
//         product: productName,
//         center: centerName,
//         transferType: 'receive',
//       });

//       navigate(`/transfer-detail?${params.toString()}`);
//     }
//   };

//   const handleTransferGivenClick = (item) => {
//     if (item.transferGiven > 0) {
//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error('Missing center or product ID:', {
//           centerId,
//           productId,
//         });
//         return;
//       }

//       const productName = getProductName(productId);
//       const centerName = getCenterName(centerId);

//       const params = new URLSearchParams({
//         product: productName,
//         center: centerName,
//         transferType: 'given',
//       });

//       navigate(`/transfer-detail?${params.toString()}`);
//     }
//   };

//   const handleFieldClick = (item, field, type) => {
//     const value = item[field] || 0;

//     if (value > 0) {
//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error('Missing center or product ID:', {
//           centerId,
//           productId,
//         });
//         return;
//       }

//       const productName = getProductName(productId);
//       const centerName = getCenterName(centerId);

//       const params = new URLSearchParams({
//         product: productName,
//         center: centerName,
//         usageType: type,
//         productName: encodeURIComponent(item.productName || ''),
//         centerName: encodeURIComponent(
//           item.center?.name || item.center?.centerName || ''
//         ),
//         month: activeSearch.month || '',
//       });

//       navigate(`/transaction-report?${params.toString()}`);
//     }
//   };

//   const handleNcClick = (item) =>
//     handleFieldClick(item, 'nc', 'Customer');

//   const handleConvertClick = (item) =>
//     handleFieldClick(item, 'convert', 'Customer');

//   const handleShiftingClick = (item) =>
//     handleFieldClick(item, 'shifting', 'Customer');

//   const handleBuildingUsageClick = (item) =>
//     handleFieldClick(item, 'buildingUsage', 'Building');

//   const handleBuildingDamageClick = (item) =>
//     handleFieldClick(item, 'buildingDamage', 'building');

//   const handleOtherClick = (item) =>
//     handleFieldClick(item, 'other', 'other');

//   const handleDamageClick = (item) =>
//     handleFieldClick(item, 'damage', 'Damage');

//   const handleRepairClick = (item) =>
//     handleFieldClick(item, 'repair', 'Customer');

//   const handleReturnClick = (item) =>
//     handleFieldClick(item, 'return', 'Customer');

//   const handlePurchaseClick = (item) => {
//     if (item.purchase > 0) {
//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error('Missing center or product ID:', {
//           centerId,
//           productId,
//         });
//         return;
//       }

//       const productName = getProductName(productId);
//       const centerName = getCenterName(centerId);

//       const params = new URLSearchParams({
//         product: productName,
//         center: centerName,
//         productName: encodeURIComponent(item.productName || ''),
//         centerName: encodeURIComponent(
//           item.center?.name || item.center?.centerName || ''
//         ),
//         month: activeSearch.month || '',
//         transactionType: 'purchase',
//       });

//       navigate(`/indent-detail?${params.toString()}`);
//     }
//   };

//   // ------------------------------------------------------------
//   // Loading / Error
//   // ------------------------------------------------------------

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     );
//   }

//   // ------------------------------------------------------------
//   // Table UI Helpers
//   // ------------------------------------------------------------

//   const clickableClass = (value) =>
//     value > 0
//       ? 'cursor-pointer font-medium text-[#2f5fa7] hover:text-blue-800 hover:underline'
//       : 'cursor-default text-gray-600';

//   const renderClickableValue = (value, handler) => (
//     <button
//       type="button"
//       onClick={handler}
//       disabled={value === 0}
//       className={`border-0 bg-transparent p-0 ${clickableClass(value)}`}
//     >
//       {value || 0}
//     </button>
//   );

//   const getCellHandler = (item, handler) => {
//     const handlers = {
//       purchase: () => handlePurchaseClick(item),
//       transferReceive: () => handleTransferReceiveClick(item),
//       return: () => handleReturnClick(item),
//       usage: () => handleUsageClick(item),
//       transferGiven: () => handleTransferGivenClick(item),
//       nc: () => handleNcClick(item),
//       convert: () => handleConvertClick(item),
//       shifting: () => handleShiftingClick(item),
//       buildingUsage: () => handleBuildingUsageClick(item),
//       buildingDamage: () => handleBuildingDamageClick(item),
//       other: () => handleOtherClick(item),
//       repair: () => handleRepairClick(item),
//       damage: () => handleDamageClick(item),
//     };

//     return handlers[handler];
//   };

//   const headerClass =
//     'h-[88px] cursor-pointer border border-[#eeeeee] bg-white px-[9px] py-2 text-left align-bottom text-[16px] font-semibold leading-6 text-black hover:bg-gray-50';

//   const cellClass =
//     'border border-[#eeeeee] px-[9px] py-[9px] text-[16px] leading-6 text-black align-top';

//   const totalCellClass =
//     'border border-[#eeeeee] bg-[#d5e8ce] px-[9px] py-[9px] text-[16px] font-semibold leading-6 text-black';

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
//       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//         <h1 className="text-[24px] font-normal text-[#212529]">
//           Indent / Usage Summary Report
//         </h1>
//       </div>

//       <IndentUsageSummarySearch
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//       />

//       {/* Export Modal */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 sm:pt-16">
//           <style>
//             {`
//               @keyframes indentUsageModalDrop {
//                 from {
//                   opacity: 0;
//                   transform: translateY(-35px);
//                 }
//                 to {
//                   opacity: 1;
//                   transform: translateY(0);
//                 }
//               }
//             `}
//           </style>

//           <div
//             className="w-full max-w-lg rounded-md bg-white shadow-2xl"
//             style={{
//               animation: 'indentUsageModalDrop 220ms ease-out',
//             }}
//           >
//             {/* Modal Header */}
//             <div className="flex items-center justify-between border-b border-[#dee2e6] px-4 py-4 sm:px-5">
//               <h2 className="text-[20px] font-normal text-[#343a40]">
//                 Export Indent / Usage Summary Report
//               </h2>

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 aria-label="Close export modal"
//                 className="rounded-md p-1 text-[#6c757d] transition hover:bg-gray-100 hover:text-[#343a40]"
//               >
//                 <X size={22} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="space-y-4 px-4 py-4 sm:px-5">
//               <div>
//                 <label
//                   htmlFor="exportMonth"
//                   className="mb-2 block text-[14px] font-semibold text-[#343a40]"
//                 >
//                   Select Month (Optional)
//                 </label>

//                 <input
//                   id="exportMonth"
//                   type="month"
//                   value={exportMonth}
//                   onChange={(e) => setExportMonth(e.target.value)}
//                   className="h-[38px] w-full rounded-[4px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#a5a0f2] focus:ring-2 focus:ring-[#5146e5]/10"
//                 />

//                 <p className="mt-1 text-[13px] text-[#6c757d]">
//                   Leave empty to use current month or active search month
//                 </p>
//               </div>

//               {(activeSearch.centerId ||
//                 activeSearch.productId ||
//                 activeSearch.resellerId) && (
//                 <div className="rounded-md bg-gray-50 p-3">
//                   <p className="mb-2 text-sm font-semibold text-gray-700">
//                     Current Filters:
//                   </p>

//                   <ul className="space-y-1 text-sm text-gray-600">
//                     {activeSearch.centerId && (
//                       <li>
//                         Center: {getCenterName(activeSearch.centerId)}
//                       </li>
//                     )}

//                     {activeSearch.productId && (
//                       <li>
//                         Product: {getProductName(activeSearch.productId)}
//                       </li>
//                     )}

//                     {activeSearch.resellerId && (
//                       <li>
//                         Reseller:{' '}
//                         {resellers.find(
//                           (item) => item._id === activeSearch.resellerId
//                         )?.businessName || 'Unknown Reseller'}
//                       </li>
//                     )}

//                     {activeSearch.month && (
//                       <li>Month: {getFormattedDateRange()}</li>
//                     )}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-2 border-t border-[#dee2e6] px-4 py-4 sm:px-5">
//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="inline-flex h-[38px] items-center justify-center rounded-[6px] bg-[#6c757d] px-4 text-[14px] font-normal text-white transition hover:bg-[#5a6268] focus:outline-none focus:ring-2 focus:ring-[#6c757d]/30"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={generateDetailExport}
//                 disabled={exportLoading}
//                 className="inline-flex h-[38px] items-center justify-center gap-2 rounded-[6px] bg-[#5146e5] px-4 text-[14px] font-normal text-white transition hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#5146e5]/30 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {exportLoading ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Exporting...
//                   </>
//                 ) : (
//                   <>
//                     <FileSpreadsheet size={16} />
//                     Export
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Report Card */}
//       <div className="overflow-hidden border-0 border-t-[4px] border-t-[#2f5fa7] bg-white shadow-sm">
//         {/* Toolbar */}
//         <div className="flex flex-col gap-3 border-b border-[#dee2e6] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex flex-wrap items-center gap-1.5">
//             <button
//               type="button"
//               onClick={() => setSearchModalVisible(true)}
//               className="inline-flex h-[34px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition hover:bg-[#244c87]"
//             >
//               <Search size={15} />
//               Search
//             </button>

//             {isSearchActive() && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex h-[34px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition hover:bg-[#244c87]"
//               >
//                 <RotateCcw size={14} />
//                 Reset Search
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={openExportModal}
//               disabled={exportLoading || data.length === 0}
//               className="inline-flex h-[34px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition hover:bg-[#244c87] disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Download size={14} />
//               Export
//             </button>
//           </div>

//           {/* Top Pagination */}
//           <div className="flex justify-end overflow-x-auto">
//             {renderPagination()}
//           </div>
//         </div>

//         {/* Report Body */}
//         <div className="p-4">
//           {/* Table Search */}
//           <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
//             <label
//               htmlFor="tableSearch"
//               className="text-[14px] font-semibold text-[#212529]"
//             >
//               Search:
//             </label>

//             <input
//               id="tableSearch"
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="h-[31px] w-full border border-[#d7dce2] bg-white px-2 text-[14px] outline-none focus:border-[#2f5fa7] sm:w-[220px]"
//             />
//           </div>

//           {/* Summary */}
//           <div className="mb-5 rounded-[5px] border border-[#00b9d9] bg-[#08b8d7] px-5 py-3 text-white">
//             <h3 className="mb-2 text-[17px] font-semibold">
//               Showing Result
//             </h3>

//             <div className="space-y-1 text-[15px] leading-[21px]">
//               <div>
//                 <strong className="font-semibold">Date:</strong>{' '}
//                 {getFormattedDateRange()}
//               </div>

//               {filters?.center && (
//                 <div>
//                   <strong className="font-semibold">Branch:</strong>{' '}
//                   {typeof filters.center === 'object'
//                     ? filters.center.name
//                     : filters.center}
//                 </div>
//               )}

//               {activeSearch.productId && (
//                 <div>
//                   <strong className="font-semibold">Product:</strong>{' '}
//                   {getProductName(activeSearch.productId)}
//                 </div>
//               )}

//               {activeSearch.resellerId && (
//                 <div>
//                   <strong className="font-semibold">Reseller:</strong>{' '}
//                   {resellers.find(
//                     (item) => item._id === activeSearch.resellerId
//                   )?.businessName || 'Unknown Reseller'}
//                 </div>
//               )}

//               <div>
//                 <strong className="font-semibold">Total Products:</strong>{' '}
//                 {data.length}
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="max-h-[500px] w-full overflow-auto border border-[#eeeeee]">
//             <table className="w-full min-w-[1900px] table-fixed border-collapse">
//               <colgroup>
//                 <col style={{ width: '95px' }} />
//                 <col style={{ width: '210px' }} />

//                 {TABLE_COLUMNS.map((column) => (
//                   <col key={column.key} style={{ width: '90px' }} />
//                 ))}
//               </colgroup>

//               <thead className="sticky top-0 z-10">
//                 <tr>
//                   <th
//                     onClick={() => handleSort('center.name')}
//                     className={headerClass}
//                   >
//                     <div className="flex items-center gap-1">
//                       Branch
//                       {getSortIcon('center.name')}
//                     </div>
//                   </th>

//                   <th
//                     onClick={() => handleSort('productName')}
//                     className={headerClass}
//                   >
//                     <div className="flex items-center gap-1">
//                       Product
//                       {getSortIcon('productName')}
//                     </div>
//                   </th>

//                   {TABLE_COLUMNS.map(({ key, label }) => (
//                     <th
//                       key={key}
//                       onClick={() => handleSort(key)}
//                       className={headerClass}
//                     >
//                       <div className="flex items-center gap-1">
//                         {label}
//                         {getSortIcon(key)}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length > 0 ? (
//                   <>
//                     {filteredData.map((item, idx) => (
//                       <tr
//                         key={item._id || idx}
//                         className={
//                           idx % 2 === 0
//                             ? 'bg-[#f1f2f2] hover:bg-[#e9ecef]'
//                             : 'bg-white hover:bg-[#f8f9fa]'
//                         }
//                       >
//                         <td className={cellClass}>
//                           {item.center?.name ||
//                             item.center?.centerName ||
//                             'N/A'}
//                         </td>

//                         <td className={cellClass}>
//                           {item.productName || 'N/A'}
//                         </td>

//                         {TABLE_COLUMNS.map(({ key, handler }) => (
//                           <td key={key} className={cellClass}>
//                             {handler
//                               ? renderClickableValue(
//                                   item[key],
//                                   getCellHandler(item, handler)
//                                 )
//                               : item[key] || 0}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}

//                     {/* Total Row */}
//                     <tr>
//                       <td colSpan={2} className={totalCellClass}>
//                         Total
//                       </td>

//                       {TABLE_COLUMNS.map(({ key }) => (
//                         <td key={key} className={totalCellClass}>
//                           {totals[key] || 0}
//                         </td>
//                       ))}
//                     </tr>
//                   </>
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={17}
//                       className="border border-[#eeeeee] px-4 py-10 text-center text-[15px] text-gray-500"
//                     >
//                       No data found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

          
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IndentUsageSummary;





// import React, { useEffect, useState } from 'react';
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   FileSpreadsheet,
//   RotateCcw,
//   Search,
//   X,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// import axiosInstance from '../../axiosInstance';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import IndentUsageSummarySearch from './IndentUsageSummarySearch';

// const INITIAL_SEARCH = {
//   centerId: '',
//   productId: '',
//   resellerId: '',
//   month: '',
//   startDate: '',
//   endDate: '',
// };

// const NUMERIC_FIELDS = [
//   'purchase',
//   'transferReceive',
//   'return',
//   'usage',
//   'transferGiven',
//   'nc',
//   'convert',
//   'shifting',
//   'buildingUsage',
//   'buildingDamage',
//   'other',
//   'repair',
//   'damage',
//   'distributed',
//   'replaceReturn',
//   'replaceDamage',
//   'stolenCenter',
//   'stolenField',
// ];

// const TABLE_COLUMNS = [
//   { key: 'opening', label: 'Opening' },
//   { key: 'purchase', label: 'Purchase', handler: 'purchase' },
//   {
//     key: 'transferReceive',
//     label: 'Transfer Received',
//     handler: 'transferReceive',
//   },
//   { key: 'return', label: 'Return', handler: 'return' },
//   { key: 'usage', label: 'Usage', handler: 'usage' },
//   {
//     key: 'transferGiven',
//     label: 'Transfer Given',
//     handler: 'transferGiven',
//   },
//   { key: 'nc', label: 'NC', handler: 'nc' },
//   { key: 'convert', label: 'Convert', handler: 'convert' },
//   { key: 'shifting', label: 'Shifting', handler: 'shifting' },
//   {
//     key: 'buildingUsage',
//     label: 'Building new usage',
//     handler: 'buildingUsage',
//   },
//   {
//     key: 'buildingDamage',
//     label: 'Building Damage',
//     handler: 'buildingDamage',
//   },
//   { key: 'other', label: 'Other', handler: 'other' },
//   { key: 'repair', label: 'Repair', handler: 'repair' },
//   { key: 'damage', label: 'Damage', handler: 'damage' },
//   { key: 'closing', label: 'Closing' },
// ];

// const INDIGO_BLUE = '#2f5fa7';
// const PAGINATION_PURPLE = '#5146e5';

// const IndentUsageSummary = () => {
//   const [data, setData] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [filters, setFilters] = useState(null);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [resellers, setResellers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [exportLoading, setExportLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   });

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [exportModalVisible, setExportModalVisible] = useState(false);
//   const [exportMonth, setExportMonth] = useState('');
//   const [activeSearch, setActiveSearch] = useState(INITIAL_SEARCH);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const navigate = useNavigate();

//   // ------------------------------------------------------------
//   // Helpers
//   // ------------------------------------------------------------

//   const cleanParamValue = (value) => {
//     if (!value) return value;

//     const prefixes = [
//       'center_',
//       'product_',
//       'reseller_',
//       'outlet_',
//       'warehouse_',
//     ];

//     let cleaned = value;

//     for (const prefix of prefixes) {
//       if (cleaned.startsWith(prefix)) {
//         cleaned = cleaned.replace(prefix, '');
//       }
//     }

//     return cleaned;
//   };

//   const getProductName = (productId) => {
//     if (!productId) return '';

//     const cleaned = cleanParamValue(productId);

//     if (/^[0-9a-fA-F]{24}$/.test(cleaned)) {
//       const product = products.find((item) => item._id === cleaned);
//       return product ? product.productTitle : cleaned;
//     }

//     return cleaned;
//   };

//   const getCenterName = (centerId) => {
//     if (!centerId) return '';

//     const cleaned = cleanParamValue(centerId);

//     if (/^[0-9a-fA-F]{24}$/.test(cleaned)) {
//       const center = centers.find((item) => item._id === cleaned);
//       return center ? center.centerName : cleaned;
//     }

//     return cleaned;
//   };

//   const splitMonthYear = (monthValue) => {
//     if (!monthValue || !monthValue.includes('-')) {
//       return { month: '', year: '' };
//     }

//     const [year, month] = monthValue.split('-');

//     return { month, year };
//   };

//   // ------------------------------------------------------------
//   // API
//   // ------------------------------------------------------------

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();

//       if (searchParams.centerId) {
//         params.append(
//           'centerId',
//           cleanParamValue(searchParams.centerId)
//         );
//       }

//       if (searchParams.productId) {
//         params.append(
//           'productId',
//           cleanParamValue(searchParams.productId)
//         );
//       }

//       if (searchParams.resellerId) {
//         params.append(
//           'reseller',
//           cleanParamValue(searchParams.resellerId)
//         );
//       }

//       if (searchParams.startDate && searchParams.endDate) {
//         params.append('startDate', searchParams.startDate);
//         params.append('endDate', searchParams.endDate);
//       } else if (searchParams.month) {
//         const [year, month] = searchParams.month.split('-');
//         params.append('month', month);
//         params.append('year', year);
//       }

//       params.append('page', page);

//       const url = params.toString()
//         ? `/reports/indent-usage-summary?${params.toString()}`
//         : '/reports/indent-usage-summary';

//       console.log('Fetching Usage Summary URL:', url);

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         const groupedMap = new Map();

//         (response.data.data || []).forEach((item) => {
//           const center = item.center || {};

//           const centerId =
//             center.id ||
//             center._id ||
//             item.centerId ||
//             '';

//           const productId =
//             item.productId ||
//             item.product?._id ||
//             '';

//           const productName =
//             item.productName ||
//             item.product?.productTitle ||
//             'Unknown Product';

//           const centerKey = String(
//             centerId ||
//               center.name ||
//               center.centerName ||
//               ''
//           )
//             .trim()
//             .toLowerCase();

//           const productKey = String(productId || productName)
//             .trim()
//             .toLowerCase();

//           const groupKey = `${centerKey}__${productKey}`;

//           if (!groupedMap.has(groupKey)) {
//             groupedMap.set(groupKey, {
//               _id: productId || `${centerKey}-${productKey}`,
//               center: {
//                 id: centerId,
//                 name: center.name || center.centerName || '',
//                 code: center.code || center.centerCode || '',
//                 _id: centerId,
//               },
//               productId,
//               productName,
//               opening: Number(item.opening || 0),
//               purchase: 0,
//               transferReceive: 0,
//               return: 0,
//               usage: 0,
//               transferGiven: 0,
//               nc: 0,
//               convert: 0,
//               shifting: 0,
//               buildingUsage: 0,
//               buildingDamage: 0,
//               other: 0,
//               repair: 0,
//               damage: 0,
//               distributed: 0,
//               replaceReturn: 0,
//               replaceDamage: 0,
//               stolenCenter: 0,
//               stolenField: 0,
//               closing: Number(item.closing || 0),
//             });
//           }

//           const existing = groupedMap.get(groupKey);

//           NUMERIC_FIELDS.forEach((field) => {
//             existing[field] += Number(item[field] || 0);
//           });

//           if (
//             Number(existing.opening || 0) === 0 &&
//             Number(item.opening || 0) !== 0
//           ) {
//             existing.opening = Number(item.opening);
//           }

//           if (item.closing !== undefined && item.closing !== null) {
//             existing.closing = Number(item.closing || 0);
//           }
//         });

//         const transformedData = Array.from(groupedMap.values());

//         setData(transformedData);
//         setSummary(response.data.summary || null);
//         setFilters(
//           response.data.filters ||
//             response.data.appliedFilters ||
//             null
//         );

//         setCurrentPage(response.data.pagination?.currentPage || 1);
//         setTotalPages(response.data.pagination?.totalPages || 1);
//       } else {
//         const errorMessage =
//           response.data.message ||
//           'API returned unsuccessful response';

//         setError(errorMessage);
//         console.error('Backend error:', response.data);
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get('/centers');

//       if (response.data.success) {
//         setCenters(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all');

//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers');

//       if (response.data.success) {
//         setResellers(response.data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching resellers:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//     fetchProducts();
//     fetchResellers();
//   }, []);

//   // ------------------------------------------------------------
//   // Pagination
//   // ------------------------------------------------------------

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages || page === currentPage) return;
//     fetchData(activeSearch, page);
//   };

//   const getPaginationItems = () => {
//     const pages = [];

//     if (totalPages <= 5) {
//       for (let page = 1; page <= totalPages; page += 1) {
//         pages.push(page);
//       }

//       return pages;
//     }

//     if (currentPage <= 3) {
//       pages.push(1, 2, 3, 'ellipsis', totalPages);
//       return pages;
//     }

//     if (currentPage >= totalPages - 2) {
//       pages.push(
//         1,
//         'ellipsis',
//         totalPages - 2,
//         totalPages - 1,
//         totalPages
//       );

//       return pages;
//     }

//     pages.push(
//       1,
//       'ellipsis',
//       currentPage - 1,
//       currentPage,
//       currentPage + 1,
//       'ellipsis',
//       totalPages
//     );

//     return pages;
//   };

//   // Pagination UI only.
//   const renderPagination = () => {
//     const buttonBaseClass =
//       'inline-flex h-[31px] min-w-[25px] items-center justify-center border border-[#dee2e6] bg-white px-[7px] text-[13px] font-normal leading-none transition-colors';

//     const disabledClass =
//       'cursor-not-allowed bg-[#e9ecef] text-[#6c757d]';

//     const pageClass =
//       'text-[#007bff] hover:bg-[#e9ecef]';

//     const activeClass =
//       `relative z-[1] border-[${PAGINATION_PURPLE}] bg-[${PAGINATION_PURPLE}] text-white`;

//     const pages = getPaginationItems();

//     const isFirstPage = currentPage === 1;
//     const isLastPage = currentPage === totalPages;

//     return (
//       <nav
//         aria-label="Pagination"
//         className="flex flex-wrap items-center justify-end"
//       >
//         <button
//           type="button"
//           onClick={() => handlePageChange(1)}
//           disabled={isFirstPage}
//           className={`inline-flex h-[31px] items-center justify-center rounded-l-[4px] border border-[#dee2e6] px-[9px] text-[13px] font-normal leading-none transition-colors ${
//             isFirstPage ? disabledClass : pageClass
//           }`}
//         >
//           First
//         </button>

//         <button
//           type="button"
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={isFirstPage}
//           aria-label="Previous page"
//           className={`-ml-px ${buttonBaseClass} ${
//             isFirstPage ? disabledClass : pageClass
//           }`}
//         >
//           &lt;
//         </button>

//         {pages.map((page, index) =>
//           page === 'ellipsis' ? (
//             <span
//               key={`ellipsis-${index}`}
//               className={`-ml-px ${buttonBaseClass} cursor-default text-[#6c757d]`}
//               aria-hidden="true"
//             >
//               ...
//             </span>
//           ) : (
//             <button
//               key={page}
//               type="button"
//               onClick={() => handlePageChange(page)}
//               disabled={currentPage === page}
//               aria-label={`Page ${page}`}
//               aria-current={currentPage === page ? 'page' : undefined}
//               className={`-ml-px ${buttonBaseClass} ${
//                 currentPage === page
//                   ? 'relative z-[1] border-[#5146e5] bg-[#5146e5] text-white'
//                   : pageClass
//               }`}
//             >
//               {page}
//             </button>
//           )
//         )}

//         <button
//           type="button"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={isLastPage}
//           aria-label="Next page"
//           className={`-ml-px ${buttonBaseClass} ${
//             isLastPage ? disabledClass : pageClass
//           }`}
//         >
//           &gt;
//         </button>

//         <button
//           type="button"
//           onClick={() => handlePageChange(totalPages)}
//           disabled={isLastPage}
//           className={`-ml-px inline-flex h-[31px] items-center justify-center rounded-r-[4px] border border-[#dee2e6] px-[9px] text-[13px] font-normal leading-none transition-colors ${
//             isLastPage ? disabledClass : pageClass
//           }`}
//         >
//           Last
//         </button>
//       </nav>
//     );
//   };

//   // ------------------------------------------------------------
//   // Totals
//   // ------------------------------------------------------------

//   const calculateTotals = () => {
//     const totals = {
//       opening: 0,
//       purchase: 0,
//       transferReceive: 0,
//       return: 0,
//       usage: 0,
//       transferGiven: 0,
//       nc: 0,
//       convert: 0,
//       shifting: 0,
//       buildingUsage: 0,
//       buildingDamage: 0,
//       other: 0,
//       repair: 0,
//       damage: 0,
//       closing: 0,
//       distributed: 0,
//       replaceReturn: 0,
//       replaceDamage: 0,
//       stolenCenter: 0,
//       stolenField: 0,
//     };

//     data.forEach((item) => {
//       totals.opening += parseFloat(item.opening || 0);
//       totals.purchase += parseFloat(item.purchase || 0);
//       totals.transferReceive += parseFloat(item.transferReceive || 0);
//       totals.return += parseFloat(item.return || 0);
//       totals.usage += parseFloat(item.usage || 0);
//       totals.transferGiven += parseFloat(item.transferGiven || 0);
//       totals.nc += parseFloat(item.nc || 0);
//       totals.convert += parseFloat(item.convert || 0);
//       totals.shifting += parseFloat(item.shifting || 0);
//       totals.buildingUsage += parseFloat(item.buildingUsage || 0);
//       totals.buildingDamage += parseFloat(item.buildingDamage || 0);
//       totals.other += parseFloat(item.other || 0);
//       totals.repair += parseFloat(item.repair || 0);
//       totals.damage += parseFloat(item.damage || 0);
//       totals.closing += parseFloat(item.closing || 0);
//       totals.distributed += parseFloat(item.distributed || 0);
//       totals.replaceReturn += parseFloat(item.replaceReturn || 0);
//       totals.replaceDamage += parseFloat(item.replaceDamage || 0);
//       totals.stolenCenter += parseFloat(item.stolenCenter || 0);
//       totals.stolenField += parseFloat(item.stolenField || 0);
//     });

//     return totals;
//   };

//   // ------------------------------------------------------------
//   // Sorting
//   // ------------------------------------------------------------

//   const getNestedValue = (object, key) => {
//     if (!object || !key) return '';

//     return (
//       key.split('.').reduce(
//         (current, property) => current?.[property],
//         object
//       ) ?? ''
//     );
//   };

//   const handleSort = (key) => {
//     let direction = 'ascending';

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction === 'ascending'
//     ) {
//       direction = 'descending';
//     }

//     setSortConfig({ key, direction });

//     const sortedData = [...data].sort((a, b) => {
//       const aValue = getNestedValue(a, key);
//       const bValue = getNestedValue(b, key);

//       if (aValue < bValue) {
//         return direction === 'ascending' ? -1 : 1;
//       }

//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1;
//       }

//       return 0;
//     });

//     setData(sortedData);
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return null;

//     return sortConfig.direction === 'ascending' ? (
//       <ArrowUp size={14} />
//     ) : (
//       <ArrowDown size={14} />
//     );
//   };

//   // ------------------------------------------------------------
//   // Search
//   // ------------------------------------------------------------

//   const handleSearch = (searchData) => {
//     const mergedSearchData = {
//       ...activeSearch,
//       ...searchData,
//     };

//     setActiveSearch(mergedSearchData);
//     fetchData(mergedSearchData, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch(INITIAL_SEARCH);
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const isSearchActive = () =>
//     Boolean(
//       activeSearch.centerId ||
//         activeSearch.productId ||
//         activeSearch.resellerId ||
//         activeSearch.month ||
//         activeSearch.startDate ||
//         activeSearch.endDate
//     );

//   // ------------------------------------------------------------
//   // Export
//   // ------------------------------------------------------------

//   const openExportModal = () => {
//     setExportMonth(activeSearch.month || '');
//     setExportModalVisible(true);
//   };

//   const generateDetailExport = async () => {
//     try {
//       setExportLoading(true);

//       const params = new URLSearchParams();

//       if (activeSearch.centerId) {
//         params.append(
//           'centerId',
//           cleanParamValue(activeSearch.centerId)
//         );
//       }

//       if (activeSearch.productId) {
//         params.append(
//           'productId',
//           cleanParamValue(activeSearch.productId)
//         );
//       }

//       if (activeSearch.resellerId) {
//         params.append(
//           'reseller',
//           cleanParamValue(activeSearch.resellerId)
//         );
//       }

//       if (exportMonth) {
//         const [year, month] = exportMonth.split('-');
//         params.append('month', month);
//         params.append('year', year);
//       } else if (activeSearch.startDate && activeSearch.endDate) {
//         params.append('startDate', activeSearch.startDate);
//         params.append('endDate', activeSearch.endDate);
//       } else if (activeSearch.month) {
//         const [year, month] = activeSearch.month.split('-');
//         params.append('month', month);
//         params.append('year', year);
//       }

//       params.append('export', 'true');

//       const apiUrl = params.toString()
//         ? `/reports/indent-usage-summary?${params.toString()}`
//         : '/reports/indent-usage-summary';

//       const response = await axiosInstance.get(apiUrl);

//       if (!response.data.success) {
//         throw new Error('API returned unsuccessful response');
//       }

//       const exportData = response.data.data || [];

//       if (!exportData.length) {
//         showError('No data available for export');
//         return;
//       }

//       const headers = [
//         'Center Name',
//         'Center Code',
//         'Product Name',
//         'Opening',
//         'Purchase',
//         'Distributed',
//         'Transfer Receive',
//         'Replace Return',
//         'Usage',
//         'Transfer Given',
//         'NC',
//         'Convert',
//         'Shifting',
//         'Building new usage',
//         'Building Damage',
//         'Other',
//         'Return',
//         'Repair',
//         'Damage',
//         'Replace Damage',
//         'Stolen Center',
//         'Stolen Field',
//         'Closing',
//       ];

//       const csvData = exportData.map((item) => {
//         const center = item.center || {};

//         return [
//           center.name || center.centerName || '',
//           center.code || center.centerCode || '',
//           item.productName || '',
//           item.opening || 0,
//           item.purchase || 0,
//           item.distributed || 0,
//           item.transferReceive || 0,
//           item.replaceReturn || 0,
//           item.usage || 0,
//           item.transferGiven || 0,
//           item.nc || 0,
//           item.convert || 0,
//           item.shifting || 0,
//           item.buildingUsage || 0,
//           item.buildingDamage || 0,
//           item.other || 0,
//           item.return || 0,
//           item.repair || 0,
//           item.damage || 0,
//           item.replaceDamage || 0,
//           item.stolenCenter || 0,
//           item.stolenField || 0,
//           item.closing || 0,
//         ];
//       });

//       let filename = 'indent_usage_summary_report';

//       const resolvedFilters =
//         response.data.filters || response.data.appliedFilters;

//       if (resolvedFilters?.month && resolvedFilters?.year) {
//         const monthName = new Date(
//           resolvedFilters.year,
//           resolvedFilters.month - 1
//         ).toLocaleString('default', {
//           month: 'long',
//         });

//         filename += `_${monthName}_${resolvedFilters.year}`;
//       } else {
//         filename += `_${new Date().toISOString().split('T')[0]}`;
//       }

//       filename += '.csv';

//       const csvContent = [
//         headers.join(','),
//         ...csvData.map((row) =>
//           row
//             .map((field) => {
//               if (field === 0) return '"0"';

//               const stringField = String(field || '');

//               return `"${stringField.replace(/"/g, '""')}"`;
//             })
//             .join(',')
//         ),
//       ].join('\n');

//       const blob = new Blob(['\uFEFF' + csvContent], {
//         type: 'text/csv;charset=utf-8;',
//       });

//       const link = document.createElement('a');
//       const downloadUrl = URL.createObjectURL(blob);

//       link.setAttribute('href', downloadUrl);
//       link.setAttribute('download', filename);
//       link.style.visibility = 'hidden';

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(downloadUrl);

//       showSuccess('Export completed successfully!');
//       setExportModalVisible(false);
//       setExportMonth('');
//     } catch (error) {
//       console.error('Error generating export:', error);
//       showError('Error generating export file');
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // ------------------------------------------------------------
//   // Date
//   // ------------------------------------------------------------

//   const formatDateForDisplay = (dateString) => {
//     if (!dateString) return '';

//     const match = String(dateString).match(
//       /^(\d{4})-(\d{2})-(\d{2})$/
//     );

//     if (match) {
//       const [, year, month, day] = match;
//       return `${day}-${month}-${year}`;
//     }

//     const date = new Date(dateString);

//     if (Number.isNaN(date.getTime())) {
//       return String(dateString);
//     }

//     return `${String(date.getDate()).padStart(2, '0')}-${String(
//       date.getMonth() + 1
//     ).padStart(2, '0')}-${date.getFullYear()}`;
//   };

//   const getFormattedDateRange = () => {
//     if (activeSearch.startDate && activeSearch.endDate) {
//       return `${formatDateForDisplay(
//         activeSearch.startDate
//       )} to ${formatDateForDisplay(activeSearch.endDate)}`;
//     }

//     if (
//       filters?.dateRange?.startDate &&
//       filters?.dateRange?.endDate
//     ) {
//       return `${formatDateForDisplay(
//         filters.dateRange.startDate
//       )} to ${formatDateForDisplay(filters.dateRange.endDate)}`;
//     }

//     if (filters?.month && filters?.year) {
//       const monthName = new Date(
//         filters.year,
//         filters.month - 1
//       ).toLocaleString('default', {
//         month: 'long',
//       });

//       return `${monthName}-${filters.year}`;
//     }

//     if (activeSearch.month) {
//       const [year, month] = activeSearch.month.split('-');

//       const monthName = new Date(
//         parseInt(year, 10),
//         parseInt(month, 10) - 1
//       ).toLocaleString('default', {
//         month: 'long',
//       });

//       return `${monthName}-${year}`;
//     }

//     const now = new Date();

//     return `${now.toLocaleString('default', {
//       month: 'long',
//     })}-${now.getFullYear()}`;
//   };

//   // ------------------------------------------------------------
//   // Frontend Search
//   // ------------------------------------------------------------

//   const filteredData = data.filter((item) => {
//     if (!searchTerm.trim()) return true;

//     return Object.values(item).some((value) => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(
//           (nestedValue) =>
//             nestedValue &&
//             nestedValue
//               .toString()
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase())
//         );
//       }

//       return (
//         value &&
//         value
//           .toString()
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     });
//   });

//   const totals = calculateTotals();

//   // ------------------------------------------------------------
//   // Click Handlers
//   // ------------------------------------------------------------

//   const handleUsageClick = (item) => {
//     if (item.usage > 0) {
//       const productName = getProductName(item.productId);

//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const centerName = getCenterName(centerId);

//       const { month, year } = splitMonthYear(activeSearch.month);

//       const summaryTotalQuantity = Number(item.usage || 0);

//       navigate('/usage-detail', {
//         state: {
//           product: productName,
//           center: centerName,
//           productId: item.productId || '',
//           centerId,
//           productName: item.productName || productName,
//           centerName,
//           month,
//           year,
//           summaryTotalQuantity,
//           fromSummary: true,
//         },
//       });
//     }
//   };

//   const handleTransferReceiveClick = (item) => {
//     if (item.transferReceive > 0) {
//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error('Missing center or product ID:', {
//           centerId,
//           productId,
//         });
//         return;
//       }

//       const productName = getProductName(productId);
//       const centerName = getCenterName(centerId);

//       const params = new URLSearchParams({
//         product: productName,
//         center: centerName,
//         transferType: 'receive',
//       });

//       navigate(`/transfer-detail?${params.toString()}`);
//     }
//   };

//   const handleTransferGivenClick = (item) => {
//     if (item.transferGiven > 0) {
//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error('Missing center or product ID:', {
//           centerId,
//           productId,
//         });
//         return;
//       }

//       const productName = getProductName(productId);
//       const centerName = getCenterName(centerId);

//       const params = new URLSearchParams({
//         product: productName,
//         center: centerName,
//         transferType: 'given',
//       });

//       navigate(`/transfer-detail?${params.toString()}`);
//     }
//   };

//   const handleFieldClick = (item, field, type) => {
//     const value = item[field] || 0;

//     if (value > 0) {
//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error('Missing center or product ID:', {
//           centerId,
//           productId,
//         });
//         return;
//       }

//       const productName = getProductName(productId);
//       const centerName = getCenterName(centerId);

//       const params = new URLSearchParams({
//         product: productName,
//         center: centerName,
//         usageType: type,
//         productName: encodeURIComponent(item.productName || ''),
//         centerName: encodeURIComponent(
//           item.center?.name || item.center?.centerName || ''
//         ),
//         month: activeSearch.month || '',
//       });

//       navigate(`/transaction-report?${params.toString()}`);
//     }
//   };

//   const handleNcClick = (item) =>
//     handleFieldClick(item, 'nc', 'Customer');

//   const handleConvertClick = (item) =>
//     handleFieldClick(item, 'convert', 'Customer');

//   const handleShiftingClick = (item) =>
//     handleFieldClick(item, 'shifting', 'Customer');

//   const handleBuildingUsageClick = (item) =>
//     handleFieldClick(item, 'buildingUsage', 'Building');

//   const handleBuildingDamageClick = (item) =>
//     handleFieldClick(item, 'buildingDamage', 'building');

//   const handleOtherClick = (item) =>
//     handleFieldClick(item, 'other', 'other');

//   const handleDamageClick = (item) =>
//     handleFieldClick(item, 'damage', 'Damage');

//   const handleRepairClick = (item) =>
//     handleFieldClick(item, 'repair', 'Customer');

//   const handleReturnClick = (item) =>
//     handleFieldClick(item, 'return', 'Customer');

//   const handlePurchaseClick = (item) => {
//     if (item.purchase > 0) {
//       const centerId =
//         item.center?.id ||
//         item.center?._id ||
//         '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error('Missing center or product ID:', {
//           centerId,
//           productId,
//         });
//         return;
//       }

//       const productName = getProductName(productId);
//       const centerName = getCenterName(centerId);

//       const params = new URLSearchParams({
//         product: productName,
//         center: centerName,
//         productName: encodeURIComponent(item.productName || ''),
//         centerName: encodeURIComponent(
//           item.center?.name || item.center?.centerName || ''
//         ),
//         month: activeSearch.month || '',
//         transactionType: 'purchase',
//       });

//       navigate(`/indent-detail?${params.toString()}`);
//     }
//   };

//   // ------------------------------------------------------------
//   // Loading / Error
//   // ------------------------------------------------------------

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     );
//   }

//   // ------------------------------------------------------------
//   // Table UI Helpers
//   // ------------------------------------------------------------

//   const clickableClass = (value) =>
//     value > 0
//       ? 'cursor-pointer font-medium text-[#2f5fa7] hover:text-blue-800 hover:underline'
//       : 'cursor-default text-gray-600';

//   const renderClickableValue = (value, handler) => (
//     <button
//       type="button"
//       onClick={handler}
//       disabled={value === 0}
//       className={`border-0 bg-transparent p-0 ${clickableClass(value)}`}
//     >
//       {value || 0}
//     </button>
//   );

//   const getCellHandler = (item, handler) => {
//     const handlers = {
//       purchase: () => handlePurchaseClick(item),
//       transferReceive: () => handleTransferReceiveClick(item),
//       return: () => handleReturnClick(item),
//       usage: () => handleUsageClick(item),
//       transferGiven: () => handleTransferGivenClick(item),
//       nc: () => handleNcClick(item),
//       convert: () => handleConvertClick(item),
//       shifting: () => handleShiftingClick(item),
//       buildingUsage: () => handleBuildingUsageClick(item),
//       buildingDamage: () => handleBuildingDamageClick(item),
//       other: () => handleOtherClick(item),
//       repair: () => handleRepairClick(item),
//       damage: () => handleDamageClick(item),
//     };

//     return handlers[handler];
//   };

//   const headerClass =
//     'h-[88px] cursor-pointer border border-[#eeeeee] bg-white px-[9px] py-2 text-left align-bottom text-[16px] font-semibold leading-6 text-black hover:bg-gray-50';

//   const cellClass =
//     'border border-[#eeeeee] px-[9px] py-[9px] text-[16px] leading-6 text-black align-top';

//   const totalCellClass =
//     'border border-[#eeeeee] bg-[#d5e8ce] px-[9px] py-[9px] text-[16px] font-semibold leading-6 text-black';

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
//       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//         <h1 className="text-[24px] font-normal text-[#212529]">
//           Indent / Usage Summary Report
//         </h1>
//       </div>

//       <IndentUsageSummarySearch
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//       />

//       {/* Export Modal */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 sm:pt-16">
//           <style>
//             {`
//               @keyframes indentUsageModalDrop {
//                 from {
//                   opacity: 0;
//                   transform: translateY(-35px);
//                 }
//                 to {
//                   opacity: 1;
//                   transform: translateY(0);
//                 }
//               }
//             `}
//           </style>

//           <div
//             className="w-full max-w-lg rounded-md bg-white shadow-2xl"
//             style={{
//               animation: 'indentUsageModalDrop 220ms ease-out',
//             }}
//           >
//             {/* Modal Header */}
//             <div className="flex items-center justify-between border-b border-[#dee2e6] px-4 py-4 sm:px-5">
//               <h2 className="text-[20px] font-normal text-[#343a40]">
//                 Export Indent / Usage Summary Report
//               </h2>

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 aria-label="Close export modal"
//                 className="rounded-md p-1 text-[#6c757d] transition hover:bg-gray-100 hover:text-[#343a40]"
//               >
//                 <X size={22} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="space-y-4 px-4 py-4 sm:px-5">
//               <div>
//                 <label
//                   htmlFor="exportMonth"
//                   className="mb-2 block text-[14px] font-semibold text-[#343a40]"
//                 >
//                   Select Month (Optional)
//                 </label>

//                 <input
//                   id="exportMonth"
//                   type="month"
//                   value={exportMonth}
//                   onChange={(e) => setExportMonth(e.target.value)}
//                   className="h-[38px] w-full rounded-[4px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#a5a0f2] focus:ring-2 focus:ring-[#5146e5]/10"
//                 />

//                 <p className="mt-1 text-[13px] text-[#6c757d]">
//                   Leave empty to use current month or active search month
//                 </p>
//               </div>

//               {(activeSearch.centerId ||
//                 activeSearch.productId ||
//                 activeSearch.resellerId) && (
//                 <div className="rounded-md bg-gray-50 p-3">
//                   <p className="mb-2 text-sm font-semibold text-gray-700">
//                     Current Filters:
//                   </p>

//                   <ul className="space-y-1 text-sm text-gray-600">
//                     {activeSearch.centerId && (
//                       <li>
//                         Center: {getCenterName(activeSearch.centerId)}
//                       </li>
//                     )}

//                     {activeSearch.productId && (
//                       <li>
//                         Product: {getProductName(activeSearch.productId)}
//                       </li>
//                     )}

//                     {activeSearch.resellerId && (
//                       <li>
//                         Reseller:{' '}
//                         {resellers.find(
//                           (item) => item._id === activeSearch.resellerId
//                         )?.businessName || 'Unknown Reseller'}
//                       </li>
//                     )}

//                     {activeSearch.month && (
//                       <li>Month: {getFormattedDateRange()}</li>
//                     )}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-2 border-t border-[#dee2e6] px-4 py-4 sm:px-5">
//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="inline-flex h-[38px] items-center justify-center rounded-[6px] bg-[#6c757d] px-4 text-[14px] font-normal text-white transition hover:bg-[#5a6268] focus:outline-none focus:ring-2 focus:ring-[#6c757d]/30"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={generateDetailExport}
//                 disabled={exportLoading}
//                 className="inline-flex h-[38px] items-center justify-center gap-2 rounded-[6px] bg-[#5146e5] px-4 text-[14px] font-normal text-white transition hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#5146e5]/30 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {exportLoading ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Exporting...
//                   </>
//                 ) : (
//                   <>
//                     <FileSpreadsheet size={16} />
//                     Export
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Report Card */}
//       <div className="overflow-hidden border-0 border-t-[4px] border-t-[#2f5fa7] bg-white shadow-sm">
//         {/* Toolbar */}
//         <div className="flex flex-col gap-3 border-b border-[#dee2e6] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex flex-wrap items-center gap-1.5">
//             <button
//               type="button"
//               onClick={() => setSearchModalVisible(true)}
//               className="inline-flex h-[34px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition hover:bg-[#244c87]"
//             >
//               <Search size={15} />
//               Search
//             </button>

//             {isSearchActive() && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex h-[34px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition hover:bg-[#244c87]"
//               >
//                 <RotateCcw size={14} />
//                 Reset Search
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={openExportModal}
//               disabled={exportLoading || data.length === 0}
//               className="inline-flex h-[34px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition hover:bg-[#244c87] disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Download size={14} />
//               Export
//             </button>
//           </div>

//           {/* Top Pagination */}
//           <div className="flex justify-end overflow-x-auto">
//             {renderPagination()}
//           </div>
//         </div>

//         {/* Report Body */}
//         <div className="p-4">
//           {/* Table Search */}
//           <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
//             <label
//               htmlFor="tableSearch"
//               className="text-[14px] font-semibold text-[#212529]"
//             >
//               Search:
//             </label>

//             <input
//               id="tableSearch"
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="h-[31px] w-full border border-[#d7dce2] bg-white px-2 text-[14px] outline-none focus:border-[#2f5fa7] sm:w-[220px]"
//             />
//           </div>

//           {/* Summary */}
//           <div className="mb-5 rounded-[5px] border border-[#00b9d9] bg-[#08b8d7] px-5 py-3 text-white">
//             <h3 className="mb-2 text-[17px] font-semibold">
//               Showing Result
//             </h3>

//             <div className="space-y-1 text-[15px] leading-[21px]">
//               <div>
//                 <strong className="font-semibold">Date:</strong>{' '}
//                 {getFormattedDateRange()}
//               </div>

//               {filters?.center && (
//                 <div>
//                   <strong className="font-semibold">Branch:</strong>{' '}
//                   {typeof filters.center === 'object'
//                     ? filters.center.name
//                     : filters.center}
//                 </div>
//               )}

//               {activeSearch.productId && (
//                 <div>
//                   <strong className="font-semibold">Product:</strong>{' '}
//                   {getProductName(activeSearch.productId)}
//                 </div>
//               )}

//               {activeSearch.resellerId && (
//                 <div>
//                   <strong className="font-semibold">Reseller:</strong>{' '}
//                   {resellers.find(
//                     (item) => item._id === activeSearch.resellerId
//                   )?.businessName || 'Unknown Reseller'}
//                 </div>
//               )}

//               <div>
//                 <strong className="font-semibold">Total Products:</strong>{' '}
//                 {data.length}
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="max-h-[500px] w-full overflow-auto border border-[#eeeeee]">
//             <table className="w-full min-w-[1900px] table-fixed border-collapse">
//               <colgroup>
//                 <col style={{ width: '95px' }} />
//                 <col style={{ width: '210px' }} />

//                 {TABLE_COLUMNS.map((column) => (
//                   <col key={column.key} style={{ width: '90px' }} />
//                 ))}
//               </colgroup>

//               <thead className="sticky top-0 z-10">
//                 <tr>
//                   <th
//                     onClick={() => handleSort('center.name')}
//                     className={headerClass}
//                   >
//                     <div className="flex items-center gap-1">
//                       Branch
//                       {getSortIcon('center.name')}
//                     </div>
//                   </th>

//                   <th
//                     onClick={() => handleSort('productName')}
//                     className={headerClass}
//                   >
//                     <div className="flex items-center gap-1">
//                       Product
//                       {getSortIcon('productName')}
//                     </div>
//                   </th>

//                   {TABLE_COLUMNS.map(({ key, label }) => (
//                     <th
//                       key={key}
//                       onClick={() => handleSort(key)}
//                       className={headerClass}
//                     >
//                       <div className="flex items-center gap-1">
//                         {label}
//                         {getSortIcon(key)}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length > 0 ? (
//                   filteredData.map((item, idx) => (
//                     <tr
//                       key={item._id || idx}
//                       className={
//                         idx % 2 === 0
//                           ? 'bg-[#f1f2f2] hover:bg-[#e9ecef]'
//                           : 'bg-white hover:bg-[#f8f9fa]'
//                       }
//                     >
//                       <td className={cellClass}>
//                         {item.center?.name ||
//                           item.center?.centerName ||
//                           'N/A'}
//                       </td>

//                       <td className={cellClass}>
//                         {item.productName || 'N/A'}
//                       </td>

//                       {TABLE_COLUMNS.map(({ key, handler }) => (
//                         <td key={key} className={cellClass}>
//                           {handler
//                             ? renderClickableValue(
//                                 item[key],
//                                 getCellHandler(item, handler)
//                               )
//                             : item[key] || 0}
//                         </td>
//                       ))}
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={17}
//                       className="border border-[#eeeeee] px-4 py-10 text-center text-[15px] text-gray-500"
//                     >
//                       No data found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>

//               {/* Total Row - kept inside the same table so horizontal
//                   scrolling always moves the Total row together with
//                   all table columns */}
//               {filteredData.length > 0 && (
//                 <tfoot>
//                   <tr className="sticky bottom-0 z-10">
//                     <td colSpan={2} className={totalCellClass}>
//                       Total
//                     </td>

//                     {TABLE_COLUMNS.map(({ key }) => (
//                       <td key={key} className={totalCellClass}>
//                         {totals[key] || 0}
//                       </td>
//                     ))}
//                   </tr>
//                 </tfoot>
//               )}
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IndentUsageSummary;






// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   ArrowDown,
//   ArrowUp,
//   Download,
//   FileSpreadsheet,
//   RotateCcw,
//   Search,
//   X,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// import axiosInstance from '../../axiosInstance';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import IndentUsageSummarySearch from './IndentUsageSummarySearch';

// const INITIAL_SEARCH = {
//   centerId: '',
//   productId: '',
//   resellerId: '',
//   month: '',
//   startDate: '',
//   endDate: '',
// };

// const NUMERIC_FIELDS = [
//   'purchase',
//   'transferReceive',
//   'return',
//   'usage',
//   'transferGiven',
//   'nc',
//   'convert',
//   'shifting',
//   'buildingUsage',
//   'buildingDamage',
//   'other',
//   'repair',
//   'damage',
//   'distributed',
//   'replaceReturn',
//   'replaceDamage',
//   'stolenCenter',
//   'stolenField',
// ];

// const TOTAL_KEYS = ['opening', ...NUMERIC_FIELDS, 'closing'];

// const TABLE_COLUMNS = [
//   { key: 'opening', label: 'Opening' },
//   { key: 'purchase', label: 'Purchase', handler: 'purchase' },
//   {
//     key: 'transferReceive',
//     label: 'Transfer Received',
//     handler: 'transferReceive',
//   },
//   { key: 'return', label: 'Return', handler: 'return' },
//   { key: 'usage', label: 'Usage', handler: 'usage' },
//   {
//     key: 'transferGiven',
//     label: 'Transfer Given',
//     handler: 'transferGiven',
//   },
//   { key: 'nc', label: 'NC', handler: 'nc' },
//   { key: 'convert', label: 'Convert', handler: 'convert' },
//   { key: 'shifting', label: 'Shifting', handler: 'shifting' },
//   {
//     key: 'buildingUsage',
//     label: 'Building new usage',
//     handler: 'buildingUsage',
//   },
//   {
//     key: 'buildingDamage',
//     label: 'Building Damage',
//     handler: 'buildingDamage',
//   },
//   { key: 'other', label: 'Other', handler: 'other' },
//   { key: 'repair', label: 'Repair', handler: 'repair' },
//   { key: 'damage', label: 'Damage', handler: 'damage' },
//   { key: 'closing', label: 'Closing' },
// ];

// // ------------------------------------------------------------
// // Pure helpers (outside component so they are stable)
// // ------------------------------------------------------------

// const cleanParamValue = (value) => {
//   if (!value) return value;

//   const prefixes = [
//     'center_',
//     'product_',
//     'reseller_',
//     'outlet_',
//     'warehouse_',
//   ];

//   let cleaned = value;

//   for (const prefix of prefixes) {
//     if (cleaned.startsWith(prefix)) {
//       cleaned = cleaned.replace(prefix, '');
//     }
//   }

//   return cleaned;
// };

// const buildQueryString = (searchParams = {}, extra = {}) => {
//   const params = new URLSearchParams();

//   if (searchParams.centerId) {
//     params.append('centerId', cleanParamValue(searchParams.centerId));
//   }

//   if (searchParams.productId) {
//     params.append('productId', cleanParamValue(searchParams.productId));
//   }

//   if (searchParams.resellerId) {
//     params.append('reseller', cleanParamValue(searchParams.resellerId));
//   }

//   if (searchParams.startDate && searchParams.endDate) {
//     params.append('startDate', searchParams.startDate);
//     params.append('endDate', searchParams.endDate);
//   } else if (searchParams.month) {
//     const [year, month] = searchParams.month.split('-');
//     params.append('month', month);
//     params.append('year', year);
//   }

//   Object.entries(extra).forEach(([key, value]) => {
//     params.append(key, value);
//   });

//   return params.toString();
// };

// // Merge raw API rows into one row per (center + product)
// const groupRows = (rows = []) => {
//   const groupedMap = new Map();

//   rows.forEach((item) => {
//     const center = item.center || {};

//     const centerId = center.id || center._id || item.centerId || '';

//     const productId = item.productId || item.product?._id || '';

//     const productName =
//       item.productName || item.product?.productTitle || 'Unknown Product';

//     const centerKey = String(
//       centerId || center.name || center.centerName || ''
//     )
//       .trim()
//       .toLowerCase();

//     const productKey = String(productId || productName)
//       .trim()
//       .toLowerCase();

//     const groupKey = `${centerKey}__${productKey}`;

//     if (!groupedMap.has(groupKey)) {
//       groupedMap.set(groupKey, {
//         _id: `${centerKey}-${productKey}`,
//         center: {
//           id: centerId,
//           name: center.name || center.centerName || '',
//           code: center.code || center.centerCode || '',
//           _id: centerId,
//         },
//         productId,
//         productName,
//         opening: Number(item.opening || 0),
//         purchase: 0,
//         transferReceive: 0,
//         return: 0,
//         usage: 0,
//         transferGiven: 0,
//         nc: 0,
//         convert: 0,
//         shifting: 0,
//         buildingUsage: 0,
//         buildingDamage: 0,
//         other: 0,
//         repair: 0,
//         damage: 0,
//         distributed: 0,
//         replaceReturn: 0,
//         replaceDamage: 0,
//         stolenCenter: 0,
//         stolenField: 0,
//         closing: Number(item.closing || 0),
//       });
//     }

//     const existing = groupedMap.get(groupKey);

//     NUMERIC_FIELDS.forEach((field) => {
//       existing[field] += Number(item[field] || 0);
//     });

//     if (
//       Number(existing.opening || 0) === 0 &&
//       Number(item.opening || 0) !== 0
//     ) {
//       existing.opening = Number(item.opening);
//     }

//     if (item.closing !== undefined && item.closing !== null) {
//       existing.closing = Number(item.closing || 0);
//     }
//   });

//   return Array.from(groupedMap.values());
// };

// const normalizeText = (value) =>
//   String(value ?? '')
//     .toLowerCase()
//     .replace(/\s+/g, ' ')
//     .trim();

// const getNestedValue = (object, key) => {
//   if (!object || !key) return '';

//   return (
//     key.split('.').reduce((current, property) => current?.[property], object) ??
//     ''
//   );
// };

// const IndentUsageSummary = () => {
//   const [data, setData] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [filters, setFilters] = useState(null);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [resellers, setResellers] = useState([]);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [exportLoading, setExportLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   });

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [exportModalVisible, setExportModalVisible] = useState(false);
//   const [exportMonth, setExportMonth] = useState('');
//   const [activeSearch, setActiveSearch] = useState(INITIAL_SEARCH);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Full (all pages) dataset used only while typing in the table search box
//   const [allData, setAllData] = useState(null);
//   const [allDataLoading, setAllDataLoading] = useState(false);

//   const navigate = useNavigate();

//   const isTableSearching = searchTerm.trim().length > 0;

//   // ------------------------------------------------------------
//   // Helpers
//   // ------------------------------------------------------------

//   const getProductName = (productId) => {
//     if (!productId) return '';

//     const cleaned = cleanParamValue(productId);

//     if (/^[0-9a-fA-F]{24}$/.test(cleaned)) {
//       const product = products.find((item) => item._id === cleaned);
//       return product ? product.productTitle : cleaned;
//     }

//     return cleaned;
//   };

//   const getCenterName = (centerId) => {
//     if (!centerId) return '';

//     const cleaned = cleanParamValue(centerId);

//     if (/^[0-9a-fA-F]{24}$/.test(cleaned)) {
//       const center = centers.find((item) => item._id === cleaned);
//       return center ? center.centerName : cleaned;
//     }

//     return cleaned;
//   };

//   const splitMonthYear = (monthValue) => {
//     if (!monthValue || !monthValue.includes('-')) {
//       return { month: '', year: '' };
//     }

//     const [year, month] = monthValue.split('-');

//     return { month, year };
//   };

//   // ------------------------------------------------------------
//   // API
//   // ------------------------------------------------------------

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const query = buildQueryString(searchParams, { page });
//       const url = `/reports/indent-usage-summary?${query}`;

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         setData(groupRows(response.data.data || []));
//         setSummary(response.data.summary || null);
//         setFilters(
//           response.data.filters || response.data.appliedFilters || null
//         );

//         setCurrentPage(response.data.pagination?.currentPage || 1);
//         setTotalPages(response.data.pagination?.totalPages || 1);
//       } else {
//         setError(
//           response.data.message || 'API returned unsuccessful response'
//         );
//         console.error('Backend error:', response.data);
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//       setInitialLoading(false);
//     }
//   };

//   // Loads every row (all pages) for the current filters, so the table
//   // search box can find products that are not on the current page.
//   const fetchAllRows = async (searchParams) => {
//     const query = buildQueryString(searchParams, { export: 'true' });
//     const response = await axiosInstance.get(
//       `/reports/indent-usage-summary?${query}`
//     );

//     if (!response.data.success) {
//       throw new Error('API returned unsuccessful response');
//     }

//     return groupRows(response.data.data || []);
//   };

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get('/centers');

//       if (response.data.success) {
//         setCenters(response.data.data);
//       }
//     } catch (err) {
//       console.error('Error fetching centers:', err);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all');

//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (err) {
//       console.error('Error fetching products:', err);
//     }
//   };

//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers');

//       if (response.data.success) {
//         setResellers(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching resellers:', err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//     fetchProducts();
//     fetchResellers();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // When the user types in the table search box, load the full dataset once
//   // (debounced) so the search covers all pages, not just the current one.
//   useEffect(() => {
//     if (!searchTerm.trim() || allData !== null) return undefined;

//     let cancelled = false;

//     const timer = setTimeout(async () => {
//       try {
//         setAllDataLoading(true);
//         const rows = await fetchAllRows(activeSearch);
//         if (!cancelled) setAllData(rows);
//       } catch (err) {
//         console.error('Error loading data for search:', err);
//         if (!cancelled) showError('Could not load data for searching');
//       } finally {
//         if (!cancelled) setAllDataLoading(false);
//       }
//     }, 300);

//     return () => {
//       cancelled = true;
//       clearTimeout(timer);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchTerm, activeSearch, allData]);

//   // ------------------------------------------------------------
//   // Derived data: search + sort
//   // ------------------------------------------------------------

//   const filteredData = useMemo(() => {
//     const term = normalizeText(searchTerm);

//     // While searching use all pages (fall back to current page until loaded)
//     const source = term ? allData ?? data : data;

//     let rows = source;

//     if (term) {
//       const tokens = term.split(' ');

//       rows = source.filter((item) => {
//         const haystack = normalizeText(
//           [
//             item.productName,
//             item.center?.name,
//             item.center?.code,
//           ].join(' ')
//         );

//         return tokens.every((token) => haystack.includes(token));
//       });
//     }

//     if (!sortConfig.key) return rows;

//     const direction = sortConfig.direction === 'ascending' ? 1 : -1;

//     return [...rows].sort((a, b) => {
//       const aValue = getNestedValue(a, sortConfig.key);
//       const bValue = getNestedValue(b, sortConfig.key);

//       if (typeof aValue === 'number' && typeof bValue === 'number') {
//         return (aValue - bValue) * direction;
//       }

//       return (
//         String(aValue).localeCompare(String(bValue), undefined, {
//           sensitivity: 'base',
//           numeric: true,
//         }) * direction
//       );
//     });
//   }, [data, allData, searchTerm, sortConfig]);

//   const totals = useMemo(() => {
//     const result = {};

//     TOTAL_KEYS.forEach((key) => {
//       result[key] = 0;
//     });

//     filteredData.forEach((item) => {
//       TOTAL_KEYS.forEach((key) => {
//         result[key] += parseFloat(item[key] || 0);
//       });
//     });

//     return result;
//   }, [filteredData]);

//   // ------------------------------------------------------------
//   // Pagination
//   // ------------------------------------------------------------

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages || page === currentPage) return;
//     fetchData(activeSearch, page);
//   };

//   const getPaginationItems = () => {
//     const pages = [];

//     if (totalPages <= 5) {
//       for (let page = 1; page <= totalPages; page += 1) {
//         pages.push(page);
//       }

//       return pages;
//     }

//     if (currentPage <= 3) {
//       pages.push(1, 2, 3, 'ellipsis', totalPages);
//       return pages;
//     }

//     if (currentPage >= totalPages - 2) {
//       pages.push(1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages);
//       return pages;
//     }

//     pages.push(
//       1,
//       'ellipsis',
//       currentPage - 1,
//       currentPage,
//       currentPage + 1,
//       'ellipsis',
//       totalPages
//     );

//     return pages;
//   };

//   const renderPagination = () => {
//     const buttonBaseClass =
//       'inline-flex h-[31px] min-w-[25px] items-center justify-center border border-[#dee2e6] bg-white px-[7px] text-[13px] font-normal leading-none transition-colors';

//     const disabledClass = 'cursor-not-allowed bg-[#e9ecef] text-[#6c757d]';

//     const pageClass = 'text-[#007bff] hover:bg-[#e9ecef]';

//     const pages = getPaginationItems();

//     const isFirstPage = currentPage === 1;
//     const isLastPage = currentPage === totalPages;

//     return (
//       <nav
//         aria-label="Pagination"
//         className="flex flex-wrap items-center justify-end"
//       >
//         <button
//           type="button"
//           onClick={() => handlePageChange(1)}
//           disabled={isFirstPage}
//           className={`inline-flex h-[31px] items-center justify-center rounded-l-[4px] border border-[#dee2e6] px-[9px] text-[13px] font-normal leading-none transition-colors ${
//             isFirstPage ? disabledClass : pageClass
//           }`}
//         >
//           First
//         </button>

//         <button
//           type="button"
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={isFirstPage}
//           aria-label="Previous page"
//           className={`-ml-px ${buttonBaseClass} ${
//             isFirstPage ? disabledClass : pageClass
//           }`}
//         >
//           &lt;
//         </button>

//         {pages.map((page, index) =>
//           page === 'ellipsis' ? (
//             <span
//               key={`ellipsis-${index}`}
//               className={`-ml-px ${buttonBaseClass} cursor-default text-[#6c757d]`}
//               aria-hidden="true"
//             >
//               ...
//             </span>
//           ) : (
//             <button
//               key={page}
//               type="button"
//               onClick={() => handlePageChange(page)}
//               disabled={currentPage === page}
//               aria-label={`Page ${page}`}
//               aria-current={currentPage === page ? 'page' : undefined}
//               className={`-ml-px ${buttonBaseClass} ${
//                 currentPage === page
//                   ? 'relative z-[1] border-[#5146e5] bg-[#5146e5] text-white'
//                   : pageClass
//               }`}
//             >
//               {page}
//             </button>
//           )
//         )}

//         <button
//           type="button"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={isLastPage}
//           aria-label="Next page"
//           className={`-ml-px ${buttonBaseClass} ${
//             isLastPage ? disabledClass : pageClass
//           }`}
//         >
//           &gt;
//         </button>

//         <button
//           type="button"
//           onClick={() => handlePageChange(totalPages)}
//           disabled={isLastPage}
//           className={`-ml-px inline-flex h-[31px] items-center justify-center rounded-r-[4px] border border-[#dee2e6] px-[9px] text-[13px] font-normal leading-none transition-colors ${
//             isLastPage ? disabledClass : pageClass
//           }`}
//         >
//           Last
//         </button>
//       </nav>
//     );
//   };

//   // ------------------------------------------------------------
//   // Sorting
//   // ------------------------------------------------------------

//   const handleSort = (key) => {
//     const direction =
//       sortConfig.key === key && sortConfig.direction === 'ascending'
//         ? 'descending'
//         : 'ascending';

//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return null;

//     return sortConfig.direction === 'ascending' ? (
//       <ArrowUp size={14} />
//     ) : (
//       <ArrowDown size={14} />
//     );
//   };

//   // ------------------------------------------------------------
//   // Search (modal filters)
//   // ------------------------------------------------------------

//   const handleSearch = (searchData) => {
//     const mergedSearchData = {
//       ...activeSearch,
//       ...searchData,
//     };

//     setAllData(null); // filters changed -> cached full dataset is stale
//     setActiveSearch(mergedSearchData);
//     fetchData(mergedSearchData, 1);
//   };

//   const handleResetSearch = () => {
//     setAllData(null);
//     setActiveSearch(INITIAL_SEARCH);
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const isSearchActive = () =>
//     Boolean(
//       activeSearch.centerId ||
//         activeSearch.productId ||
//         activeSearch.resellerId ||
//         activeSearch.month ||
//         activeSearch.startDate ||
//         activeSearch.endDate
//     );

//   // ------------------------------------------------------------
//   // Export
//   // ------------------------------------------------------------

//   const openExportModal = () => {
//     setExportMonth(activeSearch.month || '');
//     setExportModalVisible(true);
//   };

//   const generateDetailExport = async () => {
//     try {
//       setExportLoading(true);

//       const exportParams = exportMonth
//         ? { ...activeSearch, month: exportMonth, startDate: '', endDate: '' }
//         : activeSearch;

//       const query = buildQueryString(exportParams, { export: 'true' });

//       const response = await axiosInstance.get(
//         `/reports/indent-usage-summary?${query}`
//       );

//       if (!response.data.success) {
//         throw new Error('API returned unsuccessful response');
//       }

//       const exportData = response.data.data || [];

//       if (!exportData.length) {
//         showError('No data available for export');
//         return;
//       }

//       const headers = [
//         'Center Name',
//         'Center Code',
//         'Product Name',
//         'Opening',
//         'Purchase',
//         'Distributed',
//         'Transfer Receive',
//         'Replace Return',
//         'Usage',
//         'Transfer Given',
//         'NC',
//         'Convert',
//         'Shifting',
//         'Building new usage',
//         'Building Damage',
//         'Other',
//         'Return',
//         'Repair',
//         'Damage',
//         'Replace Damage',
//         'Stolen Center',
//         'Stolen Field',
//         'Closing',
//       ];

//       const csvData = exportData.map((item) => {
//         const center = item.center || {};

//         return [
//           center.name || center.centerName || '',
//           center.code || center.centerCode || '',
//           item.productName || '',
//           item.opening || 0,
//           item.purchase || 0,
//           item.distributed || 0,
//           item.transferReceive || 0,
//           item.replaceReturn || 0,
//           item.usage || 0,
//           item.transferGiven || 0,
//           item.nc || 0,
//           item.convert || 0,
//           item.shifting || 0,
//           item.buildingUsage || 0,
//           item.buildingDamage || 0,
//           item.other || 0,
//           item.return || 0,
//           item.repair || 0,
//           item.damage || 0,
//           item.replaceDamage || 0,
//           item.stolenCenter || 0,
//           item.stolenField || 0,
//           item.closing || 0,
//         ];
//       });

//       let filename = 'indent_usage_summary_report';

//       const resolvedFilters =
//         response.data.filters || response.data.appliedFilters;

//       if (resolvedFilters?.month && resolvedFilters?.year) {
//         const monthName = new Date(
//           resolvedFilters.year,
//           resolvedFilters.month - 1
//         ).toLocaleString('default', {
//           month: 'long',
//         });

//         filename += `_${monthName}_${resolvedFilters.year}`;
//       } else {
//         filename += `_${new Date().toISOString().split('T')[0]}`;
//       }

//       filename += '.csv';

//       const csvContent = [
//         headers.join(','),
//         ...csvData.map((row) =>
//           row
//             .map((field) => {
//               if (field === 0) return '"0"';

//               const stringField = String(field || '');

//               return `"${stringField.replace(/"/g, '""')}"`;
//             })
//             .join(',')
//         ),
//       ].join('\n');

//       const blob = new Blob(['\uFEFF' + csvContent], {
//         type: 'text/csv;charset=utf-8;',
//       });

//       const link = document.createElement('a');
//       const downloadUrl = URL.createObjectURL(blob);

//       link.setAttribute('href', downloadUrl);
//       link.setAttribute('download', filename);
//       link.style.visibility = 'hidden';

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(downloadUrl);

//       showSuccess('Export completed successfully!');
//       setExportModalVisible(false);
//       setExportMonth('');
//     } catch (err) {
//       console.error('Error generating export:', err);
//       showError('Error generating export file');
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // ------------------------------------------------------------
//   // Date
//   // ------------------------------------------------------------

//   const formatDateForDisplay = (dateString) => {
//     if (!dateString) return '';

//     const match = String(dateString).match(/^(\d{4})-(\d{2})-(\d{2})$/);

//     if (match) {
//       const [, year, month, day] = match;
//       return `${day}-${month}-${year}`;
//     }

//     const date = new Date(dateString);

//     if (Number.isNaN(date.getTime())) {
//       return String(dateString);
//     }

//     return `${String(date.getDate()).padStart(2, '0')}-${String(
//       date.getMonth() + 1
//     ).padStart(2, '0')}-${date.getFullYear()}`;
//   };

//   const getFormattedDateRange = () => {
//     if (activeSearch.startDate && activeSearch.endDate) {
//       return `${formatDateForDisplay(
//         activeSearch.startDate
//       )} to ${formatDateForDisplay(activeSearch.endDate)}`;
//     }

//     if (filters?.dateRange?.startDate && filters?.dateRange?.endDate) {
//       return `${formatDateForDisplay(
//         filters.dateRange.startDate
//       )} to ${formatDateForDisplay(filters.dateRange.endDate)}`;
//     }

//     if (filters?.month && filters?.year) {
//       const monthName = new Date(
//         filters.year,
//         filters.month - 1
//       ).toLocaleString('default', {
//         month: 'long',
//       });

//       return `${monthName}-${filters.year}`;
//     }

//     if (activeSearch.month) {
//       const [year, month] = activeSearch.month.split('-');

//       const monthName = new Date(
//         parseInt(year, 10),
//         parseInt(month, 10) - 1
//       ).toLocaleString('default', {
//         month: 'long',
//       });

//       return `${monthName}-${year}`;
//     }

//     const now = new Date();

//     return `${now.toLocaleString('default', {
//       month: 'long',
//     })}-${now.getFullYear()}`;
//   };

//   // ------------------------------------------------------------
//   // Click Handlers
//   // ------------------------------------------------------------

//   const handleUsageClick = (item) => {
//     if (item.usage > 0) {
//       const productName = getProductName(item.productId);

//       const centerId = item.center?.id || item.center?._id || '';

//       const centerName = getCenterName(centerId);

//       const { month, year } = splitMonthYear(activeSearch.month);

//       const summaryTotalQuantity = Number(item.usage || 0);

//       navigate('/usage-detail', {
//         state: {
//           product: productName,
//           center: centerName,
//           productId: item.productId || '',
//           centerId,
//           productName: item.productName || productName,
//           centerName,
//           month,
//           year,
//           summaryTotalQuantity,
//           fromSummary: true,
//         },
//       });
//     }
//   };

//   const handleTransferClick = (item, field, transferType) => {
//     if (item[field] > 0) {
//       const centerId = item.center?.id || item.center?._id || '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error('Missing center or product ID:', {
//           centerId,
//           productId,
//         });
//         return;
//       }

//       const params = new URLSearchParams({
//         product: getProductName(productId),
//         center: getCenterName(centerId),
//         transferType,
//       });

//       navigate(`/transfer-detail?${params.toString()}`);
//     }
//   };

//   const handleTransferReceiveClick = (item) =>
//     handleTransferClick(item, 'transferReceive', 'receive');

//   const handleTransferGivenClick = (item) =>
//     handleTransferClick(item, 'transferGiven', 'given');

//   const handleFieldClick = (item, field, type) => {
//     const value = item[field] || 0;

//     if (value > 0) {
//       const centerId = item.center?.id || item.center?._id || '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error('Missing center or product ID:', {
//           centerId,
//           productId,
//         });
//         return;
//       }

//       const params = new URLSearchParams({
//         product: getProductName(productId),
//         center: getCenterName(centerId),
//         usageType: type,
//         productName: encodeURIComponent(item.productName || ''),
//         centerName: encodeURIComponent(
//           item.center?.name || item.center?.centerName || ''
//         ),
//         month: activeSearch.month || '',
//       });

//       navigate(`/transaction-report?${params.toString()}`);
//     }
//   };

//   const handleNcClick = (item) => handleFieldClick(item, 'nc', 'Customer');

//   const handleConvertClick = (item) =>
//     handleFieldClick(item, 'convert', 'Customer');

//   const handleShiftingClick = (item) =>
//     handleFieldClick(item, 'shifting', 'Customer');

//   const handleBuildingUsageClick = (item) =>
//     handleFieldClick(item, 'buildingUsage', 'Building');

//   const handleBuildingDamageClick = (item) =>
//     handleFieldClick(item, 'buildingDamage', 'building');

//   const handleOtherClick = (item) => handleFieldClick(item, 'other', 'other');

//   const handleDamageClick = (item) =>
//     handleFieldClick(item, 'damage', 'Damage');

//   const handleRepairClick = (item) =>
//     handleFieldClick(item, 'repair', 'Customer');

//   const handleReturnClick = (item) =>
//     handleFieldClick(item, 'return', 'Customer');

//   const handlePurchaseClick = (item) => {
//     if (item.purchase > 0) {
//       const centerId = item.center?.id || item.center?._id || '';

//       const productId = item.productId || '';

//       if (!centerId || !productId) {
//         console.error('Missing center or product ID:', {
//           centerId,
//           productId,
//         });
//         return;
//       }

//       const params = new URLSearchParams({
//         product: getProductName(productId),
//         center: getCenterName(centerId),
//         productName: encodeURIComponent(item.productName || ''),
//         centerName: encodeURIComponent(
//           item.center?.name || item.center?.centerName || ''
//         ),
//         month: activeSearch.month || '',
//         transactionType: 'purchase',
//       });

//       navigate(`/indent-detail?${params.toString()}`);
//     }
//   };

//   // ------------------------------------------------------------
//   // Initial Loading / Error
//   // (only the very first load replaces the page, so the search box
//   //  and filters never unmount while the user is working)
//   // ------------------------------------------------------------

//   if (initialLoading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   if (error && data.length === 0) {
//     return (
//       <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         {error}
//       </div>
//     );
//   }

//   // ------------------------------------------------------------
//   // Table UI Helpers
//   // ------------------------------------------------------------

//   const clickableClass = (value) =>
//     value > 0
//       ? 'cursor-pointer font-medium text-[#2f5fa7] hover:text-blue-800 hover:underline'
//       : 'cursor-default text-gray-600';

//   const renderClickableValue = (value, handler) => (
//     <button
//       type="button"
//       onClick={handler}
//       disabled={!value}
//       className={`border-0 bg-transparent p-0 ${clickableClass(value)}`}
//     >
//       {value || 0}
//     </button>
//   );

//   const getCellHandler = (item, handler) => {
//     const handlers = {
//       purchase: () => handlePurchaseClick(item),
//       transferReceive: () => handleTransferReceiveClick(item),
//       return: () => handleReturnClick(item),
//       usage: () => handleUsageClick(item),
//       transferGiven: () => handleTransferGivenClick(item),
//       nc: () => handleNcClick(item),
//       convert: () => handleConvertClick(item),
//       shifting: () => handleShiftingClick(item),
//       buildingUsage: () => handleBuildingUsageClick(item),
//       buildingDamage: () => handleBuildingDamageClick(item),
//       other: () => handleOtherClick(item),
//       repair: () => handleRepairClick(item),
//       damage: () => handleDamageClick(item),
//     };

//     return handlers[handler];
//   };

//   const headerClass =
//     'h-[88px] cursor-pointer border border-[#eeeeee] bg-white px-[9px] py-2 text-left align-bottom text-[16px] font-semibold leading-6 text-black hover:bg-gray-50';

//   const cellClass =
//     'border border-[#eeeeee] px-[9px] py-[9px] text-[16px] leading-6 text-black align-top';

//   const totalCellClass =
//     'border border-[#eeeeee] bg-[#d5e8ce] px-[9px] py-[9px] text-[16px] font-semibold leading-6 text-black';

//   const tableBusy = loading || (isTableSearching && allDataLoading);

//   return (
//     <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
//       <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
//         <h1 className="text-[24px] font-normal text-[#212529]">
//           Indent / Usage Summary Report
//         </h1>
//       </div>

//       <IndentUsageSummarySearch
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//       />

//       {/* Export Modal */}
//       {exportModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 sm:pt-16">
//           <style>
//             {`
//               @keyframes indentUsageModalDrop {
//                 from {
//                   opacity: 0;
//                   transform: translateY(-35px);
//                 }
//                 to {
//                   opacity: 1;
//                   transform: translateY(0);
//                 }
//               }
//             `}
//           </style>

//           <div
//             className="w-full max-w-lg rounded-md bg-white shadow-2xl"
//             style={{
//               animation: 'indentUsageModalDrop 220ms ease-out',
//             }}
//           >
//             {/* Modal Header */}
//             <div className="flex items-center justify-between border-b border-[#dee2e6] px-4 py-4 sm:px-5">
//               <h2 className="text-[20px] font-normal text-[#343a40]">
//                 Export Indent / Usage Summary Report
//               </h2>

//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 aria-label="Close export modal"
//                 className="rounded-md p-1 text-[#6c757d] transition hover:bg-gray-100 hover:text-[#343a40]"
//               >
//                 <X size={22} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="space-y-4 px-4 py-4 sm:px-5">
//               <div>
//                 <label
//                   htmlFor="exportMonth"
//                   className="mb-2 block text-[14px] font-semibold text-[#343a40]"
//                 >
//                   Select Month (Optional)
//                 </label>

//                 <input
//                   id="exportMonth"
//                   type="month"
//                   value={exportMonth}
//                   onChange={(e) => setExportMonth(e.target.value)}
//                   className="h-[38px] w-full rounded-[4px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#a5a0f2] focus:ring-2 focus:ring-[#5146e5]/10"
//                 />

//                 <p className="mt-1 text-[13px] text-[#6c757d]">
//                   Leave empty to use current month or active search month
//                 </p>
//               </div>

//               {(activeSearch.centerId ||
//                 activeSearch.productId ||
//                 activeSearch.resellerId) && (
//                 <div className="rounded-md bg-gray-50 p-3">
//                   <p className="mb-2 text-sm font-semibold text-gray-700">
//                     Current Filters:
//                   </p>

//                   <ul className="space-y-1 text-sm text-gray-600">
//                     {activeSearch.centerId && (
//                       <li>Center: {getCenterName(activeSearch.centerId)}</li>
//                     )}

//                     {activeSearch.productId && (
//                       <li>
//                         Product: {getProductName(activeSearch.productId)}
//                       </li>
//                     )}

//                     {activeSearch.resellerId && (
//                       <li>
//                         Reseller:{' '}
//                         {resellers.find(
//                           (item) => item._id === activeSearch.resellerId
//                         )?.businessName || 'Unknown Reseller'}
//                       </li>
//                     )}

//                     {activeSearch.month && (
//                       <li>Month: {getFormattedDateRange()}</li>
//                     )}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-2 border-t border-[#dee2e6] px-4 py-4 sm:px-5">
//               <button
//                 type="button"
//                 onClick={() => setExportModalVisible(false)}
//                 className="inline-flex h-[38px] items-center justify-center rounded-[6px] bg-[#6c757d] px-4 text-[14px] font-normal text-white transition hover:bg-[#5a6268] focus:outline-none focus:ring-2 focus:ring-[#6c757d]/30"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={generateDetailExport}
//                 disabled={exportLoading}
//                 className="inline-flex h-[38px] items-center justify-center gap-2 rounded-[6px] bg-[#5146e5] px-4 text-[14px] font-normal text-white transition hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#5146e5]/30 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {exportLoading ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Exporting...
//                   </>
//                 ) : (
//                   <>
//                     <FileSpreadsheet size={16} />
//                     Export
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Report Card */}
//       <div className="overflow-hidden border-0 border-t-[4px] border-t-[#2f5fa7] bg-white shadow-sm">
//         {/* Toolbar */}
//         <div className="flex flex-col gap-3 border-b border-[#dee2e6] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex flex-wrap items-center gap-1.5">
//             <button
//               type="button"
//               onClick={() => setSearchModalVisible(true)}
//               className="inline-flex h-[34px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition hover:bg-[#244c87]"
//             >
//               <Search size={15} />
//               Search
//             </button>

//             {isSearchActive() && (
//               <button
//                 type="button"
//                 onClick={handleResetSearch}
//                 className="inline-flex h-[34px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition hover:bg-[#244c87]"
//               >
//                 <RotateCcw size={14} />
//                 Reset Search
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={openExportModal}
//               disabled={exportLoading || data.length === 0}
//               className="inline-flex h-[34px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition hover:bg-[#244c87] disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Download size={14} />
//               Export
//             </button>
//           </div>

//           {/* Top Pagination (hidden while searching, because search covers all pages) */}
//           <div className="flex justify-end overflow-x-auto">
//             {isTableSearching ? (
//               <span className="text-[13px] text-[#6c757d]">
//                 {allDataLoading
//                   ? 'Searching all pages...'
//                   : `${filteredData.length} match(es) across all pages`}
//               </span>
//             ) : (
//               renderPagination()
//             )}
//           </div>
//         </div>

//         {/* Report Body */}
//         <div className="p-4">
//           {/* Table Search */}
//           <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
//             <label
//               htmlFor="tableSearch"
//               className="text-[14px] font-semibold text-[#212529]"
//             >
//               Search:
//             </label>

//             <input
//               id="tableSearch"
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Product or branch"
//               autoComplete="off"
//               className="h-[31px] w-full border border-[#d7dce2] bg-white px-2 text-[14px] outline-none focus:border-[#2f5fa7] sm:w-[220px]"
//             />
//           </div>

//           {/* Summary */}
//           <div className="mb-5 rounded-[5px] border border-[#00b9d9] bg-[#08b8d7] px-5 py-3 text-white">
//             <h3 className="mb-2 text-[17px] font-semibold">Showing Result</h3>

//             <div className="space-y-1 text-[15px] leading-[21px]">
//               <div>
//                 <strong className="font-semibold">Date:</strong>{' '}
//                 {getFormattedDateRange()}
//               </div>

//               {filters?.center && (
//                 <div>
//                   <strong className="font-semibold">Branch:</strong>{' '}
//                   {typeof filters.center === 'object'
//                     ? filters.center.name
//                     : filters.center}
//                 </div>
//               )}

//               {activeSearch.productId && (
//                 <div>
//                   <strong className="font-semibold">Product:</strong>{' '}
//                   {getProductName(activeSearch.productId)}
//                 </div>
//               )}

//               {activeSearch.resellerId && (
//                 <div>
//                   <strong className="font-semibold">Reseller:</strong>{' '}
//                   {resellers.find(
//                     (item) => item._id === activeSearch.resellerId
//                   )?.businessName || 'Unknown Reseller'}
//                 </div>
//               )}

//               <div>
//                 <strong className="font-semibold">Total Products:</strong>{' '}
//                 {isTableSearching ? filteredData.length : data.length}
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           <div
//             className={`max-h-[500px] w-full overflow-auto border border-[#eeeeee] transition-opacity ${
//               tableBusy ? 'opacity-60' : 'opacity-100'
//             }`}
//           >
//             <table className="w-full min-w-[1900px] table-fixed border-collapse">
//               <colgroup>
//                 <col style={{ width: '95px' }} />
//                 <col style={{ width: '210px' }} />

//                 {TABLE_COLUMNS.map((column) => (
//                   <col key={column.key} style={{ width: '90px' }} />
//                 ))}
//               </colgroup>

//               <thead className="sticky top-0 z-10">
//                 <tr>
//                   <th
//                     onClick={() => handleSort('center.name')}
//                     className={headerClass}
//                   >
//                     <div className="flex items-center gap-1">
//                       Branch
//                       {getSortIcon('center.name')}
//                     </div>
//                   </th>

//                   <th
//                     onClick={() => handleSort('productName')}
//                     className={headerClass}
//                   >
//                     <div className="flex items-center gap-1">
//                       Product
//                       {getSortIcon('productName')}
//                     </div>
//                   </th>

//                   {TABLE_COLUMNS.map(({ key, label }) => (
//                     <th
//                       key={key}
//                       onClick={() => handleSort(key)}
//                       className={headerClass}
//                     >
//                       <div className="flex items-center gap-1">
//                         {label}
//                         {getSortIcon(key)}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredData.length > 0 ? (
//                   filteredData.map((item, idx) => (
//                     <tr
//                       key={item._id || idx}
//                       className={
//                         idx % 2 === 0
//                           ? 'bg-[#f1f2f2] hover:bg-[#e9ecef]'
//                           : 'bg-white hover:bg-[#f8f9fa]'
//                       }
//                     >
//                       <td className={cellClass}>
//                         {item.center?.name || item.center?.centerName || 'N/A'}
//                       </td>

//                       <td className={cellClass}>{item.productName || 'N/A'}</td>

//                       {TABLE_COLUMNS.map(({ key, handler }) => (
//                         <td key={key} className={cellClass}>
//                           {handler
//                             ? renderClickableValue(
//                                 item[key],
//                                 getCellHandler(item, handler)
//                               )
//                             : item[key] || 0}
//                         </td>
//                       ))}
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={17}
//                       className="border border-[#eeeeee] px-4 py-10 text-center text-[15px] text-gray-500"
//                     >
//                       {tableBusy ? 'Searching...' : 'No data found'}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>

//               {/* Total row: sums only the rows currently visible */}
//               {filteredData.length > 0 && (
//                 <tfoot>
//                   <tr className="sticky bottom-0 z-10">
//                     <td colSpan={2} className={totalCellClass}>
//                       Total
//                     </td>

//                     {TABLE_COLUMNS.map(({ key }) => (
//                       <td key={key} className={totalCellClass}>
//                         {totals[key] || 0}
//                       </td>
//                     ))}
//                   </tr>
//                 </tfoot>
//               )}
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IndentUsageSummary;





import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import { showError, showSuccess } from '../../utils/sweetAlerts';
import IndentUsageSummarySearch from './IndentUsageSummarySearch';

const INITIAL_SEARCH = {
  centerId: '',
  productId: '',
  resellerId: '',
  month: '',
  startDate: '',
  endDate: '',
};

const NUMERIC_FIELDS = [
  'purchase',
  'transferReceive',
  'return',
  'usage',
  'transferGiven',
  'nc',
  'convert',
  'shifting',
  'buildingUsage',
  'buildingDamage',
  'other',
  'repair',
  'damage',
  'distributed',
  'replaceReturn',
  'replaceDamage',
  'stolenCenter',
  'stolenField',
];

const TOTAL_KEYS = ['opening', ...NUMERIC_FIELDS, 'closing'];

const TABLE_COLUMNS = [
  { key: 'opening', label: 'Opening' },
  { key: 'purchase', label: 'Purchase', handler: 'purchase' },
  {
    key: 'transferReceive',
    label: 'Transfer Received',
    handler: 'transferReceive',
  },
  { key: 'return', label: 'Return', handler: 'return' },
  { key: 'usage', label: 'Usage', handler: 'usage' },
  {
    key: 'transferGiven',
    label: 'Transfer Given',
    handler: 'transferGiven',
  },
  { key: 'nc', label: 'NC', handler: 'nc' },
  { key: 'convert', label: 'Convert', handler: 'convert' },
  { key: 'shifting', label: 'Shifting', handler: 'shifting' },
  {
    key: 'buildingUsage',
    label: 'Building new usage',
    handler: 'buildingUsage',
  },
  {
    key: 'buildingDamage',
    label: 'Building Damage',
    handler: 'buildingDamage',
  },
  { key: 'other', label: 'Other', handler: 'other' },
  { key: 'repair', label: 'Repair', handler: 'repair' },
  { key: 'damage', label: 'Damage', handler: 'damage' },
  { key: 'closing', label: 'Closing' },
];

// ------------------------------------------------------------
// Pure helpers (outside component so they are stable)
// ------------------------------------------------------------

const cleanParamValue = (value) => {
  if (!value) return value;

  const prefixes = [
    'center_',
    'product_',
    'reseller_',
    'outlet_',
    'warehouse_',
  ];

  let cleaned = value;

  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.replace(prefix, '');
    }
  }

  return cleaned;
};

const buildQueryString = (searchParams = {}, extra = {}) => {
  const params = new URLSearchParams();

  if (searchParams.centerId) {
    params.append('centerId', cleanParamValue(searchParams.centerId));
  }

  if (searchParams.productId) {
    params.append('productId', cleanParamValue(searchParams.productId));
  }

  if (searchParams.resellerId) {
    params.append('reseller', cleanParamValue(searchParams.resellerId));
  }

  if (searchParams.startDate && searchParams.endDate) {
    params.append('startDate', searchParams.startDate);
    params.append('endDate', searchParams.endDate);
  } else if (searchParams.month) {
    const [year, month] = searchParams.month.split('-');
    params.append('month', month);
    params.append('year', year);
  }

  Object.entries(extra).forEach(([key, value]) => {
    params.append(key, value);
  });

  return params.toString();
};

// Merge raw API rows into one row per (center + product)
const groupRows = (rows = []) => {
  const groupedMap = new Map();

  rows.forEach((item) => {
    const center = item.center || {};

    const centerId = center.id || center._id || item.centerId || '';

    const productId = item.productId || item.product?._id || '';

    const productName =
      item.productName || item.product?.productTitle || 'Unknown Product';

    const centerKey = String(
      centerId || center.name || center.centerName || ''
    )
      .trim()
      .toLowerCase();

    const productKey = String(productId || productName)
      .trim()
      .toLowerCase();

    const groupKey = `${centerKey}__${productKey}`;

    if (!groupedMap.has(groupKey)) {
      groupedMap.set(groupKey, {
        _id: `${centerKey}-${productKey}`,
        center: {
          id: centerId,
          name: center.name || center.centerName || '',
          code: center.code || center.centerCode || '',
          _id: centerId,
        },
        productId,
        productName,
        opening: Number(item.opening || 0),
        purchase: 0,
        transferReceive: 0,
        return: 0,
        usage: 0,
        transferGiven: 0,
        nc: 0,
        convert: 0,
        shifting: 0,
        buildingUsage: 0,
        buildingDamage: 0,
        other: 0,
        repair: 0,
        damage: 0,
        distributed: 0,
        replaceReturn: 0,
        replaceDamage: 0,
        stolenCenter: 0,
        stolenField: 0,
        closing: Number(item.closing || 0),
      });
    }

    const existing = groupedMap.get(groupKey);

    NUMERIC_FIELDS.forEach((field) => {
      existing[field] += Number(item[field] || 0);
    });

    if (
      Number(existing.opening || 0) === 0 &&
      Number(item.opening || 0) !== 0
    ) {
      existing.opening = Number(item.opening);
    }

    if (item.closing !== undefined && item.closing !== null) {
      existing.closing = Number(item.closing || 0);
    }
  });

  return Array.from(groupedMap.values());
};

const normalizeText = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const getNestedValue = (object, key) => {
  if (!object || !key) return '';

  return (
    key.split('.').reduce((current, property) => current?.[property], object) ??
    ''
  );
};

// ---- NEW: date helpers used when opening the detail pages ----
const pad2 = (value) => String(value).padStart(2, '0');

// Converts a year + month into { startDate, endDate } in YYYY-MM-DD format
const monthToRange = (year, month) => {
  const lastDay = new Date(Number(year), Number(month), 0).getDate();

  return {
    startDate: `${year}-${pad2(month)}-01`,
    endDate: `${year}-${pad2(month)}-${pad2(lastDay)}`,
  };
};

const IndentUsageSummary = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState(null);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportMonth, setExportMonth] = useState('');
  const [activeSearch, setActiveSearch] = useState(INITIAL_SEARCH);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Full (all pages) dataset used only while typing in the table search box
  const [allData, setAllData] = useState(null);
  const [allDataLoading, setAllDataLoading] = useState(false);

  const navigate = useNavigate();

  const isTableSearching = searchTerm.trim().length > 0;

  // ------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------

  const getProductName = (productId) => {
    if (!productId) return '';

    const cleaned = cleanParamValue(productId);

    if (/^[0-9a-fA-F]{24}$/.test(cleaned)) {
      const product = products.find((item) => item._id === cleaned);
      return product ? product.productTitle : cleaned;
    }

    return cleaned;
  };

  const getCenterName = (centerId) => {
    if (!centerId) return '';

    const cleaned = cleanParamValue(centerId);

    if (/^[0-9a-fA-F]{24}$/.test(cleaned)) {
      const center = centers.find((item) => item._id === cleaned);
      return center ? center.centerName : cleaned;
    }

    return cleaned;
  };

  const splitMonthYear = (monthValue) => {
    if (!monthValue || !monthValue.includes('-')) {
      return { month: '', year: '' };
    }

    const [year, month] = monthValue.split('-');

    return { month, year };
  };

  // ------------------------------------------------------------
  // API
  // ------------------------------------------------------------

const fetchData = async (searchParams = {}, page = 1) => {
  try {
    setLoading(true);
    setError(null);

    const query = buildQueryString(searchParams, { page });
    const url = `/reports/indent-usage-summary?${query}`;

    const response = await axiosInstance.get(url);

    if (response.data.success) {
      setData(groupRows(response.data.data || []));
    } else {
      setError(
        response.data.message || 'API returned unsuccessful response'
      );
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
    setInitialLoading(false);
  }
};

  // Loads every row (all pages) for the current filters, so the table
  // search box can find products that are not on the current page.
  const fetchAllRows = async (searchParams) => {
    const query = buildQueryString(searchParams, { export: 'true' });
    const response = await axiosInstance.get(
      `/reports/indent-usage-summary?${query}`
    );

    if (!response.data.success) {
      throw new Error('API returned unsuccessful response');
    }

    return groupRows(response.data.data || []);
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers');

      if (response.data.success) {
        setCenters(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching centers:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all');

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers');

      if (response.data.success) {
        setResellers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching resellers:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchProducts();
    fetchResellers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the user types in the table search box, load the full dataset once
  // (debounced) so the search covers all pages, not just the current one.
  useEffect(() => {
    if (!searchTerm.trim() || allData !== null) return undefined;

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setAllDataLoading(true);
        const rows = await fetchAllRows(activeSearch);
        if (!cancelled) setAllData(rows);
      } catch (err) {
        console.error('Error loading data for search:', err);
        if (!cancelled) showError('Could not load data for searching');
      } finally {
        if (!cancelled) setAllDataLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, activeSearch, allData]);

  // ------------------------------------------------------------
  // Derived data: search + sort
  // ------------------------------------------------------------

  const filteredData = useMemo(() => {
    const term = normalizeText(searchTerm);

    // While searching use all pages (fall back to current page until loaded)
    const source = term ? allData ?? data : data;

    let rows = source;

    if (term) {
      const tokens = term.split(' ');

      rows = source.filter((item) => {
        const haystack = normalizeText(
          [
            item.productName,
            item.center?.name,
            item.center?.code,
          ].join(' ')
        );

        return tokens.every((token) => haystack.includes(token));
      });
    }

    if (!sortConfig.key) return rows;

    const direction = sortConfig.direction === 'ascending' ? 1 : -1;

    return [...rows].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }

      return (
        String(aValue).localeCompare(String(bValue), undefined, {
          sensitivity: 'base',
          numeric: true,
        }) * direction
      );
    });
  }, [data, allData, searchTerm, sortConfig]);

  const totals = useMemo(() => {
    const result = {};

    TOTAL_KEYS.forEach((key) => {
      result[key] = 0;
    });

    filteredData.forEach((item) => {
      TOTAL_KEYS.forEach((key) => {
        result[key] += parseFloat(item[key] || 0);
      });
    });

    return result;
  }, [filteredData]);

  // ------------------------------------------------------------
  // Pagination
  // ------------------------------------------------------------

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    fetchData(activeSearch, page);
  };

  const getPaginationItems = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page += 1) {
        pages.push(page);
      }

      return pages;
    }

    if (currentPage <= 3) {
      pages.push(1, 2, 3, 'ellipsis', totalPages);
      return pages;
    }

    if (currentPage >= totalPages - 2) {
      pages.push(1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages);
      return pages;
    }

    pages.push(
      1,
      'ellipsis',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'ellipsis',
      totalPages
    );

    return pages;
  };

  const renderPagination = () => {
    const buttonBaseClass =
      'inline-flex h-[31px] min-w-[25px] items-center justify-center border border-[#dee2e6] bg-white px-[7px] text-[13px] font-normal leading-none transition-colors';

    const disabledClass = 'cursor-not-allowed bg-[#e9ecef] text-[#6c757d]';

    const pageClass = 'text-[#007bff] hover:bg-[#e9ecef]';

    const pages = getPaginationItems();

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    return (
      <nav
        aria-label="Pagination"
        className="flex flex-wrap items-center justify-end"
      >
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          disabled={isFirstPage}
          className={`inline-flex h-[31px] items-center justify-center rounded-l-[4px] border border-[#dee2e6] px-[9px] text-[13px] font-normal leading-none transition-colors ${
            isFirstPage ? disabledClass : pageClass
          }`}
        >
          First
        </button>

        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isFirstPage}
          aria-label="Previous page"
          className={`-ml-px ${buttonBaseClass} ${
            isFirstPage ? disabledClass : pageClass
          }`}
        >
          &lt;
        </button>

        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className={`-ml-px ${buttonBaseClass} cursor-default text-[#6c757d]`}
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => handlePageChange(page)}
              disabled={currentPage === page}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`-ml-px ${buttonBaseClass} ${
                currentPage === page
                  ? 'relative z-[1] border-[#5146e5] bg-[#5146e5] text-white'
                  : pageClass
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLastPage}
          aria-label="Next page"
          className={`-ml-px ${buttonBaseClass} ${
            isLastPage ? disabledClass : pageClass
          }`}
        >
          &gt;
        </button>

        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          disabled={isLastPage}
          className={`-ml-px inline-flex h-[31px] items-center justify-center rounded-r-[4px] border border-[#dee2e6] px-[9px] text-[13px] font-normal leading-none transition-colors ${
            isLastPage ? disabledClass : pageClass
          }`}
        >
          Last
        </button>
      </nav>
    );
  };

  // ------------------------------------------------------------
  // Sorting
  // ------------------------------------------------------------

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'ascending'
        ? 'descending'
        : 'ascending';

    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;

    return sortConfig.direction === 'ascending' ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  // ------------------------------------------------------------
  // Search (modal filters)
  // ------------------------------------------------------------

  const handleSearch = (searchData) => {
    const mergedSearchData = {
      ...activeSearch,
      ...searchData,
    };

    setAllData(null); // filters changed -> cached full dataset is stale
    setActiveSearch(mergedSearchData);
    fetchData(mergedSearchData, 1);
  };

  const handleResetSearch = () => {
    setAllData(null);
    setActiveSearch(INITIAL_SEARCH);
    setSearchTerm('');
    fetchData({}, 1);
  };

  const isSearchActive = () =>
    Boolean(
      activeSearch.centerId ||
        activeSearch.productId ||
        activeSearch.resellerId ||
        activeSearch.month ||
        activeSearch.startDate ||
        activeSearch.endDate
    );

  // ------------------------------------------------------------
  // Export
  // ------------------------------------------------------------

  const openExportModal = () => {
    setExportMonth(activeSearch.month || '');
    setExportModalVisible(true);
  };

  const generateDetailExport = async () => {
    try {
      setExportLoading(true);

      const exportParams = exportMonth
        ? { ...activeSearch, month: exportMonth, startDate: '', endDate: '' }
        : activeSearch;

      const query = buildQueryString(exportParams, { export: 'true' });

      const response = await axiosInstance.get(
        `/reports/indent-usage-summary?${query}`
      );

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }

      const exportData = response.data.data || [];

      if (!exportData.length) {
        showError('No data available for export');
        return;
      }

      const headers = [
        'Center Name',
        'Center Code',
        'Product Name',
        'Opening',
        'Purchase',
        'Distributed',
        'Transfer Receive',
        'Replace Return',
        'Usage',
        'Transfer Given',
        'NC',
        'Convert',
        'Shifting',
        'Building new usage',
        'Building Damage',
        'Other',
        'Return',
        'Repair',
        'Damage',
        'Replace Damage',
        'Stolen Center',
        'Stolen Field',
        'Closing',
      ];

      const csvData = exportData.map((item) => {
        const center = item.center || {};

        return [
          center.name || center.centerName || '',
          center.code || center.centerCode || '',
          item.productName || '',
          item.opening || 0,
          item.purchase || 0,
          item.distributed || 0,
          item.transferReceive || 0,
          item.replaceReturn || 0,
          item.usage || 0,
          item.transferGiven || 0,
          item.nc || 0,
          item.convert || 0,
          item.shifting || 0,
          item.buildingUsage || 0,
          item.buildingDamage || 0,
          item.other || 0,
          item.return || 0,
          item.repair || 0,
          item.damage || 0,
          item.replaceDamage || 0,
          item.stolenCenter || 0,
          item.stolenField || 0,
          item.closing || 0,
        ];
      });

      let filename = 'indent_usage_summary_report';

      const resolvedFilters =
        response.data.filters || response.data.appliedFilters;

      if (resolvedFilters?.month && resolvedFilters?.year) {
        const monthName = new Date(
          resolvedFilters.year,
          resolvedFilters.month - 1
        ).toLocaleString('default', {
          month: 'long',
        });

        filename += `_${monthName}_${resolvedFilters.year}`;
      } else {
        filename += `_${new Date().toISOString().split('T')[0]}`;
      }

      filename += '.csv';

      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          row
            .map((field) => {
              if (field === 0) return '"0"';

              const stringField = String(field || '');

              return `"${stringField.replace(/"/g, '""')}"`;
            })
            .join(',')
        ),
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });

      const link = document.createElement('a');
      const downloadUrl = URL.createObjectURL(blob);

      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      showSuccess('Export completed successfully!');
      setExportModalVisible(false);
      setExportMonth('');
    } catch (err) {
      console.error('Error generating export:', err);
      showError('Error generating export file');
    } finally {
      setExportLoading(false);
    }
  };

  // ------------------------------------------------------------
  // Date
  // ------------------------------------------------------------

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';

    const match = String(dateString).match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (match) {
      const [, year, month, day] = match;
      return `${day}-${month}-${year}`;
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return String(dateString);
    }

    return `${String(date.getDate()).padStart(2, '0')}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const getFormattedDateRange = () => {
    if (activeSearch.startDate && activeSearch.endDate) {
      return `${formatDateForDisplay(
        activeSearch.startDate
      )} to ${formatDateForDisplay(activeSearch.endDate)}`;
    }

    if (filters?.dateRange?.startDate && filters?.dateRange?.endDate) {
      return `${formatDateForDisplay(
        filters.dateRange.startDate
      )} to ${formatDateForDisplay(filters.dateRange.endDate)}`;
    }

    if (filters?.month && filters?.year) {
      const monthName = new Date(
        filters.year,
        filters.month - 1
      ).toLocaleString('default', {
        month: 'long',
      });

      return `${monthName}-${filters.year}`;
    }

    if (activeSearch.month) {
      const [year, month] = activeSearch.month.split('-');

      const monthName = new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1
      ).toLocaleString('default', {
        month: 'long',
      });

      return `${monthName}-${year}`;
    }

    const now = new Date();

    return `${now.toLocaleString('default', {
      month: 'long',
    })}-${now.getFullYear()}`;
  };

  // NEW: same period as the "Showing Result" box, in YYYY-MM-DD,
  // used when opening detail pages so they show the same period.
  const getNavigationDateRange = () => {
    // 1. Custom date range from the search modal
    if (activeSearch.startDate && activeSearch.endDate) {
      return {
        startDate: activeSearch.startDate,
        endDate: activeSearch.endDate,
      };
    }

    // 2. Month selected in the search modal (YYYY-MM)
    if (activeSearch.month) {
      const [year, month] = activeSearch.month.split('-');
      return monthToRange(year, month);
    }

    // 3. Date range returned by the API (default view)
    if (filters?.dateRange?.startDate && filters?.dateRange?.endDate) {
      return {
        startDate: String(filters.dateRange.startDate).slice(0, 10),
        endDate: String(filters.dateRange.endDate).slice(0, 10),
      };
    }

    // 4. Month / year returned by the API
    if (filters?.month && filters?.year) {
      return monthToRange(filters.year, filters.month);
    }

    // 5. Fallback: current month
    const now = new Date();
    return monthToRange(now.getFullYear(), now.getMonth() + 1);
  };

  // ------------------------------------------------------------
  // Click Handlers
  // ------------------------------------------------------------

  const handleUsageClick = (item) => {
    if (item.usage > 0) {
      const productName = getProductName(item.productId);

      const centerId = item.center?.id || item.center?._id || '';

      const centerName = getCenterName(centerId);

      const { month, year } = splitMonthYear(activeSearch.month);

      const summaryTotalQuantity = Number(item.usage || 0);

      navigate('/usage-detail', {
        state: {
          product: productName,
          center: centerName,
          productId: item.productId || '',
          centerId,
          productName: item.productName || productName,
          centerName,
          month,
          year,
          summaryTotalQuantity,
          fromSummary: true,
        },
      });
    }
  };

  // FIXED: sends IDs (not names), date range, names for labels and the
  // summary total so /transfer-detail shows only the matching records.
  const handleTransferClick = (item, field, transferType) => {
    const quantity = Number(item[field] || 0);

    if (quantity <= 0) return;

    const centerId = item.center?.id || item.center?._id || '';
    const productId = item.productId || '';

    if (!centerId || !productId) {
      console.error('Missing center or product ID:', { centerId, productId });
      return;
    }

    const { startDate, endDate } = getNavigationDateRange();

    // URLSearchParams already encodes values, so do NOT use encodeURIComponent
    const params = new URLSearchParams({
      product: productId, // ID (not name)
      center: centerId, // ID (not name)
      productName: item.productName || '',
      centerName: item.center?.name || item.center?.centerName || '',
      transferType, // 'receive' | 'given'
      totalQty: String(quantity), // shown in "Summary Total Qty"
      startDate,
      endDate,
    });

    navigate(`/transfer-detail?${params.toString()}`);
  };

  const handleTransferReceiveClick = (item) =>
    handleTransferClick(item, 'transferReceive', 'receive');

  const handleTransferGivenClick = (item) =>
    handleTransferClick(item, 'transferGiven', 'given');

  const handleFieldClick = (item, field, type) => {
    const value = item[field] || 0;

    if (value > 0) {
      const centerId = item.center?.id || item.center?._id || '';

      const productId = item.productId || '';

      if (!centerId || !productId) {
        console.error('Missing center or product ID:', {
          centerId,
          productId,
        });
        return;
      }

      const params = new URLSearchParams({
        product: getProductName(productId),
        center: getCenterName(centerId),
        usageType: type,
        productName: encodeURIComponent(item.productName || ''),
        centerName: encodeURIComponent(
          item.center?.name || item.center?.centerName || ''
        ),
        month: activeSearch.month || '',
      });

      navigate(`/transaction-report?${params.toString()}`);
    }
  };

  const handleNcClick = (item) => handleFieldClick(item, 'nc', 'Customer');

  const handleConvertClick = (item) =>
    handleFieldClick(item, 'convert', 'Customer');

  const handleShiftingClick = (item) =>
    handleFieldClick(item, 'shifting', 'Customer');

  const handleBuildingUsageClick = (item) =>
    handleFieldClick(item, 'buildingUsage', 'Building');

  const handleBuildingDamageClick = (item) =>
    handleFieldClick(item, 'buildingDamage', 'building');

  const handleOtherClick = (item) => handleFieldClick(item, 'other', 'other');

  const handleDamageClick = (item) =>
    handleFieldClick(item, 'damage', 'Damage');

  const handleRepairClick = (item) =>
    handleFieldClick(item, 'repair', 'Customer');

  const handleReturnClick = (item) =>
    handleFieldClick(item, 'return', 'Customer');

  // FIXED: sends IDs (not names), the same date range as the summary,
  // and the clicked quantity so /indent-detail can show only those records.
  const handlePurchaseClick = (item) => {
    const quantity = Number(item.purchase || 0);

    if (quantity <= 0) return;

    const centerId = item.center?.id || item.center?._id || '';
    const productId = item.productId || '';

    if (!centerId || !productId) {
      console.error('Missing center or product ID:', { centerId, productId });
      return;
    }

    const { startDate, endDate } = getNavigationDateRange();

    // URLSearchParams already encodes values, so do NOT use encodeURIComponent
    const params = new URLSearchParams({
      productId,
      centerId,
      productName: item.productName || '',
      centerName: item.center?.name || item.center?.centerName || '',
      startDate,
      endDate,
      totalQty: String(quantity),
      transactionType: 'purchase',
    });

    navigate(`/indent-detail?${params.toString()}`);
  };

  // ------------------------------------------------------------
  // Initial Loading / Error
  // (only the very first load replaces the page, so the search box
  //  and filters never unmount while the user is working)
  // ------------------------------------------------------------

  if (initialLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  // ------------------------------------------------------------
  // Table UI Helpers
  // ------------------------------------------------------------

  const clickableClass = (value) =>
    value > 0
      ? 'cursor-pointer font-medium text-[#2f5fa7] hover:text-blue-800 hover:underline'
      : 'cursor-default text-gray-600';

  const renderClickableValue = (value, handler) => (
    <button
      type="button"
      onClick={handler}
      disabled={!value}
      className={`border-0 bg-transparent p-0 ${clickableClass(value)}`}
    >
      {value || 0}
    </button>
  );

  const getCellHandler = (item, handler) => {
    const handlers = {
      purchase: () => handlePurchaseClick(item),
      transferReceive: () => handleTransferReceiveClick(item),
      return: () => handleReturnClick(item),
      usage: () => handleUsageClick(item),
      transferGiven: () => handleTransferGivenClick(item),
      nc: () => handleNcClick(item),
      convert: () => handleConvertClick(item),
      shifting: () => handleShiftingClick(item),
      buildingUsage: () => handleBuildingUsageClick(item),
      buildingDamage: () => handleBuildingDamageClick(item),
      other: () => handleOtherClick(item),
      repair: () => handleRepairClick(item),
      damage: () => handleDamageClick(item),
    };

    return handlers[handler];
  };

  const headerClass =
    'h-[88px] cursor-pointer border border-[#eeeeee] bg-white px-[9px] py-2 text-left align-bottom text-[16px] font-semibold leading-6 text-black hover:bg-gray-50';

  const cellClass =
    'border border-[#eeeeee] px-[9px] py-[9px] text-[16px] leading-6 text-black align-top';

  const totalCellClass =
    'border border-[#eeeeee] bg-[#d5e8ce] px-[9px] py-[9px] text-[16px] font-semibold leading-6 text-black';

  const tableBusy = loading || (isTableSearching && allDataLoading);

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        <h1 className="text-[24px] font-normal text-[#212529]">
          Indent / Usage Summary Report
        </h1>
      </div>

      <IndentUsageSummarySearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
      />

      {/* Export Modal */}
      {exportModalVisible && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 sm:pt-16">
          <style>
            {`
              @keyframes indentUsageModalDrop {
                from {
                  opacity: 0;
                  transform: translateY(-35px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>

          <div
            className="w-full max-w-lg rounded-md bg-white shadow-2xl"
            style={{
              animation: 'indentUsageModalDrop 220ms ease-out',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#dee2e6] px-4 py-4 sm:px-5">
              <h2 className="text-[20px] font-normal text-[#343a40]">
                Export Indent / Usage Summary Report
              </h2>

              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                aria-label="Close export modal"
                className="rounded-md p-1 text-[#6c757d] transition hover:bg-gray-100 hover:text-[#343a40]"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 px-4 py-4 sm:px-5">
              <div>
                <label
                  htmlFor="exportMonth"
                  className="mb-2 block text-[14px] font-semibold text-[#343a40]"
                >
                  Select Month (Optional)
                </label>

                <input
                  id="exportMonth"
                  type="month"
                  value={exportMonth}
                  onChange={(e) => setExportMonth(e.target.value)}
                  className="h-[38px] w-full rounded-[4px] border border-[#ced4da] bg-white px-3 text-[14px] text-[#495057] outline-none transition focus:border-[#a5a0f2] focus:ring-2 focus:ring-[#5146e5]/10"
                />

                <p className="mt-1 text-[13px] text-[#6c757d]">
                  Leave empty to use current month or active search month
                </p>
              </div>

              {(activeSearch.centerId ||
                activeSearch.productId ||
                activeSearch.resellerId) && (
                <div className="rounded-md bg-gray-50 p-3">
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Current Filters:
                  </p>

                  <ul className="space-y-1 text-sm text-gray-600">
                    {activeSearch.centerId && (
                      <li>Center: {getCenterName(activeSearch.centerId)}</li>
                    )}

                    {activeSearch.productId && (
                      <li>
                        Product: {getProductName(activeSearch.productId)}
                      </li>
                    )}

                    {activeSearch.resellerId && (
                      <li>
                        Reseller:{' '}
                        {resellers.find(
                          (item) => item._id === activeSearch.resellerId
                        )?.businessName || 'Unknown Reseller'}
                      </li>
                    )}

                    {activeSearch.month && (
                      <li>Month: {getFormattedDateRange()}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t border-[#dee2e6] px-4 py-4 sm:px-5">
              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                className="inline-flex h-[38px] items-center justify-center rounded-[6px] bg-[#6c757d] px-4 text-[14px] font-normal text-white transition hover:bg-[#5a6268] focus:outline-none focus:ring-2 focus:ring-[#6c757d]/30"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={generateDetailExport}
                disabled={exportLoading}
                className="inline-flex h-[38px] items-center justify-center gap-2 rounded-[6px] bg-[#5146e5] px-4 text-[14px] font-normal text-white transition hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#5146e5]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exportLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={16} />
                    Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Report Card */}
      <div className="overflow-hidden border-0 border-t-[4px] border-t-[#2f5fa7] bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#dee2e6] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex h-[34px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition hover:bg-[#244c87]"
            >
              <Search size={15} />
              Search
            </button>

            {isSearchActive() && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex h-[34px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition hover:bg-[#244c87]"
              >
                <RotateCcw size={14} />
                Reset Search
              </button>
            )}

            <button
              type="button"
              onClick={openExportModal}
              disabled={exportLoading || data.length === 0}
              className="inline-flex h-[34px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-[9px] text-[14px] font-medium text-white transition hover:bg-[#244c87] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={14} />
              Export
            </button>
          </div>

          {/* Top Pagination (hidden while searching, because search covers all pages) */}
          <div className="flex justify-end overflow-x-auto">
            {isTableSearching ? (
              <span className="text-[13px] text-[#6c757d]">
                {allDataLoading
                  ? 'Searching all pages...'
                  : `${filteredData.length} match(es) across all pages`}
              </span>
            ) : (
              renderPagination()
            )}
          </div>
        </div>

        {/* Report Body */}
        <div className="p-4">
          {/* Table Search */}
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <label
              htmlFor="tableSearch"
              className="text-[14px] font-semibold text-[#212529]"
            >
              Search:
            </label>

            <input
              id="tableSearch"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Product or branch"
              autoComplete="off"
              className="h-[31px] w-full border border-[#d7dce2] bg-white px-2 text-[14px] outline-none focus:border-[#2f5fa7] sm:w-[220px]"
            />
          </div>

          {/* Summary */}
          <div className="mb-5 rounded-[5px] border border-[#00b9d9] bg-[#08b8d7] px-5 py-3 text-white">
            <h3 className="mb-2 text-[17px] font-semibold">Showing Result</h3>

            <div className="space-y-1 text-[15px] leading-[21px]">
              <div>
                <strong className="font-semibold">Date:</strong>{' '}
                {getFormattedDateRange()}
              </div>

              {filters?.center && (
                <div>
                  <strong className="font-semibold">Branch:</strong>{' '}
                  {typeof filters.center === 'object'
                    ? filters.center.name
                    : filters.center}
                </div>
              )}

              {activeSearch.productId && (
                <div>
                  <strong className="font-semibold">Product:</strong>{' '}
                  {getProductName(activeSearch.productId)}
                </div>
              )}

              {activeSearch.resellerId && (
                <div>
                  <strong className="font-semibold">Reseller:</strong>{' '}
                  {resellers.find(
                    (item) => item._id === activeSearch.resellerId
                  )?.businessName || 'Unknown Reseller'}
                </div>
              )}

              <div>
                <strong className="font-semibold">Total Products:</strong>{' '}
                {isTableSearching ? filteredData.length : data.length}
              </div>
            </div>
          </div>

          {/* Table */}
          <div
            className={`max-h-[500px] w-full overflow-auto border border-[#eeeeee] transition-opacity ${
              tableBusy ? 'opacity-60' : 'opacity-100'
            }`}
          >
            <table className="w-full min-w-[1900px] table-fixed border-collapse">
              <colgroup>
                <col style={{ width: '95px' }} />
                <col style={{ width: '210px' }} />

                {TABLE_COLUMNS.map((column) => (
                  <col key={column.key} style={{ width: '90px' }} />
                ))}
              </colgroup>

              <thead className="sticky top-0 z-10">
                <tr>
                  <th
                    onClick={() => handleSort('center.name')}
                    className={headerClass}
                  >
                    <div className="flex items-center gap-1">
                      Branch
                      {getSortIcon('center.name')}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('productName')}
                    className={headerClass}
                  >
                    <div className="flex items-center gap-1">
                      Product
                      {getSortIcon('productName')}
                    </div>
                  </th>

                  {TABLE_COLUMNS.map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      className={headerClass}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        {getSortIcon(key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, idx) => (
                    <tr
                      key={item._id || idx}
                      className={
                        idx % 2 === 0
                          ? 'bg-[#f1f2f2] hover:bg-[#e9ecef]'
                          : 'bg-white hover:bg-[#f8f9fa]'
                      }
                    >
                      <td className={cellClass}>
                        {item.center?.name || item.center?.centerName || 'N/A'}
                      </td>

                      <td className={cellClass}>{item.productName || 'N/A'}</td>

                      {TABLE_COLUMNS.map(({ key, handler }) => (
                        <td key={key} className={cellClass}>
                          {handler
                            ? renderClickableValue(
                                item[key],
                                getCellHandler(item, handler)
                              )
                            : item[key] || 0}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={17}
                      className="border border-[#eeeeee] px-4 py-10 text-center text-[15px] text-gray-500"
                    >
                      {tableBusy ? 'Searching...' : 'No data found'}
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Total row: sums only the rows currently visible */}
              {filteredData.length > 0 && (
                <tfoot>
                  <tr className="sticky bottom-0 z-10">
                    <td colSpan={2} className={totalCellClass}>
                      Total
                    </td>

                    {TABLE_COLUMNS.map(({ key }) => (
                      <td key={key} className={totalCellClass}>
                        {totals[key] || 0}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndentUsageSummary;