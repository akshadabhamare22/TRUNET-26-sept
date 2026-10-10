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
// import { useLocation } from 'react-router-dom';

// import axiosInstance from '../../axiosInstance';
// import Pagination from '../../utils/Pagination';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import { formatDate } from '../../utils/FormatDateTime';

// import SearchUsageDetail from './SearchUsageDetail';

// /* =========================================================
//    CONSTANTS
// ========================================================= */

// const EMPTY_SEARCH = {
//   centerId: '',
//   productId: '',
//   startDate: '',
//   endDate: '',
//   usageType: '',
//   connectionType: '',
//   customer: '',
//   keyword: '',
//   outlet: '',
//   month: '',
//   year: '',
// };

// /* =========================================================
//    HELPERS
// ========================================================= */

// const getId = (value) => {
//   if (!value) return '';

//   if (typeof value === 'object') {
//     return (
//       value._id?.toString() ||
//       value.id?.toString() ||
//       ''
//     );
//   }

//   return value.toString();
// };

// const normalizeDateForApi = (dateStr) => {
//   if (!dateStr) return '';

//   const value = String(dateStr).trim();

//   if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
//     return value;
//   }

//   if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
//     const [day, month, year] = value.split('-');
//     return `${year}-${month}-${day}`;
//   }

//   return value;
// };

// const getMonthDateRange = (month, year) => {
//   if (!month || !year) {
//     return {
//       startDate: '',
//       endDate: '',
//     };
//   }

//   const numericMonth = Number(month);
//   const numericYear = Number(year);

//   if (
//     Number.isNaN(numericMonth) ||
//     Number.isNaN(numericYear) ||
//     numericMonth < 1 ||
//     numericMonth > 12
//   ) {
//     return {
//       startDate: '',
//       endDate: '',
//     };
//   }

//   const monthString = String(numericMonth).padStart(2, '0');

//   const startDate = `${numericYear}-${monthString}-01`;

//   const lastDay = new Date(
//     numericYear,
//     numericMonth,
//     0
//   ).getDate();

//   const endDate = `${numericYear}-${monthString}-${String(
//     lastDay
//   ).padStart(2, '0')}`;

//   return {
//     startDate,
//     endDate,
//   };
// };

// const getNestedValue = (object, path) => {
//   if (!object || !path) return '';

//   return path.split('.').reduce((value, key) => {
//     if (value === null || value === undefined) {
//       return '';
//     }

//     return value[key];
//   }, object);
// };

// const valueToSearchString = (value) => {
//   if (value === null || value === undefined) {
//     return '';
//   }

//   if (typeof value === 'object') {
//     return Object.values(value)
//       .map((item) => valueToSearchString(item))
//       .join(' ')
//       .toLowerCase();
//   }

//   return String(value).toLowerCase();
// };

// const normalizeSearchPayload = (raw = {}) => {
//   const pick = (...keys) => {
//     for (const key of keys) {
//       if (
//         raw[key] !== undefined &&
//         raw[key] !== null &&
//         raw[key] !== ''
//       ) {
//         return raw[key];
//       }
//     }

//     return '';
//   };

//   return {
//     centerId: getId(
//       pick('centerId', 'center', 'branch', 'branchId')
//     ),
//     productId: getId(pick('productId', 'product')),
//     startDate: pick('startDate', 'fromDate') || '',
//     endDate: pick('endDate', 'toDate') || '',
//     usageType: pick('usageType', 'type') || '',
//     connectionType: pick('connectionType') || '',
//     customer: getId(
//       pick('customer', 'user', 'customerId', 'userId')
//     ),
//     keyword: pick('keyword', 'search') || '',
//     outlet: getId(pick('outlet', 'outletId')),
//     month: pick('month') || '',
//     year: pick('year') || '',
//   };
// };

// /* =========================================================
//    COMPONENT
// ========================================================= */

// const UsageDetail = () => {
//   const [data, setData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [customers, setCustomers] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [exportLoading, setExportLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending',
//   });

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] =
//     useState(false);

//   const [exportModalVisible, setExportModalVisible] =
//     useState(false);

//   const [exportStartDate, setExportStartDate] = useState('');
//   const [exportEndDate, setExportEndDate] = useState('');

//   const [itemDetailModalVisible, setItemDetailModalVisible] =
//     useState(false);

//   const [selectedItemDetail, setSelectedItemDetail] =
//     useState(null);

//   const [activeSearch, setActiveSearch] = useState({
//     ...EMPTY_SEARCH,
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const location = useLocation();

//   /* =========================================================
//      FETCH USAGE DATA
//   ========================================================= */

//   const fetchData = async (
//     searchParams = {},
//     page = 1
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();

//       const currentSearch =
//         Object.keys(searchParams).length > 0
//           ? searchParams
//           : activeSearch;

//       if (currentSearch.centerId) {
//         params.append(
//           'centerId',
//           currentSearch.centerId
//         );
//       }

//       if (currentSearch.productId) {
//         params.append(
//           'productId',
//           currentSearch.productId
//         );
//       }

//       if (currentSearch.usageType) {
//         params.append(
//           'usageType',
//           currentSearch.usageType
//         );
//       }

//       if (currentSearch.connectionType) {
//         params.append(
//           'connectionType',
//           currentSearch.connectionType
//         );
//       }

//       if (currentSearch.customer) {
//         params.append(
//           'customer',
//           currentSearch.customer
//         );
//       }

//       if (currentSearch.keyword) {
//         params.append(
//           'search',
//           currentSearch.keyword
//         );
//       }

//       if (currentSearch.outlet) {
//         params.append(
//           'outlet',
//           currentSearch.outlet
//         );
//       }

//       let startDate = currentSearch.startDate;
//       let endDate = currentSearch.endDate;

//       if (
//         !startDate &&
//         !endDate &&
//         currentSearch.month &&
//         currentSearch.year
//       ) {
//         const monthRange = getMonthDateRange(
//           currentSearch.month,
//           currentSearch.year
//         );

//         startDate = monthRange.startDate;
//         endDate = monthRange.endDate;
//       }

//       if (startDate && endDate) {
//         params.append(
//           'startDate',
//           normalizeDateForApi(startDate)
//         );

//         params.append(
//           'endDate',
//           normalizeDateForApi(endDate)
//         );
//       }

//       params.append('page', page);

//       const url = params.toString()
//         ? `/reports/usages?${params.toString()}`
//         : '/reports/usages';

//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         setData(response.data.data || []);

//         setCurrentPage(
//           response.data.pagination?.currentPage || 1
//         );

//         setTotalPages(
//           response.data.pagination?.totalPages || 1
//         );
//       } else {
//         setError(
//           response.data.message ||
//             'API returned unsuccessful response'
//         );
//       }
//     } catch (err) {
//       if (err.response) {
//         setError(
//           err.response.data?.message ||
//             err.response.data?.error ||
//             `Error ${err.response.status}: ${err.response.statusText}`
//         );
//       } else if (err.request) {
//         setError(
//           'No response received from server. Please check your network connection.'
//         );
//       } else {
//         setError(
//           err.message ||
//             'An error occurred while fetching data'
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================================================
//      FETCH MASTER DATA
//   ========================================================= */

//   const fetchCenters = async () => {
//     try {
//       const response =
//         await axiosInstance.get('/centers');

//       if (response.data.success) {
//         setCenters(response.data.data || []);
//       }
//     } catch (err) {
//       console.error(
//         'Error fetching centers:',
//         err
//       );
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response =
//         await axiosInstance.get('/products/all');

//       if (response.data.success) {
//         setProducts(response.data.data || []);
//       }
//     } catch (err) {
//       console.error(
//         'Error fetching products:',
//         err
//       );
//     }
//   };

//   const fetchCustomers = async () => {
//     try {
//       const response =
//         await axiosInstance.get('/customers');

//       if (response.data.success) {
//         setCustomers(response.data.data || []);
//       }
//     } catch (err) {
//       console.error(
//         'Error fetching customers:',
//         err
//       );
//     }
//   };

//   useEffect(() => {
//     fetchCenters();
//     fetchProducts();
//     fetchCustomers();
//   }, []);

//   /* =========================================================
//      NAVIGATION FROM USAGE SUMMARY / URL
//   ========================================================= */

//   useEffect(() => {
//     if (
//       location.state?.productId &&
//       location.state?.centerId
//     ) {
//       let startDate =
//         location.state.startDate || '';

//       let endDate =
//         location.state.endDate || '';

//       if (
//         !startDate &&
//         !endDate &&
//         location.state.month &&
//         location.state.year
//       ) {
//         const monthRange = getMonthDateRange(
//           location.state.month,
//           location.state.year
//         );

//         startDate = monthRange.startDate;
//         endDate = monthRange.endDate;
//       }

//       const filteredSearch = {
//         ...EMPTY_SEARCH,
//         productId: location.state.productId,
//         centerId: location.state.centerId,
//         startDate,
//         endDate,
//         month: location.state.month || '',
//         year: location.state.year || '',
//       };

//       setActiveSearch(filteredSearch);

//       fetchData(filteredSearch, 1);

//       document.title = `Usage Details - ${
//         location.state.productName || 'Product'
//       } at ${
//         location.state.centerName || 'Center'
//       }`;

//       return;
//     }

//     const params = new URLSearchParams(
//       location.search
//     );

//     const productParam =
//       params.get('productId');

//     const centerParam =
//       params.get('centerId');

//     if (productParam && centerParam) {
//       let startDate =
//         params.get('startDate') || '';

//       let endDate =
//         params.get('endDate') || '';

//       const monthParam =
//         params.get('month') || '';

//       const yearParam =
//         params.get('year') || '';

//       if (
//         !startDate &&
//         !endDate &&
//         monthParam &&
//         yearParam
//       ) {
//         const monthRange = getMonthDateRange(
//           monthParam,
//           yearParam
//         );

//         startDate = monthRange.startDate;
//         endDate = monthRange.endDate;
//       }

//       const filteredSearch = {
//         ...EMPTY_SEARCH,

//         productId: productParam,
//         centerId: centerParam,

//         startDate,
//         endDate,

//         usageType:
//           params.get('usageType') || '',

//         connectionType:
//           params.get('connectionType') || '',

//         customer:
//           params.get('customer') || '',

//         keyword:
//           params.get('keyword') || '',

//         outlet:
//           params.get('outlet') || '',

//         month: monthParam,
//         year: yearParam,
//       };

//       setActiveSearch(filteredSearch);

//       fetchData(filteredSearch, 1);

//       const productName =
//         params.get('productName')
//           ? decodeURIComponent(
//               params.get('productName')
//             )
//           : 'Product';

//       const centerName =
//         params.get('centerName')
//           ? decodeURIComponent(
//               params.get('centerName')
//             )
//           : 'Center';

//       document.title =
//         `Usage Details - ${productName} at ${centerName}`;

//       return;
//     }

//     fetchData(EMPTY_SEARCH, 1);
//   }, [location.state, location.search]);

//   /* =========================================================
//      PAGINATION
//   ========================================================= */

//   const handlePageChange = (page) => {
//     if (
//       page < 1 ||
//       page > totalPages
//     ) {
//       return;
//     }

//     fetchData(activeSearch, page);
//   };

//   /* =========================================================
//      FLATTEN DATA
//   ========================================================= */

//   const getFlattenedData = () => {
//     const flattened = [];

//     const activeProductId =
//       getId(activeSearch.productId);

//     const activeCenterId =
//       getId(activeSearch.centerId);

//     const summaryTargetQty = Number(
//       location.state?.summaryTotalQuantity || 0
//     );

//     const hasSummaryTarget =
//       summaryTargetQty > 0;

//     let accumulatedQty = 0;

//     data.forEach((usage) => {
//       if (
//         hasSummaryTarget &&
//         accumulatedQty >= summaryTargetQty
//       ) {
//         return;
//       }

//       // Match the selected center against both the source center
//       // and destination/target center returned by the API.
//       const usageCenterId = getId(
//         usage.center?._id ||
//           usage.center ||
//           usage.centerId
//       );

//       const usageToCenterId = getId(
//         usage.toCenter?._id ||
//           usage.toCenter ||
//           usage.toCenterId
//       );

//       if (
//         activeCenterId &&
//         usageCenterId !== activeCenterId &&
//         usageToCenterId !== activeCenterId
//       ) {
//         return;
//       }

//       if (
//         usage.items &&
//         Array.isArray(usage.items) &&
//         usage.items.length > 0
//       ) {
//         let itemsToShow = usage.items;

//         if (activeProductId) {
//           itemsToShow =
//             usage.items.filter((item) => {
//               const itemProductId =
//                 getId(
//                   item.product?._id ||
//                     item.product ||
//                     item.productId
//                 );

//               return (
//                 itemProductId ===
//                 activeProductId
//               );
//             });
//         }

//         itemsToShow.forEach((item) => {
//           if (
//             hasSummaryTarget &&
//             accumulatedQty >=
//               summaryTargetQty
//           ) {
//             return;
//           }

//           let itemQty = Number(
//             item.quantity || 0
//           );

//           if (
//             hasSummaryTarget &&
//             accumulatedQty + itemQty >
//               summaryTargetQty
//           ) {
//             itemQty =
//               summaryTargetQty -
//               accumulatedQty;
//           }

//           if (itemQty <= 0) return;

//           accumulatedQty += itemQty;

//           flattened.push({
//             ...usage,

//             item: {
//               ...item,
//               quantity: itemQty,
//             },

//             product: item.product,

//             quantity: itemQty,

//             uniqueKey: `${usage._id || 'usage'}_${
//               item._id ||
//               getId(item.product) ||
//               Math.random()
//             }`,
//           });
//         });
//       }
//     });

//     return flattened;
//   };

//   /* =========================================================
//      USER / BUILDING LABEL
//   ========================================================= */

//   const getUserOrBuildingLabel = (item) => {
//     if (!item) return '';

//     if (item.usageType === 'Customer') {
//       return (
//         item.customer?.username ||
//         item.customer?.name ||
//         ''
//       );
//     }

//     if (item.usageType === 'Building') {
//       return (
//         item.fromBuilding?.buildingName ||
//         item.fromBuilding?.displayName ||
//         ''
//       );
//     }

//     if (
//       item.usageType ===
//       'Building to Building'
//     ) {
//       return `${
//         item.fromBuilding?.buildingName ||
//         ''
//       } to ${
//         item.toBuilding?.buildingName ||
//         ''
//       }`;
//     }

//     if (
//       item.usageType === 'Control Room'
//     ) {
//       return (
//         item.fromControlRoom?.buildingName ||
//         item.fromControlRoom?.displayName ||
//         ''
//       );
//     }

//     return '';
//   };

//   /* =========================================================
//      TOTALS
//   ========================================================= */

//   const calculateTotals = (rows) => {
//     const totals = {
//       totalQty: 0,
//       onuCharges: 0,
//       packageAmount: 0,
//       installationCharges: 0,
//       shiftingAmount: 0,
//       wireChangeAmount: 0,
//       totalRevenue: 0,
//     };

//     rows.forEach((item) => {
//       totals.totalQty += Number(
//         item.quantity || 0
//       );

//       totals.onuCharges += Number(
//         item.onuCharges || 0
//       );

//       totals.packageAmount += Number(
//         item.packageAmount || 0
//       );

//       totals.installationCharges += Number(
//         item.installationCharges || 0
//       );

//       totals.shiftingAmount += Number(
//         item.shiftingAmount || 0
//       );

//       totals.wireChangeAmount += Number(
//         item.wireChangeAmount || 0
//       );

//       totals.totalRevenue += Number(
//         item.totalRevenue || 0
//       );
//     });

//     return totals;
//   };

//   /* =========================================================
//      SEARCH ACTIVE
//   ========================================================= */

//   const isSearchActive = () =>
//     Boolean(
//       activeSearch.centerId ||
//         activeSearch.productId ||
//         activeSearch.startDate ||
//         activeSearch.endDate ||
//         activeSearch.usageType ||
//         activeSearch.connectionType ||
//         activeSearch.customer ||
//         activeSearch.keyword ||
//         activeSearch.outlet ||
//         activeSearch.month ||
//         activeSearch.year
//     );

//   /* =========================================================
//      SORT
//   ========================================================= */

//   const handleSort = (key) => {
//     let direction = 'ascending';

//     if (
//       sortConfig.key === key &&
//       sortConfig.direction ===
//         'ascending'
//     ) {
//       direction = 'descending';
//     }

//     setSortConfig({
//       key,
//       direction,
//     });
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null;
//     }

//     return sortConfig.direction ===
//       'ascending' ? (
//       <ArrowUp size={14} />
//     ) : (
//       <ArrowDown size={14} />
//     );
//   };

//   /* =========================================================
//      FILTER + SORT
//   ========================================================= */

//   const filteredFlattenedData =
//     useMemo(() => {
//       let rows = getFlattenedData();

//       const searchValue =
//         searchTerm.trim().toLowerCase();

//       if (searchValue) {
//         rows = rows.filter((item) =>
//           valueToSearchString(item).includes(
//             searchValue
//           )
//         );
//       }

//       if (sortConfig.key) {
//         const key = sortConfig.key;

//         rows = [...rows].sort((a, b) => {
//           let aValue = getNestedValue(
//             a,
//             key
//           );

//           let bValue = getNestedValue(
//             b,
//             key
//           );

//           const numericKeys = [
//             'quantity',
//             'onuCharges',
//             'packageAmount',
//             'installationCharges',
//             'shiftingAmount',
//             'wireChangeAmount',
//             'totalRevenue',
//           ];

//           if (numericKeys.includes(key)) {
//             aValue = Number(aValue || 0);
//             bValue = Number(bValue || 0);
//           } else if (key === 'date') {
//             aValue = new Date(
//               aValue || 0
//             ).getTime();

//             bValue = new Date(
//               bValue || 0
//             ).getTime();
//           } else {
//             aValue = String(
//               aValue ?? ''
//             ).toLowerCase();

//             bValue = String(
//               bValue ?? ''
//             ).toLowerCase();
//           }

//           if (aValue < bValue) {
//             return sortConfig.direction ===
//               'ascending'
//               ? -1
//               : 1;
//           }

//           if (aValue > bValue) {
//             return sortConfig.direction ===
//               'ascending'
//               ? 1
//               : -1;
//           }

//           return 0;
//         });
//       }

//       return rows;
//     }, [
//       data,
//       activeSearch,
//       searchTerm,
//       sortConfig,
//       location.state,
//     ]);

//   const totals = useMemo(
//     () =>
//       calculateTotals(
//         filteredFlattenedData
//       ),
//     [filteredFlattenedData]
//   );

//   /* =========================================================
//      SEARCH
//   ========================================================= */

//   const handleSearch = (searchData) => {
//     const normalized =
//       normalizeSearchPayload(
//         searchData
//       );

//     const mergedSearchData = {
//       ...activeSearch,
//       ...normalized,
//     };

//     if (
//       mergedSearchData.startDate ||
//       mergedSearchData.endDate
//     ) {
//       mergedSearchData.month = '';
//       mergedSearchData.year = '';
//     }

//     setActiveSearch(
//       mergedSearchData
//     );

//     setCurrentPage(1);

//     fetchData(
//       mergedSearchData,
//       1
//     );

//     setSearchModalVisible(false);
//   };

//   /* =========================================================
//      RESET SEARCH
//   ========================================================= */

//   const handleResetSearch = () => {
//     const resetSearch = {
//       ...EMPTY_SEARCH,
//     };

//     setActiveSearch(resetSearch);
//     setSearchTerm('');

//     setSortConfig({
//       key: null,
//       direction: 'ascending',
//     });

//     setCurrentPage(1);

//     fetchData(
//       resetSearch,
//       1
//     );
//   };

//   /* =========================================================
//      ITEM DETAIL MODAL
//   ========================================================= */

//   const openItemDetailModal = (
//     item
//   ) => {
//     setSelectedItemDetail(item);
//     setItemDetailModalVisible(true);
//   };

//   const closeItemDetailModal = () => {
//     setItemDetailModalVisible(false);
//     setSelectedItemDetail(null);
//   };

//   /* =========================================================
//      EXPORT MODAL
//   ========================================================= */

//   const openExportModal = () => {
//     let startDate =
//       activeSearch.startDate || '';

//     let endDate =
//       activeSearch.endDate || '';

//     if (
//       !startDate &&
//       !endDate &&
//       activeSearch.month &&
//       activeSearch.year
//     ) {
//       const monthRange =
//         getMonthDateRange(
//           activeSearch.month,
//           activeSearch.year
//         );

//       startDate =
//         monthRange.startDate;

//       endDate =
//         monthRange.endDate;
//     }

//     setExportStartDate(
//       normalizeDateForApi(startDate)
//     );

//     setExportEndDate(
//       normalizeDateForApi(endDate)
//     );

//     setExportModalVisible(true);
//   };

//   /* =========================================================
//      FETCH ALL DATA FOR EXPORT
//   ========================================================= */

//   const fetchAllDataForExport =
//     async () => {
//       try {
//         const params =
//           new URLSearchParams();

//         if (activeSearch.centerId) {
//           params.append(
//             'centerId',
//             activeSearch.centerId
//           );
//         }

//         if (activeSearch.productId) {
//           params.append(
//             'productId',
//             activeSearch.productId
//           );
//         }

//         if (activeSearch.usageType) {
//           params.append(
//             'usageType',
//             activeSearch.usageType
//           );
//         }

//         if (
//           activeSearch.connectionType
//         ) {
//           params.append(
//             'connectionType',
//             activeSearch.connectionType
//           );
//         }

//         if (activeSearch.customer) {
//           params.append(
//             'customer',
//             activeSearch.customer
//           );
//         }

//         if (activeSearch.keyword) {
//           params.append(
//             'search',
//             activeSearch.keyword
//           );
//         }

//         if (activeSearch.outlet) {
//           params.append(
//             'outlet',
//             activeSearch.outlet
//           );
//         }

//         let startDate =
//           exportStartDate;

//         let endDate =
//           exportEndDate;

//         if (
//           !startDate &&
//           !endDate &&
//           activeSearch.month &&
//           activeSearch.year
//         ) {
//           const monthRange =
//             getMonthDateRange(
//               activeSearch.month,
//               activeSearch.year
//             );

//           startDate =
//             monthRange.startDate;

//           endDate =
//             monthRange.endDate;
//         }

//         if (startDate) {
//           params.append(
//             'startDate',
//             normalizeDateForApi(
//               startDate
//             )
//           );
//         }

//         if (endDate) {
//           params.append(
//             'endDate',
//             normalizeDateForApi(
//               endDate
//             )
//           );
//         }

//         params.append(
//           'export',
//           'true'
//         );

//         const url = params.toString()
//           ? `/reports/usages?${params.toString()}`
//           : '/reports/usages';

//         const response =
//           await axiosInstance.get(
//             url
//           );

//         if (
//           response.data.success
//         ) {
//           return (
//             response.data.data || []
//           );
//         }

//         throw new Error(
//           'API returned unsuccessful response'
//         );
//       } catch (err) {
//         console.error(
//           'Error fetching data for export:',
//           err
//         );

//         showError(
//           'Error fetching data for export'
//         );

//         return [];
//       }
//     };

//   /* =========================================================
//      GENERATE CSV
//   ========================================================= */

//   const generateDetailExport =
//     async () => {
//       try {
//         setExportLoading(true);

//         if (
//           exportStartDate &&
//           exportEndDate &&
//           normalizeDateForApi(
//             exportStartDate
//           ) >
//             normalizeDateForApi(
//               exportEndDate
//             )
//         ) {
//           showError(
//             'Start date cannot be greater than end date'
//           );

//           setExportLoading(false);
//           return;
//         }

//         const allData =
//           await fetchAllDataForExport();

//         if (
//           !allData ||
//           allData.length === 0
//         ) {
//           showError(
//             'No data available for export'
//           );

//           return;
//         }

//         let fileName =
//           'Usage_stock_report';

//         if (
//           exportStartDate &&
//           exportEndDate
//         ) {
//           fileName +=
//             `_${exportStartDate}_to_${exportEndDate}`;
//         } else if (
//           exportStartDate
//         ) {
//           fileName +=
//             `_from_${exportStartDate}`;
//         } else if (
//           exportEndDate
//         ) {
//           fileName +=
//             `_until_${exportEndDate}`;
//         }

//         const filterParts = [];

//         if (activeSearch.centerId) {
//           const centerName =
//             centers.find(
//               (center) =>
//                 getId(center._id) ===
//                 getId(
//                   activeSearch.centerId
//                 )
//             )?.centerName ||
//             'Center';

//           filterParts.push(
//             centerName.replace(
//               /\s+/g,
//               '_'
//             )
//           );
//         }

//         if (activeSearch.productId) {
//           const productName =
//             products.find(
//               (product) =>
//                 getId(product._id) ===
//                 getId(
//                   activeSearch.productId
//                 )
//             )?.productTitle ||
//             'Product';

//           filterParts.push(
//             productName.replace(
//               /\s+/g,
//               '_'
//             )
//           );
//         }

//         if (activeSearch.usageType) {
//           filterParts.push(
//             activeSearch.usageType.replace(
//               /\s+/g,
//               '_'
//             )
//           );
//         }

//         if (
//           activeSearch.connectionType
//         ) {
//           filterParts.push(
//             activeSearch.connectionType.replace(
//               /\s+/g,
//               '_'
//             )
//           );
//         }

//         if (filterParts.length > 0) {
//           fileName += `_${filterParts.join(
//             '_'
//           )}`;
//         }

//         fileName += `_${
//           new Date()
//             .toISOString()
//             .split('T')[0]
//         }.csv`;

//         const headers = [
//           'Date',
//           'Type',
//           'Center',
//           'Product',
//           'Product Type',
//           'Qty',
//           'User/Building',
//           'Address',
//           'Mobile',
//           'Package Duration',
//           'Status',
//           'ONU Chrg.',
//           'Pkt. Amt.',
//           'Inst. Chrg.',
//           'Shifting Amount',
//           'Wire Change Amount',
//           'Total Amount',
//           'Reason',
//         ];

//         const flattenedExportData =
//           [];

//         const activeProductId =
//           getId(
//             activeSearch.productId
//           );

//         const activeCenterId =
//           getId(
//             activeSearch.centerId
//           );

//         const summaryTargetQty =
//           Number(
//             location.state
//               ?.summaryTotalQuantity ||
//               0
//           );

//         const hasSummaryTarget =
//           summaryTargetQty > 0;

//         let accumulatedQty = 0;

//         allData.forEach((usage) => {
//           if (
//             hasSummaryTarget &&
//             accumulatedQty >=
//               summaryTargetQty
//           ) {
//             return;
//           }

//           // Match the selected center against both the source
//           // center and destination/target center returned by the API.
//           const usageCenterId =
//             getId(
//               usage.center?._id ||
//                 usage.center ||
//                 usage.centerId
//             );

//           const usageToCenterId =
//             getId(
//               usage.toCenter?._id ||
//                 usage.toCenter ||
//                 usage.toCenterId
//             );

//           if (
//             activeCenterId &&
//             usageCenterId !== activeCenterId &&
//             usageToCenterId !== activeCenterId
//           ) {
//             return;
//           }

//           if (
//             usage.items &&
//             Array.isArray(
//               usage.items
//             ) &&
//             usage.items.length > 0
//           ) {
//             let items =
//               usage.items;

//             if (
//               activeProductId
//             ) {
//               items =
//                 usage.items.filter(
//                   (item) => {
//                     const itemProductId =
//                       getId(
//                         item.product?._id ||
//                           item.product ||
//                           item.productId
//                       );

//                     return (
//                       itemProductId ===
//                       activeProductId
//                     );
//                   }
//                 );
//             }

//             items.forEach((item) => {
//               if (
//                 hasSummaryTarget &&
//                 accumulatedQty >=
//                   summaryTargetQty
//               ) {
//                 return;
//               }

//               let itemQty = Number(
//                 item.quantity || 0
//               );

//               if (
//                 hasSummaryTarget &&
//                 accumulatedQty +
//                   itemQty >
//                   summaryTargetQty
//               ) {
//                 itemQty =
//                   summaryTargetQty -
//                   accumulatedQty;
//               }

//               if (itemQty <= 0) {
//                 return;
//               }

//               accumulatedQty +=
//                 itemQty;

//               flattenedExportData.push(
//                 {
//                   ...usage,

//                   item: {
//                     ...item,
//                     quantity:
//                       itemQty,
//                   },

//                   product:
//                     item.product,

//                   quantity: itemQty,
//                 }
//               );
//             });
//           }
//         });

//         if (
//           flattenedExportData.length ===
//           0
//         ) {
//           showError(
//             'No data available for export'
//           );

//           return;
//         }

//         const csvData =
//           flattenedExportData.map(
//             (item) => {
//               const address =
//                 item.usageType ===
//                 'Customer'
//                   ? `${item.customer?.address1 || ''} ${
//                       item.customer?.address2 || ''
//                     }`.trim()
//                   : item.usageType ===
//                     'Building'
//                   ? `${item.fromBuilding?.address1 || ''} ${
//                       item.fromBuilding?.address2 || ''
//                     }`.trim()
//                   : item.usageType ===
//                     'Control Room'
//                   ? `${item.fromControlRoom?.address1 || ''} ${
//                       item.fromControlRoom?.address2 || ''
//                     }`.trim()
//                   : '';

//               return [
//                 formatDate(
//                   item.date || ''
//                 ),

//                 item.usageType || '',

//                 item.center
//                   ?.centerName || '',

//                 item.product
//                   ?.productTitle || '',

//                 item.product
//                   ?.productCategory
//                   ?.productCategory ||
//                   '',

//                 item.quantity || 0,

//                 getUserOrBuildingLabel(
//                   item
//                 ),

//                 address,

//                 item.customer
//                   ?.mobile || '',

//                 item.packageDuration ||
//                   '',

//                 item.status || '',

//                 item.onuCharges || 0,

//                 item.packageAmount ||
//                   0,

//                 item.installationCharges ||
//                   0,

//                 item.shiftingAmount ||
//                   0,

//                 item.wireChangeAmount ||
//                   0,

//                 item.totalRevenue ||
//                   0,

//                 item.reason ||
//                   item.remark ||
//                   '',
//               ];
//             }
//           );

//         const csvContent = [
//           headers.join(','),
//           ...csvData.map((row) =>
//             row
//               .map((field) => {
//                 const stringField =
//                   String(
//                     field ?? ''
//                   );

//                 return `"${stringField.replace(
//                   /"/g,
//                   '""'
//                 )}"`;
//               })
//               .join(',')
//           ),
//         ].join('\n');

//         const blob = new Blob(
//           ['\uFEFF' + csvContent],
//           {
//             type:
//               'text/csv;charset=utf-8;',
//           }
//         );

//         const link =
//           document.createElement(
//             'a'
//           );

//         const downloadUrl =
//           URL.createObjectURL(blob);

//         link.setAttribute(
//           'href',
//           downloadUrl
//         );

//         link.setAttribute(
//           'download',
//           fileName
//         );

//         link.style.visibility =
//           'hidden';

//         document.body.appendChild(
//           link
//         );

//         link.click();

//         document.body.removeChild(
//           link
//         );

//         URL.revokeObjectURL(
//           downloadUrl
//         );

//         showSuccess(
//           'Export completed successfully!'
//         );

//         setExportModalVisible(
//           false
//         );

//         setExportStartDate('');
//         setExportEndDate('');
//       } catch (err) {
//         console.error(
//           'Error generating export:',
//           err
//         );

//         showError(
//           'Error generating export file'
//         );
//       } finally {
//         setExportLoading(false);
//       }
//     };

//   /* =========================================================
//      LOADING
//   ========================================================= */

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
//       </div>
//     );
//   }

//   /* =========================================================
//      ERROR
//   ========================================================= */

//   if (error) {
//     return (
//       <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//         <span className="font-semibold">
//           Error loading data:
//         </span>{' '}
//         {error}
//       </div>
//     );
//   }

//   /* =========================================================
//      RENDER
//   ========================================================= */

//   return (
//     <div className="min-w-0 p-4">
//       <div className="mb-4 text-2xl font-semibold text-gray-800">
//         Usage Stock Report
//       </div>

//       {/* SEARCH MODAL */}

//       <SearchUsageDetail
//         visible={searchModalVisible}
//         onClose={() =>
//           setSearchModalVisible(false)
//         }
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//         customers={customers}
//       />

//       {/* EXPORT MODAL */}

//       {exportModalVisible && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
//           <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b px-5 py-4">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Export Usage Stock Report
//               </h2>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setExportModalVisible(
//                     false
//                   )
//                 }
//                 className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-5 p-5">
//               <div>
//                 <label
//                   htmlFor="exportStartDate"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   Start Date (Optional)
//                 </label>

//                 <input
//                   id="exportStartDate"
//                   type="date"
//                   value={
//                     exportStartDate
//                   }
//                   onChange={(e) =>
//                     setExportStartDate(
//                       e.target.value
//                     )
//                   }
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Leave empty to include
//                   all records from
//                   beginning
//                 </p>
//               </div>

//               <div>
//                 <label
//                   htmlFor="exportEndDate"
//                   className="mb-1.5 block text-sm font-medium text-gray-700"
//                 >
//                   End Date (Optional)
//                 </label>

//                 <input
//                   id="exportEndDate"
//                   type="date"
//                   value={exportEndDate}
//                   onChange={(e) =>
//                     setExportEndDate(
//                       e.target.value
//                     )
//                   }
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Leave empty to include
//                   all records until today
//                 </p>
//               </div>

//               {isSearchActive() && (
//                 <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
//                   <div className="mb-2 text-sm font-semibold text-blue-800">
//                     Current Filters
//                   </div>

//                   <ul className="space-y-1 text-xs text-blue-900">
//                     {activeSearch.centerId && (
//                       <li>
//                         <strong>
//                           Center:
//                         </strong>{' '}
//                         {centers.find(
//                           (center) =>
//                             getId(
//                               center._id
//                             ) ===
//                             getId(
//                               activeSearch.centerId
//                             )
//                         )?.centerName ||
//                           activeSearch.centerId}
//                       </li>
//                     )}

//                     {activeSearch.productId && (
//                       <li>
//                         <strong>
//                           Product:
//                         </strong>{' '}
//                         {products.find(
//                           (product) =>
//                             getId(
//                               product._id
//                             ) ===
//                             getId(
//                               activeSearch.productId
//                             )
//                         )?.productTitle ||
//                           activeSearch.productId}
//                       </li>
//                     )}

//                     {activeSearch.usageType && (
//                       <li>
//                         <strong>
//                           Usage Type:
//                         </strong>{' '}
//                         {activeSearch.usageType}
//                       </li>
//                     )}

//                     {activeSearch.connectionType && (
//                       <li>
//                         <strong>
//                           Connection Type:
//                         </strong>{' '}
//                         {
//                           activeSearch.connectionType
//                         }
//                       </li>
//                     )}

//                     {activeSearch.customer && (
//                       <li>
//                         <strong>
//                           Customer:
//                         </strong>{' '}
//                         {customers.find(
//                           (customer) =>
//                             getId(
//                               customer._id
//                             ) ===
//                             getId(
//                               activeSearch.customer
//                             )
//                         )?.username ||
//                           activeSearch.customer}
//                       </li>
//                     )}

//                     {activeSearch.month &&
//                       activeSearch.year && (
//                         <li>
//                           <strong>
//                             Period:
//                           </strong>{' '}
//                           {
//                             activeSearch.month
//                           }
//                           /
//                           {
//                             activeSearch.year
//                           }
//                         </li>
//                       )}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-4">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setExportModalVisible(
//                     false
//                   )
//                 }
//                 className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={
//                   generateDetailExport
//                 }
//                 disabled={exportLoading}
//                 className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {exportLoading ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Exporting...
//                   </>
//                 ) : (
//                   <>
//                     <FileSpreadsheet
//                       size={16}
//                     />
//                     Export
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ITEM DETAIL MODAL */}

//       {itemDetailModalVisible &&
//         selectedItemDetail && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
//             <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
//               <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   Usage Item Details
//                 </h2>

//                 <button
//                   type="button"
//                   onClick={
//                     closeItemDetailModal
//                   }
//                   className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="p-5">
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                   <DetailField
//                     label="Date"
//                     value={formatDate(
//                       selectedItemDetail.date ||
//                         ''
//                     )}
//                   />

//                   <DetailField
//                     label="Type"
//                     value={
//                       selectedItemDetail.usageType ||
//                       ''
//                     }
//                   />

//                   <DetailField
//                     label="Branch"
//                     value={
//                       selectedItemDetail
//                         .center
//                         ?.centerName || ''
//                     }
//                   />

//                   <DetailField
//                     label="Status"
//                     value={
//                       selectedItemDetail.status ||
//                       ''
//                     }
//                   />

//                   <DetailField
//                     label="User/Building"
//                     value={getUserOrBuildingLabel(
//                       selectedItemDetail
//                     )}
//                   />

//                   <DetailField
//                     label="Mobile"
//                     value={
//                       selectedItemDetail
//                         .customer
//                         ?.mobile || ''
//                     }
//                   />
//                 </div>

//                 <div className="my-5 border-t" />

//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                   <DetailField
//                     label="Product"
//                     value={
//                       selectedItemDetail
//                         .product
//                         ?.productTitle ||
//                       'N/A'
//                     }
//                   />

//                   <DetailField
//                     label="Product Type"
//                     value={
//                       selectedItemDetail
//                         .product
//                         ?.productCategory
//                         ?.productCategory ||
//                       'N/A'
//                     }
//                   />

//                   <DetailField
//                     label="Quantity"
//                     value={
//                       selectedItemDetail.quantity ||
//                       0
//                     }
//                   />

//                   <DetailField
//                     label="Old Stock"
//                     value={
//                       selectedItemDetail
//                         .item
//                         ?.oldStock ??
//                       'N/A'
//                     }
//                   />

//                   <DetailField
//                     label="New Stock"
//                     value={
//                       selectedItemDetail
//                         .item
//                         ?.newStock ??
//                       'N/A'
//                     }
//                   />
//                 </div>

//                 {selectedItemDetail.item
//                   ?.serialNumbers
//                   ?.length > 0 && (
//                   <>
//                     <div className="my-5 border-t" />

//                     <div className="text-sm font-semibold text-gray-700">
//                       Serial Numbers (
//                       {
//                         selectedItemDetail
//                           .item
//                           .serialNumbers
//                           .length
//                       }
//                       )
//                     </div>

//                     <div className="mt-3 flex flex-wrap gap-2">
//                       {selectedItemDetail.item.serialNumbers.map(
//                         (
//                           serialNumber,
//                           index
//                         ) => (
//                           <span
//                             key={index}
//                             className="rounded-md bg-gray-700 px-3 py-1.5 text-xs font-medium text-white"
//                           >
//                             {serialNumber}
//                           </span>
//                         )
//                       )}
//                     </div>
//                   </>
//                 )}

//                 <div className="my-5 border-t" />

//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                   <DetailField
//                     label="Package Duration"
//                     value={
//                       selectedItemDetail.packageDuration ||
//                       ''
//                     }
//                   />

//                   <DetailField
//                     label="ONU Charges"
//                     value={
//                       selectedItemDetail.onuCharges ||
//                       ''
//                     }
//                   />

//                   <DetailField
//                     label="Package Amount"
//                     value={
//                       selectedItemDetail.packageAmount ||
//                       ''
//                     }
//                   />

//                   <DetailField
//                     label="Installation Charges"
//                     value={
//                       selectedItemDetail.installationCharges ||
//                       ''
//                     }
//                   />

//                   <DetailField
//                     label="Shifting Amount"
//                     value={
//                       selectedItemDetail.shiftingAmount ||
//                       ''
//                     }
//                   />

//                   <DetailField
//                     label="Wire Change Amount"
//                     value={
//                       selectedItemDetail.wireChangeAmount ||
//                       ''
//                     }
//                   />

//                   <DetailField
//                     label="Total Amount"
//                     value={
//                       selectedItemDetail.totalRevenue ||
//                       ''
//                     }
//                   />

//                   <DetailField
//                     label="Reason"
//                     value={
//                       selectedItemDetail.reason ||
//                       selectedItemDetail.remark ||
//                       ''
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end border-t bg-gray-50 px-5 py-4">
//                 <button
//                   type="button"
//                   onClick={
//                     closeItemDetailModal
//                   }
//                   className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//       {/* MAIN CARD */}

//       <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         {/* HEADER */}

//         <div className="flex flex-col gap-3 border-b bg-gray-50 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-wrap gap-2">
//             <button
//               type="button"
//               onClick={() =>
//                 setSearchModalVisible(true)
//               }
//               className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
//             >
//               <Search size={16} />
//               Search
//             </button>

//             {isSearchActive() && (
//               <button
//                 type="button"
//                 onClick={
//                   handleResetSearch
//                 }
//                 className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
//               >
//                 <RotateCcw
//                   size={16}
//                 />
//                 Reset Search
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={
//                 openExportModal
//               }
//               disabled={
//                 exportLoading ||
//                 data.length === 0
//               }
//               className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Download size={16} />
//               Export
//             </button>
//           </div>

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={
//               handlePageChange
//             }
//           />
//         </div>

//         {/* SEARCH BAR */}

//         <div className="flex flex-col gap-3 border-b px-4 py-3 md:flex-row md:items-center md:justify-between">
//           <div className="text-xs text-gray-500">
//             {(exportStartDate ||
//               exportEndDate) && (
//               <>
//                 {exportStartDate &&
//                   `Export From: ${exportStartDate} `}
//                 {exportEndDate &&
//                   `To: ${exportEndDate}`}
//               </>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             <label
//               htmlFor="usageSearch"
//               className="text-sm font-medium text-gray-700"
//             >
//               Search:
//             </label>

//             <input
//               id="usageSearch"
//               type="text"
//               value={searchTerm}
//               onChange={(e) =>
//                 setSearchTerm(
//                   e.target.value
//                 )
//               }
//               className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-[350px]"
//             />
//           </div>
//         </div>

//         {/* TABLE */}

//         <div className="overflow-x-auto">
//           <table className="min-w-[1900px] w-full border-collapse text-sm">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <SortableHeader
//                   label="Date"
//                   sortKey="date"
//                   onSort={handleSort}
//                   icon={getSortIcon('date')}
//                 />

//                 <SortableHeader
//                   label="Type"
//                   sortKey="usageType"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'usageType'
//                   )}
//                 />

//                 <SortableHeader
//                   label="Branch"
//                   sortKey="center.centerName"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'center.centerName'
//                   )}
//                 />

//                 <SortableHeader
//                   label="Product"
//                   sortKey="product.productTitle"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'product.productTitle'
//                   )}
//                 />

//                 <SortableHeader
//                   label="Product Type"
//                   sortKey="product.productCategory.productCategory"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'product.productCategory.productCategory'
//                   )}
//                 />

//                 <SortableHeader
//                   label="Qty"
//                   sortKey="quantity"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'quantity'
//                   )}
//                 />

//                 <TableHeader>
//                   User/Building
//                 </TableHeader>

//                 <TableHeader>
//                   Address
//                 </TableHeader>

//                 <TableHeader>
//                   Mobile
//                 </TableHeader>

//                 <SortableHeader
//                   label="Package Duration"
//                   sortKey="packageDuration"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'packageDuration'
//                   )}
//                 />

//                 <SortableHeader
//                   label="Status"
//                   sortKey="status"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'status'
//                   )}
//                 />

//                 <SortableHeader
//                   label="ONU Chrg."
//                   sortKey="onuCharges"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'onuCharges'
//                   )}
//                 />

//                 <SortableHeader
//                   label="Pkt. Amt."
//                   sortKey="packageAmount"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'packageAmount'
//                   )}
//                 />

//                 <SortableHeader
//                   label="Inst. Chrg."
//                   sortKey="installationCharges"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'installationCharges'
//                   )}
//                 />

//                 <SortableHeader
//                   label="Shifting Amount"
//                   sortKey="shiftingAmount"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'shiftingAmount'
//                   )}
//                 />

//                 <SortableHeader
//                   label="Wire Change Amount"
//                   sortKey="wireChangeAmount"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'wireChangeAmount'
//                   )}
//                 />

//                 <SortableHeader
//                   label="Total Amount"
//                   sortKey="totalRevenue"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'totalRevenue'
//                   )}
//                 />

//                 <SortableHeader
//                   label="Reason"
//                   sortKey="reason"
//                   onSort={handleSort}
//                   icon={getSortIcon(
//                     'reason'
//                   )}
//                 />
//               </tr>
//             </thead>

//             <tbody>
//               {filteredFlattenedData.length >
//               0 ? (
//                 <>
//                   {filteredFlattenedData.map(
//                     (item) => (
//                       <tr
//                         key={
//                           item.uniqueKey
//                         }
//                         className="border-b hover:bg-gray-50"
//                       >
//                         <td className="whitespace-nowrap px-3 py-2">
//                           {formatDate(
//                             item.date ||
//                               ''
//                           )}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.usageType ||
//                             ''}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.center
//                             ?.centerName ||
//                             ''}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.product
//                             ?.productTitle ||
//                             'N/A'}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.product
//                             ?.productCategory
//                             ?.productCategory ||
//                             'N/A'}
//                         </td>

//                         <td
//                           onClick={() =>
//                             item.quantity >
//                               0 &&
//                             openItemDetailModal(
//                               item
//                             )
//                           }
//                           title={
//                             item.quantity >
//                             0
//                               ? 'Click to view usage item details'
//                               : ''
//                           }
//                           className={`px-3 py-2 ${
//                             item.quantity >
//                             0
//                               ? 'cursor-pointer font-semibold text-blue-600 hover:underline'
//                               : ''
//                           }`}
//                         >
//                           {item.quantity ||
//                             0}
//                         </td>

//                         <td className="px-3 py-2">
//                           {getUserOrBuildingLabel(
//                             item
//                           )}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.usageType ===
//                           'Customer'
//                             ? `${item.customer?.address1 || ''} ${
//                                 item.customer?.address2 || ''
//                               }`.trim()
//                             : item.usageType ===
//                               'Building'
//                             ? `${item.fromBuilding?.address1 || ''} ${
//                                 item.fromBuilding?.address2 || ''
//                               }`.trim() ||
//                               'N/A'
//                             : item.usageType ===
//                               'Control Room'
//                             ? `${item.fromControlRoom?.address1 || ''} ${
//                                 item.fromControlRoom?.address2 || ''
//                               }`.trim()
//                             : ''}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.customer
//                             ?.mobile ||
//                             ''}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.packageDuration ||
//                             ''}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.status || ''}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.onuCharges ||
//                             ''}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.packageAmount ||
//                             ''}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.installationCharges ||
//                             ''}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.shiftingAmount ||
//                             ''}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.wireChangeAmount ||
//                             ''}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.totalRevenue ||
//                             ''}
//                         </td>

//                         <td className="px-3 py-2">
//                           {item.reason ||
//                             item.remark ||
//                             ''}
//                         </td>
//                       </tr>
//                     )
//                   )}

//                   {/* TOTAL */}

//                   <tr className="bg-gray-100 font-semibold">
//                     <td
//                       colSpan={5}
//                       className="px-3 py-3 text-right"
//                     >
//                       Total
//                     </td>

//                     <td className="px-3 py-3">
//                       {totals.totalQty.toFixed(
//                         2
//                       )}
//                     </td>

//                     <td
//                       colSpan={4}
//                       className="px-3 py-3"
//                     />

//                     <td className="px-3 py-3" />

//                     <td className="px-3 py-3">
//                       {totals.onuCharges.toFixed(
//                         2
//                       )}
//                     </td>

//                     <td className="px-3 py-3">
//                       {totals.packageAmount.toFixed(
//                         2
//                       )}
//                     </td>

//                     <td className="px-3 py-3">
//                       {totals.installationCharges.toFixed(
//                         2
//                       )}
//                     </td>

//                     <td className="px-3 py-3">
//                       {totals.shiftingAmount.toFixed(
//                         2
//                       )}
//                     </td>

//                     <td className="px-3 py-3">
//                       {totals.wireChangeAmount.toFixed(
//                         2
//                       )}
//                     </td>

//                     <td className="px-3 py-3">
//                       {totals.totalRevenue.toFixed(
//                         2
//                       )}
//                     </td>

//                     <td className="px-3 py-3" />
//                   </tr>
//                 </>
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={18}
//                     className="px-4 py-10 text-center text-sm text-gray-500"
//                   >
//                     No data found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    SMALL REUSABLE COMPONENTS
// ========================================================= */

// const DetailField = ({
//   label,
//   value,
// }) => (
//   <div>
//     <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//       {label}
//     </div>

//     <div className="mt-1 min-h-5 text-sm text-gray-800">
//       {value}
//     </div>
//   </div>
// );

// const TableHeader = ({
//   children,
// }) => (
//   <th className="whitespace-nowrap border-b border-gray-200 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
//     {children}
//   </th>
// );

// const SortableHeader = ({
//   label,
//   sortKey,
//   onSort,
//   icon,
// }) => (
//   <th
//     onClick={() => onSort(sortKey)}
//     className="cursor-pointer whitespace-nowrap border-b border-gray-200 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 hover:bg-gray-200"
//   >
//     <div className="flex items-center gap-1">
//       <span>{label}</span>
//       {icon}
//     </div>
//   </th>
// );

// export default UsageDetail;





import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  FileSpreadsheet,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import Pagination from '../../utils/Pagination';
import { showError, showSuccess } from '../../utils/sweetAlerts';
import { formatDate } from '../../utils/FormatDateTime';

import SearchUsageDetail from './SearchUsageDetail';

const EMPTY_SEARCH = {
  centerId: '',
  productId: '',
  startDate: '',
  endDate: '',
  usageType: '',
  connectionType: '',
  customer: '',
  keyword: '',
  outlet: '',
  month: '',
  year: '',
};

const getId = (value) => {
  if (!value) return '';

  if (typeof value === 'object') {
    return value._id?.toString() || value.id?.toString() || '';
  }

  return value.toString();
};

const normalizeDateForApi = (dateStr) => {
  if (!dateStr) return '';

  const value = String(dateStr).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split('-');
    return `${year}-${month}-${day}`;
  }

  return value;
};

const getMonthDateRange = (month, year) => {
  if (!month || !year) return { startDate: '', endDate: '' };

  const m = Number(month);
  const y = Number(year);

  if (Number.isNaN(m) || Number.isNaN(y) || m < 1 || m > 12) {
    return { startDate: '', endDate: '' };
  }

  const mm = String(m).padStart(2, '0');
  const lastDay = new Date(y, m, 0).getDate();

  return {
    startDate: `${y}-${mm}-01`,
    endDate: `${y}-${mm}-${String(lastDay).padStart(2, '0')}`,
  };
};

const getNestedValue = (object, path) => {
  if (!object || !path) return '';

  return path.split('.').reduce((value, key) => {
    if (value === null || value === undefined) return '';
    return value[key];
  }, object);
};

const valueToSearchString = (value) => {
  if (value === null || value === undefined) return '';

  if (typeof value === 'object') {
    return Object.values(value)
      .map(valueToSearchString)
      .join(' ')
      .toLowerCase();
  }

  return String(value).toLowerCase();
};

/* -------------------- SEARCH HELPERS -------------------- */

const normalizeSearchPayload = (raw = {}) => {
  const pick = (...keys) => {
    for (const key of keys) {
      if (raw[key] !== undefined && raw[key] !== null && raw[key] !== '') {
        return raw[key];
      }
    }

    return '';
  };

  return {
    centerId: getId(pick('centerId', 'center', 'branch', 'branchId')),
    productId: getId(pick('productId', 'product')),
    startDate: pick('startDate', 'fromDate') || '',
    endDate: pick('endDate', 'toDate') || '',
    usageType: pick('usageType', 'type') || '',
    connectionType: pick('connectionType') || '',
    customer: getId(pick('customer', 'user', 'customerId', 'userId')),
    keyword: pick('keyword', 'search') || '',
    outlet: getId(pick('outlet', 'outletId')),
    month: pick('month') || '',
    year: pick('year') || '',
  };
};

/*
 * Fixed widths match the table layout.
 * Horizontal scrolling keeps every column at its intended width.
 */
const COLUMN_WIDTHS = [
  54, 86, 92, 210, 293, 74, 180, 180, 110,
  145, 100, 120, 120, 120, 150, 170, 120, 180,
];

const TABLE_WIDTH = COLUMN_WIDTHS.reduce(
  (sum, width) => sum + width,
  0
);

const UsageDetail = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');

  const [itemDetailModalVisible, setItemDetailModalVisible] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);

  const [activeSearch, setActiveSearch] = useState({ ...EMPTY_SEARCH });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();

  /* -------------------- FETCH DATA -------------------- */

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      const currentSearch =
        Object.keys(searchParams).length > 0
          ? searchParams
          : activeSearch;

      [
        ['centerId', currentSearch.centerId],
        ['productId', currentSearch.productId],
        ['usageType', currentSearch.usageType],
        ['connectionType', currentSearch.connectionType],
        ['customer', currentSearch.customer],
        ['search', currentSearch.keyword],
        ['outlet', currentSearch.outlet],
      ].forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      let startDate = currentSearch.startDate;
      let endDate = currentSearch.endDate;

      if (
        !startDate &&
        !endDate &&
        currentSearch.month &&
        currentSearch.year
      ) {
        const range = getMonthDateRange(
          currentSearch.month,
          currentSearch.year
        );

        startDate = range.startDate;
        endDate = range.endDate;
      }

      if (startDate && endDate) {
        params.append('startDate', normalizeDateForApi(startDate));
        params.append('endDate', normalizeDateForApi(endDate));
      }

      params.append('page', page);

      const query = params.toString();

      const response = await axiosInstance.get(
        query ? `/reports/usages?${query}` : '/reports/usages'
      );

      if (response.data.success) {
        setData(response.data.data || []);
        setCurrentPage(response.data.pagination?.currentPage || 1);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setError(
          response.data.message || 'API returned unsuccessful response'
        );
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data?.message ||
            err.response.data?.error ||
            `Error ${err.response.status}: ${err.response.statusText}`
        );
      } else if (err.request) {
        setError(
          'No response received from server. Please check your network connection.'
        );
      } else {
        setError(err.message || 'An error occurred while fetching data');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers');

      if (response.data.success) {
        setCenters(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching centers:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all');

      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/customers');

      if (response.data.success) {
        setCustomers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  useEffect(() => {
    fetchCenters();
    fetchProducts();
    fetchCustomers();
  }, []);

  /* -------------------- URL / SUMMARY FILTERS -------------------- */

  useEffect(() => {
    if (location.state?.productId && location.state?.centerId) {
      let startDate = location.state.startDate || '';
      let endDate = location.state.endDate || '';

      if (
        !startDate &&
        !endDate &&
        location.state.month &&
        location.state.year
      ) {
        const range = getMonthDateRange(
          location.state.month,
          location.state.year
        );

        startDate = range.startDate;
        endDate = range.endDate;
      }

      const filteredSearch = {
        ...EMPTY_SEARCH,
        productId: location.state.productId,
        centerId: location.state.centerId,
        startDate,
        endDate,
        month: location.state.month || '',
        year: location.state.year || '',
      };

      setActiveSearch(filteredSearch);
      fetchData(filteredSearch, 1);

      document.title = `Usage Details - ${
        location.state.productName || 'Product'
      } at ${location.state.centerName || 'Center'}`;

      return;
    }

    const params = new URLSearchParams(location.search);

    const productParam = params.get('productId');
    const centerParam = params.get('centerId');

    if (productParam && centerParam) {
      let startDate = params.get('startDate') || '';
      let endDate = params.get('endDate') || '';

      const month = params.get('month') || '';
      const year = params.get('year') || '';

      if (!startDate && !endDate && month && year) {
        const range = getMonthDateRange(month, year);

        startDate = range.startDate;
        endDate = range.endDate;
      }

      const filteredSearch = {
        ...EMPTY_SEARCH,
        productId: productParam,
        centerId: centerParam,
        startDate,
        endDate,
        usageType: params.get('usageType') || '',
        connectionType: params.get('connectionType') || '',
        customer: params.get('customer') || '',
        keyword: params.get('keyword') || '',
        outlet: params.get('outlet') || '',
        month,
        year,
      };

      setActiveSearch(filteredSearch);
      fetchData(filteredSearch, 1);

      const productName = params.get('productName')
        ? decodeURIComponent(params.get('productName'))
        : 'Product';

      const centerName = params.get('centerName')
        ? decodeURIComponent(params.get('centerName'))
        : 'Center';

      document.title = `Usage Details - ${productName} at ${centerName}`;

      return;
    }

    fetchData(EMPTY_SEARCH, 1);
  }, [location.state, location.search]);

  /* -------------------- PAGINATION -------------------- */

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    fetchData(activeSearch, page);
  };

  /* -------------------- FLATTEN DATA -------------------- */

  const getFlattenedData = () => {
    const flattened = [];

    const activeProductId = getId(activeSearch.productId);
    const activeCenterId = getId(activeSearch.centerId);

    const summaryTargetQty = Number(
      location.state?.summaryTotalQuantity || 0
    );

    const hasSummaryTarget = summaryTargetQty > 0;

    let accumulatedQty = 0;

    data.forEach((usage) => {
      if (hasSummaryTarget && accumulatedQty >= summaryTargetQty) return;

      const usageCenterId = getId(
        usage.center?._id || usage.center || usage.centerId
      );

      const usageToCenterId = getId(
        usage.toCenter?._id || usage.toCenter || usage.toCenterId
      );

      if (
        activeCenterId &&
        usageCenterId !== activeCenterId &&
        usageToCenterId !== activeCenterId
      ) {
        return;
      }

      if (!Array.isArray(usage.items) || usage.items.length === 0) return;

      let items = usage.items;

      if (activeProductId) {
        items = items.filter((item) => {
          const productId = getId(
            item.product?._id || item.product || item.productId
          );

          return productId === activeProductId;
        });
      }

      items.forEach((item) => {
        if (hasSummaryTarget && accumulatedQty >= summaryTargetQty) return;

        let quantity = Number(item.quantity || 0);

        if (
          hasSummaryTarget &&
          accumulatedQty + quantity > summaryTargetQty
        ) {
          quantity = summaryTargetQty - accumulatedQty;
        }

        if (quantity <= 0) return;

        accumulatedQty += quantity;

        flattened.push({
          ...usage,
          item: { ...item, quantity },
          product: item.product,
          quantity,
          uniqueKey: `${usage._id || 'usage'}_${
            item._id || getId(item.product) || `${accumulatedQty}`
          }`,
        });
      });
    });

    return flattened;
  };

  /* -------------------- LABELS / TOTALS -------------------- */

  const getUserOrBuildingLabel = (item) => {
    if (!item) return '';

    if (item.usageType === 'Customer') {
      return item.customer?.username || item.customer?.name || '';
    }

    if (item.usageType === 'Building') {
      return (
        item.fromBuilding?.buildingName ||
        item.fromBuilding?.displayName ||
        ''
      );
    }

    if (item.usageType === 'Building to Building') {
      return `${item.fromBuilding?.buildingName || ''} to ${
        item.toBuilding?.buildingName || ''
      }`;
    }

    if (item.usageType === 'Control Room') {
      return (
        item.fromControlRoom?.buildingName ||
        item.fromControlRoom?.displayName ||
        ''
      );
    }

    return '';
  };

  const calculateTotals = (rows) =>
    rows.reduce(
      (totals, item) => ({
        totalQty: totals.totalQty + Number(item.quantity || 0),
        onuCharges: totals.onuCharges + Number(item.onuCharges || 0),
        packageAmount:
          totals.packageAmount + Number(item.packageAmount || 0),
        installationCharges:
          totals.installationCharges +
          Number(item.installationCharges || 0),
        shiftingAmount:
          totals.shiftingAmount + Number(item.shiftingAmount || 0),
        wireChangeAmount:
          totals.wireChangeAmount + Number(item.wireChangeAmount || 0),
        totalRevenue:
          totals.totalRevenue + Number(item.totalRevenue || 0),
      }),
      {
        totalQty: 0,
        onuCharges: 0,
        packageAmount: 0,
        installationCharges: 0,
        shiftingAmount: 0,
        wireChangeAmount: 0,
        totalRevenue: 0,
      }
    );

  const isSearchActive = () =>
    Boolean(
      activeSearch.centerId ||
        activeSearch.productId ||
        activeSearch.startDate ||
        activeSearch.endDate ||
        activeSearch.usageType ||
        activeSearch.connectionType ||
        activeSearch.customer ||
        activeSearch.keyword ||
        activeSearch.outlet ||
        activeSearch.month ||
        activeSearch.year
    );

  /* -------------------- SORTING / LOCAL SEARCH -------------------- */

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
      <ArrowUp size={13} />
    ) : (
      <ArrowDown size={13} />
    );
  };

  const filteredFlattenedData = useMemo(() => {
    let rows = getFlattenedData();

    const searchValue = searchTerm.trim().toLowerCase();

    if (searchValue) {
      rows = rows.filter((item) =>
        valueToSearchString(item).includes(searchValue)
      );
    }

    if (sortConfig.key) {
      const key = sortConfig.key;

      const numericKeys = [
        'quantity',
        'onuCharges',
        'packageAmount',
        'installationCharges',
        'shiftingAmount',
        'wireChangeAmount',
        'totalRevenue',
      ];

      rows = [...rows].sort((a, b) => {
        let aValue = getNestedValue(a, key);
        let bValue = getNestedValue(b, key);

        if (numericKeys.includes(key)) {
          aValue = Number(aValue || 0);
          bValue = Number(bValue || 0);
        } else if (key === 'date') {
          aValue = new Date(aValue || 0).getTime();
          bValue = new Date(bValue || 0).getTime();
        } else {
          aValue = String(aValue ?? '').toLowerCase();
          bValue = String(bValue ?? '').toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }

        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }

        return 0;
      });
    }

    return rows;
  }, [data, activeSearch, searchTerm, sortConfig, location.state]);

  const totals = useMemo(
    () => calculateTotals(filteredFlattenedData),
    [filteredFlattenedData]
  );

  const handleSearch = (searchData) => {
    const normalized = normalizeSearchPayload(searchData);
    const merged = { ...activeSearch, ...normalized };

    if (merged.startDate || merged.endDate) {
      merged.month = '';
      merged.year = '';
    }

    setActiveSearch(merged);
    setCurrentPage(1);

    fetchData(merged, 1);

    setSearchModalVisible(false);
  };

  const handleResetSearch = () => {
    const reset = { ...EMPTY_SEARCH };

    setActiveSearch(reset);
    setSearchTerm('');
    setSortConfig({ key: null, direction: 'ascending' });
    setCurrentPage(1);

    fetchData(reset, 1);
  };

  /* -------------------- ITEM DETAIL MODAL -------------------- */

  const openItemDetailModal = (item) => {
    setSelectedItemDetail(item);
    setItemDetailModalVisible(true);
  };

  const closeItemDetailModal = () => {
    setItemDetailModalVisible(false);
    setSelectedItemDetail(null);
  };

  /* -------------------- EXPORT MODAL -------------------- */

  const openExportModal = () => {
    let startDate = activeSearch.startDate || '';
    let endDate = activeSearch.endDate || '';

    if (
      !startDate &&
      !endDate &&
      activeSearch.month &&
      activeSearch.year
    ) {
      const range = getMonthDateRange(
        activeSearch.month,
        activeSearch.year
      );

      startDate = range.startDate;
      endDate = range.endDate;
    }

    setExportStartDate(normalizeDateForApi(startDate));
    setExportEndDate(normalizeDateForApi(endDate));
    setExportModalVisible(true);
  };

  const fetchAllDataForExport = async () => {
    try {
      const params = new URLSearchParams();

      [
        ['centerId', activeSearch.centerId],
        ['productId', activeSearch.productId],
        ['usageType', activeSearch.usageType],
        ['connectionType', activeSearch.connectionType],
        ['customer', activeSearch.customer],
        ['search', activeSearch.keyword],
        ['outlet', activeSearch.outlet],
      ].forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      let startDate = exportStartDate;
      let endDate = exportEndDate;

      if (
        !startDate &&
        !endDate &&
        activeSearch.month &&
        activeSearch.year
      ) {
        const range = getMonthDateRange(
          activeSearch.month,
          activeSearch.year
        );

        startDate = range.startDate;
        endDate = range.endDate;
      }

      if (startDate) {
        params.append('startDate', normalizeDateForApi(startDate));
      }

      if (endDate) {
        params.append('endDate', normalizeDateForApi(endDate));
      }

      params.append('export', 'true');

      const query = params.toString();

      const response = await axiosInstance.get(
        query ? `/reports/usages?${query}` : '/reports/usages'
      );

      if (response.data.success) {
        return response.data.data || [];
      }

      throw new Error('API returned unsuccessful response');
    } catch (err) {
      console.error('Error fetching data for export:', err);
      showError('Error fetching data for export');

      return [];
    }
  };

  const generateDetailExport = async () => {
    try {
      setExportLoading(true);

      if (
        exportStartDate &&
        exportEndDate &&
        normalizeDateForApi(exportStartDate) >
          normalizeDateForApi(exportEndDate)
      ) {
        showError('Start date cannot be greater than end date');
        return;
      }

      const allData = await fetchAllDataForExport();

      if (!allData || allData.length === 0) {
        showError('No data available for export');
        return;
      }

      let fileName = 'Usage_stock_report';

      if (exportStartDate && exportEndDate) {
        fileName += `_${exportStartDate}_to_${exportEndDate}`;
      } else if (exportStartDate) {
        fileName += `_from_${exportStartDate}`;
      } else if (exportEndDate) {
        fileName += `_until_${exportEndDate}`;
      }

      const filterParts = [];

      if (activeSearch.centerId) {
        const name =
          centers.find(
            (center) =>
              getId(center._id) === getId(activeSearch.centerId)
          )?.centerName || 'Center';

        filterParts.push(name.replace(/\s+/g, '_'));
      }

      if (activeSearch.productId) {
        const name =
          products.find(
            (product) =>
              getId(product._id) === getId(activeSearch.productId)
          )?.productTitle || 'Product';

        filterParts.push(name.replace(/\s+/g, '_'));
      }

      if (activeSearch.usageType) {
        filterParts.push(activeSearch.usageType.replace(/\s+/g, '_'));
      }

      if (activeSearch.connectionType) {
        filterParts.push(
          activeSearch.connectionType.replace(/\s+/g, '_')
        );
      }

      if (filterParts.length) {
        fileName += `_${filterParts.join('_')}`;
      }

      fileName += `_${new Date().toISOString().split('T')[0]}.csv`;

      const csvHeaders = [
        'Date',
        'Type',
        'Center',
        'Product',
        'Product Type',
        'Qty',
        'User/Building',
        'Address',
        'Mobile',
        'Package Duration',
        'Status',
        'ONU Chrg.',
        'Pkt. Amt.',
        'Inst. Chrg.',
        'Shifting Amount',
        'Wire Change Amount',
        'Total Amount',
        'Reason',
      ];

      const flattened = [];

      const activeProductId = getId(activeSearch.productId);
      const activeCenterId = getId(activeSearch.centerId);

      const summaryTargetQty = Number(
        location.state?.summaryTotalQuantity || 0
      );

      const hasSummaryTarget = summaryTargetQty > 0;

      let accumulatedQty = 0;

      allData.forEach((usage) => {
        if (hasSummaryTarget && accumulatedQty >= summaryTargetQty) return;

        const sourceCenter = getId(
          usage.center?._id || usage.center || usage.centerId
        );

        const targetCenter = getId(
          usage.toCenter?._id || usage.toCenter || usage.toCenterId
        );

        if (
          activeCenterId &&
          sourceCenter !== activeCenterId &&
          targetCenter !== activeCenterId
        ) {
          return;
        }

        if (!Array.isArray(usage.items) || !usage.items.length) return;

        let items = usage.items;

        if (activeProductId) {
          items = items.filter((item) => {
            const productId = getId(
              item.product?._id || item.product || item.productId
            );

            return productId === activeProductId;
          });
        }

        items.forEach((item) => {
          if (hasSummaryTarget && accumulatedQty >= summaryTargetQty) return;

          let quantity = Number(item.quantity || 0);

          if (
            hasSummaryTarget &&
            accumulatedQty + quantity > summaryTargetQty
          ) {
            quantity = summaryTargetQty - accumulatedQty;
          }

          if (quantity <= 0) return;

          accumulatedQty += quantity;

          flattened.push({
            ...usage,
            item: { ...item, quantity },
            product: item.product,
            quantity,
          });
        });
      });

      if (!flattened.length) {
        showError('No data available for export');
        return;
      }

      const csvRows = flattened.map((item) => {
        let address = '';

        if (item.usageType === 'Customer') {
          address = `${item.customer?.address1 || ''} ${
            item.customer?.address2 || ''
          }`.trim();
        } else if (item.usageType === 'Building') {
          address = `${item.fromBuilding?.address1 || ''} ${
            item.fromBuilding?.address2 || ''
          }`.trim();
        } else if (item.usageType === 'Control Room') {
          address = `${item.fromControlRoom?.address1 || ''} ${
            item.fromControlRoom?.address2 || ''
          }`.trim();
        }

        return [
          formatDate(item.date || ''),
          item.usageType || '',
          item.center?.centerName || '',
          item.product?.productTitle || '',
          item.product?.productCategory?.productCategory || '',
          item.quantity || 0,
          getUserOrBuildingLabel(item),
          address,
          item.customer?.mobile || '',
          item.packageDuration || '',
          item.status || '',
          item.onuCharges || 0,
          item.packageAmount || 0,
          item.installationCharges || 0,
          item.shiftingAmount || 0,
          item.wireChangeAmount || 0,
          item.totalRevenue || 0,
          item.reason || item.remark || '',
        ];
      });

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map((row) =>
          row
            .map(
              (field) =>
                `"${String(field ?? '').replace(/"/g, '""')}"`
            )
            .join(',')
        ),
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = fileName;
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);

      showSuccess('Export completed successfully!');

      setExportModalVisible(false);
      setExportStartDate('');
      setExportEndDate('');
    } catch (err) {
      console.error('Error generating export:', err);
      showError('Error generating export file');
    } finally {
      setExportLoading(false);
    }
  };

  /* -------------------- LOADING / ERROR -------------------- */

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <span className="font-semibold">Error loading data:</span> {error}
      </div>
    );
  }

  /* -------------------- EXPORT FILTER SUMMARY -------------------- */

  const exportFilterRows = [
    activeSearch.centerId && {
      label: 'Center',
      value:
        centers.find(
          (center) =>
            getId(center._id) === getId(activeSearch.centerId)
        )?.centerName || activeSearch.centerId,
    },
    activeSearch.productId && {
      label: 'Product',
      value:
        products.find(
          (product) =>
            getId(product._id) === getId(activeSearch.productId)
        )?.productTitle || activeSearch.productId,
    },
    activeSearch.usageType && {
      label: 'Usage Type',
      value: activeSearch.usageType,
    },
    activeSearch.connectionType && {
      label: 'Connection Type',
      value: activeSearch.connectionType,
    },
    activeSearch.customer && {
      label: 'Customer',
      value:
        customers.find(
          (customer) =>
            getId(customer._id) === getId(activeSearch.customer)
        )?.username || activeSearch.customer,
    },
    activeSearch.month &&
      activeSearch.year && {
        label: 'Period',
        value: `${activeSearch.month}/${activeSearch.year}`,
      },
  ].filter(Boolean);

  /* -------------------- TABLE HEADERS -------------------- */

  const headers = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Type', key: 'usageType', sortable: true },
    { label: 'Branch', key: 'center.centerName', sortable: true },
    { label: 'Product', key: 'product.productTitle', sortable: true },
    {
      label: 'Product Type',
      key: 'product.productCategory.productCategory',
      sortable: true,
    },
    { label: 'Qty', key: 'quantity', sortable: true },
    { label: 'User/Building', key: null },
    { label: 'Address', key: null },
    { label: 'Mobile', key: null },
    { label: 'Package Duration', key: 'packageDuration', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
    { label: 'ONU Chrg.', key: 'onuCharges', sortable: true },
    { label: 'Pkt. Amt.', key: 'packageAmount', sortable: true },
    {
      label: 'Inst. Chrg.',
      key: 'installationCharges',
      sortable: true,
    },
    {
      label: 'Shifting Amount',
      key: 'shiftingAmount',
      sortable: true,
    },
    {
      label: 'Wire Change Amount',
      key: 'wireChangeAmount',
      sortable: true,
    },
    { label: 'Total Amount', key: 'totalRevenue', sortable: true },
    { label: 'Reason', key: 'reason', sortable: true },
  ];

  /* -------------------- ADDRESS / CELL FORMATTING -------------------- */

  const getAddress = (item) => {
    if (item.usageType === 'Customer') {
      return `${item.customer?.address1 || ''} ${
        item.customer?.address2 || ''
      }`.trim();
    }

    if (item.usageType === 'Building') {
      return (
        `${item.fromBuilding?.address1 || ''} ${
          item.fromBuilding?.address2 || ''
        }`.trim() || 'N/A'
      );
    }

    if (item.usageType === 'Control Room') {
      return `${item.fromControlRoom?.address1 || ''} ${
        item.fromControlRoom?.address2 || ''
      }`.trim();
    }

    return '';
  };

  const formatCell = (item, index) => {
    const values = [
      formatDate(item.date || ''),
      item.usageType || '',
      item.center?.centerName || '',
      item.product?.productTitle || 'N/A',
      item.product?.productCategory?.productCategory || 'N/A',
      item.quantity || 0,
      getUserOrBuildingLabel(item),
      getAddress(item),
      item.customer?.mobile || '',
      item.packageDuration || '',
      item.status || '',
      item.onuCharges || '',
      item.packageAmount || '',
      item.installationCharges || '',
      item.shiftingAmount || '',
      item.wireChangeAmount || '',
      item.totalRevenue || '',
      item.reason || item.remark || '',
    ];

    return values[index];
  };

  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      <div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">
        Usage Stock Report
      </div>

      <SearchUsageDetail
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        customers={customers}
      />

      {/* ==================== EXPORT MODAL ==================== */}
      {exportModalVisible && (
        <div
          className="usage-export-overlay fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setExportModalVisible(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="usage-export-title"
            className="usage-export-modal w-full max-w-[500px] animate-[usageModalDrop_0.22s_ease-out] overflow-hidden rounded-[6px] bg-white shadow-2xl"
          >
            <div className="flex min-h-[62px] items-center justify-between border-b border-[#d9dfe7] px-4">
              <h2
                id="usage-export-title"
                className="text-[20px] font-normal text-[#343a40]"
              >
                Export Usage Stock Report
              </h2>

              <button
                type="button"
                aria-label="Close export modal"
                onClick={() => setExportModalVisible(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded text-[#858585] transition-colors hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={22} strokeWidth={1.8} />
              </button>
            </div>

            <div className="space-y-[18px] px-4 py-[17px]">
              <div>
                <label
                  htmlFor="exportStartDate"
                  className="mb-2 block text-[14px] font-semibold text-[#343a40]"
                >
                  Start Date (Optional)
                </label>

                <input
                  id="exportStartDate"
                  type="date"
                  value={exportStartDate}
                  onChange={(event) =>
                    setExportStartDate(event.target.value)
                  }
                  className="usage-export-date-input block h-[38px] w-full rounded-[5px] border border-[#d6dce5] bg-white px-3 text-[14px] text-[#343a40] outline-none transition-colors focus:border-[#7465e8] focus:ring-1 focus:ring-[#7465e8]/20"
                />

                <p className="mt-[3px] text-[14px] leading-[18px] text-[#747b83]">
                  Leave empty to include all records from beginning
                </p>
              </div>

              <div>
                <label
                  htmlFor="exportEndDate"
                  className="mb-2 block text-[14px] font-semibold text-[#343a40]"
                >
                  End Date (Optional)
                </label>

                <input
                  id="exportEndDate"
                  type="date"
                  value={exportEndDate}
                  onChange={(event) =>
                    setExportEndDate(event.target.value)
                  }
                  className="usage-export-date-input block h-[38px] w-full rounded-[5px] border border-[#d6dce5] bg-white px-3 text-[14px] text-[#343a40] outline-none transition-colors focus:border-[#7465e8] focus:ring-1 focus:ring-[#7465e8]/20"
                />

                <p className="mt-[3px] text-[14px] leading-[18px] text-[#747b83]">
                  Leave empty to include all records until today
                </p>
              </div>

              {isSearchActive() && (
                <div className="rounded border border-blue-100 bg-blue-50 p-3">
                  <div className="mb-2 text-sm font-semibold text-blue-800">
                    Current Filters
                  </div>

                  <ul className="space-y-1 text-xs text-blue-900">
                    {exportFilterRows.map((filter) => (
                      <li key={filter.label}>
                        <strong>{filter.label}:</strong> {filter.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex min-h-[70px] items-center justify-end gap-2 border-t border-[#e1e4e8] bg-white px-4 py-3">
              <button
                type="button"
                onClick={() => setExportModalVisible(false)}
                className="inline-flex h-[39px] items-center justify-center rounded-[6px] bg-[#6c7a89] px-[14px] text-[14px] font-medium text-white transition-colors hover:bg-[#596775] focus:outline-none focus:ring-2 focus:ring-[#6c7a89]/30"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={generateDetailExport}
                disabled={exportLoading}
                className="inline-flex h-[39px] items-center justify-center gap-2 rounded-[6px] bg-[#5b4bdf] px-[14px] text-[14px] font-medium text-white transition-colors hover:bg-[#4939ce] focus:outline-none focus:ring-2 focus:ring-[#5b4bdf]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exportLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={15} />
                    Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ITEM DETAIL MODAL ==================== */}
      {itemDetailModalVisible && selectedItemDetail && (
        <div
          className="usage-detail-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeItemDetailModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="usage-detail-title"
            className="usage-detail-modal flex max-h-[90vh] w-full max-w-[800px] flex-col overflow-hidden rounded-[6px] bg-white shadow-2xl"
          >
            {/* Modal header */}
            <div className="flex min-h-[62px] shrink-0 items-center justify-between border-b border-[#d9dfe7] px-4">
              <h2
                id="usage-detail-title"
                className="text-[20px] font-normal text-[#343a40]"
              >
                Usage Item Details
              </h2>

              <button
                type="button"
                aria-label="Close usage item details"
                onClick={closeItemDetailModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded text-[#858585] transition-colors hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={22} strokeWidth={1.8} />
              </button>
            </div>

            {/* Modal body */}
            <div className="usage-detail-body overflow-y-auto px-4 py-[15px]">
              {/* Date / Type / Branch / Status / User / Mobile */}
              <div className="grid grid-cols-1 gap-x-8 gap-y-[9px] md:grid-cols-2">
                <DetailField
                  label="Date:"
                  value={formatDate(selectedItemDetail.date || '')}
                />

                <DetailField
                  label="Type:"
                  value={selectedItemDetail.usageType || ''}
                />

                <DetailField
                  label="Branch:"
                  value={selectedItemDetail.center?.centerName || ''}
                />

                <DetailField
                  label="Status:"
                  value={selectedItemDetail.status || ''}
                />

                <DetailField
                  label="User/Building:"
                  value={getUserOrBuildingLabel(selectedItemDetail)}
                />

                <DetailField
                  label="Mobile:"
                  value={selectedItemDetail.customer?.mobile || ''}
                />
              </div>

              <div className="my-[22px] border-t border-[#cfd4da]" />

              {/* Product / Product Type */}
              <div className="grid grid-cols-1 gap-x-8 gap-y-[9px] md:grid-cols-2">
                <DetailField
                  label="Product:"
                  value={selectedItemDetail.product?.productTitle || 'N/A'}
                />

                <DetailField
                  label="Product Type:"
                  value={
                    selectedItemDetail.product?.productCategory
                      ?.productCategory || 'N/A'
                  }
                />
              </div>

              {/* Quantity / Old Stock / New Stock */}
              <div className="mt-[9px] grid grid-cols-1 gap-x-8 gap-y-[9px] md:grid-cols-3">
                <DetailField
                  label="Quantity:"
                  value={selectedItemDetail.quantity ?? 0}
                />

                <DetailField
                  label="Old Stock:"
                  value={selectedItemDetail.item?.oldStock ?? 'N/A'}
                />

                <DetailField
                  label="New Stock:"
                  value={selectedItemDetail.item?.newStock ?? 'N/A'}
                />
              </div>

              {selectedItemDetail.item?.serialNumbers?.length > 0 && (
                <div className="mt-4">
                  <DetailField
                    label="Serial Numbers:"
                    value={selectedItemDetail.item.serialNumbers.join(', ')}
                  />
                </div>
              )}

              <div className="my-[22px] border-t border-[#cfd4da]" />

              {/* Charges / amounts */}
              <div className="grid grid-cols-1 gap-x-8 gap-y-[9px] md:grid-cols-2">
                <DetailField
                  label="Package Duration:"
                  value={selectedItemDetail.packageDuration || ''}
                />

                <DetailField
                  label="ONU Charges:"
                  value={selectedItemDetail.onuCharges ?? ''}
                />

                <DetailField
                  label="Package Amount:"
                  value={selectedItemDetail.packageAmount ?? ''}
                />

                <DetailField
                  label="Installation Charges:"
                  value={selectedItemDetail.installationCharges ?? ''}
                />

                <DetailField
                  label="Shifting Amount:"
                  value={selectedItemDetail.shiftingAmount ?? ''}
                />

                <DetailField
                  label="Wire Change Amount:"
                  value={selectedItemDetail.wireChangeAmount ?? ''}
                />

                <DetailField
                  label="Total Amount:"
                  value={selectedItemDetail.totalRevenue ?? ''}
                />

                <DetailField
                  label="Reason:"
                  value={
                    selectedItemDetail.reason ||
                    selectedItemDetail.remark ||
                    ''
                  }
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex min-h-[70px] shrink-0 items-center justify-end border-t border-[#d9dfe7] bg-white px-4 py-3">
              <button
                type="button"
                onClick={closeItemDetailModal}
                className="inline-flex h-[39px] items-center justify-center rounded-[6px] bg-[#6c7a89] px-[14px] text-[14px] font-medium text-white transition-colors hover:bg-[#596775] focus:outline-none focus:ring-2 focus:ring-[#6c7a89]/30"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MAIN TABLE CARD ==================== */}
      <div className="mt-4 overflow-hidden rounded-sm border-0 border-t-4 border-t-[#2f5fa7] bg-white shadow-sm">
        {/* SEARCH / EXPORT BUTTONS + PAGINATION */}
        <div className="flex min-h-[64px] flex-col justify-between gap-3 border-b border-[#d9dfe7] px-4 py-2 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchModalVisible(true)}
              className="inline-flex h-[33px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#254d88]"
            >
              <Search size={15} />
              Search
            </button>

            {isSearchActive() && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="inline-flex h-[33px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#254d88]"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={openExportModal}
              disabled={exportLoading || data.length === 0}
              className="inline-flex h-[33px] items-center gap-1 rounded-[4px] bg-[#2f5fa7] px-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#254d88] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileSpreadsheet size={15} />
              Export
            </button>
          </div>

          <div className="usage-pagination flex shrink-0 justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* LOCAL TABLE SEARCH */}
        <div className="flex flex-col justify-end gap-2 px-4 py-3 md:flex-row md:items-center">
          <label
            htmlFor="usageSearch"
            className="text-[14px] font-semibold text-[#333]"
          >
            Search:
          </label>

          <input
            id="usageSearch"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-[31px] w-full border border-[#d6dce5] bg-white px-2 text-[14px] outline-none focus:border-[#2f5fa7] md:w-[220px]"
          />
        </div>

        {/* TABLE — FIXED COLUMN WIDTHS + VERTICAL/HORIZONTAL SCROLL */}
        <div
          className="usage-table-scroll mx-4 mb-4 mt-0 w-[calc(100%-32px)] overflow-auto"
          style={{
            height: '500px',
            maxHeight: '500px',
            scrollbarGutter: 'stable',
          }}
        >
          <table
            className="border-collapse text-left text-[16px] text-black"
            style={{
              width: `${TABLE_WIDTH}px`,
              minWidth: `${TABLE_WIDTH}px`,
              tableLayout: 'fixed',
            }}
          >
            <colgroup>
              {COLUMN_WIDTHS.map((width, index) => (
                <col
                  key={index}
                  style={{ width: `${width}px` }}
                />
              ))}
            </colgroup>

            <thead>
              <tr className="bg-white">
                {headers.map((header) => (
                  <th
                    key={header.label}
                    onClick={
                      header.sortable
                        ? () => handleSort(header.key)
                        : undefined
                    }
                    className={`usage-table-heading h-[88px] border border-[#eeeeee] px-2 pb-2 text-left align-bottom font-semibold ${
                      header.sortable
                        ? 'cursor-pointer hover:bg-gray-50'
                        : ''
                    }`}
                    style={{ verticalAlign: 'bottom' }}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <span>{header.label}</span>
                      {header.sortable && getSortIcon(header.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredFlattenedData.length > 0 ? (
                <>
                  {filteredFlattenedData.map((item, rowIndex) => (
                    <tr
                      key={item.uniqueKey}
                      className={
                        rowIndex % 2 === 0
                          ? 'bg-[#eeeeee] hover:bg-[#e5e7eb]'
                          : 'bg-white hover:bg-[#f5f6f7]'
                      }
                    >
                      {headers.map((header, columnIndex) => (
                        <td
                          key={header.label}
                          onClick={
                            columnIndex === 5
                              ? () =>
                                  item.quantity > 0 &&
                                  openItemDetailModal(item)
                              : undefined
                          }
                          title={
                            columnIndex === 5 && item.quantity > 0
                              ? 'Click to view usage item details'
                              : undefined
                          }
                          className={`border border-[#eeeeee] px-2 py-2 align-top ${
                            columnIndex === 5 && item.quantity > 0
                              ? 'cursor-pointer font-medium text-[#2878c8] hover:underline'
                              : ''
                          }`}
                        >
                          <div className="break-words">
                            {formatCell(item, columnIndex)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* TOTAL ROW */}
                  <tr className="bg-[#d6e8d0] font-normal text-black">
                    <td
                      colSpan={5}
                      className="border border-[#eeeeee] px-2 py-2"
                    >
                      Total
                    </td>

                    <td className="border border-[#eeeeee] px-2 py-2">
                      {totals.totalQty.toFixed(2)}
                    </td>

                    <td
                      colSpan={4}
                      className="border border-[#eeeeee] px-2 py-2"
                    />

                    <td className="border border-[#eeeeee] px-2 py-2" />

                    <td className="border border-[#eeeeee] px-2 py-2">
                      {totals.onuCharges.toFixed(2)}
                    </td>

                    <td className="border border-[#eeeeee] px-2 py-2">
                      {totals.packageAmount.toFixed(2)}
                    </td>

                    <td className="border border-[#eeeeee] px-2 py-2">
                      {totals.installationCharges.toFixed(2)}
                    </td>

                    <td className="border border-[#eeeeee] px-2 py-2">
                      {totals.shiftingAmount.toFixed(2)}
                    </td>

                    <td className="border border-[#eeeeee] px-2 py-2">
                      {totals.wireChangeAmount.toFixed(2)}
                    </td>

                    <td className="border border-[#eeeeee] px-2 py-2">
                      {totals.totalRevenue.toFixed(2)}
                    </td>

                    <td className="border border-[#eeeeee] px-2 py-2" />
                  </tr>
                </>
              ) : (
                <tr>
                  <td
                    colSpan={18}
                    className="border border-[#eeeeee] px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== UI STYLES ==================== */}
      <style>{`
        /* Scrollbars */
        .usage-table-scroll {
          scrollbar-width: auto;
          scrollbar-color: #888 #f1f1f1;
        }

        .usage-table-scroll::-webkit-scrollbar {
          width: 13px;
          height: 13px;
        }

        .usage-table-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .usage-table-scroll::-webkit-scrollbar-thumb {
          background: #888;
          border: 2px solid #f1f1f1;
          border-radius: 7px;
        }

        .usage-table-scroll::-webkit-scrollbar-thumb:hover {
          background: #666;
        }

        /* Sticky table header while vertically scrolling */
        .usage-table-heading {
          position: sticky;
          top: 0;
          z-index: 5;
          background: #ffffff;
        }

        /* Usage item details modal */
        .usage-detail-modal {
          animation: usageModalDrop 0.22s ease-out;
        }

        .usage-detail-body {
          scrollbar-width: thin;
          scrollbar-color: #999 #f1f1f1;
        }

        .usage-detail-body::-webkit-scrollbar {
          width: 10px;
        }

        .usage-detail-body::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .usage-detail-body::-webkit-scrollbar-thumb {
          background: #999;
          border-radius: 6px;
          border: 2px solid #f1f1f1;
        }

        /* Export modal drop animation */
        @keyframes usageModalDrop {
          from {
            opacity: 0;
            transform: translateY(-22px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Pagination buttons */
        .usage-pagination {
          min-width: 0;
          overflow-x: auto;
        }

        .usage-pagination > div {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
        }

        .usage-pagination button {
          min-width: 32px;
          height: 32px;
          padding: 0 10px;
          border: 1px solid #d6dce5 !important;
          border-radius: 0 !important;
          margin-left: -1px;
          background: #ffffff;
          color: #5146d8;
          font-size: 13px;
          line-height: 1;
          box-shadow: none !important;
          white-space: nowrap;
        }

        .usage-pagination button:first-child {
          border-top-left-radius: 4px !important;
          border-bottom-left-radius: 4px !important;
          margin-left: 0;
        }

        .usage-pagination button:last-child {
          border-top-right-radius: 4px !important;
          border-bottom-right-radius: 4px !important;
        }

        .usage-pagination button:hover:not(:disabled) {
          background: #f1f2f6;
        }

        .usage-pagination button:disabled {
          background: #e9ecef;
          color: #68717d;
          cursor: not-allowed;
          opacity: 1;
        }

        /* Active page styling */
        .usage-pagination button[aria-current="page"],
        .usage-pagination button[aria-current="true"],
        .usage-pagination button.active,
        .usage-pagination button[class~="active"],
        .usage-pagination button[class*="bg-indigo"],
        .usage-pagination button[class*="bg-purple"] {
          position: relative;
          z-index: 1;
          border-color: #5b4bdf !important;
          background: #5b4bdf !important;
          color: #ffffff !important;
        }

        /* Export dialog sizing */
        .usage-export-modal {
          max-height: calc(100vh - 32px);
          overflow-y: auto;
        }

        .usage-export-date-input {
          color-scheme: light;
        }

        @media (max-width: 640px) {
          .usage-detail-overlay {
            align-items: flex-start;
            overflow-y: auto;
          }

          .usage-detail-modal {
            max-height: calc(100vh - 32px);
            margin-top: 0;
          }

          .usage-detail-body {
            overflow-y: auto;
          }

          .usage-export-modal {
            max-width: 100%;
          }

          .usage-pagination {
            width: 100%;
            justify-content: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .usage-detail-modal,
          .usage-export-modal {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

/* -------------------- REUSABLE COMPONENTS -------------------- */

const DetailField = ({ label, value }) => (
  <div className="flex min-w-0 items-baseline gap-1 text-[16px] leading-[23px] text-[#343a40]">
    <span className="shrink-0 font-semibold">{label}</span>
    <span className="min-w-0 break-words font-normal">
      {value === null || value === undefined ? '' : value}
    </span>
  </div>
);

export default UsageDetail;